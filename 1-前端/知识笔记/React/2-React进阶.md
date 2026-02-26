## 一、受控组件（表单与状态）

### 1.1 什么是受控组件

**受控组件** 指表单元素的值由 React 状态控制，而不是由 DOM 自身维护。

| 步骤     | 说明 |
| -------- | ---- |
| 1. 准备状态 | 用 `useState` 存输入值 |
| 2. 绑定表单 | `value={状态}` + `onChange` 中调用 set 更新状态 |

> **注意**：React 里文本框的 `onChange` 行为类似原生的 `input` 事件（React 对 `change` 做了统一处理）。事件对象为合成事件，若在异步回调里需要使用事件数据，应先取出所需字段（如 `e.target.value`）再使用。

```jsx
const [content, setContent] = useState('')

<input
  value={content}
  onChange={(e) => setContent(e.target.value)}
/>
```

***

## 二、useRef 与 DOM 操作

### 2.1 使用方式

在 React 组件中操作 DOM，需使用 **useRef**：

| 步骤     | 说明 |
| -------- | ---- |
| 1. 创建并绑定 | 用 `useRef(null)` 创建 ref，在 JSX 上通过 `ref={inputRef}` 绑定到元素 |
| 2. 使用 DOM   | 通过 `inputRef.current` 拿到 DOM 节点后再操作 |

```jsx
import { useRef } from 'react'

function Demo() {
  const inputRef = useRef(null)

  const focusInput = () => {
    inputRef.current.focus()
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={focusInput}>聚焦</button>
    </>
  )
}
```

| 注意     | 说明 |
| -------- | ---- |
| **时机** | 不要在渲染阶段用 ref 操作 DOM（此时 `ref.current` 可能尚未赋值） |
| **表单值** | 操作文本框内容时，推荐用受控组件（状态）而非 ref |

***

## 三、组件 props

### 3.1 作用与特点

**props** 用于向组件传递数据，是 React 组件通讯的基础。props 是只读对象，子组件不应修改。

| 步骤     | 说明 |
| -------- | ---- |
| **传递** | 在组件标签上写属性：`<Child name="Tom" count={1} />` |
| **接收** | 函数组件通过形参接收：`function Child(props)` 或解构 `function Child({ name, count })` |

```jsx
// 父组件
<Child name="Tom" count={count} />

// 子组件（推荐解构）
function Child({ name, count = 0 }) {
  return <div>{name}: {count}</div>
}
```

**props 默认值**：解构时直接写默认参数即可，如 `count = 0`。

***

## 四、组件通讯

### 4.1 常见场景

一个组件需要使用另一个组件的数据时，按层级关系分为：

| 类型           | 说明 |
| -------------- | ---- |
| **父子通讯**   | 父 ↔ 子，最常用 |
| **非父子通讯** | 兄弟、后代等，需状态提升或 Context |
| **复杂场景**   | 可用 Redux 等状态管理工具 |

### 4.2 父子组件通讯

原则：**谁的数据谁负责**。

| 方向     | 做法 |
| -------- | ---- |
| **父 → 子** | 父组件通过 **props** 把数据传给子组件 |
| **子 → 父** | 父组件把**修改数据的函数**通过 props 传给子组件，子组件调用该函数并传入参数，把数据“回传”给父组件 |

```
父组件提供数据 → props → 子组件使用
父组件提供函数 → props → 子组件调用并传参 → 父组件更新状态
```

### 4.3 兄弟组件通讯：状态提升

**状态提升**：若两个兄弟组件需要共享数据，把共享状态放到公共父组件中，再通过 props 向下传递；需要修改时，父组件把 set 函数通过 props 传给子组件，由子组件调用。

| 步骤     | 说明 |
| -------- | ---- |
| 1. 父组件提供状态 | 如 `const [activeId, setActiveId] = useState(null)` |
| 2. 子组件 A 使用数据 | 父 → 子，用 props 展示 |
| 3. 子组件 B 修改数据 | 父传入 set 函数，子组件调用并传参 |

### 4.4 跨组件通讯：Context

**Context（上下文）** 用于跨层级传递数据，不限于父子，后代组件均可消费。

| 步骤     | 说明 |
| -------- | ---- |
| 1. 创建 Context | `createContext(defaultValue)` |
| 2. 划定范围并提供数据 | 用 `Provider` 包裹组件树，通过 `value` 传入共享数据 |
| 3. 消费数据 | 后代组件通过 `useContext(MyContext)` 获取数据 |

```jsx
// 1. 创建
const MyContext = createContext(null)

// 2. 提供（通常在根或某父组件）
<MyContext.Provider value={sharedData}>
  <App />
</MyContext.Provider>

// 3. 消费（任意后代）
const data = useContext(MyContext)
```

***

## 五、useEffect 的使用

### 5.1 作用

**useEffect** 用于在组件的**挂载、更新、卸载**阶段执行“副作用”，例如网络请求、订阅、操作 DOM、定时器等。这些操作称为 **side effects**（副作用）。

```jsx
useEffect(() => {
  // 副作用代码
  return () => {
    // 可选：清理函数，卸载或下次执行前调用
  }
}, [依赖项])
```

