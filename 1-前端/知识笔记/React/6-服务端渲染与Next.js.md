## 一、服务端渲染简介

### 1.1 什么是 SSR

**服务端渲染（SSR，Server-Side Rendering）** 指在服务器上把组件渲染成 HTML 字符串并返回给浏览器；浏览器先显示首屏 HTML，再加载 JS 进行**注水（hydration）**，为已有 DOM 绑定事件与状态，使页面具备交互能力。

| 对比项       | 纯客户端渲染（CSR）       | 服务端渲染（SSR）             |
| ------------ | ------------------------- | ----------------------------- |
| **首屏 HTML** | 多为空壳，依赖 JS 渲染    | 服务器直接输出首屏完整 HTML   |
| **SEO**      | 爬虫可能拿不到正文       | 首屏即完整 HTML，利于收录    |
| **首屏速度** | 依赖 JS 下载与执行        | 首屏更快，再加载 JS 注水      |
| **服务器压力** | 小，多为静态资源         | 大，每次请求都执行渲染        |

### 1.2 常见渲染模式

| 模式    | 说明                                                     | 适用场景                     |
| ------- | -------------------------------------------------------- | ---------------------------- |
| **CSR** | 浏览器下载空壳 HTML + JS，由 JS 渲染页面                 | 后台管理、强交互应用         |
| **SSR** | 每次请求在服务端生成 HTML                                | SEO、首屏性能敏感、个性化内容 |
| **SSG** | 构建时生成静态 HTML，部署后直接返回                      | 博客、文档、落地页等内容固定页面 |
| **ISR** | 增量静态再生成：静态页 + 按需/定时再生成，兼顾性能与更新 | 内容偶尔变动但仍希望静态化的页面 |

**SSR 与 SSG 对比：**

| 对比项       | SSR（服务端渲染）            | SSG（静态生成）              |
| ------------ | ---------------------------- | ---------------------------- |
| **生成时机** | 每次请求时在服务器渲染       | 构建时生成 HTML              |
| **适用场景** | 数据实时性要求高、因人而异   | 内容相对固定、可预先生成     |
| **服务器压力** | 高                         | 低，多为静态文件             |

### 1.3 为何考虑 SSR

| 场景           | 说明                                           |
| -------------- | ---------------------------------------------- |
| **SEO**        | 需要搜索引擎抓取首屏正文与关键信息时           |
| **首屏性能**   | 弱网或低端设备希望尽快看到内容，减少白屏时间   |
| **社交分享**   | 爬虫拉取的 HTML 需包含正文与缩略图，以便正确预览 |

### 1.4 Vue 3 对照

React 和 Vue 3 均支持 SSR，且各有对应的全栈框架：

| 对比项       | React                                                        | Vue 3                                                       |
| ------------ | ------------------------------------------------------------ | ----------------------------------------------------------- |
| **SSR API**  | `react-dom/server`（`renderToString`、`renderToPipeableStream`） | `vue/server-renderer`（`renderToString`、`pipeToNodeWritable`） |
| **全栈框架** | **Next.js**                                                  | **Nuxt**                                                    |
| **注水**     | `hydrateRoot`                                                | `createSSRApp` + `app.mount`                                |

两者的 SSR 思路一致：服务端渲染组件 → 输出 HTML → 客户端注水 → 页面可交互。生态上，Next.js 之于 React 等同于 Nuxt 之于 Vue。

***

## 二、React 中实现 SSR 的思路

### 2.1 核心 API（了解即可）

在 Node 环境中用 **react-dom/server** 将 React 组件转为 HTML：

| API                        | 说明                                                         |
| -------------------------- | ------------------------------------------------------------ |
| **renderToString**         | 将组件树同步渲染为 HTML 字符串，用于首屏输出                 |
| **renderToPipeableStream** | React 18+ 推荐，流式输出，支持 Suspense，首屏可逐步返回     |

### 2.2 简要流程

```
请求进入
    ↓
服务端根据当前 URL 匹配路由、取数
    ↓
renderToString(组件) 得到 HTML 字符串
    ↓
将 HTML 注入模板，返回给浏览器
    ↓
浏览器展示首屏 → 加载同构 React 代码 → hydration 绑定事件与状态
```

**同构（Isomorphism）**：同一套 React 组件在服务端执行一遍（输出首屏 HTML），再在客户端执行一遍（注水、绑定事件）；服务端与客户端共用组件与路由逻辑，仅运行环境不同。

### 2.3 注意点

