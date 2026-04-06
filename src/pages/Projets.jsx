import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import projetService from '../services/projetService'
import employeService from '../services/employeService'
import organismeService from '../services/organismeService'

export default function Projets() {
  const [projets, setProjets]       = useState([])
  const [employes, setEmployes]     = useState([])
  const [organismes, setOrganismes] = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)
  const [success, setSuccess]       = useState(null)
  const [showModal, setShowModal]   = useState(false)
  const [editing, setEditing]       = useState(null)
  const [search, setSearch]         = useState('')
  const navigate = useNavigate()

  const [form, setForm] = useState({
    code: '', nom: '', description: '',
    dateDebut: '', dateFin: '', montant: '',
    organismeId: '', chefProjetId: ''
  })

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    try {
      setLoading(true)
      const [p, e, o] = await Promise.all([
        projetService.getAll(),
        employeService.getAll(),
        organismeService.getAll(),
      ])
      setProjets(Array.isArray(p.data) ? p.data : p.data.content ?? [])
      setEmployes(Array.isArray(e.data) ? e.data : e.data.content ?? [])
      setOrganismes(Array.isArray(o.data) ? o.data : o.data.content ?? [])
    } catch (err) {
      setError('Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => setForm({
    code: '', nom: '', description: '',
    dateDebut: '', dateFin: '', montant: '',
    organismeId: '', chefProjetId: ''
  })

  const handleEdit = (p) => {
    setEditing(p)
    setForm({
      code:         p.code                        || '',
      nom:          p.nom                         || '',
      description:  p.description                 || '',
      dateDebut:    p.dateDebut?.substring(0, 10) || '',
      dateFin:      p.dateFin?.substring(0, 10)   || '',
      montant:      p.montant                     || '',
      organismeId:  p.organismeId                 || '',
      chefProjetId: p.chefProjetId                || '',
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.dateDebut && form.dateFin && form.dateDebut > form.dateFin) {
      setError('La date de début doit être avant la date de fin')
      return
    }
    try {
      if (editing) {
        await projetService.update(editing.id, form)
        setSuccess('Projet modifié avec succès')
      } else {
        await projetService.create(form)
        setSuccess('Projet créé avec succès')
      }
      setShowModal(false)
      setEditing(null)
      resetForm()
      fetchAll()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err.response?.data?.erreur || err.response?.data?.message || 'Erreur lors de la sauvegarde')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce projet ?')) return
    try {
      await projetService.delete(id)
      setSuccess('Projet supprimé')
      fetchAll()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err.response?.data?.erreur || err.response?.data?.message || 'Erreur lors de la suppression')
    }
  }

  const filtered = projets.filter(p =>
    p.nom?.toLowerCase().includes(search.toLowerCase()) ||
    p.code?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projets</h1>
          <p className="text-gray-500 text-sm">{projets.length} projet(s) au total</p>
        </div>
        <button
          onClick={() => { setEditing(null); resetForm(); setShowModal(true) }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Nouveau projet
        </button>
      </div>

      {/* Recherche */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Rechercher par nom ou code..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full md:w-80 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
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
      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto" />
          <p className="text-gray-500 mt-2">Chargement...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Code</th>
                <th className="px-4 py-3 text-left">Nom</th>
                <th className="px-4 py-3 text-left">Organisme</th>
                <th className="px-4 py-3 text-left">Chef de projet</th>
                <th className="px-4 py-3 text-left">Dates</th>
                <th className="px-4 py-3 text-left">Montant</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-400">
                    Aucun projet trouvé
                  </td>
                </tr>
              ) : (
                filtered.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-blue-600">{p.code}</td>
                    <td className="px-4 py-3 font-medium">{p.nom}</td>
                    <td className="px-4 py-3 text-gray-500">{p.nomOrganisme || '—'}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {p.nomChefProjet ? `${p.nomChefProjet} ${p.prenomChefProjet}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {p.dateDebut?.substring(0, 10)} → {p.dateFin?.substring(0, 10)}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {p.montant ? `${p.montant.toLocaleString()} DH` : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => navigate(`/projets/${p.id}/detail`)}
                          className="text-blue-600 hover:text-blue-800 text-xs border border-blue-200 px-2 py-1 rounded"
                        >Détail</button>
                        <button
                          onClick={() => navigate(`/projets/${p.id}/resume`)}
                          className="text-purple-600 hover:text-purple-800 text-xs border border-purple-200 px-2 py-1 rounded"
                        >Résumé</button>
                        <button
                          onClick={() => navigate(`/projets/${p.id}/phases`)}
                          className="text-green-600 hover:text-green-800 text-xs border border-green-200 px-2 py-1 rounded"
                        >Phases</button>
                        <button
                          onClick={() => handleEdit(p)}
                          className="text-yellow-600 hover:text-yellow-800 text-xs"
                        >Modifier</button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="text-red-600 hover:text-red-800 text-xs"
                        >Supprimer</button>
                      </div>
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
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editing ? 'Modifier le projet' : 'Nouveau projet'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
                  <input
                    type="text" required value={form.code}
                    onChange={e => setForm({...form, code: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Montant (DH)</label>
                  <input
                    type="number" min="0" value={form.montant}
                    onChange={e => setForm({...form, montant: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                <input
                  type="text" required value={form.nom}
                  onChange={e => setForm({...form, nom: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3} value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date début *</label>
                  <input
                    type="date" required value={form.dateDebut}
                    onChange={e => setForm({...form, dateDebut: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date fin *</label>
                  <input
                    type="date" required value={form.dateFin}
                    onChange={e => setForm({...form, dateFin: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organisme *</label>
                <select
                  required value={form.organismeId}
                  onChange={e => setForm({...form, organismeId: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner un organisme...</option>
                  {organismes.map(o => (
                    <option key={o.id} value={o.id}>{o.nom}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chef de projet *</label>
                <select
                  required value={form.chefProjetId}
                  onChange={e => setForm({...form, chefProjetId: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner un chef de projet...</option>
                  {employes.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.nom} {emp.prenom}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditing(null); resetForm() }}
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                >Annuler</button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >{editing ? 'Modifier' : 'Créer'}</button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  )
}