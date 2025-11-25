import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from 'vite-plugin-svgr'
// https://vitejs.dev/config/
export default defineConfig({
  // For deploying separately
  base: '/',
  // For django serving react
  // base: './',
  plugins: [react(), svgr()],
  json: {
    stringify: true, // Enable JSON imports
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
