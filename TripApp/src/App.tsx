import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Lobby from './pages/Lobby'
import Trip from './pages/Trip'
import Join from './pages/Join'
import { useAuth } from './context/AuthContext'

export default function App() {
  const { identity } = useAuth()

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={identity?.isOrganizer ? <Dashboard /> : <Navigate to="/" />} />
      <Route path="/lobby/:tripId" element={<Lobby />} />
      <Route path="/trip/:tripId" element={<Trip />} />
      <Route path="/join/:tripId" element={<Join />} />
    </Routes>
  )
}
