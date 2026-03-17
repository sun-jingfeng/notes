# BOM、常用 window 方法、常用事件、classList、dataset

## 一、什么是 BOM

BOM 指的是浏览器对象模型，用来操作浏览器窗口、本地历史记录、地址栏、屏幕信息等。

它和 DOM 的区别是：

| 模型 | 主要操作对象           |
| ---- | ---------------------- |
| DOM  | 页面内容、HTML 元素    |
| BOM  | 浏览器窗口和浏览器环境 |

常见 BOM 对象包括：

1. `window`
2. `navigator`
3. `history`
4. `location`
5. `screen`

一句话理解：DOM 更偏页面内容，BOM 更偏浏览器环境。

---

## 二、常见 BOM 对象

### 2.1 `navigator`

`navigator` 用于获取浏览器和设备环境信息。

```js
console.log(navigator.userAgent)
console.log(navigator.onLine)
```

| 属性          | 说明             |
| ------------- | ---------------- |
| `userAgent`   | 浏览器标识信息   |
| `platform`    | 平台信息         |
| `onLine`      | 当前是否联网     |
| `geolocation` | 地理位置相关能力 |

注意：`navigator` 中有些信息并不绝对可靠，业务判断不要过度依赖字符串识别。

### 2.2 `history`

`history` 用来操作浏览器历史记录。

```js
history.back()
history.forward()
history.go(-1)
```

| 成员        | 作用               |
| ----------- | ------------------ |
| `length`    | 历史记录数量       |
| `back()`    | 后退一页           |
| `forward()` | 前进一页           |
| `go(n)`     | 前进或后退指定步数 |

### 2.3 `location`

`location` 表示当前页面地址信息，是处理 URL 的常用对象。

```js
console.log(location.href)
console.log(location.search)
console.log(location.hash)
```

| 成员           | 作用                     |
| -------------- | ------------------------ |
| `href`         | 完整 URL，赋值可跳转     |
| `search`       | 查询参数部分，如 `?id=1` |
| `hash`         | 哈希部分，如 `#tab1`     |
| `reload()`     | 刷新页面                 |
| `assign(url)`  | 跳转并保留历史记录       |
| `replace(url)` | 跳转但替换当前记录       |

### 2.4 `screen`

`screen` 用于获取屏幕信息。

```js
console.log(screen.width)
console.log(screen.height)
```

常见场景不多，通常只在少数适配或设备分析需求中使用。

---

## 三、常用 `window` 方法

### 3.1 `alert()`

```js
alert("操作成功")
```

用于弹出提示框，会阻塞页面后续执行。

### 3.2 `confirm()`

```js
const ok = confirm("确定删除吗？")
```

返回布尔值：

1. 点击确定返回 `true`。
2. 点击取消返回 `false`。

### 3.3 `prompt()`

```js
const name = prompt("请输入姓名", "张三")
```

可接收用户输入，第二个参数可作为默认值。

### 3.4 一个实际边界

`alert`、`confirm`、`prompt` 适合理解浏览器基础交互，但现代项目里更常用自定义弹窗组件，因为默认弹窗样式不可控、体验也较弱。

---

## 四、常用页面生命周期和窗口事件

### 4.1 `load`

```js
window.addEventListener("load", function () {
  console.log("所有资源加载完成")
})
```

特点：页面中的图片、样式、脚本等资源全部加载完毕后才触发。

### 4.2 `DOMContentLoaded`

```js
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM 结构加载完成")
})
```

特点：只要 HTML 结构解析完成就会触发，不必等待图片等资源加载完成。

### 4.3 `beforeunload`

```js
window.addEventListener("beforeunload", function (event) {
  event.returnValue = ""
})
```

常用于离开页面前提醒用户，但现代浏览器对自定义提示内容有限制。

### 4.4 `resize`

```js
window.addEventListener("resize", function () {
  console.log(document.documentElement.clientWidth)
})
```

适用于监听窗口尺寸变化，例如移动端 `rem` 适配。

### 4.5 `load` 和 `DOMContentLoaded` 怎么选

| 事件               | 更适合                               |
| ------------------ | ------------------------------------ |
| `DOMContentLoaded` | 只依赖 DOM 结构就能开始的逻辑        |
| `load`             | 必须等图片、样式等资源都准备好的逻辑 |

---

## 五、拖放相关事件

拖拽文件上传常会用到 `dragover` 和 `drop`。

```js
const box = document.querySelector(".upload-box")

box.addEventListener("dragover", function (event) {
  event.preventDefault()
})

box.addEventListener("drop", function (event) {
  event.preventDefault()
  const files = event.dataTransfer.files
  console.log(files)
})
```

| 事件       | 说明                       |
| ---------- | -------------------------- |
| `dragover` | 文件拖到目标区域上方时触发 |
| `drop`     | 松开文件时触发             |

注意：想让元素真正接收拖放，通常需要在 `dragover` 中调用 `event.preventDefault()`。

---

## 六、`classList` 属性

`classList` 提供了方便的类名操作方法。

```js
const box = document.querySelector(".box")

box.classList.add("active")
box.classList.remove("hidden")
console.log(box.classList.contains("active"))
box.classList.toggle("open")
```

| 方法         | 作用                 |
| ------------ | -------------------- |
| `add()`      | 添加类名             |
| `remove()`   | 删除类名             |
| `contains()` | 判断是否包含某个类名 |
| `toggle()`   | 有则删、无则加       |

### 6.1 为什么更推荐 `classList`

和直接改 `className` 相比，`classList` 更适合增删单个状态类，不容易把原有类名整体覆盖掉。

---

## 七、`dataset` 属性

`dataset` 用来读取和设置 `data-*` 自定义属性。

```html
<div id="box" data-index="1" data-user-name="tom"></div>
```

```js
const box = document.querySelector("#box")

console.log(box.dataset.index)
console.log(box.dataset.userName)

box.dataset.status = "done"
```

| HTML 写法        | JavaScript 访问    |
| ---------------- | ------------------ |
| `data-index`     | `dataset.index`    |
| `data-user-name` | `dataset.userName` |

### 7.1 `dataset` 适合做什么

1. 给节点挂轻量级标识。
2. 配合事件委托读取当前项信息。
3. 存一些和视图强相关的小数据。

### 7.2 一个边界提醒

`dataset` 适合轻量数据，不适合挂太大对象。复杂数据更适合放在 JS 状态里。

---

## 八、这些 API 怎样配合起来

真实项目里，这几块知识通常会一起出现，例如做一个“用户偏好设置”：

```text
DOMContentLoaded 初始化页面
  -> 读取 location / hash 判断当前视图
  -> 用 dataset 读取按钮标识
  -> 用 classList 切换高亮态
  -> 页面离开前通过 beforeunload 做提醒
```

所以这篇不是在记一堆零散对象，而是在建立“浏览器环境 API + 页面状态控制”的基础组合能力。

---

## 九、小结

1. BOM 主要操作浏览器环境而不是页面结构，常见对象是 `navigator`、`history`、`location`、`screen` 和 `window`。
2. `DOMContentLoaded`、`load`、`beforeunload`、`resize` 这些事件要按触发时机和用途区分。
3. `classList` 适合做状态类切换，`dataset` 适合做轻量级节点数据传递。
4. 学这一篇时，重点不是背对象名，而是理解这些 API 如何一起服务页面初始化、状态切换和浏览器交互。
5. 这篇本质上是在补 DOM 之外的浏览器环境能力基础。
