import { useState } from 'react'
import { 
  Megaphone, 
  Plus, 
  Edit, 
  Eye, 
  Play, 
  Pause, 
  BarChart3,
  Target,
  DollarSign,
  TrendingUp,
  Search,
  Filter,
  Image,
  FileText,
  Globe,
  Smartphone,
  Monitor,
  XCircle
} from 'lucide-react'

interface Advertisement {
  id: string
  title: string
  content: string
  type: 'banner' | 'popup' | 'video' | 'text'
  platform: 'web' | 'mobile' | 'all'
  status: 'active' | 'paused' | 'draft' | 'expired'
  budget: number
  spent: number
  impressions: number
  clicks: number
  conversions: number
  ctr: number
  startDate: string
  endDate: string
  targetAudience: string
  image?: string
  createdAt: string
}

const mockAds: Advertisement[] = [
  {
    id: '1',
    title: '春季理发优惠活动',
    content: '春暖花开，焕新造型！全场理发服务8折优惠，限时3天！',
    type: 'banner',
    platform: 'all',
    status: 'active',
    budget: 5000,
    spent: 3200,
    impressions: 45600,
    clicks: 1824,
    conversions: 156,
    ctr: 4.0,
    startDate: '2024-01-15',
    endDate: '2024-01-25',
    targetAudience: '25-40岁职场人士',
    image: 'https://images.unsplash.com/photo-1562004760-aceed7bb0fe3?w=400&h=200&fit=crop',
    createdAt: '2024-01-14'
  },
  {
    id: '2',
    title: 'VIP会员招募',
    content: '成为VIP会员，享受专属服务和优先预约权！',
    type: 'popup',
    platform: 'web',
    status: 'active',
    budget: 3000,
    spent: 1800,
    impressions: 28900,
    clicks: 867,
    conversions: 45,
    ctr: 3.0,
    startDate: '2024-01-10',
    endDate: '2024-01-30',
    targetAudience: '高端消费群体',
    createdAt: '2024-01-09'
  },
  {
    id: '3',
    title: '新店开业庆典',
    content: '经典理发店盛大开业！前100名顾客享受免费理发服务！',
    type: 'video',
    platform: 'mobile',
    status: 'paused',
    budget: 8000,
    spent: 2400,
    impressions: 15600,
    clicks: 624,
    conversions: 78,
    ctr: 4.0,
    startDate: '2024-01-05',
    endDate: '2024-01-20',
    targetAudience: '周边社区居民',
    image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=400&h=200&fit=crop',
    createdAt: '2024-01-04'
  },
  {
    id: '4',
    title: '理发师技能大赛',
    content: '观看顶级理发师现场PK，学习最新造型技巧！',
    type: 'text',
    platform: 'all',
    status: 'draft',
    budget: 2000,
    spent: 0,
    impressions: 0,
    clicks: 0,
    conversions: 0,
    ctr: 0,
    startDate: '2024-02-01',
    endDate: '2024-02-15',
    targetAudience: '理发爱好者',
    createdAt: '2024-01-20'
  }
]

