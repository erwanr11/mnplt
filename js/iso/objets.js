// Objets posés au sol : boîte isométrique (stand, comptoir…), plante, lampadaire.
//
// Chaque fonction reçoit l'objet décrit dans le JSON et la projection,
// et renvoie { profondeur, svg }. La profondeur sert à dessiner du fond vers l'avant.

import { balise, points, matrice } from '../svg.js';

/** Éclaircit (+) ou assombrit (−) une couleur #RRGGBB. */
export function nuancer(hex, quantite) {
  const v = parseInt(hex.slice(1), 16);
  const canal = (c) => {
    const cible = quantite >= 0 ? 255 : 0;
    return Math.round(c + (cible - c) * Math.abs(quantite));
  };
  const r = canal(v >> 16), g = canal((v >> 8) & 255), b = canal(v & 255);
  return '#' + [r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('').toUpperCase();
}

// ---------------------------------------------------------------------------
// Boîte isométrique : trois faces visibles (dessus, face avant-gauche, face avant-droite).
// ---------------------------------------------------------------------------
function boite(o, proj) {
  const { x, y } = o;
  const z = o.z ?? 0;
  const l = o.longueur, p = o.profondeur, h = o.hauteur;
  const couleur = o.couleur ?? '#F26B5B';
  const dessus = o.couleurDessus ?? nuancer(couleur, 0.35);
  const ombre = o.couleurOmbre ?? nuancer(couleur, -0.12);
  const P = (a, b, c) => proj.projeter(a, b, c);

  let svg = '';
  svg += balise('polygon', { points: points([P(x, y, z + h), P(x + l, y, z + h), P(x + l, y + p, z + h), P(x, y + p, z + h)]), fill: dessus });
  svg += balise('polygon', { points: points([P(x + l, y, z + h), P(x + l, y + p, z + h), P(x + l, y + p, z), P(x + l, y, z)]), fill: ombre });
  svg += balise('polygon', { points: points([P(x, y + p, z + h), P(x + l, y + p, z + h), P(x + l, y + p, z), P(x, y + p, z)]), fill: couleur });

  // Objets plats posés sur le dessus (feuilles, tracts…), en coordonnées relatives à la boîte.
  if (o.dessus?.length) {
    const m = proj.matriceSol(x, y, z + h);
    const contenu = o.dessus.map((f) => balise('rect', {
      x: f.x, y: f.y, width: f.longueur, height: f.profondeur,
      fill: f.couleur ?? '#FFFFFF', opacity: f.opacite,
    })).join('');
    svg += balise('g', { transform: matrice(m) }, contenu);
  }

  if (o.panneau) svg += panneau(o.panneau, x, y, z + h, proj);

  return { profondeur: x + l / 2 + y + p / 2, svg };
}

/** Petit panneau sur un poteau, face au joueur comme le mur droit. */
function panneau(pn, x0, y0, z0, proj) {
  const bx = x0 + pn.x, by = y0 + pn.y;
  const base = proj.projeter(bx, by, z0);
  const poteau = pn.poteau ?? 36;
  const w = pn.largeur ?? 27.7, h = pn.hauteur ?? 16;
  const encre = pn.couleurPoteau ?? '#24324A';
  let svg = balise('path', { d: `M${base.x} ${base.y} V${base.y - poteau}`, stroke: encre, strokeWidth: 2 });
  const m = proj.matricePlanX(bx - w / 2, by, z0 + poteau + 5);
  let plan = balise('rect', { x: 0, y: 0, width: w, height: h, fill: pn.fond ?? '#FFFFFF', stroke: encre, strokeWidth: 1.5 });
  if (pn.lignes) {
    plan += balise('path', {
      d: `M${0.21 * w} ${0.31 * h} H${0.79 * w} M${0.21 * w} ${0.62 * h} H${0.67 * w}`,
      stroke: pn.lignes, strokeWidth: 2,
    });
  }
  svg += balise('g', { transform: matrice(m) }, plan);
  return svg;
}

// ---------------------------------------------------------------------------
// Plante en pot (dessinée de face, posée sur son point au sol).
// ---------------------------------------------------------------------------
const FEUILLAGE = [
  { x: -5, y: -20, r: 7, c: '#7FB07A' },
  { x: 4, y: -23, r: 8, c: '#6CA367' },
  { x: 0, y: -30, r: 6, c: '#86BA80' },
];

function plante(o, proj) {
  const b = proj.projeter(o.x, o.y, 0);
  let svg = '';
  if (o.soucoupe !== false) svg += balise('ellipse', { cx: 0, cy: 0, rx: 11, ry: 5.5, fill: o.couleurSoucoupe ?? '#2F6F6B' });
  svg += balise('rect', { x: -9, y: -12, width: 18, height: 12, fill: o.pot ?? '#3E8E89' });
  for (const f of FEUILLAGE.slice(0, o.touffes ?? 3)) {
    svg += balise('circle', { cx: f.x, cy: f.y, r: f.r, fill: f.c });
  }
  return { profondeur: o.x + o.y, svg: balise('g', { transform: `translate(${b.x} ${b.y}) scale(${o.echelle ?? 1})` }, svg) };
}

// ---------------------------------------------------------------------------
// Lampadaire (de face). « lumiere » : couleur de l'ampoule, ou null si éteint.
// ---------------------------------------------------------------------------
function lampadaire(o, proj) {
  const b = proj.projeter(o.x, o.y, 0);
  const h = o.hauteur ?? 100;
  const c = o.couleur ?? '#24324A';
  let svg = balise('rect', { x: -2, y: -h, width: 4, height: h, fill: c });
  svg += balise('path', { d: `M-10 ${-h} H10 L6 ${-h - 12} H-6 Z`, fill: c });
  if (o.lumiere) svg += balise('rect', { x: -5, y: -h - 6, width: 10, height: 5, fill: o.lumiere });
  return { profondeur: o.x + o.y, svg: balise('g', { transform: `translate(${b.x} ${b.y})` }, svg) };
}

const TYPES = { boite, plante, lampadaire };

export function dessinerObjet(objet, proj) {
  const dessin = TYPES[objet.type];
  if (!dessin) {
    console.warn(`Ficelles : type d'objet inconnu « ${objet.type} »`);
    return null;
  }
  return dessin(objet, proj);
}
