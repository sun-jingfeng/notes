# Vue3、Vite 分享

## 生态变迁

- 技术栈：Vue2.6/2.7 --> Vue3.2

- 组件库：Element --> Element Plus / Ant Design Vue

- 状态管理工具：Vuex --> Pinia（菠萝）

- 路由工具：Vue Router3.x --> Vue Router4.x

- 打包工具：Webpack --> Vite

- 脚手架工具：Vue CLI --> create-vue

- 语言：JavaScript --> TypeScript（Vue3对ts支持友好，建议使用ts开发）

## 优势

性能提升

使用Proxy替代setter/getter实现响应式

文档：Object.defineProperty()、Proxy

## 体积更小

## 按需编译

推荐使用unplugin-auto-import、unplugin-vue-components配置自动按需引入

开发体验更好

组合式API

**==> picture [436 x 493] intentionally omitted <==**

对象新增属性、数组通过索引改变数据、ref引用子组件数据均可实现响应

相关文档：深入响应式原理、处理边界情况

友好的ts支持

相关文档：TypeScript 与组合式 API

学习内容

## 组合式API

<script setup lang="ts">语法（感兴趣可以了解一下TSX语法）

## 基础框架构建

vite+vue3+ts 手把手教你创建一个vue3项目

野外火灾救援气象监测系统

## Vite

引言：早些年前端开发还停留在原生 HTML、CSS、JS 时代。Node.js 发布后，JavaScript 具备在服务端运行的能力，由 JS 驱动的前端构建工具相继出现，前端工程化时代开启。

构建工具：Webpack、Rollup、Vite

- 定义：基于浏览器原生支持的ESModule实现的快速启动的非打包开发服务器。（打包过程使用的是Rollup）

优势：快

webpack：

**==> picture [224 x 29] intentionally omitted <==**

vite：

**==> picture [167 x 26] intentionally omitted <==**

## 原因：

以原生ESModule方式提供源码

**==> picture [491 x 201] intentionally omitted <==**

**==> picture [491 x 173] intentionally omitted <==**

文档：JavaScript 模块、<script>

拦截并处理浏览器对源码模块加载的请求，实现按需加载

**==> picture [491 x 573] intentionally omitted <==**

**==> picture [252 x 31] intentionally omitted <==**

**----- Start of picture text -----**<br>
充分利用http缓存机制，强制缓存依赖，协商缓存源码<br>首次加载<br>**----- End of picture text -----**<br>

**==> picture [491 x 271] intentionally omitted <==**

后续加载

**==> picture [491 x 263] intentionally omitted <==**

使用esbuild预构建依赖

按需构建依赖，放入node_modules/.vite/deps

项目刚启动时，目录中的文件

**==> picture [491 x 171] intentionally omitted <==**

**==> picture [180 x 11] intentionally omitted <==**

**----- Start of picture text -----**<br>
项目再跳转几个页面后，目录中的文件<br>**----- End of picture text -----**<br>

**==> picture [491 x 125] intentionally omitted <==**

统一模块化规范为ESModule

pinia原始代码

**==> picture [385 x 142] intentionally omitted <==**

pinia预构建后

**==> picture [346 x 132] intentionally omitted <==**

**==> picture [230 x 10] intentionally omitted <==**

**----- Start of picture text -----**<br>
重写"模块名称导入路径"为"构建后的依赖的路径"<br>**----- End of picture text -----**<br>

pinia原始代码

**==> picture [491 x 166] intentionally omitted <==**

pinia预构建后

**==> picture [260 x 63] intentionally omitted <==**

将内部有多个依赖关系的模块转换为一个模块，以减少请求次数，提高网络性能

## 使用

## 构建应用

使用create-vue生成包含vite+vue3+ts的项目框架（推荐）

使用create-vite生成基础框架

语法

## 环境变量

webpack：process.env.[变量名称]

vite：import.meta.env.[变量名称]

引入静态资源

webpack：require("资源地址")

vite：import xxx from "资源地址"

批量引入

webpack：require.context()

vite：import.meta.glob()

项目配置等其他语法也不完全相同，请查阅官方文档

兼容性注意：需要Node.js版本14.18+，16+（建议使用nvm安装多个版本的Node.js按需切换）
