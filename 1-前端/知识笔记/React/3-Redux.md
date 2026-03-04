## 一、Redux 概述

### 1.1 什么是 Redux

**Redux** 是 React 生态中最成熟、应用最广泛的集中状态管理库之一，可独立于框架使用。近年 **Zustand**、**Jotai** 等轻量方案也逐渐流行，但 Redux（特别是 RTK）在大型项目和团队协作中仍占主导地位。

| 项目         | 说明                                                     |
| ------------ | -------------------------------------------------------- |
| **作用**     | 用单一 store 集中管理应用状态，数据流可预测              |
| **特点**     | 不与具体框架绑定，可不依赖构建工具单独使用               |
| **适用场景** | 多组件共享状态、状态更新逻辑复杂、需要可追溯的变更记录时 |

### 1.2 核心概念与数据流

为职责清晰、数据流向明确，Redux 将数据修改流程抽象为三个概念：

| 概念        | 类型 | 说明                                                                                                                    |
| ----------- | ---- | ----------------------------------------------------------------------------------------------------------------------- |
| **state**   | 对象 | 存放被集中管理的数据，只读，不可直接修改                                                                                |
| **action**  | 对象 | 描述"要怎样改数据"，通常含 `type`（必填）与 `payload`（可选）                                                           |
| **reducer** | 函数 | 根据当前 state 和 action 计算出新 state，必须为**纯函数**（无副作用：不发请求、不改外部变量，相同输入始终返回相同输出） |

**Action Creator**：返回 action 对象的函数，便于复用与传参。RTK 的 `createSlice` 会为每个 reducer 自动生成对应的 action creator。

数据流（单向）：

```
dispatch(action)
    ↓
reducer(state, action) 计算新 state
    ↓
store 更新，订阅者（如 react-redux）收到新 state
    ↓
组件用新 state 重渲染
```

### 1.3 纯 Redux 快速体验（了解即可）

不和任何框架绑定时的基本步骤。**注意**：`createStore` 在 Redux 4.2+ 中已弃用，新项目应使用 RTK 的 `configureStore`；此处仅用于理解数据流。

| 步骤 | 说明                                                 |
| ---- | ---------------------------------------------------- |
| 1    | 定义 **reducer**：根据 action 返回新 state           |
| 2    | 用 **createStore(reducer)** 生成 store（已弃用 API） |
| 3    | **store.subscribe(listener)** 订阅状态变化           |
| 4    | **store.dispatch(action)** 提交 action 触发更新      |
| 5    | **store.getState()** 获取最新 state，更新到视图      |

**store.subscribe(listener)**：纯 Redux 中用于订阅 state 变化，state 变更后会自动执行 listener。在 React 中由 **react-redux** 负责订阅与更新组件，一般无需手写 subscribe。

### 1.4 Vue 3 对照：状态管理工具

Vue 3 生态中对应 Redux 的官方状态管理库是 **Pinia**（Vuex 的继任者，Vue 官方推荐）。

| 对比项       | Redux（RTK）                                                  | Pinia                                       |
| ------------ | ------------------------------------------------------------- | ------------------------------------------- |
| **定位**     | 框架无关的状态管理库，通过 react-redux 连接 React             | Vue 官方状态管理库，深度集成 Vue 响应式系统 |
| **核心概念** | **state** + **action** + **reducer**                          | **state** + **action** + **getter**         |
| **状态修改** | dispatch(action) → reducer 纯函数计算新 state                 | 在 action 中直接修改 state（响应式代理）    |
| **不可变性** | 必须返回新 state（RTK 用 Immer 允许"可变"写法，底层仍不可变） | 直接修改（Vue 响应式 Proxy 自动追踪）       |
| **数据流**   | 严格单向：dispatch → reducer → 新 state → 视图                | 组件可直接读写 store 中的 state             |
| **异步处理** | 需中间件（redux-thunk / createAsyncThunk）或 RTK Query        | action 原生支持 async/await，无需中间件     |
| **DevTools** | Redux DevTools 浏览器扩展                                     | Vue DevTools 内置 Pinia 面板                |

**核心概念对应关系：**

| Redux                            | Pinia               | 说明                                       |
| -------------------------------- | ------------------- | ------------------------------------------ |
| **state**                        | **state**           | 存放数据                                   |
| **reducer**                      | 不需要              | Pinia 中直接修改 state，无需纯函数计算新值 |
| **action**（同步）               | **action**          | 封装修改逻辑                               |
| **action**（异步 thunk）         | **action**（async） | Pinia 的 action 天然支持异步               |
| **selector**（useSelector 映射） | **getter**          | 派生/计算状态（类似 `computed`）           |

**数据流对比：**

```
Redux：  dispatch(action) → reducer 计算 → 新 state → 组件重渲染
Pinia：  调用 action / 直接赋值 → 响应式更新 → 组件自动更新
```

> 💡 Redux 强调严格的单向数据流和纯函数约束，可预测性强，适合大型团队协作；Pinia 更轻量灵活，利用 Vue 的响应式系统免去大量样板代码。

***

## 二、Redux 与 React 环境准备

### 2.1 配套工具

在 React 中使用 Redux，通常需安装两个包：

| 包名                     | 作用                                                                     |
| ------------------------ | ------------------------------------------------------------------------ |
| **Redux Toolkit（RTK）** | 官方推荐的 Redux 写法，简化配置、内置 Immer、支持异步 thunk 和 RTK Query |
| **react-redux**          | 连接 Redux 与 React 组件（Provider、useSelector、useDispatch）           |

```
React 组件 ←→ react-redux ←→ Redux store
              （获取状态、派发 action）
```

### 2.2 基础环境配置

```bash
# 1. 使用 Vite 创建项目（推荐；CRA 已弃用）
npm create vite@latest react-redux -- --template react     # TS 项目改用 react-ts
cd react-redux

# 2. 安装依赖
npm install
npm i @reduxjs/toolkit react-redux

# 3. 启动
npm run dev
```

### 2.3 store 目录结构建议

