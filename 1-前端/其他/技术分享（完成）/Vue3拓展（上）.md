- 在ts代码中，将vue组件转化成html代码

   - 说明：使用情景包括利用vue组件开发leaflet的marker等，凡是可以传html的，都可以用vue组件来做

   - 使用

h

   - 将组件渲染成虚拟dom

   - 记得引入组件的prop类型，用来校验参数

- render

   - 将虚拟dom渲染成真实dom

无文档，可根据ts类型学习使用方式

- 示例代码

> 1 import Marker from './Marker/Marker.vue'
> 2

> 3 const container = document.createElement('div')

> 4 render(h(Marker), container)

> 5 const icon = L.divIcon({

> 6 html: container,

> 7 className: 'map-marker'

> 8 })

> 9 const marker = L.marker([lat, lon], { icon })

> 10 marker.addTo(layerGroup)

## 相关

cloneVNode()、isVNode()

- resolveComponent()、resolveDirective() withDirectives()、withModifiers()

## 事件重复触发


- 多个参数触发同一事件，其中一个参数的改变会异步影响另一个参数

   - 侦听会引起其他参数变化的那个参数；在回调中先关闭其余参数的侦听器，等异步结束后再重新开启（推荐）

      - 示例代码

> 1 let watchStopHandle: WatchStopHandle | undefined

- 2 watch(

> 3 pattern,

> 4 () => {

> 5 watchStopHandle && watchStopHandle()

> 6 await Promise.all([]) // 异步事件

> 7 createWatcher()

> 8 },

> 9 {

> 10 immediate: true

> 11 }

> 12 )

> 13 function createWatcher() {

> 14 watchStopHandle = watch(

> 15 [altitudeElementLayerList, currentTime],

> 16 () => {

> 17 // 侦听器逻辑

> 18 },

> 19 {

> 20 immediate: true

> 21 }

> 22 )

> 23 }

使用onCleanup清除上一次的副作用

- 对象值未改变，但索引改变了

使用isEqual

## 功能性

Teleport

SSR环境使用受限，详情参考服务端渲染 (SSR)-Teleports

- 泛型组件

   - 无法传递泛型，只能使用泛型的类型推导功能

   - 无法获取泛型组件的实例类型（泛型组件的类型，无法通过InstanceType的泛型限制）

- onRenderTracked()、onRenderTriggered()、响应性调试 示例代码

> 1 <template>

> 2 <el-input v-model="reaData.name" />

> 3 <el-input v-model="reaData.age" />

> 4 <el-input v-model="refData" />

> 5 </template> 6

> 7 <script setup lang="ts">

> 8 const reaData = reactive({

> 9 name: 'abc',

> 10 age: '123'

> 11 })

> 12 const refData = ref('bbb') 13

- 14 onRenderTracked(event => {

- 15 console.log('onRenderTracked', event)

> 16 }) 17

> 18 onRenderTriggered(event => {

> 19 console.log('onRenderTriggered', event)

> 20 })

> 21 </script>

## 说明

      - 组件内、computed、watch、watchEffect都可用

      - 对reactive友好，能根据key区别出是那个数据

      - 对ref不友好，因为key都是value

- 侦听器的onCleanup

   - watch()、watchEffect()都可用

   - 异步事件前调用，用来清除上一次执行产生的副作用

   - 典型的，用来取消之前的未完成的异步请求

- watchEffect()

   - 不建议使用，出现问题难以调试

   - 坚持使用的话，建议用onTrigger调试

- effectScope()、getCurrentScope()、onScopeDispose()

   - 详情参考RFC

onErrorCaptured()、app.config.errorHandler

- 1 // 子组件

> 2 throw new Error(' 我， Children 。报错了！ ') 3

- 4 // 父组件

> 5 onErrorCaptured((err, instance, info) => {

> 6 console.log(' 组件内报错了！ ', err, instance, info)

> 7 return false

> 8 })

9

> 10 // 入口文件

> 11 app.config.errorHandler = (err, instance, info) => {

> 12 console.log(' 应用报错了！ ', err, instance, info)

> 13 }

   - provide()、inject()

      - 当子组件多或层级深的时候使用，比props好用

      - 把整个reactive对象或ref传递，以保持响应性

   - CSS Modules、CSS中的v-bind()

- 1 <template>

- 2 <el-input v-model="theme.color" />

- 3 <p>hello</p>

- 4 </template>

5

- 6 <script setup>

- 7 const theme = reactive({

- 8 color: 'red'

- 9 })

- 10 </script>

11

> 12 <style scoped>

> 13 p {

> 14 color: v-bind('theme.color');

- 15 }

- 16 </style>

   - v-pre

   - Transition

   - 自定义语法块、语法块的src导入 defineOptions()、defineSlots()

- 1 defineOptions({

- 2 name: ' 定义的组件名字 '

- 3 })

4

> 5 // ------------------------------

6

> 7 <template>

> 8 <div class="home">

> 9 <slot name="slot1" username="123" />

> 10 <slot name="slot2" :age="123" />

> 11 </div>

> 12 </template> 13

> 14 <script setup lang="ts">

> 15 defineSlots<{

> 16 slot1(props: { username: string }): any

> 17 slot2(props: { age: number }): any

> 18 }>()

> 19 </script>

mergeProps()
