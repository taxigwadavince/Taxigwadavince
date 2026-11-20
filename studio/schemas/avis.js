// Avis de voyageurs affichés en bandeau sur l'accueil.
export default {
  name: 'avis',
  title: 'Avis',
  type: 'document',
  fields: [
    { name: 'nom', title: 'Nom du voyageur', type: 'string' },
    { name: 'texte', title: 'Ce qu\'il dit', description: 'Une ou deux phrases.', type: 'text', rows: 3 },
    { name: 'ordre', title: 'Ordre (ne pas modifier)', type: 'number', hidden: true },
  ],
}
