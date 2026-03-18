# jQuery表单与插件系统

## 一、这篇的主线

这一篇看起来主题很多，但核心其实是 jQuery 的三类高频能力：

1. 表单提交与数据收集。
2. 插件机制与常见插件使用。
3. 集合工具方法和历史项目兼容。

换句话说，这篇讲的是 jQuery 如何帮助你更快处理传统页面交互。

---

## 二、jQuery 中的表单提交

表单在浏览器里默认会触发页面提交和刷新，而 jQuery 更常见的用法是：先拦截提交，再做校验和 Ajax 请求。

### 2.1 基本写法

```js
$("form").on("submit", function (event) {
  event.preventDefault()

  console.log("开始处理提交逻辑")
})
```

### 2.2 为什么通常要阻止默认提交

1. 防止页面刷新打断前端逻辑。
2. 便于先做表单校验。
3. 便于改成 Ajax 异步提交。

### 2.3 `return false` 和 `preventDefault()`

旧代码里常看到：

```js
$("form").on("submit", function () {
  return false
})
```

它通常意味着：

1. 阻止默认行为。
2. 阻止事件冒泡。

但在现代代码里，显式写 `event.preventDefault()` 更清楚，也更容易读懂。

### 2.4 一个现实判断

如果你正在维护老 jQuery 项目，看到 `return false` 要先弄清楚作者到底是只想阻止提交，还是还想阻止冒泡；不要机械替换后改变原有交互链路。

---

## 三、表单序列化和高频方法

### 3.1 `serialize()`

```js
$("form").on("submit", function (event) {
  event.preventDefault()

  const queryString = $(this).serialize()
  console.log(queryString)
})
```

输出结果通常类似：

```text
nickname=tom&password=123456
```

### 3.2 `serializeArray()`

如果你想拿到更结构化的结果，可以用：

```js
const result = $("form").serializeArray()
console.log(result)
```

它会返回对象数组，更适合后续处理。

### 3.3 生效前提和边界

1. 只有带 `name` 属性的表单项，才会被序列化。
2. `disabled` 字段通常不会被收集。
3. 文件上传不适合用 `serialize()`，通常要用 `FormData`。

### 3.4 表单相关高频方法

| 方法               | 作用                              |
| ------------------ | --------------------------------- |
| `val()`            | 获取或设置表单值                  |
| `serialize()`      | 生成查询字符串                    |
| `serializeArray()` | 生成对象数组                      |
| `prop()`           | 处理 `checked`、`disabled` 等状态 |

```js
const username = $("input[name=username]").val()
const checked = $("input[type=checkbox]").prop("checked")
```

### 3.5 怎么选

1. 只想直接提交字符串参数，用 `serialize()`。
2. 想先处理数据结构再提交，用 `serializeArray()`。
3. 单独取某个控件值，用 `val()` 或 `prop()`。

### 3.6 `prop()` 和 `attr()` 的边界

在表单场景里，这是一个很高频的老问题：

| 需求                                    | 更推荐   |
| --------------------------------------- | -------- |
| 读取当前 `checked`、`disabled` 这类状态 | `prop()` |
| 读写原始 HTML 属性值                    | `attr()` |

尤其在复选框、单选框场景里，当前状态优先看 `prop()`，不要把“初始属性”和“实时状态”混为一谈。

---

## 四、jQuery 插件机制

jQuery 插件机制的本质就是扩展 jQuery 自身能力。

### 4.1 扩展实例方法

```js
$.fn.highlight = function (color) {
  this.css("backgroundColor", color)
  return this
}

$("p").highlight("yellow")
```

### 4.2 为什么通常要 `return this`

因为这样才能继续链式调用。

### 4.3 合并默认配置

```js
function createOptions(userOptions) {
  return $.extend(
    {
      color: "#409eff",
      duration: 300,
    },
    userOptions,
  )
}
```

### 4.4 插件更像什么

插件更像“把通用交互逻辑封装成可复用能力”，而不是在每个页面重复写一遍相似代码。

---

## 五、常见 jQuery 插件怎么理解

很多 jQuery 插件本质上都在解决一种通用 UI 或交互问题。

| 插件类型     | 常见用途               |
| ------------ | ---------------------- |
| 表单验证插件 | 校验输入格式、错误提示 |
| 轮播图插件   | Banner、图片切换       |
| 图片裁切插件 | 头像裁剪、图片编辑     |
| 日期选择器   | 日期输入和日历选择     |
| 全屏滚动插件 | 宣传页、活动页整屏切换 |

### 5.1 使用插件的一般步骤

1. 先引入 jQuery。
2. 再引入插件脚本和样式。
3. 按插件要求准备 HTML 结构。
4. 调用插件初始化方法。

