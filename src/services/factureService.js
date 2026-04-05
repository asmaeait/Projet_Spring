import api from './api'

const factureService = {
  getAll:         ()              => api.get('/factures'),
  getById:        (id)            => api.get(`/factures/${id}`),
  create:         (phaseId, data) => api.post(`/phases/${phaseId}/facture`, data),
  update:         (id, data)      => api.put(`/factures/${id}`, data),
  delete:         (id)            => api.delete(`/factures/${id}`),
}

export default factureService