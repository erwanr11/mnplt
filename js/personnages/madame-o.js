// Madame O. — l'héroïne. Manteau vert d'eau, col moutarde, chignon brun, sac corail.
// Dessinée de face, regard vers la droite. Coordonnées locales : (0, 0) = entre les pieds.
// Chaque partie est une fonction séparée pour que les lots suivants puissent changer
// la pose (bras levé, bras chargés…) sans redessiner tout le personnage.

import { balise } from '../svg.js';

const C = {
  manteau: '#2F8F8B',
  col: '#F2B544',
  peau: '#F2C9A8',
  cheveux: '#5B3A29',
  jambes: '#24324A',
  chaussures: '#1A2436',
  sac: '#F26B5B',
  anse: '#C9564A',
  encre: '#24324A',
};

const parties = {
  ombre: () => balise('ellipse', { cx: 0, cy: 0, rx: 20, ry: 5, fill: C.encre, opacity: 0.12 }),
  jambes: () =>
    balise('rect', { x: -8, y: -38, width: 6, height: 36, rx: 2, fill: C.jambes }) +
    balise('rect', { x: 3, y: -38, width: 6, height: 36, rx: 2, fill: C.jambes }) +
    balise('path', { d: 'M-10 -4 H-1 V1 H-13 Z', fill: C.chaussures }) +
    balise('path', { d: 'M2 -4 H11 V1 H-1 Z', fill: C.chaussures }),
  manteau: () =>
    balise('path', { d: 'M-14 -78 Q0 -86 14 -78 L20 -30 L-20 -30 Z', fill: C.manteau }) +
    balise('path', { d: 'M-10 -82 Q0 -74 10 -82 L10 -76 Q0 -70 -10 -76 Z', fill: C.col }),
  // Bras côté regard (à droite)
  brasAvant: {
    tendu: () =>
      balise('path', { d: 'M13 -74 Q22 -64 28 -54', fill: 'none', stroke: C.manteau, strokeWidth: 7, strokeLinecap: 'round' }) +
      balise('circle', { cx: 29, cy: -52, r: 3.6, fill: C.peau }),
  },
  // Bras côté dos (à gauche), avec ou sans sac
  brasArriere: {
    bas: (o) =>
      balise('path', { d: 'M-13 -72 L-20 -56', fill: 'none', stroke: C.manteau, strokeWidth: 7, strokeLinecap: 'round' }) +
      (o.sac === false ? '' :
        balise('rect', { x: -30, y: -60, width: 16, height: 14, rx: 2.5, fill: C.sac }) +
        balise('path', { d: 'M-27 -60 Q-22 -68 -17 -60', fill: 'none', stroke: C.anse, strokeWidth: 1.5 })),
  },
  tete: () =>
    balise('circle', { cx: 0, cy: -96, r: 11, fill: C.peau }) +
    balise('path', { d: 'M-11 -97 Q-12 -110 0 -110 Q11 -110 11 -100 Q4 -104 -4 -102 Q-8 -100 -11 -97 Z', fill: C.cheveux }) +
    balise('circle', { cx: -9, cy: -107, r: 6.5, fill: C.cheveux }) +
    balise('circle', { cx: 5, cy: -95, r: 1.3, fill: C.encre }),
};

export default {
  id: 'madame-o',
  sensNatif: 'droite',
  /** Point où pointe une bulle de dialogue (au-dessus de la tête). */
  ancres: { bulle: { x: 4, y: -116 } },
  dessiner(options = {}) {
    const pose = { brasAvant: 'tendu', brasArriere: 'bas', ...options.pose };
    return (
      parties.ombre() +
      parties.jambes() +
      parties.manteau() +
      parties.brasAvant[pose.brasAvant](options) +
      parties.brasArriere[pose.brasArriere](options) +
      parties.tete()
    );
  },
};
