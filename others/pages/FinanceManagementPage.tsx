import { useState } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  Download,
  Search,
  Filter,
  BarChart3,
  PieChart,
  CreditCard,
  Wallet,
  Receipt,
  Store,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface Transaction {
  id: string
  type: 'income' | 'expense' | 'commission' | 'settlement'
  amount: number
  description: string
  store: string
  barber?: string
  date: string
  status: 'completed' | 'pending' | 'failed'
  category: string
}

interface RevenueData {
  period: string
  totalRevenue: number
  platformCommission: number
  storeRevenue: number
  barberCommission: number
  growth: number
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'income',
    amount: 280,
    description: '剪发服务费用',
    store: '潮流理发屋',
    barber: '张师傅',
    date: '2024-01-20 14:30',
    status: 'completed',
    category: '服务费'
  },
  {
    id: '2',
    type: 'commission',
    amount: 84,
    description: '平台佣金收入(30%)',
    store: '潮流理发屋',
    date: '2024-01-20 14:30',
    status: 'completed',
    category: '平台佣金'
  },
  {
    id: '3',
    type: 'settlement',
    amount: 1250,
    description: '月度结算给门店',
    store: '经典理发店',
    date: '2024-01-20 09:00',
    status: 'pending',
    category: '门店结算'
  },
  {
    id: '4',
    type: 'expense',
    amount: 500,
    description: '广告推广费用',
    store: '平台运营',
    date: '2024-01-19 16:45',
    status: 'completed',
    category: '运营费用'
  }
]

const revenueData: RevenueData[] = [
  {
    period: '2024年1月',
    totalRevenue: 125600,
    platformCommission: 37680,
    storeRevenue: 87920,
    barberCommission: 25120,
    growth: 12.5
  },
  {
    period: '2023年12月',
    totalRevenue: 111800,
    platformCommission: 33540,
    storeRevenue: 78260,
    barberCommission: 22360,
    growth: 8.2
  },
  {
    period: '2023年11月',
    totalRevenue: 103400,
    platformCommission: 31020,
    storeRevenue: 72380,
    barberCommission: 20680,
    growth: -3.1
  }
]

