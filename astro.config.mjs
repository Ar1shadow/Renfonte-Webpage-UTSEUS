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
      redirectToDefaultLocale: true,
    },
    fallback: { en: 'fr', zh: 'fr' },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});