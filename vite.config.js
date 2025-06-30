// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifestFilename: "manifest.webmanifest",
      includeAssets: [
        "icons/favicon.ico",
        "icons/meet-app-144.png",
        "icons/meet-app-192.png",
        "icons/meet-app-512.png",
      ],
      manifest: {
        short_name: "Meet App",
        name: "Meet App - Find Events Near You",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#000000",
        lang: "en",
        icons: [
          {
            src: "icons/favicon.ico",
            sizes: "48x48",
            type: "image/x-icon",
            purpose: "maskable",
          },
          {
            src: "icons/meet-app-144.png",
            sizes: "144x144",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "icons/meet-app-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "icons/meet-app-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
});
