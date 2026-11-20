import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { GhostButton, PageHeader, PrimaryButton, StatusBadge } from '../components/ui/SharedUI'

const reportCards = [
  { title: 'Inventory Report', desc: 'Stock levels, valuation, ABC analysis', type: 'Inventory', icon: 'inventory_2', path: '/inventory' },
  { title: 'Procurement Report', desc: 'Purchase requests and approvals', type: 'Procurement', icon: 'shopping_cart', path: '/procurement' },
  { title: 'Purchasing Report', desc: 'PO status and supplier performance', type: 'Purchasing', icon: 'payments', path: '/purchasing' },
  { title: 'Supplier Report', desc: 'Vendor ratings and delivery metrics', type: 'Supplier', icon: 'conveyor_belt', path: '/suppliers' },
  { title: 'Sales Report', desc: 'Revenue, orders, and trends', type: 'Sales', icon: 'trending_up', path: '/sales' },
  { title: 'Stock Alert Report', desc: 'Critical and low stock items', type: 'Stock Alert', icon: 'warning', path: '/stock-alerts' },
  { title: 'Analytics Report', desc: 'Advanced KPIs and forecasts', type: 'Analytics', icon: 'analytics', path: '/analytics' },
  { title: 'Custom Template', desc: 'Build your own report', type: 'Custom', icon: 'add_circle', path: null },
]

export default function ReportCenter() {
  const navigate = useNavigate()
  const { reports, generateReport } = useApp()

  return (
    <>
      <PageHeader
        title="Report Center"
        breadcrumb="Reports"
        actions={<PrimaryButton icon="add" onClick={() => generateReport('Custom Report', 'Custom')}>Create Custom Report</PrimaryButton>}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-stack_md">
        {reportCards.map((card) => (
          <div key={card.title} className="glass-card p-stack_md rounded-xl flex flex-col">
            <span className="material-symbols-outlined text-secondary text-3xl mb-3">{card.icon}</span>
            <h3 className="font-title-lg text-title-lg mb-1">{card.title}</h3>
            <p className="text-label-sm text-on-surface-variant flex-1 mb-4">{card.desc}</p>
            <div className="flex gap-2">
              <button type="button" className="flex-1 px-3 py-2 bg-primary text-on-primary rounded-lg text-label-sm hover:bg-primary/90" onClick={() => generateReport(card.title, card.type)}>
                Generate
              </button>
              {card.path && (
                <button type="button" className="px-3 py-2 border border-outline rounded-lg text-label-sm hover:bg-surface-container-low" onClick={() => navigate(card.path!)}>
                  View
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-stack_md border-b border-outline-variant flex justify-between items-center bg-surface-container-low/50">
          <h3 className="font-title-lg text-title-lg">Recent Reports</h3>
          <div className="flex gap-2">
            <GhostButton>Filter</GhostButton>
            <GhostButton>Sort</GhostButton>
          </div>
        </div>
        <div className="table-scroll">
        <table className="w-full text-left border-collapse min-w-[640px]">
          <thead className="bg-surface-container-low/30 border-b border-outline-variant">
            <tr>
              {['Report Name', 'Type', 'Generated', 'Status', 'Size', 'Action'].map((h) => (
                <th key={h} className="px-4 py-3 font-label-sm text-label-sm uppercase text-on-surface-variant">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-surface-container-low transition-colors">
                <td className="px-4 py-3 font-label-md">{report.name}</td>
                <td className="px-4 py-3 text-on-surface-variant">{report.type}</td>
                <td className="px-4 py-3 font-data-mono text-on-surface-variant">{report.generatedAt}</td>
                <td className="px-4 py-3"><StatusBadge status={report.status} /></td>
                <td className="px-4 py-3 font-data-mono">{report.size}</td>
                <td className="px-4 py-3">
                  {report.status === 'Ready' && (
                    <button type="button" className="text-secondary text-label-sm hover:underline flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">download</span> Download
                    </button>
                  )}
                  {report.status === 'Processing' && <span className="text-label-sm text-on-surface-variant animate-pulse">Processing...</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        <div className="p-4 border-t border-outline-variant flex justify-center gap-2">
          <button type="button" className="p-1 rounded hover:bg-surface-container-low"><span className="material-symbols-outlined">chevron_left</span></button>
          <span className="px-3 py-1 bg-primary text-on-primary rounded text-label-sm">1</span>
          <button type="button" className="p-1 rounded hover:bg-surface-container-low"><span className="material-symbols-outlined">chevron_right</span></button>
        </div>
      </div>
    </>
  )
}
