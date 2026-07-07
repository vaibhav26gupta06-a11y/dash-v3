// Deployment data model
export type DeploymentStatus = 'Not planned' | 'Under discussion' | 'WIP' | 'UAT' | 'Live'
export type Stage = 'Sales' | 'CPC' | 'Credit' | 'Ops' | 'Compliance' | 'Audit'

export const DEPLOYMENT_MATRIX: Record<string, Record<Stage, DeploymentStatus>> = {
  'Personal Loan (PL)': {
    'Sales': 'Under discussion',
    'CPC': 'Live',
    'Credit': 'UAT',
    'Ops': 'Live',
    'Compliance': 'Live',
    'Audit': 'Under discussion',
  },
  'Home Loan (HL)': {
    'Sales': 'Under discussion',
    'CPC': 'WIP',
    'Credit': 'Not planned',
    'Ops': 'Under discussion',
    'Compliance': 'Not planned',
    'Audit': 'Under discussion',
  },
  'Loan Against Property (LAP)': {
    'Sales': 'Under discussion',
    'CPC': 'WIP',
    'Credit': 'Not planned',
    'Ops': 'Under discussion',
    'Compliance': 'Not planned',
    'Audit': 'Under discussion',
  },
  'Used Car Loan': {
    'Sales': 'Not planned',
    'CPC': 'WIP',
    'Credit': 'Not planned',
    'Ops': 'Under discussion',
    'Compliance': 'UAT',
    'Audit': 'Not planned',
  },
  'New Car Loan': {
    'Sales': 'Not planned',
    'CPC': 'WIP',
    'Credit': 'Not planned',
    'Ops': 'Under discussion',
    'Compliance': 'UAT',
    'Audit': 'Not planned',
  },
  'Two Wheeler Loan': {
    'Sales': 'Not planned',
    'CPC': 'Not planned',
    'Credit': 'Not planned',
    'Ops': 'Live',
    'Compliance': 'Live',
    'Audit': 'Not planned',
  },
  'Business Loan': {
    'Sales': 'Under discussion',
    'CPC': 'Live',
    'Credit': 'Under discussion',
    'Ops': 'Live',
    'Compliance': 'Live',
    'Audit': 'UAT',
  },
  'Education Loan': {
    'Sales': 'Not planned',
    'CPC': 'Under discussion',
    'Credit': 'Not planned',
    'Ops': 'Not planned',
    'Compliance': 'UAT',
    'Audit': 'Not planned',
  },
  'Loan Against Security': {
    'Sales': 'Not planned',
    'CPC': 'Not planned',
    'Credit': 'Not planned',
    'Ops': 'Not planned',
    'Compliance': 'Not planned',
    'Audit': 'Not planned',
  },
  'CV / CEQ': {
    'Sales': 'Not planned',
    'CPC': 'Under discussion',
    'Credit': 'Not planned',
    'Ops': 'Not planned',
    'Compliance': 'Not planned',
    'Audit': 'Not planned',
  },
}

export const SUPPORT_FUNCTIONS_STATUS: Record<string, DeploymentStatus> = {
  'Legal (Retail)': 'Live',
  'Legal (Corporate)': 'Live',
  'Legal (Litigation)': 'Live',
  'Risk': 'Under discussion',
  'Treasury': 'WIP',
  'Credit (Compliance)': 'Under discussion',
}

export const MONTHS_9 = [
  'Oct 24','Nov 24','Dec 24','Jan 25',
  'Feb 25','Mar 25','Apr 25','May 25','Jun 25'
]

export const MONTHS_12 = [
  'Jul 24','Aug 24','Sep 24','Oct 24','Nov 24','Dec 24',
  'Jan 25','Feb 25','Mar 25','Apr 25','May 25','Jun 25'
]

export const MONTHS_6 = [
  'Jan 25','Feb 25','Mar 25','Apr 25','May 25','Jun 25'
]

export const LOAN_PRODUCTS = [
  'Personal Loan (PL)',
  'Home Loan (HL)',
  'Loan Against Property (LAP)',
  'Used Car Loan',
  'New Car Loan',
  'Two Wheeler Loan',
  'Business Loan',
  'Education Loan',
  'Loan Against Security',
  'CV / CEQ',
]

export const SUPPORT_FUNCTIONS = [
  'Legal (Retail)',
  'Legal (Corporate)',
  'Legal (Litigation)',
  'Risk',
  'Treasury',
  'Credit (Compliance)',
]

