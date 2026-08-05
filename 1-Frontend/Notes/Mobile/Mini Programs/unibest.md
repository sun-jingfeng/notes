# unibest

## 一、概述

### 1.1 什么是 unibest

**unibest** 是基于 uni-app 的工程化项目模板，内置 Vue 3、TypeScript、Vite、Pinia、UnoCSS 等现代前端工具链，开箱即用，无需从零配置。

**定位：** unibest 不是框架，是 uni-app 的最佳实践脚手架。类比关系：uni-app 之于 unibest，相当于 Vue 之于 create-vue。

| 对比项         | 官方 uni-app 默认模板         | unibest                          |
| -------------- | ----------------------------- | -------------------------------- |
| **Vue 版本**   | Vue 2 / Vue 3 可选            | Vue 3                            |
| **语言**       | JavaScript                    | TypeScript                       |
| **构建工具**   | HBuilderX 内置打包            | Vite                             |
| **状态管理**   | Vuex                          | Pinia + 持久化插件               |
| **样式方案**   | 手写 CSS / SCSS               | UnoCSS（原子化）                 |
| **路由配置**   | `pages.json`（纯 JSON）       | `pages.config.ts`（TypeScript）  |
| **组件注册**   | 手动 import 或 easycom        | 自动扫描注册，零配置使用         |
| **代码规范**   | 无                            | ESLint + Prettier + husky        |

***

### 1.2 技术栈总览

```
uni-app（跨端运行时）
    │
    ├── Vue 3 + TypeScript      # 语法基础
    ├── Vite                    # 构建工具
    ├── Pinia                   # 状态管理
    ├── UnoCSS                  # 原子化 CSS
    ├── pages.config.ts         # 路由配置（替代 pages.json）
    ├── manifest.config.ts      # 应用配置（替代 manifest.json）
    ├── uview-plus / wot-design-uni  # 组件库
    └── pnpm                    # 包管理器
```

***

## 二、项目结构

### 2.1 目录说明

```
my-project/
├── src/
│   ├── pages/              # 主包页面
│   ├── subs/               # 分包页面（按业务模块划分）
│   ├── components/         # 公共组件（easycom 自动注册）
│   ├── layouts/            # 页面布局模板
│   ├── store/              # Pinia 状态（替代 Vuex）
│   ├── composables/        # Vue 3 组合式函数（Hooks）
│   ├── hooks/              # 业务 Hooks
│   ├── api/                # 接口定义
│   ├── network/            # 请求层封装
│   ├── utils/              # 工具函数
│   ├── types/              # TypeScript 类型声明
│   ├── enums/              # 枚举常量
│   ├── configs/            # 业务配置
│   ├── static/             # 静态资源
│   ├── App.vue             # 根组件
│   └── main.ts             # 入口文件
├── pages.config.ts         # 路由与窗口配置（核心）
├── manifest.config.ts      # 应用配置（AppID、平台权限等）
├── vite.config.ts          # Vite 构建配置
├── uno.config.ts           # UnoCSS 配置
├── tsconfig.json           # TypeScript 配置
└── package.json
```

***

### 2.2 pages.config.ts

unibest 用 `pages.config.ts` 替代原来的 `pages.json`，可以使用 TypeScript 语法、变量引用和类型提示。

```typescript
import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'
import { tabBar } from './src/tabbar/config'

export default defineUniPages({
  easycom: {
    autoscan: true,
    custom: {
      // uview-plus 组件前缀映射
      '^u--(.*)': 'uview-plus/components/u-$1/u-$1.vue',
      '^u-([^-].*)': 'uview-plus/components/u-$1/u-$1.vue',
    },
  },
  homePage: '/pages/index/index',  // 首页路径
  globalStyle: {
    navigationBarTitleText: '应用名称',
    navigationBarBackgroundColor: '#f8f8f8',
    navigationBarTextStyle: 'black',
  },
  tabBar: tabBar as any,  // tabBar 配置抽到独立文件维护
})
```

> 💡 tabBar 等复杂配置可以单独放到 `src/tabbar/config.ts` 中，再 import 进来，比纯 JSON 更易维护。

***

### 2.3 manifest.config.ts

`manifest.config.ts` 替代 `manifest.json`，支持从环境变量读取 AppID、版本号等，避免敏感配置硬编码。

