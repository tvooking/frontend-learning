# 01. Git 工作流与团队协作

---

## 企业级 Git 工作流

### 分支策略（Git Flow 简化版）

```
main        ← 生产环境（只合并，不直接开发）
  ↑
release/v1.2  ← 发布分支（测试完成后合并到 main）
  ↑
develop     ← 主开发分支
  ↑
feature/a   ← 功能分支（从 develop 切出，完成后合并回去）
feature/b
hotfix/1.1  ← 紧急修复（从 main 切出，修复后同时合并到 main 和 develop）
```

### 日常开发流程

```bash
# 1. 同步最新代码
git checkout develop
git pull origin develop

# 2. 创建功能分支
git checkout -b feature/login-page

# 3. 开发、提交
git add .
git commit -m "feat: 添加登录页 UI"
git commit -m "fix: 修复表单验证bug"

# 4. 提交 PR 前先同步 develop
git fetch origin
git rebase origin/develop    # 或者 git merge develop

# 5. 推送到远端创建 PR
git push origin feature/login-page
```

### Commit Message 规范（Conventional Commits）

```bash
<type>(<scope>): <description>

# 类型
feat:     新功能
fix:      Bug 修复
docs:     文档变更
style:    格式（不影响代码运行）
refactor: 重构
test:     添加测试
chore:    构建/工具变更

# 示例
feat(auth): 添加微信登录功能
fix(login): 修复密码输入框光标跳动问题
refactor: 重构数据请求层，使用 React Query
chore: 升级 Vite 到 5.0
```

### Code Review 检查清单

```
□ 功能是否正常工作？
□ 有没有测试？
□ 有没有 TypeScript 类型错误？
□ 有没有性能问题？
□ 命名是否清晰？
□ 有没有重复代码？
□ 错误处理是否完善？
□ 有没有安全问题？
□ API 设计是否合理？
□ 要不要写注释？
```

---

## PR 模板示例

```markdown
## 描述
[简短描述这次改动的内容]

## 类型
- [ ] feat: 新功能
- [ ] fix: Bug 修复
- [ ] refactor: 重构

## 测试
- [ ] 本地测试通过
- [ ] 新增了单元测试
- [ ] 手动测试了边界情况

## 截图
[UI 改动的话贴截图]

## 相关 Issue
Closes #123
```

---

## 需要避免的 Git 错误

```bash
# ❌ 不要直接往 main 提交
git checkout main
git add . && git commit -m "改了点东西"

# ❌ 不要在 main 上开发
# ❌ 不要提交 node_modules
# ❌ 不要提交 .env 文件
# ❌ 不要用 git push --force（除非你知道在做什么）
# ❌ 不要在 PR 里混合多个不相关的功能
```
