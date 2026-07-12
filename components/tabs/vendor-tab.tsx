'use client'

import { useState, useMemo } from 'react'
import { X, CheckCircle2, AlertCircle, TrendingDown } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import { filterByDateRange } from '@/lib/filterData'
import { useData } from '@/context/DataContext'
import { KPICard } from '@/components/kpi-card'
import { SectionHeading } from '@/components/section-heading'
import { ChartCard } from '@/components/chart-card'
import { CustomTooltip } from '@/components/custom-tooltip'
import { StatusBadge } from '@/components/status-badge'
import { vendors as defaultVendors, incidents as defaultIncidents, modelDrift as defaultModelDrift, inputQualityByProduct as defaultInputQualityByProduct, qualityFailureReasons as defaultQualityFailureReasons } from '@/lib/data'

interface VendorTabProps {
  dateRange: string
  productFilter: string
}

export function VendorTab({ dateRange, productFilter }: VendorTabProps) {
  const { data: excelData } = useData()
  const vendors = excelData?.vendors ?? defaultVendors
  const incidents = excelData?.incidents ?? defaultIncidents
  const modelDrift = excelData?.modelDrift ?? defaultModelDrift
  const inputQualityByProduct = excelData?.inputQualityByProduct ?? defaultInputQualityByProduct
  const qualityFailureReasons = excelData?.qualityFailureReasons ?? defaultQualityFailureReasons
  
  const filteredModelDrift = useMemo(() => filterByDateRange(modelDrift, dateRange), [dateRange, modelDrift])
  const filteredIncidents = useMemo(() => filterByDateRange(incidents, dateRange), [dateRange, incidents])
  const [selectedVendor, setSelectedVendor] = useState<any>(null)

  const slaComplianceKPIs = {
    slaCompliance: { value: 82, target: 95, delta: -13, unit: '%', status: 'at-risk' as const },
    openIncidents: { value: 4, unit: '', status: 'at-risk' as const },
    modelDrift: { value: -1.2, target: -2, unit: '%', status: 'watch' as const },
    inputQuality: { value: 84, target: 90, delta: -6, unit: '%', status: 'watch' as const },
  }

  const VendorDetailDrawer = ({ vendor, onClose }: { vendor: any; onClose: () => void }) => {
    return (
      <>
        <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
        <div className="fixed right-0 top-0 h-full w-96 bg-[color:var(--color-bg-card)] shadow-xl z-50 overflow-y-auto">
          <div className="sticky top-0 flex items-center justify-between p-6 border-b border-[color:var(--color-border)]">
            <h2 className="text-lg font-bold text-[color:var(--color-text-primary)]">{vendor.name} — Full Detail</h2>
            <button onClick={onClose} className="p-1 hover:bg-[color:var(--color-grey-bg)] rounded-md transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <h4 className="text-sm font-bold text-[color:var(--color-text-primary)] mb-3">Contract Info</h4>
              <div className="grid grid-cols-1 gap-3 text-12px">
                <div>
                  <p className="text-[color:var(--color-text-muted)] mb-1">Monthly Spend</p>
                  <p className="font-bold text-[color:var(--color-text-primary)]">{vendor.spend}</p>
                </div>
                <div>
                  <p className="text-[color:var(--color-text-muted)] mb-1">Renewal</p>
                  <p className="font-bold text-[color:var(--color-text-primary)]">{vendor.renewal}</p>
                </div>
                <div>
                  <p className="text-[color:var(--color-text-muted)] mb-1">Stages Covered</p>
                  <p className="font-bold text-[color:var(--color-text-primary)]">{vendor.stages}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-[color:var(--color-border)] pt-4">
              <h4 className="text-sm font-bold text-[color:var(--color-text-primary)] mb-3">Accuracy Trend — Last 6 Months</h4>
              {vendor.accuracyTrend && vendor.accuracyTrend.some((v: any) => v !== null) ? (
                <ResponsiveContainer width="100%" height={100}>
                  <LineChart data={vendor.accuracyTrend.map((val: any, idx: number) => ({ value: val || 0 }))}>
                    <Line type="monotone" dataKey="value" stroke="#2563eb" dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-12px text-[color:var(--color-text-muted)]">No accuracy data — checklist-only vendor</p>
              )}
            </div>

            <div className="border-t border-[color:var(--color-border)] pt-4">
              <h4 className="text-sm font-bold text-[color:var(--color-text-primary)] mb-3">Open Issues</h4>
              {vendor.openIssues && vendor.openIssues.length > 0 ? (
                <div className="space-y-2">
                  {vendor.openIssues.map((issue: any, idx: number) => (
                    <div key={idx} className="flex items-start gap-3 text-12px pb-2 border-b border-[color:var(--color-border)] last:border-0">
                      <span className={`px-2 py-0.5 rounded text-white font-bold ${issue.severity === 'P1' ? 'bg-[color:var(--color-red)]' : 'bg-[color:var(--color-amber)]'}`}>
                        {issue.severity}
                      </span>
                      <div className="flex-1">
                        <p className="font-mono text-[color:var(--color-text-muted)] mb-1">{issue.id}</p>
                        <p className="text-[color:var(--color-text-primary)] mb-1">{issue.desc}</p>
                        <p className="text-[color:var(--color-text-muted)]">{issue.age} • {issue.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-12px text-[color:var(--color-green-text)]">
                  <CheckCircle2 size={16} />
                  <span>No open issues</span>
                </div>
              )}
            </div>

            <div className="border-t border-[color:var(--color-border)] pt-4">
              <h4 className="text-sm font-bold text-[color:var(--color-text-primary)] mb-3">Recommendation</h4>
              <div className={`rounded p-3 text-12px ${vendor.status === 'on-target' ? 'bg-[color:var(--color-green-bg)] text-[color:var(--color-green-text)]' : vendor.status === 'watch' ? 'bg-[color:var(--color-amber-bg)] text-[color:var(--color-amber-text)]' : 'bg-[color:var(--color-red-bg)] text-[color:var(--color-red-text)]'}`}>
                {vendor.recommendation}
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="space-y-8">
      {/* Section A: KPI Cards */}
      <div>
        <SectionHeading title="Operations Health" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            label={slaComplianceKPIs.slaCompliance.label || 'SLA Compliance'}
            value={slaComplianceKPIs.slaCompliance.value}
            unit={slaComplianceKPIs.slaCompliance.unit}
            status={slaComplianceKPIs.slaCompliance.status}
            delta={slaComplianceKPIs.slaCompliance.delta}
            deltaLabel="below target"
            target={`${slaComplianceKPIs.slaCompliance.target}%`}
            helpText="% of vendor SLA parameters (accuracy, latency, uptime, resolution TAT) within agreed thresholds across all vendors."
          />
          <div className="bg-[color:var(--color-bg-card)] border border-[color:var(--color-border)] rounded-xl p-4">
            <p className="text-12px font-semibold text-[color:var(--color-text-muted)] uppercase mb-3">Open Incidents</p>
            <div className="flex items-baseline gap-2 mb-4">
              <p className="text-3xl font-bold text-[color:var(--color-text-primary)]">4</p>
            </div>
            <div className="flex gap-2 mb-4">
              <span className="px-2 py-1 rounded text-11px font-bold bg-[color:var(--color-red-bg)] text-[color:var(--color-red-text)]">2 P1</span>
              <span className="px-2 py-1 rounded text-11px font-bold bg-[color:var(--color-amber-bg)] text-[color:var(--color-amber-text)]">2 P2</span>
            </div>
            <StatusBadge status="at-risk" />
          </div>
          <div className="bg-[color:var(--color-bg-card)] border border-[color:var(--color-border)] rounded-xl p-4">
            <p className="text-12px font-semibold text-[color:var(--color-text-muted)] uppercase mb-3 flex items-center justify-between">
              Avg Model Drift
              <AlertCircle size={14} className="text-[color:var(--color-text-muted)]" />
            </p>
            <p className="text-3xl font-bold text-[color:var(--color-text-primary)] mb-1">−1.2<span className="text-lg">%</span></p>
            <p className="text-12px text-[color:var(--color-text-muted)] mb-3">target: −2% threshold</p>
            <p className="text-11px text-[color:var(--color-red-text)] font-semibold">HL-CPC model at −2.1% — action required</p>
            <StatusBadge status="watch" />
          </div>
          <KPICard
            label="Input Doc Quality"
            value={slaComplianceKPIs.inputQuality.value}
            unit={slaComplianceKPIs.inputQuality.unit}
            status={slaComplianceKPIs.inputQuality.status}
            delta={slaComplianceKPIs.inputQuality.delta}
            deltaLabel="below target"
            target="90%"
            helpText="% of uploaded documents passing all three quality gates: readable, correct type, and complete."
          />
        </div>
      </div>

      {/* Section B: Vendor SLA Scorecard */}
      <div>
        <SectionHeading title="Vendor SLA Scorecard" />
        <div className="bg-[color:var(--color-bg-card)] border border-[color:var(--color-border)] rounded-xl p-6 overflow-x-auto">
          <table className="w-full text-12px">
            <thead className="bg-[color:var(--color-grey-bg)] border-b border-[color:var(--color-border)]">
              <tr>
                <th className="text-left p-3 font-bold text-[color:var(--color-text-primary)] uppercase">Vendor</th>
                <th className="text-left p-3 font-bold text-[color:var(--color-text-primary)] uppercase">Spend</th>
                <th className="text-center p-3 font-bold text-[color:var(--color-text-primary)] uppercase">API Latency P95</th>
                <th className="text-center p-3 font-bold text-[color:var(--color-text-primary)] uppercase">Latency SLA</th>
                <th className="text-center p-3 font-bold text-[color:var(--color-text-primary)] uppercase">Accuracy</th>
                <th className="text-center p-3 font-bold text-[color:var(--color-text-primary)] uppercase">Accuracy SLA</th>
                <th className="text-center p-3 font-bold text-[color:var(--color-text-primary)] uppercase">Uptime</th>
                <th className="text-center p-3 font-bold text-[color:var(--color-text-primary)] uppercase">Uptime SLA</th>
                <th className="text-center p-3 font-bold text-[color:var(--color-text-primary)] uppercase">Resolution TAT</th>
                <th className="text-center p-3 font-bold text-[color:var(--color-text-primary)] uppercase">Overall SLA</th>
                <th className="text-center p-3 font-bold text-[color:var(--color-text-primary)] uppercase">Status</th>
                <th className="text-center p-3 font-bold text-[color:var(--color-text-primary)] uppercase">Detail</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor: any, idx: number) => (
                <tr key={idx} className="border-b border-[color:var(--color-border)] hover:bg-[color:var(--color-grey-bg)] transition-colors">
                  <td className="p-3 font-semibold text-[color:var(--color-text-primary)]">{vendor.name}</td>
                  <td className="p-3 text-[color:var(--color-text-secondary)]">{vendor.spend}</td>
                  <td className="p-3 text-center">
                    {vendor.latencyP95 <= vendor.latencySLA ? (
                      <div className="flex items-center justify-center gap-1">
                        <CheckCircle2 size={14} className="text-[color:var(--color-green)]" />
                        <span>{vendor.latencyP95}s</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-1">
                        <AlertCircle size={14} className="text-[color:var(--color-red)]" />
                        <span className="font-bold text-[color:var(--color-red-text)]">{vendor.latencyP95}s</span>
                      </div>
                    )}
                  </td>
                  <td className="p-3 text-center text-[color:var(--color-text-muted)]">{vendor.latencySLA}s</td>
                  <td className="p-3 text-center">
                    {vendor.accuracy ? (
                      vendor.accuracy >= vendor.accuracySLA ? (
                        <div className="flex items-center justify-center gap-1">
                          <CheckCircle2 size={14} className="text-[color:var(--color-green)]" />
                          <span>{vendor.accuracy}%</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1">
                          <AlertCircle size={14} className="text-[color:var(--color-red)]" />
                          <span className="font-bold text-[color:var(--color-red-text)]">{vendor.accuracy}%</span>
                        </div>
                      )
                    ) : (
                      <span className="text-[color:var(--color-text-muted)]">—</span>
                    )}
                  </td>
                  <td className="p-3 text-center text-[color:var(--color-text-muted)]">{vendor.accuracySLA}%</td>
                  <td className="p-3 text-center">
                    {vendor.uptime >= vendor.uptimeSLA ? (
                      <div className="flex items-center justify-center gap-1">
                        <CheckCircle2 size={14} className="text-[color:var(--color-green)]" />
                        <span>{vendor.uptime}%</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-1">
                        <AlertCircle size={14} className="text-[color:var(--color-red)]" />
                        <span className="font-bold text-[color:var(--color-red-text)]">{vendor.uptime}%</span>
                      </div>
                    )}
                  </td>
                  <td className="p-3 text-center text-[color:var(--color-text-muted)]">{vendor.uptimeSLA}%</td>
                  <td className={`p-3 text-center font-bold ${vendor.resolutionTAT <= 4 ? 'text-[color:var(--color-green-text)]' : vendor.resolutionTAT <= 10 ? 'text-[color:var(--color-amber-text)]' : 'text-[color:var(--color-red-text)]'}`}>
                    {vendor.resolutionTAT}h
                  </td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-11px font-bold ${vendor.slaCompliance >= 90 ? 'bg-[color:var(--color-green-bg)] text-[color:var(--color-green-text)]' : vendor.slaCompliance >= 70 ? 'bg-[color:var(--color-amber-bg)] text-[color:var(--color-amber-text)]' : 'bg-[color:var(--color-red-bg)] text-[color:var(--color-red-text)]'}`}>
                      {vendor.slaCompliance}%
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <StatusBadge status={vendor.status} />
                  </td>
                  <td className="p-3 text-center">
                    <button onClick={() => setSelectedVendor(vendor)} className="px-2 py-1 hover:bg-[color:var(--color-grey-bg)] rounded transition-colors text-[color:var(--color-blue)] font-semibold text-11px">
                      View →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section C: Model & Incident Monitoring */}
      <div>
        <SectionHeading title="Model & Incident Monitoring" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Model Drift Tracker" subtitle="Accuracy change from go-live baseline — alert at −2%">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={filteredModelDrift}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis domain={[-6, 0.5]} label={{ value: 'Drift %', angle: -90, position: 'insideLeft' }} tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="plCredit" stroke="var(--color-blue)" strokeWidth={2} name="PL-Credit" />
                <Line type="monotone" dataKey="cpcAll" stroke="var(--color-green)" strokeWidth={2} name="CPC-All" />
                <Line type="monotone" dataKey="hlCpc" stroke="var(--color-red)" strokeWidth={3} name="HL-CPC (⚠)" dot={{ r: 5 }} />
                <Line type="monotone" dataKey="uclQde" stroke="var(--color-amber)" strokeWidth={2} name="UCL-QDE" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Incident Rate by Severity" subtitle="Monthly production incidents — Jan to Jun 2025">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={filteredIncidents}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="p1" stackId="a" fill="var(--color-red)" name="P1 — Critical" />
                <Bar dataKey="p2" stackId="a" fill="var(--color-amber)" name="P2 — Major" />
                <Bar dataKey="p3" stackId="a" fill="var(--color-blue)" name="P3 — Minor" />
              </BarChart>
            </ResponsiveContainer>
            <div className="border-t border-[color:var(--color-border)] pt-4 mt-4">
              <p className="text-11px uppercase font-bold text-[color:var(--color-text-muted)] mb-3">Open Incidents</p>
              <div className="space-y-2">
                {incidents[0]?.openIncidents?.map((issue: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 text-11px pb-2 border-b border-[color:var(--color-border)] last:border-0">
                    <span className={`px-2 py-0.5 rounded font-bold text-white ${issue.severity === 'P1' ? 'bg-[color:var(--color-red)]' : 'bg-[color:var(--color-amber)]'}`}>{issue.severity}</span>
                    <span className="font-mono text-[color:var(--color-blue)]">{issue.id}</span>
                    <span className="text-[color:var(--color-text-secondary)]">{issue.vendor}</span>
                    <span className="text-[color:var(--color-text-muted)]">•</span>
                    <span className="text-[color:var(--color-text-secondary)]">{issue.desc}</span>
                    <span className={`ml-auto ${issue.age > 7 ? 'font-bold' : ''}`}>{issue.age}d</span>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>
        </div>
      </div>

      {/* Section D: Input Quality */}
      <div>
        <SectionHeading title="Document Upload Quality" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Input Quality Score by Product Line" subtitle="% of uploaded docs passing quality gate — target 90%">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart layout="vertical" data={inputQualityByProduct}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="product" tick={{ fontSize: 11 }} width={80} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                  {inputQualityByProduct?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.value >= 90 ? 'var(--color-green)' : entry.value >= 80 ? 'var(--color-amber)' : 'var(--color-red)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="border-t border-[color:var(--color-border)] pt-3 mt-3">
              <p className="text-11px text-[color:var(--color-text-secondary)] italic">Used Car Loan low score driven by RC book and valuation doc variability in used vehicle segment</p>
            </div>
          </ChartCard>
          <ChartCard title="Quality Failure Reasons" subtitle="Why documents fail the upload quality gate">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart layout="vertical" data={qualityFailureReasons}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis type="number" domain={[0, 40]} tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="reason" tick={{ fontSize: 11 }} width={100} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="pct" radius={[0, 4, 4, 0]} fill="var(--color-blue)" barSize={20} />
              </BarChart>
            </ResponsiveContainer>
            <div className="border-t border-[color:var(--color-border)] pt-3 mt-3">
              <p className="text-11px text-[color:var(--color-text-secondary)] italic">Top action: Run upload quality training for UCL sales team. 35% of UCL failures are blurry/low resolution — addressable with simple guidance.</p>
            </div>
          </ChartCard>
        </div>
      </div>

      {/* Detail Drawer */}
      {selectedVendor && <VendorDetailDrawer vendor={selectedVendor} onClose={() => setSelectedVendor(null)} />}
    </div>
  )
}
