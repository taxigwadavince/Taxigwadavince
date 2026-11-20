"use client";
// Masque l'habillage du site public (menu, pied de page, bouton flottant) dans l'espace d'administration.
import { usePathname } from "next/navigation";

export function SiteOnly({ children }: { children: React.ReactNode }) {
  const p = usePathname();
  if (p?.startsWith("/admin")) return null;
  return <>{children}</>;
}
