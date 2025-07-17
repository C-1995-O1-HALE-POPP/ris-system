import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { emotionAPI, handleAPIError } from '../services/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Heart, Brain, Activity, Mic, MicOff, Loader2, AlertCircle } from 'lucide-react'
import '../App.css'

const EmotionPage = () => {
  const [textInput, setTextInput] = useState('')
  const [emotionResult, setEmotionResult] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [physiologicalData, setPhysiologicalData] = useState({
    heartRate: 72,
    stressLevel: 3,
    engagement: 7,
    arousal: 5
  })
  const [emotionHistory, setEmotionHistory] = useState([])
  const [error, setError] = useState('')
  
  const { user } = useSelector(state => state.auth)

  useEffect(() => {
    // 加载当前情绪状态和生理数据
    loadCurrentEmotionState()
    loadPhysiologicalData()
    
    // 模拟实时数据更新
    const interval = setInterval(() => {
      updatePhysiologicalData()
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])

  const loadCurrentEmotionState = async () => {
    try {
      if (user?.id) {
        const currentState = await monitoringAPI.getCurrentEmotionState(user.id)
        setEmotionResult(currentState)
      }
    } catch (error) {
      console.error('Failed to load current emotion state:', handleAPIError(error))
    }
  }

  const loadPhysiologicalData = async () => {
    try {
      if (user?.id) {
        const data = await monitoringAPI.getPhysiologicalData(user.id)
        setPhysiologicalData(data)
      }
    } catch (error) {
      console.error('Failed to load physiological data:', handleAPIError(error))
    }
  }

  const updatePhysiologicalData = () => {
    // 模拟生理数据的微小变化
    setPhysiologicalData(prev => ({
      heartRate: Math.max(60, Math.min(100, prev.heartRate + (Math.random() - 0.5) * 4)),
      stressLevel: Math.max(1, Math.min(10, prev.stressLevel + (Math.random() - 0.5) * 0.5)),
      engagement: Math.max(1, Math.min(10, prev.engagement + (Math.random() - 0.5) * 0.5)),
      arousal: Math.max(1, Math.min(10, prev.arousal + (Math.random() - 0.5) * 0.5))
    }))
  }

  const analyzeTextEmotion = async () => {
    if (!textInput.trim()) {
      setError('请输入要分析的文本')
      return
    }

    setIsAnalyzing(true)
    setError('')

    try {
      const result = await emotionAPI.analyzeText(textInput)
      setEmotionResult(result)
      
      // 添加到历史记录
      const historyItem = {
        id: Date.now(),
        text: textInput,
        result: result,
        timestamp: new Date().toISOString(),
        type: 'text'
      }
      setEmotionHistory(prev => [historyItem, ...prev.slice(0, 9)]) // 保留最近10条记录
      
      setTextInput('')
    } catch (error) {
      setError(handleAPIError(error))
    } finally {
      setIsAnalyzing(false)
    }
  }

  const toggleVoiceRecording = () => {
    setIsRecording(!isRecording)
    
    if (!isRecording) {
      // 开始录音
      console.log('开始录音...')
      // 这里可以集成语音识别API
      
      // 模拟录音结果
      setTimeout(() => {
        setIsRecording(false)
        setTextInput('这是通过语音输入的文本示例')
      }, 3000)
    } else {
      // 停止录音
      console.log('停止录音...')
    }
  }

  const getEmotionColor = (type) => {
    switch (type) {
      case 'positive': return 'bg-green-100 text-green-800 border-green-200'
      case 'negative': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getEmotionLabel = (type) => {
    switch (type) {
      case 'positive': return '积极'
      case 'negative': return '消极'
      default: return '中性'
    }
  }

  const getStressLevelColor = (level) => {
    if (level <= 3) return 'text-green-600'
    if (level <= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getEngagementColor = (level) => {
    if (level >= 7) return 'text-green-600'
    if (level >= 4) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">实时情绪监测</h1>
        <p className="text-gray-600">通过多模态分析了解您的情绪状态</p>
      </div>

      <Tabs defaultValue="realtime" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="realtime">实时监测</TabsTrigger>
          <TabsTrigger value="analysis">情绪分析</TabsTrigger>
        </TabsList>

        <TabsContent value="realtime" className="space-y-6">
          {/* 当前情绪状态 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                当前情绪状态
              </CardTitle>
            </CardHeader>
            <CardContent>
              {emotionResult ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <Badge className={`text-lg px-4 py-2 ${getEmotionColor(emotionResult.type)}`}>
                      {getEmotionLabel(emotionResult.type)}
                    </Badge>
                    <p className="text-sm text-gray-600 mt-2">情绪类型</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round(emotionResult.intensity * 100)}%
                    </div>
                    <p className="text-sm text-gray-600">强度</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round(emotionResult.confidence * 100)}%
                    </div>
                    <p className="text-sm text-gray-600">置信度</p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>暂无情绪数据</p>
                  <p className="text-sm">请在情绪分析页面进行文本或语音分析</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 生理指标监测 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                生理指标监测
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Heart className="h-6 w-6 text-red-500 mr-2" />
                    <span className="text-lg font-semibold">心率</span>
                  </div>
                  <div className="text-3xl font-bold text-red-600 mb-2">
                    {Math.round(physiologicalData.heartRate)}
                  </div>
                  <div className="text-sm text-gray-600">次/分钟</div>
                  <Progress 
                    value={(physiologicalData.heartRate - 60) / 40 * 100} 
                    className="mt-2"
                  />
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <AlertCircle className="h-6 w-6 text-orange-500 mr-2" />
                    <span className="text-lg font-semibold">压力水平</span>
                  </div>
                  <div className={`text-3xl font-bold mb-2 ${getStressLevelColor(physiologicalData.stressLevel)}`}>
                    {physiologicalData.stressLevel.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600">1-10级</div>
                  <Progress 
                    value={physiologicalData.stressLevel * 10} 
                    className="mt-2"
                  />
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Brain className="h-6 w-6 text-blue-500 mr-2" />
                    <span className="text-lg font-semibold">参与度</span>
                  </div>
                  <div className={`text-3xl font-bold mb-2 ${getEngagementColor(physiologicalData.engagement)}`}>
                    {physiologicalData.engagement.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600">1-10级</div>
                  <Progress 
                    value={physiologicalData.engagement * 10} 
                    className="mt-2"
                  />
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Activity className="h-6 w-6 text-green-500 mr-2" />
                    <span className="text-lg font-semibold">唤醒度</span>
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {physiologicalData.arousal.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600">1-10级</div>
                  <Progress 
                    value={physiologicalData.arousal * 10} 
                    className="mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          {/* 文本情绪分析 */}
          <Card>
            <CardHeader>
              <CardTitle>文本情绪分析</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Textarea
                  placeholder="请输入您想要分析的文本内容..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  rows={4}
                  disabled={isAnalyzing}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex space-x-2">
                <Button 
                  onClick={analyzeTextEmotion}
                  disabled={isAnalyzing || !textInput.trim()}
                  className="flex-1"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      分析中...
                    </>
                  ) : (
                    '分析情绪'
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={toggleVoiceRecording}
                  disabled={isAnalyzing}
                  className={isRecording ? 'text-red-600' : ''}
                >
                  {isRecording ? (
                    <>
                      <MicOff className="mr-2 h-4 w-4" />
                      停止录音
                    </>
                  ) : (
                    <>
                      <Mic className="mr-2 h-4 w-4" />
                      语音输入
                    </>
                  )}
                </Button>
              </div>

              {isRecording && (
                <Alert>
                  <Mic className="h-4 w-4" />
                  <AlertDescription>
                    正在录音中，请说出您想要分析的内容...
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* 分析结果 */}
          {emotionResult && (
            <Card>
              <CardHeader>
                <CardTitle>分析结果</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">情绪概览</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>情绪类型:</span>
                        <Badge className={getEmotionColor(emotionResult.type)}>
                          {getEmotionLabel(emotionResult.type)}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>强度:</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={emotionResult.intensity * 100} className="w-20" />
                          <span className="text-sm font-medium">
                            {Math.round(emotionResult.intensity * 100)}%
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>置信度:</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={emotionResult.confidence * 100} className="w-20" />
                          <span className="text-sm font-medium">
                            {Math.round(emotionResult.confidence * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {emotionResult.analysis && (
                    <div>
                      <h4 className="font-semibold mb-3">详细分析</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>积极评分:</span>
                          <span className="font-medium">{emotionResult.analysis.positiveScore}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>消极评分:</span>
                          <span className="font-medium">{emotionResult.analysis.negativeScore}</span>
                        </div>
                        {emotionResult.analysis.keywords && emotionResult.analysis.keywords.length > 0 && (
                          <div>
                            <span className="block mb-1">关键词:</span>
                            <div className="flex flex-wrap gap-1">
                              {emotionResult.analysis.keywords.map((keyword, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 历史记录 */}
          {emotionHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>分析历史</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {emotionHistory.map((item) => (
                    <div key={item.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <Badge className={`${getEmotionColor(item.result.type)} text-xs`}>
                          {getEmotionLabel(item.result.type)}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(item.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{item.text}</p>
                      <div className="flex space-x-4 text-xs text-gray-600">
                        <span>强度: {Math.round(item.result.intensity * 100)}%</span>
                        <span>置信度: {Math.round(item.result.confidence * 100)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default EmotionPage

