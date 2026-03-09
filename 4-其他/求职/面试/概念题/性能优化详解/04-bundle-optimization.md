````markdown
# 性能优化指南 - 第四部分：体积优化

> 打包体积直接影响首屏加载速度，特别是在网络较慢的情况下。

---

## 1. 按需引入

### 是什么？
只引入实际使用到的代码，而不是整个库。

### 为什么需要？
```
全量引入 vs 按需引入
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Element Plus 全量:  ~800KB
Element Plus 按需:  按使用量，可能只有 ~100KB

lodash 全量:        ~70KB  
lodash-es 按需:     按使用量，可能只有 ~5KB
```

### Element Plus 按需引入（你的项目已配置）

```typescript
// vite.config.ts - 你的项目已有这个配置 ✅
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
})
```

### 图标按需引入

```typescript
// ❌ 你的项目目前全量引入了图标
// main.ts
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
// 这会把所有图标都打包进去

// ✅ 推荐：按需引入
// 方式一：直接在组件中引入
import { Search, Edit, Delete } from '@element-plus/icons-vue'

// 方式二：使用 unplugin-icons 自动引入
// vite.config.ts
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

export default defineConfig({
  plugins: [
    Components({
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({
          prefix: 'Icon',
          enabledCollections: ['ep'] // element-plus 图标
        })
      ],
    }),
    Icons({
      autoInstall: true
    })
  ],
})

// 使用
<template>
  <IconEpSearch />  <!-- 自动按需引入 -->
</template>
```

### lodash 按需引入

```typescript
// ❌ 全量引入
import _ from 'lodash'
_.debounce(fn, 300)

// ✅ 按需引入（从 lodash-es）
import { debounce } from 'lodash-es'
debounce(fn, 300)

// ✅ 或者单独引入
import debounce from 'lodash/debounce'
```

---

## 2. Tree Shaking

### 是什么？
构建工具自动移除未使用的代码（"摇掉"没用的"树叶"）。

### 为什么需要？
- 自动减少打包体积
- 不需要手动管理每个导入

### 前提条件

```typescript
// 1. 使用 ES Module 语法
// ✅ 可以 Tree Shaking
import { ref } from 'vue'

// ❌ 无法 Tree Shaking
const { ref } = require('vue')

// 2. 库需要提供 ESM 版本
// package.json 中有 "module" 或 "exports" 字段
{
  "main": "dist/index.cjs.js",    // CommonJS
  "module": "dist/index.esm.js",  // ESM - 用于 Tree Shaking
  "exports": {
    ".": {
      "import": "./dist/index.esm.js",
      "require": "./dist/index.cjs.js"
    }
  }
}
```

### Vite 默认支持 Tree Shaking

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    // Vite 使用 Rollup，默认启用 Tree Shaking
    rollupOptions: {
      output: {
        // 可以配置手动分包
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
        }
      }
    }
  }
})
```

### 检验 Tree Shaking 效果

```typescript
// 使用打包分析工具查看
// vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    visualizer({
      open: true,
      gzipSize: true
    })
  ]
})
```

---

## 3. 代码分割（Code Splitting）

### 是什么？
将代码拆分成多个小块，按需加载。

### 为什么需要？
- 减少首屏加载的代码量
- 并行加载多个小文件
- 利用浏览器缓存

### 3.1 路由懒加载（你的项目已使用）

```typescript
// router/index.ts - 你的项目已有 ✅
const routes = [
  {
    path: '/login',
    component: () => import('@/views/login/login.vue'),
    // Vite 会自动将其分割成单独的 chunk
  },
  {
    path: '/home',
    component: () => import('@/views/home/home.vue'),
  },
]
```

### 3.2 手动分包配置

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 将 Vue 相关库打包到一起
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          // 将 Element Plus 单独打包
          'element-plus': ['element-plus'],
          // 将工具库打包到一起
          'utils': ['lodash-es', 'dayjs', 'axios'],
        }
      }
    }
  }
})

// 或者使用函数动态分包
manualChunks(id) {
  if (id.includes('node_modules')) {
    if (id.includes('vue') || id.includes('pinia')) {
      return 'vue-vendor'
    }
    if (id.includes('element-plus')) {
      return 'element-plus'
    }
    return 'vendor'
  }
}
```

