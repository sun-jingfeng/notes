## 一、createElement 方法原理

### 1.1 JSX 到 createElement

**JSX** 是语法糖，经 Babel 等构建工具编译后，转换为 `React.createElement` 调用（React 17+ 默认使用新的 `jsx` 运行时），最终得到描述 UI 的 **ReactElement 对象**。

| 阶段       | 说明 |
| ---------- | ---- |
| **开发时** | 编写 JSX 标签 |
| **编译后** | 转为 `createElement(type, props, ...children)` 或 `jsx(type, props)` 调用 |
| **运行时** | 返回 ReactElement 对象 `{ type, props, key, ref, ... }` |

```jsx
// JSX 写法
const element = <div className="box"><span>hello</span></div>

// 编译后等价于（经典模式）
const element = React.createElement(
  'div',
  { className: 'box' },
  React.createElement('span', null, 'hello')
)
```

React 17+ 引入了**新的 JSX 转换（jsx runtime）**，不再需要在文件顶部 `import React`，编译器自动注入 `jsx` 函数：

```jsx
// React 17+ 编译后（自动注入 jsx runtime）
import { jsx as _jsx } from 'react/jsx-runtime'

const element = _jsx('div', {
  className: 'box',
  children: _jsx('span', { children: 'hello' })
})
```

| 模式                         | 说明 |
| ---------------------------- | ---- |
| **经典模式（Classic）**      | 编译为 `React.createElement`，需手动 `import React` |
| **新模式（Automatic）**      | 编译为 `jsx()` / `jsxs()`，由编译器自动注入，React 17+ 默认 |

两种模式最终都生成相同结构的 ReactElement 对象，区别仅在编译输出。

### 1.2 模拟实现 createElement

`createElement` 的核心职责：接收 `type`、`config`（属性）和 `children`，返回描述 UI 的普通 JS 对象。

```js
function createElement(type, config, ...children) {
  const props = {}

  // 从 config 中提取 key，其余属性放入 props
  // React 19 之前 ref 也在此提取；React 19 中 ref 对函数组件已变为普通 prop
  let key = null
  let ref = null

  if (config != null) {
    if (config.key !== undefined) key = '' + config.key
    if (config.ref !== undefined) ref = config.ref

    for (const prop in config) {
      if (prop !== 'key' && prop !== 'ref') {
        props[prop] = config[prop]
      }
    }
  }

  // children 处理：单个子元素直接赋值，多个则为数组
  if (children.length === 1) {
    props.children = children[0]
  } else if (children.length > 1) {
    props.children = children
  }

  return { type, props, key, ref }
}
```

```js
// 验证
const element = createElement(
  'div',
  { className: 'box', key: '1' },
  createElement('span', null, 'hello'),
  createElement('span', null, 'world')
)

console.log(element)
// {
//   type: 'div',
//   props: {
//     className: 'box',
//     children: [
//       { type: 'span', props: { children: 'hello' }, key: null, ref: null },
//       { type: 'span', props: { children: 'world' }, key: null, ref: null }
//     ]
//   },
//   key: '1',
//   ref: null
// }
```

| 步骤               | 说明 |
| ------------------ | ---- |
| **提取 key / ref** | 从 `config` 中取出，不放进 `props`——它们是 React 内部使用的特殊属性 |
| **收集普通属性**   | `config` 中除 `key`、`ref` 外的属性复制到 `props` |
| **处理 children**  | 第三个及之后的参数作为 `props.children` |

> 💡 `key` 不属于 `props`，不会传入子组件，供 Diff 算法使用。`ref` 在 React 19 之前也不属于 `props`，需通过 `forwardRef` 转发；**React 19 起 `ref` 变为普通 prop**，函数组件可直接从 `props.ref` 获取，无需 `forwardRef`。

### 1.3 源码核心逻辑

React 源码中 `createElement`（`packages/react/src/ReactElement.js`）的核心流程与模拟实现一致，额外多了以下处理：

| 处理             | 说明 |
| ---------------- | ---- |
| **defaultProps** | 若 `type` 为组件且定义了 `defaultProps`，将其中未传入的属性合并到 `props`（React 19 起仅类组件保留，函数组件已移除该特性） |
| **$$typeof**     | 返回对象中包含 `$$typeof: Symbol.for('react.element')`，用于标识合法的 React 元素，防止 XSS（JSON 中无法包含 Symbol） |
| **_owner**       | 记录创建该元素的 Fiber 节点，供开发环境校验 key 等使用 |

返回值即 **ReactElement**，结构如下：

```js
{
  $$typeof: Symbol.for('react.element'),  // 标识为 React 元素
  type: 'div',                            // 标签名或组件函数/类
  key: null,                              // Diff 用的标识
  ref: null,                              // DOM / 组件实例引用
  props: {                                // 属性与子节点
    className: 'box',
    children: [...]
  },
  _owner: null                            // 创建者 Fiber
}
```

> 💡 ReactElement 只是一个**描述对象**，不是真实 DOM，也不是 Fiber 节点。它是 JSX → Fiber → DOM 这条链路的第一步产物。

***

## 二、Component 源码分析

### 2.1 构造函数

**React.Component** 是类组件的基类，源码（`packages/react/src/ReactBaseClasses.js`）非常简短，构造函数仅挂载四个字段：

```js
function Component(props, context, updater) {
  this.props = props
  this.context = context
  this.refs = {}
  // updater 由渲染器（如 ReactDOM）在实例化组件时注入
  this.updater = updater || defaultUpdater
}
```

