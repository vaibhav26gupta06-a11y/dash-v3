'use client'

interface StatusBadgeProps {
  status: 'on-target' | 'watch' | 'at-risk' | 'on-time' | 'delayed' | 'in-progress'
  label: string
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const getStyles = () => {
    switch (status) {
      case 'on-target':
      case 'on-time':
        return 'bg-[color:var(--color-green-bg)] text-[color:var(--color-green-text)]'
      case 'watch':
      case 'in-progress':
        return 'bg-[color:var(--color-amber-bg)] text-[color:var(--color-amber-text)]'
      case 'at-risk':
      case 'delayed':
        return 'bg-[color:var(--color-red-bg)] text-[color:var(--color-red-text)]'
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${getStyles()}`}
    >
      {label}
    </span>
  )
}
