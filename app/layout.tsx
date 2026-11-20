import type { Metadata, Viewport } from "next";
import { Syne, Poppins } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FloatingCta } from "@/components/floating-cta";
import { FloatingWhatsapp } from "@/components/floating-whatsapp";
import { ScrollProgress } from "@/components/scroll-progress";
import { site } from "@/lib/site";
import { cmsServeur } from "@/lib/cms";
import { CmsClient } from "@/components/cms-client";
import { SiteOnly } from "@/components/site-only";

// Typo de la marque conservée (site actuel) : Syne pour les titres, Poppins pour le texte.
const syne = Syne({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-syne", display: "swap" });
const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"], variable: "--font-poppins", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Taxi Gwada Vince | Taxi en Guadeloupe 24h/24, aéroport et ports",
    template: "%s | Taxi Gwada Vince",
  },
  description:
    "Taxi en Guadeloupe 24h/24 et 7j/7 : aéroport Maryse Condé (Pôle Caraïbes), gare maritime de Bergevin, croisières, hôtels et excursions. Estimez votre course et réservez en ligne.",
  keywords: ["taxi Guadeloupe", "taxi aéroport Pointe-à-Pitre", "taxi Le Gosier", "taxi Bergevin", "réserver taxi Guadeloupe", "prix taxi Guadeloupe"],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: site.url,
    siteName: site.name,
    title: "Taxi Gwada Vince | Votre taxi en Guadeloupe, 24h/24",
    description: "Estimez le prix de votre course et réservez Vincent en ligne : aéroport, ports, hôtels, excursions.",
    images: [{ url: "/og-duster.jpg", width: 1200, height: 630, alt: "Taxi Gwada Vince, taxi en Guadeloupe" }],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = { themeColor: "#0a4624", width: "device-width", initialScale: 1 };

// Hauteur d'écran figée au chargement (--ecran-h), recalculée seulement quand la largeur change (rotation) :
// les bandeaux mobiles qui tiennent sur un écran ne grandissent plus quand la barre du navigateur se replie au défilement.
const ecranH = `(function(){var d=document.documentElement,w=-1;function f(){if(innerWidth!==w){w=innerWidth;d.style.setProperty("--ecran-h",innerHeight+"px")}}f();addEventListener("resize",f)})()`;

function jsonLdSite() {
  return {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["TaxiService", "LocalBusiness"],
      "@id": `${site.url}/#taxi`,
      name: site.name,
      url: site.url,
      telephone: site.phoneIntl,
      email: site.email,
      image: `${site.url}/og-duster.jpg`,
      logo: `${site.url}/img/logo-rond.png`,
      priceRange: "€€",
      address: { "@type": "PostalAddress", streetAddress: site.address, postalCode: "97190", addressLocality: "Le Gosier", addressRegion: "Guadeloupe", addressCountry: "FR" },
      geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lon },
      areaServed: { "@type": "AdministrativeArea", name: "Guadeloupe" },
      openingHoursSpecification: { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: "00:00", closes: "23:59" },
      aggregateRating: { "@type": "AggregateRating", ratingValue: site.rating, reviewCount: site.reviewsCount },
      paymentAccepted: "Cash, Credit Card",
    },
  ],
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const cms = await cmsServeur();
  const jsonLd = jsonLdSite();
  return (
    <html lang="fr" data-scroll-behavior="smooth" className={`${syne.variable} ${poppins.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        <script dangerouslySetInnerHTML={{ __html: ecranH }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <CmsClient data={cms}>
          <SiteOnly><ScrollProgress /><Navbar /></SiteOnly>
          <main className="overflow-x-clip">{children}</main>
          <SiteOnly><Footer /><FloatingCta /><FloatingWhatsapp /></SiteOnly>
        </CmsClient>
      </body>
    </html>
  );
}
