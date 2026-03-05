import { useEffect, useState } from 'react'
import { getETA } from '../../services/routing'
import type { Participant, Destination, ETAResult } from '../../types'

interface Props {
  participants?: Record<string, Participant>
  destination?: Destination
}

export default function ETAPanel({ participants, destination }: Props) {
  const [etas, setEtas] = useState<Record<string, ETAResult>>({})

  useEffect(() => {
    if (!participants || !destination) return
    Object.entries(participants).forEach(async ([uid, p]) => {
      const result = await getETA(p.lat, p.lng, destination.lat, destination.lng)
      if (result) {
        setEtas((prev) => ({ ...prev, [uid]: result }))
      }
    })
  }, [participants, destination])

  return (
    <div>
      <h3>ETA to {destination?.name}</h3>
      <ul>
        {Object.entries(participants ?? {}).map(([uid, p]) => (
          <li key={uid}>
            {p.name}: {etas[uid] ? `${etas[uid].etaMinutes} min (${etas[uid].distanceKm} km)` : 'Calculating...'}
          </li>
        ))}
      </ul>
    </div>
  )
}
