## 一、表单处理（受控与非受控）

### 1.1 什么是受控组件

**受控组件** 指表单元素的值由 **React 状态**控制，而不是由 DOM 自身维护。本质就是 React 状态驱动渲染的标准模式——用 `useState` 存值，`value` 绑定状态，`onChange` 更新状态，和用状态控制任何 UI 元素没有区别。

```jsx
const [content, setContent] = useState('')

<input
  value={content}
  onChange={(e) => setContent(e.target.value)}
/>
```

> **注意**：React 里 `onChange` 行为类似原生 `input` 事件（每次输入都触发），而非原生 `change` 事件（失焦才触发）。

### 1.2 与组件库的关系

实际开发中几乎都通过组件库（Ant Design、Material UI 等）构建表单，但组件库的表单控件本质上就是**受控组件模式的封装**——`value` + `onChange` 的数据流不变，只是库帮你处理了样式和交互细节。

```jsx
// Ant Design 的 Input，本质与原生受控写法一致
<Input value={content} onChange={(e) => setContent(e.target.value)} />
```

| 场景                         | 为什么需要理解受控模式                                       |
| ---------------------------- | ------------------------------------------------------------ |
| **组件库表单**               | Ant Design Form 内部用受控模式管理字段值，`getFieldsValue`、`setFieldsValue` 等 API 都基于此 |
| **自定义表单控件**           | 封装自定义组件接入 Form 时，必须暴露 `value` + `onChange` 接口 |
| **跨组件联动**               | 一个字段的值影响另一个字段的选项或显隐，依赖受控状态实时同步 |
| **受控 vs 非受控选型**       | React Hook Form 默认用**非受控**（ref）模式以减少渲染，适合大表单；Ant Design Form 用受控模式，适合联动多的场景。理解差异才能合理选型 |

### 1.3 非受控组件

**非受控组件** 指表单元素的值由 **DOM 自身**维护，React 不通过状态管理其值，而是在需要时通过 **ref** 读取当前值。`useRef(null)` 创建一个可持久化的引用对象，通过 `ref={inputRef}` 绑定到 DOM 后，`inputRef.current` 即指向该 DOM 节点。

```jsx
import { useRef } from 'react'

function Demo() {
  const inputRef = useRef(null)

  const handleSubmit = () => {
    // 提交时才读取 DOM 值
    console.log(inputRef.current.value)
  }

  return (
    <>
      <input ref={inputRef} defaultValue="初始值" />
      <button onClick={handleSubmit}>提交</button>
    </>
  )
}
```

| 属性                 | 说明                                            |
| -------------------- | ----------------------------------------------- |
| **`defaultValue`**   | 设置初始值（`<input>`、`<textarea>`、`<select>`） |
| **`defaultChecked`** | 设置初始选中状态（`<input type="checkbox">`）    |
| **`ref`**            | 通过 `ref.current.value` 读取当前值             |

> **注意**：非受控组件不能用 `value`，否则会被 React 接管变成受控组件。设置初始值用 `defaultValue`。

### 1.4 受控 vs 非受控

| 对比项         | 受控组件                  | 非受控组件                |
| -------------- | ------------------------- | ------------------------- |
| **值的管理**   | React 状态（`useState`）  | DOM 自身                  |
| **读取方式**   | 直接用 state 变量         | 通过 `ref.current.value`  |
| **实时同步**   | 每次输入都同步到 state    | 不同步，需要时才读取      |
| **适用场景**   | 需要实时校验、联动        | 简单取值、文件上传        |
| **推荐程度**   | React 官方推荐            | 特定场景使用              |

**推荐用法：**
- 大多数场景优先使用**受控组件**，数据流清晰、便于校验和联动
- 文件上传（`<input type="file">`）只能用**非受控**，因为文件值是只读的
- 对性能敏感的大表单可考虑非受控方案（如 React Hook Form）

### 1.5 TS 事件类型

表单处理离不开事件对象。在内联写法中 TS 能自动推断事件类型，但将处理函数**提取到外部**时需要显式标注：

```tsx
// 内联写法：e 的类型由 onChange 自动推断，无需手动标注
<input onChange={(e) => setContent(e.target.value)} />

// 提取为独立函数时，需显式标注事件类型
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value)
}

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
}
```

| 事件类型                 | 常见触发                                  |
| ------------------------ | ----------------------------------------- |
| **`ChangeEvent<T>`**    | `onChange`（`<input>`、`<select>` 等）     |
| **`MouseEvent<T>`**     | `onClick`、`onMouseEnter`、`onMouseLeave` |
| **`FormEvent<T>`**      | `onSubmit`                                |
| **`KeyboardEvent<T>`**  | `onKeyDown`、`onKeyUp`                    |
| **`FocusEvent<T>`**     | `onFocus`、`onBlur`                       |

> 💡 泛型参数 `T` 为触发事件的 DOM 元素类型（如 `HTMLInputElement`），决定了 `e.target` / `e.currentTarget` 的属性提示。事件类型均位于 `React` 命名空间下，如 `React.ChangeEvent<HTMLInputElement>`。

### 1.6 Vue 3 对照

| 对比项 | React | Vue 3 |
| ------ | ----- | ----- |
| **表单绑定** | `value` + `onChange`（受控组件） | `v-model` 双向绑定语法糖 |
| **非受控** | `ref` + `defaultValue` | 不常用，Vue 默认即响应式绑定 |
| **底层机制** | 单向数据流，手动 `onChange → setState` | `v-model` 编译为 `:value` + `@input`，本质也是单向流 |

```vue
<script setup>
import { ref } from 'vue'
const content = ref('')
</script>

<template>
  <!-- v-model 等价于 :value="content" @input="content = $event.target.value" -->
  <input v-model="content" />
</template>
```

> 💡 React 受控组件需要手动写 `value` + `onChange`，Vue 的 `v-model` 将这两步合并为一条指令。理解受控组件的原理有助于理解 `v-model` 的底层机制。

***

## 二、组件通讯

### 2.1 常见场景

一个组件需要使用另一个组件的数据时，按层级关系分为：

| 类型             | 说明                             |
| ---------------- | -------------------------------- |
| **父子通讯**     | 父 ↔ 子，最常用                  |
| **非父子通讯**   | 兄弟、后代等，需状态提升或 Context |
| **复杂场景**     | 可用 Redux 等状态管理工具        |

### 2.2 父子组件通讯

原则：**谁的数据谁负责**。

| 方向       | 做法                                                                 |
| ---------- | -------------------------------------------------------------------- |
| **父 → 子** | 父组件通过 **props** 把数据传给子组件                                |
| **子 → 父** | 父组件把**修改数据的函数**通过 props 传给子组件，子组件调用并传参，把数据"回传"给父组件 |

```
父组件提供数据 → props → 子组件使用
父组件提供函数 → props → 子组件调用并传参 → 父组件更新状态
```

TS 中用 `interface` 或 `type` 定义 Props 的类型，组件参数解构时直接标注：

```tsx
interface CardProps {
  title: string
  count: number
  disabled?: boolean                      // 可选属性
  style?: React.CSSProperties             // 行内样式对象
  children: React.ReactNode               // 子元素
  onAction: (id: number) => void          // 回调函数（子 → 父）
}

function Card({ title, count, disabled = false, children, onAction }: CardProps) {
  return (
    <div>
      <h2>{title}</h2>
      <button disabled={disabled} onClick={() => onAction(1)}>{count}</button>
      {children}
    </div>
  )
}
```

| Props 类型写法           | 说明                                                       |
| ------------------------ | ---------------------------------------------------------- |
| **基础类型**             | `string`、`number`、`boolean`                              |
| **可选属性**             | `prop?: T`，等价于 `T \| undefined`                        |
| **联合字面量**           | `status: 'idle' \| 'loading' \| 'error'`                   |
| **数组**                 | `items: string[]` 或 `Array<string>`                       |
| **回调函数**             | `onChange: (value: string) => void`                        |
| **子元素**               | `children: React.ReactNode`（可接收 JSX、字符串、数字、`null`） |
| **行内样式**             | `style?: React.CSSProperties`                              |
| **透传原生属性**         | 用 `React.ComponentProps<'button'>` 继承原生标签的全部 props |

