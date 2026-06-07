# 02. 部署上线流程

---

## 部署平台对比

| 平台 | 适合 | 免费额度 | 学习成本 |
|------|------|----------|----------|
| **Vercel** | Next.js 项目 | 很充足 | ⭐ |
| **Netlify** | 静态站点 / SPA | 很充足 | ⭐ |
| **Cloudflare Pages** | 静态站点 | 无限带宽 | ⭐⭐ |
| **GitHub Pages** | 静态站点 | 免费 | ⭐ |
| **Railway** | 全栈应用 | 有限 | ⭐⭐ |
| **自己的服务器** | 任何 | 付费 | ⭐⭐⭐⭐ |

---

## 一键部署（以 Vercel 为例）

```bash
# 1. 将代码推送到 GitHub
git init
git add .
git commit -m "init"
git remote add origin https://github.com/your-name/my-app.git
git push -u origin main

# 2. 打开 vercel.com
# 3. 用 GitHub 登录
# 4. 点击 "Add New Project"
# 5. 选择你的仓库
# 6. 点击 "Deploy"
# 7. ✅ 部署完成！自动获得 https://my-app.vercel.app
```

### Vercel 的优势

- **自动 HTTPS** — 不用自己配证书
- **自动 CI/CD** — 每次 push 自动部署
- **Preview Deployments** — 每个 PR 自动生成预览链接
- **Serverless Functions** — 支持后端 API
- **域名绑定** — 可以绑定自己的域名

---

## Docker 部署（适用任何平台）

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
RUN npm ci --production

EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# 构建和运行
docker build -t my-app .
docker run -p 3000:3000 my-app
```

---

## CI/CD 示例（GitHub Actions）

```yaml
# .github/workflows/ci.yml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build
```

---

## 部署前 Checklist

```
□ 环境变量是否配置正确？
   - API 地址从开发环境切换到生产环境
   - 密钥不要硬编码

□ 有没有 404 页面？
□ 有没有处理 API 错误？
□ 有没有配置分析/监控？
□ 网站能不能在手机上正常显示？
□ 图片有没有压缩？
□ 有没有配置重定向？
□ 有没有配置 SEO meta 标签？
□ 有没有写 README？
```
