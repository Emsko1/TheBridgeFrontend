import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: process.env.VITE_API_URL || "http://localhost:5086",
        changeOrigin: true,
        secure: true,
      },
      "/hub": {
        target: process.env.VITE_API_URL || "http://localhost:5086",
        changeOrigin: true,
        secure: true,
        ws: true, // Enable WebSocket proxying
      },
    },
  },
});
