import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { formatCurrency } from '../data/mockData'
import { KpiCard, PageHeader, PrimaryButton, StatusBadge } from '../components/ui/SharedUI'

export default function PurchaseOrders() {
  const navigate = useNavigate()
  const { purchaseOrders, inventory, suppliers, filterBySearch, approvePurchaseOrder, rejectPurchaseOrder, createPurchaseOrder } = useApp()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [orderCategory, setOrderCategory] = useState('')
  const categories = [...new Set(inventory.map((item) => item.category))]
  const categoryItems = inventory.filter((item) => item.category === orderCategory)

  const filtered = filterBySearch(purchaseOrders, ['poNumber', 'supplier', 'item'])
  const totalPOs = purchaseOrders.length
  const awaiting = purchaseOrders.filter((p) => p.status === 'Pending').length
  const inTransit = purchaseOrders.filter((p) => p.status === 'In Transit' || p.status === 'Shipped').length
  const completed = purchaseOrders.filter((p) => p.status === 'Completed').length

  const handleCreatePO = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const item = inventory.find((entry) => entry.id === form.get('itemId'))
    if (!item) return
    createPurchaseOrder({
      poNumber: `PO-${Math.floor(Math.random() * 9000) + 1000}`,
      supplier: String(form.get('supplier')),
      item: item.name,
      quantity: Number(form.get('quantity')),
      unitPrice: Number(form.get('unitPrice')),
      orderDate: new Date().toISOString().split('T')[0],
      deliveryDate: String(form.get('deliveryDate')),
      status: 'Pending',
    })
    setShowCreateForm(false)
    setOrderCategory('')
  }

  const criticalActions = useMemo(() => [
    { title: 'Restock Ball Bearings', desc: 'BR-6204-Z out of stock', action: () => navigate('/stock-alerts') },
    { title: 'Approve PO-5502', desc: 'Vertex Microchips awaiting approval', action: () => approvePurchaseOrder('2') },
    { title: 'Supplier Reply Pending', desc: 'Precision Dynamics quote response', action: () => navigate('/suppliers') },
  ], [navigate, approvePurchaseOrder])

  return (
    <>
      <PageHeader
        title="Purchase Orders"
        breadcrumb="Purchasing"
        actions={<PrimaryButton icon="add" onClick={() => { setOrderCategory(categories[0] ?? ''); setShowCreateForm(true) }}>Create Purchase Order</PrimaryButton>}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-stack_md">
        <KpiCard label="Total POs" value={String(totalPOs)} subtext="All time" />
        <KpiCard label="Awaiting Approval" value={String(awaiting)} subtext="Needs action" />
        <KpiCard label="In Transit" value={String(inTransit)} subtext="On the way" />
        <KpiCard label="Completed" value={String(completed)} subtext="This quarter" />
      </div>

      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setShowCreateForm(false)}>
          <form className="bg-surface-container-lowest rounded-xl p-6 w-full max-w-lg space-y-4 shadow-xl" onClick={(event) => event.stopPropagation()} onSubmit={handleCreatePO}>
            <h3 className="font-title-lg text-title-lg">Create Purchase Order</h3>
            <label className="block text-label-sm">Inventory category<select required value={orderCategory} onChange={(event) => setOrderCategory(event.target.value)} className="mt-1 w-full px-3 py-2 border border-outline-variant rounded-lg">{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
            <label className="block text-label-sm">Item<select name="itemId" required className="mt-1 w-full px-3 py-2 border border-outline-variant rounded-lg">{categoryItems.map((item) => <option key={item.id} value={item.id}>{item.name} ({item.code})</option>)}</select></label>
            <label className="block text-label-sm">Supplier<select name="supplier" required className="mt-1 w-full px-3 py-2 border border-outline-variant rounded-lg">{suppliers.map((supplier) => <option key={supplier.id} value={supplier.name}>{supplier.name} · {supplier.category}</option>)}</select></label>
            <div className="grid grid-cols-2 gap-3"><label className="block text-label-sm">Quantity<input name="quantity" type="number" min="1" required defaultValue="1" className="mt-1 w-full px-3 py-2 border border-outline-variant rounded-lg" /></label><label className="block text-label-sm">Unit price<input name="unitPrice" type="number" min="0.01" step="0.01" required defaultValue={categoryItems[0]?.unitCost ?? 0} className="mt-1 w-full px-3 py-2 border border-outline-variant rounded-lg" /></label></div>
            <label className="block text-label-sm">Delivery date<input name="deliveryDate" type="date" required defaultValue={new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10)} className="mt-1 w-full px-3 py-2 border border-outline-variant rounded-lg" /></label>
            <div className="flex justify-end gap-2"><button type="button" onClick={() => setShowCreateForm(false)} className="px-4 py-2 border border-outline-variant rounded-lg">Cancel</button><button type="submit" className="px-4 py-2 bg-primary text-on-primary rounded-lg font-label-md hover:bg-primary/90 shadow-sm">Create Order</button></div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-stack_md">
        <div className="lg:col-span-2 glass-card rounded-xl overflow-hidden">
          <div className="p-stack_md border-b border-outline-variant bg-surface-container-low/50">
            <h3 className="font-title-lg text-title-lg">Active Purchase Orders</h3>
          </div>
          <div className="table-scroll">
          <table className="w-full text-left border-collapse min-w-[1080px]">
            <thead className="bg-surface-container-low/30 border-b border-outline-variant">
              <tr>
                {['PO Number', 'Supplier', 'Item', 'Qty', 'Unit Price', 'Total', 'Order Date', 'Delivery', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-3 py-3 font-label-sm text-label-sm uppercase text-on-surface-variant whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {filtered.map((po) => (
                <tr
                  key={po.id}
                  className={`hover:bg-surface-container-low transition-colors cursor-pointer ${selectedId === po.id ? 'bg-secondary-container/10' : ''}`}
                  onClick={() => setSelectedId(po.id)}
                >
                  <td className="px-3 py-3 font-data-mono">{po.poNumber}</td>
                  <td className="px-3 py-3">{po.supplier}</td>
                  <td className="px-3 py-3 text-on-surface-variant">{po.item}</td>
                  <td className="px-3 py-3 font-data-mono">{po.quantity}</td>
                  <td className="px-3 py-3 font-data-mono">{formatCurrency(po.unitPrice)}</td>
                  <td className="px-3 py-3 font-data-mono">{formatCurrency(po.quantity * po.unitPrice)}</td>
                  <td className="px-3 py-3 font-data-mono text-on-surface-variant">{po.orderDate}</td>
                  <td className="px-3 py-3 font-data-mono text-on-surface-variant">{po.deliveryDate}</td>
                  <td className="px-3 py-3">
                    <StatusBadge status={po.status} />
                  </td>
                  <td className="px-3 py-3">
                    {po.status === 'Pending' ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="px-3 py-1 bg-secondary text-on-secondary rounded-lg text-label-sm font-label-md hover:bg-secondary/90 transition-colors"
                          onClick={(e) => { e.stopPropagation(); approvePurchaseOrder(po.id) }}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          className="px-3 py-1 border border-error text-error rounded-lg text-label-sm font-label-md hover:bg-error-container/20 transition-colors"
                          onClick={(e) => { e.stopPropagation(); rejectPurchaseOrder(po.id) }}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-label-sm text-on-surface-variant">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>

        <div className="space-y-stack_md">
          <div className="glass-card p-stack_md rounded-xl">
            <h3 className="font-title-lg text-title-lg mb-4">Purchasing Trends</h3>
            <div className="h-32 flex items-end gap-1">
              {[40, 55, 45, 70, 60, 80, 65, 90, 75, 85, 95, 88].map((h, i) => (
                <div key={i} className="flex-1 bg-secondary/60 rounded-t" style={{ height: `${h}%` }} />
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-on-surface-variant mt-2">
              <span>Jan</span><span>Jun</span><span>Dec</span>
            </div>
          </div>
          <div className="glass-card p-stack_md rounded-xl">
            <h3 className="font-title-lg text-title-lg mb-4">Critical Actions</h3>
            <div className="space-y-3">
              {criticalActions.map((action) => (
                <button key={action.title} type="button" className="w-full text-left p-3 bg-surface-container-low rounded-lg border border-outline-variant hover:border-secondary transition-colors" onClick={action.action}>
                  <div className="font-label-md">{action.title}</div>
                  <div className="text-label-sm text-on-surface-variant">{action.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
