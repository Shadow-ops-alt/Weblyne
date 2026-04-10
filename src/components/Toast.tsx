import { useEffect } from 'react'

interface ToastProps {
  message: string
  type: 'success' | 'error' | 'info'
  onClose: () => void
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000)
    return () => clearTimeout(t)
  }, [onClose])

  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'i'

  return (
    <div className={`toast ${type}`}>
      <span style={{ fontWeight: 700 }}>{icon}</span>
      {message}
    </div>
  )
}