| 要点           | 说明                                                                 |
| -------------- | -------------------------------------------------------------------- |
| **路由**       | 服务端需根据当前 URL 渲染对应组件，与前端路由约定一致                |
| **数据**       | 首屏数据在服务端请求并注入，避免注水后再请求导致闪烁；可与 Redux/Context 同构 |
| **样式**       | 服务端需输出当前路由用到的 CSS（如 CSS-in-JS 服务端提取，或按路由打包 CSS） |
| **浏览器 API** | 服务端无 `window`、`document` 等；使用浏览器 API 的代码需限制在客户端执行（如放在 `useEffect` 中） |

> 💡 手动搭建 SSR 需自行处理路由匹配、数据注入、样式提取、代码分割等，工程成本高。实际项目推荐使用 **Next.js** 等框架，开箱即用。

***

## 三、Next.js

### 3.1 定位

**Next.js** 是基于 React 的**全栈框架**，内置 SSR/SSG、文件系统路由、API 路由与构建优化。**不仅用于 SSR**，也支持静态站点、增量再生成、SPA 以及全栈应用，按需选择渲染与部署方式。

**核心能力：**

| 能力                    | 说明                                                                 |
| ----------------------- | -------------------------------------------------------------------- |
| **文件路由**            | 根据 `pages/` 或 `app/` 下文件结构自动生成路由                       |
| **API 路由**            | 在项目内写接口，无需单独后端服务                                     |
| **服务端 / 客户端组件** | App Router 中组件默认在服务端执行；加 `"use client"` 声明为客户端组件 |
| **构建优化**            | 自动代码分割、图片优化、字体优化、环境变量注入等                     |

### 3.2 App Router 与 Pages Router

Next.js 存在两套路由方案。**App Router**（Next.js 13.4+ 稳定，基于 `app/` 目录）是当前推荐方案；**Pages Router**（基于 `pages/` 目录）是早期方案，仍可使用。

| 对比项           | App Router（`app/`）                                | Pages Router（`pages/`）                          |
| ---------------- | --------------------------------------------------- | ------------------------------------------------- |
| **引入版本**     | Next.js 13.4 稳定                                   | 初始版本即有                                      |
| **组件默认行为** | 服务端组件（RSC），需显式声明客户端组件              | 所有组件均在客户端执行                            |
| **布局**         | `layout.tsx` 嵌套布局，切换路由时布局不重渲染        | 无内置嵌套布局，需手动实现                        |
| **数据获取**     | 服务端组件中直接 `async/await`                       | `getServerSideProps` / `getStaticProps` 导出函数  |
| **推荐度**       | ✅ 新项目推荐                                        | 维护已有项目                                      |

**App Router 文件约定：**

| 文件              | 说明                                               |
| ----------------- | -------------------------------------------------- |
| **`page.tsx`**    | 路由页面组件，URL 路径由文件夹层级决定             |
| **`layout.tsx`**  | 布局组件，包裹同级及子路由页面，切换路由时不重渲染 |
| **`loading.tsx`** | 加载 UI，自动包裹在 `<Suspense>` 中               |
| **`error.tsx`**   | 错误 UI，自动包裹在 Error Boundary 中              |
| **`route.ts`**    | API 路由（Route Handler），处理 HTTP 请求          |

```
app/
├── layout.tsx           ← 根布局
├── page.tsx             ← 首页 (/)
├── about/
│   └── page.tsx         ← /about
├── users/
│   ├── page.tsx         ← /users
│   └── [id]/
│       └── page.tsx     ← /users/:id（动态路由）
└── api/
    └── data/
        └── route.ts     ← /api/data
```

### 3.3 服务端组件与客户端组件

App Router 中组件默认为**服务端组件（Server Component）**，在服务端执行，不进入客户端 JS 包；加 `"use client"` 声明为**客户端组件**，可使用 state、事件等浏览器 API。

| 对比项       | 服务端组件（默认）                       | 客户端组件（`"use client"`）                          |
| ------------ | ---------------------------------------- | ----------------------------------------------------- |
| **执行环境** | 服务端                                   | 客户端（浏览器）                                      |
| **JS 包**    | 不进入客户端 bundle                      | 包含在客户端 bundle 中                                |
| **可用能力** | 直接访问数据库、文件系统、环境变量       | `useState`、`useEffect`、事件绑定、浏览器 API         |
| **适用场景** | 数据获取、静态展示、无交互内容           | 表单、交互、需要客户端状态的 UI                       |

