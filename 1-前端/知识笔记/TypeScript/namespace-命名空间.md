# namespace 命名空间

## 一、一句话理解

`namespace` 的核心是把一组值和类型挂到同一个命名空间对象下，但在现代业务代码里，它已经不是主流模块化方案。

---

## 二、什么是 `namespace`

`namespace` 是 TypeScript 早期提供的一种组织代码的方式，过去也常被称为“内部模块”。

它的核心目标是：

1. 避免全局命名冲突。
2. 把相关成员收拢到一个命名空间对象下。

```ts
namespace Ns1 {
  const a = 123
}

namespace Ns2 {
  const a = 123
}
```

这时两个 `a` 不会互相冲突。

---

## 三、现代项目里怎么理解它

最关键的一点是：

**在现代前端业务代码里，主流组织方式已经是 ES Modules，而不是 `namespace`。**

也就是说：

1. 普通业务代码优先使用 `import` / `export`。
2. `namespace` 现在更多出现在声明文件、旧项目兼容、全局库类型描述中。

不要把 `namespace` 当成现代模块化的首选方案。

---

## 四、基本用法

### 3.1 命名空间中的成员默认不暴露

```ts
namespace Ns1 {
  const a = 123
}

// Ns1.a // 报错
```

### 3.2 使用 `export` 暴露成员

```ts
namespace Ns1 {
  export const a = 123
}

console.log(Ns1.a)
```

### 3.3 嵌套命名空间

```ts
namespace Ns1 {
  export namespace Inner {
    export const a = 123
  }
}

console.log(Ns1.Inner.a)
```

---

## 五、编译后的大致效果

`namespace` 编译后通常会变成一个对象加立即执行函数的组合。

可以粗略理解为：

```ts
namespace Ns1 {
  export const a = 123
}
```

会被转成类似：

```js
var Ns1
;(function (Ns1) {
  Ns1.a = 123
})(Ns1 || (Ns1 = {}))
```

这也说明它本质上更偏向“生成一个命名空间对象”，而不是现代 ESM 那种静态模块机制。

---

## 六、同名命名空间会合并

这是 `namespace` 一个很重要的特性。

```ts
namespace Ns1 {
  export const a = 123
}

namespace Ns1 {
  export const b = "abc"
}

Ns1.a
Ns1.b
```

### 5.1 怎么理解合并

可以把它理解成：

1. 第一段代码先创建 `Ns1`。
2. 第二段代码继续往 `Ns1` 上挂新成员。

编译后大致会得到两段 IIFE，共同操作同一个 `Ns1` 对象。

### 5.2 一个限制

虽然命名空间能合并，但**同名导出成员不能重复声明**。

```ts
namespace Ns1 {
  export const a = 123
}

namespace Ns1 {
  // export const a = 456 // 报错
  const b = "abc"
}
```

也就是说：

1. 可以新增导出成员。
2. 不能重复导出同名值。
3. 未导出的局部成员互不影响。

---

## 七、命名空间还能和类、函数、枚举合并

这是 TS 里一个比较有代表性的“声明合并”现象。

### 6.1 和类合并

```ts
class A {
  static a = 123
}

namespace A {
  export const b = "abc"
}

A.a
A.b
```

可以理解为：类本身也是一个运行时值，命名空间相当于继续给这个值补充静态成员。

### 6.2 和函数合并

```ts
function fn() {}

namespace fn {
  export const version = "1.0.0"
}

fn()
fn.version
```

### 6.3 和枚举合并

```ts
enum Status {
  Success,
  Fail,
}

namespace Status {
  export function isSuccess(value: Status) {
    return value === Status.Success
  }
}
```

### 6.4 这种写法的价值

它适合把“主体能力”和“辅助静态能力”挂在一起，但现代业务代码里依然不算主流，更常见于声明和历史代码。

---

## 八、命名空间与模块导出

命名空间也可以配合模块导出使用。

```ts
export namespace Utils {
  export const a = 123
}
```

然后：

