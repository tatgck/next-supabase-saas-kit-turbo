import { Routes, Route } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import HomePage from '@/pages/HomePage'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import BarberSelectionPage from '@/pages/BarberSelectionPage'
import PackageSelectionPage from '@/pages/PackageSelectionPage'
import BarberWorksPage from '@/pages/BarberWorksPage'
import AdminDashboardPage from '@/pages/AdminDashboardPage'
import StoreManagementPage from '@/pages/StoreManagementPage'
import WorkstationManagementPage from '@/pages/WorkstationManagementPage'
import FinanceManagementPage from '@/pages/FinanceManagementPage'
import AdvertisingManagementPage from '@/pages/AdvertisingManagementPage'
import OperationsManagementPage from '@/pages/OperationsManagementPage'
import Layout from '@/components/Layout'

// 临时页面组件
const AboutPage = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-6">关于我们</h1>
    <p className="text-gray-600">关于理发平台的详细信息...</p>
  </div>
)

const BookingPage = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-6">在线预约</h1>
    <p className="text-gray-600">预约系统正在开发中...</p>
  </div>
)

const Try3DPage = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-6">3D试发型</h1>
    <p className="text-gray-600">3D试发型功能正在开发中...</p>
  </div>
)

const AIConsultantPage = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-6">AI客服咨询</h1>
    <p className="text-gray-600">AI客服系统正在开发中...</p>
  </div>
)

const SaasToolsPage = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-6">SaaS管理工具</h1>
    <p className="text-gray-600">SaaS管理工具正在开发中...</p>
  </div>
)

const SharedWorkspacePage = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-6">共享工位</h1>
    <p className="text-gray-600">共享工位管理系统正在开发中...</p>
  </div>
)

const ProfilePage = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-6">个人资料</h1>
    <p className="text-gray-600">个人资料管理正在开发中...</p>
  </div>
)

const BookingsPage = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-6">我的预约</h1>
    <p className="text-gray-600">预约记录管理正在开发中...</p>
  </div>
)

function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        
        {/* 公共页面 */}
        <Route path="/barbers" element={<BarberSelectionPage />} />
        <Route path="/packages" element={<PackageSelectionPage />} />
        <Route path="/works" element={<BarberWorksPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/3d-try" element={<Try3DPage />} />
        <Route path="/ai-consultant" element={<AIConsultantPage />} />
        <Route path="/saas-tools" element={<SaasToolsPage />} />
        <Route path="/shared-workspace" element={<SharedWorkspacePage />} />
        
        {/* 需要认证的页面 */}
        {isAuthenticated && (
          <>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            
            {/* 管理员页面 */}
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/stores" element={<StoreManagementPage />} />
            <Route path="/admin/workstations" element={<WorkstationManagementPage />} />
            <Route path="/admin/finance" element={<FinanceManagementPage />} />
            <Route path="/admin/advertising" element={<AdvertisingManagementPage />} />
            <Route path="/admin/operations" element={<OperationsManagementPage />} />
          </>
        )}
      </Route>
    </Routes>
  )
}

export default App