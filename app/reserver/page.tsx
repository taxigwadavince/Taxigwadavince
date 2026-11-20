import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingForm } from "@/components/booking-form";
import { PageHero } from "@/components/page-blocks";
import { WaysToBook } from "@/components/ways-to-book";

export const metadata: Metadata = {
  title: "Réserver un taxi en Guadeloupe en ligne",
  description: "Réservez votre taxi en Guadeloupe en 4 étapes : trajet, options, coordonnées, récapitulatif. Aéroport, ports, hôtels, excursions, 24h/24.",
  alternates: { canonical: "/reserver" },
};

export default function Page() {
  return (
    <>
      <PageHero kicker="Réservation" title="Réservez votre course" mark="course" lead="Quatre étapes, aucun paiement en ligne : Vincent confirme votre prise en charge." img="/img/aeroport.webp" />

      {/* MCP: "booking form multi step" -> Multi-Step Form (21st.dev #8281), voir components/booking-form.tsx */}
      <section className="relative -mt-10 pb-20 sm:pb-28">
        <Suspense>
          <BookingForm />
        </Suspense>
      </section>

      <WaysToBook />
    </>
  );
}
