````markdown
# 代码优化指南 - 第五部分：代码质量与复用

> 好的代码不仅运行效率高，还要易于维护、扩展和团队协作。

---

## 1. 代码格式化工具

### 是什么？
自动统一代码风格的工具，消除团队成员之间的风格差异。

### 为什么需要？
- 消除关于代码风格的无意义争论
- 提高代码可读性和一致性
- 减少代码审查中的格式问题

### 1.1 Prettier（你的项目已配置）

```json
// package.json
{
  "scripts": {
    "format": "prettier --write src/"
  }
}
```

```javascript
// .prettierrc
{
  "semi": false,           // 不使用分号
  "singleQuote": true,     // 使用单引号
  "trailingComma": "es5",  // 尾随逗号
  "tabWidth": 2,           // 缩进宽度
  "printWidth": 100,       // 每行最大字符
  "endOfLine": "lf"        // 换行符
}
```

### 1.2 ESLint（你的项目已配置）

```typescript
// eslint.config.ts
import eslint from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import vueTsConfig from '@vue/eslint-config-typescript'

export default [
  eslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  ...vueTsConfig(),
  {
    rules: {
      // Vue 相关规则
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'warn',
      
      // TypeScript 相关规则
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
    }
  }
]
```

### 1.3 集成 Git Hooks

```bash
# 安装 husky 和 lint-staged
pnpm add -D husky lint-staged

# 初始化 husky
npx husky init
```

```json
// package.json
{
  "lint-staged": {
    "*.{js,ts,vue}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{css,scss}": [
      "stylelint --fix",
      "prettier --write"
    ]
  }
}
```

```bash
# .husky/pre-commit
npx lint-staged
```

---

## 2. TypeScript 类型检查

### 是什么？
使用 TypeScript 的类型系统在编译时捕获错误。

### 为什么需要？
- 提前发现类型错误
- 提供更好的 IDE 支持
- 代码即文档

### 类型定义最佳实践

```typescript
// types/user.ts
export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
  createdAt: Date
}

// 只读类型
export type ReadonlyUser = Readonly<User>

// 部分字段可选
export type UserUpdate = Partial<Pick<User, 'name' | 'email'>>

// API 响应类型
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

// 分页响应
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}
```

### 组件 Props 类型

```vue
<script setup lang="ts">
// 使用 interface 定义 props 类型
interface Props {
  title: string
  count?: number
  items: Array<{ id: number; name: string }>
  status: 'loading' | 'success' | 'error'
}

// 带默认值
const props = withDefaults(defineProps<Props>(), {
  count: 0,
  status: 'loading'
})

// Emits 类型
interface Emits {
  (e: 'update', value: string): void
  (e: 'delete', id: number): void
}
const emit = defineEmits<Emits>()
</script>
```

---

## 3. 组件封装

### 是什么？
将可复用的 UI 和逻辑封装成独立组件。

### 为什么需要？
- 减少重复代码
- 提高可维护性
- 便于测试

### 封装原则

```
组件封装的原则
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. 单一职责：一个组件只做一件事
2. 可配置性：通过 props 配置行为
3. 可组合性：可以与其他组件组合使用
4. 可测试性：容易编写单元测试
5. 文档化：清晰的 props 和 events 定义
```

### 示例：确认对话框组件

```vue
<!-- components/ConfirmDialog/ConfirmDialog.vue -->
<script setup lang="ts">
interface Props {
  visible: boolean
  title?: string
  content: string
  confirmText?: string
  cancelText?: string
  type?: 'info' | 'warning' | 'danger'
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '确认',
  confirmText: '确定',
  cancelText: '取消',
  type: 'info',
  loading: false
})

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

function handleConfirm() {
  emit('confirm')
}

function handleCancel() {
  emit('update:visible', false)
  emit('cancel')
}
</script>

<template>
  <ElDialog
    :model-value="visible"
    :title="title"
    width="400px"
    @update:model-value="emit('update:visible', $event)"
  >
    <p>{{ content }}</p>
    <template #footer>
      <ElButton @click="handleCancel">{{ cancelText }}</ElButton>
      <ElButton 
        :type="type === 'danger' ? 'danger' : 'primary'"
        :loading="loading"
        @click="handleConfirm"
      >
        {{ confirmText }}
      </ElButton>
    </template>
  </ElDialog>
</template>
```

```vue
<!-- 使用 -->
<script setup>
const showDialog = ref(false)
const deleting = ref(false)

async function handleDelete() {
  deleting.value = true
  await api.delete(id)
  deleting.value = false
  showDialog.value = false
}
</script>

<template>
  <ConfirmDialog
    v-model:visible="showDialog"
    title="删除确认"
    content="确定要删除这条记录吗？"
    type="danger"
    :loading="deleting"
    @confirm="handleDelete"
  />
</template>
```

---

## 4. 组合式函数（Composables）

### 是什么？
将相关的响应式逻辑提取到可复用的函数中。

### 为什么需要？
- 逻辑复用（Vue 2 的 mixins 替代方案）
- 更好的类型推断
- 更清晰的依赖关系

