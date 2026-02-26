## 一、Redux 概述

### 1.1 什么是 Redux

**Redux** 是 React 生态中最常用的集中状态管理工具，类似于 Vue 中的 Pinia（Vuex），可独立于框架使用。

| 项目     | 说明 |
| -------- | ---- |
| **作用** | 用集中管理的方式管理应用状态 |
| **特点** | 不与具体框架绑定，可不依赖构建工具单独使用 |

### 1.2 核心概念与数据流

为职责清晰、数据流向明确，Redux 将数据修改流程抽象为三个概念：

| 概念     | 类型   | 说明 |
| -------- | ------ | ---- |
| **state**  | 对象   | 存放被集中管理的数据 |
| **action** | 对象   | 描述“要怎样改数据”（通常含 `type`、`payload`） |
| **reducer** | 函数   | 根据当前 state 和 action 计算出新的 state（纯函数） |

```
dispatch(action) → reducer(state, action) → 新 state → 订阅者更新视图
```

### 1.3 纯 Redux 快速体验（了解即可）

不和任何框架绑定时的基本步骤。**注意**：`createStore` 已在 Redux 4.2+ 中弃用，新项目应使用 RTK 的 `configureStore`；此处仅用于理解数据流。

| 步骤     | 说明 |
| -------- | ---- |
| 1 | 定义 **reducer**：根据“想做的修改”返回新 state |
| 2 | 用 **createStore(reducer)** 生成 store（已弃用 API，仅作理解用） |
| 3 | **store.subscribe** 订阅状态变化 |
| 4 | **store.dispatch(action)** 提交 action 触发更新 |
| 5 | **store.getState()** 获取最新 state，更新到视图 |

***

## 二、Redux 与 React 环境准备

### 2.1 配套工具

在 React 中使用 Redux，通常需安装两个包：

| 包名             | 作用 |
| ---------------- | ---- |
| **Redux Toolkit（RTK）** | 官方推荐的 Redux 写法，简化配置、内置 Immer、支持异步 thunk |
| **react-redux**  | 连接 Redux 与 React 组件（Provider、useSelector、useDispatch） |

```
React 组件 ←→ react-redux ←→ Redux store
              （获取状态、派发 action）
```

### 2.2 基础环境配置

```bash
# 1. 使用 Vite 创建项目（推荐；CRA 已弃用）
npm create vite@latest react-redux -- --template react
cd react-redux

# 2. 安装依赖
npm install
npm i @reduxjs/toolkit react-redux

# 3. 启动
npm run dev
```

### 2.3 store 目录结构建议

| 做法     | 说明 |
| -------- | ---- |
| 单独 `store` 目录 | 集中管理状态相关代码 |
| `store/modules`   | 按业务分子模块（如 counter、cart） |
| `store/index.js` | 组合各子模块，创建并导出根 store |

***

## 三、Redux Toolkit 基础用法

### 3.1 使用 RTK 创建 counterStore

**createSlice** 可同时定义 state、reducers 和 action creators：

```js
// store/modules/counterStore.js
import { createSlice } from '@reduxjs/toolkit'

const counterStore = createSlice({
  name: 'counter',
  initialState: { count: 0 },
  reducers: {
    add(state) {
      state.count += 1  // RTK 内置 Immer，可直接“改”state
    },
    addTo(state, action) {
      state.count = action.payload
    }
  }
})

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
    counter: counterReducer
  }
})
```

### 3.3 注入 store（react-redux）

使用 **Provider** 将 store 注入应用，建立连接：

```jsx
// index.js 或 App 根组件外层
import { Provider } from 'react-redux'
import store from './store'

root.render(
  <Provider store={store}>
    <App />
  </Provider>
)
```

### 3.4 组件中读取状态与派发 action

| 需求     | 使用的 Hook / 方式 |
| -------- | ------------------ |
| **读取 store 中的数据** | **useSelector**：从 state 中映射出组件需要的部分 |
| **修改 store 中的数据** | **useDispatch**：得到 dispatch，再调用 slice 导出的 action creator |

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

| 要点     | 说明 |
| -------- | ---- |
| **得到 action 对象** | 执行对应 slice 导出的 actionCreator，如 `addTo(10)`，参数会放到 `action.payload` |
| **传参** | 在 reducer 中通过 `action.payload` 接收；调用时 `dispatch(addTo(20))` 即可 |