| 做法              | 说明                                                  |
| ----------------- | ----------------------------------------------------- |
| 单独 `store` 目录 | 集中管理状态相关代码                                  |
| `store/modules`   | 按业务分子模块（如 counter、cart）                    |
| `store/api`       | 存放 RTK Query 的 API 定义                            |
| `store/index.ts`  | 组合各子模块，创建并导出根 store；TS 项目同时导出类型 |
| `store/hooks.ts`  | （TS 项目）导出 typed hooks                           |

***

## 三、Redux Toolkit 基础用法

### 3.1 使用 RTK 创建 counterStore

**createSlice** 可同时定义 state、reducers 和 action creators；RTK 内置 **Immer**，reducer 内可直接"修改" state（实际生成不可变新对象）。

```js
// store/modules/counterStore.js
import { createSlice } from '@reduxjs/toolkit'

const counterStore = createSlice({
  name: 'counter',
  initialState: { count: 0 },
  reducers: {
    add(state) {
      // Immer 下可直接写"可变"语法
      state.count += 1
    },
    addTo(state, action) {
      state.count = action.payload
    }
  }
})

// 导出 action creators 与 reducer
export const { add, addTo } = counterStore.actions
export default counterStore.reducer
```

### 3.2 组合根 store

```js
// store/index.js
import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './modules/counterStore'

export default configureStore({
  reducer: {
    counter: counterReducer  // 根 state 形状：{ counter: { count: 0 } }
  }
})
```

### 3.3 注入 store（react-redux）

使用 **Provider** 将 store 注入应用，建立连接：

```jsx
// 入口文件或 App 根组件外层
import { Provider } from 'react-redux'
import store from './store'

root.render(
  <Provider store={store}>
    <App />
  </Provider>
)
```

### 3.4 组件中读取状态与派发 action

| 需求                | 使用的 Hook / 方式                                                 |
| ------------------- | ------------------------------------------------------------------ |
| **读取 store 数据** | **useSelector**：从 state 中映射出组件需要的部分                   |
| **修改 store 数据** | **useDispatch**：得到 dispatch，再调用 slice 导出的 action creator |

```jsx
import { useSelector, useDispatch } from 'react-redux'
import { add, addTo } from './store/modules/counterStore'

function Counter() {
  const count = useSelector((state) => state.counter.count)
  const dispatch = useDispatch()

  return (
    <div>
      <span>{count}</span>
      <button onClick={() => dispatch(add())}>+1</button>
      <button onClick={() => dispatch(addTo(10))}>add to 10</button>
    </div>
  )
}
```

| 要点            | 说明                                                                         |
| --------------- | ---------------------------------------------------------------------------- |
| **得到 action** | 执行 slice 导出的 actionCreator，如 `addTo(10)`，参数会放到 `action.payload` |
| **传参**        | reducer 中通过 `action.payload` 接收；调用时 `dispatch(addTo(20))` 即可      |

### 3.5 createSlice 的 selectors（RTK 2.0+）

RTK 2.0 起，`createSlice` 支持 **selectors** 字段，可将 selector 和 state、reducers 定义在同一处，避免在组件中散写选择逻辑：

```js
const counterStore = createSlice({
  name: 'counter',
  initialState: { count: 0 },
  reducers: {
    add(state) { state.count += 1 }
  },
  selectors: {
    selectCount: (state) => state.count,
    selectDoubleCount: (state) => state.count * 2
  }
})

export const { add } = counterStore.actions
export const { selectCount, selectDoubleCount } = counterStore.selectors
export default counterStore.reducer
```

生成的 selector 会自动定位到该 slice 在根 state 中的位置，组件中无需手写 `state.counter.xxx`：

```jsx
import { useSelector } from 'react-redux'
import { selectCount, selectDoubleCount } from './store/modules/counterStore'

function Counter() {
  const count = useSelector(selectCount)         // 等价于 state => state.counter.count
  const double = useSelector(selectDoubleCount)  // 等价于 state => state.counter.count * 2
  // ...
}
```

### 3.6 createSelector（记忆化 Selector）

`useSelector` 每次 dispatch 后都会重新执行 selector 函数，并用 **===** 比较新旧结果：引用不变则跳过重渲染，引用改变则触发重渲染。若 selector 每次返回**新数组或新对象**（如 `filter`、`map`），即使内容相同，引用也不同，会导致不必要的重渲染。

RTK 导出的 **createSelector**（来自 reselect 库）可创建**记忆化 selector**：只有 input selector 的返回值变化时才重新计算；输入不变则直接返回上次缓存结果（同一引用），避免无效重渲染。

`createSelector` 只负责**读取与派生**数据，不涉及 action 和 reducer。state 的定义与修改仍通过 `createSlice` 完成：

```js
// store/modules/listStore.js
import { createSlice, createSelector } from '@reduxjs/toolkit'

// ========== 1. createSlice：定义 state + 修改逻辑（写） ==========
const listStore = createSlice({
  name: 'list',
  initialState: {
    items: [
      { id: 1, name: '苹果' },
      { id: 2, name: '香蕉' },
      { id: 3, name: '苹果汁' },
    ],
    keyword: '',
  },
  reducers: {
    setKeyword(state, action) {
      state.keyword = action.payload
    },
    addItem(state, action) {
      state.items.push(action.payload)
    },
  },
})

export const { setKeyword, addItem } = listStore.actions
export default listStore.reducer
```

注册到根 store，`list` 键决定了 selector 中通过 `state.list` 访问该 slice：

```js
// store/index.js
import listReducer from './modules/listStore'

export default configureStore({
  reducer: { list: listReducer },
})
```

selector 通过 `state.list` 定位到该 slice 的数据，再用 `createSelector` 做记忆化派生：

```js
// ========== createSelector：派生数据（读） ==========
const selectItems = (state) => state.list.items
const selectKeyword = (state) => state.list.keyword

// 只有 items 或 keyword 变化时才重新执行 filter
export const selectFilteredItems = createSelector(
  [selectItems, selectKeyword],
  (items, keyword) => items.filter((item) => item.name.includes(keyword))
)
```

```jsx
function FilteredList() {
  const dispatch = useDispatch()
  // 读：用 useSelector + 记忆化 selector
  const filtered = useSelector(selectFilteredItems)

  return (
    <>
      {/* 写：用 dispatch + action */}
      <input onChange={(e) => dispatch(setKeyword(e.target.value))} />
      <ul>{filtered.map((item) => <li key={item.id}>{item.name}</li>)}</ul>
    </>
  )
}
```

