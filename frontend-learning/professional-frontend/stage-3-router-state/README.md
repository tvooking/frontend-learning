# Stage 3: React Router + 状态管理

---

## 📖 课程目录

| 课时 | 内容 | ⭐ |
|------|------|-----|
| 01 | React Router v6 完全指南 | ⭐⭐⭐⭐⭐ |
| 02 | Zustand 状态管理 | ⭐⭐⭐⭐ |
| 03 | 实战：多页面应用 | ⭐⭐⭐⭐⭐ |

---

## 01. React Router v6

### 安装

```bash
npm install react-router-dom
```

### 基础路由配置

```tsx
import { BrowserRouter, Routes, Route, Link, useParams, Outlet } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">首页</Link>
        <Link to="/about">关于</Link>
        <Link to="/products">产品</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<ProductsLayout />}>
          <Route index element={<ProductList />} />
          <Route path=":id" element={<ProductDetail />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 嵌套路由（Outlet）

```tsx
function ProductsLayout() {
  return (
    <div>
      <h2>产品页面</h2>
      {/* 子路由的内容会渲染在这里 */}
      <Outlet />
    </div>
  );
}

// 访问 /products/123 时：
// ProductsLayout 渲染
//   → <h2>产品页面</h2>
//   → ProductDetail 组件

function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  return <div>产品 ID: {id}</div>;
}
```

### 编程式导航

```tsx
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    await login();
    navigate("/dashboard", { replace: true });  // 替换历史，不能后退到登录页
  };

  return <button onClick={handleLogin}>登录</button>;
}
```

### 路由守卫

```tsx
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

// 使用
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

---

## 02. Zustand 状态管理

> 为什么选 Zustand？比 Redux 简单 10 倍，比 Context 性能好 10 倍

### 安装

```bash
npm install zustand
```

### 创建 Store

```tsx
import { create } from "zustand";

// 定义类型
interface Todo {
  id: number;
  text: string;
  done: boolean;
}

interface TodoStore {
  todos: Todo[];
  filter: "all" | "active" | "completed";
  addTodo: (text: string) => void;
  toggleTodo: (id: number) => void;
  removeTodo: (id: number) => void;
  setFilter: (filter: TodoStore["filter"]) => void;
}

// 创建 store
const useTodoStore = create<TodoStore>((set) => ({
  todos: [
    { id: 1, text: "学习 Zustand", done: false },
    { id: 2, text: "写个 Demo", done: true },
  ],
  filter: "all",

  addTodo: (text) =>
    set((state) => ({
      todos: [...state.todos, { id: Date.now(), text, done: false }],
    })),

  toggleTodo: (id) =>
    set((state) => ({
      todos: state.todos.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t
      ),
    })),

  removeTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter((t) => t.id !== id),
    })),

  setFilter: (filter) => set({ filter }),
}));
```

### 在组件中使用

```tsx
function TodoList() {
  const todos = useTodoStore((state) => state.todos);
  const filter = useTodoStore((state) => state.filter);
  const toggleTodo = useTodoStore((state) => state.toggleTodo);

  // ✅ 只订阅 todos 和 filter，如果其他状态变了不会重新渲染

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.done;
    if (filter === "completed") return todo.done;
    return true;
  });

  return (
    <ul>
      {filteredTodos.map((todo) => (
        <li
          key={todo.id}
          onClick={() => toggleTodo(todo.id)}
          style={{ textDecoration: todo.done ? "line-through" : "none" }}
        >
          {todo.text}
        </li>
      ))}
    </ul>
  );
}

function TodoStats() {
  const todos = useTodoStore((state) => state.todos);
  const done = todos.filter((t) => t.done).length;

  return (
    <div>
      总计: {todos.length} | 已完成: {done}
    </div>
  );
}
```

### Zustand vs Context vs Redux

| 对比 | Zustand | Context | Redux |
|------|---------|---------|-------|
| 样板代码 | 极少 | 中等 | 很多 |
| 性能 | ✅ 自动订阅 | ❌ 整个子树重渲染 | ✅ |
| TypeScript | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| 学习成本 | 10分钟 | 30分钟 | 2天 |
| 适合项目 | 任何规模 | 小项目 | 大型项目 |

---

## 03. 实战：创建一个多页面应用

### 项目结构

```
src/
├── store/
│   └── useStore.ts           ← Zustand store
├── pages/
│   ├── Home.tsx
│   ├── Products.tsx
│   ├── ProductDetail.tsx
│   └── Cart.tsx
├── components/
│   ├── Layout.tsx             ← 导航 + Outlet
│   └── ProtectedRoute.tsx    ← 路由守卫
├── hooks/
│   └── useFetch.ts
├── App.tsx                    ← 路由配置
└── main.tsx                   ← 入口
```

### 推荐的目录结构（中型项目）

```
src/
├── features/          ← 按功能模块划分
│   ├── auth/          ← 认证模块
│   │   ├── store.ts
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── components/
│   └── products/      ← 产品模块
│       ├── store.ts
│       ├── ProductList.tsx
│       ├── ProductDetail.tsx
│       └── components/
├── shared/            ← 共享组件和工具
│   ├── components/    ← Button, Modal, Input...
│   ├── hooks/         ← useDebounce, useFetch...
│   └── utils/         ← formatDate, validate...
├── router/            ← 路由配置
├── App.tsx
└── main.tsx
```

---

## ✏️ 练习题

1. 创建包含 3 个页面的 React 应用（首页/产品/关于）
2. 用 Zustand 实现购物车功能（添加/删除/数量修改）
3. 实现"最近浏览"功能（存在 localStorage）
4. 添加路由过渡动画（framer-motion）

---

## 🔍 面试考点

| 问题 | 答案要点 |
|------|----------|
| React Router 的几种传参方式 | useParams、searchParams、state |
| SPA 的路由原理 | History API（pushState），不会刷新页面 |
| 状态管理选型原则 | 全局状态用 Zustand，服务器状态用 React Query |
| 为什么不用 Context 做全局状态 | 会导致所有消费者重渲染 |
