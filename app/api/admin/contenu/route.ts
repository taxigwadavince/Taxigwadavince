// Lecture et enregistrement du contenu du site depuis l'espace de gestion.
// Toute écriture est filtrée par le schéma du Studio : seuls les champs connus, au bon format, sont envoyés à Sanity.
import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { sanityMutate, sanityQuery } from "@/lib/sanity";
import { schemaDe, sectionDe, type Champ } from "@/lib/admin-contenu";

export const dynamic = "force-dynamic";
const ID = /^[A-Za-z0-9._-]{1,80}$/;
const CLE = /^[A-Za-z0-9_-]{1,40}$/;
const REF_IMAGE = /^image-[a-f0-9]+-\d+x\d+-[a-z0-9]+$/;
const REF_FICHIER = /^file-[a-f0-9]+-[a-z0-9]+$/;
const cle = () => Math.random().toString(36).slice(2, 10);
const non = (m: string, s = 400) => NextResponse.json({ erreur: m }, { status: s });
const vide = (v: unknown) => v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0);

// Nettoie une valeur selon son champ ; undefined = champ à vider
function nettoyer(c: Champ, v: unknown): unknown {
  if (vide(v)) return undefined;
  switch (c.type) {
    case "string":
    case "text": {
      if (typeof v !== "string") return undefined;
      const s = v.slice(0, c.type === "text" ? 8000 : 600);
      const liste = c.options?.list?.map((x) => (typeof x === "string" ? x : x.value));
      if (liste && !liste.includes(s)) return undefined;
      return s.trim() ? s : undefined;
    }
    case "url":
      return typeof v === "string" && /^https:\/\/[^\s]{3,500}$/.test(v.trim()) ? v.trim() : undefined;
    case "number":
      return typeof v === "number" && Number.isFinite(v) ? v : typeof v === "string" && v.trim() !== "" && Number.isFinite(Number(v)) ? Number(v) : undefined;
    case "boolean":
      return typeof v === "boolean" ? v : undefined;
    case "date":
      return typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : undefined;
    case "image":
    case "file": {
      const o = v as { asset?: { _ref?: string } } & Record<string, unknown>;
      const ref = o?.asset?._ref;
      if (!ref || !(c.type === "image" ? REF_IMAGE : REF_FICHIER).test(ref)) return undefined;
      const out: Record<string, unknown> = { _type: c.type, asset: { _type: "reference", _ref: ref } };
      for (const f of c.fields ?? []) { const x = nettoyer(f, o[f.name]); if (x !== undefined) out[f.name] = x; }
      return out;
    }
    case "object": {
      const o = v as Record<string, unknown>;
      if (typeof o !== "object") return undefined;
      const out: Record<string, unknown> = {};
      for (const f of c.fields ?? []) { const x = nettoyer(f, o[f.name]); if (x !== undefined) out[f.name] = x; }
      return Object.keys(out).length ? out : undefined;
    }
    case "array": {
      if (!Array.isArray(v)) return undefined;
      const m = c.of?.[0];
      if (!m) return undefined;
      const items = v.slice(0, 60).map((it) => {
        if (m.type === "string" || m.type === "text") return nettoyer(m, it);
        const x = nettoyer({ ...m, type: m.type === "image" ? "image" : "object" }, it) as Record<string, unknown> | undefined;
        if (!x) return undefined;
        const k = (it as { _key?: string })?._key;
        return { _key: k && CLE.test(k) ? k : cle(), ...x };
      }).filter((x) => x !== undefined);
      return items.length ? items : undefined;
    }
    default:
      return undefined; // slug, datetime, reference : jamais modifiés ici
  }
}

function publier() {
  revalidateTag("cms");
  revalidatePath("/", "layout");
}

