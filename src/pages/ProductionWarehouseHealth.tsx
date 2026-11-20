import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import { GhostButton, PageHeader, PrimaryButton } from '../components/ui/SharedUI'

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

export default function ProductionWarehouseHealth() {
  const { inventory, filterByWarehouse } = useApp()
  const [chatOpen, setChatOpen] = useState(true)
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', text: 'Production Line 04 shows moderate risk due to NV-500 processor shortage.' },
    { role: 'user', text: 'What alternatives do we have?' },
    { role: 'ai', text: 'Nearby Warehouse B has 45 units available. Request transfer or expedite PO-5502.' },
  ])
  const [chatInput, setChatInput] = useState('')

  const zoneA = useMemo(() => generateHeatmap(1, 84), [])
  const zoneB = useMemo(() => generateHeatmap(3, 56), [])
  const warehouseItems = filterByWarehouse(inventory)

  const sendChat = () => {
    if (!chatInput.trim()) return
    setChatMessages((prev) => [...prev, { role: 'user', text: chatInput }, { role: 'ai', text: 'Analyzing production impact... Recommend checking Stock Alerts for critical items.' }])
    setChatInput('')
  }

  return (
    <>
      <PageHeader
        title="Production Risk Analysis"
        breadcrumb="Production"
        subtitle="Real-time production line health and warehouse capacity monitoring."
        actions={
          <>
            <GhostButton>Export PDF</GhostButton>
            <PrimaryButton>Simulate Scenario</PrimaryButton>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-stack_md">
        <div className="glass-card p-stack_md rounded-xl flex flex-col items-center">
          <h3 className="font-title-lg text-title-lg mb-4 self-start">Overall Health</h3>
          <svg viewBox="0 0 120 70" className="w-48">
            <path d="M 10 60 A 50 50 0 0 1 110 60" fill="none" stroke="#E2E8F0" strokeWidth="8" />
            <path d="M 10 60 A 50 50 0 0 1 95 25" fill="none" stroke="#10B981" strokeWidth="8" />
            <text x="60" y="55" textAnchor="middle" className="text-2xl font-bold fill-primary">74%</text>
          </svg>
          <span className="text-label-sm text-on-surface-variant uppercase tracking-wider">Moderate Risk</span>
        </div>

        <div className="lg:col-span-2 glass-card p-stack_md rounded-xl">
          <h3 className="font-title-lg text-title-lg mb-4">Impact Analysis</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {[
              { label: 'Lines at Risk', value: '2' },
              { label: 'Delayed Orders', value: '5' },
              { label: 'Critical SKUs', value: String(warehouseItems.filter((i) => i.status === 'Out of Stock').length) },
              { label: 'Est. Downtime', value: '4.2h' },
            ].map((stat) => (
              <div key={stat.label} className="p-3 bg-surface-container-low rounded-lg border border-outline-variant">
                <div className="text-label-sm text-on-surface-variant">{stat.label}</div>
                <div className="text-headline-sm font-headline-sm">{stat.value}</div>
              </div>
            ))}
          </div>
          <div className="table-scroll">
          <table className="w-full text-left min-w-[480px]">
            <thead><tr className="border-b border-outline-variant">{['Line', 'Product', 'Status', 'Risk'].map((h) => <th key={h} className="py-2 font-label-sm text-on-surface-variant uppercase">{h}</th>)}</tr></thead>
            <tbody>
              <tr className="border-b border-outline-variant/50"><td className="py-2 font-data-mono">Line 04</td><td className="py-2">NV-500 Assembly</td><td className="py-2 text-error">Delayed</td><td className="py-2">High</td></tr>
              <tr><td className="py-2 font-data-mono">Line 07</td><td className="py-2">Motor Assembly</td><td className="py-2 text-secondary">Running</td><td className="py-2">Low</td></tr>
            </tbody>
          </table>
          </div>
        </div>
      </div>

      <div className="glass-card p-stack_md rounded-xl">
        <h3 className="font-title-lg text-title-lg mb-4">Warehouse Bin Heat Map</h3>
        <div className="space-y-4 overflow-x-auto scrollbar-visible">
          <div className="min-w-[480px]">
            <div className="flex justify-between mb-2"><span className="font-label-md">Zone A</span><span className="text-label-sm text-on-surface-variant">84 bins</span></div>
            <div className="grid grid-cols-12 gap-0.5">
              {zoneA.map((status, i) => (
                <div key={i} className={`aspect-square rounded-sm ${cellColors[status]} hover:ring-1 hover:ring-primary cursor-pointer`} title={`Bin A-${i + 1}: ${status}`} />
              ))}
            </div>
          </div>
          <div className="min-w-[480px]">
            <div className="flex justify-between mb-2"><span className="font-label-md">Zone B</span><span className="text-label-sm text-on-surface-variant">56 bins</span></div>
            <div className="grid grid-cols-14 gap-0.5">
              {zoneB.map((status, i) => (
                <div key={i} className={`aspect-square rounded-sm ${cellColors[status]} hover:ring-1 hover:ring-primary cursor-pointer`} title={`Bin B-${i + 1}: ${status}`} />
              ))}
            </div>
          </div>
          <div className="flex gap-4 text-label-sm">
            {Object.entries(cellColors).map(([status, color]) => (
              <span key={status} className="flex items-center gap-1"><span className={`w-3 h-3 rounded-sm ${color}`} />{status}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-stack_md">
        <div className="glass-card p-stack_md rounded-xl">
          <h3 className="font-title-lg text-title-lg mb-4">Nearby Warehouse Stock</h3>
          {warehouseItems.slice(0, 3).map((item) => (
            <div key={item.id} className="flex justify-between items-center p-3 border-b border-outline-variant/50 last:border-0">
              <div><div className="font-label-md">{item.name}</div><div className="text-label-sm text-on-surface-variant">{item.warehouse} · {item.stock} units</div></div>
              <button type="button" className="text-secondary text-label-sm hover:underline">Request Transfer</button>
            </div>
          ))}
        </div>
        <div className="glass-card p-stack_md rounded-xl">
          <h3 className="font-title-lg text-title-lg mb-4">Strategic Alternatives</h3>
          <ul className="space-y-2 text-body-md text-on-surface-variant">
            <li>• Expedite PO-5502 from Vertex Microchips</li>
            <li>• Transfer 45 units from Remote 1 warehouse</li>
            <li>• Substitute with compatible NV-400 processors</li>
          </ul>
        </div>
      </div>

      <div className={`fixed bottom-6 right-6 w-80 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl z-30 transition-all ${chatOpen ? '' : 'h-12 overflow-hidden'}`}>
        <button type="button" className="w-full p-3 flex justify-between items-center border-b border-outline-variant bg-primary text-on-primary rounded-t-xl" onClick={() => setChatOpen(!chatOpen)}>
          <span className="flex items-center gap-2"><span className="material-symbols-outlined">smart_toy</span> Nexus AI Assistant</span>
          <span className={`material-symbols-outlined transition-transform ${chatOpen ? 'rotate-180' : ''}`}>expand_more</span>
        </button>
        {chatOpen && (
          <>
            <div className="p-3 max-h-48 overflow-y-auto scrollbar-visible space-y-2">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`p-2 rounded-lg text-label-md ${msg.role === 'ai' ? 'bg-surface-container-low' : 'bg-secondary-container/30 ml-4'}`}>{msg.text}</div>
              ))}
            </div>
            <div className="p-3 border-t border-outline-variant flex gap-2">
              <input className="flex-1 px-3 py-2 border border-outline-variant rounded-lg text-body-md" placeholder="Ask about production risk..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendChat()} />
              <button type="button" className="p-2 bg-secondary text-on-secondary rounded-lg" onClick={sendChat}><span className="material-symbols-outlined">send</span></button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
