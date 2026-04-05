import { Outlet } from 'react-router-dom'
import Sidebar from '../components/ui/Sidebar'
import Topbar from '../components/ui/Topbar'

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar fixe à gauche */}
      <Sidebar />

      {/* Zone principale */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}