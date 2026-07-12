'use client'

import { useState, useMemo } from 'react'
import { X, AlertCircle, CheckCircle2 } from 'lucide-react'
import { BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { SectionHeading } from '@/components/section-heading'
import { ChartCard } from '@/components/chart-card'
import { CustomTooltip } from '@/components/custom-tooltip'
import { useData } from '@/context/DataContext'
import { readinessScores as defaultReadinessScoresData } from '@/lib/data'

interface ReadinessTabProps {
  dateRange: string
  productFilter: string
}

// This function is defined here to be reusable
function transformReadinessScores(readinessScoresData: any[]) {
  return readinessScoresData.map((item: any) => ({
    stage: item.stage,
    score: item.readiness,
    blocking: item.readiness >= 70 ? 'None' : item.readiness >= 40 ? 'Minor' : 'Major',
    components: { digitisation: 75, consistency: 70, volume: 72, vendorMatch: 68, integration: 65 },
    blockingDetail: item.item || '',
  }))
}



const deploymentPipeline = [
  { name: 'PL — Sanction', jul: true, aug: false, sep: false, oct: false, nov: false, dec: false, status: 'on-track' },
  { name: 'HL — Closure', jul: true, aug: false, sep: false, oct: false, nov: false, dec: false, status: 'on-track' },
  { name: 'HL — Credit', jul: true, aug: false, sep: false, oct: false, nov: false, dec: false, status: 'delayed', delayMark: true },
  { name: 'NCL — Sanction', jul: false, aug: true, sep: false, oct: false, nov: false, dec: false, status: 'on-track' },
  { name: 'UCL — Credit', jul: false, aug: true, sep: true, oct: false, nov: false, dec: false, status: 'on-track' },
  { name: 'NCL — Closure', jul: false, aug: false, sep: true, oct: false, nov: false, dec: false, status: 'on-track' },
  { name: 'UCL — Sanction', jul: false, aug: false, sep: false, oct: true, nov: false, dec: false, status: 'on-track' },
  { name: 'Other — QDE+CPC', jul: false, aug: false, sep: false, oct: true, nov: true, dec: false, status: 'on-track' },
  { name: 'UCL — Closure', jul: false, aug: false, sep: false, oct: false, nov: true, dec: false, status: 'on-track' },
  { name: 'Other — Credit+', jul: false, aug: false, sep: false, oct: false, nov: false, dec: true, status: 'on-track' },
]

const retrainingSchedule = [
  { model: 'PL-Credit', goLive: '28 Feb 25', lastRetrain: '1 Jun 25', nextScheduled: '1 Sep 25', drift: -0.8, action: 'on-target' },
  { model: 'PL-QDE', goLive: '1 Oct 24', lastRetrain: '1 Apr 25', nextScheduled: '1 Jul 25', drift: -1.4, action: 'on-target' },
  { model: 'HL-CPC', goLive: '1 Jan 25', lastRetrain: '1 Mar 25', nextScheduled: '1 Jun 25', drift: -2.1, action: 'at-risk' },
  { model: 'PL-CPC', goLive: '1 Nov 24', lastRetrain: '1 May 25', nextScheduled: '1 Aug 25', drift: -1.1, action: 'on-target' },
  { model: 'NCL-QDE', goLive: '15 Jan 25', lastRetrain: '15 Apr 25', nextScheduled: '15 Jul 25', drift: -1.6, action: 'on-target' },
]

export function ReadinessTab({ dateRange, productFilter }: ReadinessTabProps) {
  const { data: excelData } = useData()
  const readinessScoresData = excelData?.readinessScores ?? defaultReadinessScoresData
  const readinessScores = useMemo(() => transformReadinessScores(readinessScoresData), [readinessScoresData])
  const [selectedStage, setSelectedStage] = useState<any>(null)

  const readyCount = readinessScores.filter((s: any) => s.score >= 70).length
  const prepCount = readinessScores.filter((s: any) => s.score >= 40 && s.score < 70).length
  const notReadyCount = readinessScores.filter((s: any) => s.score < 40).length

  const DetailDrawer = ({ stage, onClose }: { stage: any; onClose: () => void }) => {
    const radarData = [
      { subject: 'Digitisation', value: stage.components.digitisation },
      { subject: 'Consistency', value: stage.components.consistency },
      { subject: 'Volume', value: stage.components.volume },
      { subject: 'Vendor Match', value: stage.components.vendorMatch },
      { subject: 'Integration', value: stage.components.integration },
    ]

    return (
      <>
        <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
        <div className="fixed right-0 top-0 h-full w-96 bg-[color:var(--color-bg-card)] shadow-xl z-50 overflow-y-auto">
          <div className="sticky top-0 flex items-center justify-between p-6 border-b border-[color:var(--color-border)]">
            <h2 className="text-lg font-bold text-[color:var(--color-text-primary)]">{stage.stage} — Readiness Detail</h2>
            <button onClick={onClose} className="p-1 hover:bg-[color:var(--color-grey-bg)] rounded-md transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className={`px-4 py-2 rounded font-bold text-lg ${stage.score >= 70 ? 'bg-[color:var(--color-green-bg)] text-[color:var(--color-green-text)]' : stage.score >= 40 ? 'bg-[color:var(--color-amber-bg)] text-[color:var(--color-amber-text)]' : 'bg-[color:var(--color-red-bg)] text-[color:var(--color-red-text)]'}`}>
                {stage.score}/100
              </div>
              <div>
                <p className="text-12px font-bold text-[color:var(--color-text-muted)] uppercase">Status</p>
                <p className={`text-sm font-bold ${stage.score >= 70 ? 'text-[color:var(--color-green-text)]' : stage.score >= 40 ? 'text-[color:var(--color-amber-text)]' : 'text-[color:var(--color-red-text)]'}`}>
                  {stage.score >= 70 ? 'Ready to Deploy' : stage.score >= 40 ? 'Needs Prep' : 'Not Ready'}
                </p>
              </div>
            </div>

            {stage.blockingDetail && (
              <div className="border-t border-[color:var(--color-border)] pt-4">
                <div className="flex items-start gap-3 p-3 rounded bg-[color:var(--color-amber-bg)]">
                  <AlertCircle size={18} className="text-[color:var(--color-amber-text)] mt-1" />
                  <div>
                    <p className="text-11px font-bold text-[color:var(--color-amber-text)] uppercase mb-1">Blocking Issue</p>
                    <p className="text-12px text-[color:var(--color-amber-text)]">{stage.blockingDetail}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="border-t border-[color:var(--color-border)] pt-4">
              <h4 className="text-sm font-bold text-[color:var(--color-text-primary)] mb-3">Score Components</h4>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="var(--color-border)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar dataKey="value" stroke="var(--color-blue)" fill="var(--color-blue)" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="border-t border-[color:var(--color-border)] pt-4">
              <h4 className="text-sm font-bold text-[color:var(--color-text-primary)] mb-3">What&apos;s Needed to Advance</h4>
              <p className="text-12px text-[color:var(--color-text-secondary)]">
                {stage.score >= 70 ? 'Stage is ready for next sprint planning.' : stage.score >= 40 ? 'Resolve blocking issue + vendor alignment needed.' : 'Full readiness programme required — not in near-term roadmap.'}
              </p>
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
        <SectionHeading title="Deployment Readiness" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="bg-[color:var(--color-green-bg)] border border-[color:var(--color-green-text)] rounded-xl p-6">
            <p className="text-12px font-bold text-[color:var(--color-green-text)] uppercase mb-2">Ready to Deploy Next</p>
            <p className="text-3xl font-bold text-[color:var(--color-green-text)] mb-1">{readyCount}</p>
            <p className="text-12px text-[color:var(--color-green-text)]">Readiness score ≥70</p>
          </div>
          <div className="bg-[color:var(--color-amber-bg)] border border-[color:var(--color-amber-text)] rounded-xl p-6">
            <p className="text-12px font-bold text-[color:var(--color-amber-text)] uppercase mb-2">Need Prep Work</p>
            <p className="text-3xl font-bold text-[color:var(--color-amber-text)] mb-1">{prepCount}</p>
            <p className="text-12px text-[color:var(--color-amber-text)]">Score 40–69</p>
          </div>
          <div className="bg-[color:var(--color-red-bg)] border border-[color:var(--color-red-text)] rounded-xl p-6">
            <p className="text-12px font-bold text-[color:var(--color-red-text)] uppercase mb-2">Not Ready</p>
            <p className="text-3xl font-bold text-[color:var(--color-red-text)] mb-1">{notReadyCount}</p>
            <p className="text-12px text-[color:var(--color-red-text)]">{"Score <40"}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-[color:var(--color-bg-card)] border border-[color:var(--color-border)] rounded-xl p-4">
          <p className="text-12px font-bold text-[color:var(--color-text-muted)] uppercase mb-3">Undeployed stages ({readyCount + prepCount + notReadyCount} total)</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-3 rounded-full overflow-hidden bg-[color:var(--color-grey-bg)] flex">
              <div className={`bg-[color:var(--color-green)] h-full`} style={{ width: `${(readyCount / (readyCount + prepCount + notReadyCount)) * 100}%` }} />
              <div className={`bg-[color:var(--color-amber)] h-full`} style={{ width: `${(prepCount / (readyCount + prepCount + notReadyCount)) * 100}%` }} />
              <div className={`bg-[color:var(--color-red)] h-full`} style={{ width: `${(notReadyCount / (readyCount + prepCount + notReadyCount)) * 100}%` }} />
            </div>
            <span className="text-11px font-bold text-[color:var(--color-green-text)]">{readyCount} Ready</span>
            <span className="text-11px font-bold text-[color:var(--color-amber-text)]">{prepCount} Prep</span>
            <span className="text-11px font-bold text-[color:var(--color-red-text)]">{notReadyCount} Not</span>
          </div>
        </div>
      </div>

      {/* Section B: Readiness Ranking */}
      <div>
        <SectionHeading title="Automation Readiness by Stage" subtitle="Ranked by score — click any bar for component breakdown" />
        <ChartCard title="Readiness Scores — All Undeployed Stages" subtitle="Score out of 100 — based on digitisation, consistency, volume, vendor match, and integration complexity">
          <ResponsiveContainer width="100%" height={readinessScores.length * 44 + 80}>
            <BarChart layout="vertical" data={readinessScores.sort((a: any, b: any) => b.score - a.score)}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="stage" tick={{ fontSize: 11 }} width={140} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={24} onClick={(data: any) => setSelectedStage(data)}>
                {readinessScores.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.score >= 70 ? 'var(--color-green)' : entry.score >= 40 ? 'var(--color-amber)' : 'var(--color-red)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Section C: Planning Horizon */}
      <div>
        <SectionHeading title="Planning Horizon" />
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-[color:var(--color-bg-card)] border border-[color:var(--color-border)] rounded-xl p-6">
            <h3 className="text-sm font-bold text-[color:var(--color-text-primary)] mb-1">Deployment Pipeline — Jul to Dec 2025</h3>
            <p className="text-12px text-[color:var(--color-text-muted)] mb-4">Planned go-lives — click any item for detail</p>
            <div className="overflow-x-auto">
              <table className="w-full text-11px">
                <thead className="bg-[color:var(--color-grey-bg)] border-b border-[color:var(--color-border)]">
                  <tr>
                    <th className="text-left p-2 font-bold text-[color:var(--color-text-primary)]">Deployment</th>
                    <th className="text-center p-2 font-bold text-[color:var(--color-text-primary)]">Jul</th>
                    <th className="text-center p-2 font-bold text-[color:var(--color-text-primary)]">Aug</th>
                    <th className="text-center p-2 font-bold text-[color:var(--color-text-primary)]">Sep</th>
                    <th className="text-center p-2 font-bold text-[color:var(--color-text-primary)]">Oct</th>
                    <th className="text-center p-2 font-bold text-[color:var(--color-text-primary)]">Nov</th>
                    <th className="text-center p-2 font-bold text-[color:var(--color-text-primary)]">Dec</th>
                  </tr>
                </thead>
                <tbody>
                  {deploymentPipeline.map((dep: any, idx: number) => (
                    <tr key={idx} className="border-b border-[color:var(--color-border)] hover:bg-[color:var(--color-grey-bg)] transition-colors">
                      <td className="p-2 font-semibold text-[color:var(--color-text-primary)]">{dep.name}</td>
                      <td className="p-2 text-center">
                        {dep.jul ? <div className={`h-6 rounded ${dep.status === 'delayed' && dep.delayMark ? 'bg-[color:var(--color-amber-bg)]' : 'bg-[color:var(--color-blue-bg)]'}`}>{dep.delayMark && <span className="text-[color:var(--color-amber-text)]">★</span>}</div> : ''}
                      </td>
                      <td className="p-2 text-center">{dep.aug ? <div className="h-6 rounded bg-[color:var(--color-blue-bg)]" /> : ''}</td>
                      <td className="p-2 text-center">{dep.sep ? <div className="h-6 rounded bg-[color:var(--color-blue-bg)]" /> : ''}</td>
                      <td className="p-2 text-center">{dep.oct ? <div className="h-6 rounded bg-[color:var(--color-blue-bg)]" /> : ''}</td>
                      <td className="p-2 text-center">{dep.nov ? <div className="h-6 rounded bg-[color:var(--color-blue-bg)]" /> : ''}</td>
                      <td className="p-2 text-center">{dep.dec ? <div className="h-6 rounded bg-[color:var(--color-blue-bg)]" /> : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-[color:var(--color-bg-card)] border border-[color:var(--color-border)] rounded-xl p-6">
            <h3 className="text-sm font-bold text-[color:var(--color-text-primary)] mb-4">Model Retraining Schedule</h3>
            <div className="space-y-2">
              {retrainingSchedule.map((model: any, idx: number) => (
                <div key={idx} className="pb-3 border-b border-[color:var(--color-border)] last:border-0">
                  <p className="text-11px font-bold text-[color:var(--color-text-primary)] mb-1">{model.model}</p>
                  <div className="text-10px text-[color:var(--color-text-muted)] space-y-0.5">
                    <p>Go-Live: {model.goLive}</p>
                    <p>Last Retrain: {model.lastRetrain}</p>
                    <p>Next: {model.nextScheduled}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-11px font-bold ${model.drift > -1 ? 'text-[color:var(--color-green-text)]' : model.drift > -2 ? 'text-[color:var(--color-amber-text)]' : 'text-[color:var(--color-red-text)] font-bold'}`}>
                      Drift: {model.drift}%
                    </span>
                    {model.action === 'on-target' ? (
                      <CheckCircle2 size={12} className="text-[color:var(--color-green-text)]" />
                    ) : (
                      <AlertCircle size={12} className="text-[color:var(--color-red-text)]" />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-[color:var(--color-border)] pt-3 mt-3">
              <p className="text-10px text-[color:var(--color-text-muted)]">Models are retrained by vendor when drift exceeds −2% or on a quarterly schedule, whichever comes first.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Drawer */}
      {selectedStage && <DetailDrawer stage={selectedStage} onClose={() => setSelectedStage(null)} />}
    </div>
  )
}
