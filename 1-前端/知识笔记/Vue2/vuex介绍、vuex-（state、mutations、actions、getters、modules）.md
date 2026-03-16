# vuex 介绍（state、mutations、actions、getters、modules）

通信方案

**==> picture [311 x 229] intentionally omitted <==**

## 组件关系

## 数据通信

父子关系

## 非父子关系

父传子：props ； 子传父：$emit vuex (一种组件通信方案)

## vuex是什么

- Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。它采用集中式存储管理数据，以相应的规则保证状


- 态以一种可预测的方式发生变化

**==> picture [467 x 244] intentionally omitted <==**

## vuex为何学

- 程序页面多，数据变量多，但又要做到：

   - 不同组件数据保持同步

   - 数据的修改都是可追踪

## 保持同步、可追踪的含义：


   - 一个户外商店有两名员工，张三和李四。一天的早上，他们分别对帐篷的数量做了一次盘点，发现一共有三个帐篷。张三卖出去俩个，他以为库存里还有一个。李四卖出去一个，他以为库存里还有两 个。而事实上是，库存现在已经为零。如果他们再接受客户的预订，就会出现库存不足的情况。 张三和李四因为没有保持库存的数量的同步导致了尴尬，这个就是所谓的`数据保持同步 `

   - 店长需要知道, 谁卖出了多少个帐篷，这个行为我们称之为`数据修改是可追踪的`

- 图示:

**==> picture [467 x 256] intentionally omitted <==**

## vuex中存什么

- 多个组件共享状态，才存储在vuex中

- 某个组件中的私有数据，依旧存储在data中

- 例如：

   - 登陆的用户名需要在首页, 个人中心, 结算页面使用, 用户名存在vuex中

   - 文章详情数据, 只有在文章详情页查看, 在自身data中声明

## 小结

## 什么是vuex

## vuex是Vue官方推荐的集中式状态管理机制

## 为何学vuex

- 数据同步, 集中管理

## vuex中存什么

- 多个组件共享的值

## vuex学习内容

## 核心概念

- 官网地址: https://vuex.vuejs.org/zh/

- 安装(固定)

- 配置项(固定)

|配置项|含义|注意|
|---|---|---|
|state|单一状态树|类似data|
|mutations|数据管家(同步)|唯一修改state地方|
|actions|异步请求|要改state需要提交给mutations|
|getters|vuex计算属性|类似computed|
|modules|模块拆分||

## 图示关系

**==> picture [265 x 11] intentionally omitted <==**

**----- Start of picture text -----**<br>
单一定义store对象, 里面5个配置项, 在任意组件可以使用<br>**----- End of picture text -----**<br>

**==> picture [467 x 177] intentionally omitted <==**

小结

**==> picture [241 x 32] intentionally omitted <==**

**----- Start of picture text -----**<br>
vuex五个核心概念是?<br>state / mutations / actions / getters / modules<br>**----- End of picture text -----**<br>

## vuex-state（数据源）

定义state 语法: 1 const store = new Vuex.Store({ 2 state: { 3 变量名 : 初始值 4 } 5 })

**==> picture [46 x 11] intentionally omitted <==**

**----- Start of picture text -----**<br>
具体代码:<br>**----- End of picture text -----**<br>

> 1 const store = new Vuex.Store({

> 2 state: {

> 3 count: 100 // 库存

> 4 }

> 5 })

## 使用state的两种方式

直接使用

语法:

> 1 this.$store.state. 变量名

## 映射使用 (推荐)

语法:

> 1 // 1. 拿到 mapState 辅助函数

> 2 import { mapState } from 'vuex'

> 3 export default {

> 4 computed: {

> 5 // 2. 把 state 里变量映射到计算属性中

> 6 ...mapState(['state 里的变量名 '])

> 7 }

> 8 }

## 整个过程的示意图如下

**==> picture [467 x 215] intentionally omitted <==**

注意

state是响应式的, 只要state值变化, 页面上使用的地方会自动更新同步

- 小结

state作用?

定义全局状态数据源

- state如何定义?

   - 在store内, state: {变量名: 初始值}

- state的值如何用到具体vue组件内?

   - 直接使用 this.$store.state.变量名

   - 映射使用 ...mapState(['state的变量名'])

## vuex-mutations（同步修改）

- 定义mutations

语法:

> 1 const store  = new Vuex.Store({

> 2 mutations: {

> 3 函数名 (state, 可选值 ) {

> 4 // 同步修改 state 值代码

> 5 }

> 6 }

> 7 })

## 具体代码

> 1 const store  = new Vuex.Store({

> 2 state: {

> 3 count: 100 // 库存

> 4 },

> 5 mutations: {

> 6 addCount (state, value) { // 负责增加库存的管家

> 7 state.count += value

> 8 },

> 9 subCount (state, value) { // 负责减少库存的管家

> 10 state.count -= value

> 11 },

> 12 setCount (state, value) { // 负责直接修改库存的管家

> 13 state.count = value;

> 14 }

> 15 }

> 16 })

