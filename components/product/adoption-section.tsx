'use client'

import { AdoptionCard } from './adoption-card'
import getAdoptionData from '@/lib/adoption-data'

export function AdoptionSection({ productName }: { productName: string }) {
  const data = getAdoptionData(productName)

  // Card 1: Total Cases Processed
  const latestCases = data.monthlyTrend[data.monthlyTrend.length - 1].cases
  const totalCasesPercentage = Math.round((latestCases / data.monthlyTarget) * 100)
  const totalCasesSegments = data.monthlyTrend.map(m => ({
    color: m.changePercent === undefined || m.changePercent > 0 ? '#16a34a' : '#9ca3af',
    width: 100 / data.monthlyTrend.length,
  }))

  const totalCasesModal = (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b-2 border-[color:var(--color-border)] sticky top-0 bg-[color:var(--color-grey-bg)]">
          <th className="text-left py-4 px-4 font-bold text-[color:var(--color-text-primary)] text-base">
            Month
          </th>
          <th className="text-right py-4 px-4 font-bold text-[color:var(--color-text-primary)] text-base">
            Cases
          </th>
          <th className="text-right py-4 px-4 font-bold text-[color:var(--color-text-primary)] text-base">
            % Change vs Previous
          </th>
        </tr>
      </thead>
      <tbody>
        {data.monthlyTrend.map((trend, idx) => (
          <tr
            key={idx}
            className={`border-b border-[color:var(--color-border)] ${
              idx % 2 === 0 ? 'bg-white' : 'bg-[#f8f9fa]'
            }`}
          >
            <td className="py-4 px-4 text-[color:var(--color-text-primary)] font-semibold">
              {trend.month}
            </td>
            <td className="py-4 px-4 text-right text-[color:var(--color-text-primary)] font-medium">
              {trend.cases.toLocaleString()}
            </td>
            <td className="py-4 px-4 text-right text-[color:var(--color-text-primary)] font-medium">
              {trend.changePercent === undefined ? '—' : `+${trend.changePercent}% MoM`}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )

  // Card 2: Scheme Coverage
  const coveredCount = data.schemes.filter(s => s.covered).length
  const totalSchemes = data.schemes.length
  const schemeCoveragePercentage = Math.round((coveredCount / totalSchemes) * 100)
  const schemeCoverageSegments = data.schemes.map(s => ({
    color: s.covered ? '#16a34a' : '#9ca3af',
    width: 100 / data.schemes.length,
  }))

  const schemeCoverageModal = (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b-2 border-[color:var(--color-border)] sticky top-0 bg-[color:var(--color-grey-bg)]">
          <th className="text-left py-4 px-4 font-bold text-[color:var(--color-text-primary)] text-base">
            Scheme Name
          </th>
          <th className="text-right py-4 px-4 font-bold text-[color:var(--color-text-primary)] text-base">
            Cases
          </th>
          <th className="text-center py-4 px-4 font-bold text-[color:var(--color-text-primary)] text-base">
            Status
          </th>
        </tr>
      </thead>
      <tbody>
        {data.schemes.map((scheme, idx) => (
          <tr
            key={idx}
            className={`border-b border-[color:var(--color-border)] ${
              idx % 2 === 0 ? 'bg-white' : 'bg-[#f8f9fa]'
            }`}
          >
            <td className="py-4 px-4 text-[color:var(--color-text-primary)] font-semibold">
              {scheme.name}
            </td>
            <td className="py-4 px-4 text-right text-[color:var(--color-text-primary)] font-medium">
              {scheme.cases.toLocaleString()}
            </td>
            <td className="py-4 px-4 text-center">
              {scheme.covered ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#22c55e] text-white shadow-sm">
                  Covered
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#f59e0b] text-white shadow-sm">
                  Not covered
                </span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )

  // Card 3: Channel Mix
  const topChannel = data.channels.reduce((max, c) => (c.percent > max.percent ? c : max), data.channels[0])
  const channelMixSegments = data.channels.map(c => ({
    color:
      c.name === 'Mobile app'
        ? '#3b82f6'
        : c.name === 'Web'
          ? '#8b5cf6'
          : '#ec4899',
    width: c.percent,
  }))

  const channelMixModal = (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b-2 border-[color:var(--color-border)] sticky top-0 bg-[color:var(--color-grey-bg)]">
          <th className="text-left py-4 px-4 font-bold text-[color:var(--color-text-primary)] text-base">
            Channel
          </th>
          <th className="text-right py-4 px-4 font-bold text-[color:var(--color-text-primary)] text-base">
            Cases
          </th>
          <th className="text-right py-4 px-4 font-bold text-[color:var(--color-text-primary)] text-base">
            % Share
          </th>
          <th className="text-left py-4 px-4 font-bold text-[color:var(--color-text-primary)] text-base">
            Proportion
          </th>
        </tr>
      </thead>
      <tbody>
        {data.channels.map((channel, idx) => (
          <tr
            key={idx}
            className={`border-b border-[color:var(--color-border)] ${
              idx % 2 === 0 ? 'bg-white' : 'bg-[#f8f9fa]'
            }`}
          >
            <td className="py-4 px-4 text-[color:var(--color-text-primary)] font-semibold">
              {channel.name}
            </td>
            <td className="py-4 px-4 text-right text-[color:var(--color-text-primary)] font-medium">
              {channel.cases.toLocaleString()}
            </td>
            <td className="py-4 px-4 text-right text-[color:var(--color-text-primary)] font-medium">
              {channel.percent}%
            </td>
            <td className="py-4 px-4">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-[color:var(--color-grey-bg)] rounded-full overflow-hidden">
                  <div
                    style={{
                      backgroundColor:
                        channel.name === 'Mobile app'
                          ? '#3b82f6'
                          : channel.name === 'Web'
                            ? '#8b5cf6'
                            : '#ec4899',
                      width: `${channel.percent}%`,
                    }}
                    className="h-full"
                  />
                </div>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[color:var(--color-text-primary)]">Adoption</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AdoptionCard
          title="Total Cases Processed"
          subtitle={`${latestCases.toLocaleString()} cases this month`}
          percentage={totalCasesPercentage}
          segments={totalCasesSegments}
          modalTitle="Total cases processed"
          modalData={totalCasesModal}
          type="total-cases"
        />

        <AdoptionCard
          title="Scheme Coverage"
          subtitle={`${coveredCount} of ${totalSchemes} schemes covered`}
          percentage={schemeCoveragePercentage}
          segments={schemeCoverageSegments}
          modalTitle="Scheme coverage"
          modalData={schemeCoverageModal}
          type="scheme-coverage"
        />

        <AdoptionCard
          title="Channel Mix"
          subtitle={`${topChannel.name} leads at ${topChannel.percent}%`}
          percentage={topChannel.percent}
          segments={channelMixSegments}
          modalTitle="Channel mix"
          modalData={channelMixModal}
          type="channel-mix"
        />
      </div>
    </div>
  )
}
