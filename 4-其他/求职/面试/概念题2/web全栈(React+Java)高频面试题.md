# web全栈(React+Java) 高频面试题

> 基于简历技术栈整理，覆盖前端（JS/TS、React、工程化、浏览器/网络）、后端（Java、Spring Boot、MySQL、Redis、微服务、MQ、Docker）及场景设计题。每题列出**答题要点**，方便快速复习。

***

## 一、JavaScript / TypeScript

### 1. 数据类型与类型判断

**基本类型**：`string`、`number`、`boolean`、`undefined`、`null`、`symbol`、`bigint`（7 种）

**引用类型**：`object`（包含 Array、Function、Date、RegExp、Map、Set 等）

| 判断方式 | 适用场景 | 注意点 |
| --- | --- | --- |
| **`typeof`** | 基本类型 | `typeof null === 'object'`（历史 bug） |
| **`instanceof`** | 引用类型 | 跨 iframe 失效；基于原型链判断 |
| **`Object.prototype.toString.call()`** | 所有类型 | 最准确，返回 `[object Type]` |
| **`Array.isArray()`** | 判断数组 | 推荐用于数组判断 |

***

### 2. == 和 === 的区别

| 运算符 | 说明 |
| --- | --- |
| **`==`** | 宽松相等，会进行**隐式类型转换**后再比较 |
| **`===`** | 严格相等，类型和值都必须相同，不做类型转换 |

隐式转换规则要点：

- `null == undefined` → `true`，但它们与其他值比较都为 `false`
- 布尔值先转数字，字符串与数字比较时字符串转数字
- 对象与基本类型比较时调用 `valueOf()` / `toString()`

> 💡 实际开发中始终使用 `===`，ESLint 的 `eqeqeq` 规则会强制此约定。

***

### 3. var / let / const 的区别

| 特性 | **var** | **let** | **const** |
| --- | --- | --- | --- |
| **作用域** | 函数作用域 | 块级作用域 | 块级作用域 |
| **变量提升** | ✅ 提升并初始化为 `undefined` | ✅ 提升但不初始化（暂时性死区） | ✅ 提升但不初始化 |
| **重复声明** | 允许 | ❌ 不允许 | ❌ 不允许 |
| **重新赋值** | 允许 | 允许 | ❌ 不允许（引用地址不可变） |

**暂时性死区（TDZ）**：在 `let` / `const` 声明之前访问变量会抛出 `ReferenceError`，虽然变量已被提升，但在声明语句执行之前不可用。

***

### 4. 箭头函数与普通函数的区别

| 区别 | **普通函数** | **箭头函数** |
| --- | --- | --- |
| **this** | 运行时确定，取决于调用方式 | **定义时**确定，继承外层作用域的 `this` |
| **arguments** | 有 `arguments` 对象 | ❌ 没有，需用 `...rest` 替代 |
| **构造函数** | 可用 `new` 调用 | ❌ 不能用 `new` 调用 |
| **prototype** | 有 `prototype` 属性 | ❌ 没有 |

***

### 5. 闭包

**闭包** = 函数 + 其引用的外层作用域变量。当内部函数被返回或传递到外部时，它仍然持有对外层变量的引用，形成闭包。

**应用场景**：

- 数据封装（模块模式）
- 函数柯里化
- 防抖 / 节流
- React Hooks 内部原理

**注意**：闭包会导致外层变量无法被 GC 回收，大量闭包可能造成内存泄漏。

***

### 6. 原型与原型链

- 每个函数都有 `prototype` 属性，指向原型对象
- 每个对象都有 `__proto__`（`[[Prototype]]`），指向其构造函数的 `prototype`
- 属性查找沿原型链向上，直到 `Object.prototype.__proto__` → `null`

```
实例 → 构造函数.prototype → Object.prototype → null
```

`instanceof` 的原理就是沿原型链查找 `constructor.prototype` 是否存在。

***

### 7. this 指向

| 调用方式 | **this 指向** |
| --- | --- |
| **全局调用** `fn()` | 非严格 → `window`；严格 → `undefined` |
| **对象方法** `obj.fn()` | `obj` |
| **构造函数** `new Fn()` | 新创建的实例 |
| **call / apply / bind** | 显式指定的对象 |
| **箭头函数** | 定义时外层的 `this`（不可修改） |
| **事件处理** | 绑定事件的 DOM 元素 |

***

### 8. Promise 与异步编程

**Promise 三种状态**：`pending` → `fulfilled` / `rejected`，状态不可逆。

| API | 说明 |
| --- | --- |
| **`Promise.all`** | 全部成功才成功；任一失败即失败 |
| **`Promise.allSettled`** | 等待全部完成，不论成功失败 |
| **`Promise.race`** | 取最先完成的结果（不论成功失败） |
| **`Promise.any`** | 取最先**成功**的结果；全部失败才失败 |

**async / await** 是 Promise 的语法糖：

- `async` 函数返回 Promise
- `await` 暂停执行，等待 Promise resolve
- 错误处理用 `try/catch`

**宏任务与微任务**：

| 类型 | 示例 |
| --- | --- |
| **微任务** | `Promise.then`、`MutationObserver`、`queueMicrotask` |
| **宏任务** | `setTimeout`、`setInterval`、`requestAnimationFrame`、I/O |

**执行顺序**：同步代码 → 微任务队列清空 → 取一个宏任务 → 微任务队列清空 → 下一个宏任务……

***

### 9. 深拷贝与浅拷贝

| 方式 | 类型 | 说明 |
| --- | --- | --- |
| **`Object.assign`** | 浅拷贝 | 只拷贝第一层 |
| **展开运算符 `...`** | 浅拷贝 | 只拷贝第一层 |
| **`JSON.parse(JSON.stringify())`** | 深拷贝 | 不支持函数、`undefined`、循环引用、`Date`、`RegExp` |
| **`structuredClone()`** | 深拷贝 | 原生 API，支持循环引用，不支持函数 |
| **手写递归** | 深拷贝 | 最灵活，需处理循环引用（`WeakMap`） |

