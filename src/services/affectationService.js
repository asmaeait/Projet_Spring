import api from './api'

const affectationService = {
  getByPhase:     (phaseId)              => api.get(`/phases/${phaseId}/employes`),
  getByEmploye:   (employeId)            => api.get(`/employes/${employeId}/phases`),
  create:         (phaseId, employeId, data) =>
    api.post(`/phases/${phaseId}/employes/${employeId}`, data),
  update:         (phaseId, employeId, data) =>
    api.put(`/phases/${phaseId}/employes/${employeId}`, data),
  delete:         (phaseId, employeId)   =>
    api.delete(`/phases/${phaseId}/employes/${employeId}`),
}

export default affectationService