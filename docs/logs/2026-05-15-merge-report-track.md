# Merge report — 2026-05-15

Scope: merge `Yang/Develop_Web` + cherry-pick `zixuan` maquettes into local `main`. No push.

## Baseline

| branch | SHA | base | commits ahead | strategy |
|---|---|---|---|---|
| main | 2c7eb5f | — | — | target |
| Yang/Develop_Web | fa33bdf | 2c7eb5f (current main) | 1 | full merge (`--no-ff`) |
| zixuan | 92bbdcf | 251304b (T1 init, 38 commits behind) | 1 | **cherry-pick `docs/maquettes/*` only** |

zixuan full-merge rejected: its diff vs current main would delete the entire built project (package.json, all components, all pages, all tests, configs). Only additive value is the 5 maquette files under `docs/maquettes/`.

## Cross-branch file overlap

Yang and zixuan both touch `src/assets/hero-shanghai.svg` (Yang: deletes; zixuan: deletes from its old base). No semantic conflict since cherry-pick scope excludes that path.

No other file overlap between Yang and zixuan within the cherry-pick scope.

## Yang/Develop_Web — code-quality review

Source: `cavecrew-reviewer` agent on `git diff main..Yang/Develop_Web`.

- `src/components/Hero.astro:9` — accessibility: empty `alt` on hero image. Decorative vs content-bearing not disambiguated.
- `src/components/LangSwitcher.astro:47-52` — risk: document-scoped event listeners attached without dedup. If component island hydrates twice, duplicate handlers fire on click/keydown.
- `src/components/ProjectCard.astro:29` — risk: `data-project={project.slug}` injected into SVG pattern id without escaping. Special chars in slug break SVG.
- `src/data/testimonials.json:6,21,36` — UX bug: testimonial photo paths reassigned to `section-*.png` (generic media), not actual person avatars.
- `src/components/ProjectModal.astro:35` — risk: ``research-card-visual--${p.axis}`` builds class name from unsanitized data. Whitespace/special chars in `axis` will break the variant CSS hook.

Total: 2 bugs, 2 risks, 1 a11y nit. Non-blocking — none break build or break main's invariants.

## Yang/Develop_Web — consistency vs main conventions

Source: `cavecrew-investigator` agent.

Conventions preserved:
- `interface Props` pattern on touched components (Header, Footer, Hero, LangSwitcher, TestimonialCarousel)
- `getCollection('testimonials')` API usage
- i18n keys: all existing `src/i18n/ui.ts` keys preserved; no dangling references in untouched code

Major divergences (intentional redesign):
- **CSS strategy:** main uses Tailwind utility-first. Yang adds ~460 lines of semantic BEM (`.site-header`, `.page-rail`, `.project-card`, `.language-menu`, `.research-card-visual`) in `src/styles/global.css`. Mixed Tailwind + BEM going forward.
- **ProjectCard / ProjectModal:** SVG-gradient visual system + 14-color hardcoded array + `index`-prop coupling. New pattern not present elsewhere.
- **LangSwitcher:** full BEM rewrite with `data-open` state attr, Esc/outside-click close, aria-haspopup/aria-expanded.
- **SidebarTOC:** rewritten using `.page-rail` BEM + `rootMargin -35%` (was -40%), adds `aria-current`.

A11y improvement: Yang systematically adds `aria-haspopup`, `aria-expanded`, `aria-current`.

New component: `src/components/SectionMedia.astro` — minimal, no imports, static class only. Consistent with simple-wrapper components.

## Yang/Develop_Web — build + test verification

Worktree `../wt-yang` checked out at `fa33bdf`. Ran `npm ci && npm run build && npm test`.

- `npm ci`: success (6 audit vulns, 5 moderate + 1 high — pre-existing in main, not Yang regression)
- `astro build`: ✓ 4 pages built (`/`, `/en/`, `/fr/`, `/zh/`, `/404.html`) in 1.01s
- `vitest run`: ✓ 3 test files, 12/12 tests passed

**Gate: PASS** — proceed to Phase C merge.

## zixuan — scope

Only `docs/maquettes/*` to be cherry-picked:
- `docs/maquettes/README.md`
- `docs/maquettes/utseus-arborescence.html`
- `docs/maquettes/utseus-arborescence.md`
- `docs/maquettes/utseus-maquettes-zh.html`
- `docs/maquettes/utseus-maquettes.css`

No code in scope → no quality review needed beyond manual sanity check.

## Decision log

- [x] Yang strategy: full merge `--no-ff`
- [x] zixuan strategy: cherry-pick `docs/maquettes/` only (full merge rejected as destructive)
- [x] Conflict policy: AI proposes resolution, user verifies
- [x] No push to origin

## Status

- Phase A (baseline): complete
- Phase B (review + verify): complete, gate PASS
- Phase C (merge Yang): pending
- Phase D (cherry-pick maquettes): pending
