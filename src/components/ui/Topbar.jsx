import { Bell, User, LogOut, Key } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Topbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0">
      {/* Recherche */}
      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-72">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input
          type="text"
          placeholder="Rechercher..."
          className="bg-transparent text-sm outline-none text-gray-700 placeholder:text-gray-400 w-full"
        />
      </div>

      {/* Actions droite */}
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-lg hover:bg-gray-50 transition-colors">
          <Bell size={20} className="text-gray-500" />
        </button>

        {/* Profil utilisateur */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 pl-3 border-l border-gray-100 hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors"
          >
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <User size={16} className="text-indigo-600" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-800">
                {user ? `${user.prenom} ${user.nom}` : 'Utilisateur'}
              </p>
              <p className="text-xs text-gray-400">
                {user?.profilLibelle || 'Rôle'}
              </p>
            </div>
          </button>

          {/* Menu dropdown */}
          {showMenu && (
            <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
              <button
                onClick={() => { navigate('/change-password'); setShowMenu(false) }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Key size={14} />
                Changer mot de passe
              </button>
              <hr className="my-1 border-gray-100" />
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={14} />
                Se déconnecter
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}