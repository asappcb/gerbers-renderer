// src/parse/gerber-parser.ts

import type { Vec2 } from "../types/pcb-model";
import type { LayerRole } from "../io/file-classifier";

/**
 * Primitive types used by the geometry pipeline. These are what
 * polygonizer.ts consumes.
 */

export type Polarity = "dark" | "clear";

export type Op =
  | { kind: "track"; polarity: Polarity; start: Vec2; end: Vec2; widthMm: number }
  | { kind: "flash"; polarity: Polarity; position: Vec2; diameterMm: number; shape: string; widthMm?: number; heightMm?: number; cornerMm?: number }
  | { kind: "region"; polarity: Polarity; loops: Vec2[][] };

export interface GerberPrimitiveTrack {
  start: Vec2;
  end: Vec2;
  width: number; // in mm
  polarity: Polarity;
}

export interface GerberPrimitiveArc {
  start: Vec2;
  end: Vec2;
  center: Vec2;
  clockwise: boolean;
  width: number;
}

export interface GerberPrimitiveFlash {
  position: Vec2;
  diameterMm: number; // actual aperture diameter in mm
  shape: string;         // "C" | "R" | "O" | ...
  widthMm?: number;      // for R / O
  heightMm?: number;     // for R / O
  cornerMm?: number;     // for R / O
  polarity: Polarity;
}

const DEFAULT_FLASH_DIAM_MM = 0.8; // fallback if aperture has no size

export interface GerberPrimitiveRegion {
  loops: Vec2[][];       // multiple loops (boundary + holes)
  polarity: Polarity;
}

export interface GerberPrimitives {
  tracks: GerberPrimitiveTrack[];
  arcs: GerberPrimitiveArc[];
  flashes: GerberPrimitiveFlash[];
  regions: GerberPrimitiveRegion[];
  ops: Op[]; // ordered operations for mask rendering
}

/**
 * Represents a Gerber aperture definition.
 * 
 * For rendering purposes, we convert all aperture shapes to an "effective diameter"
 * to simplify the rendering pipeline while maintaining correct visual proportions.
 */
interface Aperture {
  code: number;
  shape: string;         // C, R, O, P, macro, etc.
  diameterMm?: number;   // effective diameter
  widthMm?: number;      // for R / O
  heightMm?: number;     // for R / O
  cornerMm?: number;     // NEW
  macroName?: string;     // NEW (optional, if you want)
}

export interface GerberPrimitiveFlash {
  position: Vec2;
  diameterMm: number;    // keep for circular and general “size”
  shape: string;         // "C" | "R" | "O" | ...
  widthMm?: number;      // for R / O
  heightMm?: number;     // for R / O
}

/**
 * Internal parser state
 */
interface ParserState {
  unitScale: number;   // file units -> mm (1 for mm, 25.4 for inch)
  fmtInt: number;      // FS int digits
  fmtDec: number;      // FS dec digits

  x: number;           // current X in mm
  y: number;           // current Y in mm

  apertures: Map<number, Aperture>;
  currentAperture: Aperture | null;

  // Region handling
  inRegion: boolean;
  regionPaths: Vec2[][]; // all contours in current region
  currentPath: Vec2[];   // the contour currently being built

  // Polarity tracking
  currentPolarity: Polarity;

  // Ordered operations for mask rendering
  ops: Op[];

  tracks: GerberPrimitiveTrack[];
  arcs: GerberPrimitiveArc[];
  flashes: GerberPrimitiveFlash[];
  regions: GerberPrimitiveRegion[];
}

/**
 * Parse a Gerber file into drawing primitives.
 *
 * This is a practical, not spec complete parser:
 * - Handles %FS, %MO, %AD for simple circular apertures (C)
 * - Handles D01 (draw), D02 (move), D03 (flash)
 * - Handles G36/G37 for filled regions with multiple contours
 * - Ignores arcs (G02/G03) for now
 *
 * It is good enough to visualize traces and pads for many KiCad/JLC style Gerbers.
 */
