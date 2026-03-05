import { useAuth } from '../../context/AuthContext'

interface Props {
  onSuccess?: () => void
}

export default function GoogleLogin({ onSuccess }: Props) {
  const { loginWithGoogle } = useAuth()

  const handle = async (): Promise<void> => {
    try {
      await loginWithGoogle()
      onSuccess?.()
    } catch (err) {
      console.error('Google login failed:', err)
    }
  }

  return <button onClick={handle}>Sign in with Google</button>
}
