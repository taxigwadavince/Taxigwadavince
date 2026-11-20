// Lieux desservis : coordonnées géocodées via OpenStreetMap Nominatim (octobre 2026).
export type PlaceKind = "hub" | "port" | "ville" | "site";
export type Place = { id: string; name: string; area: string; kind: PlaceKind; lat: number; lon: number };

export const PLACES: Place[] = [
  {id: "aeroport", name: "Aéroport Maryse Condé", area: "Pôle Caraïbes, Les Abymes", kind: "hub", lat: 16.26558, lon: -61.5275},
  {id: "bergevin", name: "Gare maritime de Bergevin", area: "Pointe-à-Pitre", kind: "port", lat: 16.24102, lon: -61.54139},
  {id: "croisiere", name: "Terminal croisière", area: "Pointe-à-Pitre", kind: "port", lat: 16.23606, lon: -61.53805},
  {id: "pointe-a-pitre", name: "Pointe-à-Pitre", area: "Grande-Terre", kind: "ville", lat: 16.24086, lon: -61.53341},
  {id: "abymes", name: "Les Abymes", area: "Grande-Terre", kind: "ville", lat: 16.27064, lon: -61.50577},
  {id: "gosier", name: "Le Gosier", area: "Grande-Terre", kind: "ville", lat: 16.20721, lon: -61.49313},
  {id: "sainte-anne", name: "Sainte-Anne", area: "Grande-Terre", kind: "ville", lat: 16.22568, lon: -61.38591},
  {id: "saint-francois", name: "Saint-François", area: "Grande-Terre", kind: "ville", lat: 16.2532, lon: -61.27507},
  {id: "pointe-des-chateaux", name: "Pointe des Châteaux", area: "Saint-François", kind: "site", lat: 16.24485, lon: -61.17372},
  {id: "le-moule", name: "Le Moule", area: "Grande-Terre", kind: "ville", lat: 16.33143, lon: -61.34401},
  {id: "morne-a-l-eau", name: "Morne-à-l'Eau", area: "Grande-Terre", kind: "ville", lat: 16.33112, lon: -61.45792},
  {id: "port-louis", name: "Port-Louis", area: "Grande-Terre", kind: "ville", lat: 16.41844, lon: -61.52888},
  {id: "anse-bertrand", name: "Anse-Bertrand", area: "Grande-Terre", kind: "ville", lat: 16.4736, lon: -61.50601},
  {id: "baie-mahault", name: "Baie-Mahault", area: "Basse-Terre", kind: "ville", lat: 16.26795, lon: -61.58708},
  {id: "lamentin", name: "Lamentin", area: "Basse-Terre", kind: "ville", lat: 16.27034, lon: -61.6303},
  {id: "sainte-rose", name: "Sainte-Rose", area: "Basse-Terre", kind: "ville", lat: 16.33274, lon: -61.69815},
  {id: "deshaies", name: "Deshaies", area: "Basse-Terre", kind: "ville", lat: 16.30616, lon: -61.7939},
  {id: "grande-anse", name: "Plage de Grande Anse", area: "Deshaies", kind: "site", lat: 16.32126, lon: -61.78956},
  {id: "pointe-noire", name: "Pointe-Noire", area: "Basse-Terre", kind: "ville", lat: 16.23283, lon: -61.78961},
  {id: "bouillante", name: "Bouillante", area: "Basse-Terre", kind: "ville", lat: 16.13196, lon: -61.76996},
  {id: "vieux-habitants", name: "Vieux-Habitants", area: "Basse-Terre", kind: "ville", lat: 16.05933, lon: -61.7637},
  {id: "basse-terre", name: "Basse-Terre", area: "Basse-Terre", kind: "ville", lat: 16.00008, lon: -61.73334},
  {id: "saint-claude", name: "Saint-Claude", area: "Basse-Terre", kind: "ville", lat: 16.02548, lon: -61.69815},
  {id: "trois-rivieres", name: "Trois-Rivières", area: "Basse-Terre", kind: "ville", lat: 15.97674, lon: -61.64416},
  {id: "capesterre", name: "Capesterre-Belle-Eau", area: "Basse-Terre", kind: "ville", lat: 16.04233, lon: -61.56973},
  {id: "goyave", name: "Goyave", area: "Basse-Terre", kind: "ville", lat: 16.13396, lon: -61.57426},
  {id: "petit-bourg", name: "Petit-Bourg", area: "Basse-Terre", kind: "ville", lat: 16.19139, lon: -61.59035},
  {id: "chutes-carbet", name: "Chutes du Carbet", area: "Capesterre-Belle-Eau", kind: "site", lat: 16.01234, lon: -61.58881},
  {id: "memorial-acte", name: "Mémorial ACTe", area: "Pointe-à-Pitre", kind: "site", lat: 16.23155, lon: -61.53425},
  {id: "caravelle", name: "Plage de la Caravelle", area: "Sainte-Anne", kind: "site", lat: 16.21823, lon: -61.3945},
];

export const placeById = (id: string) => PLACES.find((p) => p.id === id);
