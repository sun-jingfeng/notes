## 一、前端路由概念

### 1.1 什么是前端路由

**前端路由** 指由前端根据当前 URL 路径决定渲染哪个组件的机制：一个 **path** 对应一个 **component**，切换路径时由路由库负责更新视图，不向服务器请求整页。

**核心价值：** 单页应用（SPA）内实现多"页面"切换与书签/刷新可用的路径，无需每次整页刷新。

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
npm create vite@latest react-router-pro -- --template react-ts
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

```tsx
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

| 目录/文件              | 职责 |
| ---------------------- | ---- |
| **page/**（或 views/） | 存放页面组件 |
| **router/index.tsx**   | 引入页面组件，配置路由表，导出 router 实例 |
| **main.tsx**           | 使用 `RouterProvider` 注入 router |

```tsx
// src/router/index.tsx
import { createBrowserRouter } from 'react-router'
import Login from '@/page/Login'
import Layout from '@/page/Layout'
import Home from '@/page/Home'
import Settings from '@/page/Settings'
import NotFound from '@/page/NotFound'

const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  {
    path: '/layout',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'settings', element: <Settings /> }
    ]
  },
  { path: '*', element: <NotFound /> }
])

export default router
```

```tsx
// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import router from './router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
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

```tsx
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

```tsx
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

```tsx
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

```tsx
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

```tsx
// 跳转
<Link to={"/article?id=" + id}>文章</Link>
// 或
navigate('/article?id=1')

// 目标页读取与更新
import { useSearchParams } from 'react-router'

function Article() {
  const [searchParams, setSearchParams] = useSearchParams()
  const id = searchParams.get('id')     // string | null
  // 更新查询参数（会触发重新渲染并更新 URL）
  const changePage = (p: number) => setSearchParams({ ...Object.fromEntries(searchParams), page: String(p) })
  return <div>文章 id: {id}</div>
}
```

| API                    | 说明 |
| ---------------------- | ---- |
| **searchParams.get(key)** | 获取单个查询参数（返回 `string \| null`） |
| **setSearchParams(obj)**  | 更新 URL 查询参数并触发匹配与渲染 |

### 5.3 动态路径参数示例

路由配置中用 **:id** 占位，目标页用 **useParams** 读取：

```tsx
// 路由配置
{ path: '/article/:id', element: <Article /> }

// 跳转
<Link to={"/article/" + id}>文章</Link>

// 目标页读取
import { useParams } from 'react-router'

function Article() {
  const { id } = useParams()   // id: string | undefined
  return <div>文章 id: {id}</div>
}
```

### 5.4 Vue 3 对照：路由传参

| 方式 | React Router | Vue Router |
| ---- | ------------ | ---------- |
| **查询参数** | `navigate('/article?id=1')` + `useSearchParams()` | `router.push({ path: '/article', query: { id: 1 } })` + `useRoute().query` |
| **动态路径参数** | 配置 `:id` + `useParams()` | 配置 `:id` + `useRoute().params` |

**查询参数对比：**

```tsx
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

```tsx
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

```tsx
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

```tsx
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

## 七、重定向与 404 路由

### 7.1 重定向：Navigate 组件

访问某路径时直接跳转到另一路径，可用 **Navigate** 组件；**replace** 表示替换当前历史记录（不增加一条新记录）。

```tsx
import { Navigate } from 'react-router'

// 路由配置：访问 / 时重定向到 /home
{ path: '/', element: <Navigate to="/home" replace /> }
```

| 属性         | 说明 |
| ------------ | ---- |
| **to**       | 目标路径 |
| **replace**  | 为 true 时替换当前历史记录，浏览器后退不会回到重定向前 |

### 7.2 404 路由

当访问的 path 在路由表中不存在时，显示统一的 404 兜底页面。准备一个 NotFound 组件，在路由数组**末尾**增加一项，**path 设为 `'*'`**：

```tsx
{ path: '*', element: <NotFound /> }
```

### 7.3 Vue 3 对照

**重定向：**

```tsx
// React Router
{ path: '/', element: <Navigate to="/home" replace /> }
```

```js
// Vue Router
{ path: '/', redirect: '/home' }
```

| 对比项 | React Router | Vue Router |
| ------ | ------------ | ---------- |
| **重定向方式** | `<Navigate to="/path" replace />` 组件 | `redirect: '/path'`（路由配置属性） |
| **实现形式** | 渲染组件触发跳转 | 配置声明式，无需额外组件 |

