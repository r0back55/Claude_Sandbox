import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useTrip } from '../hooks/useTrip'
import { useAuth } from '../context/AuthContext'
import { useLocation } from '../hooks/useLocation'
import ParticipantList from '../components/Trip/ParticipantList'
import { db } from '../services/firebase'
import { ref, set } from 'firebase/database'

export default function Lobby() {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const trip = useTrip(tripId)
  const { identity } = useAuth()

  useLocation(tripId, identity?.uid, identity?.name)

  // Organizer can start the trip
  const startTrip = async () => {
    await set(ref(db, `trips/${tripId}/status`), 'active')
  }

  // Redirect all users when trip goes active
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
