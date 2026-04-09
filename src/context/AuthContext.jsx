import { createContext, useContext, useState, useEffect } from 'react'
import authService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token     = sessionStorage.getItem('token')
    const savedUser = sessionStorage.getItem('user')
    if (token && savedUser) {
      setUser(JSON.parse(savedUser))
      setLoading(false)
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (credentials) => {
    const res = await authService.login(credentials)
    const { token, login, role, nom, prenom } = res.data

    // Stocker le token
    sessionStorage.setItem('token', token)

    // Construire l'objet user depuis la réponse login
    const userData = {
      login,
      nom,
      prenom,
      profilLibelle: role,  // role = profil.code = 'ADMINISTRATEUR'
    }
    sessionStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }

  const logout = () => {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    setUser(null)
    window.location.href = '/login'
  }

  const hasRole = (...roles) => roles.includes(user?.profilLibelle)

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)