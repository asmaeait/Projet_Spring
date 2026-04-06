import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import projetService from '../../services/projetService'
import phaseService from '../../services/phaseService'

export default function ProjetDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [projet, setProjet] = useState(null)
  const [phases, setPhases] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [projRes, phasesRes] = await Promise.all([
          projetService.getById(id),
          phaseService.getByProjet(id),
        ])
        setProjet(projRes.data)
        setPhases(Array.isArray(phasesRes.data) ? phasesRes.data : [])
      } catch (err) {
        setError('Erreur lors du chargement du projet')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
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

  if (!projet) return null

  const totalPhases = phases.length
  const phasesTerminees = phases.filter(p => p.etatRealisation).length
  const phasesFacturees = phases.filter(p => p.etatFacturation).length
  const phasePayees = phases.filter(p => p.etatPaiement).length

  return (
    <div className="p-6 max-w-4xl">

      {/* Bouton retour */}
      <button
        onClick={() => navigate('/projets')}
        className="text-sm text-gray-500 hover:underline mb-4 block"
      >
        ← Retour aux projets
      </button>

      {/* En-tête projet */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{projet.nom}</h1>
            <span className="inline-block mt-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
              {projet.code}
            </span>
          </div>
          <div className="flex gap-2">
            <Link
              to={`/projets/${id}/resume`}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
            >
              Résumé
            </Link>
            <button
              onClick={() => navigate(`/projets/${id}/phases`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              Voir les phases
            </button>
          </div>
        </div>

        {projet.description && (
          <p className="text-gray-600 text-sm mb-4">{projet.description}</p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Organisme</p>
            <p className="text-sm font-semibold text-gray-800">{projet.nomOrganisme || '—'}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Chef de projet</p>
            <p className="text-sm font-semibold text-gray-800">
              {projet.nomChefProjet ? `${projet.nomChefProjet} ${projet.prenomChefProjet}` : '—'}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Période</p>
            <p className="text-sm font-semibold text-gray-800">
              {projet.dateDebut?.substring(0, 10)} → {projet.dateFin?.substring(0, 10)}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Montant</p>
            <p className="text-sm font-semibold text-gray-800">
              {projet.montant ? `${projet.montant.toLocaleString()} DH` : '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Statistiques phases */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total phases',  value: totalPhases,    color: 'bg-blue-50 text-blue-700' },
          { label: 'Terminées',     value: phasesTerminees, color: 'bg-green-50 text-green-700' },
          { label: 'Facturées',     value: phasesFacturees, color: 'bg-yellow-50 text-yellow-700' },
          { label: 'Payées',        value: phasePayees,     color: 'bg-purple-50 text-purple-700' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`rounded-xl p-4 ${color}`}>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs font-medium mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Liste des phases */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-base font-semibold text-gray-800">Phases du projet</h2>
          <button
            onClick={() => navigate(`/projets/${id}/phases`)}
            className="text-sm text-blue-600 hover:underline"
          >
            Gérer les phases →
          </button>
        </div>

        {phases.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            Aucune phase pour ce projet
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Code</th>
                <th className="px-4 py-3 text-left">Libellé</th>
                <th className="px-4 py-3 text-left">Dates</th>
                <th className="px-4 py-3 text-left">Montant</th>
                <th className="px-4 py-3 text-left">État</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {phases.map(phase => (
                <tr key={phase.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-blue-600">{phase.code}</td>
                  <td className="px-4 py-3">{phase.libelle}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {phase.dateDebut?.substring(0, 10)} → {phase.dateFin?.substring(0, 10)}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {phase.montant ? `${phase.montant} DH` : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      phase.etatPaiement    ? 'bg-purple-100 text-purple-700' :
                      phase.etatFacturation ? 'bg-yellow-100 text-yellow-700' :
                      phase.etatRealisation ? 'bg-green-100 text-green-700' :
                                              'bg-gray-100 text-gray-500'
                    }`}>
                      {phase.etatPaiement    ? 'Payée' :
                       phase.etatFacturation ? 'Facturée' :
                       phase.etatRealisation ? 'Terminée' :
                                               'En cours'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}