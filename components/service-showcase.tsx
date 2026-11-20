"use client";

import { useState } from "react";
import Image from "next/image";
import { services, type Service } from "@/lib/content";
import { whatsappLink } from "@/lib/site";
import { TARIFS } from "@/lib/tarifs";
import { cn, euro } from "@/lib/utils";
import { Glyph, Icon } from "./icons";
import { ServiceDialog } from "./service-dialog";

type ServiceCard = {
  image: string;
  imagePosition: string;
  title: string;
  caption: string;
  href: string;
  action: string;
  description: string;
  highlights: string[];
  layout?: string;
};

const cards: Record<string, ServiceCard> = {
  aeroport: {
    image: "/img/services/aeroport.webp",
    imagePosition: "62% 45%",
    title: "Navette aéroport",
    caption: "Du terminal à votre hôtel.",
    href: "/estimateur?from=aeroport",
    action: "Estimer mon transfert",
    description: "Rejoignez votre hôtel, votre gîte ou le port depuis l’aéroport Pôle Caraïbes. Vincent assure aussi le trajet vers l’aéroport : convenez ensemble de votre horaire et du point de rendez-vous.",
    highlights: ["Transferts vers et depuis l’aéroport", "Numéro de vol à préciser"],
    layout: "lg:col-span-2 lg:row-span-2",
  },
  bergevin: {
    image: "/img/services/bergevin.webp",
    imagePosition: "55% 45%",
    title: "Bergevin",
    caption: "Votre liaison vers les îles.",
    href: "/estimateur?to=bergevin",
    action: "Estimer ma correspondance",
    description: "Rejoignez la gare maritime de Bergevin depuis l’aéroport ou votre hébergement. Vincent organise votre prise en charge en fonction de l’heure de départ de votre ferry.",
    highlights: [`Forfait aéroport ↔ Bergevin : ${euro(TARIFS.forfaitAeroportBergevin)}`, "Horaire du bateau à communiquer"],
  },
  croisiere: {
    image: "/img/services/croisiere.webp",
    imagePosition: "58% 40%",
    title: "Croisières",
    caption: "Profitez de votre escale.",
    href: whatsappLink("Bonjour Vincent, je souhaite organiser une escale de croisière. Ma date et mes horaires :"),
    action: "Organiser mon escale sur WhatsApp",
    description: "Découvrez la Guadeloupe pendant votre escale à Pointe-à-Pitre. Préparez votre programme avec Vincent selon vos envies et le temps disponible avant le retour à bord.",
    highlights: ["Programme à convenir ensemble", "Retour adapté aux horaires du navire"],
  },
  excursion: {
    image: "/img/services/excursion.webp",
    imagePosition: "52% 22%",
    title: "Excursions",
    caption: "La Guadeloupe à votre rythme.",
    href: whatsappLink("Bonjour Vincent, j’aimerais préparer une excursion en Guadeloupe. Ma date et mes envies :"),
    action: "Préparer mon excursion sur WhatsApp",
    description: "Deshaies, les chutes du Carbet, la Pointe des Châteaux… Composez votre journée avec un chauffeur qui connaît l’île. Partagez vos envies, Vincent vous aide à préparer l’itinéraire.",
    highlights: ["Basse-Terre et Grande-Terre", "Itinéraire et estimation à convenir"],
    layout: "lg:col-span-2",
  },
  nuit: {
    image: "/img/services/nuit-duster.webp",
    imagePosition: "58% 45%",
    title: "Courses de nuit",
    caption: "On roule, même tard.",
    href: "/estimateur",
    action: "Estimer ma course de nuit",
    description: "Un retour de soirée ou un départ avant le lever du soleil : prévoyez votre course avec Vincent. Renseignez votre date et votre heure pour obtenir une estimation adaptée.",
    highlights: ["Service 24h/24, 7j/7", "Nuit, dimanches et jours fériés"],
  },
  evenement: {
    image: "/img/services/evenement.webp",
    imagePosition: "55% 40%",
    title: "Mariages & affaires",
    caption: "Vos rendez-vous, à l’heure.",
    href: whatsappLink("Bonjour Vincent, je souhaite organiser un trajet pour un événement ou un rendez-vous. Ma date et mes horaires :"),
    action: "Organiser mon trajet sur WhatsApp",
    description: "Un mariage, un rendez-vous professionnel ou des invités à accueillir : organisez vos déplacements avec Vincent. Précisez les adresses, les horaires et le nombre de voyageurs.",
    highlights: ["Déplacements privés et professionnels", "Organisation à convenir avec Vincent"],
  },
  plage: {
    image: "/img/services/plage.webp",
    imagePosition: "68% 45%",
    title: "Plages & hôtels",
    caption: "Direction les vacances.",
    href: "/estimateur",
    action: "Estimer mon trajet",
    description: "Direction la plage, votre hôtel ou votre villa. Choisissez votre lieu de départ et votre destination ; vous pouvez aussi convenir d’une heure de retour avec Vincent.",
    highlights: ["Prise en charge à votre hébergement", "Retour à prévoir lors de la réservation"],
    layout: "lg:col-span-2",
  },
  vsl: {
    image: "/img/services/vsl-duster.webp",
    imagePosition: "72% 38%",
    title: "Transport VSL",
    caption: "Parlons de votre trajet.",
    href: whatsappLink("Bonjour Vincent, je souhaite me renseigner sur un transport VSL. Quelles sont les modalités ?"),
    action: "Contacter Vincent sur WhatsApp",
    description: "Vous souhaitez organiser un transport VSL ? Contactez Vincent pour préciser votre trajet et vérifier avec lui les modalités adaptées à votre demande.",
    highlights: ["Organisation directement avec Vincent", "Date, trajet et besoins à préciser"],
    layout: "lg:col-span-4",
  },
};