### 2.3 兄弟组件通讯：状态提升

**状态提升**：若两个兄弟组件需要共享数据，把共享状态放到**公共父组件**中，再通过 props 向下传递；需要修改时，父组件把 set 函数通过 props 传给子组件，由子组件调用。

| 步骤             | 说明                                                       |
| ---------------- | ---------------------------------------------------------- |
| **父组件提供状态** | 如 `const [activeId, setActiveId] = useState(null)`       |
| **子组件 A 使用** | 父 → 子，用 props 展示                                    |
| **子组件 B 修改** | 父传入 set 函数，子组件调用并传参                          |

### 2.4 跨组件通讯：Context

**Context（上下文）** 用于跨层级传递数据，不限于父子，后代组件均可消费。

| 步骤         | 说明                                                       |
| ------------ | ---------------------------------------------------------- |
| **创建**     | `createContext(defaultValue)`                              |
| **提供数据** | 用 **Provider** 包裹组件树，通过 `value` 传入共享数据      |
| **消费数据** | 后代组件通过 `useContext(MyContext)` 获取                   |

```tsx
// 1. 创建（TS 中用泛型标注 value 类型，初始值传 null）
interface MyContextType {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}
const MyContext = createContext<MyContextType | null>(null)

// 2. 提供（通常在根或某父组件）
<MyContext.Provider value={sharedData}>
  <App />
</MyContext.Provider>

// 3. 消费（任意后代）
const data = useContext(MyContext) // 类型为 MyContextType | null
```

> 💡 当 Provider 的 `value` 变化时，所有消费该 Context 的后代组件都会重新渲染，与中间组件是否重渲染无关。数据粒度太粗（如把整个 state 对象塞进 value）会导致不相关的消费者也跟着渲染；可拆分为多个 Context 或用 `useMemo` 稳定 value 引用来优化。

TS 中 `createContext<T | null>(null)` 使消费处的类型为 `T | null`，每次使用都要判空。推荐封装自定义 Hook，内部统一处理 `null` 检查，消费方直接获得完整类型：

```tsx
function useMyContext() {
  const ctx = useContext(MyContext)
  if (!ctx) throw new Error('useMyContext 必须在 Provider 内使用')
  return ctx // 返回类型为 MyContextType，消费方无需判空
}

function Header() {
  const { theme, toggleTheme } = useMyContext()
  return <button onClick={toggleTheme}>{theme}</button>
}
```

### 2.5 Vue 3 对照

| 场景 | React | Vue 3 |
| ---- | ----- | ----- |
| **父 → 子** | props 传值 | `defineProps` 声明接收 |
| **子 → 父** | 父传回调函数，子调用并传参 | `defineEmits` 触发自定义事件 |
| **兄弟** | 状态提升到公共父组件 | 同 React，状态提升 |
| **跨层级** | `createContext` + `useContext` | `provide` + `inject` |

子 → 父通讯对比——React 通过回调函数，Vue 通过事件：

```vue
<!-- Vue 子组件 -->
<script setup lang="ts">
defineProps<{ title: string }>()
const emit = defineEmits<{ action: [id: number] }>()
</script>

<template>
  <button @click="emit('action', 1)">{{ title }}</button>
</template>
```

跨层级通讯对比——React 的 Context 对应 Vue 的 `provide` / `inject`：

```vue
<!-- 祖先组件 -->
<script setup>
import { provide, ref } from 'vue'
const theme = ref<'light' | 'dark'>('light')
provide('theme', theme)
</script>

<!-- 后代组件 -->
<script setup>
import { inject, Ref } from 'vue'
const theme = inject<Ref<'light' | 'dark'>>('theme')
</script>
```

> 💡 React 用回调函数实现子 → 父，Vue 用事件（`emit`）；React 的 Context 对应 Vue 的 `provide` / `inject`，但 Vue 的 `inject` 不要求 Provider 包裹，只需祖先组件调用 `provide` 即可。

***

## 三、Hooks 概述与规则

### 3.1 什么是 Hooks

**Hooks** 是以 `use` 开头的函数（如 `useState`、`useEffect`、`useContext`），为组件提供状态、副作用、Context 等能力，是现代 React 的标准开发方式。

**为何需要 Hooks（了解即可）：** 早期 React 只有类组件能使用状态和生命周期，导致逻辑难以复用、生命周期拆散同一逻辑；Hooks（React 16.8 起引入）让函数组件也能拥有状态与副作用，且便于抽成自定义 Hook 复用。目前类组件已基本退出日常开发。

### 3.2 使用规则

**只能在组件顶层调用 Hooks**，不可放在 `if`、`for`、嵌套函数中。自定义 Hook 同样遵守此规则。

| 正确 ✅           | 错误 ❌                   |
| ----------------- | ------------------------- |
| 组件顶层顺序调用  | 条件、循环、嵌套函数内调用 |

**原因**：React 依赖每次渲染时 Hooks 的**调用顺序一致**来正确关联状态与 Effect；顺序变化会导致状态错位。

```jsx
// ✅ 正确
function App() {
  const [a, setA] = useState(0)
  const [b, setB] = useState(0)
  useEffect(() => {}, [])
  return <div>...</div>
}

// ❌ 错误
function App() {
  if (x) {
    const [a, setA] = useState(0)
  }
}
```

> 💡 安装 `eslint-plugin-react-hooks` 可自动检查 Hooks 调用规则和依赖项遗漏，Vite 创建的 React 项目默认已包含。

### 3.3 Vue 3 对照

Vue 3 Composition API 的 `ref()`、`computed()`、`watch()` 等虽与 React Hooks 形似，但**没有调用顺序限制**——可以在 `if` / `for` 中使用。

| 对比项 | React Hooks | Vue Composition API |
| ------ | ----------- | ------------------- |
| **条件中使用** | ❌ 不允许 | ✅ 允许 |
| **循环中使用** | ❌ 不允许 | ✅ 允许 |
| **依赖机制** | 调用索引（链表），依赖顺序一致 | Proxy 依赖追踪，与调用顺序无关 |

> 💡 React Hooks 基于**调用索引**，每次渲染必须保持相同的调用顺序，否则状态错位；Vue 基于 **Proxy 响应式追踪**，不存在此限制。

***

## 四、useRef

### 4.1 操作 DOM

在 React 组件中操作 **DOM**，需使用 **useRef**：

| 步骤             | 说明                                                       |
| ---------------- | ---------------------------------------------------------- |
| **创建并绑定**   | 用 `useRef(null)` 创建 ref，在 JSX 上通过 `ref={inputRef}` 绑定到元素 |
| **使用 DOM**     | 通过 `inputRef.current` 拿到 DOM 节点后再操作              |

```tsx
import { useRef } from 'react'

function Demo() {
  // 泛型指定 DOM 元素类型，初始值 null
  const inputRef = useRef<HTMLInputElement>(null)

  const focusInput = () => {
    inputRef.current?.focus()
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={focusInput}>聚焦</button>
    </>
  )
}
```

| 注意项       | 说明                                                                 |
| ------------ | -------------------------------------------------------------------- |
| **调用时机** | 不要在渲染阶段用 ref 操作 DOM（此时 `ref.current` 可能尚未赋值）     |
| **表单值**   | 操作文本框内容时，推荐用**受控组件**（状态）而非 ref                 |
| **TS 泛型**  | `useRef<HTMLInputElement>(null)` 指定元素类型，`current` 类型为 `HTMLInputElement \| null`，使用时需判空 |

常用 DOM 元素类型：

| DOM 类型                | 对应标签       |
| ----------------------- | -------------- |
| **HTMLInputElement**    | `<input>`      |
| **HTMLDivElement**      | `<div>`        |
| **HTMLButtonElement**   | `<button>`     |
| **HTMLFormElement**     | `<form>`       |
| **HTMLTextAreaElement** | `<textarea>`   |
| **HTMLAnchorElement**   | `<a>`          |

### 4.2 存储可变值

