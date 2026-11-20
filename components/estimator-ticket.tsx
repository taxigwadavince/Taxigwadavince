import Link from "next/link";
import { bookingHref, site } from "@/lib/site";
import { Icon } from "./icons";
import styles from "./estimator-ticket.module.css";

export function EstimatorTicket() {
  return (
    <section id="reservation-course" aria-labelledby="reservation-course-title" className={styles.section}>
      <svg className={styles.backgroundRoute} viewBox="0 0 1600 760" fill="none" aria-hidden="true" preserveAspectRatio="none">
        <path d="M-50 230C70 50 140 65 250 65S390 45 440-55M1060 800c105-140 205-125 320-115s175-15 260-180" stroke="currentColor" strokeWidth="4" strokeDasharray="10 12" strokeLinecap="round" />
        <g fill="var(--color-creme)" stroke="currentColor" strokeWidth="7">
          <circle cx="218" cy="65" r="12" />
          <circle cx="1375" cy="685" r="12" />
        </g>
      </svg>

      <div className={styles.ticket}>
        <div className={styles.main}>
          <p className={styles.eyebrow}>
            <svg viewBox="0 0 100 40" fill="none" aria-hidden="true">
              <path d="M10 29c39 17 29-33 79-15" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              <circle cx="10" cy="29" r="9" fill="currentColor" />
              <circle cx="89" cy="14" r="9" fill="currentColor" />
            </svg>
            <span>Votre prochain trajet</span>
          </p>
          <h2 id="reservation-course-title" className={styles.title}>On vous<br />emmène&nbsp;?</h2>
          <p className={styles.description}>Votre estimation vous convient&nbsp;? Réservez votre trajet avec Vincent.</p>

          <div className={styles.details}>
            <a href={site.phoneHref} className={styles.phone}>
              <Icon name="ph:phone-bold" />
              <span>{site.phoneDisplay}</span>
            </a>
            <p className={styles.hours}>
              <Icon name="ph:clock-bold" />
              <span>{site.hours}</span>
            </p>
          </div>
        </div>

        <div className={styles.stub}>
          <svg className={styles.route} viewBox="0 0 320 100" fill="none" aria-hidden="true">
            <path d="M24 59c37 24 55-39 120-10s99 43 150 13" stroke="currentColor" strokeWidth="3.5" strokeDasharray="7 10" strokeLinecap="round" />
            <g fill="currentColor">
              <path d="M24 10A15 15 0 0 0 9 25c0 11 15 28 15 28s15-17 15-28a15 15 0 0 0-15-15Zm0 8a7 7 0 1 1 0 14 7 7 0 0 1 0-14Z" fillRule="evenodd" />
              <path d="M294 18a15 15 0 0 0-15 15c0 11 15 28 15 28s15-17 15-28a15 15 0 0 0-15-15Zm0 8a7 7 0 1 1 0 14 7 7 0 0 1 0-14Z" fillRule="evenodd" />
            </g>
          </svg>
          <h3 className={styles.ready}>Prêt à partir&nbsp;?</h3>
          <Link href={bookingHref} className={styles.book}>
            <span>Réserver ma course</span>
            <Icon name="ph:arrow-up-right-bold" />
          </Link>
          <p className={styles.confirmation}>Vincent vous confirme l’heure<br className={styles.desktopBreak} /> de prise en charge.</p>
        </div>
      </div>
    </section>
  );
}
