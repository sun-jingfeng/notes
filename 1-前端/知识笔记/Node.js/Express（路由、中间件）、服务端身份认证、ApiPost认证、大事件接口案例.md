# Express（路由、中间件）、服务端身份认证、ApiPost认证、大事件接口案例

## 一、一句话理解

这篇真正要掌握的，不是单独记住 Express、JWT、multer 这些名词，而是理解一个接口请求进入服务端后，会按什么顺序经过路由、中间件、校验、认证、业务处理和统一响应。

---

## 二、什么是 Express

**Express** 是 Node.js 平台上最常见的 Web 开发框架之一，用来快速搭建接口服务和网站后端。

它的核心价值是：在 Node 原生 `http` 模块之上，提供更易维护的路由声明、中间件链路和请求响应封装。

| 对比项         | Node 原生 `http`                | Express                            |
| -------------- | ------------------------------- | ---------------------------------- |
| **使用门槛**   | 更底层，要自己组织很多细节      | 更容易上手                         |
| **路由处理**   | 常靠 `if...else` 或手动解析 URL | 直接声明 `app.get()`、`app.post()` |
| **中间件机制** | 需要自己设计                    | 已形成成熟模式                     |
| **生态**       | 基础能力                        | 第三方中间件丰富                   |

一个最小示例：

```js
const express = require("express")

const app = express()

app.get("/api/test", (req, res) => {
  res.send({ status: 0, message: "success" })
})

app.listen(3006, () => {
  console.log("server running at http://127.0.0.1:3006")
})
```

`res.send()` 的特点：

1. 可以响应字符串。
2. 可以响应对象。
3. 响应对象时会自动转为 JSON。
4. 一次请求只能有一次最终响应。

---

## 三、先建立接口处理主线

学 Express 时最容易碎片化，所以先记住一条最常见的后端处理链：

```text
客户端发请求
  -> 进入全局中间件
  -> 解析请求体
  -> 命中对应路由
  -> 执行参数校验
  -> 执行身份认证
  -> 访问数据库或文件系统
  -> 返回统一响应
  -> 异常交给错误处理中间件
```

后面所有知识点，都是在这条链上找到自己的位置。

---

## 四、路由：决定请求交给谁处理

### 1. 什么是路由

路由就是“请求方法 + 请求地址”和处理函数之间的映射关系。

```js
app.get("/users", handler)
app.post("/login", handler)
```

### 2. 为什么要拆分路由

如果所有接口都堆在入口文件里，项目一大就会失控。

路由拆分的价值：

1. 按业务模块组织接口。
2. 降低主文件复杂度。
3. 便于多人协作。
4. 后续接参数校验、权限控制更方便。

### 3. 使用 `Express.Router()`

```js
// routers/user.js
const express = require("express")
const router = express.Router()

router.get("/userinfo", (req, res) => {
  res.send({ status: 0, message: "获取成功" })
})

module.exports = router
```

```js
// app.js
const express = require("express")
const userRouter = require("./routers/user")

const app = express()

app.use("/my/user", userRouter)
```

最终访问地址会变成 `/my/user/userinfo`。

### 4. 推荐理解方式

- `app.js` 更像总入口和总装配点。
- `routers` 只负责声明路径。
- 真正业务处理建议再拆到 `router_handler` 或 `controller`。

---

## 五、中间件：决定请求路上要经过哪些处理

### 1. 什么是中间件

**中间件** 是请求在到达最终处理函数前，经过的一道道处理环节。

```js
app.use((req, res, next) => {
  console.log("经过全局中间件")
  next()
})
```

`next()` 表示交给下一个中间件或路由处理函数；如果不调用 `next()`，又没有直接响应，请求就会卡住。

### 2. 中间件常见用途

1. 解析请求体。
2. 记录日志。
3. 身份认证。
4. 参数校验。
5. 权限控制。
6. 错误统一处理。

### 3. 中间件分类

