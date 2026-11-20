import { gmailLink, site, whatsappLink } from "@/lib/site";
import { Icon } from "./icons";
import styles from "./ways-to-book.module.css";

const ways = [
  { tone: "phone", icon: "ph:phone-bold", title: "Appeler Vincent", text: "Pour une course dans l’heure.", href: site.phoneHref, cta: site.phoneDisplay },
  { tone: "whatsapp", icon: "si:whatsapp", title: "Écrire sur WhatsApp", text: "Pour échanger sur votre trajet.", href: whatsappLink("Bonjour Vincent, je souhaite réserver une course :"), cta: "Ouvrir WhatsApp" },
  { tone: "email", icon: "ph:envelope-simple-bold", title: "Envoyer un e-mail", text: "Pour un séjour, un groupe ou un mariage.", href: gmailLink("Demande de réservation"), cta: site.email },
];

function ConversationDoodle({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 220 170" fill="none" className={className} aria-hidden="true">
      <g stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M151 78h20a37 37 0 0 1 22 67l6 21-24-14h-44a37 37 0 0 1-37-37v-11" />
        <path d="M53 9h49a47 47 0 0 1 0 94H48l-29 19 7-29A47 47 0 0 1 53 9Z" />
      </g>
      <g fill="currentColor">
        <circle cx="55" cy="56" r="5.5" />
        <circle cx="80" cy="56" r="5.5" />
        <circle cx="105" cy="56" r="5.5" />
      </g>
    </svg>
  );
}

export function WaysToBook() {
  return (
    <section id="autres-moyens" aria-labelledby="conversation-title" className={styles.section}>
      <ConversationDoodle className={`${styles.doodle} ${styles.doodleTop}`} />
      <ConversationDoodle className={`${styles.doodle} ${styles.doodleBottom}`} />

      <div className={styles.container}>
        <div className={styles.heading}>
          <p className={styles.kicker}>02 — Conversation</p>
          <h2 id="conversation-title" className={styles.title}>
            On en <span className={styles.mark}>parle
              <svg viewBox="0 0 240 26" preserveAspectRatio="none" aria-hidden="true">
                <path d="M5 20 Q120 -8 235 15" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
              </svg>
            </span> ?
          </h2>
        </div>

        <ul className={styles.ways}>
          {ways.map((way) => {
            const external = way.href.startsWith("http");
            return (
              <li key={way.tone} className={`${styles.bubble} ${styles[way.tone]}`}>
                <svg viewBox="0 0 92 64" className={styles.tail} aria-hidden="true">
                  <path d="M18 0H92C68 32 37 55 8 61C2 62 0 59 4 54C16 37 18 18 18 0Z" fill="currentColor" />
                </svg>
                <div className={styles.content}>
                  <span className={styles.icon}><Icon name={way.icon} className={styles.channelIcon} /></span>
                  <div className={styles.copy}>
                    <h3>{way.title}</h3>
                    <p>{way.text}</p>
                  </div>
                  <a
                    href={way.href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    aria-label={`${way.title} : ${way.cta}${external ? " (nouvel onglet)" : ""}`}
                    className={styles.cta}
                  >
                    <span>{way.cta}</span>
                    <Icon name={external ? "ph:arrow-up-right-bold" : "ph:arrow-right-bold"} className={styles.arrow} />
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