> 💡 Vue Router 的 `redirect` 直接在路由配置中声明，更简洁；React Router 通过渲染 `<Navigate>` 组件实现跳转，本质是"渲染即重定向"。

**404 路由：**

```tsx
// React Router
{ path: '*', element: <NotFound /> }
```

```js
// Vue Router
{ path: '/:pathMatch(.*)*', component: NotFound }
```

| 对比项 | React Router | Vue Router |
| ------ | ------------ | ---------- |
| **通配路径** | `*` | `/:pathMatch(.*)*` |
| **未匹配路径** | 无内置方式获取 | 存入 `route.params.pathMatch` |

***

## 八、两种路由模式

### 8.1 对比

| 模式        | URL 表现   | 底层原理            | 是否需要后端支持 |
| ----------- | ---------- | ------------------- | ---------------- |
| **history** | `/login`   | History API + pushState | 需要（SPA 回退/刷新需后端 fallback） |
| **hash**    | `/#/login` | 监听 hashchange     | 不需要           |

### 8.2 在 React Router 中的使用

| 模式        | 创建方式 |
| ----------- | -------- |
| **history** | **createBrowserRouter** |
| **hash**    | **createHashRouter**    |

使用 **createHashRouter** 时，URL 带 `#`，无需后端做 fallback 配置；使用 **createBrowserRouter** 时，需服务器对未命中静态资源的路径返回 index.html，以支持刷新与直接访问子路径。

| 选择建议       | 说明 |
| -------------- | ---- |
| **history（推荐）** | URL 更简洁，需后端或构建工具配合 fallback |
| **hash**       | 无需后端配置，适合静态部署或无法改服务器时 |

### 8.3 Vue 3 对照：路由模式

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

## 九、路由懒加载

### 9.1 为什么需要懒加载

默认情况下，所有路由对应的组件在首次加载时一起打包到同一个 bundle 中。随着页面增多，bundle 体积增长会拖慢首屏加载。**路由懒加载**将每个路由组件拆成独立 chunk，访问时才加载，减小首屏体积。

### 9.2 React.lazy + Suspense

用 **React.lazy** 动态导入组件，配合 **Suspense** 在加载期间显示 fallback：

```tsx
import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'

const Login = lazy(() => import('./page/Login'))
const Article = lazy(() => import('./page/Article'))

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <Suspense fallback={<div>加载中...</div>}>
        <Login />
      </Suspense>
    )
  },
  {
    path: '/article',
    element: (
      <Suspense fallback={<div>加载中...</div>}>
        <Article />
      </Suspense>
    )
  }
])

root.render(<RouterProvider router={router} />)
```

每次为 lazy 组件包裹 Suspense 较繁琐，可封装工具函数：

```tsx
import { lazy, Suspense, type ComponentType } from 'react'

function lazyLoad(factory: () => Promise<{ default: ComponentType }>) {
  const Comp = lazy(factory)
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <Comp />
    </Suspense>
  )
}

// 路由配置中使用
const router = createBrowserRouter([
  { path: '/login', element: lazyLoad(() => import('./page/Login')) },
  { path: '/article', element: lazyLoad(() => import('./page/Article')) }
])
```

### 9.3 路由配置的 lazy 属性

React Router v6.4+ 支持在路由配置中直接使用 **lazy** 属性，按需加载路由模块（包括组件、loader、action 等），无需手动搭配 `React.lazy` + `Suspense`：

```tsx
const router = createBrowserRouter([
  {
    path: '/article',
    lazy: async () => {
      const { default: Article } = await import('./page/Article')
      return { Component: Article }
    }
  }
])
```

> 💡 `lazy` 属性返回的对象可包含 `Component`、`loader`、`action`、`errorElement` 等，实现整个路由模块的按需加载。

| 方式 | 说明 | 适用场景 |
| ---- | ---- | -------- |
| **React.lazy + Suspense** | 组件级懒加载，需手动包裹 Suspense | 通用，兼容所有 React Router 版本 |
| **路由 lazy 属性** | 路由级懒加载，可同时懒加载 loader / action | React Router v6.4+，更简洁 |

### 9.4 Vue 3 对照：路由懒加载

Vue Router 通过**箭头函数 + 动态 import** 实现懒加载，无需额外包裹：

```js
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: () => import('./views/Login.vue') },
    { path: '/article', component: () => import('./views/Article.vue') }
  ]
})
```

