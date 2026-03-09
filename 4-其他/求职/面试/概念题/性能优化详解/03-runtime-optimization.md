````markdown
# 性能优化指南 - 第三部分：运行速度优化

> 运行时性能直接影响用户的操作体验，特别是在处理大量数据或复杂交互时。

---

## 1. 避免不必要的响应式数据转换

### 是什么？
Vue 3 的响应式系统会追踪数据变化，但对于不需要触发视图更新的数据，这种追踪是多余的开销。

### 为什么需要？
- 减少内存占用
- 避免不必要的依赖收集
- 提高大数据量场景的性能

---

### 1.1 数据整体无需响应：使用普通变量

```typescript
// ❌ 不好：所有数据都用响应式包装
const options = ref([
  { value: 1, label: '选项1' },
  { value: 2, label: '选项2' },
  // ... 大量静态选项
])

// ✅ 好：静态数据直接声明为普通变量
const OPTIONS = [
  { value: 1, label: '选项1' },
  { value: 2, label: '选项2' },
]

// 或者定义在单独的常量文件中
// constants/options.ts
export const STATUS_OPTIONS = [
  { value: 'active', label: '启用' },
  { value: 'inactive', label: '禁用' },
]
```

```vue
<script setup lang="ts">
// ❌ 从 API 获取的纯展示数据也不需要响应式
const chartData = ref(null)
onMounted(async () => {
  chartData.value = await fetchChartData()
})

// ✅ 如果数据只用于展示，不会被修改
let chartData: ChartData | null = null
onMounted(async () => {
  chartData = await fetchChartData()
  renderChart(chartData) // 直接使用，不需要响应式
})
</script>
```

---

### 1.2 markRaw() - 标记对象永不转换为响应式

```typescript
import { markRaw, ref } from 'vue'

// ❌ 第三方库实例不应该是响应式的
const editor = ref(null)
onMounted(() => {
  editor.value = new Monaco.Editor() // Monaco 实例被代理了，可能出问题
})

// ✅ 使用 markRaw 标记
const editor = ref(null)
onMounted(() => {
  editor.value = markRaw(new Monaco.Editor()) // 不会被转换为响应式
})
```

**适用场景**：
- 第三方库实例（echarts、monaco-editor、three.js 等）
- 复杂的类实例
- 不需要响应式的大对象

```typescript
import { markRaw, reactive } from 'vue'
import * as echarts from 'echarts'

const state = reactive({
  // echarts 实例标记为 raw
  chart: markRaw(echarts.init(container)),
  
  // 普通数据保持响应式
  loading: false,
})
```

---

### 1.3 shallowRef() - 只追踪 .value 的变化

```typescript
import { shallowRef, triggerRef } from 'vue'

// ❌ ref 会深度追踪所有属性变化
const data = ref({
  users: [], // 10000 条数据
  pagination: { page: 1, total: 0 }
})
// 修改任何嵌套属性都会触发更新追踪

// ✅ shallowRef 只追踪 .value 本身的变化
const data = shallowRef({
  users: [],
  pagination: { page: 1, total: 0 }
})

// 修改嵌套属性不会自动触发更新
data.value.users.push(newUser) // ❌ 不会触发更新

// 需要替换整个值才会触发更新
data.value = { 
  ...data.value, 
  users: [...data.value.users, newUser] 
} // ✅ 会触发更新

// 或者手动触发
data.value.users.push(newUser)
triggerRef(data) // 手动触发更新
```

**适用场景**：
- 大型列表数据
- 只在整体替换时需要更新的数据
- 需要手动控制更新时机的场景

---

### 1.4 shallowReactive() - 只追踪根级属性

```typescript
import { shallowReactive } from 'vue'

// ❌ reactive 深度响应
const state = reactive({
  form: {
    user: {
      name: '',
      address: {
        city: ''
      }
    }
  }
})
// 所有嵌套层级都是响应式的

// ✅ shallowReactive 只有根级响应
const state = shallowReactive({
  form: { /* ... */ },      // ✅ form 的替换会触发更新
  loading: false,           // ✅ loading 的修改会触发更新
})

state.loading = true        // ✅ 会触发更新
state.form.user.name = 'x'  // ❌ 不会触发更新
state.form = { ... }        // ✅ 会触发更新
```

