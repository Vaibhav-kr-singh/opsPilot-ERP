import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  calcInventoryValue,
  countByStatus,
  forecastItems as initialForecast,
  initialNotifications,
  inventoryItems as initialInventory,
  procurementRequests as initialProcurement,
  purchaseOrders as initialPOs,
  purchaseRecommendations as initialRecommendations,
  reports as initialReports,
  salesOrders as initialSales,
  stockAlerts as initialAlerts,
  suppliers as initialSuppliers,
  warehouses,
} from '../data/mockData'
import type {
  ForecastItem,
  InventoryItem,
  Notification,
  ProcurementRequest,
  PurchaseOrder,
  PurchaseRecommendation,
  Report,
  SalesOrder,
  StockAlert,
  Supplier,
} from '../data/types'

interface AppState {
  inventory: InventoryItem[]
  purchaseOrders: PurchaseOrder[]
  procurementRequests: ProcurementRequest[]
  suppliers: Supplier[]
  salesOrders: SalesOrder[]
  stockAlerts: StockAlert[]
  purchaseRecommendations: PurchaseRecommendation[]
  forecastItems: ForecastItem[]
  reports: Report[]
  notifications: Notification[]
  selectedWarehouse: string
  searchQuery: string
  dateRange: string
  inventoryValue: number
  outOfStockCount: number
  lowStockCount: number
  criticalAlertCount: number
  activePOCount: number
  pendingApprovalCount: number
  warehouses: string[]
  setSelectedWarehouse: (w: string) => void
  setSearchQuery: (q: string) => void
  setDateRange: (d: string) => void
  markNotificationRead: (id: string) => void
  approvePurchaseOrder: (id: string) => void
  rejectPurchaseOrder: (id: string) => void
  createPurchaseOrder: (po: Omit<PurchaseOrder, 'id'>) => void
  approveRecommendation: (id: string) => void
  rejectRecommendation: (id: string) => void
  approveAllHighUrgency: () => void
  updateInventoryStock: (id: string, stock: number) => void
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void
  updateInventoryItem: (id: string, item: Omit<InventoryItem, 'id'>) => void
  createProcurementRequest: (req: Omit<ProcurementRequest, 'id'>) => void
  addSupplier: (supplier: Omit<Supplier, 'id'>) => Promise<void>
  dismissAlert: (id: string) => void
  applyAllReorderSuggestions: () => void
  generateReport: (name: string, type: string) => void
  recalculateForecast: () => void
  filterBySearch: <T,>(items: T[], fields: (keyof T)[]) => T[]
  filterByWarehouse: <T extends { warehouse?: string }>(items: T[]) => T[]
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [inventory, setInventory] = useState(initialInventory)
  const [purchaseOrders, setPurchaseOrders] = useState(initialPOs)
  const [procurementRequests, setProcurementRequests] = useState(initialProcurement)
  const [suppliers, setSuppliers] = useState(initialSuppliers)
  const [salesOrders, setSalesOrders] = useState(initialSales)
  const [stockAlerts, setStockAlerts] = useState(initialAlerts)
  const [purchaseRecommendations, setPurchaseRecommendations] = useState(initialRecommendations)
  const [forecastItems, setForecastItems] = useState(initialForecast)
  const [reports, setReports] = useState(initialReports)
  const [notifications, setNotifications] = useState(initialNotifications)
  const [selectedWarehouse, setSelectedWarehouse] = useState('All Warehouses')
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState('Jan 1 - Jan 31')
  const [forecastConfidence, setForecastConfidence] = useState(94.2)

  const inventoryValue = useMemo(() => calcInventoryValue(inventory), [inventory])