### 3.3 异步组件分割

```typescript
import { defineAsyncComponent } from 'vue'

// 自动分割成单独的 chunk
const HeavyChart = defineAsyncComponent(() => 
  import('./components/HeavyChart.vue')
)

// 条件加载
const AdminPanel = defineAsyncComponent(() =>
  user.isAdmin ? import('./AdminPanel.vue') : import('./UserPanel.vue')
)
```

---

## 4. CDN 加速

### 是什么？
将静态资源托管到 CDN（内容分发网络），从离用户最近的节点加载。

### 为什么需要？
- 减少服务器带宽
- 加快资源加载速度
- 利用浏览器跨域缓存

### 4.1 外部化依赖 + CDN

```typescript
// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      // 外部化依赖，不打包进 bundle
      external: ['vue', 'vue-router', 'element-plus'],
      output: {
        globals: {
          vue: 'Vue',
          'vue-router': 'VueRouter',
          'element-plus': 'ElementPlus'
        }
      }
    }
  }
})
```

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
<head>
  <!-- CDN 引入 -->
  <link rel="stylesheet" href="https://unpkg.com/element-plus/dist/index.css">
</head>
<body>
  <div id="app"></div>
  
  <!-- 依赖 CDN -->
  <script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
  <script src="https://unpkg.com/vue-router@4/dist/vue-router.global.prod.js"></script>
  <script src="https://unpkg.com/element-plus/dist/index.full.min.js"></script>
  
  <!-- 应用代码 -->
  <script type="module" src="/src/main.ts"></script>
</body>
</html>
```

### 4.2 使用 vite-plugin-cdn-import

```typescript
// 安装: pnpm add -D vite-plugin-cdn-import
import { defineConfig } from 'vite'
import { Plugin as importToCDN } from 'vite-plugin-cdn-import'

export default defineConfig({
  plugins: [
    importToCDN({
      modules: [
        {
          name: 'vue',
          var: 'Vue',
          path: 'https://unpkg.com/vue@3/dist/vue.global.prod.js'
        },
        {
          name: 'element-plus',
          var: 'ElementPlus',
          path: 'https://unpkg.com/element-plus/dist/index.full.min.js',
          css: 'https://unpkg.com/element-plus/dist/index.css'
        }
      ]
    })
  ]
})
```

### 4.3 图片/静态资源 CDN

```typescript
// 将构建产物上传到 CDN 后，配置 base 路径
// vite.config.ts
export default defineConfig({
  base: 'https://cdn.example.com/my-app/', // 生产环境使用 CDN
})
```

---

## 5. 资源压缩

### 5.1 Gzip / Brotli 压缩

```typescript
// 安装: pnpm add -D vite-plugin-compression
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    // Gzip 压缩
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240, // 大于 10KB 才压缩
    }),
    // Brotli 压缩（压缩率更高）
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240,
    }),
  ]
})
```

```nginx
# Nginx 配置启用压缩
server {
    # 动态压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
    gzip_min_length 1000;
    
    # 优先使用预压缩文件
    gzip_static on;
    brotli_static on;
}
```

### 5.2 JS/CSS 压缩

```typescript
// Vite 生产构建默认使用 esbuild 压缩 JS
// 可以切换到 terser 获得更好的压缩率
export default defineConfig({
  build: {
    minify: 'terser', // 'esbuild' | 'terser'
    terserOptions: {
      compress: {
        drop_console: true,  // 移除 console
        drop_debugger: true, // 移除 debugger
      }
    },
    cssMinify: true, // CSS 压缩
  }
})
```

---

## 6. 图片优化

### 6.1 图片压缩

```typescript
// 安装: pnpm add -D vite-plugin-imagemin
import viteImagemin from 'vite-plugin-imagemin'

