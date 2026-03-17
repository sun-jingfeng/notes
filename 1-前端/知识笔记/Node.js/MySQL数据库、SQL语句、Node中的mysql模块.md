# MySQL数据库、SQL语句、Node中的mysql模块

## 一、这篇的主线

这一篇真正的主线是数据如何从接口流到数据库，再从数据库流回接口响应：

```text
接收请求 -> 执行 SQL -> 获得结果 -> 返回给前端
```

所以数据库概念、SQL 语句、Node 连接 MySQL 这三块知识，本质上是一条链路的不同层次。

---

## 二、什么是数据库和 MySQL

数据库是用于持久化保存、组织和查询数据的系统。

在业务开发里，用户、订单、文章、评论这类结构化数据，通常都会放进数据库中管理。

MySQL 是最常见的关系型数据库之一，它用“数据库 -> 表 -> 行 -> 列”的方式组织数据。

```text
数据库服务器
  -> 数据库
    -> 数据表
      -> 行（记录）
      -> 列（字段）
```

### 2.1 为什么前端 / Node 学习里经常接触它

因为它足够常见，生态成熟，也很适合作为全栈入门项目的数据存储方案。

---

## 三、SQL 是什么

SQL 是操作关系型数据库的语言。

### 3.1 SQL 能做什么

1. 查询数据。
2. 插入数据。
3. 更新数据。
4. 删除数据。
5. 创建数据库和表。

### 3.2 CRUD 对应关系

| 缩写   | 含义 | 对应操作 |
| ------ | ---- | -------- |
| Create | 新增 | `INSERT` |
| Read   | 查询 | `SELECT` |
| Update | 修改 | `UPDATE` |
| Delete | 删除 | `DELETE` |

一个重要认知：图形化工具只是操作界面，真正执行数据操作的仍然是 SQL 和数据库服务本身。

---

## 四、常见 SQL 语句

### 4.1 查询 `SELECT`

```sql
SELECT username, age FROM student;
SELECT * FROM student WHERE age >= 18;
SELECT * FROM student ORDER BY age DESC;
SELECT * FROM student LIMIT 0, 10;
```

### 4.2 新增 `INSERT`

```sql
INSERT INTO student (username, age, sex)
VALUES ('李青', 30, '男');
```

### 4.3 修改 `UPDATE`

```sql
UPDATE student
SET age = 20, sex = '女'
WHERE id = 11;
```

### 4.4 删除 `DELETE`

```sql
DELETE FROM student WHERE id = 11;
```

### 4.5 最重要的注意点

更新和删除如果不带 `WHERE`，往往会影响整张表。

### 4.6 一个实战提醒

初学时不要只背语法，更要形成习惯：每次写 `UPDATE` 和 `DELETE`，先检查条件是不是明确。

---

## 五、表结构的基础理解

```sql
CREATE TABLE student (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(20) NOT NULL,
  age INT,
  sex VARCHAR(1),
  tel VARCHAR(20)
);
```

| 字段属性         | 作用                   |
| ---------------- | ---------------------- |
| `PRIMARY KEY`    | 主键，唯一标识一条记录 |
| `AUTO_INCREMENT` | 自动递增               |
| `NOT NULL`       | 不允许为空             |
| `VARCHAR(20)`    | 最多 20 个字符的字符串 |

设计字段时至少考虑：

1. 字段名是否清晰。
2. 数据类型是否合适。
3. 是否允许为空。
4. 是否需要主键和索引。

---

## 六、Node 为什么要连接 MySQL

数据库只是存着数据，真正对外提供接口的是后端程序。

所以 Node 服务通常要完成这样一条链路：

```text
接收请求 -> 执行 SQL -> 得到数据库结果 -> 再返回给前端
```

这也是为什么全栈开发里，数据库知识不会独立存在，而是直接和接口开发绑定。

---

## 七、`mysql` 模块和 `mysql2`

旧教程里常用 `mysql`，现代项目中也很常见 `mysql2`。

| 包名     | 特点                                   |
| -------- | -------------------------------------- |
| `mysql`  | 旧教程常见，历史项目很多               |
| `mysql2` | 更现代，支持 Promise，更推荐新项目使用 |

这篇按标题先理解 `mysql` 模块的经典写法，但要知道新项目通常更倾向 `mysql2`。

