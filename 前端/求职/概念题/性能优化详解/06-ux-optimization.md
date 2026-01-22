````markdown
# 体验优化指南 - 第六部分：用户体验

> 用户体验不仅仅是性能，还包括视觉反馈、状态处理、交互一致性等方面。

---

## 1. 视觉反馈

### 1.1 高亮关键信息

#### 是什么？
使用视觉手段（颜色、字体、图标等）突出重要信息。

#### 为什么需要？
- 帮助用户快速定位关键内容
- 减少信息查找时间
- 提高数据可读性

#### 实现示例

```vue
<script setup lang="ts">
// 状态颜色映射
const statusConfig = {
  success: { color: '#67c23a', icon: 'CircleCheck', label: '成功' },
  warning: { color: '#e6a23c', icon: 'Warning', label: '警告' },
  error: { color: '#f56c6c', icon: 'CircleClose', label: '失败' },
  info: { color: '#909399', icon: 'InfoFilled', label: '信息' }
}

// 数值高亮
function getAmountClass(amount: number) {
  if (amount > 10000) return 'amount-high'
  if (amount < 0) return 'amount-negative'
  return 'amount-normal'
}

// 关键词高亮
function highlightKeyword(text: string, keyword: string) {
  if (!keyword) return text
  const regex = new RegExp(`(${keyword})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}
</script>

<template>
  <!-- 状态标签 -->
  <ElTag :type="statusConfig[status].color">
    <ElIcon><component :is="statusConfig[status].icon" /></ElIcon>
    {{ statusConfig[status].label }}
  </ElTag>

  <!-- 金额高亮 -->
  <span :class="getAmountClass(amount)">
    {{ formatMoney(amount) }}
  </span>

  <!-- 搜索结果高亮 -->
  <div v-html="highlightKeyword(result.title, searchKeyword)" />
</template>

<style scoped>
.amount-high {
  color: #f56c6c;
  font-weight: bold;
}
.amount-negative {
  color: #f56c6c;
}
.amount-normal {
  color: #303133;
}

:deep(mark) {
  background-color: #ffd54f;
  padding: 0 2px;
  border-radius: 2px;
}
</style>
```

---

### 1.2 载入中状态（Loading）

#### 是什么？
在数据加载时显示的视觉反馈，告知用户正在处理。

#### 为什么需要？
- 让用户知道系统正在工作
- 防止用户重复操作
- 减少等待焦虑

#### 多种 Loading 形式

```vue
<script setup lang="ts">
const loading = ref(false)
const buttonLoading = ref(false)
</script>

<template>
  <!-- 1. 全屏 Loading -->
  <div v-loading.fullscreen="loading" />

  <!-- 2. 区域 Loading -->
  <ElTable v-loading="loading" :data="tableData">
    <!-- ... -->
  </ElTable>

  <!-- 3. 按钮 Loading -->
  <ElButton :loading="buttonLoading" @click="handleSubmit">
    提交
  </ElButton>

  <!-- 4. 自定义 Loading 组件 -->
  <div class="content-wrapper">
    <template v-if="loading">
      <div class="custom-loading">
        <div class="spinner"></div>
        <p>加载中...</p>
      </div>
    </template>
    <template v-else>
      <!-- 实际内容 -->
    </template>
  </div>
</template>

<style scoped>
.custom-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #409eff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
```

#### Loading 最佳实践

```typescript
// composables/useLoading.ts
export function useLoading() {
  const loading = ref(false)
  
  async function withLoading<T>(fn: () => Promise<T>): Promise<T> {
    loading.value = true
    try {
      return await fn()
    } finally {
      loading.value = false
    }
  }
  
  return { loading, withLoading }
}

// 使用
const { loading, withLoading } = useLoading()

async function fetchData() {
  await withLoading(async () => {
    const data = await api.getData()
    // 处理数据
  })
}
```

---

### 1.3 骨架屏（Skeleton）

#### 是什么？
在内容加载时显示的占位结构，模拟最终内容的布局。

#### 为什么需要？
- 比 Loading 更好的视觉体验
- 减少布局抖动（CLS）
- 让用户预知内容结构

#### 实现示例

```vue
<!-- components/Skeleton/CardSkeleton.vue -->
<template>
  <div class="card-skeleton">
    <div class="skeleton-image animate-pulse"></div>
    <div class="skeleton-content">
      <div class="skeleton-title animate-pulse"></div>
      <div class="skeleton-text animate-pulse"></div>
      <div class="skeleton-text animate-pulse" style="width: 70%"></div>
    </div>
  </div>
