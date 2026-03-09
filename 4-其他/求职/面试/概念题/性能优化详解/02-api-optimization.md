````markdown
# 性能优化指南 - 第二部分：接口请求优化

> 接口请求是 Web 应用性能的关键环节，优化得当可以显著提升用户体验。

---

## 1. 异步请求非关键数据

### 是什么？
将页面数据分为关键数据（首屏必需）和非关键数据（可延迟加载），非关键数据延迟请求。

### 为什么需要？
- 加快首屏渲染速度
- 减少首屏请求数量
- 用户可以更快看到核心内容
- 降低服务器瞬时压力

### 代码示例

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

// ✅ 关键数据：页面初始化时立即请求
const productInfo = ref(null)

// ✅ 非关键数据：延迟加载
const recommendations = ref([])
const reviews = ref([])

onMounted(async () => {
  // 1. 先加载关键数据（首屏必需）
  productInfo.value = await fetchProductInfo()
  
  // 2. 关键数据加载完成后，再加载非关键数据
  // 使用 requestIdleCallback 在浏览器空闲时加载
  requestIdleCallback(() => {
    loadNonCriticalData()
  })
})

async function loadNonCriticalData() {
  // 这些数据不影响首屏，可以延迟加载
  const [recommendData, reviewData] = await Promise.all([
    fetchRecommendations(),
    fetchReviews()
  ])
  recommendations.value = recommendData
  reviews.value = reviewData
}
</script>

<template>
  <!-- 关键内容：立即展示 -->
  <ProductDetail :data="productInfo" />
  
  <!-- 非关键内容：延迟加载，加载前显示占位符 -->
  <Suspense>
    <template #default>
      <RecommendList :data="recommendations" />
    </template>
    <template #fallback>
      <SkeletonLoader />
    </template>
  </Suspense>
</template>
```

### 判断数据优先级

```
关键数据（高优先级）         非关键数据（低优先级）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• 首屏展示必需              • 评论列表
• 用户基本信息              • 推荐内容
• 导航/菜单数据             • 统计数据
• 表格主数据                • 历史记录
• 表单初始值                • 通知消息
```

---

## 2. 合并关键数据请求

### 是什么？
将多个相关的接口请求合并为一个，或使用 `Promise.all` 并行请求。

### 为什么需要？
- 减少 HTTP 请求数量
- 降低网络延迟的累积影响
- 减少 TCP 连接建立开销
- 提高页面加载速度

### 方案一：后端聚合接口

```typescript
// ❌ 不好的做法：多个串行请求
async function loadPageData() {
  const user = await api.getUser()        // 200ms
  const orders = await api.getOrders()    // 200ms
  const notifications = await api.getNotifications() // 200ms
  // 总耗时：600ms（串行）
}

// ✅ 好的做法：使用聚合接口
async function loadPageData() {
  // 后端提供一个聚合接口，一次返回所有数据
  const { user, orders, notifications } = await api.getDashboardData()
  // 总耗时：250ms（一次请求）
}
```

### 方案二：Promise.all 并行请求

```typescript
// ❌ 串行请求
async function loadData() {
  const user = await fetchUser()         // 200ms
  const products = await fetchProducts() // 300ms  
  const cart = await fetchCart()         // 150ms
  // 总耗时: 650ms
}

// ✅ 并行请求
async function loadData() {
  const [user, products, cart] = await Promise.all([
    fetchUser(),     // 200ms ─┐
    fetchProducts(), // 300ms ─┼─ 并行执行
    fetchCart()      // 150ms ─┘
  ])
  // 总耗时: 300ms（取最长的那个）
}
```

### 方案三：Promise.allSettled（允许部分失败）

```typescript
// 当某些请求可以失败时，使用 allSettled
async function loadDashboard() {
  const results = await Promise.allSettled([
    fetchCriticalData(),    // 必须成功
    fetchAnalytics(),       // 可以失败
    fetchNotifications()    // 可以失败
  ])
  
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      handleSuccess(index, result.value)
    } else {
      handleError(index, result.reason)
    }
  })
}
```

---

## 3. 请求缓存

### 是什么？
将已请求过的数据存储起来，避免重复请求相同的数据。

### 为什么需要？
- 减少不必要的网络请求
- 加快数据展示速度
- 降低服务器压力
- 改善离线体验

### 3.1 HTTP 缓存

```typescript
// 后端设置缓存头
// Cache-Control: max-age=3600  （强缓存1小时）
// ETag: "abc123"               （协商缓存）

