'use client'

import { useMemo } from 'react'
import {
  ComposedChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Cell,
  ResponsiveContainer,
} from 'recharts'
import { filterByDateRange } from '@/lib/filterData'
import {
  overviewKPIs,
  overviewTrend,
  stageAutomationCoverage,
  milestones,
  topSignals,
} from '@/lib/data'
import { KPICard } from '@/components/kpi-card'
import { SectionHeading } from '@/components/section-heading'
import { ChartCard } from '@/components/chart-card'
import { StatusBadge } from '@/components/status-badge'
import { CustomTooltip } from '@/components/custom-tooltip'

interface OverviewTabProps {
  dateRange: string
  productFilter: string
}

export function OverviewTab({ dateRange, productFilter }: OverviewTabProps) {
  const filteredTrend = useMemo(() => filterByDateRange(overviewTrend, dateRange), [dateRange])

  const kpiConfigs = [
    {
      ...overviewKPIs.automationCoverage,
      label: 'Automation Coverage',
      helpText:
        '% of planned (product × stage) combinations where DI is live in production. Formula: (Stages live ÷ Total planned stages) × 100. Source: Deployment tracker.',
    },
    {
      ...overviewKPIs.documentAccuracy,
      label: 'Document Accuracy',
      helpText:
        'Field-level extraction accuracy from weekly ops sampling audit (N=50 applications). Formula: (Correct fields ÷ Total fields extracted) × 100.',
    },
    {
      ...overviewKPIs.ftrRate,
      label: 'First-Time Right (FTR)',
      helpText:
        '% of applications clearing CPC without being returned to QDE for document corrections. Formula: (Apps passing CPC first attempt ÷ Total apps at CPC) × 100. Source: SLOS workflow log.',
    },
    {
      ...overviewKPIs.stpRate,
      label: 'STP Rate',
      helpText:
        'Straight-Through Processing: % of applications going from QDE to Closure with zero manual document intervention. Source: SLOS + DI event logs combined.',
    },
    {
      ...overviewKPIs.userAdoption,
      label: 'User Adoption',
      helpText:
        '% of eligible users (by role and stage) who triggered at least one DI action in the last 30 days. Source: SLOS user activity logs.',
    },
    {
      ...overviewKPIs.tatSaved,
      label: 'Avg TAT Saved',
      helpText:
        'Average processing time saved per loan application across all DI-deployed stages. Calculated as Pre-DI AHT minus Post-DI AHT per stage, summed across stages.',
      deltaLabel: 'vs last quarter',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Section A: KPI Strip */}
      <div>
        <SectionHeading title="Programme Snapshot" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {kpiConfigs.map((config) => (
            <KPICard
              key={config.label}
              label={config.label}
              value={config.value}
              unit={config.unit}
              target={config.target}
              delta={config.delta}
              deltaLabel={config.deltaLabel || 'vs last quarter'}
              status={config.status}
              helpText={config.helpText}
            />
          ))}
        </div>
      </div>

      {/* Section B: Trend Charts */}
      <div>
        <SectionHeading title="Trends" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ChartCard
            title="Monthly Trend — Key Metrics"
            subtitle="Automation coverage, FTR, and user adoption over 9 months"
            className="lg:col-span-2"
            onExport={() => {}}
          >
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={filteredTrend}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                />
                <XAxis
                  dataKey="month"
                  stroke="var(--color-text-muted)"
                  fontSize={12}
                />
                <YAxis
                  domain={[0, 100]}
                  stroke="var(--color-text-muted)"
                  fontSize={12}
                  label={{ value: '%', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: '20px', fontSize: '13px' }}
                />
                <ReferenceLine
                  y={85}
                  stroke="var(--color-grey)"
                  strokeDasharray="4 4"
                  label={{
                    value: 'Coverage target 85%',
                    position: 'right',
                    fontSize: 10,
                    fill: 'var(--color-grey)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="automation"
                  stroke="var(--color-blue)"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#fff', stroke: 'var(--color-blue)', strokeWidth: 2 }}
                  activeDot={{ r: 5, fill: 'var(--color-blue)', stroke: '#fff', strokeWidth: 2 }}
                  name="Automation Coverage %"
                />
                <Line
                  type="monotone"
                  dataKey="ftr"
                  stroke="var(--color-green)"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#fff', stroke: 'var(--color-green)', strokeWidth: 2 }}
                  activeDot={{ r: 5, fill: 'var(--color-green)', stroke: '#fff', strokeWidth: 2 }}
                  name="FTR Rate %"
                />
                <Line
                  type="monotone"
                  dataKey="adoption"
                  stroke="var(--color-amber)"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#fff', stroke: 'var(--color-amber)', strokeWidth: 2 }}
                  activeDot={{ r: 5, fill: 'var(--color-amber)', stroke: '#fff', strokeWidth: 2 }}
                  name="User Adoption %"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Automation Coverage by Stage"
            subtitle="% of product lines with DI live + UAT at each stage"
            onExport={() => {}}
          >
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                layout="vertical"
                data={stageAutomationCoverage}
                margin={{ left: 60, right: 40 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis type="category" dataKey="stage" />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine
                  x={60}
                  stroke="var(--color-grey)"
                  strokeDasharray="4 4"
                  label={{
                    value: 'Target 60%',
                    position: 'top',
                    fontSize: 10,
                  }}
                />
                <Bar dataKey="activeWithUatPct" radius={[0, 4, 4, 0]} barSize={24}>
                  {stageAutomationCoverage.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.activeWithUatPct >= 60
                          ? 'var(--color-green)'
                          : entry.activeWithUatPct >= 30
                            ? 'var(--color-amber)'
                            : 'var(--color-red)'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Section C: Programme Health */}
      <div>
        <SectionHeading title="Programme Health" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Milestone Health Table */}
          <div className="lg:col-span-2 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[color:var(--color-text-primary)]">
                Milestone Health
              </h3>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[color:var(--color-red-bg)] text-[color:var(--color-red-text)]">
                3 of 5 delayed
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-[color:var(--color-bg-card)] border-b border-[color:var(--color-border)]">
                  <tr className="text-xs font-semibold text-[color:var(--color-text-secondary)] uppercase">
                    <th className="text-left py-3 px-3">Milestone</th>
                    <th className="text-left py-3 px-3">Planned</th>
                    <th className="text-left py-3 px-3">Actual/Expected</th>
                    <th className="text-left py-3 px-3">Delay</th>
                    <th className="text-left py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {milestones.map((milestone, index) => (
                    <tr
                      key={index}
                      className={`border-b border-[color:var(--color-border)] ${
                        index % 2 === 0
                          ? 'bg-[color:var(--color-grey-bg)]'
                          : ''
                      } hover:bg-[color:var(--color-blue-bg)]`}
                    >
                      <td className="py-3 px-3 text-[color:var(--color-text-primary)]">
                        {milestone.name}
                      </td>
                      <td className="py-3 px-3 text-[color:var(--color-text-secondary)]">
                        {milestone.planned}
                      </td>
                      <td className="py-3 px-3 text-[color:var(--color-text-secondary)]">
                        {milestone.actual}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`font-medium ${
                            milestone.delay === 0
                              ? 'text-[color:var(--color-green-text)]'
                              : 'text-[color:var(--color-red-text)]'
                          }`}
                        >
                          {milestone.delay === 0 ? '0 days' : `${milestone.delay} days`}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge
                          status={milestone.status}
                          label={
                            milestone.status === 'on-time'
                              ? 'On Time'
                              : milestone.status === 'delayed'
                                ? 'Delayed'
                                : 'At Risk'
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Where to Focus Panel */}
          <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] shadow-sm p-6">
            <h3 className="text-sm font-bold text-[color:var(--color-text-primary)] mb-1">
              Where to Focus
            </h3>
            <p className="text-xs text-[color:var(--color-text-muted)] mb-4">
              Top signals requiring attention
            </p>

            <div className="space-y-0">
              {topSignals.map((signal, index) => (
                <div
                  key={index}
                  className={`flex gap-3 py-2.5 ${
                    index < topSignals.length - 1
                      ? 'border-b border-[color:var(--color-border)]'
                      : ''
                  }`}
                >
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                    style={{
                      backgroundColor:
                        signal.severity === 'red'
                          ? 'var(--color-red)'
                          : signal.severity === 'amber'
                            ? 'var(--color-amber)'
                            : 'var(--color-green)',
                    }}
                  />
                  <p className="text-xs leading-relaxed text-[color:var(--color-text-primary)]">
                    {signal.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
