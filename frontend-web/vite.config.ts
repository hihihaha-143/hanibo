import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dns from "node:dns";

// Принудительно заставляем Node.js использовать IPv4 первым
dns.setDefaultResultOrder("ipv4first");

const proxyConfig = {
  "/api": {
    target: "http://localhost",
    changeOrigin: true,
    secure: false,
  },
};

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: proxyConfig,
    host: "127.0.0.1",
  },
  preview: {
    proxy: proxyConfig,
  },
});