| 对比项 | React Router | Vue Router |
| ------ | ------------ | ---------- |
| **懒加载方式** | `React.lazy()` + `Suspense` 或路由 `lazy` 属性 | `component: () => import(...)` |
| **加载态处理** | 需要 `Suspense` 的 `fallback` | 可配合 `<Suspense>` 或路由级 loading |
| **复杂度** | 需搭配 Suspense 或使用路由 lazy 属性 | 箭头函数即可，开箱即用 |

***

## 十、路由守卫与权限控制

### 10.1 思路

React Router **没有**内置导航守卫 API。常见做法是封装一个**高阶路由组件**，在渲染前检查权限条件（如是否有 token），条件不满足时重定向到登录页。

### 10.2 实现

```tsx
import { Navigate, useLocation } from 'react-router'

function AuthRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token')
  const location = useLocation()
  if (!token) {
    // 将来源路径存入 state，登录成功后可跳回原页面
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return <>{children}</>
}
```

在路由配置中用 `AuthRoute` 包裹需要鉴权的页面：

```tsx
const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  {
    path: '/layout',
    element: (
      <AuthRoute>
        <Layout />
      </AuthRoute>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: 'settings', element: <Settings /> }
    ]
  }
])
```

登录成功后，从 `location.state.from` 读取来源路径并跳回：

```tsx
function Login() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogin = async () => {
    await loginApi()
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/layout'
    navigate(from, { replace: true })
  }
}
```

> 💡 包裹在父路由上即可保护该路由及其所有子路由。`replace: true` 防止用户点击浏览器后退时退回登录页。

### 10.3 Vue 3 对照：导航守卫

Vue Router 提供内置的**导航守卫** API，可在路由跳转前执行逻辑：

```js
router.beforeEach((to, from) => {
  if (to.meta.requiresAuth && !localStorage.getItem('token')) {
    return '/login'
  }
})
```

| 对比项 | React Router | Vue Router |
| ------ | ------------ | ---------- |
| **实现方式** | 封装高阶组件，渲染时判断 | 内置 `beforeEach`、`beforeEnter` 等守卫 API |
| **执行时机** | 组件渲染阶段 | 路由跳转前（组件未渲染） |
| **作用范围** | 包裹哪个路由就保护哪个 | 全局守卫作用于所有路由，路由独享守卫作用于单个 |

### 10.4 基于角色的动态权限路由

实际项目中权限控制往往细化到路由级别：不同角色可访问的页面不同，无权限路由不应暴露给用户。两个框架的实现思路存在根本差异：

| 对比项 | React Router | Vue Router |
| ------ | ------------ | ---------- |
| **路由注册时机** | 启动时一次性注册全部路由 | 启动时只注册公共路由，按需动态追加 |
| **有无动态注册 API** | ❌ 无 | ✅ `router.addRoute()` |
| **有无全局守卫** | ❌ 无 | ✅ `router.beforeEach()` |
| **权限控制入口** | 包裹布局根组件的高阶组件 | 全局前置守卫 |

#### Vue 3：动态路由注册

初始路由表只保留公共页面（登录、注册、404 等），登录后在全局守卫中拉取用户权限，再通过 `router.addRoute()` 动态挂载该用户有权访问的路由：

```js
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// 公共路由：任何人都可访问
const publicRoutes = [
  { path: '/login', component: () => import('@/views/Login.vue') },
  { path: '/:pathMatch(.*)*', component: () => import('@/views/NotFound.vue') }
]

// 权限路由映射：权限标识 → 路由配置
export const permissionRouteMap = {
  'user:manage':    { path: '/user',    component: () => import('@/views/UserManage.vue') },
  'order:manage':   { path: '/order',   component: () => import('@/views/OrderManage.vue') },
  'report:view':    { path: '/report',  component: () => import('@/views/Report.vue') }
}

export const router = createRouter({
  history: createWebHistory(),
  routes: publicRoutes
})
```

```js
// router/guard.js
import { router, permissionRouteMap } from './index'
import { useUserStore } from '@/stores/user'

let routesAdded = false

router.beforeEach(async (to) => {
  const token = localStorage.getItem('token')

  // 未登录且访问需鉴权页面 → 跳转登录
  if (!token && to.path !== '/login') return '/login'

  // 已登录且路由尚未动态注册
  if (token && !routesAdded) {
    const userStore = useUserStore()

    // 拉取用户权限列表（如 ['user:manage', 'report:view']）
    await userStore.fetchPermissions()

    // 根据权限动态追加路由，挂载到 layout 父路由下
    userStore.permissions.forEach(perm => {
      const route = permissionRouteMap[perm]
      if (route) router.addRoute('layout', route)
    })

    routesAdded = true

    // 重新导航以命中刚注册的路由（replace 避免增加历史记录）
    return { ...to, replace: true }
  }
})
```