| 情况                                                | 是否需要 createSelector                |
| --------------------------------------------------- | -------------------------------------- |
| selector 仅读取原始值（`state.counter.count`）      | **不需要**，原始值 === 直接比较值本身  |
| selector 返回新数组/对象（filter、map、展开运算符） | **需要**，避免每次返回新引用导致重渲染 |
| 多个 input 组合派生出新值                           | **推荐**，依赖关系清晰，自动缓存      |

> 💡 `createSelector` 与 `createSlice` 的 `selectors` 字段可配合使用：在 `selectors` 中用 `createSelector` 定义记忆化 selector，既获得自动定位 slice state 的便利，又避免派生数据导致的无效重渲染。

### 3.7 Vue 3 对照：定义与使用 Store

RTK 的 `createSlice` + `configureStore` + `react-redux` 三步流程，在 Pinia 中对应 `defineStore` + `createPinia` + 直接调用。

**定义 Store 对比：**

```js
// Redux（RTK）：createSlice 定义 state + reducers，再组合到 configureStore
const counterStore = createSlice({
  name: 'counter',
  initialState: { count: 0 },
  reducers: {
    add(state) { state.count += 1 },
    addTo(state, action) { state.count = action.payload }
  }
})

// 注册到根 store
export default configureStore({
  reducer: { counter: counterStore.reducer }
})
```

```js
// Pinia：defineStore 同时定义 state、getters、actions
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  actions: {
    add() { this.count += 1 },
    addTo(val) { this.count = val }
  }
})
```

**注入 Store 对比：**

```jsx
// React：Provider 包裹根组件
import { Provider } from 'react-redux'
import store from './store'

root.render(<Provider store={store}><App /></Provider>)
```

```js
// Vue 3：app.use 安装 Pinia 插件
import { createPinia } from 'pinia'
app.use(createPinia())
```

**组件中使用对比：**

```jsx
// React：useSelector 读取、useDispatch 派发
import { useSelector, useDispatch } from 'react-redux'
import { add, addTo } from './store/modules/counterStore'

const count = useSelector((state) => state.counter.count)
const dispatch = useDispatch()
dispatch(add())
dispatch(addTo(10))
```

```vue
<!-- Vue 3：调用 useXxxStore() 直接使用 -->
<script setup>
import { useCounterStore } from '@/stores/counter'
import { storeToRefs } from 'pinia'

const counterStore = useCounterStore()
const { count } = storeToRefs(counterStore)  // 解构时用 storeToRefs 保持响应式

counterStore.add()
counterStore.addTo(10)
</script>

<template>
  <span>{{ count }}</span>
</template>
```

| 对比项         | Redux（RTK + react-redux）               | Pinia                                              |
| -------------- | ---------------------------------------- | -------------------------------------------------- |
| **定义 Store** | `createSlice` + `configureStore`         | `defineStore`                                      |
| **注入**       | `<Provider store={store}>`               | `app.use(createPinia())`                           |
| **读取状态**   | `useSelector(state => ...)`              | `store.xxx` 或 `storeToRefs(store)`                |
| **修改状态**   | `dispatch(actionCreator())`              | 直接调用 `store.action()` 或赋值 `store.xxx = val` |
| **传参**       | `dispatch(addTo(10))` → `action.payload` | `store.addTo(10)` → 函数参数                       |

> 💡 Redux 修改状态必须经过 dispatch → reducer 流程，数据流严格可控；Pinia 允许在 action 中直接修改 `this.xxx`，甚至在组件中直接赋值 `store.count = 10`，写法更简洁但约束更少。

***

## 四、异步状态操作

### 4.1 思路

| 角色            | 职责                                                   |
| --------------- | ------------------------------------------------------ |
| **store**       | 配置同步修改 state 的 reducer；另封装"异步 action"函数 |
| **异步 action** | 内部发请求，拿到数据后 dispatch 同步 action 更新 state |
| **组件**        | 仍通过 dispatch 调用异步 action，写法与同步一致        |

> **注意**：reducer 必须是纯函数，不可在 reducer 内发请求或写异步逻辑；异步放在"异步 action"或 **createAsyncThunk** 中。如果是标准 CRUD 接口请求，推荐使用 **RTK Query**。

### 4.2 方式一：手写 thunk

**redux-thunk** 允许 dispatch 一个函数；该函数接收 `(dispatch, getState)`，在内部异步后再 dispatch 普通 action。RTK 的 `configureStore` 默认已集成 redux-thunk。

**① 定义 slice + 手写 thunk：**

```js
// store/modules/listStore.js
import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const listStore = createSlice({
  name: 'list',
  initialState: { list: [] },
  reducers: {
    setList(state, action) {       // 同步 reducer：纯函数，只负责更新 state
      state.list = action.payload
    }
  }
})

export const { setList } = listStore.actions

// ↓ 这就是手写的 thunk：一个返回函数（而非普通 action 对象）的 action creator
export const fetchList = () => {
  return async (dispatch) => {     // redux-thunk 拦截后调用此函数，并注入 dispatch
    const res = await axios.get('/api/xxx')
    dispatch(setList(res.data))    // 异步完成后 dispatch 同步 action，走正常 reducer 更新 state
  }
}

export default listStore.reducer   // 导出 reducer，供根 store 注册
```

| 导出项              | 类型                         | 用途                                                 |
| ------------------- | ---------------------------- | ---------------------------------------------------- |
| `setList`           | action creator（同步）       | 生成 `{ type: 'list/setList', payload }` 普通 action |
| `fetchList`         | thunk action creator（异步） | 返回一个函数，redux-thunk 会拦截并执行               |
| `listStore.reducer` | reducer 函数                 | 注册到根 store，处理该 slice 的 state 更新           |

**② 注册到根 store：**

```js
// store/index.js
import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './modules/counterStore'
import listReducer from './modules/listStore'    // 即 listStore.reducer

export default configureStore({
  reducer: {
    counter: counterReducer,
    list: listReducer   // 根 state 形状：{ counter: {...}, list: { list: [] } }
  }
})
```

**③ 组件中使用：**