`useRef` 不仅用于 DOM，还可以存储**任意可变值**。与 `useState` 的关键区别：修改 `ref.current` **不会触发重新渲染**，且值在组件整个生命周期内持久保持。

| 对比项         | useState                        | useRef                          |
| -------------- | ------------------------------- | ------------------------------- |
| **更新后**     | 触发重新渲染                    | 不触发重新渲染                  |
| **读取时机**   | 渲染期间读取最新值              | 任何时候读取 `.current`         |
| **适用**       | 需要驱动 UI 更新的数据          | 不需要渲染的值（定时器 ID、上一次值、标记位等） |

#### useRef 与普通 let 变量的区别

同样不触发重新渲染，但 `useRef` 和 `let` 有本质差异：

| 对比项             | `let`（函数体内）            | `let`（组件外部）                | `useRef`                         |
| ------------------ | ---------------------------- | -------------------------------- | -------------------------------- |
| **重新渲染后**     | 值被重置（函数重新执行）     | 值保持                           | 值保持                           |
| **多实例隔离**     | ✅ 各实例独立                | ❌ 所有实例共享同一变量          | ✅ 各实例独立                    |

```tsx
// ❌ 函数体内 let：每次重新渲染都重置为 0，永远拿不到累计值
function Counter() {
  let count = 0
  const handleClick = () => {
    count += 1             // 修改了，但下次渲染 count 又变回 0
    console.log(count)
  }
  return <button onClick={handleClick}>click</button>
}

// ❌ 组件外 let：值能保持，但所有 <Counter /> 实例共享同一个 count
let count = 0
function Counter() {
  const handleClick = () => {
    count += 1
    console.log(count)     // 实例 A 点一次、实例 B 再点一次 → 输出 2
  }
  return <button onClick={handleClick}>click</button>
}

// ✅ useRef：值在重新渲染后保持，且每个实例各自独立
function Counter() {
  const countRef = useRef(0)
  const handleClick = () => {
    countRef.current += 1
    console.log(countRef.current)
  }
  return <button onClick={handleClick}>click</button>
}
```

```tsx
function Timer() {
  const [count, setCount] = useState(0)
  const timerRef = useRef<number | null>(null)

  const start = () => {
    timerRef.current = window.setInterval(() => {
      setCount(prev => prev + 1)
    }, 1000)
  }

  const stop = () => {
    if (timerRef.current !== null) clearInterval(timerRef.current)
  }

  return (
    <div>
      <span>{count}</span>
      <button onClick={start}>开始</button>
      <button onClick={stop}>停止</button>
    </div>
  )
}
```

> 💡 存储可变值时，`useRef` 的泛型标注存储值的类型（如 `useRef<number | null>(null)`）。与 DOM 引用不同，可变值 ref 的 `current` 可以直接赋值。

常见用途：

| 场景                 | 说明                                             |
| -------------------- | ------------------------------------------------ |
| **保存定时器 ID**    | 开始/停止定时器时需要引用 ID，无需触发渲染       |
| **记录上一次值**     | 在 useEffect 中把当前 state 存入 ref，下次渲染时对比 |
| **标记是否首次渲染** | `const isFirst = useRef(true)`，首次执行后置 false |

### 4.3 Vue 3 对照

| React | Vue 3 | 说明 |
| ----- | ----- | ---- |
| `useRef(null)` + `ref={inputRef}` | `ref()` + `ref="inputRef"` | 操作 DOM |
| `useRef(value)` 存可变值 | 普通变量或 `ref(value)` | Vue 的 `ref()` 本身就是响应式可变容器 |
| 修改 `ref.current` 不触发渲染 | 修改 `ref.value` **会**触发渲染 | 若需不触发渲染的可变值，Vue 中用普通 `let` 变量即可 |

```vue
<script setup>
import { ref, onMounted } from 'vue'

// template ref：声明同名 ref，Vue 自动绑定到模板中同名的 ref 属性
const inputRef = ref<HTMLInputElement | null>(null)

onMounted(() => {
  inputRef.value?.focus()
})
</script>

<template>
  <input ref="inputRef" />
</template>
```

> 💡 React 的 `useRef` 身兼两职（DOM 引用 + 可变值存储），且修改不触发渲染；Vue 的 `ref()` 是响应式的（修改会触发渲染），template ref 绑定 DOM 则通过模板中的 `ref="xxx"` 实现。

***

## 五、useEffect

### 5.1 作用

**useEffect** 用于在组件的**挂载、更新、卸载**阶段执行"副作用"，例如网络请求、订阅、操作 DOM、定时器等。这些操作称为 **side effects（副作用）**。

```jsx
useEffect(() => {
  // 副作用代码
  return () => {
    // 可选：清理函数，卸载或下次执行前调用
  }
}, [依赖项])
```

| 依赖项           | 执行时机                     |
| ---------------- | ---------------------------- |
| 不写或 `undefined` | 每次渲染后都执行             |
| **`[]`**         | 仅挂载时执行一次（常用于请求） |
| `[a, b]`         | 挂载时 + a/b 变化时执行      |

> 💡 可理解为：连接"外部系统"（不受 React 控制的系统），如服务器、浏览器 API、定时器等。

### 5.2 清理函数

useEffect 的回调可以返回一个**清理函数**，React 会在以下时机调用它：

| 时机                             | 说明                                       |
| -------------------------------- | ------------------------------------------ |
| **组件卸载时**                   | 清理订阅、定时器等，防止内存泄漏           |
| **依赖变化、下次 Effect 执行前** | 先清理上一次的副作用，再执行新的副作用     |

```jsx
useEffect(() => {
  const timer = setInterval(() => {
    setCount(prev => prev + 1)
  }, 1000)

  // 卸载或依赖变化时清除定时器
  return () => clearInterval(timer)
}, [])
```

不清理可能导致**内存泄漏**（如组件已卸载但定时器仍在跑、WebSocket 仍在监听）。

> 💡 **开发模式（Strict Mode）** 下 React 会对每个 Effect 执行 **挂载 → 卸载 → 再挂载**，以帮助发现缺少清理函数的问题。如果 Effect 在二次挂载后行为异常，说明清理逻辑不完整。此行为仅在开发环境触发，生产环境不受影响。

### 5.3 依赖项约定

| 需要放进依赖项                     | 不需要放进依赖项                 |
| --------------------------------- | -------------------------------- |
| Effect 中用到的 **props、state**、组件内声明的变量 | 组件外定义的常量、导入的模块级变量/函数 |
|                                   | **useRef 返回的 ref 对象**（跨渲染稳定，永远不变） |

**`ref.current` 也不应放进依赖项**：`ref.current` 是可变值，修改它不会触发重新渲染，而依赖数组的比较只在重渲染时发生，因此即使写进依赖项，Effect 也不会在 `ref.current` 变化时重新执行。

```tsx
const countRef = useRef(0)

useEffect(() => {
  console.log(countRef.current)
}, [countRef.current]) // ❌ ref.current 变化不触发重渲染，Effect 不会重新执行

useEffect(() => {
  console.log(countRef.current)
}, [countRef])          // ❌ 无意义，ref 对象永远不变，等同于 []
```

推荐：**一个 useEffect 只负责一个完整功能**，便于阅读和依赖管理。

### 5.4 在 useEffect 中发请求

场景：组件**初次渲染**时请求数据。

| 注意项   | 说明                                                                 |
| -------- | -------------------------------------------------------------------- |
| **async** | 不要直接在 Effect 函数上写 `async`，Effect 回调需保持"同步注册、异步在内部做" |
| **分工**   | 仅挂载/卸载相关的请求放在 useEffect；用户点击等触发的请求放在**事件处理函数**里 |

```tsx
interface DataItem {
  id: number
  name: string
}

// 初始值为空数组时，TS 推断为 never[]，需用泛型指定元素类型
const [data, setData] = useState<DataItem[]>([])

useEffect(() => {
  const fetchData = async () => {
    const res = await axios.get<DataItem[]>('/api/xxx')
    setData(res.data)
  }
  fetchData()
}, [])
```

> 💡 `useState` 有初始值时自动推断类型，无需泛型；初始值为 `null` 或空数组时需显式标注：`useState<User | null>(null)`、`useState<Item[]>([])`。

