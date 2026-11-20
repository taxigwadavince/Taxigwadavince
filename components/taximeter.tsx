"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "motion/react";
import { placeById } from "@/lib/places";
import { getRoute, type RouteResult } from "@/lib/route";
import { estimate, TARIFS, type Periode } from "@/lib/tarifs";
import { Icon } from "./icons";
import { Kicker, Reveal } from "./ui";
import styles from "./taximeter.module.css";
import { tarifsPage } from "@/lib/textes";

const AIRPORT = placeById("aeroport")!;
const KEYS = ["croisiere", "memorial-acte", "baie-mahault", "port-louis", "anse-bertrand", "sainte-rose", "bouillante", "saint-claude"];
const DATES: Record<Periode, Date> = { jour: new Date("2026-11-03T10:00:00-04:00"), nuit: new Date("2026-11-03T22:00:00-04:00") };
const RUN_MS = 2400;

type Status = "libre" | "calcul" | "course" | "arrivee";

export function Taximeter() {
  const reduce = useReducedMotion();
  const [dest, setDest] = useState<string | null>(null);
  const [periode, setPeriode] = useState<Periode>("jour");
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [status, setStatus] = useState<Status>("libre");
  const [shown, setShown] = useState<{ price: number; km: number; min: number } | null>(null);
  const latest = useRef(0);

  const target = dest && route ? { price: estimate({ fromId: "aeroport", toId: dest, km: route.km, date: DATES[periode] }).low, km: Math.round(route.km * 10) / 10, min: route.minutes } : null;
  const tPrice = target?.price;
  const tKm = target?.km;
  const tMin = target?.min;

  // Même calcul que l'estimateur, avec un décompte depuis la prise en charge.
  useEffect(() => {
    if (tPrice === undefined || tKm === undefined || tMin === undefined) return;
    if (reduce) {
      setShown({ price: tPrice, km: tKm, min: tMin });
      setStatus("arrivee");
      return;
    }
    setStatus("course");
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / RUN_MS);
      const e = 1 - Math.pow(1 - p, 3);
      const price = p < 1 ? TARIFS.fraisDepart + Math.floor(((tPrice - TARIFS.fraisDepart) * e) / 0.1) * 0.1 : tPrice;
      setShown({ price, km: tKm * e, min: Math.round(tMin * e) });
      if (p < 1) raf = requestAnimationFrame(tick);
      else setStatus("arrivee");
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [tPrice, tKm, tMin, reduce]);

  const go = async (id: string) => {
    const request = ++latest.current;
    setDest(id);
    setRoute(null);
    setShown(null);
    setStatus("calcul");
    const result = await getRoute(AIRPORT, placeById(id)!);
    if (latest.current === request) setRoute(result);
  };

  const name = dest ? placeById(dest)!.name : "À sélectionner";
  const price = shown ? shown.price.toFixed(2).replace(".", ",") : "—";
  const km = shown ? shown.km.toFixed(1).replace(".", ",") : "—";
  const minutes = shown ? String(shown.min) : "—";
  const message = status === "libre"
    ? "Choisissez une destination pour afficher le prix."
    : status === "calcul"
      ? "Calcul de votre itinéraire…"
      : status === "course"
        ? "Votre estimation se précise…"
        : `Prise en charge comprise.${route && !route.exact ? " Distance approchée." : ""} Tarif de ${periode}.`;

  return (
    <section id="compteur" aria-label="Le compteur de Vincent" className={styles.section}>
      <svg aria-hidden="true" viewBox="0 0 460 230" className={styles.topRibbon}>
        <path d="M0 220C150 74 328-3 460 8V91C303 76 132 113 0 220Z" fill="#dfe5ce" />
        <path d="M149 220C254 141 362 101 460 105V145C350 130 247 151 149 220Z" fill="#efce50" />
      </svg>
      <svg aria-hidden="true" viewBox="0 0 460 100" className={styles.bottomRibbon}>
        <path d="M64 100C163 22 316 28 460 100Z" fill="#eac324" />
        <path d="M0 11C116 20 212 67 282 100H0Z" fill="#255c3e" />
      </svg>

      <div className={styles.container}>
        <header className={styles.header}>
          <Kicker icon="ph:steering-wheel-bold">Le compteur de Vincent</Kicker>
          <h2 className={styles.title}>
            Votre trajet, votre <span className={styles.underlined}>estimation.<svg aria-hidden="true" viewBox="0 0 300 22" preserveAspectRatio="none"><path d="M2 19C90-3 218-3 298 18C205 5 98 7 2 22Z" fill="currentColor" /></svg></span>
          </h2>
          <p className={styles.subtitle}>Au départ de l’aéroport Pôle Caraïbes</p>
        </header>

        <Reveal inner={styles.card}>
          <div className={styles.columns}>
            <div className={styles.journey}>
              <dl className={styles.stops}>
                <div className={styles.stop}>
                  <dt>Départ</dt>
                  <dd>Aéroport Pôle Caraïbes</dd>
                </div>
                <div className={`${styles.stop} ${styles.arrival}`}>
                  <dt>Arrivée</dt>
                  <dd aria-live="polite" className={dest ? styles.selectedArrival : undefined}>{name}</dd>
                </div>
              </dl>
              <div className={styles.periodWrapper}>
                <div role="group" aria-label="Période du trajet" className={styles.period}>
                  {(["jour", "nuit"] as const).map((p) => (
                    <button key={p} type="button" onClick={() => setPeriode(p)} aria-pressed={periode === p} className={styles.periodButton}>
                      <Icon name={p === "jour" ? "ph:sun-bold" : "ph:moon-bold"} />
                      {p === "jour" ? "Jour" : "Nuit"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.destinations}>
              <h3 id="compteur-destinations">Choisir une destination</h3>
              <div role="group" aria-labelledby="compteur-destinations" className={styles.destinationGrid}>
                {KEYS.map((id) => {
                  const place = placeById(id)!;
                  return (
                    <button key={id} type="button" onClick={() => go(id)} onPointerEnter={() => { void getRoute(AIRPORT, place); }} aria-pressed={dest === id} className={styles.destinationButton}>
                      {place.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={styles.result} aria-busy={status === "calcul" || status === "course"}>
              <h3>Prix estimé</h3>
              <p className={styles.price} aria-hidden="true" data-empty={!shown}>
                <span>{price}</span><span>€</span>
              </p>
              <div className={styles.metrics} aria-hidden="true">
                <span>{km} km</span><span>{minutes} min</span>
              </div>
              <p className={styles.message}>{message}</p>
              <p role="status" className="sr-only">
                {status === "calcul" ? "Calcul de l’itinéraire en cours." : status === "arrivee" && target ? `Aéroport vers ${name} : ${target.price.toFixed(2).replace(".", ",")} euros, ${target.km.toString().replace(".", ",")} kilomètres, environ ${target.min} minutes, tarif de ${periode}.${route && !route.exact ? " Distance approchée." : ""}` : ""}
              </p>
              {status === "arrivee" && dest ? (
                <Link href={`/reserver?from=aeroport&to=${dest}`} className={styles.reserve}>Réserver ce trajet</Link>
              ) : (
                <button type="button" disabled className={styles.reserve}>Réserver ce trajet</button>
              )}
            </div>
          </div>

          <Link href={`/estimateur?from=aeroport${dest ? `&to=${dest}` : ""}`} className={styles.estimatorLink}>
            <span>Autre adresse ? Utiliser l’estimateur</span>
            <Icon name="ph:arrow-right-bold" />
          </Link>
        </Reveal>

        <p className={styles.disclaimer}>{tarifsPage.compteurNote}</p>
      </div>
    </section>
  );
}