```jsx
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchList } from './store/modules/listStore'

function ListPage() {
  const list = useSelector((state) => state.list.list)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchList())  // 调用方式与同步 action 完全一致
  }, [dispatch])           // dispatch 是稳定引用，不会变化，等同于 []（仅挂载时执行一次）
                           // 写入依赖数组是为了满足 exhaustive-deps lint 规则

  return (
    <ul>
      {list.map((item) => <li key={item.id}>{item.name}</li>)}
    </ul>
  )
}
```

**thunk 的数据流：**

```
dispatch(fetchList())
    ↓
fetchList() 返回一个函数（而非普通对象）
    ↓
redux-thunk 中间件拦截，识别为函数 → 调用它，注入 dispatch
    ↓
函数内部：await axios.get('/api/xxx') 发起异步请求
    ↓
请求完成 → dispatch(setList(res.data))，派发普通 action 对象
    ↓
reducer 收到普通 action → 更新 state → 组件重新渲染
```

> 💡 同步 action 和 thunk 在组件中的调用写法一致，都是 `dispatch(actionCreator())`。区别在于：同步 action creator 返回 `{ type, payload }` 对象，直接交给 reducer；thunk action creator 返回一个函数，由 redux-thunk 中间件拦截执行。

**redux-thunk 的本质：**

Redux **中间件（Middleware）** 是插在 dispatch → reducer 之间的拦截器，可在 action 到达 reducer 前对其拦截、修改或延迟。redux-thunk 是一个极简中间件，核心逻辑只有几行——如果 dispatch 的是**函数**就执行它，如果是**普通对象**就放行给 reducer：

```typescript
const thunk: Middleware = (storeAPI) => (next) => (action) => {
  if (typeof action === 'function') {
    return action(storeAPI.dispatch, storeAPI.getState)
  }
  return next(action)  // 普通 action 对象，放行给 reducer
}
```

这就是 `createAsyncThunk` 能工作的原因——它返回的 thunk 是函数，被 redux-thunk 拦截执行，内部完成异步操作后再 dispatch 普通 action 对象。RTK 的 `configureStore` 默认已集成 redux-thunk，无需手动配置。

**追加其他中间件：**

需要在 thunk 基础上追加中间件时，用 `getDefaultMiddleware()` 在默认列表上 `.concat()`：

```typescript
import { configureStore } from '@reduxjs/toolkit'
import logger from 'redux-logger'

const store = configureStore({
  reducer: { /* ... */ },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(logger),  // 在默认中间件（含 thunk）后追加 logger
})
```

> **注意**：不要直接写 `middleware: [logger]`，这会**覆盖**默认中间件（包括 thunk），导致异步 action 失效。始终基于 `getDefaultMiddleware()` 追加。

| 常见中间件               | 作用                                                           |
| ------------------------ | -------------------------------------------------------------- |
| **redux-thunk**          | 允许 dispatch 函数以支持异步；RTK 已内置                       |
| **redux-logger**         | 在控制台输出每次 action 与 state 变化（开发环境调试用）        |
| **RTK Query middleware** | 处理 RTK Query 的缓存生命周期、轮询等；使用 RTK Query 时需挂载 |

### 4.3 方式二：createAsyncThunk

**createAsyncThunk** 是 RTK 提供的异步 action 创建函数，自动生成 pending / fulfilled / rejected 三种 action type，并在 **extraReducers** 中处理对应状态（如 loading、error）。

```js
// store/modules/listStore.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// 第一个参数：action type 前缀；第二个参数：payloadCreator（返回 Promise）
export const fetchList = createAsyncThunk(
  'list/fetchList',
  async (arg, { rejectWithValue }) => {
    try {
      const res = await axios.get('/api/xxx')
      return res.data  // 返回值即 action.payload
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const listStore = createSlice({
  name: 'list',
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchList.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchList.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload
      })
      .addCase(fetchList.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export default listStore.reducer
```

| 对比项            | 手写 thunk                  | createAsyncThunk                                       |
| ----------------- | --------------------------- | ------------------------------------------------------ |
| **loading/error** | 需自己在 state 和逻辑里维护 | 在 extraReducers 中统一处理 pending/fulfilled/rejected |
| **可维护性**      | 适合简单场景                | 类型与流程更清晰                                       |

### 4.4 Vue 3 对照：异步操作

Redux 中异步操作需要中间件（redux-thunk）或 `createAsyncThunk`，不能在 reducer 内写异步逻辑。Pinia 的 action **天然支持 async/await**，无需额外工具：

```js
// Redux：需要 thunk 或 createAsyncThunk，reducer 内不能写异步
export const fetchList = createAsyncThunk('list/fetchList', async () => {
  const res = await axios.get('/api/xxx')
  return res.data
})

// extraReducers 中分别处理 pending / fulfilled / rejected
```

```js
// Pinia：action 直接 async/await，在同一个函数中完成
export const useListStore = defineStore('list', {
  state: () => ({ list: [], loading: false, error: null }),
  actions: {
    async fetchList() {
      this.loading = true
      this.error = null
      try {
        const res = await axios.get('/api/xxx')
        this.list = res.data
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    }
  }
})
```

| 对比项            | Redux（createAsyncThunk）                         | Pinia                                   |
| ----------------- | ------------------------------------------------- | --------------------------------------- |
| **异步写法**      | `createAsyncThunk` + `extraReducers` 处理三种状态 | action 中直接 async/await               |
| **loading/error** | 在 `pending` / `rejected` 的 `addCase` 中分别设置 | 在同一个 action 函数中用 try/catch 管理 |
| **中间件**        | 需要 redux-thunk（RTK 默认集成）                  | 不需要，action 原生支持异步             |
| **组件调用**      | `dispatch(fetchList())`                           | `store.fetchList()`                     |

> 💡 Redux 的 `createAsyncThunk` 强制将异步流程拆分为 pending / fulfilled / rejected 三个阶段，状态变更可追溯；Pinia 的 async action 更直观，但需要开发者自行管理 loading/error 状态。

***

## 五、RTK Query（数据获取与缓存）

### 5.1 什么是 RTK Query

**RTK Query** 是 RTK 内置的数据获取与缓存方案，专门解决"从服务端获取数据并同步到 store"的场景。相比 `createAsyncThunk` 手动管理 loading / error / 缓存，RTK Query 提供声明式 API，自动处理缓存、去重、轮询、失效刷新等。