| 类型               | 说明                                        |
| ------------------ | ------------------------------------------- |
| **应用级中间件**   | 用 `app.use()` 注册，全局或按前缀生效       |
| **路由级中间件**   | 只在某组路由里生效                          |
| **内置中间件**     | 如 `express.json()`、`express.urlencoded()` |
| **第三方中间件**   | 如 `cors`、`multer`、`express-jwt`          |
| **错误处理中间件** | 专门统一处理异常                            |

### 4. 学中间件时最重要的判断

一个逻辑如果是“多个接口都要执行的通用步骤”，就应该优先考虑中间件，而不是在每个接口里复制一遍。

### 5. 中间件链路排错时先看什么

1. 当前中间件有没有真的被注册到正确位置。
2. `next()` 有没有在该放行时放行。
3. 有没有中间件提前响应，导致后续逻辑根本没执行。
4. 错误有没有被统一错误处理中间件接住。

---

## 六、请求体解析：先把参数读出来

常见接口请求体主要有三类：

| 数据类型     | 常见 Content-Type                   | 处理方式               |
| ------------ | ----------------------------------- | ---------------------- |
| **表单编码** | `application/x-www-form-urlencoded` | `express.urlencoded()` |
| **JSON**     | `application/json`                  | `express.json()`       |
| **文件上传** | `multipart/form-data`               | `multer`               |

### 1. 解析表单编码

```js
app.use(express.urlencoded({ extended: false }))
```

### 2. 解析 JSON

```js
app.use(express.json())
```

注册后就可以通过 `req.body` 读取参数。

常见误区：

- 前端发的是 JSON，但后端没注册 `express.json()`。
- 前端发的是文件上传，却还想用 `req.body` 直接拿文件。

### 3. 一个现实判断

| 前端传什么 | 后端优先准备什么       |
| ---------- | ---------------------- |
| JSON       | `express.json()`       |
| 普通表单   | `express.urlencoded()` |
| 文件上传   | `multer` 等上传中间件  |

---

## 七、统一错误处理：不要让每个接口各管各的

错误处理中间件必须写成 4 个参数：

```js
app.use((err, req, res, next) => {
  res.status(500).send({
    status: 1,
    message: err.message,
  })
})
```

使用原则：

1. 参数必须是 `(err, req, res, next)`。
2. 通常放在所有路由后面。
3. 统一响应格式，避免每个接口单独拼错误返回。

实际意义不是“少写几行代码”，而是让前端收到的错误格式稳定，便于统一处理。

### 1. 一个更完整的边界意识

统一错误处理解决的是“返回格式一致”和“异常集中收口”，但它不能替代参数校验、权限校验和业务兜底。

---

## 八、服务端身份认证主线

### 1. 登录注册要解决什么问题

本质是两件事：

1. 怎么安全地保存用户密码。
2. 怎么在后续请求里识别“当前是谁”。

### 2. 注册接口典型流程

```text
接收 username、password
  -> 校验格式
  -> 检查用户名是否已存在
  -> 密码做哈希
  -> 入库
  -> 返回注册结果
```

### 3. 登录接口典型流程

```text
接收 username、password
  -> 查用户
  -> 校验密码
  -> 生成 token
  -> 返回给前端
```

### 4. 认证和授权不要混为一谈

| 概念 | 回答的问题           |
| ---- | -------------------- |
| 认证 | 你是谁               |
| 授权 | 你能不能操作这个资源 |

JWT 通过通常只说明“身份大体可信”，不代表这个用户就一定有权访问任意资源。

---

## 九、密码为什么必须加密

明文密码一旦泄漏，风险就是直接暴露，不存在缓冲空间。

现代实践里，旧教程常提到 `md5`，但更推荐使用 `bcrypt` 或 `argon2`。在当前这类入门项目中，`bcryptjs` 很常见。

```bash
npm install bcryptjs
```

```js
const bcrypt = require("bcryptjs")

const hashedPassword = bcrypt.hashSync(password, 10)
const compareResult = bcrypt.compareSync(password, hashedPassword)
```

记忆方式：

- 注册时：原始密码 -> 哈希 -> 入库
- 登录时：原始密码和哈希密码做比较

---

## 十、JWT 认证：解决“后续请求怎么识别当前用户”

