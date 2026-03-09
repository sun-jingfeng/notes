````markdown
# 性能优化指南 - 第一部分：检测工具

> 在进行性能优化之前，首先需要知道问题在哪里。以下是常用的性能检测工具。

---

## 1. Chrome 控制台的 Performance

### 是什么？
Chrome DevTools 的 Performance 面板是一个强大的运行时性能分析工具，可以记录和分析页面在一段时间内的所有活动。

### 为什么需要？
- 精确定位 JavaScript 执行中的性能瓶颈
- 分析页面渲染过程中的重排（Layout）和重绘（Paint）
- 查看主线程的任务分布和长任务（Long Tasks）
- 分析内存使用情况和潜在的内存泄漏

### 如何使用？

1. **打开 DevTools**：按 `F12` 或 `Cmd + Option + I`（Mac）
2. **切换到 Performance 标签**
3. **点击录制按钮**（或按 `Cmd + E`）
4. **执行需要分析的操作**
5. **停止录制并分析结果**

### 关键指标解读

```
┌─────────────────────────────────────────────────────────────┐
│  Performance 面板结构                                        │
├─────────────────────────────────────────────────────────────┤
│  📊 Overview（概览）                                         │
│     - FPS（帧率）：绿色条越高越好，红色表示卡顿                  │
│     - CPU：各类任务的 CPU 占用                                │
│     - NET：网络请求时间线                                     │
├─────────────────────────────────────────────────────────────┤
│  📈 Main（主线程）                                           │
│     - 黄色：JavaScript 执行                                  │
│     - 紫色：渲染（Layout、Style）                             │
│     - 绿色：绘制（Paint、Composite）                          │
│     - 灰色：系统任务                                          │
├─────────────────────────────────────────────────────────────┤
│  ⚠️ 长任务标识                                               │
│     - 超过 50ms 的任务会被红色标记                             │
│     - 这些是优化的重点目标                                     │
└─────────────────────────────────────────────────────────────┘
```

### 实用技巧

```javascript
// 在代码中添加性能标记，便于在 Performance 面板中定位
performance.mark('myFunction-start')
// 执行某些操作
doSomething()
performance.mark('myFunction-end')
performance.measure('myFunction', 'myFunction-start', 'myFunction-end')

// 查看测量结果
const measures = performance.getEntriesByName('myFunction')
console.log(measures[0].duration) // 执行时间（毫秒）
```

---

## 2. Lighthouse / PageSpeed Insights

### 是什么？
- **Lighthouse**：Chrome 内置的自动化网站质量检测工具
- **PageSpeed Insights**：Google 提供的在线版本，还包含真实用户数据

### 为什么需要？
- 提供标准化的性能评分（0-100）
- 给出具体的优化建议和预期收益
- 检测 SEO、可访问性、最佳实践等多个维度
- 模拟不同网络条件和设备

### 核心 Web 指标（Core Web Vitals）

| 指标 | 全称 | 含义 | 良好标准 |
|------|------|------|----------|
| **LCP** | Largest Contentful Paint | 最大内容绘制时间 | ≤ 2.5s |
| **INP** | Interaction to Next Paint | 交互到下一次绘制延迟 | ≤ 200ms |
| **CLS** | Cumulative Layout Shift | 累积布局偏移 | ≤ 0.1 |
| **FCP** | First Contentful Paint | 首次内容绘制 | ≤ 1.8s |
| **TTFB** | Time to First Byte | 首字节时间 | ≤ 800ms |

### 如何使用？

**方式一：Chrome DevTools**
```
1. 打开 DevTools → Lighthouse 标签
2. 选择要分析的类别（Performance、Accessibility 等）
3. 选择设备类型（Mobile / Desktop）
4. 点击 "Analyze page load"
```

**方式二：PageSpeed Insights**
```
访问 https://pagespeed.web.dev/
输入网址即可获取分析报告
```

**方式三：命令行**
```bash
# 安装
npm install -g lighthouse

# 运行
lighthouse https://example.com --view
```

### 报告解读示例

```
Performance Score: 85/100

🟢 First Contentful Paint     1.2s
🟢 Largest Contentful Paint   2.1s  
🟡 Total Blocking Time        180ms
🟢 Cumulative Layout Shift    0.05
🟢 Speed Index                2.8s

Opportunities（优化建议）:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• 减少未使用的 JavaScript        预计节省 1.2s
• 使用现代图片格式              预计节省 0.8s
• 启用文本压缩                  预计节省 0.5s
```

---

## 3. Vue DevTools 性能分析

### 是什么？
Vue 官方提供的浏览器扩展，专门用于调试 Vue 应用。

### 为什么需要？
- 分析组件渲染性能
- 追踪组件树更新
- 检查 Pinia/Vuex 状态变化
- 分析路由跳转

### 如何使用？

