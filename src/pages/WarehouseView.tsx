import { useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { KpiCard, PageHeader } from '../components/ui/SharedUI'

type CellStatus = 'optimal' | 'warning' | 'low' | 'critical'

const cellColors: Record<CellStatus, string> = {
  optimal: 'bg-secondary/60',
  warning: 'bg-secondary-container/80',
  low: 'bg-error-container/40',
  critical: 'bg-error/70',
}

function generateHeatmap(seed: number, count: number): CellStatus[] {
  const statuses: CellStatus[] = ['optimal', 'warning', 'low', 'critical']
  return Array.from({ length: count }, (_, i) => statuses[(seed + i * 7) % 4])
}

export default function WarehouseView() {
  const { inventory, filterByWarehouse } = useApp()
  const zoneA = useMemo(() => generateHeatmap(2, 84), [])
  const zoneB = useMemo(() => generateHeatmap(5, 56), [])
  const items = filterByWarehouse(inventory)
  const totalUnits = items.reduce((s, i) => s + i.stock, 0)
  const utilization = 78

  return (
    <>
      <PageHeader
        title="Warehouse Operations"
        breadcrumb="Warehouse"
        subtitle="Capacity monitoring, bin utilization, and transfer management."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-stack_md">
        <KpiCard label="Total Units" value={totalUnits.toLocaleString()} subtext="In selected warehouse" />
        <KpiCard label="Utilization" value={`${utilization}%`} subtext="Current capacity" />
        <KpiCard label="Active SKUs" value={String(items.length)} subtext="Unique items stored" />
      </div>

      <div className="glass-card p-stack_md rounded-xl">
        <h3 className="font-title-lg text-title-lg mb-4">Bin Heat Map</h3>
        <div className="space-y-4 overflow-x-auto scrollbar-visible">
          <div className="min-w-[480px]">
            <div className="flex justify-between mb-2"><span className="font-label-md">Zone A — Main Storage</span><span className="text-label-sm text-on-surface-variant">84 bins</span></div>
            <div className="grid grid-cols-12 gap-0.5">
              {zoneA.map((status, i) => (
                <div key={i} className={`aspect-square rounded-sm ${cellColors[status]}`} title={`Bin A-${i + 1}`} />
              ))}
            </div>
          </div>
          <div className="min-w-[480px]">
            <div className="flex justify-between mb-2"><span className="font-label-md">Zone B — Overflow</span><span className="text-label-sm text-on-surface-variant">56 bins</span></div>
            <div className="grid grid-cols-14 gap-0.5">
              {zoneB.map((status, i) => (
                <div key={i} className={`aspect-square rounded-sm ${cellColors[status]}`} title={`Bin B-${i + 1}`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-stack_md border-b border-outline-variant bg-surface-container-low/50">
          <h3 className="font-title-lg text-title-lg">Warehouse Inventory</h3>
        </div>
        <div className="table-scroll">
        <table className="w-full text-left min-w-[560px]">
          <thead className="bg-surface-container-low/30 border-b border-outline-variant">
            <tr>
              {['Code', 'Name', 'Warehouse', 'Stock', 'Status'].map((h) => (
                <th key={h} className="px-4 py-3 font-label-sm uppercase text-on-surface-variant">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-surface-container-low">
                <td className="px-4 py-3 font-data-mono">{item.code}</td>
                <td className="px-4 py-3">{item.name}</td>
                <td className="px-4 py-3">{item.warehouse}</td>
                <td className="px-4 py-3 font-data-mono">{item.stock}</td>
                <td className="px-4 py-3">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </>
  )
}
