import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import type { Participant } from '../../types'

const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

interface Props {
  participant: Participant
}

export default function UserMarker({ participant }: Props) {
  return (
    <Marker position={[participant.lat, participant.lng]} icon={icon}>
      <Popup>{participant.name}</Popup>
    </Marker>
  )
}
