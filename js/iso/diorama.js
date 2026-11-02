// Moteur de diorama : lit un décor (JSON) et une mise en scène, et produit le SVG.
//
// Ordre de dessin : socle → sol → murs → éléments des murs → arête du coin
// → objets et personnages, triés du fond vers l'avant (algorithme du peintre).

import { balise, points, matrice, echapper, n } from '../svg.js';
import { creerProjection } from './projection.js';
import { dessinerElementMur } from './elements-mur.js';
import { dessinerObjet } from './objets.js';
import { placerPersonnage } from '../personnages/personnage.js';

const COS30 = Math.sqrt(3) / 2;
const MARGES_PAR_DEFAUT = { haut: 30, bas: 6, cotes: 4.5 };

/**
 * @param decor        le décor (déjà fusionné avec son modèle s'il s'agit d'une variante)
 * @param miseEnScene  { objets: [], personnages: [], description }
 * @returns { svg, viewBox, ancres }  — ancres : { [idPersonnage]: { bulle: {x, y} } }
 */
export function dessinerDiorama(decor, miseEnScene = {}, reglages = {}) {
  const { largeur: W, profondeur: D, hauteurMurs: H } = decor.piece;
  const S = decor.socle?.epaisseur ?? 0;

  // On place l'origine pour que le dessin commence en (0, 0).
  const proj = creerProjection({ x: COS30 * D, y: H });
  const P = (x, y, z) => proj.projeter(x, y, z);

  const largeurDessin = COS30 * (W + D);
  const hauteurDessin = H + 0.5 * (W + D) + S;
  const m = { ...MARGES_PAR_DEFAUT, ...decor.cadrage?.marges, ...reglages.marges };
  const viewBox = { x: -m.cotes, y: -m.haut, w: largeurDessin + 2 * m.cotes, h: hauteurDessin + m.haut + m.bas };

  let svg = '';

  // --- Socle (l'épaisseur sous le plancher) ---
  if (S > 0) {
    svg += balise('polygon', { points: points([P(0, D, 0), P(W, D, 0), P(W, D, -S), P(0, D, -S)]), fill: decor.socle.couleurGauche });
    svg += balise('polygon', { points: points([P(W, 0, 0), P(W, D, 0), P(W, D, -S), P(W, 0, -S)]), fill: decor.socle.couleurDroite });
  }

  // --- Sol ---
  const sol = decor.sol ?? {};
  let dessinSol = balise('rect', { x: 0, y: 0, width: W, height: D, fill: sol.couleur ?? '#EEE9E1' });
  if (sol.dalles) {
    const pas = sol.dalles.pas;
    let d = '';
    for (let a = pas; a < W - 0.01; a += pas) d += `M${n(a)} 0 V${n(D)} `;
    for (let b = pas; b < D - 0.01; b += pas) d += `M0 ${n(b)} H${n(W)} `;
    dessinSol += balise('path', { d: d.trim(), stroke: sol.dalles.couleur, strokeWidth: sol.dalles.epaisseur ?? 1.4 });
  }
  if (sol.bordureMurDroit) {
    dessinSol += balise('rect', { x: 0, y: 0, width: W, height: sol.bordureMurDroit.largeur, fill: sol.bordureMurDroit.couleur });
  }
  svg += balise('g', { transform: matrice(proj.matriceSol(0, 0, 0)) }, dessinSol);

  // --- Murs ---
  const mur = (def, longueur, m) => {
    if (!def) return '';
    let contenu = balise('rect', { x: 0, y: 0, width: longueur, height: H, fill: def.couleur });
    if (def.plinthe) {
      contenu += balise('rect', { x: 0, y: H - def.plinthe.hauteur, width: longueur, height: def.plinthe.hauteur, fill: def.plinthe.couleur });
    }
    for (const e of def.elements ?? []) contenu += dessinerElementMur(e);
    return balise('g', { transform: matrice(m) }, contenu);
  };
  svg += mur(decor.murs?.gauche, D, proj.matricePlanY(0, D, H));
  svg += mur(decor.murs?.droit, W, proj.matricePlanX(0, 0, H));

  if (decor.arete) {
    const haut = P(0, 0, H), bas = P(0, 0, 0);
    svg += balise('path', { d: `M${n(haut.x)} ${n(haut.y)} V${n(bas.y)}`, stroke: decor.arete.couleur, strokeWidth: decor.arete.epaisseur ?? 1 });
  }

  // --- Objets et personnages, du fond vers l'avant ---
  const elements = [];
  const ancres = {};
  const objets = [...(decor.objets ?? []), ...(miseEnScene.objets ?? [])];
  objets.forEach((o, i) => {
    const r = dessinerObjet(o, proj);
    if (r) elements.push({ ...r, ordre: i });
  });
  (miseEnScene.personnages ?? []).forEach((p, i) => {
    const r = placerPersonnage(p, proj);
    if (!r) return;
    elements.push({ ...r, ordre: 1000 + i });
    ancres[p.id] = r.ancres;
  });
  elements.sort((a, b) => a.profondeur - b.profondeur || a.ordre - b.ordre);
  svg += elements.map((e) => e.svg).join('');

  const description = miseEnScene.description ?? decor.description ?? '';
  const vb = [viewBox.x, viewBox.y, viewBox.w, viewBox.h].map(n).join(' ');
  const racine =
    `<svg class="diorama-svg" xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" ` +
    `preserveAspectRatio="xMidYMid meet" role="img" aria-label="${echapper(description)}">${svg}</svg>`;

  return { svg: racine, viewBox, ancres };
}
