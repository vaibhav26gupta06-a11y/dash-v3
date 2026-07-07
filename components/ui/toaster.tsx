'use client'

import { useToast } from '@/components/toast-provider'
import { X } from 'lucide-react'

export function Toaster() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed bottom-0 right-0 z-50 flex flex-col gap-2 p-4 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-white border border-[#e2e8f0] rounded-lg shadow-lg p-4 min-w-80 max-w-96 pointer-events-auto animate-in slide-in-from-right-5 duration-300"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {toast.title && (
                <h3 className="font-semibold text-sm text-[#0f172a]">{toast.title}</h3>
              )}
              {toast.description && (
                <p className="text-sm text-[#475569] mt-1">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#94a3b8] hover:text-[#0f172a] transition-colors flex-shrink-0"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
