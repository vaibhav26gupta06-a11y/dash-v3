import * as XLSX from 'xlsx'

function sheet(wb: XLSX.WorkBook, name: string): any[] {
  const ws = wb.Sheets[name]
  if (!ws) return []
  return XLSX.utils.sheet_to_json(ws, { defval: null, range: 2 })
}

function n(v: any): number {
  const x = parseFloat(v)
  return isNaN(x) ? 0 : x
}

function s(v: any): string {
  return v == null ? '' : String(v).trim()
}

function toDeployStatus(v: any) {
  const x = s(v).toLowerCase().replace(/[^a-z]/g, '')
  if (x === 'live') return 'Live' as const
  if (x === 'uat') return 'UAT' as const
  if (x === 'wip') return 'WIP' as const
  if (x === 'underdiscussion') return 'Under discussion' as const
  return 'Not planned' as const
}

export async function parseExcelFile(file: File) {
  const buffer = await file.arrayBuffer()
  const wb = XLSX.read(buffer, { type: 'array' })

  // ── 1_DeploymentStatus ──────────────────────────────────
  const deployRows = sheet(wb, '1_DeploymentStatus')
  const STAGES = ['Sales','CPC','Credit','Ops','Compliance','Audit'] as const
  const DEPLOYMENT_MATRIX: Record<string, any> = {}
  const SUPPORT_FUNCTIONS_STATUS: Record<string, any> = {}
  const LOAN_PRODUCTS: string[] = []

  deployRows.forEach((row: any) => {
    const name = s(row['Product / Function'])
    if (!name || name === 'LOAN PRODUCTS' ||
        name.startsWith('SUPPORT FUNCTIONS')) return
    const seg = s(row['Segment'])
    if (seg === 'Support Function') {
      const raw = row['Sales'] ?? row['CPC'] ?? ''
      SUPPORT_FUNCTIONS_STATUS[name] = toDeployStatus(raw)
    } else {
      LOAN_PRODUCTS.push(name)
      const stageMap: Record<string, any> = {}
      STAGES.forEach(st => { stageMap[st] = toDeployStatus(row[st]) })
      DEPLOYMENT_MATRIX[name] = stageMap
    }
  })

  // ── 2_OverviewKPIs ──────────────────────────────────────
  const kpiRows = sheet(wb, '2_OverviewKPIs')

  // Import hardcoded defaults for anything not in Excel sheets
  const defaults = await import('./data')

  function parseKPIRow(rows: any[], key: string, fallback: any) {
    const row = rows.find((r: any) => s(r['KPI Key']) === key)
    if (!row) return fallback
    const rawValue = row['Current Value']
    const parsed = parseFloat(String(rawValue))
    return {
      value: isNaN(parsed) ? s(rawValue) : parsed,
      target: n(row['Target']),
      delta: n(row['Delta']),
      unit: s(row['Unit']),
      status: s(row['Status']) as any,
    }
  }

  const overviewKPIs = {
    automationCoverage: parseKPIRow(kpiRows, 'automationCoverage', defaults.overviewKPIs.automationCoverage),
    documentAccuracy:   parseKPIRow(kpiRows, 'documentAccuracy',   defaults.overviewKPIs.documentAccuracy),
    ftrRate:            parseKPIRow(kpiRows, 'ftrRate',            defaults.overviewKPIs.ftrRate),
    stpRate:            parseKPIRow(kpiRows, 'stpRate',            defaults.overviewKPIs.stpRate),
    userAdoption:       parseKPIRow(kpiRows, 'userAdoption',       defaults.overviewKPIs.userAdoption),
    tatSaved:           parseKPIRow(kpiRows, 'tatSaved',           defaults.overviewKPIs.tatSaved),
  }

  // ── 3_OverviewTrend ─────────────────────────────────────
  const overviewTrend = sheet(wb, '3_OverviewTrend').map((r: any) => ({
    month: s(r['Month']),
    automation: n(r['Automation Coverage %']),
    ftr: n(r['FTR Rate %']),
    adoption: n(r['User Adoption %']),
  }))

  // ── 4_Milestones ────────────────────────────────────────
  const milestones = sheet(wb, '4_Milestones')
    .filter((r: any) => s(r['Milestone Name']))
    .map((r: any) => ({
      name: s(r['Milestone Name']),
      planned: s(r['Planned Date']),
      actual: s(r['Actual / Expected Date']),
      delay: n(r['Delay (days)']),
      status: s(r['Status']) as any,
    }))

  // ── 5_TopSignals ────────────────────────────────────────
  const topSignals = sheet(wb, '5_TopSignals')
    .filter((r: any) => s(r['Signal Text']))
    .map((r: any) => ({
      severity: s(r['Severity']),
      text: s(r['Signal Text']),
    }))

  // ── 6_AdoptionKPIs ──────────────────────────────────────
  const adoptionKPIRows = sheet(wb, '6_AdoptionKPIs')
  const find = (label: string) =>
    adoptionKPIRows.find((r: any) => s(r['Metric']) === label)

  const adoptionKPIs = {
    overallAdoption: {
      value: n(find('Overall Adoption Rate (%)')?.['Value']),
      target: 80, status: 'watch' as const,
    },
    overrideRate: {
      value: n(find('Override / Bypass Rate (%)')?.['Value']),
      target: 10, status: 'at-risk' as const,
    },
    featureUsage: {
      value: n(find('Feature Usage Rate (%)')?.['Value']),
      target: 75, status: 'at-risk' as const,
    },
    lowestBranch: {
      name: s(find('Lowest Branch Name')?.['Value']),
      value: n(find('Lowest Branch Adoption (%)')?.['Value']),
    },
  }

  const adoptionByProduct = adoptionKPIRows
    .filter((r: any) => r['Product'])
    .map((r: any) => ({
      name: s(r['Product']),
      value: n(r['Adoption %']),
      status: s(r['Status']) as any,
    }))

  const adoptionByStage = adoptionKPIRows
    .filter((r: any) => r['Stage'])
    .map((r: any) => ({
      stage: s(r['Stage']),
      value: n(r['Adoption %']),
      status: s(r['Status']) as any,
    }))

  // ── 7_AdoptionTrend ─────────────────────────────────────
  const adoptionTrend = sheet(wb, '7_AdoptionTrend').map((r: any) => ({
    month: s(r['Month']),
    overall: n(r['Overall Adoption %']),
    cpc: n(r['CPC Adoption %']),
    credit: n(r['Credit Adoption %']),
    sanction: n(r['Sanction/Audit Adoption %']),
  }))

  // ── 8_DocTypeAccuracy ────────────────────────────────────
  const docTypeAccuracy = sheet(wb, '8_DocTypeAccuracy')
    .filter((r: any) => s(r['Document Type']))
    .map((r: any) => ({
      doc: s(r['Document Type']),
      accuracy: n(r['Accuracy %']),
      volume: n(r['Volume / Month']),
      status: s(r['Status']) as any,
      failingFields: s(r['Failing Fields']),
      overrideRate: n(r['Override Rate %']),
      vendor: s(r['Vendor']),
    }))

  // ── 9_QualityKPIs ────────────────────────────────────────
  const qRows = sheet(wb, '9_QualityKPIs')
  const qv = (label: string) =>
    n(qRows.find((r: any) => s(r['KPI']) === label)?.['Current Value'])

  const qualityKPIs = {
    caseAccuracy:  { value: qv('Case-Level Accuracy (%)') || 91.3,  target:95, status:'watch' as const },
    fieldAccuracy: { value: qv('Field-Level Accuracy (%)') || 94.2, target:96, status:'watch' as const },
    ftrRate:       { value: qv('FTR Rate (%)') || 81,               target:90, status:'watch' as const },
    fpr:           { value: qv('False Positive Rate (%)') || 2.8,   target:3,  status:'on-target' as const },
    fnr:           { value: qv('False Negative Rate (%)') || 6.1,   target:5,  status:'at-risk' as const },
  }

  // ── 10_AccuracyTrend ─────────────────────────────────────
  const accuracyTrend = sheet(wb, '10_AccuracyTrend').map((r: any) => ({
    month: s(r['Month']),
    field: n(r['Field-Level Accuracy %']),
    doc:   n(r['Document-Level Accuracy %']),
    case:  n(r['Case-Level Accuracy %']),
  }))

  // ── 11_FPRFNRTrend ───────────────────────────────────────
  const fprFnrTrend = sheet(wb, '11_FPRFNRTrend').map((r: any) => ({
    month: s(r['Month']),
    fpr:   n(r['False Positive Rate %']),
    fnr:   n(r['False Negative Rate %']),
  }))

  // ── 12_AHTComparison ─────────────────────────────────────
  const ahtComparison = sheet(wb, '12_AHTComparison')
    .filter((r: any) => s(r['Stage']))
    .map((r: any) => ({
      stage:  s(r['Stage']),
      preDI:  n(r['Pre-DI AHT (hrs)']),
      postDI: n(r['Post-DI AHT (hrs)']),
      p25:    n(r['P25']),
      p50:    n(r['P50']),
      p75:    n(r['P75']),
      p90:    n(r['P90']),
      note:   s(r['Notes']),
    }))

  // ── 13_TATTrend ──────────────────────────────────────────
  const tatTrend = sheet(wb, '13_TATTrend').map((r: any) => ({
    month: s(r['Month']),
    tat:   n(r['Avg TAT (days)']),
  }))

  // ── 14_STPHandoffTrend ───────────────────────────────────
  const stpHandoffTrend = sheet(wb, '14_STPHandoffTrend').map((r: any) => ({
    month:    s(r['Month']),
    stp:      n(r['STP Rate %']),
    handoffs: n(r['Avg Handoffs per Application']),
  }))

  // ── 15_CostKPIs ──────────────────────────────────────────
  const cRows = sheet(wb, '15_CostKPIs')
  const cv = (label: string) =>
    cRows.find((r: any) => s(r['Metric']) === label)

  const costKPIs = {
    costPerApp: {
      value:  n(cv('Cost Per Application')?.['Current Value']) || 1840,
      target: n(cv('Cost Per Application')?.['Target']) || 1500,
      preDI:  n(cv('Cost Per Application')?.['Pre-DI Baseline']) || 3120,
      unit: '₹', status: 'watch' as const,
    },
    totalSavings:  { value: s(cv('Total Savings to Date')?.['Current Value']) || '₹4.2 Cr', status:'on-target' as const },
    roi:           { value: n(cv('Programme ROI')?.['Current Value']) || 187, unit:'%', status:'on-target' as const },
    payback:       { value: s(cv('Payback Period')?.['Current Value']) || '8 months', achieved:'Feb 2025', status:'on-target' as const },
    reworkAvoided: { value: s(cv('Rework Cost Avoided')?.['Current Value']) || '₹68L/mo', status:'on-target' as const },
  }

  // ── 16_CostByProduct ─────────────────────────────────────
  const costByProduct = sheet(wb, '16_CostByProduct')
    .filter((r: any) => s(r['Product']))
    .map((r: any) => ({
      name:   s(r['Product']),
      preDI:  n(r['Pre-DI Total']),
      postDI: n(r['Post-DI Total']),
      breakdown: {
        staffPre:   n(r['Staff Pre']),
        staffPost:  n(r['Staff Post']),
        vendorPost: n(r['Vendor API Post']),
        reworkPre:  n(r['Rework Pre']),
        reworkPost: n(r['Rework Post']),
      },
    }))

  // ── 17_SavingsTrend ──────────────────────────────────────
  const savingsTrend = sheet(wb, '17_SavingsTrend').map((r: any) => ({
    month:      s(r['Month']),
    monthly:    n(r['Monthly Savings (₹L)']),
    cumulative: n(r['Cumulative Savings (₹L)']),
  }))

  // ── 18_Vendors ───────────────────────────────────────────
  const vendors = sheet(wb, '18_Vendors')
    .filter((r: any) => s(r['Vendor Name']))
    .map((r: any) => ({
      name:           s(r['Vendor Name']),
      spend:          s(r['Monthly Spend']),
      stages:         s(r['Stages Covered']),
      accuracy:       n(r['Accuracy %']),
      latencyP95:     n(r['Latency P95 (s)']),
      latencySLA:     n(r['Latency SLA (s)']),
      uptime:         n(r['Uptime %']),
      uptimeSLA:      n(r['Uptime SLA %']),
      resolutionTAT:  n(r['Resolution TAT (hrs)']),
      slaCompliance:  n(r['SLA Compliance %']),
      valueIndex:     n(r['Value Index']),
      status:         s(r['Status']) as any,
      recommendation: s(r['Recommendation']),
      renewal:        s(r['Contract Renewal']),
      openIssues:     [],
      accuracyTrend:  [],
    }))

  // ── 19_ModelDrift ────────────────────────────────────────
  const modelDrift = sheet(wb, '19_ModelDrift').map((r: any) => ({
    month:    s(r['Month']),
    plCredit: n(r['PL-Credit Model']),
    cpcAll:   n(r['CPC-All Model']),
    hlCpc:    n(r['HL-CPC Model']),
    uclQde:   n(r['UCL-QDE Model']),
  }))

  // ── 20_InputQuality ──────────────────────────────────────
  const inputQualityByProduct = sheet(wb, '20_InputQuality')
    .filter((r: any) => r['Product'] && r['Quality Score %'] != null)
    .map((r: any) => ({
      product: s(r['Product']),
      value:   n(r['Quality Score %']),
    }))

  const qualityFailureReasons = sheet(wb, '20_InputQuality')
    .filter((r: any) => r['Reason'])
    .map((r: any) => ({
      reason: s(r['Reason']),
      pct:    n(r['% of Failures']),
    }))

  // ── 21_ReadinessScores ────────────────────────────────────
  const readinessScores = sheet(wb, '21_ReadinessScores')
    .filter((r: any) => s(r['Stage']))
    .map((r: any) => ({
      stage:     s(r['Stage']),
      readiness: n(r['Readiness Score (0-100)']),
      status:    s(r['Status']) as any,
      item:      s(r['Detail / Blocking Item']),
    }))

  // ── Computed from deployment matrix ──────────────────────
  const stageAutomationCoverage = ['Sales','CPC','Credit','Ops','Compliance','Audit'].map(stage => {
    const live = LOAN_PRODUCTS.filter(p => DEPLOYMENT_MATRIX[p]?.[stage] === 'Live').length
    const uat  = LOAN_PRODUCTS.filter(p => DEPLOYMENT_MATRIX[p]?.[stage] === 'UAT').length
    const wip  = LOAN_PRODUCTS.filter(p => DEPLOYMENT_MATRIX[p]?.[stage] === 'WIP').length
    const total = LOAN_PRODUCTS.length || 10
    return {
      stage, live, uat, wip, total,
      livePct: Math.round((live / total) * 100),
      activeWithUatPct: Math.round(((live + uat) / total) * 100),
    }
  })

  // These are not in Excel — use hardcoded defaults
  return {
    LOAN_PRODUCTS,
    DEPLOYMENT_MATRIX,
    SUPPORT_FUNCTIONS_STATUS,
    STAGES: ['Sales','CPC','Credit','Ops','Compliance','Audit'],
    overviewKPIs,
    overviewTrend,
    stageAutomationCoverage,
    milestones,
    topSignals,
    adoptionKPIs,
    adoptionByProduct,
    adoptionByStage,
    adoptionTrend,
    qualityKPIs,
    accuracyTrend,
    fprFnrTrend,
    docTypeAccuracy,
    ahtComparison,
    tatTrend,
    stpHandoffTrend,
    costKPIs,
    costByProduct,
    savingsTrend,
    vendors,
    modelDrift,
    inputQualityByProduct,
    qualityFailureReasons,
    readinessScores,
    // Not in Excel — keep hardcoded defaults
    overrideByStage:      defaults.overrideByStage,
    overrideHeatmap:      defaults.overrideHeatmap,
    featureAdoption:      defaults.featureAdoption,
    ftrByStage:           defaults.ftrByStage,
    reworkByProduct:      defaults.reworkByProduct,
    efficiencyKPIs:       defaults.efficiencyKPIs,
    notifications:        defaults.notifications,
    incidents:            defaults.incidents,
    lastUpdated: new Date().toLocaleString('en-IN'),
  }
}
