"use client";

import { useRef, useState } from "react";
import { faqCount, faqSections } from "@/lib/faq";
import { site, whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";
import { FaqList } from "./faq-list";
import { Icon } from "./icons";

const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr").replace(/[^a-z0-9]+/g, " ").trim();

export function FaqExplorer() {
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const terms = normalize(query).split(" ").filter(Boolean);
  const sections = faqSections
    .filter((section) => category === "all" || section.id === category)
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        const text = normalize(`${item.q} ${item.a} ${item.keywords ?? ""}`);
        return terms.every((term) => text.includes(term));
      }),
    }))
    .filter((section) => section.items.length > 0);
  const count = sections.reduce((total, section) => total + section.items.length, 0);

  const reset = () => {
    setQuery("");
    setCategory("all");
    input.current?.focus();
  };

  return (
    <section id="questions" aria-labelledby="questions-title" className="scroll-mt-24 bg-creme px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto grid max-w-[1200px] items-start gap-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-20">
        <aside className="lg:sticky lg:top-28">
          <p className="text-xs font-semibold tracking-[0.18em] text-gris uppercase">Votre itinéraire</p>
          <h2 id="questions-title" className="mt-3 font-display text-3xl font-bold text-vert-900">Une question,<br className="hidden lg:block" /> un arrêt.</h2>
          <div role="group" aria-label="Filtrer les questions par thème" className="mt-6 flex flex-wrap gap-2 lg:mt-8 lg:flex-col lg:gap-1">
            {[{ id: "all", label: "Toutes les questions", count: faqCount }, ...faqSections.map((section) => ({ ...section, count: section.items.length }))].map((item, i) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={category === item.id}
                aria-controls="faq-results"
                onClick={() => setCategory(item.id)}
                className={cn(
                  "group flex min-h-12 items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-vert lg:w-full",
                  category === item.id ? "bg-vert text-creme" : "bg-vert/5 text-vert hover:bg-vert/10 lg:bg-transparent",
                )}
              >
                <span aria-hidden="true" className={cn("hidden size-7 shrink-0 items-center justify-center rounded-full border text-xs tabular lg:flex", category === item.id ? "border-soleil bg-soleil text-vert-900" : "border-vert/25")}>{i === 0 ? <Icon name="ph:list-bold" className="size-3.5" /> : `0${i}`}</span>
                <span className="flex-1">{item.label}</span>
                <span className={cn("text-xs tabular", category === item.id ? "text-soleil" : "text-gris")}>{item.count}</span>
              </button>
            ))}
          </div>
          <div className="mt-8 hidden border-t border-dashed border-vert/25 pt-7 lg:block">
            <p className="font-display text-xl font-bold text-vert-900">On en parle de vive voix ?</p>
            <p className="mt-2 text-sm leading-relaxed text-gris">Pour un départ proche ou un trajet particulier, appelez Vincent.</p>
            <a href={site.phoneHref} className="mt-4 inline-flex min-h-11 items-center gap-2 font-semibold text-vert underline-offset-4 hover:underline">
              <Icon name="ph:phone-bold" className="size-4" /> <span className="tabular">{site.phoneDisplay}</span>
            </a>
          </div>
        </aside>

        <div className="min-w-0">
          <label htmlFor="faq-search" className="mb-3 block text-sm font-semibold text-vert-900">Quel détail vous manque pour partir ?</label>
          <div className="flex min-h-16 items-center gap-3 rounded-2xl bg-white px-4 ring-1 ring-vert/20 transition-shadow focus-within:ring-2 focus-within:ring-vert sm:px-5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true" className="size-5 shrink-0 text-vert"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4 4" /></svg>
            <input
              ref={input}
              id="faq-search"
              type="search"
              value={query}
              onChange={(event) => { setQuery(event.target.value); setCategory("all"); }}
              maxLength={80}
              placeholder="Aéroport, bagages, paiement…"
              autoComplete="off"
              aria-controls="faq-results"
              className="h-16 min-w-0 flex-1 bg-transparent text-base text-encre outline-none placeholder:text-gris/75 [&::-webkit-search-cancel-button]:appearance-none"
            />
            {query && <button type="button" onClick={reset} aria-label="Effacer la recherche" className="grid size-11 shrink-0 place-items-center rounded-full text-vert hover:bg-menthe focus-visible:outline-2 focus-visible:outline-vert"><Icon name="ph:x-bold" className="size-4" /></button>}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-b border-vert/15 pb-6">
            <p role="status" aria-atomic="true" className="text-xs text-gris">
              <span className="font-semibold text-vert tabular">{count}</span> réponse{count !== 1 ? "s" : ""}{terms.length ? " pour votre recherche" : " pour préparer votre trajet"}
            </p>
            {(query || category !== "all") && <button type="button" onClick={reset} className="min-h-11 text-xs font-semibold text-vert underline underline-offset-4">Tout afficher</button>}
          </div>

          <div id="faq-results" className="mt-8 space-y-12">
            {sections.map((section) => (
              <section key={section.id} aria-labelledby={`heading-${section.id}`}>
                <div className="mb-4 flex items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-menthe text-vert"><Icon name={section.icon} className="size-5" /></span>
                  <div>
                    <p className="text-[0.65rem] font-semibold tracking-[0.16em] text-gris uppercase">{section.label}</p>
                    <h3 id={`heading-${section.id}`} className="mt-1 font-display text-xl font-bold text-vert-900 sm:text-2xl">{section.title}</h3>
                  </div>
                </div>
                <FaqList key={`${category}-${query}`} items={section.items} headingLevel="h4" />
              </section>
            ))}
            {count === 0 && (
              <div className="rounded-[24px] border border-dashed border-vert/25 bg-menthe/40 px-5 py-10 text-center sm:px-10">
                <Icon name="ph:map-pin-bold" className="mx-auto size-9 text-vert" />
                <h3 className="mt-5 font-display text-2xl font-bold text-vert-900">Cette réponse prend un autre chemin.</h3>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-gris">Essayez un autre mot, comme « vol » ou « valise ». Vincent peut aussi vous répondre directement.</p>
                <a href={whatsappLink(`Bonjour Vincent, j’ai une question : ${query.trim()}`)} target="_blank" rel="noreferrer" className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-vert px-5 text-sm font-semibold text-creme transition-colors hover:bg-vert-700">
                  <Icon name="si:whatsapp" className="size-4" /> Poser ma question à Vincent
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
