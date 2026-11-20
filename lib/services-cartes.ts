// Cartes de la page Tarifs & services (photo, légende, description, points forts), modifiables depuis /admin.
import { whatsappLink } from "./site";
import { TARIFS } from "./tarifs";
import { euro } from "./utils";

export type ServiceCard = {
  image: string;
  imagePosition: string;
  title: string;
  caption: string;
  href: string;
  action: string;
  description: string;
  highlights: string[];
  layout?: string;
};

export const cards: Record<string, ServiceCard> = {
  aeroport: {
    image: "/img/services/aeroport.webp",
    imagePosition: "62% 45%",
    title: "Navette aéroport",
    caption: "Du terminal à votre hôtel.",
    href: "/estimateur?from=aeroport",
    action: "Estimer mon transfert",
    description: "Rejoignez votre hôtel, votre gîte ou le port depuis l’aéroport Pôle Caraïbes. Vincent assure aussi le trajet vers l’aéroport : convenez ensemble de votre horaire et du point de rendez-vous.",
    highlights: ["Transferts vers et depuis l’aéroport", "Numéro de vol à préciser"],
    layout: "lg:col-span-2 lg:row-span-2",
  },
  bergevin: {
    image: "/img/services/bergevin.webp",
    imagePosition: "55% 45%",
    title: "Bergevin",
    caption: "Votre liaison vers les îles.",
    href: "/estimateur?to=bergevin",
    action: "Estimer ma correspondance",
    description: "Rejoignez la gare maritime de Bergevin depuis l’aéroport ou votre hébergement. Vincent organise votre prise en charge en fonction de l’heure de départ de votre ferry.",
    highlights: [`Forfait aéroport ↔ Bergevin : ${euro(TARIFS.forfaitAeroportBergevin)}`, "Horaire du bateau à communiquer"],
  },
  croisiere: {
    image: "/img/services/croisiere.webp",
    imagePosition: "58% 40%",
    title: "Croisières",
    caption: "Profitez de votre escale.",
    href: whatsappLink("Bonjour Vincent, je souhaite organiser une escale de croisière. Ma date et mes horaires :"),
    action: "Organiser mon escale sur WhatsApp",
    description: "Découvrez la Guadeloupe pendant votre escale à Pointe-à-Pitre. Préparez votre programme avec Vincent selon vos envies et le temps disponible avant le retour à bord.",
    highlights: ["Programme à convenir ensemble", "Retour adapté aux horaires du navire"],
  },
  excursion: {
    image: "/img/services/excursion.webp",
    imagePosition: "52% 22%",
    title: "Excursions",
    caption: "La Guadeloupe à votre rythme.",
    href: whatsappLink("Bonjour Vincent, j’aimerais préparer une excursion en Guadeloupe. Ma date et mes envies :"),
    action: "Préparer mon excursion sur WhatsApp",
    description: "Deshaies, les chutes du Carbet, la Pointe des Châteaux… Composez votre journée avec un chauffeur qui connaît l’île. Partagez vos envies, Vincent vous aide à préparer l’itinéraire.",
    highlights: ["Basse-Terre et Grande-Terre", "Itinéraire et estimation à convenir"],
    layout: "lg:col-span-2",
  },
  nuit: {
    image: "/img/services/nuit-duster.webp",
    imagePosition: "58% 45%",
    title: "Courses de nuit",
    caption: "On roule, même tard.",
    href: "/estimateur",
    action: "Estimer ma course de nuit",
    description: "Un retour de soirée ou un départ avant le lever du soleil : prévoyez votre course avec Vincent. Renseignez votre date et votre heure pour obtenir une estimation adaptée.",
    highlights: ["Service 24h/24, 7j/7", "Nuit, dimanches et jours fériés"],
  },
  evenement: {
    image: "/img/services/evenement.webp",
    imagePosition: "55% 40%",
    title: "Mariages & affaires",
    caption: "Vos rendez-vous, à l’heure.",
    href: whatsappLink("Bonjour Vincent, je souhaite organiser un trajet pour un événement ou un rendez-vous. Ma date et mes horaires :"),
    action: "Organiser mon trajet sur WhatsApp",
    description: "Un mariage, un rendez-vous professionnel ou des invités à accueillir : organisez vos déplacements avec Vincent. Précisez les adresses, les horaires et le nombre de voyageurs.",
    highlights: ["Déplacements privés et professionnels", "Organisation à convenir avec Vincent"],
  },
  plage: {
    image: "/img/services/plage.webp",
    imagePosition: "68% 45%",
    title: "Plages & hôtels",
    caption: "Direction les vacances.",
    href: "/estimateur",
    action: "Estimer mon trajet",
    description: "Direction la plage, votre hôtel ou votre villa. Choisissez votre lieu de départ et votre destination ; vous pouvez aussi convenir d’une heure de retour avec Vincent.",
    highlights: ["Prise en charge à votre hébergement", "Retour à prévoir lors de la réservation"],
    layout: "lg:col-span-2",
  },
  vsl: {
    image: "/img/services/vsl-duster.webp",
    imagePosition: "72% 38%",
    title: "Transport VSL",
    caption: "Parlons de votre trajet.",
    href: whatsappLink("Bonjour Vincent, je souhaite me renseigner sur un transport VSL. Quelles sont les modalités ?"),
    action: "Contacter Vincent sur WhatsApp",
    description: "Vous souhaitez organiser un transport VSL ? Contactez Vincent pour préciser votre trajet et vérifier avec lui les modalités adaptées à votre demande.",
    highlights: ["Organisation directement avec Vincent", "Date, trajet et besoins à préciser"],
    layout: "lg:col-span-4",
  },
};
