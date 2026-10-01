import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  // Build for demo deployment
  build: {
    outDir: 'dist-demo',
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'demo/index.html')
    }
  },
  // Render worker is an ES module (see vite.config.ts).
  worker: { format: 'es' },
  // Base path for GitHub Pages
  base: process.env.NODE_ENV === 'production' ? '/gerbers-renderer/' : '/',
  server: {
    port: 5173,
    open: '/demo/'
  },
  // Copy built library and dependencies
  publicDir: 'demo/public'
});