***

### 10. 事件循环（Event Loop）

```
    ┌─────────────────────────────────┐
    │          调用栈（Call Stack）      │ ← 同步代码在此执行
    └─────────┬───────────────────────┘
              │ 同步执行完毕
              ▼
    ┌─────────────────────────────────┐
    │        微任务队列（Microtask）     │ ← 全部清空
    └─────────┬───────────────────────┘
              │ 微任务清空后
              ▼
    ┌─────────────────────────────────┐
    │     宏任务队列（取一个 Macrotask）  │ ← 取一个执行
    └─────────┬───────────────────────┘
              │ 执行完毕后回到微任务
              ▼
           循环往复
```

***

### 11. 防抖与节流

| 方式 | 含义 | 场景 |
| --- | --- | --- |
| **防抖（debounce）** | 连续触发时只执行**最后一次**，中间重新计时 | 搜索框输入、窗口 resize |
| **节流（throttle）** | 固定时间间隔内**最多执行一次** | 滚动事件、按钮防重复点击 |

```js
// 防抖
function debounce(fn, delay) {
  let timer = null
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

// 节流（时间戳版）
function throttle(fn, interval) {
  let last = 0
  return function (...args) {
    const now = Date.now()
    if (now - last >= interval) {
      last = now
      fn.apply(this, args)
    }
  }
}
```

***

### 12. ES6+ 核心特性

