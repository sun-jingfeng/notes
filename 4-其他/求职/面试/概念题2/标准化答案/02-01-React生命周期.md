# React 生命周期（类组件 → Hooks 对照）

## 一、为什么关心生命周期

**生命周期**描述组件从挂载、更新到卸载的各个阶段，便于在“合适时机”执行副作用（请求数据、订阅、DOM、清理）。类组件用生命周期方法；函数组件用 **Hooks**（主要是 `useEffect`）表达等价逻辑。

***

## 二、类组件生命周期与 Hooks 对照

| 阶段/需求 | 类组件 | Hooks 等价 |
| --- | --- | --- |
| **挂载后执行一次** | `componentDidMount` | `useEffect(() => { ... }, [])` |
| **某依赖变化后执行** | `componentDidUpdate`（需比较 prevProps/prevState） | `useEffect(() => { ... }, [deps])` |
| **卸载前清理** | `componentWillUnmount` | `useEffect` 的**返回函数**：`return () => { ... }` |
| **错误捕获** | `componentDidCatch` + `getDerivedStateFromError` | 无 Hook 等价，仍用 **Error Boundary** 类组件 |

***

## 三、useEffect 对应关系详解

### 1. 挂载时执行一次（DidMount）

```jsx
// 类组件
componentDidMount() {
  fetchData()
  const id = setInterval(tick, 1000)
  this.timerId = id
}

// Hooks
useEffect(() => {
  fetchData()
  const id = setInterval(tick, 1000)
  return () => clearInterval(id)  // 清理在 return 里
}, [])
```

空依赖 `[]` 表示“仅挂载时执行一次”。

### 2. 依赖变化时执行（DidUpdate）

```jsx
// 类组件
componentDidUpdate(prevProps, prevState) {
  if (prevProps.id !== this.props.id) {
    fetchData(this.props.id)
  }
}

// Hooks
useEffect(() => {
  fetchData(id)
}, [id])
```

依赖数组 `[id]` 表示 id 变化时执行；若需“每次渲染后”执行，可省略依赖数组（不推荐，易造成死循环或性能问题）。

### 3. 卸载时清理（WillUnmount）

```jsx
// 类组件
componentWillUnmount() {
  clearInterval(this.timerId)
  eventSource.close()
}

// Hooks：在 useEffect 的 return 中清理
useEffect(() => {
  const id = setInterval(tick, 1000)
  return () => clearInterval(id)
}, [])
```

**return 的清理函数**在组件卸载或该 effect 下次执行前调用，用于取消订阅、定时器、监听等。

***

## 四、错误边界（无 Hook 替代）

**Error Boundary** 目前必须用**类组件**实现（`componentDidCatch`、`getDerivedStateFromError`），用于捕获子组件树中的 JS 错误并降级 UI。函数组件没有对应 Hook，项目中仍会保留一个类组件做错误边界。

***

## 五、面试答题要点

- **挂载**：类用 `componentDidMount`，Hooks 用 `useEffect(..., [])`。
- **更新**：类用 `componentDidUpdate` 并比较 prevProps/prevState，Hooks 用 `useEffect(..., [deps])`。
- **卸载**：类用 `componentWillUnmount`，Hooks 用 `useEffect` 的 return 清理函数。
- **错误捕获**：无 Hook，继续用类组件的 Error Boundary。
