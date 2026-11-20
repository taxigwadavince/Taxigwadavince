import type { Metadata } from "next";
import { Suspense } from "react";
import { Estimator } from "@/components/estimator";
import { PageHero } from "@/components/page-blocks";
import { EstimatorTicket } from "@/components/estimator-ticket";
import { RouteTable } from "@/components/route-table";
import { SectionHead } from "@/components/ui";

export const metadata: Metadata = {
  title: "Estimer le prix d'une course de taxi en Guadeloupe",
  description: "Estimez votre trajet de taxi en Guadeloupe : forfait aéroport–Bergevin, tarifs de jour, de nuit, dimanches et jours fériés. Prix à confirmer avec Vincent.",
  alternates: { canonical: "/estimateur" },
};

export default function Page() {
  return (
    <>
      <PageHero kicker="Estimateur de course" title="Combien coûte votre trajet ?" mark="trajet" lead="Départ, arrivée, date et heure : visualisez votre trajet et son prix indicatif, à confirmer avec Vincent." img="/img/champs.webp" />

      {/* MCP: "price calculator" -> Volume Pricing Card (21st.dev #28176), voir components/estimator.tsx */}
      <section className="relative -mt-10 pb-20 sm:pb-28">
        <Suspense>
          <Estimator />
        </Suspense>
      </section>

      {/* MCP: "price calculator" -> ROI Pricing Calculator (21st.dev #27098) : tableau de repères, lecture directe */}
      <section className="relative bg-vert-900 bg-cover bg-center py-20 text-creme sm:py-28" style={{ backgroundImage:"url(/img/texture-vert.webp)" }}>
        <div className="px-4">
          <SectionHead tone="sombre" kicker="Repères" kickerIcon="ph:receipt-bold" title="Les trajets les plus demandés" mark="demandés" lead="Depuis l'aéroport Maryse Condé, en tarif de jour et de nuit." />
        </div>
        <RouteTable />
      </section>

      <EstimatorTicket />
    </>
  );
}