## 使用mutations的两种方式

## 直接使用

语法:

> 1 this.$store.commit("mutations 里的函数名 ", 具体值 )

## 映射使用

语法:

> 1 // 1. 拿到 mapMutations 辅助函数

> 2 import { mapMutations } from 'vuex'

- 3 export default {

> 4 methods: {

> 5 // 2. 把 mutations 里方法映射到原地

> 6 ...mapMutations(['mutations 里的函数名 '])

> 7 }

> 8 }

## 注意

一 mutations是唯 能修改state的地方, 确保调试工具可以追踪变化

mutations函数内, 只能写同步代码, 调试工具可追踪变化过程

一 因为调试工具要立刻产生 次记录, 所以必须是同步的

mutations函数上, 只能接收一个参数值, 如果传多个, 请传一个对象

## 小结

mutations里函数作用?

负责修改state里的数据

mutations只能写什么样的代码?

同步流程的代码

mutations有哪两种使用方式?

- 直接使用 this.$store.commit()

- 映射使用 mapMutations把方法映射到组件内直接调用

state, mutations, 视图组件, 3个关系是什么?

**==> picture [467 x 230] intentionally omitted <==**

## vuex-actions（异步修改）

定义actions

语法:

> 1 const store = new Vuex.Store({

> 2 actions: {

> 3 函数名 (store, 可选值 ) {

> 4 // 异步代码 , 把结果 commit 给 mutations 给 state 赋值

> 5 }

> 6 }

> 7 })

## 具体代码:

> 1 const store  = new Vuex.Store({

> 2 // ... 省略 state 和 mutations 此处

> 3 actions: {

> 4 asyncAddCount(store, num){

> 5 setTimeout(() => { // 1 秒后 , 异步提交给 add 的 mutations

> 6 store.commit('addCount', num)

> 7 }, 1000)

> 8 },

> 9 asyncSubCount(store, num) {

> 10 setTimeout(() => { // 1 秒后 , 异步提交给 sub 的 mutations

> 11 store.commit('subCount', num)

> 12 }, 1000)

> 13 }

> 14 }

> 15 })

## 使用actions的两种方式

## 直接使用

语法:

> 1 this.$store.dispatch('actions 函数名 ', 具体值 )

## 映射使用

语法:

- 1 // 1. 拿到 mapActions 辅助函数

- 2 import { mapActions } from 'vuex'

- 3 export default {

> 4 methods: {

> 5 // 2. 把 actions 里方法映射到原地

> 6 ...mapActions(['actions 里的函数名 '])

> 7 }

> 8 }

## 小结

## actions和mutations区别?

   - mutations里同步修改state

   - actions里放入异步操作

- actions是否能操作state?

   - 不建议, 要commit给mutations(为调试工具可追踪)

- actions和mutations里函数, 第一个形参分别是什么?

   - mutations的是state

   - actions的是store

- actions使用方式?

   - this.$store.dispatch('actions方法名字', 值)

   - ...mapActions(['actions里的方法名']) 映射到原地使用

- 视图组件, state, mutations, actions的关系是?

**==> picture [467 x 206] intentionally omitted <==**

## vuex-getters（计算属性）

getters概念

   - vuex身上的全局状态-计算属性, 类似于computed

   - getters 依赖于 state中原始数据的变化，并返回计算后的新数据

- 定义getters

语法:

> 1 const store = new Vuex.Store({

> 2 getters: {

> 3 计算属性名 (state) {

> 4 return 值给计算属性

> 5 }

> 6 }

> 7 })

## 具体代码

> 1 const store = new Vuex.Store({

> 2 // ... 省略其他

> 3 getters: {

> 4 allCount(state) {

> 5 return state.goodsList.reduce((sum, obj) => {

> 6 if (obj.goods_state === true) { // 选中商品才累加数量

> 7 sum += obj.goods_count;

> 8 }

> 9 return sum;

> 10 }, 0)

> 11 },

> 12 allPrice(state) {

> 13 return state.goodsList.reduce((sum, obj) => {

> 14 if (obj.goods_state) {

> 15 sum += obj.goods_count * obj.goods_price

> 16 }

> 17 return sum;

> 18 }, 0)

> 19 }

> 20 }

> 21 })

## 使用getters的两种方式

## 直接使用

语法:

> 1 this.$store.getters. 计算属性名

## 映射使用

## 语法:

> 1 // 1. 拿到 mapGetters 辅助函数

> 2 import { mapGetters } from 'vuex'

> 3 export default {

> 4 computed: {

> 5 // 2. 把 getters 里属性映射到原地

> 6 ...mapGetters(['getters 里的计算属性名 '])

> 7 }

> 8 }

## 小结

## getters有什么用?

   - vuex里的计算属性, 属于全局计算属性, 类似computed

- getters如何使用?

   - this.$store.getters.计算属性名

   - ...mapGetters(['getters里计算属性名'])

