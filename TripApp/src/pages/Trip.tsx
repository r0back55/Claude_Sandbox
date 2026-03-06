import { useParams, useNavigate } from 'react-router-dom'
import { useCallback, useState } from 'react'
import { useTrip } from '../hooks/useTrip'
import { useAuth } from '../context/AuthContext'
import { useLocation } from '../hooks/useLocation'
import { useNotifications } from '../hooks/useNotifications'
import { useChat } from '../hooks/useChat'
import TripMap from '../components/Map/TripMap'
import ETAPanel from '../components/Trip/ETAPanel'
import ChatPanel from '../components/Chat/ChatPanel'
import NotificationToast from '../components/Notifications/NotificationToast'
import { db } from '../services/firebase'
import { ref, set, remove } from 'firebase/database'
import type { Notification } from '../types'

export default function Trip() {
  const { tripId } = useParams<{ tripId: string }>()
  const navigate = useNavigate()
  const trip = useTrip(tripId ?? null)
  const { identity } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [chatOpen, setChatOpen] = useState(false)
  const [seenCount, setSeenCount] = useState(0)

  const { refresh: refreshLocation, locating } = useLocation(tripId ?? null, identity?.uid ?? null, identity?.name ?? '')
  const messages = useChat(tripId ?? null)

  const onNotify = useCallback((message: string): void => {
    setNotifications((prev) => [...prev, { id: Date.now(), message }])
  }, [])

  useNotifications(trip?.participants, trip?.destination, onNotify)

  const endTrip = async (): Promise<void> => {
    if (!tripId) return
    await set(ref(db, `trips/${tripId}/status`), 'ended')
    navigate('/')
  }

  const exitTrip = async (): Promise<void> => {
    if (!tripId || !identity) return
    await remove(ref(db, `trips/${tripId}/participants/${identity.uid}`))
    navigate('/')
  }

  const dismissNotification = (id: number): void =>
    setNotifications((prev) => prev.filter((n) => n.id !== id))

  return (
    <div className="flex flex-col h-[100dvh]">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
        <div>
          <h1 className="font-bold text-gray-900">TripApp</h1>
          <p className="text-xs text-gray-500">To: {trip?.destination?.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setChatOpen((v) => !v)
              setSeenCount(messages.length)
            }}
            className="relative bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-3 py-2 rounded-lg transition-colors"
          >
            💬
            {messages.length > seenCount && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {messages.length - seenCount > 9 ? '9+' : messages.length - seenCount}
              </span>
            )}
          </button>
          {identity?.isOrganizer ? (
            <button
              onClick={endTrip}
              className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              End Trip
            </button>
          ) : (
            <button
              onClick={exitTrip}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Exit Trip
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 p-3 bg-gray-100 relative">
        <div className="h-full rounded-xl overflow-hidden shadow-sm">
          <TripMap participants={trip?.participants} destination={trip?.destination} />
        </div>
        {locating && (
          <div className="absolute inset-3 rounded-xl bg-white/70 flex flex-col items-center justify-center gap-2 z-20">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-600 font-medium">Getting your location...</p>
          </div>
        )}
      </div>

      <div className="bg-amber-50 border-t border-amber-200 px-4 py-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-amber-500 text-sm">⚠</span>
          <p className="text-xs text-amber-700">Keep this page open and screen on for live location updates.</p>
        </div>
        <button
          onClick={refreshLocation}
          className="shrink-0 text-xs text-amber-700 font-medium border border-amber-300 bg-amber-100 hover:bg-amber-200 px-2 py-1 rounded-lg transition-colors"
        >
          Refresh
        </button>
      </div>

      {chatOpen && identity && tripId && (
        <ChatPanel
          tripId={tripId}
          identity={identity}
          messages={messages}
          onClose={() => setChatOpen(false)}
        />
      )}

      {!chatOpen && <ETAPanel participants={trip?.participants} destination={trip?.destination} />}

      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
        {notifications.map((n) => (
          <NotificationToast key={n.id} message={n.message} onDismiss={() => dismissNotification(n.id)} />
        ))}
      </div>
    </div>
  )
}
