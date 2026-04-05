import api from './api'

const organismeService = {
  getAll:       ()         => api.get('/organismes'),
  getById:      (id)       => api.get(`/organismes/${id}`),
  create:       (data)     => api.post('/organismes', data),
  update:       (id, data) => api.put(`/organismes/${id}`, data),
  delete:       (id)       => api.delete(`/organismes/${id}`),
  rechercher:   (nom)      => api.get(`/organismes/recherche?nom=${nom}`),
}

export default organismeService