# instanceof、new

## 一、核心认知

这两道手写题本质都和 **原型链** 有关。

| 题目             | 底层本质                                               |
| ---------------- | ------------------------------------------------------ |
| **`instanceof`** | 沿着对象原型链往上找，是否能找到构造函数的 `prototype` |
| **`new`**        | 创建对象、绑定原型、执行构造函数、返回结果             |

理解这两题时，建议先记住这条关系：

$$
对象.__proto__ \rightarrow 构造函数.prototype
$$

更规范的获取方式是 `Object.getPrototypeOf(obj)`。

---

## 二、实现 instanceof

### 1. 实现原理

`a instanceof B` 的判断过程就是：

- 先拿到 `a` 的原型。
- 沿着原型链不断向上查找。
- 如果某一层刚好等于 `B.prototype`，返回 `true`。
- 一直找到 `null` 都没找到，返回 `false`。

### 2. 参考实现

```typescript
function myInstanceof(target: unknown, constructorFn: Function): boolean {
  if (
    target === null ||
    (typeof target !== "object" && typeof target !== "function")
  ) {
    return false
  }

  let proto = Object.getPrototypeOf(target)

  while (proto !== null) {
    if (proto === constructorFn.prototype) {
      return true
    }

    proto = Object.getPrototypeOf(proto)
  }

  return false
}
```

### 3. 易错点

- 基本类型不是对象，没有可遍历的原型链，结果通常是 `false`。
- 不能直接比较 `constructor`，因为 `constructor` 属性可能被改写。
- `instanceof` 判断的是“原型链关系”，不是“长得像不像”。

---

## 三、实现 new

### 1. `new` 的执行过程

`new Foo(arg1, arg2)` 可以拆成四步：

| 步骤                | 说明                                                   |
| ------------------- | ------------------------------------------------------ |
| **1. 创建新对象**   | 准备一个空对象                                         |
| **2. 连接原型**     | 让新对象的原型指向 `Foo.prototype`                     |
| **3. 执行构造函数** | 把 `this` 绑定到新对象上                               |
| **4. 决定返回值**   | 如果构造函数显式返回对象，则返回该对象；否则返回新对象 |

### 2. 参考实现

```typescript
type Constructor<T, A extends unknown[] = unknown[]> = new (...args: A) => T

function myNew<T, A extends unknown[]>(
  constructorFn: Constructor<T, A>,
  ...args: A
): T {
  const instance = Object.create(constructorFn.prototype) as T
  const returned = (constructorFn as unknown as (...params: A) => T).apply(
    instance as object,
    args,
  )

  if (
    returned !== null &&
    (typeof returned === "object" || typeof returned === "function")
  ) {
    return returned
  }

  return instance
}
```

### 3. 易错点

- 只创建对象但不处理“构造函数显式返回对象”的情况，结果和原生 `new` 不一致。
- 忘记把原型指向 `constructorFn.prototype`，导致实例方法访问不到。
- 把 `new` 理解成“只是调用一次函数”，其实它还做了对象创建和原型绑定。
