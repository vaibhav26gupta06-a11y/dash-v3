'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface AdoptionCardProps {
  title: string
  subtitle: string
  percentage: number
  segments: Array<{
    color: string
    width: number
  }>
  modalTitle: string
  modalData: React.ReactNode
  type: 'total-cases' | 'scheme-coverage' | 'channel-mix'
}

function getRingColor(percentage: number): string {
  if (percentage >= 80) return '#16a34a' // green
  if (percentage >= 50) return '#3b82f6' // blue
  return '#f59e0b' // amber
}

export function AdoptionCard({
  title,
  subtitle,
  percentage,
  segments,
  modalTitle,
  modalData,
  type,
}: AdoptionCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const ringColor = getRingColor(percentage)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex flex-col gap-4 p-6 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] hover:bg-[color:var(--color-grey-bg)] transition-colors text-left"
      >
        <div className="flex gap-4">
          {/* Circular Progress Ring */}
          <div className="relative w-20 h-20 flex-shrink-0">
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-[color:var(--color-grey-bg)]"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={ringColor}
                strokeWidth="8"
                strokeDasharray={`${(percentage / 100) * 283} 283`}
                strokeLinecap="round"
                className="transition-all"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-[color:var(--color-text-primary)]">
                {percentage}%
              </span>
            </div>
          </div>

          {/* Title and Subtitle */}
          <div className="flex-1">
            <h4 className="font-semibold text-[color:var(--color-text-primary)]">{title}</h4>
            <p className="text-sm text-[color:var(--color-text-muted)] mt-1">{subtitle}</p>
          </div>
        </div>

        {/* Segmented Bar */}
        <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-[color:var(--color-grey-bg)]">
          {segments.map((segment, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: segment.color,
                width: `${segment.width}%`,
                flexGrow: type !== 'channel-mix' ? 1 : 0,
              }}
              className="transition-all"
            />
          ))}
        </div>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[color:var(--color-bg-primary)] rounded-xl shadow-2xl max-w-2xl max-h-[80vh] overflow-hidden flex flex-col border border-white/10">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-[#1e40af] to-[#1e3a8a]">
              <h2 className="text-2xl font-bold text-white">{modalTitle}</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-auto flex-1 p-6 bg-[color:var(--color-bg-primary)]">
              {modalData}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
