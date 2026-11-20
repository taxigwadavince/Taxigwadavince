"use client";

// Demande de Vincent (vocal 16/11/2026) : retrouver la pastille WhatsApp flottante de son ancien site,
// visible sur toutes les pages, pour écrire directement depuis n'importe où.
// Téléphone : posée au-dessus de la barre « Réserver ma course » (quand elle est affichée), à droite.
import { usePathname } from "next/navigation";
import { Icon } from "./icons";
import { whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";

export function FloatingWhatsapp() {
  const path = usePathname();
  const withBar = !(path.startsWith("/reserver") || path.startsWith("/estimateur"));
  return (
    <a
      href={whatsappLink("Bonjour Vincent, je vous contacte depuis votre site :")}
      target="_blank"
      rel="noreferrer"
      aria-label="Écrire à Vincent sur WhatsApp"
      className={cn(
        "fixed right-4 z-30 grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-8px_rgba(0,0,0,0.5)] ring-4 ring-white/70 transition-transform hover:scale-105 lg:right-6 lg:bottom-6",
        withBar ? "bottom-[calc(max(14px,env(safe-area-inset-bottom))+4.25rem)]" : "bottom-[max(16px,env(safe-area-inset-bottom))]",
      )}
    >
      <Icon name="si:whatsapp" className="size-7" />
    </a>
  );
}
