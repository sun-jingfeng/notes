# instanceof、new

## 实现 instanceof

```typescript
function _instanceof(
  instance: object,
  classOrFunc: (new (...args: any) => any) | ((...args: any) => any)
) {
  if (instance && typeof instance === 'object') {
    let proto = Object.getPrototypeOf(instance);
    while (proto) {
      if (proto === classOrFunc.prototype) {
        return true;
      }
      proto = Object.getPrototypeOf(proto);
    }
  } else {
    return false;
  }
  return false;
}
```

## 实现 new 的过程

```typescript
function myNew<T extends any[]>(
  constructor: new (...args2: T) => any,
  ...args: T
) {
  const newObj = Object.create(constructor.prototype);
  constructor.call(newObj, ...args);
  return newObj;
}
```
