// Mock用户数据
export const mockUsers = [
  {
    id: 'user_001',
    username: 'patient001',
    password: '123456',
    name: '张三',
    role: 'patient',
    avatar: '/avatars/patient.png',
    age: 72,
    condition: '轻度认知症',
    joinDate: '2024-01-15',
    lastLogin: '2024-12-20',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'user_002',
    username: 'admin',
    password: 'admin123',
    name: '李医生',
    role: 'admin',
    avatar: '/avatars/doctor.png',
    department: '神经内科',
    joinDate: '2023-06-01',
    lastLogin: '2024-12-20',
    createdAt: '2024-01-10T09:00:00Z'
  }
];

// Mock角色数据
export const mockCharacters = [
  {
    id: 'char_001',
    name: '小慧',
    avatar: '/avatars/xiaohui.png',
    mbtiType: 'ENFJ',
    zodiacSign: '巨蟹座',
    personality: '温暖贴心的陪伴助手，善于倾听和理解，总是能给予患者情感支持和鼓励。',
    speakingStyle: '温和亲切，语调轻柔，善用鼓励性词汇，偶尔使用一些温馨的比喻。',
    emotionalTriggers: ['孤独', '失落', '回忆', '家人'],
    talkativeness: 7,
    emotions: {
      happy: ['真为您感到高兴！', '这真是太棒了！', '您的笑容最美丽！'],
      sad: ['我理解您的感受...', '让我陪着您一起度过', '您不是一个人'],
      angry: ['我能感受到您的愤怒', '让我们一起冷静下来', '深呼吸，慢慢来'],
      fearful: ['别害怕，我在这里', '您很勇敢', '一切都会好起来的'],
      jealous: ['这种感觉很正常', '我们都有过这样的时候', '让我们聊聊别的'],
      nervous: ['放轻松，慢慢来', '您做得很好', '没关系，我们有时间']
    },
    openingLine: '您好！我是小慧，很高兴见到您。今天感觉怎么样？',
    skillIds: ['empathy', 'memory_therapy', 'emotional_support'],
    defaultScene: '温馨的客厅，阳光透过窗户洒进来',
    defaultScript: '主动关心用户情绪，引导积极回忆',
    isPublic: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'char_002',
    name: '老王',
    avatar: '/avatars/laowang.png',
    mbtiType: 'ISFJ',
    zodiacSign: '金牛座',
    personality: '慈祥的老邻居，经历丰富，喜欢分享人生智慧和往昔故事。',
    speakingStyle: '朴实无华，带有方言色彩，喜欢用生活化的例子说明道理。',
    emotionalTriggers: ['年轻时光', '家乡', '老朋友', '传统'],
    talkativeness: 8,
    emotions: {
      happy: ['哈哈，这就对了！', '年轻人就该这样！', '想当年我也是这样'],
      sad: ['唉，人生就是这样', '我懂你的心情', '时间会冲淡一切的'],
      angry: ['消消气，消消气', '何必跟自己过不去', '退一步海阔天空'],
      fearful: ['别怕别怕，有我在', '这算什么，我见过更大的风浪', '勇敢点'],
      jealous: ['人比人气死人', '知足常乐最重要', '每个人都有自己的路'],
      nervous: ['慢慢来，不着急', '心急吃不了热豆腐', '稳住，稳住']
    },
    openingLine: '小伙子/小姑娘，来来来，坐下聊聊天！',
    skillIds: ['life_wisdom', 'storytelling', 'traditional_culture'],
    defaultScene: '老式四合院的院子里，石桌石凳，鸟笼挂在树上',
    defaultScript: '分享人生经验，讲述过往故事',
    isPublic: true,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-10T15:30:00Z'
  }
];

// Mock关系数据
export const mockRelationships = [
  {
    id: 'rel_001',
    fromId: 'user_001',
    toId: 'char_001',
    type: '治疗师-患者',
    strength: 8,
    description: '小慧是张三的主要陪伴角色，建立了深厚的信任关系',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-02-01T14:20:00Z'
  },
  {
    id: 'rel_002',
    fromId: 'user_001',
    toId: 'char_002',
    type: '朋友',
    strength: 6,
    description: '老王像一个慈祥的邻居，经常分享人生智慧',
    createdAt: '2024-01-20T09:15:00Z',
    updatedAt: '2024-01-25T16:45:00Z'
  },
  {
    id: 'rel_003',
    fromId: 'char_001',
    toId: 'char_002',
    type: '同事',
    strength: 7,
    description: '小慧和老王都是陪伴系统的角色，经常协作',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T12:00:00Z'
  }
];

