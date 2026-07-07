'use client'

import { Bell, Download } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/toast-provider'
import { notifications } from '@/lib/data'

interface TopBarProps {
  activeTab: string
  dateRange: string
  onDateRangeChange: (range: string) => void
  productFilter: string
  onProductFilterChange: (filter: string) => void
  isCollapsed: boolean
}

const tabNames: Record<string, string> = {
  overview: 'Programme Overview',
  coverage: 'Automation Coverage',
  adoption: 'Adoption',
  quality: 'Quality & Accuracy',
  efficiency: 'Process Efficiency',
  cost: 'Cost & Business',
  vendor: 'Vendor & Ops Health',
  readiness: 'Readiness & Pipeline',
}

export function TopBar({
  activeTab,
  dateRange,
  onDateRangeChange,
  productFilter,
  onProductFilterChange,
  isCollapsed,
}: TopBarProps) {
  const { toast } = useToast()

  const handleExport = () => {
    toast({
      title: 'Export started',
      description: 'Your file will download shortly',
    })
  }

  const severityColors: Record<string, string> = {
    critical: 'bg-[color:var(--color-red-bg)]',
    warning: 'bg-[color:var(--color-amber-bg)]',
    info: 'bg-[color:var(--color-blue-bg)]',
  }

  const severityDots: Record<string, string> = {
    critical: 'bg-[color:var(--color-red)]',
    warning: 'bg-[color:var(--color-amber)]',
    info: 'bg-[color:var(--color-blue)]',
  }

  return (
    <header
      className={`fixed top-0 right-0 bg-white border-b border-[color:var(--color-border)] h-16 transition-all duration-300 z-40 ${
        isCollapsed ? 'left-16' : 'left-60'
      }`}
    >
      <div className="h-full px-8 flex items-center justify-between">
        {/* Left Side - Title and Breadcrumb */}
        <div className="flex-1">
          <h1 className="text-xl font-bold text-[color:var(--color-text-primary)]">
            {tabNames[activeTab]}
          </h1>
          <p className="text-xs text-[color:var(--color-grey)] mt-0.5">
            DI Command Centre / {tabNames[activeTab]}
          </p>
        </div>

        {/* Right Side - Filters and Controls */}
        <div className="flex items-center gap-4">
          {/* Date Range Filter */}
          <Select value={dateRange} onValueChange={onDateRangeChange}>
            <SelectTrigger className="w-40 h-9 text-sm border-[color:var(--color-border)]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Last 30 Days">Last 30 Days</SelectItem>
              <SelectItem value="Last Quarter">Last Quarter</SelectItem>
              <SelectItem value="Last 6 Months">Last 6 Months</SelectItem>
              <SelectItem value="All Time">All Time</SelectItem>
            </SelectContent>
          </Select>

          {/* Product Filter */}
          <Select value={productFilter} onValueChange={onProductFilterChange}>
            <SelectTrigger className="w-48 h-9 text-sm border-[color:var(--color-border)]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Products">All Products</SelectItem>
              <SelectGroup>
                <SelectLabel className="text-xs font-semibold text-[#64748b] uppercase">Loan Products (10)</SelectLabel>
                <SelectItem value="Personal Loan (PL)">Personal Loan (PL)</SelectItem>
                <SelectItem value="Home Loan (HL)">Home Loan (HL)</SelectItem>
                <SelectItem value="Used Car Loan (UCL)">Used Car Loan (UCL)</SelectItem>
                <SelectItem value="New Car Loan (NCL)">New Car Loan (NCL)</SelectItem>
                <SelectItem value="Business Loan (BL)">Business Loan (BL)</SelectItem>
                <SelectItem value="LAP">LAP</SelectItem>
                <SelectItem value="Easy Loan (EL)">Easy Loan (EL)</SelectItem>
                <SelectItem value="Two Wheeler Loan (TWL)">Two Wheeler Loan (TWL)</SelectItem>
                <SelectItem value="Loan Against Securities (LAS)">Loan Against Securities (LAS)</SelectItem>
                <SelectItem value="Credit Enabled Quote (CEQ)">Credit Enabled Quote (CEQ)</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel className="text-xs font-semibold text-[#64748b] uppercase">Support Functions (6)</SelectLabel>
                <SelectItem value="Legal (Retail)">Legal (Retail)</SelectItem>
                <SelectItem value="Legal (Corporate)">Legal (Corporate)</SelectItem>
                <SelectItem value="Legal (Litigation)">Legal (Litigation)</SelectItem>
                <SelectItem value="Risk">Risk</SelectItem>
                <SelectItem value="Treasury">Treasury</SelectItem>
                <SelectItem value="Credit (Compliance)">Credit (Compliance)</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Divider */}
          <div className="w-px h-6 bg-[color:var(--color-border)]" />

          {/* Notification Bell */}
          <Popover>
            <PopoverTrigger className="relative p-2 hover:bg-[color:var(--color-grey-bg)] rounded-md transition-colors data-[state=open]:bg-[color:var(--color-grey-bg)]" aria-label={`Notifications, ${notifications.length} unread`}>
              <Bell size={20} className="text-[color:var(--color-text-primary)]" />
              {notifications.length > 0 && (
                <Badge
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs font-bold bg-[color:var(--color-red)] text-white"
                >
                  {notifications.length}
                </Badge>
              )}
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0" role="dialog" aria-modal="true" aria-label="Notifications panel">
              <div className="border-b border-[color:var(--color-border)] p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[color:var(--color-text-primary)]" id="notifications-title">
                    Notifications
                  </h3>
                  <Badge className="bg-[color:var(--color-blue)] text-white text-xs">
                    {notifications.length} new
                  </Badge>
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notif, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-3 p-3 border-b border-[color:var(--color-border)] hover:bg-[color:var(--color-grey-bg)] transition-colors ${
                      severityColors[notif.severity]
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${
                        severityDots[notif.severity]
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[color:var(--color-text-primary)] line-clamp-2">
                        {notif.message}
                      </p>
                      <p className="text-xs text-[color:var(--color-grey)] mt-1">
                        {notif.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Export Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="text-xs border-[color:var(--color-border)] text-[color:var(--color-text-primary)] hover:bg-[color:var(--color-grey-bg)]"
          >
            <Download size={16} className="mr-2" />
            Export Tab
          </Button>
        </div>
      </div>
    </header>
  )
}
