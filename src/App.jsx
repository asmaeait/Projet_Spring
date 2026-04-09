import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'
import Forbidden from './pages/Forbidden'

import OrganismeList   from './pages/Organismes/OrganismeList'
import OrganismeForm   from './pages/Organismes/OrganismeForm'
import OrganismeDetail from './pages/Organismes/OrganismeDetail'

import EmployeList          from './pages/Employes/EmployeList'
import EmployeDetail        from './pages/Employes/EmployeDetail'
import EmployeDisponibilite from './pages/Employes/EmployeDisponibilite'

import Projets      from './pages/Projets'
import ProjetDetail from './pages/Projets/ProjetDetail'
import ProjetResume from './pages/Projets/ProjetResume'
import Phases       from './pages/Phases'
import Affectations from './pages/Affectations'
import Livrables    from './pages/Livrables'
import Documents    from './pages/Documents'
import Factures     from './pages/Factures'
import Reporting    from './pages/Reporting'

import PrivateRoute from './guards/PrivateRoute'
import RoleRoute    from './guards/RoleRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Page login publique */}
        <Route path="/login" element={<Login />} />

        {/* Redirect racine */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Routes protégées */}
        <Route element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }>
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Organismes — Secrétaire, Directeur, Admin */}
          <Route path="/organismes" element={
            <RoleRoute roles={['ADMINISTRATEUR','SECRETAIRE','DIRECTEUR']}>
              <OrganismeList />
            </RoleRoute>
          }/>
          <Route path="/organismes/nouveau" element={
            <RoleRoute roles={['ADMINISTRATEUR','SECRETAIRE']}>
              <OrganismeForm />
            </RoleRoute>
          }/>
          <Route path="/organismes/:id" element={<OrganismeDetail />} />
          <Route path="/organismes/:id/modifier" element={
            <RoleRoute roles={['ADMINISTRATEUR','SECRETAIRE']}>
              <OrganismeForm />
            </RoleRoute>
          }/>

          {/* Employés — Admin seulement */}
          <Route path="/employes" element={
            <RoleRoute roles={['ADMINISTRATEUR']}>
              <EmployeList />
            </RoleRoute>
          }/>
          <Route path="/employes/disponibilite" element={<EmployeDisponibilite />} />
          <Route path="/employes/:id"           element={<EmployeDetail />} />

          {/* Projets */}
          <Route path="/projets"                  element={<Projets />} />
          <Route path="/projets/:id/detail"       element={<ProjetDetail />} />
          <Route path="/projets/:id/resume"       element={<ProjetResume />} />
          <Route path="/projets/:projetId/phases" element={<Phases />} />

          {/* Autres modules */}
          <Route path="/affectations" element={<Affectations />} />
          <Route path="/livrables"    element={<Livrables />} />
          <Route path="/documents"    element={<Documents />} />

          {/* Factures — Comptable seulement */}
          <Route path="/factures" element={
            <RoleRoute roles={['COMPTABLE','ADMINISTRATEUR']}>
              <Factures />
            </RoleRoute>
          }/>

          {/* Reporting — Directeur, Comptable, Admin */}
          <Route path="/reporting" element={
            <RoleRoute roles={['DIRECTEUR','COMPTABLE','ADMINISTRATEUR']}>
              <Reporting />
            </RoleRoute>
          }/>
        </Route>

        <Route path="/403" element={<Forbidden />} />
        <Route path="*"    element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}