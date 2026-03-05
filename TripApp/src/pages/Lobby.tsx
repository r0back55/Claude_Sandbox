import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useTrip } from '../hooks/useTrip'
import { useAuth } from '../context/AuthContext'
import { useLocation } from '../hooks/useLocation'
import ParticipantList from '../components/Trip/ParticipantList'
import { db } from '../services/firebase'
import { ref, set } from 'firebase/database'

export default function Lobby() {
  const { tripId } = useParams<{ tripId: string }>()
  const navigate = useNavigate()
  const trip = useTrip(tripId ?? null)
  const { identity } = useAuth()

  useLocation(tripId ?? null, identity?.uid ?? null, identity?.name ?? '')

  const startTrip = async (): Promise<void> => {
    if (!tripId) return
    await set(ref(db, `trips/${tripId}/status`), 'active')
  }

  useEffect(() => {
    if (trip?.status === 'active') {
      navigate(`/trip/${tripId}`)
    }
  }, [trip?.status, tripId, navigate])

  return (
    <div className="min-h-[100dvh] bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col gap-5">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Waiting for trip to start...</h1>
          <p className="text-gray-500 mt-1 text-sm">Share this code with your group</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
          <p className="text-sm text-gray-500 mb-1">Trip Code</p>
          <p className="text-4xl font-bold tracking-widest text-blue-600">{tripId}</p>
        </div>

        <ParticipantList participants={trip?.participants} />

        {identity?.isOrganizer && (
          <button
            onClick={startTrip}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Start Trip
          </button>
        )}
      </div>
    </div>
  )
}
