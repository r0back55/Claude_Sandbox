import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { auth, googleProvider } from '../services/firebase'
import {
  signInWithPopup,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User,
} from 'firebase/auth'
import type { Identity } from '../types'

interface AuthContextValue {
  user: User | null
  identity: Identity | null
  loading: boolean
  loginWithGoogle: () => Promise<void>
  loginAsGuest: (nickname: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsub
  }, [])

  const loginWithGoogle = async (): Promise<void> => {
    await signInWithPopup(auth, googleProvider)
  }

  const loginAsGuest = async (nickname: string): Promise<void> => {
    const { user: anonUser } = await signInAnonymously(auth)
    await updateProfile(anonUser, { displayName: nickname })
    setUser({ ...anonUser, displayName: nickname })
  }

  const logout = (): Promise<void> => signOut(auth)

  const isOrganizer = Boolean(user && !user.isAnonymous)

  const identity: Identity | null = user
    ? { uid: user.uid, name: user.displayName ?? 'Unknown', isOrganizer }
    : null

  return (
    <AuthContext.Provider value={{ user, identity, loading, loginWithGoogle, loginAsGuest, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