**React 19 `use` Hook：** React 19 新增 `use` Hook，可在组件中直接读取 Promise，配合 Suspense 实现更声明式的数据加载，是 `useEffect` + `useState` 请求模式的现代替代方案：

```tsx
import { use, Suspense } from 'react'

function DataList({ dataPromise }: { dataPromise: Promise<DataItem[]> }) {
  // use 直接读取 Promise，未完成时由 Suspense 展示 fallback
  const data = use(dataPromise)
  return <ul>{data.map(item => <li key={item.id}>{item.name}</li>)}</ul>
}

// Promise 在组件外创建，保持引用稳定
const dataPromise = fetch('/api/xxx').then(res => res.json())

function Page() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <DataList dataPromise={dataPromise} />
    </Suspense>
  )
}
```

> 💡 `use` 与其他 Hooks 不同：可以在条件语句和循环中调用，还可以读取 Context（等价于 `useContext`）。配合 Suspense 使用，Promise 未 resolve 时组件挂起。传给 `use` 的 Promise **必须引用稳定**——不要在渲染函数体内直接创建，否则每次渲染产生新 Promise 导致反复挂起；Promise 通常来自模块顶层、路由 loader 或父组件 props。

***

**竞态处理：** 组件快速切换（如 `id` 连续变化）时，先发出的请求可能后返回，导致旧数据覆盖新数据。用 `AbortController` 在清理函数中取消过期请求：

```tsx
useEffect(() => {
  const controller = new AbortController()

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/items?id=${id}`, { signal: controller.signal })
      const data = await res.json()
      setData(data)
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return
      throw e
    }
  }
  fetchData()

  // 依赖变化或卸载时取消未完成的请求
  return () => controller.abort()
}, [id])
```

### 5.5 useLayoutEffect

`useLayoutEffect` 与 `useEffect` 的 API 完全相同，区别在于**执行时机**：

| 对比项         | useEffect                      | useLayoutEffect                  |
| -------------- | ------------------------------ | -------------------------------- |
| **执行时机**   | 浏览器**绘制后**异步执行       | DOM 更新后、浏览器**绘制前**同步执行 |
| **适用场景**   | 大多数副作用（请求、订阅等）   | 需要在绘制前读取/修改 DOM 布局   |
| **阻塞绘制**   | 不阻塞                         | 会阻塞，回调应尽量快             |

典型场景：Tooltip 定位——先渲染到 DOM 读取锚点尺寸，再调整坐标，最后绘制。若用 `useEffect`，用户会先看到 Tooltip 出现在初始位置再跳到正确位置（闪烁）。

```tsx
function Tooltip({ anchorRef, children }: {
  anchorRef: React.RefObject<HTMLElement>
  children: React.ReactNode
}) {
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const tooltipRef = useRef<HTMLDivElement>(null)

  // 绘制前计算位置，避免闪烁
  useLayoutEffect(() => {
    const anchor = anchorRef.current
    if (!anchor) return
    const rect = anchor.getBoundingClientRect()
    setPos({ top: rect.bottom + 4, left: rect.left })
  })

  return (
    <div ref={tooltipRef} style={{ position: 'fixed', top: pos.top, left: pos.left }}>
      {children}
    </div>
  )
}
```

> 💡 仅在 `useEffect` 导致视觉闪烁时才改用 `useLayoutEffect`，默认优先使用 `useEffect`。

### 5.6 Vue 3 对照

React 的 `useEffect` 在 Vue 3 中没有单一对应物，而是拆分为更语义化的 API：

| React | Vue 3 | 说明 |
| ----- | ----- | ---- |
| `useEffect(() => {}, [])` | `onMounted(() => {})` | 挂载时执行一次 |
| `useEffect` 清理函数 + 卸载 | `onUnmounted(() => {})` | 卸载时清理 |
| `useEffect(() => {}, [a, b])` | `watch([a, b], () => {})` | 监听指定响应式数据变化 |
| `useEffect(() => {})` 无依赖 | `watchEffect(() => {})` | 近似对应，行为有差异 |
| `useLayoutEffect` | `onMounted` + `nextTick` | Vue 的 `onMounted` 回调在 DOM 更新后同步执行 |

> **注意**：`useEffect(() => {})` 不传依赖数组时，每次渲染都会重新执行，无论数据是否变化；`watchEffect` 自动追踪回调内访问的响应式数据，仅在这些数据变化时重新执行，不因组件重新渲染而无条件触发。两者在"何时重新执行"上有本质区别。

```vue
<script setup>
import { ref, watch, watchEffect, onMounted, onUnmounted } from 'vue'

const id = ref(1)
let timer: number

// ≈ useEffect(() => { fetchData() }, [])
onMounted(() => { fetchData() })

// ≈ useEffect(() => { ... }, [id])
watch(id, (newId) => { fetchData(newId) })

// ≈ useEffect(() => { ... })（自动追踪依赖）
watchEffect(() => { console.log(id.value) })

// ≈ useEffect 的 return cleanup
onUnmounted(() => { clearInterval(timer) })
</script>
```

> 💡 Vue 3 将 React `useEffect` 的多种用途拆成了独立 API（`onMounted` / `watch` / `watchEffect` / `onUnmounted`），不需要通过依赖项数组区分执行时机，语义更明确。

***

## 六、useReducer

### 6.1 基本用法

**useReducer** 适合状态逻辑较复杂、或下一状态依赖前一状态的场景；可视为"组件内的迷你 Redux"。当多个状态一起变化、或更新逻辑较复杂时，比多个 `useState` 更易维护。

| 参数           | 说明                                   |
| -------------- | -------------------------------------- |
| **reducer**    | 函数 `(state, action) => newState`     |
| **初始 state** | 或传入 **init** 函数得到初始 state     |

```tsx
import { useReducer } from 'react'

// TS 中为 state 和 action 定义类型
interface State {
  count: number
}

// 用可辨识联合（Discriminated Union）定义 Action：每个 action 有唯一 type，TS 自动收窄 payload 类型
type Action =
  | { type: 'add' }
  | { type: 'sub' }
  | { type: 'set'; payload: number }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'add': return { count: state.count + 1 }
    case 'sub': return { count: state.count - 1 }
    case 'set': return { count: action.payload } // TS 已知 payload 为 number
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 })
  return (
    <div>
      <span>{state.count}</span>
      <button onClick={() => dispatch({ type: 'add' })}>+1</button>
      <button onClick={() => dispatch({ type: 'set', payload: 10 })}>设为10</button>
    </div>
  )
}

// dispatch({ type: 'set' })    // ❌ 缺少 payload，编译报错
// dispatch({ type: 'reset' })  // ❌ type 不在联合中，编译报错
```

### 6.2 useState vs useReducer

| 对比项       | useState               | useReducer                    |
| ------------ | ---------------------- | ----------------------------- |
| **适用**     | 简单、独立状态         | 复杂逻辑、多状态联动、多分支  |
| **更新方式** | `setState(newValue)`   | `dispatch({ type, payload })` |
| **逻辑位置** | 散在事件处理函数中     | 集中在 reducer 函数           |
| **可测试性** | 需要渲染组件才能测试   | reducer 是纯函数，可独立单测  |

### 6.3 Vue 3 对照

Vue 3 没有内置的 `useReducer`，复杂状态通常用 `reactive` 对象 + 封装方法管理；或使用 **Pinia** 状态管理，其 action 模式与 reducer 类似（集中管理状态更新逻辑）。

***

## 七、自定义 Hook

### 7.1 概念与规则

**自定义 Hook** 即把可复用的状态与副作用逻辑抽成以 **use** 开头的函数，内部可调用其他 Hooks。

| 约定       | 说明                                                         |
| ---------- | ------------------------------------------------------------ |
| **命名**   | 必须以 `use` 开头（如 `useList`、`useToggle`），否则 React 不会对其应用 Hooks 规则检查 |
| **规则**   | 遵守 Hooks 规则（仅顶层调用、仅在 React 函数内调用）         |
| **返回值** | 可以是数组、对象或单个值，按需约定                           |

### 7.2 典型示例

**封装数据请求：**

```tsx
// 泛型参数 T 让 Hook 适用于任意数据类型
function useList<T>(url: string) {
  const [list, setList] = useState<T[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch(url)
      .then(res => res.json())
      .then((data: T[]) => setList(data))
      .finally(() => setLoading(false))
  }, [url])

  return { list, loading }
}

