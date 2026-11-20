// Mot de passe de l'espace de gestion, modifiable depuis /admin.
// Stocké dans Sanity sous forme d'empreinte PBKDF2-SHA256 (jamais en clair), dans un document PRIVÉ :
// un _id contenant un point (« prive.acces-admin ») n'est jamais lisible sans la clé du serveur.
// Tant que ce document n'existe pas, le mot de passe est celui de la variable ADMIN_PASSWORD (Vercel).
import { sanityMutate, sanityQuery } from "./sanity";

export const ID_ACCES = "prive.acces-admin";
const ITERATIONS = 210_000;
const enc = new TextEncoder();
const hex = (b: ArrayBuffer | Uint8Array) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
const deHex = (h: string): Uint8Array<ArrayBuffer> => new Uint8Array(h.match(/../g)!.map((x) => parseInt(x, 16)));

async function empreinte(mdp: string, sel: Uint8Array<ArrayBuffer>, iterations: number) {
  const cle = await crypto.subtle.importKey("raw", enc.encode(mdp), "PBKDF2", false, ["deriveBits"]);
  return new Uint8Array(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: sel, iterations }, cle, 256));
}
const egal = (a: Uint8Array, b: Uint8Array) => { if (a.length !== b.length) return false; let d = 0; for (let i = 0; i < a.length; i++) d |= a[i] ^ b[i]; return d === 0; };

export async function motDePasseOk(saisi: string): Promise<boolean> {
  if (typeof saisi !== "string" || !saisi || saisi.length > 200) return false;
  // réponse null = Sanity injoignable : on refuse (sinon l'ancien mot de passe redeviendrait valable)
  const rep = await sanityQuery<{ d: { sel?: string; empreinte?: string; iterations?: number } | null }>(`{ "d": *[_id == $id][0]{ sel, empreinte, iterations } }`, { id: ID_ACCES });
  if (!rep) return false;
  const doc = rep.d;
  if (doc?.sel && doc.empreinte) return egal(await empreinte(saisi, deHex(doc.sel), doc.iterations ?? ITERATIONS), deHex(doc.empreinte));
  const attendu = process.env.ADMIN_PASSWORD;
  if (!attendu) return false;
  // comparaison à temps constant via empreinte des deux valeurs
  const sel = enc.encode("comparaison");
  return egal(await empreinte(saisi, sel, 1000), await empreinte(attendu, sel, 1000));
}

export async function changerMotDePasse(nouveau: string): Promise<boolean> {
  const sel = crypto.getRandomValues(new Uint8Array(16));
  const e = await empreinte(nouveau, sel, ITERATIONS);
  return sanityMutate([{ createOrReplace: { _id: ID_ACCES, _type: "accesAdmin", sel: hex(sel), empreinte: hex(e), iterations: ITERATIONS, modifieLe: new Date().toISOString() } }]);
}
