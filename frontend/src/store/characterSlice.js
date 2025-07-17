import { createSlice } from '@reduxjs/toolkit'
import { mockCharacters, mockRelationships, mockMemories } from '../data/mockData'

const initialState = {
  characters: mockCharacters,
  relationships: mockRelationships,
  memories: mockMemories,
  selectedCharacter: null,
  loading: false,
  error: null,
  filters: {
    search: '',
    mbtiType: '',
    zodiacSign: '',
    isPublic: null
  },
  memoryFilters: {
    characterId: '',
    type: '',
    dateRange: null,
    importance: null
  }
}

const characterSlice = createSlice({
  name: 'character',
  initialState,
  reducers: {
    // 角色CRUD操作
    addCharacter: (state, action) => {
      const newCharacter = {
        ...action.payload,
        id: `char_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      state.characters.push(newCharacter)
    },
    
    updateCharacter: (state, action) => {
      const { id, ...updates } = action.payload
      const index = state.characters.findIndex(char => char.id === id)
      if (index !== -1) {
        state.characters[index] = {
          ...state.characters[index],
          ...updates,
          updatedAt: new Date().toISOString()
        }
      }
    },
    
    deleteCharacter: (state, action) => {
      const id = action.payload
      state.characters = state.characters.filter(char => char.id !== id)
      // 同时删除相关的关系和记忆
      state.relationships = state.relationships.filter(
        rel => rel.fromId !== id && rel.toId !== id
      )
      state.memories = state.memories.filter(mem => mem.characterId !== id)
    },
    
    setSelectedCharacter: (state, action) => {
      state.selectedCharacter = action.payload
    },
    
    // 关系管理
    addRelationship: (state, action) => {
      const newRelationship = {
        ...action.payload,
        id: `rel_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      state.relationships.push(newRelationship)
    },
    
    updateRelationship: (state, action) => {
      const { id, ...updates } = action.payload
      const index = state.relationships.findIndex(rel => rel.id === id)
      if (index !== -1) {
        state.relationships[index] = {
          ...state.relationships[index],
          ...updates,
          updatedAt: new Date().toISOString()
        }
      }
    },
    
    deleteRelationship: (state, action) => {
      const id = action.payload
      state.relationships = state.relationships.filter(rel => rel.id !== id)
    },
    
    // 记忆管理
    addMemory: (state, action) => {
      const newMemory = {
        ...action.payload,
        id: `mem_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      state.memories.push(newMemory)
    },
    
    updateMemory: (state, action) => {
      const { id, ...updates } = action.payload
      const index = state.memories.findIndex(mem => mem.id === id)
      if (index !== -1) {
        state.memories[index] = {
          ...state.memories[index],
          ...updates,
          updatedAt: new Date().toISOString()
        }
      }
    },
    
    deleteMemory: (state, action) => {
      const id = action.payload
      state.memories = state.memories.filter(mem => mem.id !== id)
    },
    
    // 筛选和搜索
    setCharacterFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    
    setMemoryFilters: (state, action) => {
      state.memoryFilters = { ...state.memoryFilters, ...action.payload }
    },
    
    clearFilters: (state) => {
      state.filters = {
        search: '',
        mbtiType: '',
        zodiacSign: '',
        isPublic: null
      }
      state.memoryFilters = {
        characterId: '',
        type: '',
        dateRange: null,
        importance: null
      }
    },
    
    // 加载状态管理
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    
    setError: (state, action) => {
      state.error = action.payload
    },
    
    clearError: (state) => {
      state.error = null
    }
  }
})

export const {
  addCharacter,
  updateCharacter,
  deleteCharacter,
  setSelectedCharacter,
  addRelationship,
  updateRelationship,
  deleteRelationship,
  addMemory,
  updateMemory,
  deleteMemory,
  setCharacterFilters,
  setMemoryFilters,
  clearFilters,
  setLoading,
  setError,
  clearError
} = characterSlice.actions

// 选择器
export const selectCharacters = (state) => state.character.characters
export const selectFilteredCharacters = (state) => {
  const { characters, filters } = state.character
  return characters.filter(char => {
    if (filters.search && !char.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false
    }
    if (filters.mbtiType && char.mbtiType !== filters.mbtiType) {
      return false
    }
    if (filters.zodiacSign && char.zodiacSign !== filters.zodiacSign) {
      return false
    }
    if (filters.isPublic !== null && char.isPublic !== filters.isPublic) {
      return false
    }
    return true
  })
}

export const selectRelationships = (state) => state.character.relationships
export const selectMemories = (state) => state.character.memories
export const selectFilteredMemories = (state) => {
  const { memories, memoryFilters } = state.character
  return memories.filter(mem => {
    if (memoryFilters.characterId && mem.characterId !== memoryFilters.characterId) {
      return false
    }
    if (memoryFilters.type && mem.type !== memoryFilters.type) {
      return false
    }
    if (memoryFilters.importance && mem.importance < memoryFilters.importance) {
      return false
    }
    if (memoryFilters.dateRange) {
      const memDate = new Date(mem.timestamp)
      const { start, end } = memoryFilters.dateRange
      if (start && memDate < new Date(start)) return false
      if (end && memDate > new Date(end)) return false
    }
    return true
  })
}

export const selectSelectedCharacter = (state) => state.character.selectedCharacter
export const selectCharacterById = (state, id) => 
  state.character.characters.find(char => char.id === id)

export const selectRelationshipsByCharacter = (state, characterId) =>
  state.character.relationships.filter(rel => 
    rel.fromId === characterId || rel.toId === characterId
  )

export const selectMemoriesByCharacter = (state, characterId) =>
  state.character.memories.filter(mem => mem.characterId === characterId)

export default characterSlice.reducer

