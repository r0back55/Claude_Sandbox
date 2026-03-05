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
    <div>
      <h1>Waiting for trip to start...</h1>
      <p>Trip code: <strong>{tripId}</strong></p>
      <ParticipantList participants={trip?.participants} />
      {identity?.isOrganizer && (
        <button onClick={startTrip}>Start Trip</button>
      )}
    </div>
  )
}
