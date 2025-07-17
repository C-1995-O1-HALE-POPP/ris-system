import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield } from 'lucide-react'

const AdminPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Shield className="h-6 w-6" />
        <h1 className="text-2xl font-bold">系统管理</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>管理员功能</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">管理员功能正在开发中...</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminPage

