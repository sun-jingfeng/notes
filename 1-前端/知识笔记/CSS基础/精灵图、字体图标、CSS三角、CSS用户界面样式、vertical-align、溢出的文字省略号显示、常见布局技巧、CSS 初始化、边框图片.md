# 精灵图、字体图标、CSS 三角等

## 使用精灵图核心


   - 精灵技术主要针对于背景图片使用。把多个小背景图整合到一张大图中。

   - 这个大图片也称为 sprites 精灵图 或者 雪碧图

   - 移动背景图片位置， 此时可以使用 background-position 。

   - 移动的距离就是这个目标图片的 x 和 y 坐标。注意网页中的坐标有所不同


   - 一般情况下向上、向左移动，数值为负。

   - 使用精灵图的时候需要精确测量，每个小背景图片的大小和位置。

- 使用精灵图核心总结：

   - 精灵图主要针对于小的背景图片使用。

   - 主要借助于背景位置来实现---background-position 。

   - 一般情况下精灵图都是负值。（千万注意网页中的坐标： x轴右边走是正值，左边走是负值， y轴同理）

## 字体图标

- 字体图标推荐下载网站：

   - 阿里 iconfont 字库 http://www.iconfont.cn/

   - icomoon 字库 http://icomoon.io

## 字体图标的引入

- 把下载包里面的五个不认识格式的文件放入页面根目录下的新建文件夹fonts中。（html文件是说明文档）

**==> picture [467 x 179] intentionally omitted <==**

**==> picture [467 x 167] intentionally omitted <==**

## 在 CSS 样式中全局声明字体： 简单理解把这些字体文件通过css引入到我们页面中（一定注意字体文件路

径的问题）。

> 1 /* 改路径之前 */

> 2 @font-face {

> 3 font-family: 'iconfont';

> 4 src: url('iconfont.eot');

> 5 src: url('iconfont.eot?#iefix') format('embedded-opentype'),

> 6 url('iconfont.woff2') format('woff2'),

> 7 url('iconfont.woff') format('woff'),

> 8 url('iconfont.ttf') format('truetype'),

> 9 url('iconfont.svg#iconfont') format('svg');

> 10 } 11

> 12 /* 改路径之后（字体文件夹名字为 fonts 且在根目录） */

> 13 @font-face {

> 14 font-family: 'iconfont';

> 15 src: url('./fonts/iconfont.eot');

> 16 src: url('./fonts/iconfont.eot?#iefix') format('embedded-opentype'),

> 17 url('./fonts/iconfont.woff2') format('woff2'),

> 18 url('./fonts/iconfont.woff') format('woff'),

> 19 url('./fonts/iconfont.ttf') format('truetype'),

> 20 url('./fonts/iconfont.svg#iconfont') format('svg');

> 21 }

## html 标签内添加小图标。

**==> picture [85 x 11] intentionally omitted <==**

**----- Start of picture text -----**<br>
在正常标签中添加<br>**----- End of picture text -----**<br>

**==> picture [302 x 176] intentionally omitted <==**

> 1 <span class="iconfont">&#xe603;</span>

## 在伪元素中添加

**==> picture [275 x 163] intentionally omitted <==**

> 1 span::after {

> 2 content: "\e603";/* 复制后四位，且前面加个 \ */

> 3 }

## 给标签定义字体。

正常标签中的字体图标。

> 1 <style>

> 2 .iconfont {

> 3 font-family: "iconfont" !important;

> 4 font-size: 16px;

> 5 font-style: normal;

> 6 -webkit-font-smoothing: antialiased;

> 7 -moz-osx-font-smoothing: grayscale;

> 8 }

> 9 </style> 10

> 11 <body>

> 12 <span class="iconfont">&#xe603;</span>

> 13 </body>

伪元素中的字体图标。

> 1 <style>

> 2 span::after {

> 3 content: "\e603";

> 4 font-size: 16px;

> 5 font-style: normal;

> 6 -webkit-font-smoothing: antialiased;

> 7 -moz-osx-font-smoothing: grayscale;

> 8 }

> 9 </style>

## 注意：

- 这种方法如果图标和文字对不齐，可加一条vertical-align: middle;进行调节

- 如果还是对不齐，可以再调节字体图标的行高（需要先把这个伪元素设置成行内块或者块并 使其高度高于字体图标）

## 字体图标的追加

- 如果工作中，原来的字体图标不够用了，我们需要添加新的字体图标到原来的字体文件中。

- 重新下载文件，把压缩包里面的不认识的五个文件替换一下。

## CSS 三角

- 一 张图， 你就知道 CSS 三角是怎么来的了, 做法如下：

**==> picture [82 x 76] intentionally omitted <==**

## 代码：

> 1 div {

> 2 width: 0;

> 3 height: 0;

> 4 line-height: 0;

> 5 font-size: 0;

> 6 border: 50px solid transparent;

> 7 border-left-color: pink;

> 8 }

CSS 用户界面样式


- 所谓的界面样式，就是更改 些用户操作样式，以便提高更好的用户体验。

   - 更改用户的鼠标样式

表单轮廓

- 防止表单域拖拽

## 鼠标样式 cursor

代码：

