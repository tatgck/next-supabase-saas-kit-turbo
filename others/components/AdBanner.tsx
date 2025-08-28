import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

interface Ad {
  id: string
  title: string
  description: string
  image: string
  link: string
  type: 'banner' | 'popup' | 'sidebar'
}

const mockAds: Ad[] = [
  {
    id: '1',
    title: '新用户专享优惠',
    description: '首次预约立减50元，限时优惠不容错过！',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&h=300&fit=crop',
    link: '/packages',
    type: 'banner'
  },
  {
    id: '2',
    title: '春季护发套餐',
    description: '专业护发套餐，让你的头发重获新生',
    image: 'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=800&h=300&fit=crop',
    link: '/packages',
    type: 'banner'
  },
  {
    id: '3',
    title: 'VIP会员招募',
    description: '成为VIP会员，享受更多专属优惠和服务',
    image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&h=300&fit=crop',
    link: '/login',
    type: 'banner'
  }
]

interface AdBannerProps {
  className?: string
}

function AdBanner({ className = '' }: AdBannerProps) {
  const [currentAdIndex, setCurrentAdIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAdIndex((prevIndex) => 
        prevIndex === mockAds.length - 1 ? 0 : prevIndex + 1
      )
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const goToPrevious = () => {
    setCurrentAdIndex(
      currentAdIndex === 0 ? mockAds.length - 1 : currentAdIndex - 1
    )
  }

  const goToNext = () => {
    setCurrentAdIndex(
      currentAdIndex === mockAds.length - 1 ? 0 : currentAdIndex + 1
    )
  }

  const handleAdClick = (link: string) => {
    window.location.href = link
  }

  if (!isVisible) return null

  const currentAd = mockAds[currentAdIndex]

  return (
    <div className={`relative overflow-hidden rounded-lg shadow-sm ${className}`}>
      {/* 广告轮播 */}
      <div className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-600">
        <img
          src={currentAd.image}
          alt={currentAd.title}
          className="w-full h-full object-cover"
        />
        
        {/* 渐变遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* 广告内容 */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-2xl font-bold mb-2">{currentAd.title}</h3>
          <p className="text-lg mb-4 text-gray-200">{currentAd.description}</p>
          <button
            onClick={() => handleAdClick(currentAd.link)}
            className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            立即查看
          </button>
        </div>

        {/* 导航按钮 */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* 关闭按钮 */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-1 rounded-full transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* 指示器 */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {mockAds.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentAdIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentAdIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// 侧边栏广告组件
export function SidebarAd() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
      <div className="relative">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-0 right-0 text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
        <img
          src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=300&h=200&fit=crop"
          alt="侧边栏广告"
          className="w-full h-32 object-cover rounded-lg mb-3"
        />
        <h4 className="font-semibold text-gray-900 mb-2">专业理发培训</h4>
        <p className="text-sm text-gray-600 mb-3">提升技能，成为顶级理发师</p>
        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-700 transition-colors">
          了解更多
        </button>
      </div>
    </div>
  )
}

export default AdBanner