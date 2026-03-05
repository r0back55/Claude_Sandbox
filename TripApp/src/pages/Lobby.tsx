import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
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
  const [copied, setCopied] = useState(false)

  useLocation(tripId ?? null, identity?.uid ?? null, identity?.name ?? '')

  const startTrip = async (): Promise<void> => {
    if (!tripId) return
    await set(ref(db, `trips/${tripId}/status`), 'active')
  }

  const copyCode = (): void => {
    if (!tripId) return
    navigator.clipboard.writeText(tripId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    if (trip?.status === 'active') {
      navigate(`/trip/${tripId}`)
    }
  }, [trip?.status, tripId, navigate])

  const participantCount = Object.keys(trip?.participants ?? {}).length

  return (
    <div className="min-h-[100dvh] bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col gap-5">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Waiting for trip to start...</h1>
          <p className="text-gray-500 mt-1 text-sm">Share this code with your group</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
          <p className="text-sm text-gray-500 mb-1">Trip Code</p>
          <p className="text-4xl font-bold tracking-widest text-blue-600 mb-4">{tripId}</p>
          <button
            onClick={copyCode}
            className="w-full border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm font-medium py-2 rounded-lg transition-colors"
          >
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>

        <ParticipantList participants={trip?.participants} />

        {identity?.isOrganizer && (
          <button
            onClick={startTrip}
            disabled={participantCount === 0}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            Start Trip
            {participantCount > 0 && (
              <span className="bg-white text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {participantCount}
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
