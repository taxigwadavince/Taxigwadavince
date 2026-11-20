import type { Metadata } from "next";
import { LegalPage, Todo } from "@/components/legal";
import { gmailLink, site } from "@/lib/site";
import { cmsServeur } from "@/lib/cms";
import { legal } from "@/lib/textes";

export const metadata: Metadata = { title: "Mentions légales", description: "Mentions légales du site Taxi Gwada Vince : éditeur, hébergeur et propriété intellectuelle.", alternates: { canonical: "/mentions-legales" } };

export default async function Page() {
  await cmsServeur();
  return (
    <LegalPage title="Mentions légales" updated={legal.majMentions}>
      <div>
        <h2>Éditeur du site</h2>
        <p>
          Taxi Gwada Vince, exploité par Vincent <Todo champ="nomFamille">nom de famille</Todo>, <Todo champ="formeJuridique">forme juridique (entrepreneur individuel, société…)</Todo>.
        </p>
        <ul>
          <li>Adresse : {site.address}, {site.city}, {site.region}</li>
          <li>Téléphone : <a href={site.phoneHref}>{site.phoneDisplay}</a></li>
          <li>E-mail : <a href={gmailLink("Contact")} target="_blank" rel="noreferrer">{site.email}</a></li>
          <li>SIRET : <Todo champ="siret">numéro SIRET</Todo></li>
          <li>Numéro d&apos;autorisation de stationnement (licence de taxi) : <Todo champ="licence">numéro et commune</Todo></li>
          <li>TVA : <Todo champ="tva">numéro de TVA intracommunautaire ou mention « TVA non applicable, art. 293 B du CGI »</Todo></li>
        </ul>
        <p>Directeur de la publication : Vincent <Todo champ="nomFamille">nom de famille</Todo>.</p>
      </div>
      <div>
        <h2>Hébergement</h2>
        <p>Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis. vercel.com</p>
      </div>
      <div>
        <h2>Conception</h2>
        <p>
          Site réalisé par <a href={site.credit.href} target="_blank" rel="noreferrer">ACTC Studio</a>.
        </p>
      </div>
      <div>
        <h2>Crédits et données</h2>
        <ul>
          <li>Photographies originales du véhicule fournies par Taxi Gwada Vince. Visuels d&apos;illustration générés ou retouchés par intelligence artificielle.</li>
          <li>Contour de la Guadeloupe, recherche d&apos;adresses et itinéraires : données © contributeurs OpenStreetMap (licence ODbL), services Nominatim, Photon (Komoot) et OSRM ; adresses officielles : Base Adresse Nationale (IGN, Licence Ouverte).</li>
          <li>Avis clients : avis publics de la fiche Google de Taxi Gwada Vince.</li>
        </ul>
      </div>
      <div>
        <h2>Propriété intellectuelle</h2>
        <p>Les textes, visuels, logo et la mise en page de ce site sont protégés. Toute reproduction sans autorisation écrite de l&apos;éditeur est interdite.</p>
      </div>
      <div>
        <h2>Estimations de prix</h2>
        <p>Les prix affichés par l&apos;estimateur sont indicatifs et soumis à confirmation finale par le chauffeur, y compris les modalités du forfait aéroport–Bergevin et des options demandées.</p>
      </div>
    </LegalPage>
  );
}
