import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import type { Participant } from '../../types'

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
  return (
    <Marker
      position={[participant.lat, participant.lng]}
      icon={createColoredIcon(color, participant.name)}
    >
      <Popup>
        <strong>{participant.name}</strong>
      </Popup>
    </Marker>
  )
}
