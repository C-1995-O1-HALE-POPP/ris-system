import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings } from 'lucide-react'

const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Settings className="h-6 w-6" />
        <h1 className="text-2xl font-bold">设置</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>系统设置</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">设置功能正在开发中...</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default SettingsPage

