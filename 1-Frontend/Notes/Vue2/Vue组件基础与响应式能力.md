# Vue组件基础与响应式能力

## 一、这篇的主线

这一篇虽然混了多个主题，但可以按 Vue 开发流程来理解：

| 阶段           | 主题                              |
| -------------- | --------------------------------- |
| **工程搭建**   | `vue-cli`                         |
| **组件组织**   | Vue 组件、注册、`props`、`scoped` |
| **响应式使用** | `watch`、`computed`               |
| **响应式边界** | `$set` / `$delete`、数组变更方法  |

也就是说，它讲的是一个 Vue2 项目从“创建”到“组件化”再到“响应式数据处理”的基本链路。

---

## 二、`watch` 侦听器

`watch` 用来监听数据变化，并在数据变化时执行自定义逻辑。

最常见的用途有：

1. 监听输入框内容变化后发请求。
2. 监听路由参数变化重新拉取数据。
3. 监听对象字段变化后执行额外副作用。

### 2.1 基本写法

```js
export default {
  data() {
    return {
      username: "",
    }
  },
  watch: {
    username(newVal, oldVal) {
      console.log("新值：", newVal)
      console.log("旧值：", oldVal)
    },
  },
}
```

### 2.2 常见选项

`immediate`：初始化时立即执行一次。

```js
watch: {
  username: {
    immediate: true,
    handler(newVal) {
      console.log("立即执行：", newVal)
    },
  },
}
```

`deep`：深度监听对象内部变化。

```js
watch: {
  userInfo: {
    deep: true,
    handler(newVal) {
      console.log("对象内部变化：", newVal)
    },
  },
}
```

### 2.3 监听单个嵌套字段

```js
watch: {
  "userInfo.username"(newVal) {
    console.log(newVal)
  },
}
```

### 2.4 `watch` 适合什么场景

`watch` 更适合做“副作用”，例如：

1. 发请求。
2. 写本地缓存。
3. 调第三方库。
4. 根据变化执行异步逻辑。

---

## 三、计算属性 `computed`

计算属性是“根据已有数据计算出来的新属性”。

```js
export default {
  data() {
    return {
      firstName: "张",
      lastName: "三",
    }
  },
  computed: {
    fullName() {
      return this.firstName + this.lastName
    },
  },
}
```

模板中直接当属性使用：

```html
<p>{{ fullName }}</p>
```

### 3.1 计算属性的特点

| 特点         | 说明                         |
| ------------ | ---------------------------- |
| 本质上是属性 | 使用时不需要加 `()`          |
| 有缓存       | 依赖不变时不会重复计算       |
| 适合派生值   | 例如总价、拼接文本、过滤结果 |

### 3.2 `computed` 和 `methods` 的区别

| 对比项   | `computed`           | `methods`              |
| -------- | -------------------- | ---------------------- |
| 调用方式 | 当属性使用           | 当函数调用             |
| 是否缓存 | 是                   | 否                     |
| 适合场景 | 基于已有数据推导结果 | 执行业务动作或复杂逻辑 |

### 3.3 `watch` 和 `computed` 怎么选

| 需求               | 更适合     |
| ------------------ | ---------- |
| 由已有状态推导新值 | `computed` |
| 数据变化后做副作用 | `watch`    |

一个常见判断标准：

1. 如果你是“算出一个值”，优先 `computed`。
2. 如果你是“变化后去做一件事”，优先 `watch`。

---

## 四、响应式的边界：Vue2 检测不到的变化

Vue2 的响应式基于 `Object.defineProperty`，它只能劫持**创建实例时就已存在**的属性。由此带来两类检测不到的变化，也是 Vue2 最高频的一个坑：**数据明明改了，页面就是不动。**

### 4.1 对象：新增和删除属性

```js
this.userInfo.age = 20 // ❌ age 原本不存在，视图不会更新
delete this.userInfo.name // ❌ 删除属性，视图同样不会更新
```

正确写法：

```js
this.$set(this.userInfo, "age", 20)
this.$delete(this.userInfo, "name")
```

