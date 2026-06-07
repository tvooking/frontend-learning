// ===== Vite 项目入口文件 =====
// 这里使用 ES Module 方式导入 CSS

import "./style.css";

// 可以导入其他 JS 模块
// import { formatDate } from "./utils.js";

console.log("🚀 Vite 项目已启动！");
console.log("💡 试试修改这个文件，浏览器会自动更新！");

// ===== 计数器功能 =====
const countEl = document.getElementById("count");
const incBtn = document.getElementById("increment");
const decBtn = document.getElementById("decrement");

let count = 0;

incBtn.addEventListener("click", () => {
  count++;
  countEl.textContent = count;
});

decBtn.addEventListener("click", () => {
  count--;
  countEl.textContent = count;
});

// ===== API 数据获取 =====
const fetchBtn = document.getElementById("fetch-btn");
const userList = document.getElementById("user-list");

fetchBtn.addEventListener("click", async () => {
  fetchBtn.textContent = "⏳ 加载中...";
  fetchBtn.disabled = true;

  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    const users = await res.json();

    userList.innerHTML = users
      .slice(0, 5)
      .map(
        (user) => `
      <div class="user-item">
        <div class="user-avatar">${user.name[0]}</div>
        <div class="user-info">
          <div class="user-name">${user.name}</div>
          <div class="user-email">${user.email}</div>
        </div>
      </div>
    `
      )
      .join("");
  } catch (err) {
    userList.innerHTML = `<p style="color:#e74c3c;">❌ 获取失败：${err.message}</p>`;
  } finally {
    fetchBtn.textContent = "📥 获取用户";
    fetchBtn.disabled = false;
  }
});
