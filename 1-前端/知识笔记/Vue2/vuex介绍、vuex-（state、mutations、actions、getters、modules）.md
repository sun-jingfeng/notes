# vuex 介绍（state、mutations、actions、getters、modules）

## 一、一句话理解

Vuex 的核心不是“多放一个全局对象”，而是把共享状态的读取、修改和追踪链路统一起来。

---

## 二、什么是 Vuex

**Vuex** 是 Vue2 生态里常见的集中式状态管理方案，用来统一管理多个组件共享的数据。

它解决的核心问题不是“组件能不能通信”，而是“共享状态是否集中、可追踪、可维护”。

---

## 三、为什么需要 Vuex

当项目变大后，组件之间的数据流会越来越复杂：

1. 多个页面都要读取同一份数据。
2. 多个组件都可能修改同一份数据。
3. 需要知道“是谁、在什么时候、以什么方式改了状态”。

| 场景         | 不使用 Vuex 的问题 | 使用 Vuex 的收益       |
| ------------ | ------------------ | ---------------------- |
| 用户信息     | 多处重复维护       | 全局统一读取           |
| 购物车数量   | 组件状态不同步     | 所有组件共享同一状态源 |
| 异步请求结果 | 修改链路分散       | 修改过程可追踪         |

### 适合放进 Vuex 的数据

适合：

1. 登录用户信息。
2. 购物车、主题、权限、字典数据。
3. 多页面都会依赖的共享状态。

不适合：

1. 某个页面局部临时状态。
2. 只在单个组件中使用的数据。

结论：**多个组件共享的状态才值得放进 Vuex**。

一个反向判断也很有用：如果一个状态离开当前页面就没有价值，那它大概率不该进 Vuex。

---

## 四、Vuex 的核心概念

Vuex 最常用的 5 个核心概念如下：

| 配置项      | 作用             | 类比                |
| ----------- | ---------------- | ------------------- |
| `state`     | 全局状态数据源   | 组件里的 `data`     |
| `mutations` | 同步修改状态     | 专门改数据的方法    |
| `actions`   | 处理异步逻辑     | 异步业务方法        |
| `getters`   | 基于状态派生数据 | 组件里的 `computed` |
| `modules`   | 按业务拆分 store | 大项目分目录管理    |

可以把 Vuex 简化理解为：

```text
组件读取 state / getters
组件通过 commit / dispatch 触发修改
mutations / actions 再去更新状态
```

---

## 五、基础使用流程

### 1. 安装与初始化

Vue2 项目常见安装方式：

```bash
npm install vuex@3
```

创建 `store/index.js`：

```js
import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  getters: {},
})
```

在入口文件挂载：

```js
import Vue from "vue"
import App from "./App.vue"
import store from "./store"

new Vue({
  store,
  render: h => h(App),
}).$mount("#app")
```

---

## 六、state

### 1. state 是什么

`state` 是 Vuex 中的全局状态数据源。

```js
export default new Vuex.Store({
  state: {
    count: 100,
    userInfo: {
      id: 1,
      username: "admin",
    },
  },
})
```

### 2. 使用 state 的两种方式

#### 直接使用

```js
this.$store.state.count
```

#### 映射使用

```js
import { mapState } from "vuex"

export default {
  computed: {
    ...mapState(["count"]),
  },
}
```

对象写法也很常见：

```js
...mapState({
  totalCount: "count"
})
```

### 3. 注意点

1. `state` 是响应式的。
2. 页面中只要依赖了 `state`，状态变化后视图会自动更新。
3. 不建议在组件中直接随意改 `state`，统一走 `mutations`。

---

## 七、mutations

### 1. mutations 是什么

`mutations` 用来**同步修改** `state`。

```js
export default new Vuex.Store({
  state: {
    count: 100,
  },
  mutations: {
    addCount(state, value) {
      state.count += value
    },
    subCount(state, value) {
      state.count -= value
    },
    setCount(state, value) {
      state.count = value
    },
  },
})
```

### 2. 触发 mutations

#### 直接提交

```js
this.$store.commit("addCount", 5)
```

#### 映射提交

```js
import { mapMutations } from "vuex"

export default {
  methods: {
    ...mapMutations(["addCount", "subCount"]),
  },
}
```

### 3. 为什么 mutations 只能写同步代码

因为 Vuex 希望每次状态变化都能被开发工具清晰记录。如果 mutation 内部写异步逻辑，状态修改的时机就会变得不可预测。

结论：

1. **改状态只能通过 mutations**。
2. **mutations 只写同步逻辑**。

---

## 八、actions

### 1. actions 是什么

`actions` 用来处理异步逻辑，但它本身通常不直接改状态，而是提交给 `mutations`。

```js
export default new Vuex.Store({
  state: {
    count: 0,
  },
  mutations: {
    addCount(state, value) {
      state.count += value
    },
  },
  actions: {
    asyncAddCount(context, value) {
      setTimeout(() => {
        context.commit("addCount", value)
      }, 1000)
    },
  },
})
```

### 2. 触发 actions

#### 直接派发

```js
this.$store.dispatch("asyncAddCount", 10)
```

#### 映射使用

```js
import { mapActions } from "vuex"

export default {
  methods: {
    ...mapActions(["asyncAddCount"]),
  },
}
```

### 3. actions 和 mutations 的区别