> 💡 `return { ...to, replace: true }` 是关键：`addRoute` 后路由表已更新，重新导航才能命中新路由；不加 `replace` 会产生多余历史记录。`routesAdded` 标志位避免每次导航都重复请求权限接口。

#### React：全量注册 + 高阶组件鉴权

React Router 没有动态注册路由的 API，也没有全局守卫，路由在启动时一次性声明完毕。权限控制通过封装**高阶组件（HOC）** 实现——包裹在布局根组件（Layout）外层，在组件渲染阶段拦截无权限访问：

```tsx
// router/index.tsx
import { createBrowserRouter } from 'react-router'
import { PermissionRoute } from './PermissionRoute'
import Layout from '@/layouts/Layout'
import UserManage from '@/pages/UserManage'
import OrderManage from '@/pages/OrderManage'
import Report from '@/pages/Report'

// 所有路由一次性注册，包含权限标识
export const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  {
    path: '/layout',
    element: (
      // 用高阶组件包裹整个布局，集中处理登录态与权限
      <PermissionRoute>
        <Layout />
      </PermissionRoute>
    ),
    children: [
      { path: 'user',   element: <UserManage />,  handle: { permission: 'user:manage' } },
      { path: 'order',  element: <OrderManage />, handle: { permission: 'order:manage' } },
      { path: 'report', element: <Report />,      handle: { permission: 'report:view' } }
    ]
  },
  { path: '*', element: <NotFound /> }
])
```

```tsx
// router/PermissionRoute.tsx
import { Navigate, useLocation, useMatches } from 'react-router'
import { useUserStore } from '@/stores/user'

interface RouteHandle {
  permission?: string
}

export function PermissionRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token')
  const location = useLocation()
  const matches = useMatches()
  const { permissions } = useUserStore()

  // 未登录 → 跳登录页，记录来源路径以便登录后跳回
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // 检查当前匹配路由中是否有权限要求
  const currentHandle = matches.at(-1)?.handle as RouteHandle | undefined
  const requiredPerm = currentHandle?.permission

  if (requiredPerm && !permissions.includes(requiredPerm)) {
    return <Navigate to="/403" replace />
  }

  return <>{children}</>
}
```

> 💡 `useMatches()` 返回当前所有匹配路由，`at(-1)` 取最深层级的路由；路由配置中用 `handle` 字段携带权限标识，鉴权逻辑集中在高阶组件内，无需在每个页面组件中单独判断。

#### 两种方案本质差异

| 对比项 | Vue 3 动态注册 | React 全量注册 + HOC |
| ------ | -------------- | -------------------- |
| **未授权路由是否存在** | ❌ 不注册，路由本身不存在 | ✅ 路由存在，但渲染时被拦截 |
| **路由泄露风险** | 低（路由表中无该路由） | 较高（可从路由配置中枚举所有路由） |
| **实现复杂度** | 较高（需处理 `addRoute` 时序、守卫幂等） | 较低（只需封装一个 HOC） |
| **侧边栏菜单生成** | 可直接从当前路由表获取可访问菜单 | 需单独维护菜单权限数据，与路由配置保持同步 |

***

## 十一、TypeScript 支持

### 11.1 路由参数类型

`useParams` 返回的参数类型默认为 `Record<string, string | undefined>`。可通过泛型收窄具体的参数名：

```tsx
import { useParams } from 'react-router'

function Article() {
  // 泛型指定参数名，id 类型为 string | undefined
  const { id } = useParams<'id'>()
  return <div>文章 id: {id}</div>
}
```

多个动态段时用联合类型：

```tsx
// 路由配置：{ path: '/category/:cid/article/:aid', element: <Article /> }
const { cid, aid } = useParams<'cid' | 'aid'>()
```

> **注意**：路由参数在运行时始终为 `string`（或 `undefined`），需要 `number` 等类型时手动转换（如 `Number(id)`）。

### 11.2 查询参数类型

`useSearchParams` 返回标准 `URLSearchParams` 实例，`get()` 返回 `string | null`，本身不支持泛型。类型安全的做法是封装解析函数：

```tsx
import { useSearchParams } from 'react-router'

function useTypedSearchParams<T extends Record<string, string>>() {
  const [searchParams, setSearchParams] = useSearchParams()
  const params = Object.fromEntries(searchParams) as Partial<T>
  return [params, setSearchParams] as const
}

// 使用
const [params, setParams] = useTypedSearchParams<{ page: string; keyword: string }>()
params.page     // string | undefined
params.keyword  // string | undefined
```

