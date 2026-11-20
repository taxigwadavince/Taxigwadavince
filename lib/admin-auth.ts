// Session de l'espace d'administration : jeton « expiration.signature » signé en HMAC-SHA256 (Web Crypto,
// compatible middleware). Mot de passe et secret uniquement dans les variables d'environnement du serveur.
export const COOKIE_ADMIN = "tgv_admin";
export const DUREE_SESSION_S = 60 * 60 * 24 * 30; // 30 jours

const enc = new TextEncoder();

async function cle() {
  const secret = process.env.ADMIN_SECRET;
  if (!secret || secret.length < 32) return null;
  return crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

const hex = (b: ArrayBuffer) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");

export async function creerSession(): Promise<string | null> {
  const k = await cle();
  if (!k) return null;
  const exp = String(Math.floor(Date.now() / 1000) + DUREE_SESSION_S);
  return `${exp}.${hex(await crypto.subtle.sign("HMAC", k, enc.encode(exp)))}`;
}

export async function sessionValide(jeton: string | undefined): Promise<boolean> {
  if (!jeton) return false;
  const [exp, sig] = jeton.split(".");
  if (!exp || !sig || !/^\d+$/.test(exp) || !/^[0-9a-f]{64}$/.test(sig)) return false;
  if (Number(exp) < Date.now() / 1000) return false;
  const k = await cle();
  if (!k) return false;
  const octets = new Uint8Array(sig.match(/../g)!.map((h) => parseInt(h, 16)));
  return crypto.subtle.verify("HMAC", k, octets, enc.encode(exp));
}
