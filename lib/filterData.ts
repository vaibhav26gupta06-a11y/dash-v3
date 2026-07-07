export function filterByDateRange(
  data: any[],
  dateRange: string,
  monthKey: string = 'month'
): any[] {
  const slices: Record<string, number> = {
    'Last 30 Days': 1,
    'Last Quarter': 3,
    'Last 6 Months': 6,
    'All Time': 999,
  }
  const n = slices[dateRange] ?? 3
  return data.slice(-n)
}

export function getDocTypesForProduct(productLine: string): string[] {
  const docTypeMap: Record<string, string[]> = {
    'Personal Loan (PL)': ['PAN', 'Aadhaar', 'Salary Slip', 'Bank Statement', 'ITR', 'Form 16'],
    'Home Loan (HL)': ['PAN', 'Aadhaar', 'Bank Statement', 'ITR', 'Property Document', 'Valuation Report'],
    'Used Car Loan (UCL)': ['PAN', 'Aadhaar', 'Bank Statement', 'RC Book', 'Valuation Report'],
    'New Car Loan (NCL)': ['PAN', 'Aadhaar', 'Salary Slip', 'Bank Statement', 'ITR', 'RC Book'],
    'Business Loan (BL)': ['PAN', 'GST Return', 'Bank Statement', 'Business Financials', 'Audit Report'],
    'LAP': ['PAN', 'Aadhaar', 'Bank Statement', 'Investment Statement', 'Valuation Report'],
    'Easy Loan (EL)': ['PAN', 'Aadhaar', 'Salary Slip', 'Bank Statement'],
    'Two Wheeler Loan (TWL)': ['PAN', 'Aadhaar', 'Bank Statement', 'RC Book', 'Insurance Document'],
    'Loan Against Securities (LAS)': ['PAN', 'Bank Statement', 'Investment Statement', 'Broker Statement'],
    'Credit Enabled Quote (CEQ)': ['PAN', 'Aadhaar', 'Bank Statement', 'Income Proof'],
  }
  return docTypeMap[productLine] || []
}