---

## 2. Web Workers 处理长任务

### 是什么？
Web Worker 允许在后台线程中执行 JavaScript，不阻塞主线程。

### 为什么需要？
- 避免 UI 卡顿
- 处理大量数据计算
- 复杂算法不影响用户交互

### 基本用法

```typescript
// workers/dataProcessor.worker.ts
self.onmessage = (event) => {
  const { data, operation } = event.data
  
  let result
  switch (operation) {
    case 'sort':
      result = data.sort((a, b) => a.value - b.value)
      break
    case 'filter':
      result = data.filter(item => item.active)
      break
    case 'aggregate':
      result = heavyAggregation(data)
      break
  }
  
  self.postMessage(result)
}

function heavyAggregation(data: any[]) {
  // 复杂计算逻辑
  return data.reduce((acc, item) => {
    // ... 耗时计算
    return acc
  }, {})
}
```

```typescript
// 在组件中使用
const worker = new Worker(
  new URL('./workers/dataProcessor.worker.ts', import.meta.url),
  { type: 'module' }
)

function processLargeData(data: any[]) {
  return new Promise((resolve) => {
    worker.onmessage = (event) => {
      resolve(event.data)
    }
    worker.postMessage({ data, operation: 'aggregate' })
  })
}
```

### 使用 VueUse 的 useWebWorkerFn

```typescript
import { useWebWorkerFn } from '@vueuse/core'

// 自动创建 Worker 执行函数
const { workerFn, workerStatus } = useWebWorkerFn(
  (data: number[]) => {
    // 这段代码会在 Worker 中执行
    return data
      .map(n => n * 2)
      .filter(n => n > 100)
      .sort((a, b) => b - a)
  }
)

// 使用
const result = await workerFn(largeArray)
```

---

## 3. 生成器函数处理长任务

### 是什么？
使用生成器函数将长任务拆分为多个小任务，在每个小任务之间让出主线程。

### 为什么需要？
- 保持 UI 响应性
- 不需要 Worker 的复杂通信
- 适合需要访问 DOM 的场景

```typescript
// utils/chunk-task.ts
export async function runChunkedTask<T, R>(
  items: T[],
  processor: (item: T, index: number) => R,
  chunkSize: number = 100
): Promise<R[]> {
  const results: R[] = []
  
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize)
    
    // 处理一批数据
    for (let j = 0; j < chunk.length; j++) {
      results.push(processor(chunk[j], i + j))
    }
    
    // 让出主线程，让 UI 更新
    await new Promise(resolve => setTimeout(resolve, 0))
  }
  
  return results
}

// 使用示例
const processedData = await runChunkedTask(
  largeDataset, // 10000 条数据
  (item) => transformItem(item),
  100 // 每次处理 100 条
)
```

### 使用 requestIdleCallback

```typescript
function processInIdleTime<T>(
  items: T[],
  processor: (item: T) => void,
  onComplete: () => void
) {
  const queue = [...items]
  
  function processChunk(deadline: IdleDeadline) {
    // 在空闲时间内尽可能多地处理
    while (queue.length > 0 && deadline.timeRemaining() > 0) {
      const item = queue.shift()!
      processor(item)
    }
    
    if (queue.length > 0) {
      requestIdleCallback(processChunk)
    } else {
      onComplete()
    }
  }
  
  requestIdleCallback(processChunk)
}
```

---

## 4. 预加载资源

### 是什么？
提前加载用户可能需要的资源（脚本、样式、图片、数据）。

### 为什么需要？
- 减少用户等待时间
- 利用浏览器空闲时间
- 改善感知性能

### 4.1 Link 预加载

