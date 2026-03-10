# React 状态更新机制

## 一、批量更新（Batching）

**批量更新**指：在一次“逻辑更新流程”中，多次 `setState` 会被合并处理，只触发一次重新渲染，从而避免中间状态多次渲染。

- **React 18**：在 React 自己的事件系统、以及 **setTimeout、Promise、原生事件** 等中，默认都会自动批处理。
- **React 17 及更早**：只在 React 事件处理函数中批处理，在 setTimeout、Promise 回调里会各触发一次渲染。

```js
function handleClick() {
  setA(1)
  setB(2)
  setC(3)
  // React 18：一次渲染，a、b、c 一起更新
}
```

若需要“立即拿到更新后的 DOM”或必须跳出批处理，可用 **flushSync**（慎用，会强制同步提交并可能带来性能问题）。

***

## 二、状态不可变

**setState 应传入“新引用”**（新对象、新数组等），这样 React 才能通过引用比较判断状态是否变化，触发更新并保证依赖该状态的子组件、Hooks 正确执行。

```js
// ❌ 错误：同一引用，React 可能认为未变化
state.list.push(item)
setState(state)

// ✅ 正确：新引用
setState({ ...state, list: [...state.list, item] })
setList(prev => [...prev, item])
```

不可变更新也有利于时间旅行调试、与 Immutable 数据结构配合等。

***

## 三、函数式更新

当新状态**依赖当前状态**时，应使用**函数式更新**，避免闭包拿到过期的 state。

```js
// ❌ 闭包可能拿到旧的 count
setCount(count + 1)

// ✅ 始终基于最新状态
setCount(prev => prev + 1)
```

在事件循环、异步回调、setTimeout 中多次更新同一状态时，函数式更新能保证每次基于最新值计算。

***

## 四、面试答题要点

- **批量更新**：React 18 默认对 setState 做批处理，减少渲染次数；setTimeout/Promise 等也会被批处理。
- **不可变**：用新对象/新数组等新引用更新 state，便于 React 检测变化并正确更新。
- **函数式更新**：`setState(prev => ...)` 在依赖当前状态或连续更新时使用，避免闭包陈旧值。
- **flushSync**：可强制同步提交、跳出批处理，一般仅特殊场景使用。