### 5.2 一个现实边界

在现代工程化项目里，很多新项目已经不再优先选择 jQuery 插件生态，而会转向框架组件库。但维护老项目时，这部分知识仍然非常实用。

### 5.3 什么时候值得继续用 jQuery 插件

1. 你维护的是传统页面或历史后台系统。
2. 项目里已经大量依赖现有插件生态。
3. 当前目标是低成本维护，而不是整体技术栈升级。

如果是新项目或正在做体系化重构，通常更应该先评估框架组件、原生能力或更现代的独立库。

---

## 六、表单验证插件的思路

表单验证插件的价值不在替你写正则，而在于把规则、提示、提交流程解耦出来。

### 6.1 常见能力

1. 必填校验。
2. 格式校验。
3. 长度校验。
4. 自定义错误提示。

### 6.2 典型初始化思路

```js
$("form").validate({
  onBlur: true,
  onSubmit: true,
  valid() {
    console.log("校验通过")
  },
  invalid() {
    console.log("校验失败")
  },
})
```

### 6.3 什么时候更适合用插件

当页面存在大量规则重复、错误提示统一、表单交互复杂时，用验证插件会比手写散落校验逻辑更稳。

### 6.4 一个排查方向

如果验证插件“看起来没生效”，通常先看：

1. 插件脚本和依赖是否按顺序引入。
2. HTML 结构和选择器是否符合插件预期。
3. 初始化代码有没有在 DOM 就绪后执行。
4. 校验规则和字段名是否真的对应上。

---

## 七、工具方法：遍历与数组转换

### 7.1 `each()`

```js
$("li").each(function (index, element) {
  console.log(index, element)
})
```

适合遍历 jQuery 集合。

### 7.2 `map()`

```js
const texts = $("li")
  .map(function () {
    return $(this).text()
  })
  .get()
```

适合把集合映射成一个新的结果集合。

### 7.3 `get()` 和 `toArray()`

```js
const list1 = $("li").get()
const list2 = $("li").toArray()
```

用于把 jQuery 对象转成原生数组，以便继续使用原生数组方法。

### 7.4 一个判断标准

1. 继续停留在 jQuery 集合链路里，用 `each()`、`map()`。
2. 想切换回原生数组生态，用 `get()` 或 `toArray()`。

### 7.5 一个现代补充

如果项目已经逐步迁到原生 DOM 或框架环境，`get()` / `toArray()` 往往就是一个过渡点：把 jQuery 集合转回原生数组后，后续逻辑就能慢慢迁到更现代的写法里。

---

## 八、多库共存 `noConflict()`

如果页面里还有别的库也占用了 `$`，就需要把 `$` 让出来。

```js
const jq = $.noConflict()

jq(".box").hide()
```

### 8.1 它解决什么问题

避免多个类库同时把 `$` 挂到全局时发生冲突。

### 8.2 常见场景

1. 老项目混合多个类库。
2. 引入第三方脚本后 `$` 被覆盖。
3. 历史代码迁移阶段。

### 8.3 一个现实提醒

`noConflict()` 更多出现在历史项目和兼容场景里，新项目里出现频率已经低很多。

### 8.4 什么时候才值得考虑 `noConflict()`

1. 页面里确实混用了多个会占用 `$` 的库。
2. 你没法一次性清理历史脚本依赖。
3. 当前目标是先让系统稳定共存，而不是立刻整体重构。

---

## 九、一个表单提交流程示例

```html
<form id="loginForm">
  <input type="text" name="username" />
  <input type="password" name="password" />
  <button type="submit">登录</button>
</form>

<script src="./jquery/jquery-3.7.1.min.js"></script>
<script>
  $("#loginForm").on("submit", function (event) {
    event.preventDefault()

    const formData = $(this).serialize()

    $.ajax({
      url: "/api/login",
      method: "POST",
      data: formData,
      success(res) {
        console.log(res)
      },
    })
  })
</script>
```

这个例子对应的完整链路就是：

```text
监听提交 -> 阻止默认刷新 -> 收集表单数据 -> 发起 Ajax -> 处理结果
```

---

## 十、小结

1. jQuery 处理表单时，核心流程通常是监听提交、阻止默认行为、校验、收集数据、再异步提交。
2. `serialize()`、`serializeArray()`、`val()`、`prop()` 是表单处理的高频方法。
3. jQuery 插件机制本质上是在扩展 `$` 或 `$.fn` 的能力，适合复用通用 UI 和交互逻辑。
4. `each()`、`map()`、`get()`、`toArray()` 是集合处理里的常用工具方法。
5. `noConflict()` 主要用于多库共存和历史项目兼容，这篇本质上是在讲 jQuery 如何快速支撑传统页面交互。
