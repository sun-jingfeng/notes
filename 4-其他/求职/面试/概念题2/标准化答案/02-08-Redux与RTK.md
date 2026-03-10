# Redux / RTK 状态管理

## 一、单向数据流

Redux 的数据流是**单向**的：

```
dispatch(action) → reducer（纯函数）→ 新 state → 订阅者（如 UI）更新
```

- **action**：描述“发生了什么”的普通对象，一般有 `type` 和可选 `payload`。
- **reducer**：`(state, action) => newState` 的纯函数，根据 action 算出新 state，不改原 state。
- **store**：持有 state、提供 `getState()`、`dispatch()`、`subscribe()`。

***

## 二、不可变更新

**reducer 必须返回新对象/新数组**，不能直接改原 state，这样才能保证引用变化可被检测，便于时间旅行、diff 等。

```js
// ❌ 错误
state.list.push(item)

// ✅ 正确
return { ...state, list: [...state.list, item] }
```

**RTK（Redux Toolkit）** 内置 **Immer**，在 `createSlice` 的 reducer 里可以写“可变”语法，由 Immer 转成不可变更新。

```js
reducers: {
  addItem(state, action) {
    state.list.push(action.payload)  // Immer 下合法
  }
}
```

***

## 三、中间件与异步

- **redux-thunk**：允许 `dispatch` 接收函数；在函数里做异步请求，完成后再 `dispatch` 同步 action。RTK 默认已集成 thunk。
- 其它中间件：日志（如 redux-logger）、持久化、saga 等，通过 `configureStore` 的 `middleware` 配置。

***

## 四、RTK 核心 API

| API | 作用 |
| --- | --- |
| **createSlice** | 按“切片”定义 `initialState`、`reducers`（含 action type 与 reducer），自动生成 action creators 和 reducer |
| **configureStore** | 创建 store，内置 thunk、DevTools 等 |
| **RTK Query** | 提供 createApi、请求封装、缓存、标签失效等，类似 React Query 的用法 |

***

## 五、面试答题要点

- **单向数据流**：dispatch(action) → reducer → 新 state → 视图更新。
- **不可变**：reducer 返回新 state；RTK 的 createSlice 里可用 Immer 写“可变”逻辑。
- **中间件**：thunk 处理异步；RTK 默认带 thunk；日志、持久化等可再加中间件。
- **RTK**：createSlice 自动生成 action 和 reducer；RTK Query 做请求与缓存。
