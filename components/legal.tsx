import { legal } from "@/lib/textes";
// INSPIRATION: skill audit-legal-site-fr (pages légales en dur, marqueurs explicites pour les données du client).
export function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <section className="bg-creme px-4 pt-36 pb-24 sm:pt-44">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-[clamp(2rem,5vw,3.2rem)] font-bold text-vert-900" style={{ lineHeight: 1.06 }}>
          {title}
        </h1>
        <p className="mt-3 text-sm text-gris">Dernière mise à jour : {updated}</p>
        <div className="mt-10 space-y-10 text-[1.02rem] leading-relaxed text-encre/90 [&_a]:font-semibold [&_a]:text-vert [&_a]:underline [&_a]:underline-offset-2 [&_h2]:font-display [&_h2]:text-[1.45rem] [&_h2]:font-bold [&_h2]:text-vert-900 [&_li]:ml-5 [&_li]:list-disc [&_p+p]:mt-3 [&_ul]:mt-3 [&_ul]:space-y-1.5">
          {children}
        </div>
      </div>
    </section>
  );
}

// Information à fournir par Vincent : affichée dès qu'elle est saisie dans /admin (Mentions légales), sinon marqueur visible.
export function Todo({ champ, children }: { champ?: keyof typeof legal; children: React.ReactNode }) {
  const v = champ ? legal[champ] : "";
  if (v && v.trim()) return <>{v}</>;
  return <mark className="rounded bg-soleil/70 px-1.5 py-0.5 font-semibold text-vert-900">[À compléter : {children}]</mark>;
}
