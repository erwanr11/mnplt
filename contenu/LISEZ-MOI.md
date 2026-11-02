# Dossier `contenu/` — ce que vous pouvez modifier sans toucher au code

Tout ce qui s'affiche vient de ces fichiers JSON. Après une modification, rechargez la page.
Attention à la syntaxe JSON : guillemets droits `"`, virgule entre deux éléments, pas de virgule après le dernier.

| Fichier | Contenu |
| --- | --- |
| `accueil.json` | Textes de l'accueil, mise en scène du petit diorama, texte de la bulle. |
| `personnages.json` | Nom, rôle, couleur et initiale de l'avatar de chaque personnage. |
| `scenes/demo-petition.json` | La scène de démonstration : titre, progression, mise en scène, répliques et choix. |
| `decors/boulangerie.json` | Le décor complet de la boulangerie. |
| `decors/boulangerie-accueil.json` | La variante simplifiée pour l'accueil : elle reprend `boulangerie.json` et ne décrit que les différences. |

## Les unités

Une unité = un pixel de la maquette de la scène (écran de 390 px de large).
La boulangerie mesure 220 × 220 au sol, avec des murs de 150 de haut.

## Un décor

- `piece` : `largeur` (le long du mur droit), `profondeur` (le long du mur gauche), `hauteurMurs`.
- `socle` : épaisseur et couleurs du bloc sous le plancher.
- `sol` : couleur, `dalles` (pas et couleur des joints), `bordureMurDroit` (bande le long du mur droit).
- `murs.gauche` / `murs.droit` : `couleur`, `plinthe`, et la liste `elements`.
- `arete` : le trait du coin entre les deux murs.
- `objets` : ce qui est posé au sol (`plante`, `lampadaire`, `boite`).
- `cadrage.marges` : l'espace laissé autour du dessin.

### Les éléments de mur

Chaque élément a un `id`, un `type`, une position `u` (depuis le bord gauche du mur, tel qu'on le voit) et `v` (depuis le haut du mur), une `largeur` et une `hauteur`.

| Type | Réglages |
| --- | --- |
| `fenetre` | `vitre`, `cadre`, `epaisseurCadre`, `croisillons` (true / false) |
| `affiche` | `texte` (ou null), `couleurTexte`, `taille`, `arbre`, `tronc` |
| `enseigne` | `fond`, `texte` (ou null pour une simple barre), `couleurTexte`, `taille`, `espacement` |
| `store` | `fond`, `rayure`, `largeurRayure`, `pas`, `ourlet` |
| `porte` | `couleur`, `vitre` (ou null), `poignee` (ou null) |
| `vitrine` | `fond`, `cadre`, `etagere`, `pains`, `viennoiseries` (positions relatives à la vitrine) |

### Les objets au sol

Position `x` (le long du mur droit, depuis le coin du fond) et `y` (le long du mur gauche, depuis le coin du fond).

| Type | Réglages |
| --- | --- |
| `boite` | `longueur`, `profondeur`, `hauteur`, `couleur` (+ `couleurDessus`, `couleurOmbre`, sinon calculées), `dessus` (feuilles posées), `panneau` |
| `plante` | `touffes` (1 à 3), `pot`, `soucoupe` |
| `lampadaire` | `hauteur`, `couleur`, `lumiere` (couleur de l'ampoule, ou null si éteint) |

## Une variante de décor

Une variante commence par `"herite": "nom-du-decor"` et ne contient que ce qui change :
- un réglage modifié remplace celui du modèle ;
- `null` supprime un réglage (par exemple `"plinthe": null`) ;
- un élément est retrouvé par son `id` ; `"retirer": true` l'enlève ; un nouvel `id` l'ajoute.

## Une mise en scène

Dans une scène (ou dans `accueil.json`), on ajoute au décor :
- `objets` : comme dans un décor (par exemple le stand de la pétition) ;
- `personnages` : `id` (`madame-o`, `irene`), position `x` / `y`, `sens` (`gauche` ou `droite`) ;
- `description` : le texte lu par les lecteurs d'écran.
