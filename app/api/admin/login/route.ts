// Connexion / déconnexion de l'espace d'administration.
import { NextResponse } from "next/server";
import { COOKIE_ADMIN, DUREE_SESSION_S, creerSession } from "@/lib/admin-auth";
import { motDePasseOk } from "@/lib/admin-mdp";

export const dynamic = "force-dynamic";

// Limite simple des essais (par instance serveur) : 8 échecs par quart d'heure et par adresse
const echecs = new Map<string, { n: number; t: number }>();

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "inconnue";
  const e = echecs.get(ip);
  if (e && Date.now() - e.t < 15 * 60_000 && e.n >= 8) {
    return NextResponse.json({ erreur: "Trop d'essais. Réessayez dans un quart d'heure." }, { status: 429 });
  }
  const { motDePasse } = (await req.json().catch(() => ({}))) as { motDePasse?: string };
  if (!(await motDePasseOk(motDePasse ?? ""))) {
    echecs.set(ip, { n: (e && Date.now() - e.t < 15 * 60_000 ? e.n : 0) + 1, t: Date.now() });
    await new Promise((r) => setTimeout(r, 700));
    return NextResponse.json({ erreur: "Mot de passe incorrect." }, { status: 401 });
  }
  echecs.delete(ip);
  const jeton = await creerSession();
  if (!jeton) return NextResponse.json({ erreur: "Espace non configuré." }, { status: 500 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_ADMIN, jeton, { httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: DUREE_SESSION_S });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_ADMIN, "", { httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: 0 });
  return res;
}
