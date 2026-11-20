"use client";

// En-tête de la page tarifs : texte et vrais montants à gauche, photo du port en couleurs naturelles dans une arche,
// étiquette du forfait Bergevin et tampon tournant 24h/24 posés dessus.
import { motion, useReducedMotion } from "motion/react";
import { TARIFS } from "@/lib/tarifs";
import { TaxiFront } from "./icons";
import { Button, Kicker, Title } from "./ui";
import { EASE, euro2 } from "@/lib/utils";

const FACTS = [
  { value: euro2(TARIFS.fraisDepart), label: "Prise en charge" },
  { value: euro2(TARIFS.kmJour), label: "Le km de jour" },
  { value: euro2(TARIFS.kmNuit), label: "Le km de nuit" },
];

export function TarifsHero() {
  const reduce = useReducedMotion();
  return (
    // Sur ordinateur, le bandeau occupe la hauteur de l'écran (barre de navigation comprise) : la photo s'adapte à la hauteur.
    // Sur téléphone, il tient exactement entre la navigation (72 px) et le bouton flottant « Réserver ma course » (70 px) :
    // la photo prend la hauteur restante et les deux boutons sont retirés (le bouton flottant mène à la réservation).
    <section className="relative flex h-[var(--ecran-h,100svh)] min-h-[560px] flex-col overflow-hidden bg-creme pt-[88px] pb-[92px] sm:block sm:h-auto sm:min-h-0 sm:flex-row sm:pt-36 sm:pb-20 lg:flex lg:min-h-svh lg:items-center lg:pt-28 lg:pb-14">
      {/* Mur jaune soleil et ombre de palme dorée (texture passée en gris puis multipliée sur le jaune) :
          plus pâle derrière le texte, plus soutenu derrière la photo, fondu vers la section suivante. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 isolate bg-[linear-gradient(100deg,#fff4cc_0%,#ffeaa3_45%,#ffe178_100%)]">
        <img src="/img/texture-menthe.webp" alt="" className="h-full w-full object-cover object-[30%_50%] mix-blend-multiply grayscale lg:object-right" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-creme" />
      </div>

      {/* Téléphone : titre, photo, puis montants. Tablette : titre, photo, montants et boutons. Ordinateur : texte à gauche, arche à droite. */}
      <div className="relative mx-auto flex min-h-0 w-full max-w-[1280px] flex-1 flex-col justify-center gap-5 px-4 sm:grid sm:justify-normal sm:gap-y-10 sm:px-6 lg:w-full lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:grid-rows-[1fr_auto_auto_1fr] lg:gap-x-16 lg:gap-y-0 lg:px-8">
        <div className="lg:col-start-1 lg:row-start-2">
          <motion.div initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>
            <Kicker icon="ph:receipt-bold">Tarifs & services</Kicker>
          </motion.div>
          <Title as="h1" text="Des prix clairs, partout sur l'île" mark="clairs" center={false} className="mt-3 text-[clamp(2rem,9vw,2.3rem)] sm:mt-5 sm:text-[clamp(2.3rem,4.4vw,4rem)] lg:mt-6 [&_svg]:text-vert-700" />
        </div>

        <motion.div initial={reduce ? false : { opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.15, ease: EASE }} className="relative mb-6 flex max-h-[400px] min-h-[150px] w-full flex-1 flex-col sm:mb-4 sm:block sm:max-h-none sm:min-h-0 sm:flex-none lg:col-start-2 lg:row-span-4 lg:row-start-1 lg:mb-0 lg:w-auto lg:self-center lg:justify-self-center">
          <div className="relative min-h-0 flex-1 overflow-hidden rounded-[28px] shadow-[0_40px_80px_-40px_rgba(5,40,20,0.55)] ring-4 ring-white sm:aspect-[16/10] sm:flex-none lg:aspect-[4/5] lg:h-[min(680px,calc(100svh-13rem))] lg:max-w-full lg:rounded-t-[999px] lg:rounded-b-[36px] lg:ring-8">
            <img src="/img/croisiere.webp" alt="Paquebot à quai au coucher du soleil, devant les maisons créoles du front de mer" className="absolute inset-0 h-full w-full object-cover object-[60%_55%] sm:static lg:object-[66%_50%]" />
          </div>

          <div aria-hidden="true" className="absolute -top-4 right-3 size-16 rounded-full bg-vert-900 text-soleil shadow-[0_18px_40px_-16px_rgba(5,40,20,0.5)] sm:-top-6 sm:size-24 lg:-top-2 lg:-right-6 lg:size-32">
            <svg viewBox="0 0 120 120" className="absolute inset-0 size-full animate-[spin_26s_linear_infinite] motion-reduce:animate-none">
              <defs>
                <path id="tampon-cercle" d="M60,60 m-45,0 a45,45 0 1,1 90,0 a45,45 0 1,1 -90,0" />
              </defs>
              <text className="fill-current text-[10px] font-semibold uppercase">
                <textPath href="#tampon-cercle" textLength="280" lengthAdjust="spacing">Taxi Gwada Vince • 24h/24 • 7j/7 •</textPath>
              </text>
            </svg>
            <TaxiFront className="absolute inset-0 m-auto size-7 sm:size-10 lg:size-12" />
          </div>

          <div className="absolute -bottom-7 left-3 drop-shadow-[0_22px_30px_rgba(5,40,20,0.28)] lg:-bottom-8 lg:-left-10">
            <div className="ticket-edge w-52 -rotate-3 rounded-[18px] bg-white p-4 sm:w-60 lg:w-64 lg:rounded-[20px] lg:p-5" style={{ ["--notch" as string]: "60%" }}>
              <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-or-600 uppercase lg:text-[0.7rem]">Forfait</p>
              <p className="mt-1 font-display text-base font-bold text-vert-900 sm:text-lg lg:text-xl">Aéroport ↔ Bergevin</p>
              <div className="mt-2.5 flex items-end justify-between border-t-2 border-dashed border-vert/15 pt-2.5 lg:mt-3 lg:pt-3">
                <span className="text-xs text-vert-700 lg:text-sm">Par transfert</span>
                <span className="font-display text-[1.4rem] leading-none font-bold text-vert-900 tabular lg:text-[1.7rem]">{euro2(TARIFS.forfaitAeroportBergevin)}</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="lg:col-start-1 lg:row-start-3">
          <motion.p initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25, ease: EASE }} className="hidden max-w-xl text-[1.02rem] leading-relaxed text-vert-900/80 sm:block lg:mt-6 lg:text-[1.08rem]">
            Navettes aéroport et ports, excursions, courses de nuit et VSL : chaque trajet est calculé au kilomètre, sans surprise à l&apos;arrivée.
          </motion.p>

          <motion.dl initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.35, ease: EASE }} className="grid max-w-xl grid-cols-3 gap-2 sm:mt-6 lg:mt-9 lg:gap-0 lg:divide-x lg:divide-vert/15 lg:border-y lg:border-vert/15 lg:py-5">
            {FACTS.map((f) => (
              <div key={f.label} className="flex flex-col-reverse gap-0.5 rounded-2xl bg-white/85 px-3 py-3 shadow-[0_10px_24px_-18px_rgba(5,40,20,0.45)] ring-1 ring-vert/10 lg:gap-1 lg:rounded-none lg:bg-transparent lg:px-5 lg:py-0 lg:shadow-none lg:ring-0 lg:first:pl-0">
                <dt className="text-[0.72rem] leading-tight font-medium text-vert-700 sm:text-sm">{f.label}</dt>
                <dd className="font-display text-[1.25rem] font-bold text-vert-900 tabular sm:text-[1.6rem] lg:text-[1.9rem]">{f.value}</dd>
              </div>
            ))}
          </motion.dl>

          <motion.div initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.45, ease: EASE }} className="mt-7 hidden gap-3 sm:flex sm:flex-wrap lg:mt-9">
            <Button href="/estimateur" variant="vert" icon="ph:calculator-bold" className="w-full sm:w-auto">
              Estimer mon trajet
            </Button>
            <Button href="#grille" variant="ligne" icon="ph:caret-down-bold" className="w-full sm:w-auto">
              Voir la grille
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
