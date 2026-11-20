"use client";
// Onglet « Mon site » de l'espace de gestion de Vincent : textes, photos, services, avis, FAQ, tarifs, coordonnées.
// Les formulaires sont construits à partir des schémas du Studio (lib/admin-contenu.ts) : rien à coder par champ.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { SECTIONS, schemaDe, type Champ, type Section } from "@/lib/admin-contenu";

type Doc = Record<string, unknown> & { _id?: string };
type Ctx = { pid: string; ds: string };

const champInput = "w-full rounded-2xl border border-vert/20 bg-white px-4 py-3 font-sans text-[0.98rem] text-encre outline-none transition-colors focus:border-or";
const btnClair = "inline-flex items-center justify-center gap-2 rounded-full border border-vert/20 bg-white px-4 py-2 font-sans text-sm font-semibold text-vert transition-colors hover:border-or";

// Adresse d'une photo ou d'une vidéo Sanity à partir de sa référence
function urlAsset(ref: string | undefined, ctx: Ctx, largeur = 600) {
  if (!ref) return "";
  const img = ref.match(/^image-([a-f0-9]+-\d+x\d+)-([a-z0-9]+)$/);
  if (img) return `https://cdn.sanity.io/images/${ctx.pid}/${ctx.ds}/${img[1]}.${img[2]}?w=${largeur}&auto=format`;
  const f = ref.match(/^file-([a-f0-9]+)-([a-z0-9]+)$/);
  return f ? `https://cdn.sanity.io/files/${ctx.pid}/${ctx.ds}/${f[1]}.${f[2]}` : "";
}

// Libellé sans le préfixe du groupe (« Bloc principal : grand titre » devient « Grand titre »)
function libelle(c: Champ, groupe?: string) {
  let t = c.title ?? c.name;
  if (groupe && t.startsWith(`${groupe} : `)) t = t.slice(groupe.length + 3);
  return t.charAt(0).toUpperCase() + t.slice(1);
}

const visible = (c: Champ) => !c.hidden && c.type !== "slug" && c.type !== "datetime";
export const fige = (c: Champ) => !!c.readOnly || /ne pas modifier/i.test(`${c.title ?? ""} ${c.description ?? ""}`);

// Après un enregistrement, le site garde l'ancienne page pour la toute première visite (mise en cache de Next.js).
// On visite donc les pages tout de suite, en arrière-plan : Vincent et ses clients voient directement la nouvelle version.
const PAGES = ["/", "/tarifs", "/faq", "/estimateur", "/reserver", "/equipe/cartes", "/cgv", "/mentions-legales", "/confidentialite"];
function rafraichirSite() {
  PAGES.forEach((p, i) => setTimeout(() => { fetch(p, { cache: "no-store" }).catch(() => {}); }, 150 * i));
  setTimeout(() => PAGES.forEach((p) => { fetch(p, { cache: "no-store" }).catch(() => {}); }), 2500);
}