| 对比项             | actions      | mutations |
| ------------------ | ------------ | --------- |
| 是否适合异步       | 是           | 否        |
| 是否直接修改 state | 一般不直接改 | 是        |
| 调用方式           | `dispatch`   | `commit`  |

### 4. 一个实战判断

如果这段逻辑只是“立刻同步改状态”，优先放 `mutations`；如果涉及接口、定时器、异步串联或流程控制，再放 `actions`。

---

## 九、getters

### 1. getters 是什么

`getters` 可以理解为 Vuex 中的全局计算属性。

```js
export default new Vuex.Store({
  state: {
    goodsList: [
      { id: 1, goods_count: 2, goods_price: 10, goods_state: true },
      { id: 2, goods_count: 1, goods_price: 20, goods_state: false },
    ],
  },
  getters: {
    allCount(state) {
      return state.goodsList.reduce((sum, item) => {
        return item.goods_state ? sum + item.goods_count : sum
      }, 0)
    },
    allPrice(state) {
      return state.goodsList.reduce((sum, item) => {
        return item.goods_state
          ? sum + item.goods_count * item.goods_price
          : sum
      }, 0)
    },
  },
})
```

### 2. 使用 getters

#### 直接使用

```js
this.$store.getters.allCount
```

#### 映射使用

```js
import { mapGetters } from "vuex"

export default {
  computed: {
    ...mapGetters(["allCount", "allPrice"]),
  },
}
```

### 3. 适用场景

1. 购物车总数。
2. 已选商品总价。
3. 过滤后的列表结果。

---

## 十、modules

### 1. 为什么要分模块

当项目越来越大时，所有状态都写在一个 store 里，会导致：

1. `state` 很臃肿。
2. mutation 名称容易冲突。
3. 不同业务难以拆分维护。

这时就需要用 `modules` 按业务拆分。

### 2. 基本写法

```js
// store/modules/user.js
export default {
  state: {
    token: "",
    userInfo: null,
  },
  mutations: {
    setToken(state, token) {
      state.token = token
    },
  },
  actions: {},
  getters: {},
}
```

```js
// store/modules/cart.js
export default {
  state: {
    list: [],
  },
  mutations: {
    setCartList(state, list) {
      state.list = list
    },
  },
}
```

```js
// store/index.js
import Vue from "vue"
import Vuex from "vuex"
import user from "./modules/user"
import cart from "./modules/cart"

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    cart,
  },
})
```

### 3. 分模块后的 state 读取

```js
this.$store.state.user.token
this.$store.state.cart.list
```

映射时：

```js
...mapState({
  token: (state) => state.user.token
})
```

### 4. 一个拆分思路

模块通常更适合按**业务域**拆，而不是机械按 `state`、`actions`、`mutations` 数量来拆。

例如：

1. 用户模块。
2. 权限模块。
3. 购物车模块。
4. 订单模块。

---

## 十一、命名空间 namespaced

### 1. 为什么要开启命名空间

模块多起来后，不同模块里的 `setList`、`setToken`、`addCount` 等名称很容易冲突。

这时可以在模块里配置：

```js
export default {
  namespaced: true,
  state: {
    token: "",
  },
  mutations: {
    setToken(state, token) {
      state.token = token
    },
  },
}
```

### 2. 开启命名空间后的调用方式

#### state

```js
this.$store.state.user.token
```

#### mutations

```js
this.$store.commit("user/setToken", "abc")
```

#### actions

```js
this.$store.dispatch("user/getUserInfo")
```

#### getters

```js
this.$store.getters["user/userName"]
```

#### 映射写法

```js
...mapState("user", ["token"])
...mapMutations("user", ["setToken"])
...mapActions("user", ["getUserInfo"])
...mapGetters("user", ["userName"])
```

命名空间解决的不只是“名字冲突”，更重要的是让模块边界更清楚。

---

## 十二、一个完整的 Vuex 数据流

推荐按下面这条链路理解：

```text
组件触发事件
  -> dispatch action（异步）
  -> commit mutation（同步）
  -> 修改 state
  -> 视图自动更新
```

如果没有异步，也可以直接：

```text
组件
  -> commit mutation
  -> state 改变
  -> 页面更新
```

---

## 十三、Vuex 的适用边界

### 1. 什么时候值得上 Vuex

1. 页面较多。
2. 共享状态较多。
3. 状态修改链路需要统一管理。

### 2. 什么时候没必要

1. 只有简单父子通信。
2. 页面很少，状态都在局部组件内。
3. 用 `props`、`emit` 就能解决。

### 3. 现代补充

在 Vue3 中，**Pinia** 已经逐渐成为更主流的状态管理方案；但 Vue2 老项目里，Vuex 仍然非常常见。

---

## 十四、真实项目里的三条经验

1. 不要把所有状态都丢进 Vuex，否则全局状态会越来越重。
2. 异步和同步职责分清，排查问题会轻松很多。
3. 模块边界清楚，比一开始堆很多 API 更重要。

---

## 十五、总结

1. Vuex 是 Vue2 中常见的集中式状态管理方案。
2. `state` 存数据，`mutations` 同步改数据，`actions` 处理异步，`getters` 负责派生值，`modules` 负责拆分大型 store。
3. 多组件共享的数据才应该放进 Vuex。
4. 大项目中通常会配合模块拆分和命名空间一起使用。
5. 学会 Vuex 的关键不是背 API，而是理解“统一状态源 + 可追踪修改链路”。
