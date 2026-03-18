# Ajax请求与表单提交流程

## 一、这篇的主线

这一篇把传统 Ajax 场景里几组常见知识放在一起，真正主线其实是：

```text
表单收集数据
  -> 把数据整理成请求参数
  -> 通过 Ajax 发给服务器
  -> 理解底层 XHR 的执行过程
```

所以这篇不是单纯堆 API，而是在串起“表单提交到异步请求”的完整链路。

---

## 二、`$.ajaxPrefilter()`

`$.ajaxPrefilter()` 用于在 jQuery Ajax 请求真正发出前，统一拦截并修改请求配置。

### 2.1 常见用途

| 用途           | 说明                            |
| -------------- | ------------------------------- |
| 统一加基础地址 | 给所有请求拼接 API 前缀         |
| 统一加 token   | 给请求头或参数加认证信息        |
| 统一改配置     | 修改 `dataType`、超时、跨域选项 |

```js
$.ajaxPrefilter(function (options) {
  options.url = "https://api.example.com" + options.url
})
```

### 2.2 一个常见实战场景

```js
$.ajaxPrefilter(function (options) {
  options.url = "https://api.example.com" + options.url

  if (options.url.includes("/my/")) {
    options.headers = {
      Authorization: localStorage.getItem("token") || "",
    }
  }
})
```

### 2.3 什么时候用它

当项目里存在大量 jQuery Ajax 请求，而且这些请求有统一前缀、统一认证、统一错误处理需求时，`ajaxPrefilter` 很省事。

### 2.4 注意点

1. 它必须写在被影响的 Ajax 请求之前。
2. 它改的是请求配置对象，不是请求结果。
3. 多个地方都在改同一字段时，后面的逻辑可能覆盖前面的逻辑。

### 2.5 真实开发里怎么判断该不该用 `ajaxPrefilter`

| 场景                                               | 是否适合       |
| -------------------------------------------------- | -------------- |
| 老项目里大量 `$.ajax()` 需要统一补基础地址或 token | 适合           |
| 只想给某一个接口临时改配置                         | 不太适合       |
| 现代项目已经有统一请求封装层                       | 通常交给封装层 |

`ajaxPrefilter` 的价值主要在 jQuery 时代的“全局拦截改配置”。如果项目已经有更高层的请求封装，就不要把同一套统一逻辑分散到两个入口里。

---

## 三、表单、按钮和序列化

### 3.1 `form` 标签

`form` 用于定义表单提交范围。

| 属性      | 说明                               |
| --------- | ---------------------------------- |
| `action`  | 提交地址，默认空时通常提交到当前页 |
| `method`  | 提交方式，如 `get`、`post`         |
| `enctype` | 提交编码类型                       |
| `target`  | 提交结果打开位置                   |

### 3.2 常见表单域

| 控件       | 写法                        |
| ---------- | --------------------------- |
| 单行文本框 | `<input type="text" />`     |
| 密码框     | `<input type="password" />` |
| 单选按钮   | `<input type="radio" />`    |
| 复选框     | `<input type="checkbox" />` |
| 隐藏域     | `<input type="hidden" />`   |
| 文件域     | `<input type="file" />`     |
| 下拉框     | `<select></select>`         |
| 文本域     | `<textarea></textarea>`     |

### 3.3 按钮类型

| 类型     | 默认行为                 |
| -------- | ------------------------ |
| `button` | 普通按钮，无默认提交行为 |
| `reset`  | 重置表单                 |
| `submit` | 提交表单                 |

一个常见坑：`<button>` 如果不写 `type`，在表单里通常会默认当作提交按钮。

所以当按钮只是打开弹窗或触发校验时，最好显式写成：

```html
<button type="button">打开弹窗</button>
```

### 3.4 `serialize()` 和 `serializeArray()`

```js
$("form").serialize()
$("form").serializeArray()
```

| 方法               | 返回结果   |
| ------------------ | ---------- |
| `serialize()`      | 查询字符串 |
| `serializeArray()` | 对象数组   |

### 3.5 使用前提和边界

1. 通常要有 `form` 标签。
2. 表单控件必须有 `name`。
3. `disabled` 元素会被忽略。
4. 文件上传不适合靠 `serialize()`，而是要用 `FormData`。

