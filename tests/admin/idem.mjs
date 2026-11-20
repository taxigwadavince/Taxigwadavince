// Ré-enregistre chaque document sans modification et vérifie que Sanity n'a pas changé (hors métadonnées)
import fs from "fs";
const U = process.argv[2] ?? "http://localhost:3457";
const MDP = fs.readFileSync(process.env.HOME + "/.taxigwadavince-admin-password", "utf8").trim();
const r = await fetch(U + "/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ motDePasse: MDP }) });
const cookie = r.headers.get("set-cookie").split(";")[0];
const H = { cookie, "Content-Type": "application/json" };
const sections = ["pageAccueil", "pageTarifs", "infosLegales", "prestations", "tarifs", "questions", "avis", "reglages"];
const propre = (d) => JSON.parse(JSON.stringify(d, (k, v) => (["_rev", "_updatedAt", "_createdAt"].includes(k) ? undefined : v)));
// normalise : clés triées, sans hotspot/crop (non gérés, sans effet sur le site)
const norm = (v) => Array.isArray(v) ? v.map(norm) : v && typeof v === "object" ? Object.fromEntries(Object.keys(v).filter((k) => !["hotspot", "crop"].includes(k)).sort().map((k) => [k, norm(v[k])])) : v;
let ko = 0;
for (const s of sections) {
  const j = await (await fetch(`${U}/api/admin/contenu?section=${s}`, { headers: H })).json();
  const docs = j.docs ?? [j.doc];
  for (const d of docs) {
    const res = await fetch(`${U}/api/admin/contenu`, { method: "POST", headers: H, body: JSON.stringify({ action: "enregistrer", section: s, id: d._id, valeurs: d }) });
    const j2 = await (await fetch(`${U}/api/admin/contenu?section=${s}`, { headers: H })).json();
    const apres = (j2.docs ?? [j2.doc]).find((x) => x._id === d._id);
    const a = JSON.stringify(norm(propre(d))), b = JSON.stringify(norm(propre(apres)));
    if (!res.ok || a !== b) { ko++; console.log("DIFF", s, d._id, res.status); const A = norm(propre(d)), B = norm(propre(apres)); for (const k of new Set([...Object.keys(A), ...Object.keys(B)])) if (JSON.stringify(A[k]) !== JSON.stringify(B[k])) console.log("  ", k, JSON.stringify(A[k])?.slice(0, 160), "=>", JSON.stringify(B[k])?.slice(0, 160)); }
  }
  console.log(s, "ok", docs.length, "document(s)");
}
console.log(ko ? `${ko} différence(s)` : "AUCUNE DIFFÉRENCE");
