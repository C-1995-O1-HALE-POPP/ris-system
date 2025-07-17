import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentEmotion: {
    type: 'neutral', // positive, negative, neutral
    intensity: 0, // 0-1
    confidence: 0, // 0-1
    timestamp: null,
  },
  emotionHistory: [],
  memoryClassification: {
    positive: [],
    negative: [],
    neutral: [],
  },
  analysisData: {
    weeklyReport: null,
    monthlyReport: null,
    personaInteractions: {},
    padTrends: [], // Pleasure, Arousal, Dominance trends
  },
  isAnalyzing: false,
}

const emotionSlice = createSlice({
  name: 'emotion',
  initialState,
  reducers: {
    updateCurrentEmotion: (state, action) => {
      state.currentEmotion = {
        ...action.payload,
        timestamp: new Date().toISOString(),
      }
      // 添加到历史记录
      state.emotionHistory.push(state.currentEmotion)
      // 保持历史记录在合理范围内
      if (state.emotionHistory.length > 1000) {
        state.emotionHistory = state.emotionHistory.slice(-1000)
      }
    },
    classifyMemory: (state, action) => {
      const { memory, classification } = action.payload
      if (classification === 'positive') {
        state.memoryClassification.positive.push(memory)
      } else if (classification === 'negative') {
        state.memoryClassification.negative.push(memory)
      } else {
        state.memoryClassification.neutral.push(memory)
      }
    },
    setAnalyzing: (state, action) => {
      state.isAnalyzing = action.payload
    },
    updateWeeklyReport: (state, action) => {
      state.analysisData.weeklyReport = action.payload
    },
    updateMonthlyReport: (state, action) => {
      state.analysisData.monthlyReport = action.payload
    },
    updatePersonaInteractions: (state, action) => {
      const { personaId, interactionData } = action.payload
      state.analysisData.personaInteractions[personaId] = interactionData
    },
    addPadTrend: (state, action) => {
      state.analysisData.padTrends.push({
        ...action.payload,
        timestamp: new Date().toISOString(),
      })
      // 保持趋势数据在合理范围内
      if (state.analysisData.padTrends.length > 500) {
        state.analysisData.padTrends = state.analysisData.padTrends.slice(-500)
      }
    },
    clearEmotionHistory: (state) => {
      state.emotionHistory = []
      state.memoryClassification = {
        positive: [],
        negative: [],
        neutral: [],
      }
    },
  },
})

export const {
  updateCurrentEmotion,
  classifyMemory,
  setAnalyzing,
  updateWeeklyReport,
  updateMonthlyReport,
  updatePersonaInteractions,
  addPadTrend,
  clearEmotionHistory,
} = emotionSlice.actions

export default emotionSlice.reducer

