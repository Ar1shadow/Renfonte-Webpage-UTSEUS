# Favicon swap, Documentation CTA removal, Voice placeholder, UTC footer copy — design

Date: 2026-05-15
Status: approved (pending implementation)

## Context

Four user-requested changes bundled into one design because the surface areas overlap (Hero/Header CTA, Footer, i18n keys, public assets):

1. The user added `public/UTC.png` (366×282 RGBA PNG). They want it used as the browser favicon in place of `favicon.svg`.
2. The "Documentation" CTA button (driven by the `cta.brochure` i18n key, pointing at `/docs/brochure-utseus.pdf`) appears in both `Header.astro` and `Hero.astro`. The user wants both occurrences removed. Header and Hero structures otherwise stay.
3. The "Voice / Témoignages / 学生声音" section is currently driven by three entries in `src/data/testimonials.json` with real student names and quotes. The user wants the content replaced with classic lorem ipsum, identical across en/fr/zh.
4. The current `Footer.astro` is a minimal Tailwind grid with UTC + UTSEUS addresses + 2 links. The user wants it replaced with a pixel-near replica of `#leFooter` from `https://www.utc.fr/en/international-relations/the-sino-french-institute-in-engineering-utseus-at-the-university-of-shanghai/`, including the same images and links, with no i18n translation (same markup across all three locales).

## Goals

- Browser tab shows UTC.png as the favicon at `/fr/`, `/en/`, `/zh/`, and `/`.
- No "Documentation" button visible anywhere on the rendered pages.
- Voice section visually shows lorem-style placeholder content without breaking the carousel layout.
- Footer matches the UTC.fr footer in structure, colors, images, links, and visible text.

## Non-goals

- Translating the UTC.fr footer's French menu items into English or Chinese.
- Removing the `/docs/brochure-utseus.pdf` file from `public/docs/` (file may stay even if no longer linked).
- Replacing or compressing UTC.png. Browsers scale a 366×282 image to 16×16/32×32 with mild distortion; acceptable for now.
- Touching the partial-rewrite design in `docs/specs/2026-05-15-three-risk-hardening-design.md` (separate concern, separate plan).

## Design

### 1. Favicon — UTC.png

`src/layouts/BaseLayout.astro` currently has:

```astro
<link rel="icon" type="image/svg+xml" href={`${import.meta.env.BASE_URL}favicon.svg`} />
<link rel="icon" type="image/x-icon" sizes="32x32" href={`${import.meta.env.BASE_URL}favicon.ico`} />
```

Change to:

```astro
<link rel="icon" type="image/png" sizes="any" href={`${import.meta.env.BASE_URL}UTC.png`} />
<link rel="icon" type="image/x-icon" sizes="32x32" href={`${import.meta.env.BASE_URL}favicon.ico`} />
```

`favicon.svg` is no longer referenced; the file stays on disk (could be removed later, out of scope). `favicon.ico` is retained as a fallback for browsers that don't pick up the PNG.

### 2. Remove Documentation CTA

Two files, one line each:

- `src/components/Header.astro` line 30 — delete:

  ```astro
  <a href="/docs/brochure-utseus.pdf" class="site-header__cta">{t('cta.brochure')}</a>
  ```

- `src/components/Hero.astro` line 17 — delete:

  ```astro
  <a href="/docs/brochure-utseus.pdf" class="px-5 py-3 border border-white/80 text-white rounded hover:bg-white/10">{t('cta.brochure')}</a>
  ```

Then remove the now-unused i18n keys from `src/i18n/ui.ts`:

- Line 13: `'cta.brochure': 'Documentation',` (fr)
- Line 38: `'cta.brochure': 'Documentation',` (en)
- Line 63: `'cta.brochure': '查看资料',` (zh)

Grep for any remaining `cta.brochure` after removal — should return zero.

### 3. Voice section — lorem ipsum

`src/data/testimonials.json` has three entries. For each entry, replace:

- `name` → one of `"Lorem Ipsum"`, `"Dolor Sit"`, `"Amet Consectetur"`
- `quote.en` / `quote.fr` / `quote.zh` → identical lorem ipsum text per entry (≈30-50 words). Same string in all three locale keys.

Preserve `promo`, `program`, `photo`, `year` so the carousel layout doesn't shift. Schema in `src/content.config.ts:46-54` already validates these fields with `z.string()` — lorem values pass.

The carousel component `src/components/TestimonialCarousel.astro` reads via `getCollection('testimonials')` — no component change needed.

### 4. Footer — replica of `#leFooter`

Replace `src/components/Footer.astro` entirely.

**Structure** (4 stacked `<section>` blocks):

