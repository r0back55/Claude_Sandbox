import { useNavigate } from 'react-router-dom'
import GoogleLogin from '../components/Auth/GoogleLogin'
import NicknameForm from '../components/Auth/NicknameForm'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div>
      <h1>TripApp</h1>
      <p>Travel together, stay connected.</p>

      <section>
        <h2>Organizer</h2>
        <p>Log in with Google to create a trip.</p>
        <GoogleLogin onSuccess={() => navigate('/dashboard')} />
      </section>

      <section>
        <h2>Participant</h2>
        <p>Enter a nickname and join with a trip code.</p>
        <NicknameForm />
      </section>
    </div>
  )
}
