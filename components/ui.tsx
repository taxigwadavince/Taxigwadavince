"use client";

// INSPIRATION: premiere-version-site/templates/lipolux-v1/components/ui.tsx (bouton calque montant + rond fléché,
// titres mot par mot observés par un conteneur fixe), adapté à la charte vert / or.
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { Icon } from "./icons";
import { cn, EASE, fr } from "@/lib/utils";

type BtnVariant = "or" | "vert" | "verre" | "ligne" | "creme";

const btnStyles: Record<BtnVariant, { base: string; layer: string; dot: string }> = {
  or: { base: "bg-or text-vert-900", layer: "bg-soleil", dot: "bg-vert-900 text-or" },
  vert: { base: "bg-vert text-creme", layer: "bg-vert-700", dot: "bg-or text-vert-900" },
  verre: { base: "bg-white/12 text-white ring-1 ring-white/35 backdrop-blur-md", layer: "bg-white/18", dot: "bg-white text-vert-900" },
  ligne: { base: "bg-transparent text-vert ring-1 ring-vert/30", layer: "bg-menthe", dot: "bg-vert text-creme" },
  creme: { base: "bg-creme text-vert-900", layer: "bg-white", dot: "bg-vert text-or" },
};

export function Button({
  href,
  children,
  variant = "or",
  icon = "ph:arrow-right-bold",
  className,
  onClick,
  type,
  disabled,
  external,
}: {
  href?: string;
  children: React.ReactNode;
  variant?: BtnVariant;
  icon?: string;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  external?: boolean;
}) {
  const s = btnStyles[variant];
  const inner = (
    <>
      <span className={cn("absolute inset-0 translate-y-full rounded-full transition-transform duration-500 ease-(--ease-luxe) group-hover:translate-y-0", s.layer)} />
      <span className="relative z-10 whitespace-nowrap">{children}</span>
      <span className={cn("relative z-10 grid size-9 place-items-center rounded-full transition-transform duration-500 ease-(--ease-luxe) group-hover:translate-x-0.5", s.dot)}>
        <Icon name={icon} className="size-4" />
      </span>
    </>
  );
  const cls = cn(
    "group relative inline-flex h-13 items-center justify-between gap-4 overflow-hidden rounded-full py-2 pr-2 pl-6 text-[0.95rem] font-semibold tracking-tight transition-[box-shadow,opacity] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-or disabled:pointer-events-none disabled:opacity-50",
    s.base,
    className,
  );
  if (href) {
    if (external || href.startsWith("http") || href.startsWith("tel:"))
      return (
        <a href={href} className={cls} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined}>
          {inner}
        </a>
      );
    return (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    );
  }
  return (
    <button type={type ?? "button"} onClick={onClick} className={cls} disabled={disabled}>
      {inner}
    </button>
  );
}

export function Kicker({ children, icon = "ph:map-pin-fill", tone = "clair", className }: { children: React.ReactNode; icon?: string; tone?: "clair" | "sombre"; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.78rem] font-semibold tracking-wide uppercase",
        tone === "clair" ? "bg-vert text-soleil" : "bg-or text-vert-900",
        className,
      )}
    >
      <Icon name={icon} className="size-3.5" />
      {children}
    </span>
  );
}

const wordsParent: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const wordChild: Variants = {
  hidden: { y: "105%" },
  show: { y: "0%", transition: { duration: 0.8, ease: EASE } },
};

// Titre de section : mots qui montent un par un, mot clé souligné d'un trait or tracé à la main.
export function Title({
  as: Tag = "h2",
  text,
  mark,
  className,
  tone = "clair",
  center = true,
}: {
  as?: "h1" | "h2" | "h3";
  text: string;
  mark?: string;
  className?: string;
  tone?: "clair" | "sombre";
  center?: boolean;
}) {
  const reduce = useReducedMotion();
  const words = fr(text).split(" ");
  const markWords = mark ? mark.split(" ") : [];
  const MotionTag = motion[Tag];
  return (
    <MotionTag
      variants={wordsParent}
      initial={reduce ? "show" : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      className={cn(
        "font-display text-[clamp(1.85rem,4.2vw,3.3rem)] font-bold text-balance",
        tone === "clair" ? "text-vert-900" : "text-creme",
        center && "mx-auto text-center",
        className,
      )}
      style={{ lineHeight: 1.06 }}
    >
      {words.map((w, i) => {
        // La ponctuation qui suit le mot clé (espace insécable comprise) reste hors du soulignement et de la couleur d'accent.
        const core = w.replace(/[.,!?;:\s]+$/, "");
        const isMark = markWords.includes(core);
        return (
          <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-top">
            <motion.span variants={wordChild} className="relative inline-block">
              {isMark ? (
                <>
                  <span className={cn("relative inline-block", tone === "clair" ? "text-vert" : "text-soleil")}>
                    {core}
                    <Squiggle />
                  </span>
                  {w.slice(core.length)}
                </>
              ) : (
                w
              )}
            </motion.span>
            {i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </MotionTag>
  );
}

function Squiggle() {
  return (
    <svg viewBox="0 0 200 18" preserveAspectRatio="none" className="pointer-events-none absolute -bottom-[0.08em] left-0 h-[0.26em] w-full text-or" aria-hidden="true">
      <motion.path
        d="M3 12 C 40 4, 70 15, 104 8 S 170 5, 197 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { duration: 0.9, delay: 0.45, ease: EASE } } }}
      />
    </svg>
  );
}

const revealVariants: Record<string, Variants> = {
  up: { hidden: { opacity: 0, y: 34 }, show: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: -40 }, show: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 40 }, show: { opacity: 1, x: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.94 }, show: { opacity: 1, scale: 1 } },
};

// Apparition au défilement : le conteneur fixe observe, l'enfant bouge (anti clignotement).
export function Reveal({
  children,
  dir = "up",
  delay = 0,
  className,
  inner,
}: {
  children: React.ReactNode;
  dir?: "up" | "left" | "right" | "scale";
  delay?: number;
  className?: string;
  inner?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className} initial={reduce ? "show" : "hidden"} whileInView="show" viewport={{ once: true, amount: "some", margin: "0px 0px -8% 0px" }}>
      <motion.div className={inner} variants={revealVariants[dir]} transition={{ duration: 0.85, delay, ease: EASE }}>
        {children}
      </motion.div>
    </motion.div>
  );
}

export function Lead({ children, className, tone = "clair" }: { children: React.ReactNode; className?: string; tone?: "clair" | "sombre" }) {
  return (
    <p className={cn("mx-auto mt-5 max-w-2xl text-center text-[1.05rem] leading-relaxed", tone === "clair" ? "text-gris" : "text-creme/85", className)}>
      {fr(children)}
    </p>
  );
}

export function SectionHead({
  kicker,
  kickerIcon,
  title,
  mark,
  lead,
  tone = "clair",
}: {
  kicker: string;
  kickerIcon?: string;
  title: string;
  mark?: string;
  lead?: React.ReactNode;
  tone?: "clair" | "sombre";
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <Reveal>
        <Kicker icon={kickerIcon} tone={tone}>
          {kicker}
        </Kicker>
      </Reveal>
      <Title text={title} mark={mark} tone={tone} className="mt-5" />
      {lead && <Lead tone={tone}>{lead}</Lead>}
    </div>
  );
}
