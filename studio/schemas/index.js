import reglages from './reglages'
import tarifs from './tarifs'
import pageAccueil from './pageAccueil'
import prestation from './prestation'
import avis from './avis'
import question from './question'
import reservation from './reservation'
import pageTarifs from './pageTarifs'
import infosLegales from './infosLegales'

const accesAdmin = { name: 'accesAdmin', title: 'Accès à l’espace (ne pas modifier)', type: 'document', fields: [{ name: 'modifieLe', title: 'Modifié le', type: 'datetime', readOnly: true }] }

export const schemaTypes = [reglages, tarifs, pageAccueil, pageTarifs, infosLegales, prestation, avis, question, reservation, accesAdmin]
