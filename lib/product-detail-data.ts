export interface Checkpoint {
  name: string
  mode: 'Gen AI' | 'Human' | 'Both'
}

export interface CheckpointCategory {
  name: string
  checkpoints: Checkpoint[]
}

export interface ComparisonPoint {
  name: string
  mode: 'Gen AI' | 'Human' | 'Both'
  sources: string[]
}

export interface AvailabilityItem {
  name: string
  mode: 'Gen AI' | 'Human'
}

export interface AccuracySection {
  comparison: ComparisonPoint[]
  questionnaire: Checkpoint[]
  availability: AvailabilityItem[]
}

export interface ProductDetailData {
  name: string
  production: {
    coverage: {
      categories: CheckpointCategory[]
    }
    adoption: {
      totalCasesProcessed: number
      schemesCovered: string[]
      schemesNotCovered: string[]
    }
    accuracy: AccuracySection
  }
  enhancement: {
    monthOnMonth: Array<{
      month: string
      count: number
    }>
    details: Array<{
      month: string
      description: string
      raisedDate: string
      deliveredDate: string
    }>
    benefits: {
      ftr: { definition: string; value: number; isPercentage: boolean }
      nftr: { definition: string; value: number; isPercentage: boolean }
      costBenefit: { definition: string; value: number; currency: string }
    }
    technical: {
      tokenConsumption: number
      processingTimePerCase: number
      uptime: number
    }
  }
  issues: {
    openCount: number
    closedCount: number
    list: Array<{
      id: string
      summary: string
      status: 'Open' | 'Closed'
      raisedDate: string
      resolvedDate?: string
    }>
  }
}

