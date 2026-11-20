// Un service (navette aéroport, Bergevin...) : affiché sur l'accueil et sur la page Tarifs & services.
export default {
  name: 'prestation',
  title: 'Service',
  type: 'document',
  groups: [{ name: 'accueil', title: 'Accueil' }, { name: 'tarifs', title: 'Tarifs & services' }],
  fields: [
    { name: 'cle', title: 'Code du service (ne pas modifier)', type: 'string', readOnly: true, hidden: true },
    { name: 'ordre', title: 'Ordre (ne pas modifier)', type: 'number', hidden: true },
    { name: 'titre', title: 'Nom du service', type: 'string' },
    { name: 'photo', title: 'Photo', description: 'Utilisée sur les deux pages. Format paysage de préférence.', type: 'image' },
    { name: 'sousTitre', title: "Accueil : petite ligne sous le nom", description: 'Ex. : Maryse Condé (Pôle Caraïbes)', type: 'string', group: 'accueil' },
    { name: 'texte', title: 'Accueil : description', type: 'text', rows: 3, group: 'accueil' },
    { name: 'legende', title: 'Tarifs & services : phrase sur la photo', type: 'string', group: 'tarifs' },
    { name: 'description', title: 'Tarifs & services : description détaillée', description: 'Affichée quand on ouvre le service.', type: 'text', rows: 4, group: 'tarifs' },
    { name: 'pointsForts', title: 'Tarifs & services : points forts', description: 'Deux phrases courtes.', type: 'array', of: [{ type: 'string' }], group: 'tarifs' },
  ],
}
