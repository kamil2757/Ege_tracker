import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
    server: {
    host: '127.0.0.1', // теперь фронт слушает именно этот адрес
    port: 5173,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/sizes" as *; @use "@/styles/colors" as *; @use "@/styles/fonts" as *; @use "@/styles/mixins.scss" as *; `,
      },
    },
  },
});