---

## 八、在 Node 中连接 MySQL

### 8.1 安装

```bash
npm install mysql
```

### 8.2 创建连接池

```js
const mysql = require("mysql")

const db = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "123456",
  database: "my_db_01",
})
```

### 8.3 为什么更推荐连接池

因为连接池更适合并发请求，不需要每次操作都手动建立和关闭连接。

### 8.4 一个常见错误方向

生产环境不要随意使用 `root` 账号直连业务库，也不要把连接配置随手硬编码到多个文件里。

---

## 九、Node 中执行查询和 CRUD

### 9.1 查询

```js
const sql = "SELECT id, username, status FROM users"

db.query(sql, (error, results) => {
  if (error) {
    console.log(error.message)
    return
  }

  console.log(results)
})
```

查询语句返回的 `results` 一般是数组，每一项对应一条记录。

### 9.2 新增

```js
const user = { username: "zs", password: "123456" }
const sql = "INSERT INTO users SET ?"

db.query(sql, user, callback)
```

### 9.3 修改

```js
const user = { id: 7, username: "aaa", password: "000" }
const sql = "UPDATE users SET ? WHERE id = ?"

db.query(
  sql,
  [{ username: user.username, password: user.password }, user.id],
  callback,
)
```

### 9.4 删除

```js
const sql = "DELETE FROM users WHERE id = ?"

db.query(sql, [6], callback)
```

### 9.5 软删除更常见

很多项目不会物理删除，而是通过状态位实现软删除：

```sql
UPDATE users SET status = 1 WHERE id = 6;
```

---

## 十、为什么一定要用占位符

不要手动拼接 SQL 字符串，因为这会带来 SQL 注入风险。

### 10.1 不推荐写法

```js
const sql =
  "INSERT INTO users (username, password) VALUES ('" +
  user.username +
  "', '" +
  user.password +
  "')"
```

### 10.2 推荐写法

```js
const sql = "INSERT INTO users (username, password) VALUES (?, ?)"

db.query(sql, [user.username, user.password], callback)
```

### 10.3 它的价值

1. 避免 SQL 注入。
2. 可读性更好。
3. 更容易维护。

一个实战原则：只要是用户输入拼进 SQL，就优先考虑占位符。

---

## 十一、封装数据库操作的思路

在项目里，通常不会把所有 SQL 直接写在入口文件里，而是会做一层简单封装。

```js
function query(sql, values) {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (error, results) => {
      if (error) {
        reject(error)
        return
      }

      resolve(results)
    })
  })
}
```

### 11.1 这样做的好处

1. 复用数据库连接。
2. 避免每个文件重复写样板代码。
3. 更容易统一错误处理。

---

## 十二、一个完整接口示例

```js
app.get("/api/users", (req, res) => {
  const sql = "SELECT id, username, status FROM users WHERE status = ?"

  db.query(sql, [0], (error, results) => {
    if (error) {
      res.status(500).send({
        status: 1,
        message: error.message,
      })
      return
    }

    res.send({
      status: 0,
      message: "获取成功",
      data: results,
    })
  })
})
```

这个接口例子对应的完整思路是：

```text
路由收到请求 -> 拼出 SQL -> 查询数据库 -> 处理错误 -> 返回结果
```

---

## 十三、常见注意点

1. 生产环境不要随意使用 `root` 账号直连业务库。
2. 查询、更新、删除时尽量带明确条件。
3. 优先使用占位符，避免 SQL 注入。
4. 表结构设计时先想清主键、类型、约束和索引。
5. 初学阶段先把 CRUD 写熟，再继续学关联查询、事务和索引优化。

---

## 十四、小结

1. MySQL 是常见的关系型数据库，核心数据组织形式是表；SQL 是操作它的语言，最常用的是增删改查。
2. Node 通过 `mysql` 或 `mysql2` 连接数据库，把接口请求和数据库操作串起来。
3. 实战里最重要的两个原则是使用占位符、防止误操作整表。
4. 数据库知识真正有价值的地方，不是孤立背语句，而是理解“请求如何流向数据库，再从数据库回到接口响应”。
5. 这篇本质上是在帮你建立接口开发和数据库操作之间的完整链路意识。
