const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

// ====== 中间件 ======
app.use(cors());           // 允许跨域请求
app.use(express.json());   // 解析 JSON 请求体

// ====== 模拟数据库（内存数组） ======
let todos = [
  { id: 1, title: "学习 Node.js", done: false },
  { id: 2, title: "写一个 API", done: true },
  { id: 3, title: "前后端联调", done: false }
];
let nextId = 4;

// ====== API 路由 ======

// GET /api/todos — 获取所有待办
app.get("/api/todos", (req, res) => {
  res.json({ success: true, data: todos });
});

// GET /api/todos/:id — 获取单个待办
app.get("/api/todos/:id", (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) {
    return res.status(404).json({ success: false, message: "未找到" });
  }
  res.json({ success: true, data: todo });
});

// POST /api/todos — 创建待办
app.post("/api/todos", (req, res) => {
  const { title } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ success: false, message: "标题不能为空" });
  }
  const newTodo = { id: nextId++, title: title.trim(), done: false };
  todos.push(newTodo);
  res.status(201).json({ success: true, data: newTodo });
});

// PUT /api/todos/:id — 更新待办
app.put("/api/todos/:id", (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) {
    return res.status(404).json({ success: false, message: "未找到" });
  }
  const { title, done } = req.body;
  if (title !== undefined) todo.title = title;
  if (done !== undefined) todo.done = done;
  res.json({ success: true, data: todo });
});

// DELETE /api/todos/:id — 删除待办
app.delete("/api/todos/:id", (req, res) => {
  const index = todos.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ success: false, message: "未找到" });
  }
  const deleted = todos.splice(index, 1)[0];
  res.json({ success: true, data: deleted, message: "已删除" });
});

// GET /api/health — 健康检查
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// ====== 启动服务器 ======
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════╗
║   🚀 API 服务器已启动！        ║
║   📍 http://localhost:${PORT}   ║
║   📡 接口列表：                ║
║   GET    /api/todos            ║
║   GET    /api/todos/:id        ║
║   POST   /api/todos            ║
║   PUT    /api/todos/:id        ║
║   DELETE /api/todos/:id        ║
║   GET    /api/health           ║
╚════════════════════════════════╝
  `);
});
