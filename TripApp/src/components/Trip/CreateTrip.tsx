import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { db } from '../../services/firebase'
import { ref, set } from 'firebase/database'

function generateTripId(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export default function CreateTrip() {
  const [destLat, setDestLat] = useState('')
  const [destLng, setDestLng] = useState('')
  const [destName, setDestName] = useState('')
  const [loading, setLoading] = useState(false)
  const { identity } = useAuth()
  const navigate = useNavigate()

  const create = async (e: FormEvent): Promise<void> => {
    e.preventDefault()
    if (!identity) return
    setLoading(true)
    const tripId = generateTripId()
    await set(ref(db, `trips/${tripId}/organizerId`), identity.uid)
    await set(ref(db, `trips/${tripId}/status`), 'lobby')
    await set(ref(db, `trips/${tripId}/destination`), {
      lat: parseFloat(destLat),
      lng: parseFloat(destLng),
      name: destName,
    })
    navigate(`/lobby/${tripId}`)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Create a Trip</h2>
      <p className="text-gray-500 text-sm mb-6">Set your destination and share the code with your group.</p>

      <form onSubmit={create} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Destination name</label>
          <input
            placeholder="e.g. Krakow"
            value={destName}
            onChange={(e) => setDestName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
            <input
              placeholder="50.0647"
              value={destLat}
              onChange={(e) => setDestLat(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
            <input
              placeholder="19.9450"
              value={destLng}
              onChange={(e) => setDestLng(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors mt-2"
        >
          {loading ? 'Creating...' : 'Create Trip'}
        </button>
      </form>
    </div>
  )
}
