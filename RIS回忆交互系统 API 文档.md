# RIS回忆交互系统 API 文档

## 1. 概述

本文档定义了RIS回忆交互系统前端与后端交互的API接口规范。后端开发人员应根据此规范实现相应的接口，以便前端能够正确地获取和提交数据。

## 2. 认证与用户管理

### 2.1 用户登录

**API 路径:** `/api/auth/login`

**HTTP 方法:** `POST`

**描述:** 用户通过用户名和密码进行登录认证。

**请求体 (Request Body):**

```json
{
  "username": "string",
  "password": "string"
}
```

**响应体 (Response Body - 成功):**

```json
{
  "id": "string",
  "username": "string",
  "name": "string",
  "role": "string",
  "avatar": "string",
  "age": "number",
  "condition": "string",
  "joinDate": "string",
  "lastLogin": "string",
  "createdAt": "string",
  "token": "string" // 认证token，用于后续请求
}
```

**响应体 (Response Body - 失败):**

```json
{
  "message": "string" // 错误信息，例如 "用户名或密码错误"
}
```

## 3. 角色管理

### 3.1 获取所有角色

**API 路径:** `/api/characters`

**HTTP 方法:** `GET`

**描述:** 获取系统中所有可用的角色列表。

**请求参数 (Query Parameters):** 无

**响应体 (Response Body):**

```json
[
  {
    "id": "string",
    "name": "string",
    "avatar": "string",
    "mbtiType": "string",
    "zodiacSign": "string",
    "personality": "string",
    "speakingStyle": "string",
    "emotionalTriggers": ["string"],
    "talkativeness": "number",
    "emotions": {
      "happy": ["string"],
      "sad": ["string"],
      "angry": ["string"],
      "fearful": ["string"],
      "jealous": ["string"],
      "nervous": ["string"]
    },
    "openingLine": "string",
    "skillIds": ["string"],
    "defaultScene": "string",
    "defaultScript": "string",
    "isPublic": "boolean",
    "createdAt": "string",
    "updatedAt": "string"
  }
]
```

### 3.2 获取指定角色

**API 路径:** `/api/characters/{id}`

**HTTP 方法:** `GET`

**描述:** 根据角色ID获取单个角色的详细信息。

**路径参数 (Path Parameters):**

- `id`: 角色ID (string)

**响应体 (Response Body):**

```json
{
  "id": "string",
  "name": "string",
  "avatar": "string",
  "mbtiType": "string",
  "zodiacSign": "string",
  "personality": "string",
  "speakingStyle": "string",
  "emotionalTriggers": ["string"],
  "talkativeness": "number",
  "emotions": {
    "happy": ["string"],
    "sad": ["string"],
    "angry": ["string"],
    "fearful": ["string"],
    "jealous": ["string"],
    "nervous": ["string"]
  },
  "openingLine": "string",
  "skillIds": ["string"],
  "defaultScene": "string",
  "defaultScript": "string",
  "isPublic": "boolean",
  "createdAt": "string",
  "updatedAt": "string"
}
```

## 4. 情绪分析

### 4.1 分析文本情绪

**API 路径:** `/api/emotion/analyze`

**HTTP 方法:** `POST`

**描述:** 对输入的文本进行情绪分析。

**请求体 (Request Body):**

```json
{
  "text": "string" // 待分析的文本
}
```

**响应体 (Response Body):**

```json
{
  "type": "string", // 情绪类型: "positive", "negative", "neutral"
  "intensity": "number", // 情绪强度 (0-1)
  "confidence": "number", // 置信度 (0-1)
  "analysis": {
    "positiveScore": "number",
    "negativeScore": "number",
    "keywords": ["string"]
  }
}
```

## 5. 记忆管理

### 5.1 获取所有记忆

**API 路径:** `/api/memories`

**HTTP 方法:** `GET`

**描述:** 获取所有记忆记录。

**请求参数 (Query Parameters):**

- `userId`: 用户ID (string, 可选)
- `characterId`: 角色ID (string, 可选)

**响应体 (Response Body):**

```json
[
  {
    "id": "string",
    "userId": "string",
    "characterId": "string",
    "content": "string",
    "timestamp": "string", // ISO 8601 格式日期时间
    "importance": "number",
    "type": "string", // 记忆类型: "happy", "sad", "important", "daily", "nostalgic", "fearful"
    "tags": ["string"],
    "createdAt": "string",
    "updatedAt": "string"
  }
]
```

### 5.2 获取指定记忆

**API 路径:** `/api/memories/{id}`

**HTTP 方法:** `GET`

**描述:** 根据记忆ID获取单个记忆的详细信息。

**路径参数 (Path Parameters):**

- `id`: 记忆ID (string)

**响应体 (Response Body):**

```json
{
  "id": "string",
  "userId": "string",
  "characterId": "string",
  "content": "string",
  "timestamp": "string",
  "importance": "number",
  "type": "string",
  "tags": ["string"],
  "createdAt": "string",
  "updatedAt": "string"
}
```

## 6. 聊天历史

### 6.1 获取聊天历史

