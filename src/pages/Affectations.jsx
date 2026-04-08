import { useState, useEffect } from 'react'
import affectationService from '../services/affectationService'
import employeService from '../services/employeService'
import projetService from '../services/projetService'
import phaseService from '../services/phaseService'

export default function Affectations() {
  const [affectations, setAffectations] = useState([])
  const [employes,     setEmployes]     = useState([])
  const [projets,      setProjets]      = useState([])
  const [phases,       setPhases]       = useState([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState(null)
  const [success,      setSuccess]      = useState(null)
  const [showModal,    setShowModal]    = useState(false)
  const [selectedProjetId, setSelectedProjetId] = useState('')

  const [form, setForm] = useState({
    employeId: '', phaseId: '', dateDebut: '', dateFin: ''
  })

  useEffect(() => { fetchBase() }, [])

  const fetchBase = async () => {
    try {
      setLoading(true)
      const [empRes, projRes] = await Promise.all([
        employeService.getAll(),
        projetService.getAll(),
      ])
      setEmployes(Array.isArray(empRes.data)  ? empRes.data  : [])
      setProjets(Array.isArray(projRes.data)  ? projRes.data : [])
    } catch (err) {
      setError('Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  // Quand on sélectionne un projet → charger ses phases
  const handleProjetChange = async (projetId) => {
    setSelectedProjetId(projetId)
    setPhases([])
    setAffectations([])
    if (!projetId) return
    try {
      const res = await phaseService.getByProjet(projetId)
      setPhases(Array.isArray(res.data) ? res.data : [])
    } catch {
      setError('Erreur lors du chargement des phases')
    }
  }

  // Quand on sélectionne une phase → charger ses affectations
  const handlePhaseChange = async (phaseId) => {
    setForm({ ...form, phaseId })
    if (!phaseId) return
    try {
      const res = await affectationService.getByPhase(phaseId)
      setAffectations(Array.isArray(res.data) ? res.data : [])
    } catch {
      setError('Erreur lors du chargement des affectations')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.phaseId || !form.employeId) {
      setError('Veuillez sélectionner une phase et un employé')
      return
    }
    try {
      await affectationService.create(form.phaseId, form.employeId, {
        dateDebut: form.dateDebut,
        dateFin:   form.dateFin,
      })
      setSuccess('Affectation créée avec succès')
      setShowModal(false)
      handlePhaseChange(form.phaseId)
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la sauvegarde')
    }
  }

  const handleDelete = async (phaseId, employeId) => {
    if (!window.confirm('Supprimer cette affectation ?')) return
    try {
      await affectationService.delete(phaseId, employeId)
      setSuccess('Affectation supprimée')
      handlePhaseChange(phaseId)
      setTimeout(() => setSuccess(null), 3000)
    } catch {
      setError('Erreur lors de la suppression')
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Affectations</h1>
          <p className="text-gray-500 text-sm">Gestion des affectations employé-phase</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary"
          disabled={!form.phaseId}
        >+ Nouvelle affectation</button>
      </div>

      {/* Filtres */}
      <div className="card p-4 mb-6 flex flex-wrap gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Projet</label>
          <select
            value={selectedProjetId}
            onChange={e => handleProjetChange(e.target.value)}
            className="input w-56"
          >
            <option value="">Sélectionner un projet...</option>
            {projets.map(p => (
              <option key={p.id} value={p.id}>{p.nom}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Phase</label>
          <select
            value={form.phaseId}
            onChange={e => handlePhaseChange(e.target.value)}
            className="input w-56"
            disabled={!selectedProjetId}
          >
            <option value="">Sélectionner une phase...</option>
            {phases.map(ph => (
              <option key={ph.id} value={ph.id}>{ph.libelle}</option>
            ))}
          </select>
        </div>
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
          <div className="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto" />
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Employé</th>
                <th className="px-4 py-3 text-left">Matricule</th>
                <th className="px-4 py-3 text-left">Date début</th>
                <th className="px-4 py-3 text-left">Date fin</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {!form.phaseId ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-400">
                    Sélectionnez un projet puis une phase pour voir les affectations
                  </td>
                </tr>
              ) : affectations.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-400">
                    Aucune affectation pour cette phase
                  </td>
                </tr>
              ) : (
                affectations.map((aff, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">
                      {aff.nomEmploye} {aff.prenomEmploye}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{aff.matriculeEmploye}</td>
                    <td className="px-4 py-3 text-gray-500">{aff.dateDebut?.substring(0, 10)}</td>
                    <td className="px-4 py-3 text-gray-500">{aff.dateFin?.substring(0, 10)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(aff.phaseId, aff.employeId)}
                        className="text-red-600 hover:underline text-xs"
                      >Supprimer</button>
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
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Nouvelle affectation</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employé *</label>
                <select
                  required value={form.employeId}
                  onChange={e => setForm({...form, employeId: e.target.value})}
                  className="input"
                >
                  <option value="">Sélectionner un employé...</option>
                  {employes.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.nom} {emp.prenom} — {emp.matricule}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date début *</label>
                  <input
                    type="date" required value={form.dateDebut}
                    onChange={e => setForm({...form, dateDebut: e.target.value})}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date fin *</label>
                  <input
                    type="date" required value={form.dateFin}
                    onChange={e => setForm({...form, dateFin: e.target.value})}
                    className="input"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >Annuler</button>
                <button type="submit" className="btn-primary">Affecter</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}