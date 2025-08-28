import { useState } from 'react'
import { Star, MapPin, Clock, User, Scissors } from 'lucide-react'

interface Barber {
  id: string
  name: string
  avatar: string
  rating: number
  reviewCount: number
  location: string
  specialties: string[]
  priceRange: string
  availability: string
  distance: string
}

const mockBarbers: Barber[] = [
  {
    id: '1',
    name: '张师傅',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    rating: 4.8,
    reviewCount: 127,
    location: '中关村店',
    specialties: ['精剪', '烫发', '染发'],
    priceRange: '¥80-150',
    availability: '今天可预约',
    distance: '1.2km'
  },
  {
    id: '2',
    name: '李老师',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    rating: 4.9,
    reviewCount: 203,
    location: '朝阳店',
    specialties: ['造型设计', '护理', '胡须修剪'],
    priceRange: '¥100-200',
    availability: '明天可预约',
    distance: '2.1km'
  },
  {
    id: '3',
    name: '王大师',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face',
    rating: 4.7,
    reviewCount: 89,
    location: '海淀店',
    specialties: ['潮流剪发', '色彩搭配'],
    priceRange: '¥60-120',
    availability: '今天可预约',
    distance: '0.8km'
  },
  {
    id: '4',
    name: '陈师傅',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    rating: 4.6,
    reviewCount: 156,
    location: '东城店',
    specialties: ['经典理发', '修面'],
    priceRange: '¥50-100',
    availability: '今天可预约',
    distance: '3.5km'
  }
]

function BarberSelectionPage() {
  const [selectedBarber, setSelectedBarber] = useState<string | null>(null)
  const [filter, setFilter] = useState('all')

  const filteredBarbers = mockBarbers.filter(barber => {
    if (filter === 'available') return barber.availability === '今天可预约'
    if (filter === 'nearby') return parseFloat(barber.distance) < 2
    return true
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">选择理发师</h1>
          <p className="text-lg text-gray-600">找到最适合你的专业理发师</p>
        </div>

        {/* 筛选器 */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              全部理发师
            </button>
            <button
              onClick={() => setFilter('available')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'available' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              今天可预约
            </button>
            <button
              onClick={() => setFilter('nearby')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'nearby' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              附近2km内
            </button>
          </div>
        </div>

        {/* 理发师列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBarbers.map((barber) => (
            <div
              key={barber.id}
              className={`bg-white rounded-lg shadow-sm p-6 cursor-pointer transition-all ${
                selectedBarber === barber.id 
                  ? 'ring-2 ring-blue-500 shadow-md' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedBarber(barber.id)}
            >
              {/* 理发师头像和基本信息 */}
              <div className="flex items-center mb-4">
                <img
                  src={barber.avatar}
                  alt={barber.name}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{barber.name}</h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    {barber.location} · {barber.distance}
                  </div>
                </div>
              </div>

              {/* 评分和评价 */}
              <div className="flex items-center mb-3">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm font-medium">{barber.rating}</span>
                </div>
                <span className="ml-2 text-sm text-gray-600">({barber.reviewCount}条评价)</span>
              </div>

              {/* 专长标签 */}
              <div className="mb-3">
                <div className="flex flex-wrap gap-2">
                  {barber.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* 价格和可用性 */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-600">
                  <Scissors className="h-4 w-4 mr-1" />
                  {barber.priceRange}
                </div>
                <div className={`flex items-center ${
                  barber.availability === '今天可预约' ? 'text-green-600' : 'text-orange-600'
                }`}>
                  <Clock className="h-4 w-4 mr-1" />
                  {barber.availability}
                </div>
              </div>

              {/* 预约按钮 */}
              <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                选择并预约
              </button>
            </div>
          ))}
        </div>

        {filteredBarbers.length === 0 && (
          <div className="text-center py-12">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">没有符合条件的理发师</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BarberSelectionPage