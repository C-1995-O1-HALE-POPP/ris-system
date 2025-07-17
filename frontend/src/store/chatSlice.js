import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  messages: [],
  currentPersona: null,
  personas: [],
  isTyping: false,
  emotionState: 'neutral', // positive, negative, neutral
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      })
    },
    setCurrentPersona: (state, action) => {
      state.currentPersona = action.payload
    },
    addPersona: (state, action) => {
      const existingPersona = state.personas.find(p => p.id === action.payload.id)
      if (!existingPersona) {
        state.personas.push(action.payload)
      }
    },
    updatePersona: (state, action) => {
      const index = state.personas.findIndex(p => p.id === action.payload.id)
      if (index !== -1) {
        state.personas[index] = { ...state.personas[index], ...action.payload }
      }
    },
    setTyping: (state, action) => {
      state.isTyping = action.payload
    },
    setEmotionState: (state, action) => {
      state.emotionState = action.payload
    },
    clearMessages: (state) => {
      state.messages = []
    },
    loadChatHistory: (state, action) => {
      state.messages = action.payload
    },
  },
})

export const {
  addMessage,
  setCurrentPersona,
  addPersona,
  updatePersona,
  setTyping,
  setEmotionState,
  clearMessages,
  loadChatHistory,
} = chatSlice.actions

export default chatSlice.reducer
