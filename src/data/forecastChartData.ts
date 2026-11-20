export type ForecastPeriod = '7D' | '30D' | '60D' | '90D' | '1Y' | '2Y'

export const forecastPeriods: { key: ForecastPeriod; label: string }[] = [
  { key: '2Y', label: '2Y' },
  { key: '1Y', label: '1Y' },
  { key: '90D', label: '90D' },
  { key: '60D', label: '60D' },
  { key: '30D', label: '30D' },
  { key: '7D', label: '7D' },
]

/** Seasonal demand index — peaks Nov–Dec (Christmas), elevated Jan (New Year restock) */
const MONTHLY_SEASONAL = [72, 68, 75, 78, 82, 88, 85, 90, 95, 102, 118, 125]
const MONTHLY_FORECAST = [70, 72, 78, 80, 85, 90, 88, 93, 98, 108, 122, 128]

function monthLabel(yearOffset: number, monthIndex: number): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const year = 2025 + yearOffset
  return `${months[monthIndex]} '${String(year).slice(2)}`
}

function generateDailyData(days: number) {
  const labels: string[] = []
  const actual: number[] = []
  const forecast: number[] = []
  const upper: number[] = []
  const lower: number[] = []

  const start = new Date(2026, 0, 1)
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(start)
    d.setDate(d.getDate() - i)
    labels.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
    const monthIdx = d.getMonth()
    const base = MONTHLY_SEASONAL[monthIdx]
    const dayNoise = Math.sin(i * 0.4) * 4 + (i % 7) * 0.5
    const val = Math.round(base + dayNoise)
    actual.push(val)
    forecast.push(Math.round(val * (0.97 + (i % 5) * 0.01)))
    upper.push(Math.round(val * 1.12))
    lower.push(Math.round(val * 0.88))
  }
  return { labels, actual, forecast, upper, lower }
}

export function getForecastChartData(period: ForecastPeriod) {
  if (period === '1Y') {
    const labels = MONTHLY_SEASONAL.map((_, i) => monthLabel(0, i))
    return {
      labels,
      actual: MONTHLY_SEASONAL,
      forecast: MONTHLY_FORECAST,
      upper: MONTHLY_SEASONAL.map((v) => Math.round(v * 1.15)),
      lower: MONTHLY_SEASONAL.map((v) => Math.round(v * 0.85)),
      subtitle: '12-month view · seasonal peaks highlighted',
    }
  }

  if (period === '2Y') {
    const labels = [
      ...MONTHLY_SEASONAL.map((_, i) => monthLabel(0, i)),
      ...MONTHLY_SEASONAL.map((_, i) => monthLabel(1, i)),
    ]
    const y1 = MONTHLY_SEASONAL
    const y2 = MONTHLY_SEASONAL.map((v, i) => Math.round(v * (1.04 + (i === 10 || i === 11 ? 0.06 : 0))))
    const actual = [...y1, ...y2]
    const forecast = [...MONTHLY_FORECAST, ...MONTHLY_FORECAST.map((v) => Math.round(v * 1.05))]
    return {
      labels,
      actual,
      forecast,
      upper: actual.map((v) => Math.round(v * 1.14)),
      lower: actual.map((v) => Math.round(v * 0.86)),
      subtitle: '24-month view · compare Christmas & New Year cycles',
    }
  }

  const dayMap: Record<string, number> = { '7D': 7, '30D': 30, '60D': 60, '90D': 90 }
  const data = generateDailyData(dayMap[period])
  return {
    ...data,
    subtitle: `${period} rolling window · daily demand index`,
  }
}

export function getSeasonalInsights(period: ForecastPeriod) {
  const base = [
    {
      title: 'Christmas Peak (Nov–Dec)',
      desc: 'Fast-moving items surge +18–25%. Pre-build safety stock by mid-October.',
      icon: 'celebration',
    },
    {
      title: 'New Year Restock Wave',
      desc: 'January shows +12% demand as warehouses replenish after holiday depletion.',
      icon: 'event',
    },
    {
      title: 'Fast-Mover Pattern',
      desc: 'Electric motors & semiconductors move 3.2× faster during Q4 seasonal window.',
      icon: 'speed',
    },
  ]

  if (period === '2Y') {
    return [
      ...base,
      {
        title: '2-Year Trend',
        desc: 'YoY Christmas demand up 6.4%. Model predicts similar peak in upcoming Nov–Dec cycle.',
        icon: 'timeline',
      },
    ]
  }

  if (period === '1Y') {
    return base
  }

  return [
    {
      title: 'Short-Term Spike',
      desc: 'Next 90 days includes pre-holiday ramp. Monitor weekly velocity on Class A SKUs.',
      icon: 'trending_up',
    },
    {
      title: 'Supply Chain Alert',
      desc: 'Lead times increasing for semiconductor components ahead of seasonal demand.',
      icon: 'warning',
    },
    {
      title: 'Optimization Opportunity',
      desc: 'Reduce safety stock for Class C items by 12% outside peak seasons.',
      icon: 'insights',
    },
  ]
}

export function getSeasonMarkers(period: ForecastPeriod): { label: string; index: number }[] {
  if (period === '1Y') {
    return [
      { label: 'New Year', index: 0 },
      { label: 'Christmas', index: 10 },
      { label: 'Year-End', index: 11 },
    ]
  }
  if (period === '2Y') {
    return [
      { label: 'New Year', index: 0 },
      { label: 'Christmas', index: 10 },
      { label: 'New Year', index: 12 },
      { label: 'Christmas', index: 22 },
    ]
  }
  return []
}

export function getPeriodSummary(period: ForecastPeriod) {
  const summaries: Record<ForecastPeriod, string> = {
    '7D': '7-day snapshot for immediate reorder decisions',
    '30D': '30-day trend for short-cycle inventory planning',
    '60D': '60-day outlook for procurement lead-time alignment',
    '90D': '90-day forecast for quarterly purchase planning',
    '1Y': 'Full-year seasonal analysis — Christmas, New Year & Q4 fast-mover peaks',
    '2Y': 'Two-year historical + forecast — compare seasonal cycles & YoY growth',
  }
  return summaries[period]
}