***

## 四、异步状态操作

### 4.1 思路

| 角色     | 职责 |
| -------- | ---- |
| **store** | 配置同步修改 state 的 reducer；另封装“异步 action”函数 |
| **异步 action** | 内部发请求，拿到数据后 dispatch 同步 action 更新 state |
| **组件** | 仍然通过 dispatch 调用异步 action，写法与同步一致 |

### 4.2 异步 action 样板

```js
// 1. store 中同步 reducer 正常写
reducers: {
  setList(state, action) {
    state.list = action.payload
  }
}

// 2. 单独封装异步函数：内部请求，再 dispatch 同步 action
export const fetchList = () => {
  return async (dispatch) => {
    const res = await axios.get('/api/xxx')
    dispatch(setList(res.data))
  }
}

// 3. 组件中
dispatch(fetchList())
```

***

## 五、拆分 reducer（多模块）

### 5.1 RTK 中的做法

按业务拆成多个 **createSlice**，在根 store 的 **reducer** 里用对象组合即可；每个 slice 的 state 会挂到根 state 的对应 key 下。

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

### 5.2 原生 Redux 的 combineReducers（了解即可）

未使用 RTK 时，可用 **combineReducers** 把多个 reducer 合成一个根 reducer，再传给 createStore。RTK 的 `reducer: { a, b }` 等价于内部调用 combineReducers。

***

## 六、中间件（了解即可）

**中间件** 在 **dispatch(action)** 与 **reducer** 之间执行，可用来打日志、处理异步等。RTK 的 **configureStore** 默认已集成 **redux-thunk**，因此可直接在 slice 外写返回函数的异步 action；若需打印 action 日志，可加 **redux-logger** 等中间件。

| 常见中间件   | 作用 |
| ------------ | ---- |
| **redux-thunk** | 允许 dispatch 一个函数，在函数内异步后再 dispatch 普通 action；RTK 已内置 |
| **redux-logger** | 在控制台输出每次 action 与 state 变化（开发环境用） |

***

## 七、Redux 原理要点（面试用）

| 要点         | 说明 |
| ------------ | ---- |
| **单向数据流** | 视图 dispatch(action) → store 交给 reducer 计算新 state → 订阅者（如 react-redux）取新 state 更新视图 |
| **单一数据源** | 全局一个 store，state 只通过 reducer 更新 |
| **reducer 纯函数** | 相同 (state, action) 得到相同结果，不写副作用、不直接改 state |
| **订阅机制** | store.subscribe 注册监听器，每次 dispatch 后执行，react-redux 据此把新 state 传给组件 |

***

## 八、Redux DevTools

Redux 官方提供浏览器扩展，可查看 state、action 历史、时间旅行等。安装 Chrome 扩展 **Redux DevTools** 后，使用 RTK 的 `configureStore` 默认已支持，无需额外配置。

***

## 九、案例要点：美团外卖

| 功能         | 实现要点 |
| ------------ | -------- |
| **分类与商品列表** | RTK store 中维护列表状态；异步 action 请求接口；组件 `useSelector` 取数并渲染 |
| **Tab 激活** | store 中存 `activeIndex`；点击分类时 dispatch 更新 `activeIndex`；类名用 `activeIndex === index` 控制高亮 |
| **商品列表切换显示** | 按 `activeIndex === index` 条件渲染当前分类下的商品 |
| **添加购物车** | store 中维护 `cartList`；点击“+”时 dispatch 添加；若已存在则只改数量，否则 push 新项 |
| **统计区域** | 数量：`cartList.length`；总价：对 `cartList` 累加 `price * count`；购物车有数据时高亮 |
| **购物车列表** | 用 `cartList` 遍历渲染；增减数量、清空对应 RTK 中 reducer，组件中 dispatch |
| **购物车显隐** | 组件内 `useState` 控制显示/隐藏；点击统计区显示，点击蒙层隐藏 |

| 技术点     | 说明 |
| ---------- | ---- |
| **RTK**    | 管理 foodsList、activeIndex、cartList 等 |
| **异步 action** | 请求分类与商品数据 |
| **useSelector / useDispatch** | 组件消费 store 并派发 action |