| 对比项       | createAsyncThunk                               | RTK Query                                       |
| ------------ | ---------------------------------------------- | ----------------------------------------------- |
| **定位**     | 通用异步 action，需手动管理 loading/error/缓存 | 专为数据获取设计，自动管理请求生命周期与缓存    |
| **缓存**     | 无内置缓存，需自行实现                         | 自动缓存、去重、过期失效                        |
| **Hooks**    | 需手动在组件中 dispatch + useSelector          | 自动生成 `useXxxQuery` / `useXxxMutation` hooks |
| **适用场景** | 任意异步逻辑（不限于请求）                     | 标准 CRUD 接口请求（推荐）                      |

### 5.2 定义 API Service

用 **createApi** 定义接口，`endpoints` 中用 `builder.query`（查询）和 `builder.mutation`（增删改）描述各端点：

```js
// store/api/listApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const listApi = createApi({
  reducerPath: 'listApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['List'],
  endpoints: (builder) => ({
    // 查询接口 → 自动生成 useGetListQuery hook
    getList: builder.query({
      query: () => '/list',
      providesTags: ['List']
    }),
    // 新增接口 → 自动生成 useAddItemMutation hook
    addItem: builder.mutation({
      query: (newItem) => ({
        url: '/list',
        method: 'POST',
        body: newItem
      }),
      invalidatesTags: ['List']  // 新增后自动重新获取列表
    })
  })
})

export const { useGetListQuery, useAddItemMutation } = listApi
```

| 概念                | 说明                                                 |
| ------------------- | ---------------------------------------------------- |
| **reducerPath**     | 该 API 在根 state 中的挂载 key                       |
| **baseQuery**       | 基础请求函数，`fetchBaseQuery` 是内置的 fetch 封装   |
| **tagTypes**        | 缓存标签类型，用于 mutation 后自动刷新相关 query     |
| **providesTags**    | query 提供的缓存标签                                 |
| **invalidatesTags** | mutation 完成后失效哪些标签，触发对应 query 重新请求 |

### 5.3 挂载到 store

```js
// store/index.js
import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './modules/counterStore'
import { listApi } from './api/listApi'

export default configureStore({
  reducer: {
    counter: counterReducer,
    [listApi.reducerPath]: listApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(listApi.middleware)  // 处理缓存、轮询等
})
```

### 5.4 组件中使用

```jsx
import { useGetListQuery, useAddItemMutation } from './store/api/listApi'

function ListPage() {
  // 查询：组件挂载时自动发请求，返回 data / isLoading / error
  const { data: list, isLoading, error } = useGetListQuery()

  // 变更：返回 [触发函数, 状态对象]
  const [addItem, { isLoading: isAdding }] = useAddItemMutation()

  if (isLoading) return <div>加载中...</div>
  if (error) return <div>加载失败</div>

  return (
    <div>
      <button onClick={() => addItem({ name: '新项目' })} disabled={isAdding}>
        添加
      </button>
      <ul>
        {list?.map((item) => <li key={item.id}>{item.name}</li>)}
      </ul>
    </div>
  )
}
```

`useGetListQuery` 在组件挂载时自动请求，相同参数的多次调用只发一次请求（去重）。mutation 配合 `invalidatesTags` 可实现"增删改后自动刷新列表"。

> 💡 标准 CRUD 接口优先使用 RTK Query；`createAsyncThunk` 更适合非接口类的复杂异步逻辑（如多步骤流程、与 WebSocket 配合等）。

### 5.5 请求拦截与自定义 baseQuery

RTK Query 没有 axios 风格的拦截器 API，但通过自定义 `baseQuery` 可实现等价功能。根据需求复杂度有三种方案：

| 方案                      | 适用场景                                               |
| ------------------------- | ------------------------------------------------------ |
| **prepareHeaders**        | 仅需统一添加请求头（如 token）                         |
| **baseQuery 包装**        | 需全局请求/响应拦截（如 token 自动刷新、统一错误处理） |
| **自定义 axiosBaseQuery** | 项目已有 axios 实例（含拦截器），需复用                |

#### 1. prepareHeaders（仅修改请求头）

`fetchBaseQuery` 的 `prepareHeaders` 参数可在每次请求前修改请求头，等价于只加 token 的请求拦截器：

```js
fetchBaseQuery({
  baseUrl: '/api',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token')
    if (token) headers.set('Authorization', `Bearer ${token}`)
    return headers
  }
})
```

***

#### 2. baseQuery 包装（原生全局拦截）

对 `fetchBaseQuery` 做一层函数包装，在调用**前后**插入逻辑，等价于 axios 的请求拦截器 + 响应拦截器。典型场景：token 过期时自动刷新并重试。

```ts
import { fetchBaseQuery } from '@reduxjs/toolkit/query'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'

const rawBaseQuery = fetchBaseQuery({
  baseUrl: '/api',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token')
    if (token) headers.set('Authorization', `Bearer ${token}`)
    return headers
  }
})

const baseQueryWithInterceptor: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> =
  async (args, api, extraOptions) => {
    // ========== 请求前（等价于 axios 请求拦截器）==========
    // args 即 endpoint 的 query 返回值，可在此修改或记录日志

    let result = await rawBaseQuery(args, api, extraOptions)

    // ========== 响应后（等价于 axios 响应拦截器）==========
    if (result.error?.status === 401) {
      // token 过期 → 尝试刷新
      const refreshResult = await rawBaseQuery(
        { url: '/auth/refresh', method: 'POST' }, api, extraOptions
      )
      if (refreshResult.data) {
        const { token } = refreshResult.data as { token: string }
        localStorage.setItem('token', token)
        result = await rawBaseQuery(args, api, extraOptions)  // 用新 token 重试
      } else {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
    }

    return result
  }
```

在 `createApi` 中传入包装后的 baseQuery，所有 endpoint 的请求都会经过这层拦截：

```ts
export const listApi = createApi({
  reducerPath: 'listApi',
  baseQuery: baseQueryWithInterceptor,
  endpoints: (builder) => ({ /* ... */ })
})
```

