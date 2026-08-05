# unibest

## I. Overview

### 1.1 What unibest Is

**unibest** is an engineering template for uni-app projects, preconfigured with Vue 3, TypeScript, Vite, Pinia, and UnoCSS — a working toolchain from the first commit rather than one assembled by hand.

**Positioning:** unibest is not a framework but a best-practice scaffold for uni-app, standing in the same relation to it as create-vue does to Vue.

| Aspect               | Official uni-app template     | unibest                             |
| -------------------- | ----------------------------- | ----------------------------------- |
| **Vue version**      | Vue 2 or Vue 3                | Vue 3                               |
| **Language**         | JavaScript                    | TypeScript                          |
| **Build tool**       | HBuilderX bundler             | Vite                                |
| **State management** | Vuex                          | Pinia with a persistence plugin     |
| **Styling**          | Hand-written CSS / SCSS       | UnoCSS (atomic)                     |
| **Route config**     | `pages.json` (plain JSON)     | `pages.config.ts` (TypeScript)      |
| **Component registration** | Manual import or easycom | Automatic scanning, zero configuration |
| **Code standards**   | None                          | ESLint, Prettier, husky             |

### 1.2 Technology Stack

    uni-app (cross-platform runtime)
        │
        ├── Vue 3 + TypeScript           # Language foundation
        ├── Vite                         # Build tool
        ├── Pinia                        # State management
        ├── UnoCSS                       # Atomic CSS
        ├── pages.config.ts              # Route configuration, replacing pages.json
        ├── manifest.config.ts           # App configuration, replacing manifest.json
        ├── uview-plus / wot-design-uni  # Component library
        └── pnpm                         # Package manager

***

## II. Project Structure

### 2.1 Directory Layout

```
my-project/
├── src/
│   ├── pages/              # Main-package pages
│   ├── subs/               # Sub-package pages, split by business module
│   ├── components/         # Shared components (registered automatically)
│   ├── layouts/            # Page layout templates
│   ├── store/              # Pinia stores
│   ├── composables/        # Composition-API functions
│   ├── hooks/              # Domain-specific hooks
│   ├── api/                # API definitions
│   ├── network/            # Request layer
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript type declarations
│   ├── enums/              # Enumerated constants
│   ├── configs/            # Application configuration
│   ├── static/             # Static assets
│   ├── App.vue             # Root component
│   └── main.ts             # Entry file
├── pages.config.ts         # Route and window configuration
├── manifest.config.ts      # App configuration (AppID, platform permissions)
├── vite.config.ts          # Vite build configuration
├── uno.config.ts           # UnoCSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json
```

> 💡 Sub-packages exist because mini-program platforms cap the main package size (2 MB on WeChat, 20 MB in total). Splitting rarely visited flows into `subs/` keeps the main package under the limit and shortens first load.

### 2.2 pages.config.ts

`pages.config.ts` replaces `pages.json`, which brings TypeScript syntax, variable references, imports, and type checking to route configuration. The plugin generates the `pages.json` the runtime expects at build time.

```typescript
import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'
import { tabBar } from './src/tabbar/config'

export default defineUniPages({
  easycom: {
    autoscan: true,
    custom: {
      // Prefix mapping for a third-party component library
      '^u--(.*)': 'uview-plus/components/u-$1/u-$1.vue',
      '^u-([^-].*)': 'uview-plus/components/u-$1/u-$1.vue',
    },
  },
  homePage: '/pages/index/index',
  globalStyle: {
    navigationBarTitleText: 'Demo App',
    navigationBarBackgroundColor: '#f8f8f8',
    navigationBarTextStyle: 'black',
  },
  tabBar: tabBar as any,
})
```

> 💡 Extracting bulky configuration such as `tabBar` into its own module and importing it keeps this file readable — an option plain JSON never offered.

### 2.3 manifest.config.ts

`manifest.config.ts` replaces `manifest.json` and can read the AppID, title, and version from environment variables, so per-environment values stay out of version control.

```typescript
import { defineManifestConfig } from '@uni-helper/vite-plugin-uni-manifest'
import { loadEnv } from 'vite'
import path from 'node:path'

// The current mode comes from NODE_ENV; the third argument widens the
// prefix filter so non-VITE_ keys are readable here as well
const env = loadEnv(
  process.env.NODE_ENV ?? 'development',
  path.resolve(process.cwd(), 'env'),
)

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

## III. Pinia State Management

### 3.1 Compared With Vuex

Pinia replaces Vuex as the state library, and is the officially recommended option for Vue 3.

| Aspect           | Vuex                                | Pinia                                     |
| ---------------- | ----------------------------------- | ----------------------------------------- |
| **Syntax**       | `mutations` and `actions` separated | `actions` only — less ceremony            |
| **TypeScript**   | Weak inference                      | Native TypeScript support                 |
| **Modularity**   | Requires `modules` configuration    | One file per store, isolated by construction |
| **Debugging**    | Vue DevTools                        | Vue DevTools                              |

### 3.2 Defining a Store

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
  // Persist through the storage adapter configured on the pinia instance
  persist: true,
})
```

```typescript
// In a page or component
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
console.log(userStore.isLogin)
userStore.setToken('<token>')
```

> **Note**: destructuring a store — `const { token } = useUserStore()` — breaks reactivity, because the extracted value is a plain copy. `storeToRefs(userStore)` preserves it.

### 3.3 Persistence

Persistence is configured once on the pinia instance, backed by `uni.getStorageSync` and `uni.setStorageSync` so the same code works on every platform.

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

`persist: true` on a store persists its entire state. A subset can be selected instead:

```typescript
persist: {
  paths: ['token'],    // Persist the token only; userInfo is refetched on launch
},
```

