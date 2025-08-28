import { Link } from 'react-router-dom'
import { Scissors, Users, MapPin, Star, Smartphone, Zap, Sparkles, Brain, ArrowRight, CheckCircle, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import AdBanner from '@/components/AdBanner'
import { Button } from '@/components/ui/Button'
import { MagicCard } from '@/components/ui/MagicCard'
import { AnimatedText } from '@/components/ui/AnimatedText'
import { GradientText } from '@/components/ui/GradientText'
import { ShimmerButton } from '@/components/ui/ShimmerButton'
import { GradientButton } from '@/components/ui/GradientButton'
import { GridPattern } from '@/components/ui/GridPattern'

const features = [
  {
    icon: Zap,
    title: "SaaS智能化管理",
    description: "智能排程、客户管理、收费设置，让理发师专注于服务",
    color: "text-blue-600",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Brain,
    title: "AI客服咨询",
    description: "24小时智能客服，专业发型建议，提升用户体验",
    color: "text-green-600",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: Star,
    title: "流量变现工具",
    description: "多平台广告投放，智能内容生成，帮助理发师增收",
    color: "text-purple-600",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: Sparkles,
    title: "3D试发型功能",
    description: "先进的3D技术，让用户在预约前看到发型效果",
    color: "text-yellow-600",
    gradient: "from-yellow-500 to-orange-500"
  },
  {
    icon: MapPin,
    title: "共享工位",
    description: "灵活的工位管理，降低成本，提高效率",
    color: "text-red-600",
    gradient: "from-red-500 to-rose-500"
  },
  {
    icon: Scissors,
    title: "低成本消费",
    description: "优惠券系统、动态定价，让用户享受实惠服务",
    color: "text-indigo-600",
    gradient: "from-indigo-500 to-blue-500"
  }
]

const stats = [
  { value: "10,000+", label: "注册用户", icon: Users },
  { value: "500+", label: "合作理发师", icon: Scissors },
  { value: "50+", label: "合作门店", icon: MapPin },
  { value: "4.9", label: "用户评分", icon: Star }
]

function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <GridPattern 
          squares={[[4, 4], [5, 1], [8, 2], [5, 3], [10, 6]]}
          className="absolute inset-0 opacity-30"
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-6">
                <Sparkles className="h-4 w-4 mr-2" />
                全新AI驱动理发平台
              </span>
            </motion.div>

            <div className="mb-8">
              <AnimatedText
                text="为了创造更好的理发体验而生"
                className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent"
                delay={0.3}
                staggerDelay={0.1}
              />
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl md:text-2xl mb-8 text-gray-600 max-w-3xl mx-auto"
            >
              智能化理发平台，连接理发师与用户，提供全方位的美发服务体验
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <GradientButton size="lg" asChild>
                <Link to="/login">
                  立即体验
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </GradientButton>
              <ShimmerButton size="lg" variant="outline" asChild>
                <Link to="/3d-try">
                  <Sparkles className="h-4 w-4 mr-2" />
                  体验3D试发型
                </Link>
              </ShimmerButton>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-gray-200"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center mb-2">
                    <stat.icon className="h-6 w-6 text-blue-600 mr-2" />
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              平台特色功能
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              集成最新技术，提供完整的理发服务解决方案
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <MagicCard 
                  className="h-full text-center"
                  gradientColor={feature.color.replace('text-', '#')}
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="mt-6">
                    <Button variant="ghost" size="sm" className={feature.color}>
                      了解更多
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </MagicCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              平台服务
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              全方位的服务支持，助力理发师事业发展
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <MagicCard className="h-full" gradientColor="#059669">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">运营服务</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    "智能内容生成和营销策略",
                    "多平台运营指导",
                    "专业客服外包服务",
                    "门店选址和装修建议"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </MagicCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <MagicCard className="h-full" gradientColor="#7c3aed">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center mr-4">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">成长服务</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    "视频课程和直播教学",
                    "技能提升培训体系",
                    "行业最佳实践分享",
                    "数据分析和业务优化"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <CheckCircle className="h-5 w-5 text-purple-500 mr-3 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </MagicCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 广告展示区域 */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <AdBanner />
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <GridPattern 
          squares={[[2, 1], [4, 3], [6, 5], [8, 2]]}
          className="absolute inset-0 opacity-20"
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              开始您的理发事业新篇章
            </h2>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              加入我们的平台，体验智能化的理发服务管理，开启全新的创业之旅
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <ShimmerButton 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-50 shadow-2xl"
                shimmerColor="rgba(59, 130, 246, 0.3)"
                asChild
              >
                <Link to="/login">
                  立即注册
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </ShimmerButton>
              <GradientButton 
                size="lg" 
                variant="outline" 
                gradient="from-white via-blue-100 to-white"
                className="border-white text-white hover:bg-white/10 backdrop-blur-sm"
                asChild
              >
                <Link to="/barbers">
                  浏览理发师
                  <Users className="h-4 w-4 ml-2" />
                </Link>
              </GradientButton>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default HomePage