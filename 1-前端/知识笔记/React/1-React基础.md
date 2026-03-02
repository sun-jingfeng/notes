## 一、React 介绍

### 1.1 什么是 React

**React** 是一个用来渲染用户界面（UI）的 JavaScript 库。

| 项目     | 说明 |
| -------- | ---- |
| **开发者** | Meta（Facebook） |
| **定位**   | 前端库，非完整框架 |
| **特点**   | 完全基于 JavaScript，用 JS 编写 HTML 结构，符合 JS 编程习惯 |

**Vue 3 对照：**

| 对比项       | React                                      | Vue 3                                        |
| ------------ | ------------------------------------------ | -------------------------------------------- |
| **定位**     | UI 库，仅负责视图层                        | 渐进式框架，自带更多开箱即用功能             |
| **模板语法** | JSX（JS 中写 HTML）                        | Template（HTML 中写指令）+ 可选 JSX          |
| **数据驱动** | 不可变数据 + `set` 函数触发渲染            | 基于 Proxy 自动追踪依赖（可变赋值）          |
| **组件写法** | 函数组件 + Hooks                           | SFC（`<script setup>`）+ Composition API     |
| **生态**     | 社区方案为主（路由、状态管理等需自选）     | 官方配套（Vue Router、Pinia 等）             |
| **理念**     | "一切皆 JS"——逻辑、结构均用 JS 表达       | 关注点分离——template / script / style 各司其职 |

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

**Vue 3 对照：**

Vue 3 使用 `createApp` 创建应用实例，通过 `.mount()` 挂载到 DOM：

```js
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

| 步骤     | React                             | Vue 3                          |
| -------- | --------------------------------- | ------------------------------ |
| **导包** | `react`、`react-dom/client`       | `vue`                          |
| **创建** | `createRoot(el)`                  | `createApp(App)`               |
| **挂载** | `root.render(<App />)`            | `app.mount('#app')`            |

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

### 4.5 JSX 中 `{}` 的应用

在 JSX 中用 `{}` 嵌入 JavaScript 表达式，可出现在标签内容、属性值等位置。`{}` 内只能写**表达式**（有返回值），不能写语句。

| 可以放在 `{}` 中                                 | 不能放在 `{}` 中               |
| ------------------------------------------------ | ------------------------------ |
| 变量、函数调用、三元、`&&`、`.map()` 等表达式    | `if`、`for`、`switch` 等语句   |

#### 1. 条件渲染

| 方式           | 适用场景                                                     |
| -------------- | ------------------------------------------------------------ |
| **`&&`**       | 条件成立时渲染，否则不渲染                                   |
| **`? :`**      | 二选一                                                       |
| **提前计算**   | 多分支——JSX 外用 `if` / `switch` 赋值给变量，再嵌入 `{}`    |
| **返回 `null`** | 组件不渲染任何内容                                          |

```jsx
// && 短路
{isShow && <div>内容</div>}

// 三元
{score >= 60 ? '及格' : '不及格'}

// 多分支：JSX 外提前计算
let badge
if (role === 'admin') badge = <AdminBadge />
else if (role === 'vip') badge = <VIPBadge />
else badge = null
return <div>{badge}</div>

// 不渲染任何内容
if (!data) return null
```

> **注意**：`&&` 左侧避免用数字 `0` 做条件——`{count && <span>有数据</span>}` 当 count 为 0 时会渲染出 `0`，应改为 `{count > 0 && <span>有数据</span>}`。

#### 2. 列表渲染

用 `map` 遍历数组生成 JSX，每项必须提供 **`key`** 属性，用于 React diff 算法识别元素：

```jsx
{list.map(item => <li key={item.id}>{item.name}</li>)}
```

| key 的规则           | 说明                                                         |
| -------------------- | ------------------------------------------------------------ |
| **必须唯一**         | 同级兄弟元素中不可重复                                       |
| **必须稳定**         | 不随增删、重排变化；通常用后端返回的 id                      |
| **避免用 index**     | 列表会增删或重排时，index 变化导致 React 错误复用元素、丢失组件内部状态 |
| **纯静态列表可用 index** | 列表永不增删 / 重排时，index 不会引发问题                |

#### 3. 动态样式

```jsx
// 动态类名
<div className={isActive ? 'tab active' : 'tab'}>...</div>

// 行内样式（对象形式，属性名驼峰）
<div style={{ color: 'red', fontSize: 14 }}>...</div>
```

### 4.6 Vue 3 对照：模板语法 vs JSX

React 用 JSX 在 JS 中构建视图；Vue 3 用 Template 在 HTML 中通过**指令**描述逻辑，二者是实现同一目标的不同路径。

| 能力           | React（JSX）                                             | Vue 3（Template）                              |
| -------------- | -------------------------------------------------------- | ---------------------------------------------- |
| **条件渲染**   | `{flag && <A />}`、`{flag ? <A /> : <B />}`             | `v-if`、`v-else-if`、`v-else`                  |
| **显示/隐藏**  | 条件渲染（卸载 DOM）或手动控制 `style.display`           | `v-show`（切换 `display`，不卸载 DOM）         |
| **列表渲染**   | `{list.map(item => <li key={item.id}>...</li>)}`        | `<li v-for="item in list" :key="item.id">`     |
| **动态属性**   | `className={expr}`、`style={{ ... }}`                    | `:class="expr"`、`:style="{ ... }"`            |
| **文本插值**   | `{value}`                                                | `{{ value }}`                                  |
| **原始 HTML**  | `dangerouslySetInnerHTML={{ __html: html }}`             | `v-html="html"`                                |

**条件渲染对比：**

```jsx
// React：&& 或三元表达式
{isShow && <div>内容</div>}

{role === 'admin' ? <Admin /> : <Guest />}
```

```vue
<!-- Vue 3：v-if / v-else 指令 -->
<div v-if="isShow">内容</div>

<Admin v-if="role === 'admin'" />
<Guest v-else />

<!-- v-show 仅切换 display，不销毁 DOM；频繁切换用 v-show -->
<div v-show="isVisible">内容</div>
```

**列表渲染对比：**

```jsx
// React：用 map 返回 JSX，手动传 key
{list.map(item => <li key={item.id}>{item.name}</li>)}
```

```vue
<!-- Vue 3：v-for 指令，:key 绑定 -->
<li v-for="item in list" :key="item.id">{{ item.name }}</li>
```

**动态类名对比：**

```jsx
// React：拼接字符串或 classnames 库
<div className={isActive ? 'tab active' : 'tab'} />
```

```vue
<!-- Vue 3：内置对象 / 数组语法，无需额外库 -->
<div :class="{ tab: true, active: isActive }" />
<div :class="['tab', { active: isActive }]" />
```

> 💡 Vue 的 `v-if` 是真正的条件渲染（销毁/重建 DOM），`v-show` 只切换 `display` 样式；React 没有内置 `v-show`，条件渲染默认就是挂载/卸载。

***

## 五、React 事件绑定

### 5.1 语法

**语法**：`on + 事件名`（驼峰）= `{ 事件处理函数 }`。

```jsx
<button onClick={handleClick}>点击</button>
```

| 写法     | 说明 |
| -------- | ---- |
| ❌ `onClick={handleClick()}` | 渲染时立即执行，不应带括号 |
| ✅ `onClick={handleClick}`   | 传递函数引用，点击时执行 |
| **需要传参** | 用箭头函数包装：`onClick={() => handleClick(id)}`，避免 `onClick={handleClick(id)}`（会立即执行） |

> **注意**：处理函数建议单独定义，便于复用和阅读；需要事件对象时，函数形参即为合成事件对象。

```jsx
// ✅ 推荐：单独定义
const handleClick = (e) => {
  console.log(e)
}
return <button onClick={handleClick}>点击</button>

// 需要传参时用箭头函数包装
const handleRemove = (id) => { /* ... */ }
return <button onClick={() => handleRemove(item.id)}>删除</button>
```

### 5.2 合成事件

React 使用**合成事件（SyntheticEvent）**：所有事件统一委托到根节点，由 React 统一派发（而非绑在每个 DOM 元素上）。合成事件封装了原生事件，接口一致，并抹平了浏览器差异。

| 项目             | 说明 |
| ---------------- | ---- |
| **事件委托**     | 事件绑定在根节点统一触发，非直接绑在每个 DOM 上 |
| **事件对象**     | 处理函数的参数是 SyntheticEvent，封装了原生 event |
| **阻止冒泡**     | `e.stopPropagation()` |
| **阻止默认行为** | `e.preventDefault()` |
| **获取原生事件** | `e.nativeEvent` |

> 💡 React 16 及更早版本使用**事件池**复用合成事件对象（回调结束后对象被清空，不能在异步中访问）。React 17 起已移除事件池，合成事件对象可在异步中正常使用。

**TypeScript 写法：**

内联箭头函数中 TS 自动推导事件类型；单独定义处理函数时需标注：

```tsx
// ✅ 内联：自动推导
<button onClick={(e) => console.log(e.currentTarget)}>点击</button>

// ✅ 单独定义：需标注事件类型
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  console.log(e.currentTarget)
}
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setName(e.target.value)
}
```

常用事件类型：

| 事件类型                                     | 对应元素     | 触发场景 |
| -------------------------------------------- | ------------ | -------- |
| **`React.MouseEvent<HTMLButtonElement>`**     | `<button>`   | 点击     |
| **`React.ChangeEvent<HTMLInputElement>`**     | `<input>`    | 输入变化 |
| **`React.ChangeEvent<HTMLSelectElement>`**    | `<select>`   | 选择变化 |
| **`React.FormEvent<HTMLFormElement>`**        | `<form>`     | 表单提交 |
| **`React.KeyboardEvent<HTMLInputElement>`**   | `<input>`    | 键盘事件 |

### 5.3 Vue 3 对照：事件绑定

| 对比项         | React                                    | Vue 3                                    |
| -------------- | ---------------------------------------- | ---------------------------------------- |
| **语法**       | `onClick={fn}`（驼峰）                   | `@click="fn"` 或 `v-on:click="fn"`      |
| **传参**       | `onClick={() => fn(id)}`                 | `@click="fn(id)"`（直接调用）            |
| **事件对象**   | 合成事件（SyntheticEvent），封装原生事件 | 原生 DOM 事件，模板中用 `$event` 占位    |
| **阻止冒泡**   | `e.stopPropagation()`                    | `@click.stop` 修饰符                    |
| **阻止默认**   | `e.preventDefault()`                     | `@click.prevent` 修饰符                 |
| **按键修饰**   | 处理函数中判断 `e.key`                   | `@keyup.enter`、`@keyup.esc` 等内置修饰符 |

```jsx
// React：箭头函数包装传参，手动 e.preventDefault()
<button onClick={() => handleRemove(id)}>删除</button>
<form onSubmit={(e) => { e.preventDefault(); handleSubmit() }}>
```

```vue
<!-- Vue 3：直接传参，修饰符替代手动调用 -->
<button @click="handleRemove(id)">删除</button>
<form @submit.prevent="handleSubmit">
```

> 💡 Vue 3 的**事件修饰符**（`.stop`、`.prevent`、`.once`、`.capture`、`.self`）是语法糖，省去手动调用 `e.stopPropagation()` 等；React 没有修饰符机制，需在处理函数中显式调用。

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

**TypeScript 写法：**

用 `type` 定义 props 的类型接口，在函数参数处标注：

```tsx
type GreetProps = {
  name: string
  age: number
  isVIP?: boolean   // ? 表示可选
}

function Greet({ name, age, isVIP = false }: GreetProps) {
  return <p>{name}，{age} 岁{isVIP && '（VIP）'}</p>
}
```

常见 props 类型：

| 类型             | 示例 |
| ---------------- | ---- |
| **基础类型**     | `string`、`number`、`boolean` |
| **数组**         | `string[]`、`number[]`、`ItemType[]` |
| **对象**         | `{ id: number; name: string }` |
| **函数**         | `(id: number) => void`、`() => string` |
| **可选属性**     | `title?: string` |
| **联合类型**     | `status: 'loading' \| 'success' \| 'error'` |

#### Props 默认值

**解构默认值（推荐）：** 直接在函数参数的解构中指定默认值，语法简洁、位置集中，是当前推荐写法：

```jsx
function Greet({ name = '访客', age = 0, isVIP = false }) {
  return <p>{name}，{age} 岁</p>
}

<Greet />               // → 访客，0 岁（使用默认值）
<Greet name="张三" />   // → 张三，0 岁（name 被覆盖，age 使用默认值）
```

**默认值触发规则：** 只有传入 `undefined` 或未传该属性时才会使用默认值；传入 `null`、`0`、`''`、`false` 等均视为有效值，**不会**触发默认值。

| 传入值                   | 是否触发默认值 | 说明                               |
| ------------------------ | -------------- | ---------------------------------- |
| **未传 / `undefined`**   | ✅ 触发        | 属性缺失或显式传 `undefined`       |
| **`null`**               | ❌ 不触发      | `null` 是有效值，不等于 `undefined` |
| **`0`、`''`、`false`**   | ❌ 不触发      | 均为有效值，只是 falsy              |

```jsx
function Tag({ label = '默认标签' }) {
  return <span>{label}</span>
}

<Tag />                   // → 默认标签（触发默认值）
<Tag label={undefined} /> // → 默认标签（触发默认值）
<Tag label={null} />      // → （空，null 不触发默认值）
<Tag label="" />          // → （空字符串，不触发默认值）
```

***

**defaultProps（已废弃）：** `defaultProps` 是早期 React（类组件时代）为 props 指定默认值的方式，**React 18.3 起对函数组件标记为 deprecated，React 19 已移除对函数组件的支持**，新项目不应使用。

```jsx
// ❌ 已废弃：不要在函数组件上使用 defaultProps
function Greet({ name, age }) {
  return <p>{name}，{age} 岁</p>
}
Greet.defaultProps = {
  name: '访客',
  age: 0
}

// ✅ 用解构默认值替代
function Greet({ name = '访客', age = 0 }) {
  return <p>{name}，{age} 岁</p>
}
```

| 方式             | 状态       | 说明                                                       |
| ---------------- | ---------- | ---------------------------------------------------------- |
| **解构默认值**   | ✅ 推荐    | ES6 语法，位置集中，TS 类型推导友好                        |
| **defaultProps** | ❌ 已废弃  | React 19 已移除对函数组件的支持；类组件仍可用但不推荐新写  |

***

**TypeScript 中的默认值：** 有默认值的 prop 在类型定义中标记为**可选（`?`）**，解构处赋默认值；TS 能正确推导出组件内该属性为非 `undefined` 类型。

```tsx
type AlertProps = {
  message: string
  type?: 'info' | 'warning' | 'error'
  closable?: boolean
}

function Alert({ message, type = 'info', closable = false }: AlertProps) {
  // type 推导为 'info' | 'warning' | 'error'（非 undefined）
  return (
    <div className={`alert alert-${type}`}>
      {message}
      {closable && <button>×</button>}
    </div>
  )
}
```

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

**TypeScript 写法：**

`children` 类型使用 `React.ReactNode`，可接收 JSX、字符串、数字、`null` 等所有可渲染内容：

```tsx
type CardProps = {
  title: string
  children: React.ReactNode
}

function Card({ title, children }: CardProps) {
  return (
    <div className="card">
      <h2>{title}</h2>
      {children}
    </div>
  )
}
```

| 类型                       | 说明 |
| -------------------------- | ---- |
| **`React.ReactNode`**      | 最宽泛，接受 JSX、字符串、数字、数组、`null`、`undefined`、`boolean` |
| **`React.ReactElement`**   | 仅接受 JSX 元素（`<div />`、`<Component />`），不含字符串、数字 |

### 6.4 Vue 3 对照：组件、Props 与插槽

**组件定义对比：**

| 对比项       | React                            | Vue 3 SFC                                     |
| ------------ | -------------------------------- | ---------------------------------------------- |
| **文件形式** | `.jsx` / `.tsx`，函数即组件      | `.vue` SFC（template + script + style）        |
| **定义方式** | 函数返回 JSX                     | `<script setup>` + `<template>`                |
| **导入使用** | `import` 后以标签形式使用        | `import` 后在 `<template>` 中直接使用          |

```jsx
// React：函数组件
function Hello() {
  return <h1>Hello</h1>
}
```

```vue
<!-- Vue 3：SFC 单文件组件 -->
<script setup>
</script>

<template>
  <h1>Hello</h1>
</template>
```

***

**Props 对比：**

| 对比项       | React                                  | Vue 3                                            |
| ------------ | -------------------------------------- | ------------------------------------------------ |
| **声明方式** | 函数参数解构                           | `defineProps` 编译器宏                           |
| **类型标注** | `type Props = { ... }` + 参数类型      | `defineProps<{ ... }>()` 泛型                    |
| **默认值**   | 解构默认值 `{ name = '访客' }`         | `withDefaults(defineProps<...>(), { ... })`       |
| **只读**     | props 只读，不可修改                   | props 只读，修改会触发警告                       |

```jsx
// React：解构接收 + 默认值
function Greet({ name = '访客', age = 0 }) {
  return <p>{name}，{age} 岁</p>
}

<Greet name="张三" age={18} />
```

```vue
<!-- Vue 3：defineProps 声明 + withDefaults 默认值 -->
<script setup lang="ts">
const props = withDefaults(defineProps<{
  name?: string
  age?: number
}>(), {
  name: '访客',
  age: 0
})
</script>

<template>
  <p>{{ name }}，{{ age }} 岁</p>
</template>
```

***

**children vs 插槽（slot）：**

React 用 **children** 将子内容传入组件；Vue 3 用**插槽（slot）**实现相同能力，还支持具名插槽和作用域插槽。

```jsx
// React：children
function Card({ children }) {
  return <div className="card">{children}</div>
}

<Card><h2>标题</h2><p>内容</p></Card>
```

```vue
<!-- Vue 3：默认插槽 -->
<template>
  <div class="card"><slot /></div>
</template>

<!-- 使用 -->
<Card><h2>标题</h2><p>内容</p></Card>
```

Vue 3 还支持**具名插槽**，可分发多个区域的内容（React 中需通过多个 props 传 JSX 实现）：

```vue
<!-- Layout.vue -->
<template>
  <header><slot name="header" /></header>
  <main><slot /></main>
  <footer><slot name="footer" /></footer>
</template>
```

```vue
<!-- 使用 -->
<Layout>
  <template #header><h1>顶部</h1></template>
  <p>主体内容</p>
  <template #footer><p>底部</p></template>
</Layout>
```

| 能力           | React                            | Vue 3                                        |
| -------------- | -------------------------------- | -------------------------------------------- |
| **默认内容区** | `children`                       | `<slot />`（默认插槽）                       |
| **多个内容区** | 通过不同 props 传入多个 JSX      | 具名插槽 `<slot name="header" />` + `<template #header>` |
| **向父级传数据** | 回调函数 / render props        | 作用域插槽 `<slot :item="item" />`           |

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

**TypeScript 写法：**

`useState` 支持泛型指定状态类型；基础类型可自动推导，初始值为 `null` 或空数组时需手动标注：

```tsx
// ✅ 自动推导为 number / string / boolean，无需泛型
const [count, setCount] = useState(0)
const [name, setName] = useState('张三')

// 初始值为 null 或类型复杂时，手动标注泛型
type User = { id: number; name: string }
const [user, setUser] = useState<User | null>(null)
const [list, setList] = useState<User[]>([])
```

| 场景               | 写法 |
| ------------------ | ---- |
| **初始值可推导**   | `useState(0)`、`useState('')`，无需泛型 |
| **初始值为 null**  | `useState<Type \| null>(null)` |
| **空数组**         | `useState<Type[]>([])` |

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

### 7.5 Vue 3 对照：响应式状态

Vue 3 使用 `ref`（基本类型/单值）和 `reactive`（对象）创建响应式状态，**直接赋值**即可触发更新，无需像 React 一样创建新引用：

```vue
<script setup>
import { ref, reactive } from 'vue'

const count = ref(0)
const user = reactive({ name: '张三', age: 18 })

function increment() {
  count.value++              // ref 通过 .value 读写
  user.age++                 // reactive 直接修改属性
}
</script>

<template>
  <!-- 模板中 ref 自动解包，无需 .value -->
  <span>{{ count }}</span>
  <button @click="increment">+1</button>
</template>
```

| 对比项           | React（`useState`）                          | Vue 3（`ref` / `reactive`）                    |
| ---------------- | -------------------------------------------- | ---------------------------------------------- |
| **声明**         | `const [val, setVal] = useState(初始值)`     | `const val = ref(初始值)` 或 `reactive({...})` |
| **读取**         | 直接用变量 `val`                             | `ref` 用 `.value`，模板中自动解包              |
| **更新**         | 调用 `setVal(新值)`                          | `ref` 直接赋 `.value`，`reactive` 直接改属性   |
| **更新方式**     | 必须创建新引用（不可变）                     | 直接修改（响应式代理自动追踪）                 |
| **重新渲染**     | `set` 函数触发组件函数重新执行               | 响应式系统自动追踪依赖，精确更新               |
| **异步中取最新值** | 需函数式更新或 `useRef`                    | 直接读 `.value`，始终最新                      |

**数组/对象操作对比：**

```jsx
// React：不可变更新，必须生成新引用
setList([...list, item])                  // 新增
setList(list.filter((_, i) => i !== idx)) // 删除
setUser({ ...user, name: 'xxx' })         // 修改属性
```

```js
// Vue 3：直接修改，Proxy 自动追踪
list.value.push(item)          // 新增
list.value.splice(idx, 1)      // 删除
user.name = 'xxx'              // 修改属性
```

**更新时机对比：** React 的 `set` 函数是异步的，调用后本轮拿不到新值；Vue 3 赋值后值立即变化，但 DOM 更新会在下一个微任务批量执行（需等待 DOM 更新时用 `nextTick`）。

| 对比项         | React                                | Vue 3                                |
| -------------- | ------------------------------------ | ------------------------------------ |
| **值更新**     | 异步，下次渲染才能拿到新值           | 同步，赋值后立即可读到新值           |
| **DOM 更新**   | 批量处理后统一更新                   | 批量合并到微任务统一更新             |
| **更新后操作** | `useEffect` 监听依赖变化            | `nextTick` 等待 DOM 更新完成         |
| **函数式更新** | `setCount(prev => prev + 1)`         | 无需——`.value` 始终是最新值          |

> 💡 React 的不可变更新虽然写法更繁琐，但让状态变更可追踪、易于做时间旅行调试；Vue 3 的可变赋值更符合直觉，由 Proxy 自动完成依赖收集和视图更新。

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

**Vue 3 对照：** Vue 3 内置 `:class` 绑定，支持对象和数组语法，无需额外安装库：

```vue
<!-- 对象语法 -->
<div :class="{ tab: true, active: isActive, disabled: isDisabled }">...</div>

<!-- 数组语法 -->
<div :class="['tab', { active: isActive }]">...</div>
```

| 对比项   | React                                          | Vue 3                                |
| -------- | ---------------------------------------------- | ------------------------------------ |
| **方案** | 需借助 `classnames` 等第三方库                 | 内置 `:class` 对象/数组语法          |
| **语法** | `classNames('tab', { active: isActive })`      | `:class="{ tab: true, active: isActive }"` |

***

## 九、类组件（了解即可）

新项目推荐**函数组件 + Hooks**；类组件多见于旧代码维护或面试题，掌握基本写法即可。

| 对比项     | 函数组件                 | 类组件                           |
| ---------- | ------------------------ | -------------------------------- |
| **定义方式** | 函数，返回 JSX           | class 继承 `React.Component`，实现 `render()` |
| **props**  | 函数参数                 | `this.props`                     |
| **状态**   | `useState` 等 Hooks      | `this.state`、`this.setState`    |
| **生命周期** | `useEffect` 等           | `componentDidMount`、`componentDidUpdate` 等 |
| **推荐度** | ✅ 当前推荐               | 了解即可，维护旧项目时可能遇到   |

### 9.1 基本写法与 props

类组件必须继承 `React.Component`，必须实现 `render` 方法返回 JSX；父组件传入的 props 通过 `this.props` 访问。

```jsx
import React from 'react'

class Hello extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>
  }
}

// 使用
<Hello name="张三" />
```

### 9.2 状态（state）

类组件通过 `this.state` 定义组件内部状态，通过 `this.setState()` 更新状态并触发重新渲染；**不可**直接给 `this.state` 赋值。

```jsx
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
| **this.state** | 组件内部状态，只能用 `this.setState()` 更新 |
| **this.setState(对象)** | 传入对象，浅合并到 state 并触发重新渲染 |
| **this.setState(函数)** | 传入 `(prevState) => newState`，基于前一次 state 更新，避免批处理导致值过期 |

### 9.3 事件处理中的 this 问题

类组件中，事件处理函数如果定义为**普通方法**，直接绑定到 JSX 事件时 `this` 会丢失（指向 `undefined`），导致无法调用 `this.setState` 等。

```jsx
class Counter extends React.Component {
  state = { count: 0 }

  // ❌ 普通方法：直接绑定到 onClick 后，this 为 undefined
  handleClick() {
    this.setState({ count: this.state.count + 1 })  // 报错：Cannot read properties of undefined
  }

  render() {
    return <button onClick={this.handleClick}>+1</button>
  }
}
```

**原因**：JSX 事件赋值相当于 `const fn = this.handleClick`，调用 `fn()` 时不再通过实例调用，`this` 丢失。

**三种解决方式：**

| 方式 | 写法 | 说明 |
| ---- | ---- | ---- |
| **箭头函数属性（推荐）** | `handleClick = () => { ... }` | 箭头函数不创建自身 `this`，始终绑定到实例 |
| **JSX 内联箭头函数** | `onClick={() => this.handleClick()}` | 通过 `this.` 调用，`this` 不丢失；每次渲染创建新函数 |
| **构造函数中 bind** | `this.handleClick = this.handleClick.bind(this)` | 手动绑定，写法较繁琐 |

```jsx
// ✅ 方式一：箭头函数属性（推荐）
class Counter extends React.Component {
  state = { count: 0 }

  handleClick = () => {
    this.setState({ count: this.state.count + 1 })
  }

  render() {
    return <button onClick={this.handleClick}>+1</button>
  }
}

// ✅ 方式二：JSX 内联箭头函数
<button onClick={() => this.handleClick()}>+1</button>

// ✅ 方式三：构造函数中 bind
constructor(props) {
  super(props)
  this.handleClick = this.handleClick.bind(this)
}
```

### 9.4 生命周期（概览）

类组件有一套生命周期方法，用于在组件挂载、更新、卸载等阶段执行逻辑；函数组件中用 `useEffect` 覆盖了大部分场景。

| 阶段     | 方法 | 说明 |
| -------- | ---- | ---- |
| **挂载** | `constructor` | 初始化 state、绑定方法 |
|          | `render` | 返回 JSX，纯函数，不应有副作用 |
|          | `componentDidMount` | 组件首次渲染后执行，常用于发请求、订阅 |
| **更新** | `render` | state 或 props 变化时重新执行 |
|          | `componentDidUpdate(prevProps, prevState)` | 更新后执行，可对比前后值做逻辑 |
| **卸载** | `componentWillUnmount` | 组件销毁前执行，清理定时器、取消订阅等 |

```jsx
class DataLoader extends React.Component {
  state = { data: null }

  componentDidMount() {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => this.setState({ data }))
  }

  componentWillUnmount() {
    // 清理操作（取消请求、清除定时器等）
  }

  render() {
    return <div>{this.state.data ? JSON.stringify(this.state.data) : '加载中...'}</div>
  }
}
```

| 生命周期方法 | 对应的函数组件写法 |
| ------------ | ------------------ |
| `componentDidMount` | `useEffect(() => { ... }, [])` |
| `componentDidUpdate` | `useEffect(() => { ... }, [deps])` |
| `componentWillUnmount` | `useEffect(() => { return () => { /* 清理 */ } }, [])` |

### 9.5 Vue 3 对照：Options API vs Composition API

React 类组件 → 函数组件的演进，与 Vue 的 Options API → Composition API 类似：旧范式按"类型"组织代码（state、methods、lifecycle 各放一处），新范式按"功能"组织代码，逻辑更内聚。

| 对比项         | React 类组件                         | Vue Options API                                          |
| -------------- | ------------------------------------ | -------------------------------------------------------- |
| **组织方式**   | 按生命周期/类型划分                  | 按选项划分（`data`、`methods`、`computed`、`watch`）      |
| **状态**       | `this.state` / `this.setState`       | `data()` 返回对象                                        |
| **this 问题**  | 事件处理函数中 `this` 易丢失         | `this` 指向组件实例，但 TS 类型推导差                    |
| **推荐度**     | 了解即可                             | 了解即可                                                 |

| 对比项         | React 函数组件 + Hooks               | Vue 3 Composition API（`<script setup>`）                |
| -------------- | ------------------------------------- | -------------------------------------------------------- |
| **组织方式**   | 按功能/逻辑划分                      | 按功能/逻辑划分                                          |
| **状态**       | `useState`                           | `ref` / `reactive`                                       |
| **副作用**     | `useEffect`                          | `watch` / `watchEffect` / 生命周期钩子                   |
| **逻辑复用**   | 自定义 Hook                          | Composable 函数                                          |
| **推荐度**     | ✅ 当前推荐                           | ✅ 当前推荐                                               |

> 💡 两套框架的演进方向一致：从"按代码类型分块"到"按业务功能分块"，使相关逻辑集中在一起，便于理解和复用。

