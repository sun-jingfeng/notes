# namespace 命名空间

正常无法重复声明。

## namespace 关键字，相当于「内部模块」

> 1 const a = 123 2

> 3 const a = 123 // 报错：无法重新声明块范围变量 "a" 。

## 不同命名空间内，可以重复声明

> 1 namespace Ns1 {

> 2 const a = 123

> 3 } 4

> 5 namespace Ns2 {

> 6 const a = 123

> 7 }

编译后，是【命名空间变量】和【自执行函数】

1 var Ns1;

> 2 (function (Ns1) {

> 3 const a = 123;

> 4 })(Ns1 || (Ns1 = {})); 5

> 6 var Ns2;

> 7 (function (Ns2) {

> 8 const a = 123;

- 9 })(Ns2 || (Ns2 = {}));

## 导出

按需导出命名空间

编译前

export namespace Ns1 {

1

> 2 const a = 123

> 3 }

## 编译后，将【命名空间变量】导出

> 1 export var Ns1;

> 2 (function (Ns1) {

> 3 const a = 123;

> 4 })(Ns1 || (Ns1 = {}));

## 按需导入使用

> 1 import { Ns1 } from './test'

> 2 console.log(Ns1) // {}

将命名空间导出为模块

声明

> 1 // 声明位置是 node_modules/@types/mitt/index.d.ts ，如此才能从 'mitt' 导入

- 2 namespace mitt {

> 3 const a = 123

> 4 type T = string

> 5 } 6

> 7 export = mitt // 此写法在源码中较常见

> 8 // 或

> 9 export default mitt

## 默认导入使用

- 1 import mitt from "mitt"

2

> 3 mitt.a // 123

> 4 const b: mitt.T = "abc" // string

**==> picture [339 x 11] intentionally omitted <==**

**----- Start of picture text -----**<br>
将命名空间导出为全局变量（通过CDN引入的包，可用此方式声明类型）<br>**----- End of picture text -----**<br>

声明

> 1 namespace mitt {

> 2 const a = 123

> 3 type T = string

> 4 } 5

> 6 export as namespace mitt

无需导入，可直接使用

> 1 mitt.a // 123

> 2 const b: mitt.T = "abc" // string

按需导出命名空间内的变量

编译前

> 1 export namespace Ns1 {

> 2 export const a = 123

> 3 const b = "abc"

> 4 }

编译后，将命名空间内的变量赋值到【命名空间变量】

> 1 export var Ns1;

- 2 (function (Ns1) {

- 3 Ns1.a = 123; 4 const b = "abc";

- 5 })(Ns1 || (Ns1 = {}));

按需导入使用

1

import { Ns1 } from './test'

> 2 console.log(Ns1) // {a: 123}

## 本页使用

> 1 export namespace Ns1 {

> 2 export const a = 123

> 3 const b = "abc"

> 4 } 5

> 6 Ns1.a // 123

> 7 Ns1.b // 报错：类型 "typeof Ns1" 上不存在属性 "b" 。

## 全局命名空间

全局声明

> 1 namespace Ns1 {

> 2 export const a = 123

> 3 }

## 代码中使用，ts不会报错

> 1 Ns1.a // ts 提示： const Ns1.a: 123

## 但没办法真正使用

> 1 console.log(Ns1.a) // 控制台报错： Uncaught ReferenceError: Ns1 is not defined

## 嵌套

编译前

1

namespace Ns1 {

> 2 export namespace Ns1_1 {

> 3 export const a = 123

> 4 }

> 5 } 6

> 7 Ns1.Ns1_1.a // 123

## 编译后

> 1 var Ns1;

> 2 (function (Ns1) {

> 3 let Ns1_1;

> 4 (function (Ns1_1) {

> 5 Ns1_1.a = 123;

> 6 })(Ns1_1 = Ns1.Ns1_1 || (Ns1.Ns1_1 = {}));

> 7 })(Ns1 || (Ns1 = {}));

## 同名合并

## 编译前

> 1 namespace Ns1 {

> 2 export const a = 123

> 3 } 4

- 5 namespace Ns1 {

> 6 export const b = "abc"

> 7 } 8

> 9 Ns1.a // 123 10

> 11 Ns1.b // "abc"

## 编译后

|1|var Ns1;|
|---|---|
|2|(function (Ns1) {|

> 3 Ns1.a = 123;

> 4 })(Ns1 || (Ns1 = {}));

> 5 (function (Ns1) {

> 6 Ns1.b = "abc";

> 7 })(Ns1 || (Ns1 = {}));

## 但不能导出相同的内容

> 1 namespace Ns1 {

- 2 export const a = 123

- 3 const b = "abc"

- 4 }

5

> 6 namespace Ns1 {

> 7 export const a = 123 // 报错：无法重新声明块范围变量 "a" 。

> 8 const b = "abc" // 允许，因为未导出

> 9 }

## 拓展类、函数、枚举

## 编译前

- 1 class A {

- 2 static a = 123

- 3 } 4

- 5 namespace A {

- 6 export const b = "abc"

- 7 }

8

- 9 A.a // 123

- 10

- 11 A.b // "abc"

## 编译后

1

class A {

> 2 }

> 3 A.a = 123;

> 4 (function (A) {

> 5 A.b = "abc";

> 6 })(A || (A = {}));

## 同名声明问题

演示（以【将命名空间导出为模块】为例）

> 1 // .d.ts 文件

> 2 namespace mitt {

> 3 const valueOrType = 123

> 4 type valueOrType = string

> 5 } 6

> 7 export = mitt 8

> 9 // .ts 文件

> 10 import mitt from "mitt" 11

> 12 mitt.valueOrType // 值： 123

> 13 type T = mitt.valueOrType // 类型： string

## 避免方法

## 说明

- 将命名空间内容包裹在接口中

- 利用接口的合并特性，合并同名声明

- 声明常量，类型为命名空间的接口

   - 提示：如果声明的常量与命名空间同名，需在命名空间之前声明

## 示例

> 1 // .d.ts 文件

> 2 const mitt: mitt.IMitt 3

> 4 namespace mitt {

> 5 interface IMitt {

> 6 valueOrType: string

> 7 }

> 8 interface IMitt {

> 9 valueOrType: 123

> 10 }

> 11 } 12

> 13 export = mitt 14

> 15 // .ts 文件

> 16 import mitt from "mitt" 17

> 18 mitt.valueOrType // 值： 123
