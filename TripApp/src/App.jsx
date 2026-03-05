import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Lobby from './pages/Lobby'
import Trip from './pages/Trip'
import { useAuth } from './context/AuthContext'

export default function App() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
      <Route path="/lobby/:tripId" element={<Lobby />} />
      <Route path="/trip/:tripId" element={<Trip />} />
    </Routes>
  )
}
