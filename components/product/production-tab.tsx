'use client'

import { ProductDetailData } from '@/lib/product-detail-data'
import { CoverageSection } from './coverage-section'
import { AccuracySectionComponent } from './accuracy-section'
import { DocumentTrainedSection } from './document-trained-section'
import { AdoptionSection } from './adoption-section'

interface ProductionTabProps {
  data: ProductDetailData['production']
  productName?: string
}

export function ProductionTab({ data, productName = 'Personal Loan (PL)' }: ProductionTabProps) {
  return (
    <div className="space-y-6">
      {/* Coverage Section with New Grid Layout */}
      <div>
        <h3 className="text-lg font-semibold text-[color:var(--color-text-primary)] mb-4">Coverage</h3>
        <CoverageSection categories={data.coverage.categories} />
      </div>

      {/* Adoption Section */}
      <AdoptionSection productName={productName} />

      {/* Accuracy Section */}
      <AccuracySectionComponent accuracy={data.accuracy} />

      {/* Document Trained Section */}
      <DocumentTrainedSection />
    </div>
  )
}
