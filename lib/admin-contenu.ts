// Espace de gestion de Vincent : ce qu'il peut modifier, rangé comme son site.
// Les champs viennent DIRECTEMENT des schémas du Studio (studio/schemas) : un champ ajouté dans un schéma
// apparaît tout seul ici. Seul ce fichier est à adapter d'un client à l'autre.
import { schemaTypes } from "@/studio/schemas";

export type Champ = {
  name: string;
  title?: string;
  description?: string;
  type: string;
  rows?: number;
  group?: string;
  readOnly?: boolean;
  hidden?: boolean;
  options?: { list?: (string | { title: string; value: string })[]; accept?: string };
  fields?: Champ[];
  of?: Champ[];
};
export type Schema = { name: string; title?: string; fields: Champ[]; groups?: { name: string; title: string }[] };

export type Section = {
  id: string; // _id du document (page unique) ou identifiant de la liste
  type: string; // type Sanity
  titre: string;
  aide: string;
  icon: string; // icône Phosphor (components/icons.tsx)
  liste?: { champTitre: string; champSousTitre?: string; creer?: boolean; supprimer?: boolean; ordre?: string };
  voir?: string; // page du site concernée
};

export const SECTIONS: { titre: string; items: Section[] }[] = [
  {
    titre: "Mon site",
    items: [
      { id: "pageAccueil", type: "pageAccueil", titre: "Page d'accueil", aide: "Titres, textes et photo de l'accueil", icon: "ph:house-bold", voir: "/" },
      { id: "prestations", type: "prestation", titre: "Vos services", aide: "Aéroport, Bergevin, excursions, photos", icon: "ph:car-profile-bold", liste: { champTitre: "titre", champSousTitre: "sousTitre", ordre: "ordre" }, voir: "/tarifs" },
      { id: "tarifs", type: "tarifs", titre: "Vos tarifs", aide: "Prise en charge, prix du km, forfait", icon: "ph:currency-eur-bold", voir: "/tarifs" },
      { id: "questions", type: "question", titre: "Questions fréquentes", aide: "Ajouter, modifier ou retirer une question", icon: "ph:question-bold", liste: { champTitre: "q", champSousTitre: "rubrique", ordre: "ordre", creer: true, supprimer: true }, voir: "/faq" },
      { id: "avis", type: "avis", titre: "Avis de voyageurs", aide: "Les avis qui défilent sur l'accueil", icon: "ph:chat-circle-text-bold", liste: { champTitre: "nom", champSousTitre: "texte", ordre: "ordre", creer: true, supprimer: true }, voir: "/" },
      { id: "reglages", type: "reglages", titre: "Vos coordonnées", aide: "Téléphone, e-mail, adresse, avis Google", icon: "ph:address-book-bold", voir: "/" },
    ],
  },
];

export const toutesSections = SECTIONS.flatMap((s) => s.items);
export const sectionDe = (id: string) => toutesSections.find((s) => s.id === id);
export const schemaDe = (type: string) => (schemaTypes as unknown as Schema[]).find((s) => s.name === type);
