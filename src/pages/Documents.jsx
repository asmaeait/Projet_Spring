import { useState } from 'react'
import documentService from '../services/documentService'

export default function Documents() {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [projetId, setProjetId] = useState('')
  const [form, setForm] = useState({
    code: '', libelle: '', description: '', chemin: '', projetId: ''
  })

  const fetchDocuments = async (pid) => {
    if (!pid) return
    try {
      setLoading(true)
      const res = await documentService.getByProjet(pid)
      setDocuments(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      setError('Erreur lors du chargement des documents')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchDocuments(projetId)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editing) {
        await documentService.update(editing.id, form)
        setSuccess('Document modifié avec succès')
      } else {
        await documentService.create(projetId, form)
        setSuccess('Document créé avec succès')
      }
      setShowModal(false)
      setEditing(null)
      resetForm()
      fetchDocuments(projetId)
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err.response?.data?.erreur || 'Erreur lors de la sauvegarde')
    }
  }

  const handleEdit = (doc) => {
    setEditing(doc)
    setForm({
      code: doc.code, libelle: doc.libelle,
      description: doc.description || '',
      chemin: doc.chemin || '', projetId: projetId
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce document ?')) {
      try {
        await documentService.delete(id)
        setSuccess('Document supprimé avec succès')
        fetchDocuments(projetId)
        setTimeout(() => setSuccess(null), 3000)
      } catch (err) {
        setError('Erreur lors de la suppression')
      }
    }
  }

  const resetForm = () => {
    setForm({ code: '', libelle: '', description: '', chemin: '', projetId: projetId })
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-500 text-sm">Gestion des documents par projet</p>
        </div>
        {projetId && (
          <button
            onClick={() => { setEditing(null); resetForm(); setShowModal(true) }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + Nouveau document
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <form onSubmit={handleSearch} className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">ID du projet</label>
            <input
              type="number"
              placeholder="Entrez l'ID du projet..."
              value={projetId}
              onChange={e => setProjetId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Rechercher
          </button>
        </form>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex justify-between">
          {error}<button onClick={() => setError(null)} className="font-bold">✕</button>
        </div>
      )}
      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">{success}</div>}

      {!projetId ? (
        <div className="bg-white rounded-xl shadow p-8 text-center text-gray-400">
          Entrez un ID de projet pour voir ses documents
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
              {documents.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-8 text-gray-400">Aucun document trouvé</td></tr>
              ) : (
                documents.map(doc => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-blue-600">{doc.code}</td>
                    <td className="px-4 py-3 font-medium">{doc.libelle}</td>
                    <td className="px-4 py-3 text-gray-500">{doc.description || '-'}</td>
                    <td className="px-4 py-3 text-gray-500">{doc.chemin || '-'}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleEdit(doc)} className="text-blue-600 hover:text-blue-800 mr-3 font-medium">Modifier</button>
                      <button onClick={() => handleDelete(doc.id)} className="text-red-600 hover:text-red-800 font-medium">Supprimer</button>
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
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">{editing ? 'Modifier le document' : 'Nouveau document'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
                  <input type="text" required value={form.code}
                    onChange={e => setForm({...form, code: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Libellé *</label>
                  <input type="text" required value={form.libelle}
                    onChange={e => setForm({...form, libelle: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea rows="3" value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chemin du fichier</label>
                <input type="text" value={form.chemin}
                  onChange={e => setForm({...form, chemin: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">Annuler</button>
                <button type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
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