</template>

<style scoped>
.card-skeleton {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.skeleton-image {
  width: 100%;
  height: 200px;
  background: #e0e0e0;
}

.skeleton-content {
  padding: 16px;
}

.skeleton-title {
  height: 20px;
  background: #e0e0e0;
  border-radius: 4px;
  margin-bottom: 12px;
}

.skeleton-text {
  height: 14px;
  background: #e0e0e0;
  border-radius: 4px;
  margin-bottom: 8px;
}

.animate-pulse {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
```

```vue
<!-- 使用 Element Plus 的骨架屏 -->
<template>
  <ElSkeleton :loading="loading" animated :count="3">
    <template #template>
      <ElSkeletonItem variant="image" style="width: 100%; height: 200px" />
      <div style="padding: 14px">
        <ElSkeletonItem variant="h3" style="width: 50%" />
        <ElSkeletonItem variant="text" style="margin-top: 16px" />
        <ElSkeletonItem variant="text" style="width: 60%" />
      </div>
    </template>
    <template #default>
      <!-- 实际内容 -->
      <CardList :data="data" />
    </template>
  </ElSkeleton>
</template>
```

---

### 1.4 页面过渡动画

#### 是什么？
页面切换时的平滑过渡效果。

#### 为什么需要？
- 提供连贯的视觉体验
- 引导用户注意力
- 让应用感觉更流畅

#### Vue Router 过渡

```vue
<!-- App.vue -->
<template>
  <RouterView v-slot="{ Component, route }">
    <Transition :name="route.meta.transition || 'fade'" mode="out-in">
      <KeepAlive :include="cachedViews">
        <component :is="Component" :key="route.path" />
      </KeepAlive>
    </Transition>
  </RouterView>
</template>

<style>
/* 淡入淡出 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 滑动效果 */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease-out;
}

.slide-left-enter-from {
  transform: translateX(20px);
  opacity: 0;
}
.slide-left-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}

.slide-right-enter-from {
  transform: translateX(-20px);
  opacity: 0;
}
.slide-right-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

/* 缩放效果 */
.scale-enter-active,
.scale-leave-active {
  transition: all 0.3s ease;
}
.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
```

#### 列表动画

```vue
<template>
  <TransitionGroup name="list" tag="ul">
    <li v-for="item in items" :key="item.id">
      {{ item.name }}
    </li>
  </TransitionGroup>
</template>

<style>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
/* 确保移动的项目也有动画 */
.list-move {
  transition: transform 0.3s ease;
}
</style>
```

---

## 2. 状态处理

### 2.1 空状态展示

#### 是什么？
当列表或内容为空时显示的占位界面。

#### 为什么需要？
- 避免显示空白页面
- 引导用户下一步操作
- 提供良好的视觉体验

```vue
<!-- components/EmptyState/EmptyState.vue -->
<script setup lang="ts">
interface Props {
  type?: 'no-data' | 'no-result' | 'no-permission' | 'error'
  description?: string
  showAction?: boolean
  actionText?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'no-data',
  showAction: false,
  actionText: '去添加'
})

const emit = defineEmits<{
  (e: 'action'): void
}>()

const config = {
  'no-data': {
    icon: 'Folder',
    title: '暂无数据',
    description: '当前列表为空'
  },
  'no-result': {
    icon: 'Search',
    title: '未找到结果',
    description: '没有找到匹配的内容，请尝试其他关键词'
  },
  'no-permission': {
    icon: 'Lock',
    title: '无权限访问',
    description: '您没有权限查看此内容'
  },
  'error': {
    icon: 'Warning',
    title: '加载失败',
    description: '数据加载出错，请稍后重试'
  }
}
</script>

