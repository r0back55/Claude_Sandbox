import { useState, useEffect, useRef, FormEvent } from 'react'
import { sendMessage } from '../../services/chat'
import type { Message, Identity } from '../../types'

interface Props {
  tripId: string
  identity: Identity
  messages: Message[]
  onClose: () => void
}

export default function ChatPanel({ tripId, identity, messages, onClose }: Props) {
  const [text, setText] = useState('')
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (e: FormEvent): Promise<void> => {
    e.preventDefault()
    if (!text.trim()) return
    await sendMessage(tripId, identity.uid, identity.name, text.trim())
    setText('')
  }

  const formatTime = (ts: number): string =>
    new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="flex flex-col bg-white border-t border-gray-200" style={{ height: '320px' }}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700">Trip Chat</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-xl leading-none"
        >
          ×
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2">
        {messages.length === 0 && (
          <p className="text-xs text-gray-400 text-center mt-4">No messages yet. Say hi!</p>
        )}
        {messages.map((m) => {
          const isMe = m.uid === identity.uid
          return (
            <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              {!isMe && (
                <span className="text-xs text-gray-400 mb-0.5 ml-1">{m.name}</span>
              )}
              <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
                isMe
                  ? 'bg-blue-600 text-white rounded-tr-sm'
                  : 'bg-gray-100 text-gray-800 rounded-tl-sm'
              }`}>
                {m.text}
              </div>
              <span className="text-xs text-gray-300 mt-0.5 mx-1">{formatTime(m.sentAt)}</span>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={send} className="flex gap-2 px-3 py-2 border-t border-gray-100">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  )
}
