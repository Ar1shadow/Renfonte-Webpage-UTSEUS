# Three-risk hardening — design

Date: 2026-05-15
Status: approved (pending implementation)

## Context

The post-merge code review of Yang/Develop_Web (see `docs/merge-report-2026-05-15.md`) flagged three risks:

1. `src/components/LangSwitcher.astro:47-52` — document-scoped event listeners attached inside a per-menu `forEach`. With N menus on a page, N pairs of listeners attach to `document`, all calling close on Escape; the pattern accumulates listeners and is brittle.
2. `src/components/ProjectCard.astro:29` — `id={`g-${project.slug}`}` interpolates `slug` into SVG element ids without validation. Special chars in a slug would break the SVG `url(#…)` reference.
3. `src/components/ProjectModal.astro:35` — class string ``research-card-visual--${p.axis}`` interpolates `axis` into a class name without validation. Whitespace or special chars would break the variant CSS hook.

Risks 2 and 3 are theoretical in the current architecture: project data lives in a committed JSON file (`src/data/projects.json`), validated at build time by the content collections zod schema. The `axis` field is already constrained to a zod enum, so risk 3 is not exploitable today. The `slug` field is `z.string()`, which is wider than the de-facto kebab-case slugs in the data — that gap is the real concern. Risk 1 is real-but-low: only one LangSwitcher per page today, but the pattern accumulates as written.

This design hardens the invariants at the data boundary and refactors the LangSwitcher script to a single document-level listener pair.

## Goals

- Make slug shape a build-time invariant, not a component implicit assumption.
- Lock the axis-enum invariant in a regression test that fails loudly if the schema or data drifts.
- Eliminate the per-menu document-listener accumulation in LangSwitcher.

## Non-goals

- Component-side sanitization in `ProjectCard.astro` or `ProjectModal.astro`. The invariants are enforced at the boundary; duplicating defense inside the component would hide the contract and let bad data silently mutate.
- Refactoring `index`-prop coupling in `ProjectCard` / `ProjectModal` (separate concern from the three flagged risks).
- Renaming SVG ids to be index-based; schema tightening is a more durable fix and preserves human-readable ids.

## Approach

### Layer 1 — schema tightening (data boundary)

In `src/content.config.ts`, change:

```ts
const projects = defineCollection({
  loader: file('src/data/projects.json'),
  schema: z.object({
    slug: z.string(),
    // …
  }),
});
```

to:

```ts
const projects = defineCollection({
  loader: file('src/data/projects.json'),
  schema: z.object({
    slug: z.string().regex(/^[a-z0-9-]+$/),
    // …
  }),
});
```

Build (`astro check` / `astro build`) will fail if any project slug ever violates the regex. No code change in `ProjectCard.astro` or `ProjectModal.astro`.

### Layer 2 — invariant test (`tests/projects-schema.test.ts`, new)

A Vitest test that:

1. Reads `src/data/projects.json` raw (`JSON.parse(readFileSync(…))`).
2. Asserts every entry's `axis` is one of `['modeling', 'safety', 'logistics', 'smart-buildings', 'culture']`.
3. Asserts every entry's `slug` matches `/^[a-z0-9-]+$/`.
4. Asserts slug uniqueness across the dataset.

This test documents the invariants the component relies on. It fails before build if the data file diverges from the contract, giving a clearer error than a build-time schema error wrapped in Astro's tooling.

### Layer 3 — LangSwitcher script refactor

Replace the existing script in `src/components/LangSwitcher.astro`:

```ts
document.querySelectorAll<HTMLElement>('.language-menu').forEach((menu) => {
  // …
  document.addEventListener('click', /* … */);
  document.addEventListener('keydown', /* … */);
});
```

with one that collects menus first, then attaches exactly one `click` and one `keydown` listener at the document level:

```ts
const instances = Array.from(document.querySelectorAll<HTMLElement>('.language-menu'))
  .map((menu) => {
    const trigger = menu.querySelector<HTMLButtonElement>('[data-lang-trigger]');
    const list = menu.querySelector<HTMLElement>('[data-lang-menu]');
    if (!trigger || !list) return null;
    const close = () => {
      menu.dataset.open = 'false';
      trigger.setAttribute('aria-expanded', 'false');
    };
    trigger.addEventListener('click', () => {
      const open = menu.dataset.open === 'true';
      menu.dataset.open = String(!open);
      trigger.setAttribute('aria-expanded', String(!open));
    });
    return { menu, close };
  })
  .filter((x): x is { menu: HTMLElement; close: () => void } => x !== null);

document.addEventListener('click', (event) => {
  for (const { menu, close } of instances) {
    if (!menu.contains(event.target as Node)) close();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  for (const { close } of instances) close();
});
```

Behavior preserved for the single-menu case; multi-menu case no longer attaches N×2 document listeners.

## Files touched

- `src/content.config.ts` — tighten `projects.slug` regex.
- `tests/projects-schema.test.ts` — new test (3-4 assertions).
- `src/components/LangSwitcher.astro` — script block refactor only; markup unchanged.

## Verification

1. `npm run check` — Astro + zod schema check passes against current `src/data/projects.json`. All 14 current slugs (`traffic-models`, `camera-sensor-monitoring`, etc.) already match `[a-z0-9-]+`.
2. `npm test` — new test file passes alongside the existing 3 test files. Suite goes from 3 files / 12 tests to 4 files / (12 + N) tests where N is the count of `test()` blocks added (one per assertion group: axis enum, slug regex, slug uniqueness).
3. `npm run build` — succeeds. Build would fail if any slug violated the regex (intended).
4. Manual browser check on `/fr/`: click the language switcher button → menu opens. Click outside → closes. Press Esc → closes. `aria-expanded` toggles correctly. No console errors.
5. Negative regression check: temporarily inject `"slug": "Bad Slug!"` into `projects.json` → expect both the new test AND `astro check` to fail. Revert after.

## Out-of-scope follow-ups (not blocking)

- The 2 bugs and 1 a11y nit from the same merge report (Hero alt, testimonials.json photo paths, ProjectCard/index coupling) — track separately.
- Slug uniqueness check could move into the zod schema too (`z.array(...).refine(...)`) once Astro's content collection API exposes a way to validate cross-row constraints.
