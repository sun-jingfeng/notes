# Node.js核心模块与APIs

## 一、先理解运行环境

很多初学者会把 JavaScript 当成一整套固定能力，但实际上，JavaScript 语言本身和“运行环境提供的 API”是两回事。

浏览器环境中的 JavaScript 可以理解为两部分：

| 部分       | 说明                                                               |
| ---------- | ------------------------------------------------------------------ |
| ECMAScript | 语言核心语法，例如变量、函数、对象、数组、类等                     |
| Web APIs   | 浏览器提供的能力，例如 DOM、BOM、`fetch`、`localStorage`、`canvas` |

也就是说，JavaScript 语言本身只负责语法，而“能不能操作页面、发请求、操作浏览器窗口”取决于运行环境提供了什么 API。

---

## 二、浏览器和 Node 的区别

浏览器和 Node 都可以运行 JavaScript，但两者可用的 API 并不相同。

| 对比项   | 浏览器              | Node                         |
| -------- | ------------------- | ---------------------------- |
| 主要定位 | 客户端运行环境      | 服务端 / 本地运行环境        |
| 共同点   | 都能执行 ECMAScript | 都能执行 ECMAScript          |
| 特有能力 | DOM、BOM、页面渲染  | 文件系统、网络服务、进程能力 |

一个最关键的结论：

1. `document`、`window` 这类 API 只能在浏览器环境中使用。
2. `fs`、`path`、`http` 这类模块只能在 Node 环境中使用。

### 2.2 真实开发里怎么快速判断代码该放哪边

| 需求                           | 更适合     |
| ------------------------------ | ---------- |
| 操作页面、读 DOM、监听用户交互 | 浏览器环境 |
| 读写文件、起本地服务、跑脚本   | Node 环境  |
| 构建工具、脚手架、代码生成     | Node 环境  |

### 2.1 为什么前端也要学 Node

因为现代前端开发除了写页面，还会依赖：

1. 构建工具。
2. 脚手架。
3. 本地开发服务。
4. 自动化脚本。

这些场景大多都建立在 Node 之上。

---

## 三、什么是 Node.js

Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境。

它让 JavaScript 不再只能跑在浏览器里，还可以运行在服务端、本地脚本和命令行工具中。

### 3.1 Node.js 常见用途

1. 编写后端服务。
2. 编写构建工具、脚手架、CLI。
3. 读写文件和批处理脚本。
4. 支撑前端工程化工具链，例如 Vite、Webpack、ESLint、npm scripts。

### 3.2 一个实战理解

如果浏览器更偏“页面运行环境”，那 Node 更偏“工程和服务运行环境”。

---

## 四、在 Node 环境中运行 JavaScript

### 4.1 REPL 交互模式

在终端输入：

```bash
node
```

进入后可以直接写 JavaScript 表达式：

```js
1 + 2
```

适合做简单测试。

### 4.2 脚本模式

把代码写到文件中，例如 `index.js`：

```js
console.log("hello node")
```

终端执行：

```bash
node index.js
```

这才是更常见的工作方式。

---

## 五、Node 中的模块化

在 Node 中，每个文件都可以看成一个模块。

### 5.1 模块分类

| 类型       | 说明          | 示例                 |
| ---------- | ------------- | -------------------- |
| 自定义模块 | 自己写的文件  | `./utils.js`         |
| 内置模块   | Node 自带     | `fs`、`path`、`http` |
| 第三方模块 | 通过 npm 安装 | `express`、`axios`   |

### 5.2 导出与导入

```js
// utils.js
function add(a, b) {
  return a + b
}

module.exports = {
  add,
}
```

```js
// index.js
const utils = require("./utils")

console.log(utils.add(1, 2))
```

### 5.3 `require` 的使用规则

1. 加载自定义模块时必须写路径，如 `./utils`。
2. 加载内置模块时直接写模块名，如 `require("fs")`。
3. 加载第三方模块前必须先安装。

---

## 六、`fs` 模块

`fs` 是 file system 的缩写，用于操作文件和目录。

```js
const fs = require("fs")
```

### 6.1 `fs.readFile()`

```js
fs.readFile("./test.txt", "utf8", (err, dataStr) => {
  if (err) {
    console.log("读取失败：" + err.message)
    return
  }

  console.log("读取成功：", dataStr)
})
```

### 6.2 `fs.writeFile()`

```js
fs.writeFile("./demo.txt", "hello node", "utf8", err => {
  if (err) {
    console.log("写入失败：" + err.message)
    return
  }

  console.log("写入成功")
})
```

### 6.3 学 `fs` 的重点

1. 路径是否正确。
2. 编码是否明确写了 `utf8`。
3. 写文件会不会覆盖原内容。

如果把 `fs` 用在前端工具脚本里，它常见于：读配置、写产物、批量处理文件。

### 6.4 一个实践提醒

读写文件问题排查时，通常先看三件事：

1. 当前工作目录和相对路径是不是你以为的那个位置。
2. 文件是否真的存在，权限是否足够。
3. 是否误把异步回调里的错误忽略掉了。

---

## 七、`path` 模块

`path` 用于处理路径字符串，适合解决路径拼接和跨平台兼容问题。

```js
const path = require("path")
```

