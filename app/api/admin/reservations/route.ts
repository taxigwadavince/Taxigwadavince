// Réservations reçues par le site (documents privés « resa.… ») : liste et changement de statut.
import { NextResponse } from "next/server";
import { sanityMutate, sanityQuery } from "@/lib/sanity";
import { STATUTS_RESA } from "@/lib/admin-types";

export const dynamic = "force-dynamic";

export async function GET() {
  const resas = await sanityQuery<unknown[]>(`*[_type == "reservation" && _id in path("resa.**")] | order(date desc, heure desc)[0...400]`);
  if (!resas) return NextResponse.json({ erreur: "Sanity indisponible" }, { status: 502 });
  return NextResponse.json({ resas });
}

export async function POST(req: Request) {
  const b = (await req.json().catch(() => null)) as { id?: string; statut?: string } | null;
  if (!b?.id || !/^resa\.[A-Za-z0-9-]{4,40}$/.test(b.id) || !STATUTS_RESA.some((s) => s.value === b.statut)) {
    return NextResponse.json({ erreur: "Requête invalide" }, { status: 400 });
  }
  const existe = await sanityQuery<{ _type: string } | null>(`*[_id == $id][0]{ _type }`, { id: b.id });
  if (existe?._type !== "reservation") return NextResponse.json({ erreur: "Réservation introuvable" }, { status: 404 });
  if (!(await sanityMutate([{ patch: { id: b.id, set: { statut: b.statut } } }]))) return NextResponse.json({ erreur: "Enregistrement impossible" }, { status: 502 });
  return NextResponse.json({ ok: true });
}
