import { useState } from 'react'
import { 
  Store, 
  MapPin, 
  Phone, 
  Mail, 
  Star, 
  Plus,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  Eye
} from 'lucide-react'

interface StoreData {
  id: string
  name: string
  owner: string
  address: string
  phone: string
  email: string
  status: 'active' | 'pending' | 'inactive'
  rating: number
  reviewCount: number
  barberCount: number
  workstationCount: number
  monthlyRevenue: number
  joinDate: string
  lastActive: string
  image: string
}

const mockStores: StoreData[] = [
  {
    id: '1',
    name: '潮流理发屋',
    owner: '张老板',
    address: '北京市海淀区中关村大街123号',
    phone: '13800138001',
    email: 'trendy@example.com',
    status: 'active',
    rating: 4.8,
    reviewCount: 256,
    barberCount: 8,
    workstationCount: 12,
    monthlyRevenue: 45600,
    joinDate: '2024-01-15',
    lastActive: '2024-01-20',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop'
  },
  {
    id: '2',
    name: '经典理发店',
    owner: '李师傅',
    address: '北京市朝阳区建国路456号',
    phone: '13800138002',
    email: 'classic@example.com',
    status: 'pending',
    rating: 4.5,
    reviewCount: 89,
    barberCount: 4,
    workstationCount: 6,
    monthlyRevenue: 23400,
    joinDate: '2024-01-18',
    lastActive: '2024-01-19',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'
  },
  {
    id: '3',
    name: '现代造型',
    owner: '王总',
    address: '北京市东城区王府井大街789号',
    phone: '13800138003',
    email: 'modern@example.com',
    status: 'active',
    rating: 4.9,
    reviewCount: 312,
    barberCount: 15,
    workstationCount: 20,
    monthlyRevenue: 78900,
    joinDate: '2023-12-10',
    lastActive: '2024-01-20',
    image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=400&h=300&fit=crop'
  }
]

function StoreManagementPage() {
  const [stores, setStores] = useState<StoreData[]>(mockStores)
  const [selectedStore, setSelectedStore] = useState<StoreData | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'pending' | 'inactive'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredStores = stores.filter(store => {
    const matchesStatus = filterStatus === 'all' || store.status === filterStatus
    const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.address.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      case 'inactive': return <XCircle className="h-4 w-4" />
      default: return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '营业中'
      case 'pending': return '待审核'
      case 'inactive': return '已停业'
      default: return '未知'
    }
  }

  const handleApproveStore = (storeId: string) => {
    setStores(prev => prev.map(store => 
      store.id === storeId ? { ...store, status: 'active' as const } : store
    ))
  }

  const handleRejectStore = (storeId: string) => {
    setStores(prev => prev.map(store => 
      store.id === storeId ? { ...store, status: 'inactive' as const } : store
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面头部 */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">门店管理</h1>
              <p className="text-lg text-gray-600 mt-1">管理平台合作门店信息</p>
            </div>
            <button className="btn btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              添加门店
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 搜索和筛选 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索门店名称、店主或地址..."
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
                  <option value="active">营业中</option>
                  <option value="pending">待审核</option>
                  <option value="inactive">已停业</option>
                </select>
              </div>
              
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

        {/* 门店列表 */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.map((store) => (
              <div key={store.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {/* 门店图片 */}
                <img 
                  src={store.image} 
                  alt={store.name}
                  className="w-full h-48 object-cover"
                />
                
                <div className="p-6">
                  {/* 门店基本信息 */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{store.name}</h3>
                      <p className="text-sm text-gray-600">{store.owner}</p>
                    </div>
                    <div className="relative">
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* 状态标签 */}
                  <div className="flex items-center mb-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(store.status)}`}>
                      {getStatusIcon(store.status)}
                      <span className="ml-1">{getStatusText(store.status)}</span>
                    </span>
                  </div>

                  {/* 评分和统计 */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm font-medium">{store.rating}</span>
                      </div>
                      <p className="text-xs text-gray-600">{store.reviewCount}条评价</p>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">{store.barberCount}</div>
                      <p className="text-xs text-gray-600">理发师</p>
                    </div>
                  </div>

                  {/* 地址和联系方式 */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{store.address}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{store.phone}</span>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setSelectedStore(store)}
                      className="flex-1 btn btn-secondary btn-sm"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      查看
                    </button>
                    {store.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleApproveStore(store.id)}
                          className="btn btn-sm bg-green-600 text-white hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleRejectStore(store.id)}
                          className="btn btn-sm bg-red-600 text-white hover:bg-red-700"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">门店信息</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">评分</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">理发师</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">月收入</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStores.map((store) => (
                    <tr key={store.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img src={store.image} alt={store.name} className="w-10 h-10 rounded-lg object-cover mr-4" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{store.name}</div>
                            <div className="text-sm text-gray-500">{store.owner}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(store.status)}`}>
                          {getStatusIcon(store.status)}
                          <span className="ml-1">{getStatusText(store.status)}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-sm font-medium">{store.rating}</span>
                          <span className="text-sm text-gray-500 ml-1">({store.reviewCount})</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {store.barberCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ¥{store.monthlyRevenue.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setSelectedStore(store)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            查看
                          </button>
                          {store.status === 'pending' && (
                            <>
                              <button 
                                onClick={() => handleApproveStore(store.id)}
                                className="text-green-600 hover:text-green-900"
                              >
                                批准
                              </button>
                              <button 
                                onClick={() => handleRejectStore(store.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                拒绝
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {filteredStores.length === 0 && (
          <div className="text-center py-12">
            <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">没有找到符合条件的门店</p>
          </div>
        )}
      </div>

      {/* 门店详情模态框 */}
      {selectedStore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">门店详情</h3>
                <button 
                  onClick={() => setSelectedStore(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img 
                    src={selectedStore.image} 
                    alt={selectedStore.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">{selectedStore.name}</h4>
                    <p className="text-gray-600">店主: {selectedStore.owner}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{selectedStore.rating}</div>
                      <div className="text-sm text-gray-600">{selectedStore.reviewCount}条评价</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{selectedStore.barberCount}</div>
                      <div className="text-sm text-gray-600">理发师数量</div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-2">联系信息:</p>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        {selectedStore.phone}
                      </div>
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        {selectedStore.email}
                      </div>
                      <div className="flex items-start text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                        {selectedStore.address}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StoreManagementPage