import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import UserMarker from './UserMarker'
import RouteLayer from './RouteLayer'
import type { Participant, Destination } from '../../types'
import 'leaflet/dist/leaflet.css'

const DEFAULT_CENTER: [number, number] = [52.237049, 21.017532] // Warsaw fallback

const PARTICIPANT_COLORS = [
  '#3B82F6', // blue
  '#EF4444', // red
  '#10B981', // green
  '#F59E0B', // amber
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#F97316', // orange
]

const destinationIcon = L.divIcon({
  className: '',
  html: `
    <div style="
      background-color: #1F2937;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="color: white; font-size: 16px; line-height: 1;">★</div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -20],
})

interface Props {
  participants?: Record<string, Participant>
  destination?: Destination
}

export default function TripMap({ participants, destination }: Props) {
  const participantList = Object.entries(participants ?? {})
  const center: [number, number] =
    participantList.length > 0
      ? [participantList[0][1].lat, participantList[0][1].lng]
      : DEFAULT_CENTER

  return (
    <div className="relative h-full w-full">
      <MapContainer center={center} zoom={10} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {participantList.map(([uid, p], index) => {
          const color = PARTICIPANT_COLORS[index % PARTICIPANT_COLORS.length]
          return (
            <UserMarker key={uid} participant={p} color={color} />
          )
        })}
        {destination && (
          <>
            <Marker position={[destination.lat, destination.lng]} icon={destinationIcon}>
              <Popup><strong>Destination:</strong> {destination.name}</Popup>
            </Marker>
            {participantList.map(([uid, p], index) => {
              const color = PARTICIPANT_COLORS[index % PARTICIPANT_COLORS.length]
              return <RouteLayer key={uid} from={p} to={destination} color={color} />
            })}
          </>
        )}
      </MapContainer>

      {participantList.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="bg-white/90 rounded-xl px-5 py-3 shadow text-center">
            <p className="text-sm font-medium text-gray-700">Waiting for locations...</p>
            <p className="text-xs text-gray-400 mt-0.5">Participants will appear once they share their position</p>
          </div>
        </div>
      )}
    </div>
  )
}
