// Coordonnées vérifiées sur taxigwadavince.com/contact/ et informations sur l'accueil le 06/11/2026.
export const site = {
  name: "Taxi Gwada Vince",
  shortName: "Gwada Vince",
  driver: "Vincent",
  url: "https://taxi-gwada-vince-eight.vercel.app",
  phoneDisplay: "0690 64 75 63",
  phoneIntl: "+590690647563",
  phoneHref: "tel:+590690647563",
  whatsapp: "https://wa.me/590690647563",
  email: "taxigwadavince@gmail.com",
  address: "15 rue de la Cité Élise",
  city: "97190 Le Gosier",
  region: "Guadeloupe",
  geo: { lat: 16.2072, lon: -61.4931 },
  rating: 5,
  reviewsCount: 80,
  googleReviewsUrl: "https://www.google.com/maps/search/?api=1&query=Taxi+Gwada+Vince+Le+Gosier",
  hours: "24h/24, 7j/7",
  payment: "Carte bancaire ou espèces, à bord",
  credit: { label: "actcstudio.fr", href: "https://www.actcstudio.fr" },
};

export function whatsappLink(text: string) {
  return `${site.whatsapp}?text=${encodeURIComponent(text)}`;
}

// Ouvre directement la fenêtre de rédaction Gmail, adressée à Vincent, avec l'objet déjà rempli.
export function gmailLink(subject = "Demande de course") {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(site.email)}&su=${encodeURIComponent(subject)}`;
}

export const nav = [
  { label: "Accueil", href: "/" },
  { label: "Tarifs & services", href: "/tarifs" },
  { label: "Estimer ma course", href: "/estimateur" },
  { label: "Votre chauffeur", href: "/equipe" },
  { label: "FAQ", href: "/faq" },
];

export const bookingHref = "/reserver";