export const ALL_ENTITIES = [...LOAN_PRODUCTS, ...SUPPORT_FUNCTIONS]

export const STAGES = ['Sales','CPC','Credit','Ops','Compliance','Audit']

export const overviewKPIs = {
  automationCoverage: { value: 22, target: 60, delta: +8, unit: '%', status: 'at-risk' as const, note: 'Live + UAT across 60 loan product×stage combinations' },
  documentAccuracy:   { value: 94.2, target: 92, delta: +2.1, unit: '%', status: 'on-target' as const },
  ftrRate:            { value: 81, target: 90, delta: +6, unit: '%', status: 'watch' as const },
  stpRate:            { value: 29, target: 60, delta: +11, unit: '%', status: 'at-risk' as const },
  userAdoption:       { value: 71, target: 80, delta: +16, unit: '%', status: 'watch' as const },
  tatSaved:           { value: 4.5, target: 5.0, delta: +1.2, unit: 'hrs', status: 'watch' as const },
}

export const overviewTrend = [
  { month:'Oct 24', automation:28, ftr:62, adoption:30 },
  { month:'Nov 24', automation:34, ftr:65, adoption:38 },
  { month:'Dec 24', automation:38, ftr:67, adoption:44 },
  { month:'Jan 25', automation:44, ftr:70, adoption:50 },
  { month:'Feb 25', automation:50, ftr:73, adoption:55 },
  { month:'Mar 25', automation:55, ftr:75, adoption:60 },
  { month:'Apr 25', automation:57, ftr:77, adoption:64 },
  { month:'May 25', automation:60, ftr:79, adoption:68 },
  { month:'Jun 25', automation:63, ftr:81, adoption:71 },
]

export const stageAutomationCoverage = [
  { stage:'Sales',      live:0,  uat:0, wip:0,  total:10, livePct:0,  activeWithUatPct:0  },
  { stage:'CPC',        live:2,  uat:0, wip:4,  total:10, livePct:20, activeWithUatPct:20 },
  { stage:'Credit',     live:0,  uat:1, wip:0,  total:10, livePct:0,  activeWithUatPct:10 },
  { stage:'Ops',        live:3,  uat:0, wip:0,  total:10, livePct:30, activeWithUatPct:30 },
  { stage:'Compliance', live:3,  uat:3, wip:0,  total:10, livePct:30, activeWithUatPct:60 },
  { stage:'Audit',      live:0,  uat:1, wip:0,  total:10, livePct:0,  activeWithUatPct:10 },
]

export const milestones = [
  { name:'PL — Credit Stage Live',   planned:'1 Mar 2025',  actual:'28 Feb 2025', delay:0,  status:'on-time' as const },
  { name:'HL — CPC Stage Live',      planned:'1 Apr 2025',  actual:'1 Apr 2025',  delay:0,  status:'on-time' as const },
  { name:'UCL — CPC Stage Live',     planned:'1 May 2025',  actual:'22 May 2025', delay:21, status:'delayed' as const },
  { name:'HL — Credit Stage Live',   planned:'1 Jun 2025',  actual:'28 Jun 2025', delay:27, status:'at-risk' as const },
  { name:'PL — Sanction Stage Live', planned:'15 Jun 2025', actual:'10 Jul 2025', delay:25, status:'delayed' as const },
]

export const topSignals = [
  { severity:'red', text:'Sales stage has 0 live deployments across all product lines — under discussion only. No automation active here yet.' },
  { severity:'red', text:'Credit stage critical gap — only PL in UAT. 9 of 10 products have no credit stage DI planned or in progress.' },
  { severity:'amber', text:'Audit stage nearly blank — only Business Loan in UAT. Risk and audit trails are a compliance exposure.' },
  { severity:'amber', text:'HL and LAP have identical status — both stalled at CPC WIP with Credit and Audit not planned. Consider joint delivery.' },
  { severity:'amber', text:'Loan Against Security and CV/CEQ are entirely not-planned. Confirm if these are out of scope or deprioritised.' },
  { severity:'green', text:'Legal (Retail, Corporate, Litigation) all live — support function DI performing well as a proof point.' },
  { severity:'green', text:'Compliance stage strongest — 6 of 10 products either live or in UAT. PL, TWL, Business Loan all live.' },
]

export type DeployStatus = 'live' | 'uat' | 'wip' | 'underdiscussion' | 'not-planned' | 'na'