### 1. 基本流程

```text
用户登录成功
  -> 服务端生成 token
  -> 前端保存 token
  -> 访问受保护接口时携带 token
  -> 服务端验证 token
  -> 验证通过后继续执行业务逻辑
```

### 2. 生成 token

```bash
npm install jsonwebtoken
```

```js
const jwt = require("jsonwebtoken")

const token = jwt.sign({ id: user.id, username: user.username }, "secretKey", {
  expiresIn: "2h",
})
```

响应给前端时常见写法：

```js
res.send({
  status: 0,
  message: "登录成功",
  token: "Bearer " + token,
})
```

### 3. 验证 token

```bash
npm install express-jwt
```

```js
const { expressjwt: jwtMiddleware } = require("express-jwt")

app.use(
  jwtMiddleware({
    secret: "secretKey",
    algorithms: ["HS256"],
  }).unless({
    path: ["/api/login", "/api/reguser"],
  }),
)
```

验证成功后，解析结果通常挂到 `req.auth` 上。

### 4. token 错误统一处理

```js
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).send({
      status: 1,
      message: "身份认证失败",
    })
    return
  }

  next(err)
})
```

JWT 这部分最容易混淆的是：

- 登录接口本身一般不需要 token。
- 受保护接口才需要 token。
- token 通过不等于业务权限也一定合法，还要继续看资源归属。

### 5. 一个现代补充

标题里提到的 `ApiPost认证` 和具体“大事件接口案例”，更适合理解成“调试工具和练习项目场景”，不要把它们当成服务端认证本身的核心知识点。

真正稳定的主线始终是：路由组织、中间件链、密码哈希、token 校验、统一错误处理。

---

## 十一、参数校验和权限校验不是一回事

后端必须校验数据，不能相信前端传来的内容。

### 1. 参数校验关注什么

1. 用户名格式是否合法。
2. 密码长度是否符合要求。
3. 必填参数是否缺失。
4. 类型是否正确。

### 2. 权限校验关注什么

1. 当前用户是否已登录。
2. 当前资源是否属于当前用户。
3. 当前用户有没有执行该操作的权限。

一个简单的路由级校验中间件：

```js
router.use((req, res, next) => {
  const { username, password } = req.body

  if (!/^[a-zA-Z][0-9a-zA-Z_]{1,9}$/.test(username)) {
    next(new Error("用户名格式不正确"))
    return
  }

  if (!/^\S{6,12}$/.test(password)) {
    next(new Error("密码格式不正确"))
    return
  }

  next()
})
```

---

## 十二、CORS：解决浏览器跨域访问

前后端分离开发时，前端和后端通常不是同一个端口，这会触发浏览器同源策略。

最常见的处理方式是服务端开启 CORS。

```bash
npm install cors
```

```js
const cors = require("cors")
app.use(cors())
```

一般放在靠前的位置注册。

注意：CORS 解决的是浏览器发请求时的跨域限制，不是服务端登录认证问题，两者不要混淆。

---

## 十三、文件上传：为什么要用 `multer`

“文章封面上传”这种场景，通常提交的是 `multipart/form-data`，普通的 `express.json()` 和 `express.urlencoded()` 都不够，需要 `multer` 来解析。

```bash
npm install multer
```

```js
const multer = require("multer")
const upload = multer({ dest: "uploads/" })

router.post("/add", upload.single("cover_img"), (req, res) => {
  console.log(req.body)
  console.log(req.file)

  res.send({ status: 0, message: "上传成功" })
})
```

| 对象        | 含义           |
| ----------- | -------------- |
| `req.body`  | 普通文本字段   |
| `req.file`  | 单文件上传信息 |
| `req.files` | 多文件上传信息 |

---

## 十四、“大事件”案例为什么适合练手

像资讯后台、博客后台这类项目，能把 Express 的常见能力串成一条完整业务链。

常见模块：

1. 登录注册模块。
2. 用户信息模块。
3. 分类管理模块。
4. 文章管理模块。

推荐结构：