| 字段          | 说明 |
| ------------- | ---- |
| **`props`**   | 父组件传入的属性 |
| **`context`** | 上下文数据（Context API） |
| **`refs`**    | 字符串 ref 的集合（React 19 已移除字符串 ref，用 `createRef` / `useRef` / `ref` 回调） |
| **`updater`** | 渲染器注入的更新器对象，`setState` 和 `forceUpdate` 的实际执行者 |

### 2.2 原型方法

`Component.prototype` 上定义了两个关键方法，它们内部都**委托给 `updater`**：

```js
Component.prototype.setState = function (partialState, callback) {
  this.updater.enqueueSetState(this, partialState, callback, 'setState')
}

Component.prototype.forceUpdate = function (callback) {
  this.updater.enqueueForceUpdate(this, callback, 'forceUpdate')
}
```

| 方法              | 说明 |
| ----------------- | ---- |
| **`setState`**    | 将新状态（对象或函数）推入更新队列，由调度器安排后续渲染 |
| **`forceUpdate`** | 跳过 `shouldComponentUpdate` 强制触发重新渲染 |

**核心设计：** Component 自身不处理更新逻辑，只是一个"壳"；真正的更新由 `updater`（渲染器注入）负责。这种设计使 `react` 包与 `react-dom`、`react-native` 等渲染器解耦——同一个 Component 基类可运行在不同平台。

### 2.3 区分类组件与函数组件

React 需要在运行时区分组件类型，因为类组件需要 `new`，函数组件直接调用。源码通过原型上的标记实现：

```js
Component.prototype.isReactComponent = {}
```

| 判断方式               | 说明 |
| ---------------------- | ---- |
| **有 `isReactComponent`** | 类组件，需 `new` 实例化 |
| **无该属性**           | 函数组件，直接调用 |

> 💡 不用 `instanceof` 判断的原因：页面上可能存在多个 React 副本（如 iframe 或 monorepo），`instanceof` 在跨副本时会失败。

### 2.4 PureComponent

**PureComponent** 继承自 Component，区别在于自动实现了 `shouldComponentUpdate`——对 props 和 state 做**浅比较**，值未变时跳过渲染。

```js
function PureComponent(props, context, updater) {
  this.props = props
  this.context = context
  this.refs = {}
  this.updater = updater || defaultUpdater
}

// 继承 Component
PureComponent.prototype = Object.create(Component.prototype)
PureComponent.prototype.constructor = PureComponent

// 标记，供 Reconciler 判断是否做浅比较
PureComponent.prototype.isPureReactComponent = true
```

Reconciler 在更新类组件时，若发现 `isPureReactComponent` 为 `true`，会自动对 `oldProps` / `newProps` 和 `oldState` / `newState` 做浅比较（`shallowEqual`），相同则跳过渲染。

| 对比项                       | Component                        | PureComponent                  |
| ---------------------------- | -------------------------------- | ------------------------------ |
| **shouldComponentUpdate**    | 默认返回 `true`，每次都重渲染   | 自动浅比较 props 和 state      |
| **适用**                     | 需要自定义更新逻辑               | props / state 为简单值或引用稳定的对象 |
| **函数组件等价**             | 无                               | `React.memo`                   |

> **注意**：浅比较只比较第一层引用，嵌套对象内部属性变化不会被感知。若 props 中有对象/数组且内容变化但引用不变，PureComponent 会错误地跳过渲染。

***

## 三、虚拟 DOM 与 Diff 算法

### 3.1 虚拟 DOM

**虚拟 DOM（Virtual DOM）** 是用 JavaScript 对象描述的 DOM 树结构，是真实 DOM 的一层抽象。React 中的虚拟 DOM 即 `createElement` 返回的 **ReactElement 对象树**。

| 项目     | 说明 |
| -------- | ---- |
| **本质** | 描述节点类型、属性、子节点的 JS 对象（ReactElement） |
| **作用** | 在内存中对比新旧两棵树（Diff），计算出最小变更集，再批量更新真实 DOM |

**为什么不直接操作 DOM：**

| 对比项       | 直接操作 DOM                             | 虚拟 DOM                         |
| ------------ | ---------------------------------------- | -------------------------------- |
| **更新方式** | 手动查找节点并修改，多次操作多次触发重排重绘 | 先在内存中 Diff，再一次性提交变更 |
| **开发体验** | 命令式，需手动管理 DOM 状态              | 声明式，只描述"UI 应该长什么样"  |
| **跨平台**   | 依赖浏览器 DOM API                       | 同一套描述可渲染到 DOM、Native、Canvas 等 |

> 💡 虚拟 DOM 的核心价值不是"比直接操作 DOM 快"，而是提供了**声明式编程模型**和**跨平台抽象**。在某些极简场景下，直接操作 DOM 反而更快。

### 3.2 Diff 策略

传统树 Diff 的时间复杂度为 O(n³)，React 基于**三条假设**将其优化为 O(n)：

| 策略               | 假设                         | 做法 |
| ------------------ | ---------------------------- | ---- |
| **Tree Diff**      | 跨层级移动节点的情况极少     | 只对同一层级节点做比较，不跨层递归 |
| **Component Diff** | 相同类型的组件生成相似的树   | 类型相同 → 递归子节点；类型不同 → 整棵子树销毁重建 |
| **Element Diff**   | 同一层级的子元素可通过 key 区分 | 有 key → 按 key 匹配复用；无 key → 按位置逐个比较 |

```
    旧树                新树
        A                   A        ← 同层比较：A 类型相同，复用
       / \                 / \
      B   C               B   D     ← 同层比较：B 复用，C→D 类型不同，销毁 C 子树重建 D
     /                   / \
    E                   E   F       ← B 的子节点同层比较
```

