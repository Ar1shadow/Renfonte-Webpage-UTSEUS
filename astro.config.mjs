// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.utc.fr',
  base: '/',
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en', 'zh'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: true,
    },
    fallback: { en: 'fr', zh: 'fr' },
  },
});
