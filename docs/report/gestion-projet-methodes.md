# Méthodes utilisées

Le projet a été mené par une équipe de trois personnes sur six semaines, dans le cadre d'une UV de l'UTC. À cette échelle, aucune méthodologie lourde n'a de sens. Nous avons retenu un cadre Agile allégé pour l'organisation du travail, et un workflow Git de type Gitflow pour la gestion du code. Ces deux choix se complètent : l'Agile structure le rythme des itérations et la définition des tâches, Gitflow garantit qu'à tout moment une version stable du site est démontrable, indépendamment de ce qui se passe sur les postes individuels.

## Une démarche Agile adaptée au projet de cours

Le choix d'une approche Agile, plutôt qu'une planification en cascade, s'est imposé pour une raison simple : le périmètre du projet n'était pas figé au démarrage. La charte visuelle restait à arrêter, le retour de la DSI de l'UTC sur les normes de déploiement n'était pas connu, le contenu rédactionnel s'écrivait en parallèle du code. Planifier six semaines à l'avance aurait conduit à un calendrier obsolète au bout de huit jours. Nous avons donc travaillé par itérations courtes, balisées par des tags Git (`v1.0.0` puis `v1.1.0`), chacune avec un objectif limité et une définition claire de ce qui est « fini ».

Concrètement, chaque chantier non trivial commence par une **spec écrite** déposée dans `docs/specs/`. La spec ne fait pas plus de deux ou trois pages. Elle dit ce qu'on veut, pourquoi on le veut, et ce qui doit être vrai pour considérer le travail terminé. Trois specs ont été écrites de cette manière au cours du projet (`2026-05-12-utseus-refonte-design.md`, `2026-05-15-favicon-cta-voice-footer-design.md`, `2026-05-15-three-risk-hardening-design.md`). Cette discipline a deux effets concrets : elle évite les malentendus dans une équipe où chacun ne suit pas tout en détail, et elle sert de référence à la revue, quand on doit décider si une branche est mergeable.

Pour éviter l'effet « gros tas de travail accumulé qu'on n'arrive plus à intégrer », nous avons mis en place des **paliers de validation automatisés**. Tant que le typecheck (`npm run check`), les tests unitaires (Vitest, douze tests), l'audit de liens (`npm run audit:links`) et les audits Lighthouse et axe-core ne sont pas verts, aucun tag n'est posé sur `main`. Cela force à intégrer souvent, en petits morceaux, plutôt qu'à laisser une branche diverger pendant trois semaines.

Nous n'avons en revanche pas mis en place de daily formel, de rôle de Scrum master, ni de mesure chiffrée de vélocité. Pour trois personnes qui se croisent à l'UTC et échangent par message instantané, ces rituels auraient été du folklore inutile. C'est de l'Agile « lite », adapté à la taille de l'équipe.

## Gitflow : main toujours déployable, branches par personne

La règle structurante du workflow Git est que la branche `main` représente à tout moment une version démontrable du site. Si un enseignant ou un client demande une démo en pleine itération, on déploie `main` sans peur. Cette règle élimine la classe de problèmes « tout est cassé parce que quelqu'un a poussé un work-in-progress ».

Pour la respecter, chaque membre de l'équipe développe sur sa propre branche personnelle. Au moment de la rédaction, trois branches sont actives dans le dépôt : `main` pour l'intégration, `Yang/Develop_Web` pour le contenu rédactionnel et les données projets, `zixuan` pour la partie design et tokens visuels. Le code de Pengcheng (composants, build, CI) passe par des branches `feature/*` courtes, créées pour une spec et fusionnées dès que la barrière de qualité est verte.

| Branche | Usage | État attendu |
|---|---|---|
| `main` | Version de référence, déployable et démontrable | Toujours verte, taguée à chaque livraison |
| `Yang/Develop_Web` | Contenu MDX, données projets, traductions | WIP autorisé, merge vers `main` après revue |
| `zixuan` | Design, tokens CSS, intégration des maquettes | WIP autorisé, merge après audit a11y |
| `feature/*` ponctuelles | Specs ciblées (favicon, hardening, etc.) | Courtes, fusionnées rapidement |

Le cycle classique pour un chantier ressemble à : ouvrir une spec, créer ou réutiliser une branche, coder, faire passer les paliers de validation, demander une revue rapide, fusionner sur `main`, tagguer si c'est une livraison. Pour un projet académique, cet enchaînement présente un avantage souvent sous-estimé : il rend la démo indépendante de l'état du poste d'un développeur particulier. Personne n'a besoin de dire « attends, je dois finir un truc » avant de montrer le site.

## Git worktree pour préserver les états explorés

Le développement d'un site éditorial implique beaucoup d'essais sur le visuel. On tente une nouvelle palette, un nouveau type de composant, un nouvel agencement de section ; au bout de deux jours, on se rend compte que c'était moins bon que l'état précédent. Sans précaution, l'ancienne version a été écrasée par les nouveaux commits et la retrouver demande de fouiller dans l'historique.

Pour gérer ce problème, nous nous appuyons sur `git worktree`. Cet outil permet d'avoir plusieurs dossiers de travail liés au même dépôt, chacun positionné sur une branche différente. En pratique, on peut conserver un worktree « stable » sur `main` ouvert dans un onglet de l'éditeur, et un worktree « expérimental » sur une branche de test ouvert dans un autre, sans risque qu'ils se marchent dessus. Lorsque l'expérimentation aboutit, on fusionne ; lorsqu'elle déçoit, on jette la branche et le worktree, et on reste sur l'état stable inchangé.

Le bénéfice est moins technique que psychologique : la peur de casser ce qui fonctionne déjà freine l'exploration. Quand le retour en arrière coûte trois secondes (`rm -rf` du worktree expérimental), on essaie plus librement, on garde plus facilement la version qui marche, et on cesse de garder « au cas où » du code mort dans la branche principale. Le coût se limite à un peu d'espace disque et à la discipline de se souvenir dans quel worktree on tape.

## Synchronisation et traçabilité

Le projet n'a pas d'outil de gestion de tâches type Jira ou Trello. La trace écrite passe par trois éléments versionnés dans le dépôt. `OWNERS.md` indique qui possède chaque artefact et qui le revoit, ce qui désamorce les conflits silencieux sur les mêmes fichiers. Les plans d'itération dans `docs/plans/` jouent le rôle de feuille de route et de définition des sprints. Les fichiers de suivi `docs/logs/*-track.md`, écrits à la clôture de chaque chantier, documentent ce qui a été fait, pourquoi, et les écarts par rapport à la spec initiale. Ils servent de mémoire collective et préparent les rétrospectives. Les discussions en direct se font à l'UTC quand l'équipe est ensemble, par message instantané sinon.

Sur six semaines, cette combinaison — spec avant code, Gitflow strict, worktree pour les essais, barrières de qualité automatisées — a tenu sans accroc majeur. La principale limite assumée est l'absence d'instrumentation chiffrée de la vélocité : nous savons ce qui a été livré, pas combien de temps chaque tâche a coûté. Pour un projet de cette taille, mesurer aurait été plus coûteux qu'utile.
