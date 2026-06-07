# Stage 1: TypeScript 精讲

TypeScript 是 **带类型的 JavaScript**，是目前前端开发的 **必备技能**。几乎所有正规前端岗位都要求 TS。

---

## 📖 课程目录

| 课时 | 内容 | 难度 |
|------|------|------|
| 01 | 基础类型系统 | ⭐ |
| 02 | 接口、类型别名、联合类型 | ⭐⭐ |
| 03 | 泛型 Generics | ⭐⭐⭐ |
| 04 | TS 工程配置与 React 集成 | ⭐⭐⭐ |

---

## 01. 基础类型系统

### 为什么需要 TypeScript？

```typescript
// ❌ JavaScript：运行时才发现错误
function add(a, b) {
  return a + b;
}
add("1", 2);  // "12" — 字符串拼接，不是你要的结果！

// ✅ TypeScript：编译时就报错
function add(a: number, b: number): number {
  return a + b;
}
add("1", 2);  // ❌ 类型错误！Argument of type "string" is not assignable to parameter of type "number"
```

### 基础类型

```typescript
// 基本类型（小写）
const name: string = "小明";
const age: number = 25;
const isActive: boolean = true;
const data: null = null;
const undef: undefined = undefined;

// 数组
const fruits: string[] = ["苹果", "香蕉"];
const numbers: Array<number> = [1, 2, 3];  // 泛型写法

// 元组 Tuple（固定长度数组）
const pair: [string, number] = ["小明", 25];

// 枚举 Enum
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT"
}
const dir: Direction = Direction.Up;

// any — 尽量避免使用！
let something: any = "可以是任何类型";
something = 42;       // ✅ 不报错，但失去了 TS 的保护

// unknown — 安全的 any
let unknownValue: unknown = "不知道是什么";
// unknownValue.toUpperCase();  // ❌ 报错！需要先类型收窄
if (typeof unknownValue === "string") {
  unknownValue.toUpperCase();   // ✅ 类型收窄后可以使用
}

// void — 没有返回值
function log(message: string): void {
  console.log(message);
}

// never — 永远不会返回
function throwError(message: string): never {
  throw new Error(message);
}
```

### 类型推断

```typescript
// TS 会自动推断类型
let count = 0;       // 自动推断为 number
// count = "hello";  // ❌ 报错

const greeting = "你好";  // 推断为字面量类型 "你好"
```

---

## 02. 接口、类型别名、联合类型

### Interface（接口）

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age?: number;           // 可选属性
  readonly createdAt: Date;  // 只读属性
}

const user: User = {
  id: 1,
  name: "小明",
  email: "xm@example.com",
  createdAt: new Date()
};
// user.createdAt = new Date();  // ❌ 只读，不能修改

// 继承
interface Admin extends User {
  role: "admin" | "superadmin";
  permissions: string[];
}

// 函数接口
interface SearchFunc {
  (source: string, subString: string): boolean;
}
const mySearch: SearchFunc = (src, sub) => src.includes(sub);
```

### Type（类型别名）

```typescript
// 基本类型别名
type ID = string | number;

// 联合类型
type Status = "idle" | "loading" | "success" | "error";

// 交叉类型
type WithTimestamps = {
  createdAt: Date;
  updatedAt: Date;
};
type Product = {
  id: number;
  name: string;
  price: number;
} & WithTimestamps;

// Utility Types
type PartialUser = Partial<User>;       // 所有属性可选
type RequiredUser = Required<User>;     // 所有属性必选
type PickUser = Pick<User, "id" | "name">;  // 只选 id 和 name
type OmitEmail = Omit<User, "email">;  // 排除 email
type ReadonlyUser = Readonly<User>;     // 所有属性只读

