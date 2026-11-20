import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { navItems } from '../ui/Icon'

export function Sidebar() {
  const { user } = useAuth()

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-primary border-r border-outline-variant shadow-sm flex flex-col z-50">
      <div className="p-6">
        <h1 className="font-display-lg text-display-lg font-bold text-white mb-1">Nexus ERP</h1>
        <p className="text-on-primary-fixed-variant font-label-md text-label-md opacity-80 uppercase tracking-wider">
          Inventory Management
        </p>
        {user && (
          <p className="text-secondary-fixed text-[11px] mt-2 truncate" title={user.companyName}>
            {user.companyName}
          </p>
        )}
      </div>
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-dark">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 transition-all duration-200 ease-in-out ${
                isActive
                  ? 'bg-on-primary-fixed-variant text-secondary-fixed border-l-4 border-secondary-fixed'
                  : 'text-on-primary hover:bg-on-primary-fixed-variant/50 border-l-4 border-transparent'
              }`
            }
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="font-body-md text-body-md">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto border-t border-on-primary-fixed-variant/20 py-4">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 transition-colors ${
              isActive ? 'bg-on-primary-fixed-variant text-secondary-fixed' : 'text-on-primary hover:bg-on-primary-fixed-variant/50'
            }`
          }
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="font-body-md text-body-md">Settings</span>
        </NavLink>
      </div>
    </aside>
  )
}
