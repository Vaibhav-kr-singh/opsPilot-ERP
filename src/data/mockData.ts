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
} from './types'

export const inventoryItems: InventoryItem[] = [
  { id: '1', code: 'ST-BOLT-M12', name: 'Stainless Steel Bolt M12', category: 'Hardware', warehouse: 'Main Hub', stock: 4200, minStock: 500, maxStock: 8000, unitCost: 2.4, status: 'In Stock' },
  { id: '2', code: 'CP-WIR-500', name: 'Copper Wire 500m Roll', category: 'Electrical', warehouse: 'Main Hub', stock: 890, minStock: 200, maxStock: 2000, unitCost: 45.0, status: 'In Stock' },
  { id: '3', code: 'EL-MOT-25HP', name: 'Electric Motor 25HP', category: 'Motors', warehouse: 'Remote 1', stock: 42, minStock: 20, maxStock: 100, unitCost: 1250.0, status: 'Low Stock' },
  { id: '4', code: 'BR-6204-Z', name: 'Ball Bearing 6204-Z', category: 'Hardware', warehouse: 'Main Hub', stock: 0, minStock: 100, maxStock: 5000, unitCost: 8.5, status: 'Out of Stock' },
  { id: '5', code: 'PL-ALY-304', name: 'Alloy Plate 304 SS', category: 'Raw Materials', warehouse: 'Remote 1', stock: 156, minStock: 50, maxStock: 500, unitCost: 320.0, status: 'In Stock' },
  { id: '6', code: 'NV-500-PROC', name: 'NV-500 Processors', category: 'Electronics', warehouse: 'Main Hub', stock: 12, minStock: 50, maxStock: 200, unitCost: 890.0, status: 'Critical' },
  { id: '7', code: 'SSD-1TB-NVME', name: 'SSD 1TB NVMe', category: 'Electronics', warehouse: 'Remote 1', stock: 28, minStock: 40, maxStock: 150, unitCost: 95.0, status: 'Low Stock' },
  { id: '8', code: 'TN-HP-410A', name: 'Toner HP 410A', category: 'Consumables', warehouse: 'Main Hub', stock: 65, minStock: 30, maxStock: 200, unitCost: 78.0, status: 'In Stock' },
  { id: '9', code: 'FB-CBL-100M', name: 'Fiber Cable 100m', category: 'Electrical', warehouse: 'Remote 1', stock: 8, minStock: 15, maxStock: 80, unitCost: 210.0, status: 'Low Stock' },
  { id: '10', code: 'GR-CON-500', name: 'Graphene Conductors', category: 'Advanced', warehouse: 'Main Hub', stock: 200, minStock: 50, maxStock: 400, unitCost: 45.0, status: 'In Stock' },
]

export const purchaseOrders: PurchaseOrder[] = [
  { id: '1', poNumber: 'PO-5501', supplier: 'Global Logistics Inc.', item: 'Semiconductors', quantity: 420, unitPrice: 200.48, orderDate: '2026-01-05', deliveryDate: '2026-01-20', status: 'Shipped' },
  { id: '2', poNumber: 'PO-5502', supplier: 'Vertex Microchips', item: 'Controllers', quantity: 1200, unitPrice: 10.38, orderDate: '2026-01-08', deliveryDate: '2026-01-25', status: 'Processing' },
  { id: '3', poNumber: 'PO-5503', supplier: 'Precision Dynamics', item: 'Alloy Plates', quantity: 80, unitPrice: 1950.0, orderDate: '2026-01-02', deliveryDate: '2026-01-15', status: 'Delayed' },
  { id: '4', poNumber: 'PO-5504', supplier: 'ChemSupply Co.', item: 'Industrial Lubricant', quantity: 500, unitPrice: 12.5, orderDate: '2026-01-10', deliveryDate: '2026-01-18', status: 'In Transit' },
  { id: '5', poNumber: 'PO-5505', supplier: 'Apex Tooling', item: 'Ball Bearings', quantity: 2000, unitPrice: 8.5, orderDate: '2026-01-12', deliveryDate: '2026-01-28', status: 'Pending' },
  { id: '6', poNumber: 'PO-88219-X', supplier: 'Global Logistics Inc.', item: 'Semiconductors (420)', quantity: 420, unitPrice: 200.48, orderDate: '2026-01-14', deliveryDate: '2026-01-22', status: 'Shipped' },
  { id: '7', poNumber: 'PO-88220-Y', supplier: 'Vertex Microchips', item: 'Controllers (1,200)', quantity: 1200, unitPrice: 10.38, orderDate: '2026-01-15', deliveryDate: '2026-01-26', status: 'Processing' },
  { id: '8', poNumber: 'PO-88221-Z', supplier: 'Precision Dynamics', item: 'Alloy Plates (80)', quantity: 80, unitPrice: 1950.0, orderDate: '2026-01-11', deliveryDate: '2026-01-19', status: 'Delayed' },
]

