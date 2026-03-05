import { createContext, useContext, useState, useEffect } from 'react'
import { auth, googleProvider } from '../services/firebase'
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)        // Google user
  const [nickname, setNickname] = useState(null) // Guest nickname
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsub
  }, [])

  const loginWithGoogle = () => signInWithPopup(auth, googleProvider)

  const loginAsGuest = (name) => setNickname(name)

  const logout = () => {
    signOut(auth)
    setNickname(null)
  }

  // Unified identity: Google user display name or guest nickname
  const identity = user
    ? { uid: user.uid, name: user.displayName, isOrganizer: true }
    : nickname
    ? { uid: `guest_${nickname}`, name: nickname, isOrganizer: false }
    : null

  return (
    <AuthContext.Provider value={{ user, nickname, identity, loading, loginWithGoogle, loginAsGuest, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
