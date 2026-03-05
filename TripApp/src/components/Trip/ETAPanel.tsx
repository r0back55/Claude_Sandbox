import { useEffect, useState } from 'react'
import { getETA } from '../../services/routing'
import type { Participant, Destination, ETAResult } from '../../types'

const ARRIVED_THRESHOLD_KM = 0.1

interface Props {
  participants?: Record<string, Participant>
  destination?: Destination
}

export default function ETAPanel({ participants, destination }: Props) {
  const [etas, setEtas] = useState<Record<string, ETAResult>>({})
  const [open, setOpen] = useState(true)

  useEffect(() => {
    if (!participants || !destination) return
    Object.entries(participants).forEach(async ([uid, p]) => {
      const result = await getETA(p.lat, p.lng, destination.lat, destination.lng)
      if (result) {
        setEtas((prev) => ({ ...prev, [uid]: result }))
      }
    })
  }, [participants, destination])

  const entries = Object.entries(participants ?? {})

  return (
    <div className="bg-white border-t border-gray-200">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
      >
        <span>ETA to {destination?.name}</span>
        <span className="text-gray-400 text-lg leading-none">{open ? '▾' : '▸'}</span>
      </button>

      {open && (
        <ul className="flex flex-col divide-y divide-gray-100 px-4 pb-3">
          {entries.map(([uid, p]) => {
            const eta = etas[uid]
            const arrived = eta && parseFloat(eta.distanceKm) < ARRIVED_THRESHOLD_KM

            return (
              <li key={uid} className="flex items-center justify-between py-2 text-sm">
                <span className="font-medium text-gray-800">{p.name}</span>
                {arrived ? (
                  <span className="flex items-center gap-1 text-green-600 font-medium">
                    <span>Arrived</span>
                    <span>✓</span>
                  </span>
                ) : (
                  <span className="text-gray-500">
                    {eta ? `${eta.etaMinutes} min · ${eta.distanceKm} km` : 'Calculating...'}
                  </span>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
