'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ProductDetailData } from '@/lib/product-detail-data'

interface EnhancementTabProps {
  data: ProductDetailData['enhancement']
}

export function EnhancementTab({ data }: EnhancementTabProps) {
  const [expandedChart, setExpandedChart] = useState(false)

  const formatCurrency = (value: number, currency: string) => {
    if (currency === 'INR') {
      if (value >= 10000000) {
        return `₹${(value / 10000000).toFixed(1)}Cr`
      }
      if (value >= 100000) {
        return `₹${(value / 100000).toFixed(1)}L`
      }
      return `₹${value.toLocaleString()}`
    }
    return `${value.toLocaleString()}`
  }

  return (
    <div className="space-y-6">
      {/* Month-on-Month Enhancements */}
      <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)]">
        <button
          onClick={() => setExpandedChart(!expandedChart)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-[color:var(--color-grey-bg)] transition-colors"
        >
          <div className="text-left">
            <h3 className="text-lg font-semibold text-[color:var(--color-text-primary)]">
              Enhancements (month-on-month)
            </h3>
          </div>
          <ChevronDown
            size={20}
            className={`text-[color:var(--color-text-muted)] transition-transform ${
              expandedChart ? 'rotate-180' : ''
            }`}
          />
        </button>

        <div className="px-6 py-4 border-t border-[color:var(--color-border)]">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.monthOnMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-text-muted)" />
              <YAxis stroke="var(--color-text-muted)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'var(--color-text-primary)' }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {expandedChart && (
          <div className="border-t border-[color:var(--color-border)] px-6 py-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[color:var(--color-border)]">
                    <th className="text-left py-3 px-4 font-semibold text-sm text-[color:var(--color-text-secondary)]">
                      Month
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-[color:var(--color-text-secondary)]">
                      Enhancement description
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-[color:var(--color-text-secondary)]">
                      Raised date
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-[color:var(--color-text-secondary)]">
                      Delivered date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.details.map((detail, idx) => (
                    <tr
                      key={`${detail.month}-${idx}`}
                      className={`border-b border-[color:var(--color-border)] hover:bg-[color:var(--color-grey-bg)] ${
                        idx === data.details.length - 1 ? 'border-b-0' : ''
                      }`}
                    >
                      <td className="py-3 px-4 text-sm text-[color:var(--color-text-primary)]">{detail.month}</td>
                      <td className="py-3 px-4 text-sm text-[color:var(--color-text-primary)]">
                        {detail.description}
                      </td>
                      <td className="py-3 px-4 text-sm text-[color:var(--color-text-secondary)]">
                        {new Date(detail.raisedDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-[color:var(--color-text-secondary)]">
                        {new Date(detail.deliveredDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Benefits Section */}
      <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)]">
        <div className="px-6 py-4">
          <h3 className="text-lg font-semibold text-[color:var(--color-text-primary)] mb-4">Benefits</h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[color:var(--color-border)]">
                  <th className="text-left py-3 px-4 font-semibold text-sm text-[color:var(--color-text-secondary)]">
                    Benefit metric
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-[color:var(--color-text-secondary)]">
                    Definition
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-sm text-[color:var(--color-text-secondary)]">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[color:var(--color-border)]">
                  <td className="py-3 px-4 font-semibold text-sm text-[color:var(--color-text-primary)]">FTR</td>
                  <td className="py-3 px-4 text-sm text-[color:var(--color-text-secondary)]">
                    {data.benefits.ftr.definition}
                  </td>
                  <td className="py-3 px-4 text-right text-sm font-semibold text-[color:var(--color-text-primary)]">
                    {data.benefits.ftr.value}{data.benefits.ftr.isPercentage ? '%' : ''}
                  </td>
                </tr>
                <tr className="border-b border-[color:var(--color-border)]">
                  <td className="py-3 px-4 font-semibold text-sm text-[color:var(--color-text-primary)]">NFTR</td>
                  <td className="py-3 px-4 text-sm text-[color:var(--color-text-secondary)]">
                    {data.benefits.nftr.definition}
                  </td>
                  <td className="py-3 px-4 text-right text-sm font-semibold text-[color:var(--color-text-primary)]">
                    {data.benefits.nftr.value}{data.benefits.nftr.isPercentage ? '%' : ''}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-sm text-[color:var(--color-text-primary)]">
                    Cost Benefit
                  </td>
                  <td className="py-3 px-4 text-sm text-[color:var(--color-text-secondary)]">
                    {data.benefits.costBenefit.definition}
                  </td>
                  <td className="py-3 px-4 text-right text-sm font-semibold text-[color:var(--color-text-primary)]">
                    {formatCurrency(data.benefits.costBenefit.value, data.benefits.costBenefit.currency)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Technical Section */}
      <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)]">
        <div className="px-6 py-4">
          <h3 className="text-lg font-semibold text-[color:var(--color-text-primary)] mb-4">Technical</h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[color:var(--color-border)]">
                  <th className="text-left py-3 px-4 font-semibold text-sm text-[color:var(--color-text-secondary)]">
                    Technical metric
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-sm text-[color:var(--color-text-secondary)]">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[color:var(--color-border)]">
                  <td className="py-3 px-4 text-sm text-[color:var(--color-text-primary)]">Token consumption</td>
                  <td className="py-3 px-4 text-right text-sm font-semibold text-[color:var(--color-text-primary)]">
                    {data.technical.tokenConsumption.toLocaleString()} tokens/day
                  </td>
                </tr>
                <tr className="border-b border-[color:var(--color-border)]">
                  <td className="py-3 px-4 text-sm text-[color:var(--color-text-primary)]">Processing time per case</td>
                  <td className="py-3 px-4 text-right text-sm font-semibold text-[color:var(--color-text-primary)]">
                    {data.technical.processingTimePerCase} seconds
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm text-[color:var(--color-text-primary)]">Uptime / Downtime %</td>
                  <td className="py-3 px-4 text-right text-sm font-semibold text-[color:var(--color-text-primary)]">
                    {data.technical.uptime}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