**API 路径:** `/api/chat/history`

**HTTP 方法:** `GET`

**描述:** 获取指定用户和角色的聊天历史记录。

**请求参数 (Query Parameters):**

- `userId`: 用户ID (string, 必需)
- `characterId`: 角色ID (string, 必需)
- `limit`: 返回消息数量限制 (number, 可选，默认值可由后端定义)
- `before`: 获取在此时间戳之前的消息 (string, ISO 8601 格式日期时间, 可选)

**响应体 (Response Body):**

```json
[
  {
    "id": "string",
    "userId": "string",
    "characterId": "string",
    "content": "string",
    "sender": "string", // "user" 或 "character"
    "timestamp": "string", // ISO 8601 格式日期时间
    "emotion": "string" // 消息关联的情绪
  }
]
```

### 6.2 发送聊天消息

**API 路径:** `/api/chat/message`

**HTTP 方法:** `POST`

**描述:** 用户发送一条聊天消息。

**请求体 (Request Body):**

```json
{
  "userId": "string",
  "characterId": "string",
  "content": "string",
  "sender": "user" // 固定为 "user"
}
```

**响应体 (Response Body):**

```json
{
  "id": "string",
  "userId": "string",
  "characterId": "string",
  "content": "string",
  "sender": "string", // "user" 或 "character" (包含AI回复)
  "timestamp": "string",
  "emotion": "string"
}
```

## 7. 报告数据

### 7.1 获取每周情绪趋势

**API 路径:** `/api/reports/emotion/weekly-trend`

**HTTP 方法:** `GET`

**描述:** 获取用户每周情绪趋势数据。

**请求参数 (Query Parameters):**

- `userId`: 用户ID (string, 必需)
- `startDate`: 开始日期 (string, YYYY-MM-DD 格式, 可选)
- `endDate`: 结束日期 (string, YYYY-MM-DD 格式, 可选)

**响应体 (Response Body):**

```json
[
  {
    "date": "string", // YYYY-MM-DD 格式
    "positive": "number", // 积极情绪百分比
    "negative": "number", // 消极情绪百分比
    "neutral": "number" // 中性情绪百分比
  }
]
```

### 7.2 获取记忆分类统计

**API 路径:** `/api/reports/memory/classification`

**HTTP 方法:** `GET`

**描述:** 获取记忆按情绪分类的统计数据。

**请求参数 (Query Parameters):**

- `userId`: 用户ID (string, 必需)

**响应体 (Response Body):**

```json
{
  "positive": [
    {
      "content": "string",
      "timestamp": "string",
      "intensity": "number"
    }
  ],
  "negative": [
    {
      "content": "string",
      "timestamp": "string",
      "intensity": "number"
    }
  ],
  "neutral": [
    {
      "content": "string",
      "timestamp": "string",
      "intensity": "number"
    }
  ]
}
```

### 7.3 获取PAD趋势

**API 路径:** `/api/reports/pad-trends`

**HTTP 方法:** `GET`

**描述:** 获取用户PAD (Pleasure, Arousal, Dominance) 情绪趋势数据。

**请求参数 (Query Parameters):**

- `userId`: 用户ID (string, 必需)
- `startDate`: 开始日期 (string, YYYY-MM-DD 格式, 可选)
- `endDate`: 结束日期 (string, YYYY-MM-DD 格式, 可选)

**响应体 (Response Body):**

```json
[
  {
    "date": "string", // YYYY-MM-DD 格式
    "pleasure": "number",
    "arousal": "number",
    "dominance": "number"
  }
]
```

## 8. 附录

### 8.1 数据模型定义

#### User (用户)

```json
{
  "id": "string",
  "username": "string",
  "name": "string",
  "role": "string", // "patient" 或 "admin"
  "avatar": "string", // 头像URL
  "age": "number",
  "condition": "string", // 认知症状况
  "joinDate": "string", // ISO 8601 格式日期时间
  "lastLogin": "string", // ISO 8601 格式日期时间
  "createdAt": "string" // ISO 8601 格式日期时间
}
```

#### Character (角色)

```json
{
  "id": "string",
  "name": "string",
  "avatar": "string",
  "mbtiType": "string",
  "zodiacSign": "string",
  "personality": "string",
  "speakingStyle": "string",
  "emotionalTriggers": ["string"],
  "talkativeness": "number", // 0-10
  "emotions": {
    "happy": ["string"],
    "sad": ["string"],
    "angry": ["string"],
    "fearful": ["string"],
    "jealous": ["string"],
    "nervous": ["string"]
  },
  "openingLine": "string",
  "skillIds": ["string"],
  "defaultScene": "string",
  "defaultScript": "string",
  "isPublic": "boolean",
  "createdAt": "string",
  "updatedAt": "string"
}
```

#### Memory (记忆)

```json
{
  "id": "string",
  "userId": "string",
  "characterId": "string",
  "content": "string",
  "timestamp": "string",
  "importance": "number", // 1-10
  "type": "string", // "happy", "sad", "important", "daily", "nostalgic", "fearful"
  "tags": ["string"],
  "createdAt": "string",
  "updatedAt": "string"
}
```

