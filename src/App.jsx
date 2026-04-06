import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'
import Forbidden from './pages/Forbidden'

// Organismes
import OrganismeList   from './pages/Organismes/OrganismeList'
import OrganismeForm   from './pages/Organismes/OrganismeForm'
import OrganismeDetail from './pages/Organismes/OrganismeDetail'

// Employés
import EmployeList          from './pages/Employes/EmployeList'
import EmployeDetail        from './pages/Employes/EmployeDetail'
import EmployeDisponibilite from './pages/Employes/EmployeDisponibilite'

// Autres modules
import Projets      from './pages/Projets'
import Phases       from './pages/Phases'
import Affectations from './pages/Affectations'
import Livrables    from './pages/Livrables'
import Documents    from './pages/Documents'
import Factures     from './pages/Factures'
import Reporting    from './pages/Reporting'

import ProjetDetail from './pages/Projets/ProjetDetail'
import ProjetResume from './pages/Projets/ProjetResume'

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
          <Route path="/organismes/:id"          element={<OrganismeDetail />} />
          <Route path="/organismes/:id/modifier" element={<OrganismeForm />} />

          {/* Employés */}
          <Route path="/employes"                element={<EmployeList />} />
          <Route path="/employes/disponibilite"  element={<EmployeDisponibilite />} />
          <Route path="/employes/:id"            element={<EmployeDetail />} />

          {/* Projets & Phases */}
          <Route path="/projets"                 element={<Projets />} />
          <Route path="/projets/:projetId/phases" element={<Phases />} />

          {/* Autres */}
          <Route path="/affectations"            element={<Affectations />} />
          <Route path="/livrables"               element={<Livrables />} />
          <Route path="/documents"               element={<Documents />} />
          <Route path="/factures"                element={<Factures />} />
          <Route path="/reporting"               element={<Reporting />} />

          <Route path="/projets/:id/detail" element={<ProjetDetail />} />
          <Route path="/projets/:id/resume" element={<ProjetResume />} /> 
        </Route>

        <Route path="/403" element={<Forbidden />} />
        <Route path="*"    element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}