import type { ReactNode } from 'react'

const statusStyles: Record<string, string> = {
  'In Stock': 'bg-secondary-container/20 text-secondary',
  'Low Stock': 'bg-secondary-container/30 text-on-secondary-container',
  'Out of Stock': 'bg-error-container/20 text-error',
  Critical: 'bg-error-container/30 text-error',
  High: 'bg-error-container/20 text-error',
  Medium: 'bg-secondary-container/20 text-on-secondary-container',
  Low: 'bg-surface-container-highest text-on-surface-variant',
  Shipped: 'bg-secondary-container/20 text-secondary',
  Processing: 'bg-surface-container-highest text-on-surface-variant',
  Delayed: 'bg-error-container/20 text-error',
  Completed: 'bg-secondary-container/20 text-secondary',
  Pending: 'bg-surface-container-highest text-on-surface-variant',
  Approved: 'bg-secondary-container/20 text-secondary',
  Rejected: 'bg-error-container/20 text-error',
  'In Transit': 'bg-secondary-container/20 text-on-tertiary-container',
  Active: 'bg-secondary-container/20 text-secondary',
  Ready: 'bg-secondary-container/20 text-secondary',
  Failed: 'bg-error-container/20 text-error',
}

export function StatusBadge({ status }: { status: string }) {
  const style = statusStyles[status] ?? 'bg-surface-container-highest text-on-surface-variant'
  return (
    <span className={`px-2 py-1 text-[11px] font-bold rounded-full uppercase ${style}`}>
      {status}
    </span>
  )
}

export function KpiCard({
  label,
  value,
  subtext,
  badge,
  children,
}: {
  label: string
  value: string | ReactNode
  subtext?: string
  badge?: ReactNode
  children?: ReactNode
}) {
  return (
    <div className="glass-card p-stack_md rounded-xl flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">{label}</span>
        {badge}
      </div>
      <div className="mt-4">
        <div className="text-display-lg font-display-lg text-primary">{value}</div>
        {subtext && <div className="text-label-sm text-on-surface-variant">{subtext}</div>}
        {children}
      </div>
    </div>
  )
}

export function PageHeader({
  title,
  subtitle,
  breadcrumb,
  actions,
}: {
  title: string
  subtitle?: string
  breadcrumb?: string
  actions?: ReactNode
}) {
  return (
    <div className="flex justify-between items-end">
      <div>
        {breadcrumb && (
          <nav className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm mb-2">
            <span>Dashboard</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-on-surface">{breadcrumb}</span>
          </nav>
        )}
        <h2 className="font-display-lg text-display-lg text-on-background">{title}</h2>
        {subtitle && <p className="text-on-surface-variant">{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-stack_sm">{actions}</div>}
    </div>
  )
}

export function GhostButton({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-4 py-2 border border-outline rounded-lg font-label-md text-on-surface-variant hover:bg-surface-container-low transition-all"
    >
      {children}
    </button>
  )
}

export function PrimaryButton({ children, onClick, icon }: { children: ReactNode; onClick?: () => void; icon?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-4 py-2 bg-primary text-on-primary rounded-lg font-label-md hover:bg-primary/90 shadow-sm transition-all flex items-center gap-2"
    >
      {icon && <span className="material-symbols-outlined text-[18px]">{icon}</span>}
      {children}
    </button>
  )
}

export function SecondaryButton({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-4 py-2 bg-secondary text-on-secondary rounded-lg font-label-md hover:bg-secondary/90 shadow-sm transition-all flex items-center gap-2"
    >
      {children}
    </button>
  )
}
