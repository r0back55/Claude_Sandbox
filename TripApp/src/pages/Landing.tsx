import { useNavigate } from 'react-router-dom'
import GoogleLogin from '../components/Auth/GoogleLogin'
import NicknameForm from '../components/Auth/NicknameForm'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-white mb-2">TripApp</h1>
          <p className="text-blue-200 text-lg">Travel together, stay connected.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-1">Organizer</h2>
            <p className="text-gray-500 text-sm mb-5">Log in with Google to create a trip.</p>
            <GoogleLogin onSuccess={() => navigate('/dashboard')} />
          </div>

          <div className="p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-1">Participant</h2>
            <p className="text-gray-500 text-sm mb-5">Enter a nickname and join with a trip code.</p>
            <NicknameForm />
          </div>
        </div>
      </div>
    </div>
  )
}
