'use client'

import {
  LayoutDashboard,
  Map,
  Users,
  ShieldCheck,
  Zap,
  TrendingUp,
  Activity,
  Rocket,
  FileText,
} from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  isCollapsed: boolean
}

const navItems = [
  { label: 'Programme Overview', icon: LayoutDashboard, id: 'overview' },
  { label: 'Automation Coverage', icon: Map, id: 'coverage' },
  { label: 'Adoption', icon: Users, id: 'adoption' },
  { label: 'Quality & Accuracy', icon: ShieldCheck, id: 'quality' },
  { label: 'Process Efficiency', icon: Zap, id: 'efficiency' },
  { label: 'Cost & Business', icon: TrendingUp, id: 'cost' },
  { label: 'Vendor & Ops Health', icon: Activity, id: 'vendor' },
  { label: 'Readiness & Pipeline', icon: Rocket, id: 'readiness' },
]

export function Sidebar({ activeTab, onTabChange, isCollapsed }: SidebarProps) {
  return (
    <TooltipProvider>
      <aside
        className={`fixed left-0 top-0 h-screen bg-[color:var(--color-bg-sidebar)] border-r border-[color:var(--color-bg-sidebar-active)] transition-all duration-300 z-50 ${
          isCollapsed ? 'w-16' : 'w-60'
        }`}
      >
        {/* Top Section - Logo */}
        <div
          className={`flex items-start gap-3 p-6 border-b border-[color:var(--color-bg-sidebar-active)] ${
            isCollapsed ? 'px-3' : ''
          }`}
        >
          <FileText
            size={20}
            className="text-[color:var(--color-blue)] flex-shrink-0 mt-0.5"
          />
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white">DI Command Centre</span>
              <span className="text-xs text-[color:var(--color-grey)]">Tata Capital</span>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id

            const navButton = (
              <button
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative ${
                  isActive
                    ? 'bg-[color:var(--color-bg-sidebar-active)]'
                    : 'hover:bg-[color:var(--color-bg-sidebar-hover)]'
                }`}
                aria-current={isActive ? 'page' : undefined}
                aria-label={`${item.label} ${isActive ? '(current)' : ''}`}
              >
                {isActive && !isCollapsed && (
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[color:var(--color-blue)] rounded-r" />
                )}
                <Icon
                  size={18}
                  className={`flex-shrink-0 ${
                    isActive
                      ? 'text-[color:var(--color-blue)]'
                      : 'text-[color:var(--color-grey)]'
                  }`}
                />
                {!isCollapsed && (
                  <span
                    className={`text-sm ${
                      isActive
                        ? 'text-white font-medium'
                        : 'text-[color:var(--color-text-sidebar)]'
                    }`}
                  >
                    {item.label}
                  </span>
                )}
              </button>
            )

            if (isCollapsed) {
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>{navButton}</TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              )
            }

            return <div key={item.id}>{navButton}</div>
          })}
        </nav>

        {/* Bottom Section - Status */}
        <div className={`p-4 border-t border-[color:var(--color-bg-sidebar-active)]`}>
          {!isCollapsed && (
            <>
              <p className="text-xs text-[color:var(--color-text-primary)] mb-1">
                Last updated
              </p>
              <p className="text-xs text-[color:var(--color-grey)] mb-3">
                15 Jun 2025, 09:42 AM
              </p>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-green)]" />
                <span className="text-xs text-[color:var(--color-grey)]">
                  All systems operational
                </span>
              </div>
            </>
          )}
        </div>
      </aside>
    </TooltipProvider>
  )
}
