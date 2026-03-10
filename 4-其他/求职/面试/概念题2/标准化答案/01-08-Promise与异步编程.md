# Promise 与异步编程

## 一、Promise 是什么

**Promise** 是 ES6 引入的**异步结果抽象**：表示一个“将来才会完成”的操作的最终结果（成功或失败）。通过 `.then` / `.catch` / `async/await` 消费结果，避免回调嵌套。

### 1. 三种状态

| 状态 | 含义 | 是否可逆 |
| --- | --- | --- |
| **pending** | 进行中 | 可转为 fulfilled 或 rejected |
| **fulfilled** | 已成功 | 不可再变 |
| **rejected** | 已失败 | 不可再变 |

状态只能从 pending 变为 fulfilled 或 rejected，且**不可逆**；一旦落定，再调用 `resolve`/`reject` 无效。

```js
const p = new Promise((resolve, reject) => {
  resolve(1)
  reject(2)   // 无效，状态已是 fulfilled
})
```

***

## 二、常用静态方法

| 方法 | 含义 | 返回值 |
| --- | --- | --- |
| **Promise.all(iterable)** | 全部 fulfilled 才成功 | 结果数组；任一 rejected 即失败 |
| **Promise.allSettled(iterable)** | 等全部完成（成功/失败都算） | 每项为 `{ status, value/reason }` |
| **Promise.race(iterable)** | 取**最先完成**的那一个（不论成功失败） | 该 Promise 的结果 |
| **Promise.any(iterable)** | 取**最先成功**的那一个 | 该值；全部失败才 rejected |

```js
Promise.all([p1, p2, p3])        // 全成功才成功
Promise.allSettled([p1, p2, p3]) // 全结束，不因一个失败而失败
Promise.race([p1, p2, p3])       // 谁先完成用谁
Promise.any([p1, p2, p3])        // 谁先成功用谁；全失败才失败
```

***

## 三、async / await

**async/await** 是 Promise 的语法糖：用同步写法写异步逻辑。

- **async**：函数声明为 `async` 后，其返回值会被包装成 Promise；若返回普通值，等价于 `Promise.resolve(值)`。
- **await**：只能在 async 函数内使用；`await promise` 会暂停当前函数，等 promise 落定后得到结果再往下执行；若 promise 被 reject，会抛出异常。

```js
async function fetchData() {
  try {
    const a = await getA()
    const b = await getB(a)
    return b
  } catch (e) {
    console.error(e)  // 任一 await 的 Promise reject 都会进这里
  }
}
```

错误处理用 **try/catch** 或在外层用 `.catch()`。

***

## 四、宏任务与微任务

**事件循环**中，任务分为**宏任务**和**微任务**。

| 类型 | 常见来源 |
| --- | --- |
| **微任务** | `Promise.then/catch/finally`、`queueMicrotask`、`MutationObserver` |
| **宏任务** | `setTimeout`、`setInterval`、`setImmediate`（Node）、I/O、UI 渲染（浏览器） |

**执行顺序**：一段同步代码执行完 → **清空当前所有微任务** → 取一个宏任务执行 → 再清空微任务 → 如此循环。

```js
setTimeout(() => console.log(1), 0)
Promise.resolve().then(() => console.log(2))
console.log(3)
// 输出：3 2 1（同步 3 → 微任务 2 → 宏任务 1）
```

***

## 五、面试答题要点

- **状态**：pending → fulfilled/rejected，不可逆。
- **all / allSettled / race / any**：区别在于“全成功才成功”“全结束”“先完成”“先成功”的语义。
- **async/await**：async 返回 Promise；await 等待 Promise，错误用 try/catch。
- **事件循环**：同步 → 清空微任务 → 一个宏任务 → 再清空微任务，依此循环。
