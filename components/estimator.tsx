"use client";

// MCP: "price calculator" -> Volume Pricing Card (21st.dev #28176) : réglages à gauche, prix recalculé en direct à droite.
// INSPIRATION: INSPIRATIONS-READ.md idée 4 (Yohan Berger tarifs-services.tsx l.212-237 : fourchette « entre X et Y € »,
// trajet transmis à la réservation par l'URL). Itinéraire routier réel (OSRM) tracé sur la vraie carte de l'île.
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { PlacePicker, decodePlace, encodePlace, type PickedPlace } from "./place-picker";
import { IslandMap } from "./island-map";
import { Ticket } from "./ticket";
import { Button } from "./ui";
import { Icon } from "./icons";
import { getRoute, type RouteResult } from "@/lib/route";
import { estimate, TARIFS } from "@/lib/tarifs";
import { whatsappLink } from "@/lib/site";
import { euro2 } from "@/lib/utils";
import { guadeloupeDate, parseGuadeloupeDate, formatGuadeloupeDate } from "@/lib/guadeloupe-time";
import { clampInt, dateBounds, dateError, isValidTime, paramDate, paramTime } from "@/lib/validation";

export function Estimator() {
  const sp = useSearchParams();
  const [from, setFrom] = useState<PickedPlace | null>(() => decodePlace(sp.get("from")) ?? decodePlace("aeroport"));
  const [to, setTo] = useState<PickedPlace | null>(() => decodePlace(sp.get("to")));
  const [date, setDate] = useState(() => paramDate(sp.get("date")));
  const [time, setTime] = useState(() => paramTime(sp.get("time"), "10:00"));
  const [adults, setAdults] = useState(() => clampInt(sp.get("adults") ?? sp.get("pax"), 1, 4, 2));
  const [kids, setKids] = useState(() => clampInt(sp.get("kids"), 0, 4 - adults, 0));
  const [extra, setExtra] = useState(() => clampInt(sp.get("extra"), 0, TARIFS.heureSuppMax, 0));
  const bounds = useMemo(() => dateBounds(), []);
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!date) {
      setDate(guadeloupeDate(new Date(Date.now() + 86400000)));
    }
  }, [date]);

  useEffect(() => {
    if (!from || !to) {
      setRoute(null);
      return;
    }
    let alive = true;
    setLoading(true);
    getRoute(from, to).then((r) => {
      if (!alive) return;
      setRoute(r);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [from, to]);

  const dateErr = date ? dateError(date) : null;
  const when = useMemo(() => {
    if (!date || dateError(date)) return new Date();
    return parseGuadeloupeDate(date, isValidTime(time) ? time : "10:00");
  }, [date, time]);

  const same = !!(route && route.km < 0.3);
  const est = route && from && to && !same && !dateErr ? estimate({ fromId: from.id, toId: to.id, km: route.km, date: when, passengers: adults + kids, extraHours: extra }) : null;

  const query = new URLSearchParams({ from: encodePlace(from), to: encodePlace(to), date, time, adults: String(adults), kids: String(kids), extra: String(extra) }).toString();
  const dateFr = formatGuadeloupeDate(when);
  const waText = est && from && to
    ? `Bonjour Vincent, je souhaite réserver une course :\n${from.label} → ${to.label} (aller simple)\nLe ${dateFr} à ${time} (heure de Guadeloupe)\n${adults} adulte${adults > 1 ? "s" : ""}${kids ? `, ${kids} enfant${kids > 1 ? "s" : ""}` : ""}${extra ? `\nTemps supplémentaire : ${extra} h` : ""}\nEstimation à confirmer : ${euro2(est.low)}`
    : "Bonjour Vincent, je souhaite une estimation pour une course.";

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12 lg:px-8">
      {/* Réglages */}
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="rounded-[26px] bg-white p-5 shadow-[0_30px_80px_-40px_rgba(10,70,36,0.45)] ring-1 ring-vert/10 sm:p-8">
        <div className="relative grid grid-cols-1 gap-4">
          <PlacePicker label="Départ" value={from} onChange={setFrom} placeholder="Aéroport, hôtel, adresse…" icon="ph:navigation-arrow-bold" />
          <button type="button" onClick={swap} aria-label="Inverser départ et arrivée" className="absolute top-[70px] right-14 z-20 grid size-11 place-items-center rounded-full bg-or text-vert-900 shadow-md transition-transform hover:rotate-180">
            <Icon name="ph:arrows-down-up-bold" className="size-5" />
          </button>
          <PlacePicker label="Arrivée" value={to} onChange={setTo} placeholder="Commune, plage, port, adresse…" icon="ph:map-pin-bold" />
        </div>

        <div className="mt-5 grid grid-cols-2 items-end gap-4">
          <Field label="Date" icon="ph:calendar-blank-bold" error={dateErr}>
            <input type="date" value={date} min={bounds.min} max={bounds.max} onChange={(e) => setDate(e.target.value)} placeholder="jj/mm/aaaa" className="h-full w-full min-w-0 bg-transparent font-medium outline-none" />
          </Field>
          <Field label="Heure en Guadeloupe" icon="ph:clock-bold">
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} placeholder="10:00" className="h-full w-full min-w-0 bg-transparent font-medium tabular outline-none" />
          </Field>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4">
          <Stepper label="Adultes" icon="ph:users-bold" value={adults} min={1} max={4 - kids} onChange={setAdults} />
          <Stepper label="Enfants" icon="ph:baby-bold" value={kids} min={0} max={4 - adults} onChange={setKids} />
        </div>

        <label className="mt-5 block">
          <span className="mb-1.5 block text-[0.7rem] font-semibold tracking-normal text-gris uppercase min-[400px]:text-[0.78rem] min-[400px]:tracking-wide">Temps supplémentaire</span>
          <span className="flex h-14 items-center gap-3 rounded-[16px] bg-white px-4 ring-1 ring-vert/15 focus-within:ring-2 focus-within:ring-vert">
            <Icon name="ph:hourglass-bold" className="size-5 text-vert" />
            <select value={extra} onChange={(e) => setExtra(Number(e.target.value))} className="h-full w-full bg-transparent font-medium tabular outline-none">
              {Array.from({ length: TARIFS.heureSuppMax + 1 }, (_, h) => (
                <option key={h} value={h}>
                  {h === 0 ? "Aucun" : `${h} heure${h > 1 ? "s" : ""} (+ ${euro2(h * TARIFS.heureSupp)})`}
                </option>
              ))}
            </select>
          </span>
        </label>

        <div className="mt-6 rounded-[16px] bg-menthe p-4 text-sm leading-relaxed text-vert-900">
          <p className="flex items-center gap-2 font-semibold">
            <Icon name="ph:info-bold" className="size-4" /> Comment est calculé le prix
          </p>
          <p className="mt-1.5 text-vert-900/85">
            Aéroport ↔ Bergevin : forfait de {euro2(TARIFS.forfaitAeroportBergevin)}. Autres trajets : {euro2(TARIFS.fraisDepart)} de frais de départ, puis {euro2(TARIFS.kmJour)} par kilomètre de jour (7 h à 19 h, hors dimanches et jours fériés) ou {euro2(TARIFS.kmNuit)} la nuit, le dimanche et les jours fériés. Temps supplémentaire : {euro2(TARIFS.heureSupp)} par heure. Course minimum : {euro2(TARIFS.minimum)}.
          </p>
        </div>
      </motion.div>

      {/* Résultat */}
      <div className="lg:self-start">
        <div className="relative overflow-hidden rounded-[26px] bg-vert-900 p-4 sm:p-6">
          <IslandMap from={from} to={to} route={route?.coords} showPlaces={false} />
          {loading && (
            <span className="absolute top-5 left-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-creme backdrop-blur">
              <Icon name="ph:path-bold" className="size-4 animate-spin text-or" /> Calcul de l&apos;itinéraire
            </span>
          )}
        </div>
        <div className="relative -mt-14 px-3 sm:px-6">
          {est && route && from && to ? (
            <Ticket from={from.label} to={to.label} km={est.km} minutes={route.minutes} est={est} exact={route.exact}>
              <ul className="mt-3 space-y-1 text-sm text-gris tabular">
                {est.lines.map((l) => (
                  <li key={l.label} className="flex justify-between gap-4">
                    <span>{l.label}</span>
                    <span>{euro2(l.value)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-gris">
                Le {dateFr} à {time} (heure de Guadeloupe), aller simple, {adults} adulte{adults > 1 ? "s" : ""}{kids ? `, ${kids} enfant${kids > 1 ? "s" : ""}` : ""}.
              </p>
              <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                <Button href={`/reserver?${query}`} variant="vert" className="w-full" icon="ph:calendar-blank-bold">
                  Réserver ce trajet
                </Button>
                <Button href={whatsappLink(waText)} variant="ligne" className="w-full" icon="si:whatsapp">
                  Par WhatsApp
                </Button>
              </div>
            </Ticket>
          ) : (
            <div className="rounded-[22px] bg-creme p-6 text-center shadow-[0_24px_60px_-28px_rgba(0,0,0,0.45)]">
              <Icon name="ph:ticket-bold" className="mx-auto size-8 text-or-600" />
              <p className="mt-3 font-display text-xl font-bold text-vert-900">{loading ? "Calcul en cours…" : same ? "Départ et arrivée identiques" : dateErr && to ? "Vérifiez la date" : "Choisissez votre arrivée"}</p>
              <p className="mt-1 text-sm text-gris">Le trajet et le prix s&apos;affichent aussitôt.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, icon, error, children }: { label: string; icon: string; error?: string | null; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.7rem] font-semibold tracking-normal text-gris uppercase min-[400px]:text-[0.78rem] min-[400px]:tracking-wide">{label}</span>
      <span className={`flex h-14 items-center gap-3 rounded-[16px] bg-white px-4 ring-1 focus-within:ring-2 focus-within:ring-vert ${error ? "ring-red-400" : "ring-vert/15"}`}>
        <Icon name={icon} className="size-5 text-vert" />
        {children}
      </span>
      {error && (
        <span role="alert" className="mt-1.5 block text-sm font-medium text-red-700">
          {error}
        </span>
      )}
    </label>
  );
}

function Stepper({ label, icon, value, min, max, onChange }: { label: string; icon: string; value: number; min: number; max: number; onChange: (n: number) => void }) {
  return (
    <div>
      <p className="mb-1.5 text-[0.7rem] font-semibold tracking-normal text-gris uppercase min-[400px]:text-[0.78rem] min-[400px]:tracking-wide">{label}</p>
      <div className="flex h-14 items-center justify-between rounded-[16px] bg-creme px-2 ring-1 ring-vert/15">
        <button type="button" aria-label={`Moins de ${label.toLowerCase()}`} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} className="grid size-11 place-items-center rounded-full bg-white text-vert ring-1 ring-vert/15 disabled:opacity-40">
          <Icon name="ph:minus-bold" className="size-4" />
        </button>
        <span className="flex items-center gap-2 font-semibold tabular">
          <Icon name={icon} className="size-5 text-vert max-[399px]:hidden" /> {value}
        </span>
        <button type="button" aria-label={`Plus de ${label.toLowerCase()}`} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} className="grid size-11 place-items-center rounded-full bg-white text-vert ring-1 ring-vert/15 disabled:opacity-40">
          <Icon name="ph:plus-bold" className="size-4" />
        </button>
      </div>
    </div>
  );
}
