import { useState, FormEvent } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Join() {
  const { tripId } = useParams<{ tripId: string }>()
  const { loginAsGuest } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = async (e: FormEvent): Promise<void> => {
    e.preventDefault()
    if (!name.trim() || !tripId) return
    setLoading(true)
    await loginAsGuest(name.trim())
    navigate(`/lobby/${tripId}`)
  }

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Join Trip</h1>
        <p className="text-gray-500 text-sm mb-6">
          You've been invited to join trip <span className="font-semibold text-blue-600">{tripId}</span>. Enter your name to continue.
        </p>

        <form onSubmit={handle} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your name</label>
            <input
              autoFocus
              placeholder="e.g. Anna"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            {loading ? 'Joining...' : 'Join Trip'}
          </button>
        </form>
      </div>
    </div>
  )
}