### 3.3 单节点 Diff

当新的子节点为**单个元素**时，React 遍历旧的同级 Fiber 节点，按以下规则决定复用或新建：

```
遍历旧 Fiber 链表中的每个节点：
    ├── key 相同？
    │     ├── type 也相同 → ✅ 复用该 Fiber，删除剩余旧节点
    │     └── type 不同  → ❌ 删除该旧节点及所有剩余旧节点，新建 Fiber
    └── key 不同？
          └── ❌ 删除该旧节点，继续遍历下一个
```

| 条件                     | 结果 |
| ------------------------ | ---- |
| **key 相同 + type 相同** | 复用 Fiber 节点，更新 props |
| **key 相同 + type 不同** | 无法复用，删除所有旧节点，新建 |
| **key 不同**             | 当前旧节点不匹配，标记删除，继续查找 |

> 💡 未指定 `key` 时默认为 `null`，两个 `null` 被视为 key 相同。

### 3.4 多节点 Diff

当新的子节点为**多个元素（数组）**时，React 采用**两轮遍历**：

**第一轮：按位置逐个比较，处理更新**

```
同时遍历新旧两个列表（按索引 i）：
    ├── key 相同 + type 相同 → 复用，i++
    ├── key 相同 + type 不同 → 复用位置但新建节点，i++
    └── key 不同 → 跳出第一轮
```

**第二轮：处理新增、删除、移动**

第一轮结束后，可能出现三种情况：

| 情况                             | 处理 |
| -------------------------------- | ---- |
| **新列表遍历完，旧列表有剩余** | 剩余旧节点全部标记**删除** |
| **旧列表遍历完，新列表有剩余** | 剩余新节点全部标记**新增** |
| **新旧均有剩余**                 | 将剩余旧节点放入以 key 为键的 **Map**，遍历剩余新节点在 Map 中查找可复用节点，处理**移动** |

移动判断依据 **lastPlacedIndex**（已复用的旧节点中最大的索引）：若当前旧节点的索引 < lastPlacedIndex，说明它需要向右移动。

```
旧: A(0) B(1) C(2) D(3)
新: A    C    D    B

第一轮：A key 匹配，复用（lastPlacedIndex = 0）
        C key 不匹配 B → 跳出

第二轮：剩余旧 {B:1, C:2, D:3}，剩余新 [C, D, B]
  - C → Map 中找到(oldIndex=2)，2 > 0 → 不移动，lastPlacedIndex = 2
  - D → Map 中找到(oldIndex=3)，3 > 2 → 不移动，lastPlacedIndex = 3
  - B → Map 中找到(oldIndex=1)，1 < 3 → 标记移动
```

> 💡 这就是为什么要为列表项提供**稳定的 key**：有 key 时 React 能精确匹配并复用节点，避免不必要的销毁和重建。用 `index` 做 key 在列表增删或排序时会导致复用错误的节点，引发状态错位。

***

## 四、Fiber 架构与渲染流程

### 4.1 渲染入口

React 18 的渲染入口为 `createRoot`，取代了 React 17 及之前的 `ReactDOM.render`：

```jsx
// React 18+（推荐）
import { createRoot } from 'react-dom/client'
const root = createRoot(document.getElementById('root'))
root.render(<App />)

// React 17 及之前（React 18 废弃，React 19 已移除）
import ReactDOM from 'react-dom'
ReactDOM.render(<App />, document.getElementById('root'))
```

`createRoot` 内部做了三件事：

| 步骤                 | 说明 |
| -------------------- | ---- |
| **创建 FiberRoot**   | 整个应用的根对象，持有 DOM 容器节点和 Fiber 树的引用 |
| **创建 RootFiber**   | Fiber 树的根节点，与 FiberRoot 互相引用 |
| **返回 ReactDOMRoot** | 暴露 `render` 和 `unmount` 方法的对象 |

调用 `root.render(<App />)` 后触发首次渲染，进入**协调（Reconciliation）→ 提交（Commit）** 两阶段流程。

### 4.2 FiberRoot 与 RootFiber

| 对象           | 说明 |
| -------------- | ---- |
| **FiberRoot**  | `createRoot` 创建的根对象，整个应用**唯一**。持有 `containerInfo`（DOM 容器）、`current`（指向当前 Fiber 树的根节点）、`pendingLanes`（待处理的优先级）等 |
| **RootFiber**  | Fiber 树的**根节点**（`tag` 为 `HostRoot`），是所有组件 Fiber 的起点。`stateNode` 指回 FiberRoot |

```
FiberRoot（整个应用唯一）
│
├── containerInfo → <div id="root">（DOM 容器）
├── current ──────→ RootFiber（当前屏 Fiber 树的根）
│                     │
│                     ├── stateNode → FiberRoot（互相引用）
│                     └── child → <App /> 对应的 Fiber
│
└── finishedWork → 构建完成的新 Fiber 树根（待提交）
```

### 4.3 Fiber 节点结构

每个 **Fiber 节点**是一个 JS 对象，描述一个组件或 DOM 元素，是 React 调和过程的**最小工作单元**。