```html
<!-- index.html -->
<head>
  <!-- preload: 高优先级，当前页面会用到 -->
  <link rel="preload" href="/fonts/main.woff2" as="font" crossorigin>
  <link rel="preload" href="/api/config" as="fetch" crossorigin>
  
  <!-- prefetch: 低优先级，未来页面可能用到 -->
  <link rel="prefetch" href="/js/detail-page.js">
  
  <!-- preconnect: 提前建立连接 -->
  <link rel="preconnect" href="https://api.example.com">
  <link rel="dns-prefetch" href="https://cdn.example.com">
</head>
```

### 4.2 动态预加载

```typescript
// 鼠标悬停时预加载
function prefetchOnHover(url: string) {
  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = url
  document.head.appendChild(link)
}

// 使用 Intersection Observer 预加载可视区域附近的资源
function setupLazyPrefetch() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const url = entry.target.dataset.prefetch
          if (url) prefetchOnHover(url)
        }
      })
    },
    { rootMargin: '100px' } // 提前 100px 开始预加载
  )
  
  document.querySelectorAll('[data-prefetch]').forEach(el => {
    observer.observe(el)
  })
}
```

### 4.3 Vue Router 预加载

```typescript
// router/index.ts
const routes = [
  {
    path: '/dashboard',
    component: () => import(
      /* webpackPrefetch: true */
      /* webpackChunkName: "dashboard" */
      '@/views/Dashboard.vue'
    )
  }
]

// Vite 中使用
const routes = [
  {
    path: '/dashboard',
    component: () => import('@/views/Dashboard.vue')
  }
]

// 手动预加载路由组件
function prefetchRoute(path: string) {
  const route = router.resolve(path)
  const component = route.matched[0]?.components?.default
  if (typeof component === 'function') {
    component()
  }
}
```

---

## 5. CSS 或 requestAnimationFrame 动画

### 是什么？
使用 CSS 动画或 requestAnimationFrame 代替 JavaScript setInterval/setTimeout 做动画。

### 为什么需要？
- CSS 动画由 GPU 加速
- requestAnimationFrame 与屏幕刷新率同步
- 更流畅、更省电

### CSS 动画（首选）

```css
/* ✅ 使用 CSS 动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 使用 transform 而非 left/top */
.slide-in {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

### requestAnimationFrame

```typescript
// ❌ 不好：使用 setInterval
setInterval(() => {
  element.style.left = `${x++}px`
}, 16)

// ✅ 好：使用 requestAnimationFrame
function animate() {
  element.style.transform = `translateX(${x++}px)`
  
  if (x < targetX) {
    requestAnimationFrame(animate)
  }
}
requestAnimationFrame(animate)
```

### 封装动画函数

```typescript
// utils/animation.ts
export function animateValue(
  from: number,
  to: number,
  duration: number,
  onUpdate: (value: number) => void,
  onComplete?: () => void
) {
  const startTime = performance.now()
  
  function tick(currentTime: number) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    // 缓动函数
    const easeProgress = 1 - Math.pow(1 - progress, 3)
    const currentValue = from + (to - from) * easeProgress
    
    onUpdate(currentValue)
    
    if (progress < 1) {
      requestAnimationFrame(tick)
    } else {
      onComplete?.()
    }
  }
  
  requestAnimationFrame(tick)
}

// 使用示例：数字滚动动画
animateValue(0, 1000, 500, (value) => {
  countEl.textContent = Math.round(value).toString()
})
```

---

## 6. 减少重排重绘

### 是什么？
- **重排（Reflow/Layout）**：计算元素的位置和尺寸
- **重绘（Repaint）**：绘制元素的外观（颜色、阴影等）

### 为什么需要？
重排和重绘是昂贵的操作，频繁触发会导致页面卡顿。

### 6.1 使用 transform 替代位置属性

```css
/* ❌ 会触发重排 */
.move {
  left: 100px;
  top: 50px;
}

/* ✅ 只触发合成，GPU 加速 */
.move {
  transform: translate(100px, 50px);
}
```

### 6.2 合并 DOM 操作

```typescript
// ❌ 多次 DOM 操作，触发多次重排
for (let i = 0; i < 100; i++) {
  container.appendChild(createItem(i))
}