| 拦截时机   | 对应位置                    | 典型用途                           |
| ---------- | --------------------------- | ---------------------------------- |
| **请求前** | `await rawBaseQuery()` 之前 | 修改参数、记录日志、添加全局参数   |
| **响应后** | `await rawBaseQuery()` 之后 | 统一错误处理、token 刷新重试、日志 |

***

#### 3. 复用已有 axios 实例

项目中已有 axios 实例（含拦截器、统一错误处理等）时，可自定义 `axiosBaseQuery` 直接复用，不必重复配置：

```ts
// utils/request.ts —— 已有的 axios 实例
import axios from 'axios'

const request = axios.create({
  baseURL: '/api',
  timeout: 5000
})

request.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

request.interceptors.response.use(
  (res) => res.data,
  (err) => Promise.reject(err)
)

export default request
```

```ts
// store/api/axiosBaseQuery.ts
import type { BaseQueryFn } from '@reduxjs/toolkit/query'
import type { AxiosRequestConfig, AxiosError } from 'axios'
import request from '@/utils/request'

// baseQuery 必须返回 { data } 或 { error }
const axiosBaseQuery: BaseQueryFn<
  { url: string; method?: AxiosRequestConfig['method']; data?: unknown; params?: unknown },
  unknown,
  unknown
> = async ({ url, method = 'GET', data, params }) => {
  try {
    const result = await request({ url, method, data, params })
    return { data: result }  // 响应拦截器已返回 res.data，result 即接口数据
  } catch (err) {
    const axiosError = err as AxiosError
    return {
      error: {
        status: axiosError.response?.status,
        data: axiosError.response?.data || axiosError.message
      }
    }
  }
}

export default axiosBaseQuery
```

`createApi` 中用 `axiosBaseQuery` 替换 `fetchBaseQuery`，endpoint 的 `query` 返回 axios 配置对象（用 **data** 传请求体，而非 fetchBaseQuery 的 `body`）：

```ts
// store/api/listApi.ts
import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from './axiosBaseQuery'

export const listApi = createApi({
  reducerPath: 'listApi',
  baseQuery: axiosBaseQuery,
  tagTypes: ['List'],
  endpoints: (builder) => ({
    getList: builder.query<ListItem[], void>({
      query: () => ({ url: '/list' })
    }),
    addItem: builder.mutation<ListItem, AddItemRequest>({
      query: (body) => ({ url: '/list', method: 'POST', data: body })
    })
  })
})
```

***

**三种方案对比：**

| 对比项       | prepareHeaders          | baseQuery 包装                   | 自定义 axiosBaseQuery       |
| ------------ | ----------------------- | -------------------------------- | --------------------------- |
| **底层**     | 原生 fetch              | 原生 fetch                       | axios                       |
| **请求拦截** | 仅能修改请求头          | 可修改任意请求参数               | 复用 axios 请求拦截器       |
| **响应拦截** | ❌ 不支持                | ✅ 可处理错误、刷新 token 等      | 复用 axios 响应拦截器       |
| **适用场景** | 只需加 token 等简单场景 | 需全局错误处理、token 自动刷新等 | 项目已有 axios 封装，需复用 |

### 5.6 常用选项

**Query Hook 常用参数：**

| 参数                          | 说明                                                                      |
| ----------------------------- | ------------------------------------------------------------------------- |
| **skip**                      | 为 `true` 时不发请求，常用于参数未就绪时跳过                              |
| **pollingInterval**           | 轮询间隔（ms），如 `3000` 表示每 3 秒自动重请求                           |
| **refetchOnMountOrArgChange** | 组件重新挂载或参数变化时是否重请求；设 `true` 或过期秒数                  |
| **refetchOnFocus**            | 窗口重新聚焦时自动重请求（需在入口调用 `setupListeners(store.dispatch)`） |
| **selectFromResult**          | 从缓存结果中只取部分数据，减少不必要的重渲染                              |

```jsx
// skip：参数未就绪时跳过请求
const { data } = useGetDetailQuery(id, { skip: !id })

// 轮询：每 5 秒自动刷新
const { data } = useGetListQuery(undefined, { pollingInterval: 5000 })
```

**transformResponse：** 在数据进入缓存前做格式转换，接口返回结构与组件所需不一致时使用：

```js
getList: builder.query({
  query: () => '/list',
  transformResponse: (response) => response.items  // 只取嵌套的 items
})
```

**带参数的 Query：**

```js
// 定义：query 函数接收参数
getDetail: builder.query({
  query: (id) => `/list/${id}`,
  providesTags: (result, error, id) => [{ type: 'List', id }]
})
```

```jsx
// 组件中传参
const { data } = useGetDetailQuery(42)
```

`providesTags` 支持函数形式，可按参数生成细粒度标签；mutation 的 `invalidatesTags` 指定 `{ type: 'List', id }` 时只失效该条数据的缓存，而非整个列表。

***

## 六、拆分 reducer（多模块）

### 6.1 多 Slice 组合

按业务拆成多个 **createSlice**，在根 store 的 **reducer** 里用对象组合；每个 slice 的 state 会挂到根 state 的对应 key 下，根 state 形状为 `{ counter: {...}, cart: {...} }`。

```js
// store/index.js
import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './modules/counterStore'
import cartReducer from './modules/cartStore'

export default configureStore({
  reducer: {
    counter: counterReducer,
    cart: cartReducer
  }
})
```

组件中通过 `state.counter`、`state.cart` 访问对应模块。

**UI 组件与容器组件（了解即可）**：早期 react-redux 常把"只负责展示、数据全由 props 提供"的组件叫 UI 组件，"负责连接 store、处理逻辑"的叫容器组件。使用 **useSelector** + **useDispatch** 后，同一组件内即可读状态与派发 action，不必再严格区分两类文件。

### 6.2 combineSlices（RTK 2.0+）

RTK 2.0 新增 **combineSlices**，支持 reducer 的**懒加载**，适合大型应用做代码分割：

```js
// store/index.js
import { configureStore } from '@reduxjs/toolkit'
import { combineSlices } from '@reduxjs/toolkit'
import counterSlice from './modules/counterStore'

// 用 combineSlices 创建根 reducer（自带 .inject() 能力）
const rootReducer = combineSlices(counterSlice)

// 仍需通过 configureStore 创建 store
export default configureStore({
  reducer: rootReducer
})
```

