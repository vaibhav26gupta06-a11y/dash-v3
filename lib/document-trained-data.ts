// This dataset represents a subset of a ~140-document training library
// shared across all loan products. The array can be extended with more entries
// following the same shape: { type, subCategory, mode, format, trained }

export interface TrainedDocument {
  type: string
  subCategory: string
  mode: 'Physical' | 'Digital' | 'Both' | '—'
  format: string
  trained: 'Y' | 'N'
}

export interface DocumentCategory {
  name: string
  documents: TrainedDocument[]
}

export const DOCUMENT_TRAINED_CATEGORIES: DocumentCategory[] = [
  {
    name: 'Identity & KYC',
    documents: [
      { type: 'Application form', subCategory: 'NA', mode: 'Both', format: 'PDF', trained: 'Y' },
      { type: 'PAN', subCategory: 'NA', mode: 'Physical', format: 'JPEG, PDF', trained: 'Y' },
      { type: 'Aadhaar', subCategory: 'NA', mode: 'Both', format: 'JPEG, PDF', trained: 'Y' },
      { type: 'CKYC report', subCategory: 'NA', mode: 'Both', format: 'PDF', trained: 'Y' },
      { type: 'OKYC report', subCategory: 'NA', mode: 'Both', format: 'PDF', trained: 'Y' },
      { type: 'Passport', subCategory: 'NA', mode: 'Physical', format: '—', trained: 'N' },
      { type: 'Driving licence', subCategory: 'NA', mode: 'Both', format: '—', trained: 'N' },
      { type: 'PAN-Aadhaar linkage (Data Sutram)', subCategory: 'NA', mode: 'Both', format: 'PDF', trained: 'N' },
      { type: 'PAN verification report (NSDL)', subCategory: 'NA', mode: 'Both', format: 'PDF', trained: 'N' },
      { type: 'Family tree', subCategory: 'NA', mode: '—', format: '—', trained: 'Y' },
      { type: 'CERSAI', subCategory: 'NA', mode: '—', format: '—', trained: 'Y' },
      { type: 'LEI', subCategory: 'NA', mode: '—', format: '—', trained: 'Y' },
      { type: 'Beneficial ownership declaration', subCategory: 'NA', mode: '—', format: '—', trained: 'Y' },
    ],
  },
  {
    name: 'Address & Property Proof',
    documents: [
      { type: 'Rent agreement', subCategory: 'NA', mode: 'Physical', format: 'JPEG, PDF', trained: 'Y' },
      { type: 'Electricity bill', subCategory: 'NA', mode: 'Physical', format: 'JPEG, PDF', trained: 'Y' },
      { type: 'Gas bill', subCategory: 'NA', mode: 'Physical', format: 'JPEG, PDF', trained: 'Y' },
      { type: 'Mobile bill', subCategory: 'NA', mode: 'Physical', format: 'JPEG, PDF', trained: 'N' },
      { type: 'Wifi bill', subCategory: 'NA', mode: 'Physical', format: 'JPEG, PDF', trained: 'N' },
      { type: 'Property tax receipt', subCategory: 'NA', mode: '—', format: '—', trained: 'Y' },
      { type: 'House tax bill', subCategory: 'NA', mode: '—', format: '—', trained: 'N' },
      { type: 'Registered sale deed', subCategory: 'NA', mode: '—', format: '—', trained: 'Y' },
      { type: 'Land documents — UCL', subCategory: 'NA', mode: '—', format: '—', trained: 'N' },
      { type: 'Lease deed', subCategory: 'NA', mode: '—', format: '—', trained: 'Y' },
      { type: 'Registered gift deed', subCategory: 'NA', mode: '—', format: '—', trained: 'Y' },
      { type: 'Index 2', subCategory: 'NA', mode: '—', format: '—', trained: 'Y' },
    ],
  },
  {
    name: 'Financial & Business Proof',
    documents: [
      { type: 'GST certificate', subCategory: 'NA', mode: 'Both', format: 'PDF', trained: 'Y' },
      { type: 'Udhyam certificate', subCategory: 'Business proof', mode: 'Both', format: 'PDF', trained: 'Y' },
      { type: 'Gumasta certificate', subCategory: 'Business proof', mode: 'Both', format: 'PDF', trained: 'Y' },
      { type: 'ITR file', subCategory: 'Business proof', mode: 'Both', format: 'PDF', trained: 'Y' },
      { type: 'Bank statement', subCategory: 'NA', mode: 'Physical', format: 'JPEG, PDF', trained: 'Y' },
      { type: 'Form 26AS', subCategory: 'NA', mode: '—', format: '—', trained: 'Y' },
      { type: 'RTR', subCategory: 'NA', mode: '—', format: '—', trained: 'Y' },
      { type: 'KARZA', subCategory: 'NA', mode: '—', format: '—', trained: 'Y' },
      { type: 'CIBIL worksheet', subCategory: 'NA', mode: '—', format: '—', trained: 'Y' },
      { type: 'CRIF', subCategory: 'NA', mode: '—', format: '—', trained: 'Y' },
      { type: 'Shop & establishment certificate', subCategory: 'NA', mode: '—', format: '—', trained: 'Y' },
      { type: 'Excise certificate', subCategory: 'NA', mode: '—', format: '—', trained: 'Y' },
      { type: 'Shareholding pattern', subCategory: 'NA', mode: '—', format: '—', trained: 'N' },
      { type: 'Partnership authority letter', subCategory: 'NA', mode: '—', format: '—', trained: 'N' },
      { type: 'Trade licence', subCategory: 'NA', mode: '—', format: '—', trained: 'N' },
      { type: 'Labour licence', subCategory: 'NA', mode: '—', format: '—', trained: 'N' },
      { type: 'Drug licence', subCategory: 'NA', mode: '—', format: '—', trained: 'N' },
      { type: 'Increment letter', subCategory: 'NA', mode: '—', format: '—', trained: 'N' },
    ],
  },
  {
    name: 'Loan Processing, Insurance & Approvals',
    documents: [
      { type: 'KFS', subCategory: 'NA', mode: 'Both', format: 'PDF', trained: 'Y' },
      { type: 'NACH (physical)', subCategory: 'Mandate', mode: 'Physical', format: 'PDF', trained: 'Y' },
      { type: 'ENach (digital)', subCategory: 'Mandate', mode: 'Digital', format: 'PDF', trained: 'Y' },
      { type: 'PDC / PDC schedule', subCategory: 'Mandate', mode: 'Physical', format: 'PDF', trained: 'Y' },
      { type: 'Cancelled cheque', subCategory: 'Mandate', mode: 'Physical', format: 'PDF', trained: 'Y' },
      { type: 'SI proof', subCategory: 'Mandate', mode: 'Physical', format: 'PDF', trained: 'Y' },
      { type: 'Agreement', subCategory: 'NA', mode: 'Both', format: 'PDF', trained: 'Y' },
      { type: 'Sanction letter', subCategory: 'NA', mode: 'Physical', format: 'PDF', trained: 'Y' },
      { type: 'End use declaration', subCategory: 'NA', mode: 'Physical', format: 'PDF', trained: 'Y' },
      { type: 'Disbursement memo', subCategory: 'NA', mode: 'Physical, BT cases', format: 'PDF', trained: 'Y' },
      { type: 'Annexure', subCategory: 'NA', mode: 'Physical', format: 'PDF', trained: 'Y' },
      { type: 'Insurance — AIA', subCategory: 'Insurance', mode: 'Both', format: 'PDF', trained: 'Y' },
      { type: 'Insurance — AIG', subCategory: 'Insurance', mode: 'Both', format: 'PDF', trained: 'Y' },
      { type: 'Insurance — IHO', subCategory: 'Insurance', mode: 'Both', format: 'PDF', trained: 'Y' },
      { type: 'Insurance — CPP', subCategory: 'Insurance', mode: 'Both', format: 'PDF', trained: 'Y' },
      { type: 'Insurance — wallet asset', subCategory: 'Insurance', mode: 'Both', format: 'PDF', trained: 'Y' },
      { type: 'Insurance — AIG 360', subCategory: 'Insurance', mode: 'Both', format: 'PDF', trained: 'Y' },
      { type: 'Insurance calculator — Tata AIG', subCategory: 'Insurance', mode: 'Both', format: 'PDF', trained: 'Y' },
      { type: 'FI — residence', subCategory: 'FI', mode: 'Both', format: 'PDF', trained: 'Y' },
      { type: 'FI — office/PD report', subCategory: 'FI', mode: 'Both', format: 'PDF', trained: 'Y' },
      { type: 'VM report', subCategory: 'NA', mode: 'Both', format: 'PDF', trained: 'Y' },
      { type: 'Repayment schedule', subCategory: 'NA', mode: '—', format: '—', trained: 'Y' },
      { type: 'E-mandate', subCategory: 'NA', mode: '—', format: '—', trained: 'Y' },
      { type: 'Accepted sanction letter', subCategory: 'NA', mode: '—', format: '—', trained: 'Y' },
      { type: 'GST verification', subCategory: 'NA', mode: '—', format: '—', trained: 'Y' },
      { type: 'HL SOA', subCategory: 'NA', mode: '—', format: '—', trained: 'Y' },
      { type: 'SOA', subCategory: 'NA', mode: '—', format: '—', trained: 'Y' },
      { type: 'CC/OD sanction letter', subCategory: 'NA', mode: '—', format: '—', trained: 'Y' },
      { type: 'Penny drop report', subCategory: 'NA', mode: '—', format: '—', trained: 'Y' },
      { type: 'Vehicle insurance', subCategory: 'NA', mode: '—', format: '—', trained: 'Y' },
      { type: 'Mail approval', subCategory: 'Mails', mode: 'Both', format: '—', trained: 'N' },
      { type: 'ST approval', subCategory: 'Mails', mode: 'Both', format: '—', trained: 'N' },
      { type: 'Hunter approval', subCategory: 'Mails', mode: 'Both', format: '—', trained: 'N' },
      { type: 'Posidex approval', subCategory: 'Mails', mode: 'Both', format: '—', trained: 'N' },
      { type: 'Rate approval', subCategory: 'Mails', mode: 'Both', format: '—', trained: 'N' },
      { type: 'RCU approval', subCategory: 'Mails', mode: 'Both', format: '—', trained: 'N' },
      { type: 'Company letterhead — Cat A', subCategory: 'NA', mode: '—', format: '—', trained: 'N' },
      { type: 'Sampark report', subCategory: 'NA', mode: '—', format: '—', trained: 'N' },
      { type: 'Finnbox', subCategory: 'NA', mode: '—', format: '—', trained: 'N' },
      { type: 'Deferral approval', subCategory: 'NA', mode: '—', format: '—', trained: 'N' },
      { type: 'MMR copy', subCategory: 'NA', mode: '—', format: '—', trained: 'N' },
      { type: 'Delivery order', subCategory: 'NA', mode: '—', format: '—', trained: 'N' },
      { type: 'RTO set', subCategory: 'NA', mode: '—', format: '—', trained: 'N' },
      { type: 'IMR', subCategory: 'NA', mode: '—', format: '—', trained: 'N' },
    ],
  },
]
