"use client";
// Espace de gestion de Vincent. Structure inspirée de Sanity (règle Tom 17/10) : une arborescence toujours visible
// à gauche (ordinateur) ou dans un menu plein écran (téléphone), et le contenu à droite.
// Réservations : la liste des demandes envoyées par le site (pas de planning par créneaux : c'est un taxi).
import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence, useDragControls } from "motion/react";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { VueContenu } from "./contenu";
import { SECTIONS } from "@/lib/admin-contenu";
import { STATUTS_RESA, type ResaAdmin, type StatutResa } from "@/lib/admin-types";

const JOURS = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const dateLongue = (s: string) => { const d = new Date(`${s}T12:00:00`); return Number.isNaN(d.getTime()) ? s : `${JOURS[d.getDay()]} ${d.getDate()} ${MOIS[d.getMonth()]}`; };
const libelle = (s: StatutResa) => STATUTS_RESA.find((x) => x.value === s)?.label ?? s;
const PASTILLE: Record<StatutResa, string> = { nouvelle: "bg-or", confirmee: "bg-vert", effectuee: "bg-gris/50", annulee: "bg-[#b4483a]" };
const qui = (r: ResaAdmin) => r.nom || "Client";
const trajet = (r: ResaAdmin) => [r.depart, r.arrivee].filter(Boolean).join(" → ");
const chiffres = (t?: string) => (t ?? "").replace(/[^\d+]/g, "");
// Numéro saisi par le client -> lien WhatsApp (numéros de Guadeloupe et de métropole sans indicatif)
function whatsapp(t?: string) {
  let n = chiffres(t).replace(/^\+/, "").replace(/^00/, "");
  if (/^0(69|59)\d{7}$/.test(n)) n = `590${n.slice(1)}`;
  else if (/^0[67]\d{8}$/.test(n)) n = `33${n.slice(1)}`;
  return n.length >= 10 ? `https://wa.me/${n}` : "";
}

/* ---------- Arborescence ---------- */
type Vue = { id: string; titre: string; icon: string; section?: string };
const ARBRE: { titre: string; items: Vue[] }[] = [
  { titre: "", items: [{ id: "accueil", titre: "Vue d'ensemble", icon: "ph:house-bold" }] },
  { titre: "Courses", items: [{ id: "reservations", titre: "Réservations reçues", icon: "ph:tray-bold" }] },
  ...SECTIONS.map((g) => ({ titre: g.titre, items: g.items.map((s) => ({ id: `site:${s.id}`, titre: s.titre, icon: s.icon, section: s.id })) })),
  { titre: "Mon compte", items: [{ id: "motdepasse", titre: "Mot de passe", icon: "ph:lock-bold" }] },
];
const toutesVues = ARBRE.flatMap((g) => g.items);

