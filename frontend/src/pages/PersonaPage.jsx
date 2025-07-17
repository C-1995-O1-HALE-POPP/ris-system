import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Users, 
  Heart,
  Brain,
  Star,
  Calendar,
  Tag
} from 'lucide-react'
import {
  selectFilteredCharacters,
  selectRelationships,
  selectFilteredMemories,
  setCharacterFilters,
  setSelectedCharacter,
  deleteCharacter,
  deleteRelationship,
  deleteMemory
} from '../store/characterSlice'
import CharacterForm from '../components/CharacterForm'
import RelationshipForm from '../components/RelationshipForm'
import MemoryForm from '../components/MemoryForm'
import { memoryTypes } from '../data/mockData'

const PersonaPage = () => {
  const dispatch = useDispatch()
  const characters = useSelector(selectFilteredCharacters)
  const relationships = useSelector(selectRelationships)
  const memories = useSelector(selectFilteredMemories)
  const { filters } = useSelector(state => state.character)
  
  const [activeTab, setActiveTab] = useState('characters')
  const [showCharacterForm, setShowCharacterForm] = useState(false)
  const [showRelationshipForm, setShowRelationshipForm] = useState(false)
  const [showMemoryForm, setShowMemoryForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  const handleSearch = (value) => {
    dispatch(setCharacterFilters({ search: value }))
  }

  const handleEditCharacter = (character) => {
    setEditingItem(character)
    setShowCharacterForm(true)
  }

  const handleDeleteCharacter = (id) => {
    if (window.confirm('确定要删除这个角色吗？这将同时删除相关的关系和记忆。')) {
      dispatch(deleteCharacter(id))
    }
  }

  const handleEditRelationship = (relationship) => {
    setEditingItem(relationship)
    setShowRelationshipForm(true)
  }

  const handleDeleteRelationship = (id) => {
    if (window.confirm('确定要删除这个关系吗？')) {
      dispatch(deleteRelationship(id))
    }
  }

  const handleEditMemory = (memory) => {
    setEditingItem(memory)
    setShowMemoryForm(true)
  }

  const handleDeleteMemory = (id) => {
    if (window.confirm('确定要删除这个记忆吗？')) {
      dispatch(deleteMemory(id))
    }
  }

  const getCharacterName = (id) => {
    const character = characters.find(c => c.id === id)
    return character ? character.name : '未知角色'
  }

  const getMemoryTypeColor = (type) => {
    const memoryType = memoryTypes.find(t => t.value === type)
    return memoryType ? memoryType.color : '#6B7280'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('zh-CN')
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">角色管理</h1>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setEditingItem(null)
              setShowCharacterForm(true)
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            新建角色
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="characters" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            角色列表
          </TabsTrigger>
          <TabsTrigger value="relationships" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            关系管理
          </TabsTrigger>
          <TabsTrigger value="memories" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            记忆管理
          </TabsTrigger>
        </TabsList>

        <TabsContent value="characters" className="space-y-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="搜索角色名称..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              筛选
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.map((character) => (
              <Card key={character.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {character.name.charAt(0)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{character.name}</CardTitle>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {character.mbtiType}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {character.zodiacSign}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditCharacter(character)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteCharacter(character.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {character.personality}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Star className="w-3 h-3" />
                      话唠指数: {character.talkativeness}/10
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      创建时间: {formatDate(character.createdAt)}
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {character.emotionalTriggers.slice(0, 3).map((trigger, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {trigger}
                      </Badge>
                    ))}
                    {character.emotionalTriggers.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{character.emotionalTriggers.length - 3}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="relationships" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">关系网络</h2>
            <Button
              onClick={() => {
                setEditingItem(null)
                setShowRelationshipForm(true)
              }}
              variant="outline"
            >
              <Plus className="w-4 h-4 mr-2" />
              添加关系
            </Button>
          </div>

          <div className="grid gap-4">
            {relationships.map((relationship) => (
              <Card key={relationship.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        <span className="font-medium">{getCharacterName(relationship.fromId)}</span>
                        <span className="mx-2 text-gray-400">→</span>
                        <span className="font-medium">{getCharacterName(relationship.toId)}</span>
                      </div>
                      <Badge variant="secondary">{relationship.type}</Badge>
                      <div className="flex items-center gap-1">
                        {[...Array(10)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < relationship.strength
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditRelationship(relationship)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteRelationship(relationship.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {relationship.description && (
                    <p className="text-sm text-gray-600 mt-2">{relationship.description}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="memories" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">记忆档案</h2>
            <Button
              onClick={() => {
                setEditingItem(null)
                setShowMemoryForm(true)
              }}
              variant="outline"
            >
              <Plus className="w-4 h-4 mr-2" />
              添加记忆
            </Button>
          </div>

          <div className="grid gap-4">
            {memories.map((memory) => (
              <Card key={memory.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge 
                          style={{ backgroundColor: getMemoryTypeColor(memory.type) }}
                          className="text-white"
                        >
                          {memoryTypes.find(t => t.value === memory.type)?.label}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          与 {getCharacterName(memory.characterId)} 的记忆
                        </span>
                        <div className="flex items-center gap-1">
                          {[...Array(10)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < memory.importance
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm mb-2">{memory.content}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(memory.timestamp)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {memory.tags.join(', ')}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 ml-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditMemory(memory)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteMemory(memory.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* 表单弹窗 */}
      {showCharacterForm && (
        <CharacterForm
          character={editingItem}
          onClose={() => {
            setShowCharacterForm(false)
            setEditingItem(null)
          }}
        />
      )}

      {showRelationshipForm && (
        <RelationshipForm
          relationship={editingItem}
          onClose={() => {
            setShowRelationshipForm(false)
            setEditingItem(null)
          }}
        />
      )}

      {showMemoryForm && (
        <MemoryForm
          memory={editingItem}
          onClose={() => {
            setShowMemoryForm(false)
            setEditingItem(null)
          }}
        />
      )}
    </div>
  )
}

export default PersonaPage

