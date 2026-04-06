import { useState, useEffect } from 'react'
import reportingService from '../services/reportingService'

export default function Reporting() {
  const [activeTab, setActiveTab] = useState('terminees')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [dateDebut, setDateDebut] = useState('')
  const [dateFin, setDateFin] = useState('')

  useEffect(() => { fetchData() }, [activeTab])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      let res
      if (activeTab === 'terminees') {
        res = await reportingService.getPhasesTermineesNonFacturees(dateDebut, dateFin)
      } else if (activeTab === 'facturees') {
        res = await reportingService.getPhasesFactureesNonPayees(dateDebut, dateFin)
      } else if (activeTab === 'payees') {
        res = await reportingService.getPhasesPayees(dateDebut, dateFin)
      } else if (activeTab === 'encours') {
        res = await reportingService.getProjetsEnCours()
      } else {
        res = await reportingService.getProjetsClotures()
      }
      setData(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      setError('Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'terminees', label: 'Phases terminées non facturées', color: 'orange' },
    { id: 'facturees', label: 'Phases facturées non payées', color: 'yellow' },
    { id: 'payees', label: 'Phases payées', color: 'green' },
    { id: 'encours', label: 'Projets en cours', color: 'blue' },
    { id: 'clotures', label: 'Projets clôturés', color: 'gray' },
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reporting</h1>
        <p className="text-gray-500 text-sm">Suivi financier et opérationnel</p>
      </div>

      {/* Filtres par période */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <div className="flex gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date début</label>
            <input type="date" value={dateDebut}
              onChange={e => setDateDebut(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date fin</label>
            <input type="date" value={dateFin}
              onChange={e => setDateFin(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button onClick={fetchData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Filtrer
          </button>
        </div>
      </div>

      {/* Onglets */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 border'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>
      )}

      {/* Résultats */}
      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-2">Chargement...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b">
            <span className="font-medium text-gray-700">
              {data.length} résultat(s) trouvé(s)
            </span>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Code</th>
                <th className="px-4 py-3 text-left">Libellé / Nom</th>
                <th className="px-4 py-3 text-left">Date début</th>
                <th className="px-4 py-3 text-left">Date fin</th>
                <th className="px-4 py-3 text-left">Montant</th>
                <th className="px-4 py-3 text-left">État</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-8 text-gray-400">Aucun résultat</td></tr>
              ) : (
                data.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-blue-600">{item.code}</td>
                    <td className="px-4 py-3 font-medium">{item.libelle || item.nom}</td>
                    <td className="px-4 py-3 text-gray-500">{item.dateDebut}</td>
                    <td className="px-4 py-3 text-gray-500">{item.dateFin}</td>
                    <td className="px-4 py-3 text-gray-500">{item.montant ? `${item.montant} DH` : '-'}</td>
                    <td className="px-4 py-3">
                      {item.etatRealisation !== undefined && (
                        <div className="flex gap-1 flex-wrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.etatRealisation ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            {item.etatRealisation ? 'Terminée' : 'En cours'}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.etatFacturation ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                            {item.etatFacturation ? 'Facturée' : 'Non facturée'}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.etatPaiement ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {item.etatPaiement ? 'Payée' : 'Non payée'}
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}