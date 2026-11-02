// Point d'entrée : navigation entre les écrans par l'adresse (#accueil, #scene).

import { afficherAccueil } from './ecrans/accueil.js';
import { afficherScene } from './ecrans/scene.js';

const ECRANS = {
  accueil: afficherAccueil,
  scene: afficherScene,
};

const app = document.getElementById('app');

function allerA(nom) {
  if (location.hash === `#${nom}`) afficher();
  else location.hash = nom;
}

async function afficher() {
  const nom = location.hash.slice(1) || 'accueil';
  const ecran = ECRANS[nom] ?? ECRANS.accueil;
  try {
    await ecran(app, { allerA });
    window.scrollTo(0, 0);
  } catch (erreur) {
    console.error(erreur);
    app.innerHTML = `<p class="erreur-chargement">Le rideau est coincé : ${erreur.message}</p>`;
  }
}

window.addEventListener('hashchange', afficher);
afficher();