`Vue.set()` / `Vue.delete()` 是全局写法，组件内部更常用 `this.$set()` / `this.$delete()`，两者作用一致。

### 4.2 一次新增多个属性

直接用 `Object.assign` 改原对象同样无效，要**生成新对象再整体赋值**：

```js
// ❌ 在原对象上加属性，检测不到
Object.assign(this.userInfo, { age: 20, city: "北京" })

// ✅ 换成新对象，触发的是 userInfo 自身的赋值
this.userInfo = Object.assign({}, this.userInfo, { age: 20, city: "北京" })
```

### 4.3 数组：两种检测不到的写法

```js
this.list[0] = "新值" // ❌ 通过索引直接赋值
this.list.length = 2 // ❌ 直接修改 length
```

正确写法：

```js
this.$set(this.list, 0, "新值")
this.list.splice(0, 1, "新值") // 等价写法
this.list.splice(2) // 相当于把长度截断到 2
```

### 4.4 哪些数组方法本来就是响应式的

Vue2 重写了 7 个会改变原数组的方法，直接调用即可触发更新：

| 类型                       | 方法                                                          | 用法要点               |
| -------------------------- | ------------------------------------------------------------- | ---------------------- |
| **变更方法**（Vue2 已重写） | `push`、`pop`、`shift`、`unshift`、`splice`、`sort`、`reverse` | 直接调用就会更新视图   |
| **替换方法**（返回新数组） | `filter`、`concat`、`slice`、`map`                            | 不改原数组，要把结果赋回去 |

```js
this.list.push(item) // ✅ 直接生效
this.list = this.list.filter(item => item.done) // ✅ 赋值回去才生效
```

### 4.5 排查“数据变了但页面没动”的顺序

1. 改的是不是一个**原本不存在**的属性。
2. 改数组用的是不是**索引赋值**或 `length`。
3. 是不是用 `Object.assign` 直接改了原对象。
4. 以上都排除后，再去看 `computed` 缓存、`key` 复用、组件是否真的重新渲染。

> **注意**：`$set` 只能给**响应式对象**补属性，不能用来给 `data` 根级对象本身加新属性；根级字段要在 `data()` 里先声明出来，哪怕初始值是 `null`。

### 4.6 Vue3 为什么没有这个问题

Vue3 改用 `Proxy` 代理整个对象，能拦截属性的新增、删除和数组索引写入，因此 `Vue.set` / `Vue.delete` 在 Vue3 中已被移除，直接赋值即可。

| 版本     | 底层机制                | 新增属性 / 索引赋值    |
| -------- | ----------------------- | ---------------------- |
| **Vue2** | `Object.defineProperty` | 检测不到，需要 `$set`  |
| **Vue3** | `Proxy`                 | 直接支持，无需额外 API |

这也是为什么从 Vue2 迁到 Vue3 后，很多 `$set` 调用可以直接删掉。

---

## 五、`vue-cli`

### 5.1 什么是 SPA

单页面应用程序 SPA 指整个网站通常只有一个 HTML 页面，页面切换主要依赖前端路由和组件切换完成。

优点：

1. 页面切换更流畅。
2. 前后端职责更清晰。
3. 更适合中后台系统和交互复杂的应用。

### 5.2 什么是 `vue-cli`

`vue-cli` 是 Vue 官方提供的脚手架工具，用于快速创建工程化 Vue 项目。

它帮开发者提前配置了：

1. 工程目录结构。
2. 构建工具配置。
3. 开发服务器。
4. 代码编译与打包能力。

### 5.3 常见命令

```bash
npm install -g @vue/cli
vue create my-project
cd my-project
npm run serve
```

### 5.4 一个当下语境提醒

在 Vue2 学习资料里，`vue-cli` 很常见；但现代新项目里，很多团队会优先用 Vite。也就是说，这部分知识更偏“Vue2 工程化历史主流方案”。

### 5.5 Vue CLI 项目的基本运行流程

1. `index.html` 提供挂载点。
2. `main.js` 创建 Vue 实例。
3. `App.vue` 作为根组件被渲染到页面上。

