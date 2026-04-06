import { useState, useEffect } from 'react'
import reportingService from '../services/reportingService'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => { fetchStats() }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const res = await reportingService.getTableauDeBord()
      setStats(res.data)
    } catch (err) {
      setError('Erreur lors du chargement du tableau de bord')
    } finally {
      setLoading(false)
    }
  }

  const cards = stats ? [
    { label: 'Total Projets', value: stats.totalProjets || 0, color: 'blue', icon: '📁' },
    { label: 'Projets en cours', value: stats.projetsEnCours || 0, color: 'green', icon: '🚀' },
    { label: 'Projets clôturés', value: stats.projetsClotures || 0, color: 'gray', icon: '✅' },
    { label: 'Phases non facturées', value: stats.phasesTermineesNonFacturees || 0, color: 'orange', icon: '⚠️' },
    { label: 'Phases non payées', value: stats.phasesFactureesNonPayees || 0, color: 'red', icon: '💰' },
    { label: 'Phases payées', value: stats.phasesPayees || 0, color: 'green', icon: '💚' },
  ] : []

  const colorMap = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    gray: 'bg-gray-50 border-gray-200 text-gray-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
    red: 'bg-red-50 border-red-200 text-red-700',
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-500 text-sm">Vue d'ensemble du système de suivi de projets</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>
      )}

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-2">Chargement des statistiques...</p>
        </div>
      ) : (
        <>
          {/* Cards statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {cards.map((card, i) => (
              <div key={i} className={`rounded-xl border p-6 ${colorMap[card.color]}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium opacity-75">{card.label}</p>
                    <p className="text-3xl font-bold mt-1">{card.value}</p>
                  </div>
                  <span className="text-3xl">{card.icon}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Résumé */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Résumé financier</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="text-orange-700 font-medium">⚠️ Phases terminées non facturées</span>
                <span className="bg-orange-200 text-orange-800 px-3 py-1 rounded-full font-bold">
                  {stats?.phasesTermineesNonFacturees || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <span className="text-yellow-700 font-medium">💳 Phases facturées non payées</span>
                <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full font-bold">
                  {stats?.phasesFactureesNonPayees || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-green-700 font-medium">✅ Phases payées</span>
                <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full font-bold">
                  {stats?.phasesPayees || 0}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}