#### ChatMessage (聊天消息)

```json
{
  "id": "string",
  "userId": "string",
  "characterId": "string",
  "content": "string",
  "sender": "string", // "user" 或 "character"
  "timestamp": "string",
  "emotion": "string" // 消息关联的情绪
}
```

#### EmotionAnalysisResult (情绪分析结果)

```json
{
  "type": "string", // "positive", "negative", "neutral"
  "intensity": "number", // 0-1
  "confidence": "number", // 0-1
  "analysis": {
    "positiveScore": "number",
    "negativeScore": "number",
    "keywords": ["string"]
  }
}
```

#### WeeklyEmotionTrend (每周情绪趋势)

```json
[
  {
    "date": "string", // YYYY-MM-DD
    "positive": "number",
    "negative": "number",
    "neutral": "number"
  }
]
```

#### MemoryClassification (记忆分类)

```json
{
  "positive": [
    {
      "content": "string",
      "timestamp": "string",
      "intensity": "number"
    }
  ],
  "negative": [
    {
      "content": "string",
      "timestamp": "string",
      "intensity": "number"
    }
  ],
  "neutral": [
    {
      "content": "string",
      "timestamp": "string",
      "intensity": "number"
    }
  ]
}
```

#### PADTrend (PAD趋势)

```json
[
  {
    "date": "string", // YYYY-MM-DD
    "pleasure": "number",
    "arousal": "number",
    "dominance": "number"
  }
]
```

---

**作者:** Manus AI
**日期:** 2025年7月16日



## 2. 用户认证与授权

### 2.1 用户注册

**接口地址：** `POST /api/auth/register`

**请求参数：**
```json
{
  "username": "string",
  "password": "string", 
  "email": "string",
  "userType": "patient|caregiver|admin",
  "profile": {
    "name": "string",
    "age": "number",
    "gender": "male|female",
    "medicalHistory": "string",
    "emergencyContact": "string"
  }
}
```

**响应数据：**
```json
{
  "success": true,
  "data": {
    "userId": "string",
    "token": "string",
    "refreshToken": "string",
    "user": {
      "id": "string",
      "username": "string",
      "email": "string",
      "userType": "string",
      "profile": "object",
      "createdAt": "string",
      "updatedAt": "string"
    }
  },
  "message": "用户注册成功"
}
```

### 2.2 用户登录

**接口地址：** `POST /api/auth/login`

**请求参数：**
```json
{
  "username": "string",
  "password": "string"
}
```

**响应数据：**
```json
{
  "success": true,
  "data": {
    "token": "string",
    "refreshToken": "string",
    "user": {
      "id": "string",
      "username": "string",
      "email": "string",
      "userType": "string",
      "profile": "object",
      "lastLoginAt": "string"
    }
  },
  "message": "登录成功"
}
```

### 2.3 刷新Token

**接口地址：** `POST /api/auth/refresh`

**请求参数：**
```json
{
  "refreshToken": "string"
}
```

**响应数据：**
```json
{
  "success": true,
  "data": {
    "token": "string",
    "refreshToken": "string"
  },
  "message": "Token刷新成功"
}
```

### 2.4 用户登出

**接口地址：** `POST /api/auth/logout`

**请求头：**
```
Authorization: Bearer <token>
```

**响应数据：**
```json
{
  "success": true,
  "message": "登出成功"
}
```

## 3. 角色管理

### 3.1 获取角色列表

**接口地址：** `GET /api/characters`

**请求头：**
```
Authorization: Bearer <token>
```

**查询参数：**
- `page`: 页码（可选，默认1）
- `limit`: 每页数量（可选，默认10）
- `type`: 角色类型（可选，system|custom）

**响应数据：**
```json
{
  "success": true,
  "data": {
    "characters": [
      {
        "id": "string",
        "name": "string",
        "avatar": "string",
        "personality": "string",
        "age": "number",
        "gender": "male|female",
        "background": "string",
        "openingLine": "string",
        "emotions": {
          "happy": ["string"],
          "sad": ["string"],
          "neutral": ["string"]
        },
        "type": "system|custom",
        "createdBy": "string",
        "createdAt": "string",
        "updatedAt": "string"
      }
    ],
    "pagination": {
      "page": "number",
      "limit": "number",
      "total": "number",
      "totalPages": "number"
    }
  },
  "message": "获取角色列表成功"
}
```

### 3.2 创建自定义角色

**接口地址：** `POST /api/characters`

**请求头：**
```
Authorization: Bearer <token>
```

**请求参数：**
```json
{
  "name": "string",
  "avatar": "string",
  "personality": "string",
  "age": "number",
  "gender": "male|female",
  "background": "string",
  "openingLine": "string",
  "emotions": {
    "happy": ["string"],
    "sad": ["string"],
    "neutral": ["string"]
  }
}
```

**响应数据：**
```json
{
  "success": true,
  "data": {
    "character": {
      "id": "string",
      "name": "string",
      "avatar": "string",
      "personality": "string",
      "age": "number",
      "gender": "male|female",
      "background": "string",
      "openingLine": "string",
      "emotions": "object",
      "type": "custom",
      "createdBy": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  },
  "message": "角色创建成功"
}
```