## vuex-modules（分模块）

## 为何分模块

**==> picture [467 x 212] intentionally omitted <==**

代码上的对比

**==> picture [467 x 404] intentionally omitted <==**

## 创建modules模块对象

- 对象里包含5个核心概念, 只有state改变为函数形式（目的是为了每个引用此模块的地方返回一个独立的新 数据对象），其他核心无变化。

- 语法:

> 1 // 用户模块对象

> 2 const userModule = {

> 3 state(){

> 4 return {

> 5 name: "",

> 6 age: 0,

> 7 sex: ''

> 8 }

> 9 },

> 10 mutations: {},

> 11 actions: {},

> 12 getters: {}

> 13 }

> 14 export default userModule

定义modules

语法:

> 1 modules: {

> 2 模块名 : 模块对象

> 3 }

把2个模块对象, 引回到store里注册

> 1 import Vue from 'vue'

> 2 import Vuex from 'vuex'

> 3 import cartModule from './modules/cart'

> 4 import userModule from './modules/user'

> 5 Vue.use(Vuex)

> 6 const store = new Vuex.Store({

> 7 modules: {

> 8 user: userModule,

> 9 cart: cartModule

> 10 }

> 11 })

> 12 export default store

## state使用方式修改

直接使用

原语法:

1

this.$store.state. 变量名

分模块后语法:

1

this.$store.state. 模块名 . 变量名

## 映射使用

原语法:

> 1 ...mapState(['state 里变量名 '])

> 2 ...mapState({' 变量名 ': "state 里变量名 "})

分模块后语法:

> 1 ...mapState({

> 2 ' 变量名 ': state => state. 模块名 . 变量名

> 3 })

## 开启命名空间

- 在模块对象内设置`namespaced: true`

注意：是在模块对象中设置，不是在引入模块的对象中设置

语法：

> 1 const moduleShopCar = {

> 2 namespaced: true,

> 3 state () {},

> 4 mutations: {},

> 5 actions: {},

> 6 getters: {},

> 7 modules: {}

}

8

state使用方式修改

直接使用

原语法:

> 1 this.$store.state. 变量名

## 分模块后语法:

1 this.$store.state. 模块名 . 变量名

分模块并开启命名空间后语法（与不开启命名空间比无变化）:

1 this.$store.state. 模块名 . 变量名

## 映射使用

原语法:

> 1 ...mapState(['state 里变量名 '])

> 2 ...mapState({' 变量名 ': "state 里变量名 "})

## 分模块后语法:

> 1 ...mapState({

> 2 ' 变量名 ': state => state. 模块名 . 变量名

> 3 })

分模块并开启命名空间后语法:

1

...mapState(" 模块名 ", ['state 变量名 '])

## mutations使用方式修改

直接使用

原语法:

> 1 this.$store.commit("mutations 里的函数名 ", 具体值 )

分模块并开启命名空间后语法:

> 1 this.$store.commit(" 模块名 /mutations 里的函数名 ", 具体值 )

## 映射使用

原语法:

> 1 ...mapMutations(['mutations 里方法名 '])

分模块并开启命名空间后语法:

> 1 ...mapMutations(" 模块名 ", ['mutations 里方法名 '])

## actions使用方式修改

直接使用

原语法:

> 1 this.$store.dispatch("actions 里的函数名 ", 具体值 )

分模块并开启命名空间后语法:

> 1 this.$store.dispatch(" 模块名 /actions 里的函数名 ", 具体值 )

## 映射使用

原语法:

> 1 ...mapActions(['actions 里方法名 '])

分模块并开启命名空间后语法:

> 1 ...mapActions(" 模块名 ", ['actions 里方法名 '])

## getters使用方式修改

## 直接使用

原语法:

> 1 this.$store.getters. 计算属性名

分模块并开启命名空间后语法:

> 1 this.$store.getters[' 模块名 / 计算属性名 ']

## 映射使用

原语法:

> 1 ...mapGetters(['getters 里计算属性名 '])

分模块并开启命名空间后语法:

> 1 ...mapGetters(" 模块名 ", ['getters 里计算属性名 '])

## 小结

## 为什么分模块?

集中式管理项目过大, 变量过多, 会导致state臃肿, 难以维护

## 如何分模块?

定义模块对象, state变成函数返回对象形式, 每个模块都有state/mutations/actions/getters/modules 根store如何注册?

modules里 { 模块名: 模块对象 }

- 分模块不开启命名空间对什么有影响?

   - 对state的取值方式有影响, 对其他暂无影响

- 分模块不开启命名空间state如何取值?

   - 在组件使用的时候, 要state.模块名.变量名

state和mutations, 在根store和开启命名空间里的区别?

**==> picture [467 x 216] intentionally omitted <==**

**==> picture [92 x 10] intentionally omitted <==**

**----- Start of picture text -----**<br>
整个vuex的体系是?<br>**----- End of picture text -----**<br>

**==> picture [467 x 309] intentionally omitted <==**
