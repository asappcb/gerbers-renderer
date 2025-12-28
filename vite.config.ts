import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [dts({ insertTypesEntry: true })],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "GerbersRenderer",
      formats: ["es", "umd"],
      fileName: (format) =>
        format === "es" ? "gerbers-renderer.es.js" : "gerbers-renderer.umd.js",
    },
    sourcemap: true,
  },
});
