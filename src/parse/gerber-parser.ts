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
  | { kind: "flash"; polarity: Polarity; position: Vec2; diameterMm: number; shape: string; widthMm?: number; heightMm?: number; cornerMm?: number; rotationDeg?: number }
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
  rotationDeg?: number;  // pad rotation in degrees
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
  cornerMm?: number;
  macroName?: string;
  rotationDeg?: number;  // pad rotation in degrees
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

  // Arc interpolation mode: 1=linear (G01), 2=CW arc (G02), 3=CCW arc (G03)
  arcMode: 1 | 2 | 3;

  // Load rotation from %LR parameter (degrees)
  loadRotationDeg: number;

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
 * - Tessellates arcs (G02/G03) using the I/J center-offset form
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
    arcMode: 1,
    loadRotationDeg: 0,
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
    let rotationDeg: number | undefined;

    if (params) {
      const parts = params.split(/[Xx]/).filter(Boolean);
      const sizeXmm = parts[0] ? parseFloat(parts[0]) * state.unitScale : undefined;
      const sizeYmm = parts[1] ? parseFloat(parts[1]) * state.unitScale : undefined;
      const sizeRmm = parts[2] ? parseFloat(parts[2]) * state.unitScale : undefined;
      // 4th parameter is rotation angle in degrees (non-standard but used by Altium and KiCad macros)
      const rotRaw = parts[3] ? parseFloat(parts[3]) : undefined;
      if (rotRaw !== undefined && !Number.isNaN(rotRaw) && rotRaw !== 0) {
        rotationDeg = rotRaw; // rotation is in degrees, not scaled by unitScale
      }

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
      rotationDeg,
    };

    state.apertures.set(code, ap);
    return;
  }

  // LR: Load Rotation — applies to subsequent flashes (%LR45.0*%)
  if (body.startsWith("LR")) {
    const lrMatch = /LR([+-]?[\d.]+)/.exec(body);
    if (lrMatch) {
      state.loadRotationDeg = parseFloat(lrMatch[1]) || 0;
    }
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
 * Tessellate a Gerber arc (G02/G03) into a sequence of end-points.
 * Uses the center-offset form: center = (start.x + I, start.y + J).
 * Returns points starting AFTER the start and ending AT the end.
 */
function tessellateArc(start: Vec2, end: Vec2, I: number, J: number, clockwise: boolean): Vec2[] {
  const cx = start.x + I;
  const cy = start.y + J;
  const r = Math.sqrt(I * I + J * J);

  if (r < 1e-6) return [end]; // degenerate -> treat as straight line

  const startAngle = Math.atan2(start.y - cy, start.x - cx);
  const endAngle = Math.atan2(end.y - cy, end.x - cx);

  // Detect full-circle: start and end are the same point
  const distSq = (end.x - start.x) ** 2 + (end.y - start.y) ** 2;
  const isFullCircle = distSq < (r * 0.001) ** 2;

  let sweep: number;
  if (isFullCircle) {
    sweep = clockwise ? -2 * Math.PI : 2 * Math.PI;
  } else {
    sweep = endAngle - startAngle;
    if (clockwise) {
      if (sweep > 1e-6) sweep -= 2 * Math.PI;
    } else {
      if (sweep < -1e-6) sweep += 2 * Math.PI;
    }
  }

  // ~11.25° per segment, capped at 64 for full circles
  const n = Math.min(64, Math.max(4, Math.ceil(Math.abs(sweep) / (Math.PI / 16))));
  const pts: Vec2[] = [];
  for (let i = 1; i <= n; i++) {
    const angle = startAngle + (sweep * i) / n;
    pts.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
  }
  return pts;
}

/**
 * Handle normal command lines that are not parameter blocks.
 * Handles:
 * - G36 / G37
 * - G01 / G02 / G03 interpolation mode
 * - D01 / D02 / D03 with X/Y coordinates (and I/J for arcs)
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

  // Skip G74/G75 (single/multi quadrant mode declarations — we always use multi-quadrant math)
  if (line === "G74" || line === "G75") return;

  // Extract G interpolation mode prefix: G01 (linear), G02 (CW arc), G03 (CCW arc)
  // Can appear standalone or combined with coordinates: "G02X1000Y2000I500J500D01"
  const gModeMatch = /^G0?([123])(?!\d)/.exec(line);
  if (gModeMatch) {
    state.arcMode = parseInt(gModeMatch[1], 10) as 1 | 2 | 3;
    line = line.slice(gModeMatch[0].length).trim();
    if (!line) return;
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

  // Parse coordinates and arc offsets
  const coordMatchX = /X([+\-]?\d+)/.exec(line);
  const coordMatchY = /Y([+\-]?\d+)/.exec(line);
  const offsetMatchI = /I([+\-]?\d+)/.exec(line);
  const offsetMatchJ = /J([+\-]?\d+)/.exec(line);

  let newX = state.x;
  let newY = state.y;

  if (coordMatchX) {
    newX = decodeCoord(coordMatchX[1], state);
  }
  if (coordMatchY) {
    newY = decodeCoord(coordMatchY[1], state);
  }

  const arcI = offsetMatchI ? decodeCoord(offsetMatchI[1], state) : 0;
  const arcJ = offsetMatchJ ? decodeCoord(offsetMatchJ[1], state) : 0;

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
      // D01: draw segment (or arc) from previous point to new point
      if (state.currentPath.length === 0) {
        state.currentPath.push({ x: prevX, y: prevY });
      }
      if (state.arcMode !== 1 && (arcI !== 0 || arcJ !== 0)) {
        const pts = tessellateArc({ x: prevX, y: prevY }, { x: newX, y: newY }, arcI, arcJ, state.arcMode === 2);
        for (const pt of pts) state.currentPath.push(pt);
      } else {
        state.currentPath.push({ x: newX, y: newY });
      }
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
    // Draw (linear or arc)
    if (!state.currentAperture) {
      state.x = newX;
      state.y = newY;
      return;
    }
    const width =
      state.currentAperture.diameterMm !== undefined
        ? state.currentAperture.diameterMm
        : 0.2;

    if (state.arcMode !== 1 && (arcI !== 0 || arcJ !== 0)) {
      // Arc mode: tessellate into segments
      const pts = tessellateArc({ x: prevX, y: prevY }, { x: newX, y: newY }, arcI, arcJ, state.arcMode === 2);
      let prev = { x: prevX, y: prevY };
      for (const pt of pts) {
        state.tracks.push({ start: prev, end: pt, width, polarity: state.currentPolarity });
        state.ops.push({ kind: "track", polarity: state.currentPolarity, start: prev, end: pt, widthMm: width });
        prev = pt;
      }
    } else {
      // Linear
      state.tracks.push({
        start: { x: prevX, y: prevY },
        end: { x: newX, y: newY },
        width,
        polarity: state.currentPolarity,
      });
      state.ops.push({
        kind: "track",
        polarity: state.currentPolarity,
        start: { x: prevX, y: prevY },
        end: { x: newX, y: newY },
        widthMm: width,
      });
    }

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

      // Combine aperture rotation with any active %LR load rotation
      const totalRot = (ap.rotationDeg ?? 0) + state.loadRotationDeg;
      const rotationDeg = totalRot !== 0 ? totalRot : undefined;

      const flash: GerberPrimitiveFlash = {
        position: { x: newX, y: newY },
        diameterMm: d,
        shape: ap.shape,
        polarity: state.currentPolarity,
        rotationDeg,
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
        rotationDeg,
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
