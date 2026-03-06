import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: 'https://www.porratigioielli.it',
  integrations: [
    tailwind(),
    react(),
    sitemap({
      exclude: ['/404', '/test-vortex', '/en/search', '/it/ricerca', '/it/borgonuovo10-archive', '/en/borgonuovo10-archive', '/it/commercial', '/en/commercial']
    })
  ]
});
