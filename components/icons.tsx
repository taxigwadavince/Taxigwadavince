import { ph, si } from "@/lib/icon-data";
import { cn } from "@/lib/utils";

type IconSet = { icons: Record<string, { body: string; width?: number; height?: number }>; width?: number; height?: number };

// Rendu SSR des icônes Iconify embarquées (Phosphor, Simple Icons).
export function Icon({ name, className, label }: { name: string; className?: string; label?: string }) {
  const [prefix, id] = name.split(":");
  const set = (prefix === "si" ? si : ph) as unknown as IconSet;
  const data = set.icons[id];
  if (!data) return null;
  const w = data.width ?? set.width ?? 24;
  const h = data.height ?? set.height ?? 24;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      fill="currentColor"
      className={cn("size-5 shrink-0", className)}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      dangerouslySetInnerHTML={{ __html: data.body.replace(/fill="currentColor"/g, "") }}
    />
  );
}

// Pictogrammes dessinés pour Taxi Gwada Vince (trait arrondi, cohérents entre eux).
const P = { fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export function TaxiFront({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" {...P}>
      <rect x="19" y="6.5" width="10" height="4.5" rx="1.2" />
      <path d="M21.5 6.5v4.5M24 6.5v4.5M26.5 6.5v4.5" strokeWidth="1.2" />
      <path d="M13.5 22l3.2-8.2a3 3 0 0 1 2.8-1.8h9a3 3 0 0 1 2.8 1.8l3.2 8.2" />
      <path d="M9.5 22.5h29a2 2 0 0 1 2 2v9.5a1.5 1.5 0 0 1-1.5 1.5h-30A1.5 1.5 0 0 1 7.5 34v-9.5a2 2 0 0 1 2-2Z" />
      <path d="M11.5 35.5v4a1.5 1.5 0 0 0 1.5 1.5h3a1.5 1.5 0 0 0 1.5-1.5v-4M30.5 35.5v4a1.5 1.5 0 0 0 1.5 1.5h3a1.5 1.5 0 0 0 1.5-1.5v-4" />
      <rect x="11" y="26.5" width="6" height="3.2" rx="1.2" />
      <rect x="31" y="26.5" width="6" height="3.2" rx="1.2" />
      <path d="M20 27h8M20 29.5h8" strokeWidth="1.4" />
      <path d="M6 21.5h3.5M38.5 21.5H42" />
    </svg>
  );
}

const glyphs: Record<string, React.ReactNode> = {
  plane: (
    <>
      <path d="M6 30l14-3 9 12 4-1.5-4.5-12.5 9.5-2.5c2.4-.6 3.7-2.6 3-4.2-.7-1.6-3-2-5.3-1.3L26 20 14.5 9.5 11 11l7 11-9 2.5-3.5-3.5L3 22l3 8Z" />
      <path d="M4 41h40" strokeDasharray="2 4" />
    </>
  ),
  ferry: (
    <>
      <path d="M6 28h36l-4.5 8.5a3 3 0 0 1-2.6 1.5H13.1a3 3 0 0 1-2.6-1.5L6 28Z" />
      <path d="M11 28v-7h23l4 7M15 21v-5h12l2 5" />
      <path d="M15.5 24.5h2.5M21 24.5h2.5M26.5 24.5H29" />
      <path d="M4 43c3 0 3-2 6-2s3 2 6 2 3-2 6-2 3 2 6 2 3-2 6-2 3 2 6 2" />
    </>
  ),
  ship: (
    <>
      <path d="M5 30h38l-5 8H10l-5-8Z" />
      <path d="M9 30v-5h30v5M12 25v-5h24v5M16 20v-5h16v5" />
      <path d="M21 15V9h5v6" />
      <path d="M15 22.5h2M20 22.5h2M25 22.5h2M30 22.5h2M13 27.5h2M18 27.5h2M23 27.5h2M28 27.5h2M33 27.5h2" strokeWidth="1.5" />
      <path d="M4 43c3 0 3-2 6-2s3 2 6 2 3-2 6-2 3 2 6 2 3-2 6-2 3 2 6 2" />
    </>
  ),
  palm: (
    <>
      <path d="M25 42c-1-9 0-17 4-25" />
      <path d="M29 17c-3-5-9-6-14-3 5 0 8 2 10 5" />
      <path d="M29 17c1-6-3-10-8-11 3 3 4 6 4 9" />
      <path d="M29 17c4-4 10-4 13 0-4-1-8 0-10 2" />
      <path d="M29 17c5 0 9 3 10 8-3-3-6-4-9-4" />
      <path d="M8 42h32" />
      <path d="M14 42c2-3 6-4 10-4s7 1 9 4" />
    </>
  ),
  moon: (
    <>
      <path d="M30 8a15 15 0 1 0 10 25A13 13 0 0 1 30 8Z" />
      <path d="M36 9l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1 1-2.5Z" strokeWidth="1.4" />
      <path d="M41 20.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6.6-1.4Z" strokeWidth="1.3" />
    </>
  ),
  ring: (
    <>
      <circle cx="18" cy="28" r="10" />
      <circle cx="30" cy="28" r="10" />
      <path d="M21 14l3-5 3 5-3 3-3-3Z" />
    </>
  ),
  beach: (
    <>
      <path d="M8 18a16 16 0 0 1 30 0H8Z" />
      <path d="M23 18v22" />
      <path d="M15.5 18c1-5 4-8 7.5-10M30.5 18c-1-5-4-8-7.5-10" strokeWidth="1.5" />
      <path d="M4 42c3 0 3-2 6-2s3 2 6 2 3-2 6-2 3 2 6 2 3-2 6-2 3 2 6 2" />
    </>
  ),
  road: (
    <>
      <path d="M16 6 8 42M32 6l8 36" />
      <path d="M24 9v5M24 20v6M24 32v7" strokeWidth="2.4" />
    </>
  ),
  estimate: (
    <>
      <rect x="11" y="6" width="26" height="36" rx="3" />
      <path d="M16 13h16M16 19h10M16 25h6M16 31h8" />
      <path d="M29 26v9M26 29h6" strokeWidth="1.6" />
      <path d="M11 37l3-2 3 2 3-2 3 2 3-2 3 2 3-2 3 2 3-2" strokeWidth="1.5" />
    </>
  ),
  calendar: (
    <>
      <rect x="7" y="10" width="34" height="30" rx="3.5" />
      <path d="M7 18h34M15 6v7M33 6v7" />
      <path d="M17 29l5 5 9-10" />
    </>
  ),
  car: (
    <>
      <path d="M5 30v-5l5-1 5-8h15l7 8 6 1v5a2 2 0 0 1-2 2h-2M10 32H7a2 2 0 0 1-2-2" />
      <circle cx="14" cy="32" r="4" />
      <circle cx="35" cy="32" r="4" />
      <path d="M18 32h13M16 24h22M23 17v7" />
    </>
  ),
};

export function Glyph({ name, className }: { name: keyof typeof glyphs | string; className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={cn("size-10", className)} aria-hidden="true" {...P}>
      {glyphs[name]}
    </svg>
  );
}