| 特性 | 说明 |
| --- | --- |
| **解构赋值** | 数组、对象解构，支持默认值、重命名 |
| **模板字符串** | 反引号 `` ` `` 包裹，支持 `${}` 插值和多行 |
| **展开运算符 `...`** | 数组/对象展开、函数剩余参数 |
| **`for...of`** | 遍历可迭代对象（数组、Map、Set、字符串） |
| **`Symbol`** | 创建唯一标识符，用于属性键防冲突 |
| **`Map` / `Set`** | Map：任意类型键；Set：值唯一 |
| **`Proxy` / `Reflect`** | 元编程，拦截对象操作（Vue3 响应式基础） |
| **可选链 `?.`** | 安全访问深层属性 |
| **空值合并 `??`** | 仅 `null` / `undefined` 时取默认值 |

***

### 13. TypeScript 高频题

| 问题 | 要点 |
| --- | --- |
| **interface vs type** | interface 可合并声明、支持 `extends`；type 支持联合/交叉类型、映射类型，更灵活 |
| **泛型** | 类型参数化，提高复用性；常见约束 `<T extends SomeType>` |
| **联合类型与交叉类型** | `A \| B` 取其一；`A & B` 合并 |
| **enum** | 编译为对象，可用 `const enum` 内联优化 |
| **any vs unknown** | `unknown` 更安全，使用前必须类型收窄 |
| **类型守卫** | `typeof`、`instanceof`、`in`、自定义 `is` 谓词 |
| **工具类型** | `Partial`、`Required`、`Pick`、`Omit`、`Record`、`ReturnType` |

***

## 二、React

### 1. React 生命周期（类组件 → Hooks 对照）

| 生命周期阶段 | 类组件 | Hooks 等价 |
| --- | --- | --- |
| **挂载** | `componentDidMount` | `useEffect(() => {}, [])` |
| **更新** | `componentDidUpdate` | `useEffect(() => {}, [deps])` |
| **卸载** | `componentWillUnmount` | `useEffect` 返回的清理函数 |
| **错误捕获** | `componentDidCatch` | 暂无 Hook 等价，仍需 Error Boundary |

***

### 2. 虚拟 DOM 与 Diff 算法

**虚拟 DOM（Virtual DOM）** 是用 JS 对象描述真实 DOM 结构的轻量表示。

**Diff 策略**：

| 策略 | 说明 |
| --- | --- |
| **同层比较** | 只对比同一层级的节点，不跨层移动 |
| **类型判断** | 类型不同直接销毁重建；类型相同则复用节点，更新属性 |
| **key 优化** | 列表中通过 `key` 识别元素，最小化 DOM 操作 |

> 💡 `key` 不要用 `index`：列表项增删/重排时，`index` 会导致错误复用，引发状态混乱和性能浪费。

***

### 3. Fiber 架构

**解决的问题**：React 15 的递归渲染（Stack Reconciler）一旦开始就不能中断，大组件树会阻塞主线程导致卡顿。

**核心思想**：将渲染工作拆分为多个小的 **Fiber 节点**（链表结构），每个节点是一个工作单元。

| 特性 | 说明 |
| --- | --- |
| **可中断** | 每完成一个 Fiber 节点后检查是否有更高优先级任务 |
| **优先级调度** | 用户交互 > 动画 > 数据更新，高优先级可打断低优先级 |
| **双缓冲树** | `current` 树和 `workInProgress` 树，构建完成后一次性切换 |
| **时间切片** | 利用 `requestIdleCallback`（实际为 MessageChannel）在浏览器空闲时执行 |

**两个阶段**：

- **Render 阶段**（可中断）：构建 Fiber 树、执行 Diff，标记需要变更的节点
- **Commit 阶段**（不可中断）：将变更同步应用到真实 DOM

***

### 4. Hooks 核心原理与常见 Hook

| Hook | 用途 | 关键注意点 |
| --- | --- | --- |
| **`useState`** | 状态管理 | 异步批量更新；用函数形式获取最新值 |
| **`useEffect`** | 副作用 | 依赖数组控制执行时机；清理函数防内存泄漏 |
| **`useRef`** | 持久化引用 | 值变化不触发重渲染；访问 DOM 元素 |
| **`useMemo`** | 缓存计算结果 | 依赖未变时跳过计算 |
| **`useCallback`** | 缓存函数引用 | 配合 `React.memo` 避免子组件不必要渲染 |
| **`useContext`** | 跨组件传值 | 值变化会导致所有消费者重渲染 |
| **`useReducer`** | 复杂状态逻辑 | 类似 Redux，适合多 action 场景 |
| **`useLayoutEffect`** | DOM 操作前同步执行 | 在浏览器绘制之前执行，适用于 DOM 测量/修改 |

**Hooks 规则**：

- 只能在函数组件或自定义 Hook 的**顶层**调用
- 不能在条件、循环、嵌套函数中调用
- 原因：Hooks 依赖调用顺序（链表），条件调用会导致顺序错乱

***

### 5. React 状态更新机制

| 概念 | 说明 |
| --- | --- |
| **批量更新** | React 18 默认所有更新都自动批处理（包括 setTimeout、Promise 回调中） |
| **状态不可变** | `setState` 必须传新引用（对象/数组需创建新实例），否则 React 检测不到变化 |
| **函数式更新** | `setState(prev => prev + 1)` 确保基于最新值计算 |
| **`flushSync`** | 强制同步更新，跳出批处理 |

***

### 6. React.memo / useMemo / useCallback

| API | 作用 | 使用场景 |
| --- | --- | --- |
| **`React.memo`** | 包裹组件，props 不变则跳过渲染 | 纯展示组件、列表项组件 |
| **`useMemo`** | 缓存**计算结果** | 复杂计算、派生数据 |
| **`useCallback`** | 缓存**函数引用** | 传给 `React.memo` 子组件的回调 |

> 💡 不要滥用：简单计算 `useMemo` 的缓存开销可能大于重新计算。优先在出现可测量的性能问题时使用。

***

### 7. React Router

| 问题 | 要点 |
| --- | --- |
| **路由模式** | `BrowserRouter`（History API，需服务端配置）；`HashRouter`（hash，无需服务端配置） |
| **嵌套路由** | `<Outlet />` 渲染子路由组件 |
| **路由传参** | `useParams`（动态路由）、`useSearchParams`（查询参数）、`useLocation().state`（state） |
| **路由守卫** | React Router 无内置守卫，通过高阶组件或布局组件实现权限拦截 |
| **懒加载** | `React.lazy(() => import(...))` + `<Suspense>` |

***

### 8. Redux / RTK 状态管理

| 概念 | 说明 |
| --- | --- |
| **单向数据流** | `dispatch(action)` → `reducer` → 新 `state` → 视图更新 |
| **不可变更新** | reducer 必须返回新对象；RTK 内置 Immer 可用"可变"写法 |
| **中间件** | RTK 默认包含 `redux-thunk` 处理异步；日志、持久化等通过中间件扩展 |
| **RTK Query** | 数据获取与缓存方案，类似 React Query |
| **`createSlice`** | RTK 核心 API，自动生成 action creator 和 reducer |

***

### 9. 自定义 Hook

**本质**：以 `use` 开头的函数，内部可调用其他 Hook，将**可复用的状态逻辑**抽离出来。

常见自定义 Hook：

- `useDebounce` / `useThrottle`
- `useLocalStorage`
- `useFetch`（请求与加载状态封装）
- `useClickOutside`
- `useMediaQuery`

设计原则：单一职责、可组合、返回值语义清晰。

***

### 10. React 性能优化

| 优化方向 | 手段 |
| --- | --- |
| **减少不必要渲染** | `React.memo`、`useMemo`、`useCallback`、状态下沉 |
| **代码分割** | `React.lazy` + `Suspense`、路由级懒加载 |
| **列表优化** | 虚拟滚动（react-window / react-virtuoso）、正确使用 `key` |
| **状态管理** | 避免将所有状态提升到顶层；合理拆分 Context |
| **大型表单** | 非受控组件 / react-hook-form 减少渲染次数 |

***

## 三、前端工程化

### 1. Vite 与 Webpack 对比

| 对比项 | **Vite** | **Webpack** |
| --- | --- | --- |
| **开发模式** | 基于原生 ESM，按需编译 | 全量打包后启动 |
| **启动速度** | 极快（毫秒级） | 较慢（需构建完整 bundle） |
| **HMR** | 基于 ESM，只更新变更模块 | 重新构建受影响的 chunk |
| **生产构建** | 底层用 Rollup | 自身打包 |
| **配置复杂度** | 开箱即用，配置少 | 高度可配置，学习成本高 |
| **生态** | 快速增长 | 最成熟，插件最丰富 |

***

### 2. 模块化规范

| 规范 | 特点 |
| --- | --- |
| **CommonJS (CJS)** | `require` / `module.exports`；同步加载；Node.js 默认 |
| **ES Module (ESM)** | `import` / `export`；静态分析、Tree Shaking；浏览器原生支持 |
| **AMD** | `define` / `require`；异步加载；已过时（RequireJS） |
| **UMD** | 兼容 CJS + AMD + 全局变量；常用于库发布 |

**ESM vs CJS 核心区别**：

| | **ESM** | **CJS** |
| --- | --- | --- |
| **加载** | 编译时静态分析 | 运行时动态加载 |
| **导出** | 值的引用（live binding） | 值的拷贝 |
| **Tree Shaking** | ✅ 支持 | ❌ 不支持 |
| **顶层 await** | ✅ 支持 | ❌ 不支持 |

***

### 3. Tree Shaking

**原理**：基于 ESM 的静态分析，在构建时标记并移除未被引用的导出代码（dead code elimination）。

**失效的常见原因**：

- 使用 CJS 模块（`require`）
- 代码有副作用（如模块顶层执行了代码），需在 `package.json` 中配置 `"sideEffects"` 字段
- 动态导入路径（`import(variable)`）

***

### 4. 微前端

| 问题 | 要点 |
| --- | --- |
| **核心价值** | 多团队独立开发/部署/技术栈不受限 |
| **主流方案** | qiankun（基于 single-spa）、Module Federation（Webpack 5）、iframe |
| **JS 沙箱** | qiankun：快照沙箱（legacySandbox）、Proxy 沙箱（proxySandbox），隔离全局变量污染 |
| **CSS 隔离** | Shadow DOM、CSS Module、postcss 命名空间、`experimentalStyleIsolation` |
| **通信机制** | props 传递、全局状态（`initGlobalState`）、CustomEvent、localStorage |
| **路由** | 主应用管理路由前缀，子应用使用相对路径 |

***

## 四、浏览器与网络

### 1. HTTP 缓存

| 类型 | 机制 | 头部字段 |
| --- | --- | --- |
| **强缓存** | 直接用本地缓存，不发请求 | `Cache-Control: max-age=xxx`、`Expires` |
| **协商缓存** | 发请求验证资源是否变化，未变返回 304 | `ETag` / `If-None-Match`、`Last-Modified` / `If-Modified-Since` |

**`Cache-Control` 常用值**：`max-age`、`no-cache`（走协商缓存）、`no-store`（不缓存）、`public`、`private`

> 💡 面试延伸：前端部署时 HTML 用 `no-cache`，静态资源用内容哈希 + 长期强缓存。

***

### 2. 从输入 URL 到页面渲染

```
URL 解析 → DNS 解析 → TCP 三次握手 → (TLS 握手) → HTTP 请求
    → 服务器处理并返回响应
    → 浏览器解析 HTML → 构建 DOM 树
    → 解析 CSS → 构建 CSSOM 树
    → DOM + CSSOM → 渲染树（Render Tree）
    → 布局（Layout）→ 绘制（Paint）→ 合成（Composite）→ 显示
