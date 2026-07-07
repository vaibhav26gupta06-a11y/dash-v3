'use client'

import { useState, useMemo } from 'react'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, ReferenceLine,
} from 'recharts'
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { filterByDateRange } from '@/lib/filterData'
import { KPICard } from '@/components/kpi-card'
import { SectionHeading } from '@/components/section-heading'
import { ChartCard } from '@/components/chart-card'
import { CustomTooltip } from '@/components/custom-tooltip'
import { StatusBadge } from '@/components/status-badge'
import {
  adoptionByProduct, adoptionByStage, overrideByStage, overrideHeatmap, featureAdoption, adoptionTrend,
} from '@/lib/data'

interface AdoptionTabProps {
  dateRange: string
  productFilter: string
}

export function AdoptionTab({ dateRange, productFilter }: AdoptionTabProps) {
  const filteredTrend = useMemo(() => filterByDateRange(adoptionTrend, dateRange), [dateRange])
  const [hoveredCell, setHoveredCell] = useState<string | null>(null)

  const getOverrideReasons: Record<string, string> = {
    'HL×Property Document': 'Format varies by empanelled valuer',
    'UCL×RC Book': 'Older vehicles have non-standard RC formats',
    'HL×Valuation Report': 'External report layout inconsistent',
    'UCL×Bank Statement': 'Multi-bank statements cause extraction mismatch',
  }

  const getCellColor = (value: number | null) => {
    if (value === null) return 'bg-[color:var(--color-grey-bg)] text-[color:var(--color-text-muted)]'
    if (value < 10) return 'bg-[color:var(--color-green-bg)] text-[color:var(--color-green-text)]'
    if (value <= 20) return 'bg-[color:var(--color-amber-bg)] text-[color:var(--color-amber-text)]'
    return 'bg-[color:var(--color-red-bg)] text-[color:var(--color-red-text)]'
  }

  return (
    <div className="space-y-8">
      {/* Section A: Adoption Summary KPIs */}
      <div>
        <SectionHeading title="Adoption Summary" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            label="Overall Adoption Rate"
            value={71}
            unit="%"
            target="80%"
            delta="+16%"
            deltaLabel="vs last quarter"
            status="watch"
            helpText="% of eligible users who triggered ≥1 DI action in the last 30 days, segmented by role and stage."
          />
          <KPICard
            label="Override / Bypass Rate"
            value={18}
            unit="%"
            target="<10%"
            delta="+4%"
            deltaLabel="this month (rising)"
            status="at-risk"
            helpText="% of DI outputs where a user manually overrode the AI result. High override = low model trust or low accuracy."
          />
          <KPICard
            label="Feature Usage Rate"
            value={58}
            unit="%"
            target="75%"
            delta="-2%"
            deltaLabel="vs last month"
            status="at-risk"
            helpText="Average adoption across all 6 DI features. Users may be adopting the tool but ignoring advanced features."
          />
          {/* Card 4: Custom info card */}
          <div className="bg-[color:var(--color-bg-card)] border-l-4 border-[color:var(--color-red)] rounded-lg p-4">
            <p className="text-xs font-semibold text-[color:var(--color-text-muted)] uppercase mb-2">Lowest Adoption</p>
            <p className="text-2xl font-bold text-[color:var(--color-text-primary)] mb-1">Nagpur West</p>
            <p className="text-sm font-semibold text-[color:var(--color-red-text)] mb-3">31% adoption rate</p>
            <p className="text-xs text-[color:var(--color-amber-text)] font-medium">Action: Training scheduled 20 Jun</p>
          </div>
        </div>
      </div>

      {/* Note about WIP/Under Discussion products */}
      <div className="bg-[#faf5ff] border border-[#e9d5ff] rounded-lg p-4">
        <p className="text-xs text-[#6b21a8]">
          <span className="font-semibold">Note:</span> Products in WIP or Under Discussion stages (BL, LAP, EL, TWL, LAS, CEQ) have no adoption data yet. Adoption metrics above reflect only live and UAT stages.
        </p>
      </div>

      {/* Section B: Adoption Breakdown Charts */}
      <div>
        <SectionHeading title="Adoption Breakdown" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* By Product */}
          <ChartCard title="By Product Line" height={220}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart layout="vertical" data={adoptionByProduct} margin={{ top: 5, right: 20, left: 100, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis type="number" domain={[0, 100]} label={{ value: '%', position: 'right', offset: 10 }} />
                <YAxis type="category" dataKey="name" width={95} tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" barSize={20} radius={[0, 4, 4, 0]}>
                  {adoptionByProduct.map((entry, index) => {
                    let color = 'var(--color-red)'
                    if (entry.value >= 80) color = 'var(--color-green)'
                    else if (entry.value >= 60) color = 'var(--color-amber)'
                    const opacity = productFilter === 'All Products' || entry.name === productFilter ? 1 : 0.35
                    return <Cell key={`cell-${index}`} fill={color} fillOpacity={opacity} />
                  })}
                </Bar>
                <ReferenceLine x={80} stroke="var(--color-grey)" strokeDasharray="4 4" label={{ value: 'Target 80%', fontSize: 10, fill: 'var(--color-grey)', position: 'top' }} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* By Stage */}
          <ChartCard title="By Stage" height={220}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart layout="vertical" data={adoptionByStage} margin={{ top: 5, right: 20, left: 70, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis type="number" domain={[0, 100]} label={{ value: '%', position: 'right', offset: 10 }} />
                <YAxis type="category" dataKey="stage" width={65} tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" barSize={20} radius={[0, 4, 4, 0]}>
                  {adoptionByStage.map((entry, index) => {
                    let color = 'var(--color-red)'
                    if (entry.value >= 80) color = 'var(--color-green)'
                    else if (entry.value >= 60) color = 'var(--color-amber)'
                    return <Cell key={`cell-${index}`} fill={color} />
                  })}
                </Bar>
                <ReferenceLine x={80} stroke="var(--color-grey)" strokeDasharray="4 4" label={{ value: 'Target 80%', fontSize: 10, fill: 'var(--color-grey)', position: 'top' }} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Override by Stage */}
          <ChartCard title="Override Rate by Stage" subtitle="Target: <10%" height={220}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart layout="vertical" data={overrideByStage} margin={{ top: 5, right: 20, left: 70, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis type="number" domain={[0, 40]} label={{ value: '%', position: 'right', offset: 10 }} />
                <YAxis type="category" dataKey="stage" width={65} tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" barSize={20} radius={[0, 4, 4, 0]}>
                  {overrideByStage.map((entry, index) => {
                    let color = 'var(--color-red)'
                    if (entry.value <= 10) color = 'var(--color-green)'
                    else if (entry.value <= 20) color = 'var(--color-amber)'
                    return <Cell key={`cell-${index}`} fill={color} />
                  })}
                </Bar>
                <ReferenceLine x={10} stroke="var(--color-grey)" strokeDasharray="4 4" label={{ value: 'Target 10%', fontSize: 10, fill: 'var(--color-grey)', position: 'top' }} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Section C: Deep Dive */}
      <div>
        <SectionHeading title="Deep Dive" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Override Heatmap */}
          <div className="lg:col-span-2 bg-[color:var(--color-bg-card)] rounded-xl border border-[color:var(--color-border)] p-6">
            <h3 className="text-sm font-bold text-[color:var(--color-text-primary)] mb-1">Override Rate by Document Type</h3>
            <p className="text-xs text-[color:var(--color-text-muted)] mb-4">% of times users override DI result — lower is better</p>

            <div className="overflow-x-auto">
              <table className="w-full text-12px">
                <thead className="sticky top-0 bg-[color:var(--color-bg-card)] border-b border-[color:var(--color-border)]">
                  <tr>
                    <th className="text-left px-3 py-2 font-bold text-uppercase text-10px text-[color:var(--color-text-muted)]">Document Type</th>
                    <th className="text-center px-3 py-2 font-bold text-uppercase text-10px text-[color:var(--color-text-muted)]">PL</th>
                    <th className="text-center px-3 py-2 font-bold text-uppercase text-10px text-[color:var(--color-text-muted)]">HL</th>
                    <th className="text-center px-3 py-2 font-bold text-uppercase text-10px text-[color:var(--color-text-muted)]">UCL</th>
                    <th className="text-center px-3 py-2 font-bold text-uppercase text-10px text-[color:var(--color-text-muted)]">NCL</th>
                  </tr>
                </thead>
                <tbody>
                  {overrideHeatmap.map((row, idx) => (
                    <tr key={idx} className="border-b border-[color:var(--color-border)] last:border-b-0">
                      <td className="px-3 py-2 text-12px font-medium text-[color:var(--color-text-primary)]">{row.doc}</td>
                      {[row.pl, row.hl, row.ucl, row.ncl].map((value, cidx) => {
                        const colName = ['PL', 'HL', 'UCL', 'NCL'][cidx]
                        const key = `${row.doc}×${colName}`
                        return (
                          <TooltipProvider key={cidx}>
                            <UITooltip>
                              <TooltipTrigger asChild>
                                <td
                                  className={`px-3 py-2 text-center text-12px font-semibold rounded cursor-pointer ${getCellColor(value)} transition-opacity hover:opacity-80`}
                                  onMouseEnter={() => setHoveredCell(key)}
                                  onMouseLeave={() => setHoveredCell(null)}
                                >
                                  {value === null ? '—' : `${value}%`}
                                </td>
                              </TooltipTrigger>
                              {value !== null && (
                                <TooltipContent className="max-w-xs">
                                  <div className="space-y-1">
                                    <p className="font-semibold text-12px">{row.doc} × {colName}</p>
                                    <p className="text-11px">Override rate: {value}%</p>
                                    {getOverrideReasons[key] && (
                                      <p className="text-11px text-[color:var(--color-text-muted)] italic">{getOverrideReasons[key]}</p>
                                    )}
                                    {!getOverrideReasons[key] && (
                                      <p className="text-11px text-[color:var(--color-text-muted)] italic">Review model config for this document type</p>
                                    )}
                                  </div>
                                </TooltipContent>
                              )}
                            </UITooltip>
                          </TooltipProvider>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Feature Adoption */}
          <div className="bg-[color:var(--color-bg-card)] rounded-xl border border-[color:var(--color-border)] p-6">
            <h3 className="text-sm font-bold text-[color:var(--color-text-primary)] mb-1">Feature Adoption</h3>
            <p className="text-xs text-[color:var(--color-text-muted)] mb-4">Which DI capabilities are being used</p>

            <div className="space-y-3">
              {featureAdoption.map((item, idx) => (
                <div key={idx} className="pb-3 border-b border-[color:var(--color-border)] last:border-b-0 last:pb-0">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-13px text-[color:var(--color-text-primary)]">{item.feature}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-30 h-1.5 bg-[color:var(--color-grey-bg)] rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            item.usage >= 80 ? 'bg-[color:var(--color-green)]' : item.usage >= 60 ? 'bg-[color:var(--color-amber)]' : 'bg-[color:var(--color-red)]'
                          }`}
                          style={{ width: `${item.usage}%` }}
                        />
                      </div>
                      <span className="text-13px font-bold text-[color:var(--color-text-primary)] min-w-9 text-right">{item.usage}%</span>
                      <StatusBadge status={item.status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section D: Adoption Trend */}
      <div>
        <SectionHeading title="Adoption Trend Over Time" />
        <ChartCard title="Adoption Rate Progression" subtitle="Overall and by stage — Oct 2024 to Jun 2025" height={300}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={filteredTrend} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} label={{ value: '%', angle: -90, position: 'insideLeft', offset: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '16px' }} />
              <ReferenceLine y={80} stroke="var(--color-grey)" strokeDasharray="4 4" label={{ value: 'Target 80%', position: 'right', fontSize: 10, fill: 'var(--color-grey)' }} />
              <Line type="monotone" dataKey="overall" stroke="var(--color-blue)" strokeWidth={3} dot={false} name="Overall" />
              <Line type="monotone" dataKey="cpc" stroke="var(--color-green)" strokeWidth={2} dot={false} name="CPC" />
              <Line type="monotone" dataKey="credit" stroke="var(--color-amber)" strokeWidth={2} dot={false} name="Credit" />
              <Line type="monotone" dataKey="sanction" stroke="var(--color-purple)" strokeWidth={2} dot={false} name="Sanction" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  )
}
