import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { db } from '../../services/firebase'
import { ref, set } from 'firebase/database'
import DestinationSearch from './DestinationSearch'
import DestinationMap from './DestinationMap'
import { reverseGeocode } from '../../services/routing'
import type { Destination } from '../../types'

function generateTripId(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export default function CreateTrip() {
  const [destination, setDestination] = useState<Destination | null>(null)
  const [loading, setLoading] = useState(false)
  const { identity } = useAuth()
  const navigate = useNavigate()

  const handleMapClick = async (lat: number, lng: number): Promise<void> => {
    const name = await reverseGeocode(lat, lng)
    setDestination({ lat, lng, name })
  }

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
      <p className="text-gray-500 text-sm mb-6">Search for a city or click on the map to set your destination.</p>

      <form onSubmit={create} className="flex flex-col gap-4">
        <DestinationSearch onSelect={setDestination} />

        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">Or click on the map</p>
          <DestinationMap destination={destination} onMapClick={handleMapClick} />
          {destination && (
            <p className="text-xs text-green-600 mt-1">
              Destination set: <span className="font-medium">{destination.name}</span> ({destination.lat.toFixed(4)}, {destination.lng.toFixed(4)})
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !destination}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          {loading ? 'Creating...' : 'Create Trip'}
        </button>
      </form>
    </div>
  )
}
