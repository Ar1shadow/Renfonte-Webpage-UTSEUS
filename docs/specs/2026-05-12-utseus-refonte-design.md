# UTSEUS Subpage Refonte — Design Specification

**Date:** 2026-05-12
**Target page:** https://www.utc.fr/en/international-relations/the-sino-french-institute-in-engineering-utseus-at-the-university-of-shanghai/
**Course context:** Multimedia Project Management — academic exercise
**Demo date:** 2026-06-22
**Team:** Pengcheng Li (dev/contenu), Zixuan Xu (IHM/ergonomie), Yang Xiang (contenu/scénarisation)

---

## 1. Goals

- Modernize UI of UTSEUS subpage (images, layout, theme-aligned visuals).
- Restructure information architecture: from text-heavy institutional brochure → visual, student-centric narrative.
- Add full i18n: English, French, Chinese.
- Fix broken links from current site.
- Enrich with media (images, videos, diagrams).
- Tentative deploy on UTC server (pending IT authorization). Fallback for course demo: local `npm run preview` (no public URL needed).

## 2. Non-Goals

- No redesign of UTC global header/footer — clone 1:1 from current site.
- No CMS backend. Static site only.
- No new auth, user accounts, or comments.
- No mobile native app.

## 3. Tech Stack

- **Framework:** Astro 5
- **Content:** MDX content collections (prose) + JSON/YAML data collections (structured)
- **Styling:** Tailwind CSS (or vanilla CSS with design tokens from Figma) — final choice early W1
- **i18n:** Astro built-in i18n routing (`/en/`, `/fr/`, `/zh/`), default `/fr/`
- **Image optim:** `astro:assets`
- **Build output:** static `dist/` (HTML/CSS/JS/assets)
- **Repo:** Git (GitHub or UTC GitLab) with `main`, `dev`, feature branches
- **CI (optional):** GitHub Action build on push to `main`, artifact zip
- **Maquettes:** Figma (Zixuan)

## 4. Information Architecture

Single long page, anchor navigation + sticky sidebar TOC (desktop).

### 4.1 Sections

1. **Hero** — title, tagline, key figures (1200+ étudiants/an, depuis 2005, 14 projets), CTA (DL brochure + scroll to "À propos")
2. **À propos UTSEUS** — updated SHU + UTSEUS facts; student-centric tone; key-figure cards; partnership history
3. **Programmes de mobilité** — 4 programs as filterable cards (filter: pour étudiants chinois / pour étudiants français)
4. **Laboratoire ComplexCity** — image-heavy: lab photos, 3 axes diagram, 5 application areas; long text → collapsible
5. **Projets franco-chinois (14)** — grid of cards; click → modal/drawer with details; images for each
6. **Témoignages étudiants** — horizontal-scroll carousel (CSS `scroll-snap-x`, no JS lib); cards with photo, name, promo, program, quote (per lang), year
7. **Contact + Ressources** — director cards, brochure/guide DL, Shanghai location map

### 4.2 Removed / Fixed vs original

- Remove Ukrainian flag image (off-topic).
- Replace broken links (audit pass by Yang, fix log in `data/links-audit.csv`).
- Split text-wall ComplexCity → diagram + collapsible details.
- Trim partner-logo clutter in footer (still clone UTC footer otherwise).

### 4.3 Navigation

- **Top nav:** UTSEUS logo · [À propos] [Mobilité] [Lab] [Projets] [Témoignages] [Contact] · 🌐 EN/FR/ZH · DL brochure
- **Mobile:** hamburger drawer, full-screen nav
- **Sidebar TOC:** sticky on desktop ≥ lg breakpoint; hidden on mobile
- **Lang switcher:** preserves anchor + scroll position; persists choice in `localStorage`

## 5. Data Model

### 5.1 Repository layout

