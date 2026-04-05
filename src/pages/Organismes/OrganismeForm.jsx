import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import organismeService from '../../services/organismeService'

export default function OrganismeForm() {
  const { id } = useParams()           // présent si modification
  const isEdit  = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    code: '', nom: '', adresse: '',
    telephone: '', contact: '', email: '', siteWeb: ''
  })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)

  // Si modification, charger les données existantes
  useEffect(() => {
    if (isEdit) {
      organismeService.getById(id).then(res => setForm(res.data))
    }
  }, [id])

  const validate = () => {
    const e = {}
    if (!form.code.trim())      e.code      = 'Le code est obligatoire'
    if (!form.nom.trim())       e.nom       = 'Le nom est obligatoire'
    if (!form.telephone.trim()) e.telephone = 'Le téléphone est obligatoire'
    if (!form.contact.trim())   e.contact   = 'Le contact est obligatoire'
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email invalide'
    return e
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })  // effacer l'erreur du champ modifié
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setLoading(true)
    try {
      if (isEdit) {
        await organismeService.update(id, form)
      } else {
        await organismeService.create(form)
      }
      navigate('/organismes')
    } catch (err) {
      // Afficher l'erreur backend si elle existe
      const msg = err.response?.data?.message || 'Une erreur est survenue'
      setErrors({ global: msg })
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { name: 'code',      label: 'Code',      type: 'text' },
    { name: 'nom',       label: 'Nom',       type: 'text' },
    { name: 'adresse',   label: 'Adresse',   type: 'text' },
    { name: 'telephone', label: 'Téléphone', type: 'text' },
    { name: 'contact',   label: 'Contact',   type: 'text' },
    { name: 'email',     label: 'Email',     type: 'email' },
    { name: 'siteWeb',   label: 'Site web',  type: 'text' },
  ]

  return (
    <div className="p-4 max-w-xl">
      <h1 className="text-2xl font-semibold mb-6">
        {isEdit ? 'Modifier l\'organisme' : 'Nouvel organisme'}
      </h1>

      {errors.global && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-2 rounded mb-4">
          {errors.global}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {fields.map(f => (
          <div key={f.name}>
            <label className="block text-sm font-medium mb-1">{f.label}</label>
            <input
              type={f.type}
              name={f.name}
              value={form[f.name]}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 ${errors[f.name] ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors[f.name] && (
              <p className="text-red-500 text-sm mt-1">{errors[f.name]}</p>
            )}
          </div>
        ))}

        <div className="flex gap-3 mt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
          >
            {loading ? 'Enregistrement...' : isEdit ? 'Modifier' : 'Créer'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/organismes')}
            className="bg-gray-200 px-6 py-2 rounded"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  )
}