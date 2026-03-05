import { useEffect, useRef } from 'react'
import { writeLocation } from '../services/location'

const INTERVAL_MS = 60 * 1000 // 1 minute

export function useLocation(tripId, uid, name) {
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!tripId || !uid) return

    const publish = () => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => writeLocation(tripId, uid, { lat: coords.latitude, lng: coords.longitude, name }),
        (err) => console.warn('Geolocation error:', err)
      )
    }

    publish() // publish immediately on start
    intervalRef.current = setInterval(publish, INTERVAL_MS)

    return () => clearInterval(intervalRef.current)
  }, [tripId, uid, name])
}
