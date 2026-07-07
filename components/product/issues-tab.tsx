'use client'

import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { ProductDetailData } from '@/lib/product-detail-data'

interface IssuesTabProps {
  data: ProductDetailData['issues']
}

export function IssuesTab({ data }: IssuesTabProps) {
  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Open Issues */}
        <div className="rounded-xl border-2 border-[#fbbf24] bg-[#fffbeb] p-6">
          <p className="text-sm font-semibold text-[#b45309] mb-2">Open issues</p>
          <p className="text-4xl font-bold text-[#0f172a]">{data.openCount}</p>
        </div>

        {/* Closed Issues */}
        <div className="rounded-xl border-2 border-[#16a34a] bg-[#f0fdf4] p-6">
          <p className="text-sm font-semibold text-[#15803d] mb-2">Closed issues</p>
          <p className="text-4xl font-bold text-[#0f172a]">{data.closedCount}</p>
        </div>
      </div>

      {/* Issues Table */}
      <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)]">
        <div className="px-6 py-4">
          <h3 className="text-lg font-semibold text-[color:var(--color-text-primary)] mb-4">
            All issues ({data.list.length})
          </h3>

          {data.list.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[color:var(--color-border)]">
                    <th className="text-left py-3 px-4 font-semibold text-sm text-[color:var(--color-text-secondary)]">
                      Issue ID
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-[color:var(--color-text-secondary)]">
                      Summary
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-[color:var(--color-text-secondary)]">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-[color:var(--color-text-secondary)]">
                      Raised date
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-[color:var(--color-text-secondary)]">
                      Resolved date
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-sm text-[color:var(--color-text-secondary)]">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.list.map((issue, idx) => (
                    <tr
                      key={issue.id}
                      className={`border-b border-[color:var(--color-border)] hover:bg-[color:var(--color-grey-bg)] ${
                        idx === data.list.length - 1 ? 'border-b-0' : ''
                      }`}
                    >
                      <td className="py-3 px-4 text-sm font-semibold text-[color:var(--color-text-primary)]">
                        {issue.id}
                      </td>
                      <td className="py-3 px-4 text-sm text-[color:var(--color-text-primary)]">{issue.summary}</td>
                      <td className="py-3 px-4 text-sm">
                        {issue.status === 'Open' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#fef3c7] text-[#b45309]">
                            Open
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#dcfce7] text-[#15803d]">
                            Closed
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-[color:var(--color-text-secondary)]">
                        {new Date(issue.raisedDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-[color:var(--color-text-secondary)]">
                        {issue.resolvedDate ? new Date(issue.resolvedDate).toLocaleDateString() : '—'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Link
                          href={`#`}
                          className="inline-flex items-center gap-1 text-sm font-medium text-[#3b82f6] hover:text-[#2563eb] transition-colors"
                        >
                          View
                          <ExternalLink size={14} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-sm text-[color:var(--color-text-muted)]">No issues found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
