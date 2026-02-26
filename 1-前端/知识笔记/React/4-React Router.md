## 一、前端路由概念

### 1.1 什么是前端路由

**前端路由** 指一个路径（path）对应一个组件（component）：当浏览器访问某个 path 时，由路由库负责渲染该 path 对应的组件，无需向服务器请求整页。

| 概念     | 说明 |
| -------- | ---- |
| **path**   | 浏览器地址栏中的路径（如 `/login`、`/article`） |
| **component** | 该路径要渲染的 React 组件 |

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

需求：访问 `/login` 显示登录页，访问 `/article` 显示文章页。

| 步骤     | 说明 |
| -------- | ---- |
| 1. 定义路由配置 | path 与 component 对应关系 |
| 2. 创建 router 实例 | 使用 `createBrowserRouter` 或 `createHashRouter` |
| 3. 根节点渲染 | 使用 `RouterProvider` 并传入 router |

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

***

## 三、抽象路由模块（推荐结构）

实际开发中常将路由配置抽成独立模块：

| 目录/文件     | 职责 |
| ------------- | ---- |
| **page/**     | 存放页面组件（Login、Article 等） |
| **router/**   | 引入页面组件，配置 path 与 element，导出 router 实例 |
| **入口**      | 使用 `RouterProvider` 注入 router |

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

路由之间跳转并可能传参，有两种常见方式：

| 方式           | 说明 | 典型场景 |
| -------------- | ---- | -------- |
| **声明式导航** | 用 `<Link to="...">` 描述跳转目标 | 菜单、导航栏、列表链接 |
| **编程式导航** | 用 **useNavigate** 得到 `navigate`，在逻辑中调用 | 登录成功后跳转、提交后跳转等 |

### 4.2 声明式导航：Link

**Link** 组件会渲染成 `<a>`，点击后切换路由而不整页刷新。

```jsx
import { Link } from 'react-router-dom'

<Link to="/article">文章页</Link>
// 传参（searchParams）：to="/article?id=1"
```

| 属性     | 说明 |
| -------- | ---- |
| **to**  | 目标 path；需传参时可用字符串拼接，如 `to={"/article?id=" + id}` |

### 4.3 编程式导航：useNavigate

通过 **useNavigate** 获取 `navigate` 函数，在事件或异步逻辑中跳转。

```jsx
import { useNavigate } from 'react-router-dom'

const navigate = useNavigate()

const handleLogin = async () => {
  await loginApi()
  navigate('/article')
}
```

***

## 五、导航传参

### 5.1 常见方式

| 方式             | 说明 |
| ---------------- | ---- |
| **searchParams** | URL 查询参数，如 `/article?id=1`；目标页用 `useSearchParams()` 读取 |
| **params**       | 动态路径参数，如 `/article/:id`；目标页用 `useParams()` 读取 |

### 5.2 searchParams 示例

跳转时在 `to` 中带查询串，目标页用 **useSearchParams** 读取与修改：

```jsx
// 跳转
<Link to={"/article?id=" + id}>文章</Link>
// 或 navigate('/article?id=1')

// 目标页读取
import { useSearchParams } from 'react-router-dom'

function Article() {
  const [searchParams, setSearchParams] = useSearchParams()
  const id = searchParams.get('id')
  return <div>文章 id: {id}</div>
}
```

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

**嵌套路由** 指在一级路由下再配置子路由，子路由又称二级路由。例如布局页为一级，其内部再根据 path 渲染不同子页面。

### 6.2 配置方式

| 步骤     | 说明 |
| -------- | ---- |
| 1 | 在一级路由上使用 **children** 配置子路由 |
| 2 | 在父组件中放置 **Outlet** 组件，作为子路由的渲染位置 |

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

### 6.3 默认二级路由

访问一级路径时若未带子路径，希望默认渲染某个子页面，可配置 **index 路由**（不写 `path`，写 **index: true**）：

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

访问某路径时直接跳转到另一路径，可用 **Navigate** 组件，**replace** 表示替换当前历史记录（不增加一条新记录）。

```jsx
import { Navigate } from 'react-router-dom'

// 路由配置：访问 / 时重定向到 /home
{ path: '/', element: <Navigate to="/home" replace /> }
```

| 属性       | 说明 |
| ---------- | ---- |
| **to**     | 目标路径 |
| **replace** | 为 true 时替换当前历史记录，浏览器后退不会回到重定向前 |

***

## 八、404 路由

### 8.1 场景

当访问的 path 在路由表中不存在时，可显示统一的 404 兜底页面。

### 8.2 配置方式

| 步骤     | 说明 |
| -------- | ---- |
| 1 | 准备一个 NotFound 组件 |
| 2 | 在路由数组**末尾**增加一项，**path 设为 `'*'`**，element 指向 NotFound |

```jsx
{ path: '*', element: <NotFound /> }
```

***

## 九、路由匹配行为（了解即可）

React Router **v6** 使用 **createBrowserRouter** 时，默认为**精确匹配**：只有 path 与当前路径完全一致才渲染该路由；嵌套路由下先匹配父再在 **Outlet** 处渲染子路由。路径带 `/*` 时可匹配子路径（如 `path: '/layout/*'` 匹配 `/layout` 及 `/layout/xxx`）。

**与 v5 的差异（了解即可）**：v5 中默认是**模糊匹配**（pathname 以 path 开头即匹配），需给默认路由等加 **exact** 实现精确匹配；v5 用 **Switch** 保证只匹配第一个 Route，v6 用 **Routes** 与 **createBrowserRouter** 配置后不再需要 Switch。

***

## 十、两种路由模式

### 10.1 对比

| 模式     | URL 表现    | 底层原理           | 是否需要后端支持 |
| -------- | ----------- | ------------------ | ---------------- |
| **history** | `/login`    | History API + pushState | 需要（SPA 回退需后端配合） |
| **hash**    | `/#/login`  | 监听 hashchange    | 不需要           |

### 10.2 在 React Router 中的使用

| 模式     | 创建方式 |
| -------- | -------- |
| **history** | **createBrowserRouter** |
| **hash**    | **createHashRouter**    |

使用 `createHashRouter` 时，URL 带 `#`，无需后端做 fallback 配置；使用 `createBrowserRouter` 时，需服务器对未命中静态资源的路径返回 index.html，以支持刷新与直接访问子路径。
