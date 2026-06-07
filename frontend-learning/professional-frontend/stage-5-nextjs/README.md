# Stage 5: Next.js 全栈框架

> React 框架的"国家队"，也是目前最主流的选择。大型项目、创业公司首选。

---

## 为什么选 Next.js？

| 需求 | 纯 React | Next.js |
|------|----------|---------|
| SEO | ❌ 纯客户端渲染 | ✅ SSR + SSG |
| 路由 | React Router | ✅ 文件系统路由 |
| API | 需要额外搭后端 | ✅ API Routes |
| 性能优化 | 手动做 | ✅ 自动 |
| 部署 | 复杂 | ✅ Vercel 一键部署 |

---

## 安装与项目结构

```bash
npx create-next-app@latest my-app --typescript --tailwind --app
```

### App Router（当前推荐）的项目结构

```
my-app/
├── app/
│   ├── layout.tsx         ← 全局布局
│   ├── page.tsx           ← 首页 /
│   ├── about/
│   │   └── page.tsx       ← /about
│   ├── products/
│   │   ├── page.tsx       ← /products
│   │   └── [id]/
│   │       └── page.tsx   ← /products/123（动态路由）
│   ├── api/               ← API Routes
│   │   └── todos/
│   │       └── route.ts   ← /api/todos
│   └── globals.css
├── public/                ← 静态资源
├── package.json
└── next.config.ts
```

---

## 核心概念

### 页面与路由（App Router）

```tsx
// app/page.tsx — 首页
export default function Home() {
  return <h1>首页</h1>;
}

// app/products/[id]/page.tsx — 动态路由
export default function ProductPage({ params }: { params: { id: string } }) {
  return <h1>产品 {params.id}</h1>;
}

// app/layout.tsx — 全局布局（所有页面共用）
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <nav>导航栏</nav>
        {children}
        <footer>页脚</footer>
      </body>
    </html>
  );
}
```

### 数据获取方式

```tsx
// 1. 服务端组件（默认，推荐）
// 直接在组件里 async 获取数据
async function getProducts() {
  const res = await fetch("https://api.example.com/products");
  return res.json();
}

export default async function ProductsPage() {
  const products = await getProducts();
  // ✅ 数据在服务端获取，SEO友好
  // ✅ fetch 默认自动缓存（Deduplication）

  return (
    <ul>
      {products.map(p => <li key={p.id}>{p.name}</li>)}
    </ul>
  );
}
```

```tsx
// 2. 客户端组件
"use client";  // 标记为客户端组件

import { useState, useEffect } from "react";

export default function ClientProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(setProducts);
  }, []);

  return <ul>{products.map(p => <li key={p.id}>{p.name}</li>)}</ul>;
}
```

### API Routes

```tsx
// app/api/todos/route.ts
import { NextResponse } from "next/server";

// 模拟数据库
const todos = [
  { id: 1, title: "学习 Next.js", done: false },
];

// GET /api/todos
export async function GET() {
  return NextResponse.json(todos);
}

// POST /api/todos
export async function POST(request: Request) {
  const body = await request.json();
  const newTodo = { id: Date.now(), title: body.title, done: false };
  todos.push(newTodo);
  return NextResponse.json(newTodo, { status: 201 });
}

// DELETE /api/todos/:id — 需要放在 [id]/route.ts 里
// export async function DELETE(request, { params }) { ... }
```

---

## 渲染策略对比

| 策略 | 英文 | 适用场景 |
|------|------|----------|
| 静态生成 | SSG | 博客、文档、营销页 |
| 服务端渲染 | SSR | 电商、社交、SEO 重要 |
| 客户端渲染 | CSR | 后台管理、仪表盘 |
| 增量静态生成 | ISR | 大规模内容网站 |

```tsx
// SSG：构建时生成（默认）
export default function Page() {
  // 没有动态函数（cookies/headers/searchParams）
  // 自动 SSG
}

// SSR：每次请求生成
export default function Page() {
  // 使用了动态函数
  const cookies = cookies();  // 自动变成 SSR
}

// ISR：定时重新生成
export default async function Page() {
  const data = await fetch("https://api.example.com/data", {
    next: { revalidate: 60 }  // 每60秒重新生成
  });
  // ...
}
```

---

## 一个完整的 Next.js 页面

```tsx
// app/products/page.tsx
import Link from "next/link";

interface Product {
  id: number;
  title: string;
  price: number;
}

async function getProducts(): Promise<Product[]> {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
    next: { revalidate: 3600 },  // 每小时重新获取
  });
  return res.json();
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">产品列表</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.slice(0, 12).map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="block p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
            <p className="text-gray-600">ID: {product.id}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

---

## 部署

```bash
# 构建
npm run build

# 部署到 Vercel（最推荐，一键部署）
# 1. 推送到 GitHub
# 2. 在 vercel.com 导入仓库
# 3. 自动部署完成，会自动分配域名

# 部署到 Docker
# FROM node:20-alpine
# WORKDIR /app
# COPY . .
# RUN npm install && npm run build
# EXPOSE 3000
# CMD ["npm", "start"]
```

---

## ✏️ 练习题

1. 创建一个 Next.js 博客（文章列表 + 详情页）
2. 添加 API Route 作为后端
3. 实现 SSG 和 ISR 两种数据获取方式
4. 部署到 Vercel

---

## 🔍 面试考点

| 问题 | 答案要点 |
|------|----------|
| Next.js 相比 React 的优势 | SSR/SSG/SEO、文件路由、API Routes |
| 服务端组件 vs 客户端组件 | 服务端：async/直接 fetch，客户端：use client/hooks |
| App Router vs Pages Router | App Router 是新的推荐方式 |
| 如何做 SEO | 服务端组件、generateMetadata、sitemap |
| 部署方式 | Vercel 一键部署，或 Docker 自托管 |