```tsx
// 服务端组件（默认，无需声明），可直接 async/await
interface User {
  id: number
  name: string
}

export default async function UserList() {
  const res = await fetch('https://api.example.com/users')
  const users: User[] = await res.json()
  return (
    <ul>
      {users.map(u => <li key={u.id}>{u.name}</li>)}
    </ul>
  )
}
```

```tsx
'use client'

// 客户端组件，可使用 useState、事件等
import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

> **注意**：服务端组件**不能**使用 Hooks（`useState`、`useEffect` 等）和浏览器事件。需要交互时，将交互部分拆为客户端组件，由服务端组件导入和组合。

***

**组合模式：** 服务端组件负责数据获取与静态结构，客户端组件负责交互，两者通过 props 或 children 组合：

```tsx
// ServerPage.tsx（服务端组件）
import LikeButton from './LikeButton' // 客户端组件

export default async function ServerPage() {
  const article = await fetchArticle()
  return (
    <article>
      <h1>{article.title}</h1>
      <p>{article.content}</p>
      {/* 交互部分用客户端组件 */}
      <LikeButton articleId={article.id} />
    </article>
  )
}
```

| 组合规则                                     | 说明                                                   |
| -------------------------------------------- | ------------------------------------------------------ |
| **服务端组件可导入客户端组件**               | 静态结构包裹交互部分，最常见的模式                     |
| **客户端组件不能导入服务端组件**             | 但可通过 `children` 或 props 传入服务端组件的渲染结果  |
| **`"use client"` 是边界**                    | 该文件及其导入的所有模块都视为客户端代码               |

### 3.4 数据获取

**App Router（推荐）：** 服务端组件中直接 `async/await`，无需额外 API：

```tsx
// app/users/page.tsx（服务端组件）
interface User {
  id: number
  name: string
  email: string
}

export default async function UsersPage() {
  const res = await fetch('https://api.example.com/users')
  const users: User[] = await res.json()
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name} - {user.email}</li>
      ))}
    </ul>
  )
}
```

> **注意**：Next.js 13–14 中服务端 `fetch` 默认缓存（等同 `force-cache`）；**Next.js 15 起默认不再缓存**（等同 `no-store`），需显式传入 `cache: 'force-cache'` 才会缓存。

***

**Pages Router：** 通过导出 `getServerSideProps`（SSR）或 `getStaticProps`（SSG）函数获取数据：

```tsx
// pages/users.tsx（Pages Router）
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'

interface User {
  id: number
  name: string
}

// 每次请求在服务端执行（SSR）
export const getServerSideProps: GetServerSideProps<{
  users: User[]
}> = async () => {
  const res = await fetch('https://api.example.com/users')
  const users: User[] = await res.json()
  return { props: { users } }
}

// 页面组件接收 props，类型自动推导
export default function UsersPage({
  users,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  )
}
```

| 方式 / API                               | 说明                                                   |
| ---------------------------------------- | ------------------------------------------------------ |
| **getServerSideProps**（Pages Router）    | 每请求执行一次（SSR），可访问请求上下文                |
| **getStaticProps**（Pages Router）        | 构建时执行（SSG）；可配 `revalidate` 做增量再生成      |
| **服务端组件 + fetch**（App Router）      | 服务端组件中直接 `async/await`，推荐方案               |

**Pages Router 常用类型：**

| 类型                                         | 说明                                           |
| -------------------------------------------- | ---------------------------------------------- |
| **`GetServerSideProps<Props>`**              | SSR 数据获取函数类型，泛型指定返回的 props     |
| **`GetStaticProps<Props>`**                  | SSG 数据获取函数类型                           |
| **`InferGetServerSidePropsType<typeof fn>`** | 从数据获取函数自动推导页面组件的 props 类型    |
| **`GetServerSidePropsContext`**              | 请求上下文，含 `params`、`query`、`req`、`res` |

### 3.5 API 路由与 Server Actions

**Route Handlers（App Router）：** 在 `app/api/` 下创建 `route.ts`，导出与 HTTP 方法同名的函数：

```tsx
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server'

interface User {
  id: number
  name: string
}

export async function GET() {
  const users: User[] = [{ id: 1, name: '张三' }]
  return NextResponse.json(users)
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { name: string }
  // 处理创建逻辑...
  return NextResponse.json({ id: 2, name: body.name }, { status: 201 })
}
```

> 💡 Pages Router 中 API 路由写在 `pages/api/` 下，导出 `default` 函数处理请求（`(req: NextApiRequest, res: NextApiResponse) => void`），风格与 Express 类似。

***

**Server Actions（App Router）：** 以 `"use server"` 标记的异步函数，可在客户端组件的表单或事件中直接调用，Next.js 自动处理网络请求与序列化：

```tsx
// app/actions.ts
'use server'