// ✅ 使用 DocumentFragment 合并操作
const fragment = document.createDocumentFragment()
for (let i = 0; i < 100; i++) {
  fragment.appendChild(createItem(i))
}
container.appendChild(fragment) // 只触发一次重排
```

### 6.3 批量修改样式

```typescript
// ❌ 多次触发重排
element.style.width = '100px'
element.style.height = '100px'
element.style.padding = '10px'

// ✅ 方式一：使用 class
element.classList.add('expanded')

// ✅ 方式二：使用 cssText
element.style.cssText = 'width: 100px; height: 100px; padding: 10px;'
```

### 6.4 避免强制同步布局

```typescript
// ❌ 读写交替，每次读取都会强制同步布局
for (let i = 0; i < elements.length; i++) {
  const height = elements[i].offsetHeight // 读取
  elements[i].style.height = height * 2 + 'px' // 写入
}

// ✅ 先读后写，批量操作
const heights = elements.map(el => el.offsetHeight) // 批量读取
elements.forEach((el, i) => {
  el.style.height = heights[i] * 2 + 'px' // 批量写入
})
```

### 触发重排的属性/方法

```
读取以下属性会强制同步布局：
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
offsetTop, offsetLeft, offsetWidth, offsetHeight
clientTop, clientLeft, clientWidth, clientHeight
scrollTop, scrollLeft, scrollWidth, scrollHeight
getComputedStyle()
getBoundingClientRect()
```

---

## 7. 虚拟列表

### 是什么？
只渲染可视区域内的列表项，其他部分用占位符代替。

### 为什么需要？
- 渲染 10000 条数据会创建 10000 个 DOM 节点
- 虚拟列表可能只需要渲染 20-30 个可见项
- 大幅减少内存占用和渲染时间

### 使用 @vueuse/core 的虚拟列表

```vue
<script setup lang="ts">
import { useVirtualList } from '@vueuse/core'

const allItems = ref(Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  name: `Item ${i}`
})))

const { list, containerProps, wrapperProps } = useVirtualList(
  allItems,
  {
    itemHeight: 50, // 每项高度
    overscan: 5     // 上下额外渲染的项数
  }
)
</script>

<template>
  <div v-bind="containerProps" class="h-[400px] overflow-auto">
    <div v-bind="wrapperProps">
      <div 
        v-for="{ data, index } in list" 
        :key="index"
        class="h-[50px]"
      >
        {{ data.name }}
      </div>
    </div>
  </div>
</template>
```

### 推荐库

- `@vueuse/core` - useVirtualList
- `vue-virtual-scroller` - 功能更完整
- `@tanstack/vue-virtual` - 跨框架方案

---

## 8. 高频操作节流处理

### 是什么？
- **防抖（Debounce）**：事件停止触发后才执行，适合搜索框
- **节流（Throttle）**：固定间隔执行一次，适合滚动事件

### 代码实现

```typescript
// utils/throttle.ts
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): T {
  let lastTime = 0
  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now()
    if (now - lastTime >= delay) {
      lastTime = now
      return fn.apply(this, args)
    }
  } as T
}

export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): T {
  let timer: ReturnType<typeof setTimeout> | null = null
  return function (this: any, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  } as T
}
```

### 使用 VueUse

```vue
<script setup lang="ts">
import { useDebounceFn, useThrottleFn } from '@vueuse/core'

// 搜索框：停止输入 300ms 后执行
const debouncedSearch = useDebounceFn((keyword: string) => {
  api.search(keyword)
}, 300)

// 滚动事件：每 100ms 最多执行一次
const throttledScroll = useThrottleFn(() => {
  checkLoadMore()
}, 100)
</script>

<template>
  <input @input="debouncedSearch($event.target.value)">
  <div @scroll="throttledScroll">...</div>
