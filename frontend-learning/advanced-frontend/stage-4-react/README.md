# React 快速入门

React 是目前最流行的前端 UI 框架。它让你用**组件**来构建用户界面。

---

## 🧩 什么是组件？

组件就是**可复用的 UI 片段**。每个组件是一个函数，返回一段 HTML。

```jsx
// 这是一个 React 组件
function Greeting({ name }) {
  return <h1>你好，{name}！</h1>;
}

// 使用组件
<Greeting name="小明" />
```

---

## ⚛️ React 的核心概念

| 概念 | 说明 | 类比 |
|------|------|------|
| **组件** | 函数返回 JSX（类似 HTML） | 积木块 |
| **Props** | 从父组件传入的参数 | 积木的参数 |
| **State** | 组件内部的数据，变化时自动重新渲染 | 组件的记忆 |
| **Hooks** | 让函数组件拥有更多功能 | 工具包 |
| **JSX** | 在 JS 中写 HTML | 模板语法 |

---

## 🪝 最重要的 Hooks

### useState — 状态管理
```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>你点了 {count} 次</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}
```

### useEffect — 副作用（API 请求等）
```jsx
import { useState, useEffect } from "react";

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);  // [] 表示只在组件挂载时执行一次

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

---

## 🚀 创建 React 项目

```bash
# 方式1：Vite + React 模板（推荐）
npm create vite@latest my-react-app -- --template react

cd my-react-app
npm install
npm run dev
```

### 项目结构
```
my-react-app/
├── src/
│   ├── App.jsx         ← 主组件
│   ├── main.jsx        ← 入口文件
│   └── App.css
├── index.html
├── package.json
└── vite.config.js
```

---

## 📦 JSX 规则

1. 必须有一个**根元素**（或用 `<>...</>` 包裹）
2. 使用 `className` 代替 `class`
3. 用 `{变量名}` 在 JSX 中嵌入 JS 表达式
4. 条件渲染：`{condition && <组件/>}` 或 `{condition ? <A/> : <B/>}`
5. 列表渲染：`{array.map(item => <li key={item.id}>{item}</li>)}`

---

## 🎯 动手任务

学完基础知识后，尝试：

1. 用 Vite 创建一个 React 项目
2. 把之前做的**待办清单** 改写成 React 版本
3. 添加一个"暗色模式"切换功能

---

## 📚 推荐学习资源

- [React 官方文档 (中文)](https://zh-hans.react.dev/) — 最好的入门资料
- [React Tutorial (Tic-Tac-Toe)](https://zh-hans.react.dev/learn/tutorial-tic-tac-toe) — 官方教程