  useEffect(() => {
    const API_BASE = 'http://127.0.0.1:5000/api'
    
    fetch(`${API_BASE}/inventory_items`).then(res => res.json()).then(data => {
      if (data.success && data.data.length > 0) {
        setInventory(data.data.map((item: any) => ({
          id: String(item.id), code: item.code, name: item.name, category: item.category, warehouse: item.warehouse,
          stock: Number(item.stock), minStock: Number(item.min_stock), maxStock: Number(item.max_stock),
          unitCost: parseFloat(item.unit_cost), status: item.status
        })))
      }
    }).catch(console.error)

    fetch(`${API_BASE}/suppliers`).then(res => res.json()).then(data => {
      if (data.success && data.data.length > 0) {
        setSuppliers(data.data.map((item: any) => ({
          id: String(item.id), name: item.name, contact: item.contact, category: item.category,
          leadTime: Number(item.lead_time), rating: parseFloat(item.rating),
          lastDelivery: item.last_delivery, activeOrders: Number(item.active_orders), status: item.status
        })))
      }
    }).catch(console.error)

    fetch(`${API_BASE}/purchase_orders`).then(res => res.json()).then(data => {
      if (data.success && data.data.length > 0) {
        setPurchaseOrders(data.data.map((item: any) => ({
          id: String(item.id), poNumber: item.po_number, supplier: item.supplier_name || String(item.supplier_id),
          item: item.item_name || String(item.item_id), quantity: Number(item.quantity),
          unitPrice: parseFloat(item.unit_price), orderDate: item.order_date,
          deliveryDate: item.delivery_date, status: item.status
        })))
      }
    }).catch(console.error)

    fetch(`${API_BASE}/procurement_requests`).then(res => res.json()).then(data => {
      if (data.success && data.data.length > 0) {
        setProcurementRequests(data.data.map((item: any) => ({
          id: String(item.id), prNumber: item.pr_number, requestedBy: item.requested_by, department: item.department,
          supplier: item.supplier_name || String(item.supplier_id), requestDate: item.request_date,
          neededBy: item.needed_by, status: item.status, value: parseFloat(item.value)
        })))
      }
    }).catch(console.error)

    fetch(`${API_BASE}/sales_orders`).then(res => res.json()).then(data => {
      if (data.success && data.data.length > 0) {
        setSalesOrders(data.data.map((item: any) => ({
          id: String(item.id), orderNumber: item.order_number, customer: item.customer, product: item.product,
          quantity: Number(item.quantity), value: parseFloat(item.value), orderDate: item.order_date, status: item.status
        })))
      }
    }).catch(console.error)

    fetch(`${API_BASE}/stock_alerts`).then(res => res.json()).then(data => {
      if (data.success && data.data.length > 0) {
        setStockAlerts(data.data.map((item: any) => ({
          id: String(item.id), item: item.item_name || String(item.item_id), sku: item.sku, warehouse: item.warehouse,
          currentStock: Number(item.current_stock), minStock: Number(item.min_stock),
          alertLevel: item.alert_level, recommendedAction: item.recommended_action
        })))
      }
    }).catch(console.error)
  }, [])

  const outOfStockCount = useMemo(() => countByStatus(inventory, ['Out of Stock']), [inventory])
  const lowStockCount = useMemo(() => countByStatus(inventory, ['Low Stock']), [inventory])
  const criticalAlertCount = useMemo(() => stockAlerts.filter((a) => a.alertLevel === 'Critical').length, [stockAlerts])
  const activePOCount = useMemo(() => purchaseOrders.filter((p) => !['Completed', 'Rejected'].includes(p.status)).length, [purchaseOrders])
  const pendingApprovalCount = useMemo(
    () => purchaseOrders.filter((p) => p.status === 'Pending').length + procurementRequests.filter((r) => r.status === 'Pending').length,
    [purchaseOrders, procurementRequests],
  )

  const filterBySearch = useCallback(
    <T,>(items: T[], fields: (keyof T)[]) => {
      if (!searchQuery.trim()) return items
      const q = searchQuery.toLowerCase()
      return items.filter((item) => fields.some((f) => String(item[f]).toLowerCase().includes(q)))
    },
    [searchQuery],
  )

