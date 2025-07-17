import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

// 从localStorage获取保存的用户信息
const savedUser = localStorage.getItem('ris_user')
if (savedUser) {
  try {
    const userData = JSON.parse(savedUser)
    initialState.user = userData
    initialState.isAuthenticated = true
  } catch (error) {
    localStorage.removeItem('ris_user')
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true
      state.error = null
    },
    loginSuccess: (state, action) => {
      state.loading = false
      state.isAuthenticated = true
      state.user = action.payload
      state.error = null
      // 保存到localStorage
      localStorage.setItem('ris_user', JSON.stringify(action.payload))
    },
    loginFailure: (state, action) => {
      state.loading = false
      state.isAuthenticated = false
      state.user = null
      state.error = action.payload
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.user = null
      state.error = null
      // 清除localStorage
      localStorage.removeItem('ris_user')
    },
    clearError: (state) => {
      state.error = null
    },
    setUser: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = true
      // 保存到localStorage
      localStorage.setItem('ris_user', JSON.stringify(action.payload))
    },
  },
})

export const { loginStart, loginSuccess, loginFailure, logout, clearError, setUser } = authSlice.actions
export default authSlice.reducer

