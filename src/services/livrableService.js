import api from './api'

const livrableService = {
  getByPhase: (phaseId)       => api.get(`/phases/${phaseId}/livrables`),
  getById:    (id)            => api.get(`/livrables/${id}`),
  create:     (phaseId, data) => api.post(`/phases/${phaseId}/livrables`, data),
  update:     (id, data)      => api.put(`/livrables/${id}`, data),
  delete:     (id)            => api.delete(`/livrables/${id}`),
}

export default livrableService