```js
{
  // ===== 节点身份 =====
  tag,              // 节点类型（FunctionComponent=0, ClassComponent=1, HostComponent=5 等）
  type,             // 组件函数/类 或 DOM 标签名（如 'div'）
  key,              // Diff 用的标识

  // ===== 树结构（链表） =====
  child,            // 第一个子节点
  sibling,          // 下一个兄弟节点
  return,           // 父节点

  // ===== 状态与副作用 =====
  stateNode,        // 类组件实例 / DOM 节点 / FiberRoot
  pendingProps,     // 本次渲染待处理的 props
  memoizedProps,    // 上次渲染的 props
  memoizedState,    // 上次渲染的 state（函数组件中为 Hooks 链表头节点）
  updateQueue,      // 更新队列（setState 产生的更新）

  // ===== 副作用 =====
  flags,            // 副作用标记（Placement、Update、Deletion 等）
  subtreeFlags,     // 子树中是否存在副作用（优化：无副作用则跳过）

  // ===== 双缓冲 =====
  alternate,        // 指向另一棵树中对应的 Fiber（current ↔ workInProgress）

  // ===== 调度 =====
  lanes,            // 该节点的优先级
  childLanes        // 子树中的优先级
}
```

| 关键字段                               | 说明 |
| -------------------------------------- | ---- |
| **`child` / `sibling` / `return`**     | 构成链表树结构，替代传统的 children 数组，便于中断和恢复遍历 |
| **`alternate`**                        | 指向双缓冲中另一棵树的对应节点 |
| **`flags`**                            | 标记该节点在 Commit 阶段需要执行的 DOM 操作 |
| **`memoizedState`**                    | 函数组件中为 Hooks 链表的头节点；类组件中为 `this.state` |

### 4.4 Fiber 树结构与遍历

Fiber 不使用传统的 `children` 数组，而是通过 **child → sibling → return** 三个指针组成链表树：

```
        App (RootFiber.child)
         │
         ├── child
         ↓
       Header ──sibling──→ Main ──sibling──→ Footer
         │                   │
         ├── child           ├── child
         ↓                   ↓
        Logo               Content
```

| 指针        | 含义 |
| ----------- | ---- |
| **child**   | 指向第一个子节点 |
| **sibling** | 指向下一个兄弟节点 |
| **return**  | 指向父节点 |

Fiber 树的深度优先遍历（**工作循环**）：从 RootFiber 开始，沿 `child` 向下进入子节点（`beginWork`），到达叶子节点后执行 `completeWork`，再沿 `sibling` 进入兄弟节点，兄弟处理完后沿 `return` 回到父节点。这种遍历方式天然支持**中断与恢复**——记录当前处理到哪个 Fiber 节点，下次从该节点继续即可。

| 阶段               | 说明 |
| ------------------ | ---- |
| **`beginWork`**    | "递"阶段——根据新 ReactElement 和旧 Fiber 做 Diff，创建或复用子 Fiber 节点，标记 `flags` |
| **`completeWork`** | "归"阶段——为该节点创建或更新真实 DOM 实例（但不挂载到页面），收集子树的副作用标记到 `subtreeFlags`，构建离屏 DOM 树的层级关系 |

### 4.5 双缓冲机制

React 在内存中同时维护两棵 Fiber 树：

| Fiber 树                 | 说明 |
| ------------------------ | ---- |
| **current 树**           | 当前屏幕上正在显示的 UI 对应的 Fiber 树 |
| **workInProgress 树**    | 正在构建中的新 Fiber 树，构建完成后在 Commit 阶段替换 current |

两棵树中对应的 Fiber 节点通过 `alternate` 字段互相引用。更新时 React 基于 current 树构建 workInProgress 树（尽可能复用节点），构建完成后一次性切换指针（`FiberRoot.current = workInProgress`），原先的 workInProgress 变成新的 current，原 current 变成下次更新的 workInProgress 基础。

```
FiberRoot.current ──→ current 树（屏幕显示）
                        ↕ alternate
                      workInProgress 树（后台构建中）

Commit 完成后：
FiberRoot.current ──→ 原 workInProgress 树（变为新的 current）
```

> 💡 双缓冲避免了构建过程中 UI 出现不一致的中间状态，确保用户看到的始终是完整的一帧。

***

## 五、任务调度

### 5.1 为什么需要调度

浏览器主线程负责 JS 执行、样式计算、布局、绘制等，若一次更新耗时过长（如大组件树的 Diff），会阻塞主线程导致**页面卡顿、交互无响应**。

React 16 之前的 **Stack Reconciler** 一旦开始协调就无法中断，必须递归完整棵树。**Fiber 架构**将协调过程拆成一个个小的工作单元（Fiber 节点），配合 **Scheduler（调度器）** 在浏览器每帧的空闲时间中执行，必要时**让出主线程**给高优先级任务（如用户输入、动画）。

| 对比项       | Stack Reconciler（React 15-） | Fiber Reconciler（React 16+） |
| ------------ | ----------------------------- | ----------------------------- |
| **执行方式** | 递归，整树一口气跑完          | 链表，可分段执行              |
| **可中断**   | 否                            | 是                            |
| **优先级**   | 无，所有更新同等对待          | 有，高优先级可打断低优先级    |
| **用户体验** | 大更新时可能卡顿              | 保持流畅交互                  |

### 5.2 时间切片

**时间切片（Time Slicing）** 是调度器的核心机制：将一段连续的工作拆成多个 **5ms** 的小段，每段结束后检查是否有更高优先级任务或是否需要让出主线程。

```
一帧（约 16.6ms @ 60fps）
├── 输入事件处理
├── JS 执行 ← React 在此执行一个时间切片（≤5ms）
├── requestAnimationFrame
├── 布局 & 绘制
└── 空闲时间 ← 若有剩余，继续下一个切片
```

调度器使用 **`MessageChannel`** 实现异步调度（非 `requestIdleCallback`，因后者触发频率不稳定且在后台标签页中不执行）。每个时间切片内处理尽可能多的 Fiber 节点，到时间后主动让出，下一帧继续。

工作循环的核心代码：