1. **Org info + nav menus:** 3-column row.
   - Col 1: yellow `<h2>UTC</h2>` heading + `"université de technologie de Compiègne"` + address (`Rue du docteur Schweitzer CS 60319 / 60203 Compiègne Cedex France / Tél : +33 3 44 23 44 23`) + a row of 3 logos (UTC, Hauts-de-France, HR Excellence in Research).
   - Col 2: 10-item nav menu (Actes réglementaires, Amicale de l'UTC, Bibliothèque, Charte Erasmus+ 2021–2027, Contactez-nous, Épidémie de coronavirus, Documentation, ENT, Fête de la science, Interactions – Le magazine).
   - Col 3: 10-item nav menu (Marchés publics, Organigramme, Presse, Prix Roberval, Recrutement, The disabled Students Bureau, Salons, Taxe d'apprentissage, UTC Alumni, UTeam).
   - All link `href`s preserved verbatim from the source HTML.

2. **Social + legal:** social-icon row (Facebook, Instagram, YouTube, LinkedIn, Bluesky) above legal row (Crédits, Mentions légales, Cookies, Accessibilité - non-conforme).
   - Social icons: inline SVG fragments per icon (FontAwesome glyphs extracted from the source page's SVG symbol defs). Bluesky stays as a bitmap (`<img>`).
   - Legal links keep original hrefs.

3. **Partner logos row:** Sorbonne Alliance SVG + linked partner images (Sorbonne, UPMC, UTC, INSEAD, Museum, PSPB-B, CNRS, INSERM, IRD, INRIA, CIEP). Wraps onto multiple lines on small viewports.

4. **Duplicate Sorbonne + UTC row:** the UTC.fr source ships this as a mobile fallback variant. Keep as-is and let CSS hide it on wider screens.

**Asset pipeline:**

Download these images (curl with browser user-agent) into a new directory `public/images/footer/`:

- `logo-utc-footer.png`
- `logo-hauts-de-france.png`
- `logo-hr.png`
- `bluesky-logo.png`
- `logo-sorbonne-alliance-white.svg`
- `02-sorbonne-logo-2.png`
- `03-upmc-logo.png`
- `logo-utc-footer-blanc.png`
- `05-insead-logo.png`
- `06-museum-logo.png`
- `07-partner-logo.png`
- `logo-cnrs-2019-blanc.gif`
- `09-inserm-logo.png`
- `10-ird-logo.png`
- `11-inria-logo.png`
- `12-partner-2.png`

Rewrite each image `src` in the new `Footer.astro` to `/images/footer/<filename>`.

**Styling:** UTC.fr uses dark navy background (sampled approx. `#1c2d5b`) with yellow "UTC" heading text (`#f5bd21`-ish) and white body. Embed CSS via a single `<style>` block at the bottom of `Footer.astro` (Astro scopes component styles automatically). Use semantic class names (`.utc-footer`, `.utc-footer__col`, `.utc-footer__nav`, `.utc-footer__partners`, `.utc-footer__legal`, etc.) rather than copying UTC's `ct-*` / `oxy-*` builder classes. Target a tablet+ horizontal layout with a single-column mobile stack via `@media (max-width: 768px)`.

**Visible text:** every word visible on UTC.fr's footer (French) is copied verbatim, including section 4 which appears empty in the source but still ships markup. No `t()` calls inside this Footer; props remain accepting `lang` for API compatibility with `BaseLayout.astro` but `lang` is unused. (Document this with a one-line comment.)

**Hreflang / locale invariance:** Footer is identical across `/fr/`, `/en/`, `/zh/`. Each locale page's import of `<Footer>` continues to work because Astro re-renders the same component.

**Old `footer.copyright` key:** the existing `Footer.astro` uses `t('footer.copyright')`. Since the new footer drops this dynamic line entirely, the `footer.copyright` key in `ui.ts` is now unused. Leave it in place (no harm, no rendering); avoids touching the i18n test fixture that may reference it.

## Files touched

| file | action |
|---|---|
| `src/layouts/BaseLayout.astro` | swap one favicon `<link>` line |
| `src/components/Header.astro` | delete one `<a>` line |
| `src/components/Hero.astro` | delete one `<a>` line |
| `src/i18n/ui.ts` | remove 3 `cta.brochure` lines |
| `src/data/testimonials.json` | replace 3 `name` + 9 quote strings |
| `src/components/Footer.astro` | full rewrite (replica markup + scoped CSS) |
| `public/images/footer/` | new directory, ~16 image files |

## Verification

1. `npm run check` — Astro type/schema check passes. No `t('cta.brochure')` ref errors.
2. `grep -rn "cta.brochure" src/` returns nothing.
3. `npm test` — existing 12 tests still pass. (Note: `tests/i18n.test.ts` may assert key presence; verify when implementing.)
4. `npm run build` — succeeds. No 404s in build log for `/images/footer/*`.
5. `npm run dev` from clean shell:
   - Browser tab on `/fr/`, `/en/`, `/zh/` shows UTC.png-derived favicon (hard refresh once).
   - Header has brand + 6 nav links + lang switcher. **No** Documentation button.
   - Hero shows "Découvrir / Explore / 了解项目" CTA but **no** "Documentation" CTA next to it.
   - Voice section: 3 cards, each showing lorem-style name + lorem-style quote text.
   - Footer matches UTC.fr screenshot side-by-side: UTC heading yellow, dark navy bg, two 10-item French menus, social icons, partner logos row.
6. Click 3 random footer links → external pages load (HTTP 200).
7. Footer renders identically on `/en/` and `/zh/` (no locale-dependent variation).

## Out of scope

- The 3 risks from `docs/specs/2026-05-15-three-risk-hardening-design.md` (separate plan).
- Removing `public/favicon.svg` or `public/docs/brochure-utseus.pdf` from disk.
- Translating the footer.
- Optimizing the 6 large `public/images/generated/*.png` files (separate perf concern).
- Replacing the inline `<img>` in `Hero.astro` with `astro:assets`.
