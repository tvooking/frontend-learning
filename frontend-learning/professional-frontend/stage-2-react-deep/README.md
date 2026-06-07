# Stage 2: React 深度实战

> 从"会用"到"精通"，掌握 React 的企业级开发模式

---

## 📖 课程目录

| 课时 | 内容 | ⭐面试重点 |
|------|------|-----------|
| 01 | Hooks 原理与规则 | ⭐⭐⭐⭐⭐ |
| 02 | 自定义 Hooks 实战 | ⭐⭐⭐⭐ |
| 03 | 性能优化 | ⭐⭐⭐⭐⭐ |
| 04 | 组件设计模式 | ⭐⭐⭐⭐ |
| 05 | 错误边界与 Suspense | ⭐⭐⭐ |

---

## 01. Hooks 原理与规则

### 🪝 useState 原理

```tsx
// 你写的代码
function Counter() {
  const [count, setCount] = useState(0);
  // ...
}

// React 内部大概是这样工作的：
// React 通过"链表"按顺序记录每个 Hook
// 这就是为什么 Hooks 不能写在条件语句或循环里
// 因为每次渲染，Hook 的调用顺序必须完全一致！
```

### ⚠️ Hooks 三条铁律

```tsx
// ✅ 正确
function Component() {
  const [count, setCount] = useState(0);
  useEffect(() => { document.title = `${count}`; }, [count]);
  return <div>{count}</div>;
}

// ❌ 错误1：不能放在条件里
function Bad() {
  if (someCondition) {
    const [data, setData] = useState(null);  // 报错！
  }
}

// ❌ 错误2：不能放在循环里
function Bad() {
  for (let i = 0; i < 3; i++) {
    useEffect(() => {});  // 报错！
  }
}

// ❌ 错误3：不能放在回调里
function Bad() {
  const handleClick = () => {
    const [count, setCount] = useState(0);  // 报错！
  };
}
```

### useEffect 的四种模式

```tsx
// 1. 每次渲染都执行（不传依赖）
useEffect(() => {
  console.log("每次渲染都执行");
});

// 2. 只在挂载时执行一次（传空数组）
useEffect(() => {
  console.log("只在组件挂载时执行");
}, []);

// 3. 依赖变化时执行
useEffect(() => {
  console.log(`count 变了: ${count}`);
}, [count]);

// 4. 清理函数（组件卸载或重新执行前调用）
useEffect(() => {
  const timer = setInterval(() => setCount(c => c + 1), 1000);
  return () => clearInterval(timer);  // 清理定时器
}, []);
```

### useRef 的三大用途

```tsx
function Form() {
  // 1. 操作 DOM
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { inputRef.current?.focus(); }, []);

  // 2. 保存可变值（改变不会触发重新渲染）
  const countRef = useRef(0);
  const handleClick = () => { countRef.current++; };

  // 3. 保存上一次的值
  const prevCount = useRef(count);
  useEffect(() => { prevCount.current = count; }, [count]);

  return <input ref={inputRef} />;
}
```

---

## 02. 自定义 Hooks 实战 ⭐面试重点

### 把逻辑提取到自定义 Hook

```tsx
// useLocalStorage.ts — 带持久化的状态
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    window.localStorage.setItem(key, JSON.stringify(valueToStore));
  };

  return [storedValue, setValue] as const;
}

// 使用
function App() {
  const [theme, setTheme] = useLocalStorage("theme", "light");
}
```

### 常用自定义 Hooks 集合

```tsx
// useDebounce — 防抖（搜索框输入）
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

// useFetch — 数据请求
function useFetch<T>(url: string) {
  const [state, setState] = useState<{
    data: T | null;
    loading: boolean;
    error: Error | null;
  }>({ data: null, loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    setState(s => ({ ...s, loading: true }));

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch(error => {
        if (!cancelled) setState({ data: null, loading: false, error });
      });

    return () => { cancelled = true; };
  }, [url]);

  return state;
}

// useMediaQuery — 响应式断点
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);
  return matches;
}
```

---

## 03. 性能优化 ⭐⭐⭐⭐⭐

### React.memo — 避免不必要的重渲染