export async function GET(req: Request) {
  const u = new URL(req.url);
  const s = sectionDe(u.searchParams.get("section") ?? "");
  if (!s) return non("Section inconnue");
  const base = { projectId: process.env.SANITY_PROJECT_ID, dataset: process.env.SANITY_DATASET ?? "production" };
  if (s.liste) {
    const ordre = s.liste.ordre ? ` | order(${s.liste.ordre} asc)` : "";
    const docs = await sanityQuery<Record<string, unknown>[]>(`*[_type == $t && !(_id in path("drafts.**"))]${ordre}`, { t: s.type });
    return docs ? NextResponse.json({ ...base, docs }) : non("Sanity indisponible", 502);
  }
  const doc = await sanityQuery<Record<string, unknown> | null>(`*[_id == $id][0]`, { id: s.id });
  return NextResponse.json({ ...base, doc: doc ?? { _id: s.id, _type: s.type } });
}

export async function POST(req: Request) {
  const b = (await req.json().catch(() => null)) as { action?: string; section?: string; id?: string; valeurs?: Record<string, unknown> } | null;
  const s = b?.section ? sectionDe(b.section) : undefined;
  if (!b || !s) return non("Requête invalide");
  const schema = schemaDe(s.type);
  if (!schema) return non("Type inconnu");

  // L'identifiant doit appartenir à la section (page unique : son _id ; liste : un document de ce type)
  async function verifierId(id: string) {
    if (!s!.liste) return id === s!.id;
    if (!ID.test(id)) return false;
    return (await sanityQuery<{ _type: string } | null>(`*[_id == $id][0]{ _type }`, { id }))?._type === s!.type;
  }

  if (b.action === "creer") {
    if (!s.liste?.creer) return non("Ajout non disponible ici");
    const id = `${s.type}-${cle()}${cle()}`;
    const doc: Record<string, unknown> = { _id: id, _type: s.type };
    if (schema.fields.some((f) => f.name === "slug")) doc.slug = { _type: "slug", current: `nouveau-${cle()}` };
    if (schema.fields.some((f) => f.name === "ordre")) doc.ordre = 999;
    if (s.type === "question") Object.assign(doc, { rubrique: "reservation", q: "Nouvelle question", a: "Votre réponse", surAccueil: false });
    if (s.type === "avis") Object.assign(doc, { nom: "Prénom du voyageur", texte: "Ce qu'il a apprécié." });
    if (!(await sanityMutate([{ create: doc }]))) return non("Ajout impossible", 502);
    publier();
    return NextResponse.json({ ok: true, id });
  }

  if (b.action === "supprimer") {
    if (!s.liste?.supprimer || !b.id || !(await verifierId(b.id))) return non("Suppression impossible");
    if (!(await sanityMutate([{ delete: { id: b.id } }, { delete: { id: `drafts.${b.id}` } }]))) return non("Suppression impossible", 502);
    publier();
    return NextResponse.json({ ok: true });
  }

  if (b.action === "enregistrer") {
    const id = b.id ?? s.id;
    if (!(await verifierId(id)) || typeof b.valeurs !== "object" || !b.valeurs) return non("Requête invalide");
    const set: Record<string, unknown> = {};
    const unset: string[] = [];
    for (const f of schema.fields) {
      if (f.readOnly || f.hidden || /ne pas modifier/i.test(`${f.title ?? ""} ${f.description ?? ""}`) || !(f.name in b.valeurs)) continue;
      const x = nettoyer(f, b.valeurs[f.name]);
      if (x === undefined) { if (!["slug", "datetime"].includes(f.type)) unset.push(f.name); } else set[f.name] = x;
    }
    const mutations: Record<string, unknown>[] = [];
    if (!s.liste) mutations.push({ createIfNotExists: { _id: id, _type: s.type } });
    mutations.push({ patch: { id, ...(Object.keys(set).length ? { set } : {}), ...(unset.length ? { unset } : {}) } });
    if (!(await sanityMutate(mutations))) return non("Enregistrement impossible", 502);
    publier();
    return NextResponse.json({ ok: true });
  }
  return non("Action inconnue");
}

