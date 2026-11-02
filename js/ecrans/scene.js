// Écran de scène : progression, diorama, carte de dialogue et choix.
// Lot 1 : affichage seul, les choix ne déclenchent encore rien.

import { chargerJSON, chargerDecor } from '../donnees.js';
import { dessinerDiorama } from '../iso/diorama.js';
import { barreProgression, carteDialogue, boutonsChoix, ICONES } from '../ui/composants.js';
import { echapper } from '../svg.js';

export async function afficherScene(conteneur, { allerA, idScene = 'demo-petition' }) {
  const [scene, personnages] = await Promise.all([
    chargerJSON(`contenu/scenes/${idScene}.json`),
    chargerJSON('contenu/personnages.json'),
  ]);
  const decor = await chargerDecor(scene.decor);
  const diorama = dessinerDiorama(decor, scene.mise_en_scene);
  const replique = scene.repliques[0];
  const qui = personnages[replique.personnage];

  document.body.className = 'fond-jeu';
  conteneur.innerHTML = `
    <div class="ecran scene">
      <header class="scene__entete">
        <button type="button" class="bouton-rond" data-action="retour" aria-label="Retour au programme">${ICONES.retour}</button>
        <div class="scene__titres">
          <h1 class="scene__titre">${echapper(scene.titre)}</h1>
          ${barreProgression(scene.progression)}
        </div>
      </header>
      <div class="scene__diorama">${diorama.svg}</div>
      <div class="scene__carte">${carteDialogue({ personnage: qui, replique: replique.replique, didascalie: replique.didascalie })}</div>
      ${boutonsChoix(replique.choix)}
    </div>`;

  conteneur.querySelector('[data-action="retour"]').addEventListener('click', () => allerA('accueil'));
}
