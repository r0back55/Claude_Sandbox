import { useAuth } from '../../context/AuthContext'

export default function GoogleLogin({ onSuccess }) {
  const { loginWithGoogle } = useAuth()

  const handle = async () => {
    try {
      await loginWithGoogle()
      onSuccess?.()
    } catch (err) {
      console.error('Google login failed:', err)
    }
  }

  return <button onClick={handle}>Sign in with Google</button>
}
