# TypeScript 分享

## 引言

一些大厂已经把 TS 作为默认开发语言，很多中大型项目（编译器、技术栈、组件库、插件等）也多用 TS 编写，TS 势在必学。

- 为什么js用得好好的，突然出现了ts？

   - js类型灵活，但随着项目规模的增大，这种灵活反而成为了负担

   - 很多类型错误写的时候发现不了，运行的时候才会出错

## ts介绍

ts定义

ts是js的超集，支持所有js语法，但在js语法的基础上引入了类型相关的新语法。

**==> picture [218 x 197] intentionally omitted <==**

## ts优势

丰富的语法提示，提高开发效率

**==> picture [550 x 43] intentionally omitted <==**

**----- Start of picture text -----**<br>
1 // 变量<br>**----- End of picture text -----**<br>

> 1 // 变量量

> 2 const user: {

> 3 name: string

> 4 age: number

> 5 } = {

> 6 name: 'xiaoming',

> 7 age: 20

> 8 }

> 9 user.age.toFixed(0)
> 10

> 11 export {}

编译时类型校验，减少运行时bug的产生

> 1 // 函数

> 2 function getPx(param: number) {

> 3 return param + 'px'

> 4 }

> 5 const width: string = getPx(1)

6

> 7 export {}

ts学习过程

- 学习基础语法和内置工具类型

基本类型

- 1 // 原始数据类型，都要采用小写类型

> 2 let name: string = 'Sun'

> 3 let age: number = 20

> 4 let male: boolean = true

> 5 let something: any = 123

## 数组

- 1 const arr1: number[] = [1, 2, 3]

> 2 const arr2: string[] = ['a', 'b', 'c']

> 3 const arr3: (number | string)[] = [1, 2, 3, 'a', 'b', 'c'] // "|" 为联合类型语法，表示这几种类型均可

> 4 // 或

> 5 const arr4: Array<number> = [1, 2, 3] // 采用泛型来声明数组，其中 "<>" 是泛型语法

## 类型别名

- 1 type Direction = 'top' | 'right' | 'bottom' | 'left'

- 2 let direction: Direction = 'top'

对象类型

常规属性声明

1

type User = {

> 2 name: string

> 3 age: number

> 4 } 5

> 6 const user: User = {

> 7 name: 'Sun',

> 8 age: 20

> 9 }

## 可选属性声明

> 1 type User = {

> 2 name: string

> 3 age: number

> 4 motorbike?: string

> 5 } 6

> 7 const user1: User = {

> 8 name: 'Sun',

> 9 age: 20

> 10 }

> 11 const user2: User = {

> 12 name: 'Sun',

> 13 age: 20,

> 14 motorbike: 'haojue'

> 15 }

## 任意属性声明

**==> picture [550 x 43] intentionally omitted <==**

**----- Start of picture text -----**<br>
1 type User = {<br>**----- End of picture text -----**<br>

> 1 type User = {

> 2 name: string

> 3 age: number

> 4 [key: string]: any

> 5 } 6

> 7 const user: User = {

> 8 name: 'Sun',

> 9 age: 20,

> 10 qq: 790964731,

> 11 weixin: 'sjf_08'

> 12 }

- 键可以写成任意内容，但习惯用key

- 键的类型可以是string、number、symbol

- 值的类型必须包含已有属性的类型

## 函数类型

   - 写在函数声明里

- 1 function sum(a: number, b:number): number {

- 2 return a + b

- 3 }

- 4 sum(1, 2)

## 使用类型别名

- 1 type Sum = (a: number, b:number) => number

- 2 const sum2: Sum = (a, b) => a + b
- 3 sum2(1, 2)

## 可选参数

- 1 // 如果有其他必选参数，必选参数必须放在可选参数之前

- 2 function sum(a: number, b?:number): number {

- 3 return a + (b ?? 0)

- 4 }

- 5 sum(1, 2)

- 6 sum(1)

## 文档

   - TypeScript

   - TypeScript中文网

   - TypeScript（冴羽）

- 了解项目所用技术栈、组件库提供的工具类型

文档

TypeScript 与组合式 API

## ts应用场景

- 原则：谁用数据，谁定义类型。别人要想传数据过来，必须按照用数据的地方定义的类型来传

- 举例：

   - 接口要参数，定义类型，用这个接口就得按这个类型传参

   - 组件要用数据，定义类型，用这个组件就得按这个类型传参

   - 页面展示要用数据，定义类型，接口返回后的数据，按定义的类型处理好后，再给响应式变量赋值

## 结语

- TS 将 JS 的「灵活性」限制在规则之内，使代码更规范、可控，在大型项目中优势尤为明显。