### 3.6 怎么选

1. 想直接拼到 URL 或请求体里，用 `serialize()`。
2. 想进一步自己处理数据结构，用 `serializeArray()`。

### 3.7 `serialize()`、JSON、`FormData` 怎么分工

| 需求                         | 更推荐                |
| ---------------------------- | --------------------- |
| 传统表单字段、查询字符串提交 | `serialize()`         |
| 想转成对象再加工             | `serializeArray()`    |
| 前后端明确按 JSON 接口交互   | 手动整理对象后转 JSON |
| 含文件上传                   | `FormData`            |

很多人一开始会把“表单收集方式”和“请求体格式”混在一起。其实它们是两层问题：先决定数据怎么收集，再决定最终按什么格式发给服务器。

---

## 四、HTTP 请求参数的基本认识

HTTP 是客户端和服务器之间进行数据传输的协议。

| 部分            | 说明                           |
| --------------- | ------------------------------ |
| 请求行 / 响应行 | 描述请求方式、状态码等核心信息 |
| 请求头 / 响应头 | 补充元信息                     |
| 请求体 / 响应体 | 传输具体数据                   |

### 4.1 请求参数和请求体

| 请求方式 | URL 参数 | 请求体     |
| -------- | -------- | ---------- |
| GET      | 常用     | 一般没有   |
| POST     | 可有可无 | 常用       |
| PUT      | 可有可无 | 常用       |
| DELETE   | 常见     | 有时也可有 |

一个基础理解：

1. GET 常把参数拼在 URL 后面。
2. POST 更常把参数放在请求体里。

---

## 五、`XMLHttpRequest` 是什么

`XMLHttpRequest` 是浏览器提供的原生对象，是传统 Ajax 的核心。

`$.ajax()`、`$.get()`、`$.post()` 的底层本质上也是对它的封装。

### 5.1 一条完整请求链路

```text
创建 XHR 对象
  -> 注册回调
  -> open() 初始化请求
  -> send() 发送请求
  -> 接收响应
```

### 5.2 为什么还要学 XHR

现代项目里很多地方会直接用 `fetch` 或更高层封装，但理解 XHR 仍然有价值，因为它能帮助你理解 Ajax 的底层模型和很多旧项目代码。

---

## 六、XHR 发起 GET 和 POST 请求

### 6.1 GET 请求

```js
const xhr = new XMLHttpRequest()

xhr.onload = function () {
  console.log(xhr.responseText)
}

xhr.open("GET", "/api/getbooks?id=1&bookname=西游记")
xhr.send()
```

GET 请求通常把参数拼到 URL 后，所以参数中如果有中文、空格、`&` 等特殊字符，要考虑 URL 编码。

### 6.2 POST 请求

```js
const xhr = new XMLHttpRequest()

xhr.onload = function () {
  console.log(xhr.responseText)
}

xhr.open("POST", "/api/addbook")
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
xhr.send("bookname=西游记&author=吴承恩")
```

POST 相比 GET，常常多了两件事：

1. 设置请求头。
2. 把参数放进 `send()` 的请求体里。

### 6.3 常见 `Content-Type`

| 值                                  | 说明                               |
| ----------------------------------- | ---------------------------------- |
| `application/x-www-form-urlencoded` | 查询字符串格式                     |
| `application/json`                  | JSON 字符串                        |
| `multipart/form-data`               | 表单和文件上传，通常浏览器自动处理 |

### 6.4 XHR、jQuery Ajax、`fetch` 怎么理解关系

可以把它们看成三层：

```text
XMLHttpRequest：浏览器原生底层能力
  ↓
jQuery Ajax：对 XHR 的老牌封装
  ↓
fetch / axios / 自定义请求层：更现代的调用方式
```

学 XHR 的重点不是为了在新项目里大量手写它，而是为了看懂传统 Ajax 代码，以及理解请求底层到底发生了什么。

---

## 七、URL 编码

### 7.1 为什么要编码

URL 中如果直接出现中文、空格、`&` 等特殊字符，可能产生歧义或乱码问题。

```text
bookname=红&黑
```

这里的 `&` 会被错误识别成参数分隔符。

### 7.2 编码与解码

