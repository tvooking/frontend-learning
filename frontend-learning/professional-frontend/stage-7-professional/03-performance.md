# 03. 性能优化实战

---

## 性能指标（Core Web Vitals）

| 指标 | 全称 | 标准值 | 说明 |
|------|------|--------|------|
| **LCP** | Largest Contentful Paint | < 2.5s | 最大内容绘制 |
| **FID** | First Input Delay | < 100ms | 首次输入延迟 |
| **CLS** | Cumulative Layout Shift | < 0.1 | 累计布局偏移 |

### 测量工具

- **Lighthouse** — Chrome 内置，一键出报告
- **Web Vitals** — Google 的 JS 库
- **PageSpeed Insights** — 在线分析工具

---

## 优化策略（按优先级排序）

### 1. 图片优化（效果最明显）

```tsx
// ❌ 不好
<img src="/photo.jpg" />

// ✅ 好：指定尺寸 + lazy loading + WebP
<Image
  src="/photo.jpg"
  width={800}
  height={600}
  alt="描述"
  loading="lazy"     // 懒加载
  sizes="(max-width: 768px) 100vw, 800px"
/>

// ✅ 更好：用 Next.js Image 组件（自动优化）
import Image from "next/image";
<Image src="/photo.jpg" alt="描述" width={800} height={600} />
```

### 2. 代码分割

```tsx
// ❌ 不好：整个页面一次性加载
import AdminPanel from "./AdminPanel";

// ✅ 好：按需加载
const AdminPanel = lazy(() => import("./AdminPanel"));

// ✅ React 18：用 Suspense
<Suspense fallback={<Spinner />}>
  <AdminPanel />
</Suspense>

// ✅ Next.js：dynamic import
import dynamic from "next/dynamic";
const AdminPanel = dynamic(() => import("./AdminPanel"), {
  loading: () => <Spinner />,
});
```

### 3. 减少重渲染

```tsx
// useMemo + useCallback + React.memo 三个配合
// 具体用法见 Stage 2 React 深度实战
```

### 4. 打包优化

```bash
# 分析打包体积
npm install -D vite-bundle-analyzer

# 在 vite.config.ts 中配置
import { visualizer } from "rollup-plugin-visualizer";
plugins: [visualizer()]

# 构建后打开 stats.html 查看
```

### 5. 网络优化

```tsx
// 预加载关键资源
<link rel="preload" href="/font.woff2" as="font" />

// 预连接第三方域名
<link rel="preconnect" href="https://api.example.com" />

// DNS 预解析
<link rel="dns-prefetch" href="https://cdn.example.com" />
```

---

## 性能预算

### 设定目标

| 指标 | 目标值 |
|------|--------|
| 页面首次加载 | < 3s |
| 首次内容绘制 (FCP) | < 1.8s |
| 总 JS 体积 | < 300KB |
| 首次加载请求数 | < 20 |
| Lighthouse 分数 | > 90 |

### 自动化

```bash
# 在 CI 中检查性能
npm install -D lighthouse-ci

# package.json
{
  "scripts": {
    "perf:check": "lighthouse-ci https://your-site.com"
  }
}
```

---

## 常见性能问题排查

| 症状 | 可能原因 | 解决方案 |
|------|----------|----------|
| 页面白屏时间长 | JS 太大 | 代码分割 + Tree Shaking |
| 滚动卡顿 | 大量 DOM 操作 | 虚拟列表（react-window） |
| 图片加载慢 | 没压缩/太大 | WebP + 压缩 + CDN |
| 按钮点击无反应 | JS 执行耗时 | Web Worker 处理密集计算 |
| 字体闪烁 | 字体文件加载慢 | preload + font-display: swap |
