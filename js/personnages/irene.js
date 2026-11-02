// Irène — la militante du quartier. Manteau moutarde, cheveux gris, lunettes,
// un stylo tendu et un porte-bloc. Dessinée de face, regard vers la gauche.
// Coordonnées locales : (0, 0) = entre les pieds.

import { balise } from '../svg.js';

const C = {
  manteau: '#F2B544',
  couture: '#D99A2E',
  peau: '#E3B48E',
  cheveux: '#AEB6BF',
  jambes: '#3A3F4B',
  chaussures: '#1A2436',
  papier: '#FFFFFF',
  lignes: '#9AA3AD',
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
    balise('path', { d: 'M-14 -78 Q0 -86 14 -78 L18 -30 L-18 -30 Z', fill: C.manteau }) +
    balise('path', { d: 'M0 -80 V-32', stroke: C.couture, strokeWidth: 1.2 }),
  // Bras côté regard (à gauche)
  brasAvant: {
    stylo: () =>
      balise('path', { d: 'M-12 -72 Q-26 -64 -36 -60', fill: 'none', stroke: C.manteau, strokeWidth: 7, strokeLinecap: 'round' }) +
      balise('circle', { cx: -38, cy: -59, r: 3.6, fill: C.peau }) +
      balise('path', { d: 'M-40 -60 L-51 -64', stroke: C.encre, strokeWidth: 2.4, strokeLinecap: 'round' }),
  },
  // Bras côté dos (à droite)
  brasArriere: {
    porteBloc: () =>
      balise('path', { d: 'M13 -72 L18 -54', fill: 'none', stroke: C.manteau, strokeWidth: 7, strokeLinecap: 'round' }) +
      balise('rect', { x: 10, y: -64, width: 16, height: 22, rx: 1.5, fill: C.papier, stroke: C.encre, strokeWidth: 1.5, transform: 'rotate(8 18 -53)' }) +
      balise('path', { d: 'M14 -57 H23 M14 -53 H23 M14 -49 H20', stroke: C.lignes, strokeWidth: 1.2, transform: 'rotate(8 18 -53)' }),
  },
  tete: () =>
    balise('circle', { cx: 0, cy: -96, r: 11, fill: C.peau }) +
    balise('path', { d: 'M-11 -98 Q-12 -110 0 -110 Q12 -110 11 -96 Q7 -104 0 -104 Q-7 -104 -11 -98 Z', fill: C.cheveux }) +
    balise('circle', { cx: -5, cy: -95, r: 3.4, fill: 'none', stroke: C.encre, strokeWidth: 1.2 }) +
    balise('circle', { cx: -5.4, cy: -95, r: 1.1, fill: C.encre }),
};

export default {
  id: 'irene',
  sensNatif: 'gauche',
  ancres: { bulle: { x: -4, y: -116 } },
  dessiner(options = {}) {
    const pose = { brasAvant: 'stylo', brasArriere: 'porteBloc', ...options.pose };
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
