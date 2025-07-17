import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { X, Star } from 'lucide-react'
import { addRelationship, updateRelationship, selectCharacters } from '../store/characterSlice'
import { relationshipTypes } from '../data/mockData'

const RelationshipForm = ({ relationship, onClose }) => {
  const dispatch = useDispatch()
  const characters = useSelector(selectCharacters)
  const { user } = useSelector(state => state.auth)
  
  const [formData, setFormData] = useState({
    fromId: '',
    toId: '',
    type: '',
    strength: 5,
    description: ''
  })

  useEffect(() => {
    if (relationship) {
      setFormData(relationship)
    }
  }, [relationship])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (relationship) {
      dispatch(updateRelationship({ id: relationship.id, ...formData }))
    } else {
      dispatch(addRelationship(formData))
    }
    
    onClose()
  }

  // 获取可选的关系对象
  const getAvailableTargets = () => {
    if (!formData.fromId) return []
    
    // 如果发起者是用户，目标只能是角色
    if (formData.fromId === user?.id) {
      return characters
    }
    
    // 如果发起者是角色，目标可以是用户或其他角色
    return [
      { id: user?.id, name: user?.name, type: 'user' },
      ...characters.filter(char => char.id !== formData.fromId)
    ]
  }

  const getEntityName = (id) => {
    if (id === user?.id) return user.name
    const character = characters.find(c => c.id === id)
    return character ? character.name : '未知'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{relationship ? '编辑关系' : '创建新关系'}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fromId">关系发起者 *</Label>
                <Select value={formData.fromId} onValueChange={(value) => handleInputChange('fromId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择发起者" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={user?.id}>{user?.name} (用户)</SelectItem>
                    {characters.map((character) => (
                      <SelectItem key={character.id} value={character.id}>
                        {character.name} (角色)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="toId">关系目标 *</Label>
                <Select 
                  value={formData.toId} 
                  onValueChange={(value) => handleInputChange('toId', value)}
                  disabled={!formData.fromId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择目标" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableTargets().map((target) => (
                      <SelectItem key={target.id} value={target.id}>
                        {target.name} ({target.type === 'user' ? '用户' : '角色'})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="type">关系类型 *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择关系类型" />
                </SelectTrigger>
                <SelectContent>
                  {relationshipTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="strength">关系强度 (1-10)</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="strength"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.strength}
                  onChange={(e) => handleInputChange('strength', parseInt(e.target.value))}
                  className="w-20"
                />
                <div className="flex items-center gap-1">
                  {[...Array(10)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 cursor-pointer ${
                        i < formData.strength
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                      onClick={() => handleInputChange('strength', i + 1)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="description">关系描述</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                placeholder="描述这段关系的特点和背景..."
              />
            </div>

            {formData.fromId && formData.toId && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  关系预览: <span className="font-medium">{getEntityName(formData.fromId)}</span>
                  <span className="mx-2">→</span>
                  <span className="font-medium">{getEntityName(formData.toId)}</span>
                  {formData.type && (
                    <>
                      <span className="mx-2">|</span>
                      <span className="text-blue-600">{formData.type}</span>
                    </>
                  )}
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                取消
              </Button>
              <Button 
                type="submit" 
                disabled={!formData.fromId || !formData.toId || !formData.type}
              >
                {relationship ? '更新' : '创建'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default RelationshipForm