// 使用时指定泛型，list 的类型自动为 Item[]
interface Item { id: number; name: string }

function Page() {
  const { list, loading } = useList<Item>('/api/items')
  if (loading) return <div>加载中...</div>
  return <ul>{list.map(item => <li key={item.id}>{item.name}</li>)}</ul>
}
```

***

**封装开关状态：**

```tsx
function useToggle(initial = false): [boolean, () => void] {
  const [value, setValue] = useState(initial)
  const toggle = useCallback(() => setValue(v => !v), [])
  return [value, toggle]
}

// 使用
function Panel() {
  const [visible, toggleVisible] = useToggle(false)
  return (
    <div>
      <button onClick={toggleVisible}>{visible ? '收起' : '展开'}</button>
      {visible && <div>面板内容</div>}
    </div>
  )
}
```

> 💡 返回数组时需显式标注返回类型 `[boolean, () => void]`，否则 TS 会推断为 `(boolean | (() => void))[]` 联合数组，消费方解构时类型不精确。返回对象则无此问题。

### 7.3 设计要点

| 要点           | 说明                                                         |
| -------------- | ------------------------------------------------------------ |
| **单一职责**   | 一个 Hook 只负责一件事，复杂逻辑可由多个 Hook 组合           |
| **不含 UI**    | 自定义 Hook 只封装**逻辑**（状态 + 副作用），不返回 JSX      |
| **可组合**     | 自定义 Hook 内可调用其他自定义 Hook，实现逻辑分层             |

### 7.4 Vue 3 对照

Vue 3 的**组合式函数（Composables）** 与 React 自定义 Hook 概念完全对应——以 `use` 开头，封装可复用的响应式逻辑：

```typescript
// useList.ts
import { ref, onMounted } from 'vue'

export function useList<T>(url: string) {
  const list = ref<T[]>([])
  const loading = ref(false)

  onMounted(async () => {
    loading.value = true
    const res = await fetch(url)
    list.value = await res.json()
    loading.value = false
  })

  return { list, loading }
}
```

```vue
<script setup lang="ts">
import { useList } from './useList'

interface Item { id: number; name: string }
const { list, loading } = useList<Item>('/api/items')
</script>
```

| 对比项 | React 自定义 Hook | Vue Composable |
| ------ | ----------------- | -------------- |
| **命名** | 以 `use` 开头（强制） | 以 `use` 开头（约定） |
| **内部能力** | 可调用其他 Hooks | 可使用响应式 API 和生命周期钩子 |
| **返回值** | 数组或对象 | 通常返回对象（含响应式 `ref`） |
| **顺序限制** | 受 Hooks 规则约束 | 无顺序限制 |

***

## 八、性能优化：React.memo、useCallback 与 useMemo

### 8.1 React.memo

**React.memo** 是一个高阶组件，用于对函数组件做**浅比较缓存**：当组件的 props 没有变化（浅比较）时，跳过重新渲染，直接复用上次的渲染结果。

默认情况下，父组件重新渲染时**所有子组件都会跟着重渲染**，即使 props 没变；`React.memo` 可以避免这类不必要的渲染。

```jsx
import { memo } from 'react'

const ExpensiveList = memo(function ExpensiveList({ items }) {
  return (
    <ul>
      {items.map(item => <li key={item.id}>{item.name}</li>)}
    </ul>
  )
})
```

| 参数                   | 说明                                                       |
| ---------------------- | ---------------------------------------------------------- |
| **组件**               | 要缓存的函数组件                                           |
| **比较函数（可选）**   | 自定义 `(prevProps, nextProps) => boolean`，返回 `true` 表示 props 相同、跳过渲染；默认浅比较 |

> **注意**：`React.memo` 只比较 **props**；组件内部的 state 或消费的 Context 变化时仍会重新渲染。

### 8.2 useCallback

JavaScript 中每次执行函数体都会创建新的函数对象。父组件重渲染时，内联定义的回调函数会产生**新引用**，即使函数逻辑完全一致——这会导致 `React.memo` 子组件的 props 浅比较失败，memo 形同虚设。

**useCallback** 用于缓存**函数引用**，依赖不变则返回同一函数，确保传给 memo 子组件的回调引用稳定。

| 参数         | 说明                       |
| ------------ | -------------------------- |
| **回调函数** | 要缓存的函数               |
| **依赖项**   | 依赖变化时返回新函数引用   |

```jsx
import { useCallback } from 'react'

const handleSubmit = useCallback(() => {
  doSomething(a, b)
}, [a, b])
```

### 8.3 useMemo

**useMemo** 用于缓存**计算结果**，依赖不变则返回上次结果，避免每次渲染都重新计算。

| 参数         | 说明                     |
| ------------ | ------------------------ |
| **计算函数** | 返回要缓存的值           |
| **依赖项**   | 依赖变化时重新执行计算   |

**适用场景：** 派生状态（如过滤、排序后的列表）、昂贵计算（大列表运算）；简单运算不必用 useMemo。

```jsx
import { useMemo } from 'react'

// 依赖 list 不变时沿用上次排序结果
const sortedList = useMemo(() => {
  return [...list].sort((a, b) => a.score - b.score)
}, [list])
```

### 8.4 三者对比与配合

| 对比项       | React.memo             | useCallback           | useMemo              |
| ------------ | ---------------------- | --------------------- | -------------------- |
| **缓存对象** | 组件渲染结果           | 函数引用              | 计算结果（值）       |
| **触发条件** | props 浅比较不同时重渲染 | 依赖变化时返回新引用  | 依赖变化时重新计算   |
| **典型用途** | 避免子组件不必要的重渲染 | 传给 memo 子组件的回调 | 派生数据、昂贵计算   |

典型配合模式：父组件用 `useCallback` 稳定回调引用 → 子组件用 `React.memo` 包裹 → 父组件重渲染时子组件因 props 未变而跳过渲染。

```jsx
// 父组件
function Parent() {
  const [count, setCount] = useState(0)

  // 用 useCallback 稳定函数引用
  const handleClick = useCallback(() => {
    console.log('clicked')
  }, [])

  return (
    <div>
      <span>{count}</span>
      <button onClick={() => setCount(count + 1)}>+1</button>
      {/* count 变化导致 Parent 重渲染，但 Child 的 props 未变，跳过渲染 */}
      <Child onClick={handleClick} />
    </div>
  )
}

// 子组件用 memo 包裹
const Child = memo(function Child({ onClick }) {
  return <button onClick={onClick}>子按钮</button>
})
```

> 💡 不要滥用：只在**确实有性能问题**或子组件渲染开销较大时才优化。过早优化反而增加代码复杂度。

### 8.5 Vue 3 对照

Vue 3 的响应式系统**自动追踪依赖、精确更新**，大部分场景不需要手动优化：

| React | Vue 3 | 说明 |
| ----- | ----- | ---- |
| **`React.memo`** | 不需要 | Vue 组件默认按需更新，props 未变时不会重渲染子组件 |
| **`useCallback`** | 不需要 | Vue 模板编译器自动缓存事件处理函数引用 |
| **`useMemo`** | `computed` | 缓存派生值，依赖变化时自动重新计算 |

```vue
<script setup>
import { ref, computed } from 'vue'

const list = ref([{ score: 3 }, { score: 1 }, { score: 2 }])

