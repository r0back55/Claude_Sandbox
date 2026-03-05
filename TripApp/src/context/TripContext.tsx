import { createContext, useContext, useState, ReactNode } from 'react'
import type { Trip } from '../types'

interface TripContextValue {
  tripId: string | null
  setTripId: (id: string | null) => void
  tripData: Trip | null
  setTripData: (data: Trip | null) => void
}

const TripContext = createContext<TripContextValue | null>(null)

export function TripProvider({ children }: { children: ReactNode }) {
  const [tripId, setTripId] = useState<string | null>(null)
  const [tripData, setTripData] = useState<Trip | null>(null)

  return (
    <TripContext.Provider value={{ tripId, setTripId, tripData, setTripData }}>
      {children}
    </TripContext.Provider>
  )
}

export function useTrip(): TripContextValue {
  const ctx = useContext(TripContext)
  if (!ctx) throw new Error('useTrip must be used within TripProvider')
  return ctx
}
