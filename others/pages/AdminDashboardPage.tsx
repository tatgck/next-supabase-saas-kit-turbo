import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Store, 
  MapPin, 
  DollarSign, 
  Megaphone, 
  BarChart3, 
  Users, 
  Scissors, 
  Calendar,
  TrendingUp,
  AlertCircle,
  Settings,
  Plus,
  Eye,
  Edit
} from 'lucide-react'

interface DashboardCard {
  title: string
  value: string
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  icon: React.ReactNode
}

interface MenuItem {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  path: string
  color: string
  actions: Array<{
    label: string
    icon: React.ReactNode
    action: () => void
  }>
}

function AdminDashboardPage() {
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null)
  const navigate = useNavigate()

  const dashboardCards: DashboardCard[] = [
    {
      title: '总收入',
      value: '¥128,650',
      change: '+12.5%',
      changeType: 'positive',
      icon: <DollarSign className="h-6 w-6" />
    },
    {
      title: '活跃门店',
      value: '24',
      change: '+3',
      changeType: 'positive',
      icon: <Store className="h-6 w-6" />
    },
    {
      title: '活跃理发师',
      value: '156',
      change: '+8',
      changeType: 'positive',
      icon: <Users className="h-6 w-6" />
    },
    {
      title: '今日预约',
      value: '89',
      change: '-5.2%',
      changeType: 'negative',
      icon: <Calendar className="h-6 w-6" />
    }
  ]

  const menuItems: MenuItem[] = [
    {
      id: 'stores',
      title: '门店管理',
      description: '管理所有合作门店，查看门店信息、状态和业绩',
      icon: <Store className="h-8 w-8" />,
      path: '/admin/stores',
      color: 'bg-blue-500',
      actions: [
        { label: '添加门店', icon: <Plus className="h-4 w-4" />, action: () => console.log('add store') },
        { label: '查看列表', icon: <Eye className="h-4 w-4" />, action: () => console.log('view stores') },
        { label: '数据统计', icon: <BarChart3 className="h-4 w-4" />, action: () => console.log('store stats') }
      ]
    },
    {
      id: 'workstations',
      title: '工位管理',
      description: '管理共享工位，工位分配、使用情况和收费标准',
      icon: <MapPin className="h-8 w-8" />,
      path: '/admin/workstations',
      color: 'bg-green-500',
      actions: [
        { label: '添加工位', icon: <Plus className="h-4 w-4" />, action: () => console.log('add workstation') },
        { label: '使用情况', icon: <BarChart3 className="h-4 w-4" />, action: () => console.log('workstation usage') },
        { label: '收费设置', icon: <DollarSign className="h-4 w-4" />, action: () => console.log('pricing') }
      ]
    },
    {
      id: 'finance',
      title: '费用核算',
      description: '平台财务管理，收入统计、分润计算和结算管理',
      icon: <DollarSign className="h-8 w-8" />,
      path: '/admin/finance',
      color: 'bg-yellow-500',
      actions: [
        { label: '收入统计', icon: <TrendingUp className="h-4 w-4" />, action: () => console.log('revenue') },
        { label: '分润管理', icon: <BarChart3 className="h-4 w-4" />, action: () => console.log('profit sharing') },
        { label: '结算中心', icon: <DollarSign className="h-4 w-4" />, action: () => console.log('settlement') }
      ]
    },
    {
      id: 'advertising',
      title: '广告管理',
      description: '平台广告投放、文案管理和效果分析',
      icon: <Megaphone className="h-8 w-8" />,
      path: '/admin/advertising',
      color: 'bg-purple-500',
      actions: [
        { label: '创建广告', icon: <Plus className="h-4 w-4" />, action: () => console.log('create ad') },
        { label: '文案管理', icon: <Edit className="h-4 w-4" />, action: () => console.log('ad copy') },
        { label: '效果分析', icon: <BarChart3 className="h-4 w-4" />, action: () => console.log('ad analytics') }
      ]
    },
    {
      id: 'barbers',
      title: '理发师管理',
      description: '理发师认证、作品审核和等级管理',
      icon: <Scissors className="h-8 w-8" />,
      path: '/admin/barbers',
      color: 'bg-indigo-500',
      actions: [
        { label: '认证审核', icon: <Eye className="h-4 w-4" />, action: () => console.log('verify barbers') },
        { label: '作品管理', icon: <Edit className="h-4 w-4" />, action: () => console.log('manage works') },
        { label: '等级设置', icon: <Settings className="h-4 w-4" />, action: () => console.log('level settings') }
      ]
    },
    {
      id: 'operations',
      title: '运营管理',
      description: '平台运营数据、用户管理和客服系统',
      icon: <BarChart3 className="h-8 w-8" />,
      path: '/admin/operations',
      color: 'bg-red-500',
      actions: [
        { label: '数据分析', icon: <BarChart3 className="h-4 w-4" />, action: () => console.log('analytics') },
        { label: '用户管理', icon: <Users className="h-4 w-4" />, action: () => console.log('user management') },
        { label: '客服系统', icon: <AlertCircle className="h-4 w-4" />, action: () => console.log('customer service') }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部标题栏 */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">平台管理中心</h1>
              <p className="text-lg text-gray-600 mt-1">理发平台运营管理后台</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="btn btn-secondary">
                <Settings className="h-4 w-4 mr-2" />
                系统设置
              </button>
              <button className="btn btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                快速操作
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 数据统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardCards.map((card, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <div className="text-blue-600">{card.icon}</div>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`text-sm font-medium ${
                  card.changeType === 'positive' ? 'text-green-600' : 
                  card.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {card.change}
                </span>
                <span className="text-sm text-gray-600 ml-2">较上月</span>
              </div>
            </div>
          ))}
        </div>

        {/* 现代化功能菜单 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-8 border-b border-gray-100">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">管理中心</h2>
              <p className="text-gray-600 text-lg">选择功能模块开始管理</p>
            </div>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className={`group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 border rounded-2xl p-8 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                    selectedMenu === item.id 
                      ? 'border-blue-200 shadow-xl ring-2 ring-blue-100' 
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
                  }`}
                  onClick={() => setSelectedMenu(selectedMenu === item.id ? null : item.id)}
                >
                  {/* 背景装饰 */}
                  <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 opacity-5">
                    <div className={`w-full h-full rounded-full ${item.color}`}></div>
                  </div>

                  {/* 菜单头部 */}
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className={`p-4 rounded-2xl ${item.color} shadow-lg transform transition-transform group-hover:scale-110`}>
                        <div className="text-white">{item.icon}</div>
                      </div>
                      {selectedMenu === item.id && (
                        <div className="text-blue-500 animate-pulse">
                          <Eye className="h-6 w-6" />
                        </div>
                      )}
                    </div>

                    {/* 菜单内容 */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6">{item.description}</p>

                    {/* 状态指示器 */}
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-gray-500 font-medium">系统正常</span>
                    </div>

                    {/* 快速操作按钮 */}
                    {selectedMenu === item.id && (
                      <div className="space-y-3 pt-6 border-t border-gray-100 animate-fadeIn">
                        <p className="text-sm font-semibold text-gray-800 mb-4 flex items-center">
                          <Settings className="h-4 w-4 mr-2" />
                          快速操作
                        </p>
                        <div className="space-y-2">
                          {item.actions.map((action, actionIndex) => (
                            <button
                              key={actionIndex}
                              onClick={(e) => {
                                e.stopPropagation()
                                action.action()
                              }}
                              className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-all duration-200 transform hover:translate-x-1"
                            >
                              <span className="flex items-center">
                                <div className="p-1 rounded-lg bg-gray-100 mr-3">
                                  {action.icon}
                                </div>
                                <span className="font-medium">{action.label}</span>
                              </span>
                              <svg className="ml-auto h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(item.path)
                          }}
                          className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                        >
                          进入管理页面
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 快速访问区域 */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 最近活动 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">最近活动</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">新门店"潮流理发屋"已通过认证</span>
                <span className="text-xs text-gray-400">2分钟前</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">理发师张师傅上传了新作品</span>
                <span className="text-xs text-gray-400">15分钟前</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">广告活动"春季优惠"已启动</span>
                <span className="text-xs text-gray-400">1小时前</span>
              </div>
            </div>
          </div>

          {/* 待处理事项 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">待处理事项</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <span className="text-sm text-gray-900">3个理发师认证待审核</span>
                </div>
                <button className="text-sm text-red-600 hover:text-red-700">处理</button>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm text-gray-900">5个作品审核待处理</span>
                </div>
                <button className="text-sm text-yellow-600 hover:text-yellow-700">处理</button>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-5 w-5 text-blue-500" />
                  <span className="text-sm text-gray-900">2个门店申请待审批</span>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-700">处理</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage