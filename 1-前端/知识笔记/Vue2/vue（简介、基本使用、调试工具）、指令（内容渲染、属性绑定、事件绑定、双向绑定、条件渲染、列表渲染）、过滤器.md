# vue 简介、指令、过滤器

## 什么是 vue

- 官方给出的概念：Vue (读音 /vjuː/，类似于 view) 是一套用于构建用户界面的前端框架。

**==> picture [265 x 160] intentionally omitted <==**

## vue的特性

- vue框架的特性，主要体现在如下两方面：

   - 数据驱动视图

   - 双向数据绑定

- 数据驱动视图

   - 在使用了vue的页面中，vue会监听数据的变化，从而自动重新渲染页面的结构。示意图如下：

**==> picture [467 x 165] intentionally omitted <==**

      - 好处：当页面数据发生变化时，页面会自动重新渲染！

      - 注意：数据驱动视图是单向的数据绑定。

- 双向数据绑定

   - 在填写表单时，双向数据绑定可以辅助开发者在不操作 DOM 的前提下，自动把用户填写的内容同步到 数据源中。示意图如下：

**==> picture [467 x 123] intentionally omitted <==**

**==> picture [326 x 12] intentionally omitted <==**

**----- Start of picture text -----**<br>
好处：开发者不再需要手动操作 DOM 元素，来获取表单元素最新的值<br>**----- End of picture text -----**<br>

MVVM

- MVVM 是 vue 实现数据驱动视图和双向数据绑定的核心原理。MVVM 指的是 Model、View 和

- ViewModel，它把每个 HTML 页面都拆分成了这三个部分，如图所示：

**==> picture [385 x 258] intentionally omitted <==**

   - 在 MVVM 概念中：

      - Model 表示当前页面渲染时所依赖的数据源。

      - View 表示当前页面所渲染的 DOM 结构。

      - ViewModel 表示 vue 的实例，它是 MVVM 的核心。

- MVVM 的工作原理

   - ViewModel 作为 MVVM 的核心，是它把当前页面的数据源（Model）和页面的结构（View）连接在一起

   - 到一起。

**==> picture [467 x 112] intentionally omitted <==**

- 当数据源发生变化时，会被 ViewModel 监听到，VM 会根据最新的数据源自动更新页面的结构

- 当表单元素的值发生变化时，也会被 VM 监听到，VM 会把变化过后最新的值自动同步到 Model 数据源中

## vue 的版本

- 当前，vue 共有 3 个大版本，其中：

   - 2.x 版本的 vue 是目前企业级项目开发中的主流版本

   - 3.x 版本的 vue 于 2020-09-19 发布，生态还不完善，尚未在企业级项目开发中普及和推广

   - 1.x 版本的 vue 几乎被淘汰，不再建议学习与使用

## 总结：

- 3.x 版本的 vue 是未来企业级项目开发的趋势；

- 2.x 版本的 vue 在未来（1 ~ 2年内）会被逐渐淘汰；

## vue的基本使用

## 基本使用步骤

- 导入 vue.js 的 script 脚本文件

- 在页面中声明一个将要被 vue 所控制的 DOM 区域

- 创建 vm 实例对象（vue 实例对象）

**==> picture [380 x 248] intentionally omitted <==**

基本代码与 MVVM 的对应关系

**==> picture [467 x 354] intentionally omitted <==**

## vue的调试工具

- 安装 vue-devtools 调试工具

   - vue 官方提供的 vue-devtools 调试工具，能够方便开发者对 vue 项目进行调试与开发。

   - Chrome 浏览器在线安装 vue-devtools ：https://chrome.google.com/webstore/detail/vuejs-devtools/nh

   - dogjmejiglipccpnnnanhbledajbpd

   - FireFox 浏览器在线安装 vue-devtools ：https://addons.mozilla.org/zh-CN/firefox/addon/vue-js-devtoo

   - ls/

- 配置 Chrome 浏览器中的 vue-devtools

   - 点击 Chrome 浏览器右上角的"···"按钮，选择更多工具 -> 扩展程序 -> Vue.js devtools 详细信息，并勾选

   - 如下 的两个选项：

**==> picture [467 x 183] intentionally omitted <==**

- 使用 vue-devtools 调试 vue 页面

   - 在浏览器中访问一个使用了 vue 的页面，打开浏览器的开发者工具，切换到 Vue 面板，即可使用 vuedevtools调试当前的页面。

**==> picture [467 x 256] intentionally omitted <==**

## vue的指令与过滤器——指令的概念

- 指令（Directives）是 vue 为开发者提供的模板语法，用于辅助开发者渲染页面的基本结构。 vue 中的指令按照不同的用途可以分为如下 6 大类：

- 内容渲染指令

- 属性绑定指令

- 事件绑定指令

- 双向绑定指令

- 条件渲染指令

