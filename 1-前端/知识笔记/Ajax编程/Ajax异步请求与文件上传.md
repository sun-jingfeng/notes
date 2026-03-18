# Ajax异步请求与文件上传

## 一、一句话理解

这一篇真正要串起来的主线是：前端发请求时为什么要异步、数据通常用什么格式传、请求超时和进度怎么控制、文件上传又该怎么组织请求体。

---

## 二、同步请求和异步请求

### 1. 什么是同步

同步可以理解为：前面的任务没执行完，后面的任务就必须等待。

```js
console.log(1)
console.log(2)
console.log(3)
```

### 2. 什么是异步

异步任务不会立刻完成，而是先交给浏览器或运行环境等待时机，之后再回到主线程执行回调或后续逻辑。

常见异步任务包括：

1. 事件监听。
2. 定时器。
3. Ajax 请求。
4. Promise 回调。

### 3. 为什么前端更偏向异步请求

如果网络请求是同步的，页面会被阻塞，用户无法继续操作，体验会非常差。

可以这样理解：

```text
同步请求：等结果回来之前，页面像被卡住一样
异步请求：先继续做别的，结果回来后再处理
```

### 4. 一个补充认知

现代前端里，同步 XHR 基本已经不推荐使用。学它主要是为了理解“阻塞”和“非阻塞”的区别，而不是为了在业务里继续采用同步请求。

### 5. 真实开发里怎么判断

| 场景                         | 更推荐               |
| ---------------------------- | -------------------- |
| 页面请求、表单提交、列表刷新 | 异步请求             |
| 只是在学习阻塞和非阻塞的差异 | 可以了解同步概念     |
| 真实业务代码                 | 不要继续采用同步 XHR |

---

## 三、JSON：最常见的数据交换格式

**JSON（JavaScript Object Notation）** 是前后端数据交换中最常见的格式之一。

### 1. JSON 和 JavaScript 对象的区别

```js
const obj = { id: 1, name: "zs" }
const json = '{"id":1,"name":"zs"}'
```

| 对比项     | JS 对象               | JSON                    |
| ---------- | --------------------- | ----------------------- |
| **类型**   | 对象                  | 字符串                  |
| **属性名** | 可不加引号            | 必须双引号              |
| **值类型** | 可含函数、`undefined` | 不支持函数、`undefined` |

### 2. JSON 常见规则

1. 属性名必须使用双引号。
2. 字符串值必须使用双引号。
3. 不能写注释。
4. 不能包含函数和 `undefined`。

### 3. JSON 和 JS 的转换

```js
const data = JSON.parse('{"id":1,"name":"zs"}')
const text = JSON.stringify({ id: 1, name: "zs" })
```

| 过程           | 方法               |
| -------------- | ------------------ |
| **JSON 转 JS** | `JSON.parse()`     |
| **JS 转 JSON** | `JSON.stringify()` |

### 4. 一个高频错误

如果响应结果本来就已经被浏览器或请求库自动转成对象，再手动 `JSON.parse()` 反而会报错。

### 5. JSON 什么时候适合，什么时候不适合

| 场景                       | 是否适合                  |
| -------------------------- | ------------------------- |
| 普通结构化数据提交         | 适合                      |
| 前后端接口统一按 JSON 约定 | 适合                      |
| 文件上传                   | 不适合，通常用 `FormData` |
| 需要保留二进制内容         | 不适合直接用 JSON         |

---

## 四、请求时限和超时控制

网络请求不一定稳定，所以前端通常要考虑超时。

### 1. XHR 超时设置

```js
const xhr = new XMLHttpRequest()

xhr.responseType = "json"
xhr.timeout = 3000

xhr.onload = function () {
  console.log(xhr.response)
}

xhr.ontimeout = function () {
  alert("请求超时，请稍后重试")
}

xhr.open("GET", "/api/books")
xhr.send()
```

### 2. 超时控制真正要解决什么

1. 避免用户长时间无反馈。
2. 给出可理解的提示。
3. 必要时提供重试入口。

### 3. 一个现实边界

超时不一定代表后端宕机，也可能是网络慢、接口阻塞、代理配置问题，或者网关超时。

所以看到超时，第一反应不应该只是“后端坏了”，而应该结合 Network 面板继续排查。

### 4. 超时处理更稳的思路

1. 给用户明确反馈，而不是一直转圈。
2. 判断当前操作是否适合提供重试按钮。
3. 区分“请求失败”和“请求超时”这两类提示。

超时控制的重点不是单纯设一个数字，而是让用户知道当前发生了什么，以及接下来能做什么。

---

## 五、XHR2 新增事件：让请求过程更可观察

XHR2 是对传统 `XMLHttpRequest` 的增强，提供了更丰富的事件和响应控制能力。

### 1. 常见事件

| 事件              | 说明                             |
| ----------------- | -------------------------------- |
| **`onloadstart`** | 请求开始时触发                   |
| **`onprogress`**  | 接收数据过程中触发               |
| **`onload`**      | 请求成功完成时触发               |
| **`onerror`**     | 请求失败时触发                   |
| **`ontimeout`**   | 请求超时时触发                   |
| **`onloadend`**   | 请求结束时触发，不论成功还是失败 |

### 2. 这些事件有什么价值

1. 可以做 loading 提示。
2. 可以做上传 / 下载进度条。
3. 可以在 `onloadend` 里统一收尾。

