'use client'

import { useState } from 'react'
import { TrainedDocument } from '@/lib/document-trained-data'
import { X } from 'lucide-react'

interface DocumentTrainedCardProps {
  categoryName: string
  documents: TrainedDocument[]
}

export function DocumentTrainedCard({ categoryName, documents }: DocumentTrainedCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  const trainedCount = documents.filter(doc => doc.trained === 'Y').length
  const totalCount = documents.length
  const trainedPercentage = Math.round((trainedCount / totalCount) * 100)

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return { ring: '#16a34a', label: 'text-[#16a34a]' }
    if (percentage >= 50) return { ring: '#3b82f6', label: 'text-[#3b82f6]' }
    return { ring: '#f59e0b', label: 'text-[#f59e0b]' }
  }

  const colors = getProgressColor(trainedPercentage)

  // Calculate segment sizes
  const segmentSize = 100 / totalCount

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] p-6 hover:bg-[color:var(--color-grey-bg)] transition-colors text-left"
      >
        <div className="flex items-start gap-4 mb-4">
          {/* Circular Progress Ring */}
          <div className="relative flex-shrink-0 w-16 h-16">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
              {/* Background circle */}
              <circle cx="32" cy="32" r="28" fill="none" stroke="#e5e7eb" strokeWidth="4" />
              {/* Progress circle */}
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke={colors.ring}
                strokeWidth="4"
                strokeDasharray={`${2 * Math.PI * 28 * (trainedPercentage / 100)} ${2 * Math.PI * 28}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-sm font-bold ${colors.label}`}>{trainedPercentage}%</span>
            </div>
          </div>

          {/* Title and Subtitle */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[color:var(--color-text-primary)] text-base leading-tight">
              {categoryName}
            </h3>
            <p className="text-sm text-[color:var(--color-text-muted)] mt-1">
              {trainedCount} of {totalCount} trained
            </p>
          </div>
        </div>

        {/* Segmented Bar */}
        <div className="flex h-1 rounded-full overflow-hidden gap-px bg-[color:var(--color-border)]">
          {documents.map((doc, idx) => (
            <div
              key={idx}
              className={`flex-1 ${doc.trained === 'Y' ? 'bg-[#16a34a]' : 'bg-[#d1d5db]'}`}
              style={{ flex: `0 0 calc(${segmentSize}% - 1px)` }}
            />
          ))}
        </div>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[color:var(--color-bg-primary)] rounded-xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col border border-white/10">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-[#1e40af] to-[#1e3a8a]">
              <div>
                <h2 className="text-2xl font-bold text-white">{categoryName}</h2>
                <p className="text-base text-white/80 mt-2 font-medium">
                  {trainedPercentage}% trained · {trainedCount} of {totalCount} document types
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content - Table */}
            <div className="overflow-auto flex-1 p-6 bg-[color:var(--color-bg-primary)]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-[color:var(--color-border)] sticky top-0 bg-[color:var(--color-grey-bg)]">
                    <th className="text-left py-4 px-4 font-bold text-[color:var(--color-text-primary)] text-base">
                      Document Type
                    </th>
                    <th className="text-left py-4 px-4 font-bold text-[color:var(--color-text-primary)] text-base">
                      Sub-category
                    </th>
                    <th className="text-center py-4 px-4 font-bold text-[color:var(--color-text-primary)] text-base">
                      Physical/Digital
                    </th>
                    <th className="text-center py-4 px-4 font-bold text-[color:var(--color-text-primary)] text-base">
                      Format
                    </th>
                    <th className="text-center py-4 px-4 font-bold text-[color:var(--color-text-primary)] text-base">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc, idx) => (
                    <tr
                      key={idx}
                      className={`border-b border-[color:var(--color-border)] hover:bg-[#f0f4f8] transition-colors ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-[#f8f9fa]'
                      }`}
                    >
                      <td className="py-4 px-4 text-[color:var(--color-text-primary)] font-semibold">
                        {doc.type}
                      </td>
                      <td className="py-4 px-4 text-[color:var(--color-text-primary)]">
                        {doc.subCategory || '—'}
                      </td>
                      <td className="py-4 px-4 text-center text-[color:var(--color-text-primary)] font-medium">
                        {doc.mode || '—'}
                      </td>
                      <td className="py-4 px-4 text-center text-[color:var(--color-text-primary)] font-medium">
                        {doc.format || '—'}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {doc.trained === 'Y' ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#22c55e] text-white shadow-sm">
                            Trained
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#9ca3af] text-white shadow-sm">
                            Not trained
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