```typescript
import { defineManifestConfig } from '@uni-helper/vite-plugin-uni-manifest'
import { loadEnv } from 'vite'

const env = loadEnv(mode, process.cwd())

export default defineManifestConfig({
  name: env.VITE_APP_TITLE,
  appid: env.VITE_UNI_APPID,
  versionName: '1.0.0',
  'mp-weixin': {
    appid: env.VITE_WX_APPID,
    setting: {
      es6: true,
      minified: true,
    },
  },
})
```

***

## 三、Pinia 状态管理

### 3.1 与 Vuex 对比

unibest 使用 Pinia 替代 Vuex，是 Vue 3 官方推荐的状态管理方案。

| 对比项       | Vuex                        | Pinia                       |
| ------------ | --------------------------- | --------------------------- |
| **语法**     | `mutations` / `actions` 分离 | 只有 `actions`，更简洁      |
| **TypeScript** | 类型推导差                | 原生 TypeScript 支持        |
| **模块化**   | 需要 `modules` 配置         | 每个 store 独立文件，天然隔离 |
| **调试**     | Vue DevTools 支持           | Vue DevTools 支持           |

***

### 3.2 定义 Store

```typescript
// src/store/user.ts
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    userInfo: null as UserInfo | null,
  }),
  getters: {
    isLogin: state => !!state.token,
  },
  actions: {
    setToken(token: string) {
      this.token = token
    },
    logout() {
      this.token = ''
      this.userInfo = null
    },
  },
  // 开启持久化，数据存入 uni.setStorageSync
  persist: true,
})
```

```typescript
// 页面中使用
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
console.log(userStore.isLogin)
userStore.setToken('xxx')
```

***

### 3.3 持久化配置

unibest 在 `src/store/index.ts` 中全局配置了 `pinia-plugin-persistedstate`，底层使用 `uni.getStorageSync` / `uni.setStorageSync`，跨端统一。

```typescript
// src/store/index.ts
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

const store = createPinia()
store.use(
  createPersistedState({
    storage: {
      getItem: uni.getStorageSync,
      setItem: uni.setStorageSync,
    },
  }),
)

export default store
```

Store 中加 `persist: true` 即自动持久化全部 state；也可以指定只持久化部分字段：

```typescript
persist: {
  paths: ['token'],  // 只持久化 token，userInfo 不持久化
},
```

***

## 四、UnoCSS 原子化 CSS

### 4.1 基本用法

UnoCSS 通过 class 名称直接生成对应 CSS，无需手写样式文件。

```vue
<template>
  <!-- flex 布局，居中，间距 16rpx，字体红色 -->
  <view class="flex items-center gap-4 text-red-500">
    <text class="text-32rpx font-bold">标题</text>
    <text class="text-24rpx text-gray-400">副标题</text>
  </view>
</template>
```

| class 示例            | 等价 CSS                          |
| --------------------- | --------------------------------- |
| `flex`                | `display: flex`                   |
| `items-center`        | `align-items: center`             |
| `justify-between`     | `justify-content: space-between`  |
| `gap-4`               | `gap: 16rpx`（uni 预设下）        |
| `p-4` / `px-4`        | `padding: 16rpx` / 水平 padding   |
| `text-32rpx`          | `font-size: 32rpx`                |
| `font-bold`           | `font-weight: bold`               |
| `text-primary`        | 主题色文字（需在 uno.config.ts 定义） |
| `bg-white`            | `background-color: white`         |
| `rounded-8rpx`        | `border-radius: 8rpx`             |
| `w-full` / `h-100rpx` | 宽度 100% / 高度 100rpx           |

***

### 4.2 @apply 指令

复杂样式或复用样式可以用 `@apply` 把原子类组合写进 `<style>` 中：

```vue
<style scoped>
.card {
  @apply flex flex-col bg-white rounded-16rpx p-24rpx;
}
.card-title {
  @apply text-32rpx font-bold text-gray-800;
}
</style>
```

***

### 4.3 主题色配置

项目主题色在 `uno.config.ts` 中统一定义，引用 CSS 变量（与组件库主题联动）：

```typescript
// uno.config.ts
theme: {
  colors: {
    primary: {
      DEFAULT: 'var(--wot-color-theme, #f53f3f)',
    },
  },
}
```

使用时直接 `text-primary`、`bg-primary`，修改主题色只需改一处。

