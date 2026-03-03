## 一、前端路由概念

### 1.1 什么是前端路由

**前端路由** 指由前端根据当前 URL 路径决定渲染哪个组件的机制：一个 **path** 对应一个 **component**，切换路径时由路由库负责更新视图，不向服务器请求整页。

**核心价值：** 单页应用（SPA）内实现多“页面”切换与书签/刷新可用的路径，无需每次整页刷新。

| 概念           | 说明 |
| -------------- | ---- |
| **path**       | 浏览器地址栏中的路径（如 `/login`、`/article`） |
| **component**  | 该路径要渲染的 React 组件 |

**Vue 3 对照：**

React 和 Vue 都依赖客户端路由库实现 SPA 内的多页面切换，分别使用 **React Router** 和 **Vue Router**：

| 对比项 | React Router | Vue Router |
| ------ | ------------ | ---------- |
| **定位** | 社区维护的路由库 | Vue 官方配套路由库 |
| **安装** | `npm i react-router` | `npm i vue-router` |
| **路由配置** | JS 对象数组（`createBrowserRouter`） | JS 对象数组（`createRouter`） |
| **路由出口** | `<Outlet />` | `<RouterView />` |
| **导航组件** | `<Link>`、`<NavLink>` | `<RouterLink>` |
| **编程式导航** | `useNavigate()` | `useRouter()` → `router.push()` |

***

## 二、React Router 环境准备

### 2.1 安装

```bash
# 使用 Vite 创建项目（推荐；CRA 已弃用）
npm create vite@latest react-router-pro -- --template react
cd react-router-pro

npm install
npm i react-router
npm run dev
```

> 💡 React Router v7 起，`react-router-dom` 已合并回 `react-router`，安装和导入统一使用 `react-router`。`react-router-dom` 仍作为 re-export 可用，但新项目推荐直接用 `react-router`。

### 2.2 快速开始：路由与渲染

访问 `/login` 显示登录页，访问 `/article` 显示文章页的实现步骤：

| 步骤           | 说明 |
| -------------- | ---- |
| **定义路由配置** | path 与 element（组件）的对应关系 |
| **创建 router 实例** | 使用 `createBrowserRouter` 或 `createHashRouter` |
| **根节点渲染**   | 使用 `RouterProvider` 并传入 router |

```jsx
import { createBrowserRouter, RouterProvider } from 'react-router'
import Login from './page/Login'
import Article from './page/Article'

const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  { path: '/article', element: <Article /> }
])

// 入口
root.render(<RouterProvider router={router} />)
```

| API / 组件            | 说明 |
| --------------------- | ---- |
| **createBrowserRouter** | 创建路由配置（history 模式） |
| **RouterProvider**    | 根组件，接收 `router` 并渲染当前匹配的路由 |

### 2.3 Vue 3 对照：Vue Router 配置

Vue Router 使用 `createRouter` 创建路由实例，通过 `app.use(router)` 注册到应用，路由出口用 `<RouterView />`：

```bash
npm i vue-router
```

```js
import { createRouter, createWebHistory } from 'vue-router'
import Login from './views/Login.vue'
import Article from './views/Article.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: Login },
    { path: '/article', component: Article }
  ]
})

// main.ts
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).use(router).mount('#app')
```

```vue
<!-- App.vue -->
<template>
  <RouterView />
</template>
```

| 对比项 | React Router | Vue Router |
| ------ | ------------ | ---------- |
| **创建路由** | `createBrowserRouter(routes)` | `createRouter({ history, routes })` |
| **注入应用** | `<RouterProvider router={router} />` | `app.use(router)` |
| **路由出口** | 嵌套路由中放 `<Outlet />` | 模板中放 `<RouterView />` |
| **路由配置** | `{ path, element: <Comp /> }`（传 JSX） | `{ path, component: Comp }`（传组件引用） |

> 💡 React Router 通过 `element` 传入 JSX，可在路由配置中直接传 props；Vue Router 通过 `component` 传组件引用，传参需借助 `props: true` 或路由参数。

