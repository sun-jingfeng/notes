# var / let / const 的区别

## 一、三者对比表

| 特性 | **var** | **let** | **const** |
| --- | --- | --- | --- |
| **作用域** | 函数作用域 | 块级作用域 | 块级作用域 |
| **变量提升** | 提升且初始化为 `undefined` | 提升但不初始化（TDZ） | 提升但不初始化（TDZ） |
| **重复声明** | 同一作用域可重复声明 | 同一作用域不可重复声明 | 同一作用域不可重复声明 |
| **重新赋值** | 可以 | 可以 | 不可以（绑定不变，引用类型内部可改） |

***

## 二、作用域差异

### 1. var：函数作用域

`var` 声明的变量只认“函数”边界，不认 `if`、`for`、`while` 等块。

```js
function fn() {
  if (true) {
    var a = 1
  }
  console.log(a)  // 1，块不隔离
}
fn()

for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0)  // 3 3 3，i 是同一个
}
```

### 2. let / const：块级作用域

`let`、`const` 只在本块（`{}`）内有效，包括 `if`、`for`、`while`、单独 `{}`。

```js
if (true) {
  let a = 1
  const b = 2
}
console.log(a)  // ReferenceError
console.log(b)  // ReferenceError

for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0)  // 0 1 2，每次循环新 i
}
```

***

## 三、变量提升与暂时性死区（TDZ）

### 1. var 的提升

在函数（或全局）内，`var` 声明会被“提升”到函数顶部，执行前就可访问，值为 `undefined`。

```js
console.log(x)  // undefined，不会报错
var x = 10
console.log(x)  // 10
```

### 2. let / const 与 TDZ

`let`、`const` 也会被提升，但在**声明语句执行之前**这段时间内不可访问，称为**暂时性死区（Temporal Dead Zone，TDZ）**。访问会抛出 `ReferenceError`。

```js
console.log(y)  // ReferenceError: Cannot access 'y' before initialization
let y = 20

// 即使 typeof 也不安全（仅未声明时返回 'undefined'，TDZ 会报错）
typeof z  // ReferenceError，若 z 为 let/const 且未执行到声明
let z = 30
```

***

## 四、const 的“不变”指绑定

`const` 保证的是**绑定不变**（不能重新赋值），不是“值不可变”。

```js
const a = 1
a = 2  // TypeError: Assignment to constant variable

const obj = { name: 'x' }
obj = {}           // ❌ 报错，不能改绑定
obj.name = 'y'     // ✅ 可以，改的是堆里的内容
obj.age = 2        // ✅ 可以
```

若要对象/数组“不可变”，需配合 `Object.freeze`、不可变库或只读类型（TypeScript）等。

***

## 五、面试答题要点

- **作用域**：var 函数作用域；let/const 块级作用域。
- **提升**：var 提升并赋 undefined；let/const 提升但存在 TDZ，声明前访问报 ReferenceError。
- **重复声明**：var 允许；let/const 不允许。
- **const**：不能重新赋值；引用类型可修改属性/元素。
- **推荐**：默认用 `const`，需要重新赋值时用 `let`，避免使用 `var`。
