import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import organismeService from '../../services/organismeService'

export default function OrganismeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [organisme, setOrganisme] = useState(null)
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    organismeService.getById(id)
      .then(res => setOrganisme(res.data))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p className="p-4">Chargement...</p>
  if (!organisme) return <p className="p-4 text-red-500">Organisme introuvable</p>

  const rows = [
    ['Code',      organisme.code],
    ['Nom',       organisme.nom],
    ['Adresse',   organisme.adresse],
    ['Téléphone', organisme.telephone],
    ['Contact',   organisme.contact],
    ['Email',     organisme.email],
    ['Site web',  organisme.siteWeb],
  ]

  return (
    <div className="p-4 max-w-xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">{organisme.nom}</h1>
        <button
          onClick={() => navigate(`/organismes/${id}/modifier`)}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Modifier
        </button>
      </div>

      <div className="border rounded overflow-hidden">
        {rows.map(([label, value]) => (
          <div key={label} className="flex border-b last:border-b-0">
            <span className="w-32 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600">{label}</span>
            <span className="px-4 py-3 text-sm">{value || '—'}</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate('/organismes')}
        className="mt-4 text-gray-500 hover:underline text-sm"
      >
        ← Retour à la liste
      </button>
    </div>
  )
}