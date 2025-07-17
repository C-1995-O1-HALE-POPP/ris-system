import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Badge } from './ui/badge'
import { X, Plus, Trash2 } from 'lucide-react'
import { addCharacter, updateCharacter } from '../store/characterSlice'
import { mbtiTypes, zodiacSigns, emotionTypes } from '../data/mockData'

const CharacterForm = ({ character, onClose }) => {
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    name: '',
    mbtiType: '',
    zodiacSign: '',
    personality: '',
    speakingStyle: '',
    emotionalTriggers: [],
    talkativeness: 5,
    emotions: {
      happy: [''],
      sad: [''],
      angry: [''],
      fearful: [''],
      jealous: [''],
      nervous: ['']
    },
    openingLine: '',
    skillIds: [],
    defaultScene: '',
    defaultScript: '',
    isPublic: true
  })

  const [newTrigger, setNewTrigger] = useState('')
  const [newSkill, setNewSkill] = useState('')

  useEffect(() => {
    if (character) {
      setFormData({
        ...character,
        emotions: {
          happy: character.emotions?.happy || [''],
          sad: character.emotions?.sad || [''],
          angry: character.emotions?.angry || [''],
          fearful: character.emotions?.fearful || [''],
          jealous: character.emotions?.jealous || [''],
          nervous: character.emotions?.nervous || ['']
        }
      })
    }
  }, [character])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleEmotionChange = (emotion, index, value) => {
    setFormData(prev => ({
      ...prev,
      emotions: {
        ...prev.emotions,
        [emotion]: prev.emotions[emotion].map((item, i) => i === index ? value : item)
      }
    }))
  }

  const addEmotionExpression = (emotion) => {
    setFormData(prev => ({
      ...prev,
      emotions: {
        ...prev.emotions,
        [emotion]: [...prev.emotions[emotion], '']
      }
    }))
  }

  const removeEmotionExpression = (emotion, index) => {
    setFormData(prev => ({
      ...prev,
      emotions: {
        ...prev.emotions,
        [emotion]: prev.emotions[emotion].filter((_, i) => i !== index)
      }
    }))
  }

  const addTrigger = () => {
    if (newTrigger.trim()) {
      setFormData(prev => ({
        ...prev,
        emotionalTriggers: [...prev.emotionalTriggers, newTrigger.trim()]
      }))
      setNewTrigger('')
    }
  }

  const removeTrigger = (index) => {
    setFormData(prev => ({
      ...prev,
      emotionalTriggers: prev.emotionalTriggers.filter((_, i) => i !== index)
    }))
  }

  const addSkill = () => {
    if (newSkill.trim()) {
      setFormData(prev => ({
        ...prev,
        skillIds: [...prev.skillIds, newSkill.trim()]
      }))
      setNewSkill('')
    }
  }

  const removeSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skillIds: prev.skillIds.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // 清理空的情绪表达
    const cleanedEmotions = {}
    Object.keys(formData.emotions).forEach(emotion => {
      cleanedEmotions[emotion] = formData.emotions[emotion].filter(expr => expr.trim())
    })

    const submitData = {
      ...formData,
      emotions: cleanedEmotions
    }

    if (character) {
      dispatch(updateCharacter({ id: character.id, ...submitData }))
    } else {
      dispatch(addCharacter(submitData))
    }
    
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{character ? '编辑角色' : '创建新角色'}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 基础信息 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">角色名称 *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="talkativeness">话唠指数 (1-10)</Label>
                <Input
                  id="talkativeness"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.talkativeness}
                  onChange={(e) => handleInputChange('talkativeness', parseInt(e.target.value))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mbtiType">MBTI类型</Label>
                <Select value={formData.mbtiType} onValueChange={(value) => handleInputChange('mbtiType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择MBTI类型" />
                  </SelectTrigger>
                  <SelectContent>
                    {mbtiTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="zodiacSign">星座类型</Label>
                <Select value={formData.zodiacSign} onValueChange={(value) => handleInputChange('zodiacSign', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择星座" />
                  </SelectTrigger>
                  <SelectContent>
                    {zodiacSigns.map((sign) => (
                      <SelectItem key={sign.value} value={sign.value}>
                        {sign.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 人设描述 */}
            <div>
              <Label htmlFor="personality">人设描述 *</Label>
              <Textarea
                id="personality"
                value={formData.personality}
                onChange={(e) => handleInputChange('personality', e.target.value)}
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="speakingStyle">说话风格</Label>
              <Textarea
                id="speakingStyle"
                value={formData.speakingStyle}
                onChange={(e) => handleInputChange('speakingStyle', e.target.value)}
                rows={2}
              />
            </div>

            {/* 情绪敏感点 */}
            <div>
              <Label>情绪敏感点</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newTrigger}
                  onChange={(e) => setNewTrigger(e.target.value)}
                  placeholder="添加敏感点..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTrigger())}
                />
                <Button type="button" onClick={addTrigger}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.emotionalTriggers.map((trigger, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {trigger}
                    <button
                      type="button"
                      onClick={() => removeTrigger(index)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* 情绪表达 */}
            <div>
              <Label>情绪表达设置</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {emotionTypes.map((emotion) => (
                  <div key={emotion} className="space-y-2">
                    <Label className="text-sm font-medium capitalize">
                      {emotion === 'happy' ? '开心' :
                       emotion === 'sad' ? '悲伤' :
                       emotion === 'angry' ? '愤怒' :
                       emotion === 'fearful' ? '恐惧' :
                       emotion === 'jealous' ? '嫉妒' :
                       emotion === 'nervous' ? '紧张' : emotion}
                    </Label>
                    {formData.emotions[emotion].map((expression, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={expression}
                          onChange={(e) => handleEmotionChange(emotion, index, e.target.value)}
                          placeholder={`${emotion}时的表达...`}
                        />
                        {formData.emotions[emotion].length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEmotionExpression(emotion, index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addEmotionExpression(emotion)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      添加表达
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* 高级设置 */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="openingLine">开场白</Label>
                <Textarea
                  id="openingLine"
                  value={formData.openingLine}
                  onChange={(e) => handleInputChange('openingLine', e.target.value)}
                  rows={2}
                />
              </div>

              <div>
                <Label>技能ID</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="添加技能ID..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <Button type="button" onClick={addSkill}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skillIds.map((skill, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="defaultScene">默认场景</Label>
                <Textarea
                  id="defaultScene"
                  value={formData.defaultScene}
                  onChange={(e) => handleInputChange('defaultScene', e.target.value)}
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="defaultScript">默认脚本</Label>
                <Textarea
                  id="defaultScript"
                  value={formData.defaultScript}
                  onChange={(e) => handleInputChange('defaultScript', e.target.value)}
                  rows={2}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={formData.isPublic}
                  onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="isPublic">公开角色</Label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                取消
              </Button>
              <Button type="submit">
                {character ? '更新' : '创建'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default CharacterForm