```js
// 并发模式——每处理完一个 Fiber 节点都检查是否需要让出主线程
function workLoopConcurrent() {
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress)
  }
}

// 同步模式——不检查 shouldYield，一口气跑完
function workLoopSync() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress)
  }
}
```

| 函数                       | 说明 |
| -------------------------- | ---- |
| **`workLoopConcurrent`**   | 并发工作循环，每个 Fiber 节点处理完后调用 `shouldYield()` 检查时间片是否用尽 |
| **`shouldYield`**          | 判断当前切片已执行时间是否 ≥ 5ms，是则返回 `true`，循环让出主线程 |
| **`performUnitOfWork`**    | 对当前 Fiber 执行 `beginWork`，处理完后移动到下一个 Fiber（child → sibling → return） |
| **`workLoopSync`**         | 同步工作循环，`flushSync` 或首屏渲染等同步优先级使用，不可中断 |

### 5.3 优先级机制

React 18 使用 **Lanes（车道）模型** 管理优先级，每个更新被分配到一个 lane，越紧急的更新占越高位的 lane：

| 优先级                   | 来源                               | 说明 |
| ------------------------ | ---------------------------------- | ---- |
| **SyncLane**             | `flushSync`                        | 同步执行，最高优先级 |
| **InputContinuousLane**  | 连续输入（拖拽、滚动）             | 高优先级，需及时响应 |
| **DefaultLane**          | `setState`、`useReducer`           | 普通更新 |
| **TransitionLane**       | `startTransition`、`useTransition`、`useDeferredValue` | 过渡更新，可被高优先级打断 |
| **IdleLane**             | offscreen 等内部场景               | 最低优先级，空闲时执行 |

```jsx
import { startTransition } from 'react'

function handleSearch(keyword) {
  // 高优先级：立即更新输入框
  setInput(keyword)

  // 低优先级：搜索结果可以延迟渲染
  startTransition(() => {
    setSearchResults(filterData(keyword))
  })
}
```

### 5.4 渲染两阶段

React 的一次更新分为**协调（Render）** 和**提交（Commit）** 两个阶段：

| 阶段               | 说明 | 可中断 |
| ------------------ | ---- | ------ |
| **Render（协调）** | 遍历 Fiber 树，调用组件的 render / 函数体，对比新旧 Fiber 计算出变更，标记 `flags` | **可中断** |
| **Commit（提交）** | 根据 `flags` 执行真实 DOM 操作（增删改），调用 `useLayoutEffect` 和 `useEffect` | **不可中断** |

```
  setState / startTransition
           ↓
  ┌────────────────────────────────────────────┐
  │  Render 阶段（可中断、可恢复）               │
  │                                              │
  │    构建 workInProgress 树                     │
  │    对每个 Fiber 执行 beginWork / completeWork │
  │    标记需要变更的 Fiber（flags）              │
  └──────────────────┬─────────────────────────┘
                     ↓
  ┌────────────────────────────────────────────┐
  │  Commit 阶段（同步、不可中断）               │
  │                                              │
  │    Before Mutation：读取 DOM 快照             │
  │    Mutation：执行 DOM 增删改                  │
  │    Layout：切换 current 树，执行 useLayoutEffect │
  │    之后异步执行 useEffect                     │
  └────────────────────────────────────────────┘
```

Commit 阶段的三个子阶段：

| 子阶段              | 说明 |
| ------------------- | ---- |
| **Before Mutation** | DOM 变更前，可读取更新前的 DOM（如 `getSnapshotBeforeUpdate`） |
| **Mutation**        | 执行真实 DOM 的增删改操作 |
| **Layout**          | DOM 已更新但浏览器尚未绘制，执行 `useLayoutEffect`，切换 `FiberRoot.current` 到新树 |

> 💡 `useEffect` 在 Commit 完成后**异步**执行，不阻塞浏览器绘制；`useLayoutEffect` 在 Layout 子阶段**同步**执行，会阻塞绘制。

***

## 六、Hooks 实现原理

### 6.1 Hooks 与 Fiber 的关系

函数组件每次渲染就是一次函数调用，本身没有实例来存储状态。Hooks 的状态实际存储在对应的 **Fiber 节点**上——`fiber.memoizedState` 指向一条 **Hooks 链表**，每个 Hook 调用对应链表中的一个节点。

```
Fiber 节点
│
├── memoizedState ──→ Hook1 ──→ Hook2 ──→ Hook3 ──→ null
│                    (useState) (useEffect) (useMemo)
```

每个 Hook 节点的结构：

```js
{
  memoizedState,   // 该 Hook 存储的值（不同 Hook 类型含义不同）
  baseState,       // 基础状态（用于更新计算）
  baseQueue,       // 未处理完的更新队列
  queue,           // 更新队列（useState / useReducer）
  next             // 指向下一个 Hook 节点
}
```

| Hook 类型        | `memoizedState` 存储的内容 |
| ---------------- | ---- |
| **useState**     | 当前 state 值 |
| **useReducer**   | 当前 state 值 |
| **useEffect**    | Effect 对象（`{ create, destroy, deps, ... }`） |
| **useRef**       | `{ current: value }` 对象 |
| **useMemo**      | `[计算结果, deps]` |
| **useCallback**  | `[回调函数, deps]` |

### 6.2 Mount 与 Update 两套实现

React 内部为 Hooks 维护了两套 Dispatcher，分别用于**首次渲染（mount）**和**后续更新（update）**：

| 阶段       | Dispatcher | 行为 |
| ---------- | ---------- | ---- |
| **Mount**  | `HooksDispatcherOnMount` | 创建 Hook 节点并追加到链表尾部，初始化状态 |
| **Update** | `HooksDispatcherOnUpdate` | 按顺序遍历已有链表，读取 / 更新对应 Hook 的状态 |

