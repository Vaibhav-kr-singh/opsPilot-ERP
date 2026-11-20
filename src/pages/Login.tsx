import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { companies, warehouseLoginImage } from '../data/authData'

export default function Login() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [companyId, setCompanyId] = useState(companies[0].id)
  const [userId, setUserId] = useState('admin')
  const [password, setPassword] = useState('admin123')
  const [remember, setRemember] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) return <Navigate to="/" replace />

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!userId.trim() || !password) {
      setError('Please enter your User ID and Password.')
      return
    }
    setLoading(true)
    const result = login(companyId, userId, password, remember)
    setLoading(false)
    if (result.success) {
      navigate('/')
    } else {
      setError(result.error ?? 'Login failed.')
    }
  }

  return (
    <div className="min-h-screen bg-[#e8ecf4] flex items-center justify-center p-4">
      <div className="w-full max-w-[920px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[520px]">
        {/* Left — warehouse image */}
        <div
          className="hidden md:flex md:w-1/2 relative bg-primary-container items-start justify-center p-8"
          style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url('${warehouseLoginImage}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <span className="text-white/90 font-label-md text-label-md uppercase tracking-[0.2em] mt-2">Inventory Management</span>
        </div>

        {/* Right — login form */}
        <div className="flex-1 flex flex-col">
          <div className="bg-primary px-8 py-6 flex items-center gap-4">
            <svg width="42" height="42" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
              <path d="M5 20V8.5C5 6.567 6.567 5 8.5 5C9.428 5 10.318 5.368 10.975 6.025L19 14.05" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19 4V15.5C19 17.433 17.433 19 15.5 19C14.572 19 13.682 18.632 13.025 17.975L5 9.95" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="flex flex-col justify-center">
              <div className="text-white font-bold text-[26px] leading-tight tracking-tight mb-0.5">Nexus ERP</div>
              <div className="text-white/80 text-[14px] font-medium tracking-wide">Inventory Management</div>
            </div>
          </div>

          <form className="flex-1 flex flex-col px-8 py-8" onSubmit={handleSubmit}>
            <h1 className="text-2xl font-bold text-primary mb-6">Welcome Back</h1>

            <label className="font-label-md text-label-md mb-1.5" htmlFor="company">Company</label>
            <select
              id="company"
              className="w-full px-4 py-3 mb-4 border border-outline-variant rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
            >
              {companies.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <label className="font-label-md text-label-md mb-1.5" htmlFor="userId">User ID</label>
            <input
              id="userId"
              type="text"
              placeholder="Enter your User ID"
              className="w-full px-4 py-3 mb-4 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              autoComplete="username"
            />

            <label className="font-label-md text-label-md mb-1.5" htmlFor="password">Password</label>
            <div className="relative mb-4">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className="w-full px-4 py-3 pr-12 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>

            <label className="flex items-center gap-2 mb-6 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-outline-variant accent-secondary"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span className="text-label-md text-on-surface-variant">Remember Me</span>
            </label>

            {error && (
              <div className="mb-4 px-4 py-2 bg-error-container/30 border border-error/30 rounded-lg text-error text-label-md">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-primary text-on-primary rounded-full font-label-md text-label-md font-semibold hover:shadow-[0_0_20px_rgba(0,200,120,0.45)] hover:bg-primary/90 transition-all disabled:opacity-60"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>


          </form>

          <div className="px-8 py-4 border-t border-outline-variant/30 flex justify-between text-[11px] text-on-surface-variant">
            <span>Version 1.0.0</span>
            <span>© 2026 Nexus ERP. All Rights Reserved.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
