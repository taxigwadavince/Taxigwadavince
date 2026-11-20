"use client";

import { motion, useReducedMotion } from "motion/react";
import { site, whatsappLink } from "@/lib/site";
import { faq } from "@/lib/content";
import { useHeroLock } from "./hero-lock";
import { Button, Reveal, SectionHead, Title, Lead, Kicker } from "./ui";
import { Icon } from "./icons";
import { ServicesIndex } from "./services-index";
import { DepartureBoard } from "./departure-board";
import { Checker } from "./checker";
import { RoadSteps } from "./road-steps";
import { ReviewsMarquee } from "./reviews-marquee";
import { FaqList } from "./faq-list";
import { EASE } from "@/lib/utils";

const Cta = Button;

// Demande de Vincent (16/11/2026) : lire « Taxi Gwada Vince » dans le hero. « Taxi » en blanc au-dessus du G,
// « Vince » en blanc à droite de la voiture (retour Tom : le kaki ne ressortait pas). Voir HeroVince ci-dessous.
// Téléphone (retour de Vincent, 18/11/2026) : GWADA remonté au-dessus de la voiture et un peu plus petit,
// « Taxi » centré au-dessus du G et « Vince » centré sous le dernier A, en symétrie aux deux extrémités.
function GiantWordMobile({ className, size }: { className: string; size: string }) {
  const reduce = useReducedMotion();
  const small = (d: number, from: number) => ({
    initial: reduce ? false : { opacity: 0, y: from },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay: d, ease: EASE },
  });
  // pl compense l'espacement ajouté après la dernière lettre, pour un centrage optique exact.
  const tag = "absolute left-1/2 -translate-x-1/2 whitespace-nowrap pl-[0.18em] font-display leading-none font-bold tracking-[0.18em] text-white uppercase [text-shadow:0_2px_14px_rgba(5,40,20,0.55)]";
  const letters = "GWADA".split("");
  return (
    <div className={className} aria-hidden="true">
      <div className="flex font-display leading-[0.86] font-extrabold tracking-[-0.03em] text-soleil" style={{ fontSize: size }}>
        {letters.map((l, i) => (
          <span key={i} className="relative inline-block">
            <span className="block overflow-hidden">
              <motion.span
                className="inline-block"
                initial={reduce ? false : { y: "105%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.1, delay: 0.25 + i * 0.09, ease: EASE }}
              >
                {l}
              </motion.span>
            </span>
            {i === 0 && (
              <motion.span {...small(0.2, 10)} className={`${tag} bottom-[calc(100%+0.22em)]`} style={{ fontSize: "0.3em" }}>
                Taxi
              </motion.span>
            )}
            {i === letters.length - 1 && (
              <motion.span {...small(0.9, -10)} className={`${tag} top-[calc(100%+0.3em)]`} style={{ fontSize: "0.3em" }}>
                Vince
              </motion.span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

function GiantWord({ className, size }: { className: string; size: string }) {
  const reduce = useReducedMotion();
  const small = (d: number) => ({
    initial: reduce ? false : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay: d, ease: EASE },
  });
  const tag = "block font-display leading-none font-bold tracking-[0.18em] text-white uppercase [text-shadow:0_2px_14px_rgba(5,40,20,0.55)]";
  return (
    <div className={className} aria-hidden="true">
      <div className="relative inline-block" style={{ fontSize: size }}>
        <motion.span {...small(0.2)} className={`${tag} absolute left-[0.08em] bottom-[calc(100%-0.2em)]`} style={{ fontSize: "0.27em" }}>
          Taxi
        </motion.span>
        <div className="flex overflow-hidden font-display leading-[0.86] font-extrabold tracking-[-0.03em] text-soleil">
          {"GWADA".split("").map((l, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={reduce ? false : { y: "105%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1.1, delay: 0.25 + i * 0.09, ease: EASE }}
            >
              {l}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}

function HeroVince({ className, size }: { className: string; size: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      aria-hidden="true"
      className={`${className} font-display leading-none font-bold tracking-[0.18em] text-white uppercase [text-shadow:0_2px_14px_rgba(5,40,20,0.55)]`}
      style={{ fontSize: size }}
      initial={reduce ? false : { opacity: 0, x: -14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9, delay: 0.9, ease: EASE }}
    >
      Vince
    </motion.span>
  );
}

function Hero() {
  const ref = useHeroLock<HTMLElement>();
  const reduce = useReducedMotion();
  const fade = (d: number) => ({
    initial: reduce ? false : { opacity: 0, y: 26 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay: d, ease: EASE },
  });
  return (
    <section ref={ref} className="relative isolate min-h-[28rem] overflow-hidden bg-vert-900" style={{ height: "100vh" }}>
      {/* Même composition qu'à l'origine, avec le Duster de Vincent. */}
      <div className="hero-box hero-box-d hidden land:block">
        <img src="/img/hero-duster-d.webp" alt="Le Dacia Duster de Vincent garé sur une route côtière de Guadeloupe en fin d'après-midi" className="absolute inset-0 h-full w-full" fetchPriority="high" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,40,20,0.5)_0%,transparent_22%),linear-gradient(to_top,rgba(5,40,20,0.82)_0%,rgba(5,40,20,0.4)_32%,transparent_52%),linear-gradient(to_right,rgba(5,40,20,0.55)_0%,transparent_50%)]" />
        <GiantWord className="absolute left-[14%] bottom-[50%]" size="10cqw" />
        <img src="/img/hero-duster-d.webp" alt="" className="hero-duster-cutout-d absolute inset-0 h-full w-full" />
        <HeroVince className="absolute left-[80%] top-[54.5%]" size="2.7cqw" />
      </div>
      <div className="hero-box hero-box-m land:hidden">
        <img src="/img/hero-duster-m.webp" alt="Le Dacia Duster de Vincent sur une route bordée de cocotiers en Guadeloupe" className="absolute inset-0 h-full w-full" fetchPriority="high" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,40,20,0.84)_0%,rgba(5,40,20,0.66)_36%,transparent_56%),linear-gradient(to_top,rgba(5,40,20,0.45),transparent_22%)]" />
        <img src="/img/hero-duster-m.webp" alt="" className="hero-duster-cutout-m absolute inset-0 h-full w-full" />
        <GiantWordMobile className="absolute inset-x-0 bottom-[42%] flex justify-center" size="min(12.5cqw, 12vw)" />
      </div>

      <div className="relative z-10 mx-auto flex h-full max-w-[1320px] flex-col px-4 pt-24 sm:px-6 lg:px-8 land:justify-end land:pt-0 land:pb-[7vh]">
        <motion.p {...fade(0.2)} className="flex items-center gap-2 text-sm font-medium text-white/90">
          <span className="flex text-or">
            {Array.from({ length: 5 }).map((_, i) => (
              <Icon key={i} name="ph:star-fill" className="size-4" />
            ))}
          </span>
          <span className="tabular">5,0 sur Google · {site.reviewsCount} avis</span>
        </motion.p>
        <motion.h1 {...fade(0.35)} className="mt-3 max-w-[16ch] font-display text-[clamp(1.9rem,8vw,2.4rem)] font-bold text-white land:max-w-[15ch] land:text-[min(3.6vw,6.4vh)]" style={{ lineHeight: 1.02 }}>
          Votre taxi en Guadeloupe, <span className="text-soleil">à l&apos;heure, jour et nuit.</span>
        </motion.h1>
        <motion.div {...fade(0.65)} className="mt-6 flex flex-wrap gap-3">
          <Cta href="/reserver" className="h-12 pl-5 land:h-13 land:pl-6">
            <span className="land:hidden">Réserver</span>
            <span className="hidden land:inline">Réserver ma course</span>
          </Cta>
          <Cta href="/estimateur" variant="verre" icon="ph:calculator-bold" className="h-12 pl-5 land:h-13 land:pl-6">
            Estimer le prix
          </Cta>
        </motion.div>
      </div>
    </section>
  );
}

export function Home() {
  return (
    <>
      <Hero />
      <Checker />

      {/* MCP: "hover image reveal list" -> Hover Image List (21st.dev #28258), voir components/services-index.tsx */}
      <section className="relative overflow-hidden bg-creme py-16 sm:py-24">
        <div className="px-4">
          <SectionHead kicker="Services" kickerIcon="ph:steering-wheel-bold" title="Un taxi pour chaque trajet" mark="chaque" />
        </div>
        <ServicesIndex />
        <Reveal className="mt-10 flex justify-center px-4">
          <Cta href="/tarifs" variant="vert" className="w-full max-w-sm sm:w-auto">
            Voir tous les services et tarifs
          </Cta>
        </Reveal>
      </section>

      {/* Départs : grille de cartes simple (retour Tom 26/10, tableau à volets jugé trop original), voir components/departure-board.tsx */}
      <section className="relative overflow-hidden bg-vert-900 bg-cover bg-center py-16 text-creme sm:py-24" style={{ backgroundImage:"url(/img/texture-vert.webp)" }}>
        <div className="px-4">
          <SectionHead tone="sombre" kicker="Départs" kickerIcon="ph:paper-plane-tilt-bold" title="Vous atterrissez ? Votre taxi est prêt." mark="prêt" lead="Les trajets les plus demandés depuis l'aéroport, prix de jour indicatif." />
        </div>
        <div className="px-3">
          <DepartureBoard />
        </div>
        <Reveal className="mt-10 flex justify-center px-4">
          <Cta href="/estimateur" icon="ph:calculator-bold" className="w-full max-w-sm sm:w-auto">
            Estimer ma course
          </Cta>
        </Reveal>
      </section>

      {/* MCP: "timeline steps" -> Vertical How It Works Timeline (21st.dev #26902), voir components/road-steps.tsx */}
      <section className="grain relative bg-creme py-16 sm:py-24">
        <div className="px-4">
          <SectionHead kicker="Réservation" kickerIcon="ph:calendar-blank-bold" title="Réserver prend 2 minutes" mark="2 minutes" />
        </div>
        <RoadSteps />
        <Reveal className="mt-14 flex justify-center px-4">
          <Cta href="/reserver" variant="vert" className="w-full max-w-sm sm:w-auto">
            Réserver en ligne
          </Cta>
        </Reveal>
      </section>

      {/* INSPIRATION: INSPIRATIONS-READ.md idée 7 (PSP parallax.tsx, ouverture en rideau) + cadre photo Lipoluxe */}
      <section className="relative overflow-hidden bg-menthe py-16 sm:py-24">
        <div className="mx-auto grid max-w-[1240px] items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <div className="relative">
            <motion.div
              initial={{ clipPath: "inset(12% 12% 12% 12% round 32px)" }}
              whileInView={{ clipPath: "inset(0% 0% 0% 0% round 32px)" }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.2, ease: EASE }}
              className="aspect-[4/3] overflow-hidden"
            >
              <img src="/img/interieur-duster.webp" alt="Vincent au volant de son Dacia Duster, vu depuis la place passager" className="h-full w-full object-cover" />
            </motion.div>
            <Reveal dir="scale" delay={0.6} className="absolute -bottom-6 left-4 sm:left-8">
              {/* Logos fournis par Vincent (16/11/2026) : Association Taxi Gwadloup et UNT Guadeloupe, affichés en petit. */}
              <div className="flex items-center gap-2.5 rounded-[22px] bg-white py-2 pr-4 pl-2 shadow-[0_18px_40px_-20px_rgba(0,0,0,0.45)] sm:gap-3 sm:pr-5">
                <img src="/img/membres/association-taxi-gwadloup.png" alt="Logo de l'association Taxi Gwadloup" className="size-11 shrink-0 rounded-full sm:size-12" />
                <img src="/img/membres/unt-guadeloupe.png" alt="Logo de l'Union nationale des taxis (UNT)" className="h-9 w-auto shrink-0 sm:h-10" />
                <span className="text-[0.74rem] leading-tight font-semibold text-vert-900 sm:text-sm">
                  Membre de l&apos;Association
                  <br />
                  des Taxis et de l&apos;UNT
                </span>
              </div>
            </Reveal>
          </div>
          <div className="text-center lg:text-left">
            <Reveal>
              <Kicker icon="ph:steering-wheel-bold">Votre chauffeur</Kicker>
            </Reveal>
            <Title text="Vincent, alias Gwada Vince" mark="Gwada Vince" center={false} className="mt-5 lg:mx-0" />
            <Reveal delay={0.1}>
              <p className="mx-auto mt-5 max-w-xl text-[1.05rem] leading-relaxed text-gris lg:mx-0">
                « Passionné de voyages et de rencontres, je vous fais découvrir la Guadeloupe autrement. Chaque trajet doit être sûr, confortable et à l&apos;heure. »
              </p>
            </Reveal>
            <ul className="mx-auto mt-8 grid max-w-xl gap-3 text-left sm:grid-cols-2 lg:mx-0">
              {[
                { i: "ph:clock-countdown-bold", t: "Ponctuel, même à 5\u00a0h du matin" },
                { i: "ph:shield-check-bold", t: "Véhicule entretenu et confortable" },
                { i: "ph:credit-card-bold", t: "Carte ou espèces, reçu remis" },
                { i: "ph:whatsapp", t: "Confirmation et suivi par WhatsApp" },
              ].map((x, k) => (
                <Reveal key={x.t} delay={0.1 + k * 0.08}>
                  <li className="flex items-center gap-3 rounded-[16px] bg-white/70 px-4 py-3 font-medium text-vert-900">
                    <Icon name={x.i === "ph:whatsapp" ? "si:whatsapp" : x.i} className="size-5 text-vert" />
                    {x.t}
                  </li>
                </Reveal>
              ))}
            </ul>
            <Reveal delay={0.3} className="mt-9 flex justify-center lg:justify-start">
              <Cta href="/equipe" variant="vert">
                Rencontrer Vincent
              </Cta>
            </Reveal>
          </div>
        </div>
      </section>

      {/* MCP: "testimonials marquee" -> Testimonials Marquee (21st.dev #19852), voir components/reviews-marquee.tsx */}
      <section className="relative overflow-hidden bg-vert-900 bg-cover bg-center py-14 text-creme sm:py-20" style={{ backgroundImage:"linear-gradient(rgba(5,40,20,0.8),rgba(5,40,20,0.74)),url(/img/champs.webp)" }}>
        <div className="mx-auto max-w-3xl px-4 text-center">
          <Reveal>
            <Kicker tone="sombre" icon="ph:star-fill">
              Avis Google
            </Kicker>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 font-sans text-[clamp(3rem,7vw,4.5rem)] leading-none font-bold text-soleil tabular">5,0</p>
          </Reveal>
          <Title tone="sombre" text="80 voyageurs le recommandent" mark="recommandent" className="mt-3 text-[clamp(1.7rem,3.6vw,2.6rem)]" />
        </div>
        <ReviewsMarquee rows={1} />
        <Reveal className="mt-8 flex justify-center px-4">
          <Cta href={site.googleReviewsUrl} variant="or" icon="ph:arrow-up-right-bold" className="w-full max-w-sm sm:w-auto">
            Voir nos avis Google
          </Cta>
        </Reveal>
      </section>

      {/* MCP: "faq accordion" -> Accordion (21st.dev #23530), voir components/faq-list.tsx */}
      <section className="relative bg-creme py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4">
          <SectionHead kicker="Questions" kickerIcon="ph:info-bold" title="Vos questions, nos réponses" mark="réponses" />
          <Reveal className="mt-12">
            <FaqList items={faq.slice(0, 6)} />
          </Reveal>
          <Reveal className="mt-10 flex flex-wrap justify-center gap-3">
            <Cta href="/faq" variant="vert" className="w-full max-w-sm sm:w-auto">
              Toutes les questions
            </Cta>
            <Cta href={whatsappLink("Bonjour Vincent, j'ai une question sur une course :")} variant="ligne" icon="si:whatsapp" className="w-full max-w-sm sm:w-auto">
              Poser ma question
            </Cta>
          </Reveal>
        </div>
      </section>

      {/* INSPIRATION: INSPIRATIONS-READ.md idée 9 (Yohan Berger cta-final.tsx, carte posée sur photo) */}
      <section className="relative bg-creme px-4 pb-24 sm:px-6 lg:px-8">
        <Reveal dir="scale" className="mx-auto max-w-[1280px]">
          <div className="relative isolate overflow-hidden rounded-[32px] bg-vert-900 bg-cover bg-center px-6 py-16 sm:px-14 sm:py-24" style={{ backgroundImage:"linear-gradient(90deg,rgba(5,40,20,0.82) 0%,rgba(5,40,20,0.5) 55%,rgba(5,40,20,0.15) 100%),url(/img/route-soir.webp)" }}>
            <div className="max-w-xl text-center sm:text-left">
              <Title tone="sombre" text={"Une course à prévoir\u00a0?"} mark="course" center={false} className="sm:mx-0" />
              <Lead tone="sombre" className="sm:mx-0 sm:text-left">
                Envoyez votre demande et convenez de votre trajet avec Vincent. De jour comme de nuit.
              </Lead>
              <div className="mt-8 flex justify-center sm:justify-start">
                <Cta href="/reserver">Réserver ma course</Cta>
              </div>
            </div>
            <div className="mt-14 flex flex-col items-center gap-3 border-t border-white/15 pt-6 text-sm text-creme/85 sm:flex-row sm:flex-wrap sm:gap-8">
              <a href={site.phoneHref} className="inline-flex min-h-11 items-center gap-2 font-semibold text-white tabular">
                <Icon name="ph:phone-bold" className="size-4 text-or" /> {site.phoneDisplay}
              </a>
              <a href={site.whatsapp} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 font-semibold text-white">
                <Icon name="si:whatsapp" className="size-4 text-or" /> WhatsApp
              </a>
              <span className="inline-flex items-center gap-2">
                <Icon name="ph:clock-bold" className="size-4 text-or" /> 24h/24, 7j/7 · Le Gosier, Guadeloupe
              </span>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