### 3.3 更新角色信息

**接口地址：** `PUT /api/characters/{characterId}`

**请求头：**
```
Authorization: Bearer <token>
```

**请求参数：**
```json
{
  "name": "string",
  "avatar": "string", 
  "personality": "string",
  "age": "number",
  "gender": "male|female",
  "background": "string",
  "openingLine": "string",
  "emotions": {
    "happy": ["string"],
    "sad": ["string"],
    "neutral": ["string"]
  }
}
```

**响应数据：**
```json
{
  "success": true,
  "data": {
    "character": "object"
  },
  "message": "角色更新成功"
}
```

### 3.4 删除角色

**接口地址：** `DELETE /api/characters/{characterId}`

**请求头：**
```
Authorization: Bearer <token>
```

**响应数据：**
```json
{
  "success": true,
  "message": "角色删除成功"
}
```

## 4. 聊天对话

### 4.1 发送消息

**接口地址：** `POST /api/chat/messages`

**请求头：**
```
Authorization: Bearer <token>
```

**请求参数：**
```json
{
  "userId": "string",
  "characterId": "string",
  "content": "string",
  "sender": "user|assistant",
  "messageType": "text|voice|image",
  "metadata": {
    "emotionAnalysis": "object",
    "timestamp": "string"
  }
}
```

**响应数据：**
```json
{
  "success": true,
  "data": {
    "message": {
      "id": "string",
      "userId": "string",
      "characterId": "string",
      "content": "string",
      "sender": "user|assistant",
      "messageType": "text|voice|image",
      "metadata": "object",
      "createdAt": "string"
    },
    "aiResponse": {
      "id": "string",
      "content": "string",
      "sender": "assistant",
      "messageType": "text",
      "metadata": "object",
      "createdAt": "string"
    }
  },
  "message": "消息发送成功"
}
```

### 4.2 获取聊天历史

**接口地址：** `GET /api/chat/messages`

**请求头：**
```
Authorization: Bearer <token>
```

**查询参数：**
- `userId`: 用户ID
- `characterId`: 角色ID（可选）
- `page`: 页码（可选，默认1）
- `limit`: 每页数量（可选，默认20）
- `startDate`: 开始日期（可选）
- `endDate`: 结束日期（可选）

