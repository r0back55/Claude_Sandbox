import { db } from './firebase'
import { ref, set, remove, onValue, off } from 'firebase/database'
import type { Vote } from '../types'

export function proposeVote(tripId: string, uid: string, name: string): Promise<void> {
  return set(ref(db, `trips/${tripId}/vote`), {
    status: 'active',
    proposedBy: name,
    proposedByUid: uid,
    createdAt: Date.now(),
    votes: {},
  })
}

export function castVote(tripId: string, uid: string, vote: 'yes' | 'no'): Promise<void> {
  return set(ref(db, `trips/${tripId}/vote/votes/${uid}`), vote)
}

export function closeVote(tripId: string): Promise<void> {
  return remove(ref(db, `trips/${tripId}/vote`))
}

export function subscribeToVote(
  tripId: string,
  callback: (vote: Vote | null) => void
): () => void {
  const voteRef = ref(db, `trips/${tripId}/vote`)
  onValue(voteRef, (snapshot) => callback(snapshot.val()))
  return () => off(voteRef)
}
