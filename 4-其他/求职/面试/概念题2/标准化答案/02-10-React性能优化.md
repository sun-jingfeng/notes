# React 性能优化

## 一、减少不必要渲染

| 手段 | 说明 |
| --- | --- |
| **React.memo** | 对组件做 props 浅比较，不变则跳过渲染 |
| **useMemo** | 缓存派生数据、大对象/数组，依赖不变则复用 |
| **useCallback** | 缓存传给子组件的回调，配合 memo 避免因回调引用变导致子组件重渲染 |
| **状态下沉** | 把 state 放到“够用”的最底层组件，避免顶层 state 导致整树重渲染 |

仅在有明确性能问题或列表项很多时再重点使用 memo/useMemo/useCallback，避免过度优化。

***

## 二、代码分割与懒加载

- **React.lazy + Suspense**：按路由或按模块懒加载组件，首屏只加载当前路由所需 JS。
- **路由级懒加载**：每个路由对应一个 lazy 组件，减小首包体积。

```jsx
const Page = React.lazy(() => import('./Page'))
<Suspense fallback={<Loading />}><Page /></Suspense>
```

***

## 三、列表优化

- **正确使用 key**：用稳定唯一 id，不用 index，避免列表增删时错误复用与状态错乱。
- **虚拟滚动**：长列表用 react-window、react-virtuoso 等只渲染可视区域，减少 DOM 数量。

***

## 四、状态与 Context

- **避免所有状态都放顶层**：能下沉就下沉，减少“根 state 一变整树渲染”的范围。
- **拆分 Context**：按业务拆成多个 Context，避免一个 Context 变化导致所有消费者重渲染；或把 Context 的值用 useMemo 包一层，减少引用变化。

***

## 五、表单与复杂 UI

- **大型表单**：可考虑非受控 + ref，或使用 **react-hook-form** 等减少受控导致的频繁重渲染。
- **重计算**：放到 useMemo 或 worker，避免阻塞主线程。

***

## 六、面试答题要点

- **减少渲染**：memo、useMemo、useCallback、状态下沉。
- **代码分割**：React.lazy + Suspense、按路由懒加载。
- **列表**：稳定 key、虚拟滚动。
- **状态与 Context**：合理拆分、避免单一大 Context 导致全量重渲染。
- **表单**：非受控或 react-hook-form 等减轻渲染压力。
