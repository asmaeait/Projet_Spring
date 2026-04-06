import { useState, useEffect } from 'react'
import factureService from '../services/factureService'
import phaseService from '../services/phaseService'

export default function Factures() {
  const [factures, setFactures] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ code: '', dateFacture: '', phaseId: '' })

  useEffect(() => { fetchFactures() }, [])

  const fetchFactures = async () => {
    try {
      setLoading(true)
      const res = await factureService.getAll()
      setFactures(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      setError('Erreur lors du chargement des factures')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await factureService.create(form.phaseId, form)
      setSuccess('Facture créée avec succès')
      setShowModal(false)
      setForm({ code: '', dateFacture: '', phaseId: '' })
      fetchFactures()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err.response?.data?.erreur || 'Erreur lors de la création')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette facture ?')) {
      try {
        await factureService.delete(id)
        setSuccess('Facture supprimée avec succès')
        fetchFactures()
        setTimeout(() => setSuccess(null), 3000)
      } catch (err) {
        setError('Erreur lors de la suppression')
      }
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Factures</h1>
          <p className="text-gray-500 text-sm">Gestion des factures</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Nouvelle facture
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex justify-between">
          {error}<button onClick={() => setError(null)} className="font-bold">✕</button>
        </div>
      )}
      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">{success}</div>}

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-2">Chargement...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Code</th>
                <th className="px-4 py-3 text-left">Date facture</th>
                <th className="px-4 py-3 text-left">Phase</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {factures.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-8 text-gray-400">Aucune facture trouvée</td></tr>
              ) : (
                factures.map(fac => (
                  <tr key={fac.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-blue-600">{fac.code}</td>
                    <td className="px-4 py-3 text-gray-500">{fac.dateFacture}</td>
                    <td className="px-4 py-3 text-gray-500">{fac.phase?.libelle || fac.phase?.id || '-'}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDelete(fac.id)}
                        className="text-red-600 hover:text-red-800 font-medium">Supprimer</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Nouvelle facture</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
                <input type="text" required value={form.code}
                  onChange={e => setForm({...form, code: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date facture *</label>
                <input type="date" required value={form.dateFacture}
                  onChange={e => setForm({...form, dateFacture: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID Phase *</label>
                <input type="number" required value={form.phaseId}
                  onChange={e => setForm({...form, phaseId: e.target.value})}
                  placeholder="ID de la phase terminée"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">Annuler</button>
                <button type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Créer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}