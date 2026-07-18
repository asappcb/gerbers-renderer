import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      // Don't ship type declarations for tests, examples, or test setup.
      exclude: ["**/*.test.ts", "**/*.example.ts", "**/testSetup.ts"],
    }),
  ],
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
  // Base path for GitHub Pages
  base: process.env.NODE_ENV === 'production' ? '/gerbers-renderer/' : '/',
});
