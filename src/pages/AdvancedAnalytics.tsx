import { GhostButton, PageHeader, PrimaryButton } from '../components/ui/SharedUI'

export default function AdvancedAnalytics() {
  return (
    <>
      <PageHeader
        title="Advanced ERP Analytics"
        breadcrumb="Analytics"
        actions={
          <>
            <GhostButton>Jan 1 - Jan 31</GhostButton>
            <PrimaryButton>Export Data</PrimaryButton>
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-stack_md">
        <div className="glass-card p-stack_md rounded-xl lg:col-span-2">
          <div className="flex justify-between items-start mb-4">
            <div><h3 className="font-title-lg text-title-lg">Inventory Turnover Ratio</h3><p className="text-label-sm text-on-surface-variant">12-month trend</p></div>
            <span className="bg-secondary/10 text-secondary px-2 py-0.5 rounded text-label-sm">+12.4%</span>
          </div>
          <svg viewBox="0 -10 300 110" className="w-full h-32 overflow-visible">
            {[[0,80,'2.1'], [30,70,'2.4'], [60,65,'2.8'], [90,55,'3.1'], [120,50,'3.5'], [150,45,'3.8'], [180,40,'4.2'], [210,35,'4.5'], [240,30,'4.8'], [270,25,'5.1'], [300,20,'5.5']].map(([x, y, v], i) => (
              <text key={i} x={x} y={Number(y) - 5} fontSize="10" fill="currentColor" className="text-on-surface-variant font-medium" textAnchor="middle">{v}</text>
            ))}
            <polyline points="0,80 30,70 60,65 90,55 120,50 150,45 180,40 210,35 240,30 270,25 300,20" fill="none" stroke="currentColor" className="text-primary" strokeWidth="2" />
          </svg>
        </div>

        <div className="glass-card p-stack_md rounded-xl flex flex-col items-center justify-center">
          <h3 className="font-title-lg text-title-lg mb-4 self-start">Warehouse Utilization</h3>
          <svg viewBox="0 0 100 60" className="w-32">
            <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#E2E8F0" strokeWidth="6" />
            <path d="M 10 50 A 40 40 0 0 1 82 22" fill="none" stroke="#10B981" strokeWidth="6" />
            <text x="50" y="48" textAnchor="middle" className="text-lg font-bold fill-primary">78%</text>
          </svg>
        </div>

        <div className="glass-card p-stack_md rounded-xl">
          <h3 className="font-title-lg text-title-lg mb-4">Monthly Procurement Cost</h3>
          <div className="flex items-end gap-1 h-24">
            {[45, 60, 55, 70, 65, 80, 75, 90, 85, 95, 88, 92].map((h, i) => (
              <div key={i} className="flex-1 bg-primary/70 rounded-t flex justify-center items-start pt-1" style={{ height: `${h}%` }}>
                <span className="text-[10px] text-white font-medium">${h}k</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-stack_md rounded-xl">
          <h3 className="font-title-lg text-title-lg mb-4">Top Selling Products</h3>
          {[
            { name: 'Electric Motor 25HP', pct: 85 },
            { name: 'Control Panel Unit', pct: 65 },
            { name: 'Copper Wire 500m', pct: 45 },
            { name: 'Alloy Plate 304 SS', pct: 30 },
          ].map((item) => (
            <div key={item.name} className="mb-3">
              <div className="flex justify-between text-label-sm mb-1"><span>{item.name}</span><span>{item.pct}%</span></div>
              <div className="h-2 bg-surface-container-highest rounded-full"><div className="h-2 bg-secondary rounded-full" style={{ width: `${item.pct}%` }} /></div>
            </div>
          ))}
        </div>

        <div className="glass-card p-stack_md rounded-xl flex flex-col items-center">
          <h3 className="font-title-lg text-title-lg mb-4 self-start">ABC Analysis</h3>
          <div className="w-32 h-32 rounded-full" style={{ background: 'conic-gradient(#000 0% 70%, #10B981 70% 90%, #CBD5E1 90% 100%)' }} />
          <div className="flex gap-3 mt-3 text-label-sm"><span>A 70%</span><span>B 20%</span><span>C 10%</span></div>
        </div>

        <div className="glass-card p-stack_md rounded-xl lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-title-lg text-title-lg">Supplier Performance Index</h3>
            <select className="px-3 py-1 border border-outline-variant rounded-lg text-label-sm"><option>All Suppliers</option><option>Top 5</option></select>
          </div>
          <svg viewBox="0 0 200 200" className="w-full max-w-xs mx-auto">
            <polygon points="100,20 170,60 150,140 50,140 30,60" fill="rgba(16,185,129,0.2)" stroke="#10B981" strokeWidth="1" />
            <polygon points="100,40 150,70 135,130 65,130 50,70" fill="rgba(0,0,0,0.1)" stroke="#000" strokeWidth="1" />
          </svg>
        </div>
      </div>

      <div className="glass-card p-stack_md rounded-xl flex flex-wrap justify-between items-center gap-4">
        <div>
          <h3 className="font-title-lg text-title-lg">AI Insights</h3>
          <p className="text-on-surface-variant">Run simulation to predict inventory optimization scenarios.</p>
        </div>
        <PrimaryButton>Run Simulation</PrimaryButton>
      </div>
    </>
  )
}
