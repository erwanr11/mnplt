# Dossier `maquettes/` — Ficelles

Ce dossier contient les maquettes **validées** du jeu. Elles font foi pour le rendu visuel : couleurs, typographies, proportions, ton des textes et composition des écrans.

Chaque fichier est une page HTML autonome, au format d'un téléphone en portrait (390 × 844 px). On l'ouvre dans un navigateur ; les polices (DM Sans, DM Serif Display) se chargent depuis Google Fonts, il faut donc être connecté. Les boutons sont reliés entre eux : on peut parcourir les écrans en cliquant.

## Ce qu'il faut reprendre, et ce qu'il ne faut pas reprendre

**À reprendre fidèlement**
- Les couleurs exactes (voir la palette plus bas) et les typographies.
- La composition de chaque écran : ordre des éléments, hiérarchie, tailles de texte, place des boutons.
- Les dessins SVG des dioramas : géométrie isométrique, couleurs des murs et du sol, silhouettes des personnages, objets. Tu peux réutiliser directement les tracés SVG.
- Les textes d'interface (« Lever de rideau », « Je vois la manœuvre », « Déjà accepté »…).

**À ne pas reprendre tel quel**
- La structure du code : les maquettes placent tout en position absolue, au pixel près. Dans le vrai jeu, il faut des composants réutilisables, une mise en page qui s'adapte à la hauteur de l'écran, et des scènes décrites en données (JSON).
- Les dioramas « en dur » : dans le jeu, ils doivent être générés par un module de projection isométrique (x, y, z → écran) à partir des données de la scène.
- Les chiffres affichés (2 / 3, 4 jours, 3 sur 15…) : ce sont des exemples, ils doivent venir de l'état du jeu.

## Les écrans

| Fichier | Écran | Points clés |
| --- | --- | --- |
| `01-accueil-premier-lancement.html` | Accueil au premier lancement | Fond sombre = la salle du théâtre (rideaux sur les bords, faisceau de projecteur, halo). Logotype « Ficelles. » en DM Serif Display 62 px, point moutarde. Diorama en plein jour. Baseline avec « oui » en moutarde. Un seul bouton « Lever de rideau » + lien « J'ai déjà un carnet ». Trois niveaux de lecture seulement. |
| `02-scene-petition.html` | Une scène en cours | Barre de progression segmentée. Grand diorama isométrique (boulangerie, stand, personnages). Carte de dialogue : avatar, nom, rôle, réplique, didascalie en italique (elle contient l'indice). Trois choix : deux boutons secondaires + bouton principal « Je vois la manœuvre ». |
| `03-loupe-choix-manoeuvre.html` | Le joueur pense voir une manœuvre | Loupe qui grossit l'indice (la main sur le bras). Indices relevés en étiquettes. Trois manœuvres au choix, avec icône et principe en une ligne ; l'option sélectionnée a une bordure vert d'eau et une coche. Rappel : une fausse accusation refroidit l'ambiance. |
| `04-manoeuvre-dejouee.html` | Réussite | Madame O. repart, libre, une baguette sous le bras ; Irène lui fait signe. Carte : « Manœuvre déjouée », nom de la manœuvre, explication en une phrase, **réplique toute faite** pour la vraie vie, étiquettes « +1 carte au carnet » et « Ambiance au beau fixe ». |
| `05-bras-charges.html` | L'emprise sans fils | Madame O. porte trois cartons et une affiche roulée : chaque « oui » ajoute un objet. Ligne « Déjà accepté » avec les engagements en étiquettes. La grande demande arrive (le stand du samedi). |
| `06-gazette.html` | Fin de scène | « La Gazette de Dolmatie » : titre en DM Serif Display, mini-diorama, critique, étoiles, puis trois chiffres (manœuvres déjouées, engagements, ambiance). |
| `07-carnet.html` | Le carnet | Une carte illustrée par manœuvre, filtres « Toutes / Déjouées / Subies / À découvrir », cartes à découvrir grisées avec un indice. Navigation basse : Théâtre, Carnet, Gazette. |

### Pour plus tard (ne pas développer maintenant)

| Fichier | Écran |
| --- | --- |
| `plus-tard/accueil-defi-du-jour.html` | Accueil des jours suivants, version « défi du jour » : une réplique à juger en 30 secondes depuis l'accueil, série de jours, bouclier qui progresse par niveaux, reprise de la pièce en cours. |
| `plus-tard/accueil-carte-du-quartier.html` | Accueil des jours suivants, version « carte du quartier » : la Dolmatie en isométrique, un bâtiment par pièce, lieux verrouillés grisés. |

Le choix entre ces deux accueils n'est pas encore fait.

## Règles visuelles non négociables

1. **Jamais de fils ni de ficelles dessinés à l'écran.** L'emprise se voit aux bras chargés de Madame O.
2. **La lisibilité d'abord** : peu de niveaux de lecture par écran, textes d'au moins 15 px, boutons d'au moins 50 px de haut, dans le tiers bas de l'écran.
3. **Personnages en aplats**, silhouettes simples, visages minimaux (un point pour l'œil, pas de joues roses).

## Palette

| Rôle | Couleur |
| --- | --- |
| Bleu nuit : texte, boutons principaux | `#24324A` |
| Vert d'eau : Madame O., progression, succès | `#2F8F8B` |
| Corail : store, alertes, engagements | `#F26B5B` |
| Moutarde : Irène, accents, bouton de l'accueil | `#F2B544` |
| Fond des écrans de jeu | `#E6EFEE` |
| Fond de l'accueil (la salle) | `#171F2E` |
| Texte secondaire sur fond sombre | `#D0D8E4` minimum |
| Texte secondaire sur fond clair | `#5D6B80` |

## Typographies

- Interface : **DM Sans** (400, 500, 700).
- Logotype « Ficelles. » et titres de la Gazette : **DM Serif Display**.

## Captures d'écran

Le sous-dossier `captures/` est à remplir avec une capture de chaque écran (prise depuis un navigateur en largeur 390 px, ou depuis la planche de maquettes). Elles servent de référence rapide quand on ne peut pas ouvrir les pages HTML.
