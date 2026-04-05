import { Bell, User, Search } from 'lucide-react'

export default function Topbar() {
  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0">
      {/* Recherche */}
      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-72">
        <Search size={16} className="text-gray-400" />
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
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-2 pl-3 border-l border-gray-100">
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
            <User size={16} className="text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Utilisateur</p>
            <p className="text-xs text-gray-400">Rôle</p>
          </div>
        </div>
      </div>
    </header>
  )
}