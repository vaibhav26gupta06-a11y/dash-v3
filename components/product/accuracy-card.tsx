'use client'

import { useState } from 'react'
import { Checkpoint, ComparisonPoint, AvailabilityItem } from '@/lib/product-detail-data'

interface AccuracyCardProps {
  title: string
  subtitle: string
  items: Checkpoint[] | ComparisonPoint[] | AvailabilityItem[]
  type: 'comparison' | 'questionnaire' | 'availability'
}

function getModeColor(mode: string): string {
  if (mode === 'Gen AI') return '#16a34a' // green
  if (mode === 'Both') return '#3b82f6' // blue
  return '#9ca3af' // gray for Human
}

function calculateAutomationPercentage(items: any[]): number {
  if (items.length === 0) return 0
  const total = items.reduce((sum, item) => {
    const mode = item.mode
    if (mode === 'Gen AI') return sum + 1
    if (mode === 'Both') return sum + 0.5
    return sum // Human = 0
  }, 0)
  return Math.round((total / items.length) * 100)
}

function getRingColor(percentage: number): string {
  if (percentage >= 80) return '#16a34a' // green
  if (percentage >= 50) return '#3b82f6' // blue
  return '#f59e0b' // amber
}

export function AccuracyCard({ title, subtitle, items, type }: AccuracyCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const percentage = calculateAutomationPercentage(items)
  const ringColor = getRingColor(percentage)

  // Count items by mode
  const genAiCount = items.filter(item => item.mode === 'Gen AI').length
  const bothCount = items.filter(item => item.mode === 'Both').length
  const humanCount = items.filter(item => item.mode === 'Human').length
  const total = items.length

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
                stroke="var(--color-border)"
                strokeWidth="4"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={ringColor}
                strokeWidth="4"
                strokeDasharray={`${(percentage / 100) * 282.7} 282.7`}
                strokeLinecap="round"
                className="transition-all"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-[color:var(--color-text-primary)]">
                {percentage}%
              </span>
            </div>
          </div>

          {/* Title and Subtitle */}
          <div className="flex-1">
            <h3 className="font-semibold text-[color:var(--color-text-primary)]">{title}</h3>
            <p className="text-sm text-[color:var(--color-text-muted)]">{subtitle}</p>
          </div>
        </div>

        {/* Segmented Bar */}
        <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-[color:var(--color-grey-bg)]">
          {genAiCount > 0 && (
            <div
              className="bg-[#16a34a]"
              style={{ width: `${(genAiCount / total) * 100}%` }}
            />
          )}
          {bothCount > 0 && (
            <div
              className="bg-[#3b82f6]"
              style={{ width: `${(bothCount / total) * 100}%` }}
            />
          )}
          {humanCount > 0 && (
            <div
              className="bg-[#9ca3af]"
              style={{ width: `${(humanCount / total) * 100}%` }}
            />
          )}
        </div>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[color:var(--color-bg-primary)] rounded-xl shadow-2xl max-w-2xl max-h-[80vh] overflow-hidden flex flex-col border border-white/10">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-[color:var(--color-bg-secondary)] to-[color:var(--color-bg-primary)]">
              <div>
                <h2 className="text-xl font-bold text-[color:var(--color-text-primary)]">{title}</h2>
                <p className="text-sm text-[color:var(--color-text-muted)] mt-1">{items.length} items</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-[color:var(--color-grey-bg)] rounded-lg transition-colors text-[color:var(--color-text-primary)]"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto flex-1 p-6 bg-[color:var(--color-bg-primary)]">
              <div className="space-y-4">
                {type === 'comparison' && (items as ComparisonPoint[]).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 p-4 rounded-lg bg-[color:var(--color-grey-bg)] hover:bg-white/5 transition-colors"
                  >
                    <span
                      className="inline-flex items-center px-3 py-2 rounded-md text-xs font-semibold flex-shrink-0 whitespace-nowrap"
                      style={{
                        backgroundColor:
                          item.mode === 'Gen AI'
                            ? '#22c55e'
                            : item.mode === 'Both'
                              ? '#3b82f6'
                              : '#9ca3af',
                        color: '#ffffff',
                      }}
                    >
                      {item.mode}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[color:var(--color-text-primary)] text-base">
                        {item.name}
                      </p>
                      <p className="text-sm text-[color:var(--color-text-muted)] mt-2 leading-relaxed">
                        Checked against: <span className="text-[color:var(--color-text-primary)] font-medium">{item.sources.join(', ')}</span>
                      </p>
                    </div>
                  </div>
                ))}

                {type === 'questionnaire' && (items as Checkpoint[]).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 p-4 rounded-lg bg-[color:var(--color-grey-bg)] hover:bg-white/5 transition-colors"
                  >
                    <span
                      className="inline-flex items-center px-3 py-2 rounded-md text-xs font-semibold flex-shrink-0 whitespace-nowrap"
                      style={{
                        backgroundColor:
                          item.mode === 'Gen AI'
                            ? '#22c55e'
                            : item.mode === 'Both'
                              ? '#3b82f6'
                              : '#9ca3af',
                        color: '#ffffff',
                      }}
                    >
                      {item.mode}
                    </span>
                    <p className="flex-1 text-base text-[color:var(--color-text-primary)] font-medium leading-relaxed">
                      {item.name}
                    </p>
                  </div>
                ))}

                {type === 'availability' && (items as AvailabilityItem[]).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 p-4 rounded-lg bg-[color:var(--color-grey-bg)] hover:bg-white/5 transition-colors"
                  >
                    <span
                      className="inline-flex items-center px-3 py-2 rounded-md text-xs font-semibold flex-shrink-0 whitespace-nowrap"
                      style={{
                        backgroundColor: item.mode === 'Gen AI' ? '#22c55e' : '#9ca3af',
                        color: '#ffffff',
                      }}
                    >
                      {item.mode}
                    </span>
                    <p className="flex-1 text-base text-[color:var(--color-text-primary)] font-medium leading-relaxed">
                      {item.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
