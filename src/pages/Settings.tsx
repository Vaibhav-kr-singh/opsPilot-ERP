import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { GhostButton, PageHeader, PrimaryButton } from '../components/ui/SharedUI'

export default function Settings() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      <PageHeader title="Settings" breadcrumb="Settings" subtitle="Configure your Nexus ERP preferences." />
      <div className="glass-card p-stack_lg rounded-xl max-w-2xl space-y-stack_md">
        <div className="pb-4 border-b border-outline-variant">
          <div className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Signed in as</div>
          <div className="font-label-md">{user?.name}</div>
          <div className="text-label-sm text-on-surface-variant">{user?.role} · {user?.userId}</div>
        </div>
        <div>
          <label className="font-label-md text-label-md block mb-2">Company</label>
          <input className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-container-low" readOnly value={user?.companyName ?? ''} />
        </div>
        <div>
          <label className="font-label-md text-label-md block mb-2">Default Warehouse</label>
          <select className="w-full px-3 py-2 border border-outline-variant rounded-lg">
            <option>Main Hub</option>
            <option>Remote 1</option>
            <option>EU Hub</option>
            <option>APAC Hub</option>
          </select>
        </div>
        <div>
          <label className="font-label-md text-label-md block mb-2">Low Stock Threshold (%)</label>
          <input type="number" className="w-full px-3 py-2 border border-outline-variant rounded-lg" defaultValue={20} />
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" id="notifications" defaultChecked className="rounded" />
          <label htmlFor="notifications" className="font-label-md">Enable email notifications for critical alerts</label>
        </div>
        <div className="flex gap-3 pt-2">
          <PrimaryButton>Save Settings</PrimaryButton>
          <GhostButton onClick={handleLogout}>Sign Out</GhostButton>
        </div>
      </div>
    </>
  )
}
