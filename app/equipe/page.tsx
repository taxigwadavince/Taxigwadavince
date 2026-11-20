import type { Metadata } from "next";
import Link from "next/link";
import { SectionHead, Reveal, Title } from "@/components/ui";
import { DriverHero } from "@/components/driver-hero";
import { DriverServices } from "@/components/driver-services";
import { DriverOffice } from "@/components/driver-office";
import { ReviewQuotes } from "@/components/review-quotes";
import { Values } from "@/components/values";
import { Icon } from "@/components/icons";
import { DEFAULT_DRIVER_CARD_STYLE, isDriverCardStyle } from "@/lib/driver-card-styles";
import { cmsServeur } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Vincent, votre chauffeur de taxi de confiance en Guadeloupe",
  description: "Vincent, alias Gwada Vince, chauffeur de taxi basé au Gosier, membre de l'Association des Taxis de la Guadeloupe. Disponible 24h/24, 7j/7, noté 5,0 sur Google.",
  alternates: { canonical: "/equipe" },
};

export default async function Page({ searchParams }: { searchParams: Promise<{ carte?: string | string[] }> }) {
  await cmsServeur();
  const { carte } = await searchParams;
  const preview = isDriverCardStyle(carte);
  const cardStyle = isDriverCardStyle(carte) ? carte : DEFAULT_DRIVER_CARD_STYLE;
  return (
    <>
      <DriverHero cardStyle={cardStyle} preview={preview} />

      {/* Qui suis-je : texte, bouton et association à gauche, photo réelle du taxi à droite dans un cadre or décalé.
          Sur mobile, le bouton passe sous la photo. */}
      <section className="bg-creme py-16 sm:py-24">
        <div className="mx-auto grid max-w-[1280px] px-4 sm:px-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:grid-rows-[1fr_auto_auto_auto_1fr] lg:gap-x-14 lg:px-8">
          <div className="lg:col-start-1 lg:row-start-2">
            <Reveal>
              <span className="inline-flex rounded-full bg-vert px-4 py-2 text-[0.82rem] font-bold tracking-wide text-creme uppercase sm:text-[0.9rem]">Qui suis-je</span>
            </Reveal>
            <Title text="Moi, c'est Vince." mark="Vince" center={false} className="mt-6 text-[clamp(2.7rem,5.6vw,5rem)] [&_.text-vert]:text-vert-900" />
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-[30rem] text-[1.12rem] leading-relaxed text-vert-900 sm:text-[1.3rem]">
                Vincent, mais tout le monde m&apos;appelle Vince. De la Basse-Terre à la Grande-Terre, je vous accompagne avec bonne humeur et une vraie connaissance de l&apos;île.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="mt-7 lg:col-start-1 lg:row-start-4">
            <div className="flex flex-wrap items-center gap-3 text-[0.98rem] text-vert-900">
              <img src="/img/membres/association-taxi-gwadloup.png" alt="Logo de l'association Taxi Gwadloup" className="size-12 shrink-0 rounded-full" />
              <img src="/img/membres/unt-guadeloupe.png" alt="Logo de l'Union nationale des taxis (UNT)" className="h-10 w-auto shrink-0 rounded-md" />
              <p className="basis-full sm:flex-1 sm:basis-auto">Membre de l&apos;Association des Taxis de la Guadeloupe et de l&apos;Union nationale des taxis</p>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="order-last mt-8 lg:order-none lg:col-start-1 lg:row-start-3">
            <Link href="/reserver" className="group flex w-full items-center justify-center gap-3 rounded-full bg-or px-8 py-4 text-[1.1rem] font-bold text-vert-900 shadow-[0_14px_30px_-16px_rgba(184,147,10,0.9)] transition-colors hover:bg-soleil sm:inline-flex sm:w-auto sm:px-9 sm:text-[1.25rem]">
              Réserver avec Vince
              <Icon name="ph:arrow-right-bold" className="size-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>

          <Reveal dir="right" className="mt-12 lg:col-start-2 lg:row-span-5 lg:row-start-1 lg:mt-0 lg:self-center">
            <div className="relative pt-5 pr-5 sm:pt-6 sm:pr-6">
              <span aria-hidden="true" className="absolute top-0 right-0 bottom-10 left-14 rounded-[30px] border-2 border-or" />
              <img src="/img/vrai3.jpeg" alt="Le Dacia Duster blanc de Taxi Gwada Vince" className="relative aspect-[3/2] w-full rounded-[28px] object-cover shadow-[0_30px_60px_-35px_rgba(5,40,20,0.5)]" />
            </div>
            <p className="mt-4 flex items-center gap-2 text-[1.05rem] text-vert-900 italic">
              <Icon name="ph:map-pin-fill" className="size-5 text-or" /> Votre taxi en Guadeloupe
            </p>
          </Reveal>
        </div>
      </section>

      <section className="relative bg-vert-900 bg-cover bg-center py-20 text-creme sm:py-28" style={{ backgroundImage:"url(/img/texture-vert.webp)" }}>
        <div className="px-4 text-center">
          <Reveal>
            <span className="inline-flex rounded-full bg-or px-5 py-2 text-[0.82rem] font-bold tracking-[0.08em] text-vert-900 uppercase sm:text-[0.95rem]">Nos engagements</span>
          </Reveal>
          {/* Espace insécable : « Gwada Vince » forme un seul mot clé, souligné d'un trait continu. */}
          <Title text={"Pourquoi choisir Gwada Vince ?"} mark={"Gwada Vince"} tone="sombre" className="mt-6 text-[clamp(2.3rem,5vw,4.2rem)]" />
        </div>
        <Values />
        <Reveal className="mt-12 flex justify-center px-4">
          <Link href="/reserver" className="group inline-flex items-center gap-3 rounded-full bg-or px-8 py-4 text-[1.1rem] font-bold text-vert-900 shadow-[0_14px_30px_-16px_rgba(0,0,0,0.6)] transition-colors hover:bg-soleil sm:px-9 sm:text-[1.2rem]">
            Réserver ma course
            <Icon name="ph:arrow-right-bold" className="size-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </section>

      <DriverServices />

      {/* Avis : citations Google en carrousel, bouton vers la fiche Google (components/review-quotes.tsx) */}
      <section className="relative overflow-hidden bg-vert py-20 text-creme sm:py-24">
        <div className="px-4">
          <SectionHead tone="sombre" kicker="Ils en parlent" kickerIcon="ph:star-fill" title="Ce que disent les voyageurs" mark="voyageurs" />
        </div>
        <ReviewQuotes />
      </section>

      <section className="overflow-hidden bg-creme py-16 sm:py-24">
        <DriverOffice />
      </section>

    </>
  );
}
