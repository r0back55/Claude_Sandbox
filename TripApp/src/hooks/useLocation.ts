import { useEffect, useRef } from 'react'
import { writeLocation } from '../services/location'

const INTERVAL_MS = 60 * 1000 // 1 minute

export function useLocation(tripId: string | null, uid: string | null, name: string): void {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!tripId || !uid) return

    const publish = (): void => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) =>
          writeLocation(tripId, uid, {
            lat: coords.latitude,
            lng: coords.longitude,
            name,
          }),
        (err) => console.warn('Geolocation error:', err)
      )
    }

    publish()
    intervalRef.current = setInterval(publish, INTERVAL_MS)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [tripId, uid, name])
}
