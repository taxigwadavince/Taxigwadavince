// Lecture du contenu éditable (Sanity) côté serveur, une requête pour tout le site, mise en cache et vidée
// à chaque enregistrement dans /admin (revalidateTag("cms")). À appeler en tête des layouts et pages serveur.
import { cache } from "react";
import { sanityQuery } from "./sanity";
import { appliquerCms, type CmsData } from "./cms-appliquer";

const REQUETE = `{
  "reglages": *[_id == "reglages"][0],
  "tarifs": *[_id == "tarifs"][0],
  "accueil": *[_id == "pageAccueil"][0]{ ..., "chauffeurPhoto": chauffeurPhoto.asset->url },
  "prestations": *[_type == "prestation" && !(_id in path("drafts.**"))] | order(ordre asc){ cle, titre, sousTitre, texte, "photo": photo.asset->url, legende, description, pointsForts },
  "avis": *[_type == "avis" && !(_id in path("drafts.**"))] | order(ordre asc){ nom, texte },
  "questions": *[_type == "question" && !(_id in path("drafts.**"))] | order(ordre asc){ rubrique, q, a, surAccueil, lienTexte, lienAdresse, motsCles }
}`;

export const lireCms = cache(async (): Promise<CmsData | null> => sanityQuery<CmsData>(REQUETE, {}, { revalidate: 3600, tags: ["cms"] }));

// Charge puis applique le contenu aux objets du site (côté serveur). Renvoie les données pour le navigateur.
export async function cmsServeur() {
  const data = await lireCms();
  appliquerCms(data);
  return data;
}
