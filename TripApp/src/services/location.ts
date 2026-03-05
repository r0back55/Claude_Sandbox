import { db } from './firebase'
import { ref, set, onValue, off } from 'firebase/database'
import type { Participant } from '../types'

export function writeLocation(
  tripId: string,
  uid: string,
  data: Pick<Participant, 'lat' | 'lng' | 'name'>
): Promise<void> {
  const locationRef = ref(db, `trips/${tripId}/participants/${uid}`)
  return set(locationRef, { ...data, updatedAt: Date.now() })
}

export function subscribeToLocations(
  tripId: string,
  callback: (participants: Record<string, Participant>) => void
): () => void {
  const locRef = ref(db, `trips/${tripId}/participants`)
  onValue(locRef, (snapshot) => callback(snapshot.val() ?? {}))
  return () => off(locRef)
}
