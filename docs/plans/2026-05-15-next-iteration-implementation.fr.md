# Itération suivante — plan d'implémentation

Date : 2026-05-15
Statut : approuvé, prêt à démarrer
Tag visé : `v1.1.0`

## Contexte

Post-`v1.0.0`, le site est techniquement livré (4 pages, Lighthouse ≈100, axe-core 0 violation, tests 12/12). Restent à clarifier les normes UTC (Header/Footer/déploiement) côté DSI, à finaliser le contenu, à arrêter l'identité visuelle (couleurs, typographie, images) et à ajouter une section « Album d'activités ». Cette itération vise `v1.1.0`.

Travail organisé en 5 phases, A → E. Les phases A et C contiennent des sous-tâches qui se lancent en parallèle.

## Phase A — Déblocages asynchrones (à lancer jour 1, en parallèle)

| # | Tâche | Livrable | Notes |
|---|---|---|---|
| A1 | **Mail à la DSI** : demander les normes Header/Footer (template UTC officiel) et les normes de déploiement (host, chemin servi, sous-domaine, identifiants SFTP). | Réponse DSI avec template + spec déploiement. | Bloque D1 + déploiement final. Item utilisateur #1. |
| A2 | **Voice / Témoignages** : décider du format (vidéo / texte / photo) puis contacter les contributeurs (étudiants `entrant` + `sortant`) par mail. | Décision tracée + mails envoyés. | Item #7. Décider avant de contacter. |
| A3 | **SHU (Shanghai University)** : décider si on sollicite l'université pour vidéos/photos d'activités étudiantes. Si oui, rédiger + envoyer la demande. | Décision + mail (optionnel). | Item #9. Conditionne le pipeline d'assets pour la nouvelle section « Album d'activités ». |

## Phase B — Réécriture de contenu (sans bloqueur externe, en parallèle de A)

| # | Tâche | Fichiers | Notes |
|---|---|---|---|
| B1 | **Renommer les libellés des groupes étudiants** : `entrant` (CN → FR, entrant à l'UTC) / `sortant` (FR/UTC → CN). Réécrire le texte du programme d'échange selon la **dernière convention** signée. | `src/data/testimonials.json` (champ `promo`), `src/data/programs.json`, `src/content/sections/{en,fr,zh}/02-mobility.mdx`, `src/i18n/ui.ts` si labels exposés. | Item #3. Récupérer le texte de convention auprès du responsable mobilité. |
| B2 | **Remplir tout le contenu textuel** : remplacer tous les `TODO` / lorem ipsum restants. | `src/data/testimonials.json` (citations Voice — dépend de A2), `src/data/projects.json` (14 descriptions × 3 langues), corps des `src/content/sections/**.mdx`. | Item #8. Partiellement bloqué par A2 pour Voice. |

## Phase C — Identité visuelle (en parallèle ; sortie → swap dans `@theme`)

| # | Tâche | Livrable | Notes |
|---|---|---|---|
| C1 | **Palette de couleurs** : recherche + sélection. | Hex finaux pour `--color-bg`, `--color-fg`, `--color-accent`, `--color-accent-soft`, `--color-muted`. | Item #5. Doit passer axe-core WCAG AA après application. |
| C2 | **Typographie** : recherche + sélection. | Valeurs finales `--font-sans`, `--font-display` + décision auto-hébergement vs Google Fonts. | Item #4. Vérifier l'alignement licence avec la réponse A1. |
| C3 | **Images** : recherche + sélection. | Photo hero (`src/assets/hero-shanghai.jpg`), OG default, photos projets/personnes. | Item #6. Partiellement dépendant de A3 (footage SHU). |

Application : C1/C2 → bloc `@theme` de `src/styles/global.css`. C3 → composants + `data/*.json`.

## Phase D — Modifications structurelles (dépendent de A + C)

| # | Tâche | Fichiers | Notes |
|---|---|---|---|
| D1 | **Reconstruire la section Contact selon le template UTC** (suivant retour DSI). | `src/content/sections/{en,fr,zh}/05-contact.mdx`, `src/components/ContactCard.astro`. | Item #11. Bloqué par A1. |
| D2 | **Nouvelle section « Album d'activités »** — galerie photo des événements étudiants CN + FR. | Nouveau composant `src/components/ActivityAlbum.astro`, nouveau `src/data/activities.json`, nouveau MDX `06-activities.mdx` × 3 langues, enregistrement dans la composition de page + TOC + chaînes i18n. | Item #2. Bloqué par A3 (sourcing photos) + C3. Réutiliser le pattern `Gallery` + lightbox de T20. |

## Phase E — Polish UI

| # | Tâche | Fichiers | Notes |
|---|---|---|---|
| E1 | **Polish du clic ProjectCard**. | `src/components/ProjectCard.astro`, `src/components/ProjectModal.astro`. | Item #10. Ajouter focus ring, élargir la zone cliquable, transition d'ouverture modale. ESC + clic backdrop existent — à vérifier. |
| E2 | **Habillage des liens + icônes + animations**. | Tous les `<a>` externes → wrapper avec icône externe (Lucide ou SVG inline) ; icônes décoratives sur les titres de section ; animations d'entrée discrètes (respect de `prefers-reduced-motion`). | Item #12. En dernier car touche beaucoup de fichiers. |

## Graphe de dépendances

```
A1 ─────────────────► D1
A2 ─────────► B2 (citations Voice)
A3 ────────► C3 ──► D2
C1 + C2 + C3 ──► (visual freeze) ──► D1, D2, E2
B1 + B2 ──────► (content freeze)
D1 + D2 + E1 + E2 ──► release v1.1.0
```

## Vérification (avant tag `v1.1.0`)

```bash
npm run check        # 0 erreur / 0 warning / hint cosmétique toléré
npm test             # ≥ 12/12, + tests ActivityAlbum si logique
npm run build        # toutes les pages, en incluant la nouvelle section
npm run audit:links  # 0 lien cassé
# Lighthouse : ≥ 95 perf / 95 a11y / 95 best / 95 seo, sur fr/en/zh
# axe-core   : 0 violation sur fr/en/zh
```

## Suivi

Chaque tâche A–E donne lieu, à sa clôture, à un fichier de suivi dans `docs/logs/` au format `YYYY-MM-DD-<topic>-track.md` (voir [`../README.md`](../README.md)). Les tâches non triviales reçoivent en plus un spec préalable dans `docs/specs/`.

## Hors périmètre

- Réécriture de `OWNERS.md` (sujet séparé).
- Changement de schéma de contenu (`CONTENT_EDIT_GUIDE.md` reste valide).
- Renommage rétroactif des fichiers existants de `docs/specs/` ou `docs/plans/`.

## Références

- Spec de base : [`../specs/2026-05-12-utseus-refonte-design.md`](../specs/2026-05-12-utseus-refonte-design.md)
- Plan initial : [`2026-05-12-utseus-refonte-implementation.md`](2026-05-12-utseus-refonte-implementation.md)
- Dernier état : [`../logs/2026-05-15-favicon-cta-voice-footer-track.md`](../logs/2026-05-15-favicon-cta-voice-footer-track.md)
- Matrice de responsabilité : [`../../OWNERS.md`](../../OWNERS.md)
