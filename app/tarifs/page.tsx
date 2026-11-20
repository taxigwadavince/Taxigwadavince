import type { Metadata } from "next";
import { TarifsHero } from "@/components/tarifs-hero";
import { Taximeter } from "@/components/taximeter";
import { ServiceShowcase } from "@/components/service-showcase";
import { TariffPanels } from "@/components/tariff-panels";
import { RouteCards } from "@/components/route-cards";
import { SectionHead, Reveal, Button, Kicker, Title } from "@/components/ui";
import { Icon } from "@/components/icons";
import { cmsServeur } from "@/lib/cms";
import { tarifsPage as t } from "@/lib/textes";

export const metadata: Metadata = {
  title: "Tarifs et services du taxi en Guadeloupe",
  description: "Navette aéroport Maryse Condé, gare maritime de Bergevin, escales de croisière, excursions, courses de nuit : services et tarifs de Taxi Gwada Vince.",
  alternates: { canonical: "/tarifs" },
};

export default async function Page() {
  await cmsServeur();
  return (
    <>
      <TarifsHero />

      <section id="services" aria-label="Les services de Vincent" className="scroll-mt-20 bg-creme py-16 sm:py-24">
        <div className="px-4">
          <SectionHead kicker="Services" kickerIcon="ph:steering-wheel-bold" title={t.servicesTitre} mark={t.servicesMot} />
        </div>
        <ServiceShowcase />
      </section>

      {/* INSPIRATION: Yohan Berger tarifs-services.tsx, voir components/tariff-panels.tsx */}
      <section id="grille" className="relative scroll-mt-20 bg-menthe bg-cover bg-center py-16 sm:py-24" style={{ backgroundImage:"url(/img/texture-menthe.webp)" }}>
        <div className="px-4">
          <SectionHead kicker="Grille tarifaire" kickerIcon="ph:receipt-bold" title={t.grilleTitre} mark={t.grilleMot} lead={t.grilleIntro} />
        </div>
        <TariffPanels />
        <Reveal className="mt-10 px-4" inner="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <p className="inline-flex items-center gap-2 text-sm font-medium text-vert-900">
            <Icon name="ph:credit-card-bold" className="size-5 text-vert" /> {t.paiement}
          </p>
          <Button href="/estimateur" variant="vert" icon="ph:calculator-bold">
            Estimer mon trajet
          </Button>
        </Reveal>
      </section>

      <section className="relative overflow-hidden bg-vert-900 bg-cover bg-center py-20 text-creme sm:py-28" style={{ backgroundImage:"url(/img/texture-vert.webp)" }}>
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Reveal>
              <Kicker icon="ph:map-pin-fill" tone="sombre" className="px-4 py-2 text-[0.9rem]">Exemples</Kicker>
            </Reveal>
            <Title text={t.exemplesTitre} mark={t.exemplesMot} tone="sombre" className="mt-5 text-[clamp(2.1rem,5vw,3.6rem)]" />
          </div>
          <RouteCards />
        </div>
      </section>

      <Taximeter />
    </>
  );
}
