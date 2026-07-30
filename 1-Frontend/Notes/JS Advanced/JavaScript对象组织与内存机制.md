# JavaScript对象组织与内存机制

## 一、这篇的主线

这一篇本质上在讲两件事：

1. JavaScript 如何组织对象能力。
2. JavaScript 的值在内存和调用层面到底怎么工作。

所以可以把它拆成两条理解线：

| 主线         | 主题                                 |
| ------------ | ------------------------------------ |
| **对象组织** | 构造函数、实例成员、静态成员         |
| **值与内存** | 引用类型、堆与栈、包装类型、常见方法 |

---

## 二、构造函数

构造函数本质上仍然是函数，只不过它通常配合 `new` 使用，用来批量创建结构相似的对象。

```js
function Person(name, age) {
  this.name = name
  this.age = age
}

const p1 = new Person("Tom", 18)
const p2 = new Person("Jerry", 20)
```

### 2.1 `new` 做了什么

`new Person("Tom", 18)` 大致会做 4 件事：

1. 创建一个新对象。
2. 让这个对象的原型指向 `Person.prototype`。
3. 让构造函数内部的 `this` 指向这个新对象。
4. 默认返回这个新对象。

### 2.2 注意点

1. 构造函数名通常首字母大写。
2. 构造函数内部通常不手动返回普通值。
3. 如果忘了写 `new`，`this` 可能指向错误对象。
4. 现代代码里也常用 `class`，但底层原理仍和构造函数、原型有关。

### 2.3 构造函数和 `class` 的关系

`class` 更像语法层面的现代写法，底层仍然绕不开构造函数和原型机制。

---

## 三、实例成员、原型成员、静态成员

### 3.1 实例成员

通过构造函数创建出来的对象，叫实例对象；挂在实例对象上的属性和方法，叫实例成员。

```js
function Person(name) {
  this.name = name
}

const p = new Person("Tom")
console.log(p.name)
```

特点：

1. 每个实例都可以访问。
2. 实例之间互不影响。
3. 更适合放“每个对象独有的数据”。

### 3.2 为什么方法通常不直接写成实例成员

```js
function Person(name) {
  this.name = name
  this.sayHi = function () {
    console.log("你好，我是" + this.name)
  }
}
```

这种写法可以运行，但每创建一个实例都会生成一份新函数，复用性和内存利用率都较差。

如果是所有实例共享的方法，通常更适合放在原型上。

### 3.3 静态成员

直接挂在构造函数本身上的属性和方法，叫静态成员。

```js
function Person(name) {
  this.name = name
}

Person.country = "China"
Person.createAnonymous = function () {
  return new Person("匿名用户")
}
```

### 3.4 实例成员和静态成员的区别

| 类型     | 挂载位置   | 调用方式        | 适合放什么         |
| -------- | ---------- | --------------- | ------------------ |
| 实例成员 | 实例对象上 | `实例.成员`     | 每个对象自己的数据 |
| 静态成员 | 构造函数上 | `构造函数.成员` | 整个类型共享的能力 |

### 3.5 一个判断标准

1. 属于某个对象自己的东西，通常放实例上。
2. 属于“这一类对象”的公共能力，通常放静态成员或原型上。

---

## 四、引用类型

JavaScript 的值大体可以分成两类：

1. 基本类型。
2. 引用类型。

常见引用类型包括：

1. `Object`
2. `Array`
3. `Function`
4. `Date`
5. `RegExp`

### 4.1 `Object`

```js
const user = {
  name: "Tom",
  age: 18,
}
```

普通对象常用于描述“一个实体”的多个属性。

常见方法：

```js
Object.keys(user)
Object.values(user)
Object.assign({}, user)
```

### 4.2 `Array`

```js
const list = [1, 2, 3]
```

数组用于存放有序数据。

常见方法：

```js
list.push(4)
list.map(item => item * 2)
list.filter(item => item > 1)
list.find(item => item === 2)
```

### 4.3 `RegExp`

```js
const reg = /\d+/g
reg.test("abc123")
```

