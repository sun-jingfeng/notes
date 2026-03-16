# 组件的生命周期、数据共享、ref 引用

## 组件的生命周期

- 生命周期 & 生命周期函数

   - 生命周期（Life Cycle）是指一个组件从创建 -> 运行 -> 销毁的整个阶段，强调的是一个时间段。 生命周期函数：是由 vue 框架提供的内置函数，会伴随着组件的生命周期，自动按次序执行。 注意：生命周期强调的是时间段，生命周期函数强调的是时间点。

- 组件生命周期函数的分类

**==> picture [467 x 173] intentionally omitted <==**

- 生命周期图示

   - 可以参考 vue 官方文档给出的"生命周期图示"，进一步理解组件生命周期执行的过程：

      - https://cn.vuejs.org/v2/guide/instance.html#生命周期图示

## 组件之间的数据共享

- 组件之间的关系

   - 在项目开发中，组件之间的最常见的关系分为如下两种：

      - 父子关系

      - 兄弟关系

**==> picture [243 x 216] intentionally omitted <==**

- 父子组件之间的数据共享

   - 父子组件之间的数据共享又分为：

      - 父 -> 子共享数据

      - 子 -> 父共享数据

父组件向子组件共享数据

## 父组件向子组件共享数据需要使用自定义属性。示例代码如下：

**==> picture [467 x 152] intentionally omitted <==**

- 子组件向父组件共享数据

   - 子组件向父组件共享数据使用自定义事件。示例代码如下：

**==> picture [467 x 225] intentionally omitted <==**

## 兄弟组件之间的数据共享

## vue2.x 中，兄弟组件之间数据共享的方案是 EventBus。

**==> picture [467 x 186] intentionally omitted <==**

## EventBus 的使用步骤

- 创建 eventBus.js 模块，并向外共享一个 Vue 的实例对象

- 在数据发送方，调用 bus.$emit('事件名称', 要发送的数据) 方法触发自定义事件

- 在数据接收方，调用 bus.$on('事件名称', 事件处理函数) 方法注册一个自定义事件

## ref引用

什么是 ref 引用

- ref 用来辅助开发者在不依赖于 jQuery 的情况下，获取 DOM 元素或组件的引用。

- 每个 vue 的组件实例上，都包含一个 $refs 对象，里面存储着对应的 DOM 元素或组件的引用。默认情况 下，组件的 $refs 指向一个空对象。

**==> picture [467 x 220] intentionally omitted <==**

- 使用 ref 引用 DOM 元素

如果想要使用 ref 引用页面上的 DOM 元素，则可以按照如下的方式进行操作：

**==> picture [401 x 274] intentionally omitted <==**

使用 ref 引用组件实例

如果想要使用 ref 引用页面上的组件实例，则可以按照如下的方式进行操作：

**==> picture [410 x 270] intentionally omitted <==**

- 控制文本框和按钮的按需切换

通过布尔值 inputVisible 来控制组件中的文本框与按钮的按需切换。示例代码如下：

**==> picture [467 x 202] intentionally omitted <==**

- 让文本框自动获得焦点

   - 当文本框展示出来之后，如果希望它立即获得焦点，则可以为其添加 ref 引用，并调用原生 DOM 对象 的.focus() 方法即可。示例代码如下：

**==> picture [460 x 239] intentionally omitted <==**

- this.$nextTick(cb) 方法

组件的 $nextTick(cb) 方法，会把 cb 回调推迟到下一个 DOM 更新周期之后执行。通俗的理解是：等组件 的DOM 更新完成之后，再执行 cb 回调函数。从而能保证 cb 回调函数可以操作到最新的 DOM 元素。

**==> picture [467 x 238] intentionally omitted <==**
