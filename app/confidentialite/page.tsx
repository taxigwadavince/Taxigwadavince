import type { Metadata } from "next";
import { LegalPage, Todo } from "@/components/legal";
import { gmailLink, site } from "@/lib/site";

export const metadata: Metadata = { title: "Politique de confidentialité", description: "Comment Taxi Gwada Vince utilise et protège les données transmises lors d'une demande de course, et comment exercer vos droits.", alternates: { canonical: "/confidentialite" } };

export default function Page() {
  return (
    <LegalPage title="Politique de confidentialité" updated="24 octobre 2026">
      <div>
        <h2>Responsable du traitement</h2>
        <p>
          Taxi Gwada Vince, Vincent <Todo>nom de famille</Todo>, {site.address}, {site.city}. Contact : <a href={gmailLink("Mes données personnelles")} target="_blank" rel="noreferrer">{site.email}</a>.
        </p>
      </div>
      <div>
        <h2>Données collectées et finalités</h2>
        <ul>
          <li><strong>Demande de réservation</strong> : nom, téléphone, e-mail (facultatif), lieux de départ et d&apos;arrivée, date et heure, nombre de passagers et de valises, numéro de vol ou de bateau, message. Finalité : organiser et confirmer votre course. Base légale : mesures précontractuelles prises à votre demande.</li>
          <li><strong>Estimateur</strong> : les adresses saisies servent uniquement au calcul de l&apos;itinéraire et ne sont pas conservées par Taxi Gwada Vince.</li>
          <li><strong>Messages WhatsApp, appels et e-mails</strong> que vous choisissez d&apos;envoyer : réponse à votre demande. Base légale : intérêt légitime.</li>
          <li><strong>Factures et reçus</strong> : obligation légale de conservation comptable.</li>
        </ul>
      </div>
      <div>
        <h2>Destinataires et sous-traitants</h2>
        <ul>
          <li>Vercel Inc. (hébergement du site, États-Unis).</li>
          <li>Web3Forms ou Resend (transmission par e-mail des demandes de réservation à Vincent), selon le service activé.</li>
          <li>Google (messagerie Gmail de Taxi Gwada Vince) pour la réception des e-mails.</li>
          <li>WhatsApp (Meta), uniquement si vous choisissez d&apos;écrire par WhatsApp.</li>
          <li>Géoplateforme de l&apos;IGN (Base Adresse Nationale, France) et OpenStreetMap : Photon (Komoot, Allemagne) pour la recherche d&apos;adresses et OSRM pour le calcul d&apos;itinéraire reçoivent les adresses ou coordonnées saisies dans l&apos;estimateur.</li>
          <li>Google Maps Platform (Google, États-Unis), lorsque ce service est activé, reçoit les coordonnées de départ et d&apos;arrivée pour calculer l&apos;itinéraire.</li>
        </ul>
        <p>Certains de ces prestataires peuvent traiter des données hors de l&apos;Union européenne ; ces transferts sont encadrés par des clauses contractuelles types de la Commission européenne ou le Data Privacy Framework. Vos données ne sont jamais vendues.</p>
      </div>
      <div>
        <h2>Durées de conservation</h2>
        <ul>
          <li>Demandes de réservation : 3 ans après le dernier contact.</li>
          <li>Pièces comptables : 10 ans.</li>
        </ul>
      </div>
      <div>
        <h2>Cookies</h2>
        <p>Ce site ne dépose aucun cookie publicitaire ni de mesure d&apos;audience. Aucun bandeau de consentement n&apos;est donc nécessaire.</p>
      </div>
      <div>
        <h2>Vos droits</h2>
        <p>Vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, d&apos;opposition, de limitation et de portabilité de vos données. Pour l&apos;exercer, écrivez à <a href={gmailLink("Mes données personnelles")} target="_blank" rel="noreferrer">{site.email}</a>. Vous pouvez aussi introduire une réclamation auprès de la CNIL (cnil.fr).</p>
      </div>
    </LegalPage>
  );
}
