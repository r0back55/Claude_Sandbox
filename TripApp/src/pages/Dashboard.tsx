import { useAuth } from '../context/AuthContext'
import CreateTrip from '../components/Trip/CreateTrip'

export default function Dashboard() {
  const { identity, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">TripApp</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600 text-sm">{identity?.name}</span>
          <button
            onClick={logout}
            className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-12">
        <CreateTrip />
      </main>
    </div>
  )
}