export const procurementRequests: ProcurementRequest[] = [
  { id: '1', prNumber: 'PR-9021', requestedBy: 'Sarah Chen', department: 'Production', supplier: 'Global Ironworks', requestDate: '2026-01-14', neededBy: '2026-01-28', status: 'Approved', value: 45000 },
  { id: '2', prNumber: 'PR-9018', requestedBy: 'Mike Torres', department: 'Maintenance', supplier: 'Precision Dynamics', requestDate: '2026-01-13', neededBy: '2026-01-25', status: 'Pending', value: 12800 },
  { id: '3', prNumber: 'PR-9012', requestedBy: 'Lisa Park', department: 'Warehouse', supplier: 'ChemSupply Co.', requestDate: '2026-01-12', neededBy: '2026-01-22', status: 'Approved', value: 6200 },
  { id: '4', prNumber: 'PR-8945', requestedBy: 'James Wilson', department: 'Engineering', supplier: 'Apex Tooling', requestDate: '2026-01-10', neededBy: '2026-01-20', status: 'Processing', value: 28500 },
]

export const suppliers: Supplier[] = [
  { id: '1', name: 'Global Ironworks', contact: 'John Smith', category: 'Raw Materials', leadTime: 5, rating: 4.8, lastDelivery: '2026-01-12', activeOrders: 12, status: 'Active' },
  { id: '2', name: 'Precision Dynamics', contact: 'Emma Davis', category: 'Components', leadTime: 3, rating: 4.6, lastDelivery: '2026-01-14', activeOrders: 8, status: 'Active' },
  { id: '3', name: 'ChemSupply Co.', contact: 'Robert Lee', category: 'Chemicals', leadTime: 7, rating: 4.2, lastDelivery: '2026-01-08', activeOrders: 5, status: 'Active' },
  { id: '4', name: 'Apex Tooling', contact: 'Anna Kowalski', category: 'Tools', leadTime: 4, rating: 4.9, lastDelivery: '2026-01-15', activeOrders: 15, status: 'Active' },
  { id: '5', name: 'Global Logistics Inc.', contact: 'David Kim', category: 'Electronics', leadTime: 6, rating: 4.5, lastDelivery: '2026-01-13', activeOrders: 10, status: 'Active' },
  { id: '6', name: 'Vertex Microchips', contact: 'Sophie Martin', category: 'Electronics', leadTime: 8, rating: 4.7, lastDelivery: '2026-01-11', activeOrders: 6, status: 'Active' },
]

export const salesOrders: SalesOrder[] = [
  { id: '1', orderNumber: 'ORD-2024-8841', customer: 'Acme Manufacturing', product: 'Electric Motor 25HP', quantity: 12, value: 15000, orderDate: '2026-01-15', status: 'Shipped' },
  { id: '2', orderNumber: 'ORD-2024-8842', customer: 'TechFlow Industries', product: 'Control Panel Unit', quantity: 8, value: 22400, orderDate: '2026-01-14', status: 'Processing' },
  { id: '3', orderNumber: 'ORD-2024-8843', customer: 'BuildRight Corp', product: 'Copper Wire 500m', quantity: 50, value: 2250, orderDate: '2026-01-13', status: 'Completed' },
  { id: '4', orderNumber: 'ORD-2024-8844', customer: 'Global Steel Ltd', product: 'Alloy Plate 304 SS', quantity: 25, value: 8000, orderDate: '2026-01-12', status: 'Processing' },
]

