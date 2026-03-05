// Uses OSRM public demo server — replace with self-hosted for production
const OSRM_BASE = 'https://router.project-osrm.org/route/v1/driving'

export async function getETA(fromLat, fromLng, toLat, toLng) {
  try {
    const url = `${OSRM_BASE}/${fromLng},${fromLat};${toLng},${toLat}?overview=false`
    const res = await fetch(url)
    const data = await res.json()
    if (data.routes && data.routes.length > 0) {
      const { duration, distance } = data.routes[0]
      return {
        durationSeconds: duration,
        distanceMeters: distance,
        etaMinutes: Math.round(duration / 60),
        distanceKm: (distance / 1000).toFixed(1),
      }
    }
    return null
  } catch {
    return null
  }
}
