import { createContext, useContext, useState, useEffect } from 'react'
import { auth, googleProvider } from '../services/firebase'
import { signInWithPopup, signInAnonymously, signOut, onAuthStateChanged, updateProfile } from 'firebase/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsub
  }, [])

  const loginWithGoogle = () => signInWithPopup(auth, googleProvider)

  const loginAsGuest = async (nickname) => {
    const { user: anonUser } = await signInAnonymously(auth)
    await updateProfile(anonUser, { displayName: nickname })
    setUser({ ...anonUser, displayName: nickname })
  }

  const logout = () => signOut(auth)

  const isOrganizer = user && !user.isAnonymous

  const identity = user
    ? { uid: user.uid, name: user.displayName, isOrganizer }
    : null

  return (
    <AuthContext.Provider value={{ user, identity, loading, loginWithGoogle, loginAsGuest, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
