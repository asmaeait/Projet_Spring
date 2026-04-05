import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Building2, Users, FolderKanban,
  ListChecks, UserCheck, FileText, Files, Receipt,
  BarChart3, ChevronRight
} from 'lucide-react'

const menuItems = [
  { label: 'Dashboard',    path: '/dashboard',    icon: LayoutDashboard },
  { label: 'Organismes',   path: '/organismes',   icon: Building2 },
  { label: 'Employés',     path: '/employes',     icon: Users },
  { label: 'Projets',      path: '/projets',      icon: FolderKanban },
  { label: 'Phases',       path: '/phases',       icon: ListChecks },
  { label: 'Affectations', path: '/affectations', icon: UserCheck },
  { label: 'Livrables',    path: '/livrables',    icon: FileText },
  { label: 'Documents',    path: '/documents',    icon: Files },
  { label: 'Factures',     path: '/factures',     icon: Receipt },
  { label: 'Reporting',    path: '/reporting',    icon: BarChart3 },
]

export default function Sidebar() {
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
            key={path}
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

      {/* Footer sidebar */}
      <div className="px-4 py-4 border-t border-white/10">
        <p className="text-white/30 text-xs text-center">v1.0.0 — Sprint 1</p>
      </div>
    </aside>
  )
}