'use client'

import { AccuracySection } from '@/lib/product-detail-data'
import { AccuracyCard } from './accuracy-card'

interface AccuracySectionProps {
  accuracy: AccuracySection
}

export function AccuracySectionComponent({ accuracy }: AccuracySectionProps) {
  const getSubtitle = (section: string, count: number): string => {
    if (section === 'comparison') return `${count} points cross-checked`
    if (section === 'questionnaire') return `${count} questions covered`
    return `${count} documents checked`
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[color:var(--color-text-primary)]">Accuracy</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AccuracyCard
          title="Comparison"
          subtitle={getSubtitle('comparison', accuracy.comparison.length)}
          items={accuracy.comparison}
          type="comparison"
        />
        
        <AccuracyCard
          title="Questionnaire"
          subtitle={getSubtitle('questionnaire', accuracy.questionnaire.length)}
          items={accuracy.questionnaire}
          type="questionnaire"
        />
        
        <AccuracyCard
          title="Availability"
          subtitle={getSubtitle('availability', accuracy.availability.length)}
          items={accuracy.availability}
          type="availability"
        />
      </div>
    </div>
  )
}
