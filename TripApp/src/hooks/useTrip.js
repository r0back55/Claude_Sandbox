import { useEffect, useState } from 'react'
import { db } from '../services/firebase'
import { ref, onValue, off } from 'firebase/database'

export function useTrip(tripId) {
  const [trip, setTrip] = useState(null)

  useEffect(() => {
    if (!tripId) return
    const tripRef = ref(db, `trips/${tripId}`)
    onValue(tripRef, (snapshot) => setTrip(snapshot.val()))
    return () => off(tripRef)
  }, [tripId])

  return trip
}
