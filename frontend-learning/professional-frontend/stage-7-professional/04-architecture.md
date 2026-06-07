# 04. 项目架构设计

---

## 前端项目分层架构

```
┌────────────────────────────────────────────┐
│              UI 层 (Components)            │
│  页面组件 · 通用组件 · 布局组件             │
├────────────────────────────────────────────┤
│            状态层 (State)                   │
│  Zustand Store · React Query · Context     │
├────────────────────────────────────────────┤
│            服务层 (Services)               │
│  API 请求 · 数据转换 · 缓存策略            │
├────────────────────────────────────────────┤
│            工具层 (Utils)                  │
│  格式化 · 验证 · 常量 · 类型定义           │
└────────────────────────────────────────────┘
```

---

## 推荐的项目目录结构

```
src/
├── app/                    # Next.js App Router 页面
│   ├── (auth)/             # 路由分组（不影响 URL）
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx      # 仪表盘布局（带侧边栏）
│   │   └── page.tsx
│   └── api/                # API Routes
│
├── components/             # 共享组件
│   ├── ui/                 # 基础 UI 组件
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   ├── Input.tsx
│   │   └── Table.tsx
│   └── layout/             # 布局组件
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── Footer.tsx
│
├── features/               # 按功能模块划分
│   ├── auth/               # 认证模块
│   │   ├── api.ts          # 认证相关 API
│   │   ├── store.ts        # 认证状态
│   │   ├── types.ts        # 类型定义
│   │   └── components/     # 认证相关组件
│   └── products/           # 产品模块
│
├── hooks/                  # 共享自定义 Hooks
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   └── useMediaQuery.ts
│
├── lib/                    # 工具函数
│   ├── utils.ts            # 通用工具
│   ├── format.ts           # 格式化（日期、金额等）
│   └── validators.ts       # 表单验证
│
├── types/                  # 全局类型定义
│   └── api.ts              # API 响应类型
│
├── styles/                 # 全局样式
│   └── globals.css
│
├── config/                 # 配置
│   ├── constants.ts        # 常量
│   └── env.ts              # 环境变量
│
└── __tests__/              # 测试
```

---

## 组件设计原则

### 单一职责

```tsx
// ❌ 不好的设计：一个组件做太多事
function UserProfile() {
  // 获取数据
  // 格式化数据
  // 渲染 UI
  // 处理用户交互
}

// ✅ 好的设计：分离关注点
// 容器组件：负责数据和状态
function UserProfileContainer({ userId }: { userId: number }) {
  const { data, loading } = useFetch<User>(`/api/users/${userId}`);
  if (loading) return <Skeleton />;
  return <UserProfileCard user={data} />;
}

// 展示组件：只负责渲染
function UserProfileCard({ user }: { user: User }) {
  return (
    <Card>
      <Avatar src={user.avatar} />
      <h2>{user.name}</h2>
      <p>{user.bio}</p>
    </Card>
  );
}
```

### Props 设计原则

```tsx
// ❌ 传太多 prop
<UserProfile
  id={1}
  name="小明"
  email="xm@example.com"
  avatar="/avatar.jpg"
  bio="前端工程师"
  location="北京"
  website="https://..."
  github="..."
/>

// ✅ 用 interface 组织相关 prop
interface UserProfileProps {
  user: {
    id: number;
    name: string;
    email: string;
    avatar: string;
  };
  className?: string;  // 允许外部覆盖样式
  onEdit?: () => void; // 可选回调
}

// ✅ 使用 children 组合
<Card>
  <CardHeader>标题</CardHeader>
  <CardBody>内容</CardBody>
  <CardFooter>
    <Button>确认</Button>
  </CardFooter>
</Card>
```

---

## 错误处理策略

```tsx
// 统一 API 错误处理
class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number
  ) {
    super(message);
  }
}

// API 封装
async function apiClient<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new AppError(
      error.message || "请求失败",
      error.code || "UNKNOWN_ERROR",
      res.status
    );
  }

  return res.json();
}

// 使用
try {
  const data = await apiClient<User[]>("/api/users");
} catch (error) {
  if (error instanceof AppError) {
    if (error.status === 401) {
      // 跳转登录
    } else if (error.status === 403) {
      // 显示无权限
    } else {
      // 显示错误提示
    }
  }
}
```
