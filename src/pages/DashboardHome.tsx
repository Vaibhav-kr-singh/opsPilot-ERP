import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  RadialLinearScale,
  Tooltip,
} from 'chart.js'
import { Doughnut, Line, Radar } from 'react-chartjs-2'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { formatCurrency } from '../data/mockData'
import { GhostButton, KpiCard, PageHeader, PrimaryButton } from '../components/ui/SharedUI'
import { StatusBadge } from '../components/ui/SharedUI'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, RadialLinearScale, Filler, Tooltip, Legend)

const fontStack = 'Inter, system-ui, sans-serif'

export default function DashboardHome() {
  const navigate = useNavigate()
  const { inventoryValue, outOfStockCount, lowStockCount, purchaseOrders, filterBySearch } = useApp()

  const recentPOs = filterBySearch(purchaseOrders, ['poNumber', 'supplier', 'item']).slice(0, 3)

  const trendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Active Stock',
        data: [65, 59, 80, 81, 56, 55, 40, 60, 75, 90, 85, 95],
        borderColor: '#000000',
        tension: 0.4,
        fill: false,
        borderWidth: 2,
        pointRadius: 0,
      },
      {
        label: 'Safety Stock',
        data: [40, 40, 40, 45, 45, 45, 45, 45, 50, 50, 50, 50],
        borderColor: '#10B981',
        borderDash: [5, 5],
        tension: 0,
        fill: false,
        borderWidth: 1,
        pointRadius: 0,
      },
    ],
  }

  const abcData = {
    labels: ['A (High Value)', 'B (Medium)', 'C (Low)'],
    datasets: [{ data: [70, 20, 10], backgroundColor: ['#000000', '#10B981', '#CBD5E1'], borderWidth: 0, hoverOffset: 10 }],
  }

  const radarData = {
    labels: ['Lead Time', 'Quality', 'Reliability', 'Pricing', 'Flexibility', 'Compliance'],
    datasets: [
      {
        label: 'Global Logistics',
        data: [90, 85, 95, 70, 80, 92],
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderColor: '#10B981',
        pointBackgroundColor: '#10B981',
      },
      {
        label: 'Vertex Microchips',
        data: [70, 95, 80, 85, 60, 88],
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderColor: '#000000',
        pointBackgroundColor: '#000000',
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
  }

  return (
    <>
      <PageHeader
        title="Executive Overview"
        subtitle="Real-time inventory and supply chain analytics across global hubs."
        actions={
          <>
            <GhostButton onClick={() => navigate('/reports')}>Export Report</GhostButton>
            <PrimaryButton icon="add" onClick={() => navigate('/purchasing')}>Create PO</PrimaryButton>
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-stack_md">
        <KpiCard
          label="Current Inventory Value"
          value={formatCurrency(inventoryValue)}
          subtext="vs $11.9M last month"
          badge={<span className="bg-secondary/10 text-secondary px-2 py-0.5 rounded text-label-sm font-label-sm">+4.2%</span>}
        />
        <KpiCard label="Today's Production" value="88%" subtext="Efficiency" badge={<span className="bg-secondary/10 text-secondary px-2 py-0.5 rounded text-label-sm font-label-sm">On Track</span>}>
          <div className="w-full bg-surface-container-highest h-1.5 rounded-full mt-3">
            <div className="bg-secondary h-1.5 rounded-full" style={{ width: '88%' }} />
          </div>
        </KpiCard>
        <div className="glass-card p-stack_md rounded-xl">
          <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Inventory Alerts</span>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <button type="button" className="bg-error-container/30 p-2 rounded-lg text-left hover:opacity-80" onClick={() => navigate('/stock-alerts')}>
              <div className="text-headline-sm font-headline-sm text-error">{String(outOfStockCount).padStart(2, '0')}</div>
              <div className="text-label-sm text-error/80">Out of Stock</div>
            </button>
            <button type="button" className="bg-secondary-container/30 p-2 rounded-lg text-left hover:opacity-80" onClick={() => navigate('/stock-alerts')}>
              <div className="text-headline-sm font-headline-sm text-on-secondary-container">{String(lowStockCount).padStart(2, '0')}</div>
              <div className="text-label-sm text-on-secondary-container/80">Low Stock</div>
            </button>
          </div>
        </div>
        <KpiCard label="Forecast Accuracy" value="94.2%" subtext="Global confidence level" badge={<span className="material-symbols-outlined text-secondary">trending_up</span>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-stack_md h-[400px]">
        <div className="lg:col-span-2 glass-card p-stack_md rounded-xl flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-title-lg text-title-lg">Inventory Trend (24 Months)</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-primary" /> <span className="text-label-sm">Active Stock</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-secondary" /> <span className="text-label-sm">Safety Stock</span></div>
            </div>
          </div>
          <div className="flex-1 relative min-h-0">
            <Line data={trendData} options={{ ...chartOptions, scales: { y: { grid: { color: '#E2E8F0' }, ticks: { font: { family: fontStack, size: 10 } } }, x: { grid: { display: false }, ticks: { font: { family: fontStack, size: 10 } } } } }} />
          </div>
        </div>
        <div className="glass-card p-stack_md rounded-xl flex flex-col justify-between">
          <div>
            <h3 className="font-title-lg text-title-lg mb-1">Turnover & Spend</h3>
            <p className="text-label-sm text-on-surface-variant">Key financial metrics for current period.</p>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg border border-outline-variant">
              <div><div className="text-label-sm text-on-surface-variant">Inventory Turnover</div><div className="text-headline-md font-headline-md">6.8x</div></div>
              <div className="text-secondary font-bold">+1.2</div>
            </div>
            <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg border border-outline-variant">
              <div><div className="text-label-sm text-on-surface-variant">Orders in Transit</div><div className="text-headline-md font-headline-md">24</div></div>
              <button type="button" className="text-on-tertiary-container text-label-sm hover:underline" onClick={() => navigate('/purchasing')}>Track all</button>
            </div>
            <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg border border-outline-variant">
              <div><div className="text-label-sm text-on-surface-variant">Monthly Procure. Cost</div><div className="text-headline-md font-headline-md">$2.1M</div></div>
              <div className="text-error font-bold">+8%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-stack_md h-[450px]">
        <div className="glass-card p-stack_md rounded-xl flex flex-col">
          <h3 className="font-title-lg text-title-lg mb-6">ABC Inventory Analysis</h3>
          <div className="flex-1 flex items-center justify-center relative min-h-0">
            <Doughnut data={abcData} options={{ ...chartOptions, cutout: '75%' }} />
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-outline-variant">
            <div className="text-center"><div className="text-primary font-bold">70%</div><div className="text-[10px] uppercase text-on-surface-variant">Class A</div></div>
            <div className="text-center"><div className="text-secondary font-bold">20%</div><div className="text-[10px] uppercase text-on-surface-variant">Class B</div></div>
            <div className="text-center"><div className="text-on-surface-variant font-bold">10%</div><div className="text-[10px] uppercase text-on-surface-variant">Class C</div></div>
          </div>
        </div>
        <div className="glass-card p-stack_md rounded-xl flex flex-col">
          <h3 className="font-title-lg text-title-lg mb-6">Supplier Performance</h3>
          <div className="flex-1 relative min-h-0">
            <Radar data={radarData} options={{ ...chartOptions, scales: { r: { grid: { color: '#E2E8F0' }, angleLines: { color: '#E2E8F0' }, pointLabels: { font: { family: fontStack, size: 10 } }, ticks: { display: false } } } }} />
          </div>
        </div>
        <div className="glass-card p-stack_md rounded-xl flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-title-lg text-title-lg">Global Stock Distribution</h3>
            <span className="material-symbols-outlined text-on-surface-variant cursor-help">info</span>
          </div>
          <div className="flex-1 relative rounded-lg overflow-hidden bg-surface-container-highest/30">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuASlGNqiGLWFV26SsfQubTBWqAhiBqPnLblPeDrMmV7KdmPc0gIvH9rTOwAckp3a19dJw_hGCf8QQv9S8M0aRMvy4s-yYcvnbacMO0-dRvR0qMCRfyC9eTew25RRadu4cPsBpF_NCp8vN7yNSj0k88JGhBBrkqXz5QMaNt-ueWzCI68r88Q1j51bvqy-fDq86R7Z-o7aVmi4p8X3FdalDKhrTeWYixHDnj55n8G66LYquBnwP2_4z4SgiRwypcn7e1ylGs-B70dKdiN')" }}
            />
            <div className="absolute top-4 left-4 p-2 bg-white/90 backdrop-blur rounded shadow-sm border border-outline-variant">
              <div className="text-label-sm font-bold text-primary">EU Hub</div>
              <div className="text-[10px] text-secondary">82% Capacity</div>
            </div>
            <div className="absolute bottom-10 right-10 p-2 bg-white/90 backdrop-blur rounded shadow-sm border border-outline-variant">
              <div className="text-label-sm font-bold text-primary">APAC Hub</div>
              <div className="text-[10px] text-error">94% Capacity</div>
            </div>
          </div>
          <div className="mt-4 flex justify-between text-label-sm">
            <span>Total Warehouses: 12</span>
            <span className="text-secondary">Optimal flow detected</span>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-stack_md border-b border-outline-variant flex justify-between items-center bg-surface-container-low/50">
          <h3 className="font-title-lg text-title-lg">Recent Procurement Activity</h3>
          <button type="button" className="text-secondary font-label-md hover:underline" onClick={() => navigate('/procurement')}>View All Activities</button>
        </div>
        <div className="table-scroll">
          <table className="w-full text-left border-collapse min-w-[640px]">
          <thead className="bg-surface-container-low/30 border-b border-outline-variant">
            <tr>
              {['Purchase ID', 'Supplier', 'Items', 'Value', 'Status', ''].map((h) => (
                <th key={h} className={`px-6 py-4 font-label-sm text-label-sm uppercase text-on-surface-variant ${h === 'Value' ? 'text-right' : ''}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {recentPOs.map((po) => (
              <tr key={po.id} className="hover:bg-surface-container-low transition-colors group cursor-pointer" onClick={() => navigate('/purchasing')}>
                <td className="px-6 py-4 font-data-mono text-data-mono">{po.poNumber}</td>
                <td className="px-6 py-4">{po.supplier}</td>
                <td className="px-6 py-4 text-on-surface-variant">{po.item}</td>
                <td className="px-6 py-4 text-right font-data-mono">{formatCurrency(po.quantity * po.unitPrice)}</td>
                <td className="px-6 py-4"><StatusBadge status={po.status} /></td>
                <td className="px-6 py-4 text-right"><span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary">more_vert</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </>
  )
}
