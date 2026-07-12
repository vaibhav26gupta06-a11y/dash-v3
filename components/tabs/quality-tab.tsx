'use client'

import { useState, useMemo } from 'react'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, ReferenceLine, ReferenceArea,
} from 'recharts'
import { filterByDateRange, getDocTypesForProduct } from '@/lib/filterData'
import { useData } from '@/context/DataContext'
import { KPICard } from '@/components/kpi-card'
import { SectionHeading } from '@/components/section-heading'
import { ChartCard } from '@/components/chart-card'
import { CustomTooltip } from '@/components/custom-tooltip'
import { StatusBadge } from '@/components/status-badge'
import { X, Info } from 'lucide-react'
import {
  qualityKPIs as defaultQualityKPIs, accuracyTrend as defaultAccuracyTrend, ftrByStage as defaultFtrByStage, docTypeAccuracy as defaultDocTypeAccuracy, fprFnrTrend as defaultFprFnrTrend, reworkByProduct as defaultReworkByProduct,
} from '@/lib/data'

interface QualityTabProps {
  dateRange: string
  productFilter: string
}

export function QualityTab({ dateRange, productFilter }: QualityTabProps) {
  const { data: excelData } = useData()
  const qualityKPIs = excelData?.qualityKPIs ?? defaultQualityKPIs
  const accuracyTrend = excelData?.accuracyTrend ?? defaultAccuracyTrend
  const ftrByStage = excelData?.ftrByStage ?? defaultFtrByStage
  const docTypeAccuracy = excelData?.docTypeAccuracy ?? defaultDocTypeAccuracy
  const fprFnrTrend = excelData?.fprFnrTrend ?? defaultFprFnrTrend
  const reworkByProduct = excelData?.reworkByProduct ?? defaultReworkByProduct
  
  const filteredAccuracyTrend = useMemo(() => filterByDateRange(accuracyTrend, dateRange), [dateRange, accuracyTrend])
  const filteredFprFnr = useMemo(() => filterByDateRange(fprFnrTrend, dateRange), [dateRange, fprFnrTrend])
  const allowedDocTypes = useMemo(() => productFilter === 'All Products' ? docTypeAccuracy.map(d => d.doc) : getDocTypesForProduct(productFilter), [productFilter, docTypeAccuracy])
  const filteredDocTypes = useMemo(() => productFilter === 'All Products' ? docTypeAccuracy : docTypeAccuracy.filter(d => allowedDocTypes.includes(d.doc)), [productFilter, allowedDocTypes, docTypeAccuracy])

  const [selectedDocType, setSelectedDocType] = useState<any>(null)

  const DocumentDetailDrawer = ({ doc, onClose }: { doc: any; onClose: () => void }) => {
    return (
      <>
        <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
        <div className="fixed right-0 top-0 h-full w-96 bg-[color:var(--color-bg-card)] shadow-xl z-50 overflow-y-auto">
          <div className="sticky top-0 flex items-center justify-between p-6 border-b border-[color:var(--color-border)] bg-[color:var(--color-bg-card)]">
            <h2 className="text-lg font-bold text-[color:var(--color-text-primary)]">{doc.doc} — Accuracy Detail</h2>
            <button onClick={onClose} className="p-1 hover:bg-[color:var(--color-grey-bg)] rounded-md transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-11px text-[color:var(--color-text-muted)] uppercase font-semibold mb-1">Accuracy</p>
                <p className={`text-lg font-bold ${doc.accuracy >= 95 ? 'text-[color:var(--color-green-text)]' : doc.accuracy >= 88 ? 'text-[color:var(--color-amber-text)]' : 'text-[color:var(--color-red-text)]'}`}>
                  {doc.accuracy.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-11px text-[color:var(--color-text-muted)] uppercase font-semibold mb-1">Monthly Volume</p>
                <p className="text-lg font-bold text-[color:var(--color-text-primary)]">{doc.volume.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-11px text-[color:var(--color-text-muted)] uppercase font-semibold mb-1">Override Rate</p>
                <p className={`text-lg font-bold ${doc.overrideRate < 10 ? 'text-[color:var(--color-green-text)]' : doc.overrideRate <= 20 ? 'text-[color:var(--color-amber-text)]' : 'text-[color:var(--color-red-text)]'}`}>
                  {doc.overrideRate}%
                </p>
              </div>
              <div>
                <p className="text-11px text-[color:var(--color-text-muted)] uppercase font-semibold mb-1">Vendor</p>
                <p className="text-lg font-bold text-[color:var(--color-text-primary)]">{doc.vendor}</p>
              </div>
            </div>
            <div className="border-t border-[color:var(--color-border)] pt-4">
              <h4 className="text-sm font-bold text-[color:var(--color-text-primary)] mb-3">Top Failing Fields</h4>
              <p className="text-12px text-[color:var(--color-text-secondary)]">{doc.failingFields}</p>
            </div>
            <div className="border-t border-[color:var(--color-border)] pt-4">
              <h4 className="text-sm font-bold text-[color:var(--color-text-primary)] mb-3">Recommendation</h4>
              <div className="bg-[color:var(--color-amber-bg)] border border-[#fde68a] rounded p-3">
                <p className="text-12px text-[color:var(--color-amber-text)]">
                  {doc.accuracy < 88 ? 'Priority improvement required — consider vendor performance review and model retraining' : 'Monitor closely — target improvements in next quarterly update'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="space-y-8">
      {/* Section A: Quality Summary KPIs */}
      <div>
        <SectionHeading title="Quality Summary" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <KPICard
            label="Case-Level Accuracy"
            value={qualityKPIs.caseAccuracy.value}
            unit="%"
            target="95%"
            delta="+3.1%"
            deltaLabel="vs last quarter"
            status={qualityKPIs.caseAccuracy.status}
            helpText="% of loan applications where ALL documents are fully and correctly extracted. This is the hardest and most business-relevant accuracy measure."
          />
          <KPICard
            label="Field-Level Accuracy"
            value={qualityKPIs.fieldAccuracy.value}
            unit="%"
            target="96%"
            delta="+2.1%"
            deltaLabel="vs last quarter"
            status={qualityKPIs.fieldAccuracy.status}
            helpText="% of individual extracted data fields that exactly match ground truth. Source: weekly sampling audit N=50 applications."
          />
          <KPICard
            label="First-Time Right"
            value={qualityKPIs.ftrRate.value}
            unit="%"
            target="90%"
            delta="+6%"
            deltaLabel="vs last quarter"
            status={qualityKPIs.ftrRate.status}
          />
          <KPICard
            label="False Positive Rate"
            value={qualityKPIs.fpr.value}
            unit="%"
            target="<3%"
            delta="-2.0%"
            deltaLabel="vs 6 months ago"
            status={qualityKPIs.fpr.status}
            helpText="DI incorrectly passes a document that should have been flagged. FPR>3% means risk is leaking through."
          />
          <KPICard
            label="False Negative Rate"
            value={qualityKPIs.fnr.value}
            unit="%"
            target="<5%"
            delta="-3.0%"
            deltaLabel="vs 6 months ago"
            status={qualityKPIs.fnr.status}
            helpText="DI incorrectly rejects or flags a valid document. High FNR creates friction and erodes user trust."
          />
        </div>
      </div>

      {/* Section B: Accuracy Trends */}
      <div>
        <SectionHeading title="Accuracy Trends" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Accuracy Levels Chart */}
          <div className="lg:col-span-7">
            <ChartCard title="Extraction Accuracy — Three Levels" subtitle="Field, document, and case-level accuracy over 9 months" height={280}>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={accuracyTrend} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis domain={[70, 100]} label={{ value: '%', angle: -90, position: 'insideLeft', offset: 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: '16px' }} />
                  <ReferenceLine y={95} stroke="var(--color-grey)" strokeDasharray="4 4" label={{ value: 'Target 95%', position: 'right', fontSize: 10, fill: 'var(--color-grey)' }} />
                  <Line type="monotone" dataKey="field" stroke="var(--color-blue)" strokeWidth={2.5} dot={false} name="Field-level accuracy" />
                  <Line type="monotone" dataKey="doc" stroke="var(--color-amber)" strokeWidth={2.5} dot={false} name="Document-level accuracy" />
                  <Line type="monotone" dataKey="case" stroke="var(--color-green)" strokeWidth={2.5} dot={false} name="Case-level accuracy" />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* FTR by Stage */}
          <div className="lg:col-span-5">
            <ChartCard title="First-Time Right by Stage" subtitle="% of applications passing each stage first attempt" height={280}>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart layout="vertical" data={ftrByStage} margin={{ top: 5, right: 20, left: 120, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis type="number" domain={[0, 100]} label={{ value: '%', position: 'right', offset: 10 }} />
                  <YAxis type="category" dataKey="stage" width={115} tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" barSize={22} radius={[0, 4, 4, 0]}>
                    {ftrByStage.map((entry, index) => {
                      let color = 'var(--color-red)'
                      if (entry.stage === 'End-to-End') color = 'var(--color-red-text)'
                      else if (entry.value >= 85) color = 'var(--color-green)'
                      else if (entry.value >= 70) color = 'var(--color-amber)'
                      return <Cell key={`cell-${index}`} fill={color} />
                    })}
                  </Bar>
                  <ReferenceLine x={90} stroke="var(--color-grey)" strokeDasharray="4 4" label={{ value: 'Target 90%', fontSize: 10, fill: 'var(--color-grey)' }} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>
      </div>

      {/* Section C: Document Intelligence Detail */}
      <div>
        <SectionHeading title="Document Intelligence Detail" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Accuracy by Doc Type */}
          <div className="lg:col-span-4 bg-[color:var(--color-bg-card)] rounded-xl border border-[color:var(--color-border)] p-6">
            <h3 className="text-sm font-bold text-[color:var(--color-text-primary)] mb-1">Accuracy by Document Type</h3>
            <p className="text-xs text-[color:var(--color-text-muted)] mb-4">With volume and override rate — click for detail</p>

            <div className="overflow-x-auto">
              <table className="w-full text-12px">
                <thead className="sticky top-0 bg-[color:var(--color-bg-card)] border-b border-[color:var(--color-border)]">
                  <tr>
                    <th className="text-left px-2 py-2 font-bold text-uppercase text-10px text-[color:var(--color-text-muted)]">Document</th>
                    <th className="text-center px-2 py-2 font-bold text-uppercase text-10px text-[color:var(--color-text-muted)]">Acc.</th>
                    <th className="text-center px-2 py-2 font-bold text-uppercase text-10px text-[color:var(--color-text-muted)]">Vol.</th>
                    <th className="text-center px-2 py-2 font-bold text-uppercase text-10px text-[color:var(--color-text-muted)]">Ovr.</th>
                    <th className="text-center px-2 py-2 font-bold text-uppercase text-10px text-[color:var(--color-text-muted)]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {docTypeAccuracy.map((row, idx) => {
                    const getAccuracyColor = (val: number) => {
                      if (val >= 95) return 'text-[color:var(--color-green-text)]'
                      if (val >= 88) return 'text-[color:var(--color-amber-text)]'
                      return 'text-[color:var(--color-red-text)]'
                    }
                    const getOverrideColor = (val: number) => {
                      if (val < 10) return 'text-[color:var(--color-green-text)]'
                      if (val <= 20) return 'text-[color:var(--color-amber-text)]'
                      return 'text-[color:var(--color-red-text)]'
                    }
                    return (
                      <tr
                        key={idx}
                        className="border-b border-[color:var(--color-border)] last:border-b-0 hover:bg-[color:var(--color-blue-bg)] cursor-pointer transition-colors"
                        onClick={() => setSelectedDocType(row)}
                      >
                        <td className="px-2 py-2 text-12px font-medium text-[color:var(--color-text-primary)]">{row.doc}</td>
                        <td className={`px-2 py-2 text-center text-12px font-bold ${getAccuracyColor(row.accuracy)}`}>{row.accuracy.toFixed(1)}%</td>
                        <td className="px-2 py-2 text-center text-12px font-medium text-[color:var(--color-text-secondary)]">{(row.volume / 1000).toFixed(1)}k</td>
                        <td className={`px-2 py-2 text-center text-12px font-bold ${getOverrideColor(row.overrideRate)}`}>{row.overrideRate}%</td>
                        <td className="px-2 py-2 text-center"><StatusBadge status={row.status} /></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* FPR & FNR Trend */}
          <div className="lg:col-span-4">
            <ChartCard title="FPR & FNR Trend" subtitle="Both declining — FNR still above target" height={240}>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={fprFnrTrend} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 12]} label={{ value: '%', angle: -90, position: 'insideLeft', offset: 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: '12px' }} />
                  <ReferenceArea y1={5} y2={15} fill="var(--color-red)" fillOpacity={0.05} />
                  <ReferenceLine y={3} stroke="var(--color-green)" strokeDasharray="4 4" label={{ value: 'FPR target <3%', fontSize: 10, fill: 'var(--color-green)' }} />
                  <ReferenceLine y={5} stroke="var(--color-red)" strokeDasharray="4 4" label={{ value: 'FNR target <5%', fontSize: 10, fill: 'var(--color-red)' }} />
                  <Line type="monotone" dataKey="fpr" stroke="var(--color-blue)" strokeWidth={2.5} dot={false} name="False Positive Rate %" />
                  <Line type="monotone" dataKey="fnr" stroke="var(--color-red)" strokeWidth={2.5} dot={false} name="False Negative Rate %" />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Rework by Product */}
          <div className="lg:col-span-4">
            <ChartCard title="Rework Rate by Product" subtitle="% of applications requiring manual correction post-DI" height={240}>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart layout="vertical" data={reworkByProduct} margin={{ top: 5, right: 20, left: 90, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis type="number" domain={[0, 30]} label={{ value: '%', position: 'right', offset: 10 }} />
                  <YAxis type="category" dataKey="name" width={85} tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" barSize={24} radius={[0, 4, 4, 0]}>
                    {reworkByProduct.map((entry, index) => {
                      let color = 'var(--color-red)'
                      if (entry.value < 10) color = 'var(--color-green)'
                      else if (entry.value < 20) color = 'var(--color-amber)'
                      return <Cell key={`cell-${index}`} fill={color} />
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="border-t border-[color:var(--color-border)] mt-3 pt-3 flex items-start gap-2">
                <Info size={14} className="text-[color:var(--color-text-muted)] flex-shrink-0 mt-0.5" />
                <p className="text-11px text-[color:var(--color-text-secondary)]">
                  Avg rework adds 1.8 hrs per affected application
                </p>
              </div>
            </ChartCard>
          </div>
        </div>
      </div>

      {/* Detail Drawer */}
      {selectedDocType && <DocumentDetailDrawer doc={selectedDocType} onClose={() => setSelectedDocType(null)} />}
    </div>
  )
}