```

**关键优化点**：DNS 预解析、资源预加载、CSS 放头部、JS 放底部或 `defer`/`async`、减少重排重绘。

***

### 3. 跨域与解决方案

**同源策略**：协议 + 域名 + 端口，三者完全相同才同源。

| 方案 | 适用场景 |
| --- | --- |
| **CORS** | 主流方案，服务端设置 `Access-Control-Allow-Origin` 等响应头 |
| **代理（Proxy）** | 开发环境 Vite/Webpack devServer 代理 |
| **Nginx 反向代理** | 生产环境，同域转发 |
| **JSONP** | 仅 GET，已过时 |

**CORS 预检请求（Preflight）**：非简单请求（如 `PUT`、自定义头部、`Content-Type: application/json`）先发 `OPTIONS` 请求。

***

### 4. HTTP/1.1 vs HTTP/2 vs HTTP/3

| 特性 | **HTTP/1.1** | **HTTP/2** | **HTTP/3** |
| --- | --- | --- | --- |
| **连接** | 持久连接，但有队头阻塞 | 多路复用 | 基于 QUIC（UDP），无队头阻塞 |
| **头部** | 文本，冗余大 | HPACK 压缩 | QPACK 压缩 |
| **Server Push** | ❌ | ✅ | ✅ |

***

### 5. HTTPS 与加密

**HTTPS = HTTP + TLS/SSL**

TLS 握手要点：

1. 客户端发起请求，传递支持的加密套件列表
2. 服务器返回证书（含公钥）和选定的加密套件
3. 客户端验证证书，用公钥加密预主密钥发给服务端
4. 双方根据预主密钥生成**对称密钥**，后续通信用对称加密

**非对称加密** 用于密钥交换，**对称加密** 用于数据传输（性能高）。

***

### 6. Cookie / Session / Token（JWT）

| 方案 | 存储位置 | 特点 |
| --- | --- | --- |
| **Cookie** | 浏览器 | 自动携带、有大小限制（4KB）、可设 HttpOnly 防 XSS |
| **Session** | 服务端 | 依赖 Cookie 存 Session ID；有状态，集群需共享 Session |
| **JWT** | 客户端（localStorage / Cookie） | 无状态，服务端不存储；包含 Header.Payload.Signature |

**JWT 结构**：`Header`（算法类型）+ `Payload`（用户数据、过期时间）+ `Signature`（防篡改签名）

**JWT 缺点**：无法主动失效（除非引入黑名单机制）、体积较大、Payload 仅 Base64 编码（非加密）。

***

### 7. XSS 与 CSRF

| 攻击 | 原理 | 防御 |
| --- | --- | --- |
| **XSS** | 注入恶意脚本到页面 | 输出编码、CSP、HttpOnly Cookie、React 默认转义 |
| **CSRF** | 利用用户已登录状态伪造请求 | CSRF Token、SameSite Cookie、Referer 校验 |

***

## 五、Java 基础

### 1. 面向对象三大特性

| 特性 | 说明 |
| --- | --- |
| **封装** | 将数据和行为包装在类中，通过访问修饰符控制可见性 |
| **继承** | 子类继承父类的属性和方法，实现代码复用；Java 单继承 |
| **多态** | 同一方法在不同对象上表现不同；编译看左边，运行看右边（方法重写 + 父类引用指向子类对象） |

***

### 2. == 和 equals 的区别

| | **==** | **equals** |
| --- | --- | --- |
| **基本类型** | 比较**值** | 不适用（基本类型非对象） |
| **引用类型** | 比较**内存地址** | 默认同 `==`，但 `String`、`Integer` 等重写为比较**值** |

`String` 常量池：字面量创建的字符串会放入常量池，`new String()` 不会。

```java
String a = "hello";           // 常量池
String b = "hello";           // 同一常量池引用
String c = new String("hello"); // 堆中新对象