列表渲染指令

注意：指令是 vue 开发中最基础、最常用、最简单的知识点。

## vue的指令与过滤器——内容渲染指令

内容渲染指令用来辅助开发者渲染 DOM 元素的文本内容。常用的内容渲染指令有如下 3 个：

v-text

{{ }}

v-html

v-text

用法示例：

**==> picture [467 x 147] intentionally omitted <==**

注意：v-text 指令会覆盖元素内默认的值。

## {{ }} 语法

- vue 提供的 {{ }} 语法，专门用来解决 v-text 会覆盖默认文本内容的问题。这种 {{ }} 语法的专业名称是插值 表达式（英文名为：Mustache）。

**==> picture [447 x 96] intentionally omitted <==**

注意：相对于 v-text 指令来说，插值表达式在开发中更常用一些！因为它不会覆盖元素中默认的文本内 容。

v-html

- v-text 指令和插值表达式只能渲染纯文本内容。如果要把包含 HTML 标签的字符串渲染为页面的 HTML 元素，则需要用到 v-html 这个指令：

**==> picture [467 x 88] intentionally omitted <==**

最终渲染的结果为：

**==> picture [247 x 115] intentionally omitted <==**

## vue的指令与过滤器——属性绑定指令

- 如果需要为元素的属性动态绑定属性值，则需要用到 v-bind 属性绑定指令。用法示例如下：

**==> picture [436 x 272] intentionally omitted <==**

## 属性绑定指令的简写形式

- 由于 v-bind 指令在开发中使用频率非常高，因此，vue 官方为其提供了简写形式（简写为英文的 : ）。

**==> picture [437 x 285] intentionally omitted <==**

- 使用 Javascript 表达式

   - 在 vue 提供的模板渲染语法中，除了支持绑定简单的数据值之外，还支持 Javascript 表达式的运算（复杂 的语法不支持），例如：

**==> picture [312 x 169] intentionally omitted <==**

## vue的指令与过滤器——事件绑定指令

vue 提供了 v-on 事件绑定指令，用来辅助程序员为 DOM 元素绑定事件监听。语法格式如下：

**==> picture [346 x 76] intentionally omitted <==**

- 注意：原生 DOM 对象有 onclick、oninput、onkeyup 等原生事件，替换为 vue 的事件绑定形式后，分别为：

- v-on:click、v-on:input、v-on:keyup

- 通过 v-on 绑定的事件处理函数，需要在 methods 节点中进行声明：

**==> picture [467 x 248] intentionally omitted <==**

## 事件绑定的简写形式

由于 v-on 指令在开发中使用频率非常高，因此，vue 官方为其提供了简写形式（简写为英文的 @ ）。

**==> picture [467 x 211] intentionally omitted <==**

## 事件参数对象

- 在原生的 DOM 事件绑定中，可以在事件处理函数的形参处，接收事件参数对象 event。同理，在 v-on 指

令（简写为 @ ）所绑定的事件处理函数中，同样可以接收到事件参数对象 event，示例代码如下：

**==> picture [467 x 213] intentionally omitted <==**

绑定事件并传参

- 在使用 v-on 指令绑定事件时，可以使用 ( ) 进行传参，示例代码如下：

**==> picture [314 x 208] intentionally omitted <==**

- $event

   - $event 是 vue 提供的特殊变量，用来表示原生的事件参数对象 event。$event 可以解决事件参数对象

   - event被覆盖的问题。示例用法如下：

**==> picture [467 x 223] intentionally omitted <==**

## 事件修饰符

- 在事件处理函数中调用 event.preventDefault() 或 event.stopPropagation() 是非常常见的需求。因此，

- vue 提供了事件修饰符的概念，来辅助程序员更方便的对事件的触发进行控制。常用的 5 个事件修饰符如 下：

**==> picture [467 x 167] intentionally omitted <==**

语法格式如下：

**==> picture [467 x 57] intentionally omitted <==**

## 按键修饰符

- 在监听键盘事件时，我们经常需要判断详细的按键。此时，可以为键盘相关的事件添加按键修饰符，例 如：

**==> picture [394 x 120] intentionally omitted <==**

## vue的指令与过滤器——双向绑定指令

vue 提供了 v-model 双向数据绑定指令，用来辅助开发者在不操作 DOM 的前提下，快速获取表单的数据。

**==> picture [293 x 227] intentionally omitted <==**

## v-model 指令的修饰符

为了方便对用户输入的内容进行处理，vue 为 v-model 指令提供了 3 个修饰符，分别是：

**==> picture [467 x 98] intentionally omitted <==**

示例用法如下：

**==> picture [311 x 87] intentionally omitted <==**

## vue的指令与过滤器——条件渲染指令

- 条件渲染指令用来辅助开发者按需控制 DOM 的显示与隐藏。条件渲染指令有如下两个，分别是：

   - v-if

   - v-show

