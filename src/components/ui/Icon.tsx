export const navItems = [
  { path: '/', label: 'Dashboard', icon: 'dashboard' },
  { path: '/inventory', label: 'Inventory', icon: 'inventory_2' },
  { path: '/procurement', label: 'Procurement', icon: 'shopping_cart' },
  { path: '/purchasing', label: 'Purchasing', icon: 'payments' },
  { path: '/suppliers', label: 'Suppliers', icon: 'conveyor_belt' },
  { path: '/sales', label: 'Sales', icon: 'trending_up' },
  { path: '/production', label: 'Production', icon: 'factory' },
  { path: '/warehouse', label: 'Warehouse', icon: 'warehouse' },
  { path: '/demand-forecasting', label: 'Demand Forecasting', icon: 'query_stats' },
  { path: '/purchase-recommendations', label: 'Purchase Recommendations', icon: 'recommend' },
  { path: '/stock-alerts', label: 'Stock Alerts', icon: 'warning' },
  { path: '/analytics', label: 'Analytics', icon: 'analytics' },
  { path: '/reports', label: 'Reports', icon: 'description' },
] as const

export function Icon({ name, className = '' }: { name: string; className?: string }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>
}