export const deploymentMatrix: Record<string, Record<string, DeployStatus>> = {
  'Personal Loan (PL)': {
    Sales:'underdiscussion', CPC:'live', Credit:'uat',
    Ops:'live', Compliance:'live', Audit:'underdiscussion'
  },
  'Home Loan (HL)': {
    Sales:'underdiscussion', CPC:'wip', Credit:'not-planned',
    Ops:'underdiscussion', Compliance:'not-planned', Audit:'underdiscussion'
  },
  'Loan Against Property (LAP)': {
    Sales:'underdiscussion', CPC:'wip', Credit:'not-planned',
    Ops:'underdiscussion', Compliance:'not-planned', Audit:'underdiscussion'
  },
  'Used Car Loan': {
    Sales:'not-planned', CPC:'wip', Credit:'not-planned',
    Ops:'underdiscussion', Compliance:'uat', Audit:'not-planned'
  },
  'New Car Loan': {
    Sales:'not-planned', CPC:'wip', Credit:'not-planned',
    Ops:'underdiscussion', Compliance:'uat', Audit:'not-planned'
  },
  'Two Wheeler Loan': {
    Sales:'not-planned', CPC:'not-planned', Credit:'not-planned',
    Ops:'live', Compliance:'live', Audit:'not-planned'
  },
  'Business Loan': {
    Sales:'underdiscussion', CPC:'live', Credit:'underdiscussion',
    Ops:'live', Compliance:'live', Audit:'uat'
  },
  'Education Loan': {
    Sales:'not-planned', CPC:'underdiscussion', Credit:'not-planned',
    Ops:'not-planned', Compliance:'uat', Audit:'not-planned'
  },
  'Loan Against Security': {
    Sales:'not-planned', CPC:'not-planned', Credit:'not-planned',
    Ops:'not-planned', Compliance:'not-planned', Audit:'not-planned'
  },
  'CV / CEQ': {
    Sales:'not-planned', CPC:'underdiscussion', Credit:'not-planned',
    Ops:'not-planned', Compliance:'not-planned', Audit:'not-planned'
  },
}

export const supportFunctionMatrix: Record<string, DeployStatus> = {
  'Legal (Retail)':     'live',
  'Legal (Corporate)':  'live',
  'Legal (Litigation)': 'live',
  'Risk':               'underdiscussion',
  'Treasury':           'wip',
  'Credit (Compliance)':'underdiscussion',
}

function countStatus(status: DeployStatus, matrix: Record<string, Record<string, DeployStatus>>) {
  return Object.values(matrix)
    .flatMap(row => Object.values(row))
    .filter(s => s === status).length
}

const totalLoanCells = LOAN_PRODUCTS.length * STAGES.length
const liveCells = countStatus('live', deploymentMatrix)
const uatCells = countStatus('uat', deploymentMatrix)
const wipCells = countStatus('wip', deploymentMatrix)
const activeOrNearCells = liveCells + uatCells + wipCells

export const coverageSummary = {
  totalLoanCells,
  liveCells,
  uatCells,
  wipCells,
  underdiscussionCells: countStatus('underdiscussion', deploymentMatrix),
  notPlannedCells: countStatus('not-planned', deploymentMatrix),
  liveAndUatPct: Math.round(((liveCells + uatCells) / totalLoanCells) * 100),
  activeProgressPct: Math.round((activeOrNearCells / totalLoanCells) * 100),
  supportFunctionsLive: Object.values(supportFunctionMatrix).filter(s => s === 'live').length,
  supportFunctionsTotal: SUPPORT_FUNCTIONS.length,
}

export const coverageKPIs = {
  liveCells:            { value:9,   label:'Cells Live',            sub:'Of 60 loan product×stage combinations' },
  uatCells:             { value:4,   label:'In UAT',                sub:'Deployed, in user acceptance testing'  },
  wipCells:             { value:5,   label:'In Development (WIP)',  sub:'Being built right now'                 },
  livePct:              { value:22,  label:'Live + UAT Coverage %', target:60, status:'at-risk' as const        },
  supportLive:          { value:3,   label:'Support Functions Live',sub:'Of 6 support functions'               },
  productsWithNoPlans:  { value:2,   label:'Products Fully Unplanned', sub:'LAS and CV/CEQ — confirm scope'    },
}

