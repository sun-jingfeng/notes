# 前端路由、vue-router

## 什么是路由

   - 路由（英文：router）就是对应关系。

- SPA 与前端路由

   - SPA 指的是一个 web 网站只有唯一的一个 HTML 页面，所有组件的展示与切换都在这唯一的一个页面内完

   - 成。此时，不同组件之间的切换需要通过前端路由来实现。

   - 结论：在 SPA 项目中，不同功能之间的切换，要依赖于前端路由来完成！

- 什么是前端路由

   - 通俗易懂的概念：Hash 地址与组件之间的对应关系。

- 前端路由的工作方式

   - 用户点击了页面上的路由链接

   - 导致了 URL 地址栏中的 Hash 值发生了变化

   - 前端路由监听了到 Hash 地址的变化

   - 前端路由把当前 Hash 地址对应的组件渲染到浏览器中

**==> picture [467 x 131] intentionally omitted <==**

**==> picture [284 x 11] intentionally omitted <==**

**----- Start of picture text -----**<br>
结论：前端路由，指的是 Hash 地址与组件之间的对应关系！<br>**----- End of picture text -----**<br>

- 实现简易的前端路由

   - 步骤1：通过 <component> 标签，结合 comName 动态渲染组件。示例代码如下：

**==> picture [329 x 281] intentionally omitted <==**

**==> picture [295 x 12] intentionally omitted <==**

**----- Start of picture text -----**<br>
步骤2：在 App.vue 组件中，为 <a> 链接添加对应的 hash 值：<br>**----- End of picture text -----**<br>

**==> picture [269 x 80] intentionally omitted <==**

步骤3：在 created 生命周期函数中，监听浏览器地址栏中 hash 地址的变化，动态切换要展示的组件的名

称：

**==> picture [280 x 297] intentionally omitted <==**

## vue-router的基本使用

什么是 vue-router

- vue-router 是 vue.js 官方给出的路由解决方案。它只能结合 vue 项目进行使用，能够轻松的管理 SPA 项目中组件的切换。

vue-router 的官方文档地址：https://router.vuejs.org/zh/

- vue-router 安装和配置的步骤

概述：

   - 安装 vue-router 包

   - 创建路由模块

   - 导入并挂载路由模块

   - 声明路由链接和占位符

- 在项目中安装 vue-router

   - 在 vue2 的项目中，安装 vue-router 的命令如下：

**==> picture [227 x 39] intentionally omitted <==**

创建路由模块

在 src 源代码目录下，新建 router/index.js 路由模块，并初始化如下的代码：

**==> picture [397 x 280] intentionally omitted <==**

## 导入并挂载路由模块

- 在 src/main.js 入口文件中，导入并挂载路由模块。示例代码如下：

**==> picture [266 x 236] intentionally omitted <==**

- 声明路由链接和占位符

   - 在 src/App.vue 组件中，使用 vue-router 提供的 <router-link> 和 <router-view> 声明路由链接和占

   - 位符：

   - 重要说明：<router-view>不绑定key时，不同路由匹配到同一个单页面文件组件时会复用同一个页面 实例。<router-view>绑定key（key值一般用计算属性返回this.$route.path）时，不同路由匹配到同 一个单页面文件组件时会生成各自的页面实例。

**==> picture [327 x 296] intentionally omitted <==**

- 声明路由的匹配规则

在 src/router/index.js 路由模块中，通过 routes 数组声明路由的匹配规则。示例代码如下：

**==> picture [398 x 295] intentionally omitted <==**

## vue-router的常见用法

## 路由重定向

- 路由重定向指的是：用户在访问地址 A 的时候，强制用户跳转到地址 C ，从而展示特定的组件页面。 通过路由规则的 redirect 属性，指定一个新的路由地址，可以很方便地设置路由的重定向：

**==> picture [467 x 226] intentionally omitted <==**

## 嵌套路由

通过路由实现组件的嵌套展示，叫做嵌套路由。

**==> picture [467 x 215] intentionally omitted <==**

- 声明子路由链接和子路由占位符

