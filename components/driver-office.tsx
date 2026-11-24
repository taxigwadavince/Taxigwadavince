"use client";

// « Le bureau » (page À propos de taxigwadavince.com) en médaillon : adresse et e-mail à gauche, carte réelle de l'île
// dans un cercle bordé de deux arcs or au centre, appel et WhatsApp à droite, horaires et paiement dessous.
import { motion, useReducedMotion } from "motion/react";
import { ISLAND_PATHS, MAP, project } from "@/lib/guadeloupe-map";
import { gmailLink, site, whatsappLink } from "@/lib/site";
import { Icon } from "./icons";
import { Kicker, Reveal, Title } from "./ui";
import { EASE } from "@/lib/utils";

// Arc de cercle (centre 50,50, rayon 48) entre deux angles en degrés, sens horaire.
function arc(from: number, to: number) {
  const pt = (deg: number) => {
    const r = (deg * Math.PI) / 180;
    return `${(50 + 48 * Math.cos(r)).toFixed(2)} ${(50 + 48 * Math.sin(r)).toFixed(2)}`;
  };
  return `M ${pt(from)} A 48 48 0 0 1 ${pt(to)}`;
}

// Fonction : relue à chaque rendu pour suivre les coordonnées saisies dans /admin
const mapsHref = () => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${site.address} ${site.city} ${site.region}`)}`;

export function DriverOffice() {
  const reduce = useReducedMotion();
  const [gx, gy] = project(site.geo.lat, site.geo.lon);

  return (
    <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <Reveal>
          <Kicker icon="ph:map-pin-fill">Le bureau</Kicker>
        </Reveal>
        <Title text="Basé au Gosier, partout sur l'île" className="mt-5" />
        <Reveal delay={0.1}>
          <p className="mx-auto mt-4 max-w-2xl text-[1.08rem] leading-relaxed text-vert-900/85 sm:text-[1.2rem]">
            Depuis Le Gosier, Vincent vous accompagne vers l&apos;aéroport, les ports et toutes les communes.
          </p>
        </Reveal>
      </div>

      <div className="mt-12 grid items-center gap-10 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-12">
        {/* Médaillon : en premier sur mobile, au centre sur ordinateur */}
        <Reveal dir="scale" className="mx-auto w-full max-w-[340px] sm:max-w-[400px] lg:order-2 lg:w-[400px] xl:w-[440px]">
          <div className="relative aspect-square">
            <motion.svg
              aria-hidden="true"
              viewBox="0 0 100 100"
              className="absolute -inset-[6%] size-[112%] text-or"
              initial={reduce ? false : { rotate: -25, opacity: 0 }}
              whileInView={{ rotate: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.2, ease: EASE }}
            >
              <path d={arc(196, 280)} fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
              <path d={arc(16, 100)} fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
            </motion.svg>
            <div className="absolute inset-0 grid place-items-center rounded-full bg-[#d3ead6]">
              <svg viewBox={`0 0 ${MAP.width} ${MAP.height}`} className="w-[80%]" role="img" aria-label="Carte de la Guadeloupe : le bureau de Vincent est au Gosier">
                {ISLAND_PATHS.map((d, i) => (
                  <path key={i} d={d} fill="#1d5c32" />
                ))}
                <circle cx={gx} cy={gy} r={26} fill="#dab211" opacity={0.3} />
                <circle cx={gx} cy={gy} r={15} fill="#dab211" stroke="#052814" strokeWidth={5} />
                <text x={gx + 34} y={gy - 18} fill="#f7f5ee" fontSize={46} fontWeight={700} style={{ fontFamily: "var(--font-poppins)", paintOrder: "stroke", stroke: "#1d5c32", strokeWidth: 8, strokeLinejoin: "round" }}>
                  Le Gosier
                </text>
              </svg>
            </div>
          </div>
        </Reveal>

        {/* Appel et WhatsApp */}
        <Reveal dir="left" delay={0.1} className="lg:order-3">
          <div className="mx-auto grid w-full max-w-[440px] gap-4 lg:mr-0">
            <a href={site.phoneHref} className="group flex min-h-[4.5rem] items-center justify-center gap-4 rounded-full bg-vert-900 px-8 text-creme shadow-[0_18px_40px_-22px_rgba(5,40,20,0.8)] transition-colors hover:bg-vert">
              <Icon name="ph:phone-bold" className="size-7 shrink-0" />
              <span className="font-display text-[1.6rem] font-bold tabular sm:text-[1.9rem]">{site.phoneDisplay}</span>
            </a>
            <a href={whatsappLink("Bonjour Vincent, je souhaite organiser une course.")} target="_blank" rel="noreferrer" className="group flex min-h-[4.5rem] items-center justify-center gap-4 rounded-full bg-or px-8 text-vert-900 shadow-[0_18px_40px_-22px_rgba(184,147,10,0.9)] transition-colors hover:bg-soleil">
              <Icon name="si:whatsapp" className="size-8 shrink-0" />
              <span className="font-display text-[1.45rem] font-bold sm:text-[1.7rem]">Écrire à Vincent</span>
            </a>
          </div>
        </Reveal>

        {/* Adresse et e-mail */}
        <Reveal dir="right" delay={0.1} className="lg:order-1">
          <div className="mx-auto grid w-fit gap-7 lg:mx-0">
            <a href={mapsHref()} target="_blank" rel="noreferrer" className="flex items-start gap-4 text-vert-900 transition-colors hover:text-vert">
              <Icon name="ph:map-pin-fill" className="mt-0.5 size-9 shrink-0 text-vert" />
              <span className="font-display text-[1.25rem] leading-snug font-bold sm:text-[1.4rem]">
                {site.address},
                <br />
                {site.city}
              </span>
            </a>
            <a href={gmailLink()} target="_blank" rel="noreferrer" className="flex items-center gap-4 text-vert-900">
              <Icon name="ph:envelope-simple-bold" className="size-9 shrink-0 text-vert" />
              <span className="text-[1.1rem] font-semibold break-all underline decoration-vert-900/60 underline-offset-[6px] transition-colors hover:text-vert sm:text-[1.25rem]">{site.email}</span>
            </a>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.15}>
        <p className="mt-12 flex flex-col items-center gap-3 text-vert-900 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-6 lg:mt-14">
          <span className="inline-flex items-center gap-3 font-display text-[1.3rem] font-bold sm:text-[1.5rem]">
            <Icon name="ph:clock-bold" className="size-8 text-vert" /> {site.hours}
          </span>
          <span aria-hidden="true" className="hidden size-2.5 rounded-full bg-vert sm:block" />
          <span className="inline-flex items-center gap-2.5 text-[0.9rem] font-semibold whitespace-nowrap min-[360px]:text-[0.98rem] sm:gap-3 sm:text-[1.3rem]">
            <Icon name="ph:credit-card-bold" className="size-6 shrink-0 text-vert sm:size-8" /> {site.payment}
          </span>
        </p>
      </Reveal>
    </div>
  );
}
