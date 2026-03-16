# JavaScript 与 ECMAScript、DOM、定时器

ECMAScript 是一套语法标准

## 简称ES

- 我们之前学的语法其实就是 ECMAScript 里的语法

   - 变量、数据类型、运算等规则都是 ECMAScript 规定的

- JavaScript 是什么？

   - 遵守 ECMAScript 规则的一套编程语言

   - 严格来讲，ECMAScript 配合浏览器提供的 Web APIs 才称之为 JavaScript

- Web APIs 是什么？


   - 浏览器提供的 套操作浏览器、页面内容的功能（主要是 些对象和方法）

JavaScript和node.js

**==> picture [467 x 208] intentionally omitted <==**

## DOM是什么

一 DOM是浏览器提供的 套专门用来操作网页内容的功能

DOM的核心思想

- 把网页内容当做对象来处理

DOM作用

## 开发网页内容特效和实现用户交互

DOM全称

Document Object Model（文档对象模型）

**==> picture [467 x 148] intentionally omitted <==**

## DOM树

- 将 HTML 文档以树状结构直观的表现出来，我们称之为文档树或 DOM 树

- 描述网页内容关系的名词

- 作用：文档树直观的体现了标签与标签之间的关系

**==> picture [467 x 268] intentionally omitted <==**

**==> picture [467 x 218] intentionally omitted <==**

## DOM节点

DOM节点

DOM树里每一个内容都称之为节点

## 节点类型

- 元素节点

   - 所有的标签 比如 body、 div

   - html 是根节点

## 属性节点

   - 所有的属性 比如 href

- 文本节点

   - 所有的文本

**==> picture [22 x 10] intentionally omitted <==**

**----- Start of picture text -----**<br>
其他<br>**----- End of picture text -----**<br>

**==> picture [467 x 183] intentionally omitted <==**

## document

- 是 DOM 里提供的一个对象

- 所以它提供的属性和方法都是用来访问和操作网页内容的

   - 例：document.write()

- 代表浏览器显示网页内容的区域

- 网页所有内容都在document里面

- document 是学习 DOM 的核心

**==> picture [349 x 461] intentionally omitted <==**

## 查找元素节点

- 根据 id 来查找dom元素节点

语法：

**==> picture [270 x 34] intentionally omitted <==**

- 根据id查找标签

- 传入的id是字符串，记得加引号，直接写id名即可，不需要加 #

- 返回一个匹配到 ID 的 DOM Element 对象（所有节点都是对象）

- 找不到会得到null

- 可以通过对象里面的 nodeType 属性来标识节点类型

**==> picture [421 x 158] intentionally omitted <==**

查找html和body元素节点

查找 html 元素

**==> picture [213 x 32] intentionally omitted <==**

查找 body 元素

**==> picture [212 x 32] intentionally omitted <==**

## 操作元素属性

- 直接修改元素的属性

语法：

**==> picture [214 x 38] intentionally omitted <==**

**==> picture [335 x 128] intentionally omitted <==**

通过 setAttribute 方法修改

## 语法：

**==> picture [252 x 35] intentionally omitted <==**

**==> picture [467 x 84] intentionally omitted <==**

修改元素的样式

语法：

**==> picture [270 x 37] intentionally omitted <==**

**==> picture [467 x 91] intentionally omitted <==**

## 操作元素文本

- document.write

   - 只能将文本内容追加到 </body> 前面的位置

   - 文本中包含的标签会被解析

**==> picture [357 x 66] intentionally omitted <==**

- innerText 属性

   - 将文本内容添加/更新到任意标签位置

   - 文本中包含的标签不会被解析

**==> picture [364 x 86] intentionally omitted <==**

## innerHTML 属性

- 将文本内容添加/更新到任意标签位置

- 文本中包含的标签会被解析

**==> picture [388 x 40] intentionally omitted <==**

## 时间对象实例化

- 在代码中发现了 new 关键字时，一般将这个操作称为实例化

- 创建一个时间对象并获取时间

   - 获得当前时间

**==> picture [251 x 34] intentionally omitted <==**

获得指定时间

**==> picture [255 x 34] intentionally omitted <==**

- 时间对象：用来表示时间的对象

- 作用：可以得到当前系统时间

## 时间对象方法

因为时间对象返回的数据我们不能直接使用，所以需要转换为实际开发中常用的格式

**==> picture [467 x 183] intentionally omitted <==**

## 时间戳

## 什么是时间戳

一 是指1970年01月01日00时00分00秒起至现在的毫秒数，它一种特殊的计量时间的方式

- 三种方式获取时间戳

使用 getTime() 方法

**==> picture [275 x 76] intentionally omitted <==**

简写 +new Date()

**==> picture [275 x 34] intentionally omitted <==**

使用 Date().now()

**==> picture [236 x 34] intentionally omitted <==**

- 无需实例化

- 但是只能得到当前的时间戳， 而前面两种可以返回指定时间的时间戳

## 定时器函数使用

开启定时器

**==> picture [287 x 29] intentionally omitted <==**

作用：每隔一段时间调用这个函数

间隔时间单位是毫秒

**==> picture [467 x 79] intentionally omitted <==**

## 关闭定时器

**==> picture [308 x 50] intentionally omitted <==**

一 一般不会刚创建就停止，而是满足一定条件再停止
