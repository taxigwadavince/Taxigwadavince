// Envoi d'une photo ou d'une vidéo vers Sanity (la clé reste côté serveur).
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
const MAX = 4.3 * 1024 * 1024; // limite d'envoi de Vercel
const IMAGES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export async function POST(req: Request) {
  const pid = process.env.SANITY_PROJECT_ID, ds = process.env.SANITY_DATASET ?? "production", tk = process.env.SANITY_API_TOKEN;
  if (!pid || !tk) return NextResponse.json({ erreur: "Sanity non configuré" }, { status: 500 });
  const form = await req.formData().catch(() => null);
  const f = form?.get("fichier");
  if (!(f instanceof File)) return NextResponse.json({ erreur: "Aucun fichier" }, { status: 400 });
  const image = IMAGES.includes(f.type);
  if (!image && f.type !== "video/mp4") return NextResponse.json({ erreur: "Format non accepté (photo JPEG, PNG, WebP ou vidéo MP4)." }, { status: 400 });
  if (f.size > MAX) return NextResponse.json({ erreur: "Fichier trop lourd (4 Mo maximum)." }, { status: 413 });
  const nom = encodeURIComponent(f.name.replace(/[^\w.-]+/g, "-").slice(0, 80) || "fichier");
  const res = await fetch(`https://${pid}.api.sanity.io/v2024-10-01/assets/${image ? "images" : "files"}/${ds}?filename=${nom}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${tk}`, "Content-Type": f.type },
    body: Buffer.from(await f.arrayBuffer()),
  });
  if (!res.ok) return NextResponse.json({ erreur: "Envoi impossible" }, { status: 502 });
  const { document } = (await res.json()) as { document: { _id: string; url: string } };
  return NextResponse.json({ _id: document._id, url: document.url, type: image ? "image" : "file" });
}
