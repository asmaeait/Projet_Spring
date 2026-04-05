import api from './api'

const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  me: ()               => api.get('/auth/me'),
  changePassword: (data) => api.post('/auth/change-password', data),
}

export default authService