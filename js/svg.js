// Petits outils pour fabriquer du SVG sous forme de texte.

/** Arrondit à deux décimales pour garder un SVG lisible. */
export const n = (v) => Math.round(v * 100) / 100;

/** Échappe un texte pour l'insérer dans du SVG ou du HTML. */
export function echapper(texte) {
  return String(texte)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Construit une balise SVG : balise('rect', { x: 1, fill: '#fff' }).
 * Les attributs null, undefined ou false sont ignorés.
 * Les noms en camelCase deviennent des noms à tirets (strokeWidth → stroke-width).
 */
export function balise(nom, attributs = {}, contenu = '') {
  const attrs = Object.entries(attributs)
    .filter(([, v]) => v !== null && v !== undefined && v !== false)
    .map(([k, v]) => {
      const cle = k.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
      const val = typeof v === 'number' ? n(v) : echapper(v);
      return `${cle}="${val}"`;
    })
    .join(' ');
  const ouverture = attrs ? `<${nom} ${attrs}` : `<${nom}`;
  return contenu === '' ? `${ouverture}/>` : `${ouverture}>${contenu}</${nom}>`;
}

/** Liste de points [{x, y}] → attribut « points » d'un polygone. */
export const points = (liste) => liste.map((p) => `${n(p.x)},${n(p.y)}`).join(' ');

/** Matrice {a,b,c,d,e,f} → attribut « transform ». */
export const matrice = (m) => `matrix(${[m.a, m.b, m.c, m.d, m.e, m.f].map(n).join(' ')})`;
