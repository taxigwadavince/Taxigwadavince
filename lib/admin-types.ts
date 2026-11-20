// Types partagés entre l'API et l'espace d'administration (réservations de courses).
export type StatutResa = "nouvelle" | "confirmee" | "effectuee" | "annulee";
export const STATUTS_RESA: { value: StatutResa; label: string }[] = [
  { value: "nouvelle", label: "Nouvelle demande" },
  { value: "confirmee", label: "Confirmée" },
  { value: "effectuee", label: "Effectuée" },
  { value: "annulee", label: "Annulée" },
];

export type ResaAdmin = {
  _id: string;
  statut: StatutResa;
  reference?: string;
  date: string;
  heure: string;
  depart?: string;
  arrivee?: string;
  nom?: string;
  telephone?: string;
  email?: string;
  contact?: string;
  adultes?: number;
  enfants?: number;
  valises?: number;
  siegeEnfant?: boolean;
  vol?: string;
  heuresSupp?: number;
  estimation?: string;
  km?: string;
  message?: string;
  creeLe?: string;
};
