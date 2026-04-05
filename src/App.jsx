import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'
import Forbidden from './pages/Forbidden'

// Pages modules (vides pour l'instant)
import Organismes from './pages/Organismes'
import Employes from './pages/Employes'
import Projets from './pages/Projets'
import Phases from './pages/Phases'
import Affectations from './pages/Affectations'
import Livrables from './pages/Livrables'
import Documents from './pages/Documents'
import Factures from './pages/Factures'
import Reporting from './pages/Reporting'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect racine vers dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Routes avec layout */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard"     element={<Dashboard />} />
          <Route path="/organismes"    element={<Organismes />} />
          <Route path="/employes"      element={<Employes />} />
          <Route path="/projets"       element={<Projets />} />
          <Route path="/phases"        element={<Phases />} />
          <Route path="/affectations"  element={<Affectations />} />
          <Route path="/livrables"     element={<Livrables />} />
          <Route path="/documents"     element={<Documents />} />
          <Route path="/factures"      element={<Factures />} />
          <Route path="/reporting"     element={<Reporting />} />
        </Route>

        {/* Pages hors layout */}
        <Route path="/403" element={<Forbidden />} />
        <Route path="*"    element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}