```js
const encoded = encodeURIComponent("西游记")
const decoded = decodeURIComponent(encoded)
```

| 方法                   | 作用     |
| ---------------------- | -------- |
| `encodeURIComponent()` | 编码参数 |
| `decodeURIComponent()` | 解码参数 |

### 7.3 一个实用判断

只要数据会进入 URL 或查询字符串，而且可能含有特殊字符，就应该考虑编码。

---

## 八、`readyState` 和请求阶段

`readyState` 用于描述 XHR 请求当前所处的阶段。

| 值  | 含义                            |
| --- | ------------------------------- |
| 0   | XHR 已创建，但还没调用 `open()` |
| 1   | 已调用 `open()`                 |
| 2   | 已调用 `send()`，并收到响应头   |
| 3   | 正在接收响应体                  |
| 4   | 请求完成                        |

### 8.1 典型写法

```js
const xhr = new XMLHttpRequest()

xhr.onreadystatechange = function () {
  if (xhr.readyState === 4) {
    if (xhr.status >= 200 && xhr.status < 300) {
      console.log(xhr.responseText)
    } else {
      console.log("请求失败")
    }
  }
}

xhr.open("GET", "/api/demo")
xhr.send()
```

### 8.2 `onreadystatechange` 和 `onload`

| 写法                 | 特点                         |
| -------------------- | ---------------------------- |
| `onreadystatechange` | 可观察全过程                 |
| `onload`             | 更简单，常用于成功完成后处理 |

### 8.3 一个判断标准

1. 只关心请求完成结果，用 `onload` 更简单。
2. 需要理解或观察完整状态流转，用 `onreadystatechange`。

### 8.4 排查传统 Ajax 请求时的顺序

1. 先确认请求有没有真的发出去。
2. 再看 URL、请求方法、请求头和请求体是否符合预期。
3. 再看 `readyState` 是否走到 `4`，以及 `status` 是否在成功区间。
4. 最后再判断是前端参数问题、跨域问题，还是后端响应格式问题。

传统 XHR 最容易让人卡住的地方，不是 API 不会写，而是状态流和网络面板没有一起看。

---

## 九、手写一个简化版 `ajax()`

如果把这一篇继续往下走，一个自然问题就是：jQuery 的 `$.ajax()` 底层思路到底是什么。

### 9.1 目标调用方式

```js
ajax({
  type: "GET",
  url: "/api/books",
  data: { id: 1 },
  success(res) {
    console.log(res)
  },
})
```

### 9.2 先把对象参数转成查询字符串

```js
function objectToQueryString(obj) {
  const arr = []

  for (const key in obj) {
    arr.push(`${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
  }

  return arr.join("&")
}
```

### 9.3 再实现简化版 `ajax`

```js
function ajax(option) {
  const type = (option.type || "GET").toUpperCase()
  const params = objectToQueryString(option.data || {})
  const xhr = new XMLHttpRequest()

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        const text = xhr.responseText
        const result = option.dataType === "json" ? JSON.parse(text) : text

        option.success && option.success(result)
      }
    }
  }

  if (type === "GET") {
    const fullUrl = params ? `${option.url}?${params}` : option.url
    xhr.open("GET", fullUrl)
    xhr.send()
    return
  }

  xhr.open("POST", option.url)
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
  xhr.send(params)
}
```

### 9.4 这个简化版说明了什么

一个 Ajax 封装的核心无非是：

1. 统一参数格式。
2. 统一请求方式分支。
3. 统一回调触发逻辑。
4. 统一成功与失败处理。

---

## 十、小结

1. 这篇真正主线是“表单收集数据 -> 组织参数 -> 发起 Ajax 请求 -> 理解底层 XHR 状态流”。
2. `serialize()` 适合普通表单字段收集，不适合文件上传；文件上传应想到 `FormData`。
3. `$.ajaxPrefilter()` 适合统一改写 jQuery 请求配置，XHR 则帮助理解原生请求过程。
4. `readyState`、`status`、`Content-Type`、URL 编码，是传统 Ajax 最关键的几组概念。
5. 手写一遍简化版 `ajax()`，比单纯背 API 更能帮助你真正理解 Ajax 封装的底层思路。
