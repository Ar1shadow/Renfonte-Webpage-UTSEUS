# Track — 2026-05-15 favicon swap, CTA removal, Voice lorem, UTC footer copy

Spec: `docs/specs/2026-05-15-favicon-cta-voice-footer-design.md`.

## Done

| change | file(s) | notes |
|---|---|---|
| Favicon → UTC.png | `src/layouts/BaseLayout.astro` | `<link rel="icon" type="image/png" sizes="any" href="…UTC.png">`. SVG and ICO links dropped (favicon.ico was deleted from disk by user — broken link removed). |
| Drop Documentation CTA (Header) | `src/components/Header.astro` | Removed `<a href="/docs/brochure-utseus.pdf"…cta.brochure…>` line. |
| Drop Documentation CTA (Hero) | `src/components/Hero.astro` | Same anchor removed. |
| Remove i18n key `cta.brochure` × 3 | `src/i18n/ui.ts` | fr/en/zh entries deleted. |
| Voice → lorem ipsum × 3 | `src/data/testimonials.json` | Names: Lorem Ipsum / Dolor Sit / Amet Consectetur. Same lorem string in en/fr/zh per entry. `promo`, `program`, `photo`, `year` preserved. |
| Footer replica of UTC.fr `#leFooter` | `src/components/Footer.astro` | Full rewrite. 4 sections, scoped CSS, dark navy `#1c2d5b` + yellow `#f5bd21`. Inline SVG for FB/IG/YT/LI, `<img>` for Bluesky. No `t()` calls, same markup on every locale. |
| 16 footer images downloaded | `public/images/footer/` | logos: UTC, Hauts-de-France, HR, Bluesky, Sorbonne Alliance SVG, Sorbonne, UPMC, UTC white, INSEAD, Museum, PSPB-B, CNRS GIF, INSERM, IRD, INRIA, CIEP. |

## Verification (all pass)

- `grep -rn "cta\.brochure\|brochure-utseus" src/` → no matches.
- `npm run check` → 0 errors, 0 warnings, 1 pre-existing hint (`ProjectModal.astro:26` script attribute notice).
- `npm test` → 3 files / 12 tests pass.
- `npm run build` → 4 static pages, 786ms. 16 footer images copied to `dist/images/footer/`.

## Manual check (user to do)

1. `npm run dev` from clean shell.
2. Hard-refresh `/fr/`, `/en/`, `/zh/`.
3. Browser tab → UTC favicon visible.
4. Header → brand + 6 nav links + lang switcher. No Documentation button.
5. Hero → only "Découvrir / Explore / 了解项目" CTA. No Documentation button.
6. Voice carousel → 3 cards, lorem names + lorem quotes.
7. Footer → matches UTC.fr structure: yellow UTC heading, address, two 10-item French menus, social icons row, partner logos row.
8. Click 2-3 footer links to sanity-check external destinations.

## Notes / deferred

- `cta.brochure` key gone; no fallback. If brochure CTA returns, re-add key.
- `public/docs/brochure-utseus.pdf` file untouched; can stay until repo cleanup.
- `public/favicon.svg` still on disk; not referenced. Safe to delete in a future cleanup.
- UTC.png is 366×282 (non-square). Browsers scale to favicon size with mild distortion. Acceptable for a text logo at 16-32 px.
- Footer i18n: per spec, all menu text in French (verbatim from source). Out of scope for translation.
- Three risks spec (`docs/specs/2026-05-15-three-risk-hardening-design.md`) still pending separate implementation.
