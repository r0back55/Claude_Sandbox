import { useEffect, useRef } from 'react'

const STOPPED_THRESHOLD_MS = 10 * 60 * 1000 // 10 minutes

export function useNotifications(participants, destination, onNotify) {
  const prevParticipants = useRef({})
  const stoppedTimers = useRef({})

  useEffect(() => {
    if (!participants) return

    Object.entries(participants).forEach(([uid, data]) => {
      const prev = prevParticipants.current[uid]

      // New participant joined
      if (!prev) {
        onNotify(`${data.name} has joined the trip`)
      }

      // Check if arrived at destination
      if (destination && !prev?.arrived) {
        const dist = getDistanceKm(data.lat, data.lng, destination.lat, destination.lng)
        if (dist < 0.1) {
          onNotify(`${data.name} has arrived at the destination!`)
          data.arrived = true
        }
      }

      // Check if stopped (no location change for 10 min)
      if (prev && prev.lat === data.lat && prev.lng === data.lng) {
        if (!stoppedTimers.current[uid]) {
          stoppedTimers.current[uid] = setTimeout(() => {
            onNotify(`${data.name} has been stopped for 10+ minutes`)
          }, STOPPED_THRESHOLD_MS)
        }
      } else {
        clearTimeout(stoppedTimers.current[uid])
        delete stoppedTimers.current[uid]
      }
    })

    // Check if all arrived
    const all = Object.values(participants)
    if (all.length > 0 && all.every((p) => p.arrived)) {
      onNotify('All participants have arrived!')
    }

    prevParticipants.current = participants
  }, [participants, destination, onNotify])
}

function getDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}
