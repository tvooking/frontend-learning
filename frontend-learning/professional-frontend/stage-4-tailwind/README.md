# Stage 4: Tailwind CSS

> "几乎不用写 CSS" 的开发方式，目前最流行的 CSS 框架

---

## 安装

```bash
# 用 Vite 创建项目时直接选 Tailwind 模板即可
npm create vite@latest my-app -- --template react-ts

# 或者现有项目安装
npm install -D tailwindcss @tailwindcss/vite
```

---

## 核心概念：原子化 CSS

### 不用自己写 CSS，只用 class 名

```tsx
// ❌ 传统方式：先写 CSS，再写 HTML
// .btn { background: blue; padding: 12px 24px; border-radius: 8px; }
// <button className="btn">按钮</button>

// ✅ Tailwind：直接在 class 里写
<button className="bg-blue-500 px-6 py-3 rounded-lg text-white hover:bg-blue-600 transition">
  按钮
</button>
```

### 常用类名速查

```tsx
// 布局
<div className="flex items-center justify-between" />
<div className="grid grid-cols-3 gap-4" />

// 间距
<div className="p-4 m-2 space-y-4" />     // p=padding, m=margin, space-y=子元素间距

// 文字
<p className="text-lg font-bold text-gray-700 text-center" />

// 颜色
<div className="bg-blue-500 text-white" />
// bg-blue-100 到 bg-blue-900（由浅到深）

// 圆角 + 阴影
<div className="rounded-lg shadow-md" />

// 响应式
<div className="text-sm md:text-base lg:text-lg" />
// md: = 768px以上, lg: = 1024px以上

// 悬停 + 过渡
<button className="hover:bg-blue-600 transition duration-300" />

// 暗色模式
<div className="bg-white dark:bg-gray-800 text-black dark:text-white" />
```

---

## 常用组件模式 ⭐面试考点

### 按钮组件

```tsx
interface ButtonProps {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

function Button({ variant = "primary", size = "md", children }: ButtonProps) {
  const baseStyle = "rounded-lg font-medium transition duration-200 focus:outline-none focus:ring-2";

  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-300",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-300",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-7 py-3 text-lg",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${sizes[size]}`}>
      {children}
    </button>
  );
}
```

### 卡片组件

```tsx
function Card({ title, children, className = "" }: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      {children}
    </div>
  );
}

// 使用
<Card title="用户信息" className="hover:shadow-lg transition">
  <p className="text-gray-600">姓名：小明</p>
</Card>
```

### 页面布局

```tsx
function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold">MyApp</h1>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-700 hover:text-blue-500">首页</a>
              <a href="#" className="text-gray-700 hover:text-blue-500">设置</a>
            </div>
          </div>
        </div>
      </nav>

      {/* 内容区 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card title="主要内容">
              <p>这里放主要内容</p>
            </Card>
          </div>
          <div>
            <Card title="侧边栏">
              <p>这里放侧边栏内容</p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
```

---

## Tailwind + 组件库对比

| 方案 | 优点 | 缺点 |
|------|------|------|
| Tailwind 纯手写 | 完全可控、包体积小 | HTML 里 class 多 |
| shadcn/ui | 高质量组件、可修改源码 | 需要适应 |
| Ant Design | 组件丰富、开箱即用 | 修改样式困难 |
| MUI | 设计规范、功能完整 | 学习成本高 |

> 💡 **建议：** 学习阶段用纯 Tailwind，工作中用 shadcn/ui

---

## ✏️ 练习题

1. 用 Tailwind 重写之前基础阶段的个人主页
2. 实现一个响应式导航栏（移动端折叠菜单）
3. 创建一个 Table 组件（排序、筛选）
4. 实现暗色模式切换（用 `dark:` 前缀）

---

## 🔍 面试考点

| 问题 | 答案 |
|------|------|
| Tailwind 优缺点 | 开发快、一致性高，但 class 名长 |
| 和 CSS-in-JS 对比 | Tailwind 优秀 (emotion/styled-components 已过时) |
| 如何定制主题 | tailwind.config.js 的 theme.extend |
| 性能优化 | 配合 purge（自动删除未使用的 CSS） |
