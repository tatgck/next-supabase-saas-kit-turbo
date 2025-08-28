import { useState } from 'react'
import { Heart, Share2, MessageCircle, User, Star, Calendar } from 'lucide-react'

interface Work {
  id: string
  barberName: string
  barberAvatar: string
  barberRating: number
  title: string
  description: string
  images: string[]
  likes: number
  comments: number
  createdAt: string
  tags: string[]
  beforeImage?: string
  afterImage?: string
  liked?: boolean
}

const mockWorks: Work[] = [
  {
    id: '1',
    barberName: '张师傅',
    barberAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    barberRating: 4.8,
    title: '时尚层次剪发',
    description: '为这位客人打造了层次丰富的短发造型，既保持了干练的职场形象，又增添了时尚感。使用了渐变剪法，让发型更有立体感。',
    images: [
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop'
    ],
    beforeImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    afterImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    likes: 89,
    comments: 12,
    createdAt: '2024-01-15',
    tags: ['短发', '职场', '层次剪', '男士'],
    liked: false
  },
  {
    id: '2',
    barberName: '李老师',
    barberAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    barberRating: 4.9,
    title: '温柔波浪卷发',
    description: '这次为客人设计了温柔的波浪卷发造型，使用了数码烫技术，让卷度更持久自然。搭配了适合的发色，整体效果非常满意。',
    images: [
      'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=400&h=400&fit=crop'
    ],
    likes: 156,
    comments: 23,
    createdAt: '2024-01-12',
    tags: ['卷发', '烫发', '女士', '温柔风'],
    liked: true
  },
  {
    id: '3',
    barberName: '王大师',
    barberAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face',
    barberRating: 4.7,
    title: '个性染发设计',
    description: '大胆的颜色搭配，为客人打造了独特的个性造型。使用了渐变染色技术，从深到浅的过渡非常自然，展现了年轻人的活力。',
    images: [
      'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&h=400&fit=crop'
    ],
    likes: 234,
    comments: 45,
    createdAt: '2024-01-10',
    tags: ['染发', '个性', '渐变', '潮流'],
    liked: false
  },
  {
    id: '4',
    barberName: '陈师傅',
    barberAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    barberRating: 4.6,
    title: '经典商务发型',
    description: '为商务人士打造的经典发型，简洁大方，凸显专业形象。细节处理得很到位，发际线修饰自然，整体效果干净利落。',
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
    ],
    likes: 67,
    comments: 8,
    createdAt: '2024-01-08',
    tags: ['商务', '男士', '经典', '简洁'],
    liked: false
  }
]

function BarberWorksPage() {
  const [works, setWorks] = useState(mockWorks)
  const [filter, setFilter] = useState('all')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const filteredWorks = works.filter(work => {
    if (filter === 'liked') return work.liked
    if (filter === 'male') return work.tags.includes('男士')
    if (filter === 'female') return work.tags.includes('女士')
    return true
  })

  const handleLike = (workId: string) => {
    setWorks(prevWorks => 
      prevWorks.map(work => 
        work.id === workId 
          ? { 
              ...work, 
              liked: !work.liked,
              likes: work.liked ? work.likes - 1 : work.likes + 1
            }
          : work
      )
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">理发师作品展示</h1>
          <p className="text-lg text-gray-600">欣赏专业理发师的精彩作品，找到你的理想发型</p>
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
              全部作品
            </button>
            <button
              onClick={() => setFilter('male')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'male' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              男士发型
            </button>
            <button
              onClick={() => setFilter('female')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'female' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              女士发型
            </button>
            <button
              onClick={() => setFilter('liked')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'liked' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              我的收藏
            </button>
          </div>
        </div>

        {/* 作品列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredWorks.map((work) => (
            <div key={work.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* 理发师信息 */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={work.barberAvatar}
                      alt={work.barberName}
                      className="w-10 h-10 rounded-full object-cover mr-3"
                    />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{work.barberName}</h3>
                      <div className="flex items-center text-xs text-gray-600">
                        <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                        {work.barberRating}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {work.createdAt}
                  </div>
                </div>
              </div>

              {/* 作品图片 */}
              <div className="grid grid-cols-2 gap-1">
                {work.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${work.title} - 图片 ${index + 1}`}
                    className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setSelectedImage(image)}
                  />
                ))}
              </div>

              {/* 前后对比 */}
              {work.beforeImage && work.afterImage && (
                <div className="p-4 bg-gray-50">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">前后对比</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <img
                        src={work.beforeImage}
                        alt="造型前"
                        className="w-full h-24 object-cover rounded-lg cursor-pointer"
                        onClick={() => setSelectedImage(work.beforeImage!)}
                      />
                      <p className="text-xs text-gray-600 mt-1">造型前</p>
                    </div>
                    <div className="text-center">
                      <img
                        src={work.afterImage}
                        alt="造型后"
                        className="w-full h-24 object-cover rounded-lg cursor-pointer"
                        onClick={() => setSelectedImage(work.afterImage!)}
                      />
                      <p className="text-xs text-gray-600 mt-1">造型后</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 作品信息 */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{work.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{work.description}</p>

                {/* 标签 */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {work.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* 互动按钮 */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLike(work.id)}
                      className={`flex items-center text-sm ${
                        work.liked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
                      }`}
                    >
                      <Heart className={`h-4 w-4 mr-1 ${work.liked ? 'fill-current' : ''}`} />
                      {work.likes}
                    </button>
                    <button className="flex items-center text-sm text-gray-600 hover:text-blue-600">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {work.comments}
                    </button>
                  </div>
                  <button className="flex items-center text-sm text-gray-600 hover:text-blue-600">
                    <Share2 className="h-4 w-4 mr-1" />
                    分享
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredWorks.length === 0 && (
          <div className="text-center py-12">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">暂无符合条件的作品</p>
          </div>
        )}
      </div>

      {/* 图片预览模态框 */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="预览"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}

export default BarberWorksPage