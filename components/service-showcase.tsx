"use client";

import { useState } from "react";
import Image from "next/image";
import { services, type Service } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Glyph, Icon } from "./icons";
import { ServiceDialog } from "./service-dialog";
import { cards } from "@/lib/services-cartes";

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
