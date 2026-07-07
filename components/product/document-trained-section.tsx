'use client'

import { DOCUMENT_TRAINED_CATEGORIES } from '@/lib/document-trained-data'
import { DocumentTrainedCard } from './document-trained-card'

export function DocumentTrainedSection() {
  return (
    <div>
      <h3 className="text-lg font-semibold text-[color:var(--color-text-primary)] mb-4">Document Trained</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" style={{ gridAutoRows: 'auto', gridAutoColumns: '1fr' }}>
        {DOCUMENT_TRAINED_CATEGORIES.map(category => (
          <DocumentTrainedCard
            key={category.name}
            categoryName={category.name}
            documents={category.documents}
          />
        ))}
      </div>
    </div>
  )
}
