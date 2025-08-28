import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ChevronRight, ArrowLeft } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  path: string
}

function Breadcrumb() {
  const location = useLocation()
  const navigate = useNavigate()

  // 不显示面包屑的页面
  const hiddenPages = ['/', '/login']
  if (hiddenPages.includes(location.pathname)) {
    return null
  }

  const getBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
    const pathSegments = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = []

    const pathMap: Record<string, string> = {
      'barbers': '理发师选择',
      'packages': '套餐选择', 
      'works': '作品展示',
      'about': '关于我们',
      'dashboard': '用户控制台',
      'admin': '管理中心',
      'stores': '门店管理',
      'workstations': '工位管理',
      'finance': '费用核算',
      'advertising': '广告管理',
      'operations': '运营管理',
      'profile': '个人资料',
      'bookings': '我的预约',
      '3d-try': '3D试发型',
      'ai-consultant': 'AI客服咨询',
      'saas-tools': 'SaaS管理工具',
      'shared-workspace': '共享工位',
      'equipment': '设备维护',
      'barber': '理发师工具',
      'pricing': '价格管理',
      'chat': '客户沟通'
    }

    let currentPath = ''
    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`
      const label = pathMap[segment] || segment
      breadcrumbs.push({ label, path: currentPath })
    })

    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs(location.pathname)

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between">
          {/* 面包屑导航 - 简化版本 */}
          <nav className="flex items-center space-x-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center">
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-gray-900 font-medium">{crumb.label}</span>
                ) : (
                  <>
                    <Link
                      to={crumb.path}
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {crumb.label}
                    </Link>
                    <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
                  </>
                )}
              </div>
            ))}
          </nav>

          {/* 返回按钮 */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors px-2 py-1 rounded-md hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">返回</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Breadcrumb