export function AdminApp() {
  const [resas, setResas] = useState<ResaAdmin[] | null>(null);
  const [erreur, setErreur] = useState("");
  const [vue, setVue] = useState("accueil");
  const [menu, setMenu] = useState(false);
  const [ouverte, setOuverte] = useState<ResaAdmin | null>(null);
  const [message, setMessage] = useState("");
  const [occupe, setOccupe] = useState(false);
  const auj = iso(new Date());
  const courante = toutesVues.find((v) => v.id === vue) ?? toutesVues[0];
  const aller = (id: string) => { setVue(id); setMenu(false); window.scrollTo({ top: 0 }); };

  const charger = useCallback(async () => {
    const res = await fetch("/api/admin/reservations", { cache: "no-store" });
    if (res.status === 401) return window.location.replace("/admin/connexion");
    if (!res.ok) return setErreur("Impossible de charger les réservations. Vérifiez votre connexion.");
    setErreur("");
    setResas(((await res.json()) as { resas: ResaAdmin[] }).resas);
  }, []);
  useEffect(() => { Promise.resolve().then(charger); }, [charger]);
  useEffect(() => { if (!message) return; const t = setTimeout(() => setMessage(""), 3200); return () => clearTimeout(t); }, [message]);

  async function changerStatut(r: ResaAdmin, statut: StatutResa, ok: string) {
    setOccupe(true);
    const res = await fetch("/api/admin/reservations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: r._id, statut }) });
    setOccupe(false);
    if (res.status === 401) return window.location.replace("/admin/connexion");
    if (!res.ok) return setMessage("Action impossible, réessayez.");
    setMessage(ok);
    setOuverte(null);
    await charger();
  }

  async function deconnexion() {
    await fetch("/api/admin/login", { method: "DELETE" });
    window.location.replace("/admin/connexion");
  }

  const nbNouvelles = resas?.filter((r) => r.statut === "nouvelle").length ?? 0;
  const arbre = (
    <nav aria-label="Menu de l'espace" className="flex flex-col gap-4">
      {ARBRE.map((g, gi) => (
        <div key={gi}>
          {g.titre && <p className="px-3 pb-1.5 font-sans text-[0.7rem] font-bold tracking-[0.18em] text-or-600 uppercase">{g.titre}</p>}
          <ul className="flex flex-col">
            {g.items.map((it) => {
              const on = it.id === vue;
              return (
                <li key={it.id}>
                  <button
                    onClick={() => aller(it.id)}
                    aria-current={on ? "page" : undefined}
                    className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left font-sans text-[0.93rem] transition-colors lg:py-2", on ? "bg-vert font-semibold text-white" : "text-encre hover:bg-menthe")}
                  >
                    <Icon name={it.icon} className={cn("size-4 shrink-0", on ? "text-soleil" : "text-vert")} />
                    <span className="min-w-0 flex-1 truncate">{it.titre}</span>
                    {it.id === "reservations" && nbNouvelles > 0 && <span className={cn("rounded-full px-2 py-0.5 text-[0.7rem] font-bold", on ? "bg-white text-vert" : "bg-or text-vert-900")}>{nbNouvelles}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="min-h-dvh pb-24">
      <header className="sticky top-0 z-30 bg-vert-900 text-white shadow-[0_10px_30px_-20px_rgba(0,0,0,0.6)]">
        <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/logo-rond.png" alt="Taxi Gwada Vince" className="size-9 rounded-full sm:size-10" />
            <span className="font-sans text-xs font-semibold tracking-[0.2em] text-soleil uppercase">Espace Vincent</span>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" target="_blank" rel="noopener" className="hidden rounded-full px-4 py-2 font-sans text-sm font-semibold text-white hover:bg-white/10 sm:inline-flex">Voir mon site</a>
            <button onClick={deconnexion} className="hidden rounded-full border border-white/30 px-4 py-2 font-sans text-sm font-semibold text-white hover:bg-white/10 lg:inline-flex">Se déconnecter</button>
            <button onClick={() => setMenu(true)} aria-expanded={menu} className="inline-flex items-center gap-2 rounded-full bg-soleil px-4 py-2 font-sans text-sm font-semibold text-vert-900 lg:hidden">
              <Icon name="ph:list-bold" className="size-4" />Menu
            </button>
          </div>
        </div>
      </header>

      {/* Menu plein écran sur téléphone */}
      <AnimatePresence>
        {menu && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 overflow-y-auto bg-creme px-4 pt-4 pb-10 lg:hidden">
            <div className="flex items-center justify-between">
              <p className="font-display text-[1.6rem] font-bold text-encre">Menu</p>
              <button onClick={() => setMenu(false)} aria-label="Fermer le menu" className="grid size-11 place-items-center rounded-full bg-menthe"><Icon name="ph:x-bold" className="size-4 text-vert" /></button>
            </div>
            <div className="mt-4">{arbre}</div>
            <div className="mt-6 flex flex-col gap-2 border-t border-vert/15 pt-5">
              <a href="/" target="_blank" rel="noopener" className="rounded-xl px-3 py-2.5 font-sans font-semibold text-vert">Voir mon site</a>
              <button onClick={deconnexion} className="rounded-xl px-3 py-2.5 text-left font-sans font-semibold text-[#9b2c2c]">Se déconnecter</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto flex max-w-[90rem] gap-8 px-4 pt-6 sm:px-6 lg:pt-8">
        <aside className="sticky top-20 hidden max-h-[calc(100dvh-5.5rem)] w-64 shrink-0 overflow-y-auto pb-4 lg:block">{arbre}</aside>

        <main className="min-w-0 flex-1">
          <button onClick={() => setMenu(true)} className="mb-4 inline-flex items-center gap-2 font-sans text-sm font-semibold text-vert lg:hidden">
            <Icon name={courante.icon} className="size-4 text-or-600" />{courante.titre}<Icon name="ph:caret-down-bold" className="size-3 text-or-600" />
          </button>
          {erreur && <p className="mb-4 rounded-2xl bg-[#f6dcd6] px-5 py-3 font-sans text-sm font-semibold text-[#9b2c2c]">{erreur}</p>}

          {vue === "accueil" && <VueAccueil resas={resas} auj={auj} aller={aller} ouvrir={setOuverte} />}
          {vue === "reservations" && <VueReservations resas={resas} auj={auj} ouvrir={setOuverte} />}
          {vue === "motdepasse" && <VueMotDePasse signaler={setMessage} />}
          {courante.section && <VueContenu key={courante.section} signaler={setMessage} depart={courante.section} sansMenu />}
        </main>
      </div>

      <Fiche resa={ouverte} fermer={() => setOuverte(null)} changer={changerStatut} occupe={occupe} />

      <AnimatePresence>
        {message && (
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} role="status" className="fixed bottom-20 left-1/2 z-50 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-full bg-vert-900 px-5 py-3 text-center font-sans text-sm font-semibold text-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.6)]">
            {message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Une ligne de réservation ---------- */
function Ligne({ r, ouvrir, sombre }: { r: ResaAdmin; ouvrir: (r: ResaAdmin) => void; sombre?: boolean }) {
  return (
    <li>
      <button onClick={() => ouvrir(r)} className={cn("flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-colors", sombre ? "bg-white/10 hover:bg-white/15" : "bg-white hover:bg-menthe/60")}>
        <span className={cn("w-[4.4rem] shrink-0 font-sans text-sm font-semibold tabular", sombre ? "text-soleil" : "text-or-600")}>
          {r.heure}
          <span className="block text-xs font-normal opacity-85">{r.date.slice(8, 10)}/{r.date.slice(5, 7)}</span>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-sans font-semibold">{qui(r)}</span>
          <span className={cn("block truncate font-sans text-sm", sombre ? "text-white/85" : "text-gris")}>{trajet(r)}</span>
        </span>
        <span className={cn("size-2.5 shrink-0 rounded-full", PASTILLE[r.statut])} aria-label={libelle(r.statut)} />
      </button>
    </li>
  );
}

/* ---------- Vue d'ensemble ---------- */
// MCP: 21st.dev « Stats Band » (id 35089) : synthèse du jour en tête
function VueAccueil({ resas, auj, aller, ouvrir }: { resas: ResaAdmin[] | null; auj: string; aller: (id: string) => void; ouvrir: (r: ResaAdmin) => void }) {
  const d = new Date();
  const salut = d.getHours() < 18 ? "Bonjour" : "Bonsoir";
  const actives = (resas ?? []).filter((r) => r.statut === "nouvelle" || r.statut === "confirmee");
  const duJour = actives.filter((r) => r.date === auj).sort((a, b) => a.heure.localeCompare(b.heure));
  const suivantes = actives.filter((r) => r.date > auj).sort((a, b) => (a.date + a.heure).localeCompare(b.date + b.heure)).slice(0, 5);
  const nouvelles = (resas ?? []).filter((r) => r.statut === "nouvelle").slice(0, 5);
  return (
    <section>
      <h1 className="font-display text-[clamp(1.9rem,3.4vw,2.6rem)] font-bold text-encre">{salut}, <span className="text-vert">Vincent.</span></h1>
      <p className="mt-1 font-sans text-sm text-gris">{JOURS[d.getDay()]} {d.getDate()} {MOIS[d.getMonth()]}. Tout se trouve dans le menu <span className="lg:hidden">(bouton « Menu » en haut)</span><span className="hidden lg:inline">à gauche</span>.</p>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <div className="rounded-[1.6rem] bg-vert-900 p-5 text-white sm:p-6">
          <p className="font-sans text-xs font-bold tracking-[0.18em] text-soleil uppercase">Aujourd&apos;hui</p>
          {!resas ? <p className="mt-3 font-sans">Chargement…</p> : duJour.length ? <ul className="mt-3 flex flex-col gap-2">{duJour.map((r) => <Ligne key={r._id} r={r} ouvrir={ouvrir} sombre />)}</ul> : <p className="mt-3 font-display text-[1.4rem] font-bold">Aucune course prévue aujourd&apos;hui.</p>}
          {suivantes.length > 0 && (
            <>
              <p className="mt-5 font-sans text-xs font-bold tracking-[0.18em] text-soleil uppercase">Prochaines courses</p>
              <ul className="mt-2 flex flex-col gap-1">
                {suivantes.map((r) => (
                  <li key={r._id}><button onClick={() => ouvrir(r)} className="w-full truncate rounded-xl px-2 py-1.5 text-left font-sans text-sm hover:bg-white/10">{dateLongue(r.date)} à {r.heure} · {qui(r)}</button></li>
                ))}
              </ul>
            </>
          )}
          <button onClick={() => aller("reservations")} className="mt-5 inline-flex items-center gap-2 rounded-full bg-soleil px-5 py-2.5 font-sans text-sm font-semibold text-vert-900">Toutes les réservations <Icon name="ph:arrow-right-bold" className="size-3.5" /></button>
        </div>
        <div className="rounded-[1.6rem] bg-white p-5 sm:p-6">
          <p className="font-sans text-xs font-bold tracking-[0.18em] text-or-600 uppercase">Nouvelles demandes à confirmer</p>
          {!resas ? <p className="mt-3 font-sans text-gris">Chargement…</p> : nouvelles.length ? <ul className="mt-3 flex flex-col gap-2">{nouvelles.map((r) => <Ligne key={r._id} r={r} ouvrir={ouvrir} />)}</ul> : <p className="mt-3 font-sans text-gris">Aucune nouvelle demande. Tout est à jour.</p>}
          <p className="mt-4 font-sans text-xs text-gris">Chaque demande envoyée sur le site arrive aussi dans votre boîte e-mail. Confirmez au client par WhatsApp ou téléphone, puis touchez « Course confirmée ».</p>
        </div>
      </div>

      <p className="mt-10 font-sans text-xs font-bold tracking-[0.18em] text-or-600 uppercase">Modifier mon site</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {SECTIONS.flatMap((g) => g.items).map((s) => (
          <button key={s.id} onClick={() => aller(`site:${s.id}`)} className="group flex items-center gap-4 rounded-[1.4rem] bg-white p-4 text-left transition-colors hover:bg-menthe/60">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-menthe"><Icon name={s.icon} className="size-5 text-vert" /></span>
            <span className="min-w-0">
              <span className="block font-sans font-semibold text-encre">{s.titre}</span>
              <span className="block font-sans text-sm text-gris">{s.aide}</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

/* ---------- Réservations reçues ---------- */
// MCP: 21st.dev « Meeting Booking Calendar » (id 38035) : liste des demandes, pastille de statut, fiche client
function VueReservations({ resas, auj, ouvrir }: { resas: ResaAdmin[] | null; auj: string; ouvrir: (r: ResaAdmin) => void }) {
  const [onglet, setOnglet] = useState<"venir" | "passees">("venir");
  const venir = (resas ?? []).filter((r) => r.date >= auj).sort((a, b) => (a.date + a.heure).localeCompare(b.date + b.heure));
  const passees = (resas ?? []).filter((r) => r.date < auj);
  const liste = onglet === "venir" ? venir : passees;
  // Regroupement par jour
  const jours = [...new Set(liste.map((r) => r.date))];
  return (
    <section>
      <h1 className="font-display text-[clamp(1.6rem,3vw,2.2rem)] font-bold text-encre">Réservations <span className="text-vert">reçues</span></h1>
      <p className="mt-2 font-sans text-sm text-gris">Les demandes envoyées avec le formulaire du site. Touchez une course pour voir le détail, appeler ou écrire au client.</p>
      <div className="mt-5 inline-flex rounded-full bg-white p-1">
        {([["venir", `À venir (${venir.length})`], ["passees", `Passées (${passees.length})`]] as const).map(([k, t]) => (
          <button key={k} onClick={() => setOnglet(k)} className={cn("rounded-full px-4 py-2 font-sans text-sm font-semibold transition-colors", onglet === k ? "bg-vert text-white" : "text-vert hover:bg-menthe")}>{t}</button>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-sans text-xs text-gris">
        {STATUTS_RESA.map((s) => <span key={s.value} className="inline-flex items-center gap-1.5"><span className={cn("size-2 rounded-full", PASTILLE[s.value])} />{s.label}</span>)}
      </div>
      {!resas ? (
        <p className="py-16 text-center font-sans text-gris">Chargement…</p>
      ) : liste.length === 0 ? (
        <p className="mt-6 rounded-[1.4rem] bg-white px-6 py-10 text-center font-sans text-gris">{onglet === "venir" ? "Aucune course à venir pour le moment." : "Aucune course passée."}</p>
      ) : (
        <div className="mt-6 flex flex-col gap-6">
          {jours.map((j) => (
            <div key={j}>
              <p className={cn("font-sans text-sm font-semibold", j === auj ? "text-vert" : "text-encre")}>{j === auj ? "Aujourd'hui, " : ""}{dateLongue(j)}</p>
              <ul className="mt-2 grid gap-2 lg:grid-cols-2">{liste.filter((r) => r.date === j).map((r) => <Ligne key={r._id} r={r} ouvrir={ouvrir} />)}</ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* ---------- Mot de passe ---------- */
// MCP: 21st.dev « Login Card » (id 28353) : champs mot de passe avec bouton Afficher
function VueMotDePasse({ signaler }: { signaler: (m: string) => void }) {
  const [actuel, setActuel] = useState("");
  const [nouveau, setNouveau] = useState("");
  const [confirme, setConfirme] = useState("");
  const [voir, setVoir] = useState(false);
  const [erreur, setErreur] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const champ = "mt-1.5 w-full rounded-full border border-vert/20 bg-white px-4 py-3 font-sans text-[0.98rem] text-encre outline-none focus:border-or";
  const assezLong = nouveau.length >= 10;
  const pareil = nouveau.length > 0 && nouveau === confirme;

  async function valider(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");
    if (!assezLong) return setErreur("Le nouveau mot de passe doit faire au moins 10 caractères.");
    if (!pareil) return setErreur("Les deux nouveaux mots de passe ne sont pas identiques.");
    setEnvoi(true);
    const r = await fetch("/api/admin/mot-de-passe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ actuel, nouveau }) });
    setEnvoi(false);
    const j = await r.json().catch(() => ({}));
    if (r.status === 401 && !j.erreur) return window.location.replace("/admin/connexion");
    if (!r.ok) return setErreur(j.erreur ?? "Changement impossible.");
    setActuel(""); setNouveau(""); setConfirme("");
    signaler("Mot de passe changé : utilisez le nouveau à la prochaine connexion");
  }

  return (
    <section className="max-w-xl">
      <h1 className="font-display text-[clamp(1.6rem,3vw,2.2rem)] font-bold text-encre">Votre <span className="text-vert">mot de passe</span></h1>
      <p className="mt-2 font-sans text-sm text-gris">Choisissez un mot de passe d&apos;au moins 10 caractères, que vous seul connaissez. Une phrase courte est plus facile à retenir, par exemple « taxi-du-gosier-2026 ».</p>
      <form onSubmit={valider} className="mt-6 flex flex-col gap-4 rounded-[1.4rem] bg-white p-5 sm:p-6">
        <label className="font-sans text-sm font-semibold text-vert">Mot de passe actuel
          <input type={voir ? "text" : "password"} autoComplete="current-password" required value={actuel} onChange={(e) => setActuel(e.target.value)} placeholder="Votre mot de passe actuel" className={champ} />
        </label>
        <label className="font-sans text-sm font-semibold text-vert">Nouveau mot de passe
          <input type={voir ? "text" : "password"} autoComplete="new-password" required value={nouveau} onChange={(e) => setNouveau(e.target.value)} placeholder="Au moins 10 caractères" className={champ} />
          <span className={cn("mt-1 block font-normal", assezLong ? "text-vert-700" : "text-gris")}>{assezLong ? "Longueur suffisante" : `${nouveau.length} / 10 caractères minimum`}</span>
        </label>
        <label className="font-sans text-sm font-semibold text-vert">Nouveau mot de passe, une deuxième fois
          <input type={voir ? "text" : "password"} autoComplete="new-password" required value={confirme} onChange={(e) => setConfirme(e.target.value)} placeholder="Le même, pour vérifier" className={champ} />
          {confirme && <span className={cn("mt-1 block font-normal", pareil ? "text-vert-700" : "text-[#9b2c2c]")}>{pareil ? "Identiques" : "Pas encore identiques"}</span>}
        </label>
        <button type="button" onClick={() => setVoir((v) => !v)} className="self-start font-sans text-sm font-semibold text-vert underline underline-offset-4">{voir ? "Masquer les mots de passe" : "Afficher les mots de passe"}</button>
        {erreur && <p className="rounded-2xl bg-[#f6dcd6] px-4 py-3 font-sans text-sm font-semibold text-[#9b2c2c]">{erreur}</p>}
        <button disabled={envoi} className="rounded-full bg-vert py-3.5 font-sans font-semibold text-white hover:bg-vert-900 disabled:opacity-60">{envoi ? "Enregistrement…" : "Changer mon mot de passe"}</button>
      </form>
    </section>
  );
}

/* ---------- Fiche d'une course ---------- */
// MCP: 21st.dev « Drawer » (id 31360) : feuille du bas, poignée, glisser pour fermer, lignes de détail
function Fiche({ resa, fermer, changer, occupe }: { resa: ResaAdmin | null; fermer: () => void; changer: (r: ResaAdmin, s: StatutResa, ok: string) => void; occupe: boolean }) {
  const [confirmerAnnulation, setConfirmerAnnulation] = useState(false);
  const glisser = useDragControls();
  useEffect(() => { Promise.resolve().then(() => setConfirmerAnnulation(false)); }, [resa?._id]);
  const wa = whatsapp(resa?.telephone);
  return (
    <AnimatePresence>
      {resa && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={fermer} className="fixed inset-0 z-40 bg-vert-900/50" />
          <motion.aside
            role="dialog"
            aria-label="Détail de la course"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            drag="y"
            dragListener={false}
            dragControls={glisser}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, i) => { if (i.offset.y > 110 || i.velocity.y > 600) fermer(); }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[88dvh] overflow-y-auto rounded-t-[2rem] bg-white p-6 shadow-[0_-30px_60px_-30px_rgba(0,0,0,0.6)] sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[27rem] sm:rounded-[2rem]"
          >
            <div onPointerDown={(e) => glisser.start(e)} className="-mx-6 -mt-6 mb-2 flex cursor-grab touch-none justify-center pt-3 pb-3 sm:hidden" aria-hidden>
              <span className="h-1.5 w-10 rounded-full bg-vert/25" />
            </div>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-sans text-xs font-bold tracking-[0.14em] text-or-600 uppercase">{dateLongue(resa.date)} · {resa.heure}</p>
                <h2 className="mt-1 font-display text-[1.7rem] font-bold text-encre">{qui(resa)}</h2>
              </div>
              <button onClick={fermer} aria-label="Fermer" className="grid size-10 shrink-0 place-items-center rounded-full bg-menthe"><Icon name="ph:x-bold" className="size-4 text-vert" /></button>
            </div>
            <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-menthe px-3 py-1 font-sans text-xs font-semibold text-vert">
              <span className={cn("size-2 rounded-full", PASTILLE[resa.statut])} />{libelle(resa.statut)}
            </span>

            <dl className="mt-5 flex flex-col divide-y divide-vert/10 font-sans text-sm">
              {[
                ["Départ", resa.depart],
                ["Arrivée", resa.arrivee],
                ["Passagers", resa.adultes != null ? `${resa.adultes} adulte${(resa.adultes ?? 0) > 1 ? "s" : ""}${resa.enfants ? `, ${resa.enfants} enfant${resa.enfants > 1 ? "s" : ""}` : ""}` : ""],
                ["Valises", resa.valises != null ? String(resa.valises) : ""],
                ["Siège enfant", resa.siegeEnfant ? "Oui" : ""],
                ["Vol ou bateau", resa.vol],
                ["Temps supplémentaire", resa.heuresSupp ? `${resa.heuresSupp} h` : ""],
                ["Estimation affichée", [resa.estimation, resa.km ? `${resa.km} km` : ""].filter(Boolean).join(" · ")],
                ["Téléphone", resa.telephone],
                ["E-mail", resa.email],
                ["Répondre par", resa.contact],
                ["Référence", resa.reference],
                ["Reçue le", resa.creeLe ? new Date(resa.creeLe).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" }) : ""],
              ].filter(([, v]) => v).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-2.5">
                  <dt className="shrink-0 text-gris">{k}</dt>
                  <dd className="min-w-0 text-right font-semibold break-words text-encre">{v}</dd>
                </div>
              ))}
            </dl>
            {resa.message && <p className="mt-3 rounded-2xl bg-menthe px-4 py-3 font-sans text-sm text-encre">« {resa.message} »</p>}

            <div className="mt-5 grid grid-cols-2 gap-2">
              {resa.telephone && <a href={`tel:${chiffres(resa.telephone)}`} className="flex items-center justify-center gap-2 rounded-full border border-vert/20 py-2.5 font-sans text-sm font-semibold text-vert hover:border-or"><Icon name="ph:phone-bold" className="size-4" />Appeler</a>}
              {wa && <a href={wa} target="_blank" rel="noopener" className="flex items-center justify-center gap-2 rounded-full border border-vert/20 py-2.5 font-sans text-sm font-semibold text-vert hover:border-or"><Icon name="si:whatsapp" className="size-4" />WhatsApp</a>}
              {resa.email && <a href={`mailto:${resa.email}`} className="col-span-2 flex items-center justify-center gap-2 rounded-full border border-vert/20 py-2.5 font-sans text-sm font-semibold text-vert hover:border-or"><Icon name="ph:envelope-simple-bold" className="size-4" />Écrire un e-mail</a>}
            </div>

            <div className="mt-5 flex flex-col gap-2">
              {resa.statut === "nouvelle" && <button disabled={occupe} onClick={() => changer(resa, "confirmee", "Course notée comme confirmée")} className="rounded-full bg-vert py-3 font-sans font-semibold text-white hover:bg-vert-900">Course confirmée</button>}
              {resa.statut === "confirmee" && <button disabled={occupe} onClick={() => changer(resa, "effectuee", "Course notée comme effectuée")} className="rounded-full bg-vert py-3 font-sans font-semibold text-white hover:bg-vert-900">Course effectuée</button>}
              {(resa.statut === "annulee" || resa.statut === "effectuee") && <button disabled={occupe} onClick={() => changer(resa, "confirmee", "Course remise en « Confirmée »")} className="rounded-full border border-vert/20 py-3 font-sans font-semibold text-vert">Remettre en « Confirmée »</button>}
              {resa.statut !== "annulee" && (
                confirmerAnnulation ? (
                  <div className="rounded-2xl bg-[#f6dcd6] p-4">
                    <p className="font-sans text-sm font-semibold text-[#9b2c2c]">Noter cette course comme annulée ? Pensez à prévenir le client.</p>
                    <div className="mt-3 flex gap-2">
                      <button disabled={occupe} onClick={() => changer(resa, "annulee", "Course annulée")} className="flex-1 rounded-full bg-[#9b2c2c] py-2.5 font-sans text-sm font-semibold text-white">Oui, annuler</button>
                      <button onClick={() => setConfirmerAnnulation(false)} className="flex-1 rounded-full border border-[#9b2c2c]/30 py-2.5 font-sans text-sm font-semibold text-[#9b2c2c]">Non</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setConfirmerAnnulation(true)} className="rounded-full py-2.5 font-sans text-sm font-semibold text-[#9b2c2c] hover:bg-[#f6dcd6]/60">Annuler la course</button>
                )
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
