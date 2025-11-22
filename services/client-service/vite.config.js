import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,      // Needed for Docker to map the port correctly
    port: 5173,      // Ensures the port matches your docker-compose
    watch: {
      usePolling: true, // The critical fix for hot-reloading in Docker
    },
  },
})