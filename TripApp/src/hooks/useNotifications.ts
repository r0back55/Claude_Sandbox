import { useEffect, useRef } from 'react'
import type { Participant, Destination } from '../types'

const STOPPED_THRESHOLD_MS = 10 * 60 * 1000 // 10 minutes

function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function useNotifications(
  participants: Record<string, Participant> | undefined,
  destination: Destination | undefined,
  onNotify: (message: string) => void
): void {
  const prevParticipants = useRef<Record<string, Participant>>({})
  const stoppedTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})
  const arrivedUids = useRef<Set<string>>(new Set())
  const allArrivedNotified = useRef(false)

  useEffect(() => {
    if (!participants) return

    Object.entries(participants).forEach(([uid, data]) => {
      const prev = prevParticipants.current[uid]

      if (!prev) {
        onNotify(`${data.name} has joined the trip`)
      }

      if (destination && !arrivedUids.current.has(uid)) {
        const dist = getDistanceKm(data.lat, data.lng, destination.lat, destination.lng)
        if (dist < 0.1) {
          arrivedUids.current.add(uid)
          onNotify(`${data.name} has arrived at the destination!`)
        }
      }

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

    const allUids = Object.keys(participants)
    if (
      !allArrivedNotified.current &&
      allUids.length > 0 &&
      allUids.every((uid) => arrivedUids.current.has(uid))
    ) {
      allArrivedNotified.current = true
      onNotify('All participants have arrived!')
    }

    prevParticipants.current = participants
  }, [participants, destination, onNotify])
}
