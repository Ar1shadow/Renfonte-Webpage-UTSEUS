# Refonte UTSEUS Webpage

Refonte of the UTSEUS subpage on the UTC website. Academic project — Multimedia Project Management course at UTC.

Original page: https://www.utc.fr/en/international-relations/the-sino-french-institute-in-engineering-utseus-at-the-university-of-shanghai/

## Team

| Member | Role |
|---|---|
| Pengcheng Li | Développement / Contenu |
| Zixuan Xu | IHM / Ergonomie |
| Yang Xiang | Contenu / Scénarisation |

## Tech stack

- **Framework:** Astro 5
- **Content:** MDX content collections + JSON data collections
- **Styling:** Tailwind CSS (or vanilla CSS with design tokens) — decision by 2026-05-15
- **i18n:** Astro built-in routing — EN / FR / ZH, default `/fr/`
- **Output:** static `dist/` (HTML + CSS + JS + assets)
- **Design:** Figma

## Project structure

```
.
├── docs/specs/          # design specs (this is where the design doc lives)
├── data/                # link audit CSV
├── public/              # static assets (images, videos, brochures)
├── src/
│   ├── content/         # MDX sections (per language)
│   ├── data/            # structured content JSON
│   ├── i18n/            # UI strings + helpers
│   ├── layouts/         # base layouts
│   ├── components/      # Astro components
│   ├── pages/           # routes (/en, /fr, /zh)
│   └── styles/          # global styles + design tokens
├── OWNERS.md            # who owns what
├── README.md
└── .gitignore
```

## Setup (after Astro init in W1)

```bash
npm install
npm run dev        # local dev server on http://localhost:4321
npm run build      # build static site → dist/
npm run preview    # preview built site locally
```

## Deploy

Two paths:

1. **UTC Apache server (primary, gated on IT auth)** — `npm run build`, then upload `dist/` contents to served directory via SFTP. `public/.htaccess` (shipped in `dist/`) handles `/` → `/fr/` redirect, gzip, cache headers, security headers, custom 404.
2. **Local browser demo (always works, fallback for presentations)** — `npm run build && npm run preview` serves the production build at http://localhost:4321/. Capture screen recording for demo slides.

GH Pages was evaluated but ruled out (subpath base-prefix complications + course context preferring local/institutional hosting).

## Timeline

| Week | Dates | Milestone |
|---|---|---|
| W1 | May 12-18 | Spec + setup + Figma kickoff |
| W2 | May 19-25 | Maquettes desktop + content draft EN |
| W3 | May 26 – Jun 1 | **Maquettes done (2026-06-01)** |
| W4 | Jun 2-8 | **Prototype done (2026-06-08)** |
| W5 | Jun 9-15 | Polish + a11y + perf |
| W6 | Jun 16-22 | **Demo (2026-06-22)** |

## Documentation

- Design spec: [`docs/specs/2026-05-12-utseus-refonte-design.md`](docs/specs/2026-05-12-utseus-refonte-design.md)
- Ownership: [`OWNERS.md`](OWNERS.md)
- Link audit: [`data/links-audit.csv`](data/links-audit.csv)
- Content edit guide: [`docs/CONTENT_EDIT_GUIDE.md`](docs/CONTENT_EDIT_GUIDE.md)

## License

Academic use only.

---

# Refonte UTSEUS (Français)

Refonte de la sous-page UTSEUS sur le site de l'UTC. Projet académique — cours Gestion de projet multimédia, UTC.

## Équipe

| Membre | Rôle |
|---|---|
| Pengcheng Li | Développement / Contenu |
| Zixuan Xu | IHM / Ergonomie |
| Yang Xiang | Contenu / Scénarisation |

## Commandes

```bash
npm install
npm run dev        # serveur de dev local
npm run build      # build statique → dist/
npm run preview    # prévisualiser le build
```

Voir le spec complet dans `docs/specs/`.
