// Coordonnées affichées partout sur le site (menu, pied de page, boutons d'appel et WhatsApp).
export default {
  name: 'reglages',
  title: 'Coordonnées',
  type: 'document',
  fields: [
    { name: 'telephone', title: 'Téléphone', description: "Ex. : 0690 64 75 63. Sert aussi aux boutons « Appeler » et WhatsApp.", type: 'string' },
    { name: 'email', title: 'E-mail', type: 'string' },
    { name: 'adresse', title: 'Adresse', description: 'Ex. : 15 rue de la Cité Élise', type: 'string' },
    { name: 'ville', title: 'Code postal et ville', description: 'Ex. : 97190 Le Gosier', type: 'string' },
    { name: 'horaires', title: 'Disponibilité affichée', description: 'Ex. : 24h/24, 7j/7', type: 'string' },
    { name: 'paiement', title: 'Moyens de paiement', description: 'Ex. : Carte bancaire ou espèces, à bord', type: 'string' },
    { name: 'nombreAvis', title: "Nombre d'avis Google", description: "Affiché à côté des étoiles. Mettez-le à jour de temps en temps.", type: 'number' },
    { name: 'lienAvisGoogle', title: 'Lien vers vos avis Google', description: 'Adresse complète, commençant par https://', type: 'url' },
  ],
}
