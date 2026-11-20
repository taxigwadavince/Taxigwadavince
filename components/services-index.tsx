"use client";

// MCP: "hover image reveal list" -> Hover Image List (21st.dev #28258) : lignes de liste, une seule image d'aperçu qui
// suit le curseur en ressort avec un léger skew, position fixe au clavier, désactivée sans souris.
// Adapté : index des services séparé par une ligne de route en pointillés, pictogrammes maison, aucune image sur
// téléphone (retour Tom 25/10 : trop de cartes-photos identiques). Une seule colonne aussi sur ordinateur
// (retour Tom 26/10 : 4 lignes à gauche, 3 à droite, déséquilibré).
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { services } from "@/lib/content";
import { Glyph, Icon } from "./icons";
import { EASE } from "@/lib/utils";

const hrefFor = (s: (typeof services)[number]) =>
  s.to === "aeroport" ? "/estimateur?from=aeroport" : s.to ? `/estimateur?from=aeroport&to=${s.to}` : "/tarifs";

// Ordinateur (retour Tom 13/11 : la liste d'une colonne était longue à faire défiler) :
// deux colonnes de pastilles (retour Tom : pas de numéros, pas de cartes carrées) ; la vignette ronde
// s'agrandit au survol jusqu'à remplir la pastille (clip-path, styles .svc-pill dans globals.css).
// Téléphone : la liste en pointillés est conservée.
export function ServicesIndex() {
  const reduce = useReducedMotion();
  return (
    <div className="mx-auto mt-10 px-4">
      <ul className="mx-auto grid max-w-3xl lg:hidden">
        {services.map((s, i) => (
          <motion.li
            key={s.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5, delay: (i % 4) * 0.05, ease: EASE }}
            className="relative"
          >
            <Link href={hrefFor(s)} className="group flex min-h-16 items-center gap-4 py-3.5 sm:gap-5 sm:py-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-menthe text-vert transition-colors group-hover:bg-or group-hover:text-vert-900 sm:size-14">
                <Glyph name={s.icon} className="size-6 sm:size-8" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-[1.12rem] leading-tight font-bold text-vert-900 sm:text-[1.4rem]">{s.title}</span>
                <span className="mt-0.5 block text-sm font-medium text-vert-900/80">{s.tag}</span>
              </span>
              <Icon name="ph:arrow-up-right-bold" className="size-5 shrink-0 text-vert" />
            </Link>
            <svg className="absolute inset-x-0 bottom-0 h-[2px] w-full text-vert/25" preserveAspectRatio="none" viewBox="0 0 100 2" aria-hidden="true">
              <line x1="0" y1="1" x2="100" y2="1" stroke="currentColor" strokeWidth="2" strokeDasharray="1.2 1.2" vectorEffect="non-scaling-stroke" />
            </svg>
          </motion.li>
        ))}
      </ul>

      <ul className="mx-auto hidden max-w-5xl grid-cols-2 gap-x-6 gap-y-4 lg:grid">
        {services.map((s, i) => (
          <motion.li
            key={s.id}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.55, delay: (i % 2) * 0.06 + Math.floor(i / 2) * 0.06, ease: EASE }}
          >
            <Link
              href={hrefFor(s)}
              className="svc-pill group relative isolate flex h-[5.5rem] items-center gap-5 overflow-hidden rounded-full border border-vert/10 bg-white/80 py-3 pr-4 pl-3 shadow-[0_14px_34px_-28px_rgba(5,40,20,0.55)] transition-shadow duration-500 hover:shadow-[0_24px_44px_-26px_rgba(5,40,20,0.7)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-or"
            >
              <span aria-hidden="true" className="svc-pill-reveal absolute inset-0 -z-10">
                <img src={s.img} alt="" loading="lazy" className="h-full w-full object-cover" />
                <span className="svc-pill-shade absolute inset-0 bg-gradient-to-r from-vert-900/90 via-vert-900/70 to-vert-900/35" />
              </span>
              <span aria-hidden="true" className="relative size-16 shrink-0 overflow-hidden rounded-full ring-2 ring-white/90 transition-[box-shadow] duration-500 group-hover:ring-or"><img src={s.img} alt="" loading="lazy" className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-0 group-focus-visible:opacity-0" /></span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2 font-display text-[1.2rem] leading-tight font-bold text-vert-900 transition-colors duration-500 group-hover:text-creme group-focus-visible:text-creme">
                  <Glyph name={s.icon} className="size-5 shrink-0 text-vert transition-colors duration-500 group-hover:text-or group-focus-visible:text-or" />
                  <span className="truncate">{s.title}</span>
                </span>
                <span className="mt-1 block truncate text-sm font-medium text-gris transition-colors duration-500 group-hover:text-creme/85 group-focus-visible:text-creme/85">{s.tag}</span>
              </span>
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-menthe text-vert transition-[background-color,color,transform] duration-500 group-hover:-rotate-45 group-hover:bg-or group-hover:text-vert-900 group-focus-visible:bg-or">
                <Icon name="ph:arrow-right-bold" className="size-5" />
              </span>
            </Link>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
