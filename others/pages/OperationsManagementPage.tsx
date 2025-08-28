import { useState } from 'react'
import { 
  Users, 
  TrendingUp, 
  MessageSquare, 
  Star, 
  CheckCircle,
  Clock,
  Phone,
  Mail,
  Calendar,
  Search,
  Download,
  RefreshCw,
  UserCheck,
  UserX,
  Bell,
  Target,
  Activity
} from 'lucide-react'

interface UserData {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  status: 'active' | 'inactive' | 'banned'
  role: 'customer' | 'barber' | 'store_owner'
  registrationDate: string
  lastActive: string
  totalBookings: number
  totalSpent: number
  averageRating: number
  reviewCount: number
}

interface CustomerService {
  id: string
  type: 'complaint' | 'inquiry' | 'suggestion' | 'technical'
  subject: string
  content: string
  user: string
  userEmail: string
  status: 'pending' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignedTo?: string
  createdAt: string
  updatedAt: string
  tags: string[]
}

interface SystemMetrics {
  activeUsers: number
  newUsers: number
  totalBookings: number
  completedBookings: number
  averageRating: number
  customerSatisfaction: number
  responseTime: number
  systemUptime: number
}

const mockUsers: UserData[] = [
  {
    id: '1',
    name: '张小明',
    email: 'zhang@example.com',
    phone: '13800138001',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    status: 'active',
    role: 'customer',
    registrationDate: '2024-01-15',
    lastActive: '2024-01-20 14:30',
    totalBookings: 12,
    totalSpent: 1680,
    averageRating: 4.8,
    reviewCount: 8
  },
  {
    id: '2',
    name: '李师傅',
    email: 'li@example.com',
    phone: '13800138002',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    status: 'active',
    role: 'barber',
    registrationDate: '2023-12-10',
    lastActive: '2024-01-20 16:45',
    totalBookings: 156,
    totalSpent: 0,
    averageRating: 4.9,
    reviewCount: 89
  },
  {
    id: '3',
    name: '王老板',
    email: 'wang@example.com',
    phone: '13800138003',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    status: 'active',
    role: 'store_owner',
    registrationDate: '2023-11-05',
    lastActive: '2024-01-20 10:20',
    totalBookings: 0,
    totalSpent: 0,
    averageRating: 4.7,
    reviewCount: 24
  }
]

const mockTickets: CustomerService[] = [
  {
    id: '1',
    type: 'complaint',
    subject: '服务质量问题投诉',
    content: '理发师技术不够专业，剪发效果不满意，希望能够重新安排或退款。',
    user: '张小明',
    userEmail: 'zhang@example.com',
    status: 'pending',
    priority: 'high',
    createdAt: '2024-01-20 09:30',
    updatedAt: '2024-01-20 09:30',
    tags: ['服务质量', '退款']
  },
  {
    id: '2',
    type: 'inquiry',
    subject: '预约时间咨询',
    content: '请问春节期间门店是否正常营业？可以预约2月份的服务吗？',
    user: '刘女士',
    userEmail: 'liu@example.com',
    status: 'resolved',
    priority: 'medium',
    assignedTo: '客服小李',
    createdAt: '2024-01-19 15:20',
    updatedAt: '2024-01-19 16:45',
    tags: ['预约', '营业时间']
  },
  {
    id: '3',
    type: 'technical',
    subject: 'APP无法正常登录',
    content: '使用微信登录时一直显示网络错误，请帮助解决。',
    user: '陈先生',
    userEmail: 'chen@example.com',
    status: 'in_progress',
    priority: 'urgent',
    assignedTo: '技术小王',
    createdAt: '2024-01-20 11:15',
    updatedAt: '2024-01-20 12:30',
    tags: ['技术问题', '登录']
  }
]

const systemMetrics: SystemMetrics = {
  activeUsers: 1248,
  newUsers: 156,
  totalBookings: 2567,
  completedBookings: 2340,
  averageRating: 4.6,
  customerSatisfaction: 92.3,
  responseTime: 2.4,
  systemUptime: 99.8
}