***

## 三、抽象路由模块（推荐结构）

将路由配置抽成独立模块，便于维护与按业务拆分：

| 目录/文件   | 职责 |
| ----------- | ---- |
| **page/**   | 存放页面组件（Login、Article 等） |
| **router/** | 引入页面组件，配置 path 与 element，导出 router 实例 |
| **入口**    | 使用 `RouterProvider` 注入 router |

```
page/Login、Article 等
    ↓ 引入
router 配置 path - element
    ↓ 导出 router
入口用 RouterProvider 注入
```

***

## 四、路由导航

### 4.1 两种导航方式

| 方式           | 说明 | 典型场景 |
| -------------- | ---- | -------- |
| **声明式导航** | 用 `<Link to="...">` 描述跳转目标 | 菜单、导航栏、列表链接 |
| **编程式导航** | 用 **useNavigate** 得到 `navigate`，在逻辑中调用 | 登录成功后跳转、提交后跳转 |

### 4.2 声明式导航：Link 与 NavLink

**Link** 渲染为 `<a>`，点击后切换路由且不整页刷新。**NavLink** 在 Link 基础上支持**激活样式**（当前路径与 `to` 一致时可为该链接添加类名或样式），常用于导航高亮。

```jsx
import { Link, NavLink } from 'react-router'

// 普通链接
<Link to="/article">文章页</Link>

// 带查询参数
<Link to={"/article?id=" + id}>文章</Link>

// 导航高亮：当前路径匹配时自动加 active 类
<NavLink to="/article" className={({ isActive }) => isActive ? 'active' : ''}>
  文章
</NavLink>
```

| 组件/属性   | 说明 |
| ----------- | ---- |
| **Link**   | 声明式跳转，不刷新整页 |
| **to**     | 目标 path；可字符串或对象 `{ pathname, search }` |
| **NavLink** | 同 Link，可通过 `className`/`style` 的 `({ isActive }) => ...` 设置激活样式 |

### 4.3 编程式导航：useNavigate

通过 **useNavigate** 获取 `navigate` 函数，在事件或异步逻辑中跳转。

```jsx
import { useNavigate } from 'react-router'

function Login() {
  const navigate = useNavigate()

  const handleSubmit = async () => {
    await loginApi()
    navigate('/article')           // 跳转并压入一条历史
    navigate('/article', { replace: true })  // 替换当前历史
    navigate(-1)                   // 后退一页
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

| 用法                     | 说明 |
| ------------------------ | ---- |
| **navigate(path)**       | 跳转到 path，新增一条历史记录 |
| **navigate(path, { replace: true })** | 跳转并替换当前记录 |
| **navigate(-1)**         | 后退（负数表示后退层数） |

### 4.4 Vue 3 对照：路由导航

| 对比项 | React Router | Vue Router |
| ------ | ------------ | ---------- |
| **声明式导航** | `<Link to="/path">` | `<RouterLink to="/path">` |
| **激活样式** | `<NavLink>` + `className={({ isActive }) => ...}` | `<RouterLink>` 自动添加 `router-link-active` 类 |
| **编程式导航** | `useNavigate()` → `navigate(path)` | `useRouter()` → `router.push(path)` |
| **替换记录** | `navigate(path, { replace: true })` | `router.replace(path)` |
| **后退** | `navigate(-1)` | `router.go(-1)` 或 `router.back()` |

**声明式导航对比：**

```jsx
// React Router
<Link to="/article">文章</Link>

<NavLink to="/article" className={({ isActive }) => isActive ? 'active' : ''}>
  文章
</NavLink>
```

```vue
<!-- Vue Router：RouterLink 默认为匹配路由添加 router-link-active 类 -->
<RouterLink to="/article">文章</RouterLink>

<!-- 自定义激活类名 -->
<RouterLink to="/article" active-class="active">文章</RouterLink>
```

**编程式导航对比：**

```jsx
// React Router
import { useNavigate } from 'react-router'

const navigate = useNavigate()
navigate('/article')
navigate('/article', { replace: true })
navigate(-1)
```

```vue
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
router.push('/article')
router.replace('/article')
router.back()
</script>
```

> 💡 Vue Router 的 `<RouterLink>` 内置激活类名（`router-link-active` / `router-link-exact-active`），无需手动判断；编程式导航将 `push` 和 `replace` 分成独立方法，React Router 统一用 `navigate` + `options`。

***

## 五、导航传参

### 5.1 常见方式

| 方式             | 说明 | 读取方式 |
| ---------------- | ---- | -------- |
| **searchParams** | URL 查询参数，如 `/article?id=1` | **useSearchParams()** |
| **params**       | 动态路径参数，如 `/article/:id` | **useParams()** |

### 5.2 searchParams 示例

跳转时在 `to` 或 `navigate` 中带查询串，目标页用 **useSearchParams** 读取与修改：

```jsx
// 跳转
<Link to={"/article?id=" + id}>文章</Link>
// 或
navigate('/article?id=1')

// 目标页读取与更新
import { useSearchParams } from 'react-router'

function Article() {
  const [searchParams, setSearchParams] = useSearchParams()
  const id = searchParams.get('id')
  // 更新查询参数（会触发重新渲染并更新 URL）
  const changePage = (p) => setSearchParams({ ...Object.fromEntries(searchParams), page: p })
  return <div>文章 id: {id}</div>
}
```

| API                    | 说明 |
| ---------------------- | ---- |
| **searchParams.get(key)** | 获取单个查询参数 |
| **setSearchParams(obj)**  | 更新 URL 查询参数并触发匹配与渲染 |

### 5.3 动态路径参数示例

路由配置中用 **:id** 占位，目标页用 **useParams** 读取：

```jsx
// 路由配置
{ path: '/article/:id', element: <Article /> }

// 跳转
<Link to={"/article/" + id}>文章</Link>

// 目标页读取
import { useParams } from 'react-router'

function Article() {
  const { id } = useParams()
  return <div>文章 id: {id}</div>
}
```

### 5.4 Vue 3 对照：路由传参

| 方式 | React Router | Vue Router |
| ---- | ------------ | ---------- |
| **查询参数** | `navigate('/article?id=1')` + `useSearchParams()` | `router.push({ path: '/article', query: { id: 1 } })` + `useRoute().query` |
| **动态路径参数** | 配置 `:id` + `useParams()` | 配置 `:id` + `useRoute().params` |

**查询参数对比：**

```jsx
// React Router
navigate('/article?id=1')

const [searchParams] = useSearchParams()
const id = searchParams.get('id')
```

```vue
<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

router.push({ path: '/article', query: { id: 1 } })
const id = route.query.id  // 响应式，路由变化时自动更新
</script>
```

**动态路径参数对比：**

```jsx
// React Router
// 路由配置：{ path: '/article/:id', element: <Article /> }
const { id } = useParams()
```

```vue
<!-- Vue Router -->
<!-- 路由配置：{ path: '/article/:id', component: Article } -->
<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const id = route.params.id
</script>
```

| 对比项 | React Router | Vue Router |
| ------ | ------------ | ---------- |
| **获取路由信息** | `useSearchParams`、`useParams` 分开使用 | `useRoute()` 统一返回 `query`、`params`、`path` 等 |
| **响应式** | `useSearchParams` 返回类似 `URLSearchParams` 的对象 | `route.query` / `route.params` 是响应式对象 |
| **修改查询参数** | `setSearchParams({ key: value })` | `router.push({ query: { key: value } })` |

***

## 六、嵌套路由

### 6.1 概念

**嵌套路由** 指在一级路由下再配置子路由（二级路由）。父路由负责布局（如侧栏 + 顶栏），子路由在父组件内的 **Outlet** 位置渲染。

### 6.2 配置方式

| 步骤 | 说明 |
| ---- | ---- |
| 1    | 在一级路由上使用 **children** 配置子路由 |
| 2    | 在父组件中放置 **Outlet** 组件，作为子路由的渲染位置 |

```jsx
// 路由配置
{
  path: '/layout',
  element: <Layout />,
  children: [
    { path: 'profile', element: <Profile /> },
    { path: 'settings', element: <Settings /> }
  ]
}

// Layout 组件中
import { Outlet } from 'react-router'
return (
  <div>
    <nav>...</nav>
    <Outlet />
  </div>
)
```

子 path 为相对路径：`profile` 对应 `/layout/profile`，`settings` 对应 `/layout/settings`。

### 6.3 默认二级路由

访问一级路径时未带子路径，希望默认渲染某个子页面，可配置 **index 路由**（不写 `path`，写 **index: true**）：

```jsx
{
  path: '/layout',
  element: <Layout />,
  children: [
    { index: true, element: <Profile /> },  // 访问 /layout 时默认显示 Profile
    { path: 'settings', element: <Settings /> }
  ]
}
```

### 6.4 Vue 3 对照：嵌套路由

Vue Router 的嵌套路由同样使用 `children` 配置子路由，子路由在父组件的 `<RouterView />` 位置渲染：

```js
// Vue Router 配置
{
  path: '/layout',
  component: Layout,
  children: [
    { path: '', component: Profile },          // 默认子路由（path 为空串）
    { path: 'settings', component: Settings }   // /layout/settings
  ]
}
```

```vue
<!-- Layout.vue -->
<template>
  <nav>...</nav>
  <RouterView />
</template>
```

| 对比项 | React Router | Vue Router |
| ------ | ------------ | ---------- |
| **子路由配置** | `children` 数组 | `children` 数组 |
| **子路由渲染位置** | `<Outlet />` | `<RouterView />` |
| **默认子路由** | `{ index: true, element: <Comp /> }` | `{ path: '', component: Comp }` |

> 💡 React Router 用 `index: true` 标记默认子路由，不写 `path`；Vue Router 用 `path: ''`（空字符串）或 `redirect` 实现默认子路由。

***

## 七、重定向

### 7.1 使用 Navigate 组件

访问某路径时直接跳转到另一路径，可用 **Navigate** 组件；**replace** 表示替换当前历史记录（不增加一条新记录）。

```jsx
import { Navigate } from 'react-router'

// 路由配置：访问 / 时重定向到 /home
{ path: '/', element: <Navigate to="/home" replace /> }
```

| 属性         | 说明 |
| ------------ | ---- |
| **to**       | 目标路径 |
| **replace**  | 为 true 时替换当前历史记录，浏览器后退不会回到重定向前 |

### 7.2 Vue 3 对照：重定向

Vue Router 通过路由配置的 `redirect` 属性实现重定向，直接声明在路由配置中，不需要额外组件：

```js
// Vue Router
{ path: '/', redirect: '/home' }
```

```jsx
// React Router
{ path: '/', element: <Navigate to="/home" replace /> }
```

| 对比项 | React Router | Vue Router |
| ------ | ------------ | ---------- |
| **重定向方式** | `<Navigate to="/path" replace />` 组件 | `redirect: '/path'`（路由配置属性） |
| **实现形式** | 渲染组件触发跳转 | 配置声明式，无需额外组件 |

> 💡 Vue Router 的 `redirect` 直接在路由配置中声明，更简洁；React Router 通过渲染 `<Navigate>` 组件实现跳转，本质是"渲染即重定向"。

***

## 八、404 路由

### 8.1 配置方式

当访问的 path 在路由表中不存在时，可显示统一的 404 兜底页面：

| 步骤 | 说明 |
| ---- | ---- |
| 1    | 准备一个 NotFound 组件 |
| 2    | 在路由数组**末尾**增加一项，**path 设为 `'*'`**，element 指向 NotFound |

```jsx
{ path: '*', element: <NotFound /> }
```

### 8.2 Vue 3 对照：404 路由

Vue Router 用 `/:pathMatch(.*)*` 匹配所有未命中的路径，作为 404 兜底：

```js
// Vue Router
{ path: '/:pathMatch(.*)*', component: NotFound }
```

```jsx
// React Router
{ path: '*', element: <NotFound /> }
```

| 对比项 | React Router | Vue Router |
| ------ | ------------ | ---------- |
| **通配路径** | `*` | `/:pathMatch(.*)*` |
| **未匹配路径** | 无内置方式获取 | 存入 `route.params.pathMatch` |

> 💡 Vue Router 的 404 通配路径 `/:pathMatch(.*)*` 比 React Router 的 `*` 更显式，同时将未匹配部分存入 `route.params.pathMatch`，便于展示用户访问的错误路径。

***

## 九、路由匹配行为与版本演进（了解即可）

### 9.1 匹配行为

React Router **v6+** 使用 **createBrowserRouter** 时，默认为**精确匹配**：path 与当前路径完全一致才渲染该路由；嵌套路由下先匹配父，再在 **Outlet** 处渲染子路由。

| 项目       | 说明 |
| ---------- | ---- |
| **精确匹配** | 只有 path 与当前路径完全一致才匹配 |
| **嵌套匹配** | 先匹配父路由，再在父组件 Outlet 处匹配子路由 |
| **通配子路径** | `path: '/layout/*'` 可匹配 `/layout` 及 `/layout/xxx` 等子路径 |

**与 v5 的差异（了解即可）**：v5 默认**模糊匹配**（pathname 以 path 开头即匹配），需给默认路由等加 **exact** 实现精确匹配；v5 用 **Switch** 保证只匹配第一个 Route，v6 用 **Routes** 与 **createBrowserRouter** 配置后不再需要 Switch。

### 9.2 React Router v7（了解即可）

React Router **v7**（2024 年底发布）将 **Remix** 合并进来，提供两种使用模式：

| 模式 | 说明 | 适用场景 |
| ---- | ---- | -------- |
| **Library 模式** | 与 v6 完全兼容，使用 `createBrowserRouter` + `RouterProvider` 等 API | 纯客户端 SPA，渐进式迁移 |
| **Framework 模式** | 类似 Remix，支持文件路由、SSR、`action` 等 | 全栈 React 应用，需要 SSR / 数据变更 |

**Library 模式**（本笔记覆盖的用法）下，v6 的所有 API（`createBrowserRouter`、`useNavigate`、`useParams`、`loader` 等）在 v7 中**完全可用，无需改动**。

v7 的主要变化：

| 变化 | 说明 |
| ---- | ---- |
| **包合并** | `react-router-dom` 合并回 `react-router`，统一安装和导入 |
| **`action` 函数** | 路由配置中可定义 `action` 处理表单提交与数据变更（Framework 模式的核心能力） |
| **移除 `json()` 工具** | loader / action 直接 `return` 数据即可，不再需要 `json()` 包装 |
| **Framework 模式** | 文件路由 + SSR + 服务端数据加载，适合全栈场景 |

***

## 十、两种路由模式

### 10.1 对比

| 模式        | URL 表现   | 底层原理            | 是否需要后端支持 |
| ----------- | ---------- | ------------------- | ---------------- |
| **history** | `/login`   | History API + pushState | 需要（SPA 回退/刷新需后端 fallback） |
| **hash**    | `/#/login` | 监听 hashchange     | 不需要           |

### 10.2 在 React Router 中的使用

| 模式        | 创建方式 |
| ----------- | -------- |
| **history** | **createBrowserRouter** |
| **hash**    | **createHashRouter**    |

使用 **createHashRouter** 时，URL 带 `#`，无需后端做 fallback 配置；使用 **createBrowserRouter** 时，需服务器对未命中静态资源的路径返回 index.html，以支持刷新与直接访问子路径。

| 选择建议       | 说明 |
| -------------- | ---- |
| **history（推荐）** | URL 更简洁，需后端或构建工具配合 fallback |
| **hash**       | 无需后端配置，适合静态部署或无法改服务器时 |

### 10.3 Vue 3 对照：路由模式

Vue Router 同样支持 history 和 hash 两种模式，通过 `createWebHistory` / `createWebHashHistory` 创建：

```js
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

// history 模式
const router = createRouter({
  history: createWebHistory(),
  routes
})

// hash 模式
const router = createRouter({
  history: createWebHashHistory(),
  routes
})
```

| 模式 | React Router | Vue Router |
| ---- | ------------ | ---------- |
| **history** | `createBrowserRouter` | `createWebHistory()` |
| **hash** | `createHashRouter` | `createWebHashHistory()` |

> 💡 两个路由库的模式创建方式不同：React Router 通过不同的工厂函数创建整个 router 实例，Vue Router 则把 `history` 作为 `createRouter` 的配置项传入。底层原理一致，都基于 History API 或 hashchange 事件。

***

## 十一、常用 Hooks 与数据加载（了解即可）

### 11.1 useLocation

**useLocation** 返回当前路由的 location 对象，包含 `pathname`、`search`、`hash`、`state` 等，用于根据当前路径或查询串做逻辑分支、面包屑等。

```jsx
import { useLocation } from 'react-router'

function Breadcrumb() {
  const { pathname } = useLocation()
  // 根据 pathname 渲染面包屑
  return <nav>...</nav>
}
```

### 11.2 loader 与 errorElement（了解即可）

**loader** 在路由渲染前执行，用于请求该路由所需数据，组件内通过 **useLoaderData()** 获取；**errorElement** 指定该路由或其 loader 出错时的 fallback 组件。适合“进入页面前先拉数据”的场景，可按需使用。

```jsx
// 路由配置
{
  path: '/article/:id',
  element: <Article />,
  loader: async ({ params }) => {
    const res = await fetch(`/api/article/${params.id}`)
    return res.json()
  },
  errorElement: <ArticleError />
}

// Article 组件内
import { useLoaderData } from 'react-router'
function Article() {
  const data = useLoaderData()
  return <div>{data.title}</div>
}
```

### 11.3 Vue 3 对照：路由相关 API

| React Router | Vue Router | 说明 |
| ------------ | ---------- | ---- |
| **`useLocation()`** | `useRoute()` | 获取当前路由信息（路径、查询参数等） |
| **`useNavigate()`** | `useRouter()` | 获取路由实例，用于编程式导航 |
| **`useParams()`** | `useRoute().params` | 获取动态路径参数 |
| **`useSearchParams()`** | `useRoute().query` | 获取查询参数 |
| **`loader`** | 导航守卫（`beforeEach` 等） | 路由渲染前的数据加载 / 权限校验 |

Vue Router 的**导航守卫**是 React Router `loader` 和 `errorElement` 的对应能力，可在路由跳转前执行逻辑（鉴权、数据预加载等）：

```js
// 全局前置守卫（作用于所有路由跳转）
router.beforeEach((to, from) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    return '/login'  // 重定向到登录页
  }
})

// 路由独享守卫（类似某个路由的 loader）
{
  path: '/article/:id',
  component: Article,
  beforeEnter: async (to) => {
    const data = await fetch(`/api/article/${to.params.id}`)
    if (!data.ok) return { name: 'NotFound' }
  }
}
```

| 对比项 | React Router `loader` | Vue Router 导航守卫 |
| ------ | --------------------- | ------------------- |
| **执行时机** | 路由渲染前 | 路由跳转前 |
| **数据传递** | `useLoaderData()` 获取 loader 返回值 | 通常在组件 `onMounted` 中请求，或用 Pinia 存储 |
| **错误处理** | `errorElement` 指定错误 fallback | 守卫中 `return false` 或重定向 |
| **作用范围** | 单个路由 | 全局（`beforeEach`）或单个路由（`beforeEnter`） |

> 💡 React Router v6.4+ 的 `loader` 是"数据路由"模式的核心——渲染前先加载数据；Vue Router 的导航守卫更侧重路由拦截（鉴权、权限），数据加载通常在组件内完成。两种模式各有侧重，但都能实现路由级别的预处理。
