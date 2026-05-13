# UTSEUS Refonte v1.0.0 — Release notes

**Date:** 2026-05-13 (build), demo: 2026-06-22.
**Stack:** Astro 6.3.1 + Tailwind v4 + MDX + i18n (EN/FR/ZH).

## Features

- Trilingual static site (FR default, EN, ZH) with prefixed locale routing
- 6 sections: Hero, About, Mobility programs, ComplexCity Lab, 14 projects, Testimonials, Contact
- Components: program filter, project modal, testimonial scroll-snap carousel, lazy-load YouTube embed, lightbox gallery, accordion, sticky TOC, lang switcher
- Accessibility: WCAG 2.1 AA — axe-core 0 violations, Lighthouse a11y 100
- Performance: Lighthouse 100/100/96/100 (perf/a11y/best/seo) for all 3 locales
- SEO: hreflang, canonical, sitemap, OG meta, robots.txt
- Deploy: UTC Apache `.htaccess` shipped in `dist/`; local `npm run preview` for offline demo
- Tests: Vitest TDD on i18n utils + link audit helpers (12/12 passing)
- Link audit script (`npm run audit:links`) producing JSON report

## Known gaps (post-v1.0)

- Project descriptions, testimonial quotes, section prose: TODO placeholders (Yang fills)
- Real images for hero, projects, people, icons: TODO (Zixuan + Yang)
- Real Figma design tokens: placeholders in `@theme` (Zixuan)
- UTC server deploy: pending IT authorization (fallback = local `npm run preview` demo)
- Brochure PDF at `/docs/brochure-utseus.pdf`: not yet provided

## Repo layout

See `README.md` for project structure. Spec at `docs/specs/`. Plan at `docs/plans/`. Edit guide at `docs/CONTENT_EDIT_GUIDE.md`.
