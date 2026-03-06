import { useEffect, useState } from 'react'
import { subscribeToRestStop } from '../services/restStop'
import type { RestStop } from '../types'

export function useRestStop(tripId: string | null): RestStop | null {
  const [restStop, setRestStop] = useState<RestStop | null>(null)

  useEffect(() => {
    if (!tripId) return
    const unsub = subscribeToRestStop(tripId, setRestStop)
    return unsub
  }, [tripId])

  return restStop
}
