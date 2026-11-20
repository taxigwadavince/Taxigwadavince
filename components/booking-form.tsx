"use client";

// MCP: "booking form multi step" -> Multi-Step Form (21st.dev #8281) : barre de progression, étapes qui glissent en
// ressort (AnimatePresence mode="wait"), pied Retour / Étape suivante. Adapté : 4 étapes taxi (trajet, options,
// coordonnées, récapitulatif + conditions), validation par étape, pré-remplissage depuis l'estimateur (URL),
// envoi /api/reservation puis confirmation WhatsApp (INSPIRATION: David Location ContactForm.tsx, 4 écrans).
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { PlacePicker, decodePlace, type PickedPlace } from "./place-picker";
import { Icon } from "./icons";
import { Button } from "./ui";
import { Ticket } from "./ticket";
import { getRoute, type RouteResult } from "@/lib/route";
import { estimate, TARIFS } from "@/lib/tarifs";
import { cn, duree, euro2 } from "@/lib/utils";
import { parseGuadeloupeDate, formatGuadeloupeDate } from "@/lib/guadeloupe-time";
import { clampInt, dateBounds, dateError, isValidDate, isValidEmail, isValidName, isValidPhone, isValidTime, LIMITS, paramDate, paramTime, sanitizePhone } from "@/lib/validation";

const STEPS = [
  { id: 1, title: "Votre trajet", icon: "ph:path-bold" },
  { id: 2, title: "Options", icon: "ph:suitcase-rolling-bold" },
  { id: 3, title: "Coordonnées", icon: "ph:users-bold" },
  { id: 4, title: "Récapitulatif", icon: "ph:check-circle-bold" },
];

