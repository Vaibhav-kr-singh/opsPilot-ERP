import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import { formatCurrency } from '../data/mockData'
import { GhostButton, KpiCard, PageHeader, PrimaryButton, StatusBadge } from '../components/ui/SharedUI'

export default function InventoryManagement() {
  const { inventory, filterBySearch, filterByWarehouse, addInventoryItem, updateInventoryItem } = useApp()
  const [warehouseFilter, setWarehouseFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [page, setPage] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<(typeof inventory)[number] | null>(null)
  const pageSize = 10

  const categories = useMemo(() => ['All', ...new Set(inventory.map((i) => i.category))], [inventory])

  const filtered = useMemo(() => {
    let items = filterBySearch(inventory, ['code', 'name', 'category'])
    items = filterByWarehouse(items)
    if (warehouseFilter !== 'All') items = items.filter((i) => i.warehouse === warehouseFilter)
    if (categoryFilter !== 'All') items = items.filter((i) => i.category === categoryFilter)
    return items
  }, [inventory, filterBySearch, filterByWarehouse, warehouseFilter, categoryFilter])

  const paged = filtered.slice(page * pageSize, (page + 1) * pageSize)
  const totalValue = inventory.reduce((s, i) => s + i.stock * i.unitCost, 0)
  const available = inventory.reduce((s, i) => s + i.stock, 0)
  const reserved = Math.round(available * 0.12)
  const lowStock = inventory.filter((i) => i.status === 'Low Stock' || i.status === 'Out of Stock').length

  const handleAddItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const item = {
      code: String(fd.get('code')),
      name: String(fd.get('name')),
      category: String(fd.get('category')),
      warehouse: String(fd.get('warehouse')),
      stock: Number(fd.get('stock')),
      minStock: Number(fd.get('minStock')),
      maxStock: Number(fd.get('maxStock')),
      unitCost: Number(fd.get('unitCost')),
      status: editingItem && Number(fd.get('stock')) === editingItem.stock && Number(fd.get('minStock')) === editingItem.minStock
        ? editingItem.status
        : Number(fd.get('stock')) <= 0 ? 'Out of Stock' as const : Number(fd.get('stock')) < Number(fd.get('minStock')) ? 'Low Stock' as const : 'In Stock' as const,
    }
    if (editingItem) updateInventoryItem(editingItem.id, item)
    else addInventoryItem(item)
    setEditingItem(null)
    setShowForm(false)
    e.currentTarget.reset()
  }

  return (
    <>
      <PageHeader
        title="Inventory Management"
        breadcrumb="Inventory"
        actions={
          <>
            <GhostButton onClick={() => window.location.reload()}>Refresh Data</GhostButton>
            <GhostButton>Export CSV</GhostButton>
            <PrimaryButton icon="add" onClick={() => setShowForm(true)}>New Item</PrimaryButton>
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-stack_md">
        <KpiCard label="Total Value" value={formatCurrency(totalValue)} subtext="Across all warehouses" />
        <KpiCard label="Available Units" value={available.toLocaleString()} subtext="Total stock count" />
        <KpiCard label="Reserved" value={reserved.toLocaleString()} subtext="Allocated to orders" />
        <KpiCard label="Low Stock Items" value={String(lowStock)} subtext="Requires attention" badge={<span className="bg-error-container/20 text-error px-2 py-0.5 rounded text-label-sm">{lowStock > 0 ? 'Action needed' : 'OK'}</span>} />
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-stack_md border-b border-outline-variant flex flex-wrap gap-4 items-center bg-surface-container-low/50">
          <select className="px-3 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest" value={warehouseFilter} onChange={(e) => setWarehouseFilter(e.target.value)}>
            <option value="All">All Warehouses</option>
            <option value="Main Hub">Main Hub</option>
            <option value="Remote 1">Remote 1</option>
          </select>
          <select className="px-3 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <span className="text-label-sm text-on-surface-variant ml-auto">{filtered.length} items</span>
        </div>
        <div className="table-scroll">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="bg-surface-container-low/30 border-b border-outline-variant">
              <tr>
                {['Item Code', 'Name', 'Category', 'Warehouse', 'Stock', 'Min/Max', 'Unit Cost', 'Value', 'Status', 'Action'].map((h) => (
                  <th key={h} className="px-4 py-3 font-label-sm text-label-sm uppercase text-on-surface-variant whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {paged.map((item) => (
                <tr key={item.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-4 py-3 font-data-mono text-data-mono">{item.code}</td>
                  <td className="px-4 py-3">{item.name}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{item.category}</td>
                  <td className="px-4 py-3">{item.warehouse}</td>
                  <td className="px-4 py-3 font-data-mono">{item.stock.toLocaleString()}</td>
                  <td className="px-4 py-3 font-data-mono text-on-surface-variant">{item.minStock}/{item.maxStock}</td>
                  <td className="px-4 py-3 font-data-mono">{formatCurrency(item.unitCost)}</td>
                  <td className="px-4 py-3 font-data-mono">{formatCurrency(item.stock * item.unitCost)}</td>
                  <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                  <td className="px-4 py-3"><button type="button" aria-label={`Edit ${item.name}`} onClick={() => { setEditingItem(item); setShowForm(true) }} className="material-symbols-outlined text-on-surface-variant hover:text-primary">edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-outline-variant flex items-center justify-between">
          <select className="px-2 py-1 border border-outline-variant rounded text-label-sm" defaultValue="10">
            <option value="10">10 rows</option>
            <option value="25">25 rows</option>
          </select>
          <div className="flex gap-2">
            <button type="button" className="p-1 rounded hover:bg-surface-container-low disabled:opacity-40" disabled={page === 0} onClick={() => setPage(0)}><span className="material-symbols-outlined">first_page</span></button>
            <button type="button" className="p-1 rounded hover:bg-surface-container-low disabled:opacity-40" disabled={page === 0} onClick={() => setPage((p) => p - 1)}><span className="material-symbols-outlined">chevron_left</span></button>
            <span className="px-3 py-1 text-label-sm">Page {page + 1} of {Math.max(1, Math.ceil(filtered.length / pageSize))}</span>
            <button type="button" className="p-1 rounded hover:bg-surface-container-low disabled:opacity-40" disabled={(page + 1) * pageSize >= filtered.length} onClick={() => setPage((p) => p + 1)}><span className="material-symbols-outlined">chevron_right</span></button>
            <button type="button" className="p-1 rounded hover:bg-surface-container-low disabled:opacity-40" disabled={(page + 1) * pageSize >= filtered.length} onClick={() => setPage(Math.ceil(filtered.length / pageSize) - 1)}><span className="material-symbols-outlined">last_page</span></button>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => { setShowForm(false); setEditingItem(null) }}>
          <form className="bg-surface-container-lowest rounded-xl p-6 w-full max-w-md space-y-4 shadow-xl" onClick={(e) => e.stopPropagation()} onSubmit={handleAddItem}>
            <h3 className="font-title-lg text-title-lg">{editingItem ? 'Edit Inventory Item' : 'Add Inventory Item'}</h3>
            {(['code', 'name', 'category', 'warehouse', 'stock', 'minStock', 'maxStock', 'unitCost'] as const).map((field) => (
              <label key={field} className="block text-label-sm capitalize text-on-surface-variant">{field}
                <input name={field} defaultValue={editingItem?.[field]} placeholder={field} required type={['stock', 'minStock', 'maxStock', 'unitCost'].includes(field) ? 'number' : 'text'} className="mt-1 w-full px-3 py-2 border border-outline-variant rounded-lg" step={field === 'unitCost' ? '0.01' : '1'} />
              </label>
            ))}
            <div className="flex gap-2 justify-end">
              <GhostButton onClick={() => { setShowForm(false); setEditingItem(null) }}>Cancel</GhostButton>
              <button type="submit" className="px-4 py-2 bg-primary text-on-primary rounded-lg font-label-md hover:bg-primary/90 shadow-sm transition-all">{editingItem ? 'Save Changes' : 'Add Item'}</button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