function AdvertisingManagementPage() {
  const [ads, setAds] = useState<Advertisement[]>(mockAds)
  const [selectedAd, setSelectedAd] = useState<Advertisement | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'paused' | 'draft' | 'expired'>('all')
  const [filterType, setFilterType] = useState<'all' | 'banner' | 'popup' | 'video' | 'text'>('all')
  const [filterPlatform, setFilterPlatform] = useState<'all' | 'web' | 'mobile'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredAds = ads.filter(ad => {
    const matchesStatus = filterStatus === 'all' || ad.status === filterStatus
    const matchesType = filterType === 'all' || ad.type === filterType
    const matchesPlatform = filterPlatform === 'all' || ad.platform === filterPlatform || ad.platform === 'all'
    const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.targetAudience.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesType && matchesPlatform && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'expired': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="h-4 w-4" />
      case 'paused': return <Pause className="h-4 w-4" />
      case 'draft': return <FileText className="h-4 w-4" />
      case 'expired': return <XCircle className="h-4 w-4" />
      default: return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '投放中'
      case 'paused': return '已暂停'
      case 'draft': return '草稿'
      case 'expired': return '已过期'
      default: return '未知'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'banner': return 'bg-blue-100 text-blue-800'
      case 'popup': return 'bg-purple-100 text-purple-800'
      case 'video': return 'bg-red-100 text-red-800'
      case 'text': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'banner': return <Image className="h-4 w-4" />
      case 'popup': return <Monitor className="h-4 w-4" />
      case 'video': return <Play className="h-4 w-4" />
      case 'text': return <FileText className="h-4 w-4" />
      default: return null
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'banner': return '横幅广告'
      case 'popup': return '弹窗广告'
      case 'video': return '视频广告'
      case 'text': return '文字广告'
      default: return '未知'
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'web': return <Monitor className="h-4 w-4" />
      case 'mobile': return <Smartphone className="h-4 w-4" />
      case 'all': return <Globe className="h-4 w-4" />
      default: return null
    }
  }

  const getPlatformText = (platform: string) => {
    switch (platform) {
      case 'web': return '网页端'
      case 'mobile': return '移动端'
      case 'all': return '全平台'
      default: return '未知'
    }
  }

  const handleStatusChange = (adId: string, newStatus: 'active' | 'paused') => {
    setAds(prev => prev.map(ad => 
      ad.id === adId ? { ...ad, status: newStatus } : ad
    ))
  }

  const totalBudget = ads.reduce((sum, ad) => sum + ad.budget, 0)
  const totalSpent = ads.reduce((sum, ad) => sum + ad.spent, 0)
  const totalImpressions = ads.reduce((sum, ad) => sum + ad.impressions, 0)
  const totalClicks = ads.reduce((sum, ad) => sum + ad.clicks, 0)
  const totalConversions = ads.reduce((sum, ad) => sum + ad.conversions, 0)
  const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions * 100) : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面头部 */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">广告管理</h1>
              <p className="text-lg text-gray-600 mt-1">平台广告投放、文案管理和效果分析</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="btn btn-secondary">
                <BarChart3 className="h-4 w-4 mr-2" />
                数据报告
              </button>
              <button className="btn btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                创建广告
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 广告效果统计 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">总预算</p>
                <p className="text-2xl font-bold text-blue-600">¥{totalBudget.toLocaleString()}</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">已消费</p>
                <p className="text-2xl font-bold text-red-600">¥{totalSpent.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-red-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">展示次数</p>
                <p className="text-2xl font-bold text-purple-600">{totalImpressions.toLocaleString()}</p>
              </div>
              <Eye className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">点击次数</p>
                <p className="text-2xl font-bold text-green-600">{totalClicks.toLocaleString()}</p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">转化次数</p>
                <p className="text-2xl font-bold text-yellow-600">{totalConversions}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">点击率</p>
                <p className="text-2xl font-bold text-indigo-600">{avgCTR.toFixed(2)}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-indigo-600" />
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
                  placeholder="搜索广告标题、内容或目标受众..."
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
                  <option value="active">投放中</option>
                  <option value="paused">已暂停</option>
                  <option value="draft">草稿</option>
                  <option value="expired">已过期</option>
                </select>
              </div>
              
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">全部类型</option>
                <option value="banner">横幅广告</option>
                <option value="popup">弹窗广告</option>
                <option value="video">视频广告</option>
                <option value="text">文字广告</option>
              </select>

              <select
                value={filterPlatform}
                onChange={(e) => setFilterPlatform(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">全部平台</option>
                <option value="web">网页端</option>
                <option value="mobile">移动端</option>
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

        {/* 广告列表 */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAds.map((ad) => (
              <div key={ad.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {ad.image && (
                  <img 
                    src={ad.image} 
                    alt={ad.title}
                    className="w-full h-32 object-cover"
                  />
                )}
                
                <div className="p-6">
                  {/* 广告头部 */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{ad.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{ad.content}</p>
                    </div>
                  </div>

                  {/* 标签 */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ad.status)}`}>
                      {getStatusIcon(ad.status)}
                      <span className="ml-1">{getStatusText(ad.status)}</span>
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(ad.type)}`}>
                      {getTypeIcon(ad.type)}
                      <span className="ml-1">{getTypeText(ad.type)}</span>
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {getPlatformIcon(ad.platform)}
                      <span className="ml-1">{getPlatformText(ad.platform)}</span>
                    </span>
                  </div>

                  {/* 数据指标 */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-600">预算/消费</div>
                      <div className="text-lg font-semibold text-gray-900">
                        ¥{ad.spent.toLocaleString()}/¥{ad.budget.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">点击率</div>
                      <div className="text-lg font-semibold text-gray-900">{ad.ctr}%</div>
                    </div>
                  </div>

                  {/* 进度条 */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>预算使用</span>
                      <span>{((ad.spent / ad.budget) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${Math.min((ad.spent / ad.budget) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setSelectedAd(ad)}
                      className="flex-1 btn btn-secondary btn-sm"
                    >
                      查看详情
                    </button>
                    {ad.status === 'active' ? (
                      <button 
                        onClick={() => handleStatusChange(ad.id, 'paused')}
                        className="btn btn-sm bg-yellow-600 text-white hover:bg-yellow-700"
                      >
                        <Pause className="h-4 w-4" />
                      </button>
                    ) : ad.status === 'paused' ? (
                      <button 
                        onClick={() => handleStatusChange(ad.id, 'active')}
                        className="btn btn-sm bg-green-600 text-white hover:bg-green-700"
                      >
                        <Play className="h-4 w-4" />
                      </button>
                    ) : null}
                    <button className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700">
                      <Edit className="h-4 w-4" />
                    </button>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">广告信息</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">类型</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">预算</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">效果</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAds.map((ad) => (
                    <tr key={ad.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {ad.image && (
                            <img src={ad.image} alt={ad.title} className="w-12 h-12 rounded-lg object-cover mr-4" />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">{ad.title}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">{ad.content}</div>
                            <div className="text-xs text-gray-400 flex items-center mt-1">
                              {getPlatformIcon(ad.platform)}
                              <span className="ml-1">{getPlatformText(ad.platform)}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(ad.type)}`}>
                          {getTypeIcon(ad.type)}
                          <span className="ml-1">{getTypeText(ad.type)}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ad.status)}`}>
                          {getStatusIcon(ad.status)}
                          <span className="ml-1">{getStatusText(ad.status)}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div>预算: ¥{ad.budget.toLocaleString()}</div>
                        <div>消费: ¥{ad.spent.toLocaleString()}</div>
                        <div className="w-16 bg-gray-200 rounded-full h-1 mt-1">
                          <div 
                            className="bg-blue-600 h-1 rounded-full" 
                            style={{ width: `${Math.min((ad.spent / ad.budget) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div>点击: {ad.clicks.toLocaleString()}</div>
                        <div>转化: {ad.conversions}</div>
                        <div>CTR: {ad.ctr}%</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setSelectedAd(ad)}
                            className="text-blue-600 hover:text-blue-900 text-sm"
                          >
                            查看
                          </button>
                          {ad.status === 'active' ? (
                            <button 
                              onClick={() => handleStatusChange(ad.id, 'paused')}
                              className="text-yellow-600 hover:text-yellow-900 text-sm"
                            >
                              暂停
                            </button>
                          ) : ad.status === 'paused' ? (
                            <button 
                              onClick={() => handleStatusChange(ad.id, 'active')}
                              className="text-green-600 hover:text-green-900 text-sm"
                            >
                              启动
                            </button>
                          ) : null}
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

        {filteredAds.length === 0 && (
          <div className="text-center py-12">
            <Megaphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">没有找到符合条件的广告</p>
          </div>
        )}
      </div>

      {/* 广告详情模态框 */}
      {selectedAd && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">广告详情</h3>
                <button 
                  onClick={() => setSelectedAd(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {selectedAd.image && (
                <img 
                  src={selectedAd.image} 
                  alt={selectedAd.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">基本信息</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">标题:</span>
                      <span className="text-sm font-medium">{selectedAd.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">类型:</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(selectedAd.type)}`}>
                        {getTypeIcon(selectedAd.type)}
                        <span className="ml-1">{getTypeText(selectedAd.type)}</span>
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">平台:</span>
                      <span className="text-sm font-medium">{getPlatformText(selectedAd.platform)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">状态:</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedAd.status)}`}>
                        {getStatusIcon(selectedAd.status)}
                        <span className="ml-1">{getStatusText(selectedAd.status)}</span>
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">预算与消费</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">总预算:</span>
                      <span className="text-sm font-medium">¥{selectedAd.budget.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">已消费:</span>
                      <span className="text-sm font-medium">¥{selectedAd.spent.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">剩余预算:</span>
                      <span className="text-sm font-medium">¥{(selectedAd.budget - selectedAd.spent).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">使用率:</span>
                      <span className="text-sm font-medium">{((selectedAd.spent / selectedAd.budget) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">广告内容</h4>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedAd.content}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">效果数据</h4>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">{selectedAd.impressions.toLocaleString()}</div>
                    <div className="text-xs text-gray-600">展示次数</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">{selectedAd.clicks.toLocaleString()}</div>
                    <div className="text-xs text-gray-600">点击次数</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-lg font-bold text-yellow-600">{selectedAd.conversions}</div>
                    <div className="text-xs text-gray-600">转化次数</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-lg font-bold text-purple-600">{selectedAd.ctr}%</div>
                    <div className="text-xs text-gray-600">点击率</div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">投放时间</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">开始时间:</span>
                      <span className="text-sm font-medium">{selectedAd.startDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">结束时间:</span>
                      <span className="text-sm font-medium">{selectedAd.endDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">创建时间:</span>
                      <span className="text-sm font-medium">{selectedAd.createdAt}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">目标受众</h4>
                  <p className="text-sm text-gray-700">{selectedAd.targetAudience}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdvertisingManagementPage