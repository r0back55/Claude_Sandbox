import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { db } from '../../services/firebase'
import { ref, set } from 'firebase/database'

function generateTripId(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export default function CreateTrip() {
  const [destLat, setDestLat] = useState('')
  const [destLng, setDestLng] = useState('')
  const [destName, setDestName] = useState('')
  const { identity } = useAuth()
  const navigate = useNavigate()

  const create = async (e: FormEvent): Promise<void> => {
    e.preventDefault()
    if (!identity) return
    const tripId = generateTripId()
    await set(ref(db, `trips/${tripId}/organizerId`), identity.uid)
    await set(ref(db, `trips/${tripId}/status`), 'lobby')
    await set(ref(db, `trips/${tripId}/destination`), {
      lat: parseFloat(destLat),
      lng: parseFloat(destLng),
      name: destName,
    })
    navigate(`/lobby/${tripId}`)
  }

  return (
    <form onSubmit={create}>
      <h2>Create a Trip</h2>
      <input placeholder="Destination name" value={destName} onChange={(e) => setDestName(e.target.value)} required />
      <input placeholder="Latitude" value={destLat} onChange={(e) => setDestLat(e.target.value)} required />
      <input placeholder="Longitude" value={destLng} onChange={(e) => setDestLng(e.target.value)} required />
      <button type="submit">Create Trip</button>
    </form>
  )
}
