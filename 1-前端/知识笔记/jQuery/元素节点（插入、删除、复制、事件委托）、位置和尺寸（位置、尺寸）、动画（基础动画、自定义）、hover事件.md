# 元素节点、位置尺寸、动画、hover 事件

## 一、元素节点的插入

jQuery 提供了一组高频 DOM 插入方法，用来把新节点放进页面结构中。

### 1. 常见方法

```js
const row = $(
  `<tr>
    <td>学员</td>
    <td>17</td>
    <td>女</td>
    <td>13632369876</td>
  </tr>`,
)

$("tbody").append(row)
$("tbody").prepend(row)
$("tbody tr").eq(1).before(row)
$("tbody tr").eq(2).after(row)
```

### 2. 区别

| 方法            | 作用                 |
| --------------- | -------------------- |
| **`append()`**  | 插入到父元素内部末尾 |
| **`prepend()`** | 插入到父元素内部开头 |
| **`before()`**  | 插入到当前元素前面   |
| **`after()`**   | 插入到当前元素后面   |

### 3. 一个易错点

同一个真实节点多次插入时，默认是“移动”而不是“复制”。如果想保留原节点，需要先 `clone()`。

---

## 二、元素节点的删除与清空

### 1. `remove()`

```js
$(this).parents("tr").remove()
```

删除当前匹配元素本身。

### 2. `empty()`

```js
$("ul").empty()
```

只清空元素内部子节点，不删除外层容器。

### 3. `detach()`

`detach()` 和 `remove()` 很像，但它会保留 jQuery 绑定的数据和事件，更适合临时移出后再插回 DOM。

### 4. `remove()`、`empty()`、`detach()` 怎么选

| 需求                         | 更推荐     |
| ---------------------------- | ---------- |
| 连容器本身一起删掉           | `remove()` |
| 只清空内部内容               | `empty()`  |
| 临时挪走后还想保留事件和数据 | `detach()` |

---

## 三、元素节点的复制

```js
const newRow = $(this).parents("tr").clone(true)
```

### 1. `clone(true)` 的意义

传入 `true` 时，连同事件处理器和数据一起复制。

### 2. 默认情况

不传参数时，通常只复制结构和属性，不复制事件。

---

## 四、事件委托

### 1. 推荐写法

```js
$("table").on("click", ".delete", function () {
  $(this).parents("tr").remove()
})
```

### 2. 适合场景

1. 动态插入的元素。
2. 大量同类子元素。
3. 需要把事件统一挂在父层时。

### 3. 为什么委托能生效

因为事件会冒泡到父元素，父元素统一接住事件后，再判断真正触发的是哪个子元素。

### 4. 旧写法

```js
$("table").delegate(".delete", "click", function () {})
```

`delegate()` 属于旧式写法，现在优先使用 `on()`。

### 5. 一个现代补充

如果你正在维护老 jQuery 页面，事件委托仍然很有价值；如果你已经迁到组件化框架，很多事件绑定会直接跟着组件生命周期走，不再需要大量手写父层委托。

---

## 五、位置相关方法

### 1. `offset()`

```js
$(".box").offset()
```

返回元素相对整个文档的位置。

### 2. `position()`

```js
$(".box").position()
```

返回元素相对最近定位祖先元素的位置。

### 3. `scrollTop()` / `scrollLeft()`

```js
$(".outer").scrollTop()
$(".outer").scrollLeft()
```

用于获取或设置滚动距离。

### 4. 怎么记

1. `offset` 看文档。
2. `position` 看定位祖先。
3. `scrollTop` 看滚动条。

### 5. 一个排错提醒

位置值不对时，优先排查：

1. 当前参考系是整个文档，还是定位祖先。
2. 页面或容器有没有已经发生滚动。
3. 元素是否被动态插入、隐藏或动画改变了布局。

---

## 六、尺寸相关方法

### 1. 内容区尺寸

```js
$(".box").width()
$(".box").height()
```

### 2. 内容区 + 内边距

```js
$(".box").innerWidth()
$(".box").innerHeight()
```

### 3. 内容区 + 内边距 + 边框

```js
$(".box").outerWidth()
$(".box").outerHeight()
```

### 4. 包含外边距

