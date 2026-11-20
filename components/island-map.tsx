"use client";

// MCP: "interactive map locations" -> Location Map (21st.dev #10422) : marqueur qui tombe en ressort, tracés routiers
// en pathLength, soulignement animé. Adapté : contour RÉEL de la Guadeloupe (OpenStreetMap, lib/guadeloupe-map.ts),
// itinéraire routier réel (OSRM) qui se dessine entre départ et arrivée.
import { AnimatePresence, motion } from "motion/react";
import { ISLAND_PATHS, MAP, project } from "@/lib/guadeloupe-map";
import { PLACES } from "@/lib/places";
import { cn, EASE } from "@/lib/utils";

type Pt = { lat: number; lon: number; label?: string };

const LABELS = [
  { name: "Grande-Terre", lat: 16.36, lon: -61.4 },
  { name: "Basse-Terre", lat: 16.13, lon: -61.69 },
  { name: "Marie-Galante", lat: 15.93, lon: -61.27 },
];

export function IslandMap({
  from,
  to,
  route,
  tone = "sombre",
  showPlaces = true,
  className,
  onPick,
  activeId,
}: {
  from?: Pt | null;
  to?: Pt | null;
  route?: [number, number][] | null;
  tone?: "sombre" | "clair";
  showPlaces?: boolean;
  className?: string;
  onPick?: (id: string) => void;
  activeId?: string;
}) {
  const d = route && route.length > 1 ? "M" + route.map(([la, lo]) => project(la, lo).map((n) => n.toFixed(1)).join(",")).join("L") : null;
  const land = tone === "sombre" ? "#13603a" : "#cfe9db";
  const coast = tone === "sombre" ? "rgba(255,225,120,0.35)" : "rgba(10,70,36,0.35)";
  const ink = tone === "sombre" ? "#f7f5ee" : "#0a4624";
  const f = from ? project(from.lat, from.lon) : null;
  const t = to ? project(to.lat, to.lon) : null;

  return (
    <svg viewBox={`0 0 ${MAP.width} ${MAP.height}`} className={cn("h-auto w-full", className)} role="img" aria-label="Carte de la Guadeloupe et de l'itinéraire">
      <defs>
        <pattern id={`dots-${tone}`} width="18" height="18" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.2" fill={tone === "sombre" ? "rgba(255,255,255,0.07)" : "rgba(10,70,36,0.08)"} />
        </pattern>
      </defs>
      <rect width={MAP.width} height={MAP.height} fill={`url(#dots-${tone})`} />
      {ISLAND_PATHS.map((p, i) => (
        <motion.path
          key={i}
          d={p}
          fill={land}
          stroke={coast}
          strokeWidth={1.4}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: i * 0.05 }}
        />
      ))}
      {LABELS.map((l) => {
        const [x, y] = project(l.lat, l.lon);
        return (
          <text key={l.name} x={x} y={y} textAnchor="middle" fill={ink} opacity={0.5} fontSize={22} fontWeight={700} letterSpacing={4} className="uppercase" style={{ fontFamily: "var(--font-syne)" }}>
            {l.name}
          </text>
        );
      })}

      {showPlaces &&
        PLACES.filter((p) => p.kind !== "site" || p.id === "pointe-des-chateaux" || p.id === "chutes-carbet").map((p) => {
          const [x, y] = project(p.lat, p.lon);
          const on = activeId === p.id;
          return (
            <g key={p.id} onClick={onPick ? () => onPick(p.id) : undefined} className={onPick ? "cursor-pointer" : undefined}>
              {onPick && <circle cx={x} cy={y} r={16} fill="transparent" />}
              <circle cx={x} cy={y} r={on ? 7 : 4} fill={on ? "#dab211" : ink} opacity={on ? 1 : 0.55} />
            </g>
          );
        })}

      <AnimatePresence mode="wait">
        {d && (
          <motion.g key={d.slice(0, 40) + d.length}>
            <motion.path d={d} fill="none" stroke="#052814" strokeOpacity={tone === "sombre" ? 0.6 : 0.15} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.2, ease: EASE }} />
            <motion.path d={d} fill="none" stroke="#dab211" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.2, ease: EASE }} />
          </motion.g>
        )}
      </AnimatePresence>

      {f && <Pin x={f[0]} y={f[1]} label={from?.label} kind="from" ink={ink} />}
      {t && <Pin x={t[0]} y={t[1]} label={to?.label} kind="to" ink={ink} />}
    </svg>
  );
}

function Pin({ x, y, label, kind, ink }: { x: number; y: number; label?: string; kind: "from" | "to"; ink: string }) {
  const left = x > MAP.width * 0.72;
  return (
    <motion.g key={`${kind}-${x}-${y}`} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 420, damping: 22, delay: kind === "to" ? 0.9 : 0.1 }} style={{ originX: `${x}px`, originY: `${y}px` }}>
      <circle cx={x} cy={y} r={15} fill={kind === "from" ? "#f7f5ee" : "#dab211"} opacity={0.25} />
      <circle cx={x} cy={y} r={8} fill={kind === "from" ? "#f7f5ee" : "#dab211"} stroke="#052814" strokeWidth={3} />
      {label && (
        <text x={left ? x - 18 : x + 18} y={y - 14} textAnchor={left ? "end" : "start"} fill={ink} fontSize={24} fontWeight={700} style={{ fontFamily: "var(--font-poppins)", paintOrder: "stroke", stroke: ink === "#0a4624" ? "#f7f5ee" : "#052814", strokeWidth: 6, strokeLinejoin: "round" }}>
          {label}
        </text>
      )}
    </motion.g>
  );
}