这部分真正有价值的不是记事件名，而是知道“请求不是只有成功和失败两个瞬间”，它本身也是一个过程。

### 3. 一个实战判断

| 需求               | 更关注               |
| ------------------ | -------------------- |
| 只关心最后结果     | `onload` / `onerror` |
| 想统一关闭 loading | `onloadend`          |
| 想看上传或下载过程 | `onprogress`         |
| 想处理超时         | `ontimeout`          |

---

## 六、XHR2 常用属性

### 1. `response`

用于接收响应结果。

### 2. `responseType`

用于声明期望的响应类型。

| 值                | 说明                 |
| ----------------- | -------------------- |
| **空字符串**      | 默认按文本处理       |
| **`json`**        | 自动把 JSON 转成对象 |
| **`document`**    | 按文档处理           |
| **`blob`**        | 二进制数据           |
| **`arraybuffer`** | 原始二进制缓冲区     |

示例：

```js
const xhr = new XMLHttpRequest()
xhr.responseType = "json"
```

### 3. 一个易错点

如果已经设置 `responseType = "json"`，通常直接读 `xhr.response` 即可，不要再手动 `JSON.parse()`。

---

## 七、FormData：为什么文件上传离不开它

**FormData** 是浏览器提供的一个对象，用来方便地收集和提交表单数据，尤其适合：

1. 普通表单提交。
2. 文件上传。
3. 混合文本和二进制数据一起提交。

一句话理解：

```text
FormData 是浏览器帮你组织 multipart/form-data 请求体的容器。
```

---

## 八、FormData 的基础使用

### 1. 从表单快速创建

```js
const form = document.querySelector("form")
const fd = new FormData(form)
```

### 2. 手动追加和读取

```js
fd.append("age", 20)
fd.set("username", "lisi")
fd.delete("unusedField")

console.log(fd.get("username"))
console.log(fd.getAll("username"))

fd.forEach((value, key) => {
  console.log(key, value)
})
```

### 3. 常见 API

| API             | 作用                 |
| --------------- | -------------------- |
| **`append()`**  | 追加字段             |
| **`set()`**     | 设置或覆盖字段       |
| **`delete()`**  | 删除字段             |
| **`get()`**     | 获取一个字段值       |
| **`getAll()`**  | 获取同名字段的所有值 |
| **`forEach()`** | 遍历所有字段         |

一个重要区别：

- `append()` 更像继续追加。
- `set()` 更像覆盖当前字段。

---

## 九、FormData 配合 XHR 提交

```html
<form id="userForm">
  姓名：<input type="text" name="username" /> 年龄：<input
    type="text"
    name="age"
  />
  <button>提交</button>
</form>
```

```js
document.querySelector("#userForm").onsubmit = function (event) {
  event.preventDefault()

  const fd = new FormData(this)
  const xhr = new XMLHttpRequest()

  xhr.onload = function () {
    console.log(xhr.response)
  }

  xhr.open("POST", "/api/formdata")
  xhr.send(fd)
}
```

### 1. 关键注意事项

1. 通常配合 `POST` 使用。
2. 不要手动设置 `Content-Type`，浏览器会自动补齐边界信息。
3. 表单项最好带 `name`，否则 FormData 无法正常收集该项。

### 2. `FormData` 和其他提交方式怎么选

| 需求                | 更推荐            |
| ------------------- | ----------------- |
| 传统表单字段        | 查询字符串或 JSON |
| 文件上传            | `FormData`        |
| 文本 + 文件混合提交 | `FormData`        |
| 纯结构化接口请求    | JSON              |

---

## 十、FormData 在现代项目中的位置

虽然很多现代项目会用 `fetch` 和 `axios`，但处理文件上传时，底层依然经常配合 `FormData`。

### 1. `fetch` 示例

```js
const fd = new FormData()
fd.append("avatar", fileInput.files[0])

fetch("/api/upload", {
  method: "POST",
  body: fd,
})
```

### 2. 为什么它依然重要

因为“文件上传”这个场景很难绕开它。

也就是说，请求库可以换，但 FormData 这个概念往往还在。

### 3. 一个排查顺序

文件上传不通时，通常先看：

1. 文件对象有没有真的取到。
2. `FormData` 里字段名是否和后端约定一致。
3. 是否错误地手动设置了 `Content-Type`。
4. Network 面板里的请求体和响应信息是否符合预期。

---

## 十一、把这一篇串成一条主线

可以把本篇内容理解成一条请求能力链：

```text
前端为了不阻塞页面，使用异步请求
  -> 请求体和响应体里常用 JSON 交换数据
  -> 为避免长时间无反馈，需要超时控制
  -> 为观察请求过程，可以用 XHR2 事件和属性
  -> 如果涉及文件上传，就要用 FormData 组织请求体
```

这样理解后，这几块内容就不再是零散知识点，而是一组互相连接的请求基础能力。

---

## 十二、小结

| 知识点         | 结论                                       |
| -------------- | ------------------------------------------ |
| **同步与异步** | 前端更适合异步请求，避免页面阻塞           |
| **JSON**       | 是最常见的数据交换格式，要分清它和 JS 对象 |
| **超时控制**   | 用来避免长时间无反馈，不等于后端一定宕机   |
| **XHR2**       | 提供更完整的进度、超时和响应控制能力       |
| **FormData**   | 是处理表单提交和文件上传的核心工具之一     |
