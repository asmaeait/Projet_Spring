import api from './api'

const projetService = {
  getAll:      ()         => api.get('/projets'),
  getById:     (id)       => api.get(`/projets/${id}`),
  create:      (data)     => api.post('/projets', data),
  update:      (id, data) => api.put(`/projets/${id}`, data),
  delete:      (id)       => api.delete(`/projets/${id}`),
  rechercher:  (nom)      => api.get(`/projets/recherche?nom=${nom}`),
}

export default projetService