export const cellDetails: Record<string, Record<string, any>> = {
  'Personal Loan': {
    Credit: {
      status:'live', goLive:'28 Feb 2025', vendor:'Vendor A',
      accuracy:96.1, adoption:84,
      docs:['ITR','Form 16','Salary Slip','Bank Statement'],
      issues:'None',
    },
    Sanction: {
      status:'in-progress', progress:45, targetGoLive:'10 Jul 2025',
      vendor:'Vendor A', blockingIssue:'Sanction letter template variations across regions',
      docs:['Sanction Letter','KYC Set','Income Proof'],
    },
  },
  'Home Loan': {
    Credit: {
      status:'in-progress', progress:60, targetGoLive:'28 Jun 2025',
      delayDays:27, vendor:'Vendor B',
      blockingIssue:'API integration with DMS pending security sign-off',
      docs:['Property Valuation Report','Title Deed','ITR','Bank Statement'],
    },
  },
  'Used Car Loan': {
    CPC: {
      status:'in-progress', progress:30, targetGoLive:'15 Jul 2025',
      vendor:'Vendor C', blockingIssue:'RC book format mapping — 12 non-standard formats identified',
      docs:['RC Book','Insurance','Valuation Certificate'],
    },
  },
}

export const coverageTrend = [
  { month:'Jan 25', pl:60, hl:20, ucl:0,  ncl:20, other:0 },
  { month:'Feb 25', pl:70, hl:40, ucl:0,  ncl:40, other:0 },
  { month:'Mar 25', pl:80, hl:40, ucl:20, ncl:40, other:0 },
  { month:'Apr 25', pl:80, hl:60, ucl:20, ncl:60, other:0 },
  { month:'May 25', pl:80, hl:60, ucl:40, ncl:60, other:0 },
  { month:'Jun 25', pl:80, hl:60, ucl:40, ncl:60, other:0 },
]

export const plannedVsActual = [
  { quarter:'Q3 2024', planned:2, actual:2 },
  { quarter:'Q4 2024', planned:4, actual:4 },
  { quarter:'Q1 2025', planned:5, actual:4 },
  { quarter:'Q2 2025', planned:6, actual:4 },
]

export const adoptionKPIs = {
  overallAdoption:  { value:71, target:80, status:'watch' as const },
  overrideRate:     { value:18, target:10, status:'at-risk' as const },
  featureUsage:     { value:58, target:75, status:'at-risk' as const },
  lowestBranch:     { name:'Nagpur West', value:31 },
}

export const adoptionByProduct = [
  { name:'Personal Loan (PL)',  value:84, status:'on-target' as const },
  { name:'New Car Loan (NCL)',  value:77, status:'on-target' as const },
  { name:'Home Loan (HL)',      value:68, status:'watch' as const },
  { name:'Used Car Loan (UCL)', value:51, status:'watch' as const },
  { name:'Business Loan (BL)',  value:38, status:'watch' as const },
  { name:'LAP',                 value:28, status:'at-risk' as const },
]

export const adoptionByStage = [
  { stage:'Sales',      value:0,  status:'at-risk' as const },
  { stage:'CPC',        value:85, status:'on-target' as const },
  { stage:'Credit',     value:69, status:'watch' as const },
  { stage:'Ops',        value:42, status:'at-risk' as const },
  { stage:'Compliance', value:71, status:'watch' as const },
  { stage:'Audit',      value:62, status:'watch' as const },
]

export const overrideByStage = [
  { stage:'Sales',      value:0,  status:'on-target' as const },
  { stage:'CPC',        value:8,  status:'on-target' as const },
  { stage:'Credit',     value:24, status:'at-risk' as const },
  { stage:'Ops',        value:38, status:'at-risk' as const },
  { stage:'Compliance', value:15, status:'watch' as const },
  { stage:'Audit',      value:9,  status:'on-target' as const },
]

export const overrideHeatmap = [
  { doc:'ITR',                pl:9,    hl:12,   ucl:null, ncl:8    },
  { doc:'Salary Slip',        pl:7,    hl:11,   ucl:null, ncl:9    },
  { doc:'Bank Statement',     pl:11,   hl:16,   ucl:22,   ncl:13   },
  { doc:'Property Document',  pl:null, hl:28,   ucl:null, ncl:null },
  { doc:'RC Book',            pl:null, hl:null,  ucl:35,   ncl:19   },
  { doc:'PAN Card',           pl:4,    hl:5,    ucl:4,    ncl:4    },
  { doc:'Aadhaar',            pl:3,    hl:4,    ucl:3,    ncl:3    },
  { doc:'Valuation Report',   pl:null, hl:31,   ucl:null, ncl:null },
]