```text
project/
  app.js
  config.js
  db/
    index.js
  routers/
    api.js
    userinfo.js
    article.js
    category.js
  router_handler/
    api.js
    userinfo.js
    article.js
    category.js
  middleware/
    validate.js
  uploads/
```

这种拆分的核心思想：

1. `routers` 只声明路由。
2. `router_handler` 只放业务逻辑。
3. 公共逻辑尽量抽到中间件。

---

## 十五、认证闭环示例

### 1. 注册接口

```js
router.post("/reguser", async (req, res) => {
  const { username, password } = req.body

  // 1. 校验用户名是否重复
  // 2. 对密码做 bcrypt 哈希
  // 3. 写入数据库

  res.send({
    status: 0,
    message: "注册成功",
  })
})
```

### 2. 登录接口

```js
router.post("/login", async (req, res) => {
  const { username, password } = req.body

  // 1. 查询用户
  // 2. 比较密码
  // 3. 生成 token

  const token =
    "Bearer " +
    jwt.sign({ username }, "secretKey", {
      expiresIn: "2h",
    })

  res.send({
    status: 0,
    message: "登录成功",
    token,
  })
})
```

### 3. 受保护接口

```js
router.get("/userinfo", (req, res) => {
  res.send({
    status: 0,
    message: "获取成功",
    data: req.auth,
  })
})
```

这个闭环说明：认证不是一个接口，而是一条持续生效的链路。

---

## 十六、文章模块为什么更能体现综合能力

文章新增接口往往同时涉及：

1. 文本字段。
2. 富文本内容。
3. 分类 ID。
4. 封面图片上传。
5. 当前登录用户身份。

典型处理顺序：

```text
接收 multipart/form-data
  -> multer 解析文件
  -> 校验标题 / 分类 / 内容
  -> 处理封面路径
  -> 结合当前登录用户 id 入库
  -> 返回新增结果
```

常见接口：

| 接口                                | 作用         |
| ----------------------------------- | ------------ |
| **`GET /my/article/cates`**         | 获取文章分类 |
| **`POST /my/article/addcates`**     | 新增文章分类 |
| **`POST /my/article/add`**          | 新增文章     |
| **`GET /my/article/list`**          | 获取文章列表 |
| **`GET /my/article/:id`**           | 获取文章详情 |
| **`DELETE /my/article/delete/:id`** | 删除文章     |

这里最容易漏掉的是权限校验和软删除策略。

---

## 十七、ApiPost / Postman 应该怎么调

ApiPost、Postman 这类工具的意义，不只是“能发请求”，而是帮你把前后端链路分步骤验证清楚。

### 1. Bearer Token 调试

接口使用 Bearer Token 时，常见请求头写法：

```http
Authorization: Bearer xxxxxxx
```

### 2. 推荐调试顺序

1. 先测注册。
2. 再测登录。
3. 拿到 token 后测受保护接口。
4. 再测分类模块。
5. 最后测文章和文件上传模块。

为什么这样更稳：越往后的接口依赖越多，前面没通，后面会一起报错，排查成本更高。

---

## 十八、接口设计建议

### 1. 统一返回结构

```js
res.send({
  status: 0,
  message: "操作成功",
  data: result,
})
```

### 2. 优先使用参数化 SQL

不要直接字符串拼接 SQL，避免注入风险。

### 3. 资源权限要校验

例如修改用户信息、删除文章时，要确认该资源是否属于当前登录用户。

### 4. 删除操作优先考虑软删除

例如文章删除时，把 `is_delete` 改成 `1`，而不是直接物理删除。

---

## 十九、小结

| 知识点                 | 结论                                             |
| ---------------------- | ------------------------------------------------ |
| **Express 的核心价值** | 用更清晰的路由和中间件组织后端接口               |
| **中间件的作用**       | 把通用处理插入请求链路                           |
| **身份认证主线**       | 注册、加密、登录、签发 token、校验 token         |
| **大事件案例的价值**   | 能把路由、中间件、认证、上传、数据库串成完整闭环 |
| **学习重点**           | 不只是会写语法，而是理解一条完整接口链如何落地   |
