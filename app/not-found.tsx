import type { Metadata } from "next";
import { site } from "@/lib/site";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui";
import { cmsServeur } from "@/lib/cms";

export const metadata: Metadata = { title: "Page introuvable", robots: { index: false } };

export default async function NotFound() {
  await cmsServeur();
  return (
    <section className="relative isolate overflow-hidden bg-vert-900 px-4 pt-36 pb-24 text-creme sm:pt-44">
      <img src="/img/route-soir.webp" alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-35" />
      <div className="mx-auto max-w-xl text-center">
        <p className="font-display text-[clamp(4rem,14vw,7rem)] leading-none font-extrabold text-soleil">404</p>
        <h1 className="mt-4 font-display text-[clamp(1.8rem,5vw,2.6rem)] font-bold" style={{ lineHeight: 1.08 }}>
          Ce trajet n&apos;existe pas
        </h1>
        <p className="mt-4 text-[1.05rem] leading-relaxed text-creme/90">
          La page demandée est introuvable ou a été déplacée. Reprenez la route depuis l&apos;accueil ou estimez directement votre course.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href="/estimateur" icon="ph:calculator-bold">
            Estimer ma course
          </Button>
          <Button href="/" variant="verre" icon="ph:arrow-right-bold">
            Retour à l&apos;accueil
          </Button>
        </div>
        <a href={site.phoneHref} className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-soleil tabular">
          <Icon name="ph:phone-bold" className="size-4" /> {site.phoneDisplay}
        </a>
      </div>
    </section>
  );
}
