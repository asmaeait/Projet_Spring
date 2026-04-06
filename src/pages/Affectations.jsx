import { useState, useEffect } from 'react'
import affectationService from '../services/affectationService'
import employeService from '../services/employeService'
import phaseService from '../services/phaseService'

export default function Affectations() {
  const [affectations, setAffectations] = useState([])
  const [employes, setEmployes] = useState([])
  const [phases, setPhases] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    employeId: '', phaseId: '', dateDebut: '', dateFin: ''
  })

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [empRes, phaseRes] = await Promise.all([
        employeService.getAll(),
        phaseService.getAll ? phaseService.getAll() : Promise.resolve({ data: [] })
      ])
      setEmployes(Array.isArray(empRes.data) ? empRes.data : [])
      setPhases(Array.isArray(phaseRes.data) ? phaseRes.data : [])
    } catch (err) {
      setError('Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await affectationService.create(form.phaseId, form.employeId, {
        dateDebut: form.dateDebut,
        dateFin: form.dateFin
      })
      setSuccess('Affectation créée avec succès')
      setShowModal(false)
      setForm({ employeId: '', phaseId: '', dateDebut: '', dateFin: '' })
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err.response?.data?.erreur || 'Erreur lors de la création')
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Affectations</h1>
          <p className="text-gray-500 text-sm">Gestion des affectations employés-phases</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Nouvelle affectation
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex justify-between">
          {error}
          <button onClick={() => setError(null)} className="font-bold">✕</button>
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">{success}</div>
      )}

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-2">Chargement...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 text-center py-8">
            Sélectionnez une phase dans le module Phases pour voir ses affectations
          </p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Nouvelle affectation</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employé *</label>
                <select
                  required
                  value={form.employeId}
                  onChange={e => setForm({...form, employeId: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner un employé...</option>
                  {employes.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.nom} {emp.prenom} - {emp.matricule}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phase *</label>
                <select
                  required
                  value={form.phaseId}
                  onChange={e => setForm({...form, phaseId: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner une phase...</option>
                  {phases.map(phase => (
                    <option key={phase.id} value={phase.id}>
                      {phase.libelle} - {phase.code}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date début *</label>
                  <input
                    type="date" required
                    value={form.dateDebut}
                    onChange={e => setForm({...form, dateDebut: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date fin *</label>
                  <input
                    type="date" required
                    value={form.dateFin}
                    onChange={e => setForm({...form, dateFin: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
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
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}