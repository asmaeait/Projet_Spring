import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Ajouter le token JWT à chaque requête
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Gérer les erreurs globalement
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status

    if (status === 401) {
      sessionStorage.removeItem('token')
      window.location.href = '/login'
    }

    if (status === 403) {
      window.location.href = '/403'
    }

    return Promise.reject(error)
  }
)

export default api