组件渲染时，React 根据当前 Fiber 是否已有 `alternate`（即是否为首次渲染）选择对应的 Dispatcher。组件函数执行完毕后，切换为一个**会抛出错误的 Dispatcher**，防止在组件外部调用 Hook。

### 6.3 Rules of Hooks 的底层原因

"Hooks 必须在组件顶层调用、不能放在条件 / 循环中"——根本原因是 **Hooks 链表按调用顺序构建和遍历，没有 name 或 key 作为标识**。

```jsx
// ❌ 条件语句导致 Hook 数量不一致
function Demo({ flag }) {
  const [a, setA] = useState(0)
  if (flag) {
    const [b, setB] = useState(0)   // 条件调用
  }
  const [c, setC] = useState(0)
}

// Mount 时 flag=true：链表 → Hook(a) → Hook(b) → Hook(c)
// Update 时 flag=false：代码只调了两个 Hook，但链表仍有三个节点
//   第二次 useState 读到了 Hook(b) 的值 → 赋给了 c —— 状态错位
```

| 规则                                   | 原因 |
| -------------------------------------- | ---- |
| **顶层调用**                           | 保证每次渲染 Hook 调用顺序和数量一致，链表遍历能正确匹配 |
| **只在函数组件 / 自定义 Hook 中调用** | Hooks 依赖 Fiber 节点存储状态，普通函数没有 Fiber |

### 6.4 useState 的更新流程

`useState` 返回的 setter 实际上是一个绑定了该 Hook 更新队列的 `dispatchSetState` 函数。

```
setter(newValue)
    ↓
创建 Update 对象 { action: newValue, lane, next }
    ↓
将 Update 加入该 Hook 的环形更新队列（queue.pending）
    ↓
调度一次更新（scheduleUpdateOnFiber）
    ↓
下次渲染时，Reconciler 遍历更新队列计算新 state
```

React 18 在计算新 state 时支持 **eagerState 优化**：若组件当前没有其他待处理更新，`dispatchSetState` 会立即计算新值，若与当前值相同（`Object.is`），则**跳过调度**，不触发渲染。

### 6.5 useEffect 的执行时机

`useEffect` 的 Effect 对象在 Render 阶段被收集，在 Commit 阶段结束后**异步**执行：

| 时机        | 说明 |
| ----------- | ---- |
| **Mount**   | Commit 后异步调用 `create` 函数 |
| **Update**  | Commit 后先异步调用上一次的 `destroy`（清理函数），再调用新的 `create` |
| **Unmount** | 调用最后一次的 `destroy` |

deps 比较使用 `Object.is` 逐项对比（浅比较）：

```js
// React 内部 deps 比较逻辑（简化）
function areHookInputsEqual(nextDeps, prevDeps) {
  for (let i = 0; i < prevDeps.length; i++) {
    if (Object.is(nextDeps[i], prevDeps[i])) continue
    return false
  }
  return true
}
```

***

## 七、合成事件系统

### 7.1 什么是合成事件

**合成事件（SyntheticEvent）** 是 React 对原生 DOM 事件的封装，提供跨浏览器一致的事件接口。JSX 中绑定的 `onClick`、`onChange` 等都是合成事件，不是直接绑定在目标 DOM 元素上的原生监听。

| 项目         | 说明 |
| ------------ | ---- |
| **本质**     | 对原生事件的包装对象，实现了与原生 Event 相同的接口（`stopPropagation`、`preventDefault` 等） |
| **跨浏览器** | 磨平不同浏览器的事件差异 |
| **事件委托** | 所有事件统一委托到根容器节点（同时注册 capture 和 bubble 两阶段监听），而非绑在各个 DOM 元素上 |

> 💡 React 16 及之前使用**事件池（Event Pooling）**——合成事件对象在回调执行完后被回收复用，异步访问属性会得到 `null`，需调用 `e.persist()` 保留。**React 17 已移除事件池机制**，合成事件对象不再被回收，可正常在异步中访问。

### 7.2 事件委托机制

React 17+ 将所有事件监听器注册在 `createRoot` 挂载的**根 DOM 容器**上（而非 `document`），同时注册 **capture** 和 **bubble** 两阶段的原生监听器，在内部模拟完整的事件传播链。

```
React 16-                           React 17+

document  ← 事件绑定在此            <div id="root">  ← 事件绑定在此
  └── <div id="root">                 └── <App>
        └── <App>                           └── <button onClick={fn}>
              └── <button onClick={fn}>
```

| 对比项               | React 16-                          | React 17+                    |
| -------------------- | ---------------------------------- | ---------------------------- |
| **事件绑定位置**     | `document`                         | `createRoot` 的容器节点      |
| **多 React 实例共存** | 可能冲突（都绑在 `document`）     | 各自隔离（绑在各自容器上）   |

事件触发流程：

```
用户点击 <button>
    ↓
原生事件传播到根容器（capture 阶段 或 bubble 阶段均会触发）
    ↓
React 根据 event.target 找到对应的 Fiber 节点
    ↓
沿 Fiber 树向上收集路径上所有匹配的事件处理函数（onClickCapture 和 onClick）
    ↓
创建 SyntheticEvent，模拟完整的 捕获 → 目标 → 冒泡 传播链，依次调用处理函数
```

### 7.3 合成事件与原生事件的执行顺序

由于合成事件依赖冒泡到根容器才触发，与直接绑定在 DOM 上的原生事件存在**执行顺序差异**：

