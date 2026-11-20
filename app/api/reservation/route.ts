import { NextResponse } from "next/server";
import { clampInt, dateError, isValidEmail, isValidName, isValidPhone, isValidTime, LIMITS } from "@/lib/validation";

// Réception d'une demande de réservation.
// Envoi par e-mail via Web3Forms (WEB3FORMS_KEY) ou Resend (RESEND_API_KEY + RESERVATION_TO), selon la clé présente.
// Sans clé : la référence est créée et la page de confirmation invite à envoyer la demande par WhatsApp.
// Les règles de saisie sont revérifiées ici : le formulaire ne suffit pas à garantir les données reçues.
type Payload = Record<string, string | number | boolean | null | undefined>;

const clean = (v: unknown, max = 300) => String(v ?? "").replace(/[<>]/g, "").slice(0, max).trim();
const CONTACTS = ["WhatsApp", "Appel", "E-mail"];

export async function POST(req: Request) {
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

  let sent = false;
  try {
    if (process.env.WEB3FORMS_KEY) {
      const r = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ access_key: process.env.WEB3FORMS_KEY, subject, from_name: "Site Taxi Gwada Vince", replyto: email || undefined, message: text }),
      });
      sent = r.ok;
    } else if (process.env.RESEND_API_KEY && process.env.RESERVATION_TO) {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: process.env.RESERVATION_FROM || "Taxi Gwada Vince <onboarding@resend.dev>", to: [process.env.RESERVATION_TO], reply_to: email || undefined, subject, text }),
      });
      sent = r.ok;
    }
  } catch {
    sent = false;
  }

  return NextResponse.json({ ok: true, ref, sent });
}
