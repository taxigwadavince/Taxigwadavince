"use client";

// Ouverture de la page chauffeur : ses propres mots (taxigwadavince.com) et sa carte professionnelle de chauffeur.
// Carte vert profond retenue, avec un portrait d’illustration généré pour la maquette.
import { motion, useReducedMotion } from "motion/react";
import { site, whatsappLink } from "@/lib/site";
import Link from "next/link";
import { DriverCard } from "./driver-card";
import { DEFAULT_DRIVER_CARD_STYLE, driverCardStyles, type DriverCardStyle } from "@/lib/driver-card-styles";
import { Icon } from "./icons";
import { Button, Kicker, Title } from "./ui";
import { cn, EASE } from "@/lib/utils";

// short : libellé des pastilles compactes sur téléphone.
const BADGES = [
  { icon: "ph:seal-check-bold", text: "Membre de l'Association des Taxis de la Guadeloupe", short: "Association des Taxis de la Guadeloupe" },
  { icon: "ph:star-fill", text: `${site.rating.toFixed(1).replace(".", ",")} sur ${site.reviewsCount} avis Google` },
  { icon: "ph:clock-bold", text: "24h/24, 7j/7, même en dernière minute", short: "24h/24, 7j/7" },
];

export function DriverHero({ cardStyle = DEFAULT_DRIVER_CARD_STYLE, preview = false }: { cardStyle?: DriverCardStyle; preview?: boolean }) {
  const reduce = useReducedMotion();
  const up = (delay: number) => ({ initial: reduce ? false : { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay, ease: EASE } });

  return (
    // Sur ordinateur, l'ouverture occupe la hauteur de l'écran : titre dimensionné aussi sur la hauteur de la fenêtre.
    // Sur téléphone, elle tient entre la navigation (72 px) et le bouton flottant « Réserver ma course » (70 px) :
    // carte professionnelle et bouton « Réserver avec Vincent » masqués, badges en pastilles compactes.
    <section className="relative flex min-h-[var(--ecran-h,100svh)] flex-col justify-center overflow-hidden bg-vert-900 pt-[88px] pb-[92px] text-creme sm:block sm:min-h-0 sm:flex-row sm:justify-normal sm:pt-36 sm:pb-20 lg:flex lg:min-h-svh lg:items-center lg:pt-24 lg:pb-10">
      {/* Vert forêt et ombre de palme : plus sombre derrière le texte, halo or derrière la carte professionnelle. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <img src="/img/texture-vert.webp" alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,40,20,0.8)_0%,rgba(5,40,20,0.45)_50%,rgba(5,40,20,0.15)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(40%_55%_at_75%_55%,rgba(218,178,17,0.22),transparent_70%)]" />
      </div>

      <div className="relative mx-auto grid w-full max-w-[1280px] items-center gap-14 px-4 sm:px-6 lg:w-full lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16 lg:px-8">
        <div>
          <motion.div {...up(0)}>
            <Kicker icon="ph:steering-wheel-bold" tone="sombre">Votre chauffeur</Kicker>
          </motion.div>
          <Title as="h1" text="Votre chauffeur de confiance en Guadeloupe" mark="confiance" tone="sombre" center={false} className="mt-4 text-[clamp(1.9rem,8.4vw,2.2rem)] sm:mt-5 sm:text-[clamp(2.2rem,min(4.2vw,6.4vh),3.8rem)]" />
          <motion.p {...up(0.2)} className="mt-4 max-w-xl text-[0.98rem] leading-relaxed text-creme/85 sm:mt-5 sm:text-[1.05rem]">
            {"« Ambassadeur de cette île magnifique », Vincent s'engage à vous offrir « une expérience de voyage inoubliable et sécurisée »."}
          </motion.p>

          <motion.ul {...up(0.3)} className="mt-5 flex max-w-xl flex-wrap gap-2 sm:mt-6 sm:grid">
            {BADGES.map((b) => (
              <li key={b.text} className="flex items-center gap-2 rounded-full bg-white/10 py-1.5 pr-3.5 pl-1.5 text-[0.8rem] font-medium text-creme ring-1 ring-white/15 backdrop-blur-sm sm:gap-3 sm:rounded-2xl sm:px-4 sm:py-2.5 sm:text-[0.95rem]">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-or text-vert-900 sm:size-8">
                  <Icon name={b.icon} className="size-3.5 sm:size-4.5" />
                </span>
                <span className="sm:hidden">{b.short ?? b.text}</span>
                <span className="hidden sm:inline">{b.text}</span>
              </li>
            ))}
          </motion.ul>

          <motion.div {...up(0.4)} className="mt-6 grid gap-3 sm:mt-7 sm:flex sm:flex-wrap">
            <Button href="/reserver" variant="or" icon="ph:arrow-up-right-bold" className="w-full max-sm:hidden sm:w-auto">
              Réserver avec Vincent
            </Button>
            <Button href={whatsappLink("Bonjour Vincent, je souhaite organiser une course.")} variant="verre" icon="si:whatsapp" className="w-full sm:w-auto">
              Écrire sur WhatsApp
            </Button>
          </motion.div>
        </div>

        {/* Le mode aperçu permet de comparer les variantes dans leur contexte. */}
        <div className={cn("relative mx-auto w-full max-w-[520px] lg:mr-0", !preview && "max-sm:hidden")}>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 30, rotate: cardStyle === "classique" ? -6 : 0 }}
            animate={{ opacity: 1, y: 0, rotate: cardStyle === "classique" ? -3 : cardStyle === "billet" ? 2 : 0 }}
            transition={{ duration: 1, delay: 0.2, ease: EASE }}
          >
            <DriverCard variant={cardStyle} />
          </motion.div>
          {preview && (
            <nav aria-label="Comparer les styles de carte" className="relative mt-7 rounded-2xl border border-white/15 bg-vert-900/80 p-3 backdrop-blur-sm">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {driverCardStyles.map((style) => (
                  <Link
                    key={style.id}
                    href={`/equipe?carte=${style.id}`}
                    scroll={false}
                    aria-current={cardStyle === style.id ? "page" : undefined}
                    className={cn("rounded-xl px-2 py-2.5 text-center text-[0.68rem] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-soleil", cardStyle === style.id ? "bg-soleil text-vert-900" : "bg-white/5 text-creme hover:bg-white/15")}
                  >
                    <span className="mb-1 block text-[0.6rem] opacity-65">{style.number}</span>
                    {style.name}
                  </Link>
                ))}
              </div>
              <Link href="/equipe/cartes" className="mt-3 block text-center text-xs text-creme/75 underline underline-offset-4 hover:text-soleil">Voir les quatre cartes côte à côte</Link>
            </nav>
          )}
        </div>
      </div>
    </section>
  );
}
