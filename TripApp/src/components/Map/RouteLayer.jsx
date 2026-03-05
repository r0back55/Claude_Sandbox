import { useEffect, useState } from 'react'
import { Polyline } from 'react-leaflet'

const OSRM_BASE = 'https://router.project-osrm.org/route/v1/driving'

export default function RouteLayer({ from, to }) {
  const [coords, setCoords] = useState([])

  useEffect(() => {
    if (!from || !to) return
    const url = `${OSRM_BASE}/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (data.routes?.[0]) {
          const points = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng])
          setCoords(points)
        }
      })
      .catch(() => {})
  }, [from.lat, from.lng, to.lat, to.lng])

  return coords.length > 0 ? <Polyline positions={coords} color="blue" weight={3} opacity={0.6} /> : null
}
