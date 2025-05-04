import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: true,
    port: Number(process.env.PORT),
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, "src"),
    },
  },
  define: {
    VITE_SITE: JSON.stringify(process.env.VITE_SITE),
    VITE_DESIGN: JSON.stringify(process.env.VITE_DESIGN),
    VITE_CITY: JSON.stringify(process.env.VITE_CITY),
    VITE_HOST: JSON.stringify(process.env.VITE_HOST),
    VITE_PARTICIPANT: JSON.stringify(process.env.VITE_PARTICIPANT),
    VITE_TASKS: JSON.stringify(process.env.VITE_TASKS),
    VITE_ENTRIES: JSON.stringify(process.env.VITE_ENTRIES),
  },
});
