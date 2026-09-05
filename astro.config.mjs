// @ts-check
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://mdjamilh.vercel.app",
  trailingSlash: "never",
  build: {
    format: "file",
    // Scripts and styles ship as files, so the Content Security Policy needs no inline exceptions.
    inlineStylesheets: "never",
  },
  vite: {
    build: { assetsInlineLimit: 0 },
  },
});
