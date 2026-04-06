import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8081/api',
  headers: { 'Content-Type': 'application/json' },
})

// ── Interceptor requête : ajoute le token JWT automatiquement ──
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Interceptor réponse : gestion globale des erreurs ──
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status

    if (status === 401) {
      // Token expiré ou invalide → déconnexion
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