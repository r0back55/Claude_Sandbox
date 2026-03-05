import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { db } from '../../services/firebase'
import { ref, set } from 'firebase/database'
import DestinationSearch from './DestinationSearch'
import type { Destination } from '../../types'

function generateTripId(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export default function CreateTrip() {
  const [destination, setDestination] = useState<Destination | null>(null)
  const [loading, setLoading] = useState(false)
  const { identity } = useAuth()
  const navigate = useNavigate()

  const create = async (e: FormEvent): Promise<void> => {
    e.preventDefault()
    if (!identity || !destination) return
    setLoading(true)
    const tripId = generateTripId()
    await set(ref(db, `trips/${tripId}/organizerId`), identity.uid)
    await set(ref(db, `trips/${tripId}/status`), 'lobby')
    await set(ref(db, `trips/${tripId}/destination`), destination)
    navigate(`/lobby/${tripId}`)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Create a Trip</h2>
      <p className="text-gray-500 text-sm mb-6">Set your destination and share the code with your group.</p>

      <form onSubmit={create} className="flex flex-col gap-4">
        <DestinationSearch onSelect={setDestination} />
        <button
          type="submit"
          disabled={loading || !destination}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors mt-2"
        >
          {loading ? 'Creating...' : 'Create Trip'}
        </button>
      </form>
    </div>
  )
}
