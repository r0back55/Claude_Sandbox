export interface Participant {
  uid: string
  name: string
  lat: number
  lng: number
  updatedAt: number
  arrived?: boolean
}

export interface Destination {
  lat: number
  lng: number
  name: string
}

export interface Trip {
  organizerId: string
  status: 'lobby' | 'active' | 'ended'
  destination: Destination
  participants: Record<string, Participant>
}

export interface Identity {
  uid: string
  name: string
  isOrganizer: boolean
}

export interface ETAResult {
  durationSeconds: number
  distanceMeters: number
  etaMinutes: number
  distanceKm: string
}

export interface Notification {
  id: number
  message: string
}

export interface Message {
  id: string
  uid: string
  name: string
  text: string
  sentAt: number
}
