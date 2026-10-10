import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Dev server proxies /api calls to the Django backend on :8000,
// so the frontend code can just call fetch("/api/...") everywhere.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://127.0.0.1:8000",
    },
  },
});
