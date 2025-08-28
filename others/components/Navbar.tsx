import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, LogOut, Scissors, Users, Package, Image, Calendar, Settings, Sparkles, Zap, MapPin, Menu, X, Store, Monitor, DollarSign, MessageCircle, Palette, Tag } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/NavigationMenu"
import { cn } from "@/lib/utils"

// 未登录状态 - 用户服务菜单
const userServices = [
  {
    title: "理发师选择",
    href: "/barbers",
    description: "找到最适合的专业理发师",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    title: "套餐选择", 
    href: "/packages",
    description: "多种服务套餐可选",
    icon: Package,
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    title: "作品展示",
    href: "/works", 
    description: "查看理发师精彩作品",
    icon: Image,
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  },
  {
    title: "在线预约",
    href: "/booking",
    description: "快速便捷的预约服务",
    icon: Calendar,
    color: "text-orange-600", 
    bgColor: "bg-orange-50"
  }
]

// 未登录状态 - 平台功能菜单
const publicFeatures = [
  {
    title: "3D试发型",
    href: "/3d-try",
    description: "先进的3D技术预览发型效果",
    icon: Sparkles,
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  },
  {
    title: "AI客服咨询",
    href: "/ai-consultant", 
    description: "24小时智能客服专业建议",
    icon: Zap,
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  }
]

// 登录状态 - 平台管理菜单
const platformManagement = [
  {
    title: "门店管理",
    href: "/admin/stores",
    description: "门店信息维护和设置",
    icon: Store,
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    title: "设备维护",
    href: "/admin/equipment",
    description: "设备状态监控和维护",
    icon: Monitor,
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    title: "工位维护",
    href: "/admin/workstations",
    description: "工位状态和配置管理",
    icon: MapPin,
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  },
  {
    title: "费用核算",
    href: "/admin/finance",
    description: "财务数据统计分析",
    icon: DollarSign,
    color: "text-orange-600",
    bgColor: "bg-orange-50"
  }
]

// 登录状态 - 理发师功能菜单
const barberFeatures = [
  {
    title: "作品管理",
    href: "/barber/works",
    description: "管理个人作品集",
    icon: Palette,
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  },
  {
    title: "套餐管理",
    href: "/barber/packages",
    description: "创建和编辑服务套餐",
    icon: Package,
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    title: "价格管理",
    href: "/barber/pricing",
    description: "设置服务价格体系",
    icon: Tag,
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    title: "客户沟通",
    href: "/barber/chat",
    description: "与客户在线交流",
    icon: MessageCircle,
    color: "text-orange-600",
    bgColor: "bg-orange-50"
  }
]

