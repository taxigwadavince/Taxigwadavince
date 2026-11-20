// Question fréquente : page FAQ (rangée par rubrique) et, si cochée, page d'accueil.
export default {
  name: 'question',
  title: 'Question fréquente',
  type: 'document',
  fields: [
    { name: 'rubrique', title: 'Rubrique', type: 'string', options: { list: [{ title: 'Réservation', value: 'reservation' }, { title: 'Prix et paiement', value: 'tarifs' }, { title: 'Aéroport et trajets', value: 'trajets' }] } },
    { name: 'q', title: 'Question', type: 'string' },
    { name: 'a', title: 'Réponse', type: 'text', rows: 5 },
    { name: 'surAccueil', title: "Afficher aussi sur la page d'accueil", description: "Les 6 premières questions cochées apparaissent sur l'accueil.", type: 'boolean' },
    { name: 'lienTexte', title: 'Bouton sous la réponse : texte (facultatif)', description: 'Ex. : Estimer mon trajet', type: 'string' },
    { name: 'lienAdresse', title: 'Bouton sous la réponse : page visée (facultatif)', description: 'Ex. : /estimateur ou /reserver', type: 'string' },
    { name: 'motsCles', title: 'Mots-clés pour la recherche (facultatif)', description: 'Mots que les visiteurs pourraient taper pour trouver cette question.', type: 'string' },
    { name: 'ordre', title: 'Ordre (ne pas modifier)', type: 'number', hidden: true },
  ],
}
