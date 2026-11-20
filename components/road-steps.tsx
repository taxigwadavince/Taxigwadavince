"use client";

// MCP: "timeline steps" -> Vertical How It Works Timeline (21st.dev #26902) : rail en pointillés qui relie les étapes,
// un pictogramme par étape. Adapté : le rail devient une ROUTE (bande asphalte + ligne médiane or) qui se trace
// au défilement (INSPIRATION: INSPIRATIONS-READ.md idée 8, Kwezi Transit app/page.tsx l.118), horizontale sur
// ordinateur, verticale sur téléphone. Pas de numéros 01/02/03 (pattern IA banni).
import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { steps } from "@/lib/content";
import { Glyph } from "./icons";
import { EASE } from "@/lib/utils";

export function RoadSteps() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 55%"] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <div ref={ref} className="relative mx-auto mt-16 max-w-[1120px] px-4 sm:px-6">
      {/* Route horizontale (ordinateur) */}
      <div className="absolute top-[38px] right-[16%] left-[16%] hidden h-[14px] rounded-full bg-vert-900/90 md:block" aria-hidden="true">
        <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 14">
          <motion.line x1="0" y1="7" x2="100" y2="7" stroke="#dab211" strokeWidth="2" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" style={{ pathLength: p }} />
        </svg>
      </div>
      {/* Route verticale (téléphone) */}
      <div className="absolute top-6 bottom-24 left-[38px] w-[12px] rounded-full bg-vert-900/90 sm:left-[46px] md:hidden" aria-hidden="true">
        <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 12 100">
          <motion.line x1="6" y1="0" x2="6" y2="100" stroke="#dab211" strokeWidth="2" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" style={{ pathLength: p }} />
        </svg>
      </div>

      <ol className="relative grid gap-10 md:grid-cols-3 md:gap-8">
        {steps.map((s, i) => (
          <motion.li
            key={s.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, delay: i * 0.15, ease: EASE }}
            className="flex gap-5 md:flex-col md:items-center md:text-center"
          >
            <span className="relative z-10 grid size-[64px] shrink-0 place-items-center rounded-full bg-or text-vert-900 shadow-[0_0_0_8px_var(--color-creme)] md:size-[90px]">
              <Glyph name={s.icon} className="size-8 md:size-11" />
            </span>
            <div className="pt-1 md:pt-6">
              <h3 className="font-display text-[1.45rem] font-bold text-vert-900">{s.title}</h3>
              <p className="mt-2 max-w-xs leading-relaxed text-gris md:mx-auto">{s.text}</p>
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
