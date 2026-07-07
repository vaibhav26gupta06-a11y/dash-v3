'use client'

interface SectionHeadingProps {
  title: string
  subtitle?: string
}

export function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-[color:var(--color-text-primary)] mb-1">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm text-[color:var(--color-text-muted)]">{subtitle}</p>
      )}
    </div>
  )
}
