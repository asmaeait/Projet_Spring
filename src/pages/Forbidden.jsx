import { useNavigate } from 'react-router-dom'

export default function Forbidden() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <p className="text-8xl font-bold text-red-500">403</p>
      <p className="text-2xl font-semibold text-gray-800 mt-4">Accès refusé</p>
      <p className="text-gray-500 mt-2">Vous n'avez pas les droits pour accéder à cette page.</p>
      <button onClick={() => navigate('/dashboard')} className="btn-primary mt-6">
        Retour au dashboard
      </button>
    </div>
  )
}