### 命名约定

```
composables/
├── useUser.ts        # 用户相关逻辑
├── useTable.ts       # 表格通用逻辑
├── useForm.ts        # 表单通用逻辑
├── useLoading.ts     # 加载状态管理
└── usePagination.ts  # 分页逻辑
```

### 示例：通用表格逻辑

```typescript
// composables/useTable.ts
import { ref, reactive, computed } from 'vue'

interface UseTableOptions<T> {
  fetchData: (params: { page: number; pageSize: number }) => Promise<{
    items: T[]
    total: number
  }>
  defaultPageSize?: number
}

export function useTable<T>(options: UseTableOptions<T>) {
  const { fetchData, defaultPageSize = 10 } = options

  // 状态
  const loading = ref(false)
  const data = ref<T[]>([]) as Ref<T[]>
  const pagination = reactive({
    page: 1,
    pageSize: defaultPageSize,
    total: 0
  })

  // 计算属性
  const isEmpty = computed(() => data.value.length === 0 && !loading.value)
  const totalPages = computed(() => Math.ceil(pagination.total / pagination.pageSize))

  // 方法
  async function loadData() {
    loading.value = true
    try {
      const result = await fetchData({
        page: pagination.page,
        pageSize: pagination.pageSize
      })
      data.value = result.items
      pagination.total = result.total
    } finally {
      loading.value = false
    }
  }

  function handlePageChange(page: number) {
    pagination.page = page
    loadData()
  }

  function handleSizeChange(size: number) {
    pagination.pageSize = size
    pagination.page = 1
    loadData()
  }

  function refresh() {
    loadData()
  }

  function reset() {
    pagination.page = 1
    loadData()
  }

  return {
    // 状态
    loading,
    data,
    pagination,
    isEmpty,
    totalPages,
    // 方法
    loadData,
    handlePageChange,
    handleSizeChange,
    refresh,
    reset
  }
}
```

```vue
<!-- 使用 -->
<script setup lang="ts">
import { useTable } from '@/composables/useTable'
import type { User } from '@/types'

const { 
  loading, 
  data, 
  pagination, 
  loadData, 
  handlePageChange 
} = useTable<User>({
  fetchData: (params) => api.getUsers(params)
})

onMounted(() => {
  loadData()
})
</script>
```

### 示例：表单逻辑

```typescript
// composables/useForm.ts
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

export function useForm<T extends object>(initialValues: T) {
  const formRef = ref<FormInstance>()
  const form = reactive<T>({ ...initialValues })
  const loading = ref(false)

  // 重置表单
  function resetForm() {
    formRef.value?.resetFields()
    Object.assign(form, initialValues)
  }

  // 验证表单
  async function validate(): Promise<boolean> {
    if (!formRef.value) return false
    try {
      await formRef.value.validate()
      return true
    } catch {
      return false
    }
  }

  // 提交表单
  async function submitForm(handler: (data: T) => Promise<void>) {
    const valid = await validate()
    if (!valid) return false

    loading.value = true
    try {
      await handler(form as T)
      return true
    } catch (error) {
      console.error('Submit error:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    formRef,
    form,
    loading,
    resetForm,
    validate,
    submitForm
  }
}
```

---

## 5. 公共资源统一管理

### 5.1 公共样式

```scss
// css/variables.scss - 全局变量
$primary-color: #409eff;
$success-color: #67c23a;
$warning-color: #e6a23c;
$danger-color: #f56c6c;

$font-size-sm: 12px;
$font-size-base: 14px;
$font-size-lg: 16px;

$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;

// css/mixins.scss - 常用混合
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

@mixin ellipsis($lines: 1) {
  @if $lines == 1 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  } @else {
    display: -webkit-box;
    -webkit-line-clamp: $lines;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

@mixin scrollbar {
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 3px;
  }
}
```

### 5.2 公共函数

```typescript
// common/utils.ts
/**
 * 深拷贝对象
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * 格式化金额
 */
export function formatMoney(amount: number, decimals = 2): string {
  return amount.toLocaleString('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
}

/**
 * 生成唯一 ID
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

/**
 * 下载文件
 */
export function downloadFile(url: string, filename: string): void {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
}

/**
 * 复制到剪贴板
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
```

### 5.3 公共常量

```typescript
// common/const.ts
export const CONFIG = {
  basePath: import.meta.env.VITE_BASE_PATH || '/',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  uploadMaxSize: 10 * 1024 * 1024, // 10MB
}

// 状态枚举
export const STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  DISABLED: 'disabled',
} as const

export type StatusType = typeof STATUS[keyof typeof STATUS]

// 状态映射
export const STATUS_MAP = {
  [STATUS.PENDING]: { label: '待审核', color: 'warning' },
  [STATUS.ACTIVE]: { label: '已启用', color: 'success' },
  [STATUS.DISABLED]: { label: '已禁用', color: 'info' },
}

// 正则表达式
export const REGEX = {
  email: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
  phone: /^1[3-9]\d{9}$/,
  idCard: /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/,
  url: /^https?:\/\/.+/,
}

// 分页默认配置
export const PAGINATION = {
  page: 1,
  pageSize: 10,
  pageSizes: [10, 20, 50, 100],
}
```

