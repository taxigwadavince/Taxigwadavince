"use client";

// MCP: "faq accordion" -> Accordion (21st.dev #23530) : ouverture en ressort à hauteur mesurée (ResizeObserver),
// chevron animé, navigation clavier, aria-expanded / region. Adapté : charte vert / or, « + » qui pivote,
// aucune hauteur réservée quand tout est fermé (règle 225).
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import type { FaqAnswer } from "@/lib/faq";
import { Icon } from "./icons";
import { cn } from "@/lib/utils";

const DISCLOSE = { type: "spring", stiffness: 420, damping: 40, mass: 0.6 } as const;
const useIso = typeof window === "undefined" ? useEffect : useLayoutEffect;

function Row({ item, open, onToggle, reduced, headingLevel: Heading }: { item: FaqAnswer; open: boolean; onToggle: () => void; reduced: boolean; headingLevel: "h3" | "h4" }) {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const [h, setH] = useState(0);
  useIso(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => setH(el.getBoundingClientRect().height);
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div className={cn("rounded-[18px] transition-colors", open ? "bg-white ring-1 ring-vert/12" : "bg-transparent")}>
      <Heading>
        <button
          type="button"
          id={`${id}-h`}
          aria-expanded={open}
          aria-controls={`${id}-p`}
          onClick={onToggle}
          className="flex min-h-16 w-full items-center gap-4 rounded-[18px] px-5 py-4 text-left transition-colors hover:bg-menthe/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vert"
        >
          <span className="flex-1 text-[1.02rem] font-semibold text-vert-900">{item.q}</span>
          <span className={cn("grid size-9 shrink-0 place-items-center rounded-full transition-all duration-300", open ? "rotate-45 bg-or text-vert-900" : "bg-menthe text-vert")}>
            <Icon name="ph:plus-bold" className="size-4" />
          </span>
        </button>
      </Heading>
      <motion.div initial={false} animate={{ height: open ? h : 0 }} transition={reduced ? { duration: 0 } : DISCLOSE} style={{ overflow: "hidden" }}>
        <div ref={ref} id={`${id}-p`} role="region" aria-labelledby={`${id}-h`} aria-hidden={!open} inert={!open}>
          <p className="px-5 pb-5 leading-relaxed text-gris">{item.a}</p>
          {item.href && item.linkLabel && <Link href={item.href} className="mx-5 mb-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-vert underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vert">{item.linkLabel}<Icon name="ph:arrow-right-bold" className="size-4" /></Link>}
        </div>
      </motion.div>
    </div>
  );
}

export function FaqList({ items, headingLevel = "h3" }: { items: FaqAnswer[]; headingLevel?: "h3" | "h4" }) {
  const [open, setOpen] = useState<number | null>(null);
  const reduced = Boolean(useReducedMotion());
  return (
    <div className="divide-y divide-vert/10">
      {items.map((it, i) => (
        <Row key={it.q} item={it} open={open === i} onToggle={() => setOpen(open === i ? null : i)} reduced={reduced} headingLevel={headingLevel} />
      ))}
    </div>
  );
}
