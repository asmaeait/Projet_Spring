import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import projetService from '../../services/projetService'

export default function ProjetResume() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    projetService.getResume(id)
      .then(res => setResume(res.data))
      .catch(() => setError('Erreur lors du chargement du résumé'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
    </div>
  )

  if (error) return (
    <div className="p-6">
      <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>
    </div>
  )

  if (!resume) return null

  const fields = [
    { label: 'Code',          value: resume.code },
    { label: 'Nom',           value: resume.nom },
    { label: 'Description',   value: resume.description || '—' },
    { label: 'Organisme',     value: resume.organisme },
    { label: 'Chef de projet',value: resume.chefProjet },
    { label: 'Date début',    value: resume.dateDebut?.substring(0, 10) },
    { label: 'Date fin',      value: resume.dateFin?.substring(0, 10) },
    { label: 'Montant',       value: resume.montant ? `${resume.montant.toLocaleString()} DH` : '—' },
  ]

  return (
    <div className="p-6 max-w-2xl">

      <button
        onClick={() => navigate(`/projets/${id}`)}
        className="text-sm text-gray-500 hover:underline mb-4 block"
      >
        ← Retour au détail
      </button>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-900">Résumé du projet</h1>
          <p className="text-sm text-gray-500 mt-0.5">Vue synthétique des informations principales</p>
        </div>

        <div className="divide-y divide-gray-50">
          {fields.map(({ label, value }) => (
            <div key={label} className="flex items-start px-6 py-3">
              <p className="w-40 text-xs font-semibold text-gray-500 uppercase tracking-wide pt-0.5 flex-shrink-0">
                {label}
              </p>
              <p className="text-sm text-gray-800 font-medium">{value || '—'}</p>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={() => navigate(`/projets/${id}/phases`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >
            Voir les phases
          </button>
          <button
            onClick={() => navigate(`/projets`)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    </div>
  )
}