```js
// 后续在懒加载路由中，动态注入新 slice
import cartSlice from './modules/cartStore'
rootReducer.inject(cartSlice)
// 下一次 dispatch 时，根 state 就会包含 cart 模块
```

`combineSlices` 本身只生成根 reducer 函数，store 仍由 `configureStore` 创建。区别在于 `combineSlices` 返回的 rootReducer 支持运行时通过 `.inject()` 动态添加 reducer，无需在应用启动时全部注册；而 `configureStore` 的 `reducer: { a, b }` 对象写法在内部会生成固定的根 reducer，不支持后续注入。小型项目使用 `reducer: { ... }` 即可。

### 6.3 原生 Redux 的 combineReducers（了解即可）

未使用 RTK 时，可用 **combineReducers** 把多个 reducer 合成一个根 reducer，再传给 createStore。RTK 的 `reducer: { a, b }` 等价于内部调用 combineReducers。

### 6.4 Vue 3 对照：多模块

Redux 需要将多个 slice 的 reducer 组合到一个根 store 中，通过 `state.counter`、`state.cart` 等 key 访问。Pinia 中每个 store **天然独立**，不需要手动组合：

```js
// Redux：多个 slice 组合到一个根 store
export default configureStore({
  reducer: {
    counter: counterReducer,
    cart: cartReducer
  }
})
// 访问：state.counter.count、state.cart.items
```

```js
// Pinia：每个 store 独立定义，互不依赖
// stores/counter.js
export const useCounterStore = defineStore('counter', { ... })

// stores/cart.js
export const useCartStore = defineStore('cart', { ... })

// 组件中按需导入，无需组合
const counterStore = useCounterStore()
const cartStore = useCartStore()
```

| 对比项         | Redux（RTK）                                       | Pinia                                                   |
| -------------- | -------------------------------------------------- | ------------------------------------------------------- |
| **模块定义**   | 各写 `createSlice`，在根 store 的 `reducer` 中组合 | 各写 `defineStore`，天然独立                            |
| **根 store**   | 必须有，`configureStore` 统一管理                  | 不需要，`createPinia()` 仅做插件注册                    |
| **模块间访问** | 通过 `getState()` 拿到根 state 访问其他模块        | 在一个 store 的 action 中直接调用另一个 `useXxxStore()` |
| **组件中使用** | `useSelector(state => state.counter.xxx)`          | `useCounterStore().xxx`                                 |

> 💡 Redux 的"单一 store + 多 slice 组合"强调全局状态集中管理；Pinia 的多 store 独立模式更扁平灵活，按需导入，无需关心组合与根 state 的结构。

***

## 七、TypeScript 类型化

### 7.1 类型推断与 Typed Hooks

RTK 的 `configureStore` 可自动推断出根 state 和 dispatch 类型。推荐在 store 文件中导出这两个类型，并创建 **typed hooks**，组件统一使用 typed hooks 代替原始的 `useSelector` / `useDispatch`：

```ts
// store/index.ts
import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './modules/counterStore'

const store = configureStore({
  reducer: {
    counter: counterReducer
  }
})

// 从 store 实例自动推断
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
```

```ts
// store/hooks.ts —— RTK 2.0+ 推荐写法
import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '.'

export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
```

| 类型 / Hook        | 说明                                                                           |
| ------------------ | ------------------------------------------------------------------------------ |
| **RootState**      | 根 state 类型，`useAppSelector` 回调参数自动获得完整类型提示                   |
| **AppDispatch**    | 包含 thunk 中间件签名的 dispatch 类型；直接用 `Dispatch` 无法识别 thunk action |
| **useAppSelector** | 替代 `useSelector`，回调的 state 参数自动为 `RootState`                        |
| **useAppDispatch** | 替代 `useDispatch`，返回的 dispatch 可正确接受 thunk action                    |

> 💡 只在 `store/hooks.ts` 中声明一次 typed hooks，全项目组件统一导入，避免每处手写泛型。

### 7.2 createSlice 类型化

为 slice 的 state 定义接口，reducer 中的 action 参数用 **PayloadAction\<T>** 标注 payload 类型：

```ts
// store/modules/counterStore.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface CounterState {
  count: number
}

const initialState: CounterState = { count: 0 }

const counterStore = createSlice({
  name: 'counter',
  initialState,  // 类型从 initialState 自动推断给 state 参数
  reducers: {
    add(state) {
      state.count += 1
    },
    addTo(state, action: PayloadAction<number>) {
      state.count = action.payload  // payload 自动推断为 number
    }
  }
})

export const { add, addTo } = counterStore.actions
export default counterStore.reducer
```

组件中使用 typed hooks：

```tsx
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { add, addTo } from '../store/modules/counterStore'

function Counter() {
  const count = useAppSelector((state) => state.counter.count)  // state 已有完整类型
  const dispatch = useAppDispatch()

  return (
    <div>
      <span>{count}</span>
      <button onClick={() => dispatch(add())}>+1</button>
      <button onClick={() => dispatch(addTo(10))}>add to 10</button>
    </div>
  )
}
```

> 💡 `initialState` 单独声明并标注类型后，`createSlice` 自动推断 reducer 中 state 参数类型；`PayloadAction<T>` 同时约束 dispatch 传参类型和 reducer 内 `action.payload` 类型。

### 7.3 createAsyncThunk 类型化

`createAsyncThunk` 接受三个泛型参数：**返回值类型**、**参数类型**、**ThunkApiConfig**（可选，指定 `rejectWithValue` 等类型）：

```ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

interface ListItem {
  id: number
  name: string
}

interface ListState {
  list: ListItem[]
  loading: boolean
  error: string | null
}

const initialState: ListState = { list: [], loading: false, error: null }

//                         返回值         参数   ThunkApiConfig
export const fetchList = createAsyncThunk<ListItem[], void, { rejectValue: string }>(
  'list/fetchList',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get<ListItem[]>('/api/list')
      return res.data
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

const listStore = createSlice({
  name: 'list',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchList.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchList.fulfilled, (state, action) => {
        // action.payload 自动推断为 ListItem[]
        state.loading = false
        state.list = action.payload
      })
      .addCase(fetchList.rejected, (state, action) => {
        // action.payload 自动推断为 string | undefined
        state.loading = false
        state.error = action.payload ?? '未知错误'
      })
  }
})

export default listStore.reducer
```

