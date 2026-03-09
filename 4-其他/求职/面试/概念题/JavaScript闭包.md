# JavaScript 闭包 (Closure)

**一句话总结**：
闭包（Closure） = 函数 + 其词法作用域中的变量环境。

更通俗一点：
当一个内部函数“记住”并可以访问其外部函数作用域中的变量，即使外部函数已经返回，形成的结构就是闭包。

## 示例（JavaScript）：

```javascript
function createCounter() {
  let count = 0; // 外部函数的局部变量

  return function () { // 内部函数
    count++;
    console.log(count);
  };
}

const counter = createCounter();
counter(); // 1
counter(); // 2
```
这里 `createCounter` 已经执行完返回了，但 `counter` 这个内部函数依然能访问 `count`，这就是闭包。

## 闭包的典型应用场景

### 1）封装私有变量 / 模拟私有属性
不暴露内部状态，只提供操作方法：
```javascript
function createUser(name) {
  let score = 0; // 私有变量，外部无法直接访问

  return {
    getName() {
      return name;
    },
    addScore() {
      score++;
    },
    getScore() {
      return score;
    }
  };
}

const u = createUser('Tom');
u.addScore();
console.log(u.getScore()); // 1
// 没有 u.score 这种属性，外部改不了
```

### 2）函数工厂：根据配置“生成”不同的函数
```javascript
function makeAdder(x) {
  return function (y) {
    return x + y; // 记住外层的 x
  };
}

const add10 = makeAdder(10);
console.log(add10(5)); // 15
```

### 3）回调 / 事件处理里记住上下文
每个监听器都“记住”自己的 `id` 和 `count`。
```javascript
function bindClick(id) {
  const el = document.getElementById(id);
  let count = 0;

  el.addEventListener('click', () => {
    count++;
    console.log(id, 'clicked', count, 'times');
  });
}
```

### 4）节流、防抖等高阶函数
内部 `timer` 就是通过闭包保存的状态。
```javascript
function debounce(fn, delay) {
  let timer = null;

  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
```

### 5）模块化：IIFE + 闭包封装模块
```javascript
const moduleA = (function () {
  let privateVar = 0;

  function inc() {
    privateVar++;
  }

  function get() {
    return privateVar;
  }

  return { inc, get };
})();
```

## 闭包带来的性能 / 内存问题，以及如何避免

### 1）潜在问题

- **问题 1：内存占用增大（对象长期不释放）**
  闭包会让外部函数的局部变量“活得更久”，只要闭包还被引用，这些变量就不会被垃圾回收。如果闭包引用了大对象（大数组、DOM 节点、缓存数据等），而这些数据后面不再需要，但闭包还存在，就会造成不必要的内存占用，甚至内存泄漏。
- **问题 2：意外的内存泄漏**
  在事件监听、定时器、全局变量等场景中，如果闭包引用外部变量，而我们忘记移除监听、清理定时器，就会让这些变量一直存活。
- **问题 3：错误使用闭包导致逻辑 Bug**
  尤其是循环里的闭包，如果不注意，会引用到同一个变量，导致结果全部相同（逻辑错误，间接导致调试困难、性能损失）。
  ```javascript
  for (var i = 0; i < 3; i++) {
    setTimeout(() => {
      console.log(i); // 全是 3，而不是 0 1 2
    }, 100);
  }
  ```

### 2）如何避免或减轻这些问题

- **建议 1：只在需要时才使用闭包，不滥用**
  能用普通函数 / 局部变量解决的，就不要强行用闭包长时间保留状态。
- **建议 2：避免在闭包中引用不必要的大对象**
  只把真正需要的值放到闭包里；尽量只保存必要字段，而不是整个对象。
  ```javascript
  // 不太好：闭包持有整个 bigObj
  function foo(bigObj) {
    return function () {
      console.log(bigObj.largeArray.length);
    };
  }

  // 更好：只抽取需要的字段
  function foo2(bigObj) {
    const len = bigObj.largeArray.length;
    return function () {
      console.log(len);
    };
  }
  ```
- **建议 3：用完就解除引用，帮助 GC 回收**
  - 事件监听：不用时 `removeEventListener`
  - 定时器 / interval：不用时 `clearTimeout / clearInterval`
  - 把不再需要的闭包变量置为 null 或让闭包本身脱离可达引用链
  ```javascript
  let handler = null;

  function bind() {
    const el = document.getElementById('btn');
    let count = 0;
    handler = () => console.log(++count);
    el.addEventListener('click', handler);
  }

  function unbind() {
    const el = document.getElementById('btn');
    el.removeEventListener('click', handler);
    handler = null; // 让闭包可被回收
  }
  ```
- **建议 4：在循环中用 let 替代 var**
  `let` 在块级作用域中每次循环是一个新的绑定，可以避免经典闭包坑。
  ```javascript
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      console.log(i); // 0 1 2
    }, 100);
  }
  ```
- **建议 5：注意“长期存在的全局结构”里的闭包**
  比如全局数组中存一堆回调函数，或者 Vue/React 组件外定义的大量闭包并一直存在。要定期清理不用的回调，或设计好生命周期，让不需要的闭包不再可达。

## 总结

- **闭包本质**：函数携带其定义时的词法作用域，是 JS 的基础能力。
- **主要用途**：封装私有状态、构造函数工厂、回调 & 事件处理、实现防抖节流、简单模块化等。
- **风险点**：可能让不需要的变量常驻内存，尤其是大对象或长期存在的监听 / 定时器，导致内存浪费甚至泄漏。
- **避免方式**：按需使用闭包、少引用大对象、及时清理监听/定时器/引用、循环中使用 `let`，设计好对象和函数的生命周期。
