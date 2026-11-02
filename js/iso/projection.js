// Module de projection isométrique : (x, y, z) → position à l'écran.
//
// Repère de la pièce (le même pour tous les dioramas) :
//   x : le long du mur droit, du coin du fond vers l'avant-droite ;
//   y : le long du mur gauche, du coin du fond vers l'avant-gauche ;
//   z : la hauteur, vers le haut.
// Le coin du fond, au sol, est le point (0, 0, 0).
//
// Projection isométrique « vraie » (angles de 30°), comme dans les maquettes :
//   écranX = origine.x + cos30 · (x − y)
//   écranY = origine.y + sin30 · (x + y) − z
// Une unité vaut un pixel de la maquette de la scène (390 px de large).

const COS30 = Math.sqrt(3) / 2;
const SIN30 = 0.5;

export function creerProjection(origine = { x: 0, y: 0 }) {
  const projeter = (x, y, z = 0) => ({
    x: origine.x + COS30 * (x - y),
    y: origine.y + SIN30 * (x + y) - z,
  });

  /** Matrice qui pose un dessin plat (a, b) sur un plan horizontal à la hauteur z. */
  const matriceSol = (x0 = 0, y0 = 0, z = 0) => {
    const o = projeter(x0, y0, z);
    return { a: COS30, b: SIN30, c: -COS30, d: SIN30, e: o.x, f: o.y };
  };

  /**
   * Matrice qui plaque un dessin plat (u, v) sur un plan vertical parallèle au mur droit.
   * u avance vers la droite de l'écran, v descend depuis le point d'origine.
   */
  const matricePlanX = (x0, y0, zHaut) => {
    const o = projeter(x0, y0, zHaut);
    return { a: COS30, b: SIN30, c: 0, d: 1, e: o.x, f: o.y };
  };

  /** Même chose pour un plan vertical parallèle au mur gauche (u vers la droite de l'écran = y décroissant). */
  const matricePlanY = (x0, y0, zHaut) => {
    const o = projeter(x0, y0, zHaut);
    return { a: COS30, b: -SIN30, c: 0, d: 1, e: o.x, f: o.y };
  };

  return { projeter, matriceSol, matricePlanX, matricePlanY };
}
