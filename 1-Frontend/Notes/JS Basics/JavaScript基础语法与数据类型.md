# JavaScript基础语法与数据类型

## 一、一句话理解

这篇是 JavaScript 入门主线的起点，重点不是把概念背全，而是建立“数据放哪、是什么类型、做什么运算、什么时候会发生转换”的基本心智。

---

## 二、什么是 JavaScript

**JavaScript** 是 Web 标准的重要组成部分，主要负责页面行为与交互逻辑。

前端三件套通常这样分工：

| 技术       | 作用                   |
| ---------- | ---------------------- |
| HTML       | 定义页面结构           |
| CSS        | 定义页面样式           |
| JavaScript | 定义页面行为与数据逻辑 |

除了浏览器端，JavaScript 还广泛用于：

1. Node.js 服务端开发。
2. 前端工程化工具链。
3. 小程序、桌面应用、可视化项目。

---

## 三、JavaScript 的书写位置

### 1. 内部脚本

```html
<script>
  alert("hello js")
</script>
```

通常放在 `</body>` 前，避免脚本过早执行时拿不到页面元素。

### 2. 外部脚本

```html
<script src="./index.js"></script>
```

优点：

1. 便于复用。
2. 结构更清晰。
3. 更适合团队协作。

注意：带 `src` 的 `script` 标签中间一般不要再写代码。

---

## 四、注释与结束符

### 1. 单行注释

```js
// 这是单行注释
```

### 2. 多行注释

```js
/*
	这是多行注释
*/
```

### 3. 分号

JavaScript 语句结尾通常可以写分号，也可能依赖自动分号插入机制。

```js
let age = 18
let name = "Tom"
```

真实开发中要点不是“必须写”还是“必须不写”，而是**保持团队风格一致**。

---

## 五、输入与输出

### 1. 常见输出方式

```js
document.write("输出到页面")
alert("弹窗提示")
console.log("输出到控制台")
```

| 方法               | 用途                                 |
| ------------------ | ------------------------------------ |
| `document.write()` | 直接写入页面，现代业务代码中较少使用 |
| `alert()`          | 弹窗提示                             |
| `console.log()`    | 调试输出，最常用                     |

### 2. 输入方式

```js
const username = prompt("请输入用户名")
console.log(username)
```

`prompt()` 会弹出输入框，让用户输入字符串。

---

## 六、变量

### 1. 什么是变量

变量可以理解为程序中用来存放数据的一个“命名空间”。

```js
let age = 18
let userName = "张三"
```

### 2. 声明与赋值

```js
let score
score = 100
```

也可以一步完成：

```js
let score = 100
```

### 3. 重新赋值

```js
let count = 1
count = 2
```

### 4. `let`、`const`、`var`

| 关键字  | 特点                           |
| ------- | ------------------------------ |
| `let`   | 现代常用，可重新赋值           |
| `const` | 常量，声明后不能重新赋值       |
| `var`   | 旧写法，存在变量提升等历史问题 |

实际开发中优先使用 `let` 和 `const`。

一个很实用的判断是：默认优先 `const`，确定后面还会重新赋值时再用 `let`。

---

## 七、变量命名规则

### 1. 基本规则

1. 不能使用关键字。
2. 只能由字母、数字、下划线、`$` 组成。
3. 不能以数字开头。
4. 严格区分大小写。

### 2. 命名规范

推荐使用**小驼峰命名法**：

```js
let userName = "Tom"
let maxCount = 10
```

命名应尽量做到见名知意。

---

## 八、数据类型

JavaScript 是动态类型语言，变量的数据类型可以在运行过程中变化。

这意味着它很灵活，但也更需要开发者主动分清当前值到底是什么。

### 1. 常见基本类型

| 类型        | 示例                 |
| ----------- | -------------------- |
| `number`    | `18`、`3.14`         |
| `string`    | `"hello"`、`'world'` |
| `boolean`   | `true`、`false`      |
| `undefined` | 声明未赋值时的默认值 |
| `null`      | 表示“空”或“无对象”   |
| `symbol`    | 唯一值类型           |
| `bigint`    | 大整数               |

### 2. `number`

```js
let age = 18
let price = 99.9
```

### 3. `string`

```js
let userName = "张三"
let desc = "前端工程师"
```

字符串可以用单引号、双引号或模板字符串包裹。

### 4. `boolean`

```js
let isLogin = true
let hasPermission = false
```

### 5. `undefined`

```js
let city
console.log(city) // undefined
```

### 6. `null`

```js
let currentUser = null
```

常用于表示“当前没有值”或“准备以后再赋对象”。

---

## 九、检测数据类型

### 1. `typeof`

```js
console.log(typeof 18) // number
console.log(typeof "hello") // string
console.log(typeof true) // boolean
console.log(typeof undefined) // undefined
```

注意：

```js
console.log(typeof null) // object
```

这是 JavaScript 的历史遗留问题。

---

## 十、运算符

### 1. 算术运算符

```js
console.log(1 + 2)
console.log(5 - 3)
console.log(4 * 2)
console.log(8 / 2)
console.log(7 % 3)
```

### 2. 比较运算符

```js
console.log(3 > 2)
console.log(3 < 2)
console.log(3 >= 3)
console.log(3 === 3)
console.log(3 !== 4)
```

### 3. 逻辑运算符

```js
console.log(true && false)
console.log(true || false)
console.log(!true)
```

### 4. 赋值运算符

```js
let num = 10
num += 5
num -= 2
```

---

## 十一、类型转换

JavaScript 中类型转换分为：

1. **隐式转换**：解释器自动完成。
2. **显式转换**：开发者主动调用方法完成。

这部分的重点不是把所有转换结果背下来，而是知道：一旦发生运算、比较或条件判断，类型转换就可能参与结果。

### 1. 转换为数字

```js
Number("123") // 123
parseInt("123px") // 123
parseFloat("3.14") // 3.14
```

### 2. 转换为字符串

```js
String(123)(
  // "123"
  123,
).toString() // "123"
```

### 3. 转换为布尔值

```js
Boolean(1) // true
Boolean(0) // false
Boolean("") // false
Boolean("hello") // true
```

### 4. 常见隐式转换

```js
console.log("1" + 2) // "12"
console.log("6" - 2) // 4
console.log(!!"hello") // true
```

### 5. 常见易错点

| 表达式          | 结果   | 原因                 |
| --------------- | ------ | -------------------- |
| `"1" + 2`       | `"12"` | `+` 遇到字符串会拼接 |
| `"6" - 2`       | `4`    | `-` 会尝试转数字     |
| `Number("abc")` | `NaN`  | 无法转成有效数字     |

---

## 十二、真实开发里最该先稳住的三件事

1. 变量命名和作用清楚，不要让值本身含义混乱。
2. 做判断和运算前，先确认当前值的类型。
3. 对转换结果不确定时，宁可显式转换，也不要赌隐式规则。

---

## 十三、总结

1. JavaScript 是前端行为层的核心语言，也广泛用于 Node.js 和工程化场景。
2. 变量用于存储数据，现代开发以 `let` 和 `const` 为主。
3. 常见基本数据类型包括 `number`、`string`、`boolean`、`undefined`、`null`。
4. 运算符和类型转换是写业务逻辑的基础。
5. 学这部分时要重点掌握：变量、类型、`typeof`、比较运算、显式与隐式转换。
