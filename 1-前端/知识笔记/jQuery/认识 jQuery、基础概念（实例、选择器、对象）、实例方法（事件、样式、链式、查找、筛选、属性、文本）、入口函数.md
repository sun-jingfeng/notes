# 认识 jQuery、基础概念、实例方法、入口函数

## 一、一句话理解

jQuery 的核心价值不是“提供几个新方法”，而是把选中元素、批量操作元素、处理事件和更新页面这一整套前端常见动作，封装成了一套更统一、更顺手的 API。

---

## 二、jQuery 是什么

**jQuery** 是一个以 DOM 操作、事件处理和 Ajax 封装为核心的 JavaScript 类库。

它在前端早期最重要的价值有两点：

1. 用更简洁的 API 替代繁琐的原生 DOM 操作。
2. 屏蔽旧浏览器之间的大量兼容差异。

| 对比项       | 原生 DOM（早期）              | jQuery               |
| ------------ | ----------------------------- | -------------------- |
| **选择元素** | `document.querySelector()` 等 | `$()`                |
| **事件绑定** | `addEventListener` 及兼容写法 | `.on()`              |
| **样式操作** | `style.xxx`                   | `.css()`             |
| **批量处理** | 需要手动遍历                  | 很多方法天然支持集合 |
| **链式调用** | 不自然                        | 很常见               |

### 1. 现在为什么还值得学

新项目里 jQuery 已经不是主流，但它在老项目、后台系统、传统活动页和历史代码维护中依然很多。

所以学习它的价值主要在于：

- 能读懂历史代码。
- 能维护旧系统。
- 能更好理解“DOM 集合操作”这类前端基础思想。

---

## 三、如何引入 jQuery

### 1. 本地引入

```html
<script src="./jquery/jquery-3.7.1.min.js"></script>
```

### 2. CDN 引入

```html
<script src="https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js"></script>
```

### 3. 引入后得到什么

通常会得到两个全局入口：

1. `jQuery`
2. `$`

其中 `$` 只是 `jQuery` 的简写别名。

---

## 四、入口函数：为什么不是一上来就写逻辑

最经典的写法：

```js
$(function () {
  console.log("DOM 已就绪")
})
```

它解决的问题是：避免 DOM 还没加载完成，就开始查找元素和绑定事件。

它本质上和下面这段原生代码解决的是同一类问题：

```js
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM 已就绪")
})
```

可以把它理解成：jQuery 帮你把“等 DOM 就绪再执行”这件事封装成了更短的写法。

---

## 五、jQuery 对象到底是什么

每次调用 `$()`，返回的都不是原生 DOM，而是 **jQuery 对象**。

```js
const $box = $(".box")
```

### 1. 为什么这点最重要

因为 jQuery 对象和原生 DOM 元素的方法体系不一样。

| 类型            | 例子                             | 可直接调用                               |
| --------------- | -------------------------------- | ---------------------------------------- |
| **原生 DOM**    | `document.querySelector(".box")` | `style`、`classList`、`addEventListener` |
| **jQuery 对象** | `$(".box")`                      | `.css()`、`.addClass()`、`.on()`         |

### 2. 二者如何互转

原生 DOM 转 jQuery：

```js
const element = document.querySelector(".box")
const $element = $(element)
```

jQuery 转原生 DOM：

```js
const element = $(".box")[0]
```

### 3. 一个更重要的认知

jQuery 对象很多时候不是“一个元素”，而是“一组元素的包装集合”。

这也是为什么它的很多 API 能直接批量生效。

### 4. 真实开发里怎么判断当前拿到的是什么

| 看到的值                      | 它更像什么                   |
| ----------------------------- | ---------------------------- |
| `document.querySelector(...)` | 原生 DOM                     |
| `$(...)`                      | jQuery 对象                  |
| `$(...)[0]`                   | 从 jQuery 对象取出的原生 DOM |

很多 jQuery 初学问题，本质上都不是方法不会用，而是没先分清“我现在手里到底是原生 DOM，还是 jQuery 包装对象”。

---

## 六、选择器：不是目的，而是入口

jQuery 的选择器大部分和 CSS 选择器一致。

```js
$("p")
$(".title")
$("#app")
$(".list li")
```

### 1. 常见分类

| 选择器         | 示例         | 含义           |
| -------------- | ------------ | -------------- |
| **标签选择器** | `$("div")`   | 选中所有 `div` |
| **类选择器**   | `$(".box")`  | 选中指定类名   |
| **ID 选择器**  | `$("#app")`  | 选中唯一 ID    |
| **后代选择器** | `$("ul li")` | 选中后代元素   |

### 2. 选择器的真正作用

选择器不是目的，它只是后续操作的入口。

也就是说，jQuery 的思路通常不是：

```text
先拿到一个元素再说
```

而是：

```text
先拿到一批目标元素
  -> 再对它们统一做事件、样式、属性、内容处理
```

### 3. 一个维护性提醒

选择器写得出来不代表写得稳。真正更重要的是：

1. 选择范围是否过大。
2. 是否过度依赖页面结构层级。
3. 后续 DOM 调整时会不会轻易失效。

