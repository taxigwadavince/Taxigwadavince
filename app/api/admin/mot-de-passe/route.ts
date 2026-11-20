// Changement du mot de passe depuis l'espace de gestion (session obligatoire, via le middleware).
import { NextResponse } from "next/server";
import { changerMotDePasse, motDePasseOk } from "@/lib/admin-mdp";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { actuel, nouveau } = (await req.json().catch(() => ({}))) as { actuel?: string; nouveau?: string };
  if (typeof nouveau !== "string" || nouveau.length < 10 || nouveau.length > 100) {
    return NextResponse.json({ erreur: "Le nouveau mot de passe doit faire au moins 10 caractères." }, { status: 400 });
  }
  if (!(await motDePasseOk(actuel ?? ""))) {
    await new Promise((r) => setTimeout(r, 700));
    return NextResponse.json({ erreur: "Le mot de passe actuel est incorrect." }, { status: 401 });
  }
  if (!(await changerMotDePasse(nouveau))) return NextResponse.json({ erreur: "Enregistrement impossible, réessayez." }, { status: 502 });
  return NextResponse.json({ ok: true });
}
