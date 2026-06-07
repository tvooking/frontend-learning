/* ====================================================
   个人主页 - JavaScript
   使用前几课学到的所有 JS 知识
   ==================================================== */

// ====== 页面加载完成后执行 ======
document.addEventListener("DOMContentLoaded", function() {
  console.log("🚀 个人主页已加载！");
  console.log("💡 这个网站是用你学到的前端知识制作的！");
});

// ====== 1. 导航菜单切换（移动端） ======
function toggleMenu() {
  const nav = document.getElementById("nav-links");
  nav.classList.toggle("active");
}

// 点击导航链接后自动关闭菜单
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    document.getElementById("nav-links").classList.remove("active");
  });
});

// ====== 2. 回到顶部按钮 ======
const backToTopBtn = document.getElementById("back-to-top");

window.addEventListener("scroll", function() {
  if (window.scrollY > 300) {
    backToTopBtn.classList.add("show");
  } else {
    backToTopBtn.classList.remove("show");
  }
});

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

// ====== 3. 导航栏滚动效果 ======
let lastScrollY = 0;
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", function() {
  // 向下滚动时隐藏导航栏，向上滚动时显示
  if (window.scrollY > lastScrollY && window.scrollY > 100) {
    navbar.style.transform = "translateY(-100%)";
  } else {
    navbar.style.transform = "translateY(0)";
  }
  lastScrollY = window.scrollY;
});

// ====== 4. 技能条动画 ======
// 使用 IntersectionObserver 在技能区进入视口时触发动画
const skillBars = document.querySelectorAll(".skill-progress");

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // 给进度条添加动画效果
      entry.target.style.transition = "width 1.5s ease";
      entry.target.style.width = entry.target.dataset.level || entry.target.style.width;
    }
  });
}, { threshold: 0.5 });

skillBars.forEach(bar => observer.observe(bar));

// ====== 5. 联系表单处理 ======
function handleSubmit(event) {
  event.preventDefault();  // 阻止页面刷新

  const form = event.target;
  const name = form.querySelector('input[type="text"]').value;
  const email = form.querySelector('input[type="email"]').value;
  const message = form.querySelector("textarea").value;

  // 简单的表单验证
  if (!name || !email || !message) {
    alert("请填写完整信息！");
    return;
  }

  // 显示成功提示
  alert(`✅ 谢谢 ${name}！消息已收到。\n（这是一个演示，实际发送需要后端支持）`);

  // 清空表单
  form.reset();
}

// ====== 6. 页面滚动进度条 ======
// 在页面顶部显示阅读进度
const progressBar = document.createElement("div");
progressBar.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #e94560, #667eea);
  z-index: 1001;
  transition: width 0.1s;
`;
document.body.appendChild(progressBar);

window.addEventListener("scroll", () => {
  const scrollTop = document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / scrollHeight) * 100;
  progressBar.style.width = progress + "%";
});

// ====== 7. 打字机效果（控制台彩蛋） ======
console.log("%c🎉 欢迎来到我的个人主页！", "font-size: 20px; color: #e94560;");
console.log("%c这个网站是用以下技术制作的：", "font-size: 14px;");
console.log("%c  🌐 HTML  - 页面结构", "font-size: 13px; color: #3498db;");
console.log("%c  🎨 CSS   - 样式布局", "font-size: 13px; color: #2ecc71;");
console.log("%c  ⚡ JS    - 交互功能", "font-size: 13px; color: #f39c12;");
console.log("%c你也可以做到！加油 💪", "font-size: 16px; color: #e94560;");