export function BookingForm() {
  const sp = useSearchParams();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [from, setFrom] = useState<PickedPlace | null>(() => decodePlace(sp.get("from")));
  const [to, setTo] = useState<PickedPlace | null>(() => decodePlace(sp.get("to")));
  const [date, setDate] = useState(() => paramDate(sp.get("date")));
  const [time, setTime] = useState(() => paramTime(sp.get("time")));
  const [adults, setAdults] = useState(() => clampInt(sp.get("adults") ?? sp.get("pax"), 1, 4, 1));
  const [kids, setKids] = useState(() => clampInt(sp.get("kids"), 0, 4 - adults, 0));
  const [bags, setBags] = useState(1);
  const [flight, setFlight] = useState("");
  const [child, setChild] = useState(false);
  const [extra, setExtra] = useState(() => clampInt(sp.get("extra"), 0, TARIFS.heureSuppMax, 0));
  const bounds = useMemo(() => dateBounds(), []);
  const [note, setNote] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState<"WhatsApp" | "Appel" | "E-mail">("WhatsApp");
  const [cgv, setCgv] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");

  useEffect(() => {
    if (!from || !to) {
      setRoute(null);
      return;
    }
    let alive = true;
    setRouteLoading(true);
    getRoute(from, to).then((r) => {
      if (!alive) return;
      setRoute(r);
      setRouteLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [from, to]);

  const when = useMemo(() => {
    if (!isValidDate(date) || !isValidTime(time)) return null;
    return parseGuadeloupeDate(date, time);
  }, [date, time]);

  const est = route && from && to && when ? estimate({ fromId: from.id, toId: to.id, km: route.km, date: when, passengers: adults + kids, extraHours: extra }) : null;

  const validate = (s: number) => {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (!from) e.from = "Choisissez un lieu de départ dans la liste.";
      if (!to) e.to = "Choisissez un lieu d'arrivée dans la liste.";
      const dErr = dateError(date);
      if (dErr) e.date = dErr;
      if (!time) e.time = "Indiquez l'heure de prise en charge.";
      else if (!isValidTime(time)) e.time = "Heure invalide.";
      if (!e.date && !e.time && when && when.getTime() < Date.now() - 5 * 60000) e.time = "Cette heure est déjà passée.";
    }
    if (s === 3) {
      if (!isValidName(name)) e.name = "Indiquez votre nom (au moins 2 lettres).";
      if (!isValidPhone(phone)) e.phone = "Numéro invalide : 9 à 15 chiffres (ex. 0690 12 34 56).";
      if (contact === "E-mail" && !email.trim()) e.email = "Indiquez votre e-mail pour être confirmé par e-mail.";
      else if (email.trim() && !isValidEmail(email)) e.email = "Adresse e-mail invalide (ex. marie@email.fr).";
    }
    if (s === 4 && !cgv) e.cgv = "Merci d'accepter les conditions de réservation.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validate(step)) return;
    setDir(1);
    setStep((s) => Math.min(4, s + 1));
    window.scrollTo({ top: document.getElementById("booking")!.offsetTop - 90, behavior: "smooth" });
  };
  const back = () => {
    setDir(-1);
    setStep((s) => Math.max(1, s - 1));
  };

  const dateFr = when ? formatGuadeloupeDate(when) : "";
  const estText = est ? euro2(est.low) : "à confirmer";
  const paxText = `${adults} adulte${adults > 1 ? "s" : ""}${kids ? `, ${kids} enfant${kids > 1 ? "s" : ""}` : ""}`;

  const submit = async () => {
    if (!validate(4)) return;
    setSending(true);
    setSendError("");
    const payload = {
      from: from?.label, fromSub: from?.sub, to: to?.label, toSub: to?.sub, date, time, dateFr,
      adults, children: kids, passengers: adults + kids, bags, flight, childSeat: child, extraHours: extra, note,
      name, phone, email, contact, estimate: estText, km: est ? est.km : null,
    };
    try {
      const res = await fetch("/api/reservation", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const json = await res.json();
      if (!res.ok || !json.ref) throw new Error(json.error || "Envoi impossible");
      const q = new URLSearchParams({ ref: json.ref, from: payload.from ?? "", to: payload.to ?? "", quand: `${dateFr} à ${time} (heure de Guadeloupe)`, pax: paxText, est: estText, sent: json.sent ? "1" : "0" });
      router.push(`/reserver/merci?${q.toString()}`);
    } catch {
      setSendError("L'envoi n'a pas abouti. Réessayez ou appelez Vincent au 0690 64 75 63.");
      setSending(false);
    }
  };

  const progress = (step / STEPS.length) * 100;

  return (
    <div id="booking" className="mx-auto grid max-w-[1200px] grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:px-8">
      <div className="rounded-[26px] bg-white shadow-[0_30px_80px_-40px_rgba(10,70,36,0.45)] ring-1 ring-vert/10">
        {/* En-tête : étapes + progression */}
        <div className="border-b border-vert/10 p-5 sm:p-7">
          <ol className="flex items-center justify-between gap-2">
            {STEPS.map((s) => (
              <li key={s.id} className="flex flex-1 items-center gap-2">
                <span className={cn("grid size-10 shrink-0 place-items-center rounded-full transition-colors", step > s.id ? "bg-vert text-or" : step === s.id ? "bg-or text-vert-900" : "bg-creme text-gris")}>
                  <Icon name={step > s.id ? "ph:check-bold" : s.icon} className="size-5" />
                </span>
                <span className={cn("hidden text-sm font-semibold md:block", step >= s.id ? "text-vert-900" : "text-gris")}>{s.title}</span>
              </li>
            ))}
          </ol>
          <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-creme">
            <motion.div className="h-full rounded-full bg-or" animate={{ width: `${progress}%` }} transition={{ type: "spring", stiffness: 200, damping: 30 }} />
          </div>
          <p className="mt-3 text-sm text-gris">
            Étape {step} sur 4 · <span className="font-semibold text-vert-900">{STEPS[step - 1].title}</span>
          </p>
        </div>

        <div className="overflow-hidden p-5 sm:p-7">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              initial={{ opacity: 0, x: dir * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -60 }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
            >
              {step === 1 && (
                <div className="grid grid-cols-1 gap-5">
                  <div>
                    <PlacePicker label="Départ" value={from} onChange={setFrom} placeholder="Aéroport, hôtel, adresse…" icon="ph:navigation-arrow-bold" />
                    <Err msg={errors.from} />
                  </div>
                  <div>
                    <PlacePicker label="Arrivée" value={to} onChange={setTo} placeholder="Commune, port, plage, adresse…" icon="ph:map-pin-bold" />
                    <Err msg={errors.to} />
                  </div>
                  <div className="grid grid-cols-2 items-end gap-4">
                    <Field label="Date" icon="ph:calendar-blank-bold" error={errors.date}>
                      <input type="date" value={date} min={bounds.min} max={bounds.max} onChange={(e) => setDate(e.target.value)} placeholder="jj/mm/aaaa" className="h-full w-full min-w-0 bg-transparent font-medium outline-none" />
                    </Field>
                    <Field label="Heure en Guadeloupe" icon="ph:clock-bold" error={errors.time}>
                      <input type="time" value={time} onChange={(e) => setTime(e.target.value)} placeholder="08:30" className="h-full w-full min-w-0 bg-transparent font-medium tabular outline-none" />
                    </Field>
                  </div>
                  <p className="flex items-center gap-2 rounded-[16px] bg-creme px-4 py-3 text-sm font-semibold text-vert-900 ring-1 ring-vert/15">
                    <Icon name="ph:arrow-right-bold" className="size-4 text-vert" /> Type de transfert : aller simple
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-[16px] bg-menthe px-4 py-3 ring-1 ring-vert/15">
                      <p className="text-[0.72rem] font-semibold tracking-wide text-vert-900/70 uppercase">Distance totale</p>
                      <p className="mt-0.5 flex items-center gap-1.5 font-display text-lg font-bold text-vert-900 tabular">
                        <Icon name="ph:path-bold" className="size-4 text-vert" />
                        {routeLoading ? "…" : route ? `${route.exact ? "" : "≈ "}${route.km.toFixed(1).replace(".", ",")} km` : "0 km"}
                      </p>
                    </div>
                    <div className="rounded-[16px] bg-menthe px-4 py-3 ring-1 ring-vert/15">
                      <p className="text-[0.72rem] font-semibold tracking-wide text-vert-900/70 uppercase">Temps total</p>
                      <p className="mt-0.5 flex items-center gap-1.5 font-display text-lg font-bold text-vert-900 tabular">
                        <Icon name="ph:clock-bold" className="size-4 text-vert" />
                        {routeLoading ? "…" : route ? duree(route.minutes) : "0 min"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="grid grid-cols-1 gap-5">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Stepper label="Adultes" icon="ph:users-bold" value={adults} min={1} max={4 - kids} onChange={setAdults} />
                    <Stepper label="Enfants" icon="ph:baby-bold" value={kids} min={0} max={4 - adults} onChange={setKids} />
                    <Stepper label="Valises" icon="ph:suitcase-rolling-bold" value={bags} min={0} max={6} onChange={setBags} />
                  </div>
                  <Field label="N° de vol ou de bateau (facultatif)" icon="ph:paper-plane-tilt-bold">
                    <input value={flight} onChange={(e) => setFlight(e.target.value)} maxLength={LIMITS.flight} placeholder="Ex. AF 792, arrivée 16h10" className="h-full w-full bg-transparent font-medium outline-none" />
                  </Field>
                  <Toggle on={child} onChange={setChild} label="Siège enfant ou rehausseur" icon="ph:baby-bold" />
                  <Field label="Temps supplémentaire" icon="ph:hourglass-bold">
                    <select value={extra} onChange={(e) => setExtra(Number(e.target.value))} className="h-full w-full bg-transparent font-medium tabular outline-none">
                      {Array.from({ length: TARIFS.heureSuppMax + 1 }, (_, h) => (
                        <option key={h} value={h}>
                          {h === 0 ? "Aucun" : `${h} heure${h > 1 ? "s" : ""} (+ ${euro2(h * TARIFS.heureSupp)})`}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <label className="block">
                    <span className="mb-1.5 block text-[0.7rem] font-semibold tracking-normal text-gris uppercase min-[400px]:text-[0.78rem] min-[400px]:tracking-wide">Message pour Vincent (facultatif)</span>
                    <textarea value={note} onChange={(e) => setNote(e.target.value)} maxLength={LIMITS.note} rows={3} placeholder="Ex. nous serons 2 adultes et un bébé, arrêt rapide à la pharmacie…" className="w-full rounded-[16px] bg-white p-4 font-medium ring-1 ring-vert/15 outline-none focus:ring-2 focus:ring-vert" />
                    <span className="mt-1 block text-right text-xs text-gris tabular">{note.length}/{LIMITS.note}</span>
                  </label>
                </div>
              )}

              {step === 3 && (
                <div className="grid grid-cols-1 gap-5">
                  <Field label="Nom et prénom" icon="ph:users-bold" error={errors.name}>
                    <input value={name} onChange={(e) => setName(e.target.value)} maxLength={LIMITS.name} autoComplete="name" placeholder="Ex. Marie Dupont" className="h-full w-full bg-transparent font-medium outline-none" />
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Téléphone" icon="ph:phone-bold" error={errors.phone}>
                      <input type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(sanitizePhone(e.target.value))} maxLength={LIMITS.phone} autoComplete="tel" placeholder="Ex. 0690 12 34 56" className="h-full w-full bg-transparent font-medium outline-none" />
                    </Field>
                    <Field label={contact === "E-mail" ? "E-mail" : "E-mail (facultatif)"} icon="ph:envelope-simple-bold" error={errors.email}>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value.trim())} maxLength={LIMITS.email} autoComplete="email" placeholder="Ex. marie@email.fr" className="h-full w-full bg-transparent font-medium outline-none" />
                    </Field>
                  </div>
                  <div>
                    <p className="mb-1.5 text-[0.7rem] font-semibold tracking-normal text-gris uppercase min-[400px]:text-[0.78rem] min-[400px]:tracking-wide">Confirmation souhaitée par</p>
                    <div className="grid grid-cols-3 gap-2">
                      {(["WhatsApp", "Appel", "E-mail"] as const).map((c) => (
                        <button key={c} type="button" onClick={() => setContact(c)} aria-pressed={contact === c} className={cn("flex h-12 items-center justify-center gap-2 rounded-[14px] text-sm font-semibold ring-1 transition-colors", contact === c ? "bg-vert text-creme ring-vert" : "bg-white text-vert ring-vert/15 hover:bg-menthe")}>
                          <Icon name={c === "WhatsApp" ? "si:whatsapp" : c === "Appel" ? "ph:phone-bold" : "ph:envelope-simple-bold"} className="size-4" />
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed text-gris">
                    Vos coordonnées servent uniquement à organiser votre course. Voir la <Link href="/confidentialite" className="font-semibold text-vert underline underline-offset-2">politique de confidentialité</Link>.
                  </p>
                </div>
              )}

              {step === 4 && (
                <div className="grid grid-cols-1 gap-5">
                  <dl className="grid gap-3 rounded-[18px] bg-creme p-5 text-[0.95rem]">
                    <Row k="Trajet" v={`${from?.label ?? ""} → ${to?.label ?? ""} (aller simple)`} />
                    <Row k="Prise en charge" v={`${dateFr} à ${time} (heure de Guadeloupe)`} />
                    <Row k="Passagers" v={`${paxText} · ${bags} valise${bags > 1 ? "s" : ""}${child ? " · siège enfant" : ""}`} />
                    {flight && <Row k="Vol / bateau" v={flight} />}
                    {extra > 0 && <Row k="Temps supplémentaire" v={`${extra} h`} />}
                    <Row k="Contact" v={`${name} · ${phone} · ${contact}`} />
                    {est?.lines.map((l) => <Row key={l.label} k={l.label} v={euro2(l.value)} />)}
                    <Row k="Total estimé" v={estText} strong />
                  </dl>
                  <label className="flex cursor-pointer items-start gap-3 rounded-[16px] p-1">
                    <input type="checkbox" checked={cgv} onChange={(e) => setCgv(e.target.checked)} className="mt-1 size-5 accent-[#0a4624]" />
                    <span className="text-sm leading-relaxed text-gris">
                      J&apos;accepte les <Link href="/cgv" target="_blank" className="font-semibold text-vert underline underline-offset-2">conditions de réservation</Link>. Paiement à bord par carte ou en espèces.
                    </span>
                  </label>
                  <Err msg={errors.cgv} />
                  {sendError && <p className="rounded-[14px] bg-red-50 p-3 text-sm font-medium text-red-800">{sendError}</p>}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-vert/10 p-5 sm:p-7">
          {step > 1 ? (
            <button type="button" onClick={back} className="inline-flex h-12 items-center gap-2 rounded-full px-4 font-semibold text-vert ring-1 ring-vert/20 hover:bg-menthe">
              <Icon name="ph:arrow-left-bold" className="size-4" /> Retour
            </button>
          ) : (
            <span />
          )}
          {step < 4 ? (
            <Button onClick={next} variant="vert">
              Étape suivante
            </Button>
          ) : (
            <Button onClick={submit} disabled={sending} icon={sending ? "ph:hourglass-bold" : "ph:paper-plane-tilt-bold"}>
              {sending ? "Envoi…" : "Envoyer ma demande"}
            </Button>
          )}
        </div>
      </div>

      {/* Colonne récap toujours visible */}
      <aside className="lg:self-start">
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
          </Ticket>
        ) : (
          <div className="rounded-[22px] bg-vert-900 p-6 text-creme">
            <Icon name="ph:ticket-bold" className="size-8 text-or" />
            <p className="mt-3 font-display text-xl font-bold">Votre ticket de course</p>
            <p className="mt-1 text-sm text-creme/85">Renseignez le trajet, la date et l&apos;heure : le prix s&apos;affiche ici.</p>
          </div>
        )}
        <div className="mt-5 grid gap-3 rounded-[22px] bg-menthe p-5 text-sm text-vert-900">
          {[
            { i: "ph:seal-check-bold", t: "Confirmation par Vincent, avec l'heure exacte" },
            { i: "ph:credit-card-bold", t: "Paiement à bord, carte ou espèces" },
            { i: "ph:clock-countdown-bold", t: "Courses de nuit et départs très tôt acceptés" },
          ].map((x) => (
            <p key={x.t} className="flex items-center gap-3 font-medium">
              <Icon name={x.i} className="size-5 text-vert" /> {x.t}
            </p>
          ))}
        </div>
      </aside>
    </div>
  );
}

function Err({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p role="alert" className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-red-700">
      <Icon name="ph:info-bold" className="size-4" /> {msg}
    </p>
  );
}

function Field({ label, icon, error, children }: { label: string; icon: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.7rem] font-semibold tracking-normal text-gris uppercase min-[400px]:text-[0.78rem] min-[400px]:tracking-wide">{label}</span>
      <span className={cn("flex h-14 items-center gap-3 rounded-[16px] bg-white px-4 ring-1 focus-within:ring-2 focus-within:ring-vert", error ? "ring-red-400" : "ring-vert/15")}>
        <Icon name={icon} className="size-5 text-vert" />
        {children}
      </span>
      <Err msg={error} />
    </label>
  );
}

function Toggle({ on, onChange, label, icon }: { on: boolean; onChange: (v: boolean) => void; label: string; icon: string }) {
  return (
    <button type="button" onClick={() => onChange(!on)} aria-pressed={on} className="flex min-h-14 w-full items-center justify-between rounded-[16px] bg-creme px-4 ring-1 ring-vert/15">
      <span className="flex items-center gap-3 font-semibold text-vert-900">
        <Icon name={icon} className="size-5 text-vert" /> {label}
      </span>
      <span className={cn("relative h-7 w-12 rounded-full transition-colors", on ? "bg-vert" : "bg-vert/20")}>
        <span className={cn("absolute top-1 left-0 size-5 rounded-full bg-white shadow transition-transform", on ? "translate-x-6" : "translate-x-1")} />
      </span>
    </button>
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

function Row({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return (
    <div className="flex flex-wrap justify-between gap-x-4 gap-y-0.5">
      <dt className="text-gris">{k}</dt>
      <dd className={cn("text-right text-vert-900", strong ? "font-bold tabular" : "font-semibold")}>{v}</dd>
    </div>
  );
}
