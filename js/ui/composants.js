// Composants d'interface réutilisables (HTML sous forme de texte).

import { echapper } from '../svg.js';

export const ICONES = {
  retour: '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#24324A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>',
  loupe: '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F2B544" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>',
};

/** Barre de progression segmentée : etapes = nombre de segments, faites = segments remplis. */
export function barreProgression({ etapes, faites }) {
  const segments = Array.from({ length: etapes }, (_, i) =>
    `<div class="progression__segment${i < faites ? ' progression__segment--fait' : ''}"></div>`).join('');
  return `<div class="progression" role="progressbar" aria-valuemin="0" aria-valuemax="${etapes}" aria-valuenow="${faites}" aria-label="Avancement de la scène">${segments}</div>`;
}

/** Carte de dialogue : avatar, nom, rôle, réplique, didascalie. */
export function carteDialogue({ personnage, replique, didascalie }) {
  return `
    <section class="carte carte-dialogue" aria-label="Dialogue">
      <div class="carte-dialogue__qui">
        <div class="avatar" style="background:${echapper(personnage.couleur)}" aria-hidden="true">${echapper(personnage.initiale)}</div>
        <div>
          <div class="carte-dialogue__nom">${echapper(personnage.nom)}</div>
          <div class="carte-dialogue__role">${echapper(personnage.role)}</div>
        </div>
      </div>
      <p class="carte-dialogue__replique">${echapper(replique)}</p>
      ${didascalie ? `<p class="carte-dialogue__didascalie">${echapper(didascalie)}</p>` : ''}
    </section>`;
}

/**
 * Les choix d'une réplique : les choix ordinaires en boutons secondaires côte à côte,
 * le choix « denoncer » en bouton principal avec la loupe.
 */
export function boutonsChoix(choix) {
  const secondaires = choix.filter((c) => c.effet !== 'denoncer');
  const principal = choix.find((c) => c.effet === 'denoncer');
  const bouton = (c) =>
    `<button type="button" class="bouton bouton--secondaire" data-effet="${echapper(c.effet)}">${echapper(c.texte)}</button>`;
  return `
    <div class="scene__choix">
      <div class="scene__choix-secondaires">${secondaires.map(bouton).join('')}</div>
      ${principal ? `<button type="button" class="bouton bouton--principal" data-effet="denoncer">${ICONES.loupe}${echapper(principal.texte)}</button>` : ''}
    </div>`;
}
