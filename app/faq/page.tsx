import type { Metadata } from "next";
import { Checker } from "@/components/checker";
import { FaqExplorer } from "@/components/faq-explorer";
import { Glyph, Icon } from "@/components/icons";
import { Button, Kicker, Reveal, Title } from "@/components/ui";
import { faqSections } from "@/lib/faq";
import { site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Questions fréquentes : votre taxi en Guadeloupe",
  description: "Réservation, transfert aéroport, bagages, tarifs et paiement : les réponses de Taxi Gwada Vince pour préparer votre trajet en Guadeloupe l’esprit léger.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "L’esprit léger, avant de partir | Taxi Gwada Vince",
    description: "Le carnet de route : toutes vos questions sur les trajets en taxi avec Vincent en Guadeloupe.",
    url: "/faq",
    images: [{ url: "/og-duster.jpg", width: 1200, height: 630, alt: "Taxi Gwada Vince en Guadeloupe" }],
  },
};

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${site.url}/faq#questions`,
    mainEntity: faqSections.flatMap((section) => section.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    }))),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      {/* Sur téléphone, la section tient exactement sur l'écran, entre la navigation (72 px) et le bouton flottant
          « Réserver ma course » (70 px) : la photo prend la hauteur restante, le ticket jaune est masqué
          et « Trouver ma réponse » passe sous la photo. */}
      <section className="relative isolate flex h-[var(--ecran-h,100svh)] min-h-[580px] flex-col overflow-hidden bg-vert-900 px-4 pt-[88px] pb-[92px] text-creme sm:block sm:h-auto sm:min-h-0 sm:px-6 sm:pt-40 sm:pb-20 lg:px-8">
        <img src="/img/texture-vert.webp" alt="" className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover opacity-45" />
        <div className="mx-auto flex min-h-0 w-full max-w-[1200px] flex-1 flex-col justify-center gap-5 sm:grid sm:items-center sm:justify-normal sm:gap-12 lg:grid-cols-[1.15fr_1fr] lg:grid-rows-[1fr_auto_auto_1fr] lg:gap-x-16 lg:gap-y-0">
          <div className="lg:col-start-1 lg:row-start-2">
            <Reveal><Kicker tone="sombre" icon="ph:path-bold">Le carnet de route · FAQ</Kicker></Reveal>
            <Title as="h1" text="L’esprit léger, avant de partir." mark="léger" tone="sombre" center={false} className="mt-4 max-w-[13ch] text-[clamp(2.1rem,9.6vw,2.7rem)] sm:mt-6 sm:text-[clamp(2.7rem,5vw,4.7rem)]" />
            <Reveal delay={0.1}>
              <p className="mt-3 max-w-md text-[0.98rem] leading-relaxed text-creme/80 sm:mt-5 sm:text-[1.05rem]">Un vol à prendre, une valise en plus, un horaire qui change… On fait le tour de vos questions avant de prendre la route.</p>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="order-last lg:order-none lg:col-start-1 lg:row-start-3 lg:mt-7">
            <a href="#questions" className="group inline-flex min-h-12 items-center gap-3 text-sm font-semibold text-soleil">
              <span className="grid size-10 place-items-center rounded-full border border-soleil/40 transition-colors group-hover:bg-soleil group-hover:text-vert-900"><Icon name="ph:caret-down-bold" className="size-4" /></span>
              Trouver ma réponse
            </a>
          </Reveal>

          <Reveal dir="right" delay={0.15} className="relative mx-auto flex max-h-[440px] min-h-[150px] w-full max-w-lg flex-1 flex-col sm:block sm:max-h-none sm:min-h-0 sm:flex-none lg:col-start-2 lg:row-span-4 lg:row-start-1 lg:pl-3" inner="flex min-h-0 flex-1 flex-col sm:block">
            <figure className="relative flex min-h-0 flex-1 rotate-2 flex-col rounded-[24px] bg-creme p-3 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.4)] sm:block sm:p-4">
              <div className="relative min-h-0 flex-1 overflow-hidden rounded-[14px]">
                <img src="/img/route-soir.webp" alt="Une route de Guadeloupe à la lumière du soir" width={960} height={720} fetchPriority="high" className="absolute inset-0 size-full object-cover sm:static sm:aspect-[4/3] sm:h-auto" />
              </div>
              <figcaption className="absolute top-6 left-6 flex items-center gap-2 rounded-full bg-creme px-3 py-2 text-[0.65rem] font-semibold tracking-[0.13em] text-vert uppercase sm:top-8 sm:left-8">
                <Icon name="ph:map-pin-fill" className="size-4" />
                <span>971 · Guadeloupe</span>
              </figcaption>
            </figure>
            <div className="ticket-edge relative z-10 -mt-4 mr-6 -ml-2 -rotate-3 bg-soleil px-5 py-5 text-vert-900 max-sm:hidden sm:mr-14 sm:-ml-6 sm:px-6">
              <div className="flex items-center justify-between gap-4 border-b border-dashed border-vert/30 pb-3">
                <span className="text-xs font-semibold tracking-[0.16em] uppercase">Le mémo du départ</span>
                <Glyph name="car" className="h-7 w-10" />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3">
                <div><p className="text-lg font-bold tabular">24h/24</p><p className="mt-1 text-[0.65rem] text-vert">Jour & nuit</p></div>
                <div><p className="text-lg font-bold tabular">4 places</p><p className="mt-1 text-[0.65rem] text-vert">Côté passagers</p></div>
                <div><Icon name="ph:credit-card-bold" className="h-7 w-6" /><p className="mt-1 text-[0.65rem] text-vert">Paiement à bord</p></div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
      <Checker size={8} />

      <FaqExplorer />

      <section className="relative overflow-hidden bg-menthe px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
          <div>
            <Reveal><Kicker icon="si:whatsapp">En direct avec Vincent</Kicker></Reveal>
            <Title text="Et si on en parlait ?" mark="parlait" center={false} className="mt-5 max-w-lg" />
            <Reveal delay={0.1}><p className="mt-5 max-w-lg leading-relaxed text-gris">Chaque voyage a ses petits détails. Un trajet particulier, un besoin à préciser : envoyez un message à votre chauffeur.</p></Reveal>
            <Reveal delay={0.15} className="mt-7">
              <Button href={whatsappLink("Bonjour Vincent, j’ai une question pour préparer mon trajet en Guadeloupe :")} variant="vert" icon="si:whatsapp">Écrire à Vincent</Button>
              <a href={site.phoneHref} className="mt-4 flex min-h-11 w-fit items-center gap-2 text-sm font-medium text-vert underline-offset-4 hover:underline"><Icon name="ph:phone-bold" className="size-4" /> Ou appeler le <span className="tabular">{site.phoneDisplay}</span></a>
            </Reveal>
          </div>
          <Reveal dir="right">
            <div className="ticket-edge bg-creme p-6 sm:p-8">
              <p className="text-xs font-semibold tracking-[0.16em] text-gris uppercase">La suite du voyage</p>
              <p className="mt-3 font-display text-3xl font-bold text-vert-900">Tout est clair ?<br />On peut y aller.</p>
              <div className="my-6 flex items-center gap-3 text-vert" aria-hidden="true"><span className="size-3 rounded-full border-2 border-vert" /><span className="flex-1 border-t-2 border-dashed border-vert/25" /><Glyph name="car" className="size-9" /><span className="flex-1 border-t-2 border-dashed border-vert/25" /><Icon name="ph:map-pin-fill" className="size-5" /></div>
              <Button href="/estimateur" variant="vert" icon="ph:calculator-bold" className="w-full">Estimer ma course</Button>
              <a href="/reserver" className="mt-3 flex min-h-12 items-center justify-center gap-2 text-sm font-semibold text-vert underline-offset-4 hover:underline">J’ai déjà mon trajet, je réserve <Icon name="ph:arrow-right-bold" className="size-4" /></a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
