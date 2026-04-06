import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import employeService from '../../services/employeService'

export default function EmployeList() {
  const navigate = useNavigate()
  const [employes, setEmployes] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)
  const [success,  setSuccess]  = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editing,   setEditing]  = useState(null)
  const [search,    setSearch]   = useState('')

  const [form, setForm] = useState({
    matricule: '', nom: '', prenom: '', telephone: '',
    email: '', login: '', password: '', profilId: ''
  })

  useEffect(() => { fetchEmployes() }, [])

  const fetchEmployes = async () => {
    try {
      setLoading(true)
      const res = await employeService.getAll()
      setEmployes(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      setError('Erreur lors du chargement des employés')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => setForm({
    matricule: '', nom: '', prenom: '', telephone: '',
    email: '', login: '', password: '', profilId: ''
  })

  const handleEdit = (emp) => {
    setEditing(emp)
    setForm({
      matricule: emp.matricule   || '',
      nom:       emp.nom         || '',
      prenom:    emp.prenom      || '',
      telephone: emp.telephone   || '',
      email:     emp.email       || '',
      login:     emp.login       || '',
      password:  '',
      profilId:  emp.profilId    || '',  // ← corrigé : était profil?.id
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editing) {
        await employeService.update(editing.id, form)
        setSuccess('Employé modifié avec succès')
      } else {
        await employeService.create(form)
        setSuccess('Employé créé avec succès')
      }
      setShowModal(false)
      setEditing(null)
      resetForm()
      fetchEmployes()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la sauvegarde')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cet employé ?')) return
    try {
      await employeService.delete(id)
      setSuccess('Employé supprimé avec succès')
      fetchEmployes()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError('Erreur lors de la suppression')
    }
  }

  const filtered = employes.filter(e =>
    e.nom?.toLowerCase().includes(search.toLowerCase())       ||
    e.prenom?.toLowerCase().includes(search.toLowerCase())    ||
    e.matricule?.toLowerCase().includes(search.toLowerCase()) ||
    e.login?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employés</h1>
          <p className="text-gray-500 text-sm">{employes.length} employé(s) au total</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/employes/disponibilite')}
            className="btn-secondary"
          >Disponibilité</button>
          <button
            onClick={() => { setEditing(null); resetForm(); setShowModal(true) }}
            className="btn-primary"
          >+ Nouvel employé</button>
        </div>
      </div>

      {/* Recherche */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Rechercher par nom, matricule, login..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input w-full md:w-80"
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
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-2">Chargement...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Matricule</th>
                <th className="px-4 py-3 text-left">Nom & Prénom</th>
                <th className="px-4 py-3 text-left">Login</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Téléphone</th>
                <th className="px-4 py-3 text-left">Profil</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-400">
                    Aucun employé trouvé
                  </td>
                </tr>
              ) : (
                filtered.map(emp => (
                  <tr key={emp.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-indigo-600">{emp.matricule}</td>
                    <td className="px-4 py-3 font-medium">{emp.nom} {emp.prenom}</td>
                    <td className="px-4 py-3 text-gray-500">{emp.login}</td>
                    <td className="px-4 py-3 text-gray-500">{emp.email || '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{emp.telephone || '—'}</td>
                    <td className="px-4 py-3">
                      <span className="badge bg-indigo-100 text-indigo-700">
                        {emp.profilLibelle || '—'}  {/* ← corrigé : était profil?.libelle */}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => navigate(`/employes/${emp.id}`)}
                          className="text-gray-600 hover:underline text-xs"
                        >Voir</button>
                        <button
                          onClick={() => handleEdit(emp)}
                          className="text-blue-600 hover:underline text-xs"
                        >Modifier</button>
                        <button
                          onClick={() => handleDelete(emp.id)}
                          className="text-red-600 hover:underline text-xs"
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
              {editing ? "Modifier l'employé" : 'Nouvel employé'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Matricule *</label>
                  <input
                    type="text" required value={form.matricule}
                    onChange={e => setForm({...form, matricule: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profil *</label>
                  <select
                    required value={form.profilId}
                    onChange={e => setForm({...form, profilId: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner...</option>
                    <option value="1">Administrateur</option>
                    <option value="2">Secrétaire</option>
                    <option value="3">Directeur</option>
                    <option value="4">Chef de projet</option>
                    <option value="5">Comptable</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                  <input
                    type="text" required value={form.nom}
                    onChange={e => setForm({...form, nom: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                  <input
                    type="text" required value={form.prenom}
                    onChange={e => setForm({...form, prenom: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Login *</label>
                  <input
                    type="text" required value={form.login}
                    onChange={e => setForm({...form, login: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {editing ? 'Nouveau mot de passe' : 'Mot de passe *'}
                  </label>
                  <input
                    type="password"
                    required={!editing}
                    value={form.password}
                    onChange={e => setForm({...form, password: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email" value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input
                    type="text" value={form.telephone}
                    onChange={e => setForm({...form, telephone: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
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