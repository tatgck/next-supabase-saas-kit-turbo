import { useState } from 'react'
import { Check, Star, Clock, Scissors, Sparkles } from 'lucide-react'

interface Package {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  duration: number
  services: string[]
  popular?: boolean
  image: string
  rating: number
  reviewCount: number
}

const mockPackages: Package[] = [
  {
    id: '1',
    name: '经典理发套餐',
    description: '基础洗剪吹服务，适合日常打理',
    price: 68,
    originalPrice: 88,
    duration: 45,
    services: ['专业洗发', '精剪造型', '吹风定型'],
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=300&h=200&fit=crop',
    rating: 4.6,
    reviewCount: 234
  },
  {
    id: '2',
    name: '时尚造型套餐',
    description: '潮流发型设计，让你焕然一新',
    price: 128,
    originalPrice: 168,
    duration: 90,
    services: ['专业洗发', '设计剪发', '造型定型', '护发护理'],
    popular: true,
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop',
    rating: 4.8,
    reviewCount: 456
  },
  {
    id: '3',
    name: '高级烫染套餐',
    description: '专业烫发染发，打造个性风格',
    price: 298,
    originalPrice: 398,
    duration: 180,
    services: ['专业洗发', '发型设计', '烫发/染发', '深度护理', '造型定型'],
    image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=300&h=200&fit=crop',
    rating: 4.9,
    reviewCount: 187
  },
  {
    id: '4',
    name: '商务精英套餐',
    description: '专为职场人士定制的专业形象服务',
    price: 158,
    duration: 60,
    services: ['专业洗发', '商务剪发', '造型定型', '胡须修剪'],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
    rating: 4.7,
    reviewCount: 312
  },
  {
    id: '5',
    name: '头皮护理套餐',
    description: '深度头皮护理，改善头发健康',
    price: 188,
    duration: 120,
    services: ['头皮检测', '深度清洁', '营养护理', '按摩放松', '护理产品'],
    image: 'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=300&h=200&fit=crop',
    rating: 4.5,
    reviewCount: 98
  },
  {
    id: '6',
    name: '新娘造型套餐',
    description: '专业新娘造型，让你在重要时刻更美丽',
    price: 588,
    duration: 240,
    services: ['造型设计', '专业化妆', '发型定制', '饰品搭配', '全程跟妆'],
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=300&h=200&fit=crop',
    rating: 4.9,
    reviewCount: 76
  }
]

function PackageSelectionPage() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [filter, setFilter] = useState('all')

  const filteredPackages = mockPackages.filter(pkg => {
    if (filter === 'basic') return pkg.price < 100
    if (filter === 'premium') return pkg.price > 200
    if (filter === 'popular') return pkg.popular
    return true
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">选择服务套餐</h1>
          <p className="text-lg text-gray-600">选择最适合你的理发服务套餐</p>
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
              全部套餐
            </button>
            <button
              onClick={() => setFilter('basic')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'basic' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              基础套餐 (&lt;¥100)
            </button>
            <button
              onClick={() => setFilter('premium')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'premium' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              高端套餐 (&gt;¥200)
            </button>
            <button
              onClick={() => setFilter('popular')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'popular' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              热门推荐
            </button>
          </div>
        </div>

        {/* 套餐列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transition-all ${
                selectedPackage === pkg.id 
                  ? 'ring-2 ring-blue-500 shadow-md' 
                  : 'hover:shadow-md'
              } ${pkg.popular ? 'ring-1 ring-orange-200' : ''}`}
              onClick={() => setSelectedPackage(pkg.id)}
            >
              {/* 套餐图片 */}
              <div className="relative">
                <img
                  src={pkg.image}
                  alt={pkg.name}
                  className="w-full h-48 object-cover"
                />
                {pkg.popular && (
                  <div className="absolute top-4 right-4 bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center">
                    <Sparkles className="h-3 w-3 mr-1" />
                    热门
                  </div>
                )}
              </div>

              <div className="p-6">
                {/* 套餐标题和描述 */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{pkg.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>

                {/* 评分 */}
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm font-medium">{pkg.rating}</span>
                  </div>
                  <span className="ml-2 text-sm text-gray-600">({pkg.reviewCount}条评价)</span>
                </div>

                {/* 服务内容 */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">包含服务：</h4>
                  <ul className="space-y-1">
                    {pkg.services.map((service, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 时长 */}
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <Clock className="h-4 w-4 mr-1" />
                  约 {pkg.duration} 分钟
                </div>

                {/* 价格 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-blue-600">¥{pkg.price}</span>
                    {pkg.originalPrice && (
                      <span className="ml-2 text-sm text-gray-500 line-through">¥{pkg.originalPrice}</span>
                    )}
                  </div>
                  {pkg.originalPrice && (
                    <span className="text-sm text-red-600 font-medium">
                      省¥{pkg.originalPrice - pkg.price}
                    </span>
                  )}
                </div>

                {/* 选择按钮 */}
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                  <Scissors className="h-4 w-4 mr-2" />
                  选择此套餐
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredPackages.length === 0 && (
          <div className="text-center py-12">
            <Scissors className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">没有符合条件的套餐</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PackageSelectionPage