export async function createItem(formData: FormData) {
  const name = formData.get('name') as string
  // 服务端逻辑：写入数据库等
}
```

```tsx
// app/items/page.tsx
import { createItem } from '../actions'

export default function Page() {
  return (
    <form action={createItem}>
      <input name="name" placeholder="名称" />
      <button type="submit">创建</button>
    </form>
  )
}
```

| 对比项       | API 路由（Route Handlers）     | Server Actions                       |
| ------------ | ------------------------------ | ------------------------------------ |
| **用途**     | 提供 RESTful API 端点          | 服务端函数，表单提交与数据变更       |
| **调用方式** | HTTP 请求（`fetch`）           | 直接调用函数或 `<form action={fn}>`  |
| **适用场景** | 需要被外部系统调用的接口       | 页面内的数据变更操作                 |

### 3.6 创建与运行（了解即可）

```bash
# 使用最新版本创建项目
npx create-next-app@latest <项目名>
cd <项目名>
# 开发环境运行
npm run dev
```

> 💡 根据提示可选择 TypeScript、ESLint、Tailwind、`src/` 目录、App Router 等。新项目推荐选择 TypeScript + App Router。

### 3.7 何时选用

| 场景                     | 建议                                                   |
| ------------------------ | ------------------------------------------------------ |
| 需要 SEO 或首屏性能      | 使用 Next.js 的 SSR/SSG 或 ISR                         |
| 纯静态站、无服务端       | Next.js 静态导出，部署到任意静态托管                   |
| 纯 SPA、无 SSR 需求      | Vite 更轻量；Next.js 也可胜任（客户端组件 + 静态导出） |
| 全栈小项目、前后端一体   | Next.js API 路由、Server Actions 可简化部署            |

**选择建议：** 偏 SEO 的站点、非强交互页面（如新闻、落地页）更适合 SSR；后台管理、强交互应用首屏压力相对小，用纯客户端渲染即可，且更易维护、服务器负载更小。是否用 Next.js 取决于是否需要其路由、构建与全栈能力，而不仅是"要不要 SSR"。

### 3.8 Vue 3 对照：Nuxt

**Nuxt** 之于 Vue 3，等同于 **Next.js** 之于 React——基于 Vue 3 的全栈框架，内置 SSR/SSG、文件路由、API 路由等。

| 对比项           | Next.js（React）                                    | Nuxt（Vue 3）                                       |
| ---------------- | --------------------------------------------------- | --------------------------------------------------- |
| **文件路由**     | `app/` 或 `pages/` 下文件结构                       | `pages/` 下文件结构，自动生成 Vue Router 配置       |
| **服务端组件**   | 默认服务端组件，`"use client"` 声明客户端            | 无 RSC；通过 `useFetch` / `useAsyncData` 在服务端取数 |
| **数据获取**     | 服务端组件 `async/await` 或 `getServerSideProps`    | `useFetch`、`useAsyncData`（SSR/CSR 通用）          |
| **API 路由**     | Route Handlers（`route.ts`）                        | `server/api/` 下创建接口（Nitro 引擎）              |
| **Server Actions** | `"use server"` 函数                               | Nuxt Server Functions（实验性）                     |
| **布局**         | `layout.tsx` 嵌套布局                                | `layouts/` 目录 + `<NuxtLayout>`                    |
| **静态生成**     | `next build` + `output: 'export'`                   | `nuxi generate`                                     |

**数据获取对比：**

```tsx
// Next.js App Router：服务端组件直接 async/await
interface Post {
  id: number
  title: string
}

export default async function Page() {
  const res = await fetch('https://api.example.com/posts')
  const posts: Post[] = await res.json()
  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>
}
```

```vue
<!-- Nuxt：useFetch 组合式函数，SSR 时在服务端执行，CSR 导航时在客户端执行 -->
<script setup lang="ts">
interface Post {
  id: number
  title: string
}

const { data: posts } = await useFetch<Post[]>('https://api.example.com/posts')
</script>

<template>
  <ul>
    <li v-for="p in posts" :key="p.id">{{ p.title }}</li>
  </ul>
</template>
```

> 💡 Next.js 通过服务端组件实现"组件级"的服务端数据获取；Nuxt 通过 `useFetch` / `useAsyncData` 组合式函数获取数据，SSR 时在服务端执行，CSR 导航时在客户端执行，框架自动处理数据序列化与注水。
