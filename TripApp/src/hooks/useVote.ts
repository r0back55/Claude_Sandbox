import { useEffect, useState } from 'react'
import { subscribeToVote } from '../services/vote'
import type { Vote } from '../types'

export function useVote(tripId: string | null): Vote | null {
  const [vote, setVote] = useState<Vote | null>(null)

  useEffect(() => {
    if (!tripId) return
    const unsub = subscribeToVote(tripId, setVote)
    return unsub
  }, [tripId])

  return vote
}
