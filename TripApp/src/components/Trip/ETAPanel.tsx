import { useEffect, useState } from 'react'
import { getETA } from '../../services/routing'
import type { Participant, Destination, ETAResult } from '../../types'

const ARRIVED_THRESHOLD_KM = 0.1

interface Props {
  participants?: Record<string, Participant>
  destination?: Destination
}

interface RankedEntry {
  uid: string
  participant: Participant
  eta: ETAResult | null
  arrived: boolean
  rank: number
  gapMinutes: number | null
  leaderName: string | null
}

export default function ETAPanel({ participants, destination }: Props) {
  const [etas, setEtas] = useState<Record<string, ETAResult>>({})
  const [open, setOpen] = useState(true)

  useEffect(() => {
    if (!participants || !destination) return
    Object.entries(participants).forEach(async ([uid, p]) => {
      if (p.lat === 0 && p.lng === 0) return // skip unlocated participants
      const result = await getETA(p.lat, p.lng, destination.lat, destination.lng)
      if (result) {
        setEtas((prev) => ({ ...prev, [uid]: result }))
      }
    })
  }, [participants, destination])

  const entries = Object.entries(participants ?? {})

  // Sort by ETA ascending (leader = closest to destination = lowest ETA)
  const ranked: RankedEntry[] = entries
    .map(([uid, p]) => {
      const eta = etas[uid] ?? null
      const arrived = eta !== null && parseFloat(eta.distanceKm) < ARRIVED_THRESHOLD_KM
      return { uid, participant: p, eta, arrived }
    })
    .sort((a, b) => {
      if (a.arrived && !b.arrived) return -1
      if (!a.arrived && b.arrived) return 1
      if (!a.eta || !b.eta) return 0
      return a.eta.etaMinutes - b.eta.etaMinutes
    })
    .map((entry, index, arr) => {
      const leader = arr[0]
      const gapMinutes =
        !entry.arrived &&
        entry.eta &&
        leader.eta &&
        index > 0
          ? entry.eta.etaMinutes - leader.eta.etaMinutes
          : null

      return {
        ...entry,
        rank: index + 1,
        gapMinutes,
        leaderName: index > 0 ? leader.participant.name : null,
      }
    })

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
          {ranked.map(({ uid, participant, eta, arrived, rank, gapMinutes, leaderName }) => (
            <li key={uid} className="flex items-center justify-between py-2 text-sm gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs text-gray-400 w-4 shrink-0">{rank}.</span>
                <span className="font-medium text-gray-800 truncate">{participant.name}</span>
                {rank === 1 && !arrived && eta && (
                  <span className="text-xs bg-blue-100 text-blue-600 font-medium px-1.5 py-0.5 rounded-full shrink-0">
                    leader
                  </span>
                )}
              </div>

              <div className="flex flex-col items-end shrink-0">
                {arrived ? (
                  <span className="flex items-center gap-1 text-green-600 font-medium">
                    Arrived ✓
                  </span>
                ) : eta ? (
                  <>
                    <span className="text-gray-700 font-medium">{eta.etaMinutes} min · {eta.distanceKm} km</span>
                    {gapMinutes !== null && gapMinutes > 0 && (
                      <span className="text-xs text-orange-500">+{gapMinutes} min behind {leaderName}</span>
                    )}
                  </>
                ) : (
                  <span className="text-gray-400">Calculating...</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