// 等价于 useMemo(() => [...list].sort(...), [list])
const sortedList = computed(() =>
  [...list.value].sort((a, b) => a.score - b.score)
)
</script>
```

> 💡 React 需要 `memo` + `useCallback` 手动防止不必要的子组件渲染；Vue 的编译器和响应式系统已内置这些优化，开发者通常只需用 `computed` 处理派生数据。

### 8.6 React Compiler

**React Compiler**（原名 React Forget）是 React 19 配套的编译期优化工具，在构建阶段自动分析组件代码，**自动插入 memoization**——等价于编译器帮你加 `memo`、`useCallback`、`useMemo`。

| 对比项         | 手动优化                          | React Compiler                    |
| -------------- | --------------------------------- | --------------------------------- |
| **工作方式**   | 开发者手写 `memo` / `useCallback` / `useMemo` | 编译器自动推断并插入缓存逻辑      |
| **心智负担**   | 需判断哪里该加、依赖项是否正确    | 无需关心，编译器自动处理          |
| **适用范围**   | 逐个组件/函数手动包裹             | 全局自动生效                      |

启用后，大部分场景**不再需要**手动编写 `React.memo`、`useCallback`、`useMemo`，编译器会自动完成等价优化。但理解它们的原理仍然重要——有助于理解编译器的行为、排查性能问题、以及维护未启用 Compiler 的项目。

> 💡 React Compiler 需要在构建工具中配置插件（如 Babel 或 Vite 插件）启用，并非 React 19 默认开启。新项目推荐启用；旧项目可渐进式迁移。

***

## 九、并发特性：useTransition 与 useDeferredValue

### 9.1 useTransition

**useTransition** 将某些状态更新标记为**非紧急（Transition）**，React 优先处理紧急更新（如键盘输入），空闲时再处理 Transition 更新，避免高开销渲染阻塞用户交互。

| 返回值 | 说明 |
| ------ | ---- |
| **`isPending`** | Transition 尚未完成时为 `true`，可用于展示加载状态 |
| **`startTransition`** | 将回调内的 `setState` 标记为非紧急 |

```tsx
import { useState, useTransition } from 'react'

function SearchPage({ allItems }: { allItems: string[] }) {
  const [keyword, setKeyword] = useState('')
  const [filteredItems, setFilteredItems] = useState(allItems)
  const [isPending, startTransition] = useTransition()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setKeyword(value)            // 紧急：输入框立即响应
    startTransition(() => {
      // 非紧急：过滤结果延迟渲染，不阻塞输入
      setFilteredItems(allItems.filter(item => item.includes(value)))
    })
  }

  return (
    <div>
      <input value={keyword} onChange={handleChange} />
      {isPending && <span>过滤中...</span>}
      <ul>{filteredItems.map(item => <li key={item}>{item}</li>)}</ul>
    </div>
  )
}
```

典型场景：

| 场景 | 说明 |
| ---- | ---- |
| **搜索过滤** | 输入框即时响应，大列表过滤延迟渲染 |
| **Tab 切换** | Tab 按钮立即高亮，内容面板延迟渲染 |
| **大列表更新** | 用户操作立即反馈，列表重渲染不阻塞交互 |

> 💡 `startTransition` 回调必须是**同步的**（内部直接调 `setState`），不能包含 `await`。回调内的 `setState` 被标记为低优先级，React 可中断其渲染以响应更紧急的更新。

### 9.2 useDeferredValue

**useDeferredValue** 接收一个值，返回其**延迟版本**。原始值频繁变化时，延迟版本滞后更新，让 React 优先渲染紧急内容。适用于**无法控制状态更新源头**（如值来自 props）的场景。

```tsx
import { useState, useDeferredValue, useMemo } from 'react'

function SearchResults({ keyword }: { keyword: string }) {
  // keyword 来自 props，无法用 startTransition 控制其更新
  const deferredKeyword = useDeferredValue(keyword)
  const isStale = keyword !== deferredKeyword

  const results = useMemo(() => heavySearch(deferredKeyword), [deferredKeyword])

  return (
    <div style={{ opacity: isStale ? 0.6 : 1 }}>
      <ul>{results.map(r => <li key={r}>{r}</li>)}</ul>
    </div>
  )
}
```

### 9.3 useTransition vs useDeferredValue

| 对比项 | useTransition | useDeferredValue |
| ------ | ------------- | ---------------- |
| **控制对象** | 包裹 `setState` 调用 | 包裹一个**值** |
| **使用场景** | 能控制状态更新源头 | 值来自 props 或外部，无法控制更新源头 |
| **加载状态** | 提供 `isPending` 标志 | 通过 `value !== deferredValue` 判断 |
| **本质** | 降低 `setState` 优先级 | 让值的消费端延迟响应 |

两者解决相同问题——**防止高开销渲染阻塞用户交互**，选择取决于能否控制状态更新的源头。

### 9.4 Vue 3 对照

Vue 3 没有并发调度机制，响应式更新统一批处理，不区分优先级。性能敏感场景通过其他手段解决：

| React | Vue 3 替代方案 | 说明 |
| ----- | -------------- | ---- |
| `useTransition` | 手动 loading 状态 + `nextTick` | Vue 无优先级调度，需自行管理加载态 |
| `useDeferredValue` | `watchDebounced`（VueUse） | 通过防抖延迟响应频繁变化的值 |
| 并发渲染（可中断） | 虚拟滚动 / `v-memo` | Vue 用减少渲染量代替可中断渲染 |

> 💡 React 并发特性依赖 Fiber 架构的**可中断渲染**——低优先级渲染可被高优先级更新打断。Vue 的 Virtual DOM diff 是同步不可中断的，因此无法实现相同机制，但 Vue 的精确依赖追踪使得需要优先级调度的场景本身较少。

***

## 十、ref 转发与 useImperativeHandle

### 10.1 ref 转发

默认情况下，函数组件**不接收** `ref`（传了也拿不到）。React 19 起，函数组件可以直接从 **props** 中接收 `ref`，并转发到内部的某个 DOM 元素上：

```tsx
import { useRef } from 'react'

interface MyInputProps {
  placeholder?: string
  ref?: React.Ref<HTMLInputElement>
}

// React 19：ref 直接作为 props 接收
function MyInput({ placeholder, ref }: MyInputProps) {
  return <input ref={ref} placeholder={placeholder} />
}

function Parent() {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <div>
      <MyInput ref={inputRef} placeholder="请输入" />
      <button onClick={() => inputRef.current?.focus()}>聚焦子组件输入框</button>
    </div>
  )
}
```

| 注意项           | 说明                                                       |
| ---------------- | ---------------------------------------------------------- |
| **适用场景**     | 封装可复用组件（如自定义 Input、Modal）时，允许父组件操作内部 DOM |
| **React 18 及以前** | 需要用 `forwardRef` 高阶组件包裹才能接收 `ref`，React 19 起已不再需要 |

***

**⚠️ 旧版写法（React 18 及以前）：`forwardRef`**

React 19 之前，函数组件无法直接接收 `ref`，必须用 **`forwardRef`** 高阶组件包裹，`ref` 作为第二个参数（而非 props 属性）传入。已有项目中大量使用此写法，维护老项目时会频繁遇到：

```tsx
import { forwardRef, useRef } from 'react'

interface MyInputProps {
  placeholder?: string
}

// forwardRef 泛型：<Ref 类型, Props 类型>
const MyInput = forwardRef<HTMLInputElement, MyInputProps>(
  function MyInput(props, ref) {
    // ref 是第二个参数，不在 props 中
    return <input ref={ref} {...props} />
  }
)

function Parent() {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <div>
      <MyInput ref={inputRef} placeholder="请输入" />
      <button onClick={() => inputRef.current?.focus()}>聚焦子组件输入框</button>
    </div>
  )
}
```

> 💡 `forwardRef` 写法在 React 19 中仍可正常工作，但已被标记为即将弃用。新代码推荐直接从 props 接收 `ref`。

### 10.2 useImperativeHandle

**useImperativeHandle** 用于**限制**父组件通过 ref 能访问的内容——不暴露整个 DOM 节点，而是只暴露指定的方法或属性。

```tsx
import { useRef, useImperativeHandle } from 'react'

interface MyInputHandle {
  focus: () => void
  clear: () => void
}

interface MyInputProps {
  ref?: React.Ref<MyInputHandle>
}

// React 19 写法：ref 从 props 接收
function MyInput({ ref }: MyInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    clear: () => { if (inputRef.current) inputRef.current.value = '' }
  }))

  return <input ref={inputRef} />
}

