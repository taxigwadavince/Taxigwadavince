"use client";

import Image from "next/image";
import { useId } from "react";
import { site } from "@/lib/site";
import { DEFAULT_DRIVER_CARD_STYLE, type DriverCardStyle } from "@/lib/driver-card-styles";
import { Icon, TaxiFront } from "./icons";
import styles from "./driver-card.module.css";

const rows = [
  { label: "Nom", value: "Vincent" },
  { label: "Dit", value: "« Gwada Vince »" },
  { label: "Basé au", value: "Gosier (97190)" },
  { label: "Zone", value: "Toute la Guadeloupe" },
  { label: "Service", value: site.hours },
];

// Portrait généré retiré (demande de Tom, 16/11/2026) : macaron du logo en attendant une vraie photo de Vincent.
// Pour remettre une photo : déposer public/img/driver/vincent.webp et réutiliser <Image fill /> avec cette source.
function Portrait({ className = "" }: { className?: string; large?: boolean }) {
  return (
    <div className={`${styles.portrait} ${styles.portraitLogo} ${className}`}>
      <Image src="/img/logo-rond.png" alt="Logo de Taxi Gwada Vince" width={256} height={256} quality={90} />
    </div>
  );
}

function Rating({ label = false }: { label?: boolean }) {
  return (
    <span className={styles.rating} aria-label={`${site.rating.toFixed(1).replace(".", ",")} sur 5 sur Google`}>
      <span className={styles.stars} aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => <Icon key={index} name="ph:star-fill" />)}
      </span>
      <strong>{site.rating.toFixed(1).replace(".", ",")}</strong>
      {label && <span className={styles.ratingLabel}>sur Google</span>}
    </span>
  );
}

function Association({ compact = false }: { compact?: boolean }) {
  return (
    <span className={styles.association}>
      <Icon name="ph:seal-check-bold" aria-hidden="true" />
      <span>{compact ? "Association des Taxis" : "Association des Taxis de la Guadeloupe"}</span>
    </span>
  );
}

export function DriverCard({ variant = DEFAULT_DRIVER_CARD_STYLE }: { variant?: DriverCardStyle }) {
  const patternId = useId();

  return (
    <div className={styles.shell} data-driver-card={variant}>
      {variant === "classique" && (
        <div className={styles.badgeWrap}>
          <span className={styles.clip} aria-hidden="true" />
          <article className={`${styles.card} ${styles.classic}`} aria-label="Carte de présentation de Vincent, style badge classique">
            <svg className={styles.guilloche} aria-hidden="true">
              <defs>
                <pattern id={patternId} width="60" height="22" patternUnits="userSpaceOnUse">
                  <path d="M0 11 C15 0, 15 22, 30 11 S45 0, 60 11" fill="none" stroke="currentColor" strokeWidth="1.2" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#${patternId})`} />
            </svg>
            <header className={styles.classicHeader}>
              <span>Carte professionnelle · Taxi</span><strong>971</strong>
            </header>
            <div className={styles.checker} aria-hidden="true" />
            <div className={styles.classicBody}>
              <div className={styles.badgePhoto}>
                <Portrait />
                <span className={styles.hologram} aria-hidden="true"><TaxiFront /></span>
              </div>
              <dl className={styles.details}>
                {rows.map((row) => (
                  <div key={row.label}>
                    <dt>{row.label}</dt><dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <footer className={styles.classicFooter}><Association /><Rating /></footer>
          </article>
        </div>
      )}

      {variant === "signature" && (
        <article className={`${styles.card} ${styles.deepGreen}`} aria-label="Carte de présentation de Vincent, style vert profond">
          <div className={styles.deepGreenContent}>
            <header className={styles.deepGreenHeader}>
              <p>Votre chauffeur</p>
              <TaxiFront />
            </header>
            <h2 className={styles.deepGreenName}>Vincent</h2>
            <p className={styles.deepGreenAlias}>« Gwada Vince »</p>
            <ul className={styles.deepGreenDetails}>
              <li><Icon name="ph:map-pin-fill" /><span>Le Gosier · 97190</span></li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m3 5 6-3 6 3 6-3v17l-6 3-6-3-6 3V5Z" /><path d="M9 2v17M15 5v17" />
                </svg>
                <span>Toute la Guadeloupe</span>
              </li>
              <li><Icon name="ph:clock-bold" /><span>{site.hours}</span></li>
            </ul>
            <p className={styles.deepGreenAssociation}>Membre de l’Association des Taxis de la Guadeloupe</p>
          </div>
          <div className={styles.deepGreenPhoto}>
            <Portrait large />
          </div>
        </article>
      )}

      {variant === "editorial" && (
        <article className={`${styles.card} ${styles.editorial}`} aria-label="Carte de présentation de Vincent, style éditorial">
          <div className={styles.editorialPhoto}>
            <Portrait large />
            <span className={styles.photoLabel}>GWADA VINCE · 971</span>
          </div>
          <div className={styles.editorialBody}>
            <p className={styles.eyebrow}><span /> Votre chauffeur</p>
            <h2>Vincent<span>.</span></h2>
            <p className={styles.editorialTagline}>Un visage.<br />Une île.<br />Votre confiance.</p>
            <dl className={styles.editorialDetails}>
              <div><dt>Au départ du</dt><dd>Gosier, Guadeloupe</dd></div>
              <div><dt>À vos côtés</dt><dd>24h/24, 7j/7</dd></div>
            </dl>
            <Rating label />
          </div>
          <footer className={styles.editorialFooter}><Association /><Icon name="ph:arrow-up-right-bold" aria-hidden="true" /></footer>
        </article>
      )}

      {variant === "billet" && (
        <article className={`${styles.card} ${styles.ticket}`} aria-label="Carte de présentation de Vincent, style billet de voyage">
          <header className={styles.ticketHeader}><span><TaxiFront /> BON VOYAGE AVEC VINCE</span><strong>971</strong></header>
          <div className={styles.ticketBody}>
            <div className={styles.ticketIdentity}>
              <Portrait />
              <div><p className={styles.eyebrow}>Votre chauffeur</p><h2>Vincent</h2><p className={styles.ticketAlias}>« Gwada Vince »</p><Association compact /></div>
              <span className={styles.ticketSeal}><Icon name="ph:steering-wheel-bold" /><span>TAXI<br />GUADELOUPE</span></span>
            </div>
            <div className={styles.route}>
              <div><span>Basé au</span><strong>Le Gosier</strong></div>
              <div className={styles.routeLine} aria-hidden="true"><span /><i /><Icon name="ph:arrow-right-bold" /></div>
              <div><span>À travers</span><strong>La Guadeloupe</strong></div>
            </div>
          </div>
          <footer className={styles.ticketFooter}>
            <div><span className={styles.eyebrow}>Disponibilité</span><strong>24h/24 · 7j/7</strong></div>
            <Rating />
            <div className={styles.ticketMark} aria-hidden="true">GWADA<br /><strong>VINCE</strong></div>
          </footer>
        </article>
      )}
    </div>
  );
}
