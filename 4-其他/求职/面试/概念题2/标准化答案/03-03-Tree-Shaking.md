# Tree Shaking

## 一、是什么

**Tree Shaking** 指在构建时通过**静态分析**找出未被使用的导出（死代码），并将其从最终 bundle 中移除，从而减小体积。

***

## 二、前提

- **ESM**：只有 `import`/`export` 的静态结构才能在做依赖图时确定“谁被用了”。  
- **构建工具支持**：Webpack、Rollup、Vite 等都在生产构建时做 dead code elimination。

***

## 三、失效的常见原因

| 原因 | 说明 |
| --- | --- |
| **使用 CJS** | `require` 是动态的，无法在构建时确定引用关系 |
| **模块有副作用** | 模块顶层执行了代码（如 polyfill、注册全局），打包器不敢删，需通过 `"sideEffects"` 声明 |
| **动态导入路径** | `import(variable)` 无法静态分析，对应模块可能被保留 |
| **被误判为有副作用** | 未配置 `sideEffects` 或配置不当，导致本可删的代码被保留 |

**sideEffects**：在 `package.json` 中可设 `"sideEffects": false` 表示无副作用，或 `"sideEffects": ["*.css"]` 等列出有副作用的文件，帮助打包器正确摇树。

***

## 四、面试答题要点

- **原理**：基于 ESM 静态分析，标记并移除未使用的导出。
- **前提**：ESM 语法 + 支持 Tree Shaking 的构建工具。
- **失效**：CJS、模块副作用未声明、动态 import 路径等。
