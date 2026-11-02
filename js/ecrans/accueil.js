// Écran d'accueil (premier lancement) : la salle du théâtre.

import { chargerJSON, chargerDecor } from '../donnees.js';
import { dessinerDiorama } from '../iso/diorama.js';
import { echapper } from '../svg.js';

const RIDEAU = (cote) => `
  <svg class="rideau rideau--${cote}" aria-hidden="true" viewBox="0 0 26 844" preserveAspectRatio="none"
       ${cote === 'droit' ? 'style="transform:scaleX(-1)"' : ''}>
    <path d="M0 0 H26 C20 200 30 420 18 844 H0 Z" fill="#3A1E28"/>
    <path d="M10 0 C6 220 16 440 6 844" stroke="#2A141C" stroke-width="3" fill="none" vector-effect="non-scaling-stroke"/>
  </svg>`;

const PROJECTEUR = `
  <svg class="projecteur" aria-hidden="true" viewBox="0 0 390 446" preserveAspectRatio="none">
    <polygon points="168,0 222,0 372,446 18,446" fill="#FFF3D6" opacity="0.06"/>
    <polygon points="182,0 208,0 318,440 72,440" fill="#FFF3D6" opacity="0.05"/>
  </svg>`;

const HALO = `
  <svg class="halo" aria-hidden="true" viewBox="0 0 352 72" preserveAspectRatio="none">
    <ellipse cx="176" cy="36" rx="176" ry="36" fill="#FFF3D6" opacity="0.10"/>
    <ellipse cx="176" cy="36" rx="120" ry="22" fill="#FFF3D6" opacity="0.08"/>
  </svg>`;

export async function afficherAccueil(conteneur, { allerA }) {
  const contenu = await chargerJSON('contenu/accueil.json');
  const d = contenu.diorama;
  const decor = await chargerDecor(d.decor);
  const diorama = dessinerDiorama(decor, d);

  document.body.className = 'fond-salle';
  conteneur.innerHTML = `
    <div class="ecran accueil">
      ${RIDEAU('gauche')}${RIDEAU('droit')}
      <div class="accueil__haut">
        ${PROJECTEUR}
        <header class="logo">
          <h1 class="logo__titre">${echapper(contenu.logo)}<span class="logo__point">.</span></h1>
          <p class="logo__signature">${echapper(contenu.signature)}</p>
        </header>
        <div class="accueil__diorama">
          ${HALO}
          ${diorama.svg}
          ${d.bulle ? `<p class="bulle">${echapper(d.bulle.texte)}</p>
          <svg class="bulle__pointe" aria-hidden="true"><polygon fill="#FFFFFF"/></svg>` : ''}
        </div>
      </div>
      <div class="accueil__bas">
        <p class="accueil__baseline">${echapper(contenu.baseline.avant)}<span class="accueil__accent">${echapper(contenu.baseline.accent)}</span>${echapper(contenu.baseline.apres)}</p>
        <p class="accueil__explication">${echapper(contenu.explication)}</p>
        <button type="button" class="bouton bouton--accueil" data-action="lever-rideau">${echapper(contenu.bouton)}</button>
        <button type="button" class="lien-discret" data-action="carnet">${echapper(contenu.lien)}</button>
      </div>
    </div>`;

  conteneur.querySelector('[data-action="lever-rideau"]').addEventListener('click', () => allerA('scene'));
  // « J'ai déjà un carnet » : rien pour l'instant (lot ultérieur).

  if (d.bulle) placerPointeBulle(conteneur, diorama, d.bulle.personnage);
}

/**
 * Dessine la pointe de la bulle, du bas de la bulle jusqu'au-dessus de la tête du personnage.
 * Recalculée quand la taille de l'écran change.
 */
function placerPointeBulle(conteneur, diorama, idPersonnage) {
  const cadre = conteneur.querySelector('.accueil__diorama');
  const svg = cadre.querySelector('.diorama-svg');
  const bulle = cadre.querySelector('.bulle');
  const polygone = cadre.querySelector('.bulle__pointe polygon');
  const cible = diorama.ancres[idPersonnage]?.bulle;
  if (!cible) return;

  const mettreAJour = () => {
    const vb = diorama.viewBox;
    const echelle = svg.clientWidth / vb.w;
    const pointe = { x: (cible.x - vb.x) * echelle, y: (cible.y - vb.y) * echelle };
    const gauche = bulle.offsetLeft, haut = bulle.offsetTop;
    const l = bulle.offsetWidth, h = bulle.offsetHeight;
    const yBase = haut + h - 24;
    polygone.setAttribute('points',
      `${gauche + 0.79 * l},${yBase} ${gauche + 0.91 * l},${yBase} ${pointe.x},${pointe.y}`);
  };
  mettreAJour();
  new ResizeObserver(mettreAJour).observe(cadre);
  document.fonts?.ready.then(mettreAJour);
}
