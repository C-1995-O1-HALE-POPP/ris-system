const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (window.location.hostname === 'localhost' ? 'http://localhost:3000/api' : window.location.origin + '/api')

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Something went wrong')
  }
  return response.json()
}

const handleAPIError = (error) => {
  console.error('API Error:', error)
  return error.message || 'An unexpected error occurred'
}

// 模拟API请求延迟
const mockDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const authAPI = {
  login: async (credentials) => {
    await mockDelay(500) // 模拟网络延迟
    if (credentials.username === 'patient001' && credentials.password === '123456') {
      return {
        user: {
          id: 'user_patient_001',
          username: 'patient001',
          role: 'patient',
          email: 'patient@example.com',
          avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=patient001'
        },
        token: 'mock_patient_token'
      }
    } else if (credentials.username === 'admin001' && credentials.password === '123456') {
      return {
        user: {
          id: 'user_admin_001',
          username: 'admin001',
          role: 'admin',
          email: 'admin@example.com',
          avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=admin001'
        },
        token: 'mock_admin_token'
      }
    } else {
      throw new Error('用户名或密码错误')
    }
  },
  register: async (userData) => {
    await mockDelay(500)
    // 模拟注册成功
    return { message: '注册成功', userId: 'new_user_' + Date.now() }
  },
  refreshToken: async () => {
    await mockDelay(500)
    return { token: 'new_mock_token' }
  },
  logout: async () => {
    await mockDelay(200)
    return { message: '登出成功' }
  },
}

const characterAPI = {
  getCharacters: async () => {
    await mockDelay(500)
    return [
      {
        id: 'char_001',
        name: '小慧',
        avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=xiaohui',
        description: '一个活泼开朗的AI伙伴，善于倾听和鼓励。',
      },
      {
        id: 'char_002',
        name: '老王',
        avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=laowang',
        description: '一位经验丰富的老者，充满智慧和人生阅历。',
      },
    ]
  },
  createCharacter: async (characterData) => {
    await mockDelay(500)
    return { ...characterData, id: 'char_' + Date.now() }
  },
  updateCharacter: async (id, characterData) => {
    await mockDelay(500)
    return { ...characterData, id }
  },
  deleteCharacter: async (id) => {
    await mockDelay(500)
    return { message: '角色删除成功' }
  },
}

const chatAPI = {
  sendMessage: async (message) => {
    await mockDelay(800)
    // 模拟AI回复
    const aiResponse = {
      id: Date.now() + 1,
      type: 'ai',
      content: `您好，我是${message.personaId === 'char_001' ? '小慧' : '老王'}，很高兴与您交流。您刚才说的是：${message.content}`,
      messageType: 'text',
      personaId: message.personaId,
      userId: 'ai_user',
      timestamp: new Date().toISOString(),
    }
    return aiResponse
  },
  getChatHistory: async (userId, personaId) => {
    await mockDelay(500)
    return [] // 暂时返回空历史记录
  },
}

const emotionAPI = {
  analyzeText: async (text) => {
    await mockDelay(500)
    // 模拟情绪分析结果
    const emotions = ['积极', '消极', '中性']
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)]
    return {
      emotion: randomEmotion,
      intensity: Math.floor(Math.random() * 100),
      confidence: Math.floor(Math.random() * 100),
      pad: {
        pleasure: Math.random() * 2 - 1,
        arousal: Math.random() * 2 - 1,
        dominance: Math.random() * 2 - 1,
      },
    }
  },
  analyzeVoice: async (audioFile) => {
    await mockDelay(1000)
    const emotions = ['积极', '消极', '中性']
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)]
    return {
      emotion: randomEmotion,
      intensity: Math.floor(Math.random() * 100),
      confidence: Math.floor(Math.random() * 100),
      pad: {
        pleasure: Math.random() * 2 - 1,
        arousal: Math.random() * 2 - 1,
        dominance: Math.random() * 2 - 1,
      },
    }
  },
  getEmotionHistory: async (userId) => {
    await mockDelay(500)
    return [] // 暂时返回空历史记录
  },
}

const reportAPI = {
  getOverallReport: async (userId) => {
    await mockDelay(500)
    return {
      totalInteractions: 120,
      avgEmotionScore: 0.75,
      positiveEmotionRatio: 0.85,
      cognitiveImprovement: 0.15,
    }
  },
  getEmotionTrend: async (userId, period) => {
    await mockDelay(500)
    // 模拟情绪趋势数据
    const data = []
    for (let i = 0; i < 7; i++) {
      data.push({
        date: `2025-07-${10 + i}`,
        positive: Math.floor(Math.random() * 50) + 50,
        negative: Math.floor(Math.random() * 20),
        neutral: Math.floor(Math.random() * 30),
      })
    }
    return data
  },
  getEmotionDistribution: async (userId) => {
    await mockDelay(500)
    return [
      { name: '积极', value: 60 },
      { name: '消极', value: 15 },
      { name: '中性', value: 25 },
    ]
  },
  getMemoryCategoryAnalysis: async (userId) => {
    await mockDelay(500)
    return [
      { category: '家庭', positive: 30, negative: 5, neutral: 10 },
      { category: '工作', positive: 15, negative: 8, neutral: 7 },
      { category: '童年', positive: 25, negative: 2, neutral: 3 },
    ]
  },
  getCharacterInteraction: async (userId) => {
    await mockDelay(500)
    return [
      { name: '小慧', interactions: 80, satisfaction: 4.5 },
      { name: '老王', interactions: 40, satisfaction: 4.0 },
    ]
  },
  getPADTrend: async (userId, period) => {
    await mockDelay(500)
    const data = []
    for (let i = 0; i < 7; i++) {
      data.push({
        date: `2025-07-${10 + i}`,
        pleasure: Math.random() * 2 - 1,
        arousal: Math.random() * 2 - 1,
        dominance: Math.random() * 2 - 1,
      })
    }
    return data
  },
}

export { authAPI, characterAPI, chatAPI, emotionAPI, reportAPI, handleAPIError }