export const PRODUCT_DETAIL_DATA: Record<string, ProductDetailData> = {
  'Personal Loan (PL)': {
    name: 'Personal Loan (PL)',
    production: {
      coverage: {
        categories: [
          {
            name: 'Identity & Consent Verification',
            checkpoints: [
              { name: 'Email verified — customer details in SLOS', mode: 'Gen AI' },
              { name: 'Phone verified — customer details in SLOS', mode: 'Gen AI' },
              { name: 'Consent received', mode: 'Gen AI' },
              { name: 'Consent norm check', mode: 'Human' },
              { name: 'Aadhaar masking for applicant & co-applicant', mode: 'Gen AI' },
              { name: 'Face match scoring logic', mode: 'Both' },
            ],
          },
          {
            name: 'Address Verification',
            checkpoints: [
              { name: 'Permanent address', mode: 'Gen AI' },
              { name: 'PA address proof', mode: 'Gen AI' },
              { name: 'PA address contact number', mode: 'Gen AI' },
              { name: 'Office address', mode: 'Gen AI' },
              { name: 'Deemed OVD document validity', mode: 'Human' },
            ],
          },
          {
            name: 'Income & Bank Verification',
            checkpoints: [
              { name: 'Last 3 salaries credited in bank statement', mode: 'Both' },
              { name: 'Official mail ID', mode: 'Gen AI' },
              { name: 'Perfios report', mode: 'Gen AI' },
              { name: 'Bank statement', mode: 'Gen AI' },
              { name: 'BT docs', mode: 'Human' },
              { name: 'Salary slip', mode: 'Gen AI' },
            ],
          },
        ],
      },
      adoption: {
        totalCasesProcessed: 15420,
        schemesCovered: ['Standard PL', 'Salary Advance', 'High-Value PL'],
        schemesNotCovered: ['Emergency PL'],
      },
      accuracy: {
        comparison: [
          { name: 'Name', mode: 'Gen AI', sources: ['Application form', 'Aadhaar', 'PAN', 'Digilocker', 'Rent agreement'] },
          { name: 'Date of birth', mode: 'Gen AI', sources: ['Application form', 'Aadhaar', 'PAN'] },
          { name: 'PAN number', mode: 'Gen AI', sources: ['PAN card', 'Application form', 'Bank statement'] },
          { name: 'Residential address', mode: 'Gen AI', sources: ['Aadhaar', 'Rent agreement', 'Bank statement'] },
          { name: 'Current address', mode: 'Gen AI', sources: ['Application form', 'Aadhaar', 'Utility bill'] },
          { name: 'Mother\'s name', mode: 'Both', sources: ['Aadhaar', 'PAN', 'Application form'] },
          { name: 'Bank name', mode: 'Gen AI', sources: ['Bank statement', 'Salary account', 'Application form'] },
          { name: 'Salary account number', mode: 'Gen AI', sources: ['Bank statement', 'Salary slip'] },
          { name: 'Company name', mode: 'Gen AI', sources: ['Salary slip', 'Offer letter', 'Bank statement'] },
          { name: 'CIBIL score', mode: 'Both', sources: ['Credit bureau report', 'Application form'] },
        ],
        questionnaire: [
          { name: 'Email verified — customer details in SLOS', mode: 'Gen AI' },
          { name: 'Phone verified — customer details in SLOS', mode: 'Gen AI' },
          { name: 'Consent received', mode: 'Gen AI' },
          { name: 'Consent norm check', mode: 'Human' },
          { name: 'Aadhaar masking for applicant & co-applicant', mode: 'Gen AI' },
          { name: 'Face match scoring logic', mode: 'Both' },
          { name: 'Permanent address', mode: 'Gen AI' },
          { name: 'PA address proof', mode: 'Gen AI' },
          { name: 'PA address contact number', mode: 'Gen AI' },
          { name: 'Office address', mode: 'Gen AI' },
          { name: 'Deemed OVD document validity', mode: 'Human' },
          { name: 'Last 3 salaries credited in bank statement', mode: 'Both' },
          { name: 'Official mail ID', mode: 'Gen AI' },
          { name: 'Perfios report', mode: 'Gen AI' },
          { name: 'Bank statement', mode: 'Gen AI' },
          { name: 'BT docs', mode: 'Human' },
          { name: 'Salary slip', mode: 'Gen AI' },
        ],
        availability: [
          { name: 'Aadhaar card', mode: 'Gen AI' },
          { name: 'PAN card', mode: 'Gen AI' },
          { name: 'Bank statement', mode: 'Gen AI' },
          { name: 'Salary slip', mode: 'Gen AI' },
          { name: 'Digilocker document', mode: 'Gen AI' },
          { name: 'Rent agreement', mode: 'Gen AI' },
          { name: 'Perfios report', mode: 'Gen AI' },
          { name: 'Deemed OVD document', mode: 'Human' },
          { name: 'Consent document', mode: 'Gen AI' },
        ],
      },
    },
    enhancement: {
      monthOnMonth: [
        { month: 'Oct 24', count: 2 },
        { month: 'Nov 24', count: 4 },
        { month: 'Dec 24', count: 3 },
        { month: 'Jan 25', count: 5 },
        { month: 'Feb 25', count: 6 },
        { month: 'Mar 25', count: 4 },
      ],
      details: [
        {
          month: 'Jan 25',
          description: 'Enhanced eligibility rules for self-employed applicants',
          raisedDate: '2024-12-15',
          deliveredDate: '2025-01-10',
        },
        {
          month: 'Feb 25',
          description: 'Improved document recognition accuracy',
          raisedDate: '2025-01-05',
          deliveredDate: '2025-02-20',
        },
        {
          month: 'Mar 25',
          description: 'Added support for additional income proof types',
          raisedDate: '2025-02-10',
          deliveredDate: '2025-03-15',
        },
      ],
      benefits: {
        ftr: {
          definition: 'First Time Right - cases processed without manual intervention',
          value: 87,
          isPercentage: true,
        },
        nftr: {
          definition: 'Not First Time Right - cases requiring rework or manual review',
          value: 13,
          isPercentage: true,
        },
        costBenefit: {
          definition: 'Annual cost savings from automation',
          value: 2500000,
          currency: 'INR',
        },
      },
      technical: {
        tokenConsumption: 4200,
        processingTimePerCase: 45,
        uptime: 99.8,
      },
    },
    issues: {
      openCount: 3,
      closedCount: 18,
      list: [
        {
          id: 'ISSUE-001',
          summary: 'Document OCR fails on handwritten forms',
          status: 'Open',
          raisedDate: '2025-02-28',
        },
        {
          id: 'ISSUE-002',
          summary: 'Edge case: non-standard income formats',
          status: 'Open',
          raisedDate: '2025-03-05',
        },
        {
          id: 'ISSUE-003',
          summary: 'Timeout on large document batches',
          status: 'Open',
          raisedDate: '2025-03-10',
        },
        {
          id: 'ISSUE-004',
          summary: 'Fixed: Address validation logic error',
          status: 'Closed',
          raisedDate: '2025-01-15',
          resolvedDate: '2025-02-05',
        },
        {
          id: 'ISSUE-005',
          summary: 'Fixed: Eligibility calculation precision',
          status: 'Closed',
          raisedDate: '2025-01-20',
          resolvedDate: '2025-02-10',
        },
      ],
    },
  },
  'Business Loan': {
    name: 'Business Loan',
    production: {
      coverage: {
        categories: [
          {
            name: 'Application Form',
            checkpoints: [
              { name: 'Application form completely filled per KYC and signed', mode: 'Human' },
              { name: 'Shareholding pattern documented (non-individual applicant)', mode: 'Human' },
              { name: 'Channel stamp and code present on application form', mode: 'Gen AI' },
            ],
          },
          {
            name: 'Office Address / Vintage Proof',
            checkpoints: [
              { name: 'Shops and Establishments certificate', mode: 'Gen AI' },
              { name: 'GST certificate', mode: 'Gen AI' },
              { name: 'Excise duty certificate', mode: 'Gen AI' },
              { name: 'MOA (companies)', mode: 'Gen AI' },
              { name: 'Partnership Form A and C', mode: 'Gen AI' },
            ],
          },
          {
            name: 'Ownership Proof',
            checkpoints: [
              { name: 'Latest property tax receipt (except Delhi/NCR)', mode: 'Gen AI' },
              { name: 'Latest water tax receipt', mode: 'Gen AI' },
              { name: 'Registered sale deed + latest utility bill / Index 2', mode: 'Both' },
              { name: 'Lease deed valid for >=99 years', mode: 'Gen AI' },
              { name: 'Vacant land exclusion check', mode: 'Human' },
              { name: 'OD/CC sanction letter with property details', mode: 'Both' },
              { name: 'Residence electricity bill (Govt/PSU provider)', mode: 'Gen AI' },
              { name: 'Home loan sanction letter / SOA with property address', mode: 'Gen AI' },
              { name: 'Registered gift deed', mode: 'Gen AI' },
              { name: 'Society maintenance bill (Gurgaon & Noida societies)', mode: 'Gen AI' },
            ],
          },
          {
            name: 'KYC — Non-Individual',
            checkpoints: [
              { name: 'AOA/MOA (company cases)', mode: 'Gen AI' },
              { name: 'Partnership deed (partnership cases)', mode: 'Gen AI' },
              { name: 'Bye-laws (society & trust)', mode: 'Gen AI' },
              { name: 'Certificate of Incorporation/Registration', mode: 'Gen AI' },
            ],
          },
          {
            name: 'Income Documents',
            checkpoints: [
              { name: 'Latest 2 years ITR + audited P&L + balance sheet + schedules', mode: 'Both' },
              { name: 'Latest 6 months bank statement, primary account (<15 days old)', mode: 'Gen AI' },
              { name: 'RTR / existing loan welcome letter with EMI clearance', mode: 'Human' },
              { name: 'Latest 1 year ITR & COI (alternate track)', mode: 'Both' },
              { name: 'SOA / sanction letter with financier\'s name', mode: 'Gen AI' },
            ],
          },
        ],
      },
      adoption: {
        totalCasesProcessed: 8540,
        schemesCovered: ['MSME Loan', 'Corporate Loan', 'Working Capital'],
        schemesNotCovered: ['Startup Loan'],
      },
      accuracy: {
        comparison: [
          { name: 'Name', mode: 'Gen AI', sources: ['Application form', 'Aadhaar', 'PAN', 'Digilocker', 'Rent agreement'] },
          { name: 'Date of birth', mode: 'Gen AI', sources: ['Application form', 'Aadhaar', 'PAN'] },
          { name: 'PAN number', mode: 'Gen AI', sources: ['PAN card', 'Application form', 'Bank statement'] },
          { name: 'Residential address', mode: 'Gen AI', sources: ['Aadhaar', 'Rent agreement', 'Bank statement'] },
          { name: 'Current address', mode: 'Gen AI', sources: ['Application form', 'Aadhaar', 'Utility bill'] },
          { name: 'Mother\'s name', mode: 'Both', sources: ['Aadhaar', 'PAN', 'Application form'] },
          { name: 'Bank name', mode: 'Gen AI', sources: ['Bank statement', 'Salary account', 'Application form'] },
          { name: 'Salary account number', mode: 'Gen AI', sources: ['Bank statement', 'Salary slip'] },
          { name: 'Company name', mode: 'Gen AI', sources: ['Salary slip', 'Offer letter', 'Bank statement'] },
          { name: 'CIBIL score', mode: 'Both', sources: ['Credit bureau report', 'Application form'] },
        ],
        questionnaire: [
          { name: 'Application form completely filled per KYC and signed', mode: 'Human' },
          { name: 'Shareholding pattern documented (non-individual applicant)', mode: 'Human' },
          { name: 'Channel stamp and code present on application form', mode: 'Gen AI' },
          { name: 'Shops and Establishments certificate', mode: 'Gen AI' },
          { name: 'GST certificate', mode: 'Gen AI' },
          { name: 'Excise duty certificate', mode: 'Gen AI' },
          { name: 'MOA (companies)', mode: 'Gen AI' },
          { name: 'Partnership Form A and C', mode: 'Gen AI' },
          { name: 'Latest property tax receipt (except Delhi/NCR)', mode: 'Gen AI' },
          { name: 'Latest water tax receipt', mode: 'Gen AI' },
          { name: 'Registered sale deed + latest utility bill / Index 2', mode: 'Both' },
          { name: 'Lease deed valid for >=99 years', mode: 'Gen AI' },
          { name: 'Vacant land exclusion check', mode: 'Human' },
          { name: 'OD/CC sanction letter with property details', mode: 'Both' },
          { name: 'Residence electricity bill (Govt/PSU provider)', mode: 'Gen AI' },
          { name: 'Home loan sanction letter / SOA with property address', mode: 'Gen AI' },
          { name: 'Registered gift deed', mode: 'Gen AI' },
          { name: 'Society maintenance bill (Gurgaon & Noida societies)', mode: 'Gen AI' },
          { name: 'AOA/MOA (company cases)', mode: 'Gen AI' },
          { name: 'Partnership deed (partnership cases)', mode: 'Gen AI' },
          { name: 'Bye-laws (society & trust)', mode: 'Gen AI' },
          { name: 'Certificate of Incorporation/Registration', mode: 'Gen AI' },
          { name: 'Latest 2 years ITR + audited P&L + balance sheet + schedules', mode: 'Both' },
          { name: 'Latest 6 months bank statement, primary account (<15 days old)', mode: 'Gen AI' },
          { name: 'RTR / existing loan welcome letter with EMI clearance', mode: 'Human' },
          { name: 'Latest 1 year ITR & COI (alternate track)', mode: 'Both' },
          { name: 'SOA / sanction letter with financier\'s name', mode: 'Gen AI' },
        ],
        availability: [
          { name: 'Application form', mode: 'Gen AI' },
          { name: 'Office address / vintage proof document', mode: 'Gen AI' },
          { name: 'Shops and Establishments certificate', mode: 'Gen AI' },
          { name: 'GST certificate', mode: 'Gen AI' },
          { name: 'Excise duty certificate', mode: 'Gen AI' },
          { name: 'MOA / Partnership Form A and C', mode: 'Gen AI' },
          { name: 'Property tax receipt', mode: 'Gen AI' },
          { name: 'Water tax receipt', mode: 'Gen AI' },
          { name: 'Registered sale deed', mode: 'Gen AI' },
          { name: 'Lease deed', mode: 'Gen AI' },
          { name: 'OD/CC sanction letter', mode: 'Gen AI' },
          { name: 'Electricity bill', mode: 'Gen AI' },
          { name: 'Home loan sanction letter / SOA', mode: 'Gen AI' },
          { name: 'Registered gift deed', mode: 'Gen AI' },
          { name: 'Society maintenance bill', mode: 'Gen AI' },
          { name: 'AOA/MOA / Partnership deed / Bye-laws / COI', mode: 'Gen AI' },
          { name: 'ITR (2 years) with audited financials', mode: 'Gen AI' },
          { name: 'Bank statement (6 months)', mode: 'Gen AI' },
          { name: 'RTR loan excel sheet / loan welcome letter', mode: 'Human' },
          { name: 'SOA / sanction letter with financier\'s name', mode: 'Gen AI' },
        ],
      },
    },
    enhancement: {
      monthOnMonth: [
        { month: 'Oct 24', count: 1 },
        { month: 'Nov 24', count: 3 },
        { month: 'Dec 24', count: 2 },
        { month: 'Jan 25', count: 4 },
        { month: 'Feb 25', count: 3 },
        { month: 'Mar 25', count: 5 },
      ],
      details: [
        {
          month: 'Dec 24',
          description: 'Added GST return auto-extraction',
          raisedDate: '2024-11-10',
          deliveredDate: '2024-12-20',
        },
        {
          month: 'Feb 25',
          description: 'Improved financial ratio calculations',
          raisedDate: '2025-01-15',
          deliveredDate: '2025-02-28',
        },
      ],
      benefits: {
        ftr: {
          definition: 'First Time Right - cases processed without manual intervention',
          value: 82,
          isPercentage: true,
        },
        nftr: {
          definition: 'Not First Time Right - cases requiring rework or manual review',
          value: 18,
          isPercentage: true,
        },
        costBenefit: {
          definition: 'Annual cost savings from automation',
          value: 1800000,
          currency: 'INR',
        },
      },
      technical: {
        tokenConsumption: 5600,
        processingTimePerCase: 62,
        uptime: 99.7,
      },
    },
    issues: {
      openCount: 2,
      closedCount: 12,
      list: [
        {
          id: 'ISSUE-101',
          summary: 'GST calculation variance in edge cases',
          status: 'Open',
          raisedDate: '2025-03-01',
        },
        {
          id: 'ISSUE-102',
          summary: 'Multi-entity business logic needs refinement',
          status: 'Open',
          raisedDate: '2025-03-08',
        },
        {
          id: 'ISSUE-103',
          summary: 'Fixed: Balance sheet reconciliation',
          status: 'Closed',
          raisedDate: '2025-02-01',
          resolvedDate: '2025-02-15',
        },
      ],
    },
  },
}

