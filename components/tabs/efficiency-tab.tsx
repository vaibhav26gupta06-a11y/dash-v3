'use client'

import { useState, useMemo } from 'react'
import { X } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, ComposedChart, Line, YAxis, XAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer } from 'recharts'
import { filterByDateRange } from '@/lib/filterData'
import { KPICard } from '@/components/kpi-card'
import { SectionHeading } from '@/components/section-heading'
import { ChartCard } from '@/components/chart-card'
import { CustomTooltip } from '@/components/custom-tooltip'
import { efficiencyKPIs, ahtComparison, tatTrend, stpHandoffTrend, ftrByStage } from '@/lib/data'

interface EfficiencyTabProps {
  dateRange: string
  productFilter: string
}

export function EfficiencyTab({ dateRange, productFilter }: EfficiencyTabProps) {
  const filteredTAT = useMemo(() => filterByDateRange(tatTrend, dateRange), [dateRange])
  const filteredSTPHandoff = useMemo(() => filterByDateRange(stpHandoffTrend, dateRange), [dateRange])
  const [selectedStage, setSelectedStage] = useState<any>(null)

  const AHTDetailDrawer = ({ stage, onClose }: { stage: any; onClose: () => void }) => {
    const saved = stage.preDI - stage.postDI
    const reduction = ((saved / stage.preDI) * 100).toFixed(0)

    return (
      <>
        <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
        <div className="fixed right-0 top-0 h-full w-96 bg-[color:var(--color-bg-card)] shadow-xl z-50 overflow-y-auto">
          <div className="sticky top-0 flex items-center justify-between p-6 border-b border-[color:var(--color-border)] bg-[color:var(--color-bg-card)]">
            <h2 className="text-lg font-bold text-[color:var(--color-text-primary)]">{stage.stage} Stage — AHT Detail</h2>
            <button onClick={onClose} className="p-1 hover:bg-[color:var(--color-grey-bg)] rounded-md transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-11px text-[color:var(--color-text-muted)] uppercase font-semibold mb-1">Pre-DI</p>
                <p className="text-2xl font-bold text-[color:var(--color-text-secondary)]">{stage.preDI.toFixed(1)} hrs</p>
              </div>
              <div className="text-center">
                <p className="text-10px text-[color:var(--color-text-muted)] uppercase font-semibold">Saved</p>
                <p className="text-lg font-bold text-[color:var(--color-green-text)]">{saved.toFixed(1)} hrs</p>
              </div>
              <div>
                <p className="text-11px text-[color:var(--color-text-muted)] uppercase font-semibold mb-1">Post-DI</p>
                <p className="text-2xl font-bold text-[color:var(--color-blue)]">{stage.postDI.toFixed(1)} hrs</p>
              </div>
            </div>
            <div className="text-center text-sm font-bold text-[color:var(--color-green-text)] bg-[color:var(--color-green-bg)] rounded-lg py-2">
              {reduction}% reduction
            </div>

            <div className="border-t border-[color:var(--color-border)] pt-4">
              <p className="text-11px text-[color:var(--color-text-muted)] uppercase font-semibold mb-3">Response Time Distribution — Post DI</p>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'P25', value: stage.p25 },
                  { label: 'P50', value: stage.p50 },
                  { label: 'P75', value: stage.p75 },
                  { label: 'P90', value: stage.p90 },
                ].map((stat) => (
                  <div key={stat.label} className="bg-[color:var(--color-grey-bg)] rounded p-3 text-center">
                    <p className="text-10px text-[color:var(--color-text-muted)] uppercase font-semibold mb-1">{stat.label}</p>
                    <p className="text-lg font-bold text-[color:var(--color-text-primary)]">{stat.value.toFixed(1)}h</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-[color:var(--color-border)] pt-4">
              <p className="text-11px text-[color:var(--color-text-muted)] uppercase font-semibold mb-2">What DI Does at This Stage</p>
              <p className="text-13px text-[color:var(--color-text-secondary)] leading-relaxed">{stage.note}</p>
            </div>
          </div>
        </div>
      </>
    )
  }

  const preDITotal = ahtComparison.reduce((sum, s) => sum + s.preDI, 0).toFixed(1)
  const postDITotal = ahtComparison.reduce((sum, s) => sum + s.postDI, 0).toFixed(1)
  const totalSaved = (parseFloat(preDITotal) - parseFloat(postDITotal)).toFixed(1)

  return (
    <div className="space-y-8">
      {/* Section A: KPI Cards */}
      <div>
        <SectionHeading title="Efficiency Summary" />
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <KPICard
            label="Avg Time Saved / App"
            value={efficiencyKPIs.timeSaved.value}
            unit=" hrs"
            target={`${efficiencyKPIs.timeSaved.target.toFixed(1)} hrs`}
            delta={`+${(efficiencyKPIs.timeSaved.value - efficiencyKPIs.timeSaved.target + 0.5).toFixed(1)} hrs`}
            deltaLabel="vs last quarter"
            status={efficiencyKPIs.timeSaved.status}
            helpText="Total hours saved per loan application across all DI-deployed stages. Sum of (Pre-DI AHT − Post-DI AHT) per stage."
          />
          <KPICard
            label="End-to-End TAT"
            value={efficiencyKPIs.tat.value}
            unit=" days"
            target={`${efficiencyKPIs.tat.target.toFixed(1)} days`}
            delta={`-${(efficiencyKPIs.tat.preDI! - efficiencyKPIs.tat.value).toFixed(1)} days`}
            deltaLabel={`vs pre-DI (${efficiencyKPIs.tat.preDI} days)`}
            status={efficiencyKPIs.tat.status}
            helpText="Total calendar days from application creation (QDE) to disbursement or rejection. Trend is positive but target not yet reached."
          />
          <KPICard
            label="Avg Handoffs / App"
            value={efficiencyKPIs.handoffs.value}
            unit=""
            target="<3.0"
            delta={`-${(efficiencyKPIs.handoffs.preDI! - efficiencyKPIs.handoffs.value).toFixed(1)}`}
            deltaLabel={`vs pre-DI (${efficiencyKPIs.handoffs.preDI})`}
            status={efficiencyKPIs.handoffs.status}
            helpText="Number of times an application changes queue or responsible team. Each backward transition counts as 2 handoffs."
          />
          <KPICard
            label="STP Rate"
            value={efficiencyKPIs.stpRate.value}
            unit="%"
            target="60%"
            delta={`+${(efficiencyKPIs.stpRate.value - 3).toFixed(0)}%`}
            deltaLabel="vs pre-DI baseline"
            status={efficiencyKPIs.stpRate.status}
          />
          <KPICard
            label="Stage Regression Rate"
            value={efficiencyKPIs.regressionRate.value}
            unit="%"
            target="<8%"
            delta={`-${(25 - efficiencyKPIs.regressionRate.value)}%`}
            deltaLabel="vs pre-DI (25%)"
            status={efficiencyKPIs.regressionRate.status}
            helpText="% of applications sent back at least one stage due to document issues."
          />
        </div>
      </div>

      {/* Section B: AHT Comparison */}
      <div>
        <SectionHeading title="Time Saved by Stage" />
        <ChartCard title="Average Handling Time — Pre DI vs Post DI" subtitle="Hours per application at each stage. Click any stage to see distribution.">
          <div className="bg-[color:var(--color-blue-bg)] border border-[color:var(--color-blue)] rounded-lg p-3 mb-4 flex items-center justify-between">
            <span className="text-13px font-semibold text-[color:var(--color-text-primary)]">
              Total AHT: Pre-DI {preDITotal} hrs → Post-DI {postDITotal} hrs
            </span>
            <span className="text-13px font-bold text-[color:var(--color-green-text)] bg-[color:var(--color-green-bg)] rounded-full px-3 py-1">
              {totalSaved} hrs saved ({((parseFloat(totalSaved) / parseFloat(preDITotal)) * 100).toFixed(0)}% reduction)
            </span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={ahtComparison}
              layout="vertical"
              margin={{ top: 0, right: 30, left: 60, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis type="number" domain={[0, 7]} label={{ value: 'Hours', position: 'bottom', offset: 0 }} />
              <YAxis dataKey="stage" type="category" width={50} tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="preDI" name="Pre-DI AHT (hrs)" fill="var(--color-grey)" radius={[0, 4, 4, 0]} barSize={16} />
              <Bar dataKey="postDI" name="Post-DI AHT (hrs)" fill="var(--color-blue)" radius={[0, 4, 4, 0]} barSize={16} onClick={(data) => setSelectedStage(data)} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Section C: Trend Analysis */}
      <div>
        <SectionHeading title="Trend Analysis" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="End-to-End TAT Trend" subtitle="Business days from application to decision — target 5.0 days">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={filteredTAT} margin={{ top: 5, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="tatGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-blue)" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="var(--color-blue)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis domain={[4, 10]} label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={5} stroke="var(--color-green)" strokeDasharray="4 4" label={{ value: 'Target 5.0 days', position: 'right', fontSize: 10, fill: 'var(--color-green-text)' }} />
                <ReferenceLine x="Oct 24" stroke="var(--color-grey)" strokeDasharray="3 3" label={{ value: 'DI rollout begins', position: 'top', fontSize: 9 }} />
                <ReferenceLine x="Mar 25" stroke="var(--color-grey)" strokeDasharray="3 3" label={{ value: 'Credit stage live', position: 'top', fontSize: 9 }} />
                <Area dataKey="tat" stroke="var(--color-blue)" strokeWidth={2.5} fill="url(#tatGradient)" dot={{ r: 3, fill: '#fff', stroke: 'var(--color-blue)', strokeWidth: 2 }} activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="STP Rate & Handoffs Trend" subtitle="Both improving — STP rate still significantly below 60% target">
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={filteredSTPHandoff} margin={{ top: 5, right: 60, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" label={{ value: 'STP %', angle: -90, position: 'insideLeft' }} domain={[0, 60]} />
                <YAxis yAxisId="right" orientation="right" label={{ value: 'Handoffs', angle: 90, position: 'insideRight' }} domain={[0, 8]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <ReferenceLine yAxisId="left" y={60} stroke="var(--color-grey)" strokeDasharray="4 4" label={{ value: 'STP Target 60%', position: 'right', fontSize: 10 }} />
                <ReferenceLine yAxisId="right" y={3} stroke="var(--color-amber)" strokeDasharray="4 4" label={{ value: 'Handoff Target 3.0', position: 'left', fontSize: 10 }} />
                <Bar yAxisId="left" dataKey="stp" fill="var(--color-blue)" opacity={0.2} radius={[4, 4, 0, 0]} barSize={28} name="STP Rate %" />
                <Line yAxisId="right" dataKey="handoffs" stroke="var(--color-amber)" strokeWidth={2.5} name="Avg Handoffs" dot={{ r: 3, fill: '#fff', stroke: 'var(--color-amber)', strokeWidth: 2 }} activeDot={{ r: 5 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Section D: Stage Scorecard */}
      <div>
        <SectionHeading title="Stage Efficiency Scorecard" />
        <div className="bg-[color:var(--color-bg-card)] rounded-xl border border-[color:var(--color-border)] p-6 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[color:var(--color-border)] bg-[color:var(--color-grey-bg)]">
                <th className="text-left text-11px uppercase font-semibold text-[color:var(--color-text-muted)] py-3 px-4">Stage</th>
                <th className="text-left text-11px uppercase font-semibold text-[color:var(--color-text-muted)] py-3 px-4">Pre-DI AHT</th>
                <th className="text-left text-11px uppercase font-semibold text-[color:var(--color-text-muted)] py-3 px-4">Post-DI AHT</th>
                <th className="text-left text-11px uppercase font-semibold text-[color:var(--color-text-muted)] py-3 px-4">Time Saved</th>
                <th className="text-left text-11px uppercase font-semibold text-[color:var(--color-text-muted)] py-3 px-4">FTR Rate</th>
                <th className="text-left text-11px uppercase font-semibold text-[color:var(--color-text-muted)] py-3 px-4">Avg Handoffs</th>
              </tr>
            </thead>
            <tbody>
              {ahtComparison.map((row, idx) => {
                // Handle Sales stage as "Not yet deployed"
                if (row.stage === 'Sales') {
                  return (
                    <tr key={row.stage} className="border-b border-[color:var(--color-border)] bg-[#f8fafc]">
                      <td className="text-13px font-semibold text-[color:var(--color-text-primary)] py-4 px-4">{row.stage}</td>
                      <td className="text-13px text-[#94a3b8] py-4 px-4">—</td>
                      <td className="text-13px text-[#94a3b8] py-4 px-4">—</td>
                      <td className="text-13px font-semibold py-4 px-4">
                        <span className="rounded-full px-2 py-1 bg-[#e2e8f0] text-[#64748b]">
                          Not yet deployed
                        </span>
                      </td>
                      <td className="text-13px text-[#94a3b8] py-4 px-4">—</td>
                      <td className="text-13px text-[#94a3b8] py-4 px-4">—</td>
                    </tr>
                  )
                }

                const saved = row.preDI - row.postDI
                const savedPct = row.preDI > 0 ? ((saved / row.preDI) * 100).toFixed(0) : '0'
                const ftrRate = ftrByStage[idx]?.value || 0
                const handoffs = [1.1, 0.8, 1.2, 0.4, 0.3][idx - 1] || 0.2

                let bgColor = 'bg-[color:var(--color-green-bg)]'
                let textColor = 'text-[color:var(--color-green-text)]'
                if (parseInt(savedPct) < 50) {
                  bgColor = 'bg-[color:var(--color-red-bg)]'
                  textColor = 'text-[color:var(--color-red-text)]'
                } else if (parseInt(savedPct) < 20) {
                  bgColor = 'bg-[color:var(--color-amber-bg)]'
                  textColor = 'text-[color:var(--color-amber-text)]'
                }

                return (
                  <tr key={row.stage} className="border-b border-[color:var(--color-border)] hover:bg-[color:var(--color-grey-bg)] transition-colors">
                    <td className="text-13px font-semibold text-[color:var(--color-text-primary)] py-4 px-4 cursor-pointer hover:underline" onClick={() => setSelectedStage(row)}>{row.stage}</td>
                    <td className="text-13px text-[color:var(--color-text-secondary)] py-4 px-4">{row.preDI.toFixed(1)} hrs</td>
                    <td className="text-13px text-[color:var(--color-text-secondary)] py-4 px-4">{row.postDI.toFixed(1)} hrs</td>
                    <td className="text-13px font-semibold py-4 px-4">
                      <span className={`rounded-full px-2 py-1 ${bgColor} ${textColor}`}>
                        {saved.toFixed(1)} hrs ({savedPct}%)
                      </span>
                    </td>
                    <td className="text-13px text-[color:var(--color-text-secondary)] py-4 px-4">{ftrRate}%</td>
                    <td className="text-13px text-[color:var(--color-text-secondary)] py-4 px-4">{handoffs.toFixed(1)}</td>
                  </tr>
                )
              })}
              <tr className="border-t-2 border-[color:var(--color-border)] bg-[color:var(--color-grey-bg)] font-bold">
                <td className="text-13px text-[color:var(--color-text-primary)] py-4 px-4">Total</td>
                <td className="text-13px text-[color:var(--color-text-primary)] py-4 px-4">{preDITotal} hrs</td>
                <td className="text-13px text-[color:var(--color-text-primary)] py-4 px-4">{postDITotal} hrs</td>
                <td className="text-13px text-[color:var(--color-green-text)] py-4 px-4 bg-[color:var(--color-green-bg)] rounded-full px-2">{totalSaved} hrs ({((parseFloat(totalSaved) / parseFloat(preDITotal)) * 100).toFixed(0)}%)</td>
                <td colSpan={2} />
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Drawer */}
      {selectedStage && <AHTDetailDrawer stage={selectedStage} onClose={() => setSelectedStage(null)} />}
    </div>
  )
}
