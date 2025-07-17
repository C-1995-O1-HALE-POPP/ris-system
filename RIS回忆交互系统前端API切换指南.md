# RIS回忆交互系统前端API切换指南

本文档旨在指导前端开发人员如何在RIS回忆交互系统前端项目中，灵活地在Mock数据和真实后端API之间进行切换。

## 1. 概述

RIS前端项目设计时考虑了前后端分离的开发模式。在后端API尚未准备就绪时，前端可以使用Mock数据进行开发和测试。一旦后端API可用，可以轻松切换到真实API进行集成。

## 2. 核心切换文件

主要的切换逻辑集中在以下文件：

- `src/services/api.js`：API服务的核心文件，负责定义API接口和处理请求。
- `src/pages/*.jsx`：各个业务页面，负责调用API服务获取数据。

## 3. 切换步骤

### 3.1 切换API基础URL

打开 `src/services/api.js` 文件，找到 `API_BASE_URL` 变量。这个变量定义了后端API的基础地址。

**切换到真实API：**

将 `API_BASE_URL` 设置为您的后端API实际部署的地址。例如：

```javascript
// src/services/api.js

// 真实后端API地址
const API_BASE_URL = "https://your-backend-api.com/api"; 

// Mock数据地址 (切换到真实API时请注释或删除)
// const API_BASE_URL = "/api"; 
```

**切换到Mock数据（开发环境）：**

如果您想在本地开发时使用Vite的代理功能（例如，将 `/api` 请求代理到本地的mock server或json-server），可以将 `API_BASE_URL` 设置为相对路径 `/api`。同时，您需要在 `vite.config.js` 中配置代理。

```javascript
// src/services/api.js

// Mock数据地址 (开发环境)
const API_BASE_URL = "/api"; 

// 真实后端API地址 (切换到Mock数据时请注释或删除)
// const API_BASE_URL = "https://your-backend-api.com/api"; 
```

### 3.2 启用/禁用Mock数据逻辑

在 `src/services/api.js` 文件中，我们为每个API接口都提供了Mock数据实现。您可以通过注释或取消注释相应代码来启用或禁用Mock数据。

**启用真实API调用（禁用Mock数据）：**

找到每个API接口的定义（例如 `authAPI.login`、`characterAPI.getCharacters` 等），将 `return new Promise(...)` 形式的Mock数据逻辑注释掉，并取消注释真实的 `axios.post` 或 `axios.get` 调用。

**示例（以登录API为例）：**

```javascript
// src/services/api.js

const authAPI = {
  login: async ({ username, password }) => {
    // 真实API调用
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { username, password });
    return response.data.data; // 根据您的后端响应结构调整

    // Mock数据 (切换到真实API时请注释或删除)
    // return new Promise((resolve) => {
    //   setTimeout(() => {
    //     if (username === "patient001" && password === "123456") {
    //       resolve({
    //         user: { id: "user1", username: "patient001", role: "patient", avatar: "/avatars/patient.png" },
    //         token: "mock-patient-token"
    //       });
    //     } else if (username === "admin" && password === "admin123") {
    //       resolve({
    //         user: { id: "admin1", username: "admin", role: "admin", avatar: "/avatars/admin.png" },
    //         token: "mock-admin-token"
    //       });
    //     } else {
    //       throw new Error("用户名或密码错误");
    //     }
    //   }, 500);
    // });
  },
  // ... 其他API接口
};
```

**启用Mock数据（禁用真实API调用）：**

与上述操作相反，注释掉真实的 `axios` 调用，并取消注释Mock数据逻辑。

### 3.3 页面中的数据处理逻辑

在 `src/pages` 目录下的各个页面中，您会看到对 `src/services/api.js` 中定义的API服务的调用。当您切换API时，通常不需要修改这些页面中的调用方式，因为 `api.js` 已经封装了底层逻辑。

但是，请注意以下几点：

- **数据结构匹配**：确保后端API返回的数据结构与前端页面期望的数据结构一致。如果后端返回的数据结构与Mock数据不同，您可能需要在页面中或 `api.js` 中进行数据转换。
- **错误处理**：`src/services/api.js` 中提供了 `handleAPIError` 函数来统一处理API错误。请确保您的后端错误响应格式与 `handleAPIError` 函数的预期一致，以便前端能够正确显示错误信息。

## 4. 重新构建和部署

每次修改 `src/services/api.js` 或其他前端代码后，您都需要重新构建和部署前端项目，以使更改生效。

1. **停止开发服务器（如果正在运行）：**
   ```bash
   pnpm dev
   # 按 Ctrl+C 停止
   ```

2. **构建项目：**
   ```bash
   pnpm build
   ```

3. **部署项目：**
   如果您使用Manus平台进行部署，可以再次运行部署命令：
   ```bash
   service_deploy_frontend(brief = "部署更新后的前端项目", framework = "react", project_dir = "/home/ubuntu/frontend-ris/frontend-1")
   ```
   或者根据您的部署方式进行部署。

## 5. 总结

通过以上步骤，您可以灵活地在RIS回忆交互系统前端项目中使用Mock数据或真实后端API。这有助于在不同开发阶段保持开发流程的顺畅。

