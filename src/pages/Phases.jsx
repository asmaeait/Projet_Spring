<<<<<<< Updated upstream
export default function Phases() {   
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Phases</h1>
      <p className="text-gray-500 text-sm">Module en cours de développement</p>
=======
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import phaseService from '../services/phaseService'
import projetService from '../services/projetService'

export default function Phases() {
  const { projetId } = useParams()
  const navigate = useNavigate()

  const [projet, setProjet]       = useState(null)
  const [phases, setPhases]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [success, setSuccess]     = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing]     = useState(null)

  const [form, setForm] = useState({
    code: '', libelle: '', description: '',
    dateDebut: '', dateFin: '', montant: ''
  })

  useEffect(() => {
    if (!projetId) { navigate('/projets'); return }
    fetchAll()
  }, [projetId])

  const fetchAll = async () => {
    try {
      setLoading(true)
      const [proj, ph] = await Promise.all([
        projetService.getById(projetId),
        phaseService.getByProjet(projetId),
      ])
      setProjet(proj.data)
      setPhases(Array.isArray(ph.data) ? ph.data : ph.data.content ?? [])
    } catch (err) {
      setError('Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => setForm({
    code: '', libelle: '', description: '',
    dateDebut: '', dateFin: '', montant: ''
  })

  const handleEdit = (phase) => {
    setEditing(phase)
    setForm({
      code:        phase.code,
      libelle:     phase.libelle,
      description: phase.description || '',
      dateDebut:   phase.dateDebut?.substring(0, 10) || '',
      dateFin:     phase.dateFin?.substring(0, 10) || '',
      montant:     phase.montant || '',
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
        await phaseService.update(editing.id, form)
        setSuccess('Phase modifiée avec succès')
      } else {
        await phaseService.create(projetId, form)
        setSuccess('Phase créée avec succès')
      }
      setShowModal(false)
      setEditing(null)
      resetForm()
      fetchAll()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la sauvegarde')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette phase ?')) return
    try {
      await phaseService.delete(id)
      setSuccess('Phase supprimée')
      fetchAll()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError('Erreur lors de la suppression')
    }
  }

  const handleEtat = async (phase, type) => {
    try {
      const etatActuel =
        type === 'realisation' ? phase.etatRealisation :
        type === 'facturation' ? phase.etatFacturation :
        phase.etatPaiement
      const nouvelEtat = !etatActuel

      if (type === 'realisation')
        await phaseService.updateRealisation(phase.id, nouvelEtat)
      else if (type === 'facturation')
        await phaseService.updateFacturation(phase.id, nouvelEtat)
      else
        await phaseService.updatePaiement(phase.id, nouvelEtat)

      fetchAll()
    } catch (err) {
      setError('Erreur lors de la mise à jour')
    }
  }

  const Badge = ({ condition, trueLabel, falseLabel }) => (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
      condition ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
    }`}>
      {condition ? trueLabel : falseLabel}
    </span>
  )

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <button
            onClick={() => navigate('/projets')}
            className="text-sm text-gray-500 hover:underline mb-1 block"
          >← Retour aux projets</button>
          <h1 className="text-2xl font-bold text-gray-900">
            Phases — {projet?.nom || '...'}
          </h1>
          <p className="text-gray-500 text-sm">Code projet : {projet?.code}</p>
        </div>
        <button
          onClick={() => { setEditing(null); resetForm(); setShowModal(true) }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >+ Nouvelle phase</button>
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
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Code</th>
                <th className="px-4 py-3 text-left">Libellé</th>
                <th className="px-4 py-3 text-left">Dates</th>
                <th className="px-4 py-3 text-left">Montant</th>
                <th className="px-4 py-3 text-left">États</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {phases.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-400">
                    Aucune phase pour ce projet
                  </td>
                </tr>
              ) : (
                phases.map(phase => (
                  <tr key={phase.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-blue-600">{phase.code}</td>
                    <td className="px-4 py-3 font-medium">{phase.libelle}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {phase.dateDebut?.substring(0, 10)} → {phase.dateFin?.substring(0, 10)}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {phase.montant ? `${phase.montant} DH` : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <Badge condition={phase.etatRealisation} trueLabel="✓ Réalisée"     falseLabel="○ En cours" />
                        <Badge condition={phase.etatFacturation} trueLabel="✓ Facturée"     falseLabel="○ Non facturée" />
                        <Badge condition={phase.etatPaiement}    trueLabel="✓ Payée"        falseLabel="○ Non payée" />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => handleEtat(phase, 'realisation')}
                          className="text-xs text-purple-600 hover:underline text-left"
                        >
                          {phase.etatRealisation ? 'Annuler réalisation' : 'Marquer réalisée'}
                        </button>

                        {phase.etatRealisation && (
                          <button
                            onClick={() => handleEtat(phase, 'facturation')}
                            className="text-xs text-orange-600 hover:underline text-left"
                          >
                            {phase.etatFacturation ? 'Annuler facturation' : 'Marquer facturée'}
                          </button>
                        )}

                        {phase.etatFacturation && (
                          <button
                            onClick={() => handleEtat(phase, 'paiement')}
                            className="text-xs text-green-600 hover:underline text-left"
                          >
                            {phase.etatPaiement ? 'Annuler paiement' : 'Marquer payée'}
                          </button>
                        )}

                        <button
                          onClick={() => handleEdit(phase)}
                          className="text-xs text-blue-600 hover:underline text-left"
                        >Modifier</button>
                        <button
                          onClick={() => handleDelete(phase.id)}
                          className="text-xs text-red-600 hover:underline text-left"
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
              {editing ? 'Modifier la phase' : 'Nouvelle phase'}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Montant (DH) *</label>
                  <input
                    type="number" required min="0" value={form.montant}
                    onChange={e => setForm({...form, montant: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Libellé *</label>
                <input
                  type="text" required value={form.libelle}
                  onChange={e => setForm({...form, libelle: e.target.value})}
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
>>>>>>> Stashed changes
    </div>
  )
}