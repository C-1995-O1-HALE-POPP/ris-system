import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Badge } from './ui/badge'
import { X, Star, Plus, Calendar } from 'lucide-react'
import { addMemory, updateMemory, selectCharacters } from '../store/characterSlice'
import { memoryTypes } from '../data/mockData'

const MemoryForm = ({ memory, onClose }) => {
  const dispatch = useDispatch()
  const characters = useSelector(selectCharacters)
  const { user } = useSelector(state => state.auth)
  
  const [formData, setFormData] = useState({
    userId: user?.id || '',
    characterId: '',
    content: '',
    timestamp: new Date().toISOString().slice(0, 16), // YYYY-MM-DDTHH:mm
    importance: 5,
    type: 'daily',
    tags: []
  })

  const [newTag, setNewTag] = useState('')

  useEffect(() => {
    if (memory) {
      setFormData({
        ...memory,
        timestamp: new Date(memory.timestamp).toISOString().slice(0, 16)
      })
    }
  }, [memory])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const submitData = {
      ...formData,
      timestamp: new Date(formData.timestamp).toISOString()
    }
    
    if (memory) {
      dispatch(updateMemory({ id: memory.id, ...submitData }))
    } else {
      dispatch(addMemory(submitData))
    }
    
    onClose()
  }

  const getCharacterName = (id) => {
    const character = characters.find(c => c.id === id)
    return character ? character.name : '未知角色'
  }

  const getMemoryTypeInfo = (type) => {
    return memoryTypes.find(t => t.value === type) || memoryTypes[0]
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{memory ? '编辑记忆' : '创建新记忆'}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="characterId">相关角色 *</Label>
              <Select value={formData.characterId} onValueChange={(value) => handleInputChange('characterId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择相关角色" />
                </SelectTrigger>
                <SelectContent>
                  {characters.map((character) => (
                    <SelectItem key={character.id} value={character.id}>
                      {character.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="content">记忆内容 *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                rows={4}
                placeholder="描述这段记忆的详细内容..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="timestamp">记忆时间 *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="timestamp"
                    type="datetime-local"
                    value={formData.timestamp}
                    onChange={(e) => handleInputChange('timestamp', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="type">记忆类型 *</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择记忆类型" />
                  </SelectTrigger>
                  <SelectContent>
                    {memoryTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: type.color }}
                          />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="importance">重要性等级 (1-10)</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="importance"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.importance}
                  onChange={(e) => handleInputChange('importance', parseInt(e.target.value))}
                  className="w-20"
                />
                <div className="flex items-center gap-1">
                  {[...Array(10)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 cursor-pointer ${
                        i < formData.importance
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                      onClick={() => handleInputChange('importance', i + 1)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <Label>记忆标签</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="添加标签..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {formData.characterId && formData.content && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">记忆预览:</span>
                </p>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">角色:</span> {getCharacterName(formData.characterId)}</p>
                  <p><span className="font-medium">类型:</span> 
                    <Badge 
                      style={{ backgroundColor: getMemoryTypeInfo(formData.type).color }}
                      className="text-white ml-2"
                    >
                      {getMemoryTypeInfo(formData.type).label}
                    </Badge>
                  </p>
                  <p><span className="font-medium">时间:</span> {new Date(formData.timestamp).toLocaleString('zh-CN')}</p>
                  <p><span className="font-medium">重要性:</span> {formData.importance}/10</p>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                取消
              </Button>
              <Button 
                type="submit" 
                disabled={!formData.characterId || !formData.content}
              >
                {memory ? '更新' : '创建'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default MemoryForm

