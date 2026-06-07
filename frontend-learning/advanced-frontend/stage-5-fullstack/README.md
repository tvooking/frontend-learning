# 🌐 全栈项目：待办清单

这是你第一个 **前后端分离** 的全栈项目！

## 📁 项目结构

```
stage-5-fullstack/
├── package.json      ← 项目配置
├── server/
│   └── index.js      ← 后端 API（Express）
├── client/
│   └── index.html    ← 前端页面（原生 JS）
└── README.md         ← 你正在看的这个文件
```

---

## 🚀 运行项目

### 第一步：安装依赖

```bash
cd stage-5-fullstack
npm install
```

### 第二步：启动后端服务器

```bash
node server/index.js
```

你会看到：
```
🚀 API 服务器已启动！
📍 http://localhost:3000
```

### 第三步：打开前端

直接用浏览器打开 `client/index.html`（双击即可），或者用 Live Server 启动。

---

## 🔗 前后端如何通信？

```
浏览器 (client/index.html)
        │
        │  fetch("http://localhost:3000/api/todos")
        ▼
Express 服务器 (server/index.js)
        │
        │  读取/写入数据
        ▼
内存数据库 (todos 数组)
```

- 前端用 **fetch API** 调后端接口
- 后端用 **Express** 处理请求
- 数据以 **JSON** 格式传输

---

## 📡 API 接口文档

| 方法 | 路径 | 功能 | 请求体 |
|------|------|------|--------|
| GET | /api/todos | 获取所有待办 | - |
| GET | /api/todos/:id | 获取单个待办 | - |
| POST | /api/todos | 创建待办 | { title: "xxx" } |
| PUT | /api/todos/:id | 更新待办 | { title? , done? } |
| DELETE | /api/todos/:id | 删除待办 | - |
| GET | /api/health | 健康检查 | - |

### 用 curl 测试 API

```bash
# 查看所有
curl http://localhost:3000/api/todos

# 创建新的
curl -X POST http://localhost:3000/api/todos ^
  -H "Content-Type: application/json" ^
  -d "{\"title\": \"学习全栈开发\"}"
```

---

## 🎯 扩展挑战

完成基础功能后，尝试：

1. **添加数据库** — 用 SQLite 或 JSON 文件替代内存数组（重启不丢失）
2. **用户认证** — 添加登录注册功能
3. **部署上线** — 部署到 Vercel / Render / 自己的服务器
4. **React 版前端** — 用 Vite + React 重新实现前端界面

---

## 💡 学到了什么？

| 知识点 | 说明 |
|--------|------|
| RESTful API | 设计规范的接口 |
| Express 路由 | GET/POST/PUT/DELETE |
| 前后端分离 | 前端只负责展示，后端管数据 |
| 跨域 CORS | 前端:5173 调后端:3000 需要 cors 中间件 |
| JSON 数据交换 | 前后端通过 JSON 格式通信 |
| CRUD 操作 | 增(Create) 查(Read) 改(Update) 删(Delete) |
