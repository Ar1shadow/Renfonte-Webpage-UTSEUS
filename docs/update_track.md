# UTSEUS Refonte — Update Track

> Single starting doc for the next session. Read this first; everything else is reference.

## 1. Status snapshot

- **Repo:** https://github.com/Ar1shadow/Renfonte-Webpage-UTSEUS
- **Branch:** `main`
- **Last release tag:** `v1.0.0` (commit `0ac7bc3`, 2026-05-13)
- **Current HEAD at session start:** see `git log -1`
- **Build status:** clean (`npm run check` 0/0/0 + 1 cosmetic hint, `npm test` 12/12, `npm run build` 4 pages)
- **Lighthouse:** 100 / 100 / 96 / 100 (perf / a11y / best / seo) — same scores all 3 locales
- **axe-core:** 0 violations on `/fr/`, `/en/`, `/zh/`

## 2. Stack + decisions locked

| Decision | Value |
|---|---|
| Framework | Astro 6.3.1 |
| Styling | Tailwind v4 via `@tailwindcss/vite` (CSS-first, no `tailwind.config.mjs`) |
| Tokens location | `src/styles/global.css` `@theme` block only (no separate `tokens.css`) |
| Content | MDX content collections + JSON data collections via Astro 6 `loader: glob/file` |
| zod import | `import { z } from 'astro/zod'` (NOT `astro:content`) |
| Content config path | `src/content.config.ts` (Astro 6 preferred) |
| i18n | Astro built-in routing, locales `['fr','en','zh']`, default `fr`, `prefixDefaultLocale: true` |
| Root redirect | `redirects: { '/': '/fr/' }` in `astro.config.mjs` (not `index.astro`) |
| Tests | Vitest on pure logic (i18n + audit helpers); manual + Lighthouse + axe for visuals |
| Deploy | UTC Apache SFTP OR local `npm run preview`. **NOT GH Pages.** |

## 3. Completed tasks (T1–T35)

Per `docs/plans/2026-05-12-utseus-refonte-implementation.md`. One commit per task (some + 1 fix commit).

| # | Task | Commit |
|---|---|---|
| T1 | Astro init | `8108b67` + fix `61e081d` |
| T2 | i18n routing | `75db54f` + fix `747fc27` |
| T3 | Tailwind v4 | `e3c4870` + fixes `9e82d4e`, `4201529` |
| T4 | Header (UTC clone) | `7858043` |
| T5 | Footer (UTC clone, trimmed) | `9dcf9db` |
| T6 | BaseLayout | `8dff127` |
| T7 | Content schemas | `99ac305` |
| T8 | i18n utils + Vitest TDD | `732ccd2` |
| T9 | Stub locale pages | `57fa620` + fix `85c6ab0` |
| T10 | Hero | `1fedd44` |
| T11 | KeyFiguresGrid + data | `a3eec7f` |
| T12 | SectionBlock | `f48ddf9` |
| T13 | SidebarTOC | `7a89735` |
| T14 | LangSwitcher TDD | `5006888` |
| T15 | Token expansion (placeholders) | `69ce09e` |
| T16 | ProgramCard + Filter | `c9b59a5` |
| T17 | ProjectCard + Modal | `f78c33d` |
| T18 | TestimonialCarousel | `a7da46c` |
| T19 | VideoEmbed (lazy YouTube) | `b2a2774` |
| T20 | Gallery + lightbox | `4c3d59d` |
| T21 | Accordion (native details) | `edcc511` |
| T22 | ContactCard | `b228168` |
| T23 | Compose pages + 15 MDX stubs | `4b0522d` |
| T24 | Seed data files | `60d28ec` |
| T25 | Complete i18n strings + wire `t()` | `c8bfecb` |
| T26 | Link audit script TDD | `050cbaa` |
| T27 | astro:assets image optim | `e2f8125` |
| T28 | Lighthouse pass | `7d27342` |
| T29 | a11y axe-core + skip-link | `1c550e0` |
| T30 | Sitemap + robots.txt | `32ec212` |
| T31 | `.htaccess` + 404 | `2928310` |
| T32 | Deploy plan (now UTC + local only) | `7b2c48f` (later patched to drop GH Pages) |
| T33 | CONTENT_EDIT_GUIDE | `f6d63ac` |
| T34 | GH Actions `build.yml` (PR validation) | `44a73a7` |
| T35 | Demo prep + v1.0.0 tag | `0ac7bc3` |