---

## 6. 解耦策略

### 6.1 组件内：功能分块

```vue
<script setup lang="ts">
// ========== 类型定义 ==========
interface Props {
  id: number
}

// ========== Props & Emits ==========
const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'success'): void
}>()

// ========== 响应式状态 ==========
const loading = ref(false)
const data = ref(null)

// ========== 计算属性 ==========
const isValid = computed(() => /* ... */)

// ========== 方法 ==========
function handleSubmit() { /* ... */ }
function handleCancel() { /* ... */ }

// ========== 生命周期 ==========
onMounted(() => { /* ... */ })

// ========== 暴露 ==========
defineExpose({ refresh: loadData })
</script>
```

### 6.2 组件级别：拆分逻辑

```
views/user/
├── UserList.vue           # 主组件（薄层，组装其他部分）
├── components/
│   ├── UserTable.vue      # 表格组件
│   ├── UserForm.vue       # 表单组件
│   └── UserFilter.vue     # 筛选组件
├── composables/
│   ├── useUserList.ts     # 列表逻辑
│   └── useUserForm.ts     # 表单逻辑
└── const.ts               # 页面常量
```

```vue
<!-- UserList.vue - 主组件保持简洁 -->
<script setup lang="ts">
import UserTable from './components/UserTable.vue'
import UserFilter from './components/UserFilter.vue'
import UserForm from './components/UserForm.vue'
import { useUserList } from './composables/useUserList'

const {
  loading,
  data,
  pagination,
  filter,
  loadData,
  handleDelete
} = useUserList()

onMounted(loadData)
</script>

<template>
  <div class="user-list">
    <UserFilter v-model="filter" @search="loadData" />
    <UserTable 
      :data="data" 
      :loading="loading"
      @delete="handleDelete"
    />
    <ElPagination
      v-model:current-page="pagination.page"
      :total="pagination.total"
      @current-change="loadData"
    />
  </div>
</template>
```

### 6.3 项目级别：微前端

```
适用场景：
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• 多个团队独立开发不同模块
• 需要独立部署不同功能
• 技术栈迁移（新旧系统共存）
• 大型应用拆分

常用方案：
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• qiankun（基于 single-spa）
• micro-app
• Module Federation（Webpack 5）
• iframe（简单但有限制）
```

---

## 7. 重复操作自动化

### 7.1 批量引入（import.meta.glob）

```typescript
// 批量引入 modules 目录下所有 store
const modules = import.meta.glob('./modules/*.ts', { eager: true })

// 批量注册
for (const path in modules) {
  const moduleName = path.match(/\.\/modules\/(.*)\.ts$/)?.[1]
  if (moduleName) {
    const module = modules[path] as { default: any }
    // 注册模块...
  }
}
```

### 7.2 自动注册全局组件

```typescript
// 自动注册 components/global 下的所有组件
const globalComponents = import.meta.glob('./components/global/*.vue', { eager: true })

export function registerGlobalComponents(app: App) {
  for (const path in globalComponents) {
    const name = path.match(/\.\/components\/global\/(.*)\.vue$/)?.[1]
    if (name) {
      const component = globalComponents[path] as { default: Component }
      app.component(name, component.default)
    }
  }
}
```

### 7.3 动态加载组件

```vue
<script setup lang="ts">
import { defineAsyncComponent, shallowRef } from 'vue'

const componentMap: Record<string, () => Promise<any>> = {
  chart: () => import('./ChartComponent.vue'),
  table: () => import('./TableComponent.vue'),
  form: () => import('./FormComponent.vue'),
}

const currentComponent = shallowRef(null)

function loadComponent(type: string) {
  if (componentMap[type]) {
    currentComponent.value = defineAsyncComponent(componentMap[type])
  }
}
</script>

<template>
  <component :is="currentComponent" v-if="currentComponent" />
</template>
```

### 7.4 自动生成路由

```typescript
// 使用 unplugin-vue-router
// vite.config.ts
import VueRouter from 'unplugin-vue-router/vite'

export default defineConfig({
  plugins: [
    VueRouter({
      routesFolder: 'src/views',
      // views/user/index.vue -> /user
      // views/user/[id].vue -> /user/:id
    }),
    vue()
  ]
})
```

---

## 小结

| 优化策略 | 适用场景 | 效果 |
|----------|----------|------|
| 代码格式化 | 团队协作 | 统一风格，减少冲突 |
| TypeScript | 所有项目 | 提前发现错误，增强可维护性 |
| 组件封装 | 重复 UI | 复用代码，统一交互 |
| 组合式函数 | 重复逻辑 | 逻辑复用，清晰依赖 |
| 公共资源 | 全局使用 | 统一管理，便于维护 |
| 解耦 | 复杂模块 | 降低耦合，便于测试 |
| 自动化 | 重复操作 | 减少手动工作，避免遗漏 |
````

