'use client'

import { Download } from 'lucide-react'
import { useToast } from '@/components/toast-provider'

interface ChartCardProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  className?: string
  onExport?: () => void
}

export function ChartCard({
  title,
  subtitle,
  children,
  className = '',
  onExport,
}: ChartCardProps) {
  const { toast } = useToast()

  const handleChartExport = () => {
    toast({
      title: 'Export started',
      description: `Exporting "${title}" — your file will download shortly`,
      duration: 3000,
    })
    onExport?.()
  }

  return (
    <div
      className={`rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}
    >
      <div className="flex items-start justify-between px-5 pt-5 pb-0">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-[color:var(--color-text-primary)]">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-[color:var(--color-text-muted)] mt-0.5">{subtitle}</p>
          )}
        </div>
        {onExport && (
          <button
            onClick={handleChartExport}
            className="p-1.5 rounded hover:bg-[color:var(--color-grey-bg)] transition-colors duration-150 ml-2"
            aria-label={`Export ${title}`}
          >
            <Download size={16} className="text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text-secondary)]" />
          </button>
        )}
      </div>
      <div className="p-5 w-full overflow-x-auto">{children}</div>
    </div>
  )
}
