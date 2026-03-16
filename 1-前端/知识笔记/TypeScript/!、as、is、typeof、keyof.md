# !、as、is、typeof、keyof

非空断言（确定为非空）

## ! 操作符

> 1 let ele = document.getElementById('app') // HTMLElement | null

> 2 ele!.style.backgroundColor = '#fff' // 我确定 ele 一定有值，不用给我报错 str 可能无值了

## as操作符

类型断言（确定为某种类型）

> 1 let strOrNum: string | number = Math.random() > 0.5 ? 'abc' : 123

> 2 let num: number = strOrNum as number // 我确定一定是数字（常用语法）

> 3 let str: string = <string>strOrNum // （不常用语法）

## 只能断言为可能的类型之一

> 1 let strOrNum: string | number = Math.random() > 0.5 ? 'abc' : 123

- 2 let flag: boolean = strOrNum as boolean // 报错：类型 "string | number" 到类型 "boolean" 的转换可能是错误的，因为两种类型不能充分重叠。

- 3 // 但可以使用双重类型断言，不过不建议使用

- 4 let flag2: boolean = strOrNum as any as boolean

指定对象中某个值的类型

> 1 const obj = {

> 2 style: 'light' as 'light' | 'dark'

> 3 } 4

- 5 obj.style = 'dark' // style: "dark" | "light"

对象的键的别名

> 1 type T = {

> 2 [key in "name" | "age" as `k_${key}`]: any

> 3 }

> 4 // type T = {

> 5 //   k_name: any;

> 6 //   k_age: any;

> 7 // }

## 将对象的所有键变为只读

> 1 const obj = {

> 2 name: 'sjf',

> 3 age: 20

> 4 } as const 5

> 6 // const obj: {

> 7 //   readonly name: "sjf";

> 8 //   readonly age: 20;

> 9 // }

## is操作符

## 类型保护

> 1 function isString(p: string | number): p is string {

- 2 return typeof p === "string"

- 3 } 4

- 5 function fn(p: string | number) {

- 6 if (isString(p)) {

> 7 p // p: string

> 8 } else {

> 9 p // p: number

> 10 }

> 11 }

## typeof操作符

取变量的类型

1 2 const person = { 3 name: 'Sun', 4 age: 20 5 } 6 7 type Person = typeof person // { name: string; age: number; }

## keyof操作符

## 取类型的key的联合类型

> 1 type Person = {

> 2 name: 'Sun',

> 3 age: 20

> 4 } 5

> 6 type PersonKeys = keyof Person // 'name' | 'age'
