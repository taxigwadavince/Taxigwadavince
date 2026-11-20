// Titres et textes de la page Tarifs & services et de la page Estimateur. Les prix sont dans « Vos tarifs ».
const mot = (name, dans, group) => ({ name, title: `${dans} : mot mis en valeur`, description: 'Un ou deux mots du titre, écrits exactement pareil. Ils apparaissent en couleur.', type: 'string', group })
const t = (name, title, group, rows) => (rows ? { name, title, type: 'text', rows, group } : { name, title, type: 'string', group })
export default {
  name: 'pageTarifs',
  title: 'Page Tarifs et estimateur',
  type: 'document',
  groups: [
    { name: 'haut', title: 'Tarifs : haut de page' },
    { name: 'services', title: 'Tarifs : services' },
    { name: 'grille', title: 'Tarifs : grille tarifaire' },
    { name: 'exemples', title: 'Tarifs : exemples de prix' },
    { name: 'estimateur', title: 'Estimateur' },
  ],
  fields: [
    t('heroKicker', 'Tarifs : haut de page : petit titre au-dessus', 'haut'),
    t('heroTitre', 'Tarifs : haut de page : grand titre', 'haut'),
    mot('heroMot', 'Tarifs : haut de page', 'haut'),
    t('servicesTitre', 'Tarifs : services : titre', 'services'),
    mot('servicesMot', 'Tarifs : services', 'services'),
    t('grilleTitre', 'Tarifs : grille tarifaire : titre', 'grille'),
    mot('grilleMot', 'Tarifs : grille tarifaire', 'grille'),
    t('grilleIntro', 'Tarifs : grille tarifaire : phrase sous le titre', 'grille', 2),
    t('paiement', 'Tarifs : grille tarifaire : phrase sur le paiement', 'grille'),
    t('exemplesTitre', 'Tarifs : exemples de prix : titre', 'exemples'),
    mot('exemplesMot', 'Tarifs : exemples de prix', 'exemples'),
    t('exemplesNote', 'Tarifs : exemples de prix : petite note sous les prix', 'exemples', 2),
    t('compteurNote', 'Tarifs : exemples de prix : note sous le compteur', 'exemples', 2),
    t('estimateurKicker', 'Estimateur : petit titre au-dessus', 'estimateur'),
    t('estimateurTitre', 'Estimateur : grand titre', 'estimateur'),
    mot('estimateurMot', 'Estimateur', 'estimateur'),
    t('estimateurIntro', 'Estimateur : phrase sous le titre', 'estimateur', 2),
    t('reperesTitre', 'Estimateur : titre des trajets les plus demandés', 'estimateur'),
    mot('reperesMot', 'Estimateur : trajets les plus demandés', 'estimateur'),
    t('reperesIntro', 'Estimateur : phrase sous ce titre', 'estimateur', 2),
  ],
}