<template>
  <div class="empty-state">
    <ElIcon :size="64" color="#c0c4cc">
      <component :is="config[type].icon" />
    </ElIcon>
    <h3 class="empty-title">{{ config[type].title }}</h3>
    <p class="empty-description">
      {{ description || config[type].description }}
    </p>
    <ElButton v-if="showAction" type="primary" @click="emit('action')">
      {{ actionText }}
    </ElButton>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-title {
  margin: 16px 0 8px;
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.empty-description {
  margin: 0 0 20px;
  font-size: 14px;
  color: #909399;
}
</style>
```

---

### 2.2 错误状态与降级方案

#### 是什么？
当发生错误时的处理策略和用户反馈。

#### 为什么需要？
- 避免白屏或崩溃
- 告知用户发生了什么
- 提供恢复选项

#### 全局错误边界

```vue
<!-- components/ErrorBoundary/ErrorBoundary.vue -->
<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'

const error = ref<Error | null>(null)
const errorInfo = ref('')

onErrorCaptured((err, instance, info) => {
  error.value = err
  errorInfo.value = info
  
  // 上报错误
  reportError(err, info)
  
  // 返回 false 阻止错误继续传播
  return false
})

function retry() {
  error.value = null
  errorInfo.value = ''
}
</script>

<template>
  <div v-if="error" class="error-boundary">
    <ElResult icon="error" title="页面出错了">
      <template #sub-title>
        <p>{{ error.message }}</p>
        <p v-if="isDev" class="error-stack">{{ error.stack }}</p>
      </template>
      <template #extra>
        <ElButton type="primary" @click="retry">重试</ElButton>
        <ElButton @click="$router.push('/')">返回首页</ElButton>
      </template>
    </ElResult>
  </div>
  <slot v-else />
</template>
```

#### API 错误处理

```typescript
// common/axios.ts
import axios from 'axios'
import { ElMessage } from 'element-plus'

const instance = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// 响应拦截器
instance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // 网络错误
    if (!error.response) {
      ElMessage.error('网络连接失败，请检查网络')
      return Promise.reject(error)
    }
    
    // HTTP 错误
    const { status, data } = error.response
    
    switch (status) {
      case 401:
        ElMessage.error('登录已过期，请重新登录')
        // 跳转登录页
        router.push('/login')
        break
      case 403:
        ElMessage.error('没有权限访问')
        break
      case 404:
        ElMessage.error('请求的资源不存在')
        break
      case 500:
        ElMessage.error('服务器错误，请稍后重试')
        break
      default:
        ElMessage.error(data?.message || '请求失败')
    }
    
    return Promise.reject(error)
  }
)
```

#### 降级方案

```vue
<script setup lang="ts">
const { data, error, isLoading } = useAsyncData(fetchData)

// 降级数据
const fallbackData = {
  title: '暂时无法加载',
  items: []
}
</script>

<template>
  <!-- 优先显示真实数据 -->
  <DataDisplay v-if="data" :data="data" />
  
  <!-- 加载中 -->
  <Skeleton v-else-if="isLoading" />
  
  <!-- 错误时显示降级内容 -->
  <DataDisplay v-else :data="fallbackData">
    <template #header>
      <ElAlert type="warning" :closable="false">
        数据加载失败，显示缓存内容
        <ElButton link @click="retry">重试</ElButton>
      </ElAlert>
    </template>
  </DataDisplay>
</template>
```

---

### 2.3 网络异常处理

```typescript
// composables/useNetworkStatus.ts
import { ref, onMounted, onUnmounted } from 'vue'

export function useNetworkStatus() {
  const isOnline = ref(navigator.onLine)
  const isSlowConnection = ref(false)

  function updateOnlineStatus() {
    isOnline.value = navigator.onLine
  }

  function checkConnectionSpeed() {
    const connection = (navigator as any).connection
    if (connection) {
      // effectiveType: 'slow-2g', '2g', '3g', '4g'
      isSlowConnection.value = ['slow-2g', '2g'].includes(connection.effectiveType)
    }
  }

  onMounted(() => {
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)
    checkConnectionSpeed()
  })

  onUnmounted(() => {
    window.removeEventListener('online', updateOnlineStatus)
    window.removeEventListener('offline', updateOnlineStatus)
  })

  return { isOnline, isSlowConnection }
}
```

```vue
<!-- 使用 -->
<script setup>
import { useNetworkStatus } from '@/composables/useNetworkStatus'

const { isOnline, isSlowConnection } = useNetworkStatus()
</script>

