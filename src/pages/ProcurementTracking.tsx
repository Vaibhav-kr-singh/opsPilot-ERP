import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { formatCurrency } from '../data/mockData'
import { GhostButton, KpiCard, PageHeader, PrimaryButton, StatusBadge } from '../components/ui/SharedUI'

export default function ProcurementTracking() {
  const navigate = useNavigate()
  const { procurementRequests, inventory, suppliers, filterBySearch, createProcurementRequest } = useApp()
  const [statusFilter, setStatusFilter] = useState('All')
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [requestCategory, setRequestCategory] = useState('')
  const categories = [...new Set(inventory.map((item) => item.category))]
  const categoryItems = inventory.filter((item) => item.category === requestCategory)

  const filtered = useMemo(() => {
    let items = filterBySearch(procurementRequests, ['prNumber', 'requestedBy', 'supplier', 'department'])
    if (statusFilter !== 'All') items = items.filter((r) => r.status === statusFilter)
    return items
  }, [procurementRequests, filterBySearch, statusFilter])

  const activeOrders = procurementRequests.filter((r) => r.status !== 'Completed').length
  const pending = procurementRequests.filter((r) => r.status === 'Pending').length
  const approved = procurementRequests.filter((r) => r.status === 'Approved').length
  const monthlyCost = procurementRequests.reduce((s, r) => s + r.value, 0)

  const handleNewRequest = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const item = inventory.find((entry) => entry.id === form.get('itemId'))
    if (!item) return
    createProcurementRequest({
      prNumber: `PR-${Math.floor(Math.random() * 9000) + 1000}`,
      requestedBy: 'Current User',
      department: String(form.get('department')),
      supplier: String(form.get('supplier')),
      requestDate: new Date().toISOString().split('T')[0],
      neededBy: String(form.get('neededBy')),
      status: 'Pending',
      value: Number(form.get('quantity')) * item.unitCost,
      category: item.category,
      item: item.name,
    })
    setShowRequestForm(false)
    setRequestCategory('')
  }

  return (
    <>
      <PageHeader
        title="Procurement Tracking"
        breadcrumb="Procurement"
        actions={
          <>
            <GhostButton onClick={() => navigate('/reports')}>Export Report</GhostButton>
            <PrimaryButton icon="add" onClick={() => { setRequestCategory(categories[0] ?? ''); setShowRequestForm(true) }}>New Purchase Request</PrimaryButton>
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-stack_md">
        <KpiCard label="Active Orders" value={String(activeOrders)} subtext="Open requests" />
        <KpiCard label="Pending Approvals" value={String(pending)} subtext="Awaiting review" badge={<span className="bg-error-container/20 text-error px-2 py-0.5 rounded text-label-sm">Action</span>} />
        <KpiCard label="Goods Received" value="156" subtext="This month" />
        <KpiCard label="Monthly Cost" value={formatCurrency(monthlyCost)} subtext={`${approved} approved`} />
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-stack_md border-b border-outline-variant flex justify-between items-center bg-surface-container-low/50">
          <h3 className="font-title-lg text-title-lg">Purchase Requests</h3>
          <select className="px-3 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            {['All', 'Pending', 'Approved', 'Processing'].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="table-scroll">
          <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="bg-surface-container-low/30 border-b border-outline-variant">
            <tr>
              {['PR Number', 'Requested By', 'Department', 'Supplier', 'Request Date', 'Needed By', 'Value', 'Status'].map((h) => (
                <th key={h} className="px-4 py-3 font-label-sm text-label-sm uppercase text-on-surface-variant">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {filtered.map((req) => (
              <tr key={req.id} className="hover:bg-surface-container-low transition-colors cursor-pointer" onClick={() => navigate('/purchasing')}>
                <td className="px-4 py-3 font-data-mono">{req.prNumber}</td>
                <td className="px-4 py-3">{req.requestedBy}</td>
                <td className="px-4 py-3 text-on-surface-variant">{req.department}</td>
                <td className="px-4 py-3">{req.supplier}</td>
                <td className="px-4 py-3 font-data-mono text-on-surface-variant">{req.requestDate}</td>
                <td className="px-4 py-3 font-data-mono text-on-surface-variant">{req.neededBy}</td>
                <td className="px-4 py-3 font-data-mono">{formatCurrency(req.value)}</td>
                <td className="px-4 py-3"><StatusBadge status={req.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-stack_md">
        <div className="glass-card p-stack_md rounded-xl">
          <h3 className="font-title-lg text-title-lg mb-2">AI Smart Recommendations</h3>
          <p className="text-on-surface-variant text-body-md mb-4">3 items flagged for expedited procurement based on demand forecast.</p>
          <button type="button" className="text-secondary font-label-md hover:underline" onClick={() => navigate('/purchase-recommendations')}>View Recommendations →</button>
        </div>
        <div className="glass-card p-stack_md rounded-xl border-2 border-dashed border-outline-variant flex items-center justify-center min-h-[120px]">
          <span className="text-on-surface-variant">Customize Dashboard Widgets</span>
        </div>
      </div>

      {showRequestForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setShowRequestForm(false)}>
          <form className="bg-surface-container-lowest rounded-xl p-6 w-full max-w-lg space-y-4 shadow-xl" onClick={(event) => event.stopPropagation()} onSubmit={handleNewRequest}>
            <h3 className="font-title-lg text-title-lg">New Purchase Request</h3>
            <label className="block text-label-sm">Category<select required value={requestCategory} onChange={(event) => setRequestCategory(event.target.value)} className="mt-1 w-full px-3 py-2 border border-outline-variant rounded-lg">{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
            <label className="block text-label-sm">Inventory item<select name="itemId" required className="mt-1 w-full px-3 py-2 border border-outline-variant rounded-lg">{categoryItems.map((item) => <option key={item.id} value={item.id}>{item.name} ({item.code})</option>)}</select></label>
            <label className="block text-label-sm">Department<input name="department" required defaultValue="Operations" className="mt-1 w-full px-3 py-2 border border-outline-variant rounded-lg" /></label>
            <label className="block text-label-sm">Supplier<select name="supplier" required className="mt-1 w-full px-3 py-2 border border-outline-variant rounded-lg">{suppliers.map((supplier) => <option key={supplier.id} value={supplier.name}>{supplier.name} · {supplier.category}</option>)}</select></label>
            <div className="grid grid-cols-2 gap-3"><label className="block text-label-sm">Quantity<input name="quantity" type="number" min="1" required defaultValue="1" className="mt-1 w-full px-3 py-2 border border-outline-variant rounded-lg" /></label><label className="block text-label-sm">Needed by<input name="neededBy" type="date" required defaultValue={new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10)} className="mt-1 w-full px-3 py-2 border border-outline-variant rounded-lg" /></label></div>
            <div className="flex justify-end gap-2"><GhostButton onClick={() => setShowRequestForm(false)}>Cancel</GhostButton><button type="submit" className="px-4 py-2 bg-primary text-on-primary rounded-lg font-label-md hover:bg-primary/90 shadow-sm">Submit Request</button></div>
          </form>
        </div>
      )}
    </>
  )
}
