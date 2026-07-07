import { Calendar, Clock, Info } from 'lucide-react'

interface EmptyCellProps {
  reason: 'not-deployed' | 'planned-q3' | 'planned-q4' | 'backlog' | 'no-data'
}

export function EmptyCell({ reason }: EmptyCellProps) {
  const configs = {
    'not-deployed': { text: '—', icon: null },
    'planned-q3': { text: 'Planned Q3', icon: Calendar },
    'planned-q4': { text: 'Planned Q4', icon: Calendar },
    backlog: { text: 'Backlog', icon: Clock },
    'no-data': { text: 'No data', icon: Info },
  }

  const config = configs[reason]
  const Icon = config.icon

  return (
    <div className="flex items-center justify-center h-full min-h-10 bg-[color:var(--color-grey-bg)]">
      <div className="flex items-center gap-1.5 text-center">
        {Icon && <Icon size={12} className="text-[color:var(--color-text-muted)]" />}
        <span className="text-12px text-[color:var(--color-text-muted)]">{config.text}</span>
      </div>
    </div>
  )
}
