import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import employeService from '../../services/employeService'

export default function EmployeDisponibilite() {
  const navigate  = useNavigate()
  const [dateDebut, setDateDebut] = useState('')
  const [dateFin,   setDateFin]   = useState('')
  const [employes,  setEmployes]  = useState([])
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState(null)
  const [searched,  setSearched]  = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!dateDebut || !dateFin) {
      setError('Veuillez renseigner les deux dates')
      return
    }
    if (dateDebut > dateFin) {
      setError('La date de début doit être avant la date de fin')
      return
    }
    try {
      setLoading(true)
      setError(null)
      const res = await employeService.disponibles(dateDebut, dateFin)
      setEmployes(Array.isArray(res.data) ? res.data : [])
      setSearched(true)
    } catch (err) {
      setError('Erreur lors de la recherche')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl">
      <button
        onClick={() => navigate('/employes')}
        className="text-sm text-gray-500 hover:underline mb-4 block"
      >← Retour aux employés</button>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">Disponibilité des employés</h1>
      <p className="text-gray-500 text-sm mb-6">
        Recherchez les employés disponibles sur une période donnée
      </p>

      {/* Formulaire de recherche */}
      <div className="card p-6 mb-6">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date début *
            </label>
            <input
              type="date" value={dateDebut} required
              onChange={e => setDateDebut(e.target.value)}
              className="input w-48"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date fin *
            </label>
            <input
              type="date" value={dateFin} required
              onChange={e => setDateFin(e.target.value)}
              className="input w-48"
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Recherche...' : 'Rechercher'}
          </button>
        </form>

        {error && (
          <p className="mt-3 text-sm text-red-600">{error}</p>
        )}
      </div>

      {/* Résultats */}
      {searched && (
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-700">
              {employes.length === 0
                ? 'Aucun employé disponible sur cette période'
                : `${employes.length} employé(s) disponible(s)`}
            </p>
          </div>

          {employes.length > 0 && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Matricule</th>
                  <th>Nom & Prénom</th>
                  <th>Email</th>
                  <th>Téléphone</th>
                  <th>Profil</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {employes.map(emp => (
                  <tr key={emp.id}>
                    <td className="font-medium text-indigo-600">{emp.matricule}</td>
                    <td>{emp.prenom} {emp.nom}</td>
                    <td className="text-gray-500">{emp.email || '—'}</td>
                    <td className="text-gray-500">{emp.telephone || '—'}</td>
                    <td>
                      <span className="badge bg-gray-100 text-gray-600">
                        {emp.profilLibelle || '—'}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => navigate(`/employes/${emp.id}`)}
                        className="text-indigo-600 hover:underline text-xs"
                      >Voir profil</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}