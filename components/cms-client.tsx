"use client";
// Applique le contenu de /admin aux objets du site dans le navigateur, AVANT le rendu des enfants
// (même résultat que le rendu serveur : pas d'écart à l'hydratation).
import { appliquerCms, type CmsData } from "@/lib/cms-appliquer";

export function CmsClient({ data, children }: { data: CmsData | null; children: React.ReactNode }) {
  appliquerCms(data);
  return <>{children}</>;
}
