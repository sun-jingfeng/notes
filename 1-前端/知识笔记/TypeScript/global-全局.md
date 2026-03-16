# global 全局

说明：在模块中声明全局类型。

## 示例

模块中的普通声明，无法影响其他模块

模块1

> 1 type T = string 2

> 3 export {}

## 模块2

> 1 let name: T // 报错：找不到名称 "T" 。 2

> 3 export {}

## 使用全局声明，在模块中声明全局类型

模块1

> 1 declare global {

> 2 type T = string

> 3 } 4

> 5 export {}

## 模块2

> 1 let name: T // let name: string 2

> 3 export {}
