// Logo de Taxi Gwada Vince : vrai macaron rond (public/img/logo-rond.png, détouré depuis public/img/logo3.jpeg)
// suivi du nom en texte, dans les polices du site, pour rester lisible sur fond clair comme sur fond vert.
import { cn } from "@/lib/utils";

export function Wordmark({ tone = "clair", className }: { tone?: "clair" | "sombre"; className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <img
        src="/img/logo-rond.png"
        alt=""
        width={256}
        height={256}
        className={cn("size-12 shrink-0 rounded-full", tone === "sombre" && "ring-2 ring-white/80")}
      />
      <span className="flex flex-col leading-none whitespace-nowrap">
        <span className={cn("font-display text-[0.8rem] font-extrabold tracking-[0.2em]", tone === "clair" ? "text-or-600" : "text-soleil")}>TAXI</span>
        <span className={cn("font-display text-[1.12rem] font-extrabold tracking-tight", tone === "clair" ? "text-vert" : "text-white")}>GWADA VINCE</span>
      </span>
    </span>
  );
}