**响应数据：**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "string",
        "userId": "string",
        "characterId": "string",
        "content": "string",
        "sender": "user|assistant",
        "messageType": "text|voice|image",
        "metadata": "object",
        "createdAt": "string"
      }
    ],
    "pagination": {
      "page": "number",
      "limit": "number",
      "total": "number",
      "totalPages": "number"
    }
  },
  "message": "获取聊天历史成功"
}
```

### 4.3 删除消息

**接口地址：** `DELETE /api/chat/messages/{messageId}`

**请求头：**
```
Authorization: Bearer <token>
```

**响应数据：**
```json
{
  "success": true,
  "message": "消息删除成功"
}
```

## 5. 情绪分析

### 5.1 文本情绪分析

**接口地址：** `POST /api/emotion/analyze/text`

**请求头：**
```
Authorization: Bearer <token>
```

**请求参数：**
```json
{
  "text": "string",
  "userId": "string",
  "context": {
    "characterId": "string",
    "sessionId": "string"
  }
}
```

**响应数据：**
```json
{
  "success": true,
  "data": {
    "emotionResult": {
      "type": "positive|negative|neutral",
      "intensity": "number", // 0-1之间
      "confidence": "number", // 0-1之间
      "analysis": {
        "positiveScore": "number",
        "negativeScore": "number",
        "neutralScore": "number",
        "keywords": ["string"],
        "sentiment": "string"
      },
      "timestamp": "string"
    }
  },
  "message": "文本情绪分析完成"
}
```

### 5.2 语音情绪分析

**接口地址：** `POST /api/emotion/analyze/voice`

**请求头：**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**请求参数：**
- `audioFile`: 音频文件（File）
- `userId`: 用户ID（string）
- `characterId`: 角色ID（string，可选）

**响应数据：**
```json
{
  "success": true,
  "data": {
    "emotionResult": {
      "type": "positive|negative|neutral",
      "intensity": "number",
      "confidence": "number",
      "analysis": {
        "voiceFeatures": {
          "pitch": "number",
          "tone": "string",
          "speed": "number",
          "volume": "number"
        },
        "transcription": "string",
        "sentiment": "string"
      },
      "timestamp": "string"
    }
  },
  "message": "语音情绪分析完成"
}
```

### 5.3 获取情绪历史

**接口地址：** `GET /api/emotion/history`

**请求头：**
```
Authorization: Bearer <token>
```

**查询参数：**
- `userId`: 用户ID
- `type`: 分析类型（可选，text|voice）
- `startDate`: 开始日期（可选）
- `endDate`: 结束日期（可选）
- `page`: 页码（可选，默认1）
- `limit`: 每页数量（可选，默认20）

**响应数据：**
```json
{
  "success": true,
  "data": {
    "emotionHistory": [
      {
        "id": "string",
        "userId": "string",
        "type": "text|voice",
        "inputData": "string",
        "result": {
          "type": "positive|negative|neutral",
          "intensity": "number",
          "confidence": "number",
          "analysis": "object"
        },
        "createdAt": "string"
      }
    ],
    "pagination": "object"
  },
  "message": "获取情绪历史成功"
}
```

## 6. 实时监测

### 6.1 获取当前情绪状态

**接口地址：** `GET /api/monitoring/emotion/current/{userId}`

**请求头：**
```
Authorization: Bearer <token>
```

**响应数据：**
```json
{
  "success": true,
  "data": {
    "currentEmotion": {
      "type": "positive|negative|neutral",
      "intensity": "number",
      "confidence": "number",
      "lastUpdated": "string"
    }
  },
  "message": "获取当前情绪状态成功"
}
```

### 6.2 获取生理数据

**接口地址：** `GET /api/monitoring/physiological/{userId}`

**请求头：**
```
Authorization: Bearer <token>
```

**响应数据：**
```json
{
  "success": true,
  "data": {
    "physiologicalData": {
      "heartRate": "number",
      "stressLevel": "number", // 1-10
      "engagement": "number", // 1-10
      "arousal": "number", // 1-10
      "timestamp": "string"
    }
  },
  "message": "获取生理数据成功"
}
```

### 6.3 更新生理数据

**接口地址：** `POST /api/monitoring/physiological`

**请求头：**
```
Authorization: Bearer <token>
```

**请求参数：**
```json
{
  "userId": "string",
  "heartRate": "number",
  "stressLevel": "number",
  "engagement": "number",
  "arousal": "number",
  "deviceId": "string",
  "timestamp": "string"
}
```

**响应数据：**
```json
{
  "success": true,
  "data": {
    "physiologicalData": "object"
  },
  "message": "生理数据更新成功"
}
```

## 7. 分析报告

### 7.1 获取情绪趋势报告

**接口地址：** `GET /api/reports/emotion-trend`

**请求头：**
```
Authorization: Bearer <token>
```

**查询参数：**
- `userId`: 用户ID
- `period`: 时间周期（week|month|quarter）
- `startDate`: 开始日期（可选）
- `endDate`: 结束日期（可选）

**响应数据：**
```json
{
  "success": true,
  "data": {
    "weeklyTrend": [
      {
        "date": "string",
        "positive": "number",
        "negative": "number",
        "neutral": "number"
      }
    ],
    "summary": {
      "averagePositive": "number",
      "averageNegative": "number",
      "averageNeutral": "number",
      "trend": "improving|stable|declining"
    }
  },
  "message": "获取情绪趋势报告成功"
}
```

### 7.2 获取回忆分类报告

**接口地址：** `GET /api/reports/memory-classification`

**请求头：**
```
Authorization: Bearer <token>
```

**查询参数：**
- `userId`: 用户ID
- `period`: 时间周期（week|month|quarter）

**响应数据：**
```json
{
  "success": true,
  "data": {
    "memoryClassification": {
      "positive": [
        {
          "content": "string",
          "timestamp": "string",
          "intensity": "number",
          "category": "family|work|childhood|health|social"
        }
      ],
      "negative": ["object"],
      "neutral": ["object"]
    },
    "statistics": {
      "totalMemories": "number",
      "positiveCount": "number",
      "negativeCount": "number",
      "neutralCount": "number",
      "categoryDistribution": {
        "family": "number",
        "work": "number",
        "childhood": "number",
        "health": "number",
        "social": "number"
      }
    }
  },
  "message": "获取回忆分类报告成功"
}
```

### 7.3 获取PAD情绪模型趋势

**接口地址：** `GET /api/reports/pad-trends`

**请求头：**
```
Authorization: Bearer <token>
```

**查询参数：**
- `userId`: 用户ID
- `period`: 时间周期（week|month|quarter）

**响应数据：**
```json
{
  "success": true,
  "data": {
    "padTrends": [
      {
        "date": "string",
        "pleasure": "number", // 1-10
        "arousal": "number", // 1-10
        "dominance": "number" // 1-10
      }
    ],
    "analysis": {
      "pleasureTrend": "improving|stable|declining",
      "arousalTrend": "improving|stable|declining",
      "dominanceTrend": "improving|stable|declining",
      "overallImprovement": "number" // 百分比
    }
  },
  "message": "获取PAD趋势报告成功"
}
```

### 7.4 获取角色交互统计

**接口地址：** `GET /api/reports/character-interactions`

**请求头：**
```
Authorization: Bearer <token>
```

**查询参数：**
- `userId`: 用户ID
- `period`: 时间周期（week|month|quarter）

**响应数据：**
```json
{
  "success": true,
  "data": {
    "characterInteractions": [
      {
        "characterId": "string",
        "name": "string",
        "interactions": "number",
        "satisfaction": "number", // 1-5评分
        "avgDuration": "number", // 平均对话时长（分钟）
        "totalDuration": "number", // 总对话时长（分钟）
        "lastInteraction": "string"
      }
    ],
    "summary": {
      "totalInteractions": "number",
      "totalDuration": "number",
      "averageSatisfaction": "number",
      "mostActiveCharacter": "string"
    }
  },
  "message": "获取角色交互统计成功"
}
```

### 7.5 导出完整报告

**接口地址：** `POST /api/reports/export`

**请求头：**
```
Authorization: Bearer <token>
```

**请求参数：**
```json
{
  "userId": "string",
  "period": "week|month|quarter",
  "format": "json|pdf|excel",
  "sections": ["emotion", "memory", "pad", "character"],
  "startDate": "string",
  "endDate": "string"
}
```

**响应数据：**
```json
{
  "success": true,
  "data": {
    "reportUrl": "string", // 下载链接
    "reportId": "string",
    "format": "string",
    "generatedAt": "string",
    "expiresAt": "string"
  },
  "message": "报告导出成功"
}
```

## 8. 错误处理

### 8.1 错误响应格式

所有API接口在发生错误时，都会返回统一的错误响应格式：

```json
{
  "success": false,
  "error": {
    "code": "string", // 错误代码
    "message": "string", // 错误描述
    "details": "object" // 详细错误信息（可选）
  },
  "timestamp": "string"
}
```

### 8.2 常见错误代码

| 错误代码 | HTTP状态码 | 描述 |
|---------|-----------|------|
| AUTH_TOKEN_MISSING | 401 | 缺少认证Token |
| AUTH_TOKEN_INVALID | 401 | 无效的Token |
| AUTH_TOKEN_EXPIRED | 401 | Token已过期 |
| AUTH_INSUFFICIENT_PERMISSIONS | 403 | 权限不足 |
| VALIDATION_ERROR | 400 | 请求参数验证失败 |
| RESOURCE_NOT_FOUND | 404 | 资源不存在 |
| RESOURCE_ALREADY_EXISTS | 409 | 资源已存在 |
| RATE_LIMIT_EXCEEDED | 429 | 请求频率超限 |
| INTERNAL_SERVER_ERROR | 500 | 服务器内部错误 |
| SERVICE_UNAVAILABLE | 503 | 服务不可用 |
| EMOTION_ANALYSIS_FAILED | 500 | 情绪分析失败 |
| CHARACTER_CREATION_FAILED | 500 | 角色创建失败 |
| REPORT_GENERATION_FAILED | 500 | 报告生成失败 |

### 8.3 错误处理示例

```javascript
// 前端错误处理示例
try {
  const response = await fetch('/api/emotion/analyze/text', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text: inputText, userId: userId })
  })
  
  const data = await response.json()
  
  if (!data.success) {
    switch (data.error.code) {
      case 'AUTH_TOKEN_EXPIRED':
        // 处理Token过期
        await refreshToken()
        break
      case 'VALIDATION_ERROR':
        // 处理参数验证错误
        showValidationErrors(data.error.details)
        break
      case 'EMOTION_ANALYSIS_FAILED':
        // 处理情绪分析失败
        showErrorMessage('情绪分析服务暂时不可用，请稍后重试')
        break
      default:
        showErrorMessage(data.error.message)
    }
    return
  }
  
  // 处理成功响应
  handleEmotionResult(data.data.emotionResult)
} catch (error) {
  // 处理网络错误
  showErrorMessage('网络连接失败，请检查网络设置')
}
```

## 9. 数据模型

### 9.1 用户模型（User）

```typescript
interface User {
  id: string
  username: string
  email: string
  password: string // 加密存储
  userType: 'patient' | 'caregiver' | 'admin'
  profile: UserProfile
  settings: UserSettings
  createdAt: string
  updatedAt: string
  lastLoginAt: string
  isActive: boolean
}

