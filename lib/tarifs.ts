import { guadeloupeParts, isGuadeloupeHoliday } from "./guadeloupe-time";

// Tarifs 2026 : arrêté de la sous-préfecture n° 2026-99 du 19/01/2026 (Guadeloupe),
// confirmés par Vincent le 12/11/2026 :
// - prise en charge : 3,73 € ;
// - tarif C (jour, 7 h-19 h, retour à vide) : 2,10 €/km ;
// - tarif D (nuit, dimanche ou jour férié, retour à vide) : 3,15 €/km ;
// - heure d'attente ou marche lente : 25,04 € maximum ;
// - course minimum, suppléments compris : 8 € ;
// - valeur de la chute : 0,10 € (le prix progresse par pas de 0,10 €, jamais au-dessus du compteur).
// Forfait aéroport–Bergevin : 30 € (page /services/ de taxigwadavince.com).
// Tous les montants restent indicatifs et soumis à confirmation.
export const TARIFS = {
  forfaitAeroportBergevin: 30,
  fraisDepart: 3.73,
  kmJour: 2.1,
  kmNuit: 3.15,
  heureSupp: 25.04,
  minimum: 8,
  chute: 0.1,
  heureSuppMax: 24,
};

export type Periode = "jour" | "nuit";

export function periodeFor(date: Date): Periode {
  const { year, month, day, hour } = guadeloupeParts(date);
  const sunday = new Date(Date.UTC(year, month - 1, day)).getUTCDay() === 0;
  if (sunday || isGuadeloupeHoliday(year, month, day)) return "nuit";
  return hour >= 7 && hour < 19 ? "jour" : "nuit";
}

export type EstimateInput = {
  fromId?: string;
  toId?: string;
  km: number;
  date: Date;
  passengers?: number;
  extraHours?: number;
};

export type Estimate = {
  low: number;
  high: number;
  base: number;
  km: number;
  periode: Periode;
  forfait?: string;
  lines: { label: string; value: number }[];
};

// Calcul en centimes pour éviter les erreurs de virgule flottante (10 km x 2,10 doit donner 21,00 € et non 21,50 €).
export function estimate(i: EstimateInput): Estimate {
  const periode = periodeFor(i.date);
  const dixiemes = Math.round(i.km * 10);
  const km = dixiemes / 10;
  // Centimes par km x dixièmes de km = millièmes d'euro (/10 = centimes) ; arrondi à la chute de 0,10 €.
  const centimesParKm = Math.round((periode === "jour" ? TARIFS.kmJour : TARIFS.kmNuit) * 100);
  const chute = Math.round(TARIFS.chute * 100);
  const trajet = Math.floor((dixiemes * centimesParKm) / 10 / chute) * chute;
  const extra = Math.max(0, Math.min(TARIFS.heureSuppMax, Math.round(i.extraHours ?? 0)));
  const supp = Math.round(extra * TARIFS.heureSupp * 100);
  const airportTransfer = (i.fromId === "aeroport" && i.toId === "bergevin") || (i.fromId === "bergevin" && i.toId === "aeroport");
  if (airportTransfer) {
    const lines = [{ label: "Forfait aéroport ↔ Bergevin", value: TARIFS.forfaitAeroportBergevin }];
    if (extra) lines.push({ label: `Temps supplémentaire (${extra} h)`, value: supp / 100 });
    const total = TARIFS.forfaitAeroportBergevin + supp / 100;
    return { low: total, high: total, base: total, km, periode, forfait: "Aéroport ↔ Bergevin", lines };
  }
  const depart = Math.round(TARIFS.fraisDepart * 100);
  const lines: Estimate["lines"] = [
    { label: "Frais de départ", value: depart / 100 },
    { label: `${km.toFixed(1).replace(".", ",")} km au tarif de ${periode}`, value: trajet / 100 },
  ];
  if (extra) lines.push({ label: `Temps supplémentaire (${extra} h)`, value: supp / 100 });
  const minimum = Math.round(TARIFS.minimum * 100);
  const sousTotal = depart + trajet + supp;
  if (sousTotal < minimum) lines.push({ label: "Complément course minimum", value: (minimum - sousTotal) / 100 });
  const total = Math.max(sousTotal, minimum) / 100;
  return { low: total, high: total, base: total, km, periode, lines };
}
