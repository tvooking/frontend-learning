# Stage 6: 前端测试

> "不改测试的代码重构等于没重构" — 写测试是专业工程师的必备习惯

---

## 📖 课程目录

| 课时 | 内容 | ⭐ |
|------|------|-----|
| 01 | 测试基础与 Vitest | ⭐⭐⭐ |
| 02 | React Testing Library | ⭐⭐⭐⭐⭐ |
| 03 | Mock 与集成测试 | ⭐⭐⭐⭐ |
| 04 | E2E 测试（Playwright） | ⭐⭐⭐ |

---

## 01. Vitest 快速上手

### 安装

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

### vitest.config.ts

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",  // 模拟浏览器环境
    globals: true,         // 全局可用 describe/it/expect
    setupFiles: "./src/test/setup.ts",
  },
});
```

### 第一个测试

```ts
// sum.ts
export function sum(a: number, b: number) {
  return a + b;
}

// sum.test.ts
import { describe, it, expect } from "vitest";
import { sum } from "./sum";

describe("sum 函数", () => {
  it("应该正确计算两个数字的和", () => {
    expect(sum(1, 2)).toBe(3);
    expect(sum(-1, 1)).toBe(0);
    expect(sum(0, 0)).toBe(0);
  });

  it("应该处理大数", () => {
    expect(sum(1000000, 2000000)).toBe(3000000);
  });
});
```

---

## 02. React Testing Library ⭐⭐⭐⭐⭐

### 测试组件渲染

```tsx
// Button.tsx
interface ButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function Button({ label, onClick, disabled }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      {label}
    </button>
  );
}

// Button.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Button } from "./Button";

describe("Button 组件", () => {
  it("应该渲染按钮文字", () => {
    render(<Button label="点击我" />);
    expect(screen.getByText("点击我")).toBeDefined();
  });

  it("点击时应该调用 onClick", () => {
    const handleClick = vi.fn();  // 模拟函数
    render(<Button label="点击" onClick={handleClick} />);

    fireEvent.click(screen.getByText("点击"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("disabled 时不应该触发点击", () => {
    const handleClick = vi.fn();
    render(<Button label="禁用" onClick={handleClick} disabled />);

    fireEvent.click(screen.getByText("禁用"));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
```

### 测试表单

```tsx
// LoginForm.tsx
export function LoginForm({ onSubmit }: { onSubmit: (data: { email: string; password: string }) => void }) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" placeholder="邮箱" />
      <input name="password" type="password" placeholder="密码" />
      <button type="submit">登录</button>
    </form>
  );
}

// LoginForm.test.tsx
describe("LoginForm 组件", () => {
  it("应该提交表单数据", () => {
    const handleSubmit = vi.fn();
    render(<LoginForm onSubmit={handleSubmit} />);

    // 填写表单
    fireEvent.change(screen.getByPlaceholderText("邮箱"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("密码"), {
      target: { value: "123456" },
    });

    // 提交
    fireEvent.click(screen.getByText("登录"));

    expect(handleSubmit).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "123456",
    });
  });
});
```

### 测试异步操作

```tsx
// UserProfile.tsx
export function UserProfile({ userId }: { userId: number }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <div>加载中...</div>;
  return <div>{user?.name}</div>;
}

// UserProfile.test.tsx
import { render, screen, waitFor } from "@testing-library/react";

describe("UserProfile 组件", () => {
  it("应该加载并显示用户名称", async () => {
    // Mock fetch
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ id: 1, name: "小明" }),
    });

    render(<UserProfile userId={1} />);

    // 加载中
    expect(screen.getByText("加载中...")).toBeDefined();

    // 等待数据加载完成
    await waitFor(() => {
      expect(screen.getByText("小明")).toBeDefined();
    });
  });
});
```

---

## 03. Mock 技巧

### Mock API 请求

```ts
// 方式1：直接 mock fetch
global.fetch = vi.fn();

// 方式2：用 MSW（推荐，拦截真实请求）
// npm install -D msw
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

const server = setupServer(
  http.get("/api/users/1", () => {
    return HttpResponse.json({ id: 1, name: "小明" });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### Mock 模块

```ts
// 假设有一个 useAuth hook
import { useAuth } from "@/hooks/useAuth";

// 在测试文件中 mock 整个模块
vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ user: { name: "小明" }, isLoggedIn: true }),
}));
```

---

## 04. 测试覆盖率

```bash
# 生成测试覆盖率报告
npx vitest --coverage

# 在 package.json 中配置
{
  "scripts": {
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "test:ui": "vitest --ui"
  }
}
```

### 覆盖率要求

| 指标 | 说明 | 公司标准 |
|------|------|----------|
| 语句覆盖率 | 每行代码是否执行 | > 80% |
| 分支覆盖率 | if/else 是否都覆盖 | > 75% |
| 函数覆盖率 | 每个函数是否被调用 | > 85% |

---

## 05. E2E 测试（Playwright）

```bash
npm install -D @playwright/test
npx playwright install
```

```ts
// tests/login.spec.ts
import { test, expect } from "@playwright/test";

test("用户应该能成功登录", async ({ page }) => {
  await page.goto("http://localhost:3000/login");

  await page.fill("[name=\"email\"]", "user@example.com");
  await page.fill("[name=\"password\"]", "password123");
  await page.click("button[type=\"submit\"]");

  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.locator("text=欢迎回来")).toBeVisible();
});
```

---

## ✏️ 练习题

1. 给之前的待办清单组件写测试（添加、删除、切换状态）
2. Mock API 请求测试数据加载组件
3. 用 Playwright 做一个 E2E 测试

---

## 🔍 面试考点

| 问题 | 答案 |
|------|------|
| 单元测试测什么 | 纯函数、工具函数、组件渲染 |
| 集成测试测什么 | 组件交互、API 调用流程 |
| E2E 测试测什么 | 用户完整操作流程 |
| TDD 是什么 | 先写测试再写代码 |
| AAA 模式 | Arrange-Act-Assert（准备-执行-断言） |