## 4. Verification baseline (last session)

```text
npm run check  → 0 errors / 0 warnings / 1 hint (cosmetic ProjectModal `is:inline`)
npm test       → 12/12 passing (3 files: i18n, lang-switcher, link-audit)
npm run build  → 4 pages (/fr, /en, /zh, /404) + sitemap + redirect /index.html
Lighthouse     → perf 100, a11y 100, best 96, seo 100 (all 3 locales)
axe-core       → 0 violations (all 3 locales)
```

## 5. Pending — Pengcheng (dev)

- [ ] Coordinate UTC IT → SFTP credentials + served path + final domain (subdomain or path)
- [ ] Once UTC subdomain known: set `SITE_URL` env at build, regenerate sitemap + canonical
- [ ] After Yang/Zixuan deliverables land: re-run `npm run build`, `npm run audit:links`, Lighthouse, axe
- [ ] If Best Practices score doesn't recover to ≥95: investigate residual console errors
- [ ] Tag `v1.1.0` after content + assets integrated
- [ ] Build demo screen recording (UTC live OR `npm run preview`) → `docs/demo/walkthrough.mp4`
- [ ] Replace placeholder logo SVG path `/images/logo-utseus.svg` reference in Header once Zixuan ships file

## 6. Pending — Zixuan (IHM/ergonomie)

Tracked also in `OWNERS.md`.

### Figma deliverables
- [ ] Final desktop maquettes (all 6 sections + header/footer + lang switcher dropdown + project modal + testimonial card)
- [ ] Final mobile maquettes (≤640px breakpoint)
- [ ] Design system page (token reference)
- [ ] Maquette screenshots → `docs/demo/maquettes-{desktop,mobile}.png`

### Tokens to swap into `src/styles/global.css` `@theme` block

Replace placeholder values for these CSS vars (current values are placeholders from T15 pass):

```
--color-bg
--color-fg
--color-accent
--color-accent-soft
--color-muted
--font-sans
--font-display
--radius-sm
--radius-md
--shadow-card
```

If Figma defines additional spacing/typography scales, add them inside the `@theme` block (Tailwind v4 auto-generates utilities from `--spacing-*`, `--text-*`, etc.).

### Image assets

| Path | Spec | Notes |
|---|---|---|
| `src/assets/hero-shanghai.jpg` (or `.webp`) | 1920×1080 | Replaces SVG placeholder; Astro Image will auto-optimize |
| `src/assets/og-default.jpg` | 1200×630 | Replaces SVG placeholder; OG share card |
| `public/images/logo-utseus.svg` | UTSEUS logo | Used in Header |

### A11y review

- [ ] Manual screen-reader pass once real content + images land
- [ ] Verify color contrast meets WCAG AA after Figma color swap (axe-core re-run)

## 7. Pending — Yang (contenu/scénarisation)

Tracked also in `OWNERS.md`.

### Section prose (15 MDX files)

Replace TODO bodies in:

```
src/content/sections/{en,fr,zh}/01-about.mdx
src/content/sections/{en,fr,zh}/02-mobility.mdx
src/content/sections/{en,fr,zh}/03-complexcity.mdx
src/content/sections/{en,fr,zh}/04-projects.mdx
src/content/sections/{en,fr,zh}/05-contact.mdx
```

Frontmatter (between `---`) must NOT change. Body is Markdown + may use Astro components (see existing imports in the page-level files).