<template>
  <!-- 离线提示 -->
  <Transition name="slide-down">
    <div v-if="!isOnline" class="offline-banner">
      <ElIcon><WarningFilled /></ElIcon>
      网络已断开，部分功能可能不可用
    </div>
  </Transition>
  
  <!-- 弱网提示 -->
  <ElAlert v-if="isSlowConnection" type="warning">
    检测到网络较慢，已为您切换到省流模式
  </ElAlert>
</template>
```

---

## 3. 交互体验

### 3.1 交互操作统一

#### 是什么？
在整个应用中保持一致的交互模式和反馈。

#### 为什么需要？
- 减少用户学习成本
- 提供可预期的体验
- 建立用户信任

#### 统一的操作模式

```typescript
// composables/useConfirm.ts
import { ElMessageBox, ElMessage } from 'element-plus'

interface ConfirmOptions {
  title?: string
  message: string
  type?: 'warning' | 'info' | 'success' | 'error'
  confirmText?: string
  cancelText?: string
}

export function useConfirm() {
  async function confirm(options: ConfirmOptions): Promise<boolean> {
    try {
      await ElMessageBox.confirm(options.message, options.title || '提示', {
        type: options.type || 'warning',
        confirmButtonText: options.confirmText || '确定',
        cancelButtonText: options.cancelText || '取消'
      })
      return true
    } catch {
      return false
    }
  }

  // 删除确认（统一风格）
  async function confirmDelete(name?: string): Promise<boolean> {
    return confirm({
      title: '删除确认',
      message: name ? `确定要删除"${name}"吗？` : '确定要删除吗？',
      type: 'warning'
    })
  }

  // 操作成功提示
  function success(message: string = '操作成功') {
    ElMessage.success(message)
  }

  // 操作失败提示
  function error(message: string = '操作失败') {
    ElMessage.error(message)
  }

  return { confirm, confirmDelete, success, error }
}

// 使用
const { confirmDelete, success } = useConfirm()

async function handleDelete(item) {
  if (await confirmDelete(item.name)) {
    await api.delete(item.id)
    success('删除成功')
    refresh()
  }
}
```

### 3.2 表单验证反馈

```vue
<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'

const formRef = ref<FormInstance>()

const rules: FormRules = {
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ]
}

async function handleSubmit() {
  try {
    await formRef.value?.validate()
    // 验证通过，提交数据
  } catch {
    // 验证失败，错误信息已自动显示
    ElMessage.warning('请检查表单填写')
  }
}
</script>

<template>
  <ElForm ref="formRef" :model="form" :rules="rules" label-width="100px">
    <ElFormItem label="名称" prop="name">
      <ElInput v-model="form.name" placeholder="请输入名称" />
    </ElFormItem>
    
    <ElFormItem label="邮箱" prop="email">
      <ElInput v-model="form.email" placeholder="请输入邮箱" />
    </ElFormItem>
    
    <ElFormItem>
      <ElButton type="primary" @click="handleSubmit">提交</ElButton>
      <ElButton @click="formRef?.resetFields()">重置</ElButton>
    </ElFormItem>
  </ElForm>
</template>
```

### 3.3 操作确认

```typescript
// 危险操作需要二次确认
async function handleDangerousAction() {
  // 第一次确认
  const confirmed = await ElMessageBox.confirm(
    '此操作将永久删除所有数据，是否继续？',
    '警告',
    { type: 'warning' }
  ).catch(() => false)
  
  if (!confirmed) return
  
  // 二次确认（输入确认文字）
  const { value } = await ElMessageBox.prompt(
    '请输入 "确认删除" 以继续',
    '二次确认',
    {
      inputPattern: /^确认删除$/,
      inputErrorMessage: '请输入正确的确认文字'
    }
  ).catch(() => ({ value: null }))
  
  if (value !== '确认删除') return
  
  // 执行操作
  await api.deleteAll()
}
```

### 3.4 快捷键支持

```typescript
// composables/useKeyboardShortcuts.ts
import { onMounted, onUnmounted } from 'vue'

