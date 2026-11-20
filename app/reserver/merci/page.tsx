import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { site, whatsappLink } from "@/lib/site";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "Demande de réservation enregistrée",
  description: "Votre demande de course a bien été enregistrée : envoyez le récapitulatif à Vincent et attendez sa confirmation.",
  robots: { index: false },
  alternates: { canonical: null },
};

type SP = Promise<Record<string, string | undefined>>;

export default async function Page({ searchParams }: { searchParams: SP }) {
  const raw = await searchParams;
  // Valeurs reprises de l'adresse : bornées en longueur ; sans référence, la page n'a pas lieu d'être.
  const p = Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, (v ?? "").slice(0, 120)]));
  if (!p.ref) redirect("/reserver");
  const ref = p.ref;
  const sent = p.sent === "1";
  const msg = `Bonjour Vincent, voici ma demande de course ${ref} :\n${p.from} → ${p.to} (aller simple)\nLe ${p.quand}\n${p.pax}\nEstimation à confirmer : ${p.est}`;
  return (
    // INSPIRATION: premiere-version-site piège 16 (page /merci qui affiche référence et créneau)
    <section className="relative isolate overflow-hidden bg-vert-900 px-4 pt-36 pb-24 text-creme sm:pt-44">
      <img src="/img/route-soir.webp" alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-40" />
      <div className="mx-auto max-w-xl text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-or text-vert-900">
          <Icon name="ph:check-bold" className="size-8" />
        </span>
        <h1 className="mt-6 font-display text-[clamp(2rem,6vw,3rem)] font-bold" style={{ lineHeight: 1.06 }}>
          {sent ? "Demande bien reçue" : "Plus qu'une étape"}
        </h1>
        <p className="mt-4 text-[1.05rem] leading-relaxed text-creme/90">
          {sent
            ? "Votre demande a été transmise. Attendez la confirmation de Vincent pour l'heure de prise en charge et le prix final."
            : "Envoyez votre récapitulatif à Vincent sur WhatsApp, puis attendez sa confirmation de la course et du prix final."}
        </p>
        <div className="mt-8 rounded-[22px] bg-creme p-6 text-left text-encre">
          <p className="text-xs font-semibold tracking-widest text-gris uppercase">Référence</p>
          <p className="font-sans text-2xl font-bold text-vert-900 tabular">{ref}</p>
          <dl className="mt-4 grid gap-2 text-[0.95rem]">
            <div className="flex justify-between gap-4"><dt className="text-gris">Trajet</dt><dd className="text-right font-semibold">{p.from} → {p.to}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-gris">Quand</dt><dd className="text-right font-semibold">{p.quand}</dd></div>
            {p.retour && <div className="flex justify-between gap-4"><dt className="text-gris">Retour</dt><dd className="text-right font-semibold">{p.retour}</dd></div>}
            <div className="flex justify-between gap-4"><dt className="text-gris">Estimation</dt><dd className="text-right font-bold tabular">{p.est}</dd></div>
          </dl>
        </div>
        <div className="mt-8 flex flex-col items-center gap-3">
          <Button href={whatsappLink(msg)} icon="si:whatsapp">
            {sent ? "Suivre sur WhatsApp" : "Envoyer sur WhatsApp"}
          </Button>
          <a href={site.phoneHref} className="inline-flex min-h-11 items-center gap-2 font-semibold text-soleil tabular">
            <Icon name="ph:phone-bold" className="size-4" /> ou appeler le {site.phoneDisplay}
          </a>
          <Link href="/" className="mt-2 inline-flex min-h-11 items-center text-sm text-creme/90 underline underline-offset-4">
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </section>
  );
}
