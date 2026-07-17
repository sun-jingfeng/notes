# JavaScript class封装与继承

## 一、什么是 `class`

`class` 是 ECMAScript 6 提供的类语法，用来以更清晰的方式组织对象、属性和方法。

一句话理解：

```text
class 是对“构造函数 + 原型”写法的一层更易读的语法封装。
```

它不是完全新的底层机制，而是把原本就能做到的封装与继承写得更清楚。

---

## 二、class 的基本写法

```js
class Person {
  constructor(name, age) {
    this.name = name
    this.age = age
  }

  sleep() {
    console.log(`${this.name} 正在睡觉`)
  }
}

const person = new Person("小明", 18)
person.sleep()
```

### 2.1 这段代码里包含什么

| 部分           | 作用                       |
| -------------- | -------------------------- |
| `class Person` | 定义类                     |
| `constructor`  | 构造函数，实例化时自动执行 |
| `this.name`    | 给实例挂属性               |
| `sleep()`      | 定义实例方法               |

### 2.2 为什么现代代码更常用 `class`

因为它更直观，也更适合教学、团队协作和复杂对象建模。

---

## 三、封装怎么理解

这里说的“封装”，重点是把相关的数据和行为收拢到一个类中管理。

### 3.1 class 的好处

1. 结构更清晰。
2. 语义更集中。
3. 更适合表达“某种对象模板”。

### 3.2 一个实战提醒

封装不是“所有代码都塞进 class”，而是把真正属于某一类对象的数据和行为收在一起。

---

## 四、实例成员和静态成员

### 4.1 实例成员

实例成员是属于某个实例的属性和方法。

```js
class Person {
  constructor(name) {
    this.name = name
  }

  walk() {
    console.log(`${this.name} 正在走路`)
  }
}
```

### 4.2 静态成员

静态成员是挂在类本身上的，不属于具体实例。

```js
class Person {
  static version = "1.0.0"

  static getVersion() {
    return Person.version
  }
}
```

### 4.3 二者区别

| 对比项   | 实例成员         | 静态成员                 |
| -------- | ---------------- | ------------------------ |
| 挂载位置 | 实例对象上       | 类本身上                 |
| 访问方式 | `person.walk()`  | `Person.getVersion()`    |
| 适合场景 | 描述具体对象行为 | 描述类级别配置和工具方法 |

### 4.4 一个判断标准

1. 跟具体对象强相关，放实例成员。
2. 跟“这一类对象”的共性能力相关，放静态成员。

---

## 五、`constructor` 构造函数

`constructor` 是类中的特殊方法，在 `new` 一个实例时自动执行。

```js
class Person {
  constructor(name, age) {
    this.name = name
    this.age = age
  }
}
```

### 5.1 它的作用

1. 接收实例化参数。
2. 初始化实例属性。
3. 完成创建对象时的准备逻辑。

### 5.2 注意事项

1. 一个类只能有一个 `constructor`。
2. 如果你不写，JavaScript 会默认补一个空构造函数。

---

## 六、继承 `extends`

继承是让一个类复用另一个类的属性和方法。

```js
class Person {
  constructor(name) {
    this.name = name
  }

  walk() {
    console.log(`${this.name} 会走路`)
  }
}

class Student extends Person {
  study() {
    console.log(`${this.name} 在学习`)
  }
}
```

### 6.1 继承带来的效果

子类可以直接复用父类已有的方法和属性初始化逻辑。

### 6.2 常见术语

| 术语          | 含义         |
| ------------- | ------------ |
| 父类 / 基类   | 被继承的类   |
| 子类 / 派生类 | 继承别人的类 |

### 6.3 一个实战提醒

继承适合表达“is-a”关系，也就是“学生是一种人”“管理员是一种用户”。如果只是想复用一点功能，不一定非要走继承。

---

## 七、`super` 是什么

`super` 可以理解为对子类中“父类能力”的引用。

### 7.1 在子类构造函数中

```js
class Person {
  constructor(name, age) {
    this.name = name
    this.age = age
  }
}

class Student extends Person {
  constructor(name, age, school) {
    super(name, age)
    this.school = school
  }
}
```

### 7.2 为什么必须先调用 `super()`

在子类构造函数里，只有先执行 `super()`，父类的初始化逻辑才会跑起来，之后才能安全使用 `this`。

### 7.3 在实例方法中调用父类方法

```js
class Person {
  walk() {
    console.log("人都会走路")
  }
}

class Student extends Person {
  walk() {
    super.walk()
    console.log("学生走向教室")
  }
}
```

---

## 八、方法重写

子类可以定义和父类同名的方法，这叫重写。

```js
class Animal {
  move() {
    console.log("动物在移动")
  }
}

class Bird extends Animal {
  move() {
    console.log("鸟在飞")
  }
}
```

### 8.1 什么时候适合重写

当子类有更具体、更符合自身语义的行为时。

### 8.2 什么时候适合 `super`

当你既想保留父类行为，又想追加子类自己的逻辑时。

---

## 九、`class` 和构造函数写法的关系

```js
function Person(name) {
  this.name = name
}

Person.prototype.walk = function () {
  console.log(this.name + " 在走路")
}
```

上面的写法，与下面的类写法，本质目标是一致的：

```js
class Person {
  constructor(name) {
    this.name = name
  }

  walk() {
    console.log(this.name + " 在走路")
  }
}
```

### 9.1 一个关键结论

`class` 是语法糖，本质仍和原型链机制有关。所以想真正理解 class，还是要能回到构造函数和原型的底层认知上。

---

## 十、常见注意点

1. `class` 中的方法默认挂在原型上，不会为每个实例重复创建一份。
2. 子类构造函数里，使用 `this` 前必须先调用 `super()`。
3. 静态成员要用类名访问，不能通过实例访问。
4. 继承不是唯一复用方式，组合有时更灵活。

---

## 十一、小结

1. `class` 是 JavaScript 中组织对象模板的现代写法，本质仍建立在构造函数和原型机制上。
2. `constructor` 负责实例初始化，实例成员和静态成员分别服务于“对象级”和“类级”能力。
3. `extends` 与 `super` 解决的是继承和父类能力复用的问题。
4. 重写适合表达子类的特化行为，但不应为了复用一点代码就滥用继承。
5. 学这一篇时，重点不是死背语法，而是理解如何用 `class` 更清晰地表达对象和对象之间的关系。
