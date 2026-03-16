# declare 声明

## 说明

- 以declare关键字开头，习惯与业务代码分开，单独放在.d.ts文件中

- 存在的目的，是为了让代码拥有提示，在编译时会被删除

- .ts文件打包后，可生成.d.ts声明文件（需设置compilerOptions.declaration为true）

## 需要声明的情况

- 使用js编写的包

通过CDN引入的包

- 引入了一个不是ts的文件，例如.vue、.css

- 拓展全局对象，例如window

## 基础示例

> 1 // 声明变量

> 2 declare const num: number

> 3 num 4

> 5 // 声明函数

> 6 declare function sun(a: number, b: number): number

> 7 sun(100, 200) 8

> 9 // 声明类

> 10 declare class A {}

> 11 new A() 12

> 13 // 声明类型

> 14 declare type T = number[]

> 15 const arr: T = [1, 2, 3] 16

> 17 // 声明模块（声明和引入放到不同的文件）

> 18 declare module "mitt"

> 19 import mitt from "mitt"

jQuery示例

ts

$("#map").width(100).height(200)

1

2

> 3 $.ajax()

## d.ts

- 1 declare interface JQuery {

- 2 width(width: number): this

- 3 height(height: number): this

- 4 }

5

- 6 declare const $: {

- 7 (selector: string): JQuery

- 8 ajax(): void 9 }

## 第三方包的声明文件

- 先找包内package.json的types字段的指定文件

- 如果没有types字段，或找不到指定文件，就找包内根目录下的index.d.ts文件

- 继续找node_modules中，@types目录下的同名包

- 如果@types域的同名包也没有，可以自己声明类型

**==> picture [472 x 265] intentionally omitted <==**

## 配置第三方包解析项目中的声明文件

## 相关配置

compilerOptions.moduleResolution

compilerOptions.baseUrl

compilerOptions.paths

## 说明

- 默认位置是node_modules/@types/*

- 配置后，目标位置的查找优先级高于默认位置。若在目标位置找不到声明文件，再去默认位置找

## 示例

配置

**==> picture [550 x 216] intentionally omitted <==**

**----- Start of picture text -----**<br>
1 {<br>2     "compilerOptions" ： {<br>3         "moduleResolution": "Node",<br>4         "baseUrl": "./",<br>5         "paths": {<br>6           "*": ["types/*"]<br>7         },<br>8     }<br>9 }<br>**----- End of picture text -----**<br>

**==> picture [22 x 11] intentionally omitted <==**

**----- Start of picture text -----**<br>
效果<br>**----- End of picture text -----**<br>

**==> picture [237 x 109] intentionally omitted <==**

**==> picture [491 x 67] intentionally omitted <==**