a == b;       // true（同一常量池引用）
a == c;       // false（不同对象）
a.equals(c);  // true（值相同）
```

***

### 3. String / StringBuilder / StringBuffer

| 类 | 可变性 | 线程安全 | 性能 |
| --- | --- | --- | --- |
| **String** | 不可变 | 安全（天然不可变） | 频繁拼接效率低（每次创建新对象） |
| **StringBuilder** | 可变 | ❌ 不安全 | 最快（单线程推荐） |
| **StringBuffer** | 可变 | ✅ 安全（synchronized） | 较慢 |

***

### 4. 集合框架

```
    Collection
        │
        ├── List（有序、可重复）
        │       ├── ArrayList   ← 数组，查询快 O(1)，增删慢
        │       └── LinkedList  ← 双向链表，增删快，查询慢
        │
        ├── Set（无序、不可重复）
        │       ├── HashSet     ← HashMap 实现
        │       ├── LinkedHashSet ← 保持插入顺序
        │       └── TreeSet     ← 红黑树，有序
        │
        └── Queue
                └── LinkedList / PriorityQueue

    Map（键值对）
        ├── HashMap     ← 数组 + 链表/红黑树（JDK8+）
        ├── LinkedHashMap ← 保持插入/访问顺序
        ├── TreeMap     ← 红黑树，键有序
        └── ConcurrentHashMap ← 线程安全
```

**HashMap 高频考点**：

| 问题 | 要点 |
| --- | --- |
| **底层结构** | 数组 + 链表 + 红黑树（链表长度 ≥ 8 且数组长度 ≥ 64 时转红黑树） |
| **初始容量/扩容** | 默认 16，负载因子 0.75，扩容为 2 倍 |
| **hash 计算** | `(h = key.hashCode()) ^ (h >>> 16)`，高低位混合减少碰撞 |
| **线程安全** | 不安全；多线程用 `ConcurrentHashMap`（分段锁 → CAS + synchronized） |
| **为什么容量是 2 的幂** | `(n - 1) & hash` 替代取模运算，效率更高 |

***

### 5. 多线程

| 概念 | 要点 |
| --- | --- |
| **创建线程** | 继承 `Thread`、实现 `Runnable`、实现 `Callable`（有返回值）、线程池 |
| **线程状态** | NEW → RUNNABLE → BLOCKED / WAITING / TIMED_WAITING → TERMINATED |
| **synchronized** | 对象锁 / 类锁，可重入；JDK6 后优化（偏向锁 → 轻量级锁 → 重量级锁） |
| **volatile** | 保证可见性和禁止指令重排；不保证原子性 |
| **线程池** | `ThreadPoolExecutor` 七大参数：核心线程数、最大线程数、存活时间、时间单位、工作队列、线程工厂、拒绝策略 |
| **拒绝策略** | AbortPolicy（抛异常）、CallerRunsPolicy（调用者执行）、DiscardPolicy（丢弃）、DiscardOldestPolicy（丢最旧） |

***

### 6. JVM 基础

| 区域 | 说明 |
| --- | --- |
| **堆** | 对象实例，GC 主要区域；分新生代（Eden + S0 + S1）和老年代 |
| **栈** | 线程私有，存放栈帧（局部变量、操作数栈、方法引用） |
| **方法区（元空间）** | 类信息、常量池、静态变量；JDK8 用元空间（本地内存）替代永久代 |
| **程序计数器** | 当前线程执行的字节码行号 |

**GC 算法**：

| 算法 | 说明 |
| --- | --- |
| **标记-清除** | 标记存活对象，清除未标记；产生碎片 |
| **标记-整理** | 标记后将存活对象压缩到一端；无碎片 |
| **复制** | Eden 存活对象复制到 Survivor；新生代使用 |
| **分代收集** | 新生代用复制算法，老年代用标记-整理 |

***

### 7. 异常体系

```
    java.lang.Throwable
        │
        ├── Error（不可恢复，如 OOM、StackOverflow）
        │
        └── Exception
                ├── RuntimeException（运行时异常，unchecked）
                │       ├── NullPointerException
                │       ├── IndexOutOfBoundsException
                │       └── ClassCastException
                │
                └── 编译时异常（checked，必须处理）
                        ├── IOException
                        └── SQLException
```

| 区别 | **编译时异常** | **运行时异常** |
| --- | --- | --- |
| **检查** | 编译器强制要求处理 | 编译器不检查 |
| **处理** | 必须 try/catch 或 throws | 可以不处理 |
| **常见** | IOException、SQLException | NPE、数组越界 |

***

## 六、Spring Boot

### 1. Spring Boot 自动配置原理

```
@SpringBootApplication
    ├── @SpringBootConfiguration  ← 本质是 @Configuration
    ├── @EnableAutoConfiguration  ← 核心：自动配置
    │       └── @Import(AutoConfigurationImportSelector.class)
    │               └── 加载 META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports
    │               └── 通过 @Conditional 系列注解判断是否生效
    └── @ComponentScan            ← 包扫描
