"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { site, whatsappLink } from "@/lib/site";
import { Glyph, Icon } from "./icons";
import { EASE } from "@/lib/utils";
import styles from "./driver-services.module.css";

// Fonction : relue à chaque rendu pour suivre les coordonnées saisies dans /admin
const ITEMS = () => [
  { glyph: "plane", title: "Transferts aéroport", text: "De Pôle Caraïbes à votre hôtel, votre gîte ou le port.", href: "/estimateur?from=aeroport" },
  { glyph: "road", title: "Toutes les communes", text: "Vos trajets partout en Guadeloupe, de la Basse-Terre à la Grande-Terre.", href: "/estimateur" },
  { glyph: "palm", title: "Excursions sur mesure", text: "Découvrez l’île à votre rythme avec un chauffeur local.", href: "/tarifs#services" },
  { glyph: "moon", title: "Nuit et petit matin", text: "Pour vos vols matinaux et vos retours de soirée.", href: "/estimateur" },
  { glyph: "car", title: "À votre disposition à la journée", text: "Un véhicule et son chauffeur, selon votre programme.", href: whatsappLink("Bonjour Vincent, je souhaite une mise à disposition du véhicule à la journée. Ma date et mon programme :") },
  { glyph: "calendar", title: "Dernière minute", text: "Un trajet imprévu ? Contactez Vincent.", href: site.phoneHref },
];

export function DriverServices() {
  const reduced = useReducedMotion();

  return (
    <section id="mes-services" aria-labelledby="mes-services-title" className={styles.section}>
      <div className={styles.container}>
        <header className={styles.header}>
          <span className={styles.kicker}><Glyph name="car" /> Mes services</span>
          <h2 id="mes-services-title" className={styles.title}>
            Ce que Vincent fait <span className={styles.mark}>pour<svg aria-hidden="true" viewBox="0 0 200 18" preserveAspectRatio="none"><path d="M4 13Q95-1 196 10" /></svg></span>{" "}
            <span className={styles.mark}>vous<svg aria-hidden="true" viewBox="0 0 200 18" preserveAspectRatio="none"><path d="M4 13Q105-2 196 11" /></svg></span>
          </h2>
        </header>

        <ul className={styles.services}>
          {ITEMS().map((item, i) => {
            const external = item.href.startsWith("http") || item.href.startsWith("tel:");
            const body = (
              <>
                <span className={styles.icon}><Glyph name={item.glyph} /></span>
                <span className={styles.copy}>
                  <span className={styles.serviceTitle}>{item.title}</span>
                  <span className={styles.description}>{item.text}</span>
                </span>
                <Icon name="ph:arrow-up-right-bold" className={styles.arrow} />
              </>
            );

            return (
              <motion.li
                key={item.glyph}
                className={styles.item}
                initial={reduced ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: (i % 2) * 0.06, ease: EASE }}
              >
                {external ? (
                  <a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel={item.href.startsWith("http") ? "noreferrer" : undefined} className={styles.link}>
                    {body}
                  </a>
                ) : (
                  <Link href={item.href} className={styles.link}>{body}</Link>
                )}
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
