import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/authSlice'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  MessageCircle, 
  Users, 
  Heart, 
  BarChart3, 
  Settings, 
  Shield,
  LogOut,
  Menu,
  X
} from 'lucide-react'
import '../App.css'

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const menuItems = [
    { path: '/chat', icon: MessageCircle, label: '聊天对话', color: 'text-blue-600' },
    { path: '/persona', icon: Users, label: '角色管理', color: 'text-green-600' },
    { path: '/emotion', icon: Heart, label: '情绪分析', color: 'text-red-600' },
    { path: '/report', icon: BarChart3, label: '分析报告', color: 'text-purple-600' },
    { path: '/settings', icon: Settings, label: '设置', color: 'text-gray-600' },
  ]

  // 管理员专用菜单
  if (user?.role === 'admin') {
    menuItems.push({ 
      path: '/admin', 
      icon: Shield, 
      label: '系统管理', 
      color: 'text-orange-600' 
    })
  }

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 侧边栏 */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <h1 className="text-xl font-bold text-gray-800">RIS系统</h1>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="mt-6 px-3">
          {menuItems.map((item) => (
            <Button
              key={item.path}
              variant={isActive(item.path) ? "default" : "ghost"}
              className={`w-full justify-start mb-2 h-12 ${
                isActive(item.path) 
                  ? 'bg-blue-50 text-blue-700 border-blue-200' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => {
                navigate(item.path)
                setSidebarOpen(false)
              }}
            >
              <item.icon className={`mr-3 h-5 w-5 ${isActive(item.path) ? 'text-blue-600' : item.color}`} />
              {item.label}
            </Button>
          ))}
        </nav>

        {/* 用户信息和退出 */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
          <div className="flex items-center space-x-3 mb-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.role === 'admin' ? '管理员' : '患者用户'}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            退出登录
          </Button>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 lg:ml-0">
        {/* 顶部导航栏 */}
        <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-6 lg:px-8">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex-1 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-lg font-semibold text-gray-900 ml-4 lg:ml-0">
              {menuItems.find(item => isActive(item.path))?.label || '回忆交互系统'}
            </h2>
            
            <div className="hidden lg:flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                欢迎回来，{user?.name}
              </div>
            </div>
          </div>
        </header>

        {/* 页面内容 */}
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* 移动端遮罩 */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

export default DashboardLayout

