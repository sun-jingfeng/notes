# Vue3 拓展（下）

## 性能优化

Volar Takeover 模式

v-once、v-memo

shallowRef()、triggerRef()、shallowReactive()、shallowReadonly()、markRaw()

## 异步组件

Suspense

defineAsyncComponent()

## 应用实例

createApp()、app.mount()、app.unmount()

## 卸载的应用实例无法重新挂载

app.component()、app.directive()、app.provide()、app.use()

app.version、version

app.config.errorHandler、app.config.warnHandler

app.config.performance

app.config.compilerOptions

- 使用构建工具开发项目时，vue的版本为不包含编译器的"运行时"版本，编译器被集成在构建工具中，因此编译相关配置需要通过构建工具传给编译器。

参考浏览器内模板编译注意事项

## 工具

isRef()、isProxy()、isReactive()、isReadonly()

isRef有类型收窄功能

具有类型收窄功能的操作符

   - js操作符：typeof、instanceof、in、===、isArray

   - ts操作符：is

- unref()、toValue()

toRef()、toRefs()

   - 对ref、reactive均有效

   - toRef会为当前不存在的属性建立起联系，但toRefs不会

- customRef()

   - track负责订阅

   - trigger负责分发

toRaw()

- TypeScript 工具类型

## 服务端渲染

服务端渲染 (SSR)

createSSRApp()

- onServerPrefetch() 服务端渲染 API
