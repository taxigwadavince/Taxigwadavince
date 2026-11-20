"use client";
// Connexion à l'espace de gestion : un simple mot de passe.
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icons";

// MCP: 21st.dev « Login Card » (id 28353) : carte centrée, monogramme, mot de passe avec bouton Afficher
export default function Connexion() {
  const r = useRouter();
  const [mdp, setMdp] = useState("");
  const [voir, setVoir] = useState(false);
  const [erreur, setErreur] = useState("");
  const [envoi, setEnvoi] = useState(false);

  async function valider(e: React.FormEvent) {
    e.preventDefault();
    setEnvoi(true);
    setErreur("");
    const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ motDePasse: mdp }) });
    if (res.ok) {
      r.replace("/admin");
      r.refresh();
    } else {
      setErreur(((await res.json().catch(() => ({}))) as { erreur?: string }).erreur ?? "Connexion impossible.");
      setEnvoi(false);
    }
  }

  return (
    <div className="relative grid min-h-dvh place-items-center overflow-hidden bg-vert-900 px-5">
      <div aria-hidden className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url(/img/texture-vert.webp)" }} />
      <form onSubmit={valider} className="relative w-full max-w-sm rounded-[2rem] bg-white p-7 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)] sm:p-9">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/logo-rond.png" alt="Taxi Gwada Vince" className="mx-auto size-16 rounded-full" />
        <h1 className="mt-6 text-center font-display text-[1.9rem] font-bold text-encre">
          Votre espace, <span className="text-vert">Vincent.</span>
        </h1>
        <p className="mt-2 text-center font-sans text-sm text-gris">Réservations, textes, photos et tarifs du site.</p>
        <label htmlFor="mdp" className="mt-7 block font-sans text-sm font-semibold text-vert">Mot de passe</label>
        <div className="mt-2 flex items-center rounded-full border border-vert/20 bg-white pr-2 focus-within:border-or">
          <input
            id="mdp"
            type={voir ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Votre mot de passe"
            value={mdp}
            onChange={(e) => setMdp(e.target.value)}
            className="min-w-0 flex-1 rounded-full bg-transparent px-5 py-3.5 font-sans text-[1rem] text-encre outline-none"
            required
          />
          <button type="button" onClick={() => setVoir((v) => !v)} className="rounded-full px-3 py-2 font-sans text-xs font-semibold text-vert hover:bg-menthe">
            {voir ? "Masquer" : "Afficher"}
          </button>
        </div>
        {erreur && <p role="alert" className="mt-3 font-sans text-sm font-semibold text-[#9b2c2c]">{erreur}</p>}
        <button disabled={envoi} className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-vert py-3.5 font-sans font-semibold text-white transition-colors hover:bg-vert-900 disabled:opacity-60">
          <Icon name="ph:lock-bold" className="size-4 text-soleil" />
          {envoi ? "Connexion…" : "Me connecter"}
        </button>
      </form>
    </div>
  );
}
