# JavaScript 与 ECMAScript、DOM、定时器

## 一、先分清 JavaScript、ECMAScript 和 Web APIs

很多初学者会把这些概念混在一起，但它们其实不是同一层东西。

| 组成       | 作用                                                  |
| ---------- | ----------------------------------------------------- |
| ECMAScript | 语言规则，负责变量、函数、对象、类等语法              |
| Web APIs   | 浏览器运行时能力，负责 DOM、BOM、定时器、网络、存储等 |

一句话理解：

```text
JavaScript = ECMAScript + 当前运行环境提供的能力
```

所以同样是写 JavaScript：

1. 在浏览器里能操作 DOM。
2. 在 Node 里能操作文件系统。
3. 语言还是同一套语法，但环境能力不同。

---

## 二、DOM 是什么

DOM 是浏览器提供的一套操作网页内容的对象模型。

核心思想是：把 HTML 文档看成一棵对象树，JavaScript 通过对象方式去查找和修改页面内容。

### 2.1 DOM 的作用

| 作用           | 说明                            |
| -------------- | ------------------------------- |
| 查找元素       | 获取页面中的标签节点            |
| 修改内容       | 修改文本、HTML 结构             |
| 修改属性和样式 | 更新 `src`、`class`、`style` 等 |
| 实现交互       | 配合事件监听做动态效果          |

### 2.2 DOM 树怎么理解

浏览器会把 HTML 文档解析成树状结构：

```text
document
  -> html
     -> head
     -> body
        -> h1
        -> div
```

DOM 编程本质上就是：

```text
找到节点 -> 读取或修改节点 -> 让页面产生变化
```

---

## 三、常见节点和 `document`

DOM 树中的每个内容都叫节点。

| 节点类型 | 说明                             |
| -------- | -------------------------------- |
| 元素节点 | 各种 HTML 标签，如 `div`、`body` |
| 属性节点 | 标签上的属性，如 `href`、`class` |
| 文本节点 | 标签中的文本内容                 |

`document` 是 DOM 编程中最核心的入口对象，整个网页内容都可以通过它来访问。

```js
console.log(document.documentElement)
console.log(document.body)
```

### 3.1 一个现实提醒

`document.write()` 在早期资料里常见，但现代项目里几乎不作为常规 DOM 更新方式使用，因为它会打断文档流，甚至覆盖现有页面内容。

---

## 四、查找元素节点

### 4.1 按 id 查找

```js
const box = document.getElementById("box")
```

特点：

1. 参数是 id 字符串，不需要加 `#`。
2. 找不到返回 `null`。

### 4.2 使用选择器查找

```js
const first = document.querySelector(".item")
const all = document.querySelectorAll(".item")
```

| 方法                 | 结果                       |
| -------------------- | -------------------------- |
| `querySelector()`    | 返回第一个匹配元素         |
| `querySelectorAll()` | 返回所有匹配元素的节点集合 |

### 4.3 怎么选

1. 已知唯一 id 时，`getElementById()` 简单直接。
2. 需要复用 CSS 选择器表达能力时，更常用 `querySelector()`。
3. 需要一批节点时，用 `querySelectorAll()`。

### 4.4 一个常见坑

查找结果可能为 `null`，尤其是脚本执行时机不对或者选择器写错时，操作前最好先确认节点是否存在。

---

## 五、操作元素属性和样式

### 5.1 直接修改属性

```js
const img = document.querySelector("img")
img.src = "./images/new.png"
img.alt = "新图片"
```

### 5.2 使用 `setAttribute()`

```js
img.setAttribute("title", "这是提示文字")
```

| 方式             | 适用场景                 |
| ---------------- | ------------------------ |
| 直接点语法       | 操作常见标准属性         |
| `setAttribute()` | 动态设置任意属性，更通用 |

### 5.3 修改样式

```js
const box = document.querySelector(".box")
box.style.width = "200px"
box.style.backgroundColor = "pink"
```