```

**关键**：`AutoConfigurationImportSelector` 扫描所有 jar 包中的自动配置类，配合 `@ConditionalOnClass`、`@ConditionalOnMissingBean` 等条件注解决定是否加载。

***

### 2. Spring IOC 与 DI

| 概念 | 说明 |
| --- | --- |
| **IOC（控制反转）** | 将对象的创建和管理交给 Spring 容器，而非手动 `new` |
| **DI（依赖注入）** | IOC 的实现方式，容器自动将依赖对象注入到使用者中 |

**注入方式**：

| 方式 | 注解 | 推荐度 |
| --- | --- | --- |
| **构造器注入** | 不需要注解（单构造器自动注入） | ✅ 最推荐（不可变、便于测试） |
| **Setter 注入** | `@Autowired` | 可选依赖时使用 |
| **字段注入** | `@Autowired` | ❌ 不推荐（不利于测试和不可变性） |

***

### 3. Spring AOP

**AOP（面向切面编程）**：将日志、事务、权限等横切关注点从业务代码中分离。

| 概念 | 说明 |
| --- | --- |
| **切面（Aspect）** | 封装横切逻辑的类（`@Aspect`） |
| **切入点（Pointcut）** | 定义在哪些方法上生效 |
| **通知（Advice）** | `@Before`、`@After`、`@Around`、`@AfterReturning`、`@AfterThrowing` |
| **代理方式** | JDK 动态代理（接口）、CGLIB（类，默认） |

**`@Around` 通知**是最强大的，可以控制目标方法是否执行、修改入参和返回值。

***

### 4. Bean 的作用域与生命周期

**作用域**：

| 作用域 | 说明 |
| --- | --- |
| **singleton** | 默认，整个容器只有一个实例 |
| **prototype** | 每次获取创建新实例 |
| **request** | 每个 HTTP 请求一个实例 |
| **session** | 每个 HTTP Session 一个实例 |

**生命周期**：实例化 → 属性注入 → `Aware` 回调 → `@PostConstruct` → `InitializingBean` → 自定义 init → 使用 → `@PreDestroy` → `DisposableBean` → 自定义 destroy

***

### 5. Spring 事务管理

| 问题 | 要点 |
| --- | --- |
| **声明式事务** | `@Transactional`，基于 AOP 代理实现 |
| **传播行为** | `REQUIRED`（默认，有则加入无则新建）、`REQUIRES_NEW`（总是新建）、`NESTED`（嵌套事务） |
| **隔离级别** | `DEFAULT`、`READ_UNCOMMITTED`、`READ_COMMITTED`、`REPEATABLE_READ`、`SERIALIZABLE` |
| **事务失效场景** | 自调用（非代理调用）、非 public 方法、异常被 catch 未抛出、抛出非 RuntimeException 未配置 rollbackFor |

> 💡 使用 `@Transactional` 时建议显式指定 `rollbackFor = Exception.class`。

***

### 6. 常用注解

| 注解 | 说明 |
| --- | --- |
| **`@RestController`** | `@Controller` + `@ResponseBody`，返回 JSON |
| **`@RequestMapping`** | 请求映射；`@GetMapping`、`@PostMapping` 等简写 |
| **`@RequestBody`** | 将请求体 JSON 反序列化为对象 |
| **`@PathVariable`** | 获取路径参数 |
| **`@RequestParam`** | 获取查询参数 |
| **`@Autowired`** | 按类型注入 |
| **`@Value`** | 注入配置文件属性 |
| **`@ConfigurationProperties`** | 批量绑定配置属性到对象 |

***

## 七、MySQL

### 1. 索引

| 问题 | 要点 |
| --- | --- |
| **底层结构** | InnoDB 默认 B+ 树；叶子节点存数据（聚簇索引）或主键值（二级索引） |
| **聚簇 vs 二级索引** | 聚簇索引：叶子存完整行数据（主键索引）；二级索引：叶子存主键值，需**回表** |
| **覆盖索引** | 查询的列都在索引中，无需回表 |
| **最左前缀原则** | 联合索引 `(a, b, c)` 按最左列开始匹配：`a`、`a,b`、`a,b,c` 可走索引 |
| **索引失效** | 对索引列函数计算、隐式类型转换、`LIKE '%xx'`、`OR`（非全索引列）、`!=`/`NOT IN` |

***

### 2. 事务与隔离级别

**ACID**：原子性（Atomicity）、一致性（Consistency）、隔离性（Isolation）、持久性（Durability）

| 隔离级别 | 脏读 | 不可重复读 | 幻读 |
| --- | --- | --- | --- |
| **READ UNCOMMITTED** | ✅ | ✅ | ✅ |
| **READ COMMITTED** | ❌ | ✅ | ✅ |
| **REPEATABLE READ** | ❌ | ❌ | ✅（InnoDB 通过 MVCC + 间隙锁基本解决） |
| **SERIALIZABLE** | ❌ | ❌ | ❌ |

InnoDB 默认 **REPEATABLE READ**。

**MVCC（多版本并发控制）**：每行数据有隐藏的版本号（`trx_id`、`roll_pointer`），通过 **ReadView** 判断数据对当前事务的可见性。

***

### 3. SQL 优化

| 优化手段 | 说明 |
| --- | --- |
| **EXPLAIN** | 分析执行计划，关注 `type`、`key`、`rows`、`Extra` |
| **避免 `SELECT *`** | 只查需要的列，减少 IO 和网络传输 |
| **分页优化** | 大偏移量用游标分页或子查询：`WHERE id > last_id LIMIT n` |
| **批量操作** | 批量插入代替逐条插入 |
| **合理建索引** | 高区分度列、常用查询条件、覆盖索引 |
| **避免索引失效** | 不在索引列上做函数/计算、注意类型匹配 |

**EXPLAIN type 性能排序**：`system` > `const` > `eq_ref` > `ref` > `range` > `index` > `ALL`

***

### 4. MySQL 锁

| 锁类型 | 说明 |
| --- | --- |
| **共享锁（S 锁）** | 读锁，多个事务可同时持有 |
| **排他锁（X 锁）** | 写锁，与任何锁互斥 |
| **行锁** | InnoDB 默认，锁定具体行（通过索引实现） |
| **间隙锁（Gap Lock）** | 锁定索引间的间隙，防止幻读 |
| **临键锁（Next-Key Lock）** | 行锁 + 间隙锁，InnoDB 默认 |
| **表锁** | MyISAM 默认；InnoDB 在无索引时退化为表锁 |

***

## 八、MyBatis

### 1. 核心概念

| 问题 | 要点 |
| --- | --- |
| **ORM 定位** | 半自动 ORM，需手写 SQL（灵活），对比 JPA/Hibernate（全自动） |
| **`#{}` vs `${}`** | `#{}` 预编译（PreparedStatement），防 SQL 注入；`${}` 字符串拼接，有注入风险 |
| **ResultMap** | 处理列名与属性名不一致、嵌套对象映射、一对多/多对一关联映射 |
| **动态 SQL** | `<if>`、`<choose>`、`<where>`、`<foreach>`、`<set>` |

***

### 2. 缓存

| 级别 | 说明 |
| --- | --- |
| **一级缓存** | SqlSession 级别，默认开启；同一 SqlSession 内相同查询直接返回缓存 |
| **二级缓存** | Mapper（namespace）级别，需手动开启；跨 SqlSession 共享 |

> **注意**：在 Spring 中每次请求通常使用新的 SqlSession，一级缓存基本不生效；分布式环境下二级缓存不推荐使用，建议用 Redis。

***

## 九、Redis

### 1. 数据结构与应用场景

| 数据结构 | 底层编码 | 典型场景 |
| --- | --- | --- |
| **String** | SDS | 缓存、计数器、分布式锁、Session |
| **Hash** | ziplist / hashtable | 对象属性存储（用户信息） |
| **List** | quicklist | 消息队列、最新动态列表 |
| **Set** | intset / hashtable | 标签、共同好友、去重 |
| **Sorted Set** | ziplist / skiplist + hashtable | 排行榜、延迟队列 |

***

### 2. 缓存三大问题

| 问题 | 原因 | 解决方案 |
| --- | --- | --- |
| **缓存穿透** | 查询不存在的数据，缓存和数据库都没有 | 缓存空值（设短过期时间）、布隆过滤器 |
| **缓存击穿** | 热点 key 过期瞬间大量请求打到数据库 | 互斥锁（只让一个线程回源）、逻辑过期 |
| **缓存雪崩** | 大量 key 同时过期或 Redis 宕机 | 随机过期时间、多级缓存、Redis 集群高可用 |

***

### 3. 持久化

| 方式 | 原理 | 优缺点 |
| --- | --- | --- |
| **RDB** | 定时生成数据快照（fork 子进程） | 恢复快，但可能丢失最后一次快照后的数据 |
| **AOF** | 记录每条写命令 | 数据更安全（可配 everysec），文件较大 |
| **混合持久化** | RDB + AOF 增量 | Redis 4.0+，兼顾恢复速度和数据安全 |

***

### 4. 过期策略与淘汰策略

| 过期删除策略 | 说明 |
| --- | --- |
| **惰性删除** | 访问时才检查是否过期 |
| **定期删除** | 每隔一段时间随机抽查一批 key，删除过期的 |

**内存淘汰策略（maxmemory-policy）**：

| 策略 | 说明 |
| --- | --- |
| **noeviction** | 不淘汰，内存满时拒绝写入 |
| **allkeys-lru** | 在所有 key 中淘汰最近最少使用的 |
| **volatile-lru** | 在设置了过期时间的 key 中淘汰 LRU |
| **allkeys-lfu** | 在所有 key 中淘汰最不经常使用的 |
| **volatile-ttl** | 优先淘汰 TTL 最短的 |

***

### 5. 分布式锁

基于 Redis 的分布式锁实现要点：

| 要点 | 说明 |
| --- | --- |
| **加锁** | `SET key value NX EX timeout`（原子操作） |
| **value 唯一标识** | 使用 UUID 或线程标识，防止误删他人锁 |
| **释放锁** | Lua 脚本保证"判断 + 删除"的原子性 |
| **续期** | Redisson 的 WatchDog 机制，自动续期避免业务未完成锁过期 |
| **可重入** | Redisson 用 Hash 结构记录持有者和重入次数 |

***

## 十、微服务 / Spring Cloud

### 1. 核心组件

| 组件 | 职责 | 说明 |
| --- | --- | --- |
| **Nacos** | 注册中心 + 配置中心 | 服务注册发现、动态配置、多环境管理 |
| **OpenFeign** | 声明式 HTTP 调用 | 接口 + 注解替代 RestTemplate |
| **Gateway** | API 网关 | 路由转发、鉴权过滤、限流、跨域 |
| **Sentinel** | 流量控制 | 限流、熔断降级、热点参数限流 |
| **Seata** | 分布式事务 | AT 模式（自动补偿）、TCC、SAGA |

***

### 2. 服务注册与发现

```
    服务启动
        ↓
    向 Nacos 注册实例（IP、端口、元数据）
        ↓
    消费者从 Nacos 获取服务列表
        ↓
    客户端负载均衡（轮询、随机、权重）
        ↓
    发起 HTTP 调用
```

**Nacos 与 Eureka 对比**：

| 对比项 | **Nacos** | **Eureka** |
| --- | --- | --- |
| **配置中心** | ✅ 内置 | ❌ 需额外组件 |
| **健康检查** | TCP/HTTP/自定义 | 仅心跳 |
| **临时/永久实例** | ✅ 支持 | 仅临时实例 |
| **一致性协议** | AP + CP 可切换 | AP |
| **维护状态** | 活跃 | 已停止维护 |

***

### 3. 熔断降级（Sentinel）

**核心概念**：

| 概念 | 说明 |
| --- | --- |
| **限流** | QPS / 线程数达到阈值时拒绝请求 |
| **熔断** | 异常比例或慢调用比例超阈值时断开调用，一段时间后半开探测恢复 |
| **降级** | 熔断后执行兜底逻辑（返回默认值、缓存数据等） |

**熔断状态流转**：关闭（正常） → 打开（触发阈值） → 半开（探测恢复） → 关闭/打开

***

### 4. 分布式事务（Seata AT 模式）

```
    TM（事务管理器）发起全局事务
        ↓
    各 RM（资源管理器）执行本地事务，记录 undo_log
        ↓
    全部成功 → TM 通知 TC（事务协调者）提交 → 删除 undo_log
    任一失败 → TM 通知 TC 回滚 → 根据 undo_log 反向补偿
```

