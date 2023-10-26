import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        grades: resolve(__dirname, "grades.html"),
      },
    },
  },
  server: {
    host: true,
    port: 80,
  },
});