注意：JavaScript 中样式名通常使用驼峰写法，例如 `background-color` 要写成 `backgroundColor`。

### 5.4 一个实战建议

如果只是切换视觉状态，很多时候更推荐切换类名，而不是在 JS 里堆大量内联样式。

---

## 六、操作文本和 HTML

### 6.1 `innerText`

```js
box.innerText = "<strong>你好</strong>"
```

特点：只写文本，标签不会被解析。

### 6.2 `innerHTML`

```js
box.innerHTML = "<strong>你好</strong>"
```

特点：会解析 HTML 标签，可以动态插入结构。

### 6.3 怎么选

| 方式        | 更适合              |
| ----------- | ------------------- |
| `innerText` | 单纯写文字          |
| `innerHTML` | 需要插入结构化 HTML |

### 6.4 一个重要边界

`innerHTML` 很灵活，但如果内容来自不可信输入，可能带来 XSS 风险。所以用户输入、后端返回内容不能不加处理就直接拼进 `innerHTML`。

---

## 七、时间对象 `Date`

### 7.1 创建时间对象

```js
const now = new Date()
const target = new Date("2026-03-17 12:00:00")
```

### 7.2 常见方法

| 方法            | 作用                   |
| --------------- | ---------------------- |
| `getFullYear()` | 获取年                 |
| `getMonth()`    | 获取月，范围 `0 ~ 11`  |
| `getDate()`     | 获取日                 |
| `getDay()`      | 获取星期，范围 `0 ~ 6` |
| `getHours()`    | 获取小时               |
| `getMinutes()`  | 获取分钟               |
| `getSeconds()`  | 获取秒                 |

注意：`getMonth()` 返回值从 0 开始，所以实际展示时通常要 `+ 1`。

### 7.3 时间戳

时间戳是从 1970-01-01 00:00:00 UTC 开始到当前时刻的毫秒数。

```js
const ts1 = new Date().getTime()
const ts2 = +new Date()
const ts3 = Date.now()
```

| 方式          | 特点                       |
| ------------- | -------------------------- |
| `getTime()`   | 可获取指定时间对象的时间戳 |
| `+new Date()` | 简写形式                   |
| `Date.now()`  | 最简洁，但只能获取当前时间 |

### 7.4 常见场景

1. 倒计时。
2. 时间差计算。
3. 排序和比较时间先后。

---

## 八、定时器

### 8.1 `setInterval`

```js
const timerId = setInterval(function () {
  console.log("每秒执行一次")
}, 1000)
```

### 8.2 `clearInterval`

```js
clearInterval(timerId)
```

### 8.3 `setTimeout`

```js
const timeoutId = setTimeout(function () {
  console.log("只执行一次")
}, 1000)

clearTimeout(timeoutId)
```

### 8.4 `setInterval` 和 `setTimeout` 怎么选

| 方式          | 更适合           |
| ------------- | ---------------- |
| `setTimeout`  | 延后执行一次     |
| `setInterval` | 固定间隔反复执行 |

### 8.5 一个常见误区

定时器并不保证绝对精确时间，只是“尽量在这之后执行”。如果主线程忙、标签页被挂起，执行时机会继续延后。

### 8.6 一个实战提醒

页面销毁、组件卸载、业务结束后记得清理定时器，否则容易造成重复执行和内存浪费。

---

## 九、小结

1. JavaScript 语言本身是 ECMAScript，浏览器里真正能操作页面和时间的是 Web APIs。
2. DOM 的主线就是“找到节点 -> 修改节点 -> 驱动页面变化”。
3. 节点查找、属性操作、文本更新和时间处理，是最常见的基础能力组合。
4. `innerText` 和 `innerHTML`、`setTimeout` 和 `setInterval` 这两组知识一定要能分清使用边界。
5. 学这一篇时，重点不是孤立记 API，而是建立“语言层”和“浏览器能力层”的区分意识。
