import reglages from './reglages'
import tarifs from './tarifs'
import pageAccueil from './pageAccueil'
import prestation from './prestation'
import avis from './avis'
import question from './question'
import reservation from './reservation'

const accesAdmin = { name: 'accesAdmin', title: 'Accès à l’espace (ne pas modifier)', type: 'document', fields: [{ name: 'modifieLe', title: 'Modifié le', type: 'datetime', readOnly: true }] }

export const schemaTypes = [reglages, tarifs, pageAccueil, prestation, avis, question, reservation, accesAdmin]
