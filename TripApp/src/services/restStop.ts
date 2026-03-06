import { db } from './firebase'
import { ref, set, remove, onValue, off } from 'firebase/database'
import type { RestStop } from '../types'

export function setRestStop(tripId: string, lat: number, lng: number): Promise<void> {
  return set(ref(db, `trips/${tripId}/restStop`), { lat, lng })
}

export function clearRestStop(tripId: string): Promise<void> {
  return remove(ref(db, `trips/${tripId}/restStop`))
}

export function subscribeToRestStop(
  tripId: string,
  callback: (restStop: RestStop | null) => void
): () => void {
  const r = ref(db, `trips/${tripId}/restStop`)
  onValue(r, (snapshot) => callback(snapshot.val()))
  return () => off(r)
}
