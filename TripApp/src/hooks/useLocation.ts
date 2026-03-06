import { useEffect, useRef, useCallback, useState } from 'react'
import { writeLocation } from '../services/location'

const INTERVAL_MS = 60 * 1000 // 1 minute

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function useLocation(
  tripId: string | null,
  uid: string | null,
  name: string
): { refresh: () => void; locating: boolean } {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [locating, setLocating] = useState(true)
  const prevFix = useRef<{ lat: number; lng: number; ts: number } | null>(null)

  const publish = useCallback((): void => {
    if (!tripId || !uid) return
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude: lat, longitude: lng } = coords
        const now = Date.now()

        let speed: number | undefined
        if (prevFix.current) {
          const distKm = haversineKm(prevFix.current.lat, prevFix.current.lng, lat, lng)
          const elapsedHours = (now - prevFix.current.ts) / 3_600_000
          if (elapsedHours > 0) speed = Math.round(distKm / elapsedHours)
        }
        prevFix.current = { lat, lng, ts: now }

        writeLocation(tripId, uid, { lat, lng, name, speed })
        setLocating(false)
      },
      (err) => {
        console.warn('Geolocation error:', err)
        setLocating(false)
      }
    )
  }, [tripId, uid, name])

  useEffect(() => {
    if (!tripId || !uid) return
    publish()
    intervalRef.current = setInterval(publish, INTERVAL_MS)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [tripId, uid, name, publish])

  return { refresh: publish, locating }
}
