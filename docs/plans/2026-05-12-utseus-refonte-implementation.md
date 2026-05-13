# UTSEUS Refonte Implementation Plan (Pengcheng dev scope)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static, multilingual (EN/FR/ZH), Astro-powered refonte of the UTSEUS subpage, deployable as a `dist/` drop on UTC Apache. Fallback for course demo: local `npm run preview`.

**Architecture:** Astro 5 + MDX content collections + JSON data collections + Tailwind. File-based i18n routing under `/en/`, `/fr/`, `/zh/`. Header/footer cloned from UTC original. Static build, no runtime backend.

**Tech Stack:** Astro 5, MDX, Tailwind CSS, TypeScript, Vitest (for i18n utils), Playwright (optional smoke), linkinator (link audit), GitHub Actions (optional CI).

**Spec:** [`docs/specs/2026-05-12-utseus-refonte-design.md`](../specs/2026-05-12-utseus-refonte-design.md)

**Scope note:** This plan covers the **development/contenu** workstream (Pengcheng). Zixuan's Figma maquettes + design tokens, and Yang's content writing + link audit fill, are tracked in `OWNERS.md` and spec §9 — they are inputs to this plan, not tasks of it.

**Testing approach:** TDD with Vitest applied to pure logic (i18n utils, link audit filter, lang-switcher URL helper). Visual Astro components are verified by `npm run dev` + manual browser check + Lighthouse + Playwright smoke at end. Acknowledged trade-off: full visual TDD is too heavy for course timeline.

**Decision locks (from spec):**
- Styling: **Tailwind CSS** (locked here; spec deadline 2026-05-15)
- Default locale: `/fr/`
- Locales: `en`, `fr`, `zh`

---

## File Structure (created across tasks)

```
refonteWEB/
├── astro.config.mjs                         # T1, updated T2, T3
├── (no tailwind.config — Tailwind v4 CSS-first via @theme in global.css)
├── tsconfig.json                            # T1
├── package.json                             # T1
├── vitest.config.ts                         # T8
├── src/
│   ├── content/
│   │   ├── config.ts                        # T7
│   │   └── sections/{en,fr,zh}/{01..05}.mdx # T23 (content fills by Yang)
│   ├── data/
│   │   ├── projects.json                    # T24
│   │   ├── testimonials.json                # T24
│   │   ├── programs.json                    # T24
│   │   └── key-figures.json                 # T11
│   ├── i18n/
│   │   ├── ui.ts                            # T8
│   │   └── utils.ts                         # T8
│   ├── layouts/
│   │   └── BaseLayout.astro                 # T6
│   ├── components/
│   │   ├── Header.astro                     # T4
│   │   ├── Footer.astro                     # T5
│   │   ├── Hero.astro                       # T10
│   │   ├── KeyFiguresGrid.astro             # T11
│   │   ├── SectionBlock.astro               # T12
│   │   ├── SidebarTOC.astro                 # T13
│   │   ├── LangSwitcher.astro               # T14
│   │   ├── ProgramCard.astro                # T16
│   │   ├── ProgramFilter.astro              # T16
│   │   ├── ProjectCard.astro                # T17
│   │   ├── ProjectModal.astro               # T17
│   │   ├── TestimonialCarousel.astro        # T18
│   │   ├── VideoEmbed.astro                 # T19
│   │   ├── Gallery.astro                    # T20
│   │   ├── Accordion.astro                  # T21
│   │   └── ContactCard.astro                # T22
│   ├── pages/
│   │   ├── index.astro                      # T9 (redirect → /fr/)
│   │   ├── en/index.astro                   # T9 → fleshed T23
│   │   ├── fr/index.astro                   # T9 → fleshed T23
│   │   └── zh/index.astro                   # T9 → fleshed T23
│   └── styles/
│       ├── global.css                       # T3
│       └── (tokens live inline in global.css @theme; updated in T15)
├── tests/
│   ├── i18n.test.ts                         # T8
│   ├── lang-switcher.test.ts                # T14
│   └── link-audit.test.ts                   # T26
├── scripts/
│   └── audit-links.mjs                      # T26
├── public/
│   ├── images/                              # Yang/Pengcheng
│   ├── videos/
│   ├── docs/                                # brochures
│   ├── .htaccess                            # T31 (UTC deploy)
│   └── 404.html                             # T31
├── .github/workflows/build.yml              # T34 (optional)
└── docs/
    ├── specs/2026-05-12-utseus-refonte-design.md
    ├── plans/2026-05-12-utseus-refonte-implementation.md   # this file
    └── CONTENT_EDIT_GUIDE.md                # T35
```

---

## Week 1 — Setup + Skeleton

### Task 1: Initialize Astro project in-place

**Files:**
- Create: `astro.config.mjs`, `package.json`, `tsconfig.json`, `src/env.d.ts`

- [ ] **Step 1: Run Astro init non-interactively in current dir**

```bash
npm create astro@latest . -- --template minimal --typescript strict --install --no-git --skip-houston --yes
```

Expected: installs Astro 5.x, creates `astro.config.mjs`, `package.json`, `tsconfig.json`, `src/pages/index.astro`. No git re-init (repo already exists).

- [ ] **Step 2: Verify dev server starts**

```bash
npm run dev -- --port 4321 &
sleep 3
curl -s http://localhost:4321/ | grep -i "astro"
kill %1
```

Expected: HTML returned containing Astro markers.

- [ ] **Step 3: Delete the boilerplate index page (will rebuild in T9)**

```bash
rm src/pages/index.astro
```

- [ ] **Step 4: Commit**

```bash
git add astro.config.mjs package.json package-lock.json tsconfig.json src/env.d.ts
git rm -f src/pages/.gitkeep src/pages/en/.gitkeep src/pages/fr/.gitkeep src/pages/zh/.gitkeep 2>/dev/null || true
git commit -m "chore(astro): init project (T1)"
```

---

### Task 2: Configure i18n routing

**Files:**
- Modify: `astro.config.mjs`

- [ ] **Step 1: Edit `astro.config.mjs`**

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.utc.fr',           // update when domain confirmed
  base: '/',
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en', 'zh'],
    routing: {
      prefixDefaultLocale: true,         // always prefix, even default
      redirectToDefaultLocale: true,
    },
    fallback: { en: 'fr', zh: 'fr' },
  },
});
```

- [ ] **Step 2: Re-create `src/pages/index.astro` as redirect to default locale**

```astro
---
// src/pages/index.astro
return Astro.redirect('/fr/');
---
```

- [ ] **Step 3: Verify routing**

```bash
npm run dev -- --port 4321 &
sleep 3
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" http://localhost:4321/
kill %1
```

Expected: `301 http://localhost:4321/fr/` (or 302 — both OK).

- [ ] **Step 4: Commit**

```bash
git add astro.config.mjs src/pages/index.astro
git commit -m "feat(i18n): configure routing for en/fr/zh, default fr (T2)"
```

---

### Task 3: Add Tailwind CSS

**Files:**
- Create: `tailwind.config.mjs`, `src/styles/global.css`
- Modify: `astro.config.mjs`

- [ ] **Step 1: Install Tailwind integration**

```bash
npx astro add tailwind --yes
```

Expected: installs `@astrojs/tailwind` + `tailwindcss`, creates `tailwind.config.mjs`, updates `astro.config.mjs`.

- [ ] **Step 2: Create `src/styles/global.css`**

```css
/* src/styles/global.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* tokens filled in T15 from Figma */
  --color-bg: #ffffff;
  --color-fg: #1a1a1a;
  --color-accent: #c0142a;     /* placeholder UTC red */
  --font-sans: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}

html { font-family: var(--font-sans); }
body { background: var(--color-bg); color: var(--color-fg); }
```

- [ ] **Step 3: Edit `tailwind.config.mjs` to extend theme**

```js
// tailwind.config.mjs
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        fg: 'var(--color-fg)',
        accent: 'var(--color-accent)',
      },
      fontFamily: { sans: 'var(--font-sans)' },
    },
  },
  plugins: [],
};
```

- [ ] **Step 4: Verify dev server starts without errors**

