# Promise 手写题

## 一、核心认知

Promise 相关面试题通常考两类能力：

| 类型           | 重点                                     |
| -------------- | ---------------------------------------- |
| **执行顺序题** | 搞清楚同步任务、微任务、宏任务的执行时机 |
| **API 手写题** | 说清楚各静态方法的行为边界               |

事件循环里最关键的一句话：

- **同步代码** 先执行。
- 当前宏任务结束后，清空 **微任务队列**。
- 再进入下一个 **宏任务**，例如 `setTimeout`。

---

## 二、输出顺序

### 1. 题目

```javascript
console.log("start")

setTimeout(() => {
  console.log("timeout")
}, 0)

new Promise(resolve => {
  console.log("promise测试 before")
  resolve()
  console.log("promise测试 after")
})
  .then(() => {
    console.log("promise测试1")
  })
  .then(() => {
    console.log("promise测试2")
  })

function fn1() {
  console.log("fn1 function")
}

async function fn() {
  console.log("fn start")
  await fn1()
  console.log("fn end")
}

fn()
console.log("end")
```

### 2. 执行分析

| 步骤                       | 说明                               |
| -------------------------- | ---------------------------------- |
| **`console.log('start')`** | 同步任务，立即输出                 |
| **`setTimeout`**           | 注册宏任务，不立即执行             |
| **`new Promise(...)`**     | Promise 构造器里的代码是同步执行   |
| **第一个 `then`**          | `resolve()` 之后进入微任务队列     |
| **`async/await`**          | `await` 后面的逻辑会放进微任务队列 |
| **第二个 `then`**          | 依赖第一个 `then` 执行完成后再入队 |

### 3. 最终输出

```javascript
"start"
"promise测试 before"
"promise测试 after"
"fn start"
"fn1 function"
"end"
"promise测试1"
"fn end"
"promise测试2"
"timeout"
```

### 4. 关键结论

- `Promise` 构造器本身是同步执行。
- `then`、`await` 后续逻辑属于微任务。
- `setTimeout(..., 0)` 也要等当前宏任务和微任务都清空后才执行。

---

## 三、实现 Promise.all

### 1. 行为特点

| 行为                       | 说明                   |
| -------------------------- | ---------------------- |
| **全部成功才成功**         | 任意一个失败就整体失败 |
| **结果顺序保持和输入一致** | 不是按完成顺序返回     |
| **空数组直接成功**         | 结果是空数组           |

### 2. 参考实现

```typescript
function myPromiseAll<T extends readonly unknown[] | []>(
  promiseList: T,
): Promise<{ -readonly [K in keyof T]: Awaited<T[K]> }> {
  return new Promise((resolve, reject) => {
    if (promiseList.length === 0) {
      resolve([] as { -readonly [K in keyof T]: Awaited<T[K]> })
      return
    }

    const result = [] as { -readonly [K in keyof T]: Awaited<T[K]> }
    let finishedCount = 0

    promiseList.forEach((item, index) => {
      Promise.resolve(item).then(value => {
        result[index] = value as {
          -readonly [K in keyof T]: Awaited<T[K]>
        }[number]
        finishedCount++

        if (finishedCount === promiseList.length) {
          resolve(result)
        }
      }, reject)
    })
  })
}
```

### 3. 易错点

- 忘记处理空数组，导致 Promise 永远不结束。
- 只支持 Promise，不支持普通值。标准行为会先走 `Promise.resolve`。
- 按完成顺序 `push` 结果，导致返回顺序错误。

---

## 四、实现 Promise.allSettled

### 1. 行为特点

`Promise.allSettled` 不会因为单个任务失败而整体拒绝，它只关心 **所有任务都结束**。

### 2. 参考实现

```typescript
function myAllSettled<T extends readonly unknown[] | []>(
  promiseList: T,
): Promise<{ -readonly [K in keyof T]: PromiseSettledResult<Awaited<T[K]>> }> {
  return new Promise(resolve => {
    if (promiseList.length === 0) {
      resolve(
        [] as { -readonly [K in keyof T]: PromiseSettledResult<Awaited<T[K]>> },
      )
      return
    }

    const result = [] as {
      -readonly [K in keyof T]: PromiseSettledResult<Awaited<T[K]>>
    }
    let finishedCount = 0

    promiseList.forEach((item, index) => {
      Promise.resolve(item)
        .then(
          value => {
            result[index] = { status: "fulfilled", value } as {
              -readonly [K in keyof T]: PromiseSettledResult<Awaited<T[K]>>
            }[number]
          },
          reason => {
            result[index] = { status: "rejected", reason } as {
              -readonly [K in keyof T]: PromiseSettledResult<Awaited<T[K]>>
            }[number]
          },
        )
        .finally(() => {
          finishedCount++

          if (finishedCount === promiseList.length) {
            resolve(result)
          }
        })
    })
  })
}
```

### 3. 面试表达点

- `all` 关注“有一个失败就失败”。
- `allSettled` 关注“每个任务的最终状态”。
- `allSettled` 的返回值数组里，每一项都带 `status` 字段。

---

## 五、实现 Promise.race

### 1. 行为特点

`Promise.race` 只看谁最先 settled，不区分 fulfilled 还是 rejected。

### 2. 参考实现

```typescript
function myRace<T extends readonly unknown[] | []>(
  promiseList: T,
): Promise<Awaited<T[number]>> {
  return new Promise((resolve, reject) => {
    promiseList.forEach(item => {
      Promise.resolve(item).then(resolve, reject)
    })
  })
}
```

### 3. 易错点

- `race([])` 会一直保持 pending，这一点经常被忽略。
- `race` 不是“谁先成功返回谁”，而是“谁先有结果就用谁”。
