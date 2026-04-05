import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <p className="text-8xl font-bold text-indigo-600">404</p>
      <p className="text-2xl font-semibold text-gray-800 mt-4">Page introuvable</p>
      <p className="text-gray-500 mt-2">Cette page n'existe pas.</p>
      <button onClick={() => navigate('/dashboard')} className="btn-primary mt-6">
        Retour au dashboard
      </button>
    </div>
  )
}