import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import organismeService from '../../services/organismeService'

export default function OrganismeList() {
  const [organismes, setOrganismes] = useState([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const navigate = useNavigate()

  const fetchOrganismes = async () => {
    setLoading(true)
    try {
      const res = search
        ? await organismeService.rechercher(search)
        : await organismeService.getAll()

      console.log('réponse backend:', res.data) // ← pour voir la structure

      const data = Array.isArray(res.data)
        ? res.data
        : res.data.content ?? res.data.data ?? []
      setOrganismes(data)

    } catch (err) {
      console.error('Erreur fetch:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrganismes() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet organisme ?')) return
    try {
      await organismeService.delete(id)
      fetchOrganismes()
    } catch (err) {
      alert('Erreur lors de la suppression')
    }
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Organismes</h1>
        <button
          onClick={() => navigate('/organismes/nouveau')}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Ajouter
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Rechercher par nom..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-64"
        />
        <button onClick={fetchOrganismes} className="bg-gray-200 px-4 py-2 rounded">
          Rechercher
        </button>
        {search && (
          <button onClick={() => { setSearch(''); fetchOrganismes() }} className="text-gray-500 px-2">
            ✕ Réinitialiser
          </button>
        )}
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="border p-3 text-left">Code</th>
              <th className="border p-3 text-left">Nom</th>
              <th className="border p-3 text-left">Téléphone</th>
              <th className="border p-3 text-left">Contact</th>
              <th className="border p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {organismes.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-500">
                  Aucun organisme trouvé
                </td>
              </tr>
            ) : (
              organismes.map(org => (
                <tr key={org.id} className="hover:bg-gray-50">
                  <td className="border p-3">{org.code}</td>
                  <td className="border p-3">{org.nom}</td>
                  <td className="border p-3">{org.telephone}</td>
                  <td className="border p-3">{org.contact}</td>
                  <td className="border p-3 flex gap-2">
                    <button
                      onClick={() => navigate(`/organismes/${org.id}`)}
                      className="text-blue-600 hover:underline text-sm"
                    >Voir</button>
                    <button
                      onClick={() => navigate(`/organismes/${org.id}/modifier`)}
                      className="text-yellow-600 hover:underline text-sm"
                    >Modifier</button>
                    <button
                      onClick={() => handleDelete(org.id)}
                      className="text-red-600 hover:underline text-sm"
                    >Supprimer</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  )
}