```tsx
const ExpensiveComponent = React.memo(function Expensive({ data }: { data: string }) {
  console.log("重新渲染了！");
  return <div>{data}</div>;
});

// 只有当 props 变化时才会重新渲染
// 适用于：纯展示组件、计算量大的组件
```

### useMemo — 缓存计算结果

```tsx
function Dashboard({ transactions }: { transactions: Transaction[] }) {
  // 只有 transactions 变化时才重新计算
  const total = useMemo(() => {
    return transactions.reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  // ⚠️ 不要滥用：只有计算量大的时候才用
  const displayTotal = `¥${total.toLocaleString()}`;  // 这个不需要 useMemo

  return <div>{displayTotal}</div>;
}
```

### useCallback — 缓存函数引用

```tsx
function Parent() {
  const [count, setCount] = useState(0);

  // ❌ 每次渲染都会创建新的函数引用
  // 如果传给子组件，会导致子组件每次都重渲染
  const handleClick = () => setCount(c => c + 1);

  // ✅ 用 useCallback 缓存
  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []);  // 依赖为空，函数引用永远不变

  return <Child onClick={handleClick} />;
}
```

### 性能优化 Checklist

```tsx
function OptimizedList({ items, onItemClick }: Props) {
  return (
    <div>
      {items.map(item => (
        // ✅ 恒定且唯一的 key
        <ListItem key={item.id} item={item} onClick={onItemClick} />
      ))}
    </div>
  );
}

// 使用 React.memo 包裹子组件
const ListItem = React.memo(function ListItem({ item, onClick }: {
  item: Item;
  onClick: (id: number) => void;
}) {
  return <div onClick={() => onClick(item.id)}>{item.name}</div>;
});
```

---

## 04. 组件设计模式

### 复合组件模式

```tsx
// ❌ 不好的设计：一个组件 prop 太多
<Modal
  open={isOpen}
  onClose={handleClose}
  title="确认"
  content="确定要删除吗？"
  footer={<button onClick={handleClose}>取消</button>}
/>

// ✅ 复合组件：灵活、可读性强
<Modal open={isOpen} onClose={handleClose}>
  <Modal.Header>确认</Modal.Header>
  <Modal.Body>确定要删除吗？</Modal.Body>
  <Modal.Footer>
    <button onClick={handleClose}>取消</button>
    <button onClick={handleConfirm}>确认</button>
  </Modal.Footer>
</Modal>
```

### Render Props + Children

```tsx
// 数据提供者模式
function DataLoader<T>({
  url,
  children,
}: {
  url: string;
  children: (data: { data: T; loading: boolean; error: Error | null }) => React.ReactNode;
}) {
  const state = useFetch<T>(url);
  return <>{children(state)}</>;
}

// 使用
<DataLoader url="/api/user">
  {({ data, loading }) =>
    loading ? <Spinner /> : <UserProfile user={data} />
  }
</DataLoader>
```

---

## 05. 错误边界与 Suspense

```tsx
// 错误边界（class component，目前还没有 hook 版本）
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("捕获错误:", error, info);
    // 可以发送错误日志到监控服务
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <h1>出错了</h1>;
    }
    return this.props.children;
  }
}

// 使用
<ErrorBoundary fallback={<ErrorFallback />}>
  <UserProfile />
</ErrorBoundary>
```

---

## ✏️ 练习题

1. 实现一个 `useWindowSize` Hook（监听窗口大小变化）
2. 用 `useReducer` 重写待办清单的状态管理
3. 实现防抖搜索组件（输入框 + useDebounce）
4. 创建一个复合组件 `Tabs`（Tab + TabPanel）

---

## 🔍 面试高频题

| 问题 | 答案要点 |
|------|----------|
| useEffect 的依赖数组怎么用 | 空数组=挂载时，有值=依赖变化时，不传=每次都执行 |
| useMemo vs useCallback | useMemo 缓存值，useCallback 缓存函数 |
| key 的作用 | 帮助 React 识别哪些元素改变了 |
| 为什么 Hooks 不能放在条件里 | Hook 依赖调用顺序的链表结构 |
| 什么是闭包陷阱 | useEffect 里取到的 state 是旧值 |
