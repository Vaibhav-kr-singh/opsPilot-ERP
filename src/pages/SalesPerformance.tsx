import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import { formatCurrency } from '../data/mockData'
import { GhostButton, KpiCard, PageHeader, PrimaryButton, StatusBadge } from '../components/ui/SharedUI'

export default function SalesPerformance() {
  const { salesOrders, filterBySearch } = useApp()
  const [statusTab, setStatusTab] = useState('All')

  const filtered = useMemo(() => {
    let items = filterBySearch(salesOrders, ['orderNumber', 'customer', 'product'])
    if (statusTab !== 'All') items = items.filter((o) => o.status === statusTab)
    return items
  }, [salesOrders, filterBySearch, statusTab])

  const monthlySales = salesOrders.reduce((s, o) => s + o.value, 0)
  const ordersToday = salesOrders.filter((o) => o.orderDate === '2026-01-15').length

  return (
    <>
      <PageHeader
        title="Sales Performance"
        breadcrumb="Sales"
        actions={
          <>
            <GhostButton>Export Report</GhostButton>
            <PrimaryButton icon="add">New Sales Order</PrimaryButton>
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-stack_md">
        <KpiCard label="Monthly Sales" value={formatCurrency(monthlySales)} subtext="Current period" badge={<span className="bg-secondary/10 text-secondary px-2 py-0.5 rounded text-label-sm">+12.4%</span>} />
        <KpiCard label="Orders Today" value={String(ordersToday)} subtext="New orders" />
        <KpiCard label="Revenue Growth" value="+12.4%" subtext="vs last month" />
        <KpiCard label="Best Seller" value="Motor 25HP" subtext="Electric Motor 25HP" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-stack_md">
        <div className="glass-card p-stack_md rounded-xl">
          <h3 className="font-title-lg text-title-lg mb-4">Monthly Sales Trend</h3>
          <div className="flex items-end gap-1 h-40">
            {[30, 45, 38, 52, 48, 60, 55, 70, 65, 78, 72, 85].map((h, i) => (
              <div key={i} className="flex-1 bg-primary/80 rounded-t hover:bg-secondary transition-colors flex justify-center items-start pt-2" style={{ height: `${h}%` }} title={`Month ${i + 1}`}>
                <span className="text-xs text-white font-medium">${h}k</span>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card p-stack_md rounded-xl flex flex-col items-center">
          <h3 className="font-title-lg text-title-lg mb-4 self-start">Sales by Category</h3>
          <div className="relative w-40 h-40 rounded-full" style={{ background: 'conic-gradient(#000 0% 45%, #10B981 45% 75%, #CBD5E1 75% 100%)' }}>
            <div className="absolute inset-4 bg-surface-container-lowest rounded-full flex items-center justify-center">
              <span className="font-bold text-primary">100%</span>
            </div>
          </div>
          <div className="flex gap-4 mt-4 text-label-sm">
            <span><span className="inline-block w-2 h-2 bg-primary rounded-full mr-1" />Motors 45%</span>
            <span><span className="inline-block w-2 h-2 bg-secondary rounded-full mr-1" />Panels 30%</span>
            <span><span className="inline-block w-2 h-2 bg-slate-300 rounded-full mr-1" />Other 25%</span>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-stack_md border-b border-outline-variant flex justify-between items-center bg-surface-container-low/50">
          <h3 className="font-title-lg text-title-lg">Recent Orders</h3>
          <div className="flex gap-2">
            {['All', 'Processing', 'Shipped', 'Completed'].map((tab) => (
              <button key={tab} type="button" className={`px-3 py-1 rounded-lg text-label-sm ${statusTab === tab ? 'bg-primary text-on-primary' : 'hover:bg-surface-container-low'}`} onClick={() => setStatusTab(tab)}>{tab}</button>
            ))}
          </div>
        </div>
        <div className="table-scroll">
          <table className="w-full text-left border-collapse min-w-[720px]">
            <thead className="bg-surface-container-low/30 border-b border-outline-variant">
              <tr>
                {['Order #', 'Customer', 'Product', 'Qty', 'Value', 'Date', 'Status'].map((h) => (
                  <th key={h} className="px-4 py-3 font-label-sm text-label-sm uppercase text-on-surface-variant">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-4 py-3 font-data-mono">{order.orderNumber}</td>
                  <td className="px-4 py-3">{order.customer}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{order.product}</td>
                  <td className="px-4 py-3 font-data-mono">{order.quantity}</td>
                  <td className="px-4 py-3 font-data-mono">{formatCurrency(order.value)}</td>
                  <td className="px-4 py-3 font-data-mono text-on-surface-variant">{order.orderDate}</td>
                  <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <button type="button" className="fixed bottom-8 right-8 w-14 h-14 bg-secondary text-on-secondary rounded-full shadow-lg flex items-center justify-center hover:bg-secondary/90 transition-colors z-30">
        <span className="material-symbols-outlined">add</span>
      </button>
    </>
  )
}