> 1 li {

> 2 cursor: pointer;

> 3 }

设置或检索在对象上移动的鼠标指针采用何种系统预定义的光标形状。

**==> picture [467 x 149] intentionally omitted <==**

- 轮廓线 outline

给表单添加 outline: 0; 或者 outline: none; 样式之后，就可以去掉默认的蓝色边框。

> 1 input {

> 2 outline: none;

> 3 }

## 防止拖拽文本域 resize

实际开发中，我们文本域右下角是不可以拖拽的。

> 1 textarea{

> 2 resize: none;

> 3 }

vertical-align 属性介绍

- CSS 的 vertical-align 属性使用场景： 经常用于设置图片或者表单(行内块元素）和文字垂直对齐。

- 官方解释： 用于设置一个元素的垂直对齐方式，但是它只针对于行内元素或者行内块元素有效。

- 语法：

1

vertical-align : baseline | top | middle | bottom

**==> picture [467 x 129] intentionally omitted <==**

**==> picture [464 x 112] intentionally omitted <==**

## vertical-align 属性应用

- 图片、表单和文字对齐

图片、表单都属于行内块元素，默认的 vertical-align 是基线对齐。

**==> picture [289 x 121] intentionally omitted <==**

   - 此时可以给图片、表单这些行内块元素的 vertical-align 属性设置为 middle 就可以让文字和图片垂直 居中 对齐了。

- 解决图片、iframe底部默认空白缝隙问题

   - bug：图片、iframe底侧会有一个空白缝隙，原因是行内块元素会和文字的基线对齐。

   - 主要解决方法有两种：

      - 添加 vertical-align:middle | top| bottom 等。 （提倡使用的）

      - 转换为块级元素 display: block;

**==> picture [467 x 127] intentionally omitted <==**

## 溢出的文字省略号显示

-- 单行文本溢出显示省略号 必须满足三个条件

> 1 一 /* 强制 行内显示文本 */

> 2 white-space: nowrap; （ 默认 normal 自动换行）

> 3 /* 文字用省略号替代超出的部分 */

> 4 text-overflow: ellipsis;

> 5 /* 超出的部分隐藏 */

> 6 overflow: hidden;

多行文本溢出显示省略号

- 多行文本溢出显示省略号，有较大兼容性问题， 适合于webKit浏览器或移动端（移动端大部分是webkit内 核）

> 1 /* 弹性伸缩盒子模型显示 */

> 2 display: -webkit-box;

> 3 /* 设置或检索伸缩盒对象的子元素的排列方式 */

> 4 -webkit-box-orient: vertical;

> 5 /* 限制在一个块元素显示的文本的行数 */

> 6 -webkit-line-clamp: 2;

> 7 /* 超出的部分隐藏 */

> 8 overflow: hidden;

## 常见布局技巧

## margin负值运用

**==> picture [314 x 208] intentionally omitted <==**

**==> picture [274 x 12] intentionally omitted <==**

**----- Start of picture text -----**<br>
让每个盒子margin 往左侧移动 -1px 正好压住相邻盒子边框<br>**----- End of picture text -----**<br>

   - 鼠标经过某个盒子的时候，提高当前盒子的层级即可（如果没有有定位，则加相对定位（保留位置），如 果有定位，则加z-index）

- 文字围绕浮动元素

**==> picture [247 x 134] intentionally omitted <==**

**==> picture [183 x 11] intentionally omitted <==**

**----- Start of picture text -----**<br>
巧妙运用浮动元素不会压住文字的 特性<br>**----- End of picture text -----**<br>

**==> picture [193 x 11] intentionally omitted <==**

**----- Start of picture text -----**<br>
行内块巧妙运用（页码在页面中间显示:）<br>**----- End of picture text -----**<br>

**==> picture [467 x 125] intentionally omitted <==**

**==> picture [311 x 12] intentionally omitted <==**

**----- Start of picture text -----**<br>
把这些链接盒子转换为行内块， 之后给父级指定 text-align:center;<br>**----- End of picture text -----**<br>

- 利用行内块元素中间有缝隙，并且给父级添加 text-align:center; 行内块元素会水平会居中

- CSS 三角强化

**==> picture [144 x 45] intentionally omitted <==**

原理：

**==> picture [212 x 54] intentionally omitted <==**

代码：

> 1 width: 0;

> 2 height: 0;

> 3 border-color: transparent red transparent transparent;

- 4 border-style: solid;

- 5 border-width: 22px 8px 0 0;

## CSS 初始化

- 不同浏览器对有些标签的默认值是不同的，为了消除不同浏览器对HTML文本呈现的差异，照顾浏览器的兼容，

- 我们需要对CSS 初始化。

- 简单理解： CSS初始化是指重设浏览器的样式。 (也称为CSS reset）。每个网页都必须首先进行 CSS初始化。 这里我们以 京东CSS初始化代码为例。

- Unicode编码字体：把中文字体的名称用相应的Unicode编码来代替，这样就可以有效的避免浏览器解释CSS代

- 码时候出现乱码的问题。

- 比如：黑体 \9ED1\4F53、宋体 \5B8B\4F53、微软雅黑 \5FAE\8F6F\96C5\9ED1。
