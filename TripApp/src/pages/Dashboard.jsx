import { useAuth } from '../context/AuthContext'
import CreateTrip from '../components/Trip/CreateTrip'

export default function Dashboard() {
  const { identity, logout } = useAuth()

  return (
    <div>
      <h1>Welcome, {identity?.name}</h1>
      <button onClick={logout}>Logout</button>
      <CreateTrip />
    </div>
  )
}
