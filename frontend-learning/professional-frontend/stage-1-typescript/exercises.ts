// =============================================
// TypeScript 练习文件
// 使用方式：npx ts-node exercises.ts
// 或复制到 Vite React TS 项目的 src 下测试
// =============================================

// ----- 练习1: 给函数加类型 -----
// 给下面这个函数加上 TypeScript 类型
function calculateTotal(price, quantity, discount?) {
  const subtotal = price * quantity;
  return discount ? subtotal * (1 - discount) : subtotal;
}

// ----- 练习2: 定义接口 -----
// 定义一个 Product 接口，包含 id、name、price、category、tags
// 再定义一个 CartItem 接口，包含 product、quantity


// ----- 练习3: 泛型函数 -----
// 实现一个泛型函数，从数组中取出第一个元素
function firstElement(arr) {
  return arr[0];
}

// 让它能正确推断类型：
// const num = firstElement([1, 2, 3]);     // number
// const str = firstElement(["a", "b"]);    // string

// ----- 练习4: 类型工具 -----
// 实现一个类型工具：Nullable<T> 给类型加上 null
// type Nullable<T> = ???

// ----- 练习5: API 响应类型 -----
// 给 fetchUser 函数加上完整类型

interface User {
  id: number;
  name: string;
  email: string;
}

async function fetchUser(id) {
  const res = await fetch(`https://api.example.com/users/${id}`);
  const data = await res.json();
  return data;
}

// 要求：返回类型为 Promise<ApiResponse<User>>

// =============================================
// 参考答案在 answers.ts 中
// 先自己尝试，实在想不出再看答案
// =============================================
