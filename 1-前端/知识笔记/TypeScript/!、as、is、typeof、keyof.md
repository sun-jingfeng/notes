# !、as、is、typeof、keyof

## 一、一句话理解

这几个关键字本质上都在帮助 TypeScript 更准确地理解值，但它们的出发点不同: 有的是你主动告诉 TS，有的是让 TS 自己推出来。

---

## 二、这几个操作符分别解决什么问题

这几个关键字虽然经常放在一起学，但职责并不一样。

| 关键字       | 主要作用                      | 常见场景                            |
| ------------ | ----------------------------- | ----------------------------------- |
| **`!`**      | 非空断言                      | 我确定某值不是 `null` / `undefined` |
| **`as`**     | 类型断言                      | 告诉 TS 按某个更具体类型处理        |
| **`is`**     | 自定义类型保护                | 在条件分支中缩小类型范围            |
| **`typeof`** | 获取值的类型 / 运行时判断类型 | 提取对象类型、做基本类型判断        |
| **`keyof`**  | 取对象类型的键联合            | 泛型工具类型、约束键名              |

一句话概括：**`!` 和 `as` 更偏“我来告诉 TS”，`is` / `typeof` / `keyof` 更偏“让 TS 推断得更准确”。**

---

## 三、`!` 非空断言

### 2.1 什么是非空断言

当一个值的类型里包含 `null` 或 `undefined`，但你在当前上下文里能够确定它一定有值时，可以使用 `!`。

```ts
const ele = document.getElementById("app")
ele!.style.backgroundColor = "#fff"
```

此时 `ele` 的原始类型通常是：

```ts
HTMLElement | null
```

`ele!` 的意思是：**我确定这里不是 `null`，请不要再报空值错误。**

### 2.2 适用场景

1. DOM 节点在页面中一定存在。
2. 某个可选值经过业务保证后一定有值。
3. 生命周期或异步流程里，某值在此时点已经初始化完成。

### 2.3 风险

`!` 只会消除 TypeScript 报错，不会在运行时帮你兜底。

如果你判断错了，依然会报运行时错误。

### 2.4 更稳妥的替代方式

如果可以，优先显式判断：

```ts
const ele = document.getElementById("app")

if (ele) {
  ele.style.backgroundColor = "#fff"
}
```

所以 `!` 更适合“我已经有充分上下文保证”的场景，而不是拿来替代正常判断。

---

## 四、`as` 类型断言

### 3.1 什么是类型断言

**类型断言** 是告诉 TS：把某个值按另一个类型来理解。

```ts
let strOrNum: string | number = Math.random() > 0.5 ? "abc" : 123

let num = strOrNum as number
```

这里的含义不是“把值转换成 number”，而是“把这个值当作 number 来看待”。

### 3.2 常见写法

```ts
const num = strOrNum as number
```

旧写法：

```ts
const str = <string>strOrNum
```

在 TSX / JSX 场景里，尖括号写法容易和标签语法冲突，因此实际开发更常用 `as`。

### 3.3 一个重要认知

`as` 不是运行时转换，它不会真的把字符串变成数字。

```ts
const value = "123" as unknown as number
```

这段代码只是在类型系统里“骗过” TS，运行时它仍然是字符串。

### 3.4 断言范围限制

一般只能断言到“有重叠可能”的类型。

```ts
let strOrNum: string | number = Math.random() > 0.5 ? "abc" : 123
// let flag: boolean = strOrNum as boolean // 报错
```

如果强行双重断言：

```ts
let flag = strOrNum as any as boolean
```

虽然能通过，但这通常意味着你正在绕开类型系统。

### 3.5 常见用途

#### 场景一：缩小联合类型

```ts
const value = Math.random() > 0.5 ? "abc" : 123
const str = value as string
```

#### 场景二：指定字面量联合类型

```ts
const obj = {
  style: "light" as "light" | "dark",
}
```

#### 场景三：配合映射类型改键名

```ts
type T = {
  [Key in "name" | "age" as `k_${Key}`]: any
}
```

#### 场景四：`as const`

```ts
const user = {
  name: "sjf",
  age: 20,
} as const
```

`as const` 会让：

