import { NextResponse } from "next/server";

// Distance Google Maps, comme le formulaire de taxigwadavince.com (Routes API, voiture, sans péage ni ferry).
// Clé côté serveur uniquement : GOOGLE_MAPS_API_KEY dans les variables Vercel. Sans clé, le client repasse sur OSRM.
function decode(str: string): [number, number][] {
  const out: [number, number][] = [];
  let i = 0, lat = 0, lng = 0;
  while (i < str.length) {
    for (const k of [0, 1]) {
      let shift = 0, result = 0, b;
      do {
        b = str.charCodeAt(i++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const d = result & 1 ? ~(result >> 1) : result >> 1;
      if (k === 0) lat += d;
      else lng += d;
    }
    out.push([lat / 1e5, lng / 1e5]);
  }
  return out;
}

const num = (v: string | null) => (v !== null && v.trim() !== "" && Number.isFinite(Number(v)) ? Number(v) : null);

export async function GET(req: Request) {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) return NextResponse.json({ error: "no_key" }, { status: 501 });
  const sp = new URL(req.url).searchParams;
  const [aLat, aLon, bLat, bLon] = ["aLat", "aLon", "bLat", "bLon"].map((k) => num(sp.get(k)));
  if (aLat === null || aLon === null || bLat === null || bLon === null) return NextResponse.json({ error: "bad_request" }, { status: 400 });

  const res = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask": "routes.distanceMeters,routes.duration,routes.polyline.encodedPolyline",
    },
    body: JSON.stringify({
      origin: { location: { latLng: { latitude: aLat, longitude: aLon } } },
      destination: { location: { latLng: { latitude: bLat, longitude: bLon } } },
      travelMode: "DRIVE",
      routeModifiers: { avoidTolls: true, avoidFerries: true },
      polylineQuality: "OVERVIEW",
      languageCode: "fr-FR",
      units: "METRIC",
    }),
    next: { revalidate: 86400 },
  });
  const json = await res.json().catch(() => null);
  const r = json?.routes?.[0];
  if (!res.ok || !r?.distanceMeters) return NextResponse.json({ error: "google_error" }, { status: 502 });

  return NextResponse.json(
    {
      km: Math.round(r.distanceMeters / 100) / 10,
      minutes: Math.ceil(parseInt(String(r.duration ?? "0"), 10) / 60),
      coords: r.polyline?.encodedPolyline ? decode(r.polyline.encodedPolyline) : [[aLat, aLon], [bLat, bLon]],
      exact: true,
    },
    { headers: { "Cache-Control": "public, s-maxage=86400" } },
  );
}
