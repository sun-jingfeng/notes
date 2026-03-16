# module 模块

module 关键字，模块名需加双引号。

> 1 // d.ts 文件

> 2 module "mitt" 3

> 4 // ts 文件

> 5 import mitt from "mitt"

## 只提供类型，但并不能真正使用

> 1 // d.ts 文件

> 2 module "mitt" 3

> 4 // ts 文件

> 5 import mitt from "mitt" 6

- 7 console.log(mitt) // 控制台报错： mitt is not defined

## 无默认导出

声明

> 1 module "mitt" {

> 2 type T = string 3

> 4 export const a = 123 5

> 6 const b = "abc"

> 7 }

## 使用

所有声明可按需导入

> 1 import { type T, a, b } from "mitt" 2

> 3 const name: T = "sun"

> 4 a // 123

> 5 b // "abc"

可默认导入，所有声明为导入数据的属性

- 1 import mitt from "mitt"

2

> 3 mitt.a // 123

> 4 mitt.b // "abc"

全部导入时，与默认导入结果相同，所有声明为导入数据的属性

> 1 import * as mitt from "mitt" 2

> 3 mitt.a // 123

> 4 mitt.b // "abc"

## 有默认导出

## 声明

- 1 module "mitt" {

- 2 type T1 = number

- 3 export type T2 = string 4

- 5 const a = 123

> 6 export const b = "abc" 7

- 8 export default {

> 9 name: "abc",

> 10 }

> 11 }

## 使用

把大括号里的内容，看作是一个ts模块的内容，用法与此相同

> 1 // 默认导入

> 2 import mitt from "mitt" 3

> 4 mitt.name // string 5

> 6 // 按需导入

> 7 import { type T2, b } from "mitt" 8

> 9 b // "abc"

> 10 const name: T2 = "sun" 11

> 12 // 全部导入

> 13 import * as mitt from "mitt" 14

> 15 mitt.b // "abc"

> 16 mitt.default.name // string

## 未导出声明无法引用

> 1 import { type T1, a } from "mitt" // 报错：导入声明中的所有导入都未使用。

## 模块内导入

导入内容存在时，与ts文件模块内导入时的效果相同

> 1 // .d.ts 文件

> 2 module 'mitt' {

> 3 import type { Component } from 'vue' 4

> 5 type T = Component

> 6 } 7

> 8 // .ts 文件

> 9 import type { T } from 'mitt' // Component

同名合并

> 1 // .d.ts 文件

> 2 module 'mitt' {

> 3 const a = 123

> 4 } 5

> 6 module 'mitt' {

> 7 const b = 'abc'

> 8 } 9

> 10 // .ts 文件

> 11 import mitt from "mitt" 12

> 13 mitt.a // 123

> 14 mitt.b // "abc"

## 模块名可以使用通配符

> 1 // .d.ts 文件

> 2 module "*.png" 3

> 4 // .ts 文件

- 5 import icon from "icon.png" // module icon

## 同名声明问题

## 演示

- 1 // .d.ts 文件

- 2 module 'mitt' {

- 3 const valueOrType = 123

- 4 type valueOrType = string

- 5 }

6

- 7 // .ts 文件

> 8 import mitt from "mitt"

9

> 10 mitt.valueOrType // 值： 123

> 11 type T = mitt.valueOrType // 类型： string

## 避免方法

- 使用【导出命名空间为模块】的方式替代【模块】

- 参考【命名空间】的避免方法
