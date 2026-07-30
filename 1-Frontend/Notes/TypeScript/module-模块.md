# module 模块

## 一、一句话理解

`declare module` 的核心任务，是把某个可被导入的模块在类型层描述清楚，让 TS 知道这个模块能导出什么、该怎么被使用。

---

## 二、什么是 `declare module`

在 TypeScript 中，`declare module` 常用于：

1. 给一个现有模块补类型声明。
2. 为没有类型的第三方包手写 `.d.ts`。
3. 为特定资源文件声明导入类型，例如 `*.png`、`*.svg`。

一句话概括：**它解决的是“某个模块该怎么被 TS 理解”。**

---

## 三、最基本的写法

```ts
declare module "mitt"
```

模块名通常写在双引号里。

这表示：**项目中存在一个叫 `mitt` 的模块，只是这里还没有给它写出完整类型结构。**

---

## 四、只声明模块名，不等于真的有运行时代码

这是最容易误解的点。

### 4.1 只补类型，不补实现

如果你在 `.d.ts` 中这样写：

```ts
declare module "mitt"
```

TypeScript 只会觉得“这个模块在类型层是合法的”，但并不会真的帮你生成模块实现。

### 4.2 这意味着什么

```ts
import mitt from "mitt"
console.log(mitt)
```

如果运行时并没有这个包或实现，依旧会报错。

所以要明确区分：

| 层面           | 作用               |
| -------------- | ------------------ |
| **类型声明**   | 让 TS 不报类型错误 |
| **运行时代码** | 让程序真的能执行   |

---

## 五、在模块中声明导出内容

### 5.1 无默认导出

```ts
declare module "mitt" {
  export type T = string
  export const a: number
  export const b: string
}
```

使用时：

```ts
import { type T, a, b } from "mitt"
```

这里的规则和普通 TS 模块一致：

1. 导出了什么，就能按需导入什么。
2. 没导出的内容，外部无法引用。

### 5.2 默认导出

```ts
declare module "mitt" {
  export type T2 = string
  export const b: string

  const api: {
    name: string
  }

  export default api
}
```

使用时：

```ts
import mitt from "mitt"
import { type T2, b } from "mitt"
```

### 5.3 怎么理解

可以把 `declare module "xxx" {}` 大括号里的内容，当成“这个模块内部长什么样”的类型描述。

---

## 六、未导出的声明不能在外部使用

如果某个值或类型没有 `export`，外部就不能导入。

```ts
declare module "mitt" {
  type T1 = number
  const a: number
  export const b: string
}
```

外部只能稳定使用被导出的内容，例如 `b`。

---

## 七、模块内导入

在 `declare module` 里，也可以导入其他类型来辅助声明。

```ts
declare module "mitt" {
  import type { Component } from "vue"

  export type T = Component
}
```

这和普通 TS 模块内部写 `import type` 的思路一致。

适用场景：

1. 需要复用已有类型。
2. 给第三方库补声明时引用宿主框架类型。

---

## 八、同名模块声明会合并

```ts
declare module "mitt" {
  export const a: number
}

declare module "mitt" {
  export const b: string
}
```

最终效果会合并为同一个模块声明。

### 8.1 常见用途

1. 给第三方库做模块扩展。
2. 分文件补充同一模块的声明。

---

## 九、模块名可以使用通配符

这是前端项目里非常常见的写法。

```ts
declare module "*.png" {
  const src: string
  export default src
}
```

这样 TS 就知道：

```ts
import icon from "./icon.png"
```

中的 `icon` 是一个字符串路径。

### 9.1 常见文件类型声明

1. `*.png`
2. `*.jpg`
3. `*.svg`
4. `*.module.css`

---

## 十、值和类型可以同名

TS 中“值空间”和“类型空间”是分开的，因此会出现这样的写法：

```ts
declare module "mitt" {
  export const valueOrType: number
  export type valueOrType = string
}
```

使用时：

```ts
import * as mitt from "mitt"

mitt.valueOrType
type T = mitt.valueOrType
```

看起来同名，但一个在值空间，一个在类型空间。

### 10.1 为什么容易绕

因为阅读体验会变差，所以实际项目里应尽量避免把值名和类型名起成同一个名字。

---

## 十一、和 `declare global` 的区别

| 写法                 | 作用对象     |
| -------------------- | ------------ |
| **`declare module`** | 某个具体模块 |
| **`declare global`** | 全局作用域   |

简单判断方法：

1. 想补 `import xxx from "xxx"` 这种模块声明，用 `declare module`
2. 想补 `window`、全局类型、全局变量，用 `declare global`

这一点非常关键，因为很多声明问题本质上不是语法不会，而是补错了作用域。

---

## 十二、实际开发中的高频场景

### 12.1 给没有类型声明的第三方包补类型

### 12.2 给资源文件补导入类型

### 12.3 扩展已有库的模块声明

比如给某个 UI 库增加自定义主题字段，或给某个第三方包追加插件能力。

---

## 十三、真实开发里怎么快速判断

| 问题                               | 更该想到什么            |
| ---------------------------------- | ----------------------- |
| **某个 npm 包能 import，但没类型** | `declare module "xxx"`  |
| **图片 / 样式 / 资源导入报错**     | 通配符模块声明          |
| **要给已有模块补导出成员**         | 模块扩展 / 同名声明合并 |
| **明明声明了，运行时还报错**       | 检查是否真的有实现      |

---

## 十四、小结

1. `declare module` 用来描述“某个模块长什么样”。
2. 它只解决类型层问题，不会生成运行时代码。
3. 模块内部导出的内容，决定了外部可以怎么导入。
4. 同名模块声明会合并，通配符模块声明在前端工程里非常常见。
5. 学这篇时，重点是分清“类型声明”和“运行时实现”不是同一件事。