### 7.1 `path.join()`

```js
const filePath = path.join(__dirname, "./files", "a.txt")
console.log(filePath)
```

作用：把多个路径片段拼接成完整路径。

### 7.2 `path.basename()`

```js
const fullPath = "/Users/demo/index.html"

console.log(path.basename(fullPath))
console.log(path.basename(fullPath, ".html"))
```

### 7.3 `path.extname()`

```js
console.log(path.extname("index.html"))
```

### 7.4 为什么不要手写字符串拼路径

因为不同系统路径分隔符可能不同，直接拼字符串容易埋下兼容性问题。

---

## 八、`querystring` 模块

`querystring` 用于处理 URL 查询参数字符串。

```js
const querystring = require("querystring")
```

### 8.1 `querystring.parse()`

```js
const qs = "name=zs&age=20&city=beijing"
const obj = querystring.parse(qs)

console.log(obj)
```

### 8.2 `querystring.stringify()`

```js
const str = querystring.stringify({
  name: "zs",
  age: 20,
})

console.log(str)
```

### 8.3 一个补充认知

现代项目中也常会使用 `URLSearchParams` 处理查询参数，但 `querystring` 仍然是理解 Node 经典写法的重要基础。

### 8.4 `querystring` 和 `URLSearchParams` 怎么看

| 场景                      | 更常见            |
| ------------------------- | ----------------- |
| 看老 Node 教程和历史代码  | `querystring`     |
| 新代码里处理 URL 查询参数 | `URLSearchParams` |

---

## 九、`http` 模块

`http` 模块可以创建 Web 服务器。

```js
const http = require("http")

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8")
  res.end("hello node")
})

server.listen(3000, () => {
  console.log("server running at http://127.0.0.1:3000")
})
```

### 9.1 `http` 模块能做什么

1. 接收请求。
2. 返回响应。
3. 处理路径和方法。

### 9.2 为什么现代业务很少直接裸写 `http`

因为真实项目通常会继续使用 `express`、`koa`、`nest` 这类框架来组织路由、中间件和错误处理。

但学 `http` 模块的价值在于理解服务端最基础的请求响应模型。

### 9.3 一个选择标准

1. 学底层请求响应模型，用 Node 原生 `http`。
2. 快速搭接口、做中间件链、组织业务服务，更常用 Express / Koa 等框架。

---

## 十、这几块知识怎么串起来

可以用下面这条主线理解：

```text
先分清浏览器环境和 Node 环境
再理解 Node 是一个运行时
再理解 Node 通过模块提供文件、路径、查询字符串、网络服务等能力
```

如果这条主线没建立起来，后面学工程化、CLI、服务端开发时会很容易混乱。

---

## 十一、小结

1. JavaScript 语言本身只是一套语法，真正决定能力边界的是运行环境。
2. 浏览器擅长页面交互和渲染，Node 擅长文件、服务、脚本和工程化能力。
3. `fs`、`path`、`querystring`、`http` 分别解决文件、路径、查询参数和基础网络服务问题。
4. 学这一篇时，重点不是把模块 API 全背下来，而是理解“为什么这些能力只在 Node 环境里存在”。
5. 这篇本质上是在帮你建立浏览器前端和 Node 运行时之间的边界意识。

### 12.3 一个重要注意点

`res.end()` 通常要放在最后；做出响应后，不能再继续设置响应头或多次结束响应。

---

## 十三、搭建一个简单静态服务器

如果把 `http`、`fs`、`path` 串起来，就可以实现最基础的静态资源服务。

```js
const http = require("http")
const fs = require("fs")
const path = require("path")

const server = http.createServer()

server.on("request", (req, res) => {
  const url = req.url === "/" ? "/index.html" : req.url
  const filePath = path.join(__dirname, url)

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 404
      res.end("404 Not Found")
      return
    }

    res.end(data)
  })
})

server.listen(3000)
```

### 13.1 这个示例体现了什么

1. `http` 负责接收请求。
2. `req.url` 决定要读取哪个文件。
3. `path.join()` 负责安全拼路径。
4. `fs.readFile()` 负责把文件内容读出来。
5. `res.end()` 把内容返回给客户端。

这其实就是很多 Web 框架底层能力的简化版。

---

## 十四、学习路径建议

如果是前端转 Node，可以按这个顺序学：

1. Node 是什么，和浏览器环境有什么区别。
2. 会用终端运行脚本。
3. 掌握模块化和 `require`。
4. 学会 `fs` 和 `path`。
5. 理解 `http` 服务的基本工作方式。
6. 再进入 Express、数据库和身份认证。

---

## 十五、小结

1. 浏览器和 Node 都能执行 JavaScript，但提供的 API 完全不同。
2. Node.js 让 JavaScript 可以运行在服务端和命令行环境中。
3. `fs` 用来操作文件，`path` 用来处理路径，`querystring` 用来处理查询字符串，`http` 用来创建服务器。
4. `req` 负责拿请求信息，`res` 负责组织响应结果。
5. 把 `http`、`fs`、`path` 串起来后，就能理解一个最基础的静态服务器是怎么工作的。
6. 理解 Node 的模块化和内置模块，是继续学习 npm、Express 和工程化工具链的前提。
