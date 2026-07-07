'use client'

import { X } from 'lucide-react'
import { CheckpointCategory } from '@/lib/product-detail-data'

interface CheckpointModalProps {
  category: CheckpointCategory
  isOpen: boolean
  onClose: () => void
}

export function CheckpointModal({ category, isOpen, onClose }: CheckpointModalProps) {
  if (!isOpen) return null

  // Calculate automation percentage
  const automationScores = category.checkpoints.map(cp => {
    if (cp.mode === 'Gen AI') return 1
    if (cp.mode === 'Both') return 0.5
    return 0 // Human
  })
  const automationPercentage = Math.round((automationScores.reduce((a, b) => a + b, 0) / category.checkpoints.length) * 100)

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'Gen AI':
        return 'bg-[#dcfce7] text-[#15803d]'
      case 'Both':
        return 'bg-[#dbeafe] text-[#0c4a6e]'
      case 'Human':
        return 'bg-[#f5f5f5] text-[#666666]'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[color:var(--color-bg-primary)] rounded-xl border border-[color:var(--color-border)] w-full max-w-lg max-h-[80vh] overflow-hidden shadow-lg">
        {/* Header */}
        <div className="sticky top-0 border-b border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[color:var(--color-text-primary)]">
              {category.name}
            </h2>
            <p className="text-sm text-[color:var(--color-text-secondary)] mt-1">
              {automationPercentage}% automated by Gen AI · {category.checkpoints.length} checkpoints
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[color:var(--color-grey-bg)] rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X size={20} className="text-[color:var(--color-text-muted)]" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(80vh-120px)]">
          <div className="px-6 py-4 space-y-3">
            {category.checkpoints.map((checkpoint, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between gap-4 p-3 rounded-lg bg-[color:var(--color-grey-bg)] hover:bg-[color:var(--color-border)] transition-colors"
              >
                <p className="text-sm text-[color:var(--color-text-primary)] flex-1">
                  {checkpoint.name}
                </p>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${getModeColor(
                    checkpoint.mode
                  )}`}
                >
                  {checkpoint.mode}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