在 About.vue 组件中，声明 tab1 和 tab2 的子路由链接以及子路由占位符。示例代码如下：

**==> picture [407 x 289] intentionally omitted <==**

- 通过 children 属性声明子路由规则

在 src/router/index.js 路由模块中，导入需要的组件，并使用 children 属性声明子路由规则：

**==> picture [467 x 282] intentionally omitted <==**

## 动态路由匹配

思考：有如下 3 个路由链接：

**==> picture [337 x 77] intentionally omitted <==**

定义如下 3 个路由规则，是否可行?

**==> picture [287 x 85] intentionally omitted <==**

缺点：路由规则的复用性差。

- 动态路由的概念

   - 动态路由指的是：把 Hash 地址中可变的部分定义为参数项，从而提高路由规则的复用性。

   - 在 vue-router 中使用英文的冒号（:）来定义路由的参数项。示例代码如下：

**==> picture [421 x 170] intentionally omitted <==**

- $route.params 参数对象

在动态路由渲染出来的组件中，可以使用 this.$route.params 对象访问到动态匹配的参数值。

**==> picture [449 x 284] intentionally omitted <==**

- 使用 props 接收路由参数

   - 为了简化路由参数的获取形式，vue-router 允许在路由规则中开启 props 传参。示例代码如下：

**==> picture [447 x 299] intentionally omitted <==**

## 声明式导航 & 编程式导航

- 在浏览器中，点击链接实现导航的方式，叫做声明式导航。例如：

   - 普通网页中点击 <a> 链接、vue 项目中点击 <router-link> 都属于声明式导航

- 在浏览器中，调用 API 方法实现导航的方式，叫做编程式导航。例如：

   - 普通网页中调用 location.href 跳转到新页面的方式，属于编程式导航

- vue-router 中的编程式导航 API

   - vue-router 提供了许多编程式导航的 API，其中最常用的导航 API 分别是：

      - this.$router.push('hash 地址')

         - 跳转到指定 hash 地址，并增加一条历史记录

      - this.$router.replace('hash 地址')

         - 跳转到指定的 hash 地址，并替换掉当前的历史记录

      - this.$router.go(数值 n)

## 实现导航历史前进、后退

- $router.push

调用 this.$router.push() 方法，可以跳转到指定的 hash 地址，从而展示对应的组件页面。示例代码如 下：

**==> picture [409 x 298] intentionally omitted <==**

$router.replace

调用 this.$router.replace() 方法，可以跳转到指定的 hash 地址，从而展示对应的组件页面。

push 和 replace 的区别：

一 push 会增加 条历史记录

replace 不会增加历史记录，而是替换掉当前的历史记录

$router.go

调用 this.$router.go() 方法，可以在浏览历史中前进和后退。示例代码如下：

**==> picture [408 x 292] intentionally omitted <==**

- $router.go 的简化用法

在实际开发中，一般只会前进和后退一层页面。因此 vue-router 提供了如下两个便捷方法：

$router.back()

在历史记录中，后退到上一个页面

- $router.forward()

   - 在历史记录中，前进到下一个页面

## 导航守卫

**==> picture [467 x 214] intentionally omitted <==**

## 全局前置守卫

- 每次发生路由的导航跳转时，都会触发全局前置守卫。因此，在全局前置守卫中，程序员可以对每个 路由进行访问权限的控制：

**==> picture [439 x 151] intentionally omitted <==**

守卫方法的 3 个形参

全局前置守卫的回调函数中接收3个形参，格式为：

**==> picture [411 x 214] intentionally omitted <==**

next 函数的 3 种调用方式

参考示意图，分析 next 函数的 3 种调用方式最终导致的结果：

**==> picture [467 x 126] intentionally omitted <==**

   - 当前用户拥有后台主页的访问权限，直接放行：next()

   - 当前用户没有后台主页的访问权限，强制其跳转到登录页面：next('/login')

   - 当前用户没有后台主页的访问权限，不允许跳转到后台主页：next(false)

- 控制后台主页的访问权限

**==> picture [430 x 281] intentionally omitted <==**
