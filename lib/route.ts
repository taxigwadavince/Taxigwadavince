// Itinéraire routier réel : Google Maps via /api/route (clé GOOGLE_MAPS_API_KEY), sinon OSRM (OpenStreetMap),
// avec repli à vol d'oiseau si aucun service ne répond.
export type LatLon = { lat: number; lon: number };
export type RouteResult = { km: number; minutes: number; coords: [number, number][]; exact: boolean };

export function haversineKm(a: LatLon, b: LatLon) {
  const R = 6371, toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat), dLon = toRad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

const cache = new Map<string, RouteResult>();

export async function getRoute(a: LatLon, b: LatLon): Promise<RouteResult> {
  const id = `${a.lat},${a.lon};${b.lat},${b.lon}`;
  const hit = cache.get(id);
  if (hit) return hit;
  // 1) Google Maps (même distance que le formulaire de taxigwadavince.com), si la clé est configurée sur Vercel.
  try {
    const q = new URLSearchParams({ aLat: String(a.lat), aLon: String(a.lon), bLat: String(b.lat), bLon: String(b.lon) });
    const res = await fetch(`/api/route?${q}`);
    if (res.ok) {
      const g = (await res.json()) as RouteResult;
      if (g.km > 0) {
        cache.set(id, g);
        return g;
      }
    }
  } catch {}
  // 2) Repli OSRM (OpenStreetMap), avec une tentative supplémentaire si la première échoue ou traîne
  //    (réseau capricieux) avant de tomber sur l'estimation à vol d'oiseau.
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 3500);
      const url = `https://router.project-osrm.org/route/v1/driving/${a.lon},${a.lat};${b.lon},${b.lat}?overview=simplified&geometries=geojson`;
      const res = await fetch(url, { signal: ctrl.signal });
      clearTimeout(t);
      const json = await res.json();
      const r = json.routes?.[0];
      if (!r) throw new Error("no route");
      const out: RouteResult = {
        km: r.distance / 1000,
        minutes: Math.round((r.duration / 60) * 0.85),
        coords: r.geometry.coordinates.map(([lon, lat]: [number, number]) => [lat, lon]),
        exact: true,
      };
      cache.set(id, out);
      return out;
    } catch {
      // deuxième tentative, sinon on tombe sur le repli ci-dessous
    }
  }
  const km = haversineKm(a, b) * 1.35;
  return { km, minutes: Math.round((km / 42) * 60), coords: [[a.lat, a.lon], [b.lat, b.lon]], exact: false };
}

export type AddressHit = { label: string; sub: string; lat: number; lon: number };

// Recherche d'adresse libre limitée à la Guadeloupe.
// 1) Base Adresse Nationale (Géoplateforme IGN) : toutes les rues et numéros officiels, y compris les cités et lotissements
//    absents d'OpenStreetMap (ex. « 15 Rue de la Cité Elise, Le Gosier », retour Vincent 16/11/2026).
// 2) Photon (OpenStreetMap) : hôtels, gîtes, plages et lieux connus, qui n'ont pas d'adresse dans la BAN.
const GP = { w: -61.85, s: 15.82, e: -60.95, n: 16.53 };
const inGuadeloupe = (lat: number, lon: number) => lat >= GP.s && lat <= GP.n && lon >= GP.w && lon <= GP.e;

async function searchBan(q: string): Promise<AddressHit[]> {
  try {
    const url = `https://data.geopf.fr/geocodage/search/?q=${encodeURIComponent(q)}&limit=20&autocomplete=1&lat=16.21&lon=-61.49`;
    const json = await (await fetch(url)).json();
    return (json.features ?? [])
      .filter((f: { properties: Record<string, string> }) => String(f.properties.postcode ?? "").startsWith("971"))
      .map((f: { properties: Record<string, string>; geometry: { coordinates: [number, number] } }) => {
        const p = f.properties;
        return { label: p.name || p.label, sub: [p.postcode, p.city].filter(Boolean).join(" "), lat: f.geometry.coordinates[1], lon: f.geometry.coordinates[0] };
      })
      .filter((h: AddressHit) => inGuadeloupe(h.lat, h.lon))
      .slice(0, 5);
  } catch {
    return [];
  }
}

async function searchPhoton(q: string): Promise<AddressHit[]> {
  try {
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=6&lang=fr&bbox=${GP.w},${GP.s},${GP.e},${GP.n}`;
    const json = await (await fetch(url)).json();
    return (json.features ?? []).map((f: { properties: Record<string, string>; geometry: { coordinates: [number, number] } }) => {
      const p = f.properties;
      const label = p.name || [p.housenumber, p.street].filter(Boolean).join(" ") || p.city || "Adresse";
      const sub = [p.street && p.name ? p.street : "", p.city || p.county || ""].filter(Boolean).join(", ");
      return { label, sub, lat: f.geometry.coordinates[1], lon: f.geometry.coordinates[0] };
    });
  } catch {
    return [];
  }
}

export async function searchAddress(q: string): Promise<AddressHit[]> {
  if (q.trim().length < 3) return [];
  const [ban, osm] = await Promise.all([searchBan(q), searchPhoton(q)]);
  const out: AddressHit[] = [];
  const key = (h: AddressHit) => `${h.label.toLowerCase()}|${h.lat.toFixed(3)}|${h.lon.toFixed(3)}`;
  const seen = new Set<string>();
  for (const h of [...ban, ...osm]) {
    if (seen.has(key(h))) continue;
    seen.add(key(h));
    out.push(h);
  }
  return out.slice(0, 8);
}