### Project descriptions

Edit `src/data/projects.json` — 14 entries with `description.en`, `description.fr`, `description.zh` currently `"TODO"`. Project images go to `public/images/projects/<slug>.jpg`.

### Testimonials

Edit `src/data/testimonials.json` — 3 placeholder entries, fill `quote.en/fr/zh`. Photos to `public/images/people/<id>.jpg`.

### Programs

`src/data/programs.json` already seeded with 4 entries (real titles + descriptions). Yang may refine wording. Program icons to `public/images/icons/`.

### UI strings

Verify `src/i18n/ui.ts` ZH translations are natural — Pengcheng's seed pass may need tone polish.

### Link audit

- [ ] Open `data/links-report.json` (auto-generated by `npm run audit:links`)
- [ ] Fill `data/links-audit.csv` with replacement URLs for the 2 broken links flagged in T26

### Brochure

- [ ] Provide PDF → `public/docs/brochure-utseus.pdf` (referenced from Hero CTA + Header)

## 8. Demo paths (UTC + local)

### Path A — UTC Apache (when IT auth granted)

```bash
npm run build
# upload dist/ contents via SFTP:
sftp <user>@<utc-host>
> cd <served-path>
> put -r dist/*
> quit
# verify
curl -sI https://<live-url>/fr/ | head -3
```

`public/.htaccess` ships in `dist/` and handles `/` → `/fr/` redirect, gzip, cache headers, security headers, custom 404. No extra UTC config needed.

### Path B — Local preview (always works, fallback)

```bash
npm run build
npm run preview
# open http://localhost:4321/ in browser
```

`/` auto-redirects to `/fr/`. Switch locales via header switcher. For course demo: screen-record → `docs/demo/walkthrough.mp4`. No public URL or IT dependency.

## 9. Known issues

- **Placeholder image 404s** — components reference `/images/logo-utseus.svg`, `/images/icons/*.svg`, `/images/people/*.jpg`, `/images/projects/*.jpg` that don't exist yet. Causes Best Practices score 96 (-4 from console errors). Resolves once Zixuan + Yang ship files.
- **Cosmetic check hint** — `ProjectModal.astro` triggers astro-check hint about `<script define:vars>` + `is:inline`. Behavior correct; cosmetic only.
- **No real Figma tokens yet** — `@theme` block uses sensible placeholders. Visual style will shift once Zixuan delivers real values.

## 10. Run-book

```bash
# Dev (hot reload)
npm run dev                # http://localhost:4321/

# Type check
npm run check              # astro check

# Tests
npm test                   # vitest run (12 tests)
npm run test:watch         # vitest watch mode

# Build + preview
npm run build              # → dist/
npm run preview            # serves dist/ at localhost:4321

# Link audit
npm run audit:links        # writes data/links-report.json + exit 1 if any broken
```

Env vars (set at build):

```bash
SITE_URL=https://www.utc.fr   # canonical/sitemap base; fallback to www.utc.fr
BASE_PATH=/                   # URL prefix; '/' for root deploy (default)
```

## 11. References

- Spec: [`docs/specs/2026-05-12-utseus-refonte-design.md`](specs/2026-05-12-utseus-refonte-design.md)
- Implementation plan: [`docs/plans/2026-05-12-utseus-refonte-implementation.md`](plans/2026-05-12-utseus-refonte-implementation.md)
- Ownership matrix: [`OWNERS.md`](../OWNERS.md)
- Content edit guide (non-dev): [`docs/CONTENT_EDIT_GUIDE.md`](CONTENT_EDIT_GUIDE.md)
- Release notes v1.0.0: [`docs/RELEASE_NOTES_v1.0.0.md`](RELEASE_NOTES_v1.0.0.md)
- Demo assets folder: [`docs/demo/`](demo/)
- Link audit data: [`data/links-audit.csv`](../data/links-audit.csv) + [`data/links-report.json`](../data/links-report.json)
