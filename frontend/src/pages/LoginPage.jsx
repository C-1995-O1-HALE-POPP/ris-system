import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUser } from '../store/authSlice'
import { authAPI, handleAPIError } from '../services/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Heart, Brain, Users, Loader2 } from 'lucide-react'
import '../App.css'

const LoginPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const userData = await authAPI.login({ username, password })
      
      // 存储认证token
      if (userData.token) {
        localStorage.setItem("authToken", userData.token)
      }
      
      // 更新Redux状态
      dispatch(setUser(userData.user))
      
      // 根据用户角色导航到不同页面
      if (userData.user.role === "admin") {
        navigate("/admin")
      } else {
        navigate("/chat")
      }
    } catch (error) {
      setError(handleAPIError(error))
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async (role) => {
    setError('')
    setLoading(true)
    
    try {
      let demoCredentials
      if (role === 'patient') {
        demoCredentials = { username: 'patient001', password: '123456' }
      } else {
        demoCredentials = { username: 'admin', password: 'admin123' }
      }
      
      const userData = await authAPI.login(demoCredentials)
      
      if (userData.token) {
        localStorage.setItem("authToken", userData.token)
      }
      
      dispatch(setUser(userData.user))
      
      if (userData.user.role === "admin") {
        navigate("/admin")
      } else {
        navigate("/chat")
      }
    } catch (error) {
      setError(handleAPIError(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* 左侧介绍 */}
        <div className="space-y-8">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              RIS回忆交互系统
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              基于AI的认知症患者数字疗愈平台
            </p>
          </div>

          <div className="grid gap-6">
            <div className="flex items-start space-x-4">
              <div className="bg-pink-100 p-3 rounded-lg">
                <Heart className="h-6 w-6 text-pink-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">情感陪伴</h3>
                <p className="text-gray-600">通过数字人格提供温暖的情感支持和陪伴</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">认知训练</h3>
                <p className="text-gray-600">个性化的认知康复训练和回忆疗法</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">多模态分析</h3>
                <p className="text-gray-600">实时情绪识别和智能干预决策</p>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧登录表单 */}
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">欢迎登录</CardTitle>
            <CardDescription>
              请输入您的账号信息以访问系统
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">用户名</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="请输入用户名"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="请输入密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    登录中...
                  </>
                ) : (
                  '登录'
                )}
              </Button>
            </form>

            <div className="mt-6">
              <div className="text-center text-sm text-gray-600 mb-4">
                演示账号
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => handleDemoLogin('patient')}
                  disabled={loading}
                  className="text-sm"
                >
                  患者用户
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleDemoLogin('admin')}
                  disabled={loading}
                  className="text-sm"
                >
                  管理员
                </Button>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">
                点击上方按钮可快速填入演示账号信息
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default LoginPage

