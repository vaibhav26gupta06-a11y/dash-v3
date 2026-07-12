'use client'

import { useState, useMemo } from 'react'
import { X } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, ComposedChart, Line, YAxis, XAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ReferenceArea, ResponsiveContainer, Cell } from 'recharts'
import { filterByDateRange } from '@/lib/filterData'
import { useData } from '@/context/DataContext'
import { KPICard } from '@/components/kpi-card'
import { SectionHeading } from '@/components/section-heading'
import { ChartCard } from '@/components/chart-card'
import { CustomTooltip } from '@/components/custom-tooltip'
import { costKPIs as defaultCostKPIs, costByProduct as defaultCostByProduct, savingsTrend as defaultSavingsTrend, vendors as defaultVendors } from '@/lib/data'

interface CostTabProps {
  dateRange: string
  productFilter: string
}

export function CostTab({ dateRange, productFilter }: CostTabProps) {
  const { data: excelData } = useData()
  const costKPIs = excelData?.costKPIs ?? defaultCostKPIs
  const costByProduct = excelData?.costByProduct ?? defaultCostByProduct
  const savingsTrend = excelData?.savingsTrend ?? defaultSavingsTrend
  const vendors = excelData?.vendors ?? defaultVendors
  
  const filteredSavingsTrend = useMemo(() => filterByDateRange(savingsTrend, dateRange), [dateRange, savingsTrend])
  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  const CostDetailDrawer = ({ product, onClose }: { product: any; onClose: () => void }) => {
    const saving = product.preDI - product.postDI
    const savingPct = ((saving / product.preDI) * 100).toFixed(1)

    return (
      <>
        <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
        <div className="fixed right-0 top-0 h-full w-96 bg-[color:var(--color-bg-card)] shadow-xl z-50 overflow-y-auto">
          <div className="sticky top-0 flex items-center justify-between p-6 border-b border-[color:var(--color-border)] bg-[color:var(--color-bg-card)]">
            <h2 className="text-lg font-bold text-[color:var(--color-text-primary)]">{product.name} — Cost Breakdown</h2>
            <button onClick={onClose} className="p-1 hover:bg-[color:var(--color-grey-bg)] rounded-md transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[color:var(--color-grey-bg)] rounded-lg p-4">
                <p className="text-11px text-[color:var(--color-text-muted)] uppercase font-semibold mb-3">Pre-DI</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-12px">
                    <span className="text-[color:var(--color-text-secondary)]">Staff cost</span>
                    <span className="font-bold text-[color:var(--color-text-primary)]">₹{product.breakdown.staffPre}</span>
                  </div>
                  <div className="flex justify-between text-12px">
                    <span className="text-[color:var(--color-text-secondary)]">Rework</span>
                    <span className="font-bold text-[color:var(--color-text-primary)]">₹{product.breakdown.reworkPre}</span>
                  </div>
                  <div className="border-t border-[color:var(--color-border)] pt-2 mt-2 flex justify-between text-12px font-bold">
                    <span>Total</span>
                    <span className="text-[color:var(--color-text-primary)]">₹{product.preDI}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[color:var(--color-blue-bg)] rounded-lg p-4">
                <p className="text-11px text-[color:var(--color-text-muted)] uppercase font-semibold mb-3">Post-DI</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-12px">
                    <span className="text-[color:var(--color-text-secondary)]">Staff cost</span>
                    <span className="font-bold text-[color:var(--color-text-primary)]">₹{product.breakdown.staffPost}</span>
                  </div>
                  <div className="flex justify-between text-12px">
                    <span className="text-[color:var(--color-text-secondary)]">Vendor API</span>
                    <span className="font-bold text-[color:var(--color-text-primary)]">₹{product.breakdown.vendorPost}</span>
                  </div>
                  <div className="flex justify-between text-12px">
                    <span className="text-[color:var(--color-text-secondary)]">Rework</span>
                    <span className="font-bold text-[color:var(--color-text-primary)]">₹{product.breakdown.reworkPost}</span>
                  </div>
                  <div className="border-t border-[color:var(--color-border)] pt-2 mt-2 flex justify-between text-12px font-bold">
                    <span>Total</span>
                    <span className="text-[color:var(--color-text-primary)]">₹{product.postDI}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[color:var(--color-green-bg)] border border-[color:var(--color-green)] rounded-lg p-4 text-center">
              <p className="text-11px text-[color:var(--color-green-text)] uppercase font-semibold mb-1">Saving per Application</p>
              <p className="text-2xl font-bold text-[color:var(--color-green-text)]">₹{saving} ({savingPct}% reduction)</p>
            </div>
          </div>
        </div>
      </>
    )
  }

  const investmentData = useMemo(() => filteredSavingsTrend.map((entry, idx) => ({
    month: entry.month,
    investment: 231,
    cumulative: entry.cumulative,
  })), [filteredSavingsTrend])

  return (
    <div className="space-y-8">
      {/* Section A: KPI Cards */}
      <div>
        <SectionHeading title="Business Impact Summary" />
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <KPICard
            label="Cost Per Application"
            value={`₹${costKPIs.costPerApp.value}`}
            unit=""
            target={`₹${costKPIs.costPerApp.target}`}
            delta="−41%"
            deltaLabel="reduction vs pre-DI"
            status={costKPIs.costPerApp.status}
            helpText="Total cost to process one application = staff time + vendor API cost + rework cost."
            subtitle={`vs ₹${costKPIs.costPerApp.preDI} pre-DI`}
          />
          <KPICard
            label="Total Savings to Date"
            value="₹5.44 Cr"
            unit=""
            status="on-target"
            subtitle="Since programme start Oct 2024"
          />
          <KPICard
            label="Programme ROI"
            value={costKPIs.roi.value}
            unit="%"
            status="on-target"
            subtitle="On total DI programme spend of ₹2.31 Cr"
          />
          <KPICard
            label="Payback Period"
            value="8 months"
            unit=""
            status="on-target"
            subtitle="Achieved Feb 2025 — 1 month ahead of plan"
          />
          <KPICard
            label="Rework Cost Avoided"
            value="₹68L"
            unit="/month"
            status="on-target"
            subtitle="Based on FTR improvement × rework cost per case"
          />
        </div>
      </div>

      {/* Section B: Cost Analysis Charts */}
      <div>
        <SectionHeading title="Cost Analysis" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ChartCard title="Cost Per Application — Pre vs Post DI" subtitle="By product line — click a bar for full cost breakdown">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={costByProduct} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(1)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="preDI" name="Pre-DI Cost (₹)" fill="var(--color-grey)" radius={[4, 4, 0, 0]} barSize={28}>
                    {costByProduct.map((entry, index) => {
                      const opacity = productFilter === 'All Products' || entry.name === productFilter ? 1 : 0.35
                      return <Cell key={`pre-${index}`} fillOpacity={opacity} />
                    })}
                  </Bar>
                  <Bar dataKey="postDI" name="Post-DI Cost (₹)" fill="var(--color-blue)" radius={[4, 4, 0, 0]} barSize={28} onClick={(data) => setSelectedProduct(data)} cursor="pointer">
                    {costByProduct.map((entry, index) => {
                      const opacity = productFilter === 'All Products' || entry.name === productFilter ? 1 : 0.35
                      return <Cell key={`post-${index}`} fillOpacity={opacity} />
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <ChartCard title="Cumulative Savings" subtitle="Monthly savings (bars) and cumulative total (line)">
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={filteredSavingsTrend} margin={{ top: 5, right: 60, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-green)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-green)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="left" label={{ value: '₹L', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: '₹L', angle: 90, position: 'insideRight' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <ReferenceArea x1="Oct 24" x2="Feb 25" fill="var(--color-grey)" fillOpacity={0.08} />
                <ReferenceLine x="Feb 25" stroke="var(--color-amber)" strokeDasharray="3 3" label={{ value: 'Payback achieved', position: 'top', fontSize: 10 }} />
                <Bar yAxisId="left" dataKey="monthly" fill="var(--color-blue)" opacity={0.7} radius={[4, 4, 0, 0]} barSize={24} name="Monthly Savings (₹L)" />
                <Area yAxisId="right" dataKey="cumulative" stroke="var(--color-green)" strokeWidth={2.5} fill="url(#savingsGradient)" name="Cumulative (₹L)" />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Cost Breakdown Card — Show when product is filtered */}
        {productFilter !== 'All Products' && (
          <div className="mt-6 rounded-xl border border-[color:var(--color-border)] bg-[#f0f9ff] p-6">
            {(() => {
              const product = costByProduct.find(p => p.name === productFilter)
              if (!product) {
                return (
                  <p className="text-sm text-[#475569]">
                    Document mapping not yet defined for this product — showing full cost data.
                  </p>
                )
              }
              const saving = product.preDI - product.postDI
              return (
                <div>
                  <h3 className="text-sm font-bold text-[#0f172a] mb-4">Cost Breakdown for {product.name}</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-xs uppercase font-semibold text-[#64748b] mb-2">Staff Pre-DI</p>
                      <p className="text-lg font-bold text-[#0f172a]">₹{product.breakdown.staffPre}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-xs uppercase font-semibold text-[#64748b] mb-2">Staff Post-DI</p>
                      <p className="text-lg font-bold text-[#16a34a]">₹{product.breakdown.staffPost}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-xs uppercase font-semibold text-[#64748b] mb-2">Vendor Post-DI</p>
                      <p className="text-lg font-bold text-[#2563eb]">₹{product.breakdown.vendorPost}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-xs uppercase font-semibold text-[#64748b] mb-2">Rework Pre-DI</p>
                      <p className="text-lg font-bold text-[#0f172a]">₹{product.breakdown.reworkPre}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-xs uppercase font-semibold text-[#64748b] mb-2">Rework Post-DI</p>
                      <p className="text-lg font-bold text-[#16a34a]">₹{product.breakdown.reworkPost}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between pt-4 border-t border-[#cbd5e1]">
                    <span className="text-sm font-semibold text-[#0f172a]">Total Savings:</span>
                    <span className="text-lg font-bold text-[#16a34a]">₹{saving}</span>
                  </div>
                </div>
              )
            })()}
          </div>
        )}
      </div>

      {/* Section C: Vendor Commercial Analysis */}
      <div>
        <SectionHeading title="Vendor Commercial Analysis" />
        <div className="bg-[color:var(--color-bg-card)] rounded-xl border border-[color:var(--color-border)] p-6">
          <div className="mb-6">
            <h3 className="text-14px font-bold text-[color:var(--color-text-primary)] mb-1">Vendor Spend vs Value Index</h3>
            <p className="text-12px text-[color:var(--color-text-muted)]">
              Value Index = (Accuracy × 0.4) + (Adoption × 0.3) + (1 − Cost Share × 0.3) × 10 — Higher is better
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[color:var(--color-border)] bg-[color:var(--color-grey-bg)]">
                  <th className="text-left text-11px uppercase font-semibold text-[color:var(--color-text-muted)] py-3 px-4">Vendor</th>
                  <th className="text-left text-11px uppercase font-semibold text-[color:var(--color-text-muted)] py-3 px-4">Monthly Spend</th>
                  <th className="text-left text-11px uppercase font-semibold text-[color:var(--color-text-muted)] py-3 px-4">Accuracy</th>
                  <th className="text-left text-11px uppercase font-semibold text-[color:var(--color-text-muted)] py-3 px-4">Value Index</th>
                  <th className="text-left text-11px uppercase font-semibold text-[color:var(--color-text-muted)] py-3 px-4">Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((vendor) => {
                  let valueColor = 'text-[color:var(--color-green-text)] bg-[color:var(--color-green-bg)]'
                  if (vendor.valueIndex < 5) {
                    valueColor = 'text-[color:var(--color-red-text)] bg-[color:var(--color-red-bg)]'
                  } else if (vendor.valueIndex < 8) {
                    valueColor = 'text-[color:var(--color-amber-text)] bg-[color:var(--color-amber-bg)]'
                  }

                  return (
                    <tr key={vendor.name} className="border-b border-[color:var(--color-border)] hover:bg-[color:var(--color-grey-bg)] transition-colors">
                      <td className="text-13px font-semibold text-[color:var(--color-text-primary)] py-4 px-4">{vendor.name}</td>
                      <td className="text-13px text-[color:var(--color-text-secondary)] py-4 px-4">{vendor.spend}</td>
                      <td className="text-13px font-semibold text-[color:var(--color-text-primary)] py-4 px-4">{vendor.accuracy}%</td>
                      <td className="text-13px font-semibold py-4 px-4">
                        <span className={`rounded-full px-2 py-1 ${valueColor}`}>{vendor.valueIndex.toFixed(1)}</span>
                      </td>
                      <td className="text-13px text-[color:var(--color-text-secondary)] py-4 px-4">{vendor.recommendation}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Section D: ROI Timeline */}
      <div>
        <SectionHeading title="Investment vs Returns" />
        <ChartCard title="Programme Investment vs Cumulative Savings" subtitle="Payback achieved Feb 2025 — programme now in net gain zone">
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={investmentData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="savingsGradientROI" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-green)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-green)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(value) => `₹${value}L`} label={{ value: '₹ Lakhs', angle: -90, position: 'insideLeft' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <ReferenceArea x1="Feb 25" x2="Jun 25" fill="var(--color-green)" fillOpacity={0.06} label={{ value: 'Net gain zone', position: 'insideTopLeft', fontSize: 11, fill: 'var(--color-green-text)' }} />
              <ReferenceLine x="Feb 25" stroke="var(--color-amber)" strokeWidth={2} label={{ value: 'Payback point', position: 'top', fontSize: 11, fill: 'var(--color-amber-text)', fontWeight: 600 }} />
              <Line dataKey="investment" stroke="var(--color-red)" strokeDasharray="6 3" strokeWidth={2} name="Total Programme Spend" dot={false} />
              <Area dataKey="cumulative" stroke="var(--color-green)" strokeWidth={2.5} fill="url(#savingsGradientROI)" name="Cumulative Savings" />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Detail Drawer */}
      {selectedProduct && <CostDetailDrawer product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </div>
  )
}