interface UserProfile {
  name: string
  age: number
  gender: 'male' | 'female'
  avatar?: string
  medicalHistory?: string
  emergencyContact?: string
  preferences: {
    language: string
    timezone: string
    notifications: boolean
  }
}

interface UserSettings {
  emotionAnalysisEnabled: boolean
  voiceAnalysisEnabled: boolean
  dataRetentionDays: number
  privacyLevel: 'public' | 'private' | 'restricted'
}
```

### 9.2 角色模型（Character）

```typescript
interface Character {
  id: string
  name: string
  avatar: string
  personality: string
  age: number
  gender: 'male' | 'female'
  background: string
  openingLine: string
  emotions: {
    happy: string[]
    sad: string[]
    neutral: string[]
    angry?: string[]
    surprised?: string[]
  }
  type: 'system' | 'custom'
  createdBy: string // 用户ID
  isPublic: boolean
  tags: string[]
  createdAt: string
  updatedAt: string
}
```

### 9.3 消息模型（Message）

```typescript
interface Message {
  id: string
  userId: string
  characterId: string
  content: string
  sender: 'user' | 'assistant'
  messageType: 'text' | 'voice' | 'image'
  metadata: {
    emotionAnalysis?: EmotionResult
    voiceFeatures?: VoiceFeatures
    imageAnalysis?: ImageAnalysis
    sessionId: string
    deviceInfo?: string
  }
  parentMessageId?: string // 用于回复消息
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}
```

### 9.4 情绪分析结果模型（EmotionResult）

```typescript
interface EmotionResult {
  id: string
  userId: string
  type: 'positive' | 'negative' | 'neutral'
  intensity: number // 0-1
  confidence: number // 0-1
  analysis: {
    positiveScore: number
    negativeScore: number
    neutralScore: number
    keywords: string[]
    sentiment: string
    padScores?: {
      pleasure: number // 1-10
      arousal: number // 1-10
      dominance: number // 1-10
    }
  }
  inputType: 'text' | 'voice'
  inputData: string
  processingTime: number // 毫秒
  modelVersion: string
  createdAt: string
}
```

### 9.5 生理数据模型（PhysiologicalData）

```typescript
interface PhysiologicalData {
  id: string
  userId: string
  heartRate: number
  stressLevel: number // 1-10
  engagement: number // 1-10
  arousal: number // 1-10
  bloodPressure?: {
    systolic: number
    diastolic: number
  }
  temperature?: number
  deviceId: string
  deviceType: string
  accuracy: number // 0-1
  timestamp: string
  createdAt: string
}
```

### 9.6 会话模型（Session）

```typescript
interface Session {
  id: string
  userId: string
  characterId: string
  startTime: string
  endTime?: string
  duration?: number // 秒
  messageCount: number
  emotionSummary: {
    averagePositive: number
    averageNegative: number
    averageNeutral: number
    dominantEmotion: string
  }
  satisfactionRating?: number // 1-5
  notes?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}
