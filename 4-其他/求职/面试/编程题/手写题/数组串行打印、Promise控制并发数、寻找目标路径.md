# 数组串行打印、Promise控制并发数、寻找目标路径

## 数组串行打印

```typescript
const printWithDelay = async (i_arr: number[]) => {
  for (let i = 0; i < i_arr.length; i++) {
    await delay(() => console.log(i_arr[i]), i_arr[i] * 1000);
  }
};

const delay = <T>(callback: (...args: unknown[]) => T, time = 1000): Promise<T> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(callback());
    }, time);
  });
};

// 测试（1秒钟后输出1，然后2秒钟后输出2，然后3秒钟后输出3……）
const arr = [1, 2, 3, 4, 5];
printWithDelay(arr);
```

## Promise 控制并发数

```typescript
function controlConcurrency(urlList: readonly string[], maxCount = 5) {
  const c_urlList = [...urlList];
  const proList: Promise<unknown>[] = [];
  const loop = () => {
    if (c_urlList.length === 0) return;
    proList.push(fetch(c_urlList.shift() ?? '').finally(loop));
  };
  [...new Array(maxCount)].forEach(loop);
  return proList;
}

// 测试
const urlList = new Array(100).fill(
  new URL('./images/wenjuan.png', import.meta.url).href
);

controlConcurrency(urlList);
```

## 寻找目标路径

```typescript
type IObjList = {
  value: IValue;
  children?: IObjList;
}[];
type IValue = string | number;

function findPath(objList: IObjList, target: IValue): number[] | undefined {
  let result: number[] | undefined;
  function recursion(i_objList: IObjList, indexList: number[] = []) {
    i_objList.forEach((obj, index) => {
      const i_indexList = [...indexList, index];
      if (obj.value === target) {
        result = i_indexList;
      }
      if (obj.children?.length) {
        recursion(obj.children, i_indexList);
      }
    });
  }
  recursion(objList);
  return result;
}

// 测试
const objList: IObjList = [
  {
    value: 'a',
    children: [
      {
        value: 'b'
      },
      {
        value: 'c',
        children: [
          {
            value: 'd'
          }
        ]
      }
    ]
  }
];

console.log(findPath(objList, 'a')); // [0]
console.log(findPath(objList, 'b')); // [0, 0]
console.log(findPath(objList, 'c')); // [0, 1]
console.log(findPath(objList, 'd')); // [0, 1, 0]
```
