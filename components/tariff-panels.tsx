"use client";

// INSPIRATION: INSPIRATIONS-READ.md idée 4 (Yohan Berger, cartes de prix avec « ce qui fait bouger le prix »)
// + ticket de course à encoches. Deux plages horaires face à face, temps supplémentaire à part.
import { motion } from "motion/react";
import { TARIFS } from "@/lib/tarifs";
import { Icon } from "./icons";
import { euro2, EASE } from "@/lib/utils";

const panels = [
  { id: "jour", icon: "ph:sun-bold", title: "Tarif de jour", when: "7 h à 19 h, hors dimanches et jours fériés", km: TARIFS.kmJour, tone: "bg-soleil text-vert-900" },
  { id: "nuit", icon: "ph:moon-bold", title: "Tarif de nuit", when: "19 h à 7 h, dimanches et jours fériés", km: TARIFS.kmNuit, tone: "bg-vert-900 text-creme" },
];

export function TariffPanels() {
  return (
    <div className="mx-auto mt-14 max-w-[1100px] px-4">
      <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden">
        {panels.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.01 }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
            className={`w-[78%] shrink-0 snap-center rounded-[26px] p-7 sm:w-[55%] md:w-auto ${p.tone}`}
          >
            <Icon name={p.icon} className="size-9" />
            <h3 className="mt-5 font-display text-2xl font-bold">{p.title}</h3>
            <span className="mt-2 inline-block rounded-full bg-current/10 px-2.5 py-0.5 text-[0.7rem] font-semibold tracking-wide uppercase">Repère indicatif</span>
            <p className="mt-1 text-sm opacity-85">{p.when}</p>
            <dl className="mt-6 space-y-3 border-t border-current/20 pt-5 tabular [&>div]:gap-3">
              <div className="flex justify-between"><dt>Frais de départ</dt><dd className="font-semibold">{euro2(TARIFS.fraisDepart)}</dd></div>
              <div className="flex justify-between"><dt>Kilomètre</dt><dd className="font-semibold">{euro2(p.km)}</dd></div>
            </dl>
          </motion.div>
        ))}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.01 }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          className="ticket-edge relative w-[78%] shrink-0 snap-center rounded-[26px] bg-white p-7 ring-1 ring-vert/10 sm:w-[55%] md:w-auto"
          style={{ ["--notch" as string]: "62%" }}
        >
          <Icon name="ph:ticket-bold" className="size-9 text-or-600" />
          <h3 className="mt-5 font-display text-2xl font-bold text-vert-900">Aéroport ↔ Bergevin</h3>
          <p className="mt-1 text-sm text-gris">Le forfait pour votre correspondance</p>
          <p className="mt-6 border-t-2 border-dashed border-vert/15 pt-5 font-sans text-5xl font-bold text-vert-900 tabular">{euro2(TARIFS.forfaitAeroportBergevin)}</p>
          <p className="mt-2 text-sm text-gris">Par transfert, hors temps supplémentaire demandé.</p>
        </motion.div>
      </div>
      <p className="mt-2 text-center text-xs text-gris md:hidden">Faites glisser pour voir les 3 tarifs →</p>
      <p className="mt-6 text-center text-sm leading-relaxed text-gris">Temps supplémentaire : {euro2(TARIFS.heureSupp)} par heure, de 1 à 24 heures. Course minimum : {euro2(TARIFS.minimum)}, suppléments compris. Les montants sont indicatifs et soumis à confirmation par Vincent.</p>
    </div>
  );
}
