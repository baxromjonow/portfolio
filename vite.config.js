import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Dev rejimida /api so'rovlari lokal Node serverga (npm start, 3000-port) yo'naltiriladi.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
  build: {
    target: "es2020",
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/gsap") || id.includes("node_modules/lenis")) return "motion";
          if (id.includes("node_modules/react")) return "react";
        },
      },
    },
  },
});
