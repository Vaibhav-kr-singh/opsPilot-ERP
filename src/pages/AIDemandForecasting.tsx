import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js'
import { useMemo, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import {
  type ForecastPeriod,
  forecastPeriods,
  getForecastChartData,
  getPeriodSummary,
  getSeasonMarkers,
  getSeasonalInsights,
} from '../data/forecastChartData'
import { GhostButton, PageHeader, PrimaryButton, SecondaryButton } from '../components/ui/SharedUI'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const fontStack = 'Inter, system-ui, sans-serif'

export default function AIDemandForecasting() {
  const navigate = useNavigate()
  const { forecastItems, recalculateForecast, filterBySearch } = useApp()
  const [period, setPeriod] = useState<ForecastPeriod>('1Y')
  const filtered = filterBySearch(forecastItems, ['product', 'sku'])

  const chartSource = useMemo(() => getForecastChartData(period), [period])
  const insights = useMemo(() => getSeasonalInsights(period), [period])
  const seasonMarkers = useMemo(() => getSeasonMarkers(period), [period])
  const isLongRange = period === '1Y' || period === '2Y'

  const chartData = {
    labels: chartSource.labels,
    datasets: [
      {
        label: 'Confidence Upper',
        data: chartSource.upper,
        borderColor: 'transparent',
        backgroundColor: 'rgba(16, 185, 129, 0.12)',
        fill: '+1',
        pointRadius: 0,
        tension: 0.35,
      },
      {
        label: 'Confidence Lower',
        data: chartSource.lower,
        borderColor: 'transparent',
        backgroundColor: 'transparent',
        fill: false,
        pointRadius: 0,
        tension: 0.35,
      },
      {
        label: 'Actual Demand',
        data: chartSource.actual,
        borderColor: '#000000',
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointRadius: isLongRange ? 3 : 0,
        pointHoverRadius: 5,
        tension: 0.35,
        fill: false,
      },
      {
        label: 'AI Forecast',
        data: chartSource.forecast,
        borderColor: '#10B981',
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderDash: [6, 4],
        pointRadius: 0,
        tension: 0.35,
        fill: false,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index' as const, intersect: false },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: { font: { family: fontStack, size: 11 }, usePointStyle: true, boxWidth: 8 },
      },
      tooltip: {
        callbacks: {
          afterBody: (items: { dataIndex: number }[]) => {
            const idx = items[0]?.dataIndex
            const marker = seasonMarkers.find((m) => m.index === idx)
            return marker ? [`📅 ${marker.label} season`] : []
          },
        },
      },
    },
    scales: {
      y: {
        title: { display: true, text: 'Demand Index', font: { family: fontStack, size: 11 } },
        grid: { color: '#E2E8F0' },
        ticks: { font: { family: fontStack, size: 10 } },
      },
      x: {
        grid: { display: false },
        ticks: {
          font: { family: fontStack, size: 10 },
          maxRotation: isLongRange ? 45 : 0,
          autoSkip: true,
          maxTicksLimit: period === '2Y' ? 12 : period === '1Y' ? 12 : 15,
        },
      },
    },
  }

  return (
    <>
      <PageHeader
        title="AI Demand Engine"
        breadcrumb="Demand Forecasting"
        subtitle="Predictive inventory monitoring powered by machine learning."
        actions={
          <>
            <GhostButton>Export Analysis</GhostButton>
            <SecondaryButton onClick={recalculateForecast}>Recalculate Now</SecondaryButton>
          </>
        }
      />

      <div className="glass-card p-stack_md rounded-xl">
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="text-display-lg font-display-lg text-primary">94.2%</div>
          <div>
            <div className="font-title-lg text-title-lg">Model Confidence Score</div>
            <div className="text-on-surface-variant">Based on 24M data points · 5yr historical · Volatility: High</div>
          </div>
          <div className="flex flex-wrap gap-2 ml-auto">
            {['24M Data Points', '5yr Historical', '2Y Seasonal Model', 'Volatility High'].map((badge) => (
              <span key={badge} className="px-3 py-1 bg-surface-container-low rounded-full text-label-sm border border-outline-variant">{badge}</span>
            ))}
          </div>
        </div>

        <div className="mb-2 flex flex-wrap justify-between items-center gap-3">
          <div>
            <h3 className="font-title-lg text-title-lg">Demand Prediction Chart</h3>
            <p className="text-label-sm text-on-surface-variant">{getPeriodSummary(period)}</p>
          </div>
          <div className="flex flex-wrap gap-1">
            {forecastPeriods.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                className={`px-3 py-1.5 rounded-lg text-label-sm font-label-md transition-colors ${
                  period === key ? 'bg-primary text-on-primary' : 'hover:bg-surface-container-low border border-outline-variant/50'
                }`}
                onClick={() => setPeriod(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {isLongRange && seasonMarkers.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {seasonMarkers.map((m) => (
              <span key={`${m.label}-${m.index}`} className="inline-flex items-center gap-1 px-2 py-0.5 bg-secondary-container/30 text-on-secondary-container rounded-full text-[11px] font-label-md">
                <span className="material-symbols-outlined text-[14px]">event</span>
                {m.label}
              </span>
            ))}
          </div>
        )}

        <div className={`relative bg-surface-container-low/50 rounded-lg overflow-hidden ${isLongRange ? 'h-72' : 'h-52'}`}>
          <Line data={chartData} options={chartOptions} />
        </div>

        {isLongRange && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant">
              <div className="text-label-sm text-on-surface-variant">Christmas Peak (Avg)</div>
              <div className="text-headline-sm font-headline-sm text-primary">+22%</div>
              <div className="text-[11px] text-on-surface-variant">Nov–Dec vs annual mean</div>
            </div>
            <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant">
              <div className="text-label-sm text-on-surface-variant">New Year Restock</div>
              <div className="text-headline-sm font-headline-sm text-primary">+12%</div>
              <div className="text-[11px] text-on-surface-variant">January vs February baseline</div>
            </div>
            <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant">
              <div className="text-label-sm text-on-surface-variant">Fast-Mover Velocity (Q4)</div>
              <div className="text-headline-sm font-headline-sm text-secondary">3.2×</div>
              <div className="text-[11px] text-on-surface-variant">Class A items vs off-season</div>
            </div>
          </div>
        )}
      </div>

      <div className={`grid gap-stack_md ${insights.length === 4 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-3'}`}>
        {insights.map((trigger) => (
          <div key={trigger.title} className="glass-card p-stack_md rounded-xl">
            <span className="material-symbols-outlined text-secondary mb-2">{trigger.icon}</span>
            <div className="font-label-md mb-1">{trigger.title}</div>
            <div className="text-label-sm text-on-surface-variant">{trigger.desc}</div>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-stack_md border-b border-outline-variant bg-surface-container-low/50 flex justify-between items-center">
          <h3 className="font-title-lg text-title-lg">Predictive Inventory Monitor</h3>
          <PrimaryButton onClick={() => navigate('/purchase-recommendations')}>Bulk Order Recommended</PrimaryButton>
        </div>
        <div className="table-scroll">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-surface-container-low/30 border-b border-outline-variant">
              <tr>
                {['Product', 'SKU', 'Current Stock', 'Predicted Demand', 'Confidence', 'Trend', 'Reorder Point'].map((h) => (
                  <th key={h} className="px-4 py-3 font-label-sm text-label-sm uppercase text-on-surface-variant">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-surface-container-low transition-colors cursor-pointer" onClick={() => navigate('/inventory')}>
                  <td className="px-4 py-3">{item.product}</td>
                  <td className="px-4 py-3 font-data-mono">{item.sku}</td>
                  <td className="px-4 py-3 font-data-mono">{item.currentStock}</td>
                  <td className="px-4 py-3 font-data-mono">{item.predictedDemand}</td>
                  <td className="px-4 py-3"><span className="text-secondary font-bold">{item.confidence}%</span></td>
                  <td className="px-4 py-3">
                    <span className="material-symbols-outlined text-secondary">
                      {item.trend === 'up' ? 'trending_up' : item.trend === 'down' ? 'trending_down' : 'trending_flat'}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-data-mono">{item.reorderPoint}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <button type="button" className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center z-30">
        <span className="material-symbols-outlined">model_training</span>
      </button>
    </>
  )
}
