import { db } from './firebase'
import { ref, push, onValue, off } from 'firebase/database'
import type { Message } from '../types'

export function sendMessage(tripId: string, uid: string, name: string, text: string): Promise<void> {
  const messagesRef = ref(db, `trips/${tripId}/messages`)
  return push(messagesRef, { uid, name, text, sentAt: Date.now() }).then(() => {})
}

export function subscribeToMessages(
  tripId: string,
  callback: (messages: Message[]) => void
): () => void {
  const messagesRef = ref(db, `trips/${tripId}/messages`)
  onValue(messagesRef, (snapshot) => {
    const data = snapshot.val()
    if (!data) return callback([])
    const messages: Message[] = Object.entries(data).map(([id, val]) => ({
      id,
      ...(val as Omit<Message, 'id'>),
    }))
    callback(messages.sort((a, b) => a.sentAt - b.sentAt))
  })
  return () => off(messagesRef)
}
