# declare 声明

## 一、一句话理解

`declare` 的核心，不是写实现代码，而是告诉 TypeScript: 这些能力运行时已经存在，你现在只需要知道它们的类型长什么样。

---

## 二、什么是 `declare`

`declare` 用来告诉 TypeScript：**某个值、函数、类、模块或全局对象是存在的，只是它的实现不在当前文件里。**

它的核心作用不是“创建实现”，而是“补充类型信息”。

### 1. 一个直观理解

TypeScript 关心两件事：

1. 运行时有没有这个东西。
2. 编译时我知不知道它长什么样。

`declare` 解决的是第 2 件事。

---

## 三、为什么需要 `declare`

常见场景有：

1. 使用 JavaScript 编写的第三方包。
2. 通过 CDN 挂到全局上的库。
3. 引入非 TypeScript 文件类型。
4. 扩展全局对象。
5. 给旧代码补类型。

---

## 四、`declare` 的基础写法

### 1. 声明变量

```ts
declare const num: number

console.log(num)
```

### 2. 声明函数

```ts
declare function sum(a: number, b: number): number

sum(100, 200)
```

### 3. 声明类

```ts
declare class Person {
  constructor(name: string)
  sayHi(): void
}
```

### 4. 声明类型

```ts
declare type NumList = number[]
```

### 5. 声明模块

```ts
declare module "mitt"
```

不过真实项目里，通常会给模块写更完整的接口，而不是只写一个空声明。

---

## 五、`.d.ts` 声明文件

`declare` 最常见的落点是 `.d.ts` 文件。

例如：

1. `index.d.ts`
2. `global.d.ts`
3. `vite-env.d.ts`
4. 某个库自己的类型声明文件

### 1. `.d.ts` 的特点

1. 主要用于写类型声明。
2. 通常不写真实业务实现。
3. 会被 TypeScript 当作类型信息来源。

### 2. 编译产物

如果项目开启了：

```json
{
  "compilerOptions": {
    "declaration": true
  }
}
```

那么 `.ts` 代码在构建时也可以生成对应的 `.d.ts` 文件，供其他项目使用。

---

## 六、第三方库的声明文件查找顺序

当你安装一个库时，TypeScript 会尝试找到它的类型声明。

常见查找思路可以理解为：

1. 先看包内 `package.json` 的 `types` 或 `typings` 字段。
2. 没找到时，再看包根目录是否有 `index.d.ts`。
3. 还没有，再看 `@types/包名`。
4. 如果都没有，就需要自己补声明。

### 1. 典型例子

```bash
npm install lodash
npm install -D @types/lodash
```

并不是所有库都需要额外安装 `@types`，有些库本身就自带声明。

---

## 七、声明 jQuery 这类全局库

如果一个库是通过全局变量方式暴露出来的，可以自己补全局声明。

```ts
declare interface JQuery {
  width(width: number): this
  height(height: number): this
}

declare const $: {
  (selector: string): JQuery
  ajax(): void
}
```

这样 TypeScript 就能理解：

```ts
$("#map").width(100).height(200)
$.ajax()
```

---

## 八、声明非代码资源模块

前端项目里，经常需要声明图片、样式文件或其他非 TS 模块。

### 1. 声明 CSS 模块

```ts
declare module "*.module.css" {
  const classes: Record<string, string>
  export default classes
}
```

### 2. 声明图片模块

```ts
declare module "*.png" {
  const src: string
  export default src
}
```

这类写法在 Vite、Webpack、Next.js 项目里都很常见。

---

## 九、扩展全局对象

如果你要给 `window`、`globalThis` 等对象加自定义字段，通常也需要声明。

```ts
declare global {
  interface Window {
    appVersion: string
  }
}

window.appVersion = "1.0.0"
```

### 1. 为什么常用 `declare global`

因为在模块化环境下，直接写全局接口扩展有时不会按预期生效，`declare global` 更明确。

---

## 十、`tsconfig.json` 中和声明解析有关的配置

有时项目会自定义类型文件位置，这时常见配置包括：

```json
{
  "compilerOptions": {
    "moduleResolution": "Node",
    "baseUrl": "./",
    "paths": {
      "*": ["types/*"]
    }
  }
}
```

### 1. 这些配置的作用

| 配置项             | 作用             |
| ------------------ | ---------------- |
| `moduleResolution` | 控制模块解析策略 |
| `baseUrl`          | 设置基础路径     |
| `paths`            | 配置路径映射     |

### 2. 使用场景

1. 项目把声明文件统一放到 `types/` 目录。
2. 需要给某些路径别名补类型。
3. 需要覆盖默认的类型查找行为。

---

## 十一、真实开发里怎么判断该不该写 `declare`

| 场景                                     | 是否适合用 `declare` |
| ---------------------------------------- | -------------------- |
| **运行时已有第三方库，但 TS 不认识**     | 适合                 |
| **CDN 注入的全局变量**                   | 适合                 |
| **图片、样式等非代码模块导入**           | 适合                 |
| **当前文件里本来就能正常 import 到实现** | 往往不需要单独写     |

最关键的边界是: `declare` 解决的是编译期认知，不会凭空创造运行时代码。

---

## 十二、使用 `declare` 的注意点

1. `declare` 只描述类型，不提供实现。
2. 如果运行时根本不存在对应值，代码依然会报错。
3. 不要为了“先消除报错”随便写一个过宽的声明，否则类型系统会失去意义。
4. 给第三方库补类型时，尽量写到够用但准确，不要直接全部写成 `any`。

---

## 十三、总结

1. `declare` 的本质是给 TypeScript 补充“外部已有能力”的类型信息。
2. 它最常见的载体是 `.d.ts` 声明文件。
3. 第三方包、全局变量、非代码资源、旧 JS 项目迁移都经常会用到 `declare`。
4. `declare` 解决的是编译期认知问题，不会自动生成运行时实现。
5. 学这部分时，重点不是背语法，而是分清“类型声明”和“真实实现”是两回事。
