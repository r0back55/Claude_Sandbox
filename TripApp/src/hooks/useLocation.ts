import { useEffect, useRef, useCallback } from 'react'
import { writeLocation } from '../services/location'

const INTERVAL_MS = 60 * 1000 // 1 minute

export function useLocation(
  tripId: string | null,
  uid: string | null,
  name: string
): { refresh: () => void } {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const publish = useCallback((): void => {
    if (!tripId || !uid) return
    navigator.geolocation.getCurrentPosition(
      ({ coords }) =>
        writeLocation(tripId, uid, {
          lat: coords.latitude,
          lng: coords.longitude,
          name,
        }),
      (err) => console.warn('Geolocation error:', err)
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

  return { refresh: publish }
}
