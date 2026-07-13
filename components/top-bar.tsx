'use client'

import { Bell, Download, Upload, RefreshCw, CheckCircle, ChevronDown, Clock, AlertCircle, Lock } from 'lucide-react'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useData } from '@/context/DataContext'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/toast-provider'

interface TopBarProps {
  activeTab: string
  dateRange: string
  onDateRangeChange: (range: string) => void
  productFilter: string
  onProductFilterChange: (filter: string) => void
  isCollapsed: boolean
}

const tabNames: Record<string, string> = {
  overview: 'Programme Overview',
  coverage: 'Automation Coverage',
  adoption: 'Adoption',
  quality: 'Quality & Accuracy',
  efficiency: 'Process Efficiency',
  cost: 'Cost & Business',
  vendor: 'Vendor & Ops Health',
  readiness: 'Readiness & Pipeline',
}

export function TopBar({
  activeTab,
  dateRange,
  onDateRangeChange,
  productFilter,
  onProductFilterChange,
  isCollapsed,
}: TopBarProps) {
  const { toast } = useToast()
  const {
    loadFromExcel, isExcelLoaded, isLoading: excelLoading,
    uploadError, versions, activeVersion,
    loadVersion, loadLatest, data: excelData, deleteVersion,
  } = useData()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showVersions, setShowVersions] = useState(false)
  const [password, setPassword] = useState('')
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [passwordError, setPasswordError] = useState('')

  const notifications = excelData?.notifications ?? []

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPendingFile(file)
    setPassword('')
    setPasswordError('')
    setShowPasswordModal(true)
    e.target.value = ''
  }

  const handlePasswordSubmit = async () => {
    if (!pendingFile || !password) return
    setPasswordError('')
    try {
      await loadFromExcel(pendingFile, password)
      setShowPasswordModal(false)
      setPassword('')
      setPendingFile(null)
    } catch (err: any) {
      setPasswordError(err.message || 'Incorrect password')
    }
  }

  const handleVersionSelect = async (timestamp: string | null) => {
    setShowVersions(false)
    if (timestamp === null) {
      await loadLatest()
    } else {
      await loadVersion(timestamp)
    }
  }

  const handleDeleteVersion = async (
    e: React.MouseEvent,
    v: { timestamp: string; label: string }
  ) => {
    e.stopPropagation()
    const pwd = window.prompt(
      `Enter password to delete this upload:\n\n"${v.label}"`
    )
    if (!pwd) return
    try {
      await deleteVersion(v.timestamp, pwd)
    } catch (err: any) {
      window.alert(err.message || 'Delete failed')
    }
  }

  const handleExport = () => {
    toast({
      title: 'Export started',
      description: 'Your file will download shortly',
    })
  }

  const severityColors: Record<string, string> = {
    critical: 'bg-[color:var(--color-red-bg)]',
    warning: 'bg-[color:var(--color-amber-bg)]',
    info: 'bg-[color:var(--color-blue-bg)]',
  }

  const severityDots: Record<string, string> = {
    critical: 'bg-[color:var(--color-red)]',
    warning: 'bg-[color:var(--color-amber)]',
    info: 'bg-[color:var(--color-blue)]',
  }

  return (
    <header
      className={`fixed top-0 right-0 bg-white border-b border-[color:var(--color-border)] h-16 transition-all duration-300 z-40 ${
        isCollapsed ? 'left-16' : 'left-60'
      }`}
    >
      <div className="h-full px-8 flex items-center justify-between">
        {/* Left Side - Title and Breadcrumb */}
        <div className="flex-1">
          <h1 className="text-xl font-bold text-[color:var(--color-text-primary)]">
            {tabNames[activeTab]}
          </h1>
          <p className="text-xs text-[color:var(--color-grey)] mt-0.5">
            DI Command Centre / {tabNames[activeTab]}
          </p>
        </div>

        {/* Right Side - Filters and Controls */}
        <div className="flex items-center gap-4">
          {/* Date Range Filter */}
          <Select value={dateRange} onValueChange={onDateRangeChange}>
            <SelectTrigger className="w-40 h-9 text-sm border-[color:var(--color-border)]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Last 30 Days">Last 30 Days</SelectItem>
              <SelectItem value="Last Quarter">Last Quarter</SelectItem>
              <SelectItem value="Last 6 Months">Last 6 Months</SelectItem>
              <SelectItem value="All Time">All Time</SelectItem>
            </SelectContent>
          </Select>

          {/* Product Filter */}
          <Select value={productFilter} onValueChange={onProductFilterChange}>
            <SelectTrigger className="w-48 h-9 text-sm border-[color:var(--color-border)]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Products">All Products</SelectItem>
              <SelectGroup>
                <SelectLabel className="text-xs font-semibold text-[#64748b] uppercase">Loan Products (10)</SelectLabel>
                <SelectItem value="Personal Loan (PL)">Personal Loan (PL)</SelectItem>
                <SelectItem value="Home Loan (HL)">Home Loan (HL)</SelectItem>
                <SelectItem value="Used Car Loan (UCL)">Used Car Loan (UCL)</SelectItem>
                <SelectItem value="New Car Loan (NCL)">New Car Loan (NCL)</SelectItem>
                <SelectItem value="Business Loan (BL)">Business Loan (BL)</SelectItem>
                <SelectItem value="LAP">LAP</SelectItem>
                <SelectItem value="Easy Loan (EL)">Easy Loan (EL)</SelectItem>
                <SelectItem value="Two Wheeler Loan (TWL)">Two Wheeler Loan (TWL)</SelectItem>
                <SelectItem value="Loan Against Securities (LAS)">Loan Against Securities (LAS)</SelectItem>
                <SelectItem value="Credit Enabled Quote (CEQ)">Credit Enabled Quote (CEQ)</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel className="text-xs font-semibold text-[#64748b] uppercase">Support Functions (6)</SelectLabel>
                <SelectItem value="Legal (Retail)">Legal (Retail)</SelectItem>
                <SelectItem value="Legal (Corporate)">Legal (Corporate)</SelectItem>
                <SelectItem value="Legal (Litigation)">Legal (Litigation)</SelectItem>
                <SelectItem value="Risk">Risk</SelectItem>
                <SelectItem value="Treasury">Treasury</SelectItem>
                <SelectItem value="Credit (Compliance)">Credit (Compliance)</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Divider */}
          <div className="w-px h-6 bg-[color:var(--color-border)]" />

          {/* Notification Bell */}
          <Popover>
            <PopoverTrigger className="relative p-2 hover:bg-[color:var(--color-grey-bg)] rounded-md transition-colors data-[state=open]:bg-[color:var(--color-grey-bg)]" aria-label={`Notifications, ${notifications.length} unread`}>
              <Bell size={20} className="text-[color:var(--color-text-primary)]" />
              {notifications.length > 0 && (
                <Badge
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs font-bold bg-[color:var(--color-red)] text-white"
                >
                  {notifications.length}
                </Badge>
              )}
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0" role="dialog" aria-modal="true" aria-label="Notifications panel">
              <div className="border-b border-[color:var(--color-border)] p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[color:var(--color-text-primary)]" id="notifications-title">
                    Notifications
                  </h3>
                  <Badge className="bg-[color:var(--color-blue)] text-white text-xs">
                    {notifications.length} new
                  </Badge>
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notif, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-3 p-3 border-b border-[color:var(--color-border)] hover:bg-[color:var(--color-grey-bg)] transition-colors ${
                      severityColors[notif.severity]
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${
                        severityDots[notif.severity]
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[color:var(--color-text-primary)] line-clamp-2">
                        {notif.message}
                      </p>
                      <p className="text-xs text-[color:var(--color-grey)] mt-1">
                        {notif.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Export Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="text-xs border-[color:var(--color-border)] text-[color:var(--color-text-primary)] hover:bg-[color:var(--color-grey-bg)]"
          >
            <Download size={16} className="mr-2" />
            Export Tab
          </Button>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Divider */}
          <div className="h-5 w-px bg-[color:var(--color-border)]" />

          {/* Upload button */}
          {excelLoading ? (
            <div className="flex items-center gap-2 text-xs
                            text-[color:var(--color-text-muted)]">
              <RefreshCw size={13} className="animate-spin" />
              <span>Updating...</span>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 text-xs px-3 py-1.5
                         rounded-lg border transition-colors bg-white
                         border-[color:var(--color-border)]
                         text-[color:var(--color-text-secondary)]
                         hover:bg-[color:var(--color-grey-bg)]"
            >
              <Upload size={13} />
              Upload Excel
            </button>
          )}

          {/* Version history dropdown — only shows after first upload */}
          {versions.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowVersions(v => !v)}
                className={`flex items-center gap-2 text-xs px-3 py-1.5
                            rounded-lg border transition-colors ${
                  activeVersion === null && isExcelLoaded
                    ? 'bg-[color:var(--color-green-bg)] border-[color:var(--color-green)] text-[color:var(--color-green-text)]'
                    : 'bg-[color:var(--color-blue-bg)] border-[color:var(--color-blue)] text-[color:var(--color-blue-text)]'
                }`}
              >
                <CheckCircle size={13} />
                <span className="max-w-[140px] truncate">
                  {activeVersion === null
                    ? 'Latest'
                    : (versions.find(v => v.timestamp === activeVersion)?.label
                       ?? 'Past version')}
                </span>
                <ChevronDown size={12} />
              </button>

              {showVersions && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowVersions(false)}
                  />
                  <div className="absolute right-0 top-10 z-50 w-80
                                  bg-white border border-[color:var(--color-border)]
                                  rounded-xl shadow-xl overflow-hidden">

                    <div className="px-4 py-3 border-b
                                    border-[color:var(--color-border)]
                                    bg-[color:var(--color-bg-section)]">
                      <p className="text-xs font-semibold
                                    text-[color:var(--color-text-secondary)]
                                    uppercase tracking-wider">
                        Upload History
                      </p>
                      <p className="text-xs text-[color:var(--color-text-muted)]
                                    mt-0.5">
                        {versions.length} version{versions.length !== 1 ? 's' : ''}
                        saved · click any to view
                      </p>
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                      {/* Latest shortcut */}
                      <button
                        onClick={() => handleVersionSelect(null)}
                        className={`w-full text-left px-4 py-3 flex items-start
                                    gap-3 hover:bg-[color:var(--color-grey-bg)]
                                    transition-colors border-b
                                    border-[color:var(--color-border)] ${
                          activeVersion === null
                            ? 'bg-[color:var(--color-green-bg)]'
                            : ''
                        }`}
                      >
                        <CheckCircle size={14}
                          className="text-[color:var(--color-green)]
                                     mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold
                                        text-[color:var(--color-text-primary)]">
                            Latest upload
                          </p>
                          <p className="text-xs text-[color:var(--color-text-muted)]
                                        mt-0.5 truncate">
                            {versions[0]?.label}
                          </p>
                        </div>
                      </button>

                      {/* All versions */}
                      {versions.map((v, i) => (
                        <button
                          key={v.timestamp}
                          onClick={() => handleVersionSelect(v.timestamp)}
                          className={`group w-full text-left px-4 py-3 flex items-start
                                      gap-3 hover:bg-[color:var(--color-grey-bg)]
                                      transition-colors ${
                            i < versions.length - 1
                              ? 'border-b border-[color:var(--color-border)]'
                              : ''
                          } ${
                            activeVersion === v.timestamp
                              ? 'bg-[color:var(--color-blue-bg)]'
                              : ''
                          }`}
                        >
                          <Clock size={14}
                            className="text-[color:var(--color-text-muted)]
                                       mt-0.5 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-medium
                                          text-[color:var(--color-text-primary)]
                                          truncate">
                              {v.label}
                            </p>
                            <p className="text-xs
                                          text-[color:var(--color-text-muted)]
                                          mt-0.5">
                              {new Date(v.uploadedAt).toLocaleString('en-IN', {
                                day: '2-digit', month: 'short', year: 'numeric',
                                hour: '2-digit', minute: '2-digit', hour12: true,
                              })}
                            </p>
                          </div>
                          <span
                            onClick={(e) => handleDeleteVersion(e, v)}
                            className="ml-auto flex-shrink-0 p-1.5 rounded-md
                                       text-[color:var(--color-text-muted)]
                                       hover:bg-red-50 hover:text-red-500
                                       transition-colors opacity-0
                                       group-hover:opacity-100"
                            title="Delete this version"
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" strokeWidth="2"
                                 strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"/>
                              <path d="M19 6l-1 14H6L5 6"/>
                              <path d="M10 11v6M14 11v6"/>
                              <path d="M9 6V4h6v2"/>
                            </svg>
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Password modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center
                        justify-center bg-black/50"
             onClick={e => {
               if (e.target === e.currentTarget) {
                 setShowPasswordModal(false)
                 setPendingFile(null)
               }
             }}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-80 mx-4">

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-[#eff6ff]
                              flex items-center justify-center flex-shrink-0">
                <Lock size={16} className="text-[#1068AB]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[color:var(--color-text-primary)]">
                  Upload password required
                </h3>
                <p className="text-xs text-[color:var(--color-text-muted)]
                              mt-0.5 truncate max-w-[200px]">
                  {pendingFile?.name}
                </p>
              </div>
            </div>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={e => {
                setPassword(e.target.value)
                setPasswordError('')
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') handlePasswordSubmit()
                if (e.key === 'Escape') {
                  setShowPasswordModal(false)
                  setPendingFile(null)
                }
              }}
              autoFocus
              className="w-full border border-[color:var(--color-border)]
                         rounded-lg px-3 py-2.5 text-sm mb-2
                         focus:outline-none focus:ring-2
                         focus:ring-[#1068AB] focus:border-transparent"
            />

            {passwordError && (
              <div className="flex items-center gap-2 text-xs
                              text-[color:var(--color-red-text)] mb-2">
                <AlertCircle size={12} />
                {passwordError}
              </div>
            )}

            {uploadError && !passwordError && (
              <div className="flex items-center gap-2 text-xs
                              text-[color:var(--color-red-text)] mb-2">
                <AlertCircle size={12} />
                {uploadError}
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  setShowPasswordModal(false)
                  setPendingFile(null)
                  setPassword('')
                  setPasswordError('')
                }}
                className="flex-1 px-3 py-2.5 text-sm rounded-lg border
                           border-[color:var(--color-border)]
                           text-[color:var(--color-text-secondary)]
                           hover:bg-[color:var(--color-grey-bg)]
                           transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordSubmit}
                disabled={!password || excelLoading}
                className="flex-1 px-3 py-2.5 text-sm rounded-lg font-medium
                           bg-[#1068AB] text-white
                           hover:bg-[#0d5a94] transition-colors
                           disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center justify-center gap-2"
              >
                {excelLoading
                  ? <><RefreshCw size={13} className="animate-spin" />
                      Uploading...</>
                  : 'Upload'
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
