'use client'

import { DeployStatus } from '@/lib/data'

interface DeployStatusChipProps {
  status: DeployStatus
}

export function DeployStatusChip({ status }: DeployStatusChipProps) {
  const getDot = () => {
    switch (status) {
      case 'live':
        return (
          <div className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
        )
      case 'uat':
        return (
          <div className="w-1.5 h-1.5 rounded-full bg-[#2563eb] animate-pulse" />
        )
      case 'wip':
        return (
          <div className="w-1.5 h-1.5 rounded-full bg-[#d97706] animate-pulse" />
        )
      case 'underdiscussion':
        return (
          <div className="w-1.5 h-1.5 rounded-full border border-[#94a3b8]" />
        )
      default:
        return null
    }
  }

  const getStyles = () => {
    switch (status) {
      case 'live':
        return 'bg-[#f0fdf4] text-[#15803d]'
      case 'uat':
        return 'bg-[#eff6ff] text-[#1d4ed8]'
      case 'wip':
        return 'bg-[#fffbeb] text-[#b45309]'
      case 'underdiscussion':
        return 'bg-[#faf5ff] text-[#7e22ce]'
      case 'not-planned':
        return 'bg-transparent text-[#e2e8f0]'
      case 'na':
        return 'bg-transparent text-[#e2e8f0]'
    }
  }

  const getLabel = () => {
    switch (status) {
      case 'live':
        return 'Live'
      case 'uat':
        return 'UAT'
      case 'wip':
        return 'WIP'
      case 'underdiscussion':
        return 'Under Discussion'
      case 'not-planned':
        return 'Not Planned'
      case 'na':
        return '—'
    }
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStyles()}`}
    >
      {getDot()}
      {getLabel()}
    </span>
  )
}