### 11.3 Loader 数据类型

`useLoaderData` 默认返回 `unknown`。通过为 loader 函数标注返回类型，再对 `useLoaderData()` 做类型断言：

```tsx
import { useLoaderData, type LoaderFunctionArgs } from 'react-router'

interface ArticleData {
  id: number
  title: string
  content: string
}

async function articleLoader({ params }: LoaderFunctionArgs): Promise<ArticleData> {
  const res = await fetch(`/api/article/${params.id}`)
  return res.json()
}

function Article() {
  const data = useLoaderData() as ArticleData
  return <h1>{data.title}</h1>
}

// 路由配置
{ path: '/article/:id', element: <Article />, loader: articleLoader }
```

### 11.4 路由配置类型

使用 **RouteObject** 类型约束路由配置数组，获得属性提示和类型检查：

```tsx
import { createBrowserRouter, Navigate, type RouteObject } from 'react-router'

const routes: RouteObject[] = [
  { path: '/', element: <Navigate to="/home" replace /> },
  {
    path: '/layout',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'settings', element: <Settings /> }
    ]
  },
  { path: '*', element: <NotFound /> }
]

const router = createBrowserRouter(routes)
```

| 类型 / 泛型 | 说明 |
| ------------ | ---- |
| **RouteObject** | 路由配置对象类型，包含 `path`、`element`、`children`、`loader` 等属性 |
| **LoaderFunctionArgs** | loader 函数参数类型，包含 `params` 和 `request` |
| **useParams\<'key'\>** | 泛型指定路由参数的 key，收窄返回类型 |
| **useLoaderData** | 返回 `unknown`，需类型断言 |

***

## 十二、常用 Hooks 与数据加载（了解即可）

### 12.1 useLocation

**useLocation** 返回当前路由的 location 对象，包含 `pathname`、`search`、`hash`、`state` 等属性。

| 属性         | 说明 |
| ------------ | ---- |
| **pathname** | 当前路径，如 `/layout/settings` |
| **search**   | 查询串，如 `?id=1`（完整字符串） |
| **hash**     | hash 片段，如 `#section` |
| **state**    | 通过 `navigate` 或 `<Navigate>` 传入的隐式状态，不显示在 URL |

**读取当前路径（面包屑、激活菜单等）：**

```tsx
import { useLocation } from 'react-router'

function Breadcrumb() {
  const { pathname } = useLocation()
  return <nav>当前路径：{pathname}</nav>
}
```

**携带来源路径并在登录后跳回（配合 AuthRoute）：**

鉴权组件拦截时将当前 location 存入 `state.from`：

```tsx
// AuthRoute 内
return <Navigate to="/login" state={{ from: location }} replace />
```

登录成功后读取 `state.from` 跳回原页面：

```tsx
function Login() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogin = async () => {
    await loginApi()
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/layout'
    navigate(from, { replace: true })  // replace 防止后退时回到登录页
  }
}
```

### 12.2 loader 与 errorElement

**loader** 在路由渲染前执行，用于请求该路由所需数据，组件内通过 **useLoaderData()** 获取；**errorElement** 指定该路由或其 loader 出错时的 fallback 组件。适合"进入页面前先拉数据"的场景，可按需使用。

```tsx
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
  const data = useLoaderData() as { title: string }
  return <div>{data.title}</div>
}
```

### 12.3 Vue 3 对照：路由相关 API

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
    return '/login'
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

***

## 十三、路由匹配行为与版本演进（了解即可）

### 13.1 匹配行为

React Router **v6+** 使用 **createBrowserRouter** 时，默认为**精确匹配**：path 与当前路径完全一致才渲染该路由；嵌套路由下先匹配父，再在 **Outlet** 处渲染子路由。

| 项目       | 说明 |
| ---------- | ---- |
| **精确匹配** | 只有 path 与当前路径完全一致才匹配 |
| **嵌套匹配** | 先匹配父路由，再在父组件 Outlet 处匹配子路由 |
| **通配子路径** | `path: '/layout/*'` 可匹配 `/layout` 及 `/layout/xxx` 等子路径 |

**与 v5 的差异（了解即可）**：v5 默认**模糊匹配**（pathname 以 path 开头即匹配），需给默认路由等加 **exact** 实现精确匹配；v5 用 **Switch** 保证只匹配第一个 Route，v6 用 **Routes** 与 **createBrowserRouter** 配置后不再需要 Switch。

### 13.2 React Router v7（了解即可）

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
