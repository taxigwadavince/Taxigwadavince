// Sources vérifiées le 06/11/2026 : taxigwadavince.com, /services/, /about/ et formulaire de réservation.
// Textes reformulés ; les avis sont présentés comme des résumés, sans dates relatives figées.
import { TARIFS } from "./tarifs";
export type Service = {
  id: string;
  title: string;
  tag: string;
  text: string;
  img: string;
  icon: "plane" | "ferry" | "ship" | "palm" | "moon" | "ring" | "road" | "beach";
  to?: string;
};

export const services: Service[] = [
  { id: "aeroport", title: "Navette aéroport", tag: "Maryse Condé (Pôle Caraïbes)", text: "Transferts vers ou depuis l'aéroport, votre hôtel, votre gîte ou le port.", img: "/img/aeroport.webp", icon: "plane", to: "aeroport" },
  { id: "bergevin", title: "Gare maritime de Bergevin", tag: "Marie-Galante, Les Saintes", text: "Correspondance avec les ferries pour Marie-Galante et Les Saintes, depuis l'aéroport ou votre hôtel.", img: "/img/bergevin.webp", icon: "ferry", to: "bergevin" },
  { id: "croisiere", title: "Escale de croisière", tag: "Port de Pointe-à-Pitre", text: "Vincent vous attend au pied du navire pour une journée d'escale sur mesure.", img: "/img/croisiere.webp", icon: "ship", to: "croisiere" },
  { id: "excursion", title: "Excursions à la journée", tag: "Basse-Terre, Grande-Terre", text: "Chutes du Carbet, Deshaies, Pointe des Châteaux : un chauffeur qui connaît chaque recoin.", img: "/img/foret.webp", icon: "palm", to: "chutes-carbet" },
  { id: "nuit", title: "Courses de nuit", tag: "19h-7h, dimanches et fériés", text: "Retour de soirée ou départ très tôt : la voiture est là, à l'heure dite.", img: "/img/services/nuit-duster.webp", icon: "moon" },
  { id: "evenement", title: "Mariages et affaires", tag: "Hôtels, villas, entreprises", text: "Des déplacements privés ou professionnels pour vos invités, vos rendez-vous et vos clients.", img: "/img/villa.webp", icon: "ring" },
  { id: "plage", title: "Plages et hôtels", tag: "Toute l'île", text: "Grande Anse, la Caravelle, Sainte-Anne : déposé et récupéré à l'heure convenue.", img: "/img/plage.webp", icon: "beach", to: "grande-anse" },
  { id: "vsl", title: "Transport VSL", tag: "Modalités à convenir avec Vincent", text: "Contactez Vincent pour organiser votre transport VSL et préciser les besoins de votre trajet.", img: "/img/vrai3.jpeg", icon: "road" },
];

export type Review = { name: string; text: string };

// Résumés d'avis Google affichés sur le site de référence ; les auteurs sont conservés.
export const reviews: Review[] = [
  { name: "Martin Niemer", text: "Martin souligne la ponctualité de Vincent pour un départ matinal et sa gentillesse." },
  { name: "Brigitte De jonge", text: "Brigitte apprécie son accueil attentionné et sa disponibilité pour une course tôt le matin." },
  { name: "Alain Fontaine", text: "Alain recommande Vincent pour sa fiabilité, son accueil et la propreté de sa voiture." },
  { name: "Quoc Chinh Tran", text: "Quoc Chinh a fait confiance à Vincent pendant tout son séjour et apprécie ses prix." },
  { name: "Marc Lavallee", text: "Marc retient une réservation facile, de bons échanges et un chauffeur agréable." },
  { name: "robiwan kenobi", text: "Cet avis souligne une réservation claire, le suivi WhatsApp et la conduite prudente." },
  { name: "Léa", text: "Léa remercie Vincent pour sa ponctualité et sa capacité à gérer les imprévus." },
  { name: "Marwan CASULA", text: "Marwan apprécie l’efficacité de Vincent lors de son transfert vers l’aéroport." },
  { name: "Mat Delfo", text: "Mat apprécie le véhicule propre, la conduite douce et les échanges avec Vincent." },
  { name: "Reiniche Céline", text: "Céline remercie Vincent pour son accueil, sa ponctualité et ses conseils." },
];

export const steps = [
  { id: "estimer", title: "Vous estimez", text: "Départ, arrivée, date et heure : une estimation à confirmer avec Vincent.", icon: "estimate" as const },
  { id: "reserver", title: "Vous réservez", text: "En ligne, par WhatsApp ou par téléphone. Convenez de votre prise en charge avec Vincent.", icon: "calendar" as const },
  { id: "rouler", title: "On roule", text: "Accueil à l'heure, aide aux bagages, paiement à bord par carte ou en espèces, reçu remis.", icon: "car" as const },
];

export type Faq = { q: string; a: string; theme: "Réservation" | "Tarifs" | "Trajets" };

export const faq: Faq[] = [
  { theme: "Réservation", q: "Comment réserver un taxi en Guadeloupe à l'avance ?", a: "Remplissez le formulaire de réservation en ligne, envoyez un message WhatsApp ou appelez le 0690 64 75 63. Vincent confirme votre course avec l'heure de prise en charge." },
  { theme: "Réservation", q: "Le taxi est-il disponible la nuit et le dimanche ?", a: "Oui, Taxi Gwada Vince roule 24h/24 et 7j/7, y compris pour les premiers vols du matin et les retours de soirée." },
  { theme: "Tarifs", q: "Combien coûte un taxi entre l'aéroport et la gare maritime de Bergevin ?", a: `Le transfert entre l'aéroport Pôle Caraïbes et la gare maritime de Bergevin est proposé au forfait de ${TARIFS.forfaitAeroportBergevin} €. Le temps supplémentaire demandé s'ajoute séparément. Confirmez les modalités de votre trajet avec Vincent lors de la réservation.` },
  { theme: "Tarifs", q: "Quelle est la différence entre le tarif de jour et le tarif de nuit ?", a: "Le tarif de jour s'applique de 7 h à 19 h, hors dimanches et jours fériés. Le tarif de nuit s'applique de 19 h à 7 h ; les dimanches et jours fériés sont aussi pris en compte dans l'estimation. Les heures indiquées sont celles de Guadeloupe. Vincent confirme le montant final." },
  { theme: "Tarifs", q: "Peut-on payer le taxi par carte bancaire ?", a: "Oui. Le paiement se fait à bord, par carte bancaire ou en espèces, et un reçu vous est remis." },
  { theme: "Trajets", q: "Vincent peut-il venir me chercher à mon hôtel ou à mon gîte ?", a: "Oui, partout en Guadeloupe continentale : hôtels du Gosier, villas de Sainte-Anne, gîtes de Basse-Terre, ports et aéroport." },
  { theme: "Trajets", q: "Proposez-vous des excursions à la journée ?", a: "Oui. Vincent propose des excursions personnalisées et la mise à disposition du véhicule à la journée. Contactez-le pour convenir du programme, des horaires et du prix de votre journée." },
  { theme: "Trajets", q: "Proposez-vous un transport VSL ?", a: "Le transport VSL fait partie des services proposés. Contactez Vincent pour préciser votre trajet et vérifier les modalités adaptées à votre demande." },
  { theme: "Réservation", q: "Combien de passagers peuvent monter dans le taxi ?", a: "Le formulaire permet de réserver pour 1 à 4 passagers, enfants compris. Précisez le nombre de valises et les bagages volumineux pour confirmer la capacité nécessaire avec Vincent." },
];
