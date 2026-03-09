# Promise 手写题

## 输出顺序

### 题目
```javascript
console.log('start');
setTimeout(() => {
  console.log('timeout');
}, 0);
new Promise((resolve, reject) => {
  console.log('promise测试 before');
  resolve();
  console.log('promise测试 after');
}).then(() => {
  console.log('promise测试1');
}).then(() => {
  console.log('promise测试2');
});

function fn1() {
  console.log('fn1 function');
}

async function fn() {
  console.log('fn start');
  const res = await fn1();
  console.log('fn end');
}

fn();
console.log('end');
```

### 答案
```javascript
'start'
'promise测试 before'
'promise测试 after'
'fn start'
'fn1 function'
'end'
'promise测试1'
'fn end'
'promise测试2'
'timeout'
```

## Promise.all()

```typescript
type IAwaited<T> = T extends Promise<infer F> ? F : T;

const myPromiseAll = <T extends readonly Promise<unknown>[] | []>(
  proList: T
): Promise<{ -readonly [key in keyof T]: IAwaited<T[key]> }> => {
  return new Promise((resolve, reject) => {
    let count = 0;
    const result = [] as { -readonly [key in keyof T]: IAwaited<T[key]> };
    proList.forEach((pro, index) => {
      pro.then(res => {
        result[index] = res;
        count++;
        if (count === proList.length) {
          resolve(result);
        }
      }, reject);
    });
  });
};
```

## Promise.allSettled()

```typescript
type IAwaited<T> = T extends Promise<infer F> ? F : T;

const myAllSettled = <T extends readonly Promise<unknown>[] | []>(
  proList: T
): Promise<{ -readonly [key in keyof T]: PromiseSettledResult<IAwaited<T[key]>> }> => {
  return new Promise(resolve => {
    const result = [] as { -readonly [key in keyof T]: PromiseSettledResult<IAwaited<T[key]>> };
    let count = 0;
    proList.forEach((pro, index) => {
      pro
        .then(
          res => {
            result[index] = { status: 'fulfilled', value: res };
          },
          err => {
            result[index] = { status: 'rejected', reason: err };
          }
        )
        .finally(() => {
          count++;
          if (count === proList.length) {
            resolve(result);
          }
        });
    });
  });
};
```

## Promise.race()

```typescript
type IAwaited<T> = T extends Promise<infer F> ? F : T;

const myRace = <T extends readonly Promise<any>[] | []>(
  proList: T
): Promise<IAwaited<T[number]>> => {
  return new Promise((resolve, reject) => {
    proList.forEach(pro => {
      pro.then(resolve, reject);
    });
  });
};
```