示例用法如下：

**==> picture [455 x 95] intentionally omitted <==**

v-if 和 v-show 的区别

## 实现原理不同：

      - v-if 指令会动态地创建或移除 DOM 元素，从而控制元素在页面上的显示与隐藏；

      - v-show 指令会动态为元素添加或移除 style="display: none;" 样式，从而控制元素的显示与隐藏；

   - 性能消耗不同：

      - v-if 有更高的切换开销，而 v-show 有更高的初始渲染开销。因此：

      - 如果需要非常频繁地切换，则使用 v-show 较好

      - 如果在运行时条件很少改变，则使用 v-if 较好

- v-else

v-if 可以单独使用，或配合 v-else 指令一起使用：

**==> picture [298 x 142] intentionally omitted <==**

注意：v-else 指令必须配合 v-if 指令一起使用，否则它将不会被识别！

v-else-if

- v-else-if 指令，顾名思义，充当 v-if 的"else-if 块"，可以连续使用：

**==> picture [315 x 95] intentionally omitted <==**

注意：v-else-if 指令必须配合 v-if 指令一起使用，否则它将不会被识别！

## vue的指令与过滤器——列表渲染指令

- vue 提供了 v-for 列表渲染指令，用来辅助开发者基于一个数组来循环渲染一个列表结构。v-for 指令需要使用 item in list 形式的特殊语法，其中：

   - list 是待循环的数组


   - item 是被循环的每项

**==> picture [313 x 197] intentionally omitted <==**

- v-for 中的索引

   - v-for 指令还支持一个可选的第二个参数，即当前项的索引。语法格式为 (item, index) in items，示例代码 如下：

**==> picture [467 x 197] intentionally omitted <==**

注意：v-for 指令中的 item 项和 index 索引都是形参，可以根据需要进行重命名。例如 (user, i) in userlist

- 使用 key 维护列表的状态

   - 当列表的数据变化时，默认情况下，vue 会尽可能的复用已存在的 DOM 元素，从而提升渲染的性能。但这 种默认的性能优化策略，会导致有状态的列表无法被正确更新。

- 为了给 vue 一个提示，以便它能跟踪每个节点的身份，从而在保证有状态的列表被正确更新的前提下，提

- 升渲染的性能。此时，需要为每项提供一个唯一的 key 属性：

**==> picture [293 x 209] intentionally omitted <==**

- key 的注意事项

   - key 的值只能是字符串或数字类型

   - key 的值必须具有唯一性（即：key 的值不能重复）


   - 建议把数据项 id 属性的值作为 key 的值（因为 id 属性的值具有唯 性）


   - 使用 index 的值当作 key 的值没有任何意义（因为 index 的值不具有唯 性）

   - 建议使用 v-for 指令时一定要指定 key 的值（既提升性能、又防止列表状态紊乱）

## vue的指令与过滤器——过滤器

- 过滤器（Filters）是 vue 为开发者提供的功能，常用于文本的格式化。过滤器可以用在两个地方：插值表达式

- 和 v-bind 属性绑定。

- 过滤器应该被添加在 JavaScript 表达式的尾部，由"管道符"进行调用，示例代码如下：

**==> picture [467 x 114] intentionally omitted <==**

## 定义过滤器

- 在创建 vue 实例期间，可以在 filters 节点中定义过滤器，示例代码如下：

**==> picture [420 x 275] intentionally omitted <==**

私有过滤器和全局过滤器

- 在 filters 节点下定义的过滤器，称为"私有过滤器"，因为它只能在当前 vm 实例所控制的 el 区域内使用。 如果希望在多个 vue 实例之间共享过滤器，则可以按照如下的格式定义全局过滤器：

**==> picture [416 x 171] intentionally omitted <==**

连续调用多个过滤器

过滤器可以串联地进行调用，例如：

**==> picture [377 x 104] intentionally omitted <==**

示例代码如下：

**==> picture [391 x 293] intentionally omitted <==**

## 过滤器传参

过滤器的本质是 JavaScript 函数，因此可以接收参数，格式如下：

**==> picture [436 x 221] intentionally omitted <==**

示例代码如下：

**==> picture [408 x 299] intentionally omitted <==**

## 过滤器的兼容性

- 过滤器仅在 vue 2.x 和 1.x 中受支持，在 vue 3.x 的版本中剔除了过滤器相关的功能。

- 在企业级项目开发中：

   - 如果使用的是 2.x 版本的 vue，则依然可以使用过滤器相关的功能

   - 如果项目已经升级到了 3.x 版本的 vue，官方建议使用计算属性或方法代替被剔除的过滤器功能

- 具体的迁移指南，请参考 vue 3.x 的官方文档给出的说明：

- https://v3.vuejs.org/guide/migration/filters.html#migration-strategy