export function parseGerberFile(
  name: string,
  content: string,
  _role: LayerRole | string
): GerberPrimitives {
  const state: ParserState = {
    unitScale: 1.0,
    fmtInt: 2,
    fmtDec: 4,
    x: 0,
    y: 0,
    apertures: new Map(),
    currentAperture: null,
    inRegion: false,
    regionPaths: [],
    currentPath: [],
    currentPolarity: "dark" as Polarity,
    ops: [],
    tracks: [],
    arcs: [],
    flashes: [],
    regions: [],
  };

  const lines = content.split(/\r?\n/);

  for (const rawLine of lines) {
    let line = rawLine.trim();
    if (!line) continue;

    // Comments
    if (line.startsWith("G04")) continue;

    // Parameter block: % ... *%
    if (line.startsWith("%") && line.endsWith("%")) {
      handleParameterBlock(line, state);
      continue;
    }

    // Usual commands end with *
    if (line.endsWith("*")) {
      line = line.slice(0, -1);
    }

    handleCommandLine(line, state);
  }

  // If file ended with an open region, finalize it similarly to G37.
  if (state.inRegion) {
    if (state.currentPath.length >= 3) {
      state.regionPaths.push(state.currentPath);
    }
    if (state.regionPaths.length > 0) {
      const region: GerberPrimitiveRegion = {
        loops: state.regionPaths,
        polarity: state.currentPolarity,
      };
      state.regions.push(region);

      // Record ordered operation
      state.ops.push({
        kind: "region",
        polarity: state.currentPolarity,
        loops: state.regionPaths,
      });
    }
    state.inRegion = false;
    state.regionPaths = [];
    state.currentPath = [];
  }

  return {
    tracks: state.tracks,
    arcs: state.arcs,
    flashes: state.flashes,
    regions: state.regions,
    ops: state.ops,
  };
}

/**
 * Handle parameter blocks like:
 * - %FSLAX24Y24*%
 * - %MOMM*%
 * - %MOIN*%
 * - %ADD10C,0.300*%
 */
function handleParameterBlock(block: string, state: ParserState) {
  // Strip outer percent signs
  let body = block;
  if (body.startsWith("%")) body = body.slice(1);
  if (body.endsWith("%")) body = body.slice(0, -1);
  if (body.endsWith("*")) body = body.slice(0, -1);

  if (body.startsWith("FS")) {
    // Format Statement, example: FSLAX24Y24
    const m = /FS..X(\d)(\d)Y(\d)(\d)/.exec(body);
    if (m) {
      const ix = parseInt(m[1], 10);
      const dx = parseInt(m[2], 10);
      // const iy = parseInt(m[3], 10);
      const dy = parseInt(m[4], 10);
      state.fmtInt = ix;
      state.fmtDec = dx; // assume X and Y same decimal places
      // we ignore separate Y format for now
    }
    return;
  }

  if (body.startsWith("MO")) {
    // Units, MOMM or MOIN
    const oldScale = state.unitScale;
    let newScale = oldScale;

    if (body.includes("MOMM")) {
      newScale = 1.0;
    } else if (body.includes("MOIN")) {
      newScale = 25.4;
    }

    if (newScale !== oldScale) {
      const factor = newScale / oldScale;

      for (const ap of state.apertures.values()) {
        if (ap.diameterMm !== undefined) ap.diameterMm *= factor;
        if (ap.widthMm !== undefined) ap.widthMm *= factor;
        if (ap.heightMm !== undefined) ap.heightMm *= factor;
      }

      state.unitScale = newScale;
    }
    return;
  }

  if (body.startsWith("AD")) {
    // Supports both standard shapes (C/R/O/P) and macro names (ROUNDRECT, RRECT, etc)
    const m = /AD(D?)(\d+)([A-Za-z_.$][A-Za-z0-9_.$]*),?([0-9.Xx]*)/.exec(body);
    if (!m) return;

    const code = parseInt(m[2], 10);
    const shape = m[3]; // do not narrow here
    const params = m[4] ?? "";

    let diameterMm: number | undefined;
    let widthMm: number | undefined;
    let heightMm: number | undefined;
    let cornerMm: number | undefined;

    if (params) {
      const parts = params.split(/[Xx]/).filter(Boolean);
      const sizeXmm = parts[0] ? parseFloat(parts[0]) * state.unitScale : undefined;
      const sizeYmm = parts[1] ? parseFloat(parts[1]) * state.unitScale : undefined;
      const sizeRmm = parts[2] ? parseFloat(parts[2]) * state.unitScale : undefined;

      if (shape === "C") {
        diameterMm = sizeXmm;
      } else if (shape === "R" || shape === "O") {
        widthMm = sizeXmm;
        heightMm = sizeYmm;
        diameterMm = (sizeXmm !== undefined && sizeYmm !== undefined) ? Math.min(sizeXmm, sizeYmm) : (sizeXmm ?? sizeYmm);
      } else {
        // Macro or other: treat first two as width/height if present
        widthMm = sizeXmm;
        heightMm = sizeYmm;
        if (sizeRmm !== undefined) cornerMm = sizeRmm;
        diameterMm =
          (sizeXmm !== undefined && sizeYmm !== undefined) ? Math.min(sizeXmm, sizeYmm) : (sizeXmm ?? sizeYmm);
      }
    }

    const ap: Aperture = {
      code,
      shape,
      diameterMm,
      widthMm,
      heightMm,
      cornerMm,
    };

    state.apertures.set(code, ap);
    return;
  }

  // LPD/LPC polarity commands
  if (body.startsWith("LPD")) {
    state.currentPolarity = "dark" as Polarity;
    return;
  }
  if (body.startsWith("LPC")) {
    state.currentPolarity = "clear" as Polarity;
    return;
  }

  // ignore other parameter blocks
}