export const stockAlerts: StockAlert[] = [
  { id: '1', item: 'NV-500 Processors', sku: 'NV-500-PROC', warehouse: 'Main Hub', currentStock: 12, minStock: 50, alertLevel: 'Critical', recommendedAction: 'Rush PO' },
  { id: '2', item: 'SSD 1TB NVMe', sku: 'SSD-1TB-NVME', warehouse: 'Remote 1', currentStock: 28, minStock: 40, alertLevel: 'High', recommendedAction: 'Review Quote' },
  { id: '3', item: 'Toner HP 410A', sku: 'TN-HP-410A', warehouse: 'Main Hub', currentStock: 65, minStock: 30, alertLevel: 'Medium', recommendedAction: 'Schedule Reorder' },
  { id: '4', item: 'Fiber Cable 100m', sku: 'FB-CBL-100M', warehouse: 'Remote 1', currentStock: 8, minStock: 15, alertLevel: 'Low', recommendedAction: 'Monitor' },
  { id: '5', item: 'Ball Bearing 6204-Z', sku: 'BR-6204-Z', warehouse: 'Main Hub', currentStock: 0, minStock: 100, alertLevel: 'Critical', recommendedAction: 'Emergency PO' },
]

export const purchaseRecommendations: PurchaseRecommendation[] = [
  { id: '1', product: 'Steel Beam I-200', stockStatus: 'Below Safety', forecastedDemand: 450, supplier: 'Global Ironworks', leadTime: 5, recommendedQty: 500, estimatedCost: 87500, urgency: 'Critical' },
  { id: '2', product: 'Ball Bearings 6204-Z', stockStatus: 'Out of Stock', forecastedDemand: 2000, supplier: 'Apex Tooling', leadTime: 4, recommendedQty: 2500, estimatedCost: 21250, urgency: 'Critical' },
  { id: '3', product: 'Industrial Lubricant', stockStatus: 'Low Stock', forecastedDemand: 300, supplier: 'ChemSupply Co.', leadTime: 7, recommendedQty: 400, estimatedCost: 5000, urgency: 'High' },
  { id: '4', product: 'Tungsten Carbide Tips', stockStatus: 'Adequate', forecastedDemand: 120, supplier: 'Precision Dynamics', leadTime: 3, recommendedQty: 150, estimatedCost: 18000, urgency: 'Medium' },
]

export const forecastItems: ForecastItem[] = [
  { id: '1', product: 'Precision Hex-Valve', sku: 'PHV-200', currentStock: 340, predictedDemand: 420, confidence: 96, trend: 'up', reorderPoint: 200 },
  { id: '2', product: 'Neural Logic Core', sku: 'NLC-900', currentStock: 85, predictedDemand: 120, confidence: 92, trend: 'up', reorderPoint: 60 },
  { id: '3', product: 'Carbon Polymer Sheet', sku: 'CPS-450', currentStock: 1200, predictedDemand: 980, confidence: 88, trend: 'down', reorderPoint: 500 },
  { id: '4', product: 'Graphene Conductors', sku: 'GR-CON-500', currentStock: 200, predictedDemand: 280, confidence: 94, trend: 'up', reorderPoint: 150 },
]

export const reports: Report[] = [
  { id: '1', name: 'Q4 Inventory Valuation', type: 'Inventory', generatedAt: '2026-01-14 09:30', status: 'Ready', size: '2.4 MB' },
  { id: '2', name: 'North Hub Sales Export', type: 'Sales', generatedAt: '2026-01-13 16:45', status: 'Ready', size: '1.1 MB' },
  { id: '3', name: 'Predictive Demand Forecast', type: 'Analytics', generatedAt: '2026-01-15 08:00', status: 'Processing', size: '-' },
  { id: '4', name: 'Emergency Stock Audit', type: 'Stock Alert', generatedAt: '2026-01-12 11:20', status: 'Ready', size: '856 KB' },
]

export const initialNotifications: Notification[] = [
  { id: '1', title: 'Critical Stock Alert', message: 'NV-500 Processors below minimum threshold', type: 'critical', read: false, timestamp: '2 min ago' },
  { id: '2', title: 'PO Approved', message: 'PO-5502 approved by manager', type: 'success', read: false, timestamp: '15 min ago' },
  { id: '3', title: 'Delivery Delayed', message: 'PO-88221-Z delayed by 3 days', type: 'warning', read: true, timestamp: '1 hr ago' },
  { id: '4', title: 'Forecast Updated', message: 'AI demand model recalculated with 94.2% confidence', type: 'info', read: true, timestamp: '3 hr ago' },
]

export const warehouses = ['All Warehouses', 'Main Hub', 'Remote 1', 'EU Hub', 'APAC Hub']

export function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}k`
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function calcInventoryValue(items: InventoryItem[]): number {
  return items.reduce((sum, item) => sum + item.stock * item.unitCost, 0)
}

export function countByStatus(items: InventoryItem[], statuses: string[]): number {
  return items.filter((i) => statuses.includes(i.status)).length
}