/* ================= Accueil de l'onglet + navigation ================= */
// MCP: 21st.dev « Settings Sidebar Accordion » (id 24875) : sections à icône, groupées
export function VueContenu({ signaler, depart, sansMenu }: { signaler: (m: string) => void; depart?: string | null; sansMenu?: boolean }) {
  const [section, setSection] = useState<Section | null>(() => SECTIONS.flatMap((g) => g.items).find((s) => s.id === depart) ?? null);
  const [docId, setDocId] = useState<string | null>(null);
  const [sale, setSale] = useState(false);

  // Prévenir avant de quitter une page modifiée sans l'enregistrer
  useEffect(() => {
    const f = (e: BeforeUnloadEvent) => { if (sale) { e.preventDefault(); e.returnValue = ""; } };
    window.addEventListener("beforeunload", f);
    return () => window.removeEventListener("beforeunload", f);
  }, [sale]);
  const quitter = (suite: () => void) => { if (!sale || window.confirm("Vos modifications ne sont pas enregistrées. Quitter quand même ?")) { setSale(false); suite(); } };

  if (!section)
    return (
      <section>
        <h1 className="font-display text-[clamp(1.7rem,3vw,2.3rem)] leading-tight text-encre">Que voulez-vous <span className="text-vert">modifier ?</span></h1>
        <p className="mt-2 max-w-xl font-sans text-sm text-gris">Touchez une rubrique : vous voyez ses textes et ses photos, vous modifiez, vous enregistrez. Le site se met à jour tout seul en quelques secondes.</p>
        {SECTIONS.map((g) => (
          <div key={g.titre} className="mt-8">
            <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-or-600">{g.titre}</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map((s) => (
                <button key={s.id} onClick={() => { setSection(s); setDocId(null); }} className="group flex items-center gap-4 rounded-[1.4rem] bg-white p-4 text-left shadow-[0_18px_40px_-32px_rgba(5,40,20,0.7)] transition-colors hover:bg-menthe/60">
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-menthe transition-colors group-hover:bg-soleil/60"><Icon name={s.icon} className="size-5 text-vert" /></span>
                  <span className="min-w-0">
                    <span className="block font-sans font-semibold text-encre">{s.titre}</span>
                    <span className="block font-sans text-sm text-gris">{s.aide}</span>
                  </span>
                  <Icon name="ph:arrow-right-bold" className="ml-auto size-4 shrink-0 text-or-600 transition-transform group-hover:translate-x-1" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </section>
    );

  if (section.liste && !docId)
    return <VueListe section={section} retour={sansMenu ? undefined : () => setSection(null)} ouvrir={setDocId} signaler={signaler} />;

  return (
    <Editeur
      key={`${section.id}-${docId ?? ""}`}
      section={section}
      docId={docId ?? section.id}
      retour={section.liste ? () => quitter(() => setDocId(null)) : sansMenu ? undefined : () => quitter(() => setSection(null))}
      setSale={setSale}
      signaler={signaler}
    />
  );
}

/* ================= Liste (services, avis, questions) ================= */
// MCP: 21st.dev « Image Preview Dropzone » (id 18045) : liste avec vignette et action par ligne
function VueListe({ section, retour, ouvrir, signaler }: { section: Section; retour?: () => void; ouvrir: (id: string) => void; signaler: (m: string) => void }) {
  const [docs, setDocs] = useState<Doc[] | null>(null);
  const [ctx, setCtx] = useState<Ctx>({ pid: "", ds: "production" });
  const [filtre, setFiltre] = useState("");
  const charger = useCallback(async () => {
    const r = await fetch(`/api/admin/contenu?section=${section.id}`, { cache: "no-store" });
    if (r.status === 401) return window.location.replace("/admin/connexion");
    const j = await r.json();
    setCtx({ pid: j.projectId, ds: j.dataset });
    setDocs(j.docs ?? []);
  }, [section.id]);
  useEffect(() => { charger(); }, [charger]);

  async function ajouter() {
    const r = await fetch("/api/admin/contenu", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "creer", section: section.id }) });
    const j = await r.json();
    if (r.ok) { signaler("Ajouté : complétez puis enregistrez"); ouvrir(j.id); } else signaler(j.erreur ?? "Ajout impossible");
  }

  const l = section.liste!;
  const affiches = (docs ?? []).filter((d) => !filtre || JSON.stringify([d[l.champTitre], d[l.champSousTitre ?? ""]]).toLowerCase().includes(filtre.toLowerCase()));
  return (
    <section>
      {retour && <Retour onClick={retour} label="Tout ce que je peux modifier" />}
      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[clamp(1.7rem,3vw,2.3rem)] leading-tight text-encre">{section.titre}</h1>
          <p className="mt-1 font-sans text-sm text-gris">{section.aide}. Touchez un élément pour le modifier.</p>
        </div>
        {l.creer && <button onClick={ajouter} className="inline-flex items-center gap-2 rounded-full bg-vert px-5 py-2.5 font-sans text-sm font-semibold text-white hover:bg-vert-900"><Icon name="ph:plus-bold" className="size-4 text-soleil" />Ajouter</button>}
      </div>
      {(docs?.length ?? 0) > 8 && (
        <input value={filtre} onChange={(e) => setFiltre(e.target.value)} placeholder="Rechercher…" className={cn(champInput, "mt-5 max-w-md rounded-full")} />
      )}
      {!docs ? (
        <p className="py-16 text-center font-sans text-gris">Chargement…</p>
      ) : (
        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {affiches.map((d) => {
            const img = ((d.photo ?? d.image) as { asset?: { _ref?: string } } | undefined)?.asset?._ref;
            return (
              <li key={d._id}>
                <button onClick={() => ouvrir(d._id as string)} className="flex w-full items-center gap-4 rounded-2xl bg-white p-3 text-left transition-colors hover:bg-menthe/60">
                  {img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={urlAsset(img, ctx, 160)} alt="" className="size-14 shrink-0 rounded-xl object-cover" />
                  ) : (
                    <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-menthe"><Icon name={section.icon} className="size-5 text-vert" /></span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-sans font-semibold text-encre">{String(d[l.champTitre] ?? "Sans titre")}</span>
                    {l.champSousTitre && d[l.champSousTitre] != null && <span className="block truncate font-sans text-sm text-gris">{valeurLisible(section, l.champSousTitre, d[l.champSousTitre])}</span>}
                  </span>
                  <Icon name="ph:arrow-right-bold" className="size-4 shrink-0 text-or-600" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

// Valeur d'une liste de choix affichée avec son libellé (« tarifs » devient « Prix et paiement »)
function valeurLisible(section: Section, champ: string, v: unknown) {
  const liste = schemaDe(section.type)?.fields.find((f) => f.name === champ)?.options?.list;
  const o = liste?.find((x) => (typeof x === "string" ? x : x.value) === v);
  return o ? (typeof o === "string" ? o : o.title) : String(v);
}

function Retour({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-vert hover:text-or-600">
      <Icon name="ph:arrow-left-bold" className="size-4 text-or-600" />{label}
    </button>
  );
}

/* ================= Éditeur d'un document ================= */
// MCP: 21st.dev « Accordion » (id 19548, cnippet-dev) : groupes repliables, un ouvert à la fois
function Editeur({ section, docId, retour, setSale, signaler }: { section: Section; docId: string; retour?: () => void; setSale: (b: boolean) => void; signaler: (m: string) => void }) {
  const schema = schemaDe(section.type);
  const [initial, setInitial] = useState<Doc | null>(null);
  const [valeurs, setValeurs] = useState<Doc>({});
  const [ctx, setCtx] = useState<Ctx>({ pid: "", ds: "production" });
  const [envoi, setEnvoi] = useState(false);
  const [ouvert, setOuvert] = useState<string>("");
  const [confirmeSuppr, setConfirmeSuppr] = useState(false);

  useEffect(() => {
    (async () => {
      const r = await fetch(`/api/admin/contenu?section=${section.id}`, { cache: "no-store" });
      if (r.status === 401) return window.location.replace("/admin/connexion");
      const j = await r.json();
      setCtx({ pid: j.projectId, ds: j.dataset });
      const d: Doc = section.liste ? (j.docs ?? []).find((x: Doc) => x._id === docId) ?? {} : j.doc ?? {};
      setInitial(d);
      setValeurs(structuredClone(d));
    })();
  }, [section, docId]);

  const sale = useMemo(() => initial !== null && JSON.stringify(initial) !== JSON.stringify(valeurs), [initial, valeurs]);
  useEffect(() => setSale(sale), [sale, setSale]);

  // Groupes du schéma (ou un seul groupe « Contenu »)
  const groupes = useMemo(() => {
    if (!schema) return [];
    const champs = schema.fields.filter(visible);
    if (!schema.groups?.length) return [{ name: "_", title: "", champs }];
    const out = schema.groups.map((g) => ({ name: g.name, title: g.title, champs: champs.filter((c) => c.group === g.name) })).filter((g) => g.champs.length);
    const sans = champs.filter((c) => !c.group);
    if (sans.length) out.push({ name: "_", title: "Autres réglages", champs: sans });
    return out;
  }, [schema]);
  useEffect(() => { if (groupes[0] && !ouvert) setOuvert(groupes[0].name); }, [groupes, ouvert]);

  async function enregistrer() {
    if (!schema) return;
    setEnvoi(true);
    const v: Record<string, unknown> = {};
    for (const f of schema.fields) if (visible(f) && !fige(f)) v[f.name] = valeurs[f.name] ?? null;
    const r = await fetch("/api/admin/contenu", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "enregistrer", section: section.id, id: docId, valeurs: v }) });
    setEnvoi(false);
    if (r.status === 401) return window.location.replace("/admin/connexion");
    if (!r.ok) return signaler(((await r.json().catch(() => ({}))) as { erreur?: string }).erreur ?? "Enregistrement impossible");
    setInitial(structuredClone(valeurs));
    rafraichirSite();
    signaler("Enregistré : c'est en ligne");
  }

  async function supprimer() {
    const r = await fetch("/api/admin/contenu", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "supprimer", section: section.id, id: docId }) });
    if (r.ok) { rafraichirSite(); signaler("Supprimé du site"); setSale(false); retour?.(); } else signaler("Suppression impossible");
  }

  if (!schema) return <p className="font-sans text-gris">Section non configurée.</p>;
  const titreDoc = section.liste ? String(valeurs[section.liste.champTitre] ?? "") : section.titre;

  return (
    <section className="pb-28">
      {retour && <Retour onClick={retour} label={section.liste ? `Tous : ${section.titre.toLowerCase()}` : "Tout ce que je peux modifier"} />}
      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display text-[clamp(1.7rem,3vw,2.3rem)] leading-tight text-encre">{titreDoc || section.titre}</h1>
        {section.voir && <a href={section.voir} target="_blank" rel="noopener" className={btnClair}>Voir la page sur le site <Icon name="ph:arrow-up-right-bold" className="size-3.5 text-or-600" /></a>}
      </div>
      <p className="mt-1 font-sans text-sm text-gris">Un champ laissé vide garde le texte prévu à l&apos;origine sur le site.</p>

      {!initial ? (
        <p className="py-16 text-center font-sans text-gris">Chargement…</p>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {groupes.map((g) => {
            const on = groupes.length === 1 || ouvert === g.name;
            return (
              <div key={g.name} className="overflow-hidden rounded-[1.4rem] bg-white shadow-[0_18px_40px_-34px_rgba(5,40,20,0.7)]">
                {groupes.length > 1 && (
                  <button onClick={() => setOuvert(on ? "" : g.name)} aria-expanded={on} className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left">
                    <span className="font-sans text-[1.02rem] font-semibold text-encre">{g.title}</span>
                    <span className={cn("grid size-8 place-items-center rounded-full bg-menthe transition-transform", on && "rotate-45")}><Icon name="ph:plus-bold" className="size-3.5 text-vert" /></span>
                  </button>
                )}
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                      <div className={cn("flex flex-col gap-5 px-5 pb-6", groupes.length === 1 && "pt-5")}>
                        {g.champs.map((c) => (
                          <ChampEdit key={c.name} c={c} groupe={g.title} valeur={valeurs[c.name]} ctx={ctx} signaler={signaler} onChange={(v) => setValeurs((o) => ({ ...o, [c.name]: v }))} />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
          {section.liste?.supprimer && (
            <div className="mt-4">
              {confirmeSuppr ? (
                <div className="rounded-2xl bg-[#f3d9d4] p-4">
                  <p className="font-sans text-sm font-semibold text-[#7a2a1e]">Supprimer définitivement « {titreDoc} » du site ?</p>
                  <div className="mt-3 flex gap-2">
                    <button onClick={supprimer} className="rounded-full bg-[#7a2a1e] px-5 py-2 font-sans text-sm font-semibold text-white">Oui, supprimer</button>
                    <button onClick={() => setConfirmeSuppr(false)} className="rounded-full border border-[#7a2a1e]/30 px-5 py-2 font-sans text-sm font-semibold text-[#7a2a1e]">Non</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setConfirmeSuppr(true)} className="font-sans text-sm font-semibold text-[#7a2a1e] hover:underline">Supprimer cet élément</button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Barre d'enregistrement, visible dès qu'il y a une modification */}
      <AnimatePresence>
        {sale && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed inset-x-0 bottom-0 z-40 border-t border-vert/10 bg-white/95 px-4 py-3 backdrop-blur sm:px-6">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
              <p className="font-sans text-sm font-semibold text-vert"><span className="mr-2 inline-block size-2 rounded-full bg-or align-middle" />Modifications non enregistrées</p>
              <div className="flex gap-2">
                <button onClick={() => setValeurs(structuredClone(initial ?? {}))} className={btnClair}>Annuler</button>
                <button disabled={envoi} onClick={enregistrer} className="rounded-full bg-vert px-6 py-2.5 font-sans text-sm font-semibold text-white hover:bg-vert-900 disabled:opacity-60">{envoi ? "Enregistrement…" : "Enregistrer"}</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ================= Un champ ================= */
type PropsChamp = { c: Champ; groupe?: string; valeur: unknown; onChange: (v: unknown) => void; ctx: Ctx; signaler: (m: string) => void; compact?: boolean };

function ChampEdit(p: PropsChamp) {
  const { c, groupe, valeur, onChange } = p;
  const titre = libelle(c, groupe);
  const aide = c.description;
  const enTete = (
    <span className="block">
      <span className="block font-sans text-sm font-semibold text-vert">{titre}</span>
      {aide && <span className="mt-0.5 block font-sans text-xs text-gris">{aide}</span>}
    </span>
  );

  // Champs techniques (identifiants) : jamais montrés, jamais modifiés
  if (fige(c)) return null;

  switch (c.type) {
    case "string": {
      const liste = c.options?.list?.map((x) => (typeof x === "string" ? { title: x, value: x } : x));
      if (liste)
        return (
          <label className="block">{enTete}
            <select value={String(valeur ?? "")} onChange={(e) => onChange(e.target.value)} className={cn(champInput, "mt-1.5")}>
              {liste.map((o) => <option key={o.value} value={o.value}>{o.title}</option>)}
            </select>
          </label>
        );
      if (/couleur/i.test(c.name))
        return (
          <label className="block">{enTete}
            <span className="mt-1.5 flex items-center gap-3">
              <input type="color" value={/^#[0-9a-f]{6}$/i.test(String(valeur)) ? String(valeur) : "#0a4624"} onChange={(e) => onChange(e.target.value.toUpperCase())} placeholder="#0A4624" className="h-12 w-16 cursor-pointer rounded-xl border border-vert/20 bg-white p-1" />
              <span className="font-sans text-sm text-gris">Touchez le carré pour choisir la couleur</span>
            </span>
          </label>
        );
      return <label className="block">{enTete}<input value={String(valeur ?? "")} onChange={(e) => onChange(e.target.value)} placeholder="Votre texte" className={cn(champInput, "mt-1.5")} /></label>;
    }
    case "text":
      return <label className="block">{enTete}<Zone valeur={String(valeur ?? "")} rows={c.rows ?? 3} onChange={onChange} /></label>;
    case "url":
      return <label className="block">{enTete}<input type="url" value={String(valeur ?? "")} onChange={(e) => onChange(e.target.value)} placeholder="https://…" className={cn(champInput, "mt-1.5")} /></label>;
    case "number":
      return <label className="block">{enTete}<input type="number" value={valeur == null ? "" : String(valeur)} onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))} placeholder="0" className={cn(champInput, "mt-1.5 max-w-[12rem]")} /></label>;
    case "date":
      return <label className="block">{enTete}<input type="date" value={String(valeur ?? "")} onChange={(e) => onChange(e.target.value)} placeholder="jj/mm/aaaa" className={cn(champInput, "mt-1.5 max-w-[14rem]")} /></label>;
    case "boolean":
      return (
        <button type="button" role="switch" aria-checked={!!valeur} onClick={() => onChange(!valeur)} className="flex items-center gap-3 text-left">
          <span className={cn("relative h-6 w-11 shrink-0 rounded-full transition-colors", valeur ? "bg-vert" : "bg-vert/20")}>
            <span className={cn("absolute top-1 size-4 rounded-full bg-white transition-transform", valeur ? "translate-x-6" : "translate-x-1")} />
          </span>
          {enTete}
        </button>
      );
    case "image":
    case "file":
      return <div>{enTete}<Media {...p} /></div>;
    case "object":
      return (
        <div>{enTete}
          <div className="mt-2 flex flex-col gap-4 rounded-2xl border border-vert/10 p-4">
            {(c.fields ?? []).filter(visible).map((f) => (
              <ChampEdit key={f.name} {...p} c={f} groupe={undefined} valeur={(valeur as Doc | undefined)?.[f.name]} onChange={(v) => onChange({ ...((valeur as Doc) ?? {}), [f.name]: v })} />
            ))}
          </div>
        </div>
      );
    case "array":
      return <div>{enTete}<Liste {...p} /></div>;
    default:
      return null;
  }
}

// Zone de texte qui grandit avec son contenu
function Zone({ valeur, rows, onChange }: { valeur: string; rows: number; onChange: (v: string) => void }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { const t = ref.current; if (t) { t.style.height = "auto"; t.style.height = `${t.scrollHeight + 2}px`; } }, [valeur]);
  return <textarea ref={ref} rows={rows} value={valeur} onChange={(e) => onChange(e.target.value)} placeholder="Votre texte" className={cn(champInput, "mt-1.5 resize-none leading-relaxed")} />;
}

/* ---- Photo ou vidéo ---- */
// Réduit une photo trop lourde avant l'envoi (téléphone : souvent 5 à 10 Mo)
async function preparerPhoto(f: File): Promise<Blob> {
  if (f.size < 2.5 * 1024 * 1024) return f;
  const img = await createImageBitmap(f);
  const k = Math.min(1, 2400 / Math.max(img.width, img.height));
  const cv = document.createElement("canvas");
  cv.width = Math.round(img.width * k);
  cv.height = Math.round(img.height * k);
  cv.getContext("2d")!.drawImage(img, 0, 0, cv.width, cv.height);
  return new Promise((ok) => cv.toBlob((b) => ok(b ?? f), "image/jpeg", 0.86));
}

// MCP: 21st.dev « File Dropzone » (id 19201, joyco) : glisser-déposer, survol mis en évidence, aperçu, retrait
function Media({ c, valeur, onChange, ctx, signaler, compact }: PropsChamp) {
  const [envoi, setEnvoi] = useState(false);
  const [survol, setSurvol] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const v = valeur as (Doc & { asset?: { _ref?: string } }) | undefined;
  const ref = v?.asset?._ref;
  const video = c.type === "file";

  async function choisir(f: File | undefined) {
    if (!f) return;
    setEnvoi(true);
    const fd = new FormData();
    const corps = video ? f : await preparerPhoto(f);
    fd.append("fichier", corps, video ? f.name : f.name.replace(/\.\w+$/, "") + (corps === f ? f.name.match(/\.\w+$/)?.[0] ?? ".jpg" : ".jpg"));
    const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
    setEnvoi(false);
    const j = await r.json().catch(() => ({}));
    if (!r.ok) return signaler(j.erreur ?? "Envoi impossible");
    onChange({ ...(v ?? {}), _type: c.type, asset: { _type: "reference", _ref: j._id } });
    signaler(video ? "Vidéo prête : pensez à enregistrer" : "Photo prête : pensez à enregistrer");
  }

  return (
    <div className="mt-2">
      <div className={cn("flex gap-4", compact ? "items-center" : "flex-col sm:flex-row sm:items-center")}>
        <div
          onDragOver={(e) => { e.preventDefault(); setSurvol(true); }}
          onDragLeave={() => setSurvol(false)}
          onDrop={(e) => { e.preventDefault(); setSurvol(false); choisir(e.dataTransfer.files?.[0]); }}
          onClick={() => !ref && input.current?.click()}
          className={cn("relative grid shrink-0 place-items-center overflow-hidden rounded-2xl bg-menthe transition-shadow", !ref && "cursor-pointer border-2 border-dashed border-vert/25", survol && "ring-4 ring-or", compact ? "size-20" : "aspect-[4/3] w-full max-w-[16rem]")}
        >
          {ref ? (
            video ? <video src={urlAsset(ref, ctx)} muted loop autoPlay playsInline className="size-full object-cover" /> : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={urlAsset(ref, ctx)} alt="" className="size-full object-cover" />
            )
          ) : (
            <span className="px-3 text-center font-sans text-xs text-gris">{video ? "Déposez une vidéo ici" : compact ? "Photo" : "Déposez une photo ici ou touchez pour choisir"}</span>
          )}
          {envoi && <span className="absolute inset-0 grid place-items-center bg-white/80 font-sans text-sm font-semibold text-vert">Envoi…</span>}
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" disabled={envoi} onClick={() => input.current?.click()} className={btnClair}>{ref ? (video ? "Changer la vidéo" : "Changer la photo") : video ? "Ajouter une vidéo" : "Ajouter une photo"}</button>
          {ref && <button type="button" onClick={() => onChange(null)} className="rounded-full px-3 py-2 font-sans text-sm font-semibold text-gris hover:text-[#7a2a1e]">Retirer</button>}
        </div>
        <input ref={input} type="file" accept={video ? "video/mp4" : "image/jpeg,image/png,image/webp"} className="hidden" placeholder="" onChange={(e) => { choisir(e.target.files?.[0]); e.target.value = ""; }} />
      </div>
      {video && <p className="mt-2 font-sans text-xs text-gris">Vidéo MP4 de 4 Mo maximum, sans son.</p>}
      {(c.fields ?? []).filter(visible).length > 0 && ref && (
        <div className="mt-3 flex flex-col gap-3">
          {(c.fields ?? []).filter(visible).map((f) => (
            <ChampEdit key={f.name} c={f} valeur={v?.[f.name]} ctx={ctx} signaler={signaler} onChange={(x) => onChange({ ...(v ?? {}), [f.name]: x })} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---- Listes (lignes de texte, blocs, photos) ---- */
function Liste({ c, valeur, onChange, ctx, signaler }: PropsChamp) {
  const m = c.of?.[0];
  const items = (Array.isArray(valeur) ? valeur : []) as unknown[];
  if (!m) return null;
  const simple = m.type === "string" || m.type === "text";
  const nouvelle = () => {
    const k = Math.random().toString(36).slice(2, 10);
    onChange([...items, simple ? "" : m.type === "image" ? { _key: k, _type: "image" } : { _key: k }]);
  };
  const bouger = (i: number, d: number) => { const t = [...items]; const [x] = t.splice(i, 1); t.splice(i + d, 0, x); onChange(t); };
  const retirer = (i: number) => onChange(items.filter((_, k) => k !== i));
  const maj = (i: number, v: unknown) => onChange(items.map((x, k) => (k === i ? v : x)));
  const outils = (i: number) => (
    <span className="flex shrink-0 gap-1">
      <button type="button" aria-label="Monter" disabled={i === 0} onClick={() => bouger(i, -1)} className="grid size-8 place-items-center rounded-full hover:bg-menthe disabled:opacity-30"><Icon name="ph:caret-down-bold" className="size-3 rotate-180 text-vert" /></button>
      <button type="button" aria-label="Descendre" disabled={i === items.length - 1} onClick={() => bouger(i, 1)} className="grid size-8 place-items-center rounded-full hover:bg-menthe disabled:opacity-30"><Icon name="ph:caret-down-bold" className="size-3 text-vert" /></button>
      <button type="button" aria-label="Retirer" onClick={() => retirer(i)} className="grid size-8 place-items-center rounded-full hover:bg-[#f3d9d4]"><Icon name="ph:x-bold" className="size-3 text-[#7a2a1e]" /></button>
    </span>
  );

  return (
    <div className="mt-2 flex flex-col gap-2">
      {items.map((it, i) =>
        simple ? (
          <div key={i} className="flex items-start gap-2">
            {m.type === "text" ? (
              <div className="flex-1"><Zone valeur={String(it ?? "")} rows={m.rows ?? 3} onChange={(v) => maj(i, v)} /></div>
            ) : (
              <input value={String(it ?? "")} onChange={(e) => maj(i, e.target.value)} placeholder="Votre texte" className={cn(champInput, "flex-1")} />
            )}
            <span className="pt-2">{outils(i)}</span>
          </div>
        ) : m.type === "image" ? (
          <div key={(it as Doc)._key as string ?? i} className="flex items-start justify-between gap-3 rounded-2xl border border-vert/10 p-3">
            <Media c={{ ...m, name: "photo", title: "" }} valeur={it} ctx={ctx} signaler={signaler} compact onChange={(v) => maj(i, v ? { ...(v as Doc), _key: (it as Doc)._key } : { _key: (it as Doc)._key, _type: "image" })} />
            {outils(i)}
          </div>
        ) : (
          <div key={(it as Doc)._key as string ?? i} className="rounded-2xl border border-vert/10 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="truncate font-sans text-sm font-bold text-or-600">{i + 1}. {String((m.fields ?? []).map((f) => (it as Doc)?.[f.name]).find((x) => typeof x === "string" && x.trim()) ?? "Nouveau bloc")}</span>
              {outils(i)}
            </div>
            <div className="flex flex-col gap-4">
              {(m.fields ?? []).filter(visible).map((f) => (
                <ChampEdit key={f.name} c={f} valeur={(it as Doc)?.[f.name]} ctx={ctx} signaler={signaler} onChange={(v) => maj(i, { ...((it as Doc) ?? {}), [f.name]: v })} />
              ))}
            </div>
          </div>
        ),
      )}
      <button type="button" onClick={nouvelle} className="inline-flex w-fit items-center gap-2 rounded-full border border-dashed border-vert/30 px-4 py-2 font-sans text-sm font-semibold text-vert hover:border-or">
        <Icon name="ph:plus-bold" className="size-3.5 text-or-600" />{simple ? "Ajouter une ligne" : m.type === "image" ? "Ajouter une photo" : "Ajouter un bloc"}
      </button>
    </div>
  );
}