---

## 七、事件处理：jQuery 最常用的能力之一

### 1. 基础绑定

```js
$(".btn").on("click", function () {
  console.log("clicked")
})
```

### 2. 移除事件

```js
$(".btn").off("click")
```

### 3. 只执行一次

```js
$(".btn").one("click", function () {
  console.log("只触发一次")
})
```

### 4. 回调里的 `this`

事件回调里的 `this` 默认是原生 DOM 元素，所以如果想继续调用 jQuery 方法，通常要再包装一下：

```js
$(".btn").on("click", function () {
  $(this).addClass("active")
})
```

### 5. 一个常见误区

很多人以为 `$(this)` 和 `this` 完全一样，其实不是：

- `this` 是原生 DOM
- `$(this)` 是 jQuery 对象

### 6. 事件写法什么时候该更谨慎

如果后面需要解绑事件、复用处理函数，或者你已经在混写原生事件和 jQuery 事件，就不要所有地方都塞匿名函数；适当保留具名函数引用，会让后续维护轻松很多。

---

## 八、样式与类名：为什么 jQuery 写起来很顺手

### 1. 修改样式

```js
$(".box").css("color", "red")

$(".box").css({
  width: 240,
  height: 120,
  backgroundColor: "skyblue",
})
```

### 2. 类名相关

```js
$(".box").addClass("active")
$(".box").removeClass("active")
$(".box").toggleClass("active")
$(".box").hasClass("active")
```

真实开发里，更推荐优先切类名，而不是直接写大量行内样式，因为类名更适合维护和复用。

---

## 九、链式调用：jQuery 很有代表性的写法

jQuery 很多方法执行后会返回当前 jQuery 对象，所以可以连续写。

```js
$(".box").css("width", 240).addClass("active").show()
```

链式调用为什么成立：

- 很多实例方法最后返回了当前 jQuery 对象。

它的价值：

1. 连续操作同一批元素时更紧凑。
2. 代码阅读路径更集中。

但如果链太长，可读性会下降，这时拆开写更稳。

### 1. 一个实战判断

1. 连续对同一批元素做 2 到 3 个简单操作，链式调用很顺手。
2. 一旦链条里混入条件判断、分支逻辑、异步或多次查找，就应该考虑拆开。

---

## 十、查找与筛选：先缩小范围，再操作

### 1. 查找关系元素

```js
$(".course").find("li")
$(".box").children()
$(this).parent()
$(this).parents(".container")
$(this).siblings()
$(this).prev()
$(this).next()
```

| 方法             | 作用           |
| ---------------- | -------------- |
| **`find()`**     | 查找所有后代   |
| **`children()`** | 查找直接子元素 |
| **`parent()`**   | 查找直接父元素 |
| **`parents()`**  | 查找祖先元素   |
| **`siblings()`** | 查找兄弟元素   |

### 2. 筛选已有结果

```js
$("li").first()
$("li").last()
$("li").eq(1)
$("li").filter(".active")
$("li").not(".disabled")
```

这部分的核心思路是：

```text
先选中一个较大的集合
  -> 再逐步缩小范围
  -> 最后对目标元素执行操作
```

---

## 十一、属性、数据、文本和 HTML

### 1. 属性与状态

```js
$("img").attr("src")
$("img").attr("alt", "banner")
$("input").prop("checked", true)
$("input").val("hello")
```

一个常见边界：

- `attr()` 更偏标签属性
- `prop()` 更偏当前状态属性

例如复选框的勾选状态，通常更应该看 `prop("checked")`。

### 2. 自定义数据

```js
$(".card").data("id")
```

### 3. 文本与 HTML

```js
$(".title").text("新标题")
$(".box").html("<strong>hello</strong>")
$(".list").append("<li>new item</li>")
```

| 方法           | 特点                      |
| -------------- | ------------------------- |
| **`text()`**   | 只处理纯文本，不解析 HTML |
| **`html()`**   | 会把字符串当 HTML 解析    |
| **`append()`** | 追加内容到尾部            |

真实开发里，`html()` 需要更谨慎，因为它会直接解析字符串结构。

---

## 十二、一个入门示例

```html
<button class="btn">切换高亮</button>
<div class="box">hello</div>

<script src="./jquery/jquery-3.7.1.min.js"></script>
<script>
  $(function () {
    $(".btn").on("click", function () {
      $(".box").toggleClass("active")
    })
  })
</script>
```

```css
.active {
  color: white;
  background: #409eff;
}
```

这段代码体现了 jQuery 的典型主线：

```text
等 DOM 就绪
  -> 选中元素
  -> 绑定事件
  -> 触发后批量改样式状态
```

---

## 十三、小结

| 知识点       | 结论                                     |
| ------------ | ---------------------------------------- |
| **核心入口** | `$()` 返回的是 jQuery 对象，不是原生 DOM |
| **核心思路** | 先选中元素集合，再统一操作               |
| **代表能力** | 事件、样式、查找筛选、属性和内容更新     |
| **代表特征** | 集合操作、链式调用、API 简洁             |
| **学习重点** | 分清 jQuery 对象和原生 DOM 的边界        |
