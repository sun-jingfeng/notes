# Less、Sass

## Less 是什么？

是一个 CSS 预处理语言

## 有什么用？

扩展了 CSS 语言，使 CSS 代码更易维护和扩展，从而提供开发效率

- 常见的 CSS 预处理语言还有哪些？


   - Less | Sass | Stylus （它们作用和语法都类似，熟练掌握一种即可）

## 注意

- 后缀名为 .less

- 浏览器不认识 less 代码

**==> picture [416 x 242] intentionally omitted <==**

- 在vscode中安装 Easy LESS 这个插件即可

**==> picture [491 x 142] intentionally omitted <==**

Sass

文档：Sass中文网

## 常用语法

嵌套

变量 $

- @each

示例

1

// 类名： .g-[p1][p2]-[p3] 格式，其中 p1 、 p2 、 p3 是变量， p1 可以是 m/p ， p2 可以是 t/r/b/l ， p3 可以 是 base/xs/sm/md/lg/xl

> 2 // 值： 组件库相应尺寸内边距

- 3 // 例子 : .g-mt-base 的值为 margin-top: var(--van-padding-base);

> 4 $names:(

> 5 (m, margin),

- 6 (p, padding),

> 7 );

> 8 $positions:(

- 9 (t, top),

- 10 (r, right), 11 (b, bottom),

- 12 (l, left),

- 13 );

> 14 $size-value: (

> 15 (base, var(--van-padding-base)),

> 16 (xs, var(--van-padding-xs)),

> 17 (sm, var(--van-padding-sm)),

> 18 (md, var(--van-padding-md)),

- 19 (lg, var(--van-padding-lg)),

- 20 (xl, var(--van-padding-xl)),

> 21 );

> 22 @each $name-abb, $name in $names {

> 23 @each $positon-abb, $positon in $positions {

> 24 @each $size, $value in $size-value {

> 25 .g-#{$name-abb}#{$positon-abb}-#{$size} {

> 26 #{$name}-#{$positon}: $value

> 27 };

> 28 }

> 29 }

> 30 }

## 混合指令