```js
import Vue from "vue"
import App from "./App.vue"

new Vue({
  render: h => h(App),
}).$mount("#app")
```

---

## 六、Vue 组件

### 6.1 什么是组件化开发

组件化开发就是把页面上可复用的结构和逻辑拆分成独立组件，按需组合使用。

比如：按钮、弹窗、导航栏、表单项、表格，都可以被封装成组件。

### 6.2 单文件组件 `.vue`

Vue 中常见组件文件后缀是 `.vue`，通常由 3 个部分组成：

| 部分       | 作用         |
| ---------- | ------------ |
| `template` | 组件模板结构 |
| `script`   | 组件逻辑     |
| `style`    | 组件样式     |

```vue
<template>
  <div class="card">{{ title }}</div>
</template>

<script>
export default {
  data() {
    return {
      title: "我是组件",
    }
  },
}
</script>

<style>
.card {
  padding: 12px;
}
</style>
```

### 6.3 Vue2 里的两个高频规则

1. `template` 内部通常要求只有一个根节点。
2. 组件中的 `data` 必须是函数，避免多个实例共享同一份状态。

```js
export default {
  data() {
    return {
      count: 0,
    }
  },
}
```

---

## 七、组件注册与 `props`

### 7.1 局部注册和全局注册

局部注册的组件只能在当前组件中使用：

```js
import MyHeader from "./components/MyHeader.vue"

export default {
  components: {
    MyHeader,
  },
}
```

全局注册后，很多地方都能直接使用：

```js
import Vue from "vue"
import BaseButton from "./components/BaseButton.vue"

Vue.component("BaseButton", BaseButton)
```

通常来说：

1. 局部注册更利于管理依赖。
2. 全局注册更适合非常通用的基础组件。

### 7.2 `props`

`props` 是父组件传给子组件的数据接口，是提高组件复用性的关键。

```js
export default {
  props: {
    title: {
      type: String,
      required: true,
      default: "默认标题",
    },
  },
}
```

### 7.3 `props` 的注意点

1. `props` 是只读的。
2. 子组件不应该直接修改 `props`。
3. 如果要改，通常先转存到自己的 `data`，或者通过 `$emit` 通知父组件修改。

```js
props: {
  count: Number,
},
data() {
  return {
    localCount: this.count,
  }
}
```

---

## 八、`scoped` 样式

默认情况下，组件中的样式可能影响到别的组件。

给 `style` 加上 `scoped`，Vue 会自动为当前组件生成作用域标记，减少样式冲突。

```vue
<style scoped>
.title {
  color: red;
}
</style>
```

### 8.1 样式穿透

当父组件使用了 `scoped`，但又想影响子组件内部元素时，需要使用深度选择器。旧项目中常见 `/deep/`、`>>>`，不同构建链路写法略有差异。

不过要谨慎使用，因为它会削弱样式隔离。

---

## 九、这些能力在组件里怎么配合

可以这样理解：

1. `props` 负责把数据传进组件。
2. `computed` 负责从已有数据中推导出新结果。
3. `watch` 负责监听数据变化并执行副作用。
4. 组件负责把结构、逻辑和样式封装起来。

这也是 Vue2 组件开发最常见的一条主线。

---

## 十、小结

1. `watch` 适合监听变化并执行副作用，常见配置有 `immediate` 和 `deep`。
2. 计算属性适合做有缓存的派生数据，和 `watch` 的职责不同。
3. Vue2 基于 `Object.defineProperty`，检测不到「对象新增/删除属性」和「数组索引赋值、改 `length`」，要用 `$set` / `$delete` 或数组变更方法。
4. `vue-cli` 是 Vue2 学习和旧项目里很重要的工程化工具，但现代新项目常常会优先考虑 Vite。
5. 组件化是 Vue 项目开发的核心方式，`props`、注册方式、`scoped` 样式都是日常高频能力。
6. 学这一篇时，重点不是把几个词拆开背，而是把它们放回“一个 Vue2 项目如何开发”的流程里理解。
