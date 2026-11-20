// Superpose le contenu saisi dans /admin (Sanity) au contenu prévu dans le code, EN PLACE sur les objets importés
// partout dans le site (site, TARIFS, services, avis, FAQ, textes de l'accueil, cartes de la page Tarifs).
// Appliqué côté serveur (lib/cms.ts, avant le rendu) et côté navigateur (components/cms-client.tsx, avant les enfants).
// Règle : un champ vide dans Sanity garde la valeur du code ; le site ne se vide jamais.
import { site } from "./site";
import { TARIFS } from "./tarifs";
import { services, reviews, steps, faq, type Faq } from "./content";
import { faqSections, type FaqAnswer } from "./faq";
import { accueil, tarifsPage, legal } from "./textes";
import { cards } from "./services-cartes";

type Txt = string | null | undefined;
export type CmsData = {
  reglages?: { telephone?: Txt; email?: Txt; adresse?: Txt; ville?: Txt; horaires?: Txt; paiement?: Txt; nombreAvis?: number | null; lienAvisGoogle?: Txt } | null;
  tarifs?: { fraisDepart?: number | null; kmJour?: number | null; kmNuit?: number | null; heureAttente?: number | null; minimum?: number | null; forfaitAeroportBergevin?: number | null } | null;
  accueil?: (Record<string, Txt | string[] | null | { titre?: Txt; texte?: Txt }[]> & { chauffeurPhoto?: Txt; atouts?: string[] | null; etapes?: { titre?: Txt; texte?: Txt }[] | null }) | null;
  prestations?: { cle?: Txt; titre?: Txt; sousTitre?: Txt; texte?: Txt; photo?: Txt; legende?: Txt; description?: Txt; pointsForts?: string[] | null }[] | null;
  avis?: { nom?: Txt; texte?: Txt }[] | null;
  pageTarifs?: Record<string, Txt> | null;
  infosLegales?: Record<string, Txt> | null;
  questions?: { rubrique?: Txt; q?: Txt; a?: Txt; surAccueil?: boolean | null; lienTexte?: Txt; lienAdresse?: Txt; motsCles?: Txt }[] | null;
};

// Valeurs du code, figées au chargement : on repart toujours d'elles (un champ vidé retrouve son texte d'origine)
const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x));
const DEF = {
  site: clone(site),
  tarifs: clone(TARIFS),
  services: clone(services),
  reviews: clone(reviews),
  steps: clone(steps),
  faq: clone(faq),
  sections: clone(faqSections.map((s) => s.items)),
  accueil: clone(accueil),
  tarifsPage: clone(tarifsPage),
  legal: clone(legal),
  cards: clone(cards),
};

const ok = (v: unknown): v is string => typeof v === "string" && v.trim() !== "";
const nb = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v) && v >= 0;
const remplacer = <T,>(arr: T[], items: T[]) => arr.splice(0, arr.length, ...items);
const THEMES: Record<string, Faq["theme"]> = { reservation: "Réservation", tarifs: "Tarifs", trajets: "Trajets" };

// Numéro affiché (0690 64 75 63) -> formats international, lien d'appel et WhatsApp (indicatif Guadeloupe 590)
function telephone(affiche: string) {
  const ch = affiche.replace(/\D/g, "");
  const national = ch.startsWith("590") ? ch.slice(3) : ch.replace(/^0/, "");
  if (national.length !== 9) return null;
  return { phoneDisplay: affiche.trim(), phoneIntl: `+590${national}`, phoneHref: `tel:+590${national}`, whatsapp: `https://wa.me/590${national}` };
}

let derniere = "";

