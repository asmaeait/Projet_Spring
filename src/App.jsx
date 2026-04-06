import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'
import Forbidden from './pages/Forbidden'

import OrganismeList   from './pages/Organismes/OrganismeList'
import OrganismeForm   from './pages/Organismes/OrganismeForm'
import OrganismeDetail from './pages/Organismes/OrganismeDetail'
import Employes      from './pages/Employes'
import Projets       from './pages/Projets'
import Phases        from './pages/Phases'
import Affectations  from './pages/Affectations'
import Livrables     from './pages/Livrables'
import Documents     from './pages/Documents'
import Factures      from './pages/Factures'
import Reporting     from './pages/Reporting'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Organismes */}
          <Route path="/organismes"              element={<OrganismeList />} />
          <Route path="/organismes/nouveau"      element={<OrganismeForm />} />
          <Route path="/organismes/:id/modifier" element={<OrganismeForm />} />
          <Route path="/organismes/:id"          element={<OrganismeDetail />} />

          {/* Employés */}
          <Route path="/employes" element={<Employes />} />

          {/* Projets et Phases */}
          <Route path="/projets"                    element={<Projets />} />
          <Route path="/projets/:projetId/phases"   element={<Phases />} />

          {/* Menu sidebar /phases → message d'aide */}
          <Route path="/phases" element={
            <div className="p-6 text-gray-500">
              Veuillez sélectionner un projet pour voir ses phases.
            </div>
          } />

          {/* Reste */}
          <Route path="/affectations" element={<Affectations />} />
          <Route path="/livrables"    element={<Livrables />} />
          <Route path="/documents"    element={<Documents />} />
          <Route path="/factures"     element={<Factures />} />
          <Route path="/reporting"    element={<Reporting />} />
        </Route>

        <Route path="/403" element={<Forbidden />} />
        <Route path="*"    element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}