# Lighthouse baseline (T28)

Date: 2026-05-12
Tool: lighthouse 13.x (headless Chrome via /Applications/Google Chrome.app)
Build: production (`npm run build` with `SITE_URL=https://www.utc.fr`)
Server: `npx http-server dist -p 8080 -s`
Categories: `performance,accessibility,best-practices,seo`
Scope: placeholder content + SVG placeholders. Real content + raster images
(T15 Figma + T24 Yang content) will further harden Best Practices.

## Plan thresholds

Performance >= 90, A11y >= 95, Best Practices >= 95, SEO >= 95 for fr/en/zh.

## Final scores (after T28 fixes)

| Page | Perf | A11y | Best | SEO |
|------|------|------|------|-----|
| /fr/ | 100  | 100  | 96   | 100 |
| /en/ | 100  | 100  | 96   | 100 |
| /zh/ | 100  | 100  | 96   | 100 |

All thresholds met across all three locales.

## Fixes applied in T28

1. **A11y (100 from 89)** — `src/components/ProgramFilter.astro`
   - Added `role="tab"` and `type="button"` to filter buttons inside the
     `role="tablist"` container. This resolves both `aria-allowed-attr`
     (`aria-selected` is now valid because role is `tab`) and
     `aria-required-children` (tablist now contains required `tab` children).
   - Added explicit `aria-selected="false"` to non-default tabs so initial
     state is announced correctly.

2. **SEO (100 from 91)** — `src/layouts/BaseLayout.astro`
   - hreflang `<link rel="alternate">` URLs are now absolute, derived from
     `Astro.site` (configured via `astro.config.mjs` `site:` field).
   - Added `hreflang="x-default"` pointing at `/fr/` (the default locale)
     to satisfy Google's spec for sites without an unlocalized variant.

## Remaining gap (Best Practices = 96)

`errors-in-console` (-4 pts) is caused by 404s on placeholder image paths
that ship in `src/data/*.json` and `Header.astro` but have no asset on disk:

- `/images/logo-utseus.svg`
- `/images/icons/{engineering,humanities,intl,language}.svg`
- `/images/people/{alice,liu,camille}.jpg`
- `/images/projects/*.jpg`

These will be resolved when T15 (Figma assets) and T24 (Yang content) land.
The `<img>` elements use empty `alt=""` so the broken images do not impact
the A11y category. We deliberately do **not** stub the assets here.

## Re-running the audit

```bash
SITE_URL=https://www.utc.fr npm run build
npx http-server dist -p 8080 -s &
SERVER_PID=$!
sleep 2
for L in fr en zh; do
  CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    npx lighthouse "http://localhost:8080/$L/" \
    --quiet --chrome-flags="--headless --no-sandbox" \
    --output=json --output-path=./tmp/lh-$L.json \
    --only-categories=performance,accessibility,best-practices,seo
  node -e "const r = require('./tmp/lh-$L.json'); console.log('$L', JSON.stringify(Object.fromEntries(Object.entries(r.categories).map(([k,v]) => [k, Math.round(v.score*100)]))))"
done
kill $SERVER_PID
```

On CI, install `chromium` (or use Playwright's bundled Chromium) and set
`CHROME_PATH` to the binary; everything else is identical.
