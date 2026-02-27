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
npx create-react-app <项目名>
cd <项目名>
npm start
```

| 名称         | 说明 |
| ------------ | ---- |
| `create-react-app` | 脚手架命令 |
| `<项目名>`   | 项目目录名，可自定义 |

### 2.2 推荐替代方案

**脚手架的意义**：零配置即可启动项目，统一构建、编译与规范（如 Babel、ESLint），便于专注业务开发而非工具配置。

CRA 弃用后，React 官方与社区推荐的新项目起步方式包括 **Next.js**、**Vite** 等，**按项目需求选择**：需要全栈、SSR/SSG、文件路由或 API 路由时选 Next.js；纯前端 SPA、无需服务端能力时选 Vite 即可。

| 适用场景                     | 推荐工具 | 说明 |
| ---------------------------- | -------- | ---- |
| **全栈、SSR/SSG、内置路由与 API** | **Next.js**（create-next-app） | React 全栈框架，支持服务端渲染、静态生成、增量再生成、静态导出等，自带文件路由与 API 能力 |
| **纯前端 SPA、轻量起步**     | **Vite**（create vite） | 构建工具，冷启动与 HMR 快，React 官方文档中推荐的起步方式之一，无内置路由与 SSR |
| **其他**                     | Remix、Gatsby、Parcel、Rsbuild | 按技术栈与需求选用 |

**Next.js（create-next-app）：**

```bash
npx create-next-app@latest <项目名>
cd <项目名>
npm run dev
```

> 💡 交互式提示中可选 TypeScript、ESLint、Tailwind、`src/` 目录、App Router 等；当前 Next.js 文档以 App Router 为主。

| 名称 | 说明 |
| ---- | ---- |
| `create-next-app@latest` | 使用最新版 Next.js 创建项目 |
| `<项目名>` | 项目目录名，可自定义 |

***

**Vite（create vite）：**

> 💡 模板可选：`react`、`react-ts`、`react-swc`、`react-swc-ts` 等，按需替换 `--template` 参数。

```bash
# 使用 Vite 官方模板创建 React + TypeScript 项目
npm create vite@latest <项目名> -- --template react-ts
cd <项目名>
npm install
npm run dev
```

**Vite 官方模板特点：** 仅提供 React + TypeScript + Vite，不含 ESLint/Prettier、Husky、测试等；需要完整工具链时可选用社区模板或自行叠加。

#### 1. 使用带完整工具链的现成模板

| 方向       | 说明 |
| ---------- | ---- |
| **现成模板** | 自带 ESLint、Prettier、Husky、Commitlint 等，可直接 `npx degit <仓库> <项目名>` 或 clone 后安装依赖 |
| **自行叠加** | 先用 Vite 建项目，再按各工具官方文档安装并配置 |

**查找方式：** GitHub Topics（如 `react-starter-kit`）、Awesome 类列表、聚合站或关键词搜索（如 `vite react typescript eslint prettier`），使用前查看 README 的包含内容与最后更新时间，优先选近期有更新的仓库。

**使用示例：** 选定模板后执行 `npx degit <作者/仓库名> <项目名>`，进入目录执行 `npm install` 与 `npm run dev`。若模板带 Husky 等，需按 README 完成初始化。

#### 2. 在 Vite 项目上自行添加工具链

若已用 `npm create vite@latest ... -- --template react-ts` 建好项目，可在此基础上按需安装：

| 工具 | 作用 | 说明 |
| ---- | ---- | -------- |
| **ESLint** | 代码检查 | Vite 新建时可选；未带时安装 `eslint`、`typescript-eslint`、`eslint-plugin-react`、`eslint-plugin-react-hooks` 等并配置 `eslint.config.js` |
| **Prettier** | 代码格式化 | `prettier`、`eslint-config-prettier`（避免与 ESLint 冲突） |
| **Stylelint** | CSS/SCSS 规范 | `stylelint`、`stylelint-config-standard` 等 |
| **Husky + lint-staged** | 提交前自动 lint/format | `husky`、`lint-staged` |

配置步骤见各工具官方文档；Vite 使用 ESLint 扁平配置（`eslint.config.js`），与旧版 `.eslintrc` 格式不同。

### 2.3 目录结构说明

| 目录 / 文件     | 说明 |
| ---------------- | ---- |
| **根目录 index.html** | 入口 HTML（Vite 在根目录；CRA 在 public）。不要删除，构建会以此为模板 |
| **public**       | 静态资源（图片、favicon 等），原样拷贝到输出目录 |
| **src**          | 源码。入口多为 `main.jsx`/`main.tsx`（Vite）或 `index.js`（CRA），根组件多为 `App.jsx`/`App.tsx` |

***

## 三、React 初体验

### 3.1 渲染三步

将 React 内容渲染到页面需三步：导包（`react`、`react-dom/client`）、创建根对象（`createRoot`）、调用根的 `render` 渲染内容。

```jsx
// 1. 导包（React 18 使用 react-dom/client 的 createRoot）
import React from 'react'
import { createRoot } from 'react-dom/client'

