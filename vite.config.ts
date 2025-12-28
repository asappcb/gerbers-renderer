import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        // root app (if you have one)
        main: resolve(__dirname, "index.html"),
        // demo page
        demo: resolve(__dirname, "demo/index.html"),
      },
    },
  },
});
