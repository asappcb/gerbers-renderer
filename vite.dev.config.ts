import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  // Root is the demo directory for development
  root: resolve(__dirname, 'demo'),
  publicDir: 'public',
  
  // Development server configuration
  server: {
    port: 5173,
    open: '/',
    fs: {
      // Allow serving files from parent directory (src)
      allow: ['..'],
    },
  },
  
  // Don't build as a library in dev mode
  build: {
    outDir: '../dist-demo',
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'demo/index.html')
    }
  },
  
  // Base path for GitHub Pages
  base: process.env.NODE_ENV === 'production' ? '/gerbers-renderer/' : '/',
});