// 前端：通常浏览器会自动处理
// 但可以通过 fetch 控制缓存策略
fetch('/api/data', {
  cache: 'default',      // 正常缓存行为
  // cache: 'no-store',  // 不使用缓存
  // cache: 'reload',    // 忽略缓存，但更新缓存
  // cache: 'force-cache' // 强制使用缓存
})
```

### 3.2 内存缓存（运行时）

```typescript
// utils/cache.ts
const cache = new Map<string, { data: any; timestamp: number }>()
const DEFAULT_TTL = 5 * 60 * 1000 // 5分钟

export async function fetchWithCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = DEFAULT_TTL
): Promise<T> {
  const cached = cache.get(key)
  
  // 检查缓存是否有效
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data
  }
  
  // 请求新数据
  const data = await fetcher()
  cache.set(key, { data, timestamp: Date.now() })
  
  return data
}

// 清除缓存
export function clearCache(key?: string) {
  if (key) {
    cache.delete(key)
  } else {
    cache.clear()
  }
}

// 使用示例
const userInfo = await fetchWithCache(
  'user-info',
  () => api.getUserInfo(),
  10 * 60 * 1000 // 缓存10分钟
)
```

### 3.3 本地存储缓存

```typescript
// utils/storage-cache.ts
interface CacheItem<T> {
  data: T
  expiry: number
}

export function setCache<T>(key: string, data: T, ttlMs: number): void {
  const item: CacheItem<T> = {
    data,
    expiry: Date.now() + ttlMs
  }
  localStorage.setItem(key, JSON.stringify(item))
}

export function getCache<T>(key: string): T | null {
  const itemStr = localStorage.getItem(key)
  if (!itemStr) return null
  
  const item: CacheItem<T> = JSON.parse(itemStr)
  
  if (Date.now() > item.expiry) {
    localStorage.removeItem(key)
    return null
  }
  
  return item.data
}

// 使用示例
async function getConfig() {
  // 先检查本地缓存
  const cached = getCache<Config>('app-config')
  if (cached) return cached
  
  // 缓存不存在或过期，请求新数据
  const config = await api.getConfig()
  setCache('app-config', config, 24 * 60 * 60 * 1000) // 缓存1天
  
  return config
}
```

### 3.4 使用 VueUse 的缓存方案

```typescript
import { useStorage, useAsyncState } from '@vueuse/core'

// 自动持久化到 localStorage
const userPreferences = useStorage('user-preferences', {
  theme: 'light',
  language: 'zh-CN'
})

// 带缓存的异步状态
const { state, isLoading, execute } = useAsyncState(
  fetchUserInfo,
  null,
  { 
    immediate: true,
    resetOnExecute: false // 重新请求时保留旧数据
  }
)
```

---

## 4. 请求去重

### 是什么？
当同一个请求被多次触发时，只发送一次实际请求，所有调用者共享同一个结果。

### 为什么需要？
- 防止短时间内重复请求浪费资源
- 避免竞态条件导致的数据不一致
- 减少服务器压力

### 实现方案

```typescript
// utils/request-dedup.ts
const pendingRequests = new Map<string, Promise<any>>()

export async function dedupRequest<T>(
  key: string,
  request: () => Promise<T>
): Promise<T> {
  // 如果已有相同请求在进行中，返回同一个 Promise
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key)!
  }
  
  // 创建新请求
  const promise = request().finally(() => {
    // 请求完成后移除
    pendingRequests.delete(key)
  })
  
  pendingRequests.set(key, promise)
  return promise
}

// 使用示例
async function getUserInfo(userId: string) {
  return dedupRequest(
    `user-${userId}`,
    () => api.get(`/users/${userId}`)
  )
}

// 即使同时调用多次，也只会发送一个请求
Promise.all([
  getUserInfo('123'),  // ─┐
  getUserInfo('123'),  // ─┼─ 这三个共享同一个请求
  getUserInfo('123')   // ─┘
])
```

---

## 5. 数据预取（Prefetch）

### 是什么？
在用户需要数据之前提前获取，当用户真正需要时可以立即展示。

### 为什么需要？
- 提升感知性能
- 减少等待时间
- 改善用户体验

### 5.1 路由预取

```typescript
// 当鼠标悬停在链接上时预取数据
import { useRouter } from 'vue-router'

const router = useRouter()

function prefetchRoute(path: string) {
  // 预取路由对应的组件
  const route = router.resolve(path)
  if (route.matched[0]?.components?.default) {
    const component = route.matched[0].components.default
    if (typeof component === 'function') {
      component() // 触发异步组件加载
    }
  }
}
</script>

<template>
  <router-link 
    to="/dashboard"
    @mouseenter="prefetchRoute('/dashboard')"
  >
    Dashboard
  </router-link>
