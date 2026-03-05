import { useParams, useNavigate } from 'react-router-dom'
import { useCallback, useState } from 'react'
import { useTrip } from '../hooks/useTrip'
import { useAuth } from '../context/AuthContext'
import { useLocation } from '../hooks/useLocation'
import { useNotifications } from '../hooks/useNotifications'
import TripMap from '../components/Map/TripMap'
import ETAPanel from '../components/Trip/ETAPanel'
import NotificationToast from '../components/Notifications/NotificationToast'
import { db } from '../services/firebase'
import { ref, set } from 'firebase/database'
import type { Notification } from '../types'

export default function Trip() {
  const { tripId } = useParams<{ tripId: string }>()
  const navigate = useNavigate()
  const trip = useTrip(tripId ?? null)
  const { identity } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])

  useLocation(tripId ?? null, identity?.uid ?? null, identity?.name ?? '')

  const onNotify = useCallback((message: string): void => {
    setNotifications((prev) => [...prev, { id: Date.now(), message }])
  }, [])

  useNotifications(trip?.participants, trip?.destination, onNotify)

  const endTrip = async (): Promise<void> => {
    if (!tripId) return
    await set(ref(db, `trips/${tripId}/status`), 'ended')
    navigate('/')
  }

  const dismissNotification = (id: number): void =>
    setNotifications((prev) => prev.filter((n) => n.id !== id))

  return (
    <div>
      <TripMap participants={trip?.participants} destination={trip?.destination} />
      <ETAPanel participants={trip?.participants} destination={trip?.destination} />
      {notifications.map((n) => (
        <NotificationToast key={n.id} message={n.message} onDismiss={() => dismissNotification(n.id)} />
      ))}
      {identity?.isOrganizer && (
        <button onClick={endTrip}>End Trip</button>
      )}
    </div>
  )
}