```jsx
function Demo() {
  const ref = useRef(null)

  useEffect(() => {
    ref.current.addEventListener('click', () => {
      console.log('原生事件')      // 原生事件：直接绑在 DOM 元素上
    })
  }, [])

  return (
    <button ref={ref} onClick={() => console.log('合成事件')}>
      click
    </button>
  )
}

// 点击输出顺序：
// 1. "原生事件"     ← 原生事件在目标元素上立即触发
// 2. "合成事件"     ← 事件冒泡到根容器后 React 才分发
```

| 顺序   | 事件类型   | 原因 |
| ------ | ---------- | ---- |
| **先** | 原生事件   | 直接绑定在目标 DOM 上，事件到达目标时立即触发 |
| **后** | 合成事件   | 需要冒泡到根容器，React 再沿 Fiber 树模拟传播链分发 |

> 💡 在原生事件中调用 `e.stopPropagation()` 会阻止冒泡到根容器，导致对应的合成事件不触发。

***

## 八、状态更新与批处理

### 8.1 更新流程概览

无论是 `setState`（类组件）还是 `useState` 的 setter（函数组件），触发更新后都进入相同的调度流程：

```
setState / setter 调用
    ↓
创建 Update 对象，加入对应 Fiber 的更新队列
    ↓
从触发更新的 Fiber 向上冒泡到 FiberRoot，标记沿途 Fiber 的 childLanes
    ↓
scheduleUpdateOnFiber → ensureRootIsScheduled
    ↓
Scheduler 根据优先级决定何时开始 Render
    ↓
Render 阶段：遍历 Fiber 树，处理更新队列计算新状态，Diff 生成变更标记
    ↓
Commit 阶段：将变更应用到真实 DOM
```

### 8.2 批处理

**批处理（Batching）** 指 React 将多个状态更新合并为一次渲染，避免不必要的重复计算和 DOM 操作。

```jsx
function handleClick() {
  setCount(c => c + 1)      // 不会立即渲染
  setFlag(f => !f)          // 不会立即渲染
  setName('test')           // 不会立即渲染
  // 三次更新合并为一次渲染
}
```

**React 18 引入自动批处理（Automatic Batching）**——所有更新默认批处理，无论触发上下文：

| 场景             | React 17-                | React 18+    |
| ---------------- | ------------------------ | ------------ |
| **事件处理函数** | ✅ 批处理                | ✅ 批处理    |
| **setTimeout**   | ❌ 每次 setState 都渲染  | ✅ 批处理    |
| **Promise.then** | ❌ 每次 setState 都渲染  | ✅ 批处理    |
| **原生事件**     | ❌ 每次 setState 都渲染  | ✅ 批处理    |

React 17 的批处理依赖同步的执行上下文标记（`executionContext`）判断是否正在批处理中，异步回调执行时标记已被清除，因此不会批处理。React 18 改为基于**优先级和调度队列**实现，不再依赖同步上下文。

若确实需要某次更新**立即同步执行**（如需要在更新后立即读取 DOM），可用 `flushSync`：

```jsx
import { flushSync } from 'react-dom'

function handleClick() {
  flushSync(() => {
    setCount(c => c + 1)
  })
  // 此处 DOM 已更新

  flushSync(() => {
    setFlag(f => !f)
  })
  // 此处 DOM 再次更新
}
```

### 8.3 更新队列的计算

Fiber 节点的 `updateQueue` 是一个环形链表，Render 阶段遍历队列中的所有 Update，依次计算出最终状态：

```
Update { action: 1 } → Update { action: n => n + 1 } → Update { action: 5 }

baseState = 0
  → 处理 action: 1           → state = 1
  → 处理 action: n => n + 1  → state = 2
  → 处理 action: 5           → state = 5（直接值覆盖）
```

| `setState` 参数类型                   | 计算方式 |
| ------------------------------------- | ---- |
| **值**（如 `setState(5)`）           | 直接替换：`newState = action` |
| **函数**（如 `setState(n => n + 1)`） | 基于前值计算：`newState = action(prevState)` |

> 💡 连续调用 `setState(count + 1)` 多次只会 +1，因为每次取的都是同一个闭包中的 `count`。用函数式 `setState(c => c + 1)` 可以正确累加，因为每次都基于前一次的计算结果。

***

## 九、React 与 Vue 更新机制对比

### 9.1 三棵"树"的关系

React 更新过程涉及三种树形数据结构：

| 树 | 本质 | 生命周期 | 包含组件节点 |
| -- | ---- | -------- | ------------ |
| **ReactElement 树（虚拟 DOM）** | `createElement` / JSX 返回的描述对象 | 每次渲染**全新创建**，用完即弃 | 有 |
| **Fiber 树** | React 内部持久化的工作树，存储状态、更新队列、副作用标记等 | **常驻内存**，同时维护两棵（双缓冲） | 有 |
| **真实 DOM 树** | 浏览器渲染引擎维护的 DOM 节点 | 持久化 | **无**——组件不是 DOM 元素 |

```
ReactElement 树              Fiber 树                     真实 DOM 树
（临时蓝图）                 （React 持久维护）           （浏览器维护）

App                          Fiber(App)
└── div                      └── Fiber(div)               <div>
    ├── Header                   ├── Fiber(Header)         ├── <h1>标题</h1>
    │   └── h1                   │   └── Fiber(h1)         └── <p>内容</p>
    └── Main                     └── Fiber(Main)
        └── p                        └── Fiber(p)
```

Fiber 树是真实 DOM 树的**超集**（多出函数组件、类组件等非 DOM 节点）。ReactElement 树是 Fiber 树的**蓝图**——组件函数执行时生成，React 拿它和旧 Fiber 做 Diff 来构建新 Fiber，用完就丢。