export const featureAdoption = [
  { feature:'Doc type auto-detection',      usage:89, status:'on-target' as const },
  { feature:'Completeness check',           usage:82, status:'on-target' as const },
  { feature:'Field auto-extraction',        usage:63, status:'watch' as const },
  { feature:'Pre-fill to UW form',          usage:48, status:'at-risk' as const },
  { feature:'Fraud / tamper flag',          usage:41, status:'at-risk' as const },
  { feature:'Cross-doc validation',         usage:29, status:'at-risk' as const },
]

export const adoptionTrend = [
  { month:'Oct 24', overall:18, cpc:25, credit:0,  sanction:0  },
  { month:'Nov 24', overall:26, cpc:38, credit:0,  sanction:0  },
  { month:'Dec 24', overall:34, cpc:52, credit:18, sanction:0  },
  { month:'Jan 25', overall:42, cpc:65, credit:30, sanction:0  },
  { month:'Feb 25', overall:50, cpc:73, credit:45, sanction:5  },
  { month:'Mar 25', overall:56, cpc:78, credit:54, sanction:15 },
  { month:'Apr 25', overall:61, cpc:81, credit:60, sanction:25 },
  { month:'May 25', overall:66, cpc:83, credit:65, sanction:35 },
  { month:'Jun 25', overall:71, cpc:85, credit:69, sanction:42 },
]

export const qualityKPIs = {
  caseAccuracy:  { value:91.3, target:95, status:'watch' as const     },
  fieldAccuracy: { value:94.2, target:96, status:'watch' as const     },
  ftrRate:       { value:81,   target:90, status:'watch' as const     },
  fpr:           { value:2.8,  target:3,  status:'on-target' as const },
  fnr:           { value:6.1,  target:5,  status:'at-risk' as const   },
}

export const accuracyTrend = [
  { month:'Oct 24', field:88.1, doc:83.2, case:76.0 },
  { month:'Nov 24', field:89.4, doc:84.5, case:78.2 },
  { month:'Dec 24', field:90.2, doc:86.0, case:80.1 },
  { month:'Jan 25', field:91.5, doc:87.3, case:82.4 },
  { month:'Feb 25', field:92.4, doc:88.5, case:84.0 },
  { month:'Mar 25', field:93.1, doc:89.4, case:85.5 },
  { month:'Apr 25', field:93.8, doc:90.1, case:87.0 },
  { month:'May 25', field:94.0, doc:90.8, case:88.5 },
  { month:'Jun 25', field:94.2, doc:91.3, case:91.3 },
]

export const ftrByStage = [
  { stage:'Sales → CPC',        value:88, status:'on-target' as const },
  { stage:'CPC → Credit',       value:81, status:'watch' as const     },
  { stage:'Credit → Ops',       value:74, status:'watch' as const     },
  { stage:'Ops → Compliance',   value:79, status:'watch' as const     },
  { stage:'Compliance → Audit', value:71, status:'watch' as const     },
  { stage:'End-to-End',         value:61, status:'at-risk' as const   },
]

export const docTypeAccuracy = [
  { doc:'PAN Card',           accuracy:98.4, volume:4200, status:'on-target' as const,
    failingFields:'None',overrideRate:4, vendor:'All vendors' },
  { doc:'Aadhaar',            accuracy:97.8, volume:4100, status:'on-target' as const,
    failingFields:'None',overrideRate:3, vendor:'All vendors' },
  { doc:'Salary Slip',        accuracy:95.1, volume:3800, status:'on-target' as const,
    failingFields:'Net take-home (4% error)',overrideRate:8, vendor:'Vendor A' },
  { doc:'Bank Statement',     accuracy:91.3, volume:3200, status:'watch' as const,
    failingFields:'Opening balance (9%), Avg balance calc (7%)',overrideRate:14, vendor:'Vendor A/C' },
  { doc:'ITR',                accuracy:89.7, volume:2100, status:'watch' as const,
    failingFields:'Assessment year (12%), Total income (8%)',overrideRate:11, vendor:'Vendor A' },
  { doc:'Form 16',            accuracy:87.2, volume:1900, status:'watch' as const,
    failingFields:'Gross salary (11%), TDS deducted (9%)',overrideRate:13, vendor:'Vendor A' },
  { doc:'Property Document',  accuracy:79.4, volume:420,  status:'at-risk' as const,
    failingFields:'Valuation amount (21%), Property area (18%)',overrideRate:28, vendor:'Vendor B' },
  { doc:'RC Book',            accuracy:76.1, volume:380,  status:'at-risk' as const,
    failingFields:'Engine number (22%), Chassis (19%)',overrideRate:35, vendor:'Vendor C' },
  { doc:'Valuation Report',   accuracy:72.3, volume:210,  status:'at-risk' as const,
    failingFields:'Valuation figure (28%), Date (11%)',overrideRate:31, vendor:'Vendor B' },
]

