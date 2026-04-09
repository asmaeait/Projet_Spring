import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, Building2, Users, FolderKanban,
  ListChecks, UserCheck, FileText, Files, Receipt,
  BarChart3, ChevronRight
} from 'lucide-react'

// Menu selon le rôle
const getMenuItems = (role) => {
  const all = [
    { label: 'Dashboard',    path: '/dashboard',    icon: LayoutDashboard, roles: ['ADMINISTRATEUR','SECRETAIRE','DIRECTEUR','CHEF_PROJET','COMPTABLE'] },
    { label: 'Organismes',   path: '/organismes',   icon: Building2,       roles: ['ADMINISTRATEUR','SECRETAIRE','DIRECTEUR'] },
    { label: 'Employés',     path: '/employes',     icon: Users,           roles: ['ADMINISTRATEUR'] },
    { label: 'Projets',      path: '/projets',      icon: FolderKanban,    roles: ['ADMINISTRATEUR','SECRETAIRE','DIRECTEUR','CHEF_PROJET'] },
    { label: 'Phases',       path: '/projets',      icon: ListChecks,      roles: ['CHEF_PROJET','ADMINISTRATEUR','DIRECTEUR'] },
    { label: 'Affectations', path: '/affectations', icon: UserCheck,       roles: ['CHEF_PROJET','ADMINISTRATEUR'] },
    { label: 'Livrables',    path: '/livrables',    icon: FileText,        roles: ['CHEF_PROJET','ADMINISTRATEUR'] },
    { label: 'Documents',    path: '/documents',    icon: Files,           roles: ['CHEF_PROJET','ADMINISTRATEUR','DIRECTEUR'] },
    { label: 'Factures',     path: '/factures',     icon: Receipt,         roles: ['COMPTABLE','ADMINISTRATEUR'] },
    { label: 'Reporting',    path: '/reporting',    icon: BarChart3,       roles: ['DIRECTEUR','COMPTABLE','ADMINISTRATEUR'] },
  ]
  if (!role) return all
  return all.filter(item => item.roles.includes(role))
}

export default function Sidebar() {
  const { user } = useAuth()
  const menuItems = getMenuItems(user?.profilLibelle)

  return (
    <aside className="w-64 bg-sidebar flex flex-col h-full shrink-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <FolderKanban size={16} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">SuiviProjets</p>
            <p className="text-white/40 text-xs">Gestion de projets</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {menuItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={label}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group
              ${isActive
                ? 'bg-indigo-600 text-white'
                : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            <span className="flex-1">{label}</span>
            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/10">
        <p className="text-white/30 text-xs text-center">
          {user?.profilLibelle || 'Sprint 6'} — v1.0.0
        </p>
      </div>
    </aside>
  )
}