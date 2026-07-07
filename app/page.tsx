'use client'

import { useState, useEffect } from 'react'
import { BarChart2 } from 'lucide-react'
import { Sidebar } from '@/components/sidebar'
import { TopBar } from '@/components/top-bar'
import { OverviewTab } from '@/components/tabs/overview-tab'
import { CoverageTab } from '@/components/tabs/coverage-tab'
import { AdoptionTab } from '@/components/tabs/adoption-tab'
import { QualityTab } from '@/components/tabs/quality-tab'
import { EfficiencyTab } from '@/components/tabs/efficiency-tab'
import { CostTab } from '@/components/tabs/cost-tab'
import { VendorTab } from '@/components/tabs/vendor-tab'
import { ReadinessTab } from '@/components/tabs/readiness-tab'

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

const tabIcons: Record<string, JSX.Element> = {
  overview: <BarChart2 size={48} className="text-[color:var(--color-text-muted)]" />,
  coverage: <BarChart2 size={48} className="text-[color:var(--color-text-muted)]" />,
  adoption: <BarChart2 size={48} className="text-[color:var(--color-text-muted)]" />,
  quality: <BarChart2 size={48} className="text-[color:var(--color-text-muted)]" />,
  efficiency: <BarChart2 size={48} className="text-[color:var(--color-text-muted)]" />,
  cost: <BarChart2 size={48} className="text-[color:var(--color-text-muted)]" />,
  vendor: <BarChart2 size={48} className="text-[color:var(--color-text-muted)]" />,
  readiness: <BarChart2 size={48} className="text-[color:var(--color-text-muted)]" />,
}

export default function Page() {
  const [activeTab, setActiveTab] = useState('overview')
  const [dateRange, setDateRange] = useState('Last Quarter')
  const [productFilter, setProductFilter] = useState('All Products')
  const [isLoading, setIsLoading] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Handle responsive sidebar collapse - only after hydration
  useEffect(() => {
    setIsMounted(true)

    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 1280)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Handle tab changes with loading state
  const handleTabChange = (tabId: string) => {
    if (tabId !== activeTab) {
      setIsLoading(true)
      setActiveTab(tabId)
      setTimeout(() => setIsLoading(false), 400)
    }
  }

  return (
    <div className="min-h-screen bg-[color:var(--color-bg-base)]">
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} isCollapsed={isMounted && isCollapsed} />
      <TopBar
        activeTab={activeTab}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        productFilter={productFilter}
        onProductFilterChange={setProductFilter}
        isCollapsed={isMounted && isCollapsed}
      />

      {/* Main Content Area */}
      <main
        className={`transition-all duration-300 min-h-screen bg-[color:var(--color-bg-base)] pt-16 ${
          isMounted && isCollapsed ? 'ml-16' : 'ml-60'
        } xl:ml-60 lg:ml-16 md:ml-16`}
        role="main"
        aria-label={`${tabNames[activeTab]} Dashboard`}
      >
        <div className="p-8">
          {isLoading ? (
            // Loading Skeleton State
            <div className="space-y-8 animate-in fade-in duration-500">
              {/* KPI Row Skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={`kpi-${i}`}
                    className="h-28 bg-gradient-to-br from-[color:var(--color-grey-bg)] to-[color:var(--color-border)] rounded-xl animate-pulse"
                  />
                ))}
              </div>

              {/* Chart Skeletons */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div
                    key={`chart-${i}`}
                    className="h-72 bg-gradient-to-br from-[color:var(--color-grey-bg)] to-[color:var(--color-border)] rounded-xl animate-pulse flex items-center justify-center"
                  >
                    <BarChart2 size={32} className="text-[color:var(--color-border)]" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Tab Content
            <div className="animate-in fade-in duration-300">
              {activeTab === 'overview' && <OverviewTab dateRange={dateRange} productFilter={productFilter} />}
              {activeTab === 'coverage' && <CoverageTab dateRange={dateRange} productFilter={productFilter} />}
              {activeTab === 'adoption' && <AdoptionTab dateRange={dateRange} productFilter={productFilter} />}
              {activeTab === 'quality' && <QualityTab dateRange={dateRange} productFilter={productFilter} />}
              {activeTab === 'efficiency' && <EfficiencyTab dateRange={dateRange} productFilter={productFilter} />}
              {activeTab === 'cost' && <CostTab dateRange={dateRange} productFilter={productFilter} />}
              {activeTab === 'vendor' && <VendorTab dateRange={dateRange} productFilter={productFilter} />}
              {activeTab === 'readiness' && <ReadinessTab dateRange={dateRange} productFilter={productFilter} />}
              {!['overview', 'coverage', 'adoption', 'quality', 'efficiency', 'cost', 'vendor', 'readiness'].includes(activeTab) && (
                // Placeholder for remaining tabs
                <div className="flex flex-col items-center justify-center py-20">
                  {tabIcons[activeTab]}
                  <h2 className="text-lg font-semibold text-[color:var(--color-text-secondary)] mt-6">
                    {tabNames[activeTab]}
                  </h2>
                  <p className="text-sm text-[color:var(--color-text-muted)] mt-2">
                    Content coming soon
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
