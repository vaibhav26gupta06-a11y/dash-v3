'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useData } from '@/context/DataContext'
import {
  LOAN_PRODUCTS as defaultLoanProducts,
  DEPLOYMENT_MATRIX as defaultDeploymentMatrix,
  SUPPORT_FUNCTIONS_STATUS as defaultSupportFunctionsStatus,
  STAGES as defaultStages,
  DeploymentStatus,
  Stage,
} from '@/lib/data'

// Convert product name to kebab-case slug
function getProductSlug(productName: string): string {
  return productName
    .toLowerCase()
    .replace(/[()]/g, '') // Remove parentheses
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
}

interface CoverageTabProps {
  dateRange: string
  productFilter: string
}

const STATUS_COLORS: Record<DeploymentStatus, { bg: string; text: string; dot: string }> = {
  'Live': { bg: '#dcfce7', text: '#15803d', dot: '#16a34a' },
  'UAT': { bg: '#dbeafe', text: '#1d4ed8', dot: '#2563eb' },
  'WIP': { bg: '#fef3c7', text: '#b45309', dot: '#f59e0b' },
  'Under discussion': { bg: '#f3e8ff', text: '#6b21a8', dot: '#a855f7' },
  'Not planned': { bg: '#f5f5f5', text: '#6b7280', dot: '#9ca3af' },
}

interface Card {
  id: string
  name: string
  stage?: Stage
  status: DeploymentStatus
  isSupport: boolean
}

