# Ficelles

Jeu mobile des manœuvres du quotidien. Application web statique : aucun outil à installer.

- **Tester** : le dossier doit être servi par un serveur web (IONOS, ou un aperçu en ligne). Ouvrir `index.html` en double-cliquant ne suffit pas, car le navigateur refuse alors de lire les fichiers JSON.
- **Mettre en ligne** : téléverser tout le dossier (sauf `maquettes/` si vous le souhaitez) dans `brodin.fr/ficelles/`.
- **Modifier le contenu** : voir `contenu/LISEZ-MOI.md`.

## Organisation

```
index.html                 point d'entrée (#accueil, #scene)
css/                       thème (palette, polices), composants, écrans
js/main.js                 navigation entre les écrans
js/iso/                    moteur de diorama isométrique
  projection.js            (x, y, z) → écran
  elements-mur.js          fenêtre, porte, vitrine, enseigne, store, affiche
  objets.js                boîte isométrique, plante, lampadaire
  diorama.js               assemble un décor JSON + une mise en scène en SVG
js/personnages/            Madame O., Irène, placement dans n'importe quel décor
js/ui/composants.js        barre de progression, carte de dialogue, boutons de choix
js/ecrans/                 accueil, scène
contenu/                   tout le contenu modifiable (JSON)
maquettes/                 maquettes validées (référence visuelle)
```
