import type { Metadata } from "next";

// Espace privé de Vincent : jamais indexé
export const metadata: Metadata = {
  title: "Espace Vincent | Taxi Gwada Vince",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-creme">{children}</div>;
}
