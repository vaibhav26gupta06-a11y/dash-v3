'use client'

import { TooltipProps } from 'recharts'

export function CustomTooltip(props: TooltipProps<number, string>) {
  const { active, payload } = props

  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] p-3 shadow-lg">
        <p className="text-xs font-medium text-[color:var(--color-text-primary)] mb-2">
          {payload[0]?.payload?.month || payload[0]?.payload?.quarter || 'Data'}
        </p>
        {payload.map((entry, index) => (
          <p
            key={index}
            className="text-xs"
            style={{ color: entry.color }}
          >
            {entry.name}: {entry.value}
            {entry.unit || ''}
          </p>
        ))}
      </div>
    )
  }

  return null
}