***

## 五、环境变量与多环境

### 5.1 环境文件

unibest 支持多套环境配置，通过 `.env.*` 文件区分：

```
.env.dev      # 开发环境
.env.test     # 测试环境
.env.uat      # 预发布环境
.env.prod     # 生产环境
```

```bash
# .env.dev 示例
VITE_APP_TITLE=应用名称
VITE_BASE_URL=https://dev-api.example.com
VITE_WX_APPID=wx_dev_appid
```

> **注意**：uni-app 中环境变量必须以 `VITE_` 开头才能在代码中访问。

***

### 5.2 在代码中使用

```typescript
// 编译时读取（TypeScript 中）
const baseUrl = import.meta.env.VITE_BASE_URL
```

***

## 六、运行与构建命令

### 6.1 常用命令

```bash
# 运行到微信小程序（开发环境）
pnpm dev:mp

# 运行到 H5（开发环境）
pnpm dev

# 运行到 App
pnpm dev:app

# 构建微信小程序（生产环境）
pnpm build:mp:prod

# 构建 H5（生产环境）
pnpm build:prod

# 构建 App（生产环境）
pnpm build:app:prod
```

***

### 6.2 dev:mp 与 build:mp 的区别

```
pnpm dev:mp-weixin  →  command: build, mode: development
pnpm build:mp-weixin →  command: build, mode: production
pnpm dev（H5）      →  command: serve, mode: development
```

> 💡 小程序端无论 dev 还是 build，Vite 的 `command` 都是 `build`（没有 dev server），只有 H5 走 Vite dev server。因此针对小程序的特殊处理要用 `mode` 而非 `command` 来判断。

***

### 6.3 发布流程（微信小程序）

```
① pnpm build:mp:prod
        ↓
② 用微信开发者工具打开 dist/build/mp-weixin 目录
        ↓
③ 点击「上传」，填写版本号
        ↓
④ 在微信公众平台提交审核 → 发布
```

也可通过 CI 脚本自动上传（依赖 `miniprogram-ci`）：

```bash
pnpm ci:mp:prod
```

***

## 七、组件自动引入

### 7.1 easycom 规范

`components/<组件名>/<组件名>.vue` 目录结构的组件，无需 import 和注册，直接在模板中使用。

```
src/components/
└── demo-card/
    └── demo-card.vue   ← 直接用 <demo-card /> 即可
```

第三方组件库（uview-plus、wot-design-uni）在 `pages.config.ts` 的 `easycom.custom` 中配置前缀映射，同样免注册使用。

***

### 7.2 unplugin-auto-import

Vue 3 的 `ref`、`computed`、`watch` 等 API，以及 `uni.*` API，通过 `unplugin-auto-import` 实现自动引入，无需手动 import：

```typescript
// ✅ 直接使用，无需 import { ref } from 'vue'
const count = ref(0)
const double = computed(() => count.value * 2)
```

***

## 八、Vue 3 组合式 API 要点

### 8.1 `<script setup>` 语法

unibest 项目全面使用 `<script setup>`，比 Options API 更简洁，TypeScript 支持更好。

```vue
<script setup lang="ts">
import { useUserStore } from '@/store/user'

// Props 定义
const props = defineProps<{
  title: string
  count?: number
}>()

// Emits 定义
const emit = defineEmits<{
  change: [value: number]
}>()

// 响应式数据
const visible = ref(false)
const userStore = useUserStore()

// 计算属性
const displayTitle = computed(() => `${props.title}（${props.count ?? 0}）`)

// 方法
function handleConfirm() {
  emit('change', 1)
  visible.value = false
}
</script>
```

***

### 8.2 Composables（组合式函数）

把可复用的状态逻辑抽成 `use*` 函数，放在 `src/composables/` 或 `src/hooks/` 下：

```typescript
// src/composables/use-loading.ts
export function useLoading() {
  const loading = ref(false)

  async function withLoading<T>(fn: () => Promise<T>): Promise<T> {
    loading.value = true
    try {
      return await fn()
    }
    finally {
      loading.value = false
    }
  }

  return { loading, withLoading }
}
```

```vue
<script setup lang="ts">
import { useLoading } from '@/composables/use-loading'

const { loading, withLoading } = useLoading()

async function fetchData() {
  await withLoading(() => api.getList())
}
</script>
```