interface Shortcut {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  handler: () => void
  description?: string
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  function handleKeydown(event: KeyboardEvent) {
    for (const shortcut of shortcuts) {
      const ctrlMatch = shortcut.ctrl ? (event.ctrlKey || event.metaKey) : true
      const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey
      const altMatch = shortcut.alt ? event.altKey : !event.altKey
      
      if (
        event.key.toLowerCase() === shortcut.key.toLowerCase() &&
        ctrlMatch && shiftMatch && altMatch
      ) {
        event.preventDefault()
        shortcut.handler()
        break
      }
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
}

// 使用
useKeyboardShortcuts([
  {
    key: 's',
    ctrl: true,
    handler: () => saveDocument(),
    description: '保存'
  },
  {
    key: 'k',
    ctrl: true,
    handler: () => openSearch(),
    description: '搜索'
  },
  {
    key: 'Escape',
    handler: () => closeModal(),
    description: '关闭弹窗'
  }
])
```

---

## 4. 可访问性（a11y）

### 4.1 语义化 HTML

```vue
<template>
  <!-- ✅ 好：使用语义化标签 -->
  <article>
    <header>
      <h1>{{ article.title }}</h1>
      <time :datetime="article.date">{{ formatDate(article.date) }}</time>
    </header>
    <main>
      <p>{{ article.content }}</p>
    </main>
    <footer>
      <nav aria-label="文章导航">
        <a :href="prevLink">上一篇</a>
        <a :href="nextLink">下一篇</a>
      </nav>
    </footer>
  </article>

  <!-- ❌ 不好：全是 div -->
  <div>
    <div>
      <div>{{ article.title }}</div>
      <div>{{ article.date }}</div>
    </div>
    <div>{{ article.content }}</div>
  </div>
</template>
```

### 4.2 ARIA 属性

```vue
<template>
  <!-- 按钮 -->
  <button 
    aria-label="关闭对话框"
    aria-pressed="false"
    @click="close"
  >
    <span aria-hidden="true">×</span>
  </button>

  <!-- 表单 -->
  <div role="form" aria-labelledby="form-title">
    <h2 id="form-title">用户注册</h2>
    <label for="username">用户名</label>
    <input 
      id="username"
      aria-required="true"
      aria-invalid="hasError"
      aria-describedby="username-error"
    />
    <span id="username-error" role="alert" v-if="hasError">
      {{ errorMessage }}
    </span>
  </div>

  <!-- 加载状态 -->
  <div 
    role="status" 
    aria-live="polite"
    aria-busy="true"
  >
    加载中...
  </div>

  <!-- 导航菜单 -->
  <nav aria-label="主导航">
    <ul role="menubar">
      <li role="none">
        <a role="menuitem" href="/">首页</a>
      </li>
      <li role="none">
        <a role="menuitem" href="/about">关于</a>
      </li>
    </ul>
  </nav>
</template>
```

### 4.3 键盘导航

```vue
<script setup lang="ts">
const activeIndex = ref(0)
const items = ref(['选项1', '选项2', '选项3'])

function handleKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      activeIndex.value = (activeIndex.value + 1) % items.value.length
      break
    case 'ArrowUp':
      event.preventDefault()
      activeIndex.value = (activeIndex.value - 1 + items.value.length) % items.value.length
      break
    case 'Enter':
    case ' ':
      event.preventDefault()
      selectItem(activeIndex.value)
      break
  }
}
</script>

<template>
  <ul 
    role="listbox"
    tabindex="0"
    @keydown="handleKeydown"
  >
    <li
      v-for="(item, index) in items"
      :key="index"
      role="option"
      :aria-selected="index === activeIndex"
      :class="{ active: index === activeIndex }"
      @click="selectItem(index)"
    >
      {{ item }}
    </li>
  </ul>
</template>

<style scoped>
[role="listbox"]:focus {
  outline: 2px solid #409eff;
}
.active {
  background-color: #ecf5ff;
}
</style>
```

---

## 小结

| 优化策略 | 适用场景 | 效果 |
|----------|----------|------|
| 高亮关键信息 | 状态、金额、搜索 | 快速定位重要内容 |
| 载入中状态 | 异步操作 | 减少等待焦虑 |
| 骨架屏 | 页面加载 | 减少布局抖动 |
| 页面过渡 | 路由切换 | 平滑的视觉体验 |
| 空状态 | 列表为空 | 避免空白页面 |
| 错误处理 | 异常情况 | 优雅降级 |
| 交互统一 | 全应用 | 可预期的体验 |
| 可访问性 | 全应用 | 面向所有用户 |

**体验优化核心原则**：
1. **即时反馈**：任何操作都要有反馈
2. **状态可见**：让用户知道当前状态
3. **错误可恢复**：提供重试和替代方案
4. **操作可预期**：保持一致的交互模式
````