// 父组件的 ref 类型为自定义 Handle，只能调用 focus() 和 clear()
function Parent() {
  const ref = useRef<MyInputHandle>(null)
  return (
    <div>
      <MyInput ref={ref} />
      <button onClick={() => ref.current?.focus()}>聚焦</button>
      <button onClick={() => ref.current?.clear()}>清空</button>
    </div>
  )
}
```

***

**⚠️ 旧版写法（React 18 及以前）：`forwardRef` + `useImperativeHandle`**

```tsx
import { forwardRef, useRef, useImperativeHandle } from 'react'

interface MyInputHandle {
  focus: () => void
  clear: () => void
}

// forwardRef 泛型中 Ref 类型改为自定义 Handle 接口
const MyInput = forwardRef<MyInputHandle, {}>(
  function MyInput(props, ref) {
    const inputRef = useRef<HTMLInputElement>(null)

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      clear: () => { if (inputRef.current) inputRef.current.value = '' }
    }))

    return <input ref={inputRef} {...props} />
  }
)
```

| 对比项       | 仅转发 ref                 | ref + useImperativeHandle        |
| ------------ | -------------------------- | -------------------------------- |
| **暴露内容** | 整个 DOM 节点              | 自定义的方法/属性                |
| **封装性**   | 内部 DOM 完全暴露          | 只暴露必要接口，更安全           |
| **适用场景** | 简单转发（如聚焦）         | 需要精细控制暴露内容的组件封装   |

### 10.3 Vue 3 对照

React 的 ref 转发 + `useImperativeHandle` 在 Vue 3 中对应 **`defineExpose`**：

| React | Vue 3 | 说明 |
| ----- | ----- | ---- |
| **props 中接收 `ref`** | 不需要 | Vue 组件默认可通过 `ref` 获取实例 |
| **`useImperativeHandle`** | `defineExpose` | 显式声明暴露给父组件的属性/方法 |

```vue
<!-- 子组件 MyInput.vue -->
<script setup lang="ts">
import { ref } from 'vue'

const inputRef = ref<HTMLInputElement | null>(null)

// 只暴露 focus 和 clear，等价于 useImperativeHandle
defineExpose({
  focus: () => inputRef.value?.focus(),
  clear: () => { if (inputRef.value) inputRef.value.value = '' }
})
</script>

<template>
  <input ref="inputRef" />
</template>
```

```vue
<!-- 父组件 -->
<script setup lang="ts">
import { ref } from 'vue'
import MyInput from './MyInput.vue'

const myInputRef = ref<InstanceType<typeof MyInput> | null>(null)
const handleFocus = () => myInputRef.value?.focus()
</script>

<template>
  <MyInput ref="myInputRef" />
  <button @click="handleFocus">聚焦</button>
</template>
```

> 💡 Vue 3 `<script setup>` 组件默认**不暴露**任何内部属性，必须用 `defineExpose` 显式声明，与 React 的 `useImperativeHandle` 理念一致——最小化暴露。

***

## 十一、React.lazy 与 Suspense

### 11.1 代码分割

**React.lazy** 配合动态 `import()` 实现组件级**代码分割**——按需加载组件的 JS 代码，减少首屏加载体积。**Suspense** 包裹懒加载组件，在代码尚未加载完成时展示 `fallback`。

```tsx
import { lazy, Suspense } from 'react'

// 动态导入，仅在组件首次渲染时才加载对应 JS 文件
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Settings = lazy(() => import('./pages/Settings'))

function App() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <Dashboard />
    </Suspense>
  )
}
```

| 注意项             | 说明                                                       |
| ------------------ | ---------------------------------------------------------- |
| **默认导出**       | `lazy(() => import('./Foo'))` 要求目标模块有 `default export` |
| **Suspense 位置**  | 可放在懒加载组件的任意祖先层级；一个 Suspense 可包裹多个 lazy 组件 |
| **嵌套 Suspense**  | 可嵌套多层，内层 Suspense 为更细粒度的区域提供独立 fallback |

### 11.2 路由级分割

最常见的做法是按**路由**分割，每个页面组件用 `lazy` 导入：

```tsx
import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>加载中...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
```

### 11.3 Vue 3 对照

| React | Vue 3 | 说明 |
| ----- | ----- | ---- |
| `React.lazy(() => import(...))` | `defineAsyncComponent(() => import(...))` | 异步加载组件 |
| `<Suspense fallback={...}>` | `<Suspense>` + `#fallback` 插槽 | 加载中展示占位内容 |

```vue
<script setup>
import { defineAsyncComponent } from 'vue'

const Dashboard = defineAsyncComponent(() => import('./Dashboard.vue'))
</script>

<template>
  <Suspense>
    <Dashboard />
    <template #fallback>加载中...</template>
  </Suspense>
</template>
```

> 💡 Vue Router 内置 `() => import('./Page.vue')` 语法实现路由级代码分割，无需额外包裹 `defineAsyncComponent`。

***

## 十二、错误边界（Error Boundary）

### 12.1 概念

**错误边界** 是一种 React 组件，能捕获子组件树在**渲染阶段**抛出的 JS 错误，展示降级 UI 而不是白屏。

| 能捕获                         | 不能捕获                                 |
| ------------------------------ | ---------------------------------------- |
| 子组件 render 中的错误         | 事件处理函数中的错误（用 try/catch）     |
| 生命周期 / useEffect 中的错误  | 异步代码（setTimeout、Promise reject）   |
| 子树中的错误                   | 服务端渲染（SSR）错误                    |

### 12.2 实现方式

错误边界**只能用类组件**实现，需定义 `getDerivedStateFromError` 或 `componentDidCatch`：

```tsx
import { Component, ErrorInfo, ReactNode } from 'react'

interface Props { fallback?: ReactNode; children: ReactNode }
interface State { hasError: boolean }

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    // 渲染降级 UI
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // 上报错误日志
    console.error('ErrorBoundary caught:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <div>出错了</div>
    }
    return this.props.children
  }
}
```

使用时包裹需要兜底的组件树：

```tsx
<ErrorBoundary fallback={<div>页面加载失败</div>}>
  <Dashboard />
</ErrorBoundary>
```

| 策略             | 说明                                                       |
| ---------------- | ---------------------------------------------------------- |
| **顶层兜底**     | 在 App 根部放一个错误边界，防止整个应用白屏                |
| **局部兜底**     | 在关键模块外各套一个，错误只影响局部区域，其余正常运行     |

> 💡 社区常用 `react-error-boundary` 库，提供函数组件写法和自动重试等功能，避免手写类组件。

### 12.3 Vue 3 对照

React 错误边界只能用类组件实现；Vue 3 提供 **`onErrorCaptured`** 生命周期钩子，在任意组件中即可捕获后代组件的渲染错误：

| React | Vue 3 |
| ----- | ----- |
| 只能用**类组件**（`getDerivedStateFromError` / `componentDidCatch`） | `onErrorCaptured` 钩子，函数组件即可使用 |

```vue
<script setup>
import { ref, onErrorCaptured } from 'vue'

const hasError = ref(false)

onErrorCaptured((error, instance, info) => {
  hasError.value = true
  console.error('捕获错误:', error, info)
  return false // 返回 false 阻止错误继续向上传播
})
</script>

<template>
  <div v-if="hasError">出错了</div>
  <slot v-else />
</template>
```

***

## 十三、Portal

**createPortal** 将子节点渲染到 DOM 树中**任意位置**（通常是 `document.body`），而非父组件的 DOM 层级下。常用于模态框、Toast、Tooltip 等需要脱离父容器层叠上下文的场景。

```tsx
import { createPortal } from 'react-dom'

function Modal({ visible, onClose, children }: {
  visible: boolean
  onClose: () => void
  children: React.ReactNode
}) {
  if (!visible) return null

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  )
}
```

| 特性                 | 说明                                                       |
| -------------------- | ---------------------------------------------------------- |
| **DOM 位置**         | 渲染到指定容器下（如 `document.body`），脱离父组件 DOM 层级 |
| **React 事件冒泡**   | 仍按 React 组件树冒泡，与 DOM 树位置无关；父组件能捕获 Portal 内的事件 |
| **CSS 层叠上下文**   | 脱离父容器的 `overflow: hidden`、`z-index` 等限制          |

