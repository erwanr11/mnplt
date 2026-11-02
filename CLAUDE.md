# Ficelles — mémo permanent pour Claude Code

Ce fichier décrit ce qui ne change pas d'une session à l'autre. Relis-le avant chaque tâche. Les tâches elles-mêmes arrivent dans mes messages, un lot à la fois.

## Qui je suis et comment travailler avec moi

- Je suis chef de projet numérique, pas développeur. Explique tes choix simplement, en français, sans jargon inutile.
- Je travaille sous Windows et je préfère ne rien installer de compliqué sur mon poste. Garde la chaîne d'outils la plus légère possible ; si une installation est indispensable, explique-moi pourquoi et comment, pas à pas.
- Je teste sur mon téléphone : **Samsung Galaxy S24 FE, Chrome, en portrait**. C'est la référence pour juger le rendu.
- Avant toute décision structurante (organisation du code, bibliothèque, format de données), propose-moi l'option et attends mon accord.
- **Arrête-toi à la fin de chaque lot** pour que je valide sur mon téléphone. Termine par un récapitulatif court : ce qui est fait, comment le tester, ce qui reste à décider.
- Si quelque chose dans mes demandes est flou ou contradictoire, pose-moi la question plutôt que de deviner.

## Le projet

**Ficelles** est un jeu mobile solo, en français, inspiré du *Petit traité de manipulation à l'usage des honnêtes gens* (Joule et Beauvois). Il apprend à repérer les manœuvres du quotidien (pied-dans-la-porte, amorçage, porte-au-nez…) et à y répondre, avec humour et sans méchanceté.

- Pays imaginaire : la **Dolmatie**. Héroïne : **Madame O.**
- Personnages récurrents : Irène (militante), Gaspard (vendeur), M. Velkoff (le chef), Lou (l'ado), Mme Brague (la boulangère), Hector (le voisin), le Professeur Beaujoule (le narrateur).
- Chaque scène est un **petit diorama isométrique** vu en coupe. Un personnage fait une demande ; le joueur accepte, refuse, ou dit « **Je vois la manœuvre** » et doit la nommer.
- **L'emprise se voit aux bras chargés** : chaque « oui » ajoute un objet que Madame O. doit porter. Déjouer une manœuvre lui libère les bras et donne au joueur une **réplique toute faite** pour la vraie vie.
- Quatre pièces sont prévues : I « Madame O. », II « L'Escalade », III « Le Castelet numérique », IV « Une journée en Dolmatie ». Seule la pièce I est à développer pour l'instant, mais l'architecture doit permettre d'ajouter les autres.

## Documents de référence

- `maquettes/` : les maquettes validées, une page HTML par écran, avec `maquettes/LISEZ-MOI.md`. **Elles font foi pour le rendu visuel.** Lis le LISEZ-MOI avant de toucher à l'interface.
- `maquettes/captures/` : captures d'écran des mêmes écrans.
- Le document de conception complet m'appartient ; je te transmets les extraits utiles au fil des lots.

## Règles non négociables

1. **Jamais de fils ni de ficelles dessinés à l'écran.**
2. **La lisibilité d'abord** : peu de niveaux de lecture par écran, boutons d'au moins 50 px de haut, actions dans le tiers bas de l'écran. Tailles de texte :
   - **15 px minimum pour les textes à lire** : répliques, explications, boutons ;
   - **12 px minimum pour les textes d'appoint** : étiquettes, rôles, signature, titres de scène, didascalies — avec un contraste vérifié (au moins 4,5:1).
3. **Aucune phrase du livre** : tous les textes sont originaux.
4. **Le contenu est séparé du code** : scènes, répliques, manœuvres et décors vivent dans des fichiers JSON que je peux modifier moi-même sans toucher au code.
5. **Tout le dessin est en SVG généré par le code**, sans images externes.
6. Personnages en aplats, silhouettes simples, visages minimaux (un point pour l'œil, pas de joues roses).

## Contraintes techniques

- Application web statique et installable (PWA), sans serveur ni compte.
- Hébergement : mon espace IONOS, dans `brodin.fr/ficelles/`. Le résultat final doit être un dossier de fichiers que je peux téléverser tel quel.
- Mobile d'abord, en portrait, jouable d'une main. Sur un écran plus large, l'appli reste centrée, avec une largeur maximale d'environ 430 px.
- Sauvegarde de la progression dans le stockage du navigateur.
- Un **module de projection isométrique** (x, y, z → position à l'écran) place sols, murs, objets et personnages ; chaque scène est décrite en données et dessinée par ce module.
- Moteurs réutilisables d'une pièce à l'autre : diorama, scène (dialogues et choix), engagements (bras chargés).

## Direction artistique

### Palette

| Rôle | Couleur |
| --- | --- |
| Bleu nuit : texte, boutons principaux | `#24324A` |
| Vert d'eau : Madame O., progression, succès | `#2F8F8B` |
| Corail : store, alertes, engagements | `#F26B5B` |
| Moutarde : Irène, accents, bouton de l'accueil | `#F2B544` |
| Fond des écrans de jeu | `#E6EFEE` |
| Fond de l'accueil (la salle de théâtre) | `#171F2E` |
| Texte secondaire sur fond sombre | `#D0D8E4` minimum |
| Texte secondaire sur fond clair | `#5D6B80` |

### Typographies (Google Fonts)

- Interface : **DM Sans** (400, 500, 700).
- Logotype « Ficelles. » et titres de la Gazette : **DM Serif Display**.

### Composants

- Cartes blanches arrondies (rayon 20 px), ombres très légères.
- Bouton principal bleu nuit avec une loupe moutarde ; boutons secondaires blancs à bordure claire.
- Barre de progression segmentée en haut de chaque scène.
- Navigation basse : Théâtre, Carnet, Gazette.

### Accessibilité

- Contrastes vérifiés ; aucune information portée par la seule couleur.
- Chaque illustration a une description textuelle pour les lecteurs d'écran.
- Mode « mouvements réduits » respecté.
- Son coupé par défaut ; vibration légère quand un engagement s'ajoute, plus nette quand une manœuvre est déjouée.

## Mécanique d'engagement

Chaque acte accepté a des attributs : `libre`, `public`, `explicite`, `couteux`, `irrevocable`, `repete`.
- Un acte **non libre** n'engage presque pas.
- Chaque autre attribut **alourdit** l'engagement, donc la taille de l'objet que Madame O. doit porter.

## Format des données d'une réplique (base, à faire évoluer si besoin en m'expliquant pourquoi)

```json
{
  "scene": "petition-boulangerie",
  "decor": "boulangerie",
  "personnage": "irene",
  "replique": "Vous avez une seconde ? Juste une signature pour le parc.",
  "didascalie": "Elle tend le stylo et pose la main sur votre bras.",
  "indices": ["« Juste une signature »", "La main sur le bras"],
  "technique": "pied-dans-la-porte",
  "etape": "acte-preparatoire",
  "engagement": { "libre": true, "public": true, "explicite": true, "couteux": false },
  "objet": "signature",
  "choix": [
    { "texte": "Bien sûr", "effet": "accepte" },
    { "texte": "Non merci", "effet": "refuse" },
    { "texte": "Je vois la manœuvre", "effet": "denoncer" }
  ],
  "replique_conseil": "Je signe volontiers, mais je ne ferai rien de plus."
}
```

## Ton des textes

Court, drôle, tendre. Personne n'est méchant : c'est souvent pire, tout le monde est sympathique. Vouvoiement du joueur dans l'interface.
