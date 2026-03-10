# TypeScript 高频题

## 一、interface 与 type

| 对比项 | **interface** | **type** |
| --- | --- | --- |
| **声明合并** | 同名 interface 可多次声明并合并 | 同名 type 不可重复声明 |
| **继承** | `extends` 扩展 | 交叉类型 `A & B` |
| **联合/交叉** | 不能直接表达联合 | `A \| B`、`A & B` |
| **映射类型** | 不支持 | 支持 `{ [K in keyof T]: ... }` |
| **适用** | 对象形状、类实现 | 联合、交叉、映射、复杂类型别名 |

```ts
interface User { name: string }
interface User { age: number }  // 合并

type Id = string | number
type Readonly<T> = { readonly [K in keyof T]: T[K] }
```

***

## 二、泛型

**泛型**把类型也当作参数，提高复用与类型安全。

```ts
function identity<T>(x: T): T { return x }
identity<number>(1)

interface ApiResult<T> { data: T; code: number }
function getList(): ApiResult<string[]> { ... }
```

**约束**：`<T extends SomeType>` 限制 T 必须满足某类型。

```ts
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}
```

***

## 三、联合类型与交叉类型

| 类型 | 含义 | 示例 |
| --- | --- | --- |
| **联合** `A \| B` | 取值是 A 或 B 之一 | `string \| number` |
| **交叉** `A & B` | 同时满足 A 和 B | `{ a: number } & { b: string }` |

***

## 四、enum

**enum** 编译后为对象（或反向映射）；可用 **const enum** 在编译期内联，减少运行时对象。

```ts
enum Role { Admin = 1, User = 2 }
const enum Flag { A, B }  // 内联为 0、1
```

***

## 五、any 与 unknown

| 类型 | 说明 |
| --- | --- |
| **any** | 关闭类型检查，可任意读写、调用，易埋坑 |
| **unknown** | 安全版 any；使用前必须**类型收窄**（typeof、instanceof、断言等）才能操作 |

```ts
function fn(x: unknown) {
  if (typeof x === 'string') return x.length
  if (x instanceof Date) return x.getTime()
  return 0
}
```

***

## 六、类型守卫

在分支里收窄类型：**typeof**、**instanceof**、**in**、**自定义 is 谓词**。

```ts
function isStr(v: unknown): v is string {
  return typeof v === 'string'
}
if (isStr(x)) { /* x 为 string */ }
```

***

## 七、常用工具类型

| 工具类型 | 作用 |
| --- | --- |
| **Partial\<T\>** | 所有属性可选 |
| **Required\<T\>** | 所有属性必选 |
| **Pick\<T, K\>** | 从 T 中挑出 K 键 |
| **Omit\<T, K\>** | 从 T 中去掉 K 键 |
| **Record\<K, V\>** | 键为 K、值为 V 的对象 |
| **ReturnType\<T\>** | 函数 T 的返回值类型 |

***

## 八、面试答题要点

- **interface vs type**：interface 可合并、extends；type 可联合/交叉/映射，更灵活。
- **泛型**：类型参数化，`T extends` 做约束。
- **unknown**：比 any 安全，用前必须收窄。
- **类型守卫**：typeof、instanceof、in、自定义 `is`。
- **工具类型**：Partial、Required、Pick、Omit、Record、ReturnType 等。