/**
 * Handle normal command lines that are not parameter blocks.
 * Handles:
 * - G36 / G37
 * - D01 / D02 / D03 with X/Y coordinates
 * - Aperture selection D10, D11, etc
 */
function handleCommandLine(line: string, state: ParserState) {
  // Region start / end
  if (line === "G36") {
    state.inRegion = true;
    state.regionPaths = [];
    state.currentPath = [];
    return;
  }
  if (line === "G37") {
    // Finish current contour, if any
    if (state.currentPath.length >= 3) {
      state.regionPaths.push(state.currentPath);
    }

    state.inRegion = false;

    if (state.regionPaths.length > 0) {
      // First contour is boundary, rest are holes
      const region: GerberPrimitiveRegion = {
        loops: state.regionPaths,
        polarity: state.currentPolarity,
      };
      state.regions.push(region);

      // Record ordered operation
      state.ops.push({
        kind: "region",
        polarity: state.currentPolarity,
        loops: state.regionPaths,
      });
    }

    state.regionPaths = [];
    state.currentPath = [];
    return;
  }

  // Look for D code at end of line
  let dCode: number | null = null;
  const dMatch = /D0?(\d{1,3})$/.exec(line);
  if (dMatch) {
    dCode = parseInt(dMatch[1], 10);
    line = line.slice(0, line.length - dMatch[0].length); // strip Dxx
  }

  // Aperture select, like D10, D11 without coords
  if (dCode !== null && dCode >= 10) {
    const ap = state.apertures.get(dCode);
    if (ap) {
      state.currentAperture = ap;
    }
    return;
  }

  // Parse coordinates
  const coordMatchX = /X([+\-]?\d+)/.exec(line);
  const coordMatchY = /Y([+\-]?\d+)/.exec(line);

  let newX = state.x;
  let newY = state.y;

  if (coordMatchX) {
    newX = decodeCoord(coordMatchX[1], state);
  }
  if (coordMatchY) {
    newY = decodeCoord(coordMatchY[1], state);
  }

  // If no D code, just move modal position
  if (dCode === null) {
    state.x = newX;
    state.y = newY;
    return;
  }

  // Region drawing (G36/G37 mode)
  if (state.inRegion) {
    const prevX = state.x;
    const prevY = state.y;

    if (dCode === 1) {
      // D01: draw segment from previous point to new point
      if (state.currentPath.length === 0) {
        // first segment of this contour: start at previous position
        state.currentPath.push({ x: prevX, y: prevY });
      }
      state.currentPath.push({ x: newX, y: newY });
    } else if (dCode === 2) {
      // D02: finish current contour, move without drawing
      if (state.currentPath.length >= 3) {
        state.regionPaths.push(state.currentPath);
      }
      state.currentPath = [];
      // newX/newY becomes the new current point; contour starts on next D01
    } else {
      // D03 or others are not allowed in region mode; ignore safely
    }

    state.x = newX;
    state.y = newY;
    return;
  }

  // Normal drawing / move / flash (outside regions)
  const prevX = state.x;
  const prevY = state.y;

  if (dCode === 1) {
    // Draw
    if (!state.currentAperture) {
      state.x = newX;
      state.y = newY;
      return;
    }
    const width =
      state.currentAperture.diameterMm !== undefined
        ? state.currentAperture.diameterMm
        : 0.2;

    state.tracks.push({
      start: { x: prevX, y: prevY },
      end: { x: newX, y: newY },
      width,
      polarity: state.currentPolarity,
    });

    // Record ordered operation
    state.ops.push({
      kind: "track",
      polarity: state.currentPolarity,
      start: { x: prevX, y: prevY },
      end: { x: newX, y: newY },
      widthMm: width,
    });

    state.x = newX;
    state.y = newY;
    return;
  }

  if (dCode === 2) {
    // Move only
    state.x = newX;
    state.y = newY;
    return;
  }

  if (dCode === 3) {
    if (state.currentAperture) {
      const ap = state.currentAperture;

      const d =
        ap.diameterMm !== undefined
          ? ap.diameterMm
          : DEFAULT_FLASH_DIAM_MM;

      const flash: GerberPrimitiveFlash = {
        position: { x: newX, y: newY },
        diameterMm: d,
        shape: ap.shape,
        polarity: state.currentPolarity,
      };

      if (ap.widthMm !== undefined) flash.widthMm = ap.widthMm;
      if (ap.heightMm !== undefined) flash.heightMm = ap.heightMm;
      if (ap.cornerMm !== undefined) flash.cornerMm = ap.cornerMm;

      state.flashes.push(flash);

      // Record ordered operation
      state.ops.push({
        kind: "flash",
        polarity: state.currentPolarity,
        position: { x: newX, y: newY },
        diameterMm: d,
        shape: ap.shape,
        widthMm: ap.widthMm,
        heightMm: ap.heightMm,
        cornerMm: ap.cornerMm,
      });
    }
    state.x = newX;
    state.y = newY;
    return;
  }


  // Other D codes ignored for now
}

/**
 * Decode an integer coordinate string using the FS format and unitScale.
 * Example:
 *   fmtInt = 2, fmtDec = 4, unitScale = 1 (mm)
 *   "12345" -> 1.2345 mm
 */
function decodeCoord(numStr: string, state: ParserState): number {
  const sign = numStr.startsWith("-") ? -1 : 1;
  const digits = numStr.replace(/[+\-]/g, "");
  const n = parseInt(digits, 10);
  if (Number.isNaN(n)) return 0;

  const scale = Math.pow(10, state.fmtDec);
  const val = (n / scale) * state.unitScale;
  return sign * val;
}

function parseApertureParam(raw: string, state: ParserState): number | undefined {
  const s = raw.trim();
  if (!s) return undefined;

  // If it contains a decimal point, treat as a real value in current units
  if (s.includes(".")) {
    const v = parseFloat(s);
    if (Number.isNaN(v)) return undefined;
    return v * state.unitScale;
  }

  // Otherwise treat it like FS style integer (same fmtDec as coordinates)
  const n = parseInt(s, 10);
  if (Number.isNaN(n)) return undefined;

  const scale = Math.pow(10, state.fmtDec);
  return (n / scale) * state.unitScale;
}
