import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import employeService from '../../services/employeService'

export default function EmployeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [employe, setEmploye] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    employeService.getById(id)
      .then(res => setEmploye(res.data))
      .catch(() => setError('Employé introuvable'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full" />
    </div>
  )

  if (error) return (
    <div className="p-6">
      <p className="text-red-600">{error}</p>
      <button onClick={() => navigate('/employes')} className="mt-4 btn-secondary">
        ← Retour
      </button>
    </div>
  )

  const Field = ({ label, value }) => (
    <div className="py-3 border-b border-gray-100 last:border-0">
      <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value || '—'}</p>
    </div>
  )

  return (
    <div className="p-6 max-w-2xl">
      <button
        onClick={() => navigate('/employes')}
        className="text-sm text-gray-500 hover:underline mb-4 block"
      >← Retour aux employés</button>

      <div className="card p-6">
        {/* Avatar + nom */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600">
            {employe.prenom?.[0]}{employe.nom?.[0]}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {employe.prenom} {employe.nom}
            </h1>
            <span className="badge bg-indigo-100 text-indigo-700 mt-1">
              {employe.profilLibelle || 'Employé'}
            </span>
          </div>
        </div>

        {/* Informations */}
        <div className="grid grid-cols-2 gap-x-8">
          <div>
            <Field label="Matricule"  value={employe.matricule} />
            <Field label="Login"      value={employe.login} />
            <Field label="Email"      value={employe.email} />
          </div>
          <div>
            <Field label="Téléphone"  value={employe.telephone} />
            <Field label="Profil"     value={employe.profilLibelle} />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => navigate(`/employes/${id}/modifier`)}
            className="btn-primary"
          >Modifier</button>
          <button
            onClick={() => navigate('/employes')}
            className="btn-secondary"
          >Retour</button>
        </div>
      </div>
    </div>
  )
}