// 2. 创建根对象（传入挂载的 DOM 节点）
const root = createRoot(document.getElementById('root'))

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
| **规范定义方** | Meta（Facebook）团队维护的独立语法规范，仅定义语法不定义语义 |
| **与 ECMAScript** | 不是 ECMAScript 的一部分，也不打算纳入 JS 标准；规范明确：*"It's NOT a proposal to incorporate JSX into the ECMAScript spec itself."* |
| **规范内容** | 只定义**语法**（词法/文法），**不定义语义**——即只规定“长什么样”，不规定“必须编译成什么” |
| **与 React** | React 只是 JSX 的一种使用方式：React 生态里 JSX 被转成 `React.createElement(...)`；Vue、Solid 等也可用同一套 JSX 语法，由各自的编译器转成自己的运行时调用 |

**结论**：JSX 是独立的语法规范；React 并非“包含”JSX，而是与 JSX 搭配使用最广泛。二者是并列关系，React 更适合与 JSX 结合使用。

### 4.3 JSX 原理（了解即可）

JSX 经构建工具转换后，会变为对 **React.createElement** 的调用，得到描述 UI 的 JS 对象（形如 `{ type, props }`），用于后续虚拟 DOM 与渲染。转换器由构建工具（如 Vite、esbuild）提供。

```
JSX 源码 → 构建工具转换 → React.createElement(type, props, ...children) → 返回 { type, props } 对象树
```

`createElement` 负责生成描述结构的对象树；真正把树变成 DOM 并挂到容器上的是渲染层（如 `createRoot(...).render()`）。

### 4.4 JSX 书写规则

| 规则             | 说明 |
| ---------------- | ---- |
| **唯一根节点**   | 最外层只能有一个根元素；多根时用 **Fragment**（`<></>` 或 `<React.Fragment>`）包裹，不产生额外 DOM |
| **标签闭合**     | 所有标签必须闭合，如 `<input />` |
| **属性驼峰命名** | 与 HTML 不同：`class` → `className`，`for` → `htmlFor`；事件为 `onClick`、`onChange` 等驼峰形式 |

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

***

### 4.6 JSX 中 `{}` 的应用

**作用**：让 JSX 变动态，可用于标签内容、属性等。

| 场景         | 常用写法 |
| ------------ | -------- |
| **列表渲染** | `map` 遍历数组，需为每项提供 **key** |
| **条件渲染** | `&&` 或 `? :` |
| **样式处理** | `className` 配合表达式 |

```jsx
// 列表渲染：key 需稳定且唯一，便于 React 做 diff；避免用 index 作为 key（列表会重排时）
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

> **注意**：事件处理函数应单独定义，不要写在 JSX 里内联定义（不利于复用和阅读）。如需事件对象，函数形参即为**合成事件**对象。

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

### 6.2 组件参数（props）

**props** 是父组件向子组件传递的数据，为**只读**；子组件通过函数参数接收，用于定制展示或行为。

| 项目     | 说明 |
| -------- | ---- |
| **作用** | 父组件向子组件传值，实现可复用、可配置的组件 |
| **只读** | 组件内不应修改 props，否则违背单向数据流 |
| **接收方式** | 函数组件通过第一个参数接收，通常解构使用 |

```jsx
// 子组件：通过参数接收 props，推荐解构
function Greet({ name, age }) {
  return (
    <p>{name}，{age} 岁</p>
  )
}

// 父组件：以属性形式传递
function App() {
  return (
    <div>
      <Greet name="张三" age={18} />
    </div>
  )
}
```

| 写法     | 说明 |
| -------- | ---- |
| **属性名 = 变量/表达式** | 传字符串用引号，传数字、布尔、对象等用 `{}` |
| **解构 props** | `function Greet({ name })` 直接拿到 `name`，无需 `props.name` |
| **默认值** | 解构时写 `{ name = '访客' }` 或函数外写 `Greet.defaultProps = { name: '访客' }`（不推荐 defaultProps，推荐解构默认值） |

```jsx
// 字符串用引号，其他类型用 {}
<Greet name="李四" age={20} isVIP={true} />

// 解构 + 默认值
function Greet({ name = '访客', age = 0 }) {
  return <p>{name}，{age} 岁</p>
}
```

> **注意**：props 是单向的，只能从父到子；子组件不能直接修改 props，需要由父组件通过 setState 等更新后重新传入。

***

### 6.3 组件高级：children 与组合

**children** 是 props 的一种：组件标签内写的内容会作为 **props.children** 传入，用于布局、插槽等场景。

```jsx
function Card({ children }) {
  return <div className="card">{children}</div>
}

