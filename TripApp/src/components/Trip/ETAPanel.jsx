import { useEffect, useState } from 'react'
import { getETA } from '../../services/routing'

export default function ETAPanel({ participants, destination }) {
  const [etas, setEtas] = useState({})

  useEffect(() => {
    if (!participants || !destination) return

    Object.entries(participants).forEach(async ([uid, p]) => {
      const result = await getETA(p.lat, p.lng, destination.lat, destination.lng)
      if (result) {
        setEtas((prev) => ({ ...prev, [uid]: result }))
      }
    })
  }, [participants, destination])

  const list = Object.values(participants || {})

  return (
    <div>
      <h3>ETA to {destination?.name}</h3>
      <ul>
        {list.map((p) => {
          const eta = etas[Object.keys(participants).find((k) => participants[k] === p)]
          return (
            <li key={p.name}>
              {p.name}: {eta ? `${eta.etaMinutes} min (${eta.distanceKm} km)` : 'Calculating...'}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