export const fprFnrTrend = [
  { month:'Jan 25', fpr:4.8, fnr:9.1 },
  { month:'Feb 25', fpr:4.2, fnr:8.3 },
  { month:'Mar 25', fpr:3.8, fnr:7.8 },
  { month:'Apr 25', fpr:3.3, fnr:7.1 },
  { month:'May 25', fpr:3.0, fnr:6.5 },
  { month:'Jun 25', fpr:2.8, fnr:6.1 },
]

export const reworkByProduct = [
  { name:'Personal Loan', value:8,  status:'on-target' as const },
  { name:'New Car Loan',  value:11, status:'watch' as const     },
  { name:'Home Loan',     value:19, status:'watch' as const     },
  { name:'Used Car Loan', value:26, status:'at-risk' as const   },
]

export const efficiencyKPIs = {
  timeSaved:     { value:4.5, target:5.0, unit:'hrs', status:'watch' as const   },
  tat:           { value:6.2, target:5.0, unit:'days',status:'watch' as const,  preDI:9.1 },
  handoffs:      { value:3.8, target:3.0, unit:'',   status:'at-risk' as const, preDI:6.2 },
  stpRate:       { value:29,  target:60,  unit:'%',  status:'at-risk' as const  },
  regressionRate:{ value:14,  target:8,   unit:'%',  status:'at-risk' as const  },
}

export const ahtComparison = [
  { stage:'Sales',    preDI:0,   postDI:0,
    p25:0,   p50:0,   p75:0,   p90:0,
    note:'Not yet deployed for Sales stage.' },
  { stage:'CPC',      preDI:3.4, postDI:0.9,
    p25:0.4, p50:0.7, p75:1.1, p90:2.3,
    note:'DI automates completeness check and format validation, removing manual CPC ops review.' },
  { stage:'Credit',   preDI:5.8, postDI:3.9,
    p25:2.1, p50:3.4, p75:4.8, p90:7.2,
    note:'DI pre-fills income, ITR, and bank data into underwriting form. Manual judgment still required.' },
  { stage:'Ops',      preDI:2.2, postDI:1.8,
    p25:1.1, p50:1.6, p75:2.2, p90:3.8,
    note:'Partially deployed — letter generation only. Condition tracking in progress.' },
  { stage:'Compliance', preDI:3.1, postDI:2.2,
    p25:1.2, p50:1.9, p75:2.8, p90:4.1,
    note:'DI validates compliance doc set and triggers workflow review.' },
  { stage:'Audit',    preDI:1.9, postDI:1.4,
    p25:0.8, p50:1.2, p75:1.7, p90:2.6,
    note:'DI automates audit sampling and exception flagging.' },
]

export const tatTrend = [
  { month:'Jul 24', tat:9.1 },{ month:'Aug 24', tat:9.0 },
  { month:'Sep 24', tat:8.8 },{ month:'Oct 24', tat:8.5 },
  { month:'Nov 24', tat:8.1 },{ month:'Dec 24', tat:7.8 },
  { month:'Jan 25', tat:7.4 },{ month:'Feb 25', tat:7.0 },
  { month:'Mar 25', tat:6.8 },{ month:'Apr 25', tat:6.5 },
  { month:'May 25', tat:6.3 },{ month:'Jun 25', tat:6.2 },
]

export const stpHandoffTrend = [
  { month:'Oct 24', stp:3,  handoffs:6.1 },
  { month:'Nov 24', stp:5,  handoffs:6.0 },
  { month:'Dec 24', stp:8,  handoffs:5.7 },
  { month:'Jan 25', stp:12, handoffs:5.4 },
  { month:'Feb 25', stp:16, handoffs:5.0 },
  { month:'Mar 25', stp:19, handoffs:4.6 },
  { month:'Apr 25', stp:22, handoffs:4.3 },
  { month:'May 25', stp:26, handoffs:4.0 },
  { month:'Jun 25', stp:29, handoffs:3.8 },
]

