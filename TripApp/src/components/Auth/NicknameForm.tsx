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
    <form onSubmit={handle} className="flex flex-col gap-3">
      <input
        placeholder="Your nickname"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        placeholder="Trip code (e.g. A1B2C3)"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
      />
      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
      >
        Join Trip
      </button>
    </form>
  )
}
