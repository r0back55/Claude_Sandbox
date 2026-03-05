import { useEffect, useState } from 'react'
import { db } from '../services/firebase'
import { ref, onValue, off } from 'firebase/database'
import type { Trip } from '../types'

export function useTrip(tripId: string | null): Trip | null {
  const [trip, setTrip] = useState<Trip | null>(null)

  useEffect(() => {
    if (!tripId) return
    const tripRef = ref(db, `trips/${tripId}`)
    onValue(tripRef, (snapshot) => setTrip(snapshot.val()))
    return () => off(tripRef)
  }, [tripId])

  return trip
}
