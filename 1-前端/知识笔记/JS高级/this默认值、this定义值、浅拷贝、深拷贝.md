# this默认值、this定义值、浅拷贝、深拷贝

## 一、这篇要分成两部分理解

这篇看起来只有 4 个词，其实在讲两类完全不同的问题：

| 主线                | 回答的问题                 |
| ------------------- | -------------------------- |
| **`this`**          | 函数执行时上下文到底是谁   |
| **浅拷贝 / 深拷贝** | 数据复制后为什么会互相影响 |

学的时候不要把它们混在一起记。

---

## 二、`this` 到底是什么

`this` 是 JavaScript 运行时提供的一个特殊引用，它指向什么，取决于函数是如何被调用的。

一句话理解：

```text
普通函数看调用方式，箭头函数看定义位置。
```

---

## 三、普通函数中的 `this`

在普通函数里，`this` 主要由 **调用方式** 决定。

### 3.1 基本示例

```js
function sayHi() {
  console.log(this)
}

const user = {
  name: "小明",
  walk: sayHi,
}

sayHi()
user.walk()
```

### 3.2 常见规律

| 调用方式         | `this` 指向                                           |
| ---------------- | ----------------------------------------------------- |
| 普通函数直接调用 | 非严格模式下通常是 `window`，严格模式下是 `undefined` |
| 对象方法调用     | 调用它的对象                                          |
| 构造函数调用     | 新创建的实例                                          |

### 3.3 一个关键提醒

不要背“函数定义在哪”，普通函数里的 `this` 重点看的是“谁在调用它”。

---

## 四、箭头函数中的 `this`

箭头函数没有自己的 `this`，它会直接捕获定义时外层作用域的 `this`。

### 4.1 示例

```js
const user = {
  name: "小明",
  walk: () => {
    console.log(this)
  },
}

user.walk()
```

上面这个 `this` 并不会指向 `user`，而是指向箭头函数定义时所在外层环境的 `this`。

### 4.2 一个常见场景

```js
const user = {
  name: "小红",
  sleep() {
    const fn = () => {
      console.log(this.name)
    }

    fn()
  },
}

user.sleep() // 小红
```

这里箭头函数继承的是 `sleep()` 执行时的 `this`。

### 4.3 为什么事件回调里常常不用箭头函数

```js
const button = document.querySelector(".btn")

button.addEventListener("click", function () {
  console.log(this) // button
})

button.addEventListener("click", () => {
  console.log(this) // 外层 this，不是 button
})
```

如果你需要拿到触发事件的 DOM 节点，普通函数往往更合适。

---

## 五、class 中的 `this`

在 class 中，实例方法里的 `this` 默认指向当前实例。

```js
class Animal {
  constructor(name) {
    this.name = name
  }

  getName() {
    return this.name
  }
}

const animal = new Animal("Orange")
console.log(animal.getName())
```

静态方法中的 `this` 通常指向类本身。

```js
class Animal {
  static type = "animal"

  static getType() {
    return this.type
  }
}
```

---

## 六、如何主动指定 `this`

JavaScript 提供了 3 个常用方法来手动指定普通函数里的 `this`：

1. `call()`
2. `apply()`
3. `bind()`

### 6.1 `call()`

`call()` 会立即执行函数，并把第一个参数指定为 `this`。

```js
function sayHi(city) {
  console.log(this.name, city)
}

const user = { name: "小明" }
sayHi.call(user, "北京")
```

### 6.2 `apply()`

`apply()` 和 `call()` 很像，也会立即执行函数。

```js
function sum(x, y) {
  return x + y
}

const result = sum.apply(null, [5, 10])
```

### 6.3 `bind()`

`bind()` 不会立即执行函数，而是返回一个已经绑定好 `this` 的新函数。

```js
function sayHi() {
  console.log(this.name)
}

const user = { name: "小明" }
const sayHello = sayHi.bind(user)
sayHello()
```

### 6.4 三者区别

| 方法      | 是否立即执行 | 参数形式 | 返回值       |
| --------- | ------------ | -------- | ------------ |
| `call()`  | 是           | 逐个传参 | 函数执行结果 |
| `apply()` | 是           | 数组传参 | 函数执行结果 |
| `bind()`  | 否           | 逐个传参 | 新函数       |

### 6.5 一个实战判断标准

1. 立刻执行并改上下文，用 `call()` 或 `apply()`。
2. 想先固定上下文、以后再执行，用 `bind()`。

---

## 七、什么是浅拷贝

浅拷贝只复制对象的第一层属性。如果属性值还是对象或数组，那么复制的是引用，不是内部数据本身。

```js
const obj = {
  name: "张三",
  colors: ["red", "blue"],
  info: {
    score: 99,
  },
}

const newObj = Object.assign({}, obj)
```

### 7.1 为什么叫“浅”

因为只把最外层复制了一层，内部嵌套结构并没有真正拆开复制。

### 7.2 常见浅拷贝方式

1. `Object.assign({}, obj)`
2. 展开运算符 `{ ...obj }`
3. 数组的 `[...arr]`

---

## 八、什么是深拷贝

深拷贝会递归复制对象的每一层结构，让新对象和旧对象彻底分离。

### 8.1 一个简单理解

```text
浅拷贝：最外层新，里层可能还是同一个引用
深拷贝：从外到内都尽量复制成新的数据
```

### 8.2 常见方式

#### `structuredClone()`

```js
const copy = structuredClone(obj)
```

这是现代环境下更推荐的深拷贝方式之一。

#### `JSON.parse(JSON.stringify())`

```js
const copy = JSON.parse(JSON.stringify(obj))
```

这种方式简单，但有明显限制：

1. 会丢失 `undefined`。
2. 会丢失函数。
3. 不能正确处理 `Date`、`Map`、`Set` 等特殊类型。

---

## 九、浅拷贝和深拷贝的区别

| 对比项   | 浅拷贝                   | 深拷贝                 |
| -------- | ------------------------ | ---------------------- |
| 复制层级 | 只复制第一层             | 递归复制多层           |
| 嵌套对象 | 仍共享引用               | 尽量独立               |
| 性能成本 | 更低                     | 更高                   |
| 适用场景 | 简单对象、只关心顶层修改 | 嵌套结构隔离、状态复制 |

### 9.1 一个对比例子

```js
const user = {
  name: "张三",
  profile: {
    age: 18,
  },
}

const shallowCopy = { ...user }
const deepCopy = structuredClone(user)

shallowCopy.profile.age = 20
console.log(user.profile.age) // 20

deepCopy.profile.age = 30
console.log(user.profile.age) // 20
```

### 9.2 为什么浅拷贝会影响原对象

因为 `profile` 这一层复制过去的仍然是同一个引用。

---

## 十、小结

1. 普通函数里的 `this` 主要看调用方式，箭头函数里的 `this` 主要看定义位置。
2. `call()`、`apply()`、`bind()` 都能改变普通函数的 `this`，但执行时机和传参形式不同。
3. 浅拷贝只复制第一层，深拷贝才会尽量把嵌套结构也复制开。
4. `structuredClone()` 是现代环境下更稳妥的深拷贝方案之一。
5. 学这一篇时，重点是把“执行上下文”和“引用复制规则”分开理解。
