import { useEffect, useState } from 'react'
import { Polyline } from 'react-leaflet'
import type { Destination, Participant } from '../../types'

const OSRM_BASE = 'https://router.project-osrm.org/route/v1/driving'

interface Props {
  from: Participant
  to: Destination
  color: string
}

export default function RouteLayer({ from, to, color }: Props) {
  const [coords, setCoords] = useState<[number, number][]>([])

  useEffect(() => {
    const url = `${OSRM_BASE}/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (data.routes?.[0]) {
          const points: [number, number][] = data.routes[0].geometry.coordinates.map(
            ([lng, lat]: [number, number]) => [lat, lng]
          )
          setCoords(points)
        }
      })
      .catch(() => {})
  }, [from.lat, from.lng, to.lat, to.lng])

  return coords.length > 0 ? <Polyline positions={coords} color={color} weight={3} opacity={0.6} /> : null
}
