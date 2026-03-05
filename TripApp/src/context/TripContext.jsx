import { createContext, useContext, useState } from 'react'

const TripContext = createContext(null)

export function TripProvider({ children }) {
  const [tripId, setTripId] = useState(null)
  const [tripData, setTripData] = useState(null)

  return (
    <TripContext.Provider value={{ tripId, setTripId, tripData, setTripData }}>
      {children}
    </TripContext.Provider>
  )
}

export const useTrip = () => useContext(TripContext)
