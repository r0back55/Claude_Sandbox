import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function NicknameForm() {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const { loginAsGuest } = useAuth()
  const navigate = useNavigate()

  const handle = async (e: FormEvent): Promise<void> => {
    e.preventDefault()
    if (!name.trim() || !code.trim()) return
    await loginAsGuest(name.trim())
    navigate(`/lobby/${code.trim().toUpperCase()}`)
  }

  return (
    <form onSubmit={handle}>
      <input
        placeholder="Your nickname"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Trip code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button type="submit">Join Trip</button>
    </form>
  )
}
