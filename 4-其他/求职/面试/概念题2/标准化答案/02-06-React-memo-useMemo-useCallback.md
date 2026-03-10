# React.memo / useMemo / useCallback

## 一、各自作用

| API | 作用 | 典型场景 |
| --- | --- | --- |
| **React.memo** | 对组件做**浅比较 props**，props 未变则跳过本次渲染（复用上次结果） | 纯展示组件、列表项、父组件频繁重渲染但 props 常不变 |
| **useMemo** | 缓存**某个计算结果**，依赖未变则返回上次结果 | 派生数据、复杂计算、避免重复创建大对象/数组 |
| **useCallback** | 缓存**函数引用**，依赖未变则返回上次函数 | 传给子组件的回调；配合 React.memo 时避免因回调引用变导致子组件无效重渲染 |

***

## 二、React.memo

**React.memo** 对函数组件做一层包装，用**浅比较**比较前后 props；若相同则跳过渲染。

```jsx
const Item = React.memo(function Item({ name }) {
  return <span>{name}</span>
})
// 父组件重渲染时，若 Item 的 props 未变，Item 不重渲染
```

若需要自定义比较，可传第二个参数：  
`React.memo(Comp, (prevProps, nextProps) => true/false)`。  
返回 true 表示“认为相等、不更新”。

***

## 三、useMemo

**useMemo** 把“计算过程”和“依赖”绑定，依赖不变就复用上次计算结果。

```jsx
const list = useMemo(() => 
  items.filter(i => i.visible).sort((a, b) => a.order - b.order),
  [items]
)
```

用于：昂贵计算、构造要传给子组件的对象/数组（避免引用总变导致子组件或 effect 无效更新）。

***

## 四、useCallback

**useCallback** 等价于：`useMemo(() => fn, deps)`，即缓存**函数本身**。常用于传给被 `React.memo` 包装的子组件的回调，避免父组件每次渲染都生成新函数导致子组件“props 变了”而重渲染。

```jsx
const onSave = useCallback(() => {
  submit(formData)
}, [formData])
return <MemoChild onSave={onSave} />
```

***

## 五、使用建议

- **不要滥用**：简单计算、简单回调，用 useMemo/useCallback 的维护与比较成本可能高于直接重算；先保证逻辑正确，再在**有可测量性能问题**时针对性优化。
- **配合 memo**：子组件用 React.memo 时，若传入的回调每次都是新引用，memo 会失效；此时对回调用 useCallback 才有意义。
- **依赖写全**：useMemo/useCallback 的依赖数组要写全，否则易出现陈旧闭包或难以理解的 bug。

***

## 六、面试答题要点

- **React.memo**：浅比较 props，不变则跳过渲染；用于纯展示、列表项等。
- **useMemo**：缓存计算结果，依赖不变则复用；用于复杂计算、派生数据。
- **useCallback**：缓存函数引用，常与 React.memo 配合，避免回调引用变导致子组件无效渲染。
- **注意**：不过度使用；依赖写全；在确有性能问题时再优化。
