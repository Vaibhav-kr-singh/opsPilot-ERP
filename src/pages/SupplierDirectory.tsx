import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import { GhostButton, KpiCard, PageHeader, PrimaryButton, StatusBadge } from '../components/ui/SharedUI'

interface NewSupplierForm {
  name: string
  contact: string
  category: string
  leadTime: string
  rating: string
  lastDelivery: string
  activeOrders: string
  status: 'Active' | 'Inactive'
}

const emptyForm: NewSupplierForm = {
  name: '', contact: '', category: 'Raw Materials',
  leadTime: '5', rating: '4.5', lastDelivery: '', activeOrders: '0', status: 'Active',
}

export default function SupplierDirectory() {
  const { suppliers, filterBySearch, addSupplier } = useApp()
  const filtered = filterBySearch(suppliers, ['name', 'category', 'contact'])

  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<NewSupplierForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const avgDelivery = useMemo(() => (suppliers.reduce((s, sup) => s + sup.leadTime, 0) / suppliers.length).toFixed(1), [suppliers])
  const avgRating = useMemo(() => (suppliers.reduce((s, sup) => s + sup.rating, 0) / suppliers.length).toFixed(1), [suppliers])
  const onTime = 92.4

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.name.trim() || !form.contact.trim()) {
      setError('Name and Contact are required.')
      return
    }
    setSaving(true)
    try {
      await addSupplier({
        name: form.name.trim(),
        contact: form.contact.trim(),
        category: form.category,
        leadTime: Number(form.leadTime) || 5,
        rating: parseFloat(form.rating) || 4.5,
        lastDelivery: form.lastDelivery || new Date().toISOString().split('T')[0],
        activeOrders: Number(form.activeOrders) || 0,
        status: form.status,
      })
      setForm(emptyForm)
      setShowModal(false)
    } catch {
      setError('Failed to save supplier. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <PageHeader
        title="Supplier Directory"
        breadcrumb="Suppliers"
        actions={
          <>
            <GhostButton>Export Data</GhostButton>
            <PrimaryButton icon="add" onClick={() => setShowModal(true)}>New Supplier</PrimaryButton>
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-stack_md">
        <KpiCard label="Active Suppliers" value={String(suppliers.length)} subtext="Verified partners" />
        <KpiCard label="Avg Delivery" value={`${avgDelivery}d`} subtext="Lead time average" />
        <KpiCard label="On-Time Rate" value={`${onTime}%`} subtext="Last 90 days" badge={<span className="bg-secondary/10 text-secondary px-2 py-0.5 rounded text-label-sm">+2.1%</span>} />
        <KpiCard label="Avg Rating" value={`${avgRating}/5`} subtext="Supplier score" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-stack_md">
        <div className="lg:col-span-2 glass-card rounded-xl overflow-hidden">
          <div className="table-scroll">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-surface-container-low/30 border-b border-outline-variant">
              <tr>
                {['Supplier', 'Contact', 'Category', 'Lead Time', 'Rating', 'Last Delivery', 'Active Orders', 'Status'].map((h) => (
                  <th key={h} className="px-4 py-3 font-label-sm text-label-sm uppercase text-on-surface-variant">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {filtered.map((sup) => (
                <tr key={sup.id} className="hover:bg-surface-container-low transition-colors cursor-pointer">
                  <td className="px-4 py-3 font-label-md">{sup.name}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{sup.contact}</td>
                  <td className="px-4 py-3">{sup.category}</td>
                  <td className="px-4 py-3 font-data-mono">{sup.leadTime} days</td>
                  <td className="px-4 py-3"><span className="text-secondary font-bold">{sup.rating}</span>/5</td>
                  <td className="px-4 py-3 font-data-mono text-on-surface-variant">{sup.lastDelivery}</td>
                  <td className="px-4 py-3 font-data-mono">{sup.activeOrders}</td>
                  <td className="px-4 py-3"><StatusBadge status={sup.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>

        <div className="space-y-stack_md">
          <div className="glass-card p-stack_md rounded-xl">
            <h3 className="font-title-lg text-title-lg mb-4">Performance Trend</h3>
            <div className="flex items-end gap-2 h-32 mt-2">
              {[65, 72, 78, 85].map((h, i) => (
                <div key={i} className="flex-1 h-full flex flex-col justify-end items-center gap-2">
                  <div className="w-full bg-secondary/80 rounded-t flex justify-center items-start pt-1 transition-colors hover:bg-secondary" style={{ height: `${h}%` }}>
                    <span className="text-[10px] text-white font-medium">{h}%</span>
                  </div>
                  <span className="text-[10px] text-on-surface-variant font-medium">{['AUG', 'SEP', 'OCT', 'NOV'][i]}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card p-stack_md rounded-xl">
            <h3 className="font-title-lg text-title-lg mb-4">Upcoming Audits</h3>
            <ul className="space-y-2 text-body-md">
              <li className="flex justify-between"><span>Global Ironworks</span><span className="text-on-surface-variant">Jan 20</span></li>
              <li className="flex justify-between"><span>ChemSupply Co.</span><span className="text-on-surface-variant">Jan 25</span></li>
              <li className="flex justify-between"><span>Apex Tooling</span><span className="text-on-surface-variant">Feb 2</span></li>
            </ul>
            <button type="button" className="mt-4 text-secondary font-label-md hover:underline">View Audit Schedule</button>
          </div>
        </div>
      </div>

      {/* ─── Add New Supplier Modal ─── */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false) }}
        >
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg border border-outline-variant animate-[fadeInUp_0.2s_ease]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant">
              <div>
                <h2 className="font-title-lg text-title-lg">Add New Supplier</h2>
                <p className="text-label-sm text-on-surface-variant mt-0.5">Fill in the details to register a new supplier.</p>
              </div>
              <button
                type="button"
                onClick={() => { setShowModal(false); setForm(emptyForm); setError('') }}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-low text-on-surface-variant transition-colors"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit}>
              <div className="px-6 py-5 space-y-4">
                {error && (
                  <div className="p-3 bg-error-container/30 text-error rounded-lg text-label-sm border border-error/20">{error}</div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-label-sm text-on-surface-variant mb-1.5 font-medium">Company Name <span className="text-error">*</span></label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Acme Suppliers Ltd."
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-outline-variant rounded-xl bg-surface-container-low text-body-md focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-label-sm text-on-surface-variant mb-1.5 font-medium">Contact Person <span className="text-error">*</span></label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. John Smith"
                      value={form.contact}
                      onChange={(e) => setForm({ ...form, contact: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-outline-variant rounded-xl bg-surface-container-low text-body-md focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-label-sm text-on-surface-variant mb-1.5 font-medium">Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-outline-variant rounded-xl bg-surface-container-low text-body-md focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
                    >
                      {['Raw Materials', 'Components', 'Electronics', 'Chemicals', 'Tools', 'Logistics', 'Advanced'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-label-sm text-on-surface-variant mb-1.5 font-medium">Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value as 'Active' | 'Inactive' })}
                      className="w-full px-3.5 py-2.5 border border-outline-variant rounded-xl bg-surface-container-low text-body-md focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-label-sm text-on-surface-variant mb-1.5 font-medium">Lead Time (days)</label>
                    <input
                      type="number" min="1" max="90"
                      value={form.leadTime}
                      onChange={(e) => setForm({ ...form, leadTime: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-outline-variant rounded-xl bg-surface-container-low text-body-md focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-label-sm text-on-surface-variant mb-1.5 font-medium">Rating (0–5)</label>
                    <input
                      type="number" step="0.1" min="0" max="5"
                      value={form.rating}
                      onChange={(e) => setForm({ ...form, rating: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-outline-variant rounded-xl bg-surface-container-low text-body-md focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-label-sm text-on-surface-variant mb-1.5 font-medium">Last Delivery Date</label>
                    <input
                      type="date"
                      value={form.lastDelivery}
                      onChange={(e) => setForm({ ...form, lastDelivery: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-outline-variant rounded-xl bg-surface-container-low text-body-md focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-label-sm text-on-surface-variant mb-1.5 font-medium">Active Orders</label>
                    <input
                      type="number" min="0"
                      value={form.activeOrders}
                      onChange={(e) => setForm({ ...form, activeOrders: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-outline-variant rounded-xl bg-surface-container-low text-body-md focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-outline-variant flex justify-end gap-3 bg-surface-container-low/30 rounded-b-2xl">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setForm(emptyForm); setError('') }}
                  className="px-5 py-2.5 rounded-xl border border-outline-variant text-label-md hover:bg-surface-container-low transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-secondary text-on-secondary text-label-md font-medium hover:bg-secondary/90 transition-colors disabled:opacity-60 flex items-center gap-2"
                >
                  {saving ? (
                    <><span className="material-symbols-outlined text-base animate-spin">progress_activity</span> Saving…</>
                  ) : (
                    <><span className="material-symbols-outlined text-base">add</span> Add Supplier</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
