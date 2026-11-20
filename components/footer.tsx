"use client";

// Pied de page : fond vert forêt uni sous le damier, colonnes de liens à libellés or, apparition en cascade.
import Link from "next/link";
import { nav, site, bookingHref, gmailLink } from "@/lib/site";
import { Wordmark } from "./logo";
import { Icon } from "./icons";
import { Reveal } from "./ui";
import { Checker } from "./checker";

const cols = [
  { title: "Le site", links: [...nav, { label: "Réserver une course", href: bookingHref }] },
  {
    title: "Informations",
    links: [
      { label: "Mentions légales", href: "/mentions-legales" },
      { label: "Confidentialité", href: "/confidentialite" },
      { label: "Conditions de réservation", href: "/cgv" },
    ],
  },
];

export function Footer() {
  return (
    <footer data-footer className="relative z-0 isolate overflow-hidden bg-vert-900 text-creme">
      <Checker size={10} />

      <div className="mx-auto max-w-[1320px] px-5 pt-20 pb-10 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <Reveal>
            <Wordmark tone="sombre" />
            <p className="mt-6 max-w-xs leading-relaxed text-creme/85">
              Le taxi de Vincent en Guadeloupe : aéroport, ports, hôtels et excursions, de jour comme de nuit.
            </p>
            <a href={site.googleReviewsUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/8 px-4 py-2.5 text-sm ring-1 ring-white/15 transition-colors hover:bg-white/14">
              <Icon name="si:google" className="size-4" />
              <span className="font-semibold tabular">5,0</span>
              <span className="flex text-or">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icon key={i} name="ph:star-fill" className="size-3.5" />
                ))}
              </span>
              <span className="text-creme/90">{site.reviewsCount} avis</span>
            </a>
          </Reveal>
          {cols.map((c, i) => (
            <Reveal key={c.title} delay={0.08 * (i + 1)}>
              <p className="border-b border-or/40 pb-3 text-sm font-semibold text-or">{c.title}</p>
              <ul className="mt-3">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="inline-flex min-h-11 items-center text-[0.95rem] text-creme/85 transition-colors hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
          <Reveal delay={0.24}>
            <p className="border-b border-or/40 pb-3 text-sm font-semibold text-or">Contact</p>
            <ul className="mt-4 space-y-3 text-[0.95rem]">
              <li>
                <a href={site.phoneHref} className="inline-flex min-h-11 items-center gap-3 font-semibold tabular hover:text-soleil">
                  <Icon name="ph:phone-bold" className="size-4 text-or" /> {site.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={site.whatsapp} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-3 hover:text-soleil">
                  <Icon name="si:whatsapp" className="size-4 text-or" /> WhatsApp
                </a>
              </li>
              <li>
                <a href={gmailLink()} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-3 break-all hover:text-soleil">
                  <Icon name="ph:envelope-simple-bold" className="size-4 text-or" /> {site.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-creme/85">
                <Icon name="ph:map-pin-bold" className="mt-0.5 size-4 text-or" />
                <span>
                  {site.address}
                  <br />
                  {site.city}, {site.region}
                </span>
              </li>
            </ul>
          </Reveal>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 pb-20 text-sm text-creme/85 sm:flex-row sm:items-center sm:justify-between lg:pb-0">
          <p>© {new Date().getFullYear()} Taxi Gwada Vince. Tous droits réservés.</p>
          <p>
            Site réalisé par{" "}
            <a href={site.credit.href} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center font-semibold text-soleil underline-offset-4 hover:underline">
              {site.credit.label}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
