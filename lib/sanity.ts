// Connexion Sanity (sans dépendance : API HTTP de Sanity).
// Tant que SANITY_PROJECT_ID n'est pas défini, tout se replie sur la configuration locale (lib/reservation.ts) :
// le site ne se vide jamais (règle du skill sanity-cms).
// Lus côté serveur à l'exécution (pas de NEXT_PUBLIC_ : rien n'est figé dans le code compilé)
const projectId = process.env.SANITY_PROJECT_ID ?? process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET ?? process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = "2024-10-01";
const token = process.env.SANITY_API_TOKEN; // jeton Editor, côté serveur uniquement
// Adresse de l'API (surchargeable uniquement pour les tests locaux)
const api = () => process.env.SANITY_API_HOST ?? `https://${projectId}.api.sanity.io`;

export const sanityActif = Boolean(projectId);

// Lecture GROQ, toujours fraîche (api et non apicdn : une réservation doit être visible immédiatement)
export async function sanityQuery<T>(query: string, params: Record<string, unknown> = {}, opts: { revalidate?: number; tags?: string[] } = {}): Promise<T | null> {
  if (!projectId) return null;
  const qs = new URLSearchParams({ query });
  for (const [k, v] of Object.entries(params)) qs.set(`$${k}`, JSON.stringify(v));
  try {
    const res = await fetch(`${api()}/v${apiVersion}/data/query/${dataset}?${qs}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      // Contenu éditorial : mis en cache 60 s (et vidé à chaque publication via /api/revalidate) ; réservations : toujours frais
      ...(opts.revalidate !== undefined ? { next: { revalidate: opts.revalidate, tags: opts.tags } } : { cache: "no-store" as const }),
    });
    if (!res.ok) throw new Error(`Sanity ${res.status}`);
    return ((await res.json()) as { result: T }).result;
  } catch (e) {
    console.error("sanityQuery", e);
    return null;
  }
}

// Écriture (création d'une réservation), serveur uniquement
export async function sanityCreate(doc: Record<string, unknown>): Promise<boolean> {
  if (!projectId || !token) return false;
  try {
    const res = await fetch(`${api()}/v${apiVersion}/data/mutate/${dataset}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ mutations: [{ create: doc }] }),
    });
    return res.ok;
  } catch (e) {
    console.error("sanityCreate", e);
    return false;
  }
}

// Mutations groupées (espace d'administration), serveur uniquement
export async function sanityMutate(mutations: Record<string, unknown>[]): Promise<boolean> {
  if (!projectId || !token) return false;
  try {
    const res = await fetch(`${api()}/v${apiVersion}/data/mutate/${dataset}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ mutations }),
    });
    return res.ok;
  } catch (e) {
    console.error("sanityMutate", e);
    return false;
  }
}
