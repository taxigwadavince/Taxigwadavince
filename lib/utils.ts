import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const EASE = [0.22, 1, 0.36, 1] as const;

// Montant en euros avec espace insécable (jamais d'espace fine qui casse la ligne).
export function euro(n: number) {
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(n).replace(/ /g, " ") + " €";
}

export function euro2(n: number) {
  return new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n).replace(/ /g, " ") + " €";
}

export function duree(min: number) {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60), m = min % 60;
  return `${h} h${m ? " " + String(m).padStart(2, "0") : ""}`;
}

// Typographie française : espace insécable avant ? ! : ; » et après «, appliquée aux textes de contenu.
export function fr<T>(s: T): T {
  if (typeof s !== "string") return s;
  return s.replace(/ ([?!:;»])/g, " $1").replace(/« /g, "« ") as T;
}
