import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { GhostButton, KpiCard, PageHeader, PrimaryButton, SecondaryButton, StatusBadge } from '../components/ui/SharedUI'

export default function StockAlerts() {
  const navigate = useNavigate()
  const { stockAlerts, filterBySearch, filterByWarehouse, dismissAlert, applyAllReorderSuggestions, approveRecommendation, purchaseRecommendations } = useApp()
  const [warehouseTab, setWarehouseTab] = useState('All Warehouses')

  const filtered = useMemo(() => {
    let items = filterBySearch(stockAlerts, ['item', 'sku'])
    if (warehouseTab !== 'All Warehouses') items = items.filter((a) => a.warehouse === warehouseTab)
    else items = filterByWarehouse(items)
    return items
  }, [stockAlerts, filterBySearch, filterByWarehouse, warehouseTab])

  const critical = stockAlerts.filter((a) => a.alertLevel === 'Critical').length
  const low = stockAlerts.filter((a) => a.alertLevel === 'High' || a.alertLevel === 'Medium').length

  const handleAction = (alertId: string, action: string) => {
    if (action.includes('PO') || action.includes('Rush')) {
      const rec = purchaseRecommendations.find((r) => !r.approved)
      if (rec) approveRecommendation(rec.id)
      navigate('/purchasing')
    }
    if (action === 'Monitor') dismissAlert(alertId)
  }

  return (
    <>
      <PageHeader
        title="Critical Alerts & Monitoring"
        breadcrumb="Stock Alerts"
        actions={
          <>
            <GhostButton onClick={() => navigate('/reports')}>Export Report</GhostButton>
            <PrimaryButton icon="add">Create New Alert Rule</PrimaryButton>
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-stack_md">
        <KpiCard label="Critical" value={String(critical).padStart(2, '0')} subtext="Immediate action" badge={<span className="bg-error-container/30 text-error px-2 py-0.5 rounded text-label-sm">!</span>} />
        <KpiCard label="Low Stock" value={String(low).padStart(2, '0')} subtext="Below threshold" />
        <KpiCard label="Overstock" value="02" subtext="Excess inventory" />
        <KpiCard label="Expiring" value="00" subtext="Near expiry date" />
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-stack_md border-b border-outline-variant flex flex-wrap justify-between items-center gap-4 bg-surface-container-low/50">
          <div className="flex gap-2">
            {['All Warehouses', 'Main Hub', 'Remote 1'].map((tab) => (
              <button key={tab} type="button" className={`px-4 py-2 rounded-lg text-label-md ${warehouseTab === tab ? 'bg-primary text-on-primary' : 'hover:bg-surface-container-low'}`} onClick={() => setWarehouseTab(tab)}>{tab}</button>
            ))}
          </div>
        </div>
        <div className="table-scroll">
        <table className="w-full text-left border-collapse min-w-[880px]">
          <thead className="bg-surface-container-low/30 border-b border-outline-variant">
            <tr>
              {['Item', 'SKU', 'Warehouse', 'Current', 'Min Stock', 'Alert Level', 'Recommended Action', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 font-label-sm text-label-sm uppercase text-on-surface-variant">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {filtered.map((alert) => (
              <tr key={alert.id} className="hover:bg-surface-container-low transition-all hover:-translate-y-0.5">
                <td className="px-4 py-3 font-label-md">{alert.item}</td>
                <td className="px-4 py-3 font-data-mono">{alert.sku}</td>
                <td className="px-4 py-3">{alert.warehouse}</td>
                <td className="px-4 py-3 font-data-mono text-error">{alert.currentStock}</td>
                <td className="px-4 py-3 font-data-mono">{alert.minStock}</td>
                <td className="px-4 py-3"><StatusBadge status={alert.alertLevel} /></td>
                <td className="px-4 py-3 text-on-surface-variant">{alert.recommendedAction}</td>
                <td className="px-4 py-3">
                  <button type="button" className="px-3 py-1 bg-secondary text-on-secondary rounded-lg text-label-sm hover:bg-secondary/90" onClick={() => handleAction(alert.id, alert.recommendedAction)}>
                    {alert.recommendedAction}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-stack_md">
        <div className="glass-card p-stack_md rounded-xl">
          <h3 className="font-title-lg text-title-lg mb-2">AI Reorder Suggestions</h3>
          <p className="text-on-surface-variant mb-4">Based on demand forecast, {purchaseRecommendations.filter((r) => !r.approved).length} items need reordering.</p>
          <SecondaryButton onClick={applyAllReorderSuggestions}>Apply All</SecondaryButton>
        </div>
        <div className="glass-card p-stack_md rounded-xl border border-error/30 bg-error-container/10">
          <div className="flex items-center gap-2 text-error mb-2"><span className="material-symbols-outlined">warning</span><h3 className="font-title-lg text-title-lg">Service Outage Warning</h3></div>
          <p className="text-on-surface-variant">Supplier ChemSupply Co. reported potential 2-day delay. Review affected POs.</p>
        </div>
      </div>

      <button type="button" className="fixed bottom-8 right-8 w-14 h-14 bg-error text-on-error rounded-full shadow-lg flex items-center justify-center z-30">
        <span className="material-symbols-outlined">add_alert</span>
      </button>
    </>
  )
}
