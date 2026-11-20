import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'

export function TopNav() {
  const { searchQuery, setSearchQuery, selectedWarehouse, setSelectedWarehouse, dateRange, notifications, markNotificationRead, warehouses } = useApp()
  const { user, logout } = useAuth()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showWarehouse, setShowWarehouse] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const navigate = useNavigate()
  const unreadCount = notifications.filter((n) => !n.read).length

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
    navigate('/login')
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/inventory?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-260px)] h-16 bg-surface/70 backdrop-blur-xl border-b border-outline-variant flex justify-between items-center px-gutter z-40 transition-all duration-300 shadow-sm">
      <div className="flex items-center gap-4 w-1/3">
        <div className="relative w-full max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-body-md">search</span>
          <input
            className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg font-body-md focus:ring-2 focus:ring-secondary/20 focus:outline-none"
            placeholder="Global Search..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 text-on-surface-variant font-label-md relative">
          <button
            type="button"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-surface-container-highest transition-colors"
            onClick={() => setShowWarehouse(!showWarehouse)}
          >
            <span className="material-symbols-outlined text-body-md">location_on</span>
            {selectedWarehouse}
          </button>
          {showWarehouse && (
            <div className="absolute top-full left-0 mt-1 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg py-1 z-50 min-w-[180px]">
              {warehouses.map((w) => (
                <button
                  key={w}
                  type="button"
                  className="w-full text-left px-4 py-2 hover:bg-surface-container-low text-body-md"
                  onClick={() => {
                    setSelectedWarehouse(w)
                    setShowWarehouse(false)
                  }}
                >
                  {w}
                </button>
              ))}
            </div>
          )}
          <button type="button" className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-surface-container-highest transition-colors font-bold text-primary">
            <span className="material-symbols-outlined text-body-md">calendar_today</span>
            {dateRange}
          </button>
        </div>
        <div className="flex items-center gap-3 border-l border-outline-variant pl-6">
          <button type="button" className="material-symbols-outlined p-2 text-on-surface-variant hover:bg-surface-container-highest rounded-full" onClick={() => navigate('/analytics')}>
            filter_alt
          </button>
          <button type="button" className="material-symbols-outlined p-2 text-on-surface-variant hover:bg-surface-container-highest rounded-full" onClick={() => navigate('/demand-forecasting')}>
            smart_toy
          </button>
          <div className="relative">
            <button
              type="button"
              className="material-symbols-outlined p-2 text-on-surface-variant hover:bg-surface-container-highest rounded-full"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              notifications
            </button>
            {unreadCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full" />}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg z-50 overflow-hidden">
                <div className="p-4 border-b border-outline-variant font-title-lg text-title-lg">Notifications</div>
                <div className="max-h-64 overflow-y-auto scrollbar-visible">
                  {notifications.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      className={`w-full text-left p-3 border-b border-outline-variant/50 hover:bg-surface-container-low ${!n.read ? 'bg-surface-container-low/50' : ''}`}
                      onClick={() => {
                        markNotificationRead(n.id)
                        if (n.type === 'critical') navigate('/stock-alerts')
                      }}
                    >
                      <div className="font-label-md text-label-md">{n.title}</div>
                      <div className="text-label-sm text-on-surface-variant">{n.message}</div>
                      <div className="text-[10px] text-on-surface-variant mt-1">{n.timestamp}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="relative">
            <button
              type="button"
              className="flex items-center gap-2 rounded-full hover:ring-2 hover:ring-secondary/30 transition-all"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <img
                className="w-9 h-9 rounded-full object-cover ring-2 ring-secondary/20"
                alt={user?.name ?? 'User avatar'}
                src={user?.avatar}
              />
            </button>
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg z-50 overflow-hidden">
                <div className="p-4 border-b border-outline-variant bg-surface-container-low/50">
                  <div className="font-label-md text-label-md">{user?.name}</div>
                  <div className="text-label-sm text-on-surface-variant">{user?.role}</div>
                  <div className="text-label-sm text-secondary mt-1 truncate">{user?.companyName}</div>
                </div>
                <button
                  type="button"
                  className="w-full text-left px-4 py-3 hover:bg-surface-container-low text-body-md flex items-center gap-2"
                  onClick={() => { setShowUserMenu(false); navigate('/settings') }}
                >
                  <span className="material-symbols-outlined text-[18px]">settings</span>
                  Settings
                </button>
                <button
                  type="button"
                  className="w-full text-left px-4 py-3 hover:bg-error-container/20 text-error text-body-md flex items-center gap-2 border-t border-outline-variant/50"
                  onClick={handleLogout}
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
