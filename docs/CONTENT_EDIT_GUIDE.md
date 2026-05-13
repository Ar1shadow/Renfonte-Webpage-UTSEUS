# Content edit guide (non-dev)

This guide explains how Yang and other non-developer collaborators can update site content without touching component code.

## Prerequisites

Once-only setup on your machine:
1. Install Node.js 22+ from https://nodejs.org/
2. Clone the repo: `git clone https://github.com/Ar1shadow/Renfonte-Webpage-UTSEUS.git`
3. Install dependencies: `cd Renfonte-Webpage-UTSEUS && npm install`

## Edit a section (prose)

Sections live in `src/content/sections/<lang>/<NN>-<id>.mdx`, where `<lang>` is `en`, `fr`, or `zh`.

1. Open the file for the section + language you want to edit.
2. The `---` block at the top is **frontmatter** — do not change.
3. Below the frontmatter, write Markdown. Standard syntax:
   - `## Heading` for sub-sections
   - `**bold**`, `*italic*`
   - `[link text](https://...)` for links
   - `![alt](path.jpg)` for images (place file in `public/images/` first)
4. You can also use the included Astro components — see existing files for examples.
5. Save. Commit with `git commit -am "content: update <section> (<lang>)"`.

## Add a project

Edit `src/data/projects.json`:

1. Copy any existing object inside the `[ ... ]` array, paste below it.
2. Change `slug` to a unique kebab-case identifier (e.g. `new-project-name`).
3. Fill `title.en`, `title.fr`, `title.zh` with translated titles.
4. Fill `description.en`, `description.fr`, `description.zh`.
5. Choose `axis` from: `modeling`, `safety`, `logistics`, `smart-buildings`, `culture`.
6. Place the image at `public/images/projects/<slug>.jpg`, set `image: "/images/projects/<slug>.jpg"`.
7. Optionally add a `links` array.

JSON syntax: every key needs quotes, commas separate entries, no trailing comma after the last item.

## Add a testimonial

Edit `src/data/testimonials.json`:

1. Copy any existing object, paste below it.
2. `id`: unique kebab-case (e.g. `firstname-lastname`).
3. `name`: full name.
4. `promo`: class/cohort code (e.g. `GI06`, `UTSEUS22`).
5. `program`: program followed.
6. `photo`: place file at `public/images/people/<id>.jpg`, set `photo: "/images/people/<id>.jpg"`.
7. `quote.en`, `quote.fr`, `quote.zh`: translated quotes.
8. `year`: year of testimony.

## Add a program

Edit `src/data/programs.json`. Same pattern: `slug`, `audience` (`chinese-students` or `french-students`), `title`/`description` triads, `duration` (free text), optional `icon` path.

## Translate UI strings

Buttons, labels, navigation: edit `src/i18n/ui.ts`. Find the key, fill or update the value for each lang.

If you add a new key, add it to all 3 languages (`fr`, `en`, `zh`) — or the build will fail.

## Build + check

After any change:

```bash
npm run build           # produces dist/, fails on schema errors
npm run preview         # serves dist/ locally at http://localhost:4321
npm test                # runs i18n + audit tests
npm run audit:links     # checks external links in dist/ (after build)
```

If `npm run build` fails with a schema error, the JSON file you edited has a missing or malformed field — re-check against the schema in `src/content.config.ts`.

## Image audit

Place all images under `public/images/<category>/<filename>.<ext>`. Categories already in use:
- `public/images/projects/` — project thumbnails
- `public/images/people/` — testimonial photos
- `public/images/icons/` — program icons (SVG preferred)
- `public/images/og-default.jpg` — default Open Graph share image

Optimize raster images before commit (use https://squoosh.app/ or `npx @squoosh/cli`).

## Link audit

Yang is responsible for keeping `data/links-audit.csv` updated. Format: `page_section,original_url,status,new_url,notes,checked_by,checked_date`.

`npm run audit:links` produces `data/links-report.json` with all external links + their HTTP status — use that to fill the CSV.

## Common gotchas

- Frontmatter must use `---` delimiters (3 dashes) on their own lines.
- JSON: no trailing commas, no comments, all strings double-quoted.
- File names lowercase, kebab-case (`my-project.json`, NOT `My_Project.JSON`).
- Don't commit images larger than 500 KB without optimizing first.
- After editing, always run `npm run build` and confirm "Complete!" before committing.