function FinanceManagementPage() {
  const [transactions] = useState<Transaction[]>(mockTransactions)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense' | 'commission' | 'settlement'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending' | 'failed'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [dateRange, setDateRange] = useState('month')

  const filteredTransactions = transactions.filter(transaction => {
    const matchesType = filterType === 'all' || transaction.type === filterType
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.store.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (transaction.barber && transaction.barber.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesType && matchesStatus && matchesSearch
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'income': return 'bg-green-100 text-green-800'
      case 'expense': return 'bg-red-100 text-red-800'
      case 'commission': return 'bg-blue-100 text-blue-800'
      case 'settlement': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'income': return <ArrowUpRight className="h-4 w-4" />
      case 'expense': return <ArrowDownRight className="h-4 w-4" />
      case 'commission': return <Wallet className="h-4 w-4" />
      case 'settlement': return <CreditCard className="h-4 w-4" />
      default: return null
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'income': return '收入'
      case 'expense': return '支出'
      case 'commission': return '佣金'
      case 'settlement': return '结算'
      default: return '未知'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      case 'failed': return <AlertCircle className="h-4 w-4" />
      default: return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return '已完成'
      case 'pending': return '处理中'
      case 'failed': return '失败'
      default: return '未知'
    }
  }

  const currentMonth = revenueData[0]
  const pendingSettlements = filteredTransactions.filter(t => t.type === 'settlement' && t.status === 'pending').length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面头部 */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">费用核算</h1>
              <p className="text-lg text-gray-600 mt-1">平台财务管理、收入统计和结算管理</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="btn btn-secondary">
                <Download className="h-4 w-4 mr-2" />
                导出报表
              </button>
              <button className="btn btn-primary">
                <Receipt className="h-4 w-4 mr-2" />
                创建结算
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 财务概览卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">总收入</p>
                <p className="text-2xl font-bold text-green-600">¥{currentMonth.totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-green-600 mt-1">+{currentMonth.growth}% 较上月</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">平台佣金</p>
                <p className="text-2xl font-bold text-blue-600">¥{currentMonth.platformCommission.toLocaleString()}</p>
                <p className="text-sm text-gray-600 mt-1">30% 佣金率</p>
              </div>
              <Wallet className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">门店收入</p>
                <p className="text-2xl font-bold text-purple-600">¥{currentMonth.storeRevenue.toLocaleString()}</p>
                <p className="text-sm text-gray-600 mt-1">70% 分成</p>
              </div>
              <Store className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">待结算</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingSettlements}</p>
                <p className="text-sm text-gray-600 mt-1">笔待处理</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* 收入趋势图表 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">月度收入趋势</h3>
              <BarChart3 className="h-5 w-5 text-gray-500" />
            </div>
            <div className="space-y-4">
              {revenueData.map((data, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{data.period}</p>
                    <p className="text-xs text-gray-600">¥{data.totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className={`flex items-center text-sm ${data.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {data.growth >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                    {Math.abs(data.growth)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">收入分布</h3>
              <PieChart className="h-5 w-5 text-gray-500" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded mr-3"></div>
                  <span className="text-sm text-gray-700">平台佣金</span>
                </div>
                <span className="text-sm font-medium">30%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-purple-500 rounded mr-3"></div>
                  <span className="text-sm text-gray-700">门店分成</span>
                </div>
                <span className="text-sm font-medium">50%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                  <span className="text-sm text-gray-700">理发师分成</span>
                </div>
                <span className="text-sm font-medium">20%</span>
              </div>
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
                  placeholder="搜索交易记录、门店或理发师..."
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
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">全部类型</option>
                  <option value="income">收入</option>
                  <option value="expense">支出</option>
                  <option value="commission">佣金</option>
                  <option value="settlement">结算</option>
                </select>
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">全部状态</option>
                <option value="completed">已完成</option>
                <option value="pending">处理中</option>
                <option value="failed">失败</option>
              </select>

              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="week">本周</option>
                <option value="month">本月</option>
                <option value="quarter">本季度</option>
                <option value="year">本年</option>
              </select>
            </div>
          </div>
        </div>

        {/* 交易记录表格 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">交易记录</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">交易信息</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">类型</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">金额</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">时间</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{transaction.description}</div>
                        <div className="text-sm text-gray-500">{transaction.store}</div>
                        {transaction.barber && (
                          <div className="text-xs text-gray-400">理发师: {transaction.barber}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(transaction.type)}`}>
                        {getTypeIcon(transaction.type)}
                        <span className="ml-1">{getTypeText(transaction.type)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${
                        transaction.type === 'income' || transaction.type === 'commission' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' || transaction.type === 'commission' ? '+' : '-'}¥{transaction.amount}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                        {getStatusIcon(transaction.status)}
                        <span className="ml-1">{getStatusText(transaction.status)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {transaction.date}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => setSelectedTransaction(transaction)}
                        className="text-blue-600 hover:text-blue-900 text-sm"
                      >
                        查看详情
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">没有找到符合条件的交易记录</p>
          </div>
        )}
      </div>

      {/* 交易详情模态框 */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">交易详情</h3>
                <button 
                  onClick={() => setSelectedTransaction(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">交易ID:</span>
                <span className="text-sm font-medium">{selectedTransaction.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">描述:</span>
                <span className="text-sm font-medium">{selectedTransaction.description}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">门店:</span>
                <span className="text-sm font-medium">{selectedTransaction.store}</span>
              </div>
              {selectedTransaction.barber && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">理发师:</span>
                  <span className="text-sm font-medium">{selectedTransaction.barber}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">金额:</span>
                <span className={`text-sm font-medium ${
                  selectedTransaction.type === 'income' || selectedTransaction.type === 'commission' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {selectedTransaction.type === 'income' || selectedTransaction.type === 'commission' ? '+' : '-'}¥{selectedTransaction.amount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">类型:</span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(selectedTransaction.type)}`}>
                  {getTypeIcon(selectedTransaction.type)}
                  <span className="ml-1">{getTypeText(selectedTransaction.type)}</span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">状态:</span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTransaction.status)}`}>
                  {getStatusIcon(selectedTransaction.status)}
                  <span className="ml-1">{getStatusText(selectedTransaction.status)}</span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">时间:</span>
                <span className="text-sm font-medium">{selectedTransaction.date}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FinanceManagementPage