**Vue 3 对照：** React 的 `createPortal` 对应 Vue 3 的 **`<Teleport>`** 组件：

| React | Vue 3 | 说明 |
| ----- | ----- | ---- |
| `createPortal(children, container)` | `<Teleport to="selector">` | 渲染到指定 DOM 节点 |
| JS 函数调用 | 模板组件 | Vue 用声明式写法，更直观 |
| 事件按 React 组件树冒泡 | 事件按 Vue 组件树冒泡 | 均与实际 DOM 位置无关 |

```vue
<template>
  <Teleport to="body">
    <div v-if="visible" class="modal-overlay" @click="$emit('close')">
      <div class="modal-content" @click.stop>
        <slot />
      </div>
    </div>
  </Teleport>
</template>
```

***

## 十四、React 19 Actions 与表单 Hooks

React 19 引入 **Actions** 机制：`<form>` 的 `action` 属性可直接接收异步函数，React 自动管理 pending 状态、错误状态和乐观更新。配套提供三个 Hook：`useActionState`（管理 action 状态）、`useFormStatus`（获取表单提交状态）、`useOptimistic`（乐观更新）。

| 对比项 | 传统模式（useState + onSubmit） | Actions 模式（React 19） |
| ------ | ------------------------------ | ----------------------- |
| **pending 状态** | 手动 `setLoading(true/false)` | `useActionState` / `useFormStatus` 自动管理 |
| **错误处理** | try/catch + `setError` | action 返回值中携带错误信息 |
| **乐观更新** | 手动更新 → 手动回退 | `useOptimistic` 自动回退 |
| **渐进增强** | JS 未加载则表单不可用 | `<form action>` 在无 JS 时仍可提交（SSR） |
| **代码组织** | 状态逻辑散在组件中 | action 函数集中处理，类似 reducer |

### 14.1 useActionState

**useActionState** 管理表单 Action 的状态：接收一个异步 action 函数和初始状态，返回当前状态、绑定到 `<form action>` 的封装函数、以及 pending 标志。

```tsx
import { useActionState } from 'react'

async function submitAction(prevState: { message: string }, formData: FormData) {
  const name = formData.get('name') as string
  if (!name) return { message: '名称不能为空' }
  await fetch('/api/submit', { method: 'POST', body: formData })
  return { message: `提交成功：${name}` }
}

function Form() {
  const [state, formAction, isPending] = useActionState(submitAction, { message: '' })

  return (
    <form action={formAction}>
      <input name="name" />
      <button disabled={isPending}>{isPending ? '提交中...' : '提交'}</button>
      {state.message && <p>{state.message}</p>}
    </form>
  )
}
```

| 参数 | 说明 |
| ---- | ---- |
| **action** | 异步函数 `(prevState, formData) => newState`，接收上一次状态和表单数据 |
| **initialState** | 初始状态 |
| **permalink（可选）** | SSR 场景下 JS 加载前的表单提交 URL |

| 返回值 | 说明 |
| ------ | ---- |
| **state** | action 函数的最新返回值 |
| **formAction** | 传给 `<form action>` 的封装函数 |
| **isPending** | action 执行期间为 `true` |

> 💡 action 函数的签名类似 `useReducer` 的 reducer——第一个参数是上一次的 state，第二个参数是 `FormData`（而非 action 对象）。

### 14.2 useFormStatus

**useFormStatus** 获取**最近父级 `<form>`** 的提交状态。必须在 `<form>` 的**子组件**中调用，不能在渲染 `<form>` 的同一组件中调用。

```tsx
import { useFormStatus } from 'react-dom'

// 必须是 <form> 的子组件
function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button disabled={pending}>
      {pending ? '提交中...' : '提交'}
    </button>
  )
}

function Form() {
  return (
    <form action={handleSubmit}>
      <input name="name" />
      <SubmitButton />
    </form>
  )
}
```

| 返回值 | 说明 |
| ------ | ---- |
| **pending** | 父级 form 是否正在提交 |
| **data** | 提交中的 `FormData`（未提交时为 `null`） |
| **method** | HTTP 方法（`'get'` 或 `'post'`） |
| **action** | 传给 form 的 action 函数引用 |

> **注意**：`useFormStatus` 从 `react-dom` 导入（非 `react`）。在渲染 `<form>` 的同一组件中调用会始终返回 `{ pending: false }`——必须将使用它的 UI 提取为子组件。

### 14.3 useOptimistic

**useOptimistic** 在异步操作完成前**立即展示预期结果**，提升用户感知速度。操作成功时用真实数据替换乐观值；失败时自动回退到原始状态。

```tsx
import { useOptimistic } from 'react'

interface Todo {
  id: number
  text: string
  saving?: boolean
}

function TodoList({ todos, onAdd }: {
  todos: Todo[]
  onAdd: (text: string) => Promise<void>
}) {
  const [optimisticTodos, addOptimistic] = useOptimistic(
    todos,
    (current: Todo[], newText: string) => [
      ...current,
      { id: Date.now(), text: newText, saving: true }
    ]
  )

  async function handleAdd(formData: FormData) {
    const text = formData.get('text') as string
    addOptimistic(text)          // 立即在列表中展示
    await onAdd(text)            // 等待服务器确认
  }

  return (
    <div>
      {optimisticTodos.map(todo => (
        <p key={todo.id} style={{ opacity: todo.saving ? 0.6 : 1 }}>
          {todo.text}
        </p>
      ))}
      <form action={handleAdd}>
        <input name="text" />
        <button>添加</button>
      </form>
    </div>
  )
}
```

| 参数 | 说明 |
| ---- | ---- |
| **state** | 原始状态（通常来自 props） |
| **updateFn** | `(currentState, optimisticValue) => newOptimisticState` |

| 返回值 | 说明 |
| ------ | ---- |
| **optimisticState** | 操作进行中为乐观值，完成后自动恢复为真实状态 |
| **addOptimistic** | 触发乐观更新的函数 |

> 💡 乐观更新的"回退"是自动的：原始 `state`（来自 props）更新为服务器返回的真实数据后，React 用真实数据替换乐观值，无需手动回退。

***

**三者的典型协作流程：**

```
用户提交表单
    ↓
useOptimistic → 立即展示预期结果
    ↓
useFormStatus → 子组件中按钮显示"提交中..."
    ↓
useActionState 的 action 执行异步操作
    ↓
成功 → 真实数据替换乐观值
失败 → 自动回退到原始状态
```

### 14.4 Vue 3 对照

Vue 3 没有内置 Actions 机制，表单提交仍使用 `@submit.prevent` + 手动管理状态：

| React 19 | Vue 3 | 说明 |
| --------- | ----- | ---- |
| `<form action={fn}>` | `<form @submit.prevent="fn">` | Vue 用事件处理，无自动 pending 管理 |
| `useActionState` | 手动 `ref` 管理 loading / error / data | 无内置抽象 |
| `useFormStatus` | 无对应 | 通过 props 或 provide/inject 传递 loading 状态 |
| `useOptimistic` | 手动实现（更新 → try/catch → 回退） | 无内置支持 |

```vue
<script setup lang="ts">
import { ref } from 'vue'

const isPending = ref(false)
const message = ref('')

async function handleSubmit(e: Event) {
  const formData = new FormData(e.target as HTMLFormElement)
  isPending.value = true
  try {
    await fetch('/api/submit', { method: 'POST', body: formData })
    message.value = '提交成功'
  } catch {
    message.value = '提交失败'
  } finally {
    isPending.value = false
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <input name="name" />
    <button :disabled="isPending">{{ isPending ? '提交中...' : '提交' }}</button>
    <p>{{ message }}</p>
  </form>
</template>
```

> 💡 React 19 的 Actions 将表单状态管理提升为框架级抽象，减少了手动管理 pending/error 的样板代码；Vue 中需手动编写这些逻辑，但可封装为 composable 函数复用。
