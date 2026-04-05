import api from './api'

const documentService = {
  getByProjet: (projetId)       => api.get(`/projets/${projetId}/documents`),
  getById:     (id)             => api.get(`/documents/${id}`),
  create:      (projetId, data) => api.post(`/projets/${projetId}/documents`, data),
  update:      (id, data)       => api.put(`/documents/${id}`, data),
  delete:      (id)             => api.delete(`/documents/${id}`),
  download:    (id)             => api.get(`/documents/${id}/download`, { responseType: 'blob' }),
}

export default documentService