> **Note**: the option selecting a subset is `paths` in v3 of the plugin and `pick` in v4. Check the installed version before copying either form.

***

## IV. UnoCSS

### 4.1 Basic Usage

UnoCSS generates CSS from the class names found in the source, so styling stays in the template and no rule is emitted unless it is used.

```vue
<template>
  <view class="flex items-center gap-4 text-red-500">
    <text class="text-32rpx font-bold">Title</text>
    <text class="text-24rpx text-gray-400">Subtitle</text>
  </view>
</template>
```

| Class                 | Equivalent CSS                              |
| --------------------- | ------------------------------------------- |
| `flex`                | `display: flex`                             |
| `items-center`        | `align-items: center`                       |
| `justify-between`     | `justify-content: space-between`            |
| `gap-4`               | `gap: 16rpx` (under this project's preset)  |
| `p-4` / `px-4`        | `padding: 16rpx` / horizontal padding only  |
| `text-32rpx`          | `font-size: 32rpx`                          |
| `font-bold`           | `font-weight: bold`                         |
| `text-primary`        | Theme-coloured text, defined in `uno.config.ts` |
| `bg-white`            | `background-color: white`                   |
| `rounded-8rpx`        | `border-radius: 8rpx`                       |
| `w-full` / `h-100rpx` | `width: 100%` / `height: 100rpx`            |

> **Note**: class names must appear as complete literal strings in the source. A dynamically assembled name such as `` `text-${size}rpx` `` is invisible to the scanner and produces no CSS — the safelist option or a full conditional class name is required instead.

### 4.2 The @apply Directive

Repeated or complex combinations move into a `<style>` block through `@apply`:

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

### 4.3 Theme Colours

Theme colours are declared once in `uno.config.ts` and reference a CSS variable, which keeps them in step with the component library's own theming.

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

`text-primary` and `bg-primary` then resolve to the theme colour everywhere, and rebranding touches one declaration.

***

## V. Environment Variables

### 5.1 Environment Files

Separate `.env.*` files hold per-environment configuration:

```
.env.dev      # Development
.env.test     # Testing
.env.uat      # Pre-release
.env.prod     # Production
```

```bash
# .env.dev
VITE_APP_TITLE=Demo App
VITE_BASE_URL=https://dev-api.example.com
VITE_WX_APPID=<development-appid>
```

> **Note**: only variables prefixed with `VITE_` are exposed to client code. That prefix also means the value is compiled into the bundle and readable by anyone who inspects it — never place a secret in one.

### 5.2 Reading Values in Code

```typescript
// Replaced at build time with the literal value
const baseUrl = import.meta.env.VITE_BASE_URL
```

***

## VI. Running and Building

### 6.1 Common Commands

```bash
# Development
pnpm dev              # H5
pnpm dev:mp           # WeChat mini program
pnpm dev:app          # Native app

# Production builds
pnpm build:prod       # H5
pnpm build:mp:prod    # WeChat mini program
pnpm build:app:prod   # Native app
```

### 6.2 dev and build on Mini-Program Targets

    pnpm dev:mp-weixin    →  command: build,  mode: development
    pnpm build:mp-weixin  →  command: build,  mode: production
    pnpm dev (H5)         →  command: serve,  mode: development

Mini-program targets have no dev server, so Vite's `command` is `build` in both cases and only the `mode` differs. Configuration that needs to distinguish a development build from a production one must therefore branch on `mode`; branching on `command` silently takes the build path in development too.

### 6.3 Publishing a WeChat Mini Program

    ① pnpm build:mp:prod
            ↓
    ② Open dist/build/mp-weixin in WeChat DevTools
            ↓
    ③ Click Upload and enter a version number
            ↓
    ④ Submit for review in the WeChat MP console, then release

Uploading can also run unattended in CI through `miniprogram-ci`:

```bash
pnpm ci:mp:prod
```

***

## VII. Automatic Imports

### 7.1 easycom

A component stored as `components/<name>/<name>.vue` is usable in any template with no import and no registration.

```
src/components/
└── demo-card/
    └── demo-card.vue    ← available as <demo-card />
```

Third-party libraries such as uview-plus and wot-design-uni are wired in through the `easycom.custom` prefix mapping in `pages.config.ts`, and behave the same way.

### 7.2 unplugin-auto-import

Vue APIs (`ref`, `computed`, `watch`) and the `uni.*` namespace are injected automatically, so no import statement is needed:

```typescript
// ✅ Works without import { ref, computed } from 'vue'
const count = ref(0)
const double = computed(() => count.value * 2)
```

The plugin generates a declaration file that gives the editor and `tsc` visibility into these globals. That file is generated during the first dev or build run, so a freshly cloned checkout reports unresolved names in the editor until a build has run once.

***

## VIII. Vue 3 Composition API

### 8.1 `<script setup>`

Pages and components use `<script setup>` throughout, which removes the boilerplate of Options API and gives better type inference.

```vue
<script setup lang="ts">
import { useUserStore } from '@/store/user'

// Props, typed by declaration
const props = defineProps<{
  title: string
  count?: number
}>()

// Emits, typed by declaration
const emit = defineEmits<{
  change: [value: number]
}>()

const visible = ref(false)
const userStore = useUserStore()

const displayTitle = computed(() => `${props.title} (${props.count ?? 0})`)

function handleConfirm() {
  emit('change', 1)
  visible.value = false
}
</script>
```

> **Note**: mini-program page lifecycle hooks have composition-API equivalents (`onLoad`, `onShow`, `onReachBottom`) exported by `@dcloudio/uni-app`, and these are what a `<script setup>` page uses in place of Options-API hooks.

### 8.2 Composables

Reusable stateful logic is extracted into `use*` functions under `src/composables/` or `src/hooks/`:

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
      // finally guarantees the flag resets even when fn throws
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
