import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(() => {
  return {
    base: "/",
    plugins: [react()],
    server: {
      open: true,
      watch: {
        usePolling: true,
        interval: 1000,
      },
      hmr: {
        overlay: true,
      },
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "src/setupTests",
      mockReset: true,
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
        },
      },
    },
  };
});
