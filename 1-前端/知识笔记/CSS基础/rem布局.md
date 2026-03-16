# rem 布局

为什么要学 rem 布局？

rem 主要解决什么问题？

文字大小没有自适应

元素的高度没有自适应

如何解决？

rem布局

- 媒体查询 + rem单位

- flexible.js + rem单位

- vw/vh

## 媒体查询

作用：

根据设备不同的特性应用不同的css样式

语法：

**==> picture [284 x 82] intentionally omitted <==**

**==> picture [467 x 29] intentionally omitted <==**

语法介绍：

@media（media媒体）：告诉浏览器："我要使用媒体查询了！"

and：且

设备特性的值有：

设备宽度width/max-width/min-width（基本上只使用max-width和min-width，且包含端点 ）

设备高度height/max-height/min-height（包含端点）

更多@语法参考：@规则

## rem单位

em相对的是谁？

自身的font-size值

rem相对的是谁？

html的font-size值

rem的由来：root em

px是绝对单位，而em、rem是相对单位

## 媒体查询与rem结合使用

只使用媒体查询，不使用rem

> 1 @media (width: 400px) {

> 2 header {

> 3 height: 20px;

> 4 }

> 5 footer {

> 6 height: 40px;

> 7 }

> 8 更多样式 …

> 9 }

> 10 @media (width: 500px) {

> 11 header {

> 12 height: 25px;

> 13 }

> 14 footer {

> 15 height: 22.5px ；

> 16 }

> 17 更多样式 …

> 18 }

## 媒体查询 + rem

> 1 @media (width: 400px) {

> 2 html {

> 3 font-size: 40px;

> 4 }

> 5 }

> 6 @media (width: 500px) {

> 7 html {

> 8 font-size: 50px;

> 9 }

> 10 }

结论：只使用媒体查询会造成大量css代码冗余

## 当浏览器窗口不等于媒体查询中的width怎么办

方案一：在媒体查询中使用max-width和min-width代替width

- 方案二：给每一个浏览器宽度设置一个html的font-size值

一 第 种方案

> 1 @media (min-width: 0) and (max-width: 320px) {

> 2 html {

> 3 font-size: 32px;

> 4 }

> 5 }@media (min-width: 320px) and (max-width: 375px) {

> 6 html {

> 7 font-size: 32px;

> 8 }

> 9 }@media (min-width: 375px) and (max-width: 414px) {

> 10 html {

> 11 font-size: 37.5px;

> 12 }

> 13 }@media (min-width: 414px) and (max-width: 480px) {

> 14 html {

> 15 font-size: 41.4px;

> 16 }

> 17 } 18

> 19 /* 还有 480-580 、 580-640 这两个区间 */

> 20 @media (min-width: 640px) {

> 21 html {

> 22 font-size: 64px;

> 23 }

> 24 } 25

## 或

> 1 @media (min-width: 0px) {

> 2 html {

> 3 font-size: 32px;

> 4 }

> 5 }

> 6 @media (min-width: 320px) {

> 7 html {

> 8 font-size: 32px;

> 9 }

> 10 }

> 11 @media (min-width: 375px) {

> 12 html {

> 13 font-size: 37.5px;

> 14 }

> 15 } 16

> 17 /* 还有 480 、 580 这两个 min-width */ 18

> 19 @media (min-width: 640px) {

> 20 html {

> 21 font-size: 64px;

> 22 }

> 23 }

> 24 /* 注意：只使用 min-width 或 max-width 时媒体查询的顺序不能颠倒 */

## 第二种方案 - flexible.js插件

- 作用：将视口宽度除以10设置给html的font-size

- 使用：通过<script>标签引入到页面中

**==> picture [425 x 73] intentionally omitted <==**

## 如何将px值转换为rem值

- 由于这个UI设计稿宽度为750px，为二倍图，所以我们应该先将346px除以2得到逻辑像素，为173px。

- 然后再用173px除以37.5（由于当视口宽度和UI设计稿宽度一样时html的font-size值为37.5px）得到4.61rem。 所以在css中写width: 4.61rem;

**==> picture [281 x 379] intentionally omitted <==**

## px to rem插件

作用

自动帮我们把px单位转换为rem单位

安装

在vscode里安装 px2rem

**==> picture [197 x 56] intentionally omitted <==**

设置

基准根字号大小

**==> picture [206 x 78] intentionally omitted <==**

取消注释

**==> picture [236 x 51] intentionally omitted <==**

vw/vh的介绍

vw : 1vw = 1%视口宽度

vh : 1vh = 1%视口高度

## 兼容性

android4.4+ ios8+

由于在实现元素宽度、高度、字体大小等自适应时，都是依据视口的宽度，所以一般只会使用vw，很少使用vh

## 如何将px转换为vw

这样想：如果flexible.js是将屏幕的宽度除以100赋值给html的font-size，这时候1rem=1%视口宽度。所以vw的 使用方法和rem非常类似
