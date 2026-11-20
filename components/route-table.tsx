"use client";

// MCP: "price calculator" -> ROI Pricing Calculator (21st.dev #27098) : lignes qui se dévoilent une à une, montants
// alignés en chiffres tabulaires. Calculé depuis les itinéraires réels (lib/popular-routes.ts) et lib/tarifs.ts.
import { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { POPULAR_FROM_AIRPORT } from "@/lib/popular-routes";
import { placeById } from "@/lib/places";
import { estimate } from "@/lib/tarifs";
import { Icon } from "./icons";
import { euro2, EASE } from "@/lib/utils";

const DAY = new Date("2026-11-03T10:00:00-04:00");
const NIGHT = new Date("2026-11-03T22:00:00-04:00");
const IDS = ["bergevin", "gosier", "sainte-anne", "caravelle", "le-moule", "saint-francois", "pointe-des-chateaux", "chutes-carbet", "grande-anse", "deshaies", "trois-rivieres", "basse-terre"];
// Lignes visibles avant le bouton : ce qui tient dans un écran, titre de section compris.
const SHOWN_MOBILE = 4;
const SHOWN_DESKTOP = 6;

const range = (e: ReturnType<typeof estimate>) => (e.low === e.high ? euro2(e.low) : `${euro2(e.low)} à ${euro2(e.high)}`);

export function RouteTable() {
  const [expanded, setExpanded] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  const toggle = () => {
    if (expanded) {
      // En repliant, on remonte au tableau s'il est sorti de l'écran par le haut.
      const top = box.current?.getBoundingClientRect().top ?? 0;
      if (top < 0) window.scrollTo({ top: top + window.scrollY - 100, behavior: "smooth" });
    }
    setExpanded((v) => !v);
  };

  return (
    <div ref={box} className="mx-auto mt-12 max-w-4xl px-4">
      <div className="hidden grid-cols-[1.4fr_0.6fr_1fr_1fr_auto] gap-4 border-b border-white/15 px-4 pb-3 text-xs font-semibold tracking-widest text-creme/85 uppercase md:grid">
        <span>Destination</span>
        <span>Distance</span>
        <span>Jour</span>
        <span>Nuit, dim. et fériés</span>
        <span className="w-9" />
      </div>
      <ul id="reperes-trajets">
        {IDS.map((id, i) => {
          const r = POPULAR_FROM_AIRPORT[id];
          const p = placeById(id)!;
          const d = estimate({ fromId: "aeroport", toId: id, km: r.km, date: DAY, passengers: 2 });
          const n = estimate({ fromId: "aeroport", toId: id, km: r.km, date: NIGHT, passengers: 2 });
          return (
            <motion.li
              key={id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.5, delay: (i % 6) * 0.04, ease: EASE }}
              className={expanded || i < SHOWN_MOBILE ? undefined : i < SHOWN_DESKTOP ? "hidden md:block" : "hidden"}
            >
              <Link href={`/estimateur?from=aeroport&to=${id}`} className="group grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 border-b border-white/10 px-4 py-4 transition-colors hover:bg-white/6 md:grid-cols-[1.4fr_0.6fr_1fr_1fr_auto]">
                <span className="font-semibold text-white">
                  {p.name}
                  <span className="block text-xs font-normal text-creme/85">{p.area}</span>
                  {d.forfait && <span className="block text-xs font-medium text-soleil">Forfait aéroport ↔ Bergevin</span>}
                </span>
                <span className="text-sm text-creme/85 tabular md:order-none">{r.km.toFixed(0)}&nbsp;km · {r.min}&nbsp;min</span>
                <span className="text-[0.95rem] font-semibold text-soleil tabular">
                  <Icon name="ph:sun-bold" className="mr-1.5 inline size-4 md:hidden" />
                  {range(d)}
                </span>
                <span className="text-[0.95rem] font-semibold text-creme tabular">
                  <Icon name="ph:moon-bold" className="mr-1.5 inline size-4 md:hidden" />
                  {range(n)}
                </span>
                <span className="hidden size-9 place-items-center rounded-full bg-white/10 text-or transition-colors group-hover:bg-or group-hover:text-vert-900 md:grid">
                  <Icon name="ph:arrow-right-bold" className="size-4" />
                </span>
              </Link>
            </motion.li>
          );
        })}
      </ul>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={expanded}
        aria-controls="reperes-trajets"
        className="mx-auto mt-6 flex w-fit items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-creme ring-1 ring-white/15 transition-colors hover:bg-or hover:text-vert-900 hover:ring-or"
      >
        {expanded ? (
          <span>Voir moins de trajets</span>
        ) : (
          <span>
            Voir les <span className="md:hidden">{IDS.length - SHOWN_MOBILE}</span>
            <span className="hidden md:inline">{IDS.length - SHOWN_DESKTOP}</span> autres trajets
          </span>
        )}
        <Icon name="ph:caret-down-bold" className={`size-4 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
      </button>
      <p className="mt-6 text-center text-sm text-creme/85">Estimations depuis l&apos;aéroport, hors temps supplémentaire. Prix final à confirmer avec Vincent.</p>
    </div>
  );
}