```ts
import { Utils } from "./test"

console.log(Utils.a)
```

不过在现代项目里，通常更直接的写法是：

```ts
export const a = 123
export function sum() {}
```

所以即便能用 `namespace`，通常也未必是最佳方案。

---

## 九、声明文件中的 `namespace`

`namespace` 在声明文件里仍然很常见，尤其适合描述：

1. 老式 UMD 库。
2. 全局变量风格的库。
3. 某些需要命名空间挂载类型的场景。

### 8.1 作为模块导出

```ts
declare namespace mitt {
  const a: number
  type T = string
}

export = mitt
```

此时可以：

```ts
import mitt from "mitt"

mitt.a
```

### 8.2 作为全局变量暴露

```ts
declare namespace mitt {
  const a: number
  type T = string
}

export as namespace mitt
```

这常见于通过 CDN 直接挂到全局上的库。

---

## 十、`declare namespace` 只补类型，不补实现

如果你只是写了类型声明：

```ts
declare namespace Ns1 {
  const a: number
}
```

那么 TypeScript 只会在**类型层面**相信它存在。

```ts
Ns1.a
```

编辑器可能不报错，但如果运行时根本没有 `Ns1`，依然会报：

```text
ReferenceError: Ns1 is not defined
```

这和 `declare` 的核心原则一致：**声明只补类型，不补运行时实现。**

---

## 十一、同名值和类型的问题

在命名空间或声明文件里，值空间和类型空间是分开的，所以会出现“看起来同名，但其实分别属于值和类型”的情况。

```ts
declare namespace mitt {
  const valueOrType: number
  type valueOrType = string
}

export = mitt
```

使用时：

```ts
import mitt from "mitt"

mitt.valueOrType
type T = mitt.valueOrType
```

### 10.1 为什么这会让人困惑

因为阅读体验会变差，尤其是命名空间本来就已经把值和类型都挂在同一层级上。

### 10.2 更稳妥的避免方式

如果可能，尽量不要让值名和类型名完全相同。

必要时可以把结构包进接口，再把命名空间当作承载容器。

例如：

```ts
declare const mitt: mitt.IMitt

declare namespace mitt {
  interface IMitt {
    value: string
  }
}

export = mitt
```

这样比直接把“值名”和“类型名”写成同一个名字更清晰。

---

## 十二、`namespace` 与 ES Modules 的区别

| 对比项         | `namespace`   | ES Modules   |
| -------------- | ------------- | ------------ |
| 核心时代背景   | TS 早期方案   | 现代主流标准 |
| 组织方式       | 命名空间对象  | 文件级模块   |
| 依赖管理       | 不如 ESM 清晰 | 更清晰       |
| 当前业务推荐度 | 较低          | 很高         |

### 11.1 实际建议

1. 新项目业务代码优先用 ES Modules。
2. 看到 `namespace`，先判断它是不是在声明文件里。
3. 老项目迁移时可以理解它，但不建议在新业务代码里大量新增。

---

## 十三、真实开发里怎么快速判断

| 场景                             | 更常见选择               |
| -------------------------------- | ------------------------ |
| **现代业务模块组织**             | ES Modules               |
| **旧项目、全局库、声明文件兼容** | `namespace` 仍可能出现   |
| **想做声明合并或挂静态辅助能力** | `namespace` 有价值       |
| **新项目想组织普通业务代码**     | 不建议优先选 `namespace` |

---

## 十四、小结

1. `namespace` 是 TypeScript 早期组织代码的方案，本质上是给一组成员套一个命名空间对象。
2. 现代前端业务代码主流使用 ES Modules，而不是 `namespace`。
3. `namespace` 的高频价值主要在声明文件、旧库兼容和声明合并场景。
4. 同名命名空间可以合并，也可以和类、函数、枚举合并，但重复导出同名成员不行。
5. `declare namespace` 只补类型，不补运行时实现。
6. 学这篇时，重点不是背术语，而是理解它在现代项目中的真实定位和边界。