```bash
npm run build 2>&1 | tail -10
```

Expected: `Complete!` line, no Tailwind errors.

- [ ] **Step 5: Commit**

```bash
git add tailwind.config.mjs astro.config.mjs src/styles/global.css package.json package-lock.json
git commit -m "feat(style): add tailwind + design token CSS vars (T3)"
```

---

### Task 4: Scrape + componentize UTC header

**Files:**
- Create: `src/components/Header.astro`

- [ ] **Step 1: Save the original page HTML for reference**

```bash
mkdir -p tmp
curl -sL "https://www.utc.fr/en/international-relations/the-sino-french-institute-in-engineering-utseus-at-the-university-of-shanghai/" -o tmp/utc-original.html
grep -c "<header" tmp/utc-original.html
```

Expected: ≥ 1 (header element exists).

- [ ] **Step 2: Extract `<header>...</header>` block manually**

Open `tmp/utc-original.html` in editor; locate the header tag (top of `<body>` typically). Copy entire `<header>` element including nested nav.

- [ ] **Step 3: Create `src/components/Header.astro` mirroring structure**

```astro
---
// src/components/Header.astro
import LangSwitcher from './LangSwitcher.astro';
const { lang = 'fr' } = Astro.props;
---
<header class="utc-header bg-bg border-b border-fg/10">
  <div class="mx-auto max-w-7xl flex items-center justify-between px-4 py-3">
    <a href={`/${lang}/`} class="flex items-center gap-2">
      <img src="/images/logo-utseus.svg" alt="UTSEUS" class="h-10" />
    </a>
    <nav aria-label="Main">
      <ul class="hidden md:flex gap-6 text-sm">
        <li><a href="#about">About</a></li>
        <li><a href="#mobility">Mobility</a></li>
        <li><a href="#complexcity">Lab</a></li>
        <li><a href="#projects">Projects</a></li>
        <li><a href="#testimonials">Voices</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
    <div class="flex items-center gap-4">
      <LangSwitcher current={lang} />
      <a href="/docs/brochure-utseus.pdf" class="hidden sm:inline-block px-3 py-1 bg-accent text-white text-sm rounded">Brochure</a>
    </div>
  </div>
</header>
```

Note: nav labels are placeholders; T8 (`ui.ts`) replaces with translated keys; revisit in T23.

- [ ] **Step 4: Commit**

```bash
git add src/components/Header.astro tmp/utc-original.html
git commit -m "feat(ui): add Header component scaffolded from UTC original (T4)"
```

---

### Task 5: Scrape + componentize UTC footer

**Files:**
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Locate footer in `tmp/utc-original.html`**

Find the `<footer>` element near end of `<body>`.

- [ ] **Step 2: Create `src/components/Footer.astro` (trimmed clone)**

```astro
---
// src/components/Footer.astro
const { lang = 'fr' } = Astro.props;
const year = new Date().getFullYear();
---
<footer class="utc-footer bg-fg text-bg mt-16">
  <div class="mx-auto max-w-7xl px-4 py-10 grid gap-8 md:grid-cols-3">
    <section>
      <h3 class="font-bold mb-2">UTC</h3>
      <address class="not-italic text-sm">
        Université de Technologie de Compiègne<br/>
        Rue du Dr Schweitzer, 60200 Compiègne, France
      </address>
    </section>
    <section>
      <h3 class="font-bold mb-2">UTSEUS</h3>
      <p class="text-sm">Shanghai University, 99 Shangda Road, 200444 Shanghai</p>
    </section>
    <section>
      <h3 class="font-bold mb-2">Links</h3>
      <ul class="text-sm space-y-1">
        <li><a href="https://www.utc.fr">utc.fr</a></li>
        <li><a href="https://en.utseus.com">utseus.com</a></li>
      </ul>
    </section>
  </div>
  <div class="text-center text-xs py-4 border-t border-bg/10">© {year} UTC × UTSEUS</div>
</footer>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat(ui): add Footer component (trimmed UTC clone) (T5)"
```

---

### Task 6: BaseLayout

**Files:**
- Create: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Create the layout**

```astro
---
// src/layouts/BaseLayout.astro
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
  lang: 'en' | 'fr' | 'zh';
  ogImage?: string;
}
const { title, description = '', lang, ogImage = '/images/og-default.jpg' } = Astro.props;
---
<!doctype html>
<html lang={lang}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={ogImage} />
    <link rel="alternate" hreflang="en" href={`/en/`} />
    <link rel="alternate" hreflang="fr" href={`/fr/`} />
    <link rel="alternate" hreflang="zh" href={`/zh/`} />
  </head>
  <body>
    <Header lang={lang} />
    <main id="content"><slot /></main>
    <Footer lang={lang} />
  </body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat(layout): add BaseLayout with header, footer, hreflang (T6)"
```

---

### Task 7: Content collection schemas

**Files:**
- Create: `src/content/config.ts`

- [ ] **Step 1: Write the schemas**

```ts
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const sectionId = z.enum(['hero','about','mobility','complexcity','projects','testimonials','contact']);
const langTriad = z.object({
  en: z.string(),
  fr: z.string(),
  zh: z.string(),
});

const sections = defineCollection({
  type: 'content',
  schema: z.object({
    id: sectionId,
    order: z.number().int().min(1),
    title: z.string(),
    lang: z.enum(['en','fr','zh']),
    hero_image: z.string().optional(),
  }),
});

const projects = defineCollection({
  type: 'data',
  schema: z.object({
    slug: z.string(),
    title: langTriad,
    description: langTriad,
    axis: z.enum(['modeling','safety','logistics','smart-buildings','culture']),
    image: z.string(),
    links: z.array(z.object({ label: z.string(), url: z.string().url() })).optional(),
  }),
});

const testimonials = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    promo: z.string(),
    program: z.string(),
    photo: z.string(),
    quote: langTriad,
    year: z.number().int(),
  }),
});

const programs = defineCollection({
  type: 'data',
  schema: z.object({
    slug: z.string(),
    audience: z.enum(['chinese-students','french-students']),
    title: langTriad,
    description: langTriad,
    duration: z.string(),
    icon: z.string().optional(),
  }),
});

export const collections = { sections, projects, testimonials, programs };
```

- [ ] **Step 2: Verify type-check passes**

```bash
npx astro check 2>&1 | tail -10
```

Expected: 0 errors related to `src/content/config.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/content/config.ts
git commit -m "feat(content): define zod schemas for sections, projects, testimonials, programs (T7)"
```

---

### Task 8: i18n utils + Vitest setup (TDD)

**Files:**
- Create: `src/i18n/ui.ts`, `src/i18n/utils.ts`, `tests/i18n.test.ts`, `vitest.config.ts`

- [ ] **Step 1: Install Vitest**

