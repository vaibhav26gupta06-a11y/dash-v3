export interface MonthlyTrend {
  month: string
  cases: number
  changePercent?: number
}

export interface SchemeInfo {
  name: string
  cases: number
  covered: boolean
}

export interface ChannelInfo {
  name: string
  cases: number
  percent: number
}

export interface AdoptionData {
  monthlyTrend: MonthlyTrend[]
  monthlyTarget: number
  schemes: SchemeInfo[]
  channels: ChannelInfo[]
}

// Calculate percentage change between months
function calculateChangePercent(current: number, previous: number): number {
  if (previous === 0) return 0
  return parseFloat((((current - previous) / previous) * 100).toFixed(1))
}

// Personal Loan data
export const ADOPTION_DATA: Record<string, AdoptionData> = {
  'Personal Loan (PL)': {
    monthlyTrend: [
      { month: 'Feb', cases: 11200, changePercent: undefined },
      { month: 'Mar', cases: 12050, changePercent: calculateChangePercent(12050, 11200) },
      { month: 'Apr', cases: 12980, changePercent: calculateChangePercent(12980, 12050) },
      { month: 'May', cases: 13850, changePercent: calculateChangePercent(13850, 12980) },
      { month: 'Jun', cases: 14600, changePercent: calculateChangePercent(14600, 13850) },
      { month: 'Jul', cases: 15420, changePercent: calculateChangePercent(15420, 14600) },
    ],
    monthlyTarget: 16000,
    schemes: [
      { name: 'Standard PL', cases: 9200, covered: true },
      { name: 'Salary Advance', cases: 4100, covered: true },
      { name: 'High-Value PL', cases: 2120, covered: true },
      { name: 'Emergency PL', cases: 0, covered: false },
    ],
    channels: [
      { name: 'Mobile app', cases: 9560, percent: 0 },
      { name: 'Web', cases: 4318, percent: 0 },
      { name: 'Branch assisted', cases: 1542, percent: 0 },
    ],
  },
}

// Calculate percentages for channels
function getAdoptionData(productName: string): AdoptionData {
  const data = ADOPTION_DATA[productName]
  if (!data) {
    // Return default fallback data
    const totalCases = 15420
    return {
      monthlyTrend: [
        { month: 'Feb', cases: 11200, changePercent: undefined },
        { month: 'Mar', cases: 12050, changePercent: 7.6 },
        { month: 'Apr', cases: 12980, changePercent: 7.7 },
        { month: 'May', cases: 13850, changePercent: 6.7 },
        { month: 'Jun', cases: 14600, changePercent: 5.4 },
        { month: 'Jul', cases: 15420, changePercent: 5.6 },
      ],
      monthlyTarget: 16000,
      schemes: [
        { name: 'Standard PL', cases: 9200, covered: true },
        { name: 'Salary Advance', cases: 4100, covered: true },
        { name: 'High-Value PL', cases: 2120, covered: true },
        { name: 'Emergency PL', cases: 0, covered: false },
      ],
      channels: [
        { name: 'Mobile app', cases: 9560, percent: 62.0 },
        { name: 'Web', cases: 4318, percent: 28.0 },
        { name: 'Branch assisted', cases: 1542, percent: 10.0 },
      ],
    }
  }

  // Calculate channel percentages
  const totalCases = data.channels.reduce((sum, c) => sum + c.cases, 0)
  const channelsWithPercent = data.channels.map(c => ({
    ...c,
    percent: totalCases > 0 ? parseFloat(((c.cases / totalCases) * 100).toFixed(1)) : 0,
  }))

  return {
    ...data,
    channels: channelsWithPercent,
  }
}

export default getAdoptionData