| 模式 | 适用场景 |
| --- | --- |
| **AT** | 自动补偿，无侵入，适合大多数场景 |
| **TCC** | 高性能要求，需手动编写 Try-Confirm-Cancel 三个方法 |
| **SAGA** | 长事务，每个参与者提供正向操作和补偿操作 |

***

## 十一、RabbitMQ

### 1. 核心模型

```
    Producer → Exchange → Queue → Consumer
                  │
           Binding（路由规则）
```

| Exchange 类型 | 路由规则 |
| --- | --- |
| **Direct** | 精确匹配 routing key |
| **Topic** | 通配符匹配（`*` 一个词，`#` 零或多个词） |
| **Fanout** | 广播，忽略 routing key |
| **Headers** | 基于消息头匹配（少用） |

***

### 2. 消息可靠性

| 环节 | 机制 | 说明 |
| --- | --- | --- |
| **生产者 → Broker** | Publisher Confirm + Return | Confirm 确认消息到达 Exchange；Return 通知无法路由到 Queue |
| **Broker 持久化** | 持久化 Exchange + Queue + Message | `durable=true`、`deliveryMode=2` |
| **Broker → 消费者** | Consumer ACK | `manual` 手动确认，处理成功后 `basicAck`，失败 `basicNack` / `basicReject` |

**消息幂等性**：消费者可能重复消费（网络重传），需保证业务幂等（唯一消息 ID + 去重表、数据库唯一约束、状态机等）。

***

### 3. 死信队列（DLX）

消息变成死信的条件：消费者拒绝（`nack` / `reject`）且不重新入队、消息 TTL 过期、队列达到最大长度。

死信被路由到绑定的死信 Exchange → 死信 Queue，可用于**延迟队列**（结合消息 TTL）或异常消息兜底处理。

***

## 十二、Docker

### 1. 核心概念

| 概念 | 说明 |
| --- | --- |
| **镜像（Image）** | 只读模板，分层存储（UnionFS） |
| **容器（Container）** | 镜像的运行实例，可写层 |
| **Dockerfile** | 构建镜像的脚本文件 |
| **Docker Compose** | 多容器编排，通过 `docker-compose.yml` 定义和管理多个服务 |
| **Volume** | 数据持久化，容器删除后数据不丢失 |

***

### 2. 常用命令

| 命令 | 说明 |
| --- | --- |
| `docker build -t name:tag .` | 根据 Dockerfile 构建镜像 |
| `docker run -d -p 8080:80 --name c1 image` | 后台启动容器并映射端口 |
| `docker exec -it c1 /bin/bash` | 进入运行中的容器 |
| `docker logs -f c1` | 查看容器日志 |
| `docker-compose up -d` | 启动所有编排服务 |
| `docker-compose down` | 停止并删除所有服务 |

***

### 3. Dockerfile 优化

| 优化手段 | 说明 |
| --- | --- |
| **多阶段构建** | 编译阶段和运行阶段分离，减小最终镜像体积 |
| **合理利用缓存** | 变化频率低的指令放前面（如 `COPY pom.xml` 先于 `COPY src`） |
| **使用 `.dockerignore`** | 排除不需要的文件 |
| **最小化基础镜像** | 使用 `alpine` 或 `slim` 版本 |

***

## 十三、场景题与系统设计

### 1. 如何设计一个权限系统

**RBAC（基于角色的访问控制）**：

```
    用户 ←→ 角色 ←→ 权限
    （多对多）  （多对多）
```

- 前端：路由守卫 + 按钮级权限（指令/组件控制）
- 后端：拦截器/过滤器 + 注解式权限校验（`@PreAuthorize`）
- 数据权限：按部门/组织过滤数据范围

***

### 2. 接口性能优化思路

| 层面 | 手段 |
| --- | --- |
| **SQL** | 索引优化、避免全表扫描、分页优化、批量操作 |
| **缓存** | Redis 缓存热点数据、本地缓存（Caffeine） |
| **异步** | MQ 异步处理非核心逻辑、`@Async` |
| **并行** | CompletableFuture 并行调用多个服务 |
| **数据库** | 读写分离、分库分表（大数据量时） |
| **连接池** | 合理配置数据库/HTTP 连接池参数 |

***

### 3. 如何保证接口幂等性

| 方案 | 适用场景 |
| --- | --- |
| **唯一索引** | 数据库层面防重复插入 |
| **Token 机制** | 前端获取 Token，后端校验后删除，一次性使用 |
| **乐观锁** | `UPDATE ... SET version = version + 1 WHERE version = ?` |
| **状态机** | 业务状态单向流转（如 待支付 → 已支付，不可重复） |
| **去重表** | 记录已处理的请求 ID |

***

### 4. 单点登录（SSO）方案

| 方案 | 说明 |
| --- | --- |
| **共享 Session** | 同域下 Cookie + Redis Session 共享 |
| **JWT** | 无状态 Token，适合微服务架构 |
| **OAuth2 / CAS** | 跨域 SSO，中心认证服务颁发 Token |

JWT 方案流程：用户登录 → 认证服务签发 JWT → 前端存储 Token → 每次请求携带 → 网关/拦截器验证签名和有效期。

***

### 5. 高并发下如何防止超卖

| 方案 | 说明 |
| --- | --- |
| **数据库乐观锁** | `UPDATE stock SET num = num - 1 WHERE id = ? AND num > 0` |
| **Redis 预扣减** | `DECR` 原子减库存，成功后异步创建订单 |
| **分布式锁** | Redisson 锁粒度为商品 ID |
| **MQ 削峰** | 请求先入队列，消费者有序处理 |

***

### 6. 日志和错误排查

| 工具/手段 | 用途 |
| --- | --- |
| **前端** | Sentry 错误监控、console + Source Map 定位、Performance 面板 |
| **后端** | Logback/SLF4J 日志分级、ELK 日志收集分析、链路追踪（Sleuth + Zipkin） |
| **通用** | 结构化日志（traceId 串联请求链路）、告警通知 |
