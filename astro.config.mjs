// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: process.env.SITE_URL ?? 'https://www.utc.fr',
  base: process.env.BASE_PATH ?? '/',

  redirects: {
    '/': '/fr/',
  },

  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en', 'zh'],
    routing: {
      prefixDefaultLocale: true,
      // redirectToDefaultLocale not needed: `redirects: { '/': '/fr/' }` above
      // already handles the static-build root redirect with delay=0.
    },
    // No `fallback` — every locale ships its own explicit pages from T9 onward.
    // Astro's fallback emitter would otherwise pre-empt explicit pages and
    // produce empty bodies (e.g. /zh).
  },

  vite: {
    plugins: [tailwindcss()],
  },
});