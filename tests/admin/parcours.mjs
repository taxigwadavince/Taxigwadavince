// Parcours complet dans un vrai navigateur (ordinateur + téléphone). Les données de test sont supprimées à la fin.
import { chromium } from "playwright";
import fs from "fs";
const U = process.argv[2] ?? "http://localhost:3457";
const OUT = process.argv[3] ?? "/tmp/tgv-captures";
fs.mkdirSync(OUT, { recursive: true });
const MDP = fs.readFileSync(process.env.HOME + "/.taxigwadavince-admin-password", "utf8").trim();
const log = (...a) => console.log(...a);
const b = await chromium.launch({ channel: "chrome", headless: true });
const erreurs = [];

// 1. Pages publiques : aucune erreur console (hydratation)
const pub = await b.newPage();
pub.on("console", (m) => { if (m.type() === "error") erreurs.push(`${pub.url()} ${m.text().slice(0, 160)}`); });
pub.on("pageerror", (e) => erreurs.push(`${pub.url()} ${e.message.slice(0, 160)}`));
for (const p of ["/", "/tarifs", "/faq", "/estimateur", "/reserver", "/equipe", "/cgv"]) {
  await pub.goto(U + p, { waitUntil: "networkidle" });
  await pub.waitForTimeout(600);
}
log("pages publiques, erreurs console :", erreurs.length ? erreurs : "aucune");
log("lien admin dans le pied de page :", await pub.locator('footer a[href="/admin"]').count());

// 2. Connexion : mauvais mot de passe refusé, bon accepté
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
p.on("pageerror", (e) => erreurs.push(`admin ${e.message.slice(0, 160)}`));
await p.goto(U + "/admin");
await p.screenshot({ path: `${OUT}/1-connexion-ordi.png` });
await p.fill("#mdp", "mauvais-mot-de-passe");
await p.click("button:has-text('Me connecter')");
await p.waitForSelector("p[role=alert]");
log("mauvais mot de passe :", await p.textContent("p[role=alert]"));
await p.fill("#mdp", MDP);
await p.click("button:has-text('Me connecter')");
await p.waitForURL(U + "/admin");
await p.waitForTimeout(1200);
await p.screenshot({ path: `${OUT}/2-vue-ensemble-ordi.png` });

// 3. Modifier le grand titre de l'accueil -> visible sur le site -> remettre l'original
await p.click("nav >> text=Page d'accueil");
await p.waitForSelector("text=Grand titre (début)");
const champ = p.locator("label:has-text('Grand titre (début)') input");
const original = await champ.inputValue();
await champ.fill("Votre taxi TEST en Guadeloupe,");
await p.screenshot({ path: `${OUT}/3-editeur-accueil-ordi.png` });
await p.click("button:has-text('Enregistrer')");
await p.waitForSelector("text=Enregistré");
await p.waitForTimeout(4000);
await pub.goto(U + "/", { waitUntil: "networkidle" });
log("titre modifié visible sur le site :", (await pub.locator("h1").first().textContent()).includes("TEST"));
await champ.fill(original);
await p.click("button:has-text('Enregistrer')");
await p.waitForTimeout(1500);
await pub.goto(U + "/", { waitUntil: "networkidle" });
log("titre d'origine rétabli :", !(await pub.locator("h1").first().textContent()).includes("TEST"));

// 4. Listes : services, questions, avis
for (const s of ["Vos services", "Questions fréquentes", "Avis de voyageurs", "Vos tarifs", "Page Tarifs et estimateur", "Mentions légales", "Vos coordonnées"]) {
  await p.click(`nav >> text=${s}`);
  await p.waitForTimeout(900);
  await p.screenshot({ path: `${OUT}/4-${s.replace(/\W+/g, "-")}-ordi.png` });
}
await p.click("nav >> text=Vos services");
await p.waitForTimeout(800);
await p.click("main li button >> nth=0");
await p.waitForTimeout(1000);
await p.screenshot({ path: `${OUT}/5-un-service-ordi.png`, fullPage: true });

// 5. Réservation de test envoyée par l'API du site (sans e-mail), visible dans l'espace, puis supprimée
const d = new Date(Date.now() + 3 * 86400000);
const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const r = await (await fetch(U + "/api/reservation", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "Client Test", phone: "0690 00 00 00", from: "Aéroport Pôle Caraïbes", to: "Hôtel du Gosier", date, time: "09:30", adults: 2, bags: 2, estimate: "35,00 €", km: 14.2, contact: "WhatsApp", note: "Réservation de test" }) })).json();
log("réservation de test :", r.ref, "enregistrée :", r.enregistree, "e-mail préparé :", !!r.mail?.text);
await p.click("nav >> text=Réservations reçues");
await p.waitForTimeout(1200);
await p.reload();
await p.waitForTimeout(1500);
await p.click("nav >> text=Réservations reçues");
await p.waitForTimeout(1000);
await p.click("text=Client Test");
await p.waitForTimeout(900);
await p.screenshot({ path: `${OUT}/6-fiche-reservation-ordi.png` });
await p.click("button:has-text('Course confirmée')");
await p.waitForSelector("text=Course notée comme confirmée");
log("statut changé : ok");

// 6. Téléphone
const m = await b.newContext({ viewport: { width: 393, height: 852 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
await m.addCookies((await ctx.cookies()).map((c) => ({ ...c, secure: false })));
const pm = await m.newPage();
await pm.goto(U + "/admin");
await pm.waitForTimeout(1500);
await pm.screenshot({ path: `${OUT}/7-vue-ensemble-tel.png`, fullPage: true });
log("débordement horizontal téléphone :", await pm.evaluate(() => document.documentElement.scrollWidth - innerWidth));
await pm.click("button:has-text('Menu')");
await pm.waitForTimeout(600);
await pm.screenshot({ path: `${OUT}/8-menu-tel.png` });
await pm.click("text=Réservations reçues");
await pm.waitForTimeout(900);
await pm.click("text=Client Test");
await pm.waitForTimeout(900);
await pm.screenshot({ path: `${OUT}/9-fiche-tel.png` });
await pm.goto(U + "/admin");
await pm.waitForTimeout(800);
await pm.click("button:has-text('Menu')");
await pm.click("text=Page d'accueil");
await pm.waitForTimeout(1000);
await pm.screenshot({ path: `${OUT}/10-editeur-tel.png`, fullPage: true });
log("débordement éditeur téléphone :", await pm.evaluate(() => document.documentElement.scrollWidth - innerWidth));
await pm.goto(U + "/admin/connexion");
await pm.screenshot({ path: `${OUT}/11-connexion-tel.png` });

console.log("ID_TEST", r.ref);
console.log("erreurs :", erreurs.length ? erreurs : "aucune");
await b.close();
