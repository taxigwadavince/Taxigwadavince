// Import : recopie dans Sanity le contenu du code (createIfNotExists + setIfMissing : relançable sans rien écraser).
// Lancer depuis un dossier sans « : » : SANITY_PROJECT_ID=… SANITY_API_TOKEN=… npx tsx <chemin>/scripts/cms-import.mts
import { site } from "../lib/site";
import { TARIFS } from "../lib/tarifs";
import { services, reviews, steps, faq } from "../lib/content";
import { faqSections } from "../lib/faq";
import { accueil, tarifsPage, legal } from "../lib/textes";
import { cards } from "../lib/services-cartes";

const pid = process.env.SANITY_PROJECT_ID, tk = process.env.SANITY_API_TOKEN, ds = process.env.SANITY_DATASET ?? "production";
if (!pid || !tk) throw new Error("SANITY_PROJECT_ID et SANITY_API_TOKEN requis");
const cle = (i: number) => `k${i}${Math.random().toString(36).slice(2, 7)}`;
const docs: Record<string, unknown>[] = [];

docs.push({ _id: "reglages", _type: "reglages", telephone: site.phoneDisplay, email: site.email, adresse: site.address, ville: site.city, horaires: site.hours, paiement: site.payment, nombreAvis: site.reviewsCount, lienAvisGoogle: site.googleReviewsUrl });
docs.push({ _id: "tarifs", _type: "tarifs", fraisDepart: TARIFS.fraisDepart, kmJour: TARIFS.kmJour, kmNuit: TARIFS.kmNuit, heureAttente: TARIFS.heureSupp, minimum: TARIFS.minimum, forfaitAeroportBergevin: TARIFS.forfaitAeroportBergevin });
const { chauffeurPhoto: _photo, atouts, ...textes } = accueil;
docs.push({ _id: "pageAccueil", _type: "pageAccueil", ...textes, atouts, etapes: steps.map((s, i) => ({ _key: cle(i), titre: s.title, texte: s.text })) });
docs.push({ _id: "pageTarifs", _type: "pageTarifs", ...tarifsPage });
docs.push({ _id: "infosLegales", _type: "infosLegales", ...Object.fromEntries(Object.entries(legal).filter(([, v]) => v)) });
services.forEach((s, i) => {
  const c = cards[s.id];
  docs.push({ _id: `prestation-${s.id}`, _type: "prestation", cle: s.id, ordre: i + 1, titre: s.title, sousTitre: s.tag, texte: s.text, legende: c?.caption, description: c?.description, pointsForts: c?.highlights });
});
reviews.forEach((r, i) => docs.push({ _id: `avis-${String(i + 1).padStart(2, "0")}`, _type: "avis", ordre: i + 1, nom: r.name, texte: r.text }));
const accueilQ = new Set(faq.slice(0, 6).map((x) => x.q));
let n = 0;
for (const sec of faqSections) {
  for (const it of sec.items) {
    n++;
    docs.push({ _id: `question-${String(n).padStart(2, "0")}`, _type: "question", ordre: n, rubrique: sec.id, q: it.q, a: it.a, surAccueil: accueilQ.has(it.q), lienTexte: it.linkLabel, lienAdresse: it.href, motsCles: it.keywords });
  }
}

const res = await fetch(`https://${pid}.api.sanity.io/v2024-10-01/data/mutate/${ds}`, {
  method: "POST",
  headers: { Authorization: `Bearer ${tk}`, "Content-Type": "application/json" },
  // createIfNotExists puis setIfMissing : ajoute les nouveaux champs sans jamais écraser une valeur déjà saisie
  body: JSON.stringify({ mutations: docs.flatMap((d) => { const x = JSON.parse(JSON.stringify(d)); const { _id, _type, ...champs } = x; return [{ createIfNotExists: { _id, _type } }, { patch: { id: _id, setIfMissing: champs } }]; }) }),
});
console.log(res.status, docs.length, "documents", (await res.text()).slice(0, 200));
