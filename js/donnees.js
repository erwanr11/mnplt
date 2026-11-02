// Chargement des fichiers de contenu (JSON) et fusion des variantes de décor.

const cache = new Map();

export async function chargerJSON(chemin) {
  if (!cache.has(chemin)) {
    cache.set(chemin, fetch(chemin).then((r) => {
      if (!r.ok) throw new Error(`Impossible de lire ${chemin} (${r.status})`);
      return r.json();
    }));
  }
  return cache.get(chemin);
}

/**
 * Charge un décor. Si le décor contient "herite": "autre-decor", on part de ce décor-là
 * et on applique seulement les différences décrites (voir fusionner()).
 */
export async function chargerDecor(id) {
  const decor = await chargerJSON(`contenu/decors/${id}.json`);
  if (!decor.herite) return decor;
  const base = await chargerDecor(decor.herite);
  const { herite, ...differences } = decor;
  return fusionner(base, differences);
}

const estObjet = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const listeAvecIds = (v) => Array.isArray(v) && v.every((e) => estObjet(e) && 'id' in e);

/**
 * Fusion des différences dans le modèle :
 * - un objet est fusionné champ par champ ;
 * - une valeur null efface le réglage (par exemple "texte": null) ;
 * - une liste d'éléments qui ont tous un "id" est fusionnée élément par élément :
 *   même id → on modifie, "retirer": true → on enlève, nouvel id → on ajoute ;
 * - toute autre liste remplace celle du modèle.
 */
export function fusionner(base, diff) {
  if (listeAvecIds(base) && listeAvecIds(diff)) {
    const resultat = base.map((e) => ({ ...e }));
    for (const d of diff) {
      const i = resultat.findIndex((e) => e.id === d.id);
      if (d.retirer) { if (i >= 0) resultat.splice(i, 1); continue; }
      if (i >= 0) resultat[i] = fusionner(resultat[i], d);
      else resultat.push(d);
    }
    return resultat;
  }
  if (estObjet(base) && estObjet(diff)) {
    const resultat = { ...base };
    for (const [cle, valeur] of Object.entries(diff)) {
      resultat[cle] = cle in base ? fusionner(base[cle], valeur) : valeur;
    }
    return resultat;
  }
  return diff;
}
