# 样式公共值、避免样式污染、浏览器引擎前缀、flex 版心

样式公共值

initial

CSS 关键字 initial 将属性的初始（或默认）值应用于元素。

- inherit

   - inherit 关键字使得元素获取其父元素的计算值。 对于继承属性，inherit 关键字只是增强了属性的默认行为，通常只在覆盖原有的值的时候使用。 继承始终来自文档树中的父元素，即使父元素不是包含块。

unset

   - CSS 关键字 unset 可以分为两种情况，如果这个属性本来有从父级继承的值（这个属性默认可以继承，且 父级有定义），则将该属性重新设置为继承的值，如果没有继承父级样式，则将该属性重新设为初始值。换句话说，对继承属性行为类似 inherit，对非继承属性类似 initial。

- revert

个人理解：元素的初始样式包含了【默认样式】、【浏览器自带样式】（控制台中的user agent stylesheet

- 部分）。当有继承值时，unset和revert效果相同，都为继承值。当没有继承值时，unset为【默认样式】， revert为【浏览器自带样式】。

说明：四种值都可以应用于任何 CSS 属性，包括 CSS 简写 all。

## 避免样式污染

scoped module postcss-prefix-selector

## 通过给样式加:not()的方式

示例代码

> 1 // vite.config.ts

> 2 import prefixer from 'postcss-prefix-selector' 3

> 4 export default defineConfig({

> 5 css: {

> 6 postcss: {

> 7 plugins: [

> 8 prefixer({

> 9 prefix: ':not(.micro-app *)',

> 10 transform(prefix, _selector) { ''

> 11 const [selector, pseudo = ] = _selector.split(/(:\S*)$/)

> 12 return selector + prefix + pseudo

> 13 }

> 14 })

> 15 ]

> 16 }

> 17 }

> 18 })

使用影子 DOM

whyframe

## 浏览器引擎前缀

- -webkit- （谷歌，Safari，新版 Opera 浏览器，以及几乎所有 iOS 系统中的浏览器（包括 iOS 系统中的火狐浏 览器）；基本上所有基于 WebKit 内核的浏览器）

- -moz- （火狐浏览器）

- -o- （旧版 Opera 浏览器）

- -ms- （IE 浏览器 和 Edge 浏览器）

- 文档：浏览器引擎前缀

## flex版心

## 需求：

      - 版心不足视窗高度时拉伸到视窗高度，版心超出视窗高度时出滚动条

      - 版心上下留白

   - 实现：

- 1 <div class="box">

- 2 <div class="page-center"></div>

- 3 </div>

4

- 5 ------- 分割线 -------

6

- 7 .box {

- 8 background-color: #f5f5f5;

- 9 padding: 10px 0;

> 10 width: 100%; // 关键代码

> 11 min-height: calc(100% - 0.8rem); // 关键代码： 0.8rem 是导航高度

- 12 display: flex; // 关键代码

- 13 justify-content: center; // 关键代码

> 14 > .page-center {

> 15 background-color: #fff;

> 16 width: 1200px;

> 17 border-radius: 8px;

> 18 }

}

19
