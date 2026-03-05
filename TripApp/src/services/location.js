import { db } from './firebase'
import { ref, set, onValue, off } from 'firebase/database'

export function writeLocation(tripId, uid, { lat, lng, name }) {
  const locationRef = ref(db, `trips/${tripId}/participants/${uid}`)
  return set(locationRef, { lat, lng, name, updatedAt: Date.now() })
}

export function subscribeToLocations(tripId, callback) {
  const locRef = ref(db, `trips/${tripId}/participants`)
  onValue(locRef, (snapshot) => callback(snapshot.val() || {}))
  return () => off(locRef)
}