```bash
npm install -D vitest @types/node
```

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: { globals: true, environment: 'node', include: ['tests/**/*.test.ts'] },
});
```

Add scripts in `package.json`:
```json
"scripts": {
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 3: Write failing test `tests/i18n.test.ts`**

```ts
// tests/i18n.test.ts
import { describe, it, expect } from 'vitest';
import { getLangFromUrl, useTranslations, switchLangUrl } from '../src/i18n/utils';

describe('getLangFromUrl', () => {
  it('returns lang from /en/ path', () => {
    expect(getLangFromUrl(new URL('https://x/en/'))).toBe('en');
  });
  it('returns lang from /fr/ path', () => {
    expect(getLangFromUrl(new URL('https://x/fr/foo'))).toBe('fr');
  });
  it('returns lang from /zh/ path', () => {
    expect(getLangFromUrl(new URL('https://x/zh/'))).toBe('zh');
  });
  it('falls back to fr when no lang prefix', () => {
    expect(getLangFromUrl(new URL('https://x/'))).toBe('fr');
  });
});

describe('useTranslations', () => {
  it('returns key in chosen lang', () => {
    const t = useTranslations('fr');
    expect(t('nav.about')).toBe('À propos');
  });
  it('falls back to fr when key missing in lang', () => {
    const t = useTranslations('zh');
    expect(typeof t('nav.about')).toBe('string');
  });
});

describe('switchLangUrl', () => {
  it('replaces /fr/ with /en/', () => {
    expect(switchLangUrl('/fr/#about', 'en')).toBe('/en/#about');
  });
  it('preserves hash + query', () => {
    expect(switchLangUrl('/fr/?x=1#about', 'zh')).toBe('/zh/?x=1#about');
  });
});
```

- [ ] **Step 4: Run test — must fail**

```bash
npm test
```

Expected: FAIL with `Cannot find module ../src/i18n/utils`.

- [ ] **Step 5: Implement `src/i18n/ui.ts`**

```ts
// src/i18n/ui.ts
export const languages = { en: 'English', fr: 'Français', zh: '中文' } as const;
export const defaultLang = 'fr' as const;
export type Lang = keyof typeof languages;

export const ui = {
  fr: {
    'nav.about': 'À propos',
    'nav.mobility': 'Mobilité',
    'nav.complexcity': 'Laboratoire',
    'nav.projects': 'Projets',
    'nav.testimonials': 'Témoignages',
    'nav.contact': 'Contact',
    'cta.brochure': 'Brochure',
  },
  en: {
    'nav.about': 'About',
    'nav.mobility': 'Mobility',
    'nav.complexcity': 'Lab',
    'nav.projects': 'Projects',
    'nav.testimonials': 'Voices',
    'nav.contact': 'Contact',
    'cta.brochure': 'Brochure',
  },
  zh: {
    'nav.about': '关于',
    'nav.mobility': '交流项目',
    'nav.complexcity': '实验室',
    'nav.projects': '项目',
    'nav.testimonials': '学生反馈',
    'nav.contact': '联系',
    'cta.brochure': '宣传册',
  },
} satisfies Record<Lang, Record<string, string>>;
```

- [ ] **Step 6: Implement `src/i18n/utils.ts`**

```ts
// src/i18n/utils.ts
import { ui, defaultLang, type Lang } from './ui';

export function getLangFromUrl(url: URL): Lang {
  const [, seg] = url.pathname.split('/');
  if (seg === 'en' || seg === 'fr' || seg === 'zh') return seg;
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: keyof typeof ui[typeof defaultLang]): string {
    return (ui[lang] as any)[key] ?? ui[defaultLang][key] ?? String(key);
  };
}

export function switchLangUrl(pathWithHashQuery: string, target: Lang): string {
  return pathWithHashQuery.replace(/^\/(en|fr|zh)(\/|$)/, `/${target}$2`);
}
```

- [ ] **Step 7: Re-run test — must pass**

```bash
npm test
```

Expected: 3 describe blocks, all assertions pass.

- [ ] **Step 8: Commit**

```bash
git add src/i18n/ui.ts src/i18n/utils.ts tests/i18n.test.ts vitest.config.ts package.json package-lock.json
git commit -m "feat(i18n): add ui dictionary + utils with vitest (TDD) (T8)"
```

---

### Task 9: Stub locale pages

**Files:**
- Create: `src/pages/en/index.astro`, `src/pages/fr/index.astro`, `src/pages/zh/index.astro`

- [ ] **Step 1: Create each page (minimal)**

```astro
---
// src/pages/fr/index.astro
import BaseLayout from '../../layouts/BaseLayout.astro';
---
<BaseLayout lang="fr" title="UTSEUS — Institut sino-français en ingénierie" description="UTSEUS, le premier institut sino-français en ingénierie, basé à l'Université de Shanghai.">
  <h1 class="text-3xl p-8">UTSEUS — bientôt</h1>
</BaseLayout>
```

Repeat for `en` (title "UTSEUS — Sino-French Institute in Engineering") and `zh` (title "UTSEUS — 中法工程师学院").

- [ ] **Step 2: Build + smoke test all 3 routes**

```bash
npm run build
ls dist/en/index.html dist/fr/index.html dist/zh/index.html
```

Expected: all 3 files exist.

- [ ] **Step 3: Commit**

```bash
git add src/pages/
git commit -m "feat(pages): stub /en, /fr, /zh index pages (T9)"
```

---

## Week 2 — Core components + tokens

### Task 10: Hero component

**Files:**
- Create: `src/components/Hero.astro`

- [ ] **Step 1: Implement**

```astro
---
// src/components/Hero.astro
import { useTranslations, type Lang } from '../i18n/ui';
interface Props { lang: Lang; title: string; tagline: string; }
const { lang, title, tagline } = Astro.props;
---
<section id="hero" class="relative isolate overflow-hidden bg-bg">
  <div class="absolute inset-0 -z-10">
    <img src="/images/hero-shanghai.jpg" alt="" class="w-full h-full object-cover opacity-40" />
  </div>
  <div class="mx-auto max-w-6xl px-4 py-24 md:py-32">
    <h1 class="text-4xl md:text-6xl font-bold leading-tight">{title}</h1>
    <p class="mt-4 text-lg md:text-xl max-w-2xl">{tagline}</p>
    <div class="mt-8 flex gap-4">
      <a href="#about" class="px-5 py-3 bg-accent text-white rounded">Discover →</a>
      <a href="/docs/brochure-utseus.pdf" class="px-5 py-3 border border-fg rounded">Brochure</a>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Use it in `src/pages/fr/index.astro` to smoke-check**

Insert `<Hero lang="fr" title="UTSEUS" tagline="Premier institut sino-français en ingénierie" />` between the BaseLayout tags.

```bash
npm run build && grep -l "UTSEUS" dist/fr/index.html
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Hero.astro src/pages/fr/index.astro
git commit -m "feat(ui): add Hero component (T10)"
```

---

### Task 11: KeyFiguresGrid component + data

**Files:**
- Create: `src/data/key-figures.json`, `src/components/KeyFiguresGrid.astro`

- [ ] **Step 1: Create data**

```json
[
  { "value": "1200+", "label": { "en": "students per year", "fr": "étudiants par an", "zh": "在校学生每年" } },
  { "value": "2005", "label": { "en": "founded",            "fr": "fondé en",         "zh": "成立于" } },
  { "value": "14",    "label": { "en": "research projects", "fr": "projets de recherche", "zh": "研究项目" } },
  { "value": "5",     "label": { "en": "application areas", "fr": "domaines d'application", "zh": "应用领域" } }
]
```

- [ ] **Step 2: Component**

```astro
---
// src/components/KeyFiguresGrid.astro
import figures from '../data/key-figures.json';
import type { Lang } from '../i18n/ui';
const { lang } = Astro.props as { lang: Lang };
---
<ul class="grid grid-cols-2 md:grid-cols-4 gap-6">
  {figures.map(f => (
    <li class="p-6 rounded bg-fg/5 text-center">
      <div class="text-4xl font-bold text-accent">{f.value}</div>
      <div class="mt-2 text-sm">{f.label[lang]}</div>
    </li>
  ))}
</ul>
```

- [ ] **Step 3: Build + verify**

```bash
npm run build 2>&1 | tail -3
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/data/key-figures.json src/components/KeyFiguresGrid.astro
git commit -m "feat(ui): KeyFiguresGrid + data (T11)"
```

---

### Task 12: SectionBlock wrapper

**Files:**
- Create: `src/components/SectionBlock.astro`

- [ ] **Step 1: Implement**

```astro
---
// src/components/SectionBlock.astro
interface Props { id: string; title: string; eyebrow?: string; }
const { id, title, eyebrow } = Astro.props;
---
<section id={id} class="scroll-mt-24 py-16 md:py-24">
  <div class="mx-auto max-w-6xl px-4">
    {eyebrow && <p class="text-sm uppercase tracking-wide text-accent">{eyebrow}</p>}
    <h2 class="text-3xl md:text-4xl font-bold mb-8">{title}</h2>
    <div class="prose max-w-none">
      <slot />
    </div>
  </div>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SectionBlock.astro
git commit -m "feat(ui): SectionBlock wrapper (T12)"
```

---

### Task 13: SidebarTOC

**Files:**
- Create: `src/components/SidebarTOC.astro`

- [ ] **Step 1: Implement (uses `IntersectionObserver` to highlight active)**

```astro
---
// src/components/SidebarTOC.astro
import { useTranslations, type Lang } from '../i18n/ui';
const { lang } = Astro.props as { lang: Lang };
const t = useTranslations(lang);
const items = [
  { id: 'about', label: t('nav.about') },
  { id: 'mobility', label: t('nav.mobility') },
  { id: 'complexcity', label: t('nav.complexcity') },
  { id: 'projects', label: t('nav.projects') },
  { id: 'testimonials', label: t('nav.testimonials') },
  { id: 'contact', label: t('nav.contact') },
];
---
<nav aria-label="On-page" class="hidden lg:block sticky top-24 max-h-[80vh] overflow-y-auto pr-4">
  <ul class="space-y-2 text-sm">
    {items.map(it => (
      <li><a data-toc href={`#${it.id}`} class="text-fg/70 hover:text-accent">{it.label}</a></li>
    ))}
  </ul>
</nav>
<script>
  const links = document.querySelectorAll('[data-toc]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.toggle('text-accent', l.getAttribute('href') === `#${e.target.id}`));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  document.querySelectorAll('section[id]').forEach(s => obs.observe(s));
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SidebarTOC.astro
git commit -m "feat(ui): SidebarTOC with active-section highlight (T13)"
```

---

### Task 14: LangSwitcher (TDD on URL helper)

**Files:**
- Create: `src/components/LangSwitcher.astro`, `tests/lang-switcher.test.ts`

- [ ] **Step 1: Failing test**

```ts
// tests/lang-switcher.test.ts
import { describe, it, expect } from 'vitest';
import { buildSwitcherTargets } from '../src/i18n/utils';

describe('buildSwitcherTargets', () => {
  it('builds 3 targets from /fr/#about', () => {
    expect(buildSwitcherTargets('/fr/#about')).toEqual([
      { lang: 'fr', url: '/fr/#about' },
      { lang: 'en', url: '/en/#about' },
      { lang: 'zh', url: '/zh/#about' },
    ]);
  });
});
```

- [ ] **Step 2: Run — fails**

```bash
npm test
```

Expected: FAIL `buildSwitcherTargets is not a function`.

- [ ] **Step 3: Append to `src/i18n/utils.ts`**

```ts
import { languages } from './ui';

export function buildSwitcherTargets(pathWithHashQuery: string) {
  return (Object.keys(languages) as Lang[]).map(l => ({
    lang: l,
    url: switchLangUrl(pathWithHashQuery, l),
  })).sort((a, b) => (['fr','en','zh'].indexOf(a.lang) - ['fr','en','zh'].indexOf(b.lang)));
}
```

Also export `Lang` from utils if not yet: `export type { Lang } from './ui';`.

- [ ] **Step 4: Run — pass**

```bash
npm test
```

- [ ] **Step 5: Component using helper**

```astro
---
// src/components/LangSwitcher.astro
import { buildSwitcherTargets, languages, type Lang } from '../i18n/utils';
import { languages as labels } from '../i18n/ui';
const { current } = Astro.props as { current: Lang };
const path = Astro.url.pathname + Astro.url.search + Astro.url.hash;
const targets = buildSwitcherTargets(path);
---
<div class="relative group">
  <button class="text-sm">🌐 {labels[current]}</button>
  <ul class="absolute right-0 hidden group-hover:block bg-bg border border-fg/10 rounded shadow p-2">
    {targets.map(t => (
      <li><a href={t.url} class={t.lang === current ? 'font-bold' : ''}>{labels[t.lang]}</a></li>
    ))}
  </ul>
</div>
```

- [ ] **Step 6: Commit**

```bash
git add src/i18n/utils.ts src/components/LangSwitcher.astro tests/lang-switcher.test.ts
git commit -m "feat(i18n): LangSwitcher with anchor-preserving target builder (TDD) (T14)"
```

---

### Task 15: Integrate Figma design tokens

**Tailwind v4 note:** T3 installed Tailwind v4 (`@tailwindcss/vite` + CSS-first `@theme` config). There is no `tailwind.config.mjs` to edit; tokens live in the `@theme` block of `src/styles/global.css`. Tailwind utilities derive automatically from `--color-*`, `--font-*`, `--radius-*`, `--shadow-*`, `--spacing-*` namespaces.

**Files:**
- Modify: `src/styles/global.css`

**Prereq:** Zixuan delivers Figma tokens (colors, type, spacing) — gate this task on that input. If delayed, ship with placeholder values from T3 and re-run this task when ready.

- [ ] **Step 1: Replace `@theme` block in `src/styles/global.css` with full Figma token map**

```css
@import "tailwindcss";

@theme {
  /* Colors */
  --color-bg: #ffffff;
  --color-fg: #121212;
  --color-accent: #c0142a;
  --color-accent-soft: #fde8eb;
  --color-muted: #6b7280;

  /* Typography */
  --font-sans: "Inter", system-ui, sans-serif;
  --font-display: "Inter", system-ui, sans-serif;

  /* Radii */
  --radius-sm: 4px;
  --radius-md: 8px;

  /* Shadows */
  --shadow-card: 0 2px 8px rgba(0,0,0,0.06);
}

body { background: var(--color-bg); color: var(--color-fg); }
```

This generates utilities: `bg-bg`, `bg-fg`, `bg-accent`, `bg-accent-soft`, `bg-muted`, `text-*` variants, `font-sans`, `font-display`, `rounded-sm`, `rounded-md`, `shadow-card`.

For per-step **spacing tokens** in v4, prefer Tailwind's built-in spacing scale (it auto-generates `--spacing-*` for all numeric utilities). Override only if Figma uses non-standard spacing values; in that case add `--spacing-1: 0.25rem;` etc. inside `@theme`.

- [ ] **Step 2: Build + smoke**

```bash
npm run check && npm run build 2>&1 | tail -3
```

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat(style): integrate Figma design tokens (T15)"
```

---

## Week 3 — Content components

### Task 16: ProgramCard + ProgramFilter

**Files:**
- Create: `src/components/ProgramCard.astro`, `src/components/ProgramFilter.astro`

- [ ] **Step 1: ProgramCard**

```astro
---
// src/components/ProgramCard.astro
import type { Lang } from '../i18n/ui';
interface Props { program: any; lang: Lang; }
const { program, lang } = Astro.props;
---
<article class="p-6 rounded-md bg-bg shadow-card border border-fg/5 flex flex-col gap-3" data-audience={program.audience}>
  {program.icon && <img src={program.icon} alt="" class="h-12" />}
  <h3 class="text-xl font-bold">{program.title[lang]}</h3>
  <p class="text-sm">{program.description[lang]}</p>
  <p class="text-xs text-muted">⏱ {program.duration}</p>
</article>
```

- [ ] **Step 2: ProgramFilter (vanilla JS, no framework)**

```astro
---
// src/components/ProgramFilter.astro
import { getCollection } from 'astro:content';
import ProgramCard from './ProgramCard.astro';
import type { Lang } from '../i18n/ui';
const { lang } = Astro.props as { lang: Lang };
const programs = await getCollection('programs');
---
<div class="space-y-6">
  <div class="flex gap-2" role="tablist">
    <button data-filter="all" aria-selected="true" class="px-3 py-1 rounded border border-fg/20">All</button>
    <button data-filter="chinese-students" class="px-3 py-1 rounded border border-fg/20">For Chinese students</button>
    <button data-filter="french-students" class="px-3 py-1 rounded border border-fg/20">For French students</button>
  </div>
  <div class="grid md:grid-cols-2 gap-6" id="programs-grid">
    {programs.map(p => <ProgramCard program={p.data} lang={lang} />)}
  </div>
</div>
<script>
  const grid = document.getElementById('programs-grid')!;
  document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      const f = (btn as HTMLElement).dataset.filter!;
      document.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-selected', String(b === btn)));
      grid.querySelectorAll<HTMLElement>('[data-audience]').forEach(card => {
        card.style.display = (f === 'all' || card.dataset.audience === f) ? '' : 'none';
      });
    });
  });
</script>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ProgramCard.astro src/components/ProgramFilter.astro
git commit -m "feat(ui): ProgramCard + ProgramFilter (T16)"
```

---

### Task 17: ProjectCard + ProjectModal

**Files:**
- Create: `src/components/ProjectCard.astro`, `src/components/ProjectModal.astro`

- [ ] **Step 1: ProjectCard**

```astro
---
// src/components/ProjectCard.astro
import type { Lang } from '../i18n/ui';
interface Props { project: any; lang: Lang; }
const { project, lang } = Astro.props;
---
<article class="group rounded overflow-hidden bg-bg shadow-card cursor-pointer" data-project={project.slug}>
  <img src={project.image} alt="" class="aspect-video object-cover w-full" loading="lazy" />
  <div class="p-4">
    <p class="text-xs uppercase tracking-wide text-accent">{project.axis}</p>
    <h3 class="text-lg font-bold mt-1">{project.title[lang]}</h3>
  </div>
</article>
```

- [ ] **Step 2: ProjectModal (uses HTML `<dialog>`)**

```astro
---
// src/components/ProjectModal.astro
import { getCollection } from 'astro:content';
import ProjectCard from './ProjectCard.astro';
import type { Lang } from '../i18n/ui';
const { lang } = Astro.props as { lang: Lang };
const projects = await getCollection('projects');
---
<div class="grid md:grid-cols-3 gap-6">
  {projects.map(p => <ProjectCard project={p.data} lang={lang} />)}
</div>

<dialog id="project-dialog" class="rounded-md p-0 backdrop:bg-black/40 max-w-2xl w-[90vw]">
  <article class="p-6">
    <button id="dialog-close" class="float-right text-xl" aria-label="Close">×</button>
    <img id="dialog-image" alt="" class="w-full aspect-video object-cover rounded" />
    <h3 id="dialog-title" class="text-2xl font-bold mt-4"></h3>
    <p id="dialog-desc" class="mt-2 text-base"></p>
    <ul id="dialog-links" class="mt-4 text-sm"></ul>
  </article>
</dialog>

<script define:vars={{ projectsData: projects.map(p => p.data), lang }}>
  const dlg = document.getElementById('project-dialog');
  const close = document.getElementById('dialog-close');
  close.addEventListener('click', () => dlg.close());
  document.querySelectorAll('[data-project]').forEach(card => {
    card.addEventListener('click', () => {
      const slug = card.getAttribute('data-project');
      const p = projectsData.find(x => x.slug === slug);
      if (!p) return;
      document.getElementById('dialog-image').src = p.image;
      document.getElementById('dialog-title').textContent = p.title[lang];
      document.getElementById('dialog-desc').textContent = p.description[lang];
      const linksEl = document.getElementById('dialog-links');
      linksEl.innerHTML = '';
      (p.links || []).forEach(l => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = l.url; a.textContent = l.label; a.className = 'text-accent underline';
        a.rel = 'noopener'; a.target = '_blank';
        li.appendChild(a); linksEl.appendChild(li);
      });
      dlg.showModal();
    });
  });
</script>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ProjectCard.astro src/components/ProjectModal.astro
git commit -m "feat(ui): ProjectCard + native <dialog> ProjectModal (T17)"
```

---

### Task 18: TestimonialCarousel (CSS scroll-snap-x)

**Files:**
- Create: `src/components/TestimonialCarousel.astro`

- [ ] **Step 1: Implement**

```astro
---
// src/components/TestimonialCarousel.astro
import { getCollection } from 'astro:content';
import type { Lang } from '../i18n/ui';
const { lang } = Astro.props as { lang: Lang };
const items = await getCollection('testimonials');
---
<div class="relative">
  <ol class="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scroll-smooth" aria-label="Student testimonials">
    {items.map(t => (
      <li class="snap-start shrink-0 w-[80vw] md:w-[480px] p-6 bg-bg shadow-card rounded">
        <div class="flex items-center gap-3 mb-3">
          <img src={t.data.photo} alt="" class="w-12 h-12 rounded-full object-cover" />
          <div>
            <p class="font-bold">{t.data.name}</p>
            <p class="text-xs text-muted">{t.data.promo} · {t.data.program} · {t.data.year}</p>
          </div>
        </div>
        <blockquote class="italic">«{t.data.quote[lang]}»</blockquote>
      </li>
    ))}
  </ol>
</div>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/TestimonialCarousel.astro
git commit -m "feat(ui): TestimonialCarousel scroll-snap-x (T18)"
```

---

### Task 19: VideoEmbed (lazy YouTube)

**Files:**
- Create: `src/components/VideoEmbed.astro`

- [ ] **Step 1: Implement (uses click-to-load to avoid YT preload weight)**

```astro
---
// src/components/VideoEmbed.astro
interface Props { youtubeId: string; title: string; }
const { youtubeId, title } = Astro.props;
const thumb = `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
---
<div class="relative aspect-video bg-fg/10 rounded overflow-hidden" data-yt={youtubeId}>
  <img src={thumb} alt={title} class="absolute inset-0 w-full h-full object-cover" loading="lazy" />
  <button class="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-3xl" aria-label={`Play ${title}`}>▶</button>
</div>
<script>
  document.querySelectorAll('[data-yt]').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.getAttribute('data-yt');
      el.innerHTML = `<iframe class="absolute inset-0 w-full h-full" src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
    });
  });
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/VideoEmbed.astro
git commit -m "feat(ui): VideoEmbed click-to-load YouTube (T19)"
```

---

### Task 20: Gallery (basic lightbox)

**Files:**
- Create: `src/components/Gallery.astro`

- [ ] **Step 1: Implement**

```astro
---
// src/components/Gallery.astro
interface Props { images: { src: string; alt: string }[]; }
const { images } = Astro.props;
---
<div class="grid grid-cols-2 md:grid-cols-3 gap-2">
  {images.map(im => (
    <button class="aspect-square overflow-hidden" data-lightbox-src={im.src} data-lightbox-alt={im.alt}>
      <img src={im.src} alt={im.alt} class="w-full h-full object-cover hover:scale-105 transition" loading="lazy" />
    </button>
  ))}
</div>
<dialog id="lightbox" class="bg-transparent p-0 backdrop:bg-black/80">
  <img id="lightbox-img" alt="" class="max-w-[90vw] max-h-[90vh]" />
</dialog>
<script>
  const dlg = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  document.querySelectorAll('[data-lightbox-src]').forEach(btn => {
    btn.addEventListener('click', () => {
      img.src = btn.getAttribute('data-lightbox-src');
      img.alt = btn.getAttribute('data-lightbox-alt');
      dlg.showModal();
    });
  });
  dlg.addEventListener('click', () => dlg.close());
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Gallery.astro
git commit -m "feat(ui): Gallery with native dialog lightbox (T20)"
```

---

### Task 21: Accordion

**Files:**
- Create: `src/components/Accordion.astro`

- [ ] **Step 1: Implement (uses native `<details>`)**

```astro
---
// src/components/Accordion.astro
interface Item { title: string; body: string; }
const { items } = Astro.props as { items: Item[] };
---
<div class="divide-y divide-fg/10">
  {items.map(it => (
    <details class="py-3 group">
      <summary class="cursor-pointer font-bold flex justify-between items-center">
        <span>{it.title}</span>
        <span class="group-open:rotate-45 transition">+</span>
      </summary>
      <div class="mt-2 text-sm">{it.body}</div>
    </details>
  ))}
</div>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Accordion.astro
git commit -m "feat(ui): Accordion using native details (T21)"
```

---

### Task 22: ContactCard

**Files:**
- Create: `src/components/ContactCard.astro`

- [ ] **Step 1: Implement**

```astro
---
// src/components/ContactCard.astro
interface Props { name: string; role: string; email: string; photo?: string; }
const { name, role, email, photo } = Astro.props;
---
<article class="p-5 rounded bg-bg shadow-card flex gap-4 items-center">
  {photo && <img src={photo} alt="" class="w-16 h-16 rounded-full object-cover" />}
  <div>
    <p class="font-bold">{name}</p>
    <p class="text-sm text-muted">{role}</p>
    <a href={`mailto:${email}`} class="text-sm text-accent underline">{email}</a>
  </div>
</article>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ContactCard.astro
git commit -m "feat(ui): ContactCard (T22)"
```

---

## Week 4 — Integration

### Task 23: Compose locale pages with all sections + MDX

**Files:**
- Modify: `src/pages/{en,fr,zh}/index.astro`
- Create: `src/content/sections/{en,fr,zh}/{01-about,02-mobility,03-complexcity,04-projects,05-contact}.mdx`

- [ ] **Step 1: Create stub MDX files (Yang will fill content)**

For each lang × section (15 files), create:

```mdx
---
id: about
order: 2
title: "About UTSEUS"
lang: en
---

import KeyFiguresGrid from '../../../components/KeyFiguresGrid.astro';

Lorem ipsum. UTSEUS facts here. To be written by Yang.

<KeyFiguresGrid lang="en" />
```

Repeat with proper `id`, `order`, `lang`, `title` per file. Bash helper:

```bash
for lang in en fr zh; do
  for i in 01:about 02:mobility 03:complexcity 04:projects 05:contact; do
    n=${i%:*}; id=${i#*:}
    cat > src/content/sections/$lang/${n}-${id}.mdx <<EOF
---
id: ${id}
order: ${n#0}
title: "TODO"
lang: ${lang}
---

TODO: content by Yang.
EOF
  done
done
```

- [ ] **Step 2: Compose `src/pages/fr/index.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Hero from '../../components/Hero.astro';
import SectionBlock from '../../components/SectionBlock.astro';
import SidebarTOC from '../../components/SidebarTOC.astro';
import KeyFiguresGrid from '../../components/KeyFiguresGrid.astro';
import ProgramFilter from '../../components/ProgramFilter.astro';
import ProjectModal from '../../components/ProjectModal.astro';
import TestimonialCarousel from '../../components/TestimonialCarousel.astro';
import ContactCard from '../../components/ContactCard.astro';
import { getEntry } from 'astro:content';

const lang = 'fr' as const;
const about = await getEntry('sections', `${lang}/01-about`);
const mobility = await getEntry('sections', `${lang}/02-mobility`);
const complexcity = await getEntry('sections', `${lang}/03-complexcity`);
const projects = await getEntry('sections', `${lang}/04-projects`);
const contact = await getEntry('sections', `${lang}/05-contact`);
const { Content: About } = await about.render();
const { Content: Mobility } = await mobility.render();
const { Content: Complex } = await complexcity.render();
const { Content: Projects } = await projects.render();
const { Content: Contact } = await contact.render();
---
<BaseLayout lang={lang} title="UTSEUS — Institut sino-français en ingénierie" description="UTSEUS: premier institut sino-français en ingénierie à Shanghai.">
  <Hero lang={lang} title="UTSEUS" tagline="Premier institut sino-français en ingénierie" />
  <div class="mx-auto max-w-7xl px-4 grid lg:grid-cols-[200px_1fr] gap-8">
    <SidebarTOC lang={lang} />
    <div>
      <SectionBlock id="about" title="À propos">
        <KeyFiguresGrid lang={lang} />
        <About />
      </SectionBlock>
      <SectionBlock id="mobility" title="Programmes de mobilité">
        <Mobility />
        <ProgramFilter lang={lang} />
      </SectionBlock>
      <SectionBlock id="complexcity" title="Laboratoire ComplexCity">
        <Complex />
      </SectionBlock>
      <SectionBlock id="projects" title="14 projets franco-chinois">
        <Projects />
        <ProjectModal lang={lang} />
      </SectionBlock>
      <SectionBlock id="testimonials" title="Témoignages">
        <TestimonialCarousel lang={lang} />
      </SectionBlock>
      <SectionBlock id="contact" title="Contact">
        <Contact />
      </SectionBlock>
    </div>
  </div>
</BaseLayout>
```

- [ ] **Step 3: Mirror in `en/index.astro` and `zh/index.astro` (only differ in lang + strings)**

- [ ] **Step 4: Build + open all 3 pages**

```bash
npm run build && ls dist/{en,fr,zh}/index.html
```

- [ ] **Step 5: Commit**

```bash
git add src/pages/ src/content/sections/
git commit -m "feat(pages): compose all sections, wire MDX + components (T23)"
```

---

### Task 24: Data fills (programs, projects, testimonials)

**Files:**
- Create: `src/data/programs.json`, `src/data/projects.json`, `src/data/testimonials.json`

- [ ] **Step 1: Programs (4 items, from spec § Section 3)**

```json
[
  {
    "slug": "engineering-chinese",
    "audience": "chinese-students",
    "title": { "en": "Engineering program (Chinese students)", "fr": "Programme ingénieur (étudiants chinois)", "zh": "工程师项目（中国学生）" },
    "description": { "en": "Joint UT-engineering training for Chinese students.", "fr": "Formation d'ingénieur UT pour étudiants chinois.", "zh": "面向中国学生的UT工程师培养。" },
    "duration": "5 yrs",
    "icon": "/images/icons/engineering.svg"
  },
  {
    "slug": "sciences-humanities",
    "audience": "french-students",
    "title": { "en": "Sciences & Humanities in China", "fr": "Sciences et Humanités en Chine", "zh": "中国科学与人文学期" },
    "description": { "en": "Exchange semester for French students.", "fr": "Semestre d'échange pour étudiants français.", "zh": "面向法国学生的交流学期。" },
    "duration": "1 sem",
    "icon": "/images/icons/humanities.svg"
  },
  {
    "slug": "international-engineer",
    "audience": "french-students",
    "title": { "en": "International Engineer", "fr": "Ingénieur international", "zh": "国际工程师" },
    "description": { "en": "Engineering exchange semester.", "fr": "Semestre d'échange ingénieur.", "zh": "工程师交流学期。" },
    "duration": "1 sem",
    "icon": "/images/icons/intl.svg"
  },
  {
    "slug": "language-culture",
    "audience": "french-students",
    "title": { "en": "Language, culture & innovation", "fr": "Langue, culture et innovation", "zh": "语言、文化与创新" },
    "description": { "en": "Immersion semester.", "fr": "Semestre d'immersion.", "zh": "沉浸式学期。" },
    "duration": "1 sem",
    "icon": "/images/icons/language.svg"
  }
]
```

- [ ] **Step 2: Projects skeleton (14 entries) — Yang fills `title.zh`, `description.*`, `image`**

```json
[
  { "slug": "traffic-modeling", "title": { "en": "Traffic modeling", "fr": "Modélisation du trafic", "zh": "" }, "description": { "en": "", "fr": "", "zh": "" }, "axis": "modeling", "image": "/images/projects/traffic.jpg" },
  { "slug": "public-safety",    "title": { "en": "Public safety monitoring", "fr": "Sécurité publique", "zh": "" }, "description": { "en": "", "fr": "", "zh": "" }, "axis": "safety", "image": "/images/projects/safety.jpg" },
  { "slug": "urban-logistics",  "title": { "en": "Urban logistics", "fr": "Logistique urbaine", "zh": "" }, "description": { "en": "", "fr": "", "zh": "" }, "axis": "logistics", "image": "/images/projects/logistics.jpg" },
  { "slug": "smart-buildings",  "title": { "en": "Smart buildings", "fr": "Bâtiments intelligents", "zh": "" }, "description": { "en": "", "fr": "", "zh": "" }, "axis": "smart-buildings", "image": "/images/projects/buildings.jpg" },
  { "slug": "cultural-studies", "title": { "en": "Cultural studies", "fr": "Études culturelles", "zh": "" }, "description": { "en": "", "fr": "", "zh": "" }, "axis": "culture", "image": "/images/projects/culture.jpg" }
]
```
(extend to 14 with remaining axes/slugs)

- [ ] **Step 3: Testimonials skeleton (3 placeholder entries)**

```json
[
  { "name": "Alice Martin", "promo": "GI06", "program": "International Engineer", "photo": "/images/people/alice.jpg",
    "quote": { "en": "...", "fr": "...", "zh": "..." }, "year": 2024 },
  { "name": "Liu Wei", "promo": "UTSEUS22", "program": "Engineering program", "photo": "/images/people/liu.jpg",
    "quote": { "en": "...", "fr": "...", "zh": "..." }, "year": 2024 },
  { "name": "Camille Dubois", "promo": "TC04", "program": "Language, culture & innovation", "photo": "/images/people/camille.jpg",
    "quote": { "en": "...", "fr": "...", "zh": "..." }, "year": 2025 }
]
```

- [ ] **Step 4: Verify schema validation in build**

```bash
npm run build 2>&1 | tail -5
```

Expected: no schema errors.

- [ ] **Step 5: Commit**

```bash
git add src/data/
git commit -m "feat(data): seed programs/projects/testimonials skeletons for Yang (T24)"
```

---

### Task 25: Complete i18n strings

**Files:**
- Modify: `src/i18n/ui.ts`

- [ ] **Step 1: Extend with all visible strings**

Add keys: `hero.title`, `hero.tagline`, `cta.discover`, `figures.label.*`, `section.about.title`, `section.mobility.title`, ..., `testimonials.title`, `contact.title`, `footer.address.label`, `footer.copyright`, `programs.filter.all`, `programs.filter.chinese`, `programs.filter.french`, `lightbox.close`, `dialog.close`, `video.play`, `lang.switch`.

For each, fill `fr`, `en`, `zh` values.

- [ ] **Step 2: Replace hardcoded English strings in components with `t('...')` calls**

Components to update: `Header.astro`, `Hero.astro`, `ProgramFilter.astro`, `VideoEmbed.astro`, `Gallery.astro`, `pages/*/index.astro` section titles.

- [ ] **Step 3: Run tests + build**

```bash
npm test && npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/i18n/ui.ts src/components/ src/pages/
git commit -m "feat(i18n): complete string dictionary + wire t() everywhere (T25)"
```

---

### Task 26: Link audit script (TDD on filter)

**Files:**
- Create: `scripts/audit-links.mjs`, `tests/link-audit.test.ts`

- [ ] **Step 1: Failing test**

```ts
// tests/link-audit.test.ts
import { describe, it, expect } from 'vitest';
import { isExternal, isFragment } from '../scripts/audit-links.mjs';

describe('audit helpers', () => {
  it('isExternal true for http(s)', () => {
    expect(isExternal('https://x.com')).toBe(true);
    expect(isExternal('http://x.com')).toBe(true);
  });
  it('isExternal false for relative', () => {
    expect(isExternal('/fr/')).toBe(false);
    expect(isExternal('./foo')).toBe(false);
  });
  it('isFragment true for #x', () => {
    expect(isFragment('#about')).toBe(true);
  });
});
```

- [ ] **Step 2: Run — fails**

```bash
npm test
```

- [ ] **Step 3: Implement script**

```js
// scripts/audit-links.mjs
import { readFile, writeFile } from 'fs/promises';
import { glob } from 'glob';

export const isExternal = (href) => /^https?:\/\//.test(href);
export const isFragment = (href) => href.startsWith('#');

async function main() {
  const files = await glob('dist/**/*.html');
  const links = new Set();
  for (const f of files) {
    const html = await readFile(f, 'utf8');
    for (const m of html.matchAll(/href="([^"]+)"/g)) {
      if (isExternal(m[1])) links.add(m[1]);
    }
  }
  const results = [];
  for (const url of links) {
    try {
      const res = await fetch(url, { method: 'HEAD', redirect: 'follow' });
      results.push({ url, status: res.status });
    } catch (e) {
      results.push({ url, status: 'ERR', error: String(e) });
    }
  }
  await writeFile('data/links-report.json', JSON.stringify(results, null, 2));
  const broken = results.filter(r => r.status === 'ERR' || (typeof r.status === 'number' && r.status >= 400));
  console.log(`${results.length} external links checked, ${broken.length} broken`);
  process.exit(broken.length ? 1 : 0);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
```

- [ ] **Step 4: Install glob, add npm script**

```bash
npm install -D glob
```

Add to `package.json`:
```json
"scripts": { "audit:links": "node scripts/audit-links.mjs" }
```

- [ ] **Step 5: Run tests + audit**

```bash
npm test
npm run build && npm run audit:links || true
```

Expected: tests pass; audit produces `data/links-report.json`. Yang updates `data/links-audit.csv` with fixes.

- [ ] **Step 6: Commit**

```bash
git add scripts/audit-links.mjs tests/link-audit.test.ts package.json package-lock.json
git commit -m "feat(audit): script + tested helpers for external link audit (T26)"
```

---

## Week 5 — Polish

### Task 27: Image optimization with `astro:assets`

**Files:**
- Modify: components using `<img>` → `<Image>` from `astro:assets` where applicable

- [ ] **Step 1: Convert hero, project card, gallery to `<Image>`**

For each image import directly:
```astro
---
import { Image } from 'astro:assets';
import hero from '../assets/hero-shanghai.jpg';
---
<Image src={hero} alt="" width={1920} height={1080} format="webp" />
```

Move stable static images from `public/images/` to `src/assets/` so Astro processes them.

- [ ] **Step 2: Verify dist size dropped**

```bash
npm run build && du -sh dist
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ src/assets/ public/images/
git commit -m "perf(img): switch to astro:assets with webp + sizing (T27)"
```

---

### Task 28: Lighthouse pass

**Files:** none (script only)

- [ ] **Step 1: Run Lighthouse via CLI**

```bash
npx playwright install chromium
npm run build && npx http-server dist -p 8080 -s &
sleep 2
npx lighthouse http://localhost:8080/fr/ --quiet --chrome-flags="--headless" --output=json --output-path=./tmp/lh-fr.json
kill %1
node -e "const r=require('./tmp/lh-fr.json'); console.log(Object.entries(r.categories).map(([k,v])=>[k,Math.round(v.score*100)]))"
```

Expected: perf ≥ 90, a11y ≥ 95, best-practices ≥ 95, seo ≥ 95.

- [ ] **Step 2: Fix gaps**

Common fixes:
- Missing `alt=""` → add empty alt to decorative images, descriptive to informative
- Missing `lang` → already in BaseLayout, double-check
- Render-blocking CSS → move global.css to component-level if needed
- Image sizing missing → ensure width/height on every `<Image>`

- [ ] **Step 3: Re-run Lighthouse for `/en/` and `/zh/`**

Same as Step 1, save to `tmp/lh-{en,zh}.json`.

- [ ] **Step 4: Commit fixes**

```bash
git add -A && git commit -m "perf(lhci): pass thresholds 90/95/95/95 (T28)"
```

---

### Task 29: A11y manual + axe-core pass

**Files:** none (verification)

- [ ] **Step 1: Install axe-core CLI**

```bash
npx http-server dist -p 8080 -s &
sleep 2
npx @axe-core/cli http://localhost:8080/fr/ http://localhost:8080/en/ http://localhost:8080/zh/ --exit
kill %1
```

Expected: 0 violations.

- [ ] **Step 2: Keyboard nav check (manual)**

Open `/fr/` in browser. Press Tab through page. Verify:
- Skip-link to `#content`
- Header nav reachable
- LangSwitcher openable + activatable with Enter
- ProgramFilter buttons activatable with Enter/Space
- ProjectCard activatable with Enter (Note: cards currently use click → may need keyboard handler)

If gap: add `tabindex="0"` + `keydown` handler to `[data-project]` cards.

- [ ] **Step 3: Apply skip-link** (in `BaseLayout.astro`)

Insert just after `<body>`:
```astro
<a href="#content" class="sr-only focus:not-sr-only focus:absolute focus:p-2 focus:bg-bg">Skip to content</a>
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "a11y: skip-link, keyboard handlers, axe-clean (T29)"
```

---

### Task 30: SEO meta + sitemap

**Files:**
- Modify: `astro.config.mjs`
- Create: `public/robots.txt`

- [ ] **Step 1: Add `@astrojs/sitemap`**

```bash
npx astro add sitemap --yes
```

- [ ] **Step 2: Verify sitemap generated**

```bash
npm run build && ls dist/sitemap*.xml
```

- [ ] **Step 3: `public/robots.txt`**

```
User-agent: *
Allow: /
Sitemap: https://<utc-host>/sitemap-index.xml
```

(replace `<utc-host>` post-deploy decision)

- [ ] **Step 4: Commit**

```bash
git add astro.config.mjs public/robots.txt package.json package-lock.json
git commit -m "feat(seo): sitemap + robots (T30)"
```

---

## Week 6 — Deploy + Handover

### Task 31: `.htaccess` + 404 page

**Files:**
- Create: `public/.htaccess`, `src/pages/404.astro`

- [ ] **Step 1: `public/.htaccess`**

```apache
RewriteEngine On

# / → /fr/
RewriteRule ^$ /fr/ [R=301,L]

# Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript application/json image/svg+xml
</IfModule>

# Cache static
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpeg "access plus 1 month"
  ExpiresByType image/png "access plus 1 month"
  ExpiresByType image/webp "access plus 1 month"
  ExpiresByType text/css "access plus 1 week"
  ExpiresByType application/javascript "access plus 1 week"
  ExpiresDefault "access plus 1 day"
</IfModule>

ErrorDocument 404 /404.html
```

- [ ] **Step 2: `src/pages/404.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout lang="fr" title="404 — Page non trouvée">
  <section class="py-24 text-center">
    <h1 class="text-6xl font-bold">404</h1>
    <p class="mt-4">Page non trouvée / Page not found / 页面未找到</p>
    <a href="/fr/" class="mt-6 inline-block text-accent underline">← Accueil</a>
  </section>
</BaseLayout>
```

- [ ] **Step 3: Build + check**

```bash
npm run build && ls dist/.htaccess dist/404.html
```

- [ ] **Step 4: Commit**

```bash
git add public/.htaccess src/pages/404.astro
git commit -m "feat(deploy): .htaccess + 404 page (T31)"
```

---

### Task 32: Deploy attempt + local fallback

**Files:** none (operational)

GH Pages was evaluated but ruled out (subpath base-prefix complications + course context favors local/institutional hosting). Two paths only: UTC SFTP, or local `npm run preview` for demo.

- [ ] **Step 1: Build production**

```bash
SITE_URL=https://<utc-host-or-subdomain> npm run build
zip -r dist.zip dist
```

- [ ] **Step 2 (if UTC IT auth granted): UTC server deploy via SFTP**

```bash
sftp <user>@<utc-host>
> cd <served-path>
> put -r dist/*
> quit
```

Verify in browser: visit live URL. Confirm `/` redirects to `/fr/`, all 3 locales render, `_astro/` assets load.

- [ ] **Step 3 (if UTC auth NOT granted): local preview fallback for demo**

```bash
npm run build && npm run preview
# serves http://localhost:4321/
```

Open http://localhost:4321/ in browser → auto-redirects to `/fr/`. Switch locales via header lang switcher to confirm `/en/` and `/zh/`. For demo: screen-record the walkthrough; embed in `docs/demo/walkthrough.mp4`.

- [ ] **Step 4: Re-verify**

For UTC live URL:
```bash
curl -s -o /dev/null -w "%{http_code}\n" https://<live-url>/fr/
```
Expected: 200.

For local preview:
```bash
curl -sI http://localhost:4321/fr/ | head -3
```
Expected: HTTP 200.

- [ ] **Step 5: Commit deploy evidence**

Save deploy screenshot to `docs/demo/deploy-evidence.png` (live UTC URL OR local preview window). Commit:

```bash
git add docs/demo/deploy-evidence.png
git commit -m "deploy: live or local-preview evidence (T32)"
```

---

### Task 33: Handover docs

**Files:**
- Create: `docs/CONTENT_EDIT_GUIDE.md`

- [ ] **Step 1: Write the guide**

```markdown
# Content edit guide (non-dev)

## Edit a section (prose)
1. Open `src/content/sections/<lang>/<NN>-<id>.mdx`.
2. Write Markdown below the frontmatter. Frontmatter (between `---`) must not be changed.
3. Save. The site rebuilds on `npm run build`.

## Add a project
1. Open `src/data/projects.json`.
2. Copy any existing object, paste, change `slug` to unique value.
3. Fill `title.{en,fr,zh}`, `description.{en,fr,zh}`, choose `axis` from: `modeling, safety, logistics, smart-buildings, culture`.
4. Place image in `public/images/projects/<slug>.jpg`, set `image: "/images/projects/<slug>.jpg"`.

## Add a testimonial
1. Open `src/data/testimonials.json`.
2. Copy any existing object. Fill all fields.
3. Place photo in `public/images/people/<name>.jpg`.

## Translate
- UI strings: `src/i18n/ui.ts` — fill `fr` / `en` / `zh` for each key.
- Section prose: write a separate `.mdx` per language under `src/content/sections/<lang>/`.

## Build + check
```bash
npm install
npm run build         # produces dist/
npm run preview       # serves dist/ locally
npm test              # runs i18n + audit tests
npm run audit:links   # checks external links in dist/
```
```

- [ ] **Step 2: Update `README.md` to link the guide**

Append under Documentation:
```
- Content edit guide: [`docs/CONTENT_EDIT_GUIDE.md`](docs/CONTENT_EDIT_GUIDE.md)
```

- [ ] **Step 3: Commit**

```bash
git add docs/CONTENT_EDIT_GUIDE.md README.md
git commit -m "docs: content edit guide for non-dev contributors (T33)"
```

---

### Task 34: Optional CI

**Files:**
- Create: `.github/workflows/build.yml`

- [ ] **Step 1: Workflow**

```yaml
name: build
on: { push: { branches: [main] }, pull_request: { branches: [main] } }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm test
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with: { name: dist, path: dist }
```

- [ ] **Step 2: Push, verify green on GitHub Actions tab**

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/build.yml
git commit -m "ci: build + test on push (T34)"
git push
```

---

### Task 35: Demo prep

**Files:** none (collaborative)

- [ ] **Step 1: Tag release**

```bash
git tag v1.0.0
git push --tags
```

- [ ] **Step 2: Record walkthrough** (Zixuan + Yang lead, Pengcheng captures terminal-side build/deploy moments)

- [ ] **Step 3: Final QA pass**
- Open `/fr/`, `/en/`, `/zh/` in Chrome + Safari + Firefox
- Toggle each filter, open each project, scroll testimonials, switch lang on different anchors
- Run Lighthouse one final time, snapshot scores into demo slides

- [ ] **Step 4: Commit demo assets**

```bash
git add docs/demo/
git commit -m "docs: demo slides + walkthrough (T35)"
```

---

## Self-Review

- **Spec coverage:** All sections in spec §4.1 mapped to T10–T22 components + T23 composition. Stack (Astro/Tailwind/MDX/i18n) → T1–T8. Data (§5.2) → T7, T11, T24. Workflow (§8) outside this plan; tracked in OWNERS. Timeline (§9) week → tasks bucketing matches. Risks (§10) addressed: deploy fallback (T32), tokens slip (T15 prereq note), content slip (T23 stubs allow build without final content), Safari scroll-snap (T18 uses native scroll-snap — degrades gracefully).
- **Placeholder scan:** Project data has empty `title.zh` etc — explicit and assigned to Yang in `OWNERS.md`. Spec deadlines (UTC server go/no-go 2026-06-15) referenced in T32. No TBDs in code steps.
- **Type consistency:** `useTranslations`, `getLangFromUrl`, `switchLangUrl`, `buildSwitcherTargets` defined T8 + extended T14 — same names used in T13, T14, T25. Collection names `programs/projects/testimonials/sections` consistent T7/T16/T17/T18/T23. Image paths `/images/...` consistent. Audit script export names (`isExternal`, `isFragment`) consistent T26 test ↔ impl.

---

## Execution Handoff

Plan saved to `docs/plans/2026-05-12-utseus-refonte-implementation.md`.

Two execution options:

1. **Subagent-Driven (recommended)** — fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** — execute tasks in this session via `superpowers:executing-plans`, batch with checkpoints.