```
refonteWEB/
├── src/
│   ├── content/
│   │   ├── sections/{en,fr,zh}/{01-about,02-mobility,03-complexcity,04-projects,05-contact}.mdx
│   │   └── config.ts                 # zod schemas
│   ├── data/
│   │   ├── projects.json
│   │   ├── testimonials.json
│   │   ├── programs.json
│   │   └── key-figures.json
│   ├── i18n/
│   │   ├── ui.ts                     # nav/footer/button strings
│   │   └── utils.ts                  # getLangFromUrl, useTranslations
│   ├── layouts/BaseLayout.astro
│   ├── components/
│   │   ├── Header.astro              # cloned UTC header
│   │   ├── Footer.astro              # cloned UTC footer (trimmed)
│   │   ├── Hero.astro
│   │   ├── SidebarTOC.astro
│   │   ├── SectionBlock.astro
│   │   ├── ProjectCard.astro
│   │   ├── ProjectModal.astro
│   │   ├── TestimonialCarousel.astro
│   │   ├── ProgramCard.astro
│   │   ├── KeyFiguresGrid.astro
│   │   ├── VideoEmbed.astro          # lazy-loaded YouTube
│   │   ├── Gallery.astro
│   │   ├── Accordion.astro
│   │   ├── ContactCard.astro
│   │   └── LangSwitcher.astro
│   ├── pages/
│   │   ├── index.astro               # redirect → /fr/
│   │   ├── en/index.astro
│   │   ├── fr/index.astro
│   │   └── zh/index.astro
│   └── styles/global.css
├── public/
│   ├── images/
│   ├── videos/
│   └── docs/                          # brochures PDF
├── data/links-audit.csv
├── OWNERS.md
├── astro.config.mjs
├── tailwind.config.mjs                # if Tailwind
└── package.json
```

### 5.2 Content collection schemas (zod)

```ts
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const sections = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.enum(['hero','about','mobility','complexcity','projects','testimonials','contact']),
    order: z.number(),
    title: z.string(),
    lang: z.enum(['en','fr','zh']),
    hero_image: z.string().optional(),
  }),
});

const projects = defineCollection({
  type: 'data',
  schema: z.object({
    slug: z.string(),
    title: z.object({ en: z.string(), fr: z.string(), zh: z.string() }),
    description: z.object({ en: z.string(), fr: z.string(), zh: z.string() }),
    axis: z.enum(['modeling','safety','logistics','smart-buildings','culture']),
    image: z.string(),
    links: z.array(z.object({ label: z.string(), url: z.string() })).optional(),
  }),
});

const testimonials = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    promo: z.string(),
    program: z.string(),
    photo: z.string(),
    quote: z.object({ en: z.string(), fr: z.string(), zh: z.string() }),
    year: z.number(),
  }),
});

const programs = defineCollection({
  type: 'data',
  schema: z.object({
    slug: z.string(),
    audience: z.enum(['chinese-students','french-students']),
    title: z.object({ en: z.string(), fr: z.string(), zh: z.string() }),
    description: z.object({ en: z.string(), fr: z.string(), zh: z.string() }),
    duration: z.string(),
    icon: z.string().optional(),
  }),
});

export const collections = { sections, projects, testimonials, programs };
```

### 5.3 Content split (Pengcheng ↔ Yang)

- `sections/*.mdx` (prose): Yang primary author; Pengcheng integrates + reviews.
- `data/*.json` (structured): Pengcheng owns schema; Yang fills fields.
- `i18n/ui.ts` (UI strings): Pengcheng maintains list; Yang fills translations.
- See `OWNERS.md` (created W1) for per-section ownership.

## 6. Design System

- Tokens (color, type scale, spacing, radius, shadow) defined in Figma by Zixuan, exported as CSS variables in `src/styles/global.css`.
- Tailwind config consumes tokens via `theme.extend` (if Tailwind chosen).
- Responsive breakpoints: `sm 640`, `md 768`, `lg 1024`, `xl 1280`.
- Accessibility target: WCAG 2.1 AA (contrast, alt text, keyboard nav, ARIA on carousel + modal + accordion + lang switcher).

## 7. Build, Deploy, Handover

### 7.1 Build

`npm run build` → static `dist/`.

### 7.2 Deploy plan

- **Primary:** UTC Apache server (pending IT auth). Upload `dist/` contents. `.htaccess` for:
  - redirect `/` → `/fr/`
  - gzip + brotli
  - cache headers for static assets
  - custom 404 page
- **Fallback for course demo:** local `npm run preview` running on Pengcheng's machine, screen-recorded for demo slides. No public URL required for academic evaluation. GH Pages was evaluated but ruled out (subpath base-prefix complications + course context).

### 7.3 CI

Optional lightweight GitHub Action: `npm ci && npm run build` on push to `main`. Build artifact (`dist.zip`) attached to release. Manual upload to UTC server. No automatic CD.

