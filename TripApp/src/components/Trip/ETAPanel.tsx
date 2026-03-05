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
    <div className="bg-white border-t border-gray-200 px-4 py-4">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        ETA to {destination?.name}
      </h3>
      <ul className="flex flex-col gap-2">
        {Object.entries(participants ?? {}).map(([uid, p]) => (
          <li key={uid} className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-800">{p.name}</span>
            <span className="text-gray-500">
              {etas[uid] ? `${etas[uid].etaMinutes} min · ${etas[uid].distanceKm} km` : 'Calculating...'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