1. 属性变为只读。
2. 值尽量收窄为字面量类型。

`as` 最常见的价值，不是强行改类型，而是补足 TS 一时推断不出来、但你确实知道的更具体信息。

---

## 五、`is` 类型谓词

### 4.1 什么是 `is`

`is` 常用于自定义类型保护，让 TypeScript 在条件分支里知道某个值被缩小成了更具体的类型。

```ts
function isString(value: string | number): value is string {
  return typeof value === "string"
}
```

### 4.2 使用效果

```ts
function handle(value: string | number) {
  if (isString(value)) {
    value.toUpperCase()
  } else {
    value.toFixed(2)
  }
}
```

在 `if` 分支里，TS 能把 `value` 缩小成 `string`；在 `else` 分支里，则缩小成 `number`。

### 4.3 为什么需要自定义类型保护

因为有些复杂判断不是内置 `typeof`、`instanceof` 能直接表达的，这时就需要把“判断规则”封装起来。

### 4.4 适用场景

1. 联合类型分支处理。
2. 接口返回值校验。
3. 复杂对象结构判断。

---

## 六、`typeof`

### 5.1 运行时里的 `typeof`

在 JavaScript / TypeScript 运行时里，`typeof` 可以判断基础值类型。

```ts
function print(value: string | number) {
  if (typeof value === "string") {
    console.log(value.toUpperCase())
  }
}
```

### 5.2 类型层里的 `typeof`

在类型位置，`typeof` 可以拿到一个变量或对象的类型。

```ts
const person = {
  name: "Sun",
  age: 20,
}

type Person = typeof person
```

此时 `Person` 等价于：

```ts
{
  name: string
  age: number
}
```

### 5.3 最常见用途

1. 从现有对象反推类型。
2. 避免手写重复的类型结构。
3. 配合 `ReturnType`、`Parameters` 等工具类型使用。

---

## 七、`keyof`

### 6.1 什么是 `keyof`

`keyof` 用来获取某个对象类型的所有键组成的联合类型。

```ts
type Person = {
  name: string
  age: number
}

type PersonKeys = keyof Person
```

此时：

```ts
type PersonKeys = "name" | "age"
```

### 6.2 典型场景

#### 场景一：约束函数参数必须是对象已有键

```ts
function getValue<T extends object, K extends keyof T>(obj: T, key: K) {
  return obj[key]
}
```

#### 场景二：配合映射类型批量处理属性

```ts
type ReadonlyPerson = {
  readonly [Key in keyof Person]: Person[Key]
}
```

### 6.3 一个补充认知

`keyof` 面向的是**类型**，不是运行时对象遍历。

也就是说它解决的是“类型系统里有哪些键”，不是“代码运行时把键列出来”。

---

## 八、真实开发里怎么快速选

| 目的                           | 更常用的工具    |
| ------------------------------ | --------------- |
| **我确定这里一定有值**         | `!`             |
| **我想补一个更具体的类型信息** | `as`            |
| **我想通过判断缩小联合类型**   | `is` / `typeof` |
| **我想从已有值里反推类型**     | 类型层 `typeof` |
| **我想拿对象所有键组成联合**   | `keyof`         |

一个很实用的判断是: 能让 TS 通过判断自己推出来，就别急着用 `as` 和 `!` 硬压过去。

---

## 九、这几个知识点怎么配合理解

可以用下面这张表串起来：

| 目的                           | 更常用的工具    |
| ------------------------------ | --------------- |
| 我知道这里一定不为空           | `!`             |
| 我想告诉 TS 这是某种类型       | `as`            |
| 我想让 TS 根据条件自动缩小类型 | `is` / `typeof` |
| 我想从已有值里提取类型         | `typeof`        |
| 我想拿到对象所有键             | `keyof`         |

---

## 十、小结

1. `!` 是非空断言，只消除类型报错，不提供运行时保护。
2. `as` 是类型断言，不等于类型转换。
3. `is` 用来定义自定义类型保护，能显著提升分支推断准确度。
4. `typeof` 既能在运行时做类型判断，也能在类型层提取值的类型。
5. `keyof` 用来获取对象类型的键联合，是泛型和工具类型里的高频基础。