| 依赖项     | 执行时机 |
| ---------- | -------- |
| 不写或 `undefined` | 每次渲染后都执行 |
| `[]`       | 仅挂载时执行一次 |
| `[a, b]`   | 挂载时 + a/b 变化时执行 |

> 💡 可理解为：连接“外部系统”（不受 React 控制的系统），如服务器、浏览器 API、定时器等。

### 5.2 依赖项约定

| 需要放进依赖项     | 不需要放进依赖项         |
| ------------------ | ------------------------ |
| Effect 中用到的 props、state、组件内声明的变量 | 组件外定义的常量、导入的模块级变量/函数 |

推荐：**一个 useEffect 只负责一个完整功能**，便于阅读和依赖管理。

### 5.3 在 useEffect 中发请求

场景：组件初次渲染时请求数据。

| 注意     | 说明 |
| -------- | ---- |
| **async** | 不要直接在 Effect 函数上写 `async`，Effect 回调需保持“同步注册、异步在内部做” |
| **分工** | 仅挂载/卸载相关的请求放在 useEffect；用户点击等触发的请求放在事件处理函数里 |

```jsx
useEffect(() => {
  const fetchData = async () => {
    const res = await axios.get('/api/xxx')
    setData(res.data)
  }
  fetchData()
}, [])
```

***

## 六、React Hooks 规则

### 6.1 什么是 Hooks

**Hooks** 是以 `use` 开头的函数（如 `useState`、`useEffect`、`useContext`），为组件提供状态、副作用、Context 等能力。需 React 16.8+。

**为何需要 Hooks（了解即可）：** 类组件中状态逻辑难以复用、生命周期拆散同一逻辑；Hooks 让函数组件也能拥有状态与副作用，且便于抽成自定义 Hook 复用。

### 6.2 使用规则

**只能在组件顶层调用 Hooks**，不可放在 `if`、`for`、嵌套函数中。

| 正确 ✅ | 错误 ❌ |
| ------- | ------- |
| 组件顶层顺序调用 | 条件、循环、嵌套函数内调用 |

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

***

## 八、useMemo 与 useCallback

### 8.1 useMemo

**useMemo** 用于缓存**计算结果**，避免每次渲染都重新计算。依赖不变则返回上次结果。

```jsx
import { useMemo } from 'react'

const sortedList = useMemo(() => {
  return [...list].sort((a, b) => a.score - b.score)
}, [list])
```

| 参数       | 说明 |
| ---------- | ---- |
| **计算函数** | 返回要缓存的值 |
| **依赖项**   | 依赖变化时重新计算 |

### 8.2 useCallback

**useCallback** 用于缓存**函数引用**，依赖不变则返回同一函数，常用于避免子组件因父组件重渲染而不必要的重渲染（需配合 React.memo）。

```jsx
import { useCallback } from 'react'

const handleSubmit = useCallback(() => {
  doSomething(a, b)
}, [a, b])
```

***

## 九、useReducer

**useReducer** 适合状态逻辑较复杂、或下一状态依赖前一状态的场景；可视为“组件内的迷你 Redux”。

| 参数       | 说明 |
| ---------- | ---- |
| **reducer** | 函数 (state, action) => newState |
| **初始 state** | 或传入 init 函数得到初始 state |

```jsx
import { useReducer } from 'react'

function reducer(state, action) {
  switch (action.type) {
    case 'add': return { count: state.count + 1 }
    case 'sub': return { count: state.count - 1 }
    default: return state
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 })
  return (
    <div>
      <span>{state.count}</span>
      <button onClick={() => dispatch({ type: 'add' })}>+1</button>
    </div>
  )
}
```

***

## 十、自定义 Hook

**自定义 Hook** 即把可复用的状态与副作用逻辑抽成以 **use** 开头的函数，内部可调用其他 Hooks。

```jsx
// 封装“获取并管理列表”的逻辑
function useList(url) {
  const [list, setList] = useState([])
  useEffect(() => {
    fetch(url).then(res => res.json()).then(setList)
  }, [url])
  return list
}

// 使用
function Page() {
  const list = useList('/api/items')
  return <ul>{list.map(item => <li key={item.id}>{item.name}</li>)}</ul>
}
```

| 约定     | 说明 |
| -------- | ---- |
| **命名** | 以 `use` 开头 |
| **规则** | 遵守 Hooks 规则（仅顶层、仅 React 函数内调用） |

***

## 十一、案例要点：知乎频道管理

| 功能         | 实现要点 |
| ------------ | -------- |
| **弹窗显隐** | 父组件用 `visible` 状态控制；父 → 子传 `visible`，子 → 父通过回调关闭 |
| **频道数据** | 使用 Context：根或某父组件用 Provider 提供列表；子组件 `useContext` 获取并渲染 |
| **数据来源** | 在父组件或提供 Context 的组件里用 `useEffect` 请求频道列表 |
| **添加/移除频道** | 通过 Context 提供的更新方法或状态更新函数，修改选中列表；注意不可编辑频道的处理 |

| 技术点     | 说明 |
| ---------- | ---- |
| **Context** | 跨层级共享频道列表与操作函数 |
| **useEffect** | 挂载时请求频道数据 |
| **useContext** | 在频道弹窗等组件中消费 Context |
