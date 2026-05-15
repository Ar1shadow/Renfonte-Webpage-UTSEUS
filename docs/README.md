# `docs/` — usage guide

This folder is the project's design + decision log. It is read by future contributors and agents (Claude Code, Copilot, etc.) to reconstruct project state, rationale, and pending work without re-reading the entire codebase.

## Folder map

| Folder / file | Purpose | When written |
|---|---|---|
| `specs/` | Detailed engineering design docs. One file per design decision or feature. | **Before** implementation. |
| `plans/` | Iteration plans + future roadmaps. References specs. Lists tasks in dependency order. | **After** spec, **before** code. |
| `logs/` | Per-change track files. One file per merged change-set: diff summary, verification output, follow-ups. | **After** implementation, before / alongside the commit. |
| `maquettes/` | Figma references (HTML/CSS extracts from the IHM team). | When new maquettes are delivered. |
| `demo/` | Release demo assets — screen recordings, screenshots. | At each release tag. |
| `CONTENT_EDIT_GUIDE.md` | Onboarding for non-dev content contributors. | Updated when content schema changes. |
| `RELEASE_NOTES_<vN>.md` | One file per released version. | At each `vN.x.x` tag. |

`OWNERS.md` lives at the repo root, not under `docs/`. It maps people → deliverables and is the authoritative pending-work list.

## Naming convention

All dated docs use ISO date + lowercase kebab-case topic + role suffix.

| Folder | Pattern | Example |
|---|---|---|
| `specs/` | `YYYY-MM-DD-<topic>-design.md` | `2026-05-15-favicon-cta-voice-footer-design.md` |
| `plans/` | `YYYY-MM-DD-<topic>-implementation.md` | `2026-05-12-utseus-refonte-implementation.md` |
| `logs/` | `YYYY-MM-DD-<topic>-track.md` | `2026-05-15-favicon-cta-voice-footer-track.md` |

Rules:

- `<topic>` is lowercase kebab-case, 2–6 words.
- Date = creation date (ISO `YYYY-MM-DD`).
- Bilingual plans split into two files with a language suffix before the extension: `…-implementation.fr.md` (committed) and `…-implementation.zh.md` (gitignored — working copy).
- Never rename a published spec/plan/log file; supersede it with a new dated entry that links to the predecessor.

## Agent workflow

Default pattern when an agent (or new human contributor) starts a session:

1. **Read the latest log** in `docs/logs/` (sort filenames descending → newest first). This is the current-state snapshot.
2. **Read the spec(s)** referenced in that log for design rationale.
3. **Read `OWNERS.md`** at repo root for pending deliverables per role.
4. **Before writing code**:
   - Trivial change (single-file mechanical edit, typo, content fill): no spec, just code → log.
   - Non-trivial change (new component, schema change, cross-file refactor): write a spec to `docs/specs/` first.
   - Multi-task feature: write an implementation plan to `docs/plans/` after the spec.
5. **After change merged**: write a log to `docs/logs/` with: what changed (table), verification output (`npm run check`, `npm test`, `npm run build`, axe-core / Lighthouse if visual), follow-ups.
6. **External system pointers**:
   - Repo: `https://github.com/Ar1shadow/Renfonte-Webpage-UTSEUS`
   - UTC SFTP credentials, served path, domain: go through DSI — see latest log entry for status.
   - Build/preview commands: see the "Run-book" section in the most recent session-resume log.

## Cross-refs

- [`../OWNERS.md`](../OWNERS.md) — people ↔ deliverables matrix.
- [`CONTENT_EDIT_GUIDE.md`](CONTENT_EDIT_GUIDE.md) — non-dev content editing.
- [`RELEASE_NOTES_v1.0.0.md`](RELEASE_NOTES_v1.0.0.md) — most recent release.
- [`logs/`](logs/) — session-resume + per-change trackers.
- [`specs/`](specs/) — design docs.
- [`plans/`](plans/) — iteration plans.