// Return empty/placeholder data for products without specific data
export function getProductDetailData(productName: string): ProductDetailData {
  // Predefined checkpoint categories for other loan products
  const otherProductsCheckpoints: Record<string, CheckpointCategory[]> = {
    'Home Loan (HL)': [
      {
        name: 'Property Verification',
        checkpoints: [
          { name: 'Property registration certificate', mode: 'Gen AI' },
          { name: 'Property tax receipt', mode: 'Gen AI' },
          { name: 'Site plan approval', mode: 'Human' },
          { name: 'Construction progress report', mode: 'Both' },
          { name: 'Legal clearance from lawyer', mode: 'Human' },
        ],
      },
      {
        name: 'Financial Documents',
        checkpoints: [
          { name: '2 years ITR', mode: 'Gen AI' },
          { name: 'Bank statements (6 months)', mode: 'Gen AI' },
          { name: 'Form 16 & salary slips', mode: 'Both' },
          { name: 'Income verification from employer', mode: 'Human' },
        ],
      },
      {
        name: 'Title & Ownership',
        checkpoints: [
          { name: 'Sale deed verification', mode: 'Gen AI' },
          { name: 'Previous ownership history check', mode: 'Both' },
          { name: 'Encumbrance certificate', mode: 'Gen AI' },
          { name: 'No objection from builder/seller', mode: 'Human' },
        ],
      },
    ],
    'Loan Against Property (LAP)': [
      {
        name: 'Property Document Verification',
        checkpoints: [
          { name: 'Sale deed & registered documents', mode: 'Gen AI' },
          { name: 'Latest property tax receipt', mode: 'Gen AI' },
          { name: 'Encumbrance clearance', mode: 'Both' },
          { name: 'Property valuator report', mode: 'Human' },
        ],
      },
      {
        name: 'Existing Obligations',
        checkpoints: [
          { name: 'Existing mortgage details', mode: 'Gen AI' },
          { name: 'EMI payment verification', mode: 'Both' },
          { name: 'No objection from existing lender', mode: 'Human' },
        ],
      },
      {
        name: 'Financial Assessment',
        checkpoints: [
          { name: 'Income proof (ITR/salary slip)', mode: 'Gen AI' },
          { name: 'Bank statement analysis', mode: 'Both' },
          { name: 'Repayment capacity calculation', mode: 'Human' },
        ],
      },
    ],
    'Used Car Loan': [
      {
        name: 'Vehicle Documentation',
        checkpoints: [
          { name: 'RC (Registration Certificate)', mode: 'Gen AI' },
          { name: 'Insurance policy copy', mode: 'Gen AI' },
          { name: 'Pollution certificate', mode: 'Gen AI' },
          { name: 'Vehicle inspection report', mode: 'Human' },
        ],
      },
      {
        name: 'Ownership Verification',
        checkpoints: [
          { name: 'Previous ownership check', mode: 'Gen AI' },
          { name: 'Transfer of ownership documents', mode: 'Both' },
          { name: 'NOC from previous owner', mode: 'Human' },
        ],
      },
      {
        name: 'Financial Verification',
        checkpoints: [
          { name: 'Income proof', mode: 'Gen AI' },
          { name: 'Credit history check', mode: 'Gen AI' },
          { name: 'Down payment verification', mode: 'Both' },
        ],
      },
    ],
  }

  if (PRODUCT_DETAIL_DATA[productName]) {
    return PRODUCT_DETAIL_DATA[productName]
  }

  // Use predefined data if available, otherwise generate basic structure
  const categories = otherProductsCheckpoints[productName] || [
    {
      name: 'Document Verification',
      checkpoints: [
        { name: 'Document 1', mode: 'Gen AI' },
        { name: 'Document 2', mode: 'Human' },
        { name: 'Document 3', mode: 'Both' },
      ],
    },
    {
      name: 'Financial Assessment',
      checkpoints: [
        { name: 'Income verification', mode: 'Gen AI' },
        { name: 'Credit check', mode: 'Gen AI' },
      ],
    },
  ]

  return {
    name: productName,
    production: {
      coverage: {
        categories,
      },
      adoption: {
        totalCasesProcessed: 0,
        schemesCovered: [],
        schemesNotCovered: [],
      },
      accuracy: {
        comparison: [
          { name: 'Name', mode: 'Gen AI', sources: ['Application form', 'Aadhaar', 'PAN', 'Digilocker', 'Rent agreement'] },
          { name: 'Date of birth', mode: 'Gen AI', sources: ['Application form', 'Aadhaar', 'PAN'] },
          { name: 'PAN number', mode: 'Gen AI', sources: ['PAN card', 'Application form', 'Bank statement'] },
          { name: 'Residential address', mode: 'Gen AI', sources: ['Aadhaar', 'Rent agreement', 'Bank statement'] },
          { name: 'Current address', mode: 'Gen AI', sources: ['Application form', 'Aadhaar', 'Utility bill'] },
          { name: 'Mother\'s name', mode: 'Both', sources: ['Aadhaar', 'PAN', 'Application form'] },
          { name: 'Bank name', mode: 'Gen AI', sources: ['Bank statement', 'Salary account', 'Application form'] },
          { name: 'Salary account number', mode: 'Gen AI', sources: ['Bank statement', 'Salary slip'] },
          { name: 'Company name', mode: 'Gen AI', sources: ['Salary slip', 'Offer letter', 'Bank statement'] },
          { name: 'CIBIL score', mode: 'Both', sources: ['Credit bureau report', 'Application form'] },
        ],
        questionnaire: categories.flatMap(cat => cat.checkpoints),
        availability: [
          { name: 'Primary identity document', mode: 'Gen AI' },
          { name: 'Address proof', mode: 'Gen AI' },
          { name: 'Income document', mode: 'Gen AI' },
          { name: 'Bank statement', mode: 'Gen AI' },
          { name: 'Employment verification', mode: 'Gen AI' },
          { name: 'Credit report', mode: 'Gen AI' },
          { name: 'Additional supporting document', mode: 'Human' },
        ],
      },
    },
    enhancement: {
      monthOnMonth: [],
      details: [],
      benefits: {
        ftr: { definition: 'First Time Right', value: 0, isPercentage: true },
        nftr: { definition: 'Not First Time Right', value: 0, isPercentage: true },
        costBenefit: { definition: 'Cost Benefit', value: 0, currency: 'INR' },
      },
      technical: {
        tokenConsumption: 0,
        processingTimePerCase: 0,
        uptime: 0,
      },
    },
    issues: {
      openCount: 0,
      closedCount: 0,
      list: [],
    },
  }
}