export const costKPIs = {
  costPerApp:    { value:1840, target:1500, preDI:3120, unit:'₹', status:'watch' as const     },
  totalSavings:  { value:'₹4.2 Cr', status:'on-target' as const },
  roi:           { value:187, unit:'%', status:'on-target' as const },
  payback:       { value:'8 months', achieved:'Feb 2025', status:'on-target' as const },
  reworkAvoided: { value:'₹68L/mo', status:'on-target' as const },
}

export const costByProduct = [
  { name:'Personal Loan (PL)', preDI:2800, postDI:1540,
    breakdown:{ staffPre:1900, staffPost:980, vendorPost:340, reworkPre:900, reworkPost:220 }},
  { name:'Home Loan (HL)',     preDI:4200, postDI:2900,
    breakdown:{ staffPre:2800, staffPost:1900, vendorPost:480, reworkPre:1400, reworkPost:520 }},
  { name:'Used Car Loan (UCL)', preDI:3100, postDI:2400,
    breakdown:{ staffPre:2100, staffPost:1600, vendorPost:380, reworkPre:1000, reworkPost:420 }},
  { name:'New Car Loan (NCL)',  preDI:2900, postDI:1980,
    breakdown:{ staffPre:1950, staffPost:1100, vendorPost:420, reworkPre:950, reworkPost:460 }},
]

export const savingsTrend = [
  { month:'Oct 24', monthly:8,   cumulative:8   },
  { month:'Nov 24', monthly:18,  cumulative:26  },
  { month:'Dec 24', monthly:30,  cumulative:56  },
  { month:'Jan 25', monthly:45,  cumulative:101 },
  { month:'Feb 25', monthly:60,  cumulative:161 },
  { month:'Mar 25', monthly:75,  cumulative:236 },
  { month:'Apr 25', monthly:88,  cumulative:324 },
  { month:'May 25', monthly:102, cumulative:426 },
  { month:'Jun 25', monthly:118, cumulative:544 },
]

export const vendors = [
  { name:'Vendor A', spend:'₹8.2L/mo', stages:'PL-Credit, NCL-CPC, PL-QDE',
    accuracy:95.8, latencyP95:1.8, latencySLA:3, accuracySLA:92,
    uptime:99.7, uptimeSLA:99.5, resolutionTAT:3.2,
    slaCompliance:96, valueIndex:8.4, status:'on-target' as const,
    recommendation:'Renew — strong performer',
    renewal:'31 Mar 2026',
    openIssues:[],
    accuracyTrend:[94.8,95.0,95.2,95.5,95.6,95.8],
  },
  { name:'Vendor B', spend:'₹11.4L/mo', stages:'HL-CPC, HL-Credit (WIP)',
    accuracy:87.2, latencyP95:2.9, latencySLA:3, accuracySLA:90,
    uptime:99.1, uptimeSLA:99.5, resolutionTAT:9.8,
    slaCompliance:71, valueIndex:5.1, status:'at-risk' as const,
    recommendation:'Review — high cost, accuracy below SLA',
    renewal:'30 Sep 2025',
    openIssues:[
      { id:'INC-41', severity:'P1', desc:'Accuracy below SLA on property docs', age:'12 days', status:'Escalated' },
      { id:'INC-44', severity:'P2', desc:'Peak-hour latency spikes 9–11 AM', age:'5 days', status:'Vendor investigating' },
    ],
    accuracyTrend:[91.0,90.2,89.8,88.9,87.8,87.2],
  },
  { name:'Vendor C', spend:'₹3.8L/mo', stages:'UCL-QDE, NCL-QDE',
    accuracy:91.4, latencyP95:1.2, latencySLA:3, accuracySLA:90,
    uptime:99.8, uptimeSLA:99.5, resolutionTAT:2.1,
    slaCompliance:98, valueIndex:7.9, status:'on-target' as const,
    recommendation:'Expand scope — good value',
    renewal:'31 Jan 2026',
    openIssues:[
      { id:'INC-45', severity:'P2', desc:'Doc classification error on RC books', age:'3 days', status:'Fix deployed, monitoring' },
    ],
    accuracyTrend:[90.8,91.0,91.1,91.2,91.3,91.4],
  },
]

export const notifications = [
  { message: 'STP Rate below target on Home Loans — immediate intervention needed', severity: 'critical' as const, time: '2h ago' },
  { message: 'Vendor B accuracy degradation — SLA compliance at 71%', severity: 'warning' as const, time: '4h ago' },
  { message: 'New automation opportunity identified in NCL-Sanction', severity: 'info' as const, time: '1d ago' },
]

