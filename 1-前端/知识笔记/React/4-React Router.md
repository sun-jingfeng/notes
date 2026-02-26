## 一、前端路由概念

### 1.1 什么是前端路由

**前端路由** 指由前端根据当前 URL 路径决定渲染哪个组件的机制：一个 **path** 对应一个 **component**，切换路径时由路由库负责更新视图，不向服务器请求整页。

**核心价值：** 单页应用（SPA）内实现多“页面”切换与书签/刷新可用的路径，无需每次整页刷新。

| 概念           | 说明 |
| -------------- | ---- |
| **path**       | 浏览器地址栏中的路径（如 `/login`、`/article`） |
| **component**  | 该路径要渲染的 React 组件 |

***

## 二、React Router 环境准备

### 2.1 安装

```bash
# 使用 Vite 创建项目（推荐；CRA 已弃用）
npm create vite@latest react-router-pro -- --template react
cd react-router-pro

npm install
npm i react-router-dom
npm run dev
```

### 2.2 快速开始：路由与渲染

访问 `/login` 显示登录页，访问 `/article` 显示文章页的实现步骤：

| 步骤           | 说明 |
| -------------- | ---- |
| **定义路由配置** | path 与 element（组件）的对应关系 |
| **创建 router 实例** | 使用 `createBrowserRouter` 或 `createHashRouter` |
| **根节点渲染**   | 使用 `RouterProvider` 并传入 router |

```jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
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
import { Link, NavLink } from 'react-router-dom'

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
import { useNavigate } from 'react-router-dom'

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
import { useSearchParams } from 'react-router-dom'

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
import { useParams } from 'react-router-dom'

function Article() {
  const { id } = useParams()
  return <div>文章 id: {id}</div>
}
```

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
import { Outlet } from 'react-router-dom'
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

***

## 七、重定向

### 7.1 使用 Navigate 组件

访问某路径时直接跳转到另一路径，可用 **Navigate** 组件；**replace** 表示替换当前历史记录（不增加一条新记录）。

```jsx
import { Navigate } from 'react-router-dom'

// 路由配置：访问 / 时重定向到 /home
{ path: '/', element: <Navigate to="/home" replace /> }
```

| 属性         | 说明 |
| ------------ | ---- |
| **to**       | 目标路径 |
| **replace**  | 为 true 时替换当前历史记录，浏览器后退不会回到重定向前 |

***

## 八、404 路由

当访问的 path 在路由表中不存在时，可显示统一的 404 兜底页面：

| 步骤 | 说明 |
| ---- | ---- |
| 1    | 准备一个 NotFound 组件 |
| 2    | 在路由数组**末尾**增加一项，**path 设为 `'*'`**，element 指向 NotFound |

```jsx
{ path: '*', element: <NotFound /> }
```

***

## 九、路由匹配行为（了解即可）

React Router **v6** 使用 **createBrowserRouter** 时，默认为**精确匹配**：path 与当前路径完全一致才渲染该路由；嵌套路由下先匹配父，再在 **Outlet** 处渲染子路由。

| 项目       | 说明 |
| ---------- | ---- |
| **精确匹配** | 只有 path 与当前路径完全一致才匹配 |
| **嵌套匹配** | 先匹配父路由，再在父组件 Outlet 处匹配子路由 |
| **通配子路径** | `path: '/layout/*'` 可匹配 `/layout` 及 `/layout/xxx` 等子路径 |

**与 v5 的差异（了解即可）**：v5 默认**模糊匹配**（pathname 以 path 开头即匹配），需给默认路由等加 **exact** 实现精确匹配；v5 用 **Switch** 保证只匹配第一个 Route，v6 用 **Routes** 与 **createBrowserRouter** 配置后不再需要 Switch。

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

***

## 十一、常用 Hooks 与数据加载（了解即可）

### 11.1 useLocation

**useLocation** 返回当前路由的 location 对象，包含 `pathname`、`search`、`hash`、`state` 等，用于根据当前路径或查询串做逻辑分支、面包屑等。

```jsx
import { useLocation } from 'react-router-dom'

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
import { useLoaderData } from 'react-router-dom'
function Article() {
  const data = useLoaderData()
  return <div>{data.title}</div>
}
```
