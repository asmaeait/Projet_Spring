import api from './api'

const phaseService = {
  getByProjet:       (projetId)       => api.get(`/projets/${projetId}/phases`),
  getById:           (id)             => api.get(`/phases/${id}`),
  create:            (projetId, data) => api.post(`/projets/${projetId}/phases`, data),
  update:            (id, data)       => api.put(`/phases/${id}`, data),
  delete:            (id)             => api.delete(`/phases/${id}`),
  updateRealisation: (id, etat)       => api.patch(`/phases/${id}/realisation?etat=${etat}`),
  updateFacturation: (id, etat)       => api.patch(`/phases/${id}/facturation?etat=${etat}`),
  updatePaiement:    (id, etat)       => api.patch(`/phases/${id}/paiement?etat=${etat}`),
}

export default phaseService