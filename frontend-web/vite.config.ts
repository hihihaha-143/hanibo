import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dns from "node:dns";

// Принудительно заставляем Node.js использовать IPv4 первым
dns.setDefaultResultOrder("ipv4first");

const proxyConfig = {
  "/api": {
    target: "http://192.168.0.15",
    changeOrigin: true,
    secure: false,
  },
};

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: proxyConfig,
    // WSL: localhost-проброс иногда зависает, поэтому слушаем все интерфейсы.
    host: "0.0.0.0",
  },
  preview: {
    proxy: proxyConfig,
  },
});
