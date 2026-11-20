import type { Metadata } from "next";
import { LegalPage, Todo } from "@/components/legal";
import { site } from "@/lib/site";
import { TARIFS } from "@/lib/tarifs";
import { euro2 } from "@/lib/utils";

export const metadata: Metadata = { title: "Conditions de réservation", description: "Conditions de réservation des courses Taxi Gwada Vince : estimation, confirmation, paiement à bord et annulation.", alternates: { canonical: "/cgv" } };

export default function Page() {
  return (
    <LegalPage title="Conditions de réservation" updated="6 novembre 2026">
      <div>
        <h2>Objet</h2>
        <p>Ces conditions encadrent les demandes de réservation de courses de taxi effectuées auprès de Taxi Gwada Vince, en ligne, par téléphone ou par WhatsApp.</p>
      </div>
      <div>
        <h2>Demande et confirmation</h2>
        <p>Une demande envoyée depuis le site n&apos;engage la course qu&apos;après confirmation par Vincent (WhatsApp, appel ou e-mail), avec l&apos;heure de prise en charge. Sans confirmation, appelez le <a href={site.phoneHref}>{site.phoneDisplay}</a>.</p>
      </div>
      <div>
        <h2>Prix</h2>
        <p>Le montant affiché est une estimation selon les renseignements communiqués, sous réserve de confirmation finale par Vincent. Le transfert entre l&apos;aéroport Pôle Caraïbes et la gare maritime de Bergevin est proposé au forfait de {euro2(TARIFS.forfaitAeroportBergevin)}, hors temps supplémentaire demandé.</p>
        <p>Pour les autres trajets, les repères de calcul sont de {euro2(TARIFS.fraisDepart)} de frais de départ, puis {euro2(TARIFS.kmJour)} par kilomètre de jour (7&nbsp;h à 19&nbsp;h, hors dimanches et jours fériés) ou {euro2(TARIFS.kmNuit)} la nuit, le dimanche et les jours fériés. Ces tarifs sont ceux fixés par l’arrêté préfectoral n° 2026-99 du 19 janvier 2026 ; la course minimum est de {euro2(TARIFS.minimum)}, suppléments compris. Le temps supplémentaire demandé est estimé à {euro2(TARIFS.heureSupp)} par heure. Les horaires sont exprimés en heure de Guadeloupe.</p>
        <p>Une note (reçu) est remise à la fin de la course.</p>
      </div>
      <div>
        <h2>Paiement</h2>
        <p>Aucun paiement n&apos;est demandé en ligne. Le règlement se fait à bord, par carte bancaire ou en espèces.</p>
      </div>
      <div>
        <h2>Annulation et retard</h2>
        <p>
          Merci de prévenir le plus tôt possible en cas d&apos;annulation ou de changement d&apos;horaire. <Todo>délai d&apos;annulation sans frais et frais éventuels en cas d&apos;annulation tardive ou d&apos;absence</Todo>
        </p>
        <p>En cas de retard de votre vol ou de votre bateau, prévenez Vincent pour convenir de la nouvelle prise en charge et des conditions d&apos;attente.</p>
      </div>
      <div>
        <h2>Bagages et passagers</h2>
        <p>Le formulaire permet de réserver pour 1 à 4 passagers, enfants compris. Signalez les bagages volumineux et le besoin d&apos;un siège enfant pour en confirmer les possibilités avec Vincent.</p>
      </div>
      <div>
        <h2>Médiation de la consommation</h2>
        <p>En cas de litige non résolu à l&apos;amiable, vous pouvez recourir gratuitement au médiateur de la consommation : <Todo>nom, adresse et site du médiateur</Todo>.</p>
      </div>
      <div>
        <h2>Droit applicable</h2>
        <p>Ces conditions sont soumises au droit français.</p>
      </div>
    </LegalPage>
  );
}