function OperationsManagementPage() {
  const [users] = useState<UserData[]>(mockUsers)
  const [tickets] = useState<CustomerService[]>(mockTickets)
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  const [selectedTicket, setSelectedTicket] = useState<CustomerService | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'tickets'>('overview')
  const [userFilter, setUserFilter] = useState<'all' | 'active' | 'inactive' | 'banned'>('all')
  const [roleFilter, setRoleFilter] = useState<'all' | 'customer' | 'barber' | 'store_owner'>('all')
  const [ticketFilter, setTicketFilter] = useState<'all' | 'pending' | 'in_progress' | 'resolved' | 'closed'>('all')
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high' | 'urgent'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredUsers = users.filter(user => {
    const matchesStatus = userFilter === 'all' || user.status === userFilter
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.includes(searchTerm)
    return matchesStatus && matchesRole && matchesSearch
  })

  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = ticketFilter === 'all' || ticket.status === ticketFilter
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.user.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesPriority && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'banned': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />
      case 'inactive': return <Clock className="h-4 w-4" />
      case 'banned': return <UserX className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      case 'in_progress': return <RefreshCw className="h-4 w-4" />
      case 'resolved': return <CheckCircle className="h-4 w-4" />
      case 'closed': return <UserX className="h-4 w-4" />
      default: return null
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-800'
      case 'medium': return 'bg-blue-100 text-blue-800'
      case 'high': return 'bg-yellow-100 text-yellow-800'
      case 'urgent': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'customer': return '顾客'
      case 'barber': return '理发师'
      case 'store_owner': return '店主'
      default: return '未知'
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'complaint': return '投诉'
      case 'inquiry': return '咨询'
      case 'suggestion': return '建议'
      case 'technical': return '技术问题'
      default: return '其他'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面头部 */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">运营管理</h1>
              <p className="text-lg text-gray-600 mt-1">平台运营数据、用户管理和客服系统</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="btn btn-secondary">
                <Download className="h-4 w-4 mr-2" />
                导出数据
              </button>
              <button className="btn btn-primary">
                <Bell className="h-4 w-4 mr-2" />
                系统通知
              </button>
            </div>
          </div>
          
          {/* 标签切换 */}
          <div className="mt-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                数据概览
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                用户管理
              </button>
              <button
                onClick={() => setActiveTab('tickets')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'tickets'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                客服工单
              </button>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <>
            {/* 系统指标 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">活跃用户</p>
                    <p className="text-2xl font-bold text-blue-600">{systemMetrics.activeUsers.toLocaleString()}</p>
                    <p className="text-sm text-green-600 mt-1">+{systemMetrics.newUsers} 新用户</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">总预约数</p>
                    <p className="text-2xl font-bold text-green-600">{systemMetrics.totalBookings.toLocaleString()}</p>
                    <p className="text-sm text-gray-600 mt-1">{systemMetrics.completedBookings} 已完成</p>
                  </div>
                  <Calendar className="h-8 w-8 text-green-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">平均评分</p>
                    <p className="text-2xl font-bold text-yellow-600">{systemMetrics.averageRating}</p>
                    <p className="text-sm text-gray-600 mt-1">满意度 {systemMetrics.customerSatisfaction}%</p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">系统稳定性</p>
                    <p className="text-2xl font-bold text-purple-600">{systemMetrics.systemUptime}%</p>
                    <p className="text-sm text-gray-600 mt-1">响应时间 {systemMetrics.responseTime}s</p>
                  </div>
                  <Activity className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </div>

            {/* 趋势图表和实时数据 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">用户增长趋势</h3>
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">本周新增用户</span>
                    <span className="text-lg font-bold text-blue-600">+{systemMetrics.newUsers}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">用户留存率</span>
                    <span className="text-lg font-bold text-green-600">87.5%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">活跃用户比例</span>
                    <span className="text-lg font-bold text-purple-600">68.2%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">服务质量监控</h3>
                  <Target className="h-5 w-5 text-blue-500" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">客户满意度</span>
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: `${systemMetrics.customerSatisfaction}%` }}></div>
                      </div>
                      <span className="text-sm font-medium">{systemMetrics.customerSatisfaction}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">服务完成率</span>
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(systemMetrics.completedBookings / systemMetrics.totalBookings) * 100}%` }}></div>
                      </div>
                      <span className="text-sm font-medium">{((systemMetrics.completedBookings / systemMetrics.totalBookings) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">系统稳定性</span>
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${systemMetrics.systemUptime}%` }}></div>
                      </div>
                      <span className="text-sm font-medium">{systemMetrics.systemUptime}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'users' && (
          <>
            {/* 用户筛选 */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1 max-w-lg">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="搜索用户姓名、邮箱或手机号..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <select
                    value={userFilter}
                    onChange={(e) => setUserFilter(e.target.value as any)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="all">全部状态</option>
                    <option value="active">活跃</option>
                    <option value="inactive">不活跃</option>
                    <option value="banned">已封禁</option>
                  </select>
                  
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value as any)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="all">全部角色</option>
                    <option value="customer">顾客</option>
                    <option value="barber">理发师</option>
                    <option value="store_owner">店主</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 用户列表 */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">用户信息</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">角色</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">活动数据</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">评分</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full mr-4" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                              <div className="text-xs text-gray-400">{user.phone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {getRoleText(user.role)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                            {getStatusIcon(user.status)}
                            <span className="ml-1 capitalize">{user.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div>预约: {user.totalBookings}次</div>
                          <div>消费: ¥{user.totalSpent.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">最后活跃: {user.lastActive}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                            <span className="text-sm font-medium">{user.averageRating}</span>
                            <span className="text-sm text-gray-500 ml-1">({user.reviewCount})</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => setSelectedUser(user)}
                              className="text-blue-600 hover:text-blue-900 text-sm"
                            >
                              查看
                            </button>
                            <button className="text-gray-600 hover:text-gray-900 text-sm">
                              编辑
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'tickets' && (
          <>
            {/* 工单筛选 */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1 max-w-lg">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="搜索工单标题、内容或用户..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <select
                    value={ticketFilter}
                    onChange={(e) => setTicketFilter(e.target.value as any)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="all">全部状态</option>
                    <option value="pending">待处理</option>
                    <option value="in_progress">处理中</option>
                    <option value="resolved">已解决</option>
                    <option value="closed">已关闭</option>
                  </select>
                  
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value as any)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="all">全部优先级</option>
                    <option value="low">低</option>
                    <option value="medium">中</option>
                    <option value="high">高</option>
                    <option value="urgent">紧急</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 工单列表 */}
            <div className="space-y-4">
              {filteredTickets.map((ticket) => (
                <div key={ticket.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{ticket.subject}</h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                          {getStatusIcon(ticket.status)}
                          <span className="ml-1 capitalize">{ticket.status}</span>
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{ticket.content}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {ticket.user}
                        </span>
                        <span className="flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          {ticket.userEmail}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {ticket.createdAt}
                        </span>
                        {ticket.assignedTo && (
                          <span className="flex items-center">
                            <UserCheck className="h-4 w-4 mr-1" />
                            {ticket.assignedTo}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button 
                        onClick={() => setSelectedTicket(ticket)}
                        className="btn btn-sm btn-secondary"
                      >
                        查看详情
                      </button>
                      <button className="btn btn-sm btn-primary">
                        处理
                      </button>
                    </div>
                  </div>
                  
                  {ticket.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {ticket.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {filteredUsers.length === 0 && activeTab === 'users' && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">没有找到符合条件的用户</p>
          </div>
        )}

        {filteredTickets.length === 0 && activeTab === 'tickets' && (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">没有找到符合条件的工单</p>
          </div>
        )}
      </div>

      {/* 用户详情模态框 */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">用户详情</h3>
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <img src={selectedUser.avatar} alt={selectedUser.name} className="w-16 h-16 rounded-full" />
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">{selectedUser.name}</h4>
                  <p className="text-gray-600">{getRoleText(selectedUser.role)}</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedUser.status)}`}>
                    {getStatusIcon(selectedUser.status)}
                    <span className="ml-1 capitalize">{selectedUser.status}</span>
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-3">联系信息</h5>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      {selectedUser.email}
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      {selectedUser.phone}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-3">活动数据</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">总预约:</span>
                      <span className="font-medium">{selectedUser.totalBookings}次</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">总消费:</span>
                      <span className="font-medium">¥{selectedUser.totalSpent.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">平均评分:</span>
                      <span className="font-medium flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        {selectedUser.averageRating}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-3">时间信息</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">注册时间:</span>
                      <span className="font-medium">{selectedUser.registrationDate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">最后活跃:</span>
                      <span className="font-medium">{selectedUser.lastActive}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-3">评价信息</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">评价数量:</span>
                      <span className="font-medium">{selectedUser.reviewCount}条</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">好评率:</span>
                      <span className="font-medium">95.2%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 工单详情模态框 */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">工单详情</h3>
                <button 
                  onClick={() => setSelectedTicket(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <h4 className="text-xl font-semibold text-gray-900">{selectedTicket.subject}</h4>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTicket.status)}`}>
                    {getStatusIcon(selectedTicket.status)}
                    <span className="ml-1 capitalize">{selectedTicket.status}</span>
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedTicket.priority)}`}>
                    {selectedTicket.priority}
                  </span>
                </div>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedTicket.content}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-3">用户信息</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">用户:</span>
                      <span className="font-medium">{selectedTicket.user}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">邮箱:</span>
                      <span className="font-medium">{selectedTicket.userEmail}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">类型:</span>
                      <span className="font-medium">{getTypeText(selectedTicket.type)}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-3">处理信息</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">创建时间:</span>
                      <span className="font-medium">{selectedTicket.createdAt}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">更新时间:</span>
                      <span className="font-medium">{selectedTicket.updatedAt}</span>
                    </div>
                    {selectedTicket.assignedTo && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">处理人:</span>
                        <span className="font-medium">{selectedTicket.assignedTo}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {selectedTicket.tags.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-3">标签</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedTicket.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OperationsManagementPage