  const filterByWarehouse = useCallback(
    <T extends { warehouse?: string }>(items: T[]) => {
      if (selectedWarehouse === 'All Warehouses') return items
      return items.filter((item) => item.warehouse === selectedWarehouse)
    },
    [selectedWarehouse],
  )

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }, [])

  const approvePurchaseOrder = useCallback((id: string) => {
    setPurchaseOrders((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p
        return { ...p, status: 'Approved' as const }
      }),
    )
    setNotifications((prev) => {
      const po = purchaseOrders.find((p) => p.id === id)
      return [
        { id: Date.now().toString(), title: 'PO Approved', message: `${po?.poNumber ?? 'Purchase order'} approved`, type: 'success', read: false, timestamp: 'Just now' },
        ...prev,
      ]
    })
  }, [purchaseOrders])

  const rejectPurchaseOrder = useCallback((id: string) => {
    setPurchaseOrders((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p
        return { ...p, status: 'Rejected' as const }
      }),
    )
    setNotifications((prev) => {
      const po = purchaseOrders.find((p) => p.id === id)
      return [
        { id: Date.now().toString(), title: 'PO Rejected', message: `${po?.poNumber ?? 'Purchase order'} rejected`, type: 'warning', read: false, timestamp: 'Just now' },
        ...prev,
      ]
    })
  }, [purchaseOrders])

  const createPurchaseOrder = useCallback((po: Omit<PurchaseOrder, 'id'>) => {
    const newPO: PurchaseOrder = { ...po, id: Date.now().toString() }
    setPurchaseOrders((prev) => [newPO, ...prev])
    setNotifications((prev) => [
      { id: Date.now().toString(), title: 'PO Created', message: `${po.poNumber} created successfully`, type: 'success', read: false, timestamp: 'Just now' },
      ...prev,
    ])
  }, [])

  const approveRecommendation = useCallback(
    (id: string) => {
      const rec = purchaseRecommendations.find((r) => r.id === id)
      if (!rec) return
      setPurchaseRecommendations((prev) => prev.map((r) => (r.id === id ? { ...r, approved: true } : r)))
      createPurchaseOrder({
        poNumber: `PO-${Math.floor(Math.random() * 9000) + 1000}`,
        supplier: rec.supplier,
        item: rec.product,
        quantity: rec.recommendedQty,
        unitPrice: rec.estimatedCost / rec.recommendedQty,
        orderDate: new Date().toISOString().split('T')[0],
        deliveryDate: new Date(Date.now() + rec.leadTime * 86400000).toISOString().split('T')[0],
        status: 'Pending',
      })
    },
    [purchaseRecommendations, createPurchaseOrder],
  )

  const rejectRecommendation = useCallback((id: string) => {
    setPurchaseRecommendations((prev) => prev.filter((r) => r.id !== id))
  }, [])

  const approveAllHighUrgency = useCallback(() => {
    purchaseRecommendations
      .filter((r) => (r.urgency === 'Critical' || r.urgency === 'High') && !r.approved)
      .forEach((r) => approveRecommendation(r.id))
  }, [purchaseRecommendations, approveRecommendation])

  const updateInventoryStock = useCallback((id: string, stock: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item
        let status = item.status
        if (stock === 0) status = 'Out of Stock'
        else if (stock < item.minStock) status = 'Low Stock'
        else status = 'In Stock'
        return { ...item, stock, status }
      }),
    )
  }, [])

  const addInventoryItem = useCallback((item: Omit<InventoryItem, 'id'>) => {
    setInventory((prev) => [...prev, { ...item, id: Date.now().toString() }])
  }, [])

  const updateInventoryItem = useCallback((id: string, item: Omit<InventoryItem, 'id'>) => {
    setInventory((prev) => prev.map((current) => current.id === id ? { ...item, id } : current))
  }, [])

  const createProcurementRequest = useCallback((req: Omit<ProcurementRequest, 'id'>) => {
    setProcurementRequests((prev) => [{ ...req, id: Date.now().toString() }, ...prev])
  }, [])

  const addSupplier = useCallback(async (supplier: Omit<Supplier, 'id'>) => {
    const API_BASE = 'http://127.0.0.1:5000/api'
    try {
      const res = await fetch(`${API_BASE}/suppliers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: supplier.name, contact: supplier.contact, category: supplier.category,
          lead_time: supplier.leadTime, rating: supplier.rating,
          last_delivery: supplier.lastDelivery, active_orders: supplier.activeOrders, status: supplier.status,
        }),
      })
      const result = await res.json()
      if (result.success) {
        const newId = String(result.data.id)
        setSuppliers((prev) => [...prev, { ...supplier, id: newId }])
        setNotifications((prev) => [
          { id: Date.now().toString(), title: 'Supplier Added', message: `${supplier.name} added to directory`, type: 'success', read: false, timestamp: 'Just now' },
          ...prev,
        ])
      } else {
        // Backend unavailable — add locally with temporary id
        setSuppliers((prev) => [...prev, { ...supplier, id: Date.now().toString() }])
      }
    } catch {
      // Offline fallback
      setSuppliers((prev) => [...prev, { ...supplier, id: Date.now().toString() }])
    }
  }, [])

  const dismissAlert = useCallback((id: string) => {
    setStockAlerts((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const applyAllReorderSuggestions = useCallback(() => {
    stockAlerts.forEach((alert) => {
      const rec = purchaseRecommendations.find((r) => r.product.includes(alert.item.split(' ')[0]))
      if (rec && !rec.approved) approveRecommendation(rec.id)
    })
  }, [stockAlerts, purchaseRecommendations, approveRecommendation])

  const generateReport = useCallback((name: string, type: string) => {
    const newReport: Report = {
      id: Date.now().toString(),
      name,
      type,
      generatedAt: new Date().toLocaleString(),
      status: 'Processing',
      size: '-',
    }
    setReports((prev) => [newReport, ...prev])
    setTimeout(() => {
      setReports((prev) =>
        prev.map((r) => (r.id === newReport.id ? { ...r, status: 'Ready', size: `${(Math.random() * 3 + 0.5).toFixed(1)} MB` } : r)),
      )
    }, 2000)
  }, [])

  const recalculateForecast = useCallback(() => {
    setForecastItems((prev) =>
      prev.map((item) => ({
        ...item,
        predictedDemand: Math.round(item.predictedDemand * (0.95 + Math.random() * 0.1)),
        confidence: Math.round(88 + Math.random() * 8),
      })),
    )
    setForecastConfidence(Math.round((92 + Math.random() * 4) * 10) / 10)
  }, [])

  const value: AppState = {
    inventory,
    purchaseOrders,
    procurementRequests,
    suppliers,
    salesOrders,
    stockAlerts,
    purchaseRecommendations,
    forecastItems,
    reports,
    notifications,
    selectedWarehouse,
    searchQuery,
    dateRange,
    inventoryValue,
    outOfStockCount,
    lowStockCount,
    criticalAlertCount,
    activePOCount,
    pendingApprovalCount,
    warehouses,
    setSelectedWarehouse,
    setSearchQuery,
    setDateRange,
    markNotificationRead,
    approvePurchaseOrder,
    rejectPurchaseOrder,
    createPurchaseOrder,
    approveRecommendation,
    rejectRecommendation,
    approveAllHighUrgency,
    updateInventoryStock,
    addInventoryItem,
    updateInventoryItem,
    createProcurementRequest,
    addSupplier,
    dismissAlert,
    applyAllReorderSuggestions,
    generateReport,
    recalculateForecast,
    filterBySearch,
    filterByWarehouse,
  }

  void forecastConfidence

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
