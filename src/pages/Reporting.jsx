import { useState, useEffect } from 'react'
import reportingService from '../services/reportingService'

const TABS = [
  { key: 'terminees',  label: 'Terminées non facturées' },
  { key: 'facturees',  label: 'Facturées non payées' },
  { key: 'payees',     label: 'Payées' },
  { key: 'enCours',    label: 'Projets en cours' },
  { key: 'clotures',   label: 'Projets clôturés' },
]

export default function Reporting() {
  const [activeTab, setActiveTab] = useState('terminees')
  const [data,      setData]      = useState([])
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState(null)

  useEffect(() => { fetchData() }, [activeTab])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      let res
      switch (activeTab) {
        case 'terminees': res = await reportingService.phasesTermineesNonFacturees(); break
        case 'facturees': res = await reportingService.phasesFactureesNonPayees();    break
        case 'payees':    res = await reportingService.phasesPayees();                break
        case 'enCours':   res = await reportingService.projetsEnCours();              break
        case 'clotures':  res = await reportingService.projetsClotures();             break
        default:          res = { data: [] }
      }
      setData(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      setError('Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  const isPhaseTab  = ['terminees', 'facturees', 'payees'].includes(activeTab)
  const isProjetTab = ['enCours', 'clotures'].includes(activeTab)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Reporting</h1>
      <p className="text-gray-500 text-sm mb-6">Suivi financier et opérationnel des projets</p>

      {/* Onglets */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >{tab.label}</button>
        ))}
      </div>

      {/* Erreur */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>
      )}

      {/* Contenu */}
      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto" />
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <div className="px-6 py-4 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-700">
              {data.length} résultat(s)
            </p>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              {isPhaseTab && (
                <tr>
                  <th className="px-4 py-3 text-left">Code phase</th>
                  <th className="px-4 py-3 text-left">Libellé</th>
                  <th className="px-4 py-3 text-left">Projet</th>
                  <th className="px-4 py-3 text-left">Montant</th>
                  <th className="px-4 py-3 text-left">Date début</th>
                  <th className="px-4 py-3 text-left">Date fin</th>
                </tr>
              )}
              {isProjetTab && (
                <tr>
                  <th className="px-4 py-3 text-left">Code</th>
                  <th className="px-4 py-3 text-left">Nom projet</th>
                  <th className="px-4 py-3 text-left">Organisme</th>
                  <th className="px-4 py-3 text-left">Chef de projet</th>
                  <th className="px-4 py-3 text-left">Date début</th>
                  <th className="px-4 py-3 text-left">Date fin</th>
                </tr>
              )}
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-400">
                    Aucun résultat
                  </td>
                </tr>
              ) : isPhaseTab ? (
                data.map(ph => (
                  <tr key={ph.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-indigo-600">{ph.code}</td>
                    <td className="px-4 py-3">{ph.libelle}</td>
                    <td className="px-4 py-3 text-gray-500">{ph.nomProjet}</td>
                    <td className="px-4 py-3 text-gray-500">{ph.montant ? `${ph.montant} DH` : '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{ph.dateDebut?.substring(0, 10)}</td>
                    <td className="px-4 py-3 text-gray-500">{ph.dateFin?.substring(0, 10)}</td>
                  </tr>
                ))
              ) : (
                data.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-indigo-600">{p.code}</td>
                    <td className="px-4 py-3 font-medium">{p.nom}</td>
                    <td className="px-4 py-3 text-gray-500">{p.nomOrganisme || '—'}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {p.nomChefProjet ? `${p.nomChefProjet} ${p.prenomChefProjet}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{p.dateDebut?.substring(0, 10)}</td>
                    <td className="px-4 py-3 text-gray-500">{p.dateFin?.substring(0, 10)}</td>
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