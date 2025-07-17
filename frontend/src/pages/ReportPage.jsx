import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { reportAPI, handleAPIError } from '../services/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, LineChart, Line } from 'recharts'
import { TrendingUp, Heart, Brain, Users, Download, Calendar, BarChart3, PieChart as PieChartIcon, Activity, AlertCircle } from 'lucide-react'
import '../App.css'

const ReportPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const [weeklyTrend, setWeeklyTrend] = useState([])
  const [memoryClassification, setMemoryClassification] = useState({})
  const [padTrends, setPadTrends] = useState([])
  const [characterInteractions, setCharacterInteractions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { user } = useSelector(state => state.auth)

  useEffect(() => {
    loadReportData()
  }, [selectedPeriod, user])

  const loadReportData = async () => {
    if (!user?.id) return
    
    setLoading(true)
    setError('')
    
    try {
      // 并行加载所有报告数据
      const [
        weeklyTrendData,
        memoryClassificationData,
        padTrendsData,
        characterInteractionsData
      ] = await Promise.all([
        reportAPI.getEmotionTrend(user.id, 'week'),
        reportAPI.getMemoryCategoryAnalysis(user.id),
        reportAPI.getPADTrend(user.id, 'week'),
        reportAPI.getCharacterInteraction(user.id)
      ])
      
      setWeeklyTrend(weeklyTrendData)
      setMemoryClassification(memoryClassificationData)
      setPadTrends(padTrendsData)
      setCharacterInteractions(characterInteractionsData)
    } catch (error) {
      setError(handleAPIError(error))
      console.error('Failed to load report data:', error)
      
      // 如果API失败，使用本地mock数据作为后备
      loadMockData()
    } finally {
      setLoading(false)
    }
  }

  const loadMockData = () => {
    // 使用本地mock数据作为后备
    setWeeklyTrend([
      { date: "2024-12-14", positive: 65, negative: 20, neutral: 15 },
      { date: "2024-12-15", positive: 70, negative: 15, neutral: 15 },
      { date: "2024-12-16", positive: 60, negative: 25, neutral: 15 },
      { date: "2024-12-17", positive: 75, negative: 10, neutral: 15 },
      { date: "2024-12-18", positive: 80, negative: 10, neutral: 10 },
      { date: "2024-12-19", positive: 85, negative: 5, neutral: 10 },
      { date: "2024-12-20", positive: 90, negative: 5, neutral: 5 },
    ])
    
    setMemoryClassification({
      positive: [
        { content: "和老伴的散步时光", timestamp: "2024-12-20T09:01:00Z", intensity: 0.8 },
        { content: "孙子的生日聚会", timestamp: "2024-12-19T14:30:00Z", intensity: 0.9 },
        { content: "年轻时的工作成就", timestamp: "2024-12-18T16:15:00Z", intensity: 0.7 },
      ],
      negative: [
        { content: "思念已故的老伴", timestamp: "2024-12-17T20:00:00Z", intensity: 0.6 },
        { content: "担心身体健康", timestamp: "2024-12-16T11:30:00Z", intensity: 0.5 },
      ],
      neutral: [
        { content: "今天的天气情况", timestamp: "2024-12-20T09:00:00Z", intensity: 0.3 },
        { content: "电视节目讨论", timestamp: "2024-12-19T19:00:00Z", intensity: 0.2 },
      ]
    })
    
    setPadTrends([
      { date: "2024-12-14", pleasure: 6.5, arousal: 4.2, dominance: 5.8 },
      { date: "2024-12-15", pleasure: 7.0, arousal: 4.5, dominance: 6.0 },
      { date: "2024-12-16", pleasure: 6.0, arousal: 3.8, dominance: 5.5 },
      { date: "2024-12-17", pleasure: 7.5, arousal: 5.0, dominance: 6.2 },
      { date: "2024-12-18", pleasure: 8.0, arousal: 5.2, dominance: 6.5 },
      { date: "2024-12-19", pleasure: 8.5, arousal: 5.5, dominance: 6.8 },
      { date: "2024-12-20", pleasure: 9.0, arousal: 6.0, dominance: 7.0 },
    ])
    
    setCharacterInteractions([
      { name: "小慧", interactions: 45, satisfaction: 4.8, avgDuration: 12 },
      { name: "老王", interactions: 23, satisfaction: 4.5, avgDuration: 8 },
    ])
  }

  const exportReport = async () => {
    try {
      const reportData = await reportsAPI.exportReport({ 
        userId: user.id,
        period: selectedPeriod,
        format: 'json'
      })
      
      // 创建下载链接
      const dataStr = JSON.stringify(reportData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `emotion_report_${new Date().toISOString().split('T')[0]}.json`
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export report:', handleAPIError(error))
    }
  }

  // 计算概览统计
  const overviewStats = React.useMemo(() => {
    const totalInteractions = characterInteractions.reduce((sum, char) => sum + char.interactions, 0)
    const avgEmotionScore = weeklyTrend.length > 0 
      ? weeklyTrend.reduce((sum, day) => sum + day.positive, 0) / weeklyTrend.length 
      : 0
    const positiveRatio = weeklyTrend.length > 0
      ? weeklyTrend.reduce((sum, day) => sum + day.positive, 0) / (weeklyTrend.length * 100)
      : 0
    const cognitiveImprovement = padTrends.length > 1
      ? ((padTrends[padTrends.length - 1].pleasure - padTrends[0].pleasure) / padTrends[0].pleasure * 100)
      : 0

    return {
      totalInteractions,
      avgEmotionScore: avgEmotionScore.toFixed(1),
      positiveRatio: (positiveRatio * 100).toFixed(1),
      cognitiveImprovement: cognitiveImprovement.toFixed(1)
    }
  }, [weeklyTrend, characterInteractions, padTrends])

  // 情绪分布数据
  const emotionDistribution = React.useMemo(() => {
    if (weeklyTrend.length === 0) return []
    
    const totals = weeklyTrend.reduce((acc, day) => ({
      positive: acc.positive + day.positive,
      negative: acc.negative + day.negative,
      neutral: acc.neutral + day.neutral
    }), { positive: 0, negative: 0, neutral: 0 })

    return [
      { name: '积极', value: totals.positive, color: '#10B981' },
      { name: '消极', value: totals.negative, color: '#EF4444' },
      { name: '中性', value: totals.neutral, color: '#6B7280' }
    ]
  }, [weeklyTrend])

  // 回忆分类数据
  const memoryTypeDistribution = React.useMemo(() => {
    const positive = memoryClassification.positive?.length || 0
    const negative = memoryClassification.negative?.length || 0
    const neutral = memoryClassification.neutral?.length || 0
    
    return [
      { category: '家庭', positive: 8, negative: 2, neutral: 3 },
      { category: '工作', positive: 5, negative: 3, neutral: 4 },
      { category: '童年', positive: 12, negative: 1, neutral: 2 },
      { category: '健康', positive: 3, negative: 6, neutral: 5 },
      { category: '社交', positive: 7, negative: 2, neutral: 6 }
    ]
  }, [memoryClassification])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载报告数据中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* 页面标题和控制 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">分析报告</h1>
          <p className="text-gray-600 mt-1">情绪轨迹与认知康复分析</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">本周</SelectItem>
              <SelectItem value="month">本月</SelectItem>
              <SelectItem value="quarter">本季度</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={exportReport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            导出报告
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* 概览仪表板 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">总交互次数</p>
                <p className="text-2xl font-bold text-blue-600">{overviewStats.totalInteractions}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">平均情绪评分</p>
                <p className="text-2xl font-bold text-green-600">{overviewStats.avgEmotionScore}</p>
              </div>
              <Heart className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">积极情绪比例</p>
                <p className="text-2xl font-bold text-purple-600">{overviewStats.positiveRatio}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">认知改善度</p>
                <p className="text-2xl font-bold text-orange-600">{overviewStats.cognitiveImprovement}%</p>
              </div>
              <Brain className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="emotion" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="emotion">情绪趋势</TabsTrigger>
          <TabsTrigger value="memory">回忆分析</TabsTrigger>
          <TabsTrigger value="character">角色交互</TabsTrigger>
          <TabsTrigger value="pad">PAD分析</TabsTrigger>
        </TabsList>

        <TabsContent value="emotion" className="space-y-6">
          {/* 情绪趋势图 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                7天情绪变化趋势
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={weeklyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString('zh-CN')}
                    formatter={(value, name) => [value + '%', name === 'positive' ? '积极' : name === 'negative' ? '消极' : '中性']}
                  />
                  <Area type="monotone" dataKey="positive" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="neutral" stackId="1" stroke="#6B7280" fill="#6B7280" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="negative" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 情绪分布饼图 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChartIcon className="h-5 w-5 mr-2" />
                情绪类型分布
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={emotionDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {emotionDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="space-y-3">
                  {emotionDistribution.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <Badge variant="outline">{item.value}次</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="memory" className="space-y-6">
          {/* 回忆分类分析 */}
          <Card>
            <CardHeader>
              <CardTitle>回忆分类分析</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={memoryTypeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="positive" stackId="a" fill="#10B981" name="积极" />
                  <Bar dataKey="neutral" stackId="a" fill="#6B7280" name="中性" />
                  <Bar dataKey="negative" stackId="a" fill="#EF4444" name="消极" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 记忆详情 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">积极回忆</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {memoryClassification.positive?.map((memory, index) => (
                    <div key={index} className="border-l-4 border-green-500 pl-3">
                      <p className="text-sm font-medium">{memory.content}</p>
                      <p className="text-xs text-gray-500">
                        强度: {Math.round(memory.intensity * 100)}% • 
                        {new Date(memory.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-gray-600">中性回忆</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {memoryClassification.neutral?.map((memory, index) => (
                    <div key={index} className="border-l-4 border-gray-500 pl-3">
                      <p className="text-sm font-medium">{memory.content}</p>
                      <p className="text-xs text-gray-500">
                        强度: {Math.round(memory.intensity * 100)}% • 
                        {new Date(memory.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">消极回忆</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {memoryClassification.negative?.map((memory, index) => (
                    <div key={index} className="border-l-4 border-red-500 pl-3">
                      <p className="text-sm font-medium">{memory.content}</p>
                      <p className="text-xs text-gray-500">
                        强度: {Math.round(memory.intensity * 100)}% • 
                        {new Date(memory.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="character" className="space-y-6">
          {/* 角色交互统计 */}
          <Card>
            <CardHeader>
              <CardTitle>角色交互统计</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {characterInteractions.map((character, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {character.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold">{character.name}</h4>
                        <p className="text-sm text-gray-600">
                          {character.interactions}次交互 • 平均{character.avgDuration}分钟
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-500">★</span>
                        <span className="font-semibold">{character.satisfaction}</span>
                      </div>
                      <p className="text-xs text-gray-500">满意度评分</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pad" className="space-y-6">
          {/* PAD情绪模型趋势 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                PAD情绪模型趋势
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={padTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis domain={[0, 10]} />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString('zh-CN')}
                    formatter={(value, name) => [
                      value.toFixed(1), 
                      name === 'pleasure' ? '愉悦度' : name === 'arousal' ? '唤醒度' : '支配度'
                    ]}
                  />
                  <Line type="monotone" dataKey="pleasure" stroke="#10B981" strokeWidth={2} name="pleasure" />
                  <Line type="monotone" dataKey="arousal" stroke="#3B82F6" strokeWidth={2} name="arousal" />
                  <Line type="monotone" dataKey="dominance" stroke="#8B5CF6" strokeWidth={2} name="dominance" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* PAD指标说明 */}
          <Card>
            <CardHeader>
              <CardTitle>PAD情绪模型说明</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Heart className="h-8 w-8 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-green-600 mb-2">Pleasure (愉悦度)</h4>
                  <p className="text-sm text-gray-600">
                    衡量情绪的正面程度，数值越高表示越愉快、满足
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Activity className="h-8 w-8 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-blue-600 mb-2">Arousal (唤醒度)</h4>
                  <p className="text-sm text-gray-600">
                    衡量情绪的激活程度，数值越高表示越兴奋、活跃
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Brain className="h-8 w-8 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-purple-600 mb-2">Dominance (支配度)</h4>
                  <p className="text-sm text-gray-600">
                    衡量对情境的控制感，数值越高表示越有掌控力
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ReportPage