// Record
type PageInfo = {
  title: string;
  url: string;
};
type Pages = Record<"home" | "about" | "contact", PageInfo>;
```

### Interface vs Type 怎么选？

| 对比 | Interface | Type |
|------|-----------|------|
| 扩展 | extends | & (交叉) |
| 合并声明 | ✅ 自动合并 | ❌ 不能重复 |
| 联合类型 | ❌ | ✅ |
| 基本类型别名 | ❌ | ✅ |
| 元组 | ❌ | ✅ |

> 💡 **建议：** 定义对象/类用 `interface`，其他用 `type`

---

## 03. 泛型 Generics ⭐面试重点

### 为什么需要泛型？

```typescript
// ❌ 不用泛型：要么重复代码，要么丢失类型
function identity(arg: any): any {
  return arg;
}

// ✅ 用泛型：保留类型信息
function identity<T>(arg: T): T {
  return arg;
}

const result = identity<string>("hello");  // result 类型为 string
const num = identity(42);                  // 自动推断为 number
```

### 常用泛型场景

```typescript
// 泛型接口
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

type UserResponse = ApiResponse<User>;
type ListResponse = ApiResponse<User[]>;

// 泛型约束
interface HasLength {
  length: number;
}
function logLength<T extends HasLength>(arg: T): T {
  console.log(arg.length);
  return arg;
}
logLength("hello");     // ✅ 字符串有 length
logLength([1, 2, 3]);   // ✅ 数组有 length
// logLength(123);       // ❌ 数字没有 length

// 泛型函数
const first = <T>(arr: T[]): T | undefined => arr[0];

// 泛型组件（React）
// function List<T>({ items, render }: ListProps<T>) { ... }
```

### 条件类型 + infer

```typescript
// 提取 Promise 的返回值类型
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type Result = UnwrapPromise<Promise<string>>;  // string
type Direct = UnwrapPromise<number>;            // number

// 实际应用：React 中获取组件 Props 类型
// type ComponentProps = React.ComponentProps<typeof MyComponent>;
```

---

## 04. TS 工程配置

### tsconfig.json 核心配置

```json
{
  "compilerOptions": {
    "target": "ES2020",              // 编译目标版本
    "module": "ESNext",              // 模块系统
    "moduleResolution": "bundler",   // 模块解析策略
    "jsx": "react-jsx",              // React JSX 支持
    "strict": true,                  // 启用所有严格检查
    "esModuleInterop": true,         // 兼容 CommonJS
    "skipLibCheck": true,            // 跳过库文件检查
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,       // 支持导入 JSON
    "isolatedModules": true,
    "noEmit": true,                  // 仅类型检查，不输出
    "baseUrl": ".",                  // 路径别名基础路径
    "paths": {
      "@/*": ["src/*"]              // 路径别名
    }
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

### Vite + React + TS 项目创建

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
npm run dev
```

### 日常开发 Checklist

- [ ] `strict: true` — 必须开启
- [ ] 避免 `any` — 用 `unknown` + 类型守卫替代
- [ ] 组件 Props 用 `interface` 定义并导出
- [ ] API 响应用泛型 `ApiResponse<T>` 包裹
- [ ] 事件处理用 TS 内置类型：`React.ChangeEvent`、`React.FormEvent`

---

## ✏️ 练习题

1. 定义一个 `ApiResponse<T>` 类型，包含 `code`、`message`、`data`
2. 写一个泛型函数 `getProperty(obj, key)` 安全获取对象属性
3. 把之前待办清单的 JS 代码改写成 TS
4. 实现一个 `DeepReadonly<T>` 类型（递归只读）

---

## 🔍 面试考点

| 问题 | 答案要点 |
|------|----------|
| `any` vs `unknown` 区别 | unknown 需要类型收窄后才能使用 |
| `interface` vs `type` | interface 可合并，type 更灵活 |
| 泛型的作用 | 保持类型关系，避免丢失类型信息 |
| `keyof` 是什么 | 获取对象所有 key 的联合类型 |
| `infer` 关键字 | 在条件类型中推断类型变量 |
