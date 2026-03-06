import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import type { Destination } from '../../types'

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
})

interface ClickHandlerProps {
  onMapClick: (lat: number, lng: number) => void
}

function ClickHandler({ onMapClick }: ClickHandlerProps) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

interface Props {
  destination: Destination | null
  onMapClick: (lat: number, lng: number) => void
}

export default function DestinationMap({ destination, onMapClick }: Props) {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm" style={{ height: '220px' }}>
      <MapContainer
        center={[52.237049, 21.017532]}
        zoom={5}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onMapClick={onMapClick} />
        {destination && (
          <Marker
            position={[destination.lat, destination.lng]}
            icon={destinationIcon}
          />
        )}
      </MapContainer>
    </div>
  )
}
