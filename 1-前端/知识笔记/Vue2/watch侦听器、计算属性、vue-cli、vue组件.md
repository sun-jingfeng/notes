# watch 侦听器、计算属性、vue-cli、vue 组件

## watch 侦听器

- 什么是 watch 侦听器

   - watch 侦听器允许开发者监视数据的变化，从而针对数据的变化做特定的操作。

   - 语法格式如下：

**==> picture [374 x 259] intentionally omitted <==**

## 使用 watch 检测用户名是否可用

监听 username 值的变化，并使用 axios 发起 Ajax 请求，检测当前输入的用户名是否可用：

**==> picture [467 x 179] intentionally omitted <==**

immediate 选项

- 默认情况下，组件在初次加载完毕后不会调用 watch 侦听器。如果想让 watch 侦听器立即被调用，则需要

使用 immediate 选项。示例代码如下：

**==> picture [467 x 188] intentionally omitted <==**

deep 选项

- 如果 watch 侦听的是一个对象，如果对象中的属性值发生了变化，则无法被监听到。此时需要使用 deep 选项，代码示例如下：

**==> picture [231 x 265] intentionally omitted <==**

- 监听对象单个属性的变化

   - 如果只想监听对象中单个属性的变化，则可以按照如下的方式定义 watch 侦听器：

**==> picture [249 x 289] intentionally omitted <==**

## 计算属性

- 什么是计算属性


   - 计算属性指的是通过一系列运算之后，最终得到一个属性值。

   - 这个动态计算出来的属性值可以被模板结构或 methods 方法使用。示例代码如下：

**==> picture [375 x 256] intentionally omitted <==**

## 计算属性的特点

- 虽然计算属性在声明的时候被定义为方法，但是计算属性的本质是一个属性

- 计算属性会缓存计算的结果，只有计算属性依赖的数据变化时，才会重新进行运算

## vue-cli

什么是单页面应用程序

- 单页面应用程序（英文名：Single Page Application）简称 SPA，顾名思义，指的是一个 Web 网站中只有唯一的一个 HTML 页面，所有的功能与交互都在这唯一的一个页面内完成。

- 例如资料中的这个 Demo 项目：

**==> picture [389 x 133] intentionally omitted <==**

**==> picture [255 x 432] intentionally omitted <==**

什么是 vue-cli

vue-cli 是 Vue.js 开发的标准工具。它简化了程序员基于 webpack 创建工程化的 Vue 项目的过程。 引用自 vue-cli 官网上的一句话：

程序员可以专注在撰写应用上，而不必花好几天去纠结 webpack 配置的问题。

中文官网：https://cli.vuejs.org/zh/

安装和使用

   - vue-cli 是 npm 上的一个全局包，使用 npm install 命令，即可方便的把它安装到自己的电脑上：

      - npm install -g @vue/cli

   - 基于 vue-cli 快速生成工程化的 Vue 项目：

      - vue create 项目的名称

- vue 项目的运行流程

   - 在工程化的项目中，vue 要做的事情很单纯：通过 main.js 把 App.vue 渲染到 index.html 的指定区域中。 其中：

      - App.vue 用来编写待渲染的模板结构

      - index.html 中需要预留一个 el 区域

      - main.js 把 App.vue 渲染到了 index.html 所预留的区域中

## vue组件

## 什么是组件化开发

组件化开发指的是：根据封装的思想，把页面上可重用的 UI 结构封装为组件，从而方便项目的开发和维 护。

- vue 中的组件化开发

vue 是一个支持组件化开发的前端框架。

   - vue 中规定：组件的后缀名是 .vue。之前接触到的 App.vue 文件本质上就是一个 vue 的组件。

- vue 组件的三个组成部分

   - 每个 .vue 组件都由 3 部分构成，分别是：

      - template -> 组件的模板结构

      - script -> 组件的 JavaScript 行为

      - style -> 组件的样式

   - 其中，每个组件中必须包含 template 模板结构，而 script 行为和 style 样式是可选的组成部分。

- template

vue 规定：每个组件对应的模板结构，需要定义到 <template> 节点中。

**==> picture [410 x 81] intentionally omitted <==**

## 注意：

- template 是 vue 提供的容器标签，只起到包裹性质的作用，它不会被渲染为真正的 DOM 元素 template 中只能包含唯一的根节点

script

