import api from './api'

const reportingService = {
  dashboard:             () => api.get('/reporting/tableau-de-bord'),
  phasesTermineesNonFacturees: () => api.get('/reporting/phases/terminees-non-facturees'),
  phasesFactureesNonPayees:    () => api.get('/reporting/phases/facturees-non-payees'),
  phasesPayees:                () => api.get('/reporting/phases/payees'),
  projetsEnCours:              () => api.get('/reporting/projets/en-cours'),
  projetsClotures:             () => api.get('/reporting/projets/clotures'),
}

export default reportingService