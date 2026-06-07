# 前端工程化：npm / Vite / Git

从这节课开始，你需要安装 **Node.js**。打开终端（Powershell）来操作。

---

## 1️⃣ 安装 Node.js

### 检查是否已安装
```bash
node --version   # 显示 v18+ 就说明已安装
npm --version    # npm 是 Node.js 自带的包管理器
```

### 如果没安装
去 https://nodejs.org 下载 LTS 版本（长期支持版），安装时全部默认选项即可。

---

## 2️⃣ npm — Node Package Manager

npm 是 **全世界最大的代码包仓库**。需要什么功能，直接安装现成的包。

```bash
# 初始化一个新项目（会在当前目录创建 package.json）
npm init -y

# 安装一个包（比如一个颜色库）
npm install chalk

# 安装开发依赖（只在开发时用）
npm install --save-dev vite

# 卸载
npm uninstall chalk

# 查看已安装的包
npm list
```

### package.json 文件
这是项目的"身份证"，记录了项目名、版本、依赖等信息。

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {},
  "devDependencies": {
    "vite": "^5.0.0"
  }
}
```

---

## 3️⃣ Vite — 现代构建工具

Vite 是目前最流行的前端构建工具，极快的冷启动速度。

### 创建一个 Vite 项目

```bash
# 方式1：用模板创建
npm create vite@latest my-app -- --template vanilla

# 方式2：手动创建（推荐学习）
# 1. 新建文件夹，npm init -y
# 2. npm install --save-dev vite
# 3. 创建 index.html 和 main.js
# 4. package.json 加 scripts: { "dev": "vite" }
```

### Vite 的优势
- ⚡ 极速冷启动（毫秒级）
- 🔥 热模块替换（修改代码即时生效）
- 📦 生产构建（自动优化、打包）
- 🔧 开箱支持 TypeScript、CSS 预处理器

---

## 4️⃣ 第一个 Vite 项目

在 `vite-demo/` 目录下有一个现成的 Vite 项目模板：

```bash
cd stage-3-tools/vite-demo
npm install
npm run dev
```

然后在浏览器打开显示的地址（通常是 http://localhost:5173）。

---

## 5️⃣ Git 版本控制基础

```bash
# 配置
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"

# 基本流程
git init                    # 初始化仓库
git add .                   # 暂存所有文件
git commit -m "第一次提交"   # 提交

# 查看状态
git status                  # 查看哪些文件改了
git log                     # 查看提交历史

# 分支
git branch                  # 查看分支
git branch feature-x       # 创建分支
git checkout feature-x     # 切换分支
git merge feature-x        # 合并分支
```

---

## 📌 本节课总结

| 工具 | 用途 | 必学程度 |
|------|------|----------|
| npm | 安装和管理依赖包 | ⭐⭐⭐⭐⭐ |
| Vite | 构建和开发服务器 | ⭐⭐⭐⭐⭐ |
| Git | 版本控制和协作 | ⭐⭐⭐⭐⭐ |
| package.json | 项目配置 | ⭐⭐⭐⭐ |
| node_modules | 不要手动修改 | ⭐ (了解即可) |

> 💡 安装 Node.js 后，把 `stage-3-tools/vite-demo` 跑起来试试！
