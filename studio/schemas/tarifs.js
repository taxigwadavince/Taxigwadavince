// Tarifs utilisés par l'estimateur, la page Tarifs et le formulaire de réservation.
export default {
  name: 'tarifs',
  title: 'Tarifs',
  type: 'document',
  fields: [
    { name: 'fraisDepart', title: 'Prise en charge (€)', description: 'Ex. : 3,73. Montant fixe au départ de chaque course.', type: 'number' },
    { name: 'kmJour', title: 'Prix du km, tarif de jour (€)', description: 'De 7 h à 19 h, hors dimanches et jours fériés. Ex. : 2,10', type: 'number' },
    { name: 'kmNuit', title: 'Prix du km, tarif de nuit (€)', description: 'De 19 h à 7 h, dimanches et jours fériés. Ex. : 3,15', type: 'number' },
    { name: 'heureAttente', title: "Heure d'attente (€)", description: 'Ex. : 25,04', type: 'number' },
    { name: 'minimum', title: 'Course minimum (€)', description: 'Ex. : 8', type: 'number' },
    { name: 'forfaitAeroportBergevin', title: 'Forfait aéroport ↔ Bergevin (€)', description: 'Ex. : 30. Pensez à mettre à jour la question de la FAQ qui cite ce prix.', type: 'number' },
  ],
}