### 9.2 React 更新流程

```
setState 触发
    ↓
重新执行组件函数 → 生成新 ReactElement 树（临时）
    ↓
Render 阶段：新 ReactElement vs 旧 current Fiber 做 Diff
    → 边 Diff 边构建 workInProgress Fiber 树，标记 flags
    （不操作真实 DOM，可中断）
    ↓
Commit 阶段：遍历 flags，批量操作真实 DOM（不可中断）
    ↓
指针切换：workInProgress 变为新的 current
```

| 要点 | 说明 |
| ---- | ---- |
| **Diff 的双方** | 新 ReactElement vs 旧 Fiber（不是两棵 Fiber 互相比） |
| **新 Fiber 树** | 不是先生成再比较，而是 Diff 过程中**一边比一边建** |
| **DOM 操作时机** | Render 和 Commit **分离**——先在内存中算好所有变更，再一次性提交 |

### 9.3 Vue 更新流程

```
响应式数据变化（Proxy 拦截 set）
    ↓
自动通知依赖该数据的组件
    ↓
重新执行组件 render → 生成新 VNode 树
    ↓
新 VNode vs 旧 VNode 做 Diff（patch）
    → 边 Diff 边直接操作真实 DOM
    ↓
新 VNode 替换旧 VNode 引用
```

| 要点 | 说明 |
| ---- | ---- |
| **Diff 的双方** | 新 VNode vs 旧 VNode（两棵 VNode 树互相比） |
| **DOM 操作时机** | Diff 和 DOM 操作**同步进行**——比到哪改到哪 |
| **VNode 持久化** | 只保留一棵，新的替换旧的（不像 React 双缓冲） |

### 9.4 响应式模型对比

| 对比项 | React | Vue |
| ------ | ----- | --- |
| **触发方式** | 必须显式调用 `setState` / setter | 直接赋值，Proxy 自动拦截 |
| **依赖追踪** | 无——每次渲染重新执行整个组件函数 | 自动收集：记录哪个组件 / effect 依赖了哪个响应式变量 |
| **更新范围** | 组件级——`setState` 触发整个组件函数重跑，子组件默认也重跑 | 精确到依赖该数据的组件，未依赖的组件不会重渲染 |
| **手动优化** | `React.memo`、`useMemo`、`useCallback` 避免子组件无效重渲染 | 大多数场景无需手动优化 |
| **数据哲学** | 不可变——每次返回新对象 / 新数组 | 可变——就地修改响应式对象 |

```jsx
// React：必须显式调用 setter，返回新引用
const [list, setList] = useState([1, 2, 3])
setList([...list, 4])   // 新数组替换旧数组
```

```js
// Vue：直接修改，Proxy 自动感知
const list = ref([1, 2, 3])
list.value.push(4)       // 就地修改，自动触发更新
```

### 9.5 Diff 算法对比

React 和 Vue 的 Diff 都基于**同层比较 + key 匹配**的策略，但在子节点列表的处理上有差异：

| 对比项 | React | Vue |
| ------ | ----- | --- |
| **子节点 Diff** | 两轮遍历——第一轮按位置顺序比较，第二轮用 key Map 处理剩余节点 | **双端比较**——头头、尾尾、头尾、尾头四种交叉比对（Vue 2）；最长递增子序列算法（Vue 3） |
| **移动判断** | `lastPlacedIndex`——旧节点索引 < 已处理最大索引则标记移动 | Vue 3 通过最长递增子序列计算最少移动次数 |
| **Diff 产物** | 构建新 Fiber 树 + flags 标记，**不立即操作 DOM** | **边 Diff 边 patch**，直接操作 DOM |

Vue 3 的编译时优化使 Diff 可以跳过大量静态内容：

| Vue 3 编译优化 | 说明 |
| -------------- | ---- |
| **静态提升（Static Hoisting）** | 静态节点的 VNode 只创建一次，后续渲染直接复用，Diff 时跳过 |
| **PatchFlag** | 编译时标记动态节点的变化类型（文本 / class / style 等），Diff 时只比较标记的部分 |
| **Block Tree** | 将动态节点收集到 Block 数组中，Diff 时直接遍历动态节点，跳过静态结构 |

React 没有类似的编译时优化，每次 Diff 需要完整遍历子树（通过 `bailout` 和 `React.memo` 可跳过无变化的子树，但需手动配合）。

### 9.6 更新粒度与 DOM 操作对比

| 对比项 | React | Vue |
| ------ | ----- | --- |
| **定位需要更新的组件** | `lanes` / `childLanes` 沿 Fiber 树定位，无更新的子树走 bailout 跳过 | 响应式依赖追踪自动精确定位 |
| **组件内部更新** | 整个组件函数重新执行，所有 JSX 重新生成，靠 Diff 兜底 | 只有依赖变化数据的部分触发 patch |
| **DOM 操作策略** | Render 阶段只标记 flags，Commit 阶段**批量**操作 DOM | Diff 过程中**逐个**操作 DOM |
| **可中断** | Render 阶段可中断（时间切片），适合大型组件树 | 不可中断，但更新范围小，通常不需要 |

> 💡 React 的核心策略是 **"组件级定位 + 全量重执行 + Diff 兜底 + 批量提交"**，通过 Fiber 架构和时间切片保证大型应用的流畅性。Vue 的核心策略是 **"变量级依赖追踪 + 编译时优化 + 边比边改"**，通过精确更新将运行时工作量降到最低。两者殊途同归，都能高效更新 UI。