<Card><h2>标题</h2><p>内容</p></Card>
```

**组合优于继承：** React 推荐用组合（多组件拼装、通过 props/children 传内容）而非继承扩展；逻辑复用可用自定义 Hook 或抽成子组件。

***

### 6.4 类组件（了解即可）

**类组件** 是使用 ES6 `class` 继承 `React.Component` 定义的组件，通过 `render` 方法返回 JSX；props 用 `this.props` 访问，状态用 `this.state` 和 `this.setState` 管理。新项目推荐使用**函数组件 + Hooks**，类组件多见于旧代码或面试题。

| 对比项     | 函数组件                 | 类组件                           |
| ---------- | ------------------------ | -------------------------------- |
| **定义方式** | 函数，返回 JSX           | class 继承 `React.Component`，实现 `render()` |
| **props**  | 函数参数                 | `this.props`                     |
| **状态**   | `useState` 等 Hooks      | `this.state`、`this.setState`    |
| **生命周期** | `useEffect` 等           | `componentDidMount`、`componentDidUpdate` 等 |
| **推荐度** | ✅ 当前推荐               | 了解即可，维护旧项目时可能遇到   |

```jsx
import React from 'react'

// 类组件：必须继承 React.Component，必须实现 render 方法
class Hello extends React.Component {
  render() {
    // props 通过 this.props 访问
    return <h1>Hello, {this.props.name}</h1>
  }
}

// 带状态的类组件
class Counter extends React.Component {
  state = { count: 0 }

  render() {
    return (
      <div>
        <span>{this.state.count}</span>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          +1
        </button>
      </div>
    )
  }
}
```

| 要点     | 说明 |
| -------- | ---- |
| **render()** | 类组件必须定义 `render` 方法，返回 JSX 或 `null` |
| **this.props** | 父组件传入的只读数据，不可在组件内修改 |
| **this.state** | 组件内部状态，只能用 `this.setState()` 更新，不可直接赋值 |
| **this.setState** | 传入对象或函数（基于前一次 state 更新时用函数），合并到 state 并触发重新渲染 |

> 💡 若维护或阅读使用类组件的项目，只需掌握上述写法；新功能优先用函数组件 + Hooks 实现。

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

**惰性初始值**：若初始值依赖昂贵计算或仅需在首次渲染时计算，可传入**函数**，React 只在首次渲染时调用该函数并以其返回值作为初始值：`useState(() => computeExpensiveInitialValue())`。

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
| **复杂类型** | 直接改对象/数组属性或 push 等 | 新对象/新数组再 set（如 `[...list, item]`、`{ ...user, name: 'xxx' }`） |

```jsx
// 简单类型
// ❌ count = 1
setCount(1)

// 数组：新增 / 删除 / 修改某一项
// ❌ list.push(item)
setList([...list, item])
// ❌ list.splice(i, 1)
setList(list.filter((_, index) => index !== i))

// 对象：用展开运算符生成新对象
// ❌ user.name = 'xxx'
setUser({ ...user, name: 'xxx' })
```

> **注意**：违反该规则可能导致报错或组件不重新渲染。

***

## 八、classnames 优化类名（可选）

多个类名需按条件组合时，用 **classnames** 可避免冗长的 `&&` 或模板字符串拼接。

| 方式           | 适用场景       |
| -------------- | -------------- |
| 逻辑与 `&&`    | 单个类名有无   |
| **classnames 对象语法** | 多个类名按条件组合，更清晰 |

```bash
npm i classnames
```

```jsx
import classNames from 'classnames'

// 对象语法：键为类名，值为条件
<div className={classNames('tab', { active: isActive, disabled: isDisabled })} />
```

***

## 九、综合案例要点：评论列表与 Tab

| 模块             | 要点 |
| ---------------- | ---- |
| **整体结构**     | 根组件 + 样式（如 SASS）+ 静态资源 |
| **状态设计**     | 列表数据、当前 Tab 下标等用 `useState`；增删改后通过 set 新数组/对象触发重渲染 |
| **评论列表**     | `map` 渲染、`filter` 删除、`map` 修改点赞等，列表项需稳定 **key** |
| **导航 Tab**     | 状态存当前选中下标（如 `activeIndex`），高亮用 `activeIndex === index`，可用 `orderBy` 等做排序 |
| **类名处理**     | 多条件类名用 `classnames` 等库简化 |

| 方法 / 概念   | 说明 |
| ------------- | ---- |
| `map`         | 列表渲染、修改数组中某一项（返回新数组） |
| `filter`      | 删除某一项（返回新数组） |
| `orderBy`     | lodash 排序，用于「最热 / 最新」等切换 |