</template>
```

---

## 9. Vue 特定优化

### 9.1 Props 稳定性

```vue
<!-- ❌ 每次父组件更新，都会创建新的对象/函数 -->
<template>
  <ListItem 
    :style="{ color: 'red' }"
    @click="() => handleClick(item)"
  />
</template>

<!-- ✅ 稳定的引用 -->
<script setup>
const itemStyle = { color: 'red' }
const handleItemClick = (item) => handleClick(item)
</script>
<template>
  <ListItem 
    :style="itemStyle"
    @click="handleItemClick"
  />
</template>
```

### 9.2 使用 computed 缓存

```typescript
// ❌ 每次渲染都重新计算
<template>
  <div>{{ items.filter(i => i.active).length }}</div>
</template>

// ✅ 使用 computed 缓存结果
const activeCount = computed(() => items.value.filter(i => i.active).length)
<template>
  <div>{{ activeCount }}</div>
</template>
```

### 9.3 v-once - 只渲染一次

```vue
<!-- 静态内容只渲染一次 -->
<template>
  <div v-once>
    <h1>{{ title }}</h1>
    <p>这段内容永远不会更新</p>
  </div>
</template>
```

### 9.4 v-memo - 有条件地跳过更新

```vue
<template>
  <!-- 只有当 item.id 或 selected 变化时才重新渲染 -->
  <div v-for="item in list" :key="item.id" v-memo="[item.id, selected === item.id]">
    <p>ID: {{ item.id }} - selected: {{ selected === item.id }}</p>
    <!-- 更多复杂内容 -->
  </div>
</template>
```

### 9.5 合理使用 key

```vue
<!-- ❌ 使用 index 作为 key，可能导致错误的复用 -->
<div v-for="(item, index) in list" :key="index">

<!-- ✅ 使用唯一 ID 作为 key -->
<div v-for="item in list" :key="item.id">
```

### 9.6 异步组件

```typescript
import { defineAsyncComponent } from 'vue'

// 异步加载组件
const HeavyComponent = defineAsyncComponent(() => 
  import('./HeavyComponent.vue')
)

// 带加载和错误状态
const AsyncDialog = defineAsyncComponent({
  loader: () => import('./Dialog.vue'),
  loadingComponent: LoadingSpinner,
  errorComponent: ErrorDisplay,
  delay: 200,    // 延迟显示 loading
  timeout: 3000  // 超时时间
})
```

---

## 10. keep-alive 生命周期管理

### 是什么？
使用 `<keep-alive>` 缓存组件时，需要正确管理组件激活/失活的状态。

### 为什么需要？
- 缓存的组件不会销毁，定时器、事件监听会继续运行
- 可能导致内存泄漏和性能问题

### 正确的管理方式

```vue
<script setup lang="ts">
import { onActivated, onDeactivated } from 'vue'

let timer: number | null = null
let unsubscribe: (() => void) | null = null

onActivated(() => {
  // 组件被激活时，恢复定时器和事件监听
  timer = setInterval(fetchData, 5000)
  unsubscribe = eventBus.on('update', handleUpdate)
})

onDeactivated(() => {
  // 组件被缓存时，暂停定时器和事件监听
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  if (unsubscribe) {
    unsubscribe()
    unsubscribe = null
  }
})
</script>
```

---

## 小结

| 优化策略 | 适用场景 | 关键点 |
|----------|----------|--------|
| 避免不必要响应式 | 静态数据、大数据、第三方库 | markRaw、shallowRef |
| Web Workers | CPU 密集计算 | 后台线程执行 |
| 生成器函数 | 需要访问 DOM 的长任务 | 分批执行，让出主线程 |
| 预加载资源 | 可预测的用户行为 | preload、prefetch |
| CSS 动画 | 所有动画效果 | GPU 加速 |
| 减少重排重绘 | DOM 操作 | 批量操作、transform |
| 虚拟列表 | 长列表 | 只渲染可见部分 |
| 节流防抖 | 高频事件 | 控制执行频率 |
| Vue 优化 | 组件渲染 | v-memo、computed、key |
| keep-alive | 页面缓存 | onActivated/onDeactivated |
````

