import { useState, useEffect } from 'react'
import reportingService from '../services/reportingService'

const StatCard = ({ label, value, color }) => (
  <div className="card p-6">
    <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
    <p className={`text-3xl font-bold ${color}`}>{value ?? '—'}</p>
  </div>
)

export default function Dashboard() {
  const [stats,   setStats]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => { fetchStats() }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const res = await reportingService.dashboard()   // ← corrigé
      setStats(res.data)
    } catch (err) {
      setError('Erreur lors du chargement du tableau de bord')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full" />
    </div>
  )

  if (error) return (
    <div className="p-6">
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>
    </div>
  )

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Tableau de bord</h1>
      <p className="text-gray-500 text-sm mb-6">Vue d'ensemble du système</p>

      {/* Cartes stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Projets en cours"           value={stats?.projetsEnCours}            color="text-indigo-600" />
        <StatCard label="Projets clôturés"           value={stats?.projetsClotures}           color="text-gray-600" />
        <StatCard label="Phases terminées"           value={stats?.phasesTerminees}           color="text-green-600" />
        <StatCard label="Phases non facturées"       value={stats?.phasesTermineesNonFacturees} color="text-orange-500" />
        <StatCard label="Phases facturées non payées" value={stats?.phasesFactureesNonPayees} color="text-red-500" />
        <StatCard label="Phases payées"              value={stats?.phasesPayees}              color="text-green-700" />
        <StatCard label="Total employés"             value={stats?.totalEmployes}             color="text-blue-600" />
        <StatCard label="Total organismes"           value={stats?.totalOrganismes}           color="text-purple-600" />
      </div>

      {/* Message si pas de données */}
      {!stats && (
        <div className="card p-8 text-center text-gray-400">
          Aucune donnée disponible pour le moment
        </div>
      )}
    </div>
  )
}