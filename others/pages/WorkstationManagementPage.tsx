import { useState } from 'react'
import { 
  MapPin, 
  DollarSign, 
  Clock, 
  User, 
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  BarChart3,
  Settings
} from 'lucide-react'

interface Workstation {
  id: string
  number: string
  storeId: string
  storeName: string
  type: 'standard' | 'premium' | 'vip'
  status: 'available' | 'occupied' | 'maintenance' | 'reserved'
  currentBarber?: string
  hourlyRate: number
  dailyRate: number
  equipment: string[]
  bookings: number
  revenue: number
  utilization: number
  lastUsed: string
  nextBooking?: string
}

const mockWorkstations: Workstation[] = [
  {
    id: '1',
    number: 'A001',
    storeId: '1',
    storeName: '潮流理发屋',
    type: 'premium',
    status: 'occupied',
    currentBarber: '张师傅',
    hourlyRate: 80,
    dailyRate: 600,
    equipment: ['专业理发椅', '吹风机', '电推剪', '造型工具'],
    bookings: 24,
    revenue: 14400,
    utilization: 85,
    lastUsed: '2024-01-20 14:30',
    nextBooking: '2024-01-20 16:00'
  },
  {
    id: '2',
    number: 'A002',
    storeId: '1',
    storeName: '潮流理发屋',
    type: 'standard',
    status: 'available',
    hourlyRate: 60,
    dailyRate: 450,
    equipment: ['理发椅', '吹风机', '电推剪'],
    bookings: 18,
    revenue: 8100,
    utilization: 65,
    lastUsed: '2024-01-20 12:00'
  },
  {
    id: '3',
    number: 'B001',
    storeId: '2',
    storeName: '经典理发店',
    type: 'vip',
    status: 'reserved',
    hourlyRate: 120,
    dailyRate: 900,
    equipment: ['豪华理发椅', '专业吹风机', '高端造型工具', '按摩设备'],
    bookings: 32,
    revenue: 28800,
    utilization: 92,
    lastUsed: '2024-01-20 13:45',
    nextBooking: '2024-01-20 15:30'
  },
  {
    id: '4',
    number: 'B002',
    storeId: '2',
    storeName: '经典理发店',
    type: 'standard',
    status: 'maintenance',
    hourlyRate: 60,
    dailyRate: 450,
    equipment: ['理发椅', '吹风机'],
    bookings: 0,
    revenue: 0,
    utilization: 0,
    lastUsed: '2024-01-18 16:00'
  }
]

function WorkstationManagementPage() {
  const [workstations] = useState<Workstation[]>(mockWorkstations)
  const [selectedWorkstation, setSelectedWorkstation] = useState<Workstation | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'occupied' | 'maintenance' | 'reserved'>('all')
  const [filterType, setFilterType] = useState<'all' | 'standard' | 'premium' | 'vip'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredWorkstations = workstations.filter(ws => {
    const matchesStatus = filterStatus === 'all' || ws.status === filterStatus
    const matchesType = filterType === 'all' || ws.type === filterType
    const matchesSearch = ws.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ws.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (ws.currentBarber && ws.currentBarber.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesStatus && matchesType && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'occupied': return 'bg-blue-100 text-blue-800'
      case 'reserved': return 'bg-yellow-100 text-yellow-800'
      case 'maintenance': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="h-4 w-4" />
      case 'occupied': return <User className="h-4 w-4" />
      case 'reserved': return <Clock className="h-4 w-4" />
      case 'maintenance': return <AlertCircle className="h-4 w-4" />
      default: return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return '空闲'
      case 'occupied': return '使用中'
      case 'reserved': return '已预约'
      case 'maintenance': return '维护中'
      default: return '未知'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'standard': return 'bg-gray-100 text-gray-800'
      case 'premium': return 'bg-blue-100 text-blue-800'
      case 'vip': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'standard': return '标准'
      case 'premium': return '高级'
      case 'vip': return 'VIP'
      default: return '未知'
    }
  }

  const totalWorkstations = workstations.length
  const availableCount = workstations.filter(ws => ws.status === 'available').length
  const occupiedCount = workstations.filter(ws => ws.status === 'occupied').length
  const totalRevenue = workstations.reduce((sum, ws) => sum + ws.revenue, 0)
  const avgUtilization = workstations.reduce((sum, ws) => sum + ws.utilization, 0) / totalWorkstations

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面头部 */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">工位管理</h1>
              <p className="text-lg text-gray-600 mt-1">管理共享工位信息和使用情况</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="btn btn-secondary">
                <BarChart3 className="h-4 w-4 mr-2" />
                使用统计
              </button>
              <button className="btn btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                添加工位
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">总工位数</p>
                <p className="text-2xl font-bold text-gray-900">{totalWorkstations}</p>
              </div>
              <MapPin className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">空闲工位</p>
                <p className="text-2xl font-bold text-green-600">{availableCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">使用中</p>
                <p className="text-2xl font-bold text-blue-600">{occupiedCount}</p>
              </div>
              <User className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">总收入</p>
                <p className="text-2xl font-bold text-yellow-600">¥{totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">平均利用率</p>
                <p className="text-2xl font-bold text-purple-600">{avgUtilization.toFixed(1)}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* 搜索和筛选 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索工位号、门店或理发师..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">全部状态</option>
                  <option value="available">空闲</option>
                  <option value="occupied">使用中</option>
                  <option value="reserved">已预约</option>
                  <option value="maintenance">维护中</option>
                </select>
              </div>
              
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">全部类型</option>
                <option value="standard">标准</option>
                <option value="premium">高级</option>
                <option value="vip">VIP</option>
              </select>
              
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                >
                  <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                    <div className="bg-current"></div>
                    <div className="bg-current"></div>
                    <div className="bg-current"></div>
                    <div className="bg-current"></div>
                  </div>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                >
                  <div className="w-4 h-4 flex flex-col gap-1">
                    <div className="h-0.5 bg-current"></div>
                    <div className="h-0.5 bg-current"></div>
                    <div className="h-0.5 bg-current"></div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 工位列表 */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredWorkstations.map((workstation) => (
              <div key={workstation.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                {/* 工位头部信息 */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">工位 {workstation.number}</h3>
                    <p className="text-sm text-gray-600">{workstation.storeName}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(workstation.type)}`}>
                      {getTypeText(workstation.type)}
                    </span>
                  </div>
                </div>

                {/* 状态和当前使用者 */}
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(workstation.status)}`}>
                      {getStatusIcon(workstation.status)}
                      <span className="ml-1">{getStatusText(workstation.status)}</span>
                    </span>
                  </div>
                  {workstation.currentBarber && (
                    <p className="text-sm text-gray-600">当前理发师: {workstation.currentBarber}</p>
                  )}
                </div>

                {/* 价格信息 */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">小时费率</p>
                    <p className="text-lg font-semibold text-gray-900">¥{workstation.hourlyRate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">日费率</p>
                    <p className="text-lg font-semibold text-gray-900">¥{workstation.dailyRate}</p>
                  </div>
                </div>

                {/* 使用统计 */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>利用率</span>
                    <span>{workstation.utilization}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${workstation.utilization}%` }}
                    ></div>
                  </div>
                </div>

                {/* 预约信息 */}
                {workstation.nextBooking && (
                  <div className="mb-4 p-2 bg-yellow-50 rounded-lg">
                    <div className="flex items-center text-sm text-yellow-800">
                      <Calendar className="h-4 w-4 mr-2" />
                      下次预约: {workstation.nextBooking}
                    </div>
                  </div>
                )}

                {/* 操作按钮 */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedWorkstation(workstation)}
                    className="flex-1 btn btn-secondary btn-sm"
                  >
                    查看详情
                  </button>
                  <button className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700">
                    <Settings className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">工位信息</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">类型</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">费率</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">利用率</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">收入</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredWorkstations.map((workstation) => (
                    <tr key={workstation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">工位 {workstation.number}</div>
                          <div className="text-sm text-gray-500">{workstation.storeName}</div>
                          {workstation.currentBarber && (
                            <div className="text-xs text-gray-400">理发师: {workstation.currentBarber}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(workstation.status)}`}>
                          {getStatusIcon(workstation.status)}
                          <span className="ml-1">{getStatusText(workstation.status)}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(workstation.type)}`}>
                          {getTypeText(workstation.type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div>¥{workstation.hourlyRate}/时</div>
                        <div>¥{workstation.dailyRate}/日</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${workstation.utilization}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-900">{workstation.utilization}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        ¥{workstation.revenue.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setSelectedWorkstation(workstation)}
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
        )}

        {filteredWorkstations.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">没有找到符合条件的工位</p>
          </div>
        )}
      </div>

      {/* 工位详情模态框 */}
      {selectedWorkstation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">工位详情 - {selectedWorkstation.number}</h3>
                <button 
                  onClick={() => setSelectedWorkstation(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">基本信息</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">工位号:</span>
                      <span className="text-sm font-medium">{selectedWorkstation.number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">门店:</span>
                      <span className="text-sm font-medium">{selectedWorkstation.storeName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">类型:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(selectedWorkstation.type)}`}>
                        {getTypeText(selectedWorkstation.type)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">状态:</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedWorkstation.status)}`}>
                        {getStatusIcon(selectedWorkstation.status)}
                        <span className="ml-1">{getStatusText(selectedWorkstation.status)}</span>
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">收费标准</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">小时费率:</span>
                      <span className="text-sm font-medium">¥{selectedWorkstation.hourlyRate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">日费率:</span>
                      <span className="text-sm font-medium">¥{selectedWorkstation.dailyRate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">本月收入:</span>
                      <span className="text-sm font-medium">¥{selectedWorkstation.revenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">利用率:</span>
                      <span className="text-sm font-medium">{selectedWorkstation.utilization}%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">设备配置</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedWorkstation.equipment.map((item, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">使用记录</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">本月预约:</span>
                      <span className="text-sm font-medium">{selectedWorkstation.bookings}次</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">最后使用:</span>
                      <span className="text-sm font-medium">{selectedWorkstation.lastUsed}</span>
                    </div>
                    {selectedWorkstation.nextBooking && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">下次预约:</span>
                        <span className="text-sm font-medium">{selectedWorkstation.nextBooking}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {selectedWorkstation.currentBarber && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">当前使用</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">理发师:</span>
                        <span className="text-sm font-medium">{selectedWorkstation.currentBarber}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WorkstationManagementPage