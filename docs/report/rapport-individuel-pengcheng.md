# Rapport individuel — Projet de refonte du site UTSEUS

**Auteur :** Pengcheng Li  
**UV :** LO18  
**Rôle :** Développement et contenu

Ce rapport rend compte de ma contribution personnelle au projet mené dans le cadre de l'UV LO18, avec Yang et Zixuan, pour le client Baoxia, responsable du programme UTSEUS. L'objectif du projet est de refondre le site web de l'UTSEUS. Mon rôle dans l'équipe couvre le volet développement et le suivi du contenu. Je présente ci-dessous ce que j'ai déjà réalisé, ce sur quoi je travaille en ce moment, et ce qu'il me reste à faire d'ici la livraison finale.

## Passé

Le sujet du projet a été décidé en équipe au début de l'UV, après plusieurs séances de discussion sur les pistes possibles. Refondre le site UTSEUS s'est imposé rapidement, pour deux raisons. La première est que nous sommes nous-mêmes étudiants du programme : nous connaissons l'institution de l'intérieur, ses publics et ses points faibles, ce qui nous donne une légitimité naturelle pour intervenir sur sa communication. La seconde est que le site actuel ne joue pas le rôle qu'il devrait jouer ; il est daté et sous-exploité par rapport au rayonnement réel de l'école. Lorsque nous avons présenté l'idée à Baoxia, elle a approuvé immédiatement et nous a indiqué qu'elle attendait des résultats concrets.

Comme mon rôle dans l'équipe touche au développement et au contenu, j'ai consacré le début du projet à me documenter sur les outils du front-end web, les frameworks récents et les pratiques actuelles. Je n'étais pas familier avec cet écosystème avant le projet, et il fallait combler cette lacune avant de pouvoir faire des choix techniques argumentés.

Pendant la phase d'analyse des besoins, j'ai participé activement à la réunion avec Baoxia. C'est lors de cette réunion que nous avons confirmé les trois axes prioritaires de la refonte : la prise en charge multilingue, la restructuration de l'arborescence des contenus, et la refonte de l'identité visuelle, dont le logo et les images de marque. Ces axes ont ensuite servi de cadre à toute la suite du travail.

Lors de la phase suivante, l'analyse du site existant, ma contribution personnelle a porté sur l'analyse subjective. J'ai produit une évaluation critique de l'interface et du contenu actuels du site, en repérant ce qui fonctionnait, ce qui freinait la lecture et ce qui devait être repris.

Pour le Cahier des charges, j'ai pris en charge plusieurs blocs. J'ai contribué à l'identification et à la structuration des différents profils d'utilisateurs du site, en distinguant cinq publics cibles : étudiants UTC candidats à la mobilité, corps enseignant et administratif de l'UTC, entreprises et partenaires industriels, public extérieur, et étudiants chinois de Shanghai University. Pour chacun, j'ai détaillé les objectifs de visite, les informations recherchées et les attentes spécifiques, ce qui a ensuite servi de référence pour décider de l'architecture des sections et de la hiérarchie des contenus.

J'ai aussi travaillé sur la gestion des risques, en listant les aléas susceptibles d'affecter la livraison (retard DSI, manque de photos sourcées, contenu non transmis à temps) et les actions de mitigation correspondantes. Enfin, je me suis occupé de l'élaboration du planning du projet : j'ai produit le diagramme de Gantt, le diagramme PERT et le tableau des Livrables, et j'ai préparé un tableau Excel attribuant à chaque membre de l'équipe ses tâches précises et leurs échéances. Cette mise au clair a permis à chacun de savoir ce qu'on attendait de lui à chaque jalon, et a évité les zones grises sur « qui fait quoi ».

## Présent

Une fois le CdC validé, je suis passé aux choix techniques. Plutôt que de partir sur du HTML, CSS et JavaScript classiques, j'ai retenu le framework Astro. Cette option a un coût d'apprentissage réel pour l'équipe, mais elle permet une meilleure répartition du travail entre les membres : la séparation entre composants, contenu rédactionnel et données structurées est explicite, ce qui rend possible que Yang travaille sur le contenu et Zixuan sur le design sans entrer en conflit avec mes développements. Pour un projet à trois personnes, ce gain de parallélisme compense largement le temps d'apprentissage.

J'ai ensuite consacré du temps à me former concrètement à Astro : structure des fichiers, fonctionnement des composants, gestion des collections de contenu et de l'internationalisation. À partir de là, j'ai construit le squelette du site. La démo est aujourd'hui exécutable en local et présente déjà la structure complète des sections envisagées. Je l'ai présentée à Baoxia lors de notre troisième réunion, ce qui a permis à la cliente de visualiser concrètement ce que nous proposons, au lieu de raisonner à partir de maquettes statiques.

Cette présentation a aussi débloqué une partie du contenu. À la suite des échanges, nous avons décidé d'ajouter deux sections par rapport au site actuel : une rubrique « Voix étudiantes » pour donner la parole aux anciens du programme, et un « Album d'activités » pour valoriser la vie étudiante sino-française. Pour garantir l'exactitude et la complétude des textes, j'ai aussi demandé à Baoxia, en tant que responsable UTSEUS, de nous transmettre les documents contractuels des projets cités, afin que la rédaction s'appuie sur des sources fiables plutôt que sur des reformulations approximatives.

Pour la troisième livraison du cours, *Réponse à l'appel à projet*, mes contributions personnelles ont porté sur trois blocs : le Rappel du cahier des charges et public visé, la partie Gestion de projet, et la partie Choix techniques. J'ai aussi participé à la scénarisation, en particulier sur la partie contenu, en lien avec Yang.

## Futur

Les prochaines semaines vont être consacrées à la bascule du prototype vers une version pleinement développée du site. Le premier chantier est la coopération avec Zixuan : il s'agit d'intégrer les choix visuels qu'elle finalise (palette, typographie, identité graphique) au sein du squelette que j'ai construit, et de développer ensemble les deux nouvelles sections décidées avec Baoxia. Le découpage est clair : Zixuan fournit les éléments visuels et les maquettes, j'assure l'intégration côté composants et la cohérence avec le système de design existant.

Le second chantier est la coopération avec Yang sur le contenu. Nous allons nous répartir la traduction des textes vers les trois langues du site et leur relecture croisée, pour garantir une parité réelle entre les versions française, anglaise et chinoise. Cela demande une coordination étroite, car chaque modification de fond doit être répercutée dans les trois fichiers.

Pour les deux nouvelles sections, du travail d'enquête est nécessaire. Pour les « Voix étudiantes », je vais envoyer des mails aux anciens étudiants ayant participé au programme UTSEUS, en leur demandant un témoignage et leur retour sur leur expérience. Pour l'« Album d'activités », j'écrirai à l'Université de Shanghai pour solliciter des photos d'activités étudiantes, idéalement libres de droits ou utilisables dans un cadre institutionnel.

Reste un point en suspens : la DSI de l'UTC n'a pas encore répondu à notre demande sur les normes officielles de déploiement (Header, Footer, conditions d'hébergement). Je dois relancer ce contact, parce que ces normes conditionnent la mise en ligne finale. En cas de retard, la voie de secours est de continuer à démontrer le site en local, ce qui ne bloquera pas l'évaluation académique mais retardera la mise en production réelle.

L'objectif que je me fixe pour la prochaine réunion client est de présenter à Baoxia une version du site sensiblement plus aboutie : design intégré, contenu réel sur les sections existantes, et au moins une des deux nouvelles sections en place avec des données pilotes. C'est à ce moment-là que nous pourrons vraiment juger si l'orientation prise répond à ses attentes.
