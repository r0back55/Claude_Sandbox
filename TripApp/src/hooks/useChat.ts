import { useEffect, useState } from 'react'
import { subscribeToMessages } from '../services/chat'
import type { Message } from '../types'

export function useChat(tripId: string | null): Message[] {
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    if (!tripId) return
    const unsub = subscribeToMessages(tripId, setMessages)
    return unsub
  }, [tripId])

  return messages
}
