"use client";

// INSPIRATION: INSPIRATIONS-READ.md idée 4 (Yohan Berger, fourchette « entre X et Y € » présentée comme un ticket)
// et billet Départ / Destination du hero Kwezi Transit. Ticket de course à encoches, prix qui défile.
import { AnimatePresence, motion } from "motion/react";
import { Icon } from "./icons";
import { cn, duree, euro2 } from "@/lib/utils";
import type { Estimate } from "@/lib/tarifs";

export function Ticket({
  from,
  to,
  km,
  minutes,
  est,
  className,
  children,
  exact = true,
}: {
  from: string;
  to: string;
  km: number;
  minutes: number;
  est: Estimate;
  className?: string;
  children?: React.ReactNode;
  exact?: boolean;
}) {
  return (
    <div className={cn("ticket-edge relative rounded-[22px] bg-creme text-encre shadow-[0_24px_60px_-28px_rgba(0,0,0,0.55)]", className)} style={{ ["--notch" as string]: "58%" }}>
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between text-[0.72rem] font-semibold tracking-[0.16em] text-gris uppercase">
          <span className="inline-flex items-center gap-1.5">
            <Icon name="ph:ticket-bold" className="size-4 text-or-600" /> Votre course
          </span>
          <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.68rem]", est.periode === "jour" ? "bg-soleil/60 text-vert-900" : "bg-vert-900 text-soleil")}>
            <Icon name={est.periode === "jour" ? "ph:sun-bold" : "ph:moon-bold"} className="size-3.5" />
            Tarif {est.periode}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="min-w-0">
            <p className="text-[0.7rem] font-semibold tracking-widest text-gris uppercase">Départ</p>
            <p className="font-display text-[1rem] leading-tight font-bold break-words text-vert-900">{from}</p>
          </div>
          <svg viewBox="0 0 60 12" className="w-12 text-or-600" aria-hidden="true">
            <line x1="2" y1="6" x2="50" y2="6" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" style={{ animation: "dashmove 1.4s linear infinite" }} />
            <path d="M50 1l7 5-7 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="min-w-0 text-right">
            <p className="text-[0.7rem] font-semibold tracking-widest text-gris uppercase">Arrivée</p>
            <p className="font-display text-[1rem] leading-tight font-bold break-words text-vert-900">{to}</p>
          </div>
        </div>
        <div className="mt-4 flex gap-5 text-sm text-gris tabular">
          <span className="inline-flex items-center gap-1.5">
            <Icon name="ph:path-bold" className="size-4 text-vert" /> {exact ? "" : "≈ "}
            {km.toFixed(1).replace(".", ",")}&nbsp;km
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Icon name="ph:clock-bold" className="size-4 text-vert" /> environ {duree(minutes)}
          </span>
        </div>
      </div>
      <div className="mx-5 border-t-2 border-dashed border-vert/20 sm:mx-6" />
      <div className="p-5 sm:p-6">
        <p className="text-[0.72rem] font-semibold tracking-[0.16em] text-gris uppercase">{est.forfait ? "Estimation avec forfait" : "Prix estimé"}</p>
        <AnimatePresence mode="wait">
          <motion.p
            key={`${est.low}-${est.high}`}
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -18, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="mt-1 font-sans text-[clamp(1.9rem,4vw,2.5rem)] font-bold tracking-tight text-vert-900 tabular"
          >
            {est.low === est.high ? euro2(est.low) : (
              <>
                {euro2(est.low)} <span className="text-[0.55em] font-medium text-gris">à</span> {euro2(est.high)}
              </>
            )}
          </motion.p>
        </AnimatePresence>
        <p className="mt-2 text-xs leading-relaxed text-gris">Montant indicatif, à confirmer avec Vincent.</p>
        {children}
      </div>
    </div>
  );
}
