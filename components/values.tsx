"use client";

// Engagements de la page « À propos » de Vincent (sécurité, fiabilité, confort), en mosaïque :
// grande carte crème, carte or, carte à contour clair.
import { motion } from "motion/react";
import { Icon } from "./icons";
import { EASE } from "@/lib/utils";

const S = { fill: "none", stroke: "currentColor", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

function Seat({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" {...S} strokeWidth={3}>
      <rect x="26" y="3.5" width="12" height="8" rx="3.5" />
      <path d="M25.5 15h12.5l-4.5 19H20.5Z" />
      <path d="M9 36.5A2.5 2.5 0 0 1 11.5 34H32a3 3 0 0 1 3 3v2.5A2.5 2.5 0 0 1 32.5 42H11.5A2.5 2.5 0 0 1 9 39.5Z" />
    </svg>
  );
}

function ShieldOutline({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 120" className={className} aria-hidden="true" {...S} strokeWidth={7}>
      <path d="M50 6 90 20v38c0 28-18 46-40 56C28 104 10 86 10 58V20Z" />
    </svg>
  );
}

const card = (delay: number) => ({ initial: { opacity: 0, y: 26 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.3 }, transition: { duration: 0.7, delay, ease: EASE } });

export function Values() {
  return (
    <div className="mx-auto mt-12 grid max-w-[1180px] gap-4 px-4 sm:mt-14 sm:gap-5 sm:px-6 lg:grid-cols-2 lg:grid-rows-2 lg:px-8">
      <motion.article {...card(0)} className="relative isolate flex flex-col justify-between gap-10 overflow-hidden rounded-[30px] bg-creme p-7 text-vert-900 sm:p-10 lg:row-span-2 lg:min-h-[440px]">
        <ShieldOutline className="absolute top-6 -right-16 -z-10 h-[360px] text-vert/10 sm:right-[-2.5rem]" />
        <Icon name="ph:shield-check-bold" className="size-16 text-vert sm:size-24" />
        <div>
          <h3 className="font-display text-[clamp(2.4rem,4.6vw,3.6rem)] leading-none font-bold">Sécurité</h3>
          <p className="mt-4 max-w-md text-[1.1rem] leading-relaxed sm:text-[1.3rem]">Une conduite souple et un véhicule entretenu pour voyager sereinement.</p>
        </div>
      </motion.article>

      <motion.article {...card(0.1)} className="flex items-center gap-5 rounded-[30px] bg-or p-7 text-vert-900 sm:gap-8 sm:p-9">
        <Icon name="ph:clock-bold" className="size-14 shrink-0 sm:size-24" />
        <div>
          <h3 className="font-display text-[clamp(1.9rem,3.4vw,2.7rem)] leading-none font-bold">Fiabilité</h3>
          <p className="mt-3 text-[1.02rem] leading-relaxed sm:text-[1.18rem]">Un chauffeur ponctuel, à votre service de jour comme de nuit.</p>
        </div>
      </motion.article>

      <motion.article {...card(0.2)} className="flex items-center gap-5 rounded-[30px] p-7 text-creme ring-2 ring-white/80 ring-inset sm:gap-8 sm:p-9">
        <Seat className="size-14 shrink-0 text-white sm:size-24" />
        <div>
          <h3 className="font-display text-[clamp(1.9rem,3.4vw,2.7rem)] leading-none font-bold text-white">Confort</h3>
          <p className="mt-3 text-[1.02rem] leading-relaxed text-creme/90 sm:text-[1.18rem]">Un trajet agréable avec un chauffeur qui connaît son île.</p>
        </div>
      </motion.article>
    </div>
  );
}
