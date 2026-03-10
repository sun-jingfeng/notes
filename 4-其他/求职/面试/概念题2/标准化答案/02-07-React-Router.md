# React Router

## 一、路由模式

| 模式 | 组件 | 原理 | 服务端要求 |
| --- | --- | --- | --- |
| **History** | `BrowserRouter` | 使用 History API（pushState / replaceState），URL 无 `#` | 需配置 SPA fallback（所有路径返回 index.html） |
| **Hash** | `HashRouter` | URL 中 `#` 及其后为路由，通过 hashchange 监听 | 无需服务端配合 |

生产环境若无法改服务端配置，可用 Hash 模式；否则推荐 History，SEO 与体验更好。

***

## 二、嵌套路由与 Outlet

**嵌套路由**表示“父路由下还有子路由”，子路由的组件需要在父组件里**占位渲染**。React Router v6 用 **`<Outlet />`** 表示“子路由在这里渲染”。

```jsx
<Routes>
  <Route path="/" element={<Layout />}>
    <Route path="users" element={<Users />} />
    <Route path="users/:id" element={<UserDetail />} />
  </Route>
</Routes>

// Layout 中
function Layout() {
  return (
    <div>
      <nav>...</nav>
      <Outlet />  {/* 子路由对应组件渲染在这里 */}
    </div>
  )
}
```

***

## 三、路由传参

| 方式 | 用法 | 适用场景 |
| --- | --- | --- |
| **动态路由** | 路由 path 中 `:id`，用 **useParams()** 取 | 资源 ID、REST 风格 |
| **查询参数** | URL `?key=value`，用 **useSearchParams()** 取 | 筛选、分页、可选参数 |
| **state** | 跳转时传 **state**，用 **useLocation().state** 取 | 跨页临时数据，不体现在 URL |

```jsx
// 定义
<Route path="/users/:id" element={<UserDetail />} />

// 跳转
navigate(`/users/${id}`)
navigate('/search', { state: { from: 'home' } })

// 取值
const { id } = useParams()
const [searchParams, setSearchParams] = useSearchParams()
const { from } = useLocation().state || {}
```

***

## 四、路由守卫

React Router **没有内置“路由守卫”**。需要鉴权、登录检查时，通常：

- 在**布局组件**或**根路由**里判断登录/权限，未通过则重定向到登录页或 403；
- 或封装**高阶组件/包装组件**，在内部做校验再决定是否渲染 `<Outlet />` 或重定向。

***

## 五、懒加载

用 **React.lazy** 按路由拆分组件，并用 **Suspense** 包一层，提供 loading 态。

```jsx
const Users = React.lazy(() => import('./Users'))
<Suspense fallback={<Spinner />}>
  <Routes>...</Routes>
</Suspense>
```

***

## 六、面试答题要点

- **模式**：BrowserRouter（History，需服务端 fallback）与 HashRouter（#，无需服务端）。
- **嵌套**：父路由用 `<Outlet />` 渲染子路由组件。
- **传参**：useParams（路径）、useSearchParams（查询）、useLocation().state（状态）。
- **守卫**：无内置，在布局或包装组件里鉴权并重定向。
- **懒加载**：React.lazy + Suspense。
