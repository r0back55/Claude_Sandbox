import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function NicknameForm() {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const { loginAsGuest } = useAuth()
  const navigate = useNavigate()

  const handle = (e) => {
    e.preventDefault()
    if (!name.trim() || !code.trim()) return
    loginAsGuest(name.trim())
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