</template>
```

### 5.2 数据预取

```typescript
// composables/usePrefetch.ts
const prefetchCache = new Map<string, any>()

export function usePrefetch() {
  // 预取数据
  function prefetch(key: string, fetcher: () => Promise<any>) {
    if (!prefetchCache.has(key)) {
      prefetchCache.set(key, fetcher())
    }
  }
  
  // 获取预取的数据
  async function getPrefeched<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    if (prefetchCache.has(key)) {
      const data = await prefetchCache.get(key)
      prefetchCache.delete(key)
      return data
    }
    return fetcher()
  }
  
  return { prefetch, getPrefeched }
}

// 使用示例
const { prefetch, getPrefeched } = usePrefetch()

// 列表页：鼠标悬停时预取详情
function onItemHover(id: string) {
  prefetch(`detail-${id}`, () => api.getDetail(id))
}

// 详情页：优先使用预取的数据
const detail = await getPrefeched(`detail-${id}`, () => api.getDetail(id))
```

---

## 6. 中断无用请求（AbortController）

### 是什么？
当请求不再需要时（如用户离开页面、切换选项卡），主动取消正在进行的请求。

### 为什么需要？
- 节省网络资源
- 避免过时数据覆盖新数据
- 防止内存泄漏
- 减少不必要的状态更新

### 基本用法

```typescript
// 创建 AbortController
const controller = new AbortController()

// 将 signal 传递给 fetch
fetch('/api/data', {
  signal: controller.signal
})
  .then(response => response.json())
  .catch(err => {
    if (err.name === 'AbortError') {
      console.log('请求被取消')
    }
  })

// 取消请求
controller.abort()
```

### 在 Axios 中使用

```typescript
// apis/user.ts
import axios from 'axios'

export function fetchUserList(signal?: AbortSignal) {
  return axios.get('/api/users', { signal })
}

// 组件中使用
const controller = new AbortController()

onMounted(async () => {
  try {
    const users = await fetchUserList(controller.signal)
  } catch (err) {
    if (axios.isCancel(err)) {
      console.log('请求已取消')
    }
  }
})

onUnmounted(() => {
  controller.abort() // 组件卸载时取消请求
})
```

### 封装为 Composable

```typescript
// composables/useCancelableRequest.ts
import { onUnmounted } from 'vue'

export function useCancelableRequest() {
  const controllers = new Set<AbortController>()
  
  function createSignal() {
    const controller = new AbortController()
    controllers.add(controller)
    return controller.signal
  }
  
  function cancelAll() {
    controllers.forEach(controller => controller.abort())
    controllers.clear()
  }
  
  // 组件卸载时自动取消所有请求
  onUnmounted(() => {
    cancelAll()
  })
  
  return { createSignal, cancelAll }
}

// 使用示例
<script setup>
const { createSignal } = useCancelableRequest()

async function search(keyword: string) {
  const signal = createSignal()
  const results = await api.search(keyword, { signal })
  return results
}
</script>
```

### 搜索场景：只保留最新请求

```typescript
// composables/useLatestRequest.ts
export function useLatestRequest<T>(fetcher: (signal: AbortSignal, ...args: any[]) => Promise<T>) {
  let currentController: AbortController | null = null
  
  async function execute(...args: any[]): Promise<T | null> {
    // 取消之前的请求
    currentController?.abort()
    
    // 创建新的 controller
    currentController = new AbortController()
    
    try {
      return await fetcher(currentController.signal, ...args)
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return null // 被取消的请求返回 null
      }
      throw err
    }
  }
  
  return { execute }
}

// 使用示例：搜索框
const { execute: search } = useLatestRequest(
  (signal, keyword) => api.search(keyword, { signal })
)

// 每次输入都调用，只有最新的请求会返回结果
watch(keyword, async (val) => {
  const results = await search(val)
  if (results) {
    searchResults.value = results
  }
})
```

---

## 小结

| 优化策略 | 适用场景 | 效果 |
|----------|----------|------|
| 异步请求非关键数据 | 页面有多种数据 | 加快首屏展示 |
| 合并关键数据请求 | 多个相关请求 | 减少请求数量 |
| 请求缓存 | 重复获取相同数据 | 减少网络请求 |
| 请求去重 | 同一数据被多处请求 | 避免重复请求 |
| 数据预取 | 可预测的用户行为 | 消除等待感 |
| 中断无用请求 | 快速切换、搜索 | 节省资源 |

**实际应用建议**：
1. 首页/列表页：优先展示关键数据，非关键数据延迟加载
2. 详情页：利用列表页的悬停预取数据
3. 搜索框：使用 AbortController 只保留最新请求
4. 配置数据：使用本地缓存减少请求
````

