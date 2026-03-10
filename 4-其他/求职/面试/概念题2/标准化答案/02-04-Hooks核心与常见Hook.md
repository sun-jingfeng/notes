# Hooks 核心原理与常见 Hook

## 一、Hooks 是什么

**Hooks** 是 React 16.8 起在**函数组件**中使用 state、生命周期等能力的 API。通过 `useState`、`useEffect` 等，函数组件也能拥有状态和副作用，无需再为状态逻辑写类组件。

***

## 二、常见 Hook 及注意点

| Hook | 用途 | 关键注意点 |
| --- | --- | --- |
| **useState** | 声明状态 | 更新是异步批量的；若依赖前一次状态，用函数式更新 `setState(prev => ...)` |
| **useEffect** | 副作用 | 依赖数组决定何时执行；return 清理函数，避免泄漏（订阅、定时器、监听） |
| **useRef** | 持久化引用、DOM 引用 | 改 `.current` 不触发重渲染；跨渲染保持同一引用 |
| **useMemo** | 缓存计算结果 | 依赖未变则返回上次结果，避免重复重算 |
| **useCallback** | 缓存函数引用 | 依赖未变则返回上次函数，常配合 `React.memo` 减少子组件重渲染 |
| **useContext** | 消费 Context | 订阅的 context 值变化会导致所有消费者重渲染，可考虑拆分 Context |
| **useReducer** | 复杂状态逻辑 | 多 action、状态结构复杂时比多个 useState 更清晰 |
| **useLayoutEffect** | 同步 DOM 副作用 | 在浏览器绘制前执行，适合测量/改 DOM；避免在内部做耗时逻辑阻塞绘制 |

***

## 三、Hooks 规则（必须遵守）

1. **只在顶层调用**：不要在循环、条件、嵌套函数里调用 Hook。
2. **只在函数组件或自定义 Hook 里调用**：不在类组件或普通函数里调。

**原因**：React 依赖 **Hook 的调用顺序** 在内部把 state、effect 等与组件实例对应（内部用链表等结构按顺序存储）。若条件调用导致顺序变化，就会错位，产生难以排查的 bug。

```js
// ❌ 错误：条件调用
if (condition) {
  const [a, setA] = useState(0)
}

// ✅ 正确：始终按相同顺序调用
const [a, setA] = useState(0)
if (condition) { /* 使用 a */ }
```

***

## 四、useEffect 依赖与清理

- **空依赖 `[]`**：仅挂载时执行一次；return 的清理函数在卸载时执行。
- **有依赖 `[a, b]`**：a 或 b 变化时重新执行 effect，上次 effect 的 return 会先执行（清理）。
- **无依赖数组**：每次渲染后都执行，一般需避免（易造成性能问题或死循环）。

***

## 五、面试答题要点

- **useState**：异步批量更新；依赖上次状态时用函数式更新。
- **useEffect**：依赖数组控制执行时机；return 清理函数防泄漏。
- **useRef**：不改动不触发渲染；用于 DOM 引用或跨渲染存值。
- **useMemo / useCallback**：缓存值与函数引用，依赖不变则复用；配合 memo 优化子组件。
- **规则**：只在顶层、只在函数组件/自定义 Hook 中调用，保证顺序稳定。
