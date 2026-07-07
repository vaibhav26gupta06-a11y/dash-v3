'use client'

import { X, AlertCircle } from 'lucide-react'
import { DeployStatusChip } from './deploy-status-chip'
import { DeployStatus } from '@/lib/data'

interface DetailDrawerProps {
  isOpen: boolean
  onClose: () => void
  productLine: string
  stage: string
  detail: any
  isSupport?: boolean
}

const stageDescriptions: Record<string, string> = {
  CPC: 'Automated document completeness check, format validation, and missing document alerts.',
  Credit: 'Income extraction from ITR and salary slips, underwriting field pre-fill.',
  Ops: 'Post-sanction document verification and disbursement checklist automation.',
  Compliance: 'Regulatory document validation, KYC cross-check, and compliance flag automation.',
  Audit: 'Audit trail document tagging and sampling automation.',
}

export function DetailDrawer({
  isOpen,
  onClose,
  productLine,
  stage,
  detail,
  isSupport,
}: DetailDrawerProps) {
  if (!isOpen || !detail) return null

  const status = detail.status as DeployStatus

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
        role="presentation"
      />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label={isSupport ? `${productLine} DI Status` : `${productLine} ${stage} Stage Details`}
      >
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-[#e2e8f0] bg-white">
          <h2 className="text-lg font-bold text-[#0f172a]" id="drawer-title">
            {isSupport ? `${productLine} — DI Status` : `${productLine} — ${stage} Stage`}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close details panel"
            className="p-1 hover:bg-[#f1f5f9] rounded-md transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div>
            <DeployStatusChip status={status} />
          </div>

          <div className="border-b border-[#e2e8f0]" />

          {/* For Live or UAT: Show "What DI does here" */}
          {(status === 'live' || status === 'uat') && !isSupport && (
            <>
              <div>
                <h3 className="text-sm font-semibold text-[#0f172a] mb-2">
                  What DI does here
                </h3>
                <p className="text-sm text-[#475569]">
                  {stageDescriptions[stage] || `Automation details for ${stage} stage.`}
                </p>
              </div>

              <div className="bg-[#fffbeb] border border-[#fbbf24] rounded-lg p-4">
                <div className="flex gap-2">
                  <AlertCircle
                    size={16}
                    className="text-[#b45309] flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="text-xs font-semibold text-[#b45309] mb-1">
                      Next steps / open items
                    </p>
                    <p className="text-xs text-[#b45309]">
                      Add specific blockers and owner for this cell here.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* For WIP or Under Discussion: Show info card */}
          {(status === 'wip' || status === 'underdiscussion') && !isSupport && (
            <>
              <div className="bg-[#fffbeb] border border-[#fbbf24] rounded-lg p-4">
                <div className="flex gap-2">
                  <AlertCircle
                    size={16}
                    className="text-[#b45309] flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="text-xs font-semibold text-[#b45309] mb-1">
                      {status === 'wip' ? 'In Development' : 'Under Discussion'}
                    </p>
                    <p className="text-xs text-[#b45309]">
                      This combination is{' '}
                      {status === 'wip' ? 'WIP' : 'under discussion'}.
                      Expected details: target date, vendor, and scope to be added.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* For Support Functions */}
          {isSupport && (
            <>
              <div>
                <p className="text-sm text-[#475569]">
                  Support functions apply across all loan products. This DI capability is{' '}
                  <span className="font-semibold">{status}</span> for{' '}
                  <span className="font-semibold">{productLine}</span>.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
