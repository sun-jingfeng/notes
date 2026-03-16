# extends、infer、-

## extends 操作符

## 约束泛型的类型

基本类型

> 1 type Num<T extends number> = any

2

> 3 type T1 = Num<123>

> 4 type T2 = Num<"abc"> // 报错：类型 "string" 不满足约束 "number" 。

## 对象

> 1 type MyType<T extends object, U extends T> = any

2

> 3 type Obj1 = {

> 4 name: string

> 5 age: number

- 6 }

> 7 type Obj2 = {

> 8 name: string

> 9 } 10

> 11 type T = MyType<Obj1, Obj2> // 报错：类型 "Obj2" 不满足约束 "Obj1" 。类型 "Obj2" 中缺少属 性 "age" ，但类型 "Obj1" 中需要该属性。

## 三元表达式

> 1 type T = 1 extends number ? true : false

> 2 // type T = true

## 接口拓展

> 1 interface A {

> 2 name: string

> 3 }

> 4 interface B extends A {

> 5 age: number

> 6 }

7

> 8 const speak: B = {

> 9 name: "Sun",

> 10 age: 20,

> 11 }

## infer操作符

## 获取函数返回值的类型

- 1 function getData() {

> 2 return 1

- 3 }

4

> 5 type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any

- 6 type T1 = ReturnType<typeof getData> // type T1 = number

## 获取函数参数的类型

- 1 function getData(name: string, age: number) { }

2

> 3 type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;

- 4 type T1 = Parameters<typeof getData> // type T1 = [name: string, age: number]

## 获取实例的类型

- 1 class Person { }

- 2

> 3 type InstanceType<T extends abstract new (...args: any) => any> = T extends abstract new (...args: any) => infer R ? R : any;

- 4 type T1 = InstanceType<typeof Person>

获取构造函数的参数类型

> 1 class Person {

> 2 constructor(name: string, age: number) { }

> 3 }

4

- 5 type ConstructorParameters<T extends abstract new (...args: any) => any> = T extends abstract new (...args: infer P) => any ? P : never;

- 6 type T1 = ConstructorParameters<typeof Person> // type T1 = [name: string, age: number]

## 交换元组类型的头尾

- 1 type Exchange<T extends any[]> = T extends [infer L, ...infer M, infer R] ? [R, ...M, L] : any

- 2 type T1 = Exchange<[string, 1, 2, 3, boolean]> // type T1 = [boolean, 1, 2, 3, string]

## 获取元组类型的联合类型

> 1 type ElementOf<T extends any[]> = T extends Array<infer R> ? R : any

> 2 type TupleToUnion = ElementOf<[string, number, boolean]> // type TupleToUnion = string | number | boolean

## - 操作符

## 说明

## 去掉某些操作符，例如?、readonly

示例

> 1 // 示例 1

> 2 type MyTool<T> = {

> 3 [key in keyof T]-?: T[key]

> 4 } 5

> 6 type T1 = MyTool<{

> 7 name: string

> 8 age?: number

> 9 }> // type T1 = { name: string; age: number }

10

> 11 // 示例 2

> 12 type MyTool<T> = {

> 13 -readonly [key in keyof T]: T[key]

> 14 } 15

> 16 type T1 = MyTool<{

> 17 name: string

> 18 readonly age: number

> 19 }> // type T1 = { name: string; age: number }