| 泛型参数                     | 说明                                                               |
| ---------------------------- | ------------------------------------------------------------------ |
| **第一个**（返回值）         | payloadCreator 返回类型，即 `fulfilled` 时 `action.payload` 的类型 |
| **第二个**（参数）           | payloadCreator 第一个参数类型；无参数时用 `void`                   |
| **第三个**（ThunkApiConfig） | 可选对象，常用 `rejectValue` 指定 `rejectWithValue` 的返回类型     |

### 7.4 RTK Query 类型化

`builder.query` 和 `builder.mutation` 的泛型参数为 `<返回值类型, 参数类型>`：

```ts
// store/api/listApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface ListItem {
  id: number
  name: string
}

interface AddItemRequest {
  name: string
}

export const listApi = createApi({
  reducerPath: 'listApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['List'],
  endpoints: (builder) => ({
    //                           返回值类型      参数类型
    getList: builder.query<ListItem[], void>({
      query: () => '/list',
      providesTags: ['List']
    }),
    addItem: builder.mutation<ListItem, AddItemRequest>({
      query: (body) => ({   // body 自动推断为 AddItemRequest
        url: '/list',
        method: 'POST',
        body
      }),
      invalidatesTags: ['List']
    })
  })
})

// 自动生成的 hooks 已包含完整类型
export const { useGetListQuery, useAddItemMutation } = listApi
```

自动生成的 hooks 携带完整类型：`useGetListQuery` 返回的 `data` 为 `ListItem[] | undefined`，`useAddItemMutation` 的触发函数参数类型为 `AddItemRequest`。

***

## 八、Redux 原理要点

### 8.1 三大原则

| 原则           | 说明                                                                 |
| -------------- | -------------------------------------------------------------------- |
| **单一数据源** | 全局一个 store，所有状态集中管理；便于调试、持久化、服务端渲染       |
| **State 只读** | 修改 state 的唯一方式是 dispatch 一个 action，不允许直接赋值         |
| **纯函数修改** | reducer 是纯函数：相同的 (state, action) 始终返回相同结果，无副作用 |

### 8.2 useSelector 的重渲染机制

`useSelector` 内部通过 `store.subscribe` 订阅 dispatch。每次 dispatch 后的流程：

```
执行 selector 函数，计算新的 selectedState
    ↓
用 ===（严格相等）比较新旧 selectedState
    ↓
引用不变 → 跳过重渲染
引用改变 → 触发组件重渲染
```

| 场景                                                         | 是否重渲染                 | 原因                                      |
| ------------------------------------------------------------ | -------------------------- | ----------------------------------------- |
| `state => state.counter.count`（原始值）                     | count 值变化时才重渲染     | 原始值 === 比较的是值本身                 |
| `state => state.list.items.filter(...)`（每次返回新数组）    | **每次 dispatch 都重渲染** | filter 每次返回新数组引用，=== 为 false   |
| `useSelector(selectFilteredItems)`（createSelector 记忆化）  | 输入不变时跳过             | createSelector 缓存上次结果，返回同一引用 |

selector 返回新引用（数组、对象）时，应使用 `createSelector` 记忆化，避免无效重渲染。

### 8.3 不可变更新与 Immer

**为什么要求不可变更新：**

| 原因             | 说明                                                         |
| ---------------- | ------------------------------------------------------------ |
| **高效变更检测** | === 引用比较即可判断是否变化，无需深度递归对比               |
| **时间旅行调试** | 每次 dispatch 生成新 state 快照，DevTools 可在任意快照间跳转 |
| **可预测性**     | state 不会被意外修改，reducer 外的代码无法直接改 state       |

**Immer 的原理：** RTK 的 `createSlice` 内置 Immer，reducer 中看似直接修改 state，实际上 Immer 通过 **Proxy** 拦截所有写操作，记录变更，最终基于原 state 生成**结构共享（structural sharing）**的新不可变对象——未修改的部分保留原引用，只有变更路径上的节点创建新引用：

```
state = { a: { x: 1 }, b: { y: 2 } }

// reducer 中仅修改 state.a.x
state.a.x = 10

// Immer 生成的新 state：
newState = { a: { x: 10 }, b: state.b }  // b 复用原引用（结构共享）

state !== newState        ✅ 顶层引用变了
state.a !== newState.a    ✅ a 变了
state.b === newState.b    ✅ b 未变，复用原引用
```

### 8.4 Redux vs React Context

| 对比项       | Redux                                                    | React Context                                                |
| ------------ | -------------------------------------------------------- | ------------------------------------------------------------ |
| **定位**     | 完整的状态管理方案（数据流 + 中间件 + DevTools）         | React 内置的跨层级传值机制                                   |
| **性能**     | useSelector 精确订阅，只有 selected 值变化时重渲染       | Context value 变化时，**所有**消费该 Context 的组件都重渲染 |
| **中间件**   | 支持中间件（thunk、logger 等），可扩展 dispatch 能力     | 无中间件机制                                                 |
| **DevTools** | Redux DevTools：时间旅行、action 日志、state diff        | 无专用调试工具                                               |
| **适用场景** | 状态更新频繁、多处消费同一 state、需要可追溯的变更记录   | 低频变化的全局配置（主题、语言、认证状态等）                 |

> 💡 Context 适合"传值"，Redux 适合"管状态"。多个组件频繁读写同一份状态且需要精确重渲染控制时，Redux 比 Context 更高效。

***

## 九、Redux DevTools

Redux 官方提供浏览器扩展（Chrome / Firefox），使用 RTK 的 `configureStore` 默认已支持，无需额外配置。

| 功能            | 说明                                                 |
| --------------- | ---------------------------------------------------- |
| **State 树**    | 以树形结构浏览当前完整 state                         |
| **Action 日志** | 按时间顺序查看所有已 dispatch 的 action 及其 payload |
| **时间旅行**    | 点击某条 action 可回退 / 前进到该时刻的 state        |
| **Diff 视图**   | 查看每次 action 引起的 state 变化差异                |
| **RTK Query**   | 请求状态、缓存数据与标签失效也会显示在面板中         |

