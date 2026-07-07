'use client'

import { HelpCircle, TrendingUp, TrendingDown } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useCountUp } from '@/lib/useCountUp'

interface KPICardProps {
  label: string
  value: number
  unit: string
  target?: number
  delta?: number
  deltaLabel?: string
  status: 'on-target' | 'watch' | 'at-risk'
  helpText?: string
  subText?: string
}

export function KPICard({
  label,
  value,
  unit,
  target,
  delta,
  deltaLabel,
  status,
  helpText,
  subText,
}: KPICardProps) {
  const animatedValue = useCountUp(value, 800)
  const getStatusColor = () => {
    switch (status) {
      case 'on-target':
        return 'bg-[color:var(--color-green-bg)] border-[color:var(--color-green)]'
      case 'watch':
        return 'bg-[color:var(--color-amber-bg)] border-[color:var(--color-amber)]'
      case 'at-risk':
        return 'bg-[color:var(--color-red-bg)] border-[color:var(--color-red)]'
    }
  }

  const getStatusTextColor = () => {
    switch (status) {
      case 'on-target':
        return 'text-[color:var(--color-green-text)]'
      case 'watch':
        return 'text-[color:var(--color-amber-text)]'
      case 'at-risk':
        return 'text-[color:var(--color-red-text)]'
    }
  }

  const getDeltaColor = () => {
    return delta && delta >= 0
      ? 'text-[color:var(--color-green-text)]'
      : 'text-[color:var(--color-red-text)]'
  }

  return (
    <div
      className={`rounded-xl border-2 p-5 bg-[color:var(--color-bg-card)] shadow-sm hover:shadow-md border-[color:var(--color-border)] hover:border-[color:var(--color-border-strong)] transition-all duration-150 ${getStatusColor()}`}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-medium text-[color:var(--color-text-primary)]">
          {label}
        </h3>
        {helpText && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle size={16} className="text-[color:var(--color-text-muted)] cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-xs">
                {helpText}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <div className="mb-3">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-[color:var(--color-text-primary)]">
            {animatedValue.toFixed(value % 1 === 0 ? 0 : 1)}
          </span>
          <span className="text-sm text-[color:var(--color-text-secondary)]">{unit}</span>
        </div>
        {subText && (
          <p className="text-xs text-[color:var(--color-text-muted)] mt-1">{subText}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          {target && (
            <p className="text-xs text-[color:var(--color-text-muted)]">
              Target: {target}
              {unit}
            </p>
          )}
          {delta !== undefined && deltaLabel && (
            <div className={`flex items-center gap-1 text-xs font-medium ${getDeltaColor()}`}>
              {delta >= 0 ? (
                <TrendingUp size={12} />
              ) : (
                <TrendingDown size={12} />
              )}
              {delta >= 0 ? '+' : ''}{delta}
              {unit} {deltaLabel}
            </div>
          )}
        </div>
        <div className={`text-xs font-semibold px-2 py-1 rounded ${getStatusTextColor()}`}>
          {status === 'on-target'
            ? 'On Target'
            : status === 'watch'
              ? 'Watch'
              : 'At Risk'}
        </div>
      </div>
    </div>
  )
}
