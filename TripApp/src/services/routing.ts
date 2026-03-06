import type { ETAResult } from '../types'

export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { 'Accept-Language': 'en' } }
    )
    const data = await res.json()
    return (
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      data.address?.county ||
      data.display_name?.split(',')[0] ||
      `${lat.toFixed(4)}, ${lng.toFixed(4)}`
    )
  } catch {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`
  }
}

const OSRM_BASE = 'https://router.project-osrm.org/route/v1/driving'

export async function getETA(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number
): Promise<ETAResult | null> {
  try {
    const url = `${OSRM_BASE}/${fromLng},${fromLat};${toLng},${toLat}?overview=false`
    const res = await fetch(url)
    const data = await res.json()
    if (data.routes?.[0]) {
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
