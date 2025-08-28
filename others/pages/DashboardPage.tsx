import { useAuthStore } from '@/store/authStore'
import { Users, Calendar, DollarSign, BarChart3, Settings, Star } from 'lucide-react'

function DashboardPage() {
  const { user } = useAuthStore()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            欢迎回来，{user?.name}！
          </h1>
          <p className="text-gray-600 mt-2">
            管理您的理发服务，查看业务数据和客户反馈
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">今日预约</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">本月收入</p>
                <p className="text-2xl font-bold text-gray-900">¥8,540</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">客户总数</p>
                <p className="text-2xl font-bold text-gray-900">186</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">平均评分</p>
                <p className="text-2xl font-bold text-gray-900">4.8</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Appointments */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">最近预约</h2>
                <button className="btn btn-secondary btn-sm">查看全部</button>
              </div>
              
              <div className="space-y-4">
                {[
                  { name: '李小明', time: '14:00 - 15:00', service: '剪发+洗发', status: '进行中' },
                  { name: '王小红', time: '15:30 - 16:30', service: '染发', status: '待服务' },
                  { name: '张大华', time: '17:00 - 18:00', service: '烫发', status: '待服务' },
                ].map((appointment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                      <div>
                        <p className="font-medium text-gray-900">{appointment.name}</p>
                        <p className="text-sm text-gray-600">{appointment.service}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{appointment.time}</p>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        appointment.status === '进行中' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">快速操作</h2>
              
              <div className="space-y-3">
                <button className="w-full btn btn-primary justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  查看今日排程
                </button>
                
                <button className="w-full btn btn-secondary justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  客户管理
                </button>
                
                <button className="w-full btn btn-secondary justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  收入统计
                </button>
                
                <button className="w-full btn btn-secondary justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  设置中心
                </button>
              </div>
            </div>

            {/* Profile Card */}
            <div className="card mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">个人信息</h3>
              <div className="flex items-center space-x-4">
                {user?.avatar && (
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-16 h-16 rounded-full"
                  />
                )}
                <div>
                  <p className="font-medium text-gray-900">{user?.name}</p>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                  <button className="text-sm text-blue-600 hover:text-blue-800 mt-1">
                    编辑资料
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage