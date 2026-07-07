import { useState, useCallback } from 'react'

interface Toast {
  id: string
  title?: string
  description?: string
  duration?: number
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback(({ title, description, duration = 3000 }: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(7)
    const newToast: Toast = { id, title, description, duration }
    
    setToasts((prev) => [...prev, newToast])
    
    if (duration) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, duration)
    }
    
    return id
  }, [])

  return { toast, toasts }
}
