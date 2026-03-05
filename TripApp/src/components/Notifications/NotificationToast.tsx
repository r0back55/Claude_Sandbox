import { useEffect } from 'react'

interface Props {
  message: string
  onDismiss: () => void
}

export default function NotificationToast({ message, onDismiss }: Props) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <div className="flex items-center gap-3 bg-gray-900 text-white text-sm px-4 py-3 rounded-xl shadow-lg max-w-sm">
      <span className="flex-1">{message}</span>
      <button
        onClick={onDismiss}
        className="text-gray-400 hover:text-white transition-colors text-lg leading-none"
      >
        ×
      </button>
    </div>
  )
}
