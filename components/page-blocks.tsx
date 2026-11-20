"use client";

// INSPIRATION: premiere-version-site/templates/lipolux-v1/components/page-blocks.tsx (en-tête de page sur photo,
// titre sur une ligne, sans fil d'Ariane) et carte CTA finale posée sur photo (Yohan Berger cta-final.tsx).
import { motion, useReducedMotion } from "motion/react";
import { Button, Lead, Reveal, Title } from "./ui";
import { Icon } from "./icons";
import { site } from "@/lib/site";
import { EASE } from "@/lib/utils";

export function PageHero({ title, mark, lead, img, kicker }: { title: string; mark?: string; lead: string; img: string; kicker: string }) {
  const reduce = useReducedMotion();
  return (
    <section className="relative isolate overflow-hidden bg-vert-900 pt-36 pb-20 text-center sm:pt-44 sm:pb-28">
      <img src={img} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(5,40,20,0.78)_0%,rgba(5,40,20,0.6)_60%,rgba(5,40,20,0.8)_100%)]" />
      <div className="mx-auto max-w-4xl px-4">
        <motion.p initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }} className="text-sm font-semibold tracking-[0.2em] text-soleil uppercase">
          {kicker}
        </motion.p>
        <Title as="h1" text={title} mark={mark} tone="sombre" className="mt-4 text-[clamp(2.1rem,5.4vw,4rem)]" />
        <Lead tone="sombre">{lead}</Lead>
      </div>
    </section>
  );
}

export function CtaCard({ title, mark, text, href = "/reserver", label = "Réserver ma course", img = "/img/route-soir.webp" }: { title: string; mark?: string; text: string; href?: string; label?: string; img?: string }) {
  return (
    <>
      <section className="relative z-10 bg-creme px-4 pt-20 sm:px-6 lg:px-8 -mb-[140px] sm:-mb-[170px] lg:-mb-[190px]">
        <Reveal dir="scale" className="mx-auto max-w-[1280px]">
          <div className="relative isolate overflow-hidden rounded-[32px] bg-vert-900 bg-cover bg-center px-6 py-16 text-center shadow-[0_40px_80px_-30px_rgba(5,40,20,0.55)] sm:px-14 sm:py-20" style={{ backgroundImage:`linear-gradient(rgba(5,40,20,0.78),rgba(5,40,20,0.7)),url(${img})` }}>
            <Title tone="sombre" text={title} mark={mark} />
            <Lead tone="sombre">{text}</Lead>
            <div className="mt-8 flex justify-center">
              <Button href={href}>{label}</Button>
            </div>
            <p className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-creme/85">
              <a href={site.phoneHref} className="inline-flex min-h-11 items-center gap-2 font-semibold text-white tabular">
                <Icon name="ph:phone-bold" className="size-4 text-or" /> {site.phoneDisplay}
              </a>
              <span className="inline-flex items-center gap-2">
                <Icon name="ph:clock-bold" className="size-4 text-or" /> 24h/24, 7j/7
              </span>
            </p>
          </div>
        </Reveal>
      </section>
      {/* Réserve la place prise par la carte qui chevauche le footer suivant, pour que son contenu ne remonte pas dessous. */}
      <div aria-hidden="true" className="h-[140px] sm:h-[170px] lg:h-[190px]" />
    </>
  );
}
