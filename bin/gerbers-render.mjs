#!/usr/bin/env node
// Headless Gerber renderer CLI.
//
//   gerbers-render <input.zip> [--side top|bottom] [--out file] [--format svg|png] [--scale N]
//
// SVG output has no extra dependencies. PNG output requires @resvg/resvg-js to be
// installed (optional): `npm i @resvg/resvg-js`.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const opts = { side: "top", format: "svg", scale: 1, out: null, input: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--side") opts.side = argv[++i];
    else if (a === "--out" || a === "-o") opts.out = argv[++i];
    else if (a === "--format" || a === "-f") opts.format = argv[++i];
    else if (a === "--scale") opts.scale = parseFloat(argv[++i]);
    else if (a === "--help" || a === "-h") opts.help = true;
    else if (!opts.input) opts.input = a;
  }
  return opts;
}

const USAGE = `gerbers-render <input.zip> [options]

  --side top|bottom   which side to render (default: top)
  --format svg|png    output format (default: svg; png needs @resvg/resvg-js)
  --scale N           output scale multiplier (default: 1)
  --out, -o FILE      output file (default: stdout for svg, board.png for png)
`;

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help || !opts.input) {
    process.stdout.write(USAGE);
    process.exit(opts.input ? 0 : 1);
  }

  const lib = await import(resolve(__dirname, "../dist/gerbers-renderer.es.js"));
  const buf = readFileSync(opts.input);
  const u8 = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);

  if (opts.format === "svg") {
    const svg = await lib.renderGerbersToSvg(u8, { side: opts.side });
    if (opts.out) { writeFileSync(opts.out, svg); process.stderr.write(`wrote ${opts.out}\n`); }
    else process.stdout.write(svg);
    return;
  }

  if (opts.format === "png") {
    let Resvg;
    try { ({ Resvg } = await import("@resvg/resvg-js")); }
    catch {
      process.stderr.write("PNG output needs @resvg/resvg-js. Install it: npm i @resvg/resvg-js\n");
      process.exit(2);
    }
    const rasterizer = async (svg, { width, scale }) => {
      const r = new Resvg(svg, { fitTo: { mode: "width", value: Math.max(1, Math.round(width * scale)) } });
      return r.render().asPng();
    };
    const png = await lib.renderGerbersToImage(u8, { side: opts.side, scale: opts.scale, rasterizer });
    const out = opts.out || "board.png";
    writeFileSync(out, png);
    process.stderr.write(`wrote ${out}\n`);
    return;
  }

  process.stderr.write(`Unknown format: ${opts.format}\n`);
  process.exit(1);
}

main().catch((err) => {
  process.stderr.write(`${err?.message ?? err}\n`);
  process.exit(1);
});