export function CoverageTab({ dateRange, productFilter }: CoverageTabProps) {
  const { data: excelData } = useData()
  const LOAN_PRODUCTS = excelData?.LOAN_PRODUCTS ?? defaultLoanProducts
  const DEPLOYMENT_MATRIX = excelData?.DEPLOYMENT_MATRIX ?? defaultDeploymentMatrix
  const SUPPORT_FUNCTIONS_STATUS = excelData?.SUPPORT_FUNCTIONS_STATUS ?? defaultSupportFunctionsStatus
  const STAGES = excelData?.STAGES ?? defaultStages
  const router = useRouter()
  const [selectedFilter, setSelectedFilter] = useState<DeploymentStatus | 'All'>('All')

  const handleCardClick = (card: Card) => {
    // Only Live and UAT loan product cards are clickable
    if (!card.isSupport && (card.status === 'Live' || card.status === 'UAT') && card.stage) {
      const slug = getProductSlug(card.name)
      router.push(`/product/${slug}?stage=${card.stage}`)
    }
  }

  // Build cards from data
  const allCards: Card[] = useMemo(() => {
    const cards: Card[] = []

    // Loan product cards
    LOAN_PRODUCTS.forEach(product => {
      STAGES.forEach(stage => {
        const status = DEPLOYMENT_MATRIX[product]?.[stage] || 'Not planned'
        cards.push({
          id: `${product}-${stage}`,
          name: product,
          stage,
          status,
          isSupport: false,
        })
      })
    })

    // Support function cards
    Object.entries(SUPPORT_FUNCTIONS_STATUS).forEach(([name, status]) => {
      cards.push({
        id: name,
        name,
        status,
        isSupport: true,
      })
    })

    return cards
  }, [])

  // Filter cards
  const filteredCards = useMemo(() => {
    return allCards.filter(card => {
      if (selectedFilter === 'All') return true
      return card.status === selectedFilter
    })
  }, [allCards, selectedFilter])

  // Group cards
  const loanProductCards = filteredCards.filter(c => !c.isSupport)
  const supportFunctionCards = filteredCards.filter(c => c.isSupport)

  // Count statuses for filter pills
  const statusCounts = useMemo(() => {
    const counts: Record<DeploymentStatus | 'All', number> = {
      'All': allCards.length,
      'Live': 0,
      'UAT': 0,
      'WIP': 0,
      'Under discussion': 0,
      'Not planned': 0,
    }
    allCards.forEach(card => {
      counts[card.status]++
    })
    return counts
  }, [allCards])

  // Calculate summary metrics
  const cellsLive = allCards.filter(c => c.status === 'Live').length
  const cellsUAT = allCards.filter(c => c.status === 'UAT').length
  const cellsWIP = allCards.filter(c => c.status === 'WIP').length
  const totalPlannedCells = cellsLive + cellsUAT + cellsWIP + allCards.filter(c => c.status === 'Under discussion').length
  const liveUATCoveragePct = totalPlannedCells > 0 ? Math.round(((cellsLive + cellsUAT) / 60) * 100) : 0
  const supportFunctionsLive = Object.values(SUPPORT_FUNCTIONS_STATUS).filter(s => s === 'Live').length
  const productsFullyUnplanned = LOAN_PRODUCTS.filter(product =>
    STAGES.every(stage => DEPLOYMENT_MATRIX[product]?.[stage] === 'Not planned')
  ).length

  return (
    <div className="space-y-6">
      {/* Coverage Summary Cards */}
      <div>
        <h2 className="text-lg font-bold text-[#0f172a] mb-4">Coverage Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: Cells Live */}
          <div className="rounded-xl border-2 border-[#16a34a] bg-[#f0fdf4] p-6">
            <h3 className="text-sm font-semibold text-[#0f172a] mb-2">Cells Live</h3>
            <p className="text-4xl font-bold text-[#0f172a]">{cellsLive}</p>
            <p className="text-xs text-[#64748b] mt-2">Of 60 loan product×stage combinations</p>
            <p className="text-xs font-semibold text-[#16a34a] mt-3">On Target</p>
          </div>

          {/* Card 2: In UAT */}
          <div className="rounded-xl border-2 border-[#cbd5e1] bg-white p-6">
            <h3 className="text-sm font-semibold text-[#0f172a] mb-2">In UAT</h3>
            <p className="text-4xl font-bold text-[#0f172a]">{cellsUAT}</p>
            <p className="text-xs text-[#64748b] mt-2">Deployed, in user acceptance testing</p>
            <p className="text-xs font-semibold text-[#b45309] mt-3">Watch</p>
          </div>

          {/* Card 3: WIP */}
          <div className="rounded-xl border-2 border-[#cbd5e1] bg-white p-6">
            <h3 className="text-sm font-semibold text-[#0f172a] mb-2">WIP — In Development</h3>
            <p className="text-4xl font-bold text-[#0f172a]">{cellsWIP}</p>
            <p className="text-xs text-[#64748b] mt-2">Being built right now</p>
            <p className="text-xs font-semibold text-[#b45309] mt-3">Watch</p>
          </div>

          {/* Card 4: Live + UAT Coverage % */}
          <div className="rounded-xl border-2 border-[#dc2626] bg-[#fef2f2] p-6">
            <h3 className="text-sm font-semibold text-[#0f172a] mb-2">Live + UAT Coverage %</h3>
            <p className="text-4xl font-bold text-[#0f172a]">{liveUATCoveragePct}%</p>
            <p className="text-xs text-[#64748b] mt-2">Of all 60 planned combinations</p>
            <p className="text-xs text-[#64748b]">Target: 60%</p>
            <p className="text-xs font-semibold text-[#dc2626] mt-3">At Risk</p>
          </div>

          {/* Card 5: Support Functions Live */}
          <div className="rounded-xl border-2 border-[#16a34a] bg-[#f0fdf4] p-6">
            <h3 className="text-sm font-semibold text-[#0f172a] mb-2">Support Functions Live</h3>
            <p className="text-4xl font-bold text-[#0f172a]">{supportFunctionsLive}</p>
            <p className="text-xs text-[#64748b] mt-2">Of 6 support functions</p>
            <p className="text-xs font-semibold text-[#16a34a] mt-3">On Target</p>
          </div>

          {/* Card 6: Products Fully Unplanned */}
          <div className="rounded-xl border-2 border-[#dc2626] bg-[#fef2f2] p-6">
            <h3 className="text-sm font-semibold text-[#0f172a] mb-2">Products Fully Unplanned</h3>
            <p className="text-4xl font-bold text-[#0f172a]">{productsFullyUnplanned}</p>
            <p className="text-xs text-[#64748b] mt-2">LAS and CV/CEQ — confirm scope</p>
            <p className="text-xs font-semibold text-[#dc2626] mt-3">At Risk</p>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex gap-2 flex-wrap">
        {(['All', 'Live', 'UAT', 'WIP', 'Under discussion', 'Not planned'] as const).map(status => (
          <button
            key={status}
            onClick={() => setSelectedFilter(status)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              selectedFilter === status
                ? 'bg-[#0f172a] text-white'
                : 'bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]'
            }`}
          >
            {status}
            <span className="ml-1.5 text-[10px] font-semibold">({statusCounts[status]})</span>
          </button>
        ))}
      </div>

      {/* Loan products section */}
      <div>
        <h2 className="text-sm font-semibold text-[#0f172a] mb-3">
          Loan products
          <span className="text-[#94a3b8] font-normal ml-2">({loanProductCards.length})</span>
        </h2>
        <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
          {loanProductCards.map(card => (
            <Card key={card.id} card={card} colors={STATUS_COLORS[card.status]} onClick={() => handleCardClick(card)} />
          ))}
        </div>
      </div>

      {/* Support functions section */}
      <div>
        <h2 className="text-sm font-semibold text-[#0f172a] mb-3">
          Support functions
          <span className="text-[#94a3b8] font-normal ml-2">({supportFunctionCards.length})</span>
        </h2>
        <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
          {supportFunctionCards.map(card => (
            <Card key={card.id} card={card} colors={STATUS_COLORS[card.status]} />
          ))}
        </div>
      </div>
    </div>
  )
}

interface CardProps {
  card: Card
  colors: { bg: string; text: string; dot: string }
  onClick?: () => void
}

function Card({ card, colors, onClick }: CardProps) {
  // Determine if card is clickable (only Live/UAT loan products)
  const isClickable = !card.isSupport && (card.status === 'Live' || card.status === 'UAT')
  
  return (
    <div
      onClick={isClickable ? onClick : undefined}
      className={`rounded-lg border border-[#e2e8f0] p-3 flex flex-col gap-2 transition-all ${
        isClickable
          ? 'cursor-pointer hover:shadow-md hover:border-[#cbd5e1] hover:scale-105'
          : 'opacity-60 cursor-default'
      }`}
      style={{ backgroundColor: colors.bg }}
    >
      {/* Top row: stage label and status dot */}
      <div className="flex items-start justify-between">
        {card.stage && (
          <span className="text-[10px] font-semibold text-[#64748b] uppercase">{card.stage}</span>
        )}
        <div
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: colors.dot }}
        />
      </div>

      {/* Product/function name */}
      <p className="text-xs font-medium text-[#0f172a] line-clamp-2">{card.name}</p>

      {/* Status badge at bottom */}
      <div className="mt-auto">
        <span
          className="inline-flex items-center px-2 py-1 rounded text-[10px] font-semibold"
          style={{ color: colors.text }}
        >
          {card.status}
        </span>
      </div>
    </div>
  )
}