正则表达式用于字符串匹配、查找、替换、校验等场景。

---

## 五、引用类型的复制特点

引用类型变量保存的不是对象本身，而更像是对象在内存中的引用地址。

```js
const obj1 = { name: "Tom" }
const obj2 = obj1

obj2.name = "Jerry"
console.log(obj1.name) // Jerry
```

这说明 `obj1` 和 `obj2` 指向的是同一个对象。

### 5.1 为什么这很重要

很多“我明明只改了新对象，为什么旧对象也变了”的问题，根源都在这里。

### 5.2 如何避免相互影响

```js
const obj1 = { name: "Tom", age: 18 }
const obj2 = { ...obj1 }
```

这样得到的是浅拷贝，新对象和旧对象不再是同一个顶层引用。

---

## 六、堆与栈的区别

理解堆和栈时，不需要把它神秘化，先抓住一个够用的结论：

1. 基本类型通常可以理解为按值保存。
2. 引用类型通常涉及堆中数据和变量中的引用地址。

### 6.1 基本类型示例

```js
let a = 10
let b = a
b = 20

console.log(a) // 10
console.log(b) // 20
```

### 6.2 引用类型示例

```js
const arr1 = [1, 2, 3]
const arr2 = arr1
arr2.push(4)

console.log(arr1) // [1, 2, 3, 4]
```

### 6.3 一个学习提醒

这里重点不是去死记底层内存模型细节，而是记住：

1. 基本类型赋值更像复制值。
2. 引用类型赋值更像复制地址。

---

## 七、包装类型

字符串、数字、布尔值本来是基本类型，但它们在调用方法时，又像对象一样能使用属性和方法，这背后就涉及包装类型。

```js
const str = "hello"
console.log(str.length)
console.log(str.toUpperCase())

const num = 12.345
console.log(num.toFixed(2))
```

可以把它简单理解为：JavaScript 在某些场景下会临时把基本类型包装成对应对象，以便调用方法。

常见包装对象有：

1. `String`
2. `Number`
3. `Boolean`

### 7.1 为什么平时不推荐手动 `new String()`

```js
const value = new String("hello")
```

这种写法会得到对象，而不是普通字符串，容易带来不必要的类型问题。

日常开发里，直接写字面量通常就够了。

---

## 八、常见公共方法

这里的“公共方法”可以理解为开发中最常用的对象、数组、字符串实例方法与静态方法。

### 8.1 字符串常见方法

```js
const str = " hello world "

str.trim()
str.includes("world")
str.slice(0, 5)
str.split(" ")
```

### 8.2 数组常见方法

```js
const list = [1, 2, 3, 4]

list.map(item => item * 2)
list.filter(item => item > 2)
list.some(item => item === 3)
list.every(item => item > 0)
```

### 8.3 对象常见静态方法

```js
const user = { name: "Tom", age: 18 }

Object.keys(user)
Object.values(user)
Object.entries(user)
```

### 8.4 判断类型的常见方式

```js
console.log([] instanceof Array) // true
console.log({} instanceof Object) // true
console.log(Array.isArray([])) // true
```

> **注意**：`{}` 写在语句开头会被解析成代码块，所以 `{} instanceof Object` 单独成行会报语法错误，必须放进表达式位置（例如上面的 `console.log()` 里，或写成 `({}) instanceof Object`）。

### 8.5 一个实战建议

数组方法和对象静态方法要重点熟悉，因为它们在业务代码、数据处理和框架开发里出现频率极高。

---

## 九、小结

1. 构造函数配合 `new` 用来创建结构相似的对象，`class` 只是更现代的写法外壳。
2. 实例成员属于对象本身，静态成员属于类型本身，共享方法通常更适合放在原型上。
3. 引用类型保存的是引用关系，因此赋值和修改时很容易出现联动。
4. 堆与栈要先抓住“按值”和“按引用”这个核心理解，不必过度神秘化。
5. 包装类型解释了为什么基本类型也能调用方法，但日常开发不建议手动创建包装对象。
