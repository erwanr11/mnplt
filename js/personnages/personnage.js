// Placement des personnages dans un diorama, quel que soit le décor.
// Pour ajouter un personnage : créer son fichier (sur le modèle de irene.js)
// et l'inscrire dans la liste ci-dessous.

import { balise } from '../svg.js';
import madameO from './madame-o.js';
import irene from './irene.js';

const PERSONNAGES = { [madameO.id]: madameO, [irene.id]: irene };

/**
 * Place un personnage décrit dans la mise en scène :
 *   { id, x, y, sens: "gauche" | "droite", echelle, pose, options }
 * Renvoie { profondeur, svg, ancres } ; les ancres sont en coordonnées du diorama.
 */
export function placerPersonnage(p, proj) {
  const modele = PERSONNAGES[p.id];
  if (!modele) {
    console.warn(`Ficelles : personnage inconnu « ${p.id} »`);
    return null;
  }
  const pied = proj.projeter(p.x, p.y, 0);
  const echelle = p.echelle ?? 1;
  const miroir = p.sens && p.sens !== modele.sensNatif ? -1 : 1;
  const sx = echelle * miroir;

  const svg = balise('g', {
    transform: `translate(${pied.x} ${pied.y}) scale(${sx} ${echelle})`,
    'data-personnage': p.id,
  }, modele.dessiner({ ...(p.options ?? {}), pose: p.pose }));

  const ancre = (a) => ({ x: pied.x + a.x * sx, y: pied.y + a.y * echelle });
  return {
    profondeur: p.x + p.y,
    svg,
    ancres: { bulle: ancre(modele.ancres.bulle) },
  };
}
