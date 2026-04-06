import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import livrableService from '../services/livrableService'

export default function Livrables() {
  const [livrables, setLivrables] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [phaseId, setPhaseId] = useState('')
  const [form, setForm] = useState({
    code: '', libelle: '', description: '', chemin: '', phaseId: ''
  })

  const fetchLivrables = async (pid) => {
    if (!pid) return
    try {
      setLoading(true)
      const res = await livrableService.getByPhase(pid)
      setLivrables(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      setError('Erreur lors du chargement des livrables')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchLivrables(phaseId)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editing) {
        await livrableService.update(editing.id, form)
        setSuccess('Livrable modifié avec succès')
      } else {
        await livrableService.create(form.phaseId, form)
        setSuccess('Livrable créé avec succès')
      }
      setShowModal(false)
      setEditing(null)
      resetForm()
      fetchLivrables(phaseId)
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err.response?.data?.erreur || 'Erreur lors de la sauvegarde')
    }
  }

  const handleEdit = (liv) => {
    setEditing(liv)
    setForm({
      code: liv.code,
      libelle: liv.libelle,
      description: liv.description || '',
      chemin: liv.chemin || '',
      phaseId: phaseId
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce livrable ?')) {
      try {
        await livrableService.delete(id)
        setSuccess('Livrable supprimé avec succès')
        fetchLivrables(phaseId)
        setTimeout(() => setSuccess(null), 3000)
      } catch (err) {
        setError('Erreur lors de la suppression')
      }
    }
  }

  const resetForm = () => {
    setForm({ code: '', libelle: '', description: '', chemin: '', phaseId: phaseId })
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Livrables</h1>
          <p className="text-gray-500 text-sm">Gestion des livrables par phase</p>
        </div>
        {phaseId && (
          <button
            onClick={() => { setEditing(null); resetForm(); setShowModal(true) }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + Nouveau livrable
          </button>
        )}
      </div>

      {/* Recherche par phase */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <form onSubmit={handleSearch} className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID de la phase
            </label>
            <input
              type="number"
              placeholder="Entrez l'ID de la phase..."
              value={phaseId}
              onChange={e => setPhaseId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Rechercher
          </button>
        </form>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex justify-between">
          {error}
          <button onClick={() => setError(null)} className="font-bold">✕</button>
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">{success}</div>
      )}

      {/* Tableau */}
      {!phaseId ? (
        <div className="bg-white rounded-xl shadow p-8 text-center text-gray-400">
          Entrez un ID de phase pour voir ses livrables
        </div>
      ) : loading ? (
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
                <th className="px-4 py-3 text-left">Libellé</th>
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-left">Chemin</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {livrables.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-400">
                    Aucun livrable trouvé pour cette phase
                  </td>
                </tr>
              ) : (
                livrables.map(liv => (
                  <tr key={liv.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-blue-600">{liv.code}</td>
                    <td className="px-4 py-3 font-medium">{liv.libelle}</td>
                    <td className="px-4 py-3 text-gray-500">{liv.description || '-'}</td>
                    <td className="px-4 py-3 text-gray-500">{liv.chemin || '-'}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleEdit(liv)}
                        className="text-blue-600 hover:text-blue-800 mr-3 font-medium"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(liv.id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">
              {editing ? 'Modifier le livrable' : 'Nouveau livrable'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
                  <input
                    type="text" required
                    value={form.code}
                    onChange={e => setForm({...form, code: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Libellé *</label>
                  <input
                    type="text" required
                    value={form.libelle}
                    onChange={e => setForm({...form, libelle: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows="3"
                  value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chemin du fichier</label>
                <input
                  type="text"
                  value={form.chemin}
                  onChange={e => setForm({...form, chemin: e.target.value})}
                  placeholder="/chemin/vers/fichier.pdf"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editing ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}