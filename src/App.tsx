import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { AppShell } from './components/layout/AppShell'
import { AppProvider } from './context/AppContext'
import { AuthProvider } from './context/AuthContext'
import DashboardHome from './pages/DashboardHome'
import InventoryManagement from './pages/InventoryManagement'
import ProcurementTracking from './pages/ProcurementTracking'
import PurchaseOrders from './pages/PurchaseOrders'
import SupplierDirectory from './pages/SupplierDirectory'
import SalesPerformance from './pages/SalesPerformance'
import ProductionWarehouseHealth from './pages/ProductionWarehouseHealth'
import WarehouseView from './pages/WarehouseView'
import AIDemandForecasting from './pages/AIDemandForecasting'
import PurchaseRecommendations from './pages/PurchaseRecommendations'
import StockAlerts from './pages/StockAlerts'
import AdvancedAnalytics from './pages/AdvancedAnalytics'
import ReportCenter from './pages/ReportCenter'
import Settings from './pages/Settings'
import Login from './pages/Login'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<AppShell />}>
                <Route index element={<DashboardHome />} />
                <Route path="inventory" element={<InventoryManagement />} />
                <Route path="procurement" element={<ProcurementTracking />} />
                <Route path="purchasing" element={<PurchaseOrders />} />
                <Route path="suppliers" element={<SupplierDirectory />} />
                <Route path="sales" element={<SalesPerformance />} />
                <Route path="production" element={<ProductionWarehouseHealth />} />
                <Route path="warehouse" element={<WarehouseView />} />
                <Route path="demand-forecasting" element={<AIDemandForecasting />} />
                <Route path="purchase-recommendations" element={<PurchaseRecommendations />} />
                <Route path="stock-alerts" element={<StockAlerts />} />
                <Route path="analytics" element={<AdvancedAnalytics />} />
                <Route path="reports" element={<ReportCenter />} />
                <Route path="settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Route>
          </Routes>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
