## 一、React 介绍

### 1.1 什么是 React

**React** 是一个用来渲染用户界面（UI）的 JavaScript 库。

| 项目     | 说明 |
| -------- | ---- |
| **开发者** | Meta（Facebook） |
| **定位**   | 前端库，非完整框架 |
| **特点**   | 完全基于 JavaScript，用 JS 编写 HTML 结构，符合 JS 编程习惯 |

### 1.2 学习路径与收获

| 学习路径（顺序） | 说明 |
| ---------------- | ---- |
| JSX              | 编写页面结构 |
| 组件、组件通讯   | 组件化开发 |
| React Hooks      | 状态与副作用 |
| Redux            | 集中状态管理 |
| 路由             | 单页应用导航 |
| 综合案例         | 实战串联 |

| 应用场景         | 说明 |
| ---------------- | ---- |
| **H5 / PC 项目** | 开发网页应用 |
| **SPA**          | 单页应用程序 |
| **组件化**       | 可复用 UI 与逻辑 |
| **状态管理**     | 复杂数据流 |
| **提升 JS 能力** | 声明式、数据驱动 |

***

## 二、开发环境搭建

### 2.1 脚手架 CRA（已弃用）

**CRA（Create React App）** 曾是官方推荐的 React 脚手架；**2025 年 2 月起已被 React 团队正式弃用**，不再推荐用于新项目，仅处于维护模式（无新功能、无活跃维护者）。

| 状态       | 说明 |
| ---------- | ---- |
| **弃用时间** | 2025 年 2 月 14 日 |
| **当前用途** | 仅适合维护已有 CRA 项目；新项目应使用下方推荐方案 |

**弃用原因（了解即可）：** 基于 Webpack 的构建偏慢、无内置路由/数据请求/代码分割、无服务端渲染，且与 React 19 存在兼容问题。

**旧项目或学习时仍可用的命令（仅供参考）：**

| 步骤     | 说明 |
| -------- | ---- |
| **创建项目** | `npx create-react-app <项目名>` |
| **启动项目** | 进入项目目录后执行 `npm start` |

```bash
# 仅维护旧项目时使用；新项目不推荐
npx create-react-app react-basic
cd react-basic
npm start
```

| 名称         | 说明 |
| ------------ | ---- |
| `create-react-app` | 脚手架命令 |
| `react-basic`      | 项目名称，可自定义 |

### 2.2 推荐替代方案

**脚手架的意义**：零配置即可启动项目，统一构建、编译与规范（如 Babel、ESLint），便于专注业务开发而非工具配置。

新项目建议使用以下方式之一：

| 类型         | 推荐工具 | 说明 |
| ------------ | -------- | ---- |
| **轻量 SPA** | **Vite** | 最接近 CRA 的替代，启动与热更新快，适合纯前端 React 应用 |
| **全栈/框架** | Next.js、Remix、Gatsby | 自带路由、数据请求、SSR/SSG 等 |
| **构建工具** | Parcel、Rsbuild | 零配置或低配置，可搭配 React 使用 |

**Vite 创建 React + TypeScript 项目（推荐）：**

