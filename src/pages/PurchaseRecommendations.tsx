import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { formatCurrency } from '../data/mockData'
import { GhostButton, PageHeader, SecondaryButton, StatusBadge } from '../components/ui/SharedUI'

const pipelineSteps = [
  { label: 'Demand Prediction', done: true },
  { label: 'Stock Verification', done: true },
  { label: 'Engine Review', active: true },
  { label: 'Manager Approval', done: false },
  { label: 'Production Ready', done: false },
]

export default function PurchaseRecommendations() {
  const navigate = useNavigate()
  const { purchaseRecommendations, approveRecommendation, rejectRecommendation, approveAllHighUrgency } = useApp()

  return (
    <div className="flex gap-stack_md min-w-0">
      <div className="flex-1 space-y-stack_lg min-w-0">
        <PageHeader
          title="Purchase Pipeline Analysis"
          breadcrumb="Purchase Recommendations"
          actions={
            <>
              <GhostButton>Filter</GhostButton>
              <SecondaryButton onClick={approveAllHighUrgency}>Approve All High Urgency</SecondaryButton>
            </>
          }
        />

        <div className="glass-card p-stack_md rounded-xl">
          <div className="flex items-center justify-between gap-2 overflow-x-auto scrollbar-visible pb-1">
            {pipelineSteps.map((step, i) => (
              <div key={step.label} className="flex items-center gap-2 flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-label-sm font-bold ${step.active ? 'bg-secondary text-on-secondary' : step.done ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                  {step.done ? '✓' : i + 1}
                </div>
                <span className={`text-label-sm whitespace-nowrap ${step.active ? 'font-bold text-secondary' : ''}`}>{step.label}</span>
                {i < pipelineSteps.length - 1 && <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-xl overflow-hidden">
          <div className="p-stack_md border-b border-outline-variant bg-surface-container-low/50">
            <h3 className="font-title-lg text-title-lg">Strategic Purchase Recommendations</h3>
          </div>
          <div className="table-scroll">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-surface-container-low/30 border-b border-outline-variant">
              <tr>
                {['Product', 'Stock Status', 'Forecasted', 'Supplier', 'Lead Time', 'Rec. Qty', 'Est. Cost', 'Urgency', 'Actions'].map((h) => (
                  <th key={h} className="px-3 py-3 font-label-sm text-label-sm uppercase text-on-surface-variant whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {purchaseRecommendations.map((rec) => (
                <tr key={rec.id} className={`hover:bg-secondary/5 transition-colors ${rec.approved ? 'opacity-60' : ''}`}>
                  <td className="px-3 py-3 font-label-md">{rec.product}</td>
                  <td className="px-3 py-3 text-on-surface-variant">{rec.stockStatus}</td>
                  <td className="px-3 py-3 font-data-mono">{rec.forecastedDemand.toLocaleString()}</td>
                  <td className="px-3 py-3">{rec.supplier}</td>
                  <td className="px-3 py-3 font-data-mono">{rec.leadTime}d</td>
                  <td className="px-3 py-3 font-data-mono">{rec.recommendedQty.toLocaleString()}</td>
                  <td className="px-3 py-3 font-data-mono">{formatCurrency(rec.estimatedCost)}</td>
                  <td className="px-3 py-3"><StatusBadge status={rec.urgency} /></td>
                  <td className="px-3 py-3">
                    {rec.approved ? (
                      <span className="text-secondary text-label-sm">Approved ✓</span>
                    ) : (
                      <div className="flex gap-1">
                        <button type="button" className="p-1 text-secondary hover:bg-secondary-container/20 rounded" title="Approve" onClick={() => approveRecommendation(rec.id)}><span className="material-symbols-outlined text-[18px]">check</span></button>
                        <button type="button" className="p-1 text-on-surface-variant hover:bg-surface-container-low rounded" title="Edit"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                        <button type="button" className="p-1 text-error hover:bg-error-container/20 rounded" title="Reject" onClick={() => rejectRecommendation(rec.id)}><span className="material-symbols-outlined text-[18px]">close</span></button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>

      <aside className="w-[380px] flex-shrink-0 hidden xl:block">
        <div className="glass-card rounded-xl overflow-hidden sticky top-20">
          <div className="p-stack_md border-b border-outline-variant bg-primary text-on-primary">
            <h3 className="font-title-lg text-title-lg flex items-center gap-2"><span className="material-symbols-outlined">notifications_active</span> Intelligence Feed</h3>
          </div>
          <div className="p-stack_md space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-visible">
            {[
              { type: 'critical', title: 'Steel Beam shortage', desc: 'Production Line 04 at risk' },
              { type: 'warning', title: 'Lead time increase', desc: 'ChemSupply +2 days average' },
              { type: 'info', title: 'Bulk discount available', desc: 'Apex Tooling 8% off 2000+ units' },
              { type: 'success', title: 'Forecast updated', desc: '94.2% confidence maintained' },
            ].map((alert, i) => (
              <div key={i} className={`p-3 rounded-lg border border-outline-variant/50 ${alert.type === 'critical' ? 'bg-error-container/20' : alert.type === 'warning' ? 'bg-secondary-container/20' : 'bg-surface-container-low'}`}>
                <div className="font-label-md">{alert.title}</div>
                <div className="text-label-sm text-on-surface-variant">{alert.desc}</div>
              </div>
            ))}
          </div>
          <div className="p-stack_md border-t border-outline-variant bg-surface-container-low">
            <button type="button" className="w-full py-2 bg-secondary text-on-secondary rounded-lg font-label-md hover:bg-secondary/90" onClick={() => navigate('/demand-forecasting')}>
              View Nexus AI Insight →
            </button>
          </div>
        </div>
      </aside>
    </div>
  )
}