```

## 10. 安全与隐私

### 10.1 认证机制

系统采用JWT（JSON Web Token）进行用户认证，包含以下安全特性：

- **Token过期机制**：访问Token有效期为2小时，刷新Token有效期为30天
- **Token刷新**：支持无感知Token刷新，确保用户体验流畅
- **多设备登录**：支持用户在多个设备上同时登录，每个设备独立管理Token
- **登出机制**：支持单设备登出和全设备登出

### 10.2 数据加密

- **传输加密**：所有API通信使用HTTPS/TLS 1.3加密
- **存储加密**：敏感数据（如密码、个人信息）使用AES-256加密存储
- **密码安全**：使用bcrypt进行密码哈希，加盐强度为12

### 10.3 隐私保护

- **数据最小化**：只收集必要的用户数据
- **数据匿名化**：分析报告中的数据进行匿名化处理
- **数据保留**：用户可设置数据保留期限，过期数据自动删除
- **数据导出**：用户可随时导出个人数据
- **数据删除**：用户可请求删除所有个人数据

### 10.4 访问控制

- **角色权限**：基于用户类型（患者、护理者、管理员）的权限控制
- **资源隔离**：用户只能访问自己的数据和授权的数据
- **API限流**：防止API滥用，每个用户每分钟最多100次请求

## 11. 性能优化

### 11.1 缓存策略

- **Redis缓存**：用户会话、角色信息、常用查询结果缓存
- **CDN加速**：静态资源（头像、图片）通过CDN分发
- **数据库优化**：合理的索引设计和查询优化

### 11.2 异步处理

- **情绪分析**：大文本和语音分析采用异步处理
- **报告生成**：复杂报告生成采用后台任务队列
- **通知推送**：实时通知采用WebSocket或Server-Sent Events

### 11.3 监控与日志

- **API监控**：响应时间、错误率、吞吐量监控
- **错误日志**：详细的错误日志记录和分析
- **性能分析**：定期性能分析和优化建议

## 12. 部署与运维

### 12.1 环境配置

**开发环境：**
```bash
# 环境变量配置
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/ris_dev
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret_key
EMOTION_API_KEY=your_emotion_analysis_api_key
```

**生产环境：**
```bash
# 环境变量配置
NODE_ENV=production
PORT=8080
DATABASE_URL=postgresql://user:password@prod-db:5432/ris_prod
REDIS_URL=redis://prod-redis:6379
JWT_SECRET=your_production_jwt_secret
EMOTION_API_KEY=your_production_emotion_api_key
SSL_CERT_PATH=/path/to/ssl/cert.pem
SSL_KEY_PATH=/path/to/ssl/key.pem
```

### 12.2 数据库迁移

```sql
-- 创建用户表
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('patient', 'caregiver', 'admin')),
  profile JSONB,
  settings JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);