> 命令出处：**[Vite 官方文档 - Getting Started - Scaffolding Your First Vite Project](https://vitejs.dev/guide/)**（“Using create vite with command line options”一节）。模板列表见 [create-vite](https://github.com/vitejs/vite/tree/main/packages/create-vite)：`react`、`react-ts`、`react-swc`、`react-swc-ts` 等。

```bash
# 使用 Vite 创建 React + TypeScript 官方模板
npm create vite@latest <项目名> -- --template react-ts
cd <项目名>
npm install
npm run dev
```

### 2.3 目录结构说明

| 目录     | 说明 |
| -------- | ---- |
| **public** | 静态资源，不要删除 `index.html` 模板 |
| **src**    | 源码；入口文件多为 `index.js`（CRA）或 `main.jsx`/`main.tsx`（Vite），可保留入口后从零写 |

***

## 三、React 初体验

### 3.1 渲染三步

将 React 内容（如一个 `h1`）渲染到页面，分为三步：

1. 导包（`react`、`react-dom/client`）
2. 创建 React 根对象（`createRoot`）
3. 使用根对象调用 `render` 渲染内容

```jsx
// 1. 导包
import React from 'react'
import ReactDOM from 'react-dom/client'

// 2. 创建根对象（传入挂载的 DOM 节点）
const root = ReactDOM.createRoot(document.getElementById('root'))

// 3. 渲染内容（类似 HTML 的结构即 JSX）
root.render(<h1>Hello, React</h1>)
```

> 💡 要渲染什么内容，直接写类似 HTML 的结构即可，这种写法叫做 **JSX**（写在 JS 中的 HTML）。

***

## 四、JSX 的使用与原理

### 4.1 什么是 JSX

**JSX** 是 JavaScript 的语法扩展，允许在 JS 文件中写类似 HTML 的标记，用于描述 React 的页面结构。

| 项目     | 说明 |
| -------- | ---- |
| **作用** | 书写 React 页面结构 |
| **本质** | JS 的语法扩展，经构建工具（如 Vite）转换后变为 JS 对象 |

### 4.2 JSX 规范与 React 的关系

JSX 的**语法规范**与 React 是并列、独立的关系，并非 React 体系的一部分。

| 项目     | 说明 |
| -------- | ---- |
| **规范定义方** | Meta（Facebook）团队；独立规范 [facebook.github.io/jsx](https://facebook.github.io/jsx/)，仓库 [facebook/jsx](https://github.com/facebook/jsx) |
| **与 ECMAScript** | 不是 ECMAScript 的一部分，也不打算纳入 JS 标准；规范明确：*"It's NOT a proposal to incorporate JSX into the ECMAScript spec itself."* |
| **规范内容** | 只定义**语法**（词法/文法），**不定义语义**——即只规定“长什么样”，不规定“必须编译成什么” |
| **与 React** | React 只是 JSX 的一种使用方式：React 生态里 JSX 被转成 `React.createElement(...)`；Vue、Solid 等也可用同一套 JSX 语法，由各自的编译器转成自己的运行时调用 |

**结论**：JSX 是独立的语法规范；React 并非“包含”JSX，而是与 JSX 搭配使用最广泛。二者是并列关系，React 更适合与 JSX 结合使用。

### 4.3 JSX 原理（了解即可）

JSX 经构建工具转换后，会变为对 **React.createElement** 的调用，得到描述 UI 的 JS 对象（形如 `{ type, props }`），用于后续虚拟 DOM 与渲染。转换器由构建工具（如 Vite、esbuild）提供。

```
JS 的语法扩展（JSX） → 构建工具转换 → 返回值：JS 对象 { type, props }
```

**createElement 与 render 的直观理解**：`createElement(type, props, ...children)` 根据 `type` 和 `props` 生成一棵描述结构的对象树；真正把树变成 DOM 并挂到容器上的是渲染层（如 `ReactDOM.createRoot().render()`）。手写简易 render 的思路：根据对象的 `type` 创建元素，把 `props` 中的属性（含 `children`）应用到元素上，再递归或挂载到容器。

### 4.4 JSX 书写规则

| 规则             | 说明 |
| ---------------- | ---- |
| **唯一根节点**   | 最外层只能有一个根元素（或 Fragment） |
| **标签闭合**     | 所有标签必须闭合，如 `<input />` |
| **属性驼峰命名** | 如 `className`、`onClick`，不用 `class`、`onclick` |

### 4.5 VSCode 推荐配置（可选）

在 JS 文件中启用 JSX/Emmet 支持，并配置格式化与成对标签：

```json
// settings.json
{
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  },
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

推荐插件：**Prettier - Code formatter**、**Auto Rename Tag**。

### 4.6 JSX 中 `{}` 的应用

**作用**：让 JSX 变动态，可用于标签内容、属性等。

| 场景         | 常用写法 |
| ------------ | -------- |
| **列表渲染** | `map` 遍历数组 |
| **条件渲染** | `&&` 或 `? :` |
| **样式处理** | `className` 配合表达式 |

```jsx
// 列表渲染
{list.map(item => <li key={item.id}>{item.name}</li>)}

// 条件渲染
{isShow && <div>内容</div>}
{score >= 60 ? '及格' : '不及格'}

// 动态类名
<div className={isActive ? 'active' : ''}>...</div>
```

***

## 五、React 事件绑定

### 5.1 语法

**语法**：`on + 事件名` = `{ 事件处理函数 }`，事件名采用驼峰命名。

```jsx
<button onClick={handleClick}>点击</button>
```

| 写法     | 说明 |
| -------- | ---- |
| ❌ `onClick={handleClick()}` | 会在渲染时立即执行，不应带括号 |
| ✅ `onClick={handleClick}`   | 传递函数引用，点击时执行 |

> **注意**：事件处理函数应单独定义，不要写在 JSX 里内联定义（不利于复用和阅读）。如需事件对象，函数形参即为合成事件对象。

```jsx
// ✅ 推荐：单独定义
const handleClick = (e) => {
  console.log(e)
}
return <button onClick={handleClick}>点击</button>
```

### 5.2 合成事件与事件委托

React 中的事件对象是**合成事件（SyntheticEvent）**，不是原生 DOM 的 `event`，但接口与原生事件一致（如 `stopPropagation()`、`preventDefault()`），并统一了跨浏览器行为。

| 项目     | 说明 |
| -------- | ---- |
| **绑定方式** | 所有事件最终委托到根节点（如 `document`）统一触发，而非绑定在每个具体 DOM 上 |
| **阻止传播** | 在处理函数中调用 `e.stopPropagation()` 即可 |
| **异步中取 event** | 合成事件在本次事件调用结束后会被复用/清空，**不可在 `setTimeout`、`async` 回调等异步逻辑中访问 `e`**；若需异步使用，可先 `e.target` 或所需属性取出再用 |

***

## 六、React 组件

### 6.1 什么是组件

**React 组件** 是一个 JavaScript 函数，函数中可以返回 JSX 标记。

| 步骤     | 说明 |
| -------- | ---- |
| **创建组件** | 定义函数，返回 JSX，**组件名首字母大写** |
| **渲染组件** | 以标签形式使用，如 `<MyComponent />` |

```jsx
// 创建组件（首字母大写）
function Hello() {
  return <h1>Hello</h1>
}

// 渲染组件
function App() {
  return (
    <div>
      <Hello />
    </div>
  )
}
```

> **注意**：组件名称必须首字母大写，否则会被当作原生 HTML 标签。

### 6.2 组件高级：children 与组合

**children** 是 props 的一种：在组件标签内写的内容会作为 **props.children** 传入，用于布局、插槽等场景。

```jsx
function Card({ children }) {
  return <div className="card">{children}</div>
}

<Card><h2>标题</h2><p>内容</p></Card>
```

**组合优于继承**：React 推荐用组合（多个组件拼装、通过 props/children 传内容）而非继承扩展组件；业务逻辑复用可用自定义 Hook 或抽成子组件。

***

## 七、组件的状态

### 7.1 什么是状态

**状态（state）** 是能让页面内容随数据变化而更新的数据。React 采用数据驱动视图：修改状态 → 触发重新渲染。

### 7.2 useState

使用 **useState** 为组件提供状态：

| 返回值（解构）     | 说明 |
| ------------------ | ---- |
| **状态当前值**     | 第一次调用为默认值，之后为最新值 |
| **修改状态的函数** | 调用后更新状态并触发组件重新渲染 |

```jsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <span>{count}</span>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  )
}
```

| 步骤     | 说明 |
| -------- | ---- |
| 1. 修改状态 | 调用 `setCount` 等 set 函数 |
| 2. 重新渲染 | React 用新状态重新渲染该组件 |

### 7.3 更新为异步与函数式更新

React 会将多次状态更新**批量处理**，因此 set 函数是**异步**的：调用后不会立刻得到最新状态，下一次渲染时才会拿到新值。

| 场景     | 写法 |
| -------- | ---- |
| **基于上一次状态更新** | 使用 **函数式更新**：`setCount(prev => prev + 1)`，避免闭包拿到旧值 |
| **更新后执行逻辑** | 把逻辑写在 **useEffect** 中，依赖该状态，而不是依赖 set 的“回调” |

```jsx
// 连续两次“+1”：若写 setCount(count + 1) 可能只加一次（批处理导致 count 相同）
// ✅ 使用函数式更新，每次基于最新前值
setCount(prev => prev + 1)
setCount(prev => prev + 1)
```

### 7.4 修改状态的规则

**规则**：不要直接修改当前状态，应基于当前值创建新值再更新。

| 类型     | ❌ 不要                     | ✅ 应该                     |
| -------- | --------------------------- | --------------------------- |
| **简单类型** | 直接改变量                  | 调用 set 函数传入新值       |
| **复杂类型** | 直接改对象/数组属性或 push 等 | 新对象/新数组再 set（不可变） |

```jsx
// 简单类型
// ❌ count = 1
setCount(1)