export const incidents = [
  { month: 'Jan 25', p1: 2, p2: 3, p3: 1, openIncidents: [{ id: 'INC-101', vendor: 'Vendor A', severity: 'P1', desc: 'API timeout on high-volume runs', age: '5d', status: 'In progress' }] },
  { month: 'Feb 25', p1: 1, p2: 2, p3: 2, openIncidents: [{ id: 'INC-105', vendor: 'Vendor B', severity: 'P2', desc: 'Accuracy drop on HL-CPC', age: '8d', status: 'Escalated' }] },
  { month: 'Mar 25', p1: 1, p2: 1, p3: 0, openIncidents: [] },
  { month: 'Apr 25', p1: 2, p2: 2, p3: 1, openIncidents: [{ id: 'INC-118', vendor: 'Vendor C', severity: 'P1', desc: 'Integration issue with UCL', age: '3d', status: 'In progress' }] },
  { month: 'May 25', p1: 0, p2: 1, p3: 2, openIncidents: [] },
  { month: 'Jun 25', p1: 1, p2: 2, p3: 1, openIncidents: [{ id: 'INC-156', vendor: 'Vendor A', severity: 'P2', desc: 'Override rate spike on NCALs', age: '2d', status: 'Monitoring' }] },
]

export const modelDrift = [
  { month: 'Jan 25', plCredit: -0.5, cpcAll: -0.3, hlCpc: -0.8, uclQde: -0.4 },
  { month: 'Feb 25', plCredit: -0.8, cpcAll: -0.6, hlCpc: -1.2, uclQde: -0.7 },
  { month: 'Mar 25', plCredit: -1.1, cpcAll: -0.9, hlCpc: -1.8, uclQde: -1.0 },
  { month: 'Apr 25', plCredit: -1.3, cpcAll: -1.1, hlCpc: -2.1, uclQde: -1.2 },
  { month: 'May 25', plCredit: -1.4, cpcAll: -1.0, hlCpc: -2.3, uclQde: -1.1 },
  { month: 'Jun 25', plCredit: -1.2, cpcAll: -0.8, hlCpc: -2.1, uclQde: -0.9 },
]

export const inputQualityByProduct = [
  { product: 'Personal Loan', value: 91 },
  { product: 'Home Loan', value: 88 },
  { product: 'Used Car Loan', value: 76 },
  { product: 'New Car Loan', value: 85 },
  { product: 'Other', value: 79 },
]

export const qualityFailureReasons = [
  { reason: 'Blurry/Low Resolution', pct: 35 },
  { reason: 'Incorrect Doc Type', pct: 28 },
  { reason: 'Incomplete (Missing Pages)', pct: 22 },
  { reason: 'Rotated/Upside Down', pct: 10 },
  { reason: 'Other', pct: 5 },
]

export const readinessScores = [
  // Live stages
  { stage: 'Sales → CPC', readiness: 88, status: 'on-target' as const, item: 'First-pass doc detection rates' },
  { stage: 'CPC → Credit', readiness: 81, status: 'watch' as const, item: 'Income extraction accuracy' },
  { stage: 'Credit → Ops', readiness: 74, status: 'watch' as const, item: 'Document completeness checks' },
  { stage: 'Ops → Compliance', readiness: 79, status: 'watch' as const, item: 'Compliance flag automation' },
  { stage: 'Compliance → Audit', readiness: 71, status: 'watch' as const, item: 'Audit sample generation' },
  // WIP and Under Discussion items
  { stage: 'PL — Sales Stage', readiness: 35, status: 'at-risk' as const, item: 'WIP: Pre-sanction checklist automation' },
  { stage: 'HL — Sales Stage', readiness: 28, status: 'at-risk' as const, item: 'WIP: Appraisal doc capture workflow' },
  { stage: 'LAP — Sales Stage', readiness: 15, status: 'at-risk' as const, item: 'Under Discussion: Collateral verification' },
  { stage: 'BL — CPC Stage', readiness: 22, status: 'at-risk' as const, item: 'WIP: Business doc standardization' },
  { stage: 'EL — Credit Stage', readiness: 0, status: 'at-risk' as const, item: 'Under Discussion: FI extraction for employment loans' },
  { stage: 'TWL — Ops Stage', readiness: 42, status: 'watch' as const, item: 'WIP: Transfer workflow automation' },
  { stage: 'LAS — Compliance Stage', readiness: 18, status: 'at-risk' as const, item: 'Under Discussion: Legal agreement validation' },
]