- vue 规定：开发者可以在 <script> 节点中封装组件的 JavaScript 业务逻辑。

- <script > 节点的基本结构如下：

**==> picture [304 x 117] intentionally omitted <==**

**==> picture [489 x 14] intentionally omitted <==**

**----- Start of picture text -----**<br>
vue 规定：.vue 组件中的 data 必须是一个函数——返回值为对象、每个键值对分别为独立的数据名字和数<br>**----- End of picture text -----**<br>

- 据，而不能直接指向一个数据对象。

- 因此在组件中定义 data 数据节点时，下面的方式是错误的：

**==> picture [379 x 77] intentionally omitted <==**

- 会导致多个组件实例共用同一份数据的问题，请参考官方给出的示例：

   - https://cn.vuejs.org/v2/guide/components.html#data-必须是一个函数

- 正确写法如下：

> 1 data() {

> 2 return {

> 3 message: ' 我是消息 ',

> 4 userinfo: {

> 5 name: 'zs',

> 6 age: 18

> 7 },

> 8 number: 0

> 9 }

> 10 }

style

- vue 规定：组件内的 <style> 节点是可选的，开发者可以在 <style> 节点中编写样式美化当前组件的 UI 结构。

- <style> 节点的基本结构如下：

**==> picture [182 x 122] intentionally omitted <==**

<style> 标签上添加 lang="less" 属性，即可使用 less 语法编写组件的样式：

**==> picture [182 x 193] intentionally omitted <==**

- 组件之间的父子关系

**==> picture [467 x 218] intentionally omitted <==**

使用组件的三个步骤

**==> picture [467 x 250] intentionally omitted <==**

通过 components 注册的是私有子组件

例如：

- 在组件 A 的 components 节点下，注册了组件 F。

- 则组件 F 只能用在组件 A 中；不能被用在组件 C 中。

## 注册全局组件

- 在 vue 项目的 main.js 入口文件中，通过 Vue.component() 方法，可以注册全局组件。示例代码如 下：

**==> picture [311 x 148] intentionally omitted <==**

## 组件的 props

- props 是组件的自定义属性，在封装通用组件的时候，合理地使用 props 可以极大的提高组件的复用性！ 它的语法格式如下：

**==> picture [405 x 215] intentionally omitted <==**

## props 是只读的

- vue 规定：组件中封装的自定义属性是只读的，程序员不能直接修改 props 的值。否则会直接报错：

**==> picture [465 x 141] intentionally omitted <==**

- 要想修改 props 的值，可以把 props 的值转存到 data 中，因为 data 中的数据都是可读可写的！

**==> picture [308 x 124] intentionally omitted <==**

props 的 default 默认值

在声明自定义属性时，可以通过 default 来定义属性的默认值。示例代码如下：

**==> picture [281 x 191] intentionally omitted <==**

props 的 type 值类型

- 在声明自定义属性时，可以通过 type 来定义属性的值类型。示例代码如下：

**==> picture [331 x 254] intentionally omitted <==**

props 的 required 必填项

- 在声明自定义属性时，可以通过 required 选项，将属性设置为必填项，强制用户必须传递属性的值。 示例代码如下：

**==> picture [213 x 234] intentionally omitted <==**

- 组件之间的样式冲突问题

   - 默认情况下，写在 .vue 组件中的样式会全局生效，因此很容易造成多个组件之间的样式冲突问题。

   - 导致组件之间样式冲突的根本原因是：

      - 一

      - 单页面应用程序中，所有组件的 DOM 结构，都是基于唯一的 index.html 页面进行呈现的

      - 每个组件中的样式，都会影响整个 index.html 页面中的 DOM 元素

   - 如何解决组件样式冲突的问题

      - 一

      - 为每个组件分配唯一的自定义属性，在编写组件样式时，通过属性选择器来控制样式的作用域，示例

      - 代码如下：

**==> picture [355 x 298] intentionally omitted <==**

## style 节点的 scoped 属性

- 为了提高开发效率和开发体验，vue 为 style 节点提供了 scoped 属性，从而防止组件之间的样式冲突 问题：

**==> picture [467 x 259] intentionally omitted <==**

- /deep/ 样式穿透

如果给当前组件的 style 节点添加了 scoped 属性，则当前组件的样式对其子组件是不生效的。如果想

**==> picture [269 x 11] intentionally omitted <==**

**==> picture [467 x 185] intentionally omitted <==**
