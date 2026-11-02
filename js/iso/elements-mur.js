// Éléments dessinés à plat sur un mur : fenêtre, affiche, enseigne, store, porte, vitrine.
//
// Chaque élément est décrit dans le JSON du décor avec :
//   u, v      : position du coin haut-gauche sur le mur (u depuis le bord gauche du mur
//               tel qu'on le voit à l'écran, v depuis le haut du mur) ;
//   largeur, hauteur : taille ;
//   et des réglages propres à chaque type (couleurs, texte…).
// Le moteur plaque ensuite le dessin sur le mur avec une matrice isométrique.

import { balise } from '../svg.js';

const POLICE = 'DM Sans, sans-serif';

function fenetre(e) {
  const { u, v, largeur: w, hauteur: h } = e;
  const cadre = e.cadre ?? '#FFFFFF';
  let svg = balise('rect', {
    x: u, y: v, width: w, height: h,
    fill: e.vitre ?? '#A9C6D3', stroke: cadre, strokeWidth: e.epaisseurCadre ?? 3,
  });
  if (e.croisillons !== false) {
    svg += balise('path', {
      d: `M${u + w / 2} ${v} V${v + h} M${u} ${v + h / 2} H${u + w}`,
      stroke: cadre, strokeWidth: e.epaisseurCroisillons ?? 2,
    });
  }
  return svg;
}

function affiche(e) {
  const { u, v, largeur: w, hauteur: h } = e;
  let svg = balise('rect', { x: u, y: v, width: w, height: h, fill: e.fond ?? '#FFFFFF' });
  if (e.arbre !== false) {
    svg += balise('circle', { cx: u + w / 2, cy: v + 0.4 * h, r: 0.18 * w, fill: e.couleurArbre ?? '#7FB07A' });
    if (e.tronc !== false) {
      svg += balise('rect', { x: u + w / 2 - 1, y: v + 0.5 * h, width: 2, height: 0.2 * h, fill: e.couleurTronc ?? '#6B5444' });
    }
  }
  if (e.texte) {
    svg += balise('text', {
      x: u + w / 2, y: v + 0.9 * h, textAnchor: 'middle',
      fontFamily: POLICE, fontWeight: 700, fontSize: e.taille ?? 6.5, fill: e.couleurTexte ?? '#F26B5B',
    }, e.texte);
  }
  return svg;
}

function enseigne(e) {
  const { u, v, largeur: w, hauteur: h } = e;
  const couleurTexte = e.couleurTexte ?? '#F2B544';
  let svg = balise('rect', { x: u, y: v, width: w, height: h, rx: e.arrondi ?? 2, fill: e.fond ?? '#24324A' });
  if (e.texte) {
    const taille = e.taille ?? 13;
    svg += balise('text', {
      x: u + w / 2, y: v + h / 2 + taille * 0.38, textAnchor: 'middle',
      fontFamily: POLICE, fontWeight: 700, fontSize: taille, letterSpacing: e.espacement ?? 2, fill: couleurTexte,
    }, e.texte);
  } else {
    // Sans texte (petits formats) : une simple barre lumineuse.
    const hb = 0.43 * h;
    svg += balise('rect', { x: u + 0.07 * w, y: v + (h - hb) / 2, width: 0.86 * w, height: hb, rx: hb / 2, fill: couleurTexte });
  }
  return svg;
}

function store(e) {
  const { u, v, largeur: w, hauteur: h } = e;
  const lr = e.largeurRayure ?? 14.5;
  const pas = e.pas ?? lr * 2;
  let svg = balise('rect', { x: u, y: v, width: w, height: h, fill: e.fond ?? '#FFF8EE' });
  for (let x = u; x + lr <= u + w + 0.01; x += pas) {
    svg += balise('rect', { x, y: v, width: lr, height: h, fill: e.rayure ?? '#F26B5B' });
  }
  if (e.ourlet) {
    svg += balise('rect', { x: u, y: v + h, width: w, height: e.ourlet.hauteur, fill: e.ourlet.couleur });
  }
  return svg;
}

function porte(e) {
  const { u, v, largeur: w, hauteur: h } = e;
  let svg = balise('rect', { x: u, y: v, width: w, height: h, fill: e.couleur ?? '#2F8F8B' });
  if (e.vitre) {
    svg += balise('rect', { x: u + 0.15 * w, y: v + 0.105 * h, width: 0.7 * w, height: 0.395 * h, fill: e.vitre });
  }
  if (e.poignee) {
    svg += balise('circle', { cx: u + 0.8 * w, cy: v + 0.605 * h, r: 2.2, fill: e.poignee });
  }
  return svg;
}

function vitrine(e) {
  const { u, v, largeur: w, hauteur: h } = e;
  const cadre = e.cadre ?? '#24324A';
  let svg = balise('rect', {
    x: u, y: v, width: w, height: h,
    fill: e.fond ?? '#CFE5E7', stroke: cadre, strokeWidth: e.epaisseurCadre ?? 2.5,
  });
  if (e.etagere) {
    svg += balise('rect', { x: u, y: v + e.etagere.v, width: w, height: e.etagere.hauteur ?? 3, fill: cadre });
  }
  for (const p of e.pains ?? []) {
    svg += balise('ellipse', { cx: u + p.u, cy: v + p.v, rx: p.rx, ry: p.ry, fill: p.couleur });
  }
  for (const p of e.viennoiseries ?? []) {
    svg += balise('circle', { cx: u + p.u, cy: v + p.v, r: p.r, fill: p.couleur });
  }
  return svg;
}

const TYPES = { fenetre, affiche, enseigne, store, porte, vitrine };

export function dessinerElementMur(element) {
  const dessin = TYPES[element.type];
  if (!dessin) {
    console.warn(`Ficelles : type d'élément de mur inconnu « ${element.type} »`);
    return '';
  }
  return dessin(element);
}
