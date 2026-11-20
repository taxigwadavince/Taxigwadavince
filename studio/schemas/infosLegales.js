// Informations légales obligatoires. Tant qu'un champ est vide, le site affiche « [À compléter] » à sa place.
export default {
  name: 'infosLegales',
  title: 'Mentions légales',
  type: 'document',
  groups: [{ name: 'entreprise', title: 'Votre entreprise' }, { name: 'conditions', title: 'Conditions de réservation' }, { name: 'dates', title: 'Dates de mise à jour' }],
  fields: [
    { name: 'nomFamille', title: 'Votre nom de famille', type: 'string', group: 'entreprise' },
    { name: 'formeJuridique', title: 'Forme juridique', description: 'Ex. : entrepreneur individuel', type: 'string', group: 'entreprise' },
    { name: 'siret', title: 'Numéro SIRET', description: '14 chiffres', type: 'string', group: 'entreprise' },
    { name: 'licence', title: 'Licence de taxi', description: "Numéro d'autorisation de stationnement et commune. Ex. : n° 12, Le Gosier", type: 'string', group: 'entreprise' },
    { name: 'tva', title: 'TVA', description: 'Votre numéro de TVA, ou « TVA non applicable, art. 293 B du CGI »', type: 'string', group: 'entreprise' },
    { name: 'annulation', title: "Conditions d'annulation", description: "Ex. : Annulation sans frais jusqu'à 24 h avant la prise en charge.", type: 'text', rows: 3, group: 'conditions' },
    { name: 'mediateur', title: 'Médiateur de la consommation', description: 'Nom, adresse et site internet du médiateur auquel vous avez adhéré.', type: 'text', rows: 3, group: 'conditions' },
    { name: 'majMentions', title: 'Mentions légales : mise à jour le', description: 'Ex. : 20 novembre 2026', type: 'string', group: 'dates' },
    { name: 'majCgv', title: 'Conditions de réservation : mise à jour le', type: 'string', group: 'dates' },
    { name: 'majConfidentialite', title: 'Confidentialité : mise à jour le', type: 'string', group: 'dates' },
  ],
}
