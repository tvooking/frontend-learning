// =============================================
// TypeScript 练习答案
// =============================================

// ----- 练习1答案 -----
function calculateTotal(
  price: number,
  quantity: number,
  discount?: number
): number {
  const subtotal = price * quantity;
  return discount ? subtotal * (1 - discount) : subtotal;
}

// ----- 练习2答案 -----
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  tags: string[];
}

interface CartItem {
  product: Product;
  quantity: number;
}

// ----- 练习3答案 -----
function firstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

const num = firstElement([1, 2, 3]);     // number
const str = firstElement(["a", "b"]);    // string

// ----- 练习4答案 -----
type Nullable<T> = T | null;

// 进阶：递归可选
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// ----- 练习5答案 -----
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

async function fetchUser(id: number): Promise<ApiResponse<User>> {
  const res = await fetch(`https://api.example.com/users/${id}`);
  const data: ApiResponse<User> = await res.json();
  return data;
}

// ----- 额外：实际项目常用工具类型 -----
type ValueOf<T> = T[keyof T];
type AsyncReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => Promise<infer U>
  ? U
  : never;
type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];
