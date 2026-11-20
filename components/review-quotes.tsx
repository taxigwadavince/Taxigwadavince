"use client";

// Avis Google (tous 5 étoiles) affichés par le module d'avis de taxigwadavince.com, relevés le 09/11/2026 :
// texte d'origine conservé (seuls les espaces et retours à la ligne sont normalisés), auteur et mois de publication.
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { site } from "@/lib/site";
import { Icon } from "./icons";
import { Button } from "./ui";
import { EASE } from "@/lib/utils";

const REVIEWS = [
  { author: "Brigitte De jonge", date: "décembre 2025", text: "Au top ! Serviable, courtois, ponctuel, arrangeant (à accepté une course à 6h30 du matin) attentionné… Vincent est un modèle : le taxi idéal !" },
  { author: "Martin Niemer", date: "février 2026", text: "Service impeccable ! Même à 6 h du matin, parfaitement à l’heure, très aimable et avec compteur 🙂 Je recommande vivement." },
  { author: "robiwan kenobi", date: "novembre 2025", text: "Expérience parfaite, de la réservation à la destination. Ce professionnel est ponctuel et a une excellente communication, les tarifs sont clairs et on reçoit une confirmation et un suivi par WhatsApp, ainsi qu’un reçu. La conduite est prudente, les échanges polis et cordiaux. Merci pour ce service." },
  { author: "Marc Lavallee", date: "janvier 2026", text: "Chauffeur très courtois, ponctuel et agréable. Ce fut simple et efficace. Excellente communication. Si je pouvais je mettrais facilement 6 étoiles sur 5. Merci pour cette course." },
  { author: "Kelly Lardez", date: "septembre 2025", text: "Taxi très sympathique et professionnel ! Après l’annulation de notre vol, il a accepté de nous prendre sans hésiter et a fait preuve d’une grande gentillesse et d’un vrai sens du service. Merci encore pour son aide précieuse dans ce moment compliqué, je recommande vivement !" },
  { author: "Alain Fontaine", date: "décembre 2025", text: "Nous avons utilisé les services de Vince lors de notre séjour en Guadeloupe, il est très sympathique et fiable, la voiture était propre, nous le recommandons fortement. Il accepte les paiements cash et par carte de crédit." },
  { author: "Nadege A. SAHA", date: "septembre 2025", text: "Pour une première expérience en taxi en Guadeloupe, je dois dire que je suis vraiment bien tombée. J’ai beaucoup apprécié la réactivité de Vince ainsi que sa disponibilité pour m’accompagner lors de mes déplacements professionnels. Service fiable et agréable, je recommande vivement !" },
  { author: "Lorenz Müller", date: "janvier 2026", text: "Super expérience ! Ponctuel, aimable et serviable !" },
  { author: "Mat Delfo", date: "décembre 2025", text: "Au top ! Merci ! Taxi propre, chauffeur avenant, conduite souple, discussion fluide. Je recommande +++" },
  { author: "Quoc Chinh Tran", date: "janvier 2026", text: "Vincent est tres sérieux, fiable, et honnête. Nous avons utilisé son service durant tout notre séjour en Guadeloupe car nous ne voulons pas conduire là-bas par prudence ! Et les prix étaient très correct… recommende les yeux fermés à 100" },
  { author: "Marwan CASULA", date: "juin 2026", text: "Merci à Vincent pour sa ponctualité et son efficacité. Trajet au top vers l’aéroport." },
  { author: "Reiniche Céline", date: "octobre 2025", text: "Pas mieux 🤩, ponctuel, agréable, qui donne des bons tuyaux, un grand merci pour tout et le petit clin d’œil au retour pour le détour vers le CA." },
  { author: "Emilie P", date: "mars 2026", text: "Personne ponctuelle et très arrangeante, bon rapport qualité prix, merci beaucoup" },
  { author: "Hervé Sitbon", date: "octobre 2023", text: "Merci Vincent, sincèrement je n’ai jamais eu meilleur taxi, guide… et pourtant depuis plus de 35 ans, je voyage énormément. Encore un grand merci 👍" },
];

