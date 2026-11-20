// Demande de réservation envoyée depuis le site. Document privé (identifiant « resa.… ») : jamais lisible sans la clé.
export const STATUTS = [
  { title: 'Nouvelle demande', value: 'nouvelle' },
  { title: 'Confirmée', value: 'confirmee' },
  { title: 'Effectuée', value: 'effectuee' },
  { title: 'Annulée', value: 'annulee' },
]
export default {
  name: 'reservation',
  title: 'Réservation',
  type: 'document',
  fields: [
    { name: 'statut', title: 'Statut', type: 'string', options: { list: STATUTS } },
    { name: 'reference', title: 'Référence', type: 'string', readOnly: true },
    { name: 'date', title: 'Date de prise en charge', type: 'date' },
    { name: 'heure', title: 'Heure', type: 'string' },
    { name: 'depart', title: 'Départ', type: 'string' },
    { name: 'arrivee', title: 'Arrivée', type: 'string' },
    { name: 'nom', title: 'Nom', type: 'string' },
    { name: 'telephone', title: 'Téléphone', type: 'string' },
    { name: 'email', title: 'E-mail', type: 'string' },
    { name: 'contact', title: 'Confirmation souhaitée par', type: 'string' },
    { name: 'adultes', title: 'Adultes', type: 'number' },
    { name: 'enfants', title: 'Enfants', type: 'number' },
    { name: 'valises', title: 'Valises', type: 'number' },
    { name: 'siegeEnfant', title: 'Siège enfant', type: 'boolean' },
    { name: 'vol', title: 'Vol ou bateau', type: 'string' },
    { name: 'heuresSupp', title: 'Temps supplémentaire (h)', type: 'number' },
    { name: 'estimation', title: 'Estimation affichée', type: 'string' },
    { name: 'km', title: 'Distance (km)', type: 'string' },
    { name: 'message', title: 'Message du client', type: 'text' },
    { name: 'creeLe', title: 'Reçue le', type: 'datetime', readOnly: true },
  ],
}
