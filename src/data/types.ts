export type StatusType =
  | 'In Stock'
  | 'Low Stock'
  | 'Out of Stock'
  | 'Critical'
  | 'Shipped'
  | 'Processing'
  | 'Delayed'
  | 'Completed'
  | 'Pending'
  | 'Approved'
  | 'Rejected'
  | 'In Transit'
  | 'Critical'
  | 'High'
  | 'Medium'
  | 'Low'
  | 'Active'

export interface InventoryItem {
  id: string
  code: string
  name: string
  category: string
  warehouse: string
  stock: number
  minStock: number
  maxStock: number
  unitCost: number
  status: StatusType
}

export interface PurchaseOrder {
  id: string
  poNumber: string
  supplier: string
  item: string
  quantity: number
  unitPrice: number
  orderDate: string
  deliveryDate: string
  status: StatusType
}

export interface ProcurementRequest {
  id: string
  prNumber: string
  requestedBy: string
  department: string
  supplier: string
  requestDate: string
  neededBy: string
  status: StatusType
  value: number
}

export interface Supplier {
  id: string
  name: string
  contact: string
  category: string
  leadTime: number
  rating: number
  lastDelivery: string
  activeOrders: number
  status: StatusType
}

export interface SalesOrder {
  id: string
  orderNumber: string
  customer: string
  product: string
  quantity: number
  value: number
  orderDate: string
  status: StatusType
}

export interface StockAlert {
  id: string
  item: string
  sku: string
  warehouse: string
  currentStock: number
  minStock: number
  alertLevel: StatusType
  recommendedAction: string
}

export interface PurchaseRecommendation {
  id: string
  product: string
  stockStatus: string
  forecastedDemand: number
  supplier: string
  leadTime: number
  recommendedQty: number
  estimatedCost: number
  urgency: StatusType
  approved?: boolean
}

export interface ForecastItem {
  id: string
  product: string
  sku: string
  currentStock: number
  predictedDemand: number
  confidence: number
  trend: 'up' | 'down' | 'stable'
  reorderPoint: number
}

export interface Report {
  id: string
  name: string
  type: string
  generatedAt: string
  status: 'Ready' | 'Processing' | 'Failed'
  size: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'critical' | 'success'
  read: boolean
  timestamp: string
}