### 7.4 Handover deliverables (2026-06-22)

1. Git repo URL + `README.md` (install, build, deploy in FR + EN)
2. `dist.zip`
3. This spec doc + design system doc (Figma link)
4. `CONTENT_EDIT_GUIDE.md` — non-dev guide: edit `.mdx`, add a project, add a testimonial
5. `data/links-audit.csv`
6. Demo slides + recorded walkthrough video

## 8. Team Workflow

| Person | Domain | Outputs |
|---|---|---|
| **Pengcheng** | Dev + Contenu | Astro setup, components, i18n routing, MDX integration, build/deploy, content (shared with Yang), link-audit tooling |
| **Zixuan** | IHM + Ergonomie | Figma maquettes (desktop + mobile, lang variants), design tokens, design system doc, a11y audit, user testing |
| **Yang** | Contenu + Scénarisation | Page narrative, copy EN/FR/ZH, project descriptions, testimonial gathering, image curation, link-audit fill |

### 8.1 Cross-deps

- Zixuan → Pengcheng: design tokens from Figma → CSS vars (W2)
- Zixuan → Yang: layout dictates max text length per block → Yang writes within constraints (W2)
- Yang → Pengcheng: content schemas frozen before MDX writing (W2 start)
- Yang → Zixuan: image assets → placed in maquettes (W2)
- All: i18n string keys list, Pengcheng maintains, others fill (W4)

## 9. Timeline

Today: 2026-05-12. End: 2026-06-22. ~6 weeks.

| Week | Dates | Milestones | Pengcheng | Zixuan | Yang |
|---|---|---|---|---|---|
| W1 | May 12-18 | Spec + setup + Figma kickoff | Astro init, repo, schemas, header/footer scrape | Figma file, mood board, wireframes desktop | Content audit + link audit start + narrative outline |
| W2 | May 19-25 | Maquettes desktop, content draft EN | Components scaffold, tokens integration, base i18n | Desktop maquettes complete, tokens delivered | Draft EN prose, image curation |
| W3 | May 26-Jun 1 | **JALON maquettes (06-01)** | Carousel, modal, accordion components | Mobile maquettes + a11y review | FR + ZH translations, finalize testimonials |
| W4 | Jun 2-8 | **JALON prototype (06-08)** | Integrate all content + data, lang switcher | Refine maquettes per integration, polish | Final content pass, link-audit fix |
| W5 | Jun 9-15 | Polish + a11y + perf | Lighthouse, image optim, polish | A11y audit, user testing | Proofread 3 langs, demo script |
| W6 | Jun 16-22 | **JALON demo (06-22)** | UTC deploy attempt, fallback deploy, README, build artifact | Demo slides design, walkthrough video | Demo narration, final QA |

### 9.1 Decision deadlines

- 2026-05-15: Tailwind vs vanilla CSS
- 2026-05-22: Content schemas frozen
- 2026-05-29: Header/footer clone validated
- 2026-06-15: UTC server access — go/no-go → fallback hosting

## 10. Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| UTC IT denies / delays server access | Medium | Low | Fallback = local `npm run preview` for demo; no public URL required for course evaluation |
| ZH translation quality | Medium | Low | Use Pengcheng native review + Yang for tone |
| Maquette slip past 06-01 | Medium | High | Lock IA first, design tokens early, parallel dev on shells |
| Content writing slip | Medium | Medium | Yang starts narrative outline W1, not blocked by maquettes |
| Cross-browser carousel issues (Safari scroll-snap) | Low | Low | Progressive enhancement, plain scroll fallback |
| 14 project descriptions incomplete | Medium | Medium | Yang starts data fill W1; Pengcheng provides skeleton JSON |

## 11. Acceptance Criteria

- Site builds with `npm run build` with no errors.
- All 3 langs render fully (no missing keys, no untranslated blocks).
- Zero broken links (verified by link-audit pass + `npx linkinator dist/`).
- Lighthouse: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95 (mobile + desktop).
- Renders correctly on Chrome, Firefox, Safari, Edge latest 2 versions.
- Mobile responsive 360px–1920px.
- Keyboard navigable: tab through nav, lang switcher, project cards/modals, carousel, accordions.
- Demo slides + walkthrough video ready 2026-06-21 EOD.
- Handover docs complete by 2026-06-22.
