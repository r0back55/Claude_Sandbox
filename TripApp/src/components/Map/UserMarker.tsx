import { useEffect, useRef } from 'react'
import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import type { Participant } from '../../types'

const ANIMATION_DURATION = 1000 // ms

interface Props {
  participant: Participant
  color: string
}

function createColoredIcon(color: string, name: string): L.DivIcon {
  return L.divIcon({
    className: '',
    html: `
      <div style="
        background-color: ${color};
        width: 36px;
        height: 36px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.35);
      ">
        <div style="
          transform: rotate(45deg);
          color: white;
          font-size: 11px;
          font-weight: 700;
          text-align: center;
          line-height: 30px;
          font-family: sans-serif;
          letter-spacing: -0.5px;
          overflow: hidden;
          white-space: nowrap;
        ">
          ${name.substring(0, 2).toUpperCase()}
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  })
}

export default function UserMarker({ participant, color }: Props) {
  const markerRef = useRef<L.Marker | null>(null)
  const prevPos = useRef<[number, number]>([participant.lat, participant.lng])
  const animRef = useRef<number | null>(null)

  useEffect(() => {
    const marker = markerRef.current
    if (!marker) return

    const from: [number, number] = [...prevPos.current]
    const to: [number, number] = [participant.lat, participant.lng]

    if (from[0] === to[0] && from[1] === to[1]) return

    if (animRef.current) cancelAnimationFrame(animRef.current)

    let startTime: number | null = null

    const animate = (time: number): void => {
      if (!startTime) startTime = time
      const t = Math.min((time - startTime) / ANIMATION_DURATION, 1)
      const easedT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t // ease-in-out

      marker.setLatLng([
        from[0] + (to[0] - from[0]) * easedT,
        from[1] + (to[1] - from[1]) * easedT,
      ])

      if (t < 1) {
        animRef.current = requestAnimationFrame(animate)
      } else {
        prevPos.current = to
      }
    }

    animRef.current = requestAnimationFrame(animate)

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [participant.lat, participant.lng])

  return (
    <Marker
      ref={markerRef}
      position={[participant.lat, participant.lng]}
      icon={createColoredIcon(color, participant.name)}
    >
      <Popup>
        <strong>{participant.name}</strong>
      </Popup>
    </Marker>
  )
}