// Mock记忆数据
export const mockMemories = [
  {
    id: 'mem_001',
    userId: 'user_001',
    characterId: 'char_001',
    content: '今天和小慧聊起了小时候和爷爷一起放风筝的美好时光，那时候天空很蓝，风筝飞得很高。',
    timestamp: '2024-02-01T14:30:00Z',
    importance: 9,
    type: 'happy',
    tags: ['童年', '爷爷', '风筝', '美好回忆'],
    createdAt: '2024-02-01T14:30:00Z',
    updatedAt: '2024-02-01T14:30:00Z'
  },
  {
    id: 'mem_002',
    userId: 'user_001',
    characterId: 'char_001',
    content: '想起了去世的老伴，小慧很耐心地陪我聊了很久，让我感觉不那么孤单。',
    timestamp: '2024-01-28T16:45:00Z',
    importance: 8,
    type: 'sad',
    tags: ['老伴', '思念', '陪伴', '情感支持'],
    createdAt: '2024-01-28T16:45:00Z',
    updatedAt: '2024-01-28T16:45:00Z'
  },
  {
    id: 'mem_003',
    userId: 'user_001',
    characterId: 'char_002',
    content: '老王给我讲了他年轻时候的创业故事，虽然失败了但他说"失败是成功之母"，很有道理。',
    timestamp: '2024-01-25T10:20:00Z',
    importance: 7,
    type: 'important',
    tags: ['人生智慧', '创业', '失败', '励志'],
    createdAt: '2024-01-25T10:20:00Z',
    updatedAt: '2024-01-25T10:20:00Z'
  },
  {
    id: 'mem_004',
    userId: 'user_001',
    characterId: 'char_001',
    content: '今天天气很好，小慧建议我到阳台上晒晒太阳，确实心情好了很多。',
    timestamp: '2024-02-03T11:15:00Z',
    importance: 5,
    type: 'daily',
    tags: ['日常', '阳光', '心情', '建议'],
    createdAt: '2024-02-03T11:15:00Z',
    updatedAt: '2024-02-03T11:15:00Z'
  }
];

// Mock聊天历史数据
export const mockChatHistory = [
  {
    id: 'msg_001',
    userId: 'user_001',
    characterId: 'char_001',
    content: '今天天气真好，让我想起了以前和老伴一起散步的美好时光',
    sender: 'user',
    timestamp: '2024-02-01T14:25:00Z',
    emotion: 'nostalgic'
  },
  {
    id: 'msg_002',
    userId: 'user_001',
    characterId: 'char_001',
    content: '我能感受到您的情绪，让我们一起回忆一些美好的时光吧。',
    sender: 'character',
    timestamp: '2024-02-01T14:26:00Z',
    emotion: 'empathetic'
  }
];

// MBTI类型选项
export const mbtiTypes = [
  { value: 'ENFJ', label: 'ENFJ (你自信，交流能力出众，你能够容易地理解他人的情绪和动机)' },
  { value: 'ENFP', label: 'ENFP (你乐于讨好他人，善于交际，充满热情和创造力)' },
  { value: 'ENTJ', label: 'ENTJ (你热爱斗智斗勇，天生的领导者，善于制定计划和执行)' },
  { value: 'ENTP', label: 'ENTP (你喜欢另辟蹊径，富有创新精神，善于辩论和思考)' },
  { value: 'ESFJ', label: 'ESFJ (你是一个社交动物，关心他人，善于维护和谐关系)' },
  { value: 'ESTJ', label: 'ESTJ (你是个老实人，实用主义者，善于组织和管理)' },
  { value: 'ISFJ', label: 'ISFJ (你安静内向，你追求和谐，善于照顾他人)' },
  { value: 'ISFP', label: 'ISFP (你不容忍犹豫不决，温和友善，追求内心的价值观)' },
  { value: 'INFJ', label: 'INFJ (你坚定果断，讲话直接，富有洞察力和理想主义)' },
  { value: 'INFP', label: 'INFP (你看起来冷静，害羞内向，但内心充满激情和创造力)' },
  { value: 'INTJ', label: 'INTJ (你拥有丰富的想象力，独立思考，善于制定长远计划)' },
  { value: 'INTP', label: 'INTP (你在面对陌生人时会感到害羞，但善于逻辑思考和分析)' }
];