export function ReviewQuotes() {
  const rating = site.rating.toFixed(1).replace(".", ",");
  const track = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ start: true, end: false });

  const update = () => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setPos({ start: el.scrollLeft <= 4, end: el.scrollLeft >= max - 4 });
  };

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Avance d'autant de cartes qu'il y en a d'entièrement visibles dans la largeur du contenu.
  const go = (dir: 1 | -1) => {
    const el = track.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    const cs = getComputedStyle(el);
    const gap = parseFloat(cs.columnGap) || 0;
    const inner = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const step = card.getBoundingClientRect().width + gap;
    el.scrollBy({ left: dir * Math.max(1, Math.floor((inner + gap + 1) / step)) * step, behavior: "smooth" });
  };

  return (
    <div className="mt-10 sm:mt-14">
      <p className="mx-4 flex w-fit flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-full bg-white/10 px-5 py-3 ring-1 ring-white/15 sm:mx-auto">
        <Icon name="si:google" className="size-5 text-white" />
        <span className="font-display text-2xl font-bold text-white tabular">{rating}</span>
        <span className="flex text-soleil" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <Icon key={i} name="ph:star-fill" className="size-4.5" />
          ))}
        </span>
        <span className="text-sm text-creme/90">sur {site.reviewsCount} avis Google</span>
      </p>

      <div
        ref={track}
        onScroll={update}
        aria-label="Avis des voyageurs"
        // Piste pleine largeur d'écran : la marge intérieure aligne la première carte à mi-chemin entre le bord de l'écran et le logo de la navigation (conteneur de 1320 px).
        className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pt-2 pb-10 [scrollbar-width:none] px-[max(1rem,calc((100%_-_1320px)/4_+_1rem))] scroll-px-[max(1rem,calc((100%_-_1320px)/4_+_1rem))] sm:px-[max(1.5rem,calc((100%_-_1320px)/4_+_1.5rem))] sm:scroll-px-[max(1.5rem,calc((100%_-_1320px)/4_+_1.5rem))] md:gap-5 lg:px-[max(2rem,calc((100%_-_1320px)/4_+_2rem))] lg:scroll-px-[max(2rem,calc((100%_-_1320px)/4_+_2rem))] [&::-webkit-scrollbar]:hidden"
      >
        {REVIEWS.map((r, i) => (
          <motion.figure
            key={r.author}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.01 }}
            transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: EASE }}
            className="relative flex w-[80vw] shrink-0 snap-center flex-col rounded-[24px] bg-creme p-6 text-vert-900 shadow-[0_30px_60px_-35px_rgba(0,0,0,0.6)] sm:w-[58vw] md:w-[380px] md:snap-start lg:w-[400px] lg:p-7"
          >
            <div className="flex items-center justify-between">
              <span aria-hidden="true" className="font-display text-5xl leading-[0.6] font-extrabold text-or">“</span>
              <span className="flex text-or" aria-label="5 étoiles sur 5">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Icon key={k} name="ph:star-fill" className="size-4" />
                ))}
              </span>
            </div>
            <blockquote className="mt-4 flex-1 text-[1.02rem] leading-relaxed font-medium sm:text-[1.06rem]">{r.text}</blockquote>
            <figcaption className="mt-6 flex items-center gap-3 border-t border-vert/15 pt-4">
              <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full bg-vert font-display text-lg font-bold text-soleil">
                {r.author.charAt(0).toUpperCase()}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold">{r.author}</span>
                <span className="block text-xs text-vert-700">{r.date}</span>
              </span>
              <Icon name="si:google" className="size-5 shrink-0 text-vert-700" label="Avis Google" />
            </figcaption>
          </motion.figure>
        ))}
      </div>

      <div className="-mt-3 flex justify-center gap-2.5 px-4">
        <button type="button" onClick={() => go(-1)} disabled={pos.start} aria-label="Avis précédent" className="grid size-12 place-items-center rounded-full text-white ring-[1.5px] ring-white/55 transition-colors hover:bg-or hover:text-vert-900 hover:ring-or disabled:pointer-events-none disabled:opacity-35">
          <Icon name="ph:arrow-left-bold" className="size-5" />
        </button>
        <button type="button" onClick={() => go(1)} disabled={pos.end} aria-label="Avis suivant" className="grid size-12 place-items-center rounded-full text-white ring-[1.5px] ring-white/55 transition-colors hover:bg-or hover:text-vert-900 hover:ring-or disabled:pointer-events-none disabled:opacity-35">
          <Icon name="ph:arrow-right-bold" className="size-5" />
        </button>
      </div>

      <div className="mx-auto mt-8 flex max-w-[1320px] justify-center px-4 sm:px-6 lg:px-8">
        <Button href={site.googleReviewsUrl} variant="or" icon="ph:arrow-up-right-bold" className="w-full justify-between sm:w-auto">
          Voir les avis sur Google
        </Button>
      </div>
    </div>
  );
}
