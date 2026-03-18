# Vue3 和 Vue2 的区别有哪些

**一句话回答：** Vue3 相比 Vue2 的升级主要体现在响应式实现、代码组织方式、性能优化、TypeScript 支持和生态演进上。

***

## 一、核心差异总览

| 维度 | **Vue2** | **Vue3** |
| --- | --- | --- |
| **代码组织** | Options API 为主 | 新增 Composition API，逻辑更聚合 |
| **响应式** | `Object.defineProperty` | `Proxy` |
| **性能** | 运行时优化有限 | 编译器和运行时都重写，静态提升、Patch Flag 更强 |
| **TypeScript** | 支持偏补丁式 | 设计时就面向 TS |
| **组件能力** | 单根节点限制明显 | Fragment、Teleport、Suspense 等能力更完整 |

***

## 二、最容易被问到的几个点

### 1. Composition API

- Vue2 常把同一功能拆在 `data`、`methods`、`computed`、`watch` 里。
- Vue3 可以把同一业务逻辑集中在 `setup()` 中，更利于抽离成组合式函数。

### 2. 应用实例与全局 API

- Vue2 通过 `new Vue()` 创建根实例。
- Vue3 使用 `createApp()`，插件、组件、指令都挂在 `app` 实例上，更适合多应用场景。

### 3. 模板与生态变化

| 变化 | 说明 |
| --- | --- |
| **`v-model` 语义调整** | 默认改为 `modelValue` 和 `update:modelValue` |
| **过滤器移除** | 推荐用计算属性或普通函数代替 |
| **状态管理演进** | Vuex 仍可用，但 Pinia 更主流 |
| **路由版本升级** | Vue3 搭配 `vue-router@4` |

***

## 三、面试答题模板

可以直接答：**Vue3 和 Vue2 的差异主要有五类：一是 Composition API 让逻辑组织更聚合；二是响应式从 `Object.defineProperty` 升级到 `Proxy`；三是编译器和运行时重写后性能更好；四是 TypeScript 支持更完善；五是全局 API、`v-model`、Fragment、Teleport 等能力都有升级。**
