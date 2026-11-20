"use client";

// INSPIRATION: INSPIRATIONS-READ.md idée 3 (billet Départ / Destination de Kwezi Transit). Champ de lieu qui propose
// d'abord les lieux fréquents (aéroport, ports, communes), puis toute adresse de l'île (hôtel, rue, gîte) via OpenStreetMap.
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PLACES } from "@/lib/places";
import { searchAddress, type AddressHit } from "@/lib/route";
import { Icon } from "./icons";
import { cn } from "@/lib/utils";

export type PickedPlace = { id?: string; label: string; sub?: string; lat: number; lon: number };

const KIND_ICON: Record<string, string> = { hub: "ph:paper-plane-tilt-bold", port: "ph:navigation-arrow-bold", ville: "ph:map-pin-bold", site: "ph:star-fill" };

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function PlacePicker({
  label,
  value,
  onChange,
  placeholder,
  icon,
  tone = "clair",
}: {
  label: string;
  value: PickedPlace | null;
  onChange: (p: PickedPlace | null) => void;
  placeholder: string;
  icon: string;
  tone?: "clair" | "sombre";
}) {
  const [q, setQ] = useState(value?.label ?? "");
  const [open, setOpen] = useState(false);
  const [hits, setHits] = useState<AddressHit[]>([]);
  const [loading, setLoading] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) setQ(value.label);
  }, [value]);
  useEffect(() => {
    const close = (e: MouseEvent) => !box.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const local = useMemo(() => {
    const n = norm(q.trim());
    const list = n && n !== norm(value?.label ?? "") ? PLACES.filter((p) => norm(p.name + " " + p.area).includes(n)) : PLACES;
    return list.slice(0, n ? 6 : 9);
  }, [q, value?.label]);

  useEffect(() => {
    const n = q.trim();
    if (!open || n.length < 3 || n === value?.label) {
      setHits([]);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      setHits(await searchAddress(n));
      setLoading(false);
    }, 350);
    return () => clearTimeout(t);
  }, [q, open, value?.label]);

  const pick = (p: PickedPlace) => {
    onChange(p);
    setQ(p.label);
    setOpen(false);
  };

  const dark = tone === "sombre";
  return (
    <div ref={box} className="relative min-w-0">
      <label className={cn("mb-1.5 block text-[0.78rem] font-semibold tracking-wide uppercase", dark ? "text-creme/80" : "text-gris")}>{label}</label>
      <div className={cn("flex h-14 items-center gap-3 rounded-[16px] px-4 ring-1 transition-shadow focus-within:ring-2", dark ? "bg-white/10 ring-white/20 focus-within:ring-or" : "bg-white ring-vert/15 focus-within:ring-vert")}>
        <Icon name={icon} className={cn("size-5", dark ? "text-or" : "text-vert")} />
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
            if (value) onChange(null);
          }}
          onFocus={() => setOpen(true)}
          maxLength={120}
          placeholder={placeholder}
          autoComplete="off"
          aria-label={label}
          className={cn("h-full w-0 min-w-0 flex-1 bg-transparent text-[1rem] font-medium outline-none", dark ? "text-white placeholder:text-creme/55" : "text-encre placeholder:text-gris/70")}
        />
        {q && (
          <button type="button" aria-label="Effacer" onClick={() => { setQ(""); onChange(null); setOpen(true); }} className={cn("grid size-11 place-items-center rounded-full", dark ? "text-creme/70 hover:bg-white/10" : "text-gris hover:bg-menthe")}>
            <Icon name="ph:x-bold" className="size-4" />
          </button>
        )}
      </div>
      <AnimatePresence>
        {open && (local.length > 0 || hits.length > 0 || loading) && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-x-0 top-full z-30 mt-2 max-h-80 overflow-y-auto rounded-[16px] bg-white p-1.5 text-encre shadow-[0_24px_60px_-20px_rgba(0,0,0,0.4)] ring-1 ring-vert/10"
            role="listbox"
          >
            {local.map((p) => (
              <li key={p.id}>
                <button type="button" onClick={() => pick({ id: p.id, label: p.name, sub: p.area, lat: p.lat, lon: p.lon })} className="flex min-h-12 w-full items-center gap-3 rounded-[12px] px-3 py-2 text-left hover:bg-menthe">
                  <Icon name={KIND_ICON[p.kind]} className="size-4 text-vert" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{p.name}</span>
                    <span className="block truncate text-xs text-gris">{p.area}</span>
                  </span>
                </button>
              </li>
            ))}
            {hits.length > 0 && <li className="px-3 pt-3 pb-1 text-[0.7rem] font-semibold tracking-widest text-gris uppercase">Adresses</li>}
            {hits.map((h, i) => (
              <li key={`${h.lat}-${h.lon}-${i}`}>
                <button type="button" onClick={() => pick({ label: h.label, sub: h.sub, lat: h.lat, lon: h.lon })} className="flex min-h-12 w-full items-center gap-3 rounded-[12px] px-3 py-2 text-left hover:bg-menthe">
                  <Icon name="ph:map-pin-bold" className="size-4 text-or-600" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{h.label}</span>
                    <span className="block truncate text-xs text-gris">{h.sub}</span>
                  </span>
                </button>
              </li>
            ))}
            {loading && <li className="px-3 py-2 text-sm text-gris">Recherche d&apos;adresses…</li>}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export function encodePlace(p: PickedPlace | null) {
  if (!p) return "";
  return p.id ?? `${p.lat.toFixed(5)},${p.lon.toFixed(5)},${p.label}`;
}

export function decodePlace(s: string | null): PickedPlace | null {
  if (!s) return null;
  const known = PLACES.find((p) => p.id === s);
  if (known) return { id: known.id, label: known.name, sub: known.area, lat: known.lat, lon: known.lon };
  const [lat, lon, ...rest] = s.split(",");
  if (!rest.length || isNaN(+lat) || isNaN(+lon)) return null;
  return { label: rest.join(","), lat: +lat, lon: +lon };
}
