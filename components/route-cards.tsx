"use client";

// Prix depuis l'aéroport en cartes : Bergevin (forfait) mis en avant, puis un carrousel d'une carte par destination.
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { POPULAR_FROM_AIRPORT } from "@/lib/popular-routes";
import { placeById } from "@/lib/places";
import { estimate } from "@/lib/tarifs";
import { Glyph, Icon } from "./icons";
import { euro2, EASE } from "@/lib/utils";

const DAY = new Date("2026-11-03T10:00:00-04:00");
const NIGHT = new Date("2026-11-03T22:00:00-04:00");
const FEATURED = "bergevin";
const IDS = ["gosier", "sainte-anne", "caravelle", "le-moule", "saint-francois", "pointe-des-chateaux", "chutes-carbet", "grande-anse", "deshaies", "trois-rivieres", "basse-terre"];

function prices(id: string) {
  const r = POPULAR_FROM_AIRPORT[id];
  return {
    r,
    p: placeById(id)!,
    day: estimate({ fromId: "aeroport", toId: id, km: r.km, date: DAY, passengers: 2 }).low,
    night: estimate({ fromId: "aeroport", toId: id, km: r.km, date: NIGHT, passengers: 2 }).low,
  };
}

function Arrow({ className }: { className?: string }) {
  return (
    <span className={`grid size-11 shrink-0 place-items-center rounded-full bg-or text-vert-900 transition-colors group-hover:bg-soleil sm:size-12 ${className ?? ""}`}>
      <Icon name="ph:arrow-right-bold" className="size-5" />
    </span>
  );
}

