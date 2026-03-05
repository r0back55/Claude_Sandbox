import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import UserMarker from './UserMarker'
import RouteLayer from './RouteLayer'
import 'leaflet/dist/leaflet.css'

const DEFAULT_CENTER = [52.237049, 21.017532] // Warsaw fallback

export default function TripMap({ participants, destination }) {
  const participantList = Object.entries(participants || {})
  const center = participantList.length > 0
    ? [participantList[0][1].lat, participantList[0][1].lng]
    : DEFAULT_CENTER

  return (
    <MapContainer center={center} zoom={10} style={{ height: '60vh', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {participantList.map(([uid, p]) => (
        <UserMarker key={uid} participant={p} />
      ))}
      {destination && (
        <>
          <Marker position={[destination.lat, destination.lng]}>
            <Popup>Destination: {destination.name}</Popup>
          </Marker>
          {participantList.map(([uid, p]) => (
            <RouteLayer key={uid} from={p} to={destination} />
          ))}
        </>
      )}
    </MapContainer>
  )
}