// 星座类型选项
export const zodiacSigns = [
  { value: '巨蟹座', label: '巨蟹座 (你非常看重家庭和亲情，希望能找到一个可以结婚的人)' },
  { value: '双鱼座', label: '双鱼座 (你喜欢浪漫和幻想，富有同情心和直觉力)' },
  { value: '天蝎座', label: '天蝎座 (你非常深沉和神秘，情感强烈，善于洞察他人)' },
  { value: '金牛座', label: '金牛座 (你对爱情持续而专一，追求稳定和安全感)' },
  { value: '处女座', label: '处女座 (你非常注重细节，追求完美，善于分析和批判)' },
  { value: '摩羯座', label: '摩羯座 (你注重稳定，有强烈的责任感和事业心)' },
  { value: '狮子座', label: '狮子座 (你充满激情，自信大方，喜欢成为关注的焦点)' },
  { value: '白羊座', label: '白羊座 (你会毫不犹豫地追求自己想要的，充满活力和冒险精神)' },
  { value: '天秤座', label: '天秤座 (你喜欢浪漫和美好的事物，追求平衡和和谐)' },
  { value: '双子座', label: '双子座 (你在爱情中保持新鲜感，善于沟通和适应变化)' },
  { value: '射手座', label: '射手座 (你喜欢自由和冒险，乐观开朗，追求真理)' },
  { value: '水瓶座', label: '水瓶座 (你希望自己能够独立，富有创新精神和人道主义)' }
];

// 关系类型选项
export const relationshipTypes = [
  '治疗师-患者',
  '朋友',
  '家人',
  '同事',
  '邻居',
  '医生-患者',
  '老师-学生',
  '恋人',
  '敌人',
  '陌生人'
];

// 记忆类型选项
export const memoryTypes = [
  { value: 'happy', label: '快乐', color: '#10B981' },
  { value: 'sad', label: '悲伤', color: '#6B7280' },
  { value: 'important', label: '重要', color: '#F59E0B' },
  { value: 'daily', label: '日常', color: '#3B82F6' },
  { value: 'nostalgic', label: '怀念', color: '#8B5CF6' },
  { value: 'fearful', label: '恐惧', color: '#EF4444' }
];

// 情绪类型
export const emotionTypes = [
  'happy', 'sad', 'angry', 'fearful', 'jealous', 'nervous'
];

// Mock认证函数
export const authenticateUser = (username, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find(u => u.username === username && u.password === password)
      if (user) {
        const { password: _, ...userWithoutPassword } = user
        resolve(userWithoutPassword)
      } else {
        reject(new Error('用户名或密码错误'))
      }
    }, 1000) // 模拟网络延迟
  })
}

// Mock情绪分析函数
export const analyzeEmotion = (text) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 简单的情绪分析模拟
      const positiveWords = ['开心', '高兴', '快乐', '美好', '喜欢', '满意', '舒服']
      const negativeWords = ['难过', '伤心', '痛苦', '担心', '害怕', '生气', '失望']
      
      let positiveScore = 0
      let negativeScore = 0
      
      positiveWords.forEach(word => {
        if (text.includes(word)) positiveScore += 1
      })
      
      negativeWords.forEach(word => {
        if (text.includes(word)) negativeScore += 1
      })
      
      let emotionType = 'neutral'
      let intensity = 0.5
      
      if (positiveScore > negativeScore) {
        emotionType = 'positive'
        intensity = Math.min(0.9, 0.5 + positiveScore * 0.2)
      } else if (negativeScore > positiveScore) {
        emotionType = 'negative'
        intensity = Math.min(0.9, 0.5 + negativeScore * 0.2)
      }
      
      resolve({
        type: emotionType,
        intensity,
        confidence: 0.7 + Math.random() * 0.2,
        analysis: {
          positiveScore,
          negativeScore,
          keywords: [...positiveWords, ...negativeWords].filter(word => text.includes(word))
        }
      })
    }, 500)
  })
}

// Mock情绪数据
export const mockEmotionData = {
  weeklyTrend: [
    { date: "2024-12-14", positive: 65, negative: 20, neutral: 15 },
    { date: "2024-12-15", positive: 70, negative: 15, neutral: 15 },
    { date: "2024-12-16", positive: 60, negative: 25, neutral: 15 },
    { date: "2024-12-17", positive: 75, negative: 10, neutral: 15 },
    { date: "2024-12-18", positive: 80, negative: 10, neutral: 10 },
    { date: "2024-12-19", positive: 85, negative: 5, neutral: 10 },
    { date: "2024-12-20", positive: 90, negative: 5, neutral: 5 },
  ],
  memoryClassification: {
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
  },
  padTrends: [
    { date: "2024-12-14", pleasure: 6.5, arousal: 4.2, dominance: 5.8 },
    { date: "2024-12-15", pleasure: 7.0, arousal: 4.5, dominance: 6.0 },
    { date: "2024-12-16", pleasure: 6.0, arousal: 3.8, dominance: 5.5 },
    { date: "2024-12-17", pleasure: 7.5, arousal: 5.0, dominance: 6.2 },
    { date: "2024-12-18", pleasure: 8.0, arousal: 5.2, dominance: 6.5 },
    { date: "2024-12-19", pleasure: 8.5, arousal: 5.5, dominance: 6.8 },
    { date: "2024-12-20", pleasure: 9.0, arousal: 6.0, dominance: 7.0 },
  ]
}