export default defineConfig({
  plugins: [
    viteImagemin({
      gifsicle: { optimizationLevel: 7 },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 80 },
      pngquant: { quality: [0.8, 0.9] },
      svgo: {
        plugins: [
          { name: 'removeViewBox' },
          { name: 'removeEmptyAttrs', active: false }
        ]
      }
    })
  ]
})
```

### 6.2 使用现代图片格式

```vue
<template>
  <!-- 使用 picture 元素提供多种格式 -->
  <picture>
    <!-- 优先使用 AVIF（压缩率最高） -->
    <source srcset="/image.avif" type="image/avif">
    <!-- 其次使用 WebP -->
    <source srcset="/image.webp" type="image/webp">
    <!-- 兜底使用 JPEG -->
    <img src="/image.jpg" alt="描述">
  </picture>
</template>
```

### 6.3 图片懒加载

```vue
<template>
  <!-- 原生懒加载 -->
  <img src="/image.jpg" loading="lazy" alt="描述">
  
  <!-- 使用 Intersection Observer -->
  <img 
    v-lazy="imageSrc" 
    alt="描述"
  >
</template>

<script setup>
// 自定义懒加载指令
const vLazy = {
  mounted(el, binding) {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.src = binding.value
        observer.disconnect()
      }
    })
    observer.observe(el)
  }
}
</script>
```

### 6.4 响应式图片

```vue
<template>
  <img 
    srcset="
      /image-320.jpg 320w,
      /image-640.jpg 640w,
      /image-1280.jpg 1280w
    "
    sizes="
      (max-width: 320px) 280px,
      (max-width: 640px) 600px,
      1200px
    "
    src="/image-1280.jpg"
    alt="描述"
  >
</template>
```

---

## 7. 移除未使用的 CSS

### 使用 PurgeCSS

```typescript
// 安装: pnpm add -D @fullhuman/postcss-purgecss
// postcss.config.js
import purgecss from '@fullhuman/postcss-purgecss'

export default {
  plugins: [
    purgecss({
      content: [
        './index.html',
        './src/**/*.{vue,js,ts,jsx,tsx}'
      ],
      // 保护某些样式不被移除
      safelist: [
        /^el-/,  // Element Plus 样式
        /^is-/,
        /data-v-/
      ]
    })
  ]
}
```

### 使用 UnCSS（更激进）

```typescript
// 安装: pnpm add -D postcss-uncss
import uncss from 'postcss-uncss'

export default {
  plugins: [
    uncss({
      html: ['./index.html', './src/**/*.vue'],
      ignore: [/\.el-/, /\.is-/]
    })
  ]
}
```

---

## 8. 分析与监控

### 打包体积分析

```typescript
// vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    visualizer({
      open: true,
      filename: 'stats.html',
      gzipSize: true,
      brotliSize: true
    })
  ]
})
```

### 打包体积限制

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    // 单个 chunk 超过 500KB 时警告
    chunkSizeWarningLimit: 500,
    
    rollupOptions: {
      output: {
        // 限制资源体积
        experimentalMinChunkSize: 10000, // 最小 chunk 10KB
      }
    }
  }
})
```

---

## 小结：你的项目优化建议

基于对你项目的分析，以下是具体建议：

### ✅ 已做好的
- 路由懒加载
- Element Plus 组件按需引入
- unplugin-auto-import 自动导入

### ⚠️ 建议优化的

1. **图标按需引入**（当前全量引入）
```typescript
// 当前 main.ts 中全量引入了图标，建议改为按需引入
```

2. **添加打包压缩**
```typescript
// 添加 vite-plugin-compression
```

3. **添加打包分析**
```typescript
// 添加 rollup-plugin-visualizer 分析体积
```

4. **配置手动分包**
```typescript
// 将 vue 相关库和业务代码分开
```

| 优化项 | 效果 | 优先级 |
|--------|------|--------|
| 图标按需引入 | 减少 ~50KB | 高 |
| Gzip 压缩 | 减少 60-70% 体积 | 高 |
| 手动分包 | 提高缓存命中率 | 中 |
| 图片压缩 | 减少图片体积 | 视图片数量 |
````

