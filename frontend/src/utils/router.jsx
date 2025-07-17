import { createBrowserRouter, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import LoginPage from '../pages/LoginPage'
import DashboardLayout from '../layouts/DashboardLayout'
import ChatPage from '../pages/ChatPage'
import PersonaPage from '../pages/PersonaPage'
import EmotionPage from '../pages/EmotionPage'
import ReportPage from '../pages/ReportPage'
import SettingsPage from '../pages/SettingsPage'
import AdminPage from '../pages/AdminPage'

// 路由保护组件
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth)
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/chat" replace />
  }
  
  return children
}

// 公共路由组件（已登录用户重定向）
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(state => state.auth)
  
  if (isAuthenticated) {
    return <Navigate to="/chat" replace />
  }
  
  return children
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/chat" replace />,
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "chat",
        element: <ChatPage />,
      },
      {
        path: "persona",
        element: <PersonaPage />,
      },
      {
        path: "emotion",
        element: <EmotionPage />,
      },
      {
        path: "report",
        element: <ReportPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
      {
        path: "admin",
        element: (
          <ProtectedRoute adminOnly={true}>
            <AdminPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
])

export default router

