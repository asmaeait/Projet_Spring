import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FolderKanban, Eye, EyeOff } from 'lucide-react'
import { useEffect } from 'react'


export default function Login() {
  const navigate  = useNavigate()
  const { login } = useAuth()

  const [form, setForm]         = useState({ login: '', password: '' })
  const [error, setError]       = useState(null)
  const [loading, setLoading]   = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(form)
      navigate('/dashboard')
    } catch (err) {
      setError(
        err.response?.status === 401
          ? 'Login ou mot de passe incorrect'
          : 'Erreur de connexion, réessayez'
      )
    } finally {
      setLoading(false)
    }
  }
  const { user } = useAuth()

    useEffect(() => {
        if (user) navigate('/dashboard')
        }, [user])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FolderKanban size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">SuiviProjets</h1>
          <p className="text-gray-500 text-sm mt-1">Connectez-vous à votre compte</p>
        </div>

        {/* Carte */}
        <div className="card p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Login
              </label>
              <input
                type="text"
                required
                autoFocus
                value={form.login}
                onChange={e => setForm({...form, login: e.target.value})}
                className="input"
                placeholder="Votre identifiant"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  className="input pr-10"
                  placeholder="Votre mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-2.5"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}