import api from './api'

const employeService = {
  getAll:        ()               => api.get('/employes'),
  getById:       (id)             => api.get(`/employes/${id}`),
  create:        (data)           => api.post('/employes', data),
  update:        (id, data)       => api.put(`/employes/${id}`, data),
  delete:        (id)             => api.delete(`/employes/${id}`),
  disponibles:   (dateDebut, dateFin) =>
    api.get(`/employes/disponibles?dateDebut=${dateDebut}&dateFin=${dateFin}`),
}

export default employeService