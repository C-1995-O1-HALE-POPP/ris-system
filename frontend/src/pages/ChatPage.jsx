import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addMessage, setTyping, setCurrentPersona } from '../store/chatSlice'
import { updateCurrentEmotion } from '../store/emotionSlice'
import { characterAPI, emotionAPI, chatAPI, handleAPIError } from '../services/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Send, Mic, MicOff, Heart, Brain, Smile, Users, Settings } from 'lucide-react'
import '../App.css'

const ChatPage = () => {
  const [inputMessage, setInputMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const [audioChunks, setAudioChunks] = useState([])
  const [showCharacterSelector, setShowCharacterSelector] = useState(false)
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  
  const dispatch = useDispatch()
  const { messages, currentPersona, isTyping, emotionState } = useSelector(state => state.chat)
  const { currentEmotion } = useSelector(state => state.emotion)
  const { user } = useSelector(state => state.auth)

  // 获取可用的角色列表（去重）
  const availableCharacters = React.useMemo(() => {
    const uniqueCharacters = characters.filter((char, index, self) => 
      index === self.findIndex(c => c.id === char.id)
    );
    return uniqueCharacters;
  }, [characters]);

  useEffect(() => {
    // 加载角色列表
    loadCharacters();
  }, []);

  useEffect(() => {
    // 初始化MediaRecorder
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const recorder = new MediaRecorder(stream)
          recorder.ondataavailable = (e) => {
            setAudioChunks((prev) => [...prev, e.data])
          }
          recorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
            setAudioChunks([]) // 清空
            
            // 上传音频
            const audioUrl = URL.createObjectURL(audioBlob)
            const audioMessage = {
              id: Date.now(),
              type: 'user',
              content: audioUrl,
              messageType: 'voice',
              personaId: currentPersona?.id,
              userId: user?.id,
              timestamp: new Date().toISOString(),
            }
            dispatch(addMessage(audioMessage))

            // TODO: 调用后端API上传语音
            // try {
            //   const formData = new FormData()
            //   formData.append('audioFile', audioBlob, 'recording.wav')
            //   formData.append('userId', user?.id)
            //   formData.append('characterId', currentPersona?.id)
            //   const response = await emotionAPI.analyzeVoice(formData)
            //   console.log('语音分析结果:', response)
            // } catch (error) {
            //   console.error('语音分析失败:', handleAPIError(error))
            // }
          }
          setMediaRecorder(recorder)
        })
        .catch(err => console.error('获取麦克风失败:', err))
    }
  }, [audioChunks, currentPersona?.id, dispatch, user?.id])

  useEffect(() => {
    // 初始化默认角色
    if (!currentPersona && availableCharacters.length > 0) {
      const defaultPersona = availableCharacters.find(p => p.id === 'char_001') || availableCharacters[0]
      dispatch(setCurrentPersona(defaultPersona))
    }
  }, [currentPersona, dispatch, availableCharacters])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadCharacters = async () => {
    try {
      const charactersData = await characterAPI.getCharacters()
      setCharacters(charactersData)
    } catch (error) {
      console.error('Failed to load characters:', handleAPIError(error))
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleCharacterChange = (characterId) => {
    const selectedCharacter = availableCharacters.find(char => char.id === characterId)
    if (selectedCharacter) {
      dispatch(setCurrentPersona(selectedCharacter))
      
      // 添加角色切换消息
      const switchMessage = {
        type: 'system',
        content: `已切换到角色：${selectedCharacter.name}`,
        personaId: selectedCharacter.id,
        userId: user?.id,
      }
      dispatch(addMessage(switchMessage))

      // 如果角色有开场白，自动发送
      if (selectedCharacter.openingLine) {
        setTimeout(() => {
          const greetingMessage = {
            type: 'assistant',
            content: selectedCharacter.openingLine,
            personaId: selectedCharacter.id,
            userId: user?.id,
          }
          dispatch(addMessage(greetingMessage))
        }, 500)
      }
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || loading) return

    setLoading(true)
    const userMessage = {
      type: 'user',
      content: inputMessage,
      personaId: currentPersona?.id,
      userId: user?.id,
    }

    dispatch(addMessage(userMessage))
    
    // 分析用户情绪
    try {
      const emotionResult = await emotionAPI.analyzeText(inputMessage)
      dispatch(updateCurrentEmotion(emotionResult))
    } catch (error) {
      console.error('情绪分析失败:', handleAPIError(error))
    }

    const messageContent = inputMessage
    setInputMessage('')
    dispatch(setTyping(true))

    try {
      // 发送消息到后端并获取AI回复
      const messageData = {
        userId: user?.id,
        characterId: currentPersona?.id,
        content: messageContent,
        sender: 'user'
      }
      
      const response = await chatAPI.sendMessage(messageData)
      
      // 如果后端返回AI回复，直接使用
      if (response.aiResponse) {
        const assistantMessage = {
          type: 'assistant',
          content: response.aiResponse.content,
          personaId: currentPersona?.id,
          userId: user?.id,
        }
        dispatch(addMessage(assistantMessage))
      } else {
        // 否则使用本地模拟回复
        setTimeout(() => {
          let responses = [
            "我理解您的感受，能告诉我更多关于这件事的细节吗？",
            "这听起来很有意思，您当时是什么感觉呢？",
            "谢谢您和我分享这些，这对您来说一定很重要。",
            "我能感受到您的情绪，让我们一起回忆一些美好的时光吧。",
            "您说得很对，那个时候的经历确实很珍贵。"
          ]

          // 如果角色有特定的情绪表达，使用角色的回复风格
          if (currentPersona?.emotions) {
            const emotions = currentPersona.emotions
            if (emotions.happy) {
              responses.push(...emotions.happy)
            }
            if (emotions.sad) {
              responses.push(...emotions.sad)
            }
          }
          
          const randomResponse = responses[Math.floor(Math.random() * responses.length)]
          
          const assistantMessage = {
            type: 'assistant',
            content: randomResponse,
            personaId: currentPersona?.id,
            userId: user?.id,
          }

          dispatch(addMessage(assistantMessage))
        }, 1500)
      }
    } catch (error) {
      console.error('发送消息失败:', handleAPIError(error))
      // 发送失败时的本地回复
      setTimeout(() => {
        const errorMessage = {
          type: 'assistant',
          content: '抱歉，我现在无法回复您的消息，请稍后再试。',
          personaId: currentPersona?.id,
          userId: user?.id,
        }
        dispatch(addMessage(errorMessage))
      }, 1000)
    } finally {
      dispatch(setTyping(false))
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const imageUrl = reader.result
        const imageMessage = {
          id: Date.now(),
          type: 'user',
          content: imageUrl,
          messageType: 'image',
          personaId: currentPersona?.id,
          userId: user?.id,
          timestamp: new Date().toISOString(),
        }
        dispatch(addMessage(imageMessage))
        // TODO: 调用后端API上传图片
        // chatAPI.sendMessage({ ...imageMessage, content: file }) // 实际上传文件
      }
      reader.readAsDataURL(file)
    }
  }

  const toggleRecording = () => {
    if (mediaRecorder) {
      if (isRecording) {
        mediaRecorder.stop()
      } else {
        mediaRecorder.start()
      }
      setIsRecording(!isRecording)
    }
  }

  const getEmotionColor = (emotion) => {
    switch (emotion) {
      case 'positive': return 'text-green-600'
      case 'negative': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getEmotionIcon = (emotion) => {
    switch (emotion) {
      case 'positive': return <Smile className="h-4 w-4" />
      case 'negative': return <Heart className="h-4 w-4" />
      default: return <Brain className="h-4 w-4" />
    }
  }

  const CharacterSelector = () => (
    <Dialog open={showCharacterSelector} onOpenChange={setShowCharacterSelector}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Users className="h-4 w-4 mr-2" />
          选择角色
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>选择对话角色</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-4">
          {availableCharacters.map((character) => (
            <div
              key={character.id}
              className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors ${
                currentPersona?.id === character.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
              onClick={() => {
                handleCharacterChange(character.id)
                setShowCharacterSelector(false)
              }}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={character.avatar} />
                <AvatarFallback>{character.name?.charAt(0) || 'C'}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h4 className="font-medium">{character.name}</h4>
                <p className="text-sm text-gray-600 line-clamp-2">{character.personality}</p>
                {character.age && (
                  <p className="text-xs text-gray-500 mt-1">
                    {character.age}岁 · {character.gender === 'male' ? '男' : '女'}
                  </p>
                )}
              </div>
              {currentPersona?.id === character.id && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto">
      {/* 顶部状态栏 */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={currentPersona?.avatar} />
                <AvatarFallback>{currentPersona?.name?.charAt(0) || 'A'}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{currentPersona?.name || '小慧'}</CardTitle>
                <p className="text-sm text-gray-600">{currentPersona?.personality}</p>
                {currentPersona?.age && (
                  <p className="text-xs text-gray-500">
                    {currentPersona.age}岁 · {currentPersona.gender === 'male' ? '男' : '女'}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <CharacterSelector />
              <Badge variant="outline" className={getEmotionColor(currentEmotion.type)}>
                {getEmotionIcon(currentEmotion.type)}
                <span className="ml-1">
                  {currentEmotion.type === 'positive' ? '积极' : 
                   currentEmotion.type === 'negative' ? '消极' : '平静'}
                </span>
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 聊天消息区域 */}
      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>开始与{currentPersona?.name || '小慧'}对话吧</p>
                <p className="text-sm">分享您的回忆，我会用心倾听</p>
                <p className="text-xs text-gray-400 mt-2">您可以通过右上角的"选择角色"按钮切换对话角色</p>
              </div>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === 'user' ? 'justify-end' : 
                  message.type === 'system' ? 'justify-center' : 'justify-start'
                }`}
              >
                {message.type === 'system' ? (
                  <div className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">
                    {message.content}
                  </div>
                ) : (
                  <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                    message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <Avatar className="h-8 w-8">
                      {message.type === 'user' ? (
                        <>
                          <AvatarImage src={user?.avatar} />
                          <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                        </>
                      ) : (
                        <>
                          {(() => {
                            const messagePersona = availableCharacters.find(char => char.id === message.personaId) || currentPersona
                            return (
                              <>
                                <AvatarImage src={messagePersona?.avatar} />
                                <AvatarFallback>{messagePersona?.name?.charAt(0) || 'A'}</AvatarFallback>
                              </>
                            )
                          })()}
                        </>
                      )}
                    </Avatar>
                    
                    <div className={`rounded-lg px-3 py-2 ${
                      message.type === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      {message.messageType === 'image' ? (
                        <img src={message.content} alt="Uploaded" className="max-w-full h-auto rounded-md" />
                      ) : message.messageType === 'voice' ? (
                        <audio controls src={message.content} className="w-full" />
                      ) : (
                        <p className="text-sm">{message.content}</p>
                      )}
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentPersona?.avatar} />
                    <AvatarFallback>{currentPersona?.name?.charAt(0) || 'A'}</AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-100 rounded-lg px-3 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
        
        {/* 输入区域 */}
        <div className="border-t p-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleRecording}
              className={isRecording ? 'text-red-600' : ''}
            >
              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <input
              type="file"
              accept="image/*"
              id="image-upload"
              className="hidden"
              onChange={handleImageUpload}
            />
            <label htmlFor="image-upload">
              <Button variant="outline" size="sm" asChild>
                <span className="cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                </span>
              </Button>
            </label>
            
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`与${currentPersona?.name || '小慧'}对话...`}
              className="flex-1"
              disabled={isTyping || loading}
            />
            
            <Button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping || loading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default ChatPage