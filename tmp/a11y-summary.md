# A11y Summary — T29 (axe-core 4.11.4 / chrome-headless)

Scanned built output via `npx http-server dist -p 8080 -s` then `@axe-core/cli`.

## Final results

| Page | Violations |
| --- | --- |
| http://localhost:8080/fr/ | 0 |
| http://localhost:8080/en/ | 0 |
| http://localhost:8080/zh/ | 0 |

## Issues found and fixed during T29

1. **`aria-allowed-role` (14×/page)** — `ProjectCard` rendered as `<article role="button">`. ARIA forbids `role="button"` on `<article>`. Fix: changed wrapper to `<div role="button" tabindex="0" aria-label=…>`.
2. **`scrollable-region-focusable` (1×/page)** — `TestimonialCarousel`'s horizontally-scrolling `<ol>` had no keyboard access. Fix: added `tabindex="0"` to the `<ol>`. (Tried `role="region"` — not allowed on `<ol>` per `aria-allowed-role`; dropped, since `tabindex` alone satisfies the rule and preserves list semantics.)

## Outstanding items

None from automated scan. Per the axe-core CLI footer, automated tooling catches only 20–50 % of a11y issues; manual keyboard / screen-reader passes are still recommended before launch.

## Manual checks performed

- Skip-link (`<a href="#content">`) inserted in `BaseLayout.astro`, hidden via `sr-only` and revealed on `:focus`.
- `ProjectCard` is now keyboard-focusable; `Enter` and `Space` open the project dialog (handler in `ProjectModal.astro`).
