# 数组串行打印、Promise控制并发数、寻找目标路径

## 一、说明

这篇笔记收的是三道常见“工具函数型”手写题。它们虽然不属于同一知识点，但都比较高频，适合放在一起复习：

| 题目                   | 重点                   |
| ---------------------- | ---------------------- |
| **数组串行打印**       | `async/await` 串行控制 |
| **Promise 控制并发数** | 限流调度               |
| **寻找目标路径**       | DFS 路径记录           |

---

## 二、数组串行打印

### 1. 核心思路

只要在循环里 `await` 一个延迟 Promise，就能保证“前一个任务结束后，再执行下一个任务”。

### 2. 参考实现

```typescript
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

async function printWithDelay(list: number[]): Promise<void> {
  for (const num of list) {
    await sleep(num * 1000)
    console.log(num)
  }
}

const arr = [1, 2, 3, 4, 5]
printWithDelay(arr)
```

### 3. 面试表达点

- `forEach` 不能很好地配合 `await` 做串行流程控制。
- `for...of + await` 是最直观、最稳的写法。

---

## 三、Promise 控制并发数

### 1. 核心思路

“控制并发数”的本质是：

- 同一时刻最多只让 `limit` 个任务处于执行中。
- 某个任务结束后，立刻补下一个任务进去。
- 最终结果顺序仍和原任务顺序一致。

### 2. 参考实现

```typescript
async function runWithConcurrency<T>(
  taskList: Array<() => Promise<T>>,
  limit = 5,
): Promise<T[]> {
  const result = new Array<T>(taskList.length)
  let nextIndex = 0

  async function worker(): Promise<void> {
    while (nextIndex < taskList.length) {
      const currentIndex = nextIndex
      nextIndex++

      result[currentIndex] = await taskList[currentIndex]()
    }
  }

  const workerCount = Math.min(limit, taskList.length)
  await Promise.all(Array.from({ length: workerCount }, () => worker()))

  return result
}

const urlList = ["url-1", "url-2", "url-3"]
const taskList = urlList.map(url => () => fetch(url).then(res => res.text()))

runWithConcurrency(taskList, 2).then(console.log)
```

### 3. 易错点

- 只返回一组 Promise，却没有 `await` 所有任务完成，调用方拿不到最终结果。
- 没有维护结果下标，最终顺序会变成“完成顺序”。
- 并发控制通常更适合接收“任务函数数组”，而不是已经开始执行的 Promise 数组。

---

## 四、寻找目标路径

### 1. 题目理解

给定一棵树形结构，查找目标节点，并返回它从根节点开始的索引路径。

### 2. 核心思路

用 DFS 遍历整棵树，同时把当前路径记录下来：

- 进入子节点时，把当前下标追加到路径里。
- 找到目标值后直接返回当前路径。
- 如果当前分支找不到，再回溯继续搜别的分支。

### 3. 参考实现

```typescript
type TreeValue = string | number

type TreeItem = {
  value: TreeValue
  children?: TreeItem[]
}

function findPath(tree: TreeItem[], target: TreeValue): number[] | undefined {
  function dfs(nodes: TreeItem[], path: number[]): number[] | undefined {
    for (let i = 0; i < nodes.length; i++) {
      const currentPath = [...path, i]

      if (nodes[i].value === target) {
        return currentPath
      }

      if (nodes[i].children?.length) {
        const result = dfs(nodes[i].children as TreeItem[], currentPath)
        if (result) {
          return result
        }
      }
    }

    return undefined
  }

  return dfs(tree, [])
}
```

### 4. 测试示例

```typescript
const tree: TreeItem[] = [
  {
    value: "a",
    children: [
      { value: "b" },
      {
        value: "c",
        children: [{ value: "d" }],
      },
    ],
  },
]

console.log(findPath(tree, "a")) // [0]
console.log(findPath(tree, "b")) // [0, 0]
console.log(findPath(tree, "c")) // [0, 1]
console.log(findPath(tree, "d")) // [0, 1, 0]
```