export function appliquerCms(data: CmsData | null | undefined) {
  const cle = JSON.stringify(data ?? null);
  if (cle === derniere) return; // déjà appliqué (évite le travail à chaque rendu)
  derniere = cle;

  // 1. Retour aux valeurs du code
  Object.assign(site, clone(DEF.site));
  Object.assign(TARIFS, clone(DEF.tarifs));
  remplacer(services, clone(DEF.services));
  remplacer(reviews, clone(DEF.reviews));
  remplacer(steps, clone(DEF.steps));
  remplacer(faq, clone(DEF.faq));
  faqSections.forEach((s, i) => remplacer(s.items, clone(DEF.sections[i])));
  Object.assign(accueil, clone(DEF.accueil));
  Object.assign(tarifsPage, clone(DEF.tarifsPage));
  Object.assign(legal, clone(DEF.legal));
  for (const k of Object.keys(cards)) cards[k] = clone(DEF.cards[k]);
  if (!data) return;

  // 2. Coordonnées
  const r = data.reglages;
  if (r) {
    const ancienWa = site.whatsapp;
    if (ok(r.telephone)) { const t = telephone(r.telephone); if (t) Object.assign(site, t); }
    if (ok(r.email)) site.email = r.email.trim();
    if (ok(r.adresse)) site.address = r.adresse.trim();
    if (ok(r.ville)) site.city = r.ville.trim();
    if (ok(r.horaires)) site.hours = r.horaires.trim();
    if (ok(r.paiement)) site.payment = r.paiement.trim();
    if (nb(r.nombreAvis)) site.reviewsCount = Math.round(r.nombreAvis);
    if (ok(r.lienAvisGoogle) && /^https:\/\//.test(r.lienAvisGoogle)) site.googleReviewsUrl = r.lienAvisGoogle.trim();
    // Les liens WhatsApp déjà préparés dans les cartes suivent le nouveau numéro
    if (site.whatsapp !== ancienWa) for (const c of Object.values(cards)) c.href = c.href.replace(ancienWa, site.whatsapp);
  }

  // 3. Tarifs
  const t = data.tarifs;
  if (t) {
    if (nb(t.fraisDepart)) TARIFS.fraisDepart = t.fraisDepart;
    if (nb(t.kmJour)) TARIFS.kmJour = t.kmJour;
    if (nb(t.kmNuit)) TARIFS.kmNuit = t.kmNuit;
    if (nb(t.heureAttente)) TARIFS.heureSupp = t.heureAttente;
    if (nb(t.minimum)) TARIFS.minimum = t.minimum;
    if (nb(t.forfaitAeroportBergevin)) TARIFS.forfaitAeroportBergevin = t.forfaitAeroportBergevin;
  }

  // 4. Textes de l'accueil
  const a = data.accueil;
  if (a) {
    const A = accueil as Record<string, unknown>;
    for (const k of Object.keys(DEF.accueil)) {
      if (k === "atouts" || k === "chauffeurPhoto") continue;
      if (ok(a[k])) A[k] = (a[k] as string).trim();
    }
    if (ok(a.chauffeurPhoto)) accueil.chauffeurPhoto = a.chauffeurPhoto;
    const atouts = (a.atouts ?? []).filter(ok);
    if (atouts.length) accueil.atouts = DEF.accueil.atouts.map((d, i) => atouts[i] ?? d);
    (a.etapes ?? []).slice(0, steps.length).forEach((e, i) => {
      if (ok(e?.titre)) steps[i].title = e.titre.trim();
      if (ok(e?.texte)) steps[i].text = e.texte.trim();
    });
  }

  // 4 bis. Page Tarifs & estimateur, informations légales : textes simples, même nom de champ que dans le code
  for (const [cible, src] of [[tarifsPage, data.pageTarifs], [legal, data.infosLegales]] as const) {
    if (!src) continue;
    const C = cible as Record<string, string>;
    for (const k of Object.keys(C)) if (ok(src[k])) C[k] = (src[k] as string).trim();
  }

  // 5. Prestations (accueil + page Tarifs & services), repérées par leur code
  for (const p of data.prestations ?? []) {
    const s = services.find((x) => x.id === p.cle);
    if (!s) continue;
    const c = cards[s.id];
    if (ok(p.titre)) { s.title = p.titre.trim(); if (c) c.title = s.title; }
    if (ok(p.sousTitre)) s.tag = p.sousTitre.trim();
    if (ok(p.texte)) s.text = p.texte.trim();
    if (ok(p.photo)) { s.img = p.photo; if (c) c.image = p.photo; }
    if (c && ok(p.legende)) c.caption = p.legende.trim();
    if (c && ok(p.description)) c.description = p.description.trim();
    const pf = (p.pointsForts ?? []).filter(ok);
    if (c && pf.length) c.highlights = pf.map((x) => x.trim());
  }

  // 6. Avis (liste complète : ajout et retrait possibles)
  const avis = (data.avis ?? []).filter((x) => ok(x.nom) && ok(x.texte));
  if (avis.length) remplacer(reviews, avis.map((x) => ({ name: x.nom!.trim(), text: x.texte!.trim() })));

  // 7. Questions fréquentes (liste complète, rangée par rubrique)
  const qs = (data.questions ?? []).filter((x) => ok(x.q) && ok(x.a) && ok(x.rubrique) && THEMES[x.rubrique!]);
  if (qs.length) {
    faqSections.forEach((sec) => {
      const items: FaqAnswer[] = qs.filter((x) => x.rubrique === sec.id).map((x) => {
        const lien = ok(x.lienAdresse) && /^\/[^\s]*$/.test(x.lienAdresse.trim()) && ok(x.lienTexte);
        return { q: x.q!.trim(), a: x.a!.trim(), ...(lien ? { href: x.lienAdresse!.trim(), linkLabel: x.lienTexte!.trim() } : {}), ...(ok(x.motsCles) ? { keywords: x.motsCles.trim() } : {}) };
      });
      remplacer(sec.items, items);
    });
    const ordre = faqSections.map((s) => s.id);
    remplacer(
      faq,
      qs.filter((x) => x.surAccueil).sort((x, y) => ordre.indexOf(x.rubrique!) - ordre.indexOf(y.rubrique!)).map((x) => ({ theme: THEMES[x.rubrique!], q: x.q!.trim(), a: x.a!.trim() })),
    );
  }
}
