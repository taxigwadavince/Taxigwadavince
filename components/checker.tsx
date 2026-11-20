"use client";

// Signature Taxi Gwada Vince : le damier des enseignes de taxi, aux couleurs de la marque (vert forêt / jaune soleil).
// Il se « déroule » de gauche à droite à l'entrée dans l'écran.
import { motion, useReducedMotion } from "motion/react";
import { cn, EASE } from "@/lib/utils";

export function Checker({ className, rows = 2, size = 14, tone = "vert" }: { className?: string; rows?: number; size?: number; tone?: "vert" | "creme" }) {
  const reduce = useReducedMotion();
  const a = tone === "vert" ? "#052814" : "#f7f5ee";
  const b = "#ffe178";
  const id = `chk-${tone}-${size}-${rows}`;
  return (
    <motion.div
      aria-hidden="true"
      className={cn("w-full origin-left overflow-hidden", className)}
      style={{ height: rows * size }}
      initial={reduce ? false : { scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.1, ease: EASE }}
    >
      <svg width="100%" height={rows * size} className="block">
        <defs>
          <pattern id={id} width={size * 2} height={size * 2} patternUnits="userSpaceOnUse">
            <rect width={size * 2} height={size * 2} fill={a} />
            <rect width={size} height={size} fill={b} />
            <rect x={size} y={size} width={size} height={size} fill={b} />
          </pattern>
        </defs>
        <rect width="100%" height={rows * size} fill={`url(#${id})`} />
      </svg>
    </motion.div>
  );
}
