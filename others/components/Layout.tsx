import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './Navbar'
import Breadcrumb from './Breadcrumb'

function Layout() {
  const location = useLocation()

  useEffect(() => {
    const getPageTitle = (pathname: string) => {
      const routes: Record<string, string> = {
        '/': '理发平台 - 为了创造更好的理发体验而生',
        '/barbers': '理发师选择 - 理发平台',
        '/packages': '套餐选择 - 理发平台',
        '/works': '作品展示 - 理发平台',
        '/about': '关于我们 - 理发平台',
        '/login': '用户登录 - 理发平台',
        '/dashboard': '用户控制台 - 理发平台',
        '/admin': '管理中心 - 理发平台',
        '/admin/stores': '门店管理 - 理发平台',
        '/admin/workstations': '工位管理 - 理发平台',
        '/admin/finance': '费用核算 - 理发平台',
        '/admin/advertising': '广告管理 - 理发平台',
        '/admin/operations': '运营管理 - 理发平台',
        '/profile': '个人资料 - 理发平台',
        '/bookings': '我的预约 - 理发平台'
      }
      
      return routes[pathname] || '理发平台 - 为了创造更好的理发体验而生'
    }

    document.title = getPageTitle(location.pathname)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Breadcrumb />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout