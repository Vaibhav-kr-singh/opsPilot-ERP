export interface Company {
  id: string
  name: string
  code: string
}

export interface AuthUser {
  userId: string
  password: string
  name: string
  companyId: string
  role: string
  avatar?: string
}

export interface SessionUser {
  userId: string
  name: string
  companyId: string
  companyName: string
  role: string
  avatar?: string
}

export const companies: Company[] = [
  { id: 'nexus', name: 'Nexus Global Industries', code: 'NGI' },
  { id: 'acme', name: 'Acme Manufacturing', code: 'ACM' },
  { id: 'techflow', name: 'TechFlow Industries', code: 'TFI' },
  { id: 'buildright', name: 'BuildRight Corp', code: 'BRC' },
  { id: 'globalsteel', name: 'Global Steel Ltd', code: 'GSL' },
]

export const sampleUsers: AuthUser[] = [
  { userId: 'admin', password: 'admin123', name: 'Alex Morgan', companyId: 'nexus', role: 'System Administrator' },
  { userId: 'sarah.chen', password: 'nexus123', name: 'Sarah Chen', companyId: 'nexus', role: 'Operations Manager' },
  { userId: 'mike.torres', password: 'nexus123', name: 'Mike Torres', companyId: 'acme', role: 'Warehouse Lead' },
  { userId: 'lisa.park', password: 'nexus123', name: 'Lisa Park', companyId: 'techflow', role: 'Procurement Head' },
  { userId: 'james.wilson', password: 'nexus123', name: 'James Wilson', companyId: 'buildright', role: 'Inventory Analyst' },
  { userId: 'demo', password: 'demo123', name: 'Demo User', companyId: 'globalsteel', role: 'Viewer' },
]

export const defaultAvatar =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBPAHW6peNCEY9okQy3A50qd8ZRQJ8pQoqGxKYoAGYbQOoFIU4bcTEGGI_XKM-lQgaydBl5C2TNGRkLJOhBoNYoZD1AyB7RqOCLfCTNB54JvVL1yLbBoKj9ATZZMaX4aP62pNkbbczbfyJharXsAwgKl9pCt8PM5jh5xN0WXWjPTh9BUJfgiOzPNg4ArYzTW8bUcXHbmB5QqgUbtGboJy_eywYs4MMvHcRUrOOw5qEi3R-N8YVWIEEsyMUGlFFOEODLQ_jyPzZ4yWYl'

export const warehouseLoginImage =
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80'
