import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { companies, defaultAvatar, sampleUsers, type SessionUser } from '../data/authData'

const STORAGE_KEY = 'nexus_erp_session'

interface AuthState {
  user: SessionUser | null
  isAuthenticated: boolean
  login: (companyId: string, userId: string, password: string, remember: boolean) => { success: boolean; error?: string }
  logout: () => void
}

const AuthContext = createContext<AuthState | null>(null)

function loadSession(): SessionUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) ?? sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as SessionUser
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(loadSession)

  const login = useCallback((companyId: string, userId: string, password: string, remember: boolean) => {
    const account = sampleUsers.find(
      (u) => u.userId.toLowerCase() === userId.trim().toLowerCase() && u.password === password,
    )
    if (!account) {
      return { success: false, error: 'Invalid User ID or Password.' }
    }
    if (account.companyId !== companyId) {
      return { success: false, error: 'This user does not belong to the selected company.' }
    }
    const company = companies.find((c) => c.id === companyId)
    const session: SessionUser = {
      userId: account.userId,
      name: account.name,
      companyId: account.companyId,
      companyName: company?.name ?? 'Unknown Company',
      role: account.role,
      avatar: account.avatar ?? defaultAvatar,
    }
    setUser(session)
    const storage = remember ? localStorage : sessionStorage
    storage.setItem(STORAGE_KEY, JSON.stringify(session))
    if (remember) sessionStorage.removeItem(STORAGE_KEY)
    else localStorage.removeItem(STORAGE_KEY)
    return { success: true }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
    sessionStorage.removeItem(STORAGE_KEY)
  }, [])

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, login, logout }),
    [user, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
