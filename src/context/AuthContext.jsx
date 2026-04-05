import { createContext, useContext, useState, useEffect } from 'react'
import authService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // Au démarrage : si un token existe, charger l'utilisateur
  useEffect(() => {
    const token = sessionStorage.getItem('token')
    if (token) {
      authService.me()
        .then((res) => setUser(res.data))
        .catch(() => sessionStorage.removeItem('token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (credentials) => {
    const res = await authService.login(credentials)
    const { token, ...userData } = res.data
    sessionStorage.setItem('token', token)
    setUser(userData)
    return userData
  }

  const logout = () => {
    sessionStorage.removeItem('token')
    setUser(null)
    window.location.href = '/login'
  }

  // Vérifier si l'utilisateur a un rôle donné
  const hasRole = (role) => user?.profilLibelle === role

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)