import { NextResponse } from "next/server";
import { sanityCreate } from "@/lib/sanity";
import { clampInt, dateError, isValidEmail, isValidName, isValidPhone, isValidTime, LIMITS } from "@/lib/validation";

// Réception d'une demande de réservation.
// La demande est enregistrée dans Sanity (espace /admin de Vincent), puis le navigateur l'envoie par e-mail (Web3Forms).
// Si l'e-mail ne part pas, la page de confirmation invite à envoyer la demande par WhatsApp.
// Les règles de saisie sont revérifiées ici : le formulaire ne suffit pas à garantir les données reçues.
type Payload = Record<string, string | number | boolean | null | undefined>;

const clean = (v: unknown, max = 300) => String(v ?? "").replace(/[<>]/g, "").slice(0, max).trim();
const CONTACTS = ["WhatsApp", "Appel", "E-mail"];

// Limite simple contre les envois en rafale (par instance serveur) : 6 demandes par quart d'heure et par adresse
const envois = new Map<string, number[]>();

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "inconnue";
  const recents = (envois.get(ip) ?? []).filter((t) => Date.now() - t < 15 * 60_000);
  if (recents.length >= 6) return NextResponse.json({ error: "Trop de demandes. Appelez Vincent directement." }, { status: 429 });
  envois.set(ip, [...recents, Date.now()]);
  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const name = clean(body.name, LIMITS.name);
  const phone = clean(body.phone, LIMITS.phone);
  const email = clean(body.email, LIMITS.email);
  const from = clean(body.from, LIMITS.place);
  const to = clean(body.to, LIMITS.place);
  const date = clean(body.date, 10);
  const time = clean(body.time, 5);
  const contact = CONTACTS.includes(String(body.contact)) ? String(body.contact) : "WhatsApp";

  const invalid = new Set<string>();
  if (!isValidName(name)) invalid.add("nom");
  if (!isValidPhone(phone)) invalid.add("téléphone");
  if ((email && !isValidEmail(email)) || (contact === "E-mail" && !email)) invalid.add("e-mail");
  if (!from || !to) invalid.add("trajet");
  if (dateError(date)) invalid.add("date");
  if (!isValidTime(time)) invalid.add("heure");
  if (invalid.size) {
    return NextResponse.json({ error: `Champs invalides : ${[...invalid].join(", ")}` }, { status: 422 });
  }

  const adults = clampInt(body.adults, 1, 4, 1);
  const children = clampInt(body.children, 0, 4 - adults, 0);
  const bags = clampInt(body.bags, 0, 6, 0);
  const extraHours = clampInt(body.extraHours, 0, 24, 0);

  const d = new Date();
  const ref = `GV-${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  const lines = [
    `Référence : ${ref}`,
    `Trajet : ${from} → ${to} (aller simple)`,
    `Prise en charge : ${clean(body.dateFr, 60) || date} à ${time} (heure de Guadeloupe)`,
    `Passagers : ${adults} adulte(s), ${children} enfant(s) · Valises : ${bags}${body.childSeat === true ? " · Siège enfant" : ""}`,
    body.flight ? `Vol / bateau : ${clean(body.flight, LIMITS.flight)}` : "",
    extraHours > 0 ? `Temps supplémentaire : ${extraHours} h` : "",
    `Estimation à confirmer : ${clean(body.estimate, 30)}${body.km ? ` (${clean(body.km, 10)} km)` : ""}`,
    `Client : ${name} · ${phone}${email ? ` · ${email}` : ""}`,
    `Confirmation souhaitée par : ${contact}`,
    body.note ? `Message : ${clean(body.note, LIMITS.note)}` : "",
  ].filter(Boolean);
  const text = lines.join("\n");
  const subject = `Nouvelle course ${ref} : ${clean(from, 60)} → ${clean(to, 60)}`;

  // Enregistrement dans l'espace de Vincent (/admin > Réservations reçues). Identifiant « resa.… » : document privé,
  // jamais lisible sans la clé du serveur (le jeu de données Sanity est public en lecture).
  const enregistree = await sanityCreate({
    _id: `resa.${ref}`,
    _type: "reservation",
    statut: "nouvelle",
    reference: ref,
    date,
    heure: time,
    depart: from,
    arrivee: to,
    nom: name,
    telephone: phone,
    email: email || undefined,
    contact,
    adultes: adults,
    enfants: children,
    valises: bags,
    siegeEnfant: body.childSeat === true,
    vol: body.flight ? clean(body.flight, LIMITS.flight) : undefined,
    heuresSupp: extraHours || undefined,
    estimation: clean(body.estimate, 30) || undefined,
    km: body.km ? clean(body.km, 10) : undefined,
    message: body.note ? clean(body.note, LIMITS.note) : undefined,
    creeLe: new Date().toISOString(),
  });
  if (!enregistree) console.error("reservation : enregistrement Sanity impossible", ref);

  // L'e-mail part du navigateur (Web3Forms, offre gratuite = envoi côté client uniquement) : on renvoie son contenu.
  return NextResponse.json({ ok: true, ref, enregistree, mail: { subject, text, replyto: email || "" } });
}