```js
$(".box").outerWidth(true)
```

传 `true` 时会把 `margin` 也算进去。

---

## 七、基础动画

### 1. 显示隐藏动画

```js
$(".box").show()
$(".box").hide()
$(".box").toggle()
```

也可以传时间参数形成过渡：

```js
$(".box").show(300)
```

### 2. 淡入淡出动画

```js
$(".box").fadeIn()
$(".box").fadeOut()
$(".box").fadeToggle()
$(".box").fadeTo(300, 0.5)
```

### 3. 滑动动画

```js
$(".box").slideDown()
$(".box").slideUp()
$(".box").slideToggle()
```

---

## 八、自定义动画 `animate()`

```js
$(".box").animate(
  {
    marginLeft: 200,
    width: 300,
    height: 200,
    opacity: 0.6,
  },
  400,
)
```

### 1. 适合做什么

1. 位移。
2. 尺寸变化。
3. 透明度变化。

### 2. 注意点

`animate()` 更适合数值型属性，不适合现代复杂动效。新项目通常更推荐 CSS 动画或 Web Animations API。

### 3. 什么时候还适合用 jQuery 动画

1. 维护传统页面里的简单位移、显示隐藏、透明度变化。
2. 项目整体已经建立在 jQuery 效果链上。
3. 当前目标是低成本维护，而不是重做动效体系。

如果需求已经涉及复杂时间轴、交互联动和跨端性能，通常就不该继续把问题都交给 jQuery 动画。

---

## 九、动画队列、延时与停止

### 1. `delay()`

```js
$(".box").delay(1500).hide()
```

用于给动画或效果队列增加延时。

### 2. `stop()`

```js
$(".box").stop().animate({ left: 100 })
```

### 3. 为什么 `stop()` 很常见

因为鼠标频繁移入移出时，如果不停止队列，动画可能不断堆积，导致页面表现越来越怪。

### 4. 常见理解

| 写法                   | 含义                     |
| ---------------------- | ------------------------ |
| **`stop()`**           | 停止当前动画             |
| **`stop(true)`**       | 清空后续队列             |
| **`stop(true, true)`** | 清队列并直接跳到最终状态 |

---

## 十、动画回调

大多数 jQuery 动画方法都支持在动画结束后执行回调。

```js
$(".box").fadeOut(500, function () {
  $(this).remove()
})
```

### 1. 回调的价值

1. 保证在动画结束后再做后续操作。
2. 便于做删除、切换状态、串联逻辑。

### 2. 回调里的 `this`

回调中的 `this` 通常指向当前执行动画的原生 DOM 节点，常配合 `$(this)` 使用。

---

## 十一、`hover()` 事件

`hover()` 可以看作 `mouseenter` 和 `mouseleave` 的简写组合。

```js
$(".menu-item").hover(
  function () {
    $(this).addClass("active")
  },
  function () {
    $(this).removeClass("active")
  },
)
```

### 1. 常见场景

1. 菜单高亮。
2. 卡片悬停效果。
3. 二级菜单展开。

### 2. 单参数写法

```js
$(".menu-item").hover(function () {
  console.log("移入或移出都会执行")
})
```

这种写法在移入和移出时都会执行同一个函数。

### 3. `hover()` 和 `mouseenter` / `mouseleave` 怎么理解

`hover(fnIn, fnOut)` 本质上是对 `mouseenter` 和 `mouseleave` 的简写封装。

如果你只是想快速写传统悬停交互，用 `hover()` 很方便；如果你要更明确地拆开绑定、移除或调试单侧逻辑，直接用 `.on("mouseenter", ...)` / `.on("mouseleave", ...)` 会更清楚。

---

## 十二、总结

1. 插入、删除、克隆是 jQuery 操作 DOM 结构的基础能力。
2. 动态节点优先考虑事件委托，不要给每个新节点单独绑定事件。
3. `offset()`、`position()`、`width()`、`outerWidth()` 的关键区别在于参照物和是否包含内外边距。
4. `animate()`、`delay()`、`stop()` 和回调共同组成了 jQuery 的基础动画链路。
5. 学这篇时，重点不是记方法名，而是理解每个方法到底是在“操作结构、测量位置、还是控制动画过程”。
