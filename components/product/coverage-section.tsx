'use client'

import { useState } from 'react'
import { CheckpointCategory } from '@/lib/product-detail-data'
import { CheckpointModal } from './checkpoint-modal'

interface CoverageSectionProps {
  categories: CheckpointCategory[]
}

export function CoverageSection({ categories }: CoverageSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<CheckpointCategory | null>(null)

  const getModeScore = (mode: string): number => {
    if (mode === 'Gen AI') return 1
    if (mode === 'Both') return 0.5
    return 0 // Human
  }

  const calculateAutomationPercentage = (category: CheckpointCategory): number => {
    const scores = category.checkpoints.map(cp => getModeScore(cp.mode))
    const average = scores.reduce((a, b) => a + b, 0) / category.checkpoints.length
    return Math.round(average * 100)
  }

  const getRingColor = (percentage: number): string => {
    if (percentage >= 80) return '#16a34a' // green
    if (percentage >= 50) return '#3b82f6' // blue
    return '#f59e0b' // amber
  }

  const getModeColor = (mode: string): string => {
    switch (mode) {
      case 'Gen AI':
        return '#16a34a' // green
      case 'Both':
        return '#3b82f6' // blue
      case 'Human':
        return '#d1d5db' // gray
      default:
        return '#e5e7eb'
    }
  }

  return (
    <>
      {/* Coverage Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-max">
        {categories.map((category, idx) => {
          const automationPercentage = calculateAutomationPercentage(category)
          const ringColor = getRingColor(automationPercentage)

          return (
            <button
              key={idx}
              onClick={() => setSelectedCategory(category)}
              className="text-left rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] p-4 hover:border-[color:var(--color-border)] hover:shadow-md transition-shadow"
            >
              {/* Header with Ring and Title */}
              <div className="flex items-start gap-3 mb-3">
                {/* Circular Progress Ring */}
                <div className="relative w-16 h-16 flex-shrink-0">
                  <svg className="w-full h-full" viewBox="0 0 60 60">
                    {/* Background circle */}
                    <circle
                      cx="30"
                      cy="30"
                      r="26"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-[color:var(--color-grey-bg)]"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="30"
                      cy="30"
                      r="26"
                      fill="none"
                      stroke={ringColor}
                      strokeWidth="2"
                      strokeDasharray={`${(automationPercentage / 100) * (2 * Math.PI * 26)} ${2 * Math.PI * 26}`}
                      strokeLinecap="round"
                      className="transition-all"
                      style={{ transformOrigin: '50% 50%', transform: 'rotate(-90deg)' }}
                    />
                    {/* Percentage text */}
                    <text
                      x="30"
                      y="30"
                      textAnchor="middle"
                      dy="0.3em"
                      className="text-[10px] font-bold"
                      fill={ringColor}
                    >
                      {automationPercentage}%
                    </text>
                  </svg>
                </div>

                {/* Title and Subtitle */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-[color:var(--color-text-primary)] truncate">
                    {category.name}
                  </h3>
                  <p className="text-xs text-[color:var(--color-text-secondary)] mt-1">
                    {category.checkpoints.length} checkpoints
                  </p>
                </div>
              </div>

              {/* Segmented Bar */}
              <div className="flex gap-0.5 h-2 rounded-full overflow-hidden bg-[color:var(--color-grey-bg)]">
                {category.checkpoints.map((checkpoint, i) => (
                  <div
                    key={i}
                    className="flex-1"
                    style={{
                      backgroundColor: getModeColor(checkpoint.mode),
                      width: `${100 / category.checkpoints.length}%`,
                    }}
                  />
                ))}
              </div>
            </button>
          )
        })}
      </div>

      {/* Modal */}
      {selectedCategory && (
        <CheckpointModal
          category={selectedCategory}
          isOpen={!!selectedCategory}
          onClose={() => setSelectedCategory(null)}
        />
      )}
    </>
  )
}
