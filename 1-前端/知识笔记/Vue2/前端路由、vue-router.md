# 前端路由、vue-router

## 一、什么是路由

路由本质上是“路径和处理结果之间的对应关系”。

在前端项目里，可以简单理解为：URL 和页面组件之间的映射关系。

---

## 二、为什么 SPA 需要前端路由

SPA 只有一个 HTML 页面，页面切换主要依赖组件切换，而不是整页重新加载。

这时就需要前端路由来决定：当前地址应该渲染哪个组件。

| 场景       | 多页应用            | 单页应用   |
| ---------- | ------------------- | ---------- |
| 页面切换   | 浏览器重新请求 HTML | 只切换组件 |
| 路由处理方 | 服务端              | 前端路由库 |
| 用户体验   | 会有整页刷新        | 更流畅     |

---

## 三、前端路由的工作原理

前端路由的典型流程如下：

```text
用户点击链接
  -> URL 发生变化
  -> 路由系统监听到变化
  -> 找到匹配的路由规则
  -> 渲染对应组件
```

现代项目里通常有两种模式：

| 模式      | 示例      | 特点                           |
| --------- | --------- | ------------------------------ |
| `hash`    | `/#/home` | 部署简单，不依赖服务端额外配置 |
| `history` | `/home`   | URL 更自然，需要服务端兜底配置 |

### 3.1 怎么选

1. 静态部署或服务端不方便配合时，用 `hash` 更稳。
2. 想要更自然的 URL，并且能控制服务端兜底时，用 `history`。

---

## 四、什么是 vue-router

`vue-router` 是 Vue 官方提供的路由解决方案，用来管理 SPA 中的页面切换。

Vue2 项目通常使用 `vue-router@3`。

它提供的核心能力包括：

1. 路由匹配。
2. 页面跳转。
3. 嵌套路由。
4. 动态路由参数。
5. 导航守卫。

---

## 五、vue-router 的基本使用

### 5.1 安装

```bash
npm install vue-router@3
```

### 5.2 创建路由模块

```js
import Vue from "vue"
import VueRouter from "vue-router"
import Home from "@/views/Home.vue"
import About from "@/views/About.vue"

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: "/", redirect: "/home" },
    { path: "/home", component: Home },
    { path: "/about", component: About },
  ],
})
```

### 5.3 在入口文件挂载

```js
new Vue({
  router,
  render: h => h(App),
}).$mount("#app")
```

### 5.4 声明链接和占位符

```html
<router-link to="/home">首页</router-link> <router-view></router-view>
```

| 组件          | 作用                   |
| ------------- | ---------------------- |
| `router-link` | 声明式导航链接         |
| `router-view` | 路由匹配组件的渲染出口 |

---

## 六、常见路由配置

### 6.1 重定向

```js
{ path: "/", redirect: "/home" }
```

### 6.2 路由模式

```js
const router = new VueRouter({
  mode: "history",
  routes: [],
})
```

如果使用 `history` 模式，服务端需要把未知路径统一重定向到入口页。

### 6.3 激活样式

`router-link` 在当前路由激活时会自动加类名，例如 `router-link-active`。

### 6.4 路由元信息 `meta`

在真实项目里，经常会给路由增加 `meta` 字段，用来描述：

1. 是否需要登录。
2. 页面标题。
3. 菜单高亮标识。

```js
{ path: "/profile", component: Profile, meta: { requiresAuth: true } }
```

---

## 七、嵌套路由

嵌套路由适合“页面里再套一层局部页面”的场景，例如用户中心里的“资料页 / 安全页 / 订单页”。

```js
{
  path: "/user",
  component: Layout,
  children: [
    { path: "profile", component: TabProfile },
    { path: "setting", component: TabSetting },
  ],
}
```

父组件中要有子出口：

```html
<router-view></router-view>
```

### 7.1 一个常见误区

只配了 `children`，但父组件里没有 `<router-view>`，这时子路由内容是渲染不出来的。

---

## 八、动态路由匹配

### 8.1 为什么需要动态路由