export function RouteCards() {
  const f = prices(FEATURED);
  const track = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ start: true, end: false });

  const update = () => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setPos({ start: el.scrollLeft <= 4, end: el.scrollLeft >= max - 4 });
  };

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Avance d'une « page » : autant de cartes qu'il y en a d'entièrement visibles.
  const go = (dir: 1 | -1) => {
    const el = track.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    const cs = getComputedStyle(el);
    const gap = parseFloat(cs.columnGap) || 0;
    const inner = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const step = card.getBoundingClientRect().width + gap;
    const perPage = Math.max(1, Math.floor((inner + gap + 1) / step));
    el.scrollBy({ left: dir * perPage * step, behavior: "smooth" });
  };

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, ease: EASE }} className="mt-10">
        <Link
          href={`/estimateur?from=aeroport&to=${FEATURED}`}
          className="group grid gap-5 rounded-[28px] bg-creme p-5 text-vert-900 shadow-[0_30px_60px_-35px_rgba(0,0,0,0.6)] transition-transform hover:-translate-y-0.5 sm:p-7 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center xl:gap-6 xl:px-9"
        >
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="grid size-16 shrink-0 place-items-center rounded-[18px] bg-vert/10 text-vert-900 sm:size-20">
              <Glyph name="ferry" className="size-10 sm:size-12" />
            </span>
            <div className="min-w-0">
              <p className="font-display text-[1.35rem] leading-tight font-bold sm:text-[1.75rem] xl:text-[1.6rem] 2xl:text-[1.75rem]">{f.p.name}</p>
              <p className="mt-0.5 text-vert-900/75 sm:text-lg">{f.p.area}</p>
              <span className="mt-3 inline-flex rounded-full bg-or px-4 py-1.5 text-sm font-semibold sm:text-base">Forfait aéroport ↔ Bergevin</span>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_1fr_auto] items-end gap-x-4 gap-y-4 border-t border-vert/15 pt-5 sm:flex sm:items-center sm:gap-10 xl:gap-0 xl:border-t-0 xl:pt-0">
            <p className="col-span-3 flex items-center gap-2 font-medium tabular sm:text-lg xl:self-stretch xl:border-l xl:border-vert/15 xl:px-6">
              <Icon name="ph:map-pin-bold" className="size-5 text-vert" /> {f.r.km.toFixed(0)}&nbsp;km · {f.r.min}&nbsp;min
            </p>
            <div className="xl:border-l xl:border-vert/15 xl:px-6">
              <p className="text-sm font-medium text-vert-900/80 sm:text-base">Jour</p>
              <p className="text-[1.6rem] leading-tight font-bold tabular sm:text-[2.1rem]">{euro2(f.day)}</p>
            </div>
            <div className="xl:border-l xl:border-vert/15 xl:px-6">
              <p className="text-sm font-medium text-vert-900/80 sm:text-base">Nuit, dim. et fériés</p>
              <p className="text-[1.6rem] leading-tight font-bold tabular sm:text-[2.1rem]">{euro2(f.night)}</p>
            </div>
            <Arrow className="sm:ml-auto xl:ml-1" />
          </div>
        </Link>
      </motion.div>

      {/* Marges internes : la carte soulevée au survol et son contour ne sont pas rognés par le défilement. */}
      <div
        ref={track}
        onScroll={update}
        aria-label="Destinations depuis l'aéroport"
        className="-mx-4 mt-4 flex scroll-px-4 snap-x snap-mandatory gap-4 overflow-x-auto px-4 py-2 [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:px-6 md:-mx-2 md:scroll-px-2 md:gap-5 md:px-2 [&::-webkit-scrollbar]:hidden"
      >
        {IDS.map((id) => {
          const { r, p, day, night } = prices(id);
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.01 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="w-[78%] shrink-0 snap-center sm:w-[55%] md:w-[calc((100%-1.25rem)/2)] md:snap-start lg:w-[calc((100%-2.5rem)/3)] xl:w-[calc((100%-3.75rem)/4)]"
            >
              <Link
                href={`/estimateur?from=aeroport&to=${id}`}
                className="group flex h-full flex-col rounded-[24px] bg-linear-to-b from-white/12 to-white/4 p-6 text-creme ring-[1.5px] ring-white/55 backdrop-blur-[2px] transition-all hover:-translate-y-1 hover:ring-or"
              >
                <p className="font-display text-[1.5rem] leading-tight font-bold text-white sm:text-[1.7rem]">{p.name}</p>
                <p className="mt-1 text-creme/85 sm:text-lg">{p.area}</p>
                <p className="mt-4 flex items-center gap-2 text-white tabular sm:text-lg">
                  <Icon name="ph:map-pin-fill" className="size-5" /> {r.km.toFixed(0)}&nbsp;km · {r.min}&nbsp;min
                </p>
                <div className="mt-auto pt-5">
                  <div className="border-t border-white/45 pt-4">
                    <p className="text-[0.95rem] text-creme/85">Jour</p>
                    <p className="text-[1.85rem] leading-tight font-bold text-white tabular sm:text-[2rem]">{euro2(day)}</p>
                    <p className="mt-2 text-[0.95rem] text-creme/85">Nuit, dim. et fériés</p>
                    <div className="flex items-end justify-between gap-3">
                      <p className="text-[1.85rem] leading-tight font-bold text-white tabular sm:text-[2rem]">{euro2(night)}</p>
                      <Arrow />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-5 flex justify-center">
        <div className="flex gap-2.5">
          <button type="button" onClick={() => go(-1)} disabled={pos.start} aria-label="Destinations précédentes" className="grid size-12 place-items-center rounded-full text-white ring-[1.5px] ring-white/55 transition-colors hover:bg-or hover:text-vert-900 hover:ring-or disabled:pointer-events-none disabled:opacity-35">
            <Icon name="ph:arrow-left-bold" className="size-5" />
          </button>
          <button type="button" onClick={() => go(1)} disabled={pos.end} aria-label="Destinations suivantes" className="grid size-12 place-items-center rounded-full text-white ring-[1.5px] ring-white/55 transition-colors hover:bg-or hover:text-vert-900 hover:ring-or disabled:pointer-events-none disabled:opacity-35">
            <Icon name="ph:arrow-right-bold" className="size-5" />
          </button>
        </div>
      </div>
      <p className="mt-6 text-sm text-creme/85">Estimations depuis l&apos;aéroport, hors temps supplémentaire. Prix final à confirmer avec Vincent.</p>
    </>
  );
}
