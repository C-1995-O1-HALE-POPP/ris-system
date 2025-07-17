import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import chatReducer from './chatSlice'
import emotionReducer from './emotionSlice'
import characterReducer from './characterSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    emotion: emotionReducer,
    character: characterReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST']
      }
    })
})

export default store