如果文章详情页每篇文章都写一条固定路由，维护成本会非常高。

动态路由允许把可变部分定义成参数。

```js
{ path: "/article/:id", component: ArticleDetail }
```

### 8.2 获取参数

```js
this.$route.params.id
```

### 8.3 用 `props` 简化接收

```js
{ path: "/article/:id", component: ArticleDetail, props: true }
```

组件中就可以直接通过 `props` 接收。

### 8.4 `params` 和 `query` 的区别

| 对比项   | params               | query                    |
| -------- | -------------------- | ------------------------ |
| 示例     | `/article/1`         | `/article?id=1`          |
| 配置方式 | 常配合动态路由       | 不需要在 path 中提前声明 |
| 获取方式 | `this.$route.params` | `this.$route.query`      |

一个判断标准：

1. 资源路径的一部分，更像 `params`。
2. 筛选条件、可选参数，更像 `query`。

---

## 九、声明式导航与编程式导航

### 9.1 声明式导航

```html
<router-link to="/home">首页</router-link>
```

### 9.2 编程式导航

```js
this.$router.push("/home")
this.$router.replace("/login")
this.$router.go(-1)
```

| API       | 作用                |
| --------- | ------------------- |
| `push`    | 跳转并新增历史记录  |
| `replace` | 跳转并替换当前记录  |
| `go(n)`   | 前进 / 后退指定步数 |

### 9.3 一个实战判断

1. 用户正常页面跳转，用 `push`。
2. 登录后不希望返回登录页，常用 `replace`。

---

## 十、路由守卫

导航守卫本质上是在路由跳转前后插入一层控制逻辑，用来做权限校验、登录校验、页面标题设置等。

### 10.1 全局前置守卫

```js
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token")

  if (to.path !== "/login" && !token) {
    next("/login")
    return
  }

  next()
})
```

### 10.2 常见守卫类型

1. 全局守卫：控制全局跳转。
2. 路由独享守卫：只控制某条路由。
3. 组件内守卫：更靠近当前页面组件。

### 10.3 `next` 的常见写法

| 写法             | 含义           |
| ---------------- | -------------- |
| `next()`         | 正常放行       |
| `next("/login")` | 跳转到指定路由 |
| `next(false)`    | 中断当前导航   |

### 10.4 一个实际用途

守卫除了做登录校验，还常用于：

1. 根据 `meta.title` 更新标题。
2. 权限页面拦截。
3. 页面离开前数据确认。

---

## 十一、`$route` 和 `$router` 的区别

| 对象      | 含义                       |
| --------- | -------------------------- |
| `$route`  | 当前路由信息对象           |
| `$router` | 路由实例对象，负责导航操作 |

常见例子：

```js
console.log(this.$route.path)
console.log(this.$route.query)
console.log(this.$route.params)

this.$router.push("/home")
```

---

## 十二、一些开发细节

### 12.1 同组件复用问题

当不同路由映射到同一个组件时，组件实例可能会被复用，这时参数变化不一定会重新走完整生命周期。

常见处理方式：

1. 监听 `$route`。
2. 使用 `beforeRouteUpdate`。
3. 给 `router-view` 绑定 `key`。

```html
<router-view :key="$route.fullPath"></router-view>
```

### 12.2 路由懒加载

真实项目里常用按路由拆包，减少首屏体积：

```js
const User = () => import("@/views/User.vue")
```

### 12.3 404 页面

通常会增加兜底路由：

```js
{ path: "*", component: NotFound }
```

---

## 十三、小结

1. 前端路由是 URL 和页面组件之间的映射关系，`vue-router` 是 Vue2 项目中的主流方案。
2. `hash` 和 `history` 的核心差别，不只是地址长相，还在于是否需要服务端兜底。
3. 动态路由、嵌套路由、编程式导航、导航守卫，是业务开发中最常用的几块能力。
4. `params`、`query`、`$route`、`$router` 这些概念要分清，不然后续业务跳转很容易混乱。
5. 学这一篇时，重点不是只会配基础路由，而是理解“页面切换、参数传递、权限控制、组件复用”这几条主线。