-- 创建角色表
CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  avatar TEXT,
  personality TEXT,
  age INTEGER,
  gender VARCHAR(10) CHECK (gender IN ('male', 'female')),
  background TEXT,
  opening_line TEXT,
  emotions JSONB,
  type VARCHAR(10) NOT NULL CHECK (type IN ('system', 'custom')),
  created_by UUID REFERENCES users(id),
  is_public BOOLEAN DEFAULT false,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建消息表
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  character_id UUID NOT NULL REFERENCES characters(id),
  content TEXT NOT NULL,
  sender VARCHAR(20) NOT NULL CHECK (sender IN ('user', 'assistant')),
  message_type VARCHAR(20) NOT NULL CHECK (message_type IN ('text', 'voice', 'image')),
  metadata JSONB,
  parent_message_id UUID REFERENCES messages(id),
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建情绪分析结果表
CREATE TABLE emotion_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  type VARCHAR(20) NOT NULL CHECK (type IN ('positive', 'negative', 'neutral')),
  intensity DECIMAL(3,2) CHECK (intensity >= 0 AND intensity <= 1),
  confidence DECIMAL(3,2) CHECK (confidence >= 0 AND confidence <= 1),
  analysis JSONB,
  input_type VARCHAR(20) NOT NULL CHECK (input_type IN ('text', 'voice')),
  input_data TEXT,
  processing_time INTEGER,
  model_version VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建生理数据表
CREATE TABLE physiological_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  heart_rate INTEGER,
  stress_level DECIMAL(3,1) CHECK (stress_level >= 1 AND stress_level <= 10),
  engagement DECIMAL(3,1) CHECK (engagement >= 1 AND engagement <= 10),
  arousal DECIMAL(3,1) CHECK (arousal >= 1 AND arousal <= 10),
  blood_pressure JSONB,
  temperature DECIMAL(4,1),
  device_id VARCHAR(100),
  device_type VARCHAR(50),
  accuracy DECIMAL(3,2),
  timestamp TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建会话表
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  character_id UUID NOT NULL REFERENCES characters(id),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  duration INTEGER,
  message_count INTEGER DEFAULT 0,
  emotion_summary JSONB,
  satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_messages_user_id ON messages(user_id);
CREATE INDEX idx_messages_character_id ON messages(character_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_emotion_results_user_id ON emotion_results(user_id);
CREATE INDEX idx_emotion_results_created_at ON emotion_results(created_at);
CREATE INDEX idx_physiological_data_user_id ON physiological_data(user_id);
CREATE INDEX idx_physiological_data_timestamp ON physiological_data(timestamp);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_start_time ON sessions(start_time);
```

### 12.3 API测试

使用Postman或curl进行API测试：

```bash
# 用户注册
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123",
    "email": "test@example.com",
    "userType": "patient",
    "profile": {
      "name": "测试用户",
      "age": 65,
      "gender": "male"
    }
  }'

# 用户登录
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'

# 获取角色列表
curl -X GET http://localhost:3000/api/characters \
  -H "Authorization: Bearer YOUR_TOKEN"

# 文本情绪分析
curl -X POST http://localhost:3000/api/emotion/analyze/text \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "今天天气真好，让我想起了小时候和爷爷一起放风筝的美好时光",
    "userId": "USER_ID"
  }'
```

## 13. 版本更新

### 13.1 API版本控制

API采用语义化版本控制（Semantic Versioning），版本号格式为：`v{major}.{minor}.{patch}`

- **主版本号（major）**：不兼容的API修改
- **次版本号（minor）**：向下兼容的功能性新增
- **修订号（patch）**：向下兼容的问题修正

当前版本：`v1.0.0`

### 13.2 更新日志

**v1.0.0 (2024-12-20)**
- 初始版本发布
- 实现用户认证与授权
- 实现角色管理功能
- 实现聊天对话功能
- 实现情绪分析功能
- 实现实时监测功能
- 实现分析报告功能

**计划中的更新：**

**v1.1.0 (计划2025-01-15)**
- 新增语音识别功能
- 新增图像情绪分析
- 优化情绪分析算法
- 新增多语言支持

**v1.2.0 (计划2025-02-15)**
- 新增群组聊天功能
- 新增角色推荐系统
- 新增高级报告功能
- 新增数据导入导出

### 13.3 兼容性说明

- **向下兼容**：新版本API保持对旧版本的兼容性
- **废弃通知**：废弃的API将提前3个月通知
- **迁移指南**：提供详细的版本迁移指南

## 14. 技术支持

### 14.1 联系方式

- **技术支持邮箱**：support@ris-system.com
- **开发者文档**：https://docs.ris-system.com
- **GitHub仓库**：https://github.com/ris-system/api
- **问题反馈**：https://github.com/ris-system/api/issues

### 14.2 常见问题

**Q: 如何获取API访问权限？**
A: 请联系我们的技术支持团队申请API密钥。

**Q: API有请求频率限制吗？**
A: 是的，每个用户每分钟最多100次请求。如需更高频率，请联系我们升级账户。

**Q: 支持哪些编程语言？**
A: API基于REST标准，支持所有能发送HTTP请求的编程语言。我们提供JavaScript、Python、Java的SDK。

**Q: 数据安全如何保障？**
A: 我们采用企业级安全措施，包括HTTPS加密、数据加密存储、访问控制等。

### 14.3 SDK下载

- **JavaScript SDK**：npm install ris-api-sdk
- **Python SDK**：pip install ris-api-sdk
- **Java SDK**：Maven依赖配置

---

**文档版本**：v1.0.0  
**最后更新**：2024年12月20日  
**作者**：Manus AI  
**版权所有**：© 2024 RIS回忆交互系统

