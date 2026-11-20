"use client";

// INSPIRATION: PSP Sécurité components/floating-call.tsx (bouton flottant téléphone uniquement, masqué au footer).
// Règle permanente Tom (279) : visible sur toutes les pages, hero compris, jamais masqué section par section.
// Un seul bouton d'action (264), aucune animation (274), ombre neutre.
// CTA flottant = demande de réservation (équivalent devis / rendez-vous), vers bookingHref (/reserver).
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "./icons";
import { bookingHref } from "@/lib/site";
import { cn } from "@/lib/utils";

export function FloatingCta() {
  const path = usePathname();
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const footer = document.querySelector("[data-footer]");
    if (!footer) return;
    const io = new IntersectionObserver(([e]) => setHide(e.isIntersecting), { threshold: 0.05 });
    io.observe(footer);
    return () => io.disconnect();
  }, [path]);

  if (path.startsWith("/reserver") || path.startsWith("/estimateur")) return null;

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 px-4 pb-[max(14px,env(safe-area-inset-bottom))] transition-opacity duration-300 lg:hidden",
        hide ? "pointer-events-none opacity-0" : "opacity-100",
      )}
    >
      <Link
        href={bookingHref}
        className="mx-auto flex h-14 max-w-md items-center justify-between rounded-full bg-or pr-2 pl-6 font-semibold text-vert-900 shadow-[0_10px_30px_-8px_rgba(0,0,0,0.45)]"
      >
        Réserver ma course
        <span className="grid size-10 place-items-center rounded-full bg-vert-900 text-or">
          <Icon name="ph:arrow-right-bold" className="size-4" />
        </span>
      </Link>
    </div>
  );
}