export function ServiceShowcase() {
  const [active, setActive] = useState<{ service: Service; trigger: HTMLButtonElement } | null>(null);

  return (
    <>
    {/* Mobile et tablette : 8 cartes égales sur 2 colonnes. Ordinateur : mosaïque avec la navette aéroport en vedette. */}
    <div className="mx-auto mt-8 grid max-w-[1280px] auto-rows-[168px] grid-cols-2 gap-3 px-4 sm:mt-12 sm:auto-rows-[220px] sm:gap-4 sm:px-6 lg:auto-rows-[250px] lg:grid-cols-4 lg:px-8">
      {services.map((service) => {
        const card = cards[service.id];
        const featured = service.id === "aeroport";
        // Include the width hidden by object-cover so tall cards stay sharp.
        const imageSizes = service.id === "vsl"
          ? "(min-width: 1280px) 1216px, (min-width: 1024px) calc(100vw - 64px), (min-width: 640px) 660px, 504px"
          : featured
            ? "(min-width: 1024px) 774px, (min-width: 640px) max(50vw, 330px), max(50vw, 252px)"
            : card.layout?.includes("lg:col-span-2")
              ? "(min-width: 1280px) 600px, (min-width: 640px) max(50vw, 330px), max(50vw, 252px)"
              : "(min-width: 1024px) 375px, (min-width: 640px) max(50vw, 330px), max(50vw, 252px)";

        return (
          <article
            key={service.id}
            id={`service-${service.id}`}
            className={cn("group relative isolate flex scroll-mt-24 items-end overflow-hidden rounded-[20px] bg-vert-900 p-3.5 text-creme sm:rounded-[26px] sm:p-6", card.layout, featured && "lg:p-8")}
          >
            <Image
              src={card.image}
              alt=""
              fill
              sizes={imageSizes}
              quality={85}
              loading="lazy"
              style={{ objectPosition: card.imagePosition }}
              className="absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-focus-within:scale-105 motion-reduce:transform-none"
            />
            <div className={cn("absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(5,40,20,0.02)_0%,rgba(5,40,20,0.04)_35%,rgba(5,40,20,0.5)_67%,rgba(5,40,20,0.92)_100%)]", service.id === "vsl" && "lg:bg-[linear-gradient(90deg,rgba(5,40,20,0.92)_0%,rgba(5,40,20,0.65)_30%,rgba(5,40,20,0.08)_65%,rgba(5,40,20,0.02)_100%)]")} aria-hidden="true" />

            <span className={cn("absolute top-3 left-3 grid size-8 place-items-center rounded-full bg-vert-900/55 text-soleil backdrop-blur-sm sm:top-5 sm:left-5 sm:size-11", featured && "lg:top-7 lg:left-7")}>
              <Glyph name={service.icon} className="size-5 sm:size-7" />
            </span>
            <span className={cn("absolute top-3 right-3 grid size-8 place-items-center rounded-full bg-creme text-vert-900 transition-colors group-hover:bg-soleil group-focus-within:bg-soleil sm:top-5 sm:right-5 sm:size-11", featured && "bg-soleil lg:top-7 lg:right-7")} aria-hidden="true">
              <Icon name="ph:plus-bold" className="size-4 sm:size-5" />
            </span>

            <div>
              <h3 className={cn("font-display text-[1.05rem] leading-[1.1] font-bold text-white sm:text-[1.65rem]", featured && "lg:max-w-[10ch] lg:text-[3.1rem]")}>{card.title}</h3>
              <p className="mt-1.5 line-clamp-2 text-[0.72rem] leading-snug text-creme/90 sm:mt-2 sm:text-sm sm:leading-relaxed">{card.caption}</p>
            </div>
            <button
              type="button"
              aria-label={`Découvrir le service : ${card.title}`}
              aria-haspopup="dialog"
              onClick={(event) => setActive({ service: { ...service, img: card.image }, trigger: event.currentTarget })}
              className="absolute inset-0 z-10 cursor-pointer rounded-[inherit] focus-visible:outline-3 focus-visible:-outline-offset-4 focus-visible:outline-soleil"
            />
          </article>
        );
      })}
    </div>
    {active && <ServiceDialog service={active.service} {...cards[active.service.id]} trigger={active.trigger} onDismiss={() => setActive(null)} />}
    </>
  );
}