// 数组：新增 / 删除 / 修改某一项
// ❌ list.push(item)
setList([...list, item])
// ❌ list.splice(i, 1)
setList(list.filter((_, index) => index !== i))
```

> **注意**：违反该规则可能导致报错或组件不重新渲染。

***

## 八、classnames 优化类名（可选）

当多个类名需要动态组合时，可用 **classnames** 包简化逻辑。

| 方式           | 适用场景       |
| -------------- | -------------- |
| 逻辑与 `&&`    | 单个类名有无   |
| 对象语法       | 多个类名组合   |

```bash
npm i classnames
```

```jsx
import classNames from 'classnames'

// 对象语法：键为类名，值为条件
<div className={classNames('tab', { active: isActive, disabled: isDisabled })} />
```

***

## 九、案例要点：B站评论

| 模块             | 要点 |
| ---------------- | ---- |
| **结构**         | App 组件 + SASS + 本地图片 |
| **评论列表**     | 状态驱动列表、`map` 渲染、`filter` 删除、`map` 修改点赞等 |
| **导航 Tab**     | 状态存 `activeIndex`，高亮用 `activeIndex === index`，可用 `lodash` 的 `orderBy` 排序 |
| **类名处理**     | 使用 `classnames` 处理多条件类名 |

| 方法 / 概念   | 说明 |
| ------------- | ---- |
| `map`         | 列表渲染、修改数组中某一项（返回新数组） |
| `filter`      | 删除某一项（返回新数组） |
| `orderBy`     | lodash 排序，用于「最热 / 最新」切换 |
