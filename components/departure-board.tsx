// Départs depuis l'aéroport Maryse Condé : grille de cartes simple (retour Tom 26/10 : le tableau à volets
// était trop original). Chaque carte renvoie vers l'estimateur pré-rempli, prix de jour indicatif.
import Link from "next/link";
import { POPULAR_FROM_AIRPORT } from "@/lib/popular-routes";
import { estimate } from "@/lib/tarifs";
import { Icon } from "./icons";
import { Reveal } from "./ui";
import { euro2 } from "@/lib/utils";

const REF = new Date("2026-11-03T10:00:00-04:00");

const ROWS = [
  { id: "gosier", label: "Le Gosier" },
  { id: "bergevin", label: "Gare de Bergevin" },
  { id: "sainte-anne", label: "Sainte-Anne" },
  { id: "saint-francois", label: "Saint-François" },
  { id: "deshaies", label: "Deshaies" },
  { id: "chutes-carbet", label: "Chutes du Carbet" },
];

export function DepartureBoard() {
  return (
    // auto-rows-fr : toutes les rangées prennent la hauteur de la plus haute, les cartes ont donc toutes la même taille.
    <ul className="mx-auto mt-12 grid max-w-5xl auto-rows-fr gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
      {ROWS.map((r, i) => {
        const route = POPULAR_FROM_AIRPORT[r.id];
        const e = estimate({ fromId: "aeroport", toId: r.id, km: route.km, date: REF, passengers: 2 });
        return (
          <li key={r.id}>
            <Reveal delay={i * 0.05} className="h-full" inner="h-full">
              <Link
                href={`/estimateur?from=aeroport&to=${r.id}`}
                aria-label={`Estimer le trajet aéroport vers ${r.label}`}
                className="group flex h-full items-center gap-4 rounded-[18px] bg-white/[0.07] px-5 py-4 ring-1 ring-white/12 transition-colors hover:bg-white/[0.12]"
              >
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-[1.1rem] leading-tight font-bold text-white">{r.label}</span>
                  <span className="mt-1 flex items-center gap-1.5 text-sm text-creme/80 tabular">
                    <Icon name="ph:clock-bold" className="size-4 text-or" /> {route.min} min
                  </span>
                </span>
                <span className="text-right">
                  <span className="block text-xs font-medium text-creme/70">{e.forfait ? "forfait annoncé" : "estimation de jour"}</span>
                  <span className="block font-display text-[1.4rem] leading-none font-bold text-soleil tabular">{euro2(e.low)}</span>
                </span>
                <Icon name="ph:arrow-right-bold" className="size-4 shrink-0 text-or transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Reveal>
          </li>
        );
      })}
    </ul>
  );
}
