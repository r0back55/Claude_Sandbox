import { useEffect } from 'react'

export default function NotificationToast({ message, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <div style={{
      position: 'fixed',
      bottom: '1rem',
      right: '1rem',
      background: '#333',
      color: '#fff',
      padding: '0.75rem 1.25rem',
      borderRadius: '8px',
      zIndex: 9999,
    }}>
      {message}
      <button onClick={onDismiss} style={{ marginLeft: '1rem', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>x</button>
    </div>
  )
}