function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Scissors className="h-8 w-8 text-blue-600" />
          </motion.div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            理发平台
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              {!isAuthenticated ? (
                <>
                  {/* 未登录状态 - 用户服务菜单 */}
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-sm font-medium">
                      服务中心
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid w-[600px] gap-3 p-6 md:grid-cols-2">
                        {userServices.map((service) => (
                          <NavigationMenuLink key={service.href} asChild>
                            <Link
                              to={service.href}
                              className={cn(
                                "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground group"
                              )}
                            >
                              <div className="flex items-center space-x-3">
                                <div className={cn("p-2 rounded-lg", service.bgColor)}>
                                  <service.icon className={cn("h-5 w-5", service.color)} />
                                </div>
                                <div>
                                  <div className="text-sm font-medium leading-none group-hover:text-blue-600 transition-colors">
                                    {service.title}
                                  </div>
                                  <p className="line-clamp-2 text-xs leading-snug text-muted-foreground mt-1">
                                    {service.description}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  {/* 未登录状态 - 平台功能菜单 */}
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-sm font-medium">
                      平台功能
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid w-[400px] gap-3 p-6">
                        {publicFeatures.map((feature) => (
                          <NavigationMenuLink key={feature.href} asChild>
                            <Link
                              to={feature.href}
                              className={cn(
                                "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground group"
                              )}
                            >
                              <div className="flex items-center space-x-3">
                                <div className={cn("p-2 rounded-lg", feature.bgColor)}>
                                  <feature.icon className={cn("h-5 w-5", feature.color)} />
                                </div>
                                <div>
                                  <div className="text-sm font-medium leading-none group-hover:text-blue-600 transition-colors">
                                    {feature.title}
                                  </div>
                                  <p className="line-clamp-2 text-xs leading-snug text-muted-foreground mt-1">
                                    {feature.description}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </>
              ) : (
                <>
                  {/* 登录状态 - 平台管理菜单 */}
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-sm font-medium">
                      平台管理
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid w-[600px] gap-3 p-6 md:grid-cols-2">
                        {platformManagement.map((item) => (
                          <NavigationMenuLink key={item.href} asChild>
                            <Link
                              to={item.href}
                              className={cn(
                                "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground group"
                              )}
                            >
                              <div className="flex items-center space-x-3">
                                <div className={cn("p-2 rounded-lg", item.bgColor)}>
                                  <item.icon className={cn("h-5 w-5", item.color)} />
                                </div>
                                <div>
                                  <div className="text-sm font-medium leading-none group-hover:text-blue-600 transition-colors">
                                    {item.title}
                                  </div>
                                  <p className="line-clamp-2 text-xs leading-snug text-muted-foreground mt-1">
                                    {item.description}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  {/* 登录状态 - 理发师功能菜单 */}
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-sm font-medium">
                      理发师工具
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid w-[600px] gap-3 p-6 md:grid-cols-2">
                        {barberFeatures.map((feature) => (
                          <NavigationMenuLink key={feature.href} asChild>
                            <Link
                              to={feature.href}
                              className={cn(
                                "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground group"
                              )}
                            >
                              <div className="flex items-center space-x-3">
                                <div className={cn("p-2 rounded-lg", feature.bgColor)}>
                                  <feature.icon className={cn("h-5 w-5", feature.color)} />
                                </div>
                                <div>
                                  <div className="text-sm font-medium leading-none group-hover:text-blue-600 transition-colors">
                                    {feature.title}
                                  </div>
                                  <p className="line-clamp-2 text-xs leading-snug text-muted-foreground mt-1">
                                    {feature.description}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </>
              )}

              {/* 关于我们 - 始终显示 */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/about"
                    className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                  >
                    关于我们
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* User Menu & Mobile Menu */}
        <div className="flex items-center space-x-4">
          {/* User Authentication */}
          {isAuthenticated ? (
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard">
                  <Settings className="h-4 w-4 mr-2" />
                  控制台
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin">
                  <User className="h-4 w-4 mr-2" />
                  管理
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                退出
              </Button>
            </div>
          ) : (
            <Button asChild className="hidden md:flex">
              <Link to="/login">
                <User className="h-4 w-4 mr-2" />
                登录
              </Link>
            </Button>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t bg-background"
          >
            <div className="container mx-auto p-4 space-y-4">
              {!isAuthenticated ? (
                <>
                  {/* 未登录状态 - 用户服务 */}
                  <div className="grid grid-cols-2 gap-4">
                    {userServices.map((service) => (
                      <Link
                        key={service.href}
                        to={service.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center space-x-2 p-3 rounded-lg hover:bg-accent transition-colors"
                      >
                        <service.icon className={cn("h-4 w-4", service.color)} />
                        <span className="text-sm font-medium">{service.title}</span>
                      </Link>
                    ))}
                  </div>
                  
                  {/* 未登录状态 - 平台功能 */}
                  <div className="border-t pt-4">
                    <div className="grid grid-cols-1 gap-2">
                      {publicFeatures.map((feature) => (
                        <Link
                          key={feature.href}
                          to={feature.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent transition-colors"
                        >
                          <feature.icon className={cn("h-4 w-4", feature.color)} />
                          <span className="text-sm">{feature.title}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* 登录状态 - 平台管理 */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-3">平台管理</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {platformManagement.map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent transition-colors"
                        >
                          <item.icon className={cn("h-4 w-4", item.color)} />
                          <span className="text-sm">{item.title}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                  
                  {/* 登录状态 - 理发师工具 */}
                  <div className="border-t pt-4">
                    <h3 className="text-sm font-medium text-gray-600 mb-3">理发师工具</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {barberFeatures.map((feature) => (
                        <Link
                          key={feature.href}
                          to={feature.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent transition-colors"
                        >
                          <feature.icon className={cn("h-4 w-4", feature.color)} />
                          <span className="text-sm">{feature.title}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Mobile Auth */}
              <div className="border-t pt-4">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      <span className="text-sm">用户控制台</span>
                    </Link>
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent transition-colors"
                    >
                      <User className="h-4 w-4" />
                      <span className="text-sm">管理中心</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout()
                        setMobileMenuOpen(false)
                      }}
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent transition-colors w-full text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="text-sm">退出登录</span>
                    </button>
                  </div>
                ) : (
                  <Button asChild className="w-full">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      <User className="h-4 w-4 mr-2" />
                      登录
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar