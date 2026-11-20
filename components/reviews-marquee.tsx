"use client";

// MCP: "testimonials marquee" -> Testimonials Marquee (21st.dev #19852) : deux rangées de cartes d'avis en sens
// opposés, pause au survol, fondus sur les bords. Adapté : vrais avis Google de Taxi Gwada Vince, sans avatar
// inventé (initiales remplacées par les étoiles), pas de trait latéral (règle 286).
import { reviews } from "@/lib/content";
import { Icon } from "./icons";

function Card({ r }: { r: (typeof reviews)[number] }) {
  return (
    <figure className="w-[300px] shrink-0 rounded-[20px] bg-white/7 p-5 ring-1 ring-white/12 sm:w-[360px]">
      <div className="flex text-or">
        {Array.from({ length: 5 }).map((_, i) => (
          <Icon key={i} name="ph:star-fill" className="size-4" />
        ))}
      </div>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-creme">{r.text}</p>
      <figcaption className="mt-4 flex items-center justify-between text-sm">
        <span className="font-semibold text-soleil">{r.name}</span>
        <span className="text-xs text-creme/85">Avis Google résumé</span>
      </figcaption>
    </figure>
  );
}

function Row({ items, reverse }: { items: typeof reviews; reverse?: boolean }) {
  return (
    <div className="group flex overflow-hidden [--gap:1.5rem]">
      <div
        className="flex shrink-0 gap-6 pr-6 group-hover:[animation-play-state:paused]"
        style={{ animation: `marquee 60s linear infinite${reverse ? " reverse" : ""}` }}
      >
        {[...items, ...items].map((r, i) => (
          <Card key={i} r={r} />
        ))}
      </div>
    </div>
  );
}

export function ReviewsMarquee({ rows = 2 }: { rows?: 1 | 2 }) {
  const half = Math.ceil(reviews.length / 2);
  return (
    <div className="relative mt-10 flex flex-col gap-6 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      {rows === 1 ? (
        <Row items={reviews} />
      ) : (
        <>
          <Row items={reviews.slice(0, half)} />
          <Row items={reviews.slice(half)} reverse />
        </>
      )}
    </div>
  );
}
