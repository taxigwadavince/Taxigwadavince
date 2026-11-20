import { faq } from "./content";

export type FaqAnswer = {
  q: string;
  a: string;
  href?: string;
  linkLabel?: string;
  keywords?: string;
};

export type FaqSection = {
  id: string;
  label: string;
  title: string;
  icon: string;
  items: FaqAnswer[];
};

// Les réponses déjà présentes sur l'accueil restent la source commune.
export const faqSections: FaqSection[] = [
  {
    id: "reservation",
    label: "Réservation",
    title: "Avant de boucler les valises",
    icon: "ph:calendar-blank-bold",
    items: [
      ...faq.filter((item) => item.theme === "Réservation"),
      {
        q: "Ma course est-elle confirmée dès l’envoi du formulaire ?",
        a: "L’envoi du formulaire est une demande de réservation. Votre course est confirmée lorsque Vincent vous répond par WhatsApp, téléphone ou e-mail avec l’heure de prise en charge. Si vous n’avez pas reçu de confirmation et que le départ approche, appelez-le directement.",
        href: "/reserver",
        linkLabel: "Faire ma demande de réservation",
        keywords: "confirmation réponse delai délai contact",
      },
      {
        q: "Comment modifier ou annuler ma réservation ?",
        a: "Prévenez Vincent le plus tôt possible par téléphone ou WhatsApp. Indiquez votre nom, la date et le trajet concernés, ainsi que le changement souhaité. Il pourra vous confirmer la nouvelle organisation et les éventuelles conditions applicables.",
        keywords: "annulation changement horaire report",
      },
      {
        q: "Je voyage avec un enfant : que faut-il préciser ?",
        a: "Indiquez le nombre d’adultes et d’enfants dans le formulaire. Si un siège enfant est nécessaire, cochez l’option et précisez l’âge de l’enfant dans les informations complémentaires. Vincent vous confirmera les possibilités avant le départ.",
        href: "/reserver",
        linkLabel: "Préciser les besoins de ma famille",
        keywords: "bébé bebe siège auto famille rehausseur",
      },
      {
        q: "Et si j’ai beaucoup de bagages ?",
        a: "Précisez le nombre de valises lors de la réservation et signalez les objets volumineux dans les informations complémentaires. Vincent pourra vérifier que le véhicule convient au nombre de voyageurs et aux bagages prévus.",
        keywords: "valise poussette coffre encombrant capacité",
      },
    ],
  },
  {
    id: "tarifs",
    label: "Prix & paiement",
    title: "Le prix, sans point d’interrogation",
    icon: "ph:receipt-bold",
    items: [
      ...faq.filter((item) => item.theme === "Tarifs").map((item) => ({
        ...item,
        ...(item.q.includes("Combien")
          ? { href: "/estimateur", linkLabel: "Estimer mon trajet" }
          : {}),
      })),
      {
        q: "Faut-il payer en ligne pour réserver ?",
        a: "Non, aucun paiement n’est demandé sur le site. Vous envoyez votre demande, Vincent confirme la course, puis vous réglez à bord par carte bancaire ou en espèces. Un reçu vous est remis à la fin du trajet.",
        keywords: "acompte avance liquide cb facture règlement",
      },
    ],
  },
  {
    id: "trajets",
    label: "Aéroport & trajets",
    title: "Du premier vol au dernier kilomètre",
    icon: "ph:map-pin-bold",
    items: [
      {
        q: "Où retrouver Vincent à l’aéroport ?",
        a: "Vincent assure les transferts depuis l’aéroport Maryse Condé, aussi appelé Pôle Caraïbes. Indiquez votre numéro de vol et convenez directement avec lui du point de rendez-vous avant votre arrivée.",
        href: "/reserver?from=aeroport",
        linkLabel: "Préparer mon transfert aéroport",
        keywords: "avion atterrissage terminal arrivée navette pointe à pitre",
      },
      {
        q: "Mon vol ou mon bateau a du retard, que faire ?",
        a: "Prévenez Vincent dès que vous connaissez un changement d’horaire. Communiquez le numéro du vol ou du bateau et convenez avec lui de la nouvelle prise en charge et de l’attente éventuelle.",
        keywords: "retard avion ferry attente correspondance",
      },
      {
        q: "Pouvez-vous m’accompagner jusqu’au ferry de Bergevin ?",
        a: "Oui, Vincent assure les transferts vers la gare maritime de Bergevin, notamment depuis l’aéroport ou votre hébergement. Précisez l’heure de départ du bateau et la destination, Marie-Galante ou Les Saintes, pour organiser votre prise en charge avec une marge adaptée.",
        href: "/reserver?to=bergevin",
        linkLabel: "Préparer ma correspondance",
        keywords: "port bateau ferry navette saintes marie galante",
      },
      ...faq.filter((item) => item.theme === "Trajets"),
      {
        q: "Peut-on prévoir le retour en même temps que l’aller ?",
        a: "Oui, indiquez le trajet et l’horaire de retour souhaités dans les informations complémentaires de votre demande, ou échangez directement avec Vincent. Le formulaire correspond à un aller simple : le retour doit lui aussi être confirmé avec votre chauffeur.",
        keywords: "aller retour plage escale croisière",
      },
    ],
  },
];


