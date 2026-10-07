import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const proxyConfig = {
  "/api": {
    target: "https://hanibo",
    changeOrigin: true,
    secure: false,
  },
};

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: proxyConfig,
  },
  preview: {
    proxy: proxyConfig,
  },
});
