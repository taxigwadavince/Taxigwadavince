import type { Metadata } from "next";
import Link from "next/link";
import { DriverCard } from "@/components/driver-card";
import { Icon } from "@/components/icons";
import { driverCardStyles } from "@/lib/driver-card-styles";

export const metadata: Metadata = {
  title: "Quatre styles de carte chauffeur — Aperçu",
  robots: { index: false, follow: false },
};

export default function DriverCardsPreview() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#082d1b] px-4 pt-32 pb-28 text-creme sm:px-6 sm:pt-40 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(218,178,17,0.12),transparent_60%)]" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1240px]">
        <header className="max-w-3xl">
          <Link href="/equipe" className="inline-flex items-center gap-2 text-xs text-creme/70 transition-colors hover:text-soleil"><Icon name="ph:arrow-left-bold" className="size-4" /> Retour à la page chauffeur</Link>
          <p className="mt-9 text-xs font-semibold tracking-[0.2em] text-soleil uppercase">Gwada Vince · Étude de styles</p>
          <h1 className="mt-4 font-display text-[clamp(2rem,5vw,4rem)] font-bold leading-[1.05]">Un chauffeur.<br />Quatre façons de le présenter.</h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-creme/70 sm:text-base">Même portrait, mêmes informations, quatre personnalités. Ouvrez une carte pour la découvrir dans la page « Votre chauffeur ».</p>
          <p className="mt-3 text-xs leading-relaxed text-creme/50">Le portrait est une illustration générée par IA pour cette maquette. Il pourra être remplacé par une photo de Vincent.</p>
        </header>

        <div className="mt-12 grid gap-x-12 gap-y-14 lg:grid-cols-2 lg:gap-y-16" data-card-gallery>
          {driverCardStyles.map((style) => (
            <section key={style.id} aria-labelledby={`style-${style.id}`} className="min-w-0">
              <div className="mb-6 flex items-center gap-4 border-b border-white/15 pb-5">
                <span className="font-sans text-sm text-soleil/70">{style.number}</span>
                <h2 id={`style-${style.id}`} className="font-display text-2xl font-semibold">{style.name}</h2>
              </div>
              <div className="flex items-center rounded-[28px] border border-white/5 bg-white/[0.035] px-3 py-8 sm:px-6 lg:min-h-[440px]">
                <DriverCard variant={style.id} />
              </div>
              <p className="mt-5 max-w-[46ch] text-sm leading-relaxed text-creme/65">{style.description}</p>
              <Link href={`/equipe?carte=${style.id}`} className="mt-4 inline-flex min-h-11 items-center gap-3 rounded-full border border-soleil/35 px-5 py-2.5 text-xs font-semibold text-soleil transition-colors hover:bg-soleil hover:text-vert-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-soleil">
                Voir dans la page <Icon name="ph:arrow-up-right-bold" className="size-4" />
              </Link>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
