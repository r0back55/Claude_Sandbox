import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

const Landing = lazy(() => import('./pages/Landing'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Lobby = lazy(() => import('./pages/Lobby'))
const Trip = lazy(() => import('./pages/Trip'))
const Join = lazy(() => import('./pages/Join'))

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  const { identity } = useAuth()

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={identity?.isOrganizer ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/lobby/:tripId" element={<Lobby />} />
        <Route path="/trip/:tripId" element={<Trip />} />
        <Route path="/join/:tripId" element={<Join />} />
      </Routes>
    </Suspense>
  )
}