**安装**
```
Chrome/Edge: 应用商店搜索 "Vue.js devtools"
Firefox: 应用商店搜索 "Vue.js devtools"
```

**性能分析功能**

```
Vue DevTools → Performance 标签
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. 点击 "Start recording"
2. 在页面上执行操作
3. 点击 "Stop recording"
4. 查看组件渲染时间线
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

关注点：
• 哪些组件频繁重新渲染
• 每次渲染耗时多久
• 是否有不必要的渲染
```

### 组件检查器

```vue
<!-- 在 DevTools 中可以看到每个组件的 -->
<script setup>
// props - 传入的属性
// state - 响应式状态  
// computed - 计算属性
// inject - 注入的依赖
</script>
```

---

## 4. 打包分析工具

### 是什么？
用于可视化分析打包后文件体积的工具，帮助找出体积过大的模块。

### 为什么需要？
- 直观展示各个模块的体积占比
- 发现意外打包进去的大型库
- 识别可以进行代码分割的部分
- 验证 Tree Shaking 是否生效

### Vite 项目配置（rollup-plugin-visualizer）

```typescript
// vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    vue(),
    // 打包分析插件
    visualizer({
      open: true,           // 构建完成后自动打开
      gzipSize: true,       // 显示 gzip 压缩后的大小
      brotliSize: true,     // 显示 brotli 压缩后的大小
      filename: 'stats.html' // 输出文件名
    })
  ]
})
```

```bash
# 安装
pnpm add -D rollup-plugin-visualizer

# 运行构建后会自动打开分析报告
pnpm build
```

### Webpack 项目配置（webpack-bundle-analyzer）

```javascript
// vue.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  configureWebpack: {
    plugins: [
      new BundleAnalyzerPlugin()
    ]
  }
}
```

### 分析报告解读

```
┌──────────────────────────────────────────────────────┐
│                    打包分析图示                        │
├──────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────┐             │
│  │           vue (120KB)               │             │
│  │  ┌─────────────┬──────────────────┐ │             │
│  │  │  runtime    │   compiler       │ │             │
│  │  │  (80KB)     │   (40KB)         │ │             │
│  │  └─────────────┴──────────────────┘ │             │
│  └─────────────────────────────────────┘             │
│  ┌───────────────────────┐                           │
│  │   element-plus        │ ← 如果全量引入会很大       │
│  │   (500KB)             │   应该按需引入             │
│  └───────────────────────┘                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │  lodash  │  │  moment  │  │  echarts │           │
│  │  (70KB)  │  │  (230KB) │  │  (800KB) │           │
│  └──────────┘  └──────────┘  └──────────┘           │
│        ↑              ↑            ↑                 │
│  可用 lodash-es  可用 dayjs   可按需引入              │
└──────────────────────────────────────────────────────┘
```

### 常见优化发现

| 问题 | 解决方案 |
|------|----------|
| lodash 体积大 | 使用 lodash-es + 按需引入 |
| moment.js 体积大 | 替换为 dayjs（2KB） |
| element-plus 全量打包 | 配置按需引入（unplugin-vue-components） |
| 图标库全量打包 | 按需引入需要的图标 |
| 重复的依赖 | 检查是否有多版本依赖 |

---

## 5. 参考资源：web.dev 指南

### 是什么？
Google 官方提供的 Web 开发最佳实践指南网站。

### 推荐学习路径

```
https://web.dev/
├── /learn/performance/     性能优化完整教程
├── /patterns/              常见问题解决方案
├── /metrics/               Web 指标详解
└── /case-studies/          真实优化案例
```

### 核心文章推荐

1. **性能基础**
   - [Why speed matters](https://web.dev/why-speed-matters/)
   - [Measure performance](https://web.dev/how-to-measure-speed/)

2. **加载优化**
   - [Reduce JavaScript payloads](https://web.dev/reduce-javascript-payloads-with-code-splitting/)
   - [Optimize images](https://web.dev/fast/#optimize-your-images)

3. **运行时优化**
   - [Optimize long tasks](https://web.dev/optimize-long-tasks/)
   - [Rendering performance](https://web.dev/rendering-performance/)

---

## 小结

| 工具 | 适用场景 | 优势 |
|------|----------|------|
| Chrome Performance | 运行时性能分析 | 精确到毫秒级的任务分析 |
| Lighthouse | 整体质量评估 | 标准化评分 + 优化建议 |
| Vue DevTools | Vue 组件分析 | 专为 Vue 设计 |
| 打包分析工具 | 构建体积优化 | 可视化展示依赖体积 |
| web.dev | 学习参考 | 官方最佳实践 |

**建议工作流程**：
1. 先用 Lighthouse 获取整体评分，了解主要问题
2. 用打包分析工具检查体积问题
3. 用 Chrome Performance 分析运行时性能
4. 用 Vue DevTools 定位组件级别问题
5. 参考 web.dev 学习具体优化方法
````

