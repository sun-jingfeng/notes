# 认识 jQuery、基础概念、实例方法、入口函数

介绍

   - [jQuery](http://jquery.com/download/) 是一个 Javascript 专注于 DOM 操作的类库，通过 系列的封 装，不仅简化了 DOM 操作，还处理了不同浏览器之间的兼容，极大的提升了编码的效率，其口号是 Write Less Do More!

- 下载

   - jQuery 从形式上来看只是一个独立的 `.js` 文件，可以在其[官网](https://jquery.com/)免费下载使用，在

   - 其官网上提供了多个不同的版本供开发者下载，一般推荐下载最新版本（目前为 v3.5.1），值得注意的是 jQuery 自 v2.0 开始不再兼容 IE6/7/8。

   - 通常下载 jQuery 时需要有 3 个文件，分别为：

      - jquery-版本号.js

      - jquery-版本号.min.js

      - jquery-版本号.min.map

   - 其中 jquery-版本号.js 与 jquery-版本号.min.js 内部分代码是一致的，区别仅仅是 jquery-版本号.min.js 中 不包含注释、换行、缩进等，甚至变量名也被处理成单个字母形式，这样做的目的是压缩代码量，使文件体积变小。

   - jquery-版本号.min.map 是官方在压缩代码时自动生成的一个文件，该文件中记录了 jquery 压缩前后的对 应关系，浏览器调试时能够快速定位到出错代码的位置。

体验

- 首先将下载好的 jQuery 文件使用 `script` 标签引入到网页标签中，如下代码所示：

1 <!DOCTYPE html> 2 <html lang="en"> 3 <head> 4 <meta charset="UTF-8"> 5 <title>jQuery - 体验 </title> 6 </head> 7 <body> 8 9 <!-- 引入 jquery --> 10 <script src=script src=="./jquery/jquery-3.5.1.min.js"></script> 11 </body> 12 </html>html>>

<script src=script src=="./jquery/jquery-3.5.1.min.js"></script>

</html>html>>

- 由于 jquery-版本号.min.js 的文件体积较小，所以推荐使用。

- 接下来基于 jQuery 实现一个简单的 DOM 操作，如下代码所示：

1

<!DOCTYPE html>

> 2 <html lang="en">

> 3 <head>

> 4 <meta charset="UTF-8">

> 5 <title>jQuery - 体验 </title>

> 6 <style>

> 7 .box {

> 8 width: 200px;

> 9 height: 200px;

> 10 background-color: pink;

> 11 }

> 12 </style>

> 13 </head>

> 14 <body>

> 15 <!-- 改变盒子的位置 -->

> 16 <div class="box"></div> 17

> 18 <!-- 引入 jQuery -->

> 19 <script src="./jquery/jquery-3.5.1.min.js"></script>

> 20 <script>

> 21 // 基于 jQuery 的 DOM 操作

> 22 let x = 0;

> 23 $('.box').click(function () {

> 24 $(this).animate({marginLeft: x += 40});

> 25 })

> 26 </script>

> 27 </body>

> 28 </html>

假如基于原生 DOM 实现上面的交互效果不得不编写大量的代码，然而基于 jQuery 的实现只用了很少的代 码，这便是开发中推荐使用 jQuery 的最主要原因。

## 基础概念——实例

jQuery 是基于 Javascript 构造函数的原型对象实现的，通过为原型对象添加属性或方法的方式实现对 DOM 操作的封装，以下代码是 jQuery 核心代码的简化版本：

> 1 <script>

> 2 // 定义了全局的构造函数 jQuery

> 3 function jQuery(selector) {

> 4 // new 关键字创建了一个实例

> 5 // 此时 init 方法也被当成了构造函数使用

return new jQuery.fn.init(selector);

6

7

> 9 // 定义别名

> 10 jQuery.fn = jQuery.prototype;

11 12 13 14 15 16 17 18 19 20 21 22

}

8

// 在 jQuery 的原型上添加了方法 init

jQuery.fn.init = function (selector) {

一 // 些操作

}

// 建立关联

jQuery.fn.init.prototype = jQuery.prototype;

jQuery.prototype.css = function () { // 此处封装样式操作的逻辑

}

23

> 24 // 为 jQuery 定义别名

> 25 let $ = jQuery;

> 26 </script>

## 总结：

- 网页中引入 jQuery 后会得到一个全局的函数 `jQuery` 或 `$`

- `$` 是 jQuery 函数的别名，使用 `$` 比使用 `jQuery` 更方便

- 每次调用 `jQuery` 或 `$` 函数都会得到一个**新的实例**

- 原型对象中存在许多的方法，调用这些方法实现 DOM 的各种操作

## 基础概念——选择器

## 说明：

   - jQuery 中的选择器是用来获取 DOM 节点的，其功能类似于原生的 `querySelectorAll` 方法，jQuery 中所 一

   - 支持的选择器与 CSS 的选择器几乎 致。

   - 选择器：jQuery通过元素的选择器获取元素、注意jQuery获取的是伪数组形式的，称为jQuery的对象

- 标签选择器

> 1 <p>jQuery 封装了大量 DOM 操作的方法，极大的提升了开发效率！ </p>

> 2 <p class="slogan">jQuery 的口号是 Write Less Do More!</p>

> 3 <p id="compat">jQuery 内部对浏览器之间的兼容也做了相关的处理。 </p> 4

> 5 <script src="./jquery/jquery-3.5.1.min.js"></script>

> 6 <script>

> 7 // 标签选择器

> 8 $('p').css('color', 'red');

> 9 </script>

## 类选择器

> 1 <p>jQuery 封装了大量 DOM 操作的方法，极大的提升了开发效率！ </p>

> 2 <p class="slogan">jQuery 的口号是 Write Less Do More!</p>

> 3 <p id="compat">jQuery 内部对浏览器之间的兼容也做了相关的处理。 </p> 4

> 5 <script src="./jquery/jquery-3.5.1.min.js"></script>

> 6 <script>

> 7 // 类选择器

> 8 $('.slogan').css('color', 'blue');

> 9 </script>

## id 选择器

> 1 <p>jQuery 封装了大量 DOM 操作的方法，极大的提升了开发效率！ </p>

> 2 <p class="slogan">jQuery 的口号是 Write Less Do More!</p>

> 3 <p id="compat">jQuery 内部对浏览器之间的兼容也做了相关的处理。 </p> 4

- 5 <script src="./jquery/jquery-3.5.1.min.js"></script>

> 6 <script>

> 7 // id 选择器

> 8 $('#compat').css('color', 'green');

> 9 </script>

## 后代选择器

> 1 <p>jQuery 封装了大量 DOM 操作的方法，极大的提升了开发效率！ </p>

> 2 <p class="slogan">jQuery 的口号是 Write Less Do More!</p>

> 3 <p id="compat">jQuery 内部对浏览器之间的兼容也做了相关的处理。 </p> 4

> 5 <script src="./jquery/jquery-3.5.1.min.js"></script>

> 6 <script>

> 7 // 后代选择器

> 8 $('body p').css('fontSize', 20);

> 9 </script>

## 总结：

- 将 CSS 的选择器以参数形式传给 jQuery 函数后便可以获取相应的 DOM 节点

- 通过 jQuery 选择器获取 DOM 节点的同时也得到了一个 jQuery 实例

- 调用实例方法完成相应的 DOM 操作

- 注：几乎所有 CSS 选择器都可以被 jQuery 支持。

## 基础概念——对象

- 虽然在 jQuery 中利用选择器能获取到相应的 DOM 节点，但此时的 DOM 节点并非是原生的 DOM 对象，因此 也就无法直接调用原生的 DOM 方法，如下代码所示：

> 1 <ul>

> 2 <li>html</li>

> 3 <li>css</li>

> 4 <li>javascript</li>

> 5 </ul>

> 6 <!-- 引入 jQuery -->

> 7 <script src="./jquery/jquery-3.5.1.min.js"></script>

> 8 <script>

> 9 // 这样写是错误的！！！

> 10 $('li').style.color = 'red';

> 11 </script>

- 在 jQuery 中利用选择器获取的 DOM 节点 jQuery 构造函数的实例对象，只能调用实例的方法才能完成 DOM 操作，正确的用法如下所示：

> 1 <ul>

> 2 <li>html</li>

> 3 <li>css</li>

> 4 <li>javascript</li>

> 5 </ul>

> 6 <!-- 引入 jQuery -->

> 7 <script src="./jquery/jquery-3.5.1.min.js"></script>

> 8 <script>

> 9 // 正确的用法

> 10 $('li').css('color', 'red');

> 11 </script>

- 我们将 jQuery 获取的 DOM 节点对象称为 jQuery 对象，`css` 方法是 jQuery 对象的方法，而 `style` 是原生 DOM 对象中的一个属性。

- 在 jQuery 中并非只能通过选择器获取 jQuery 对象，它还可以将任意原生 DOM 对象转换成 jQuery 对象，如下 代码所示：

> 1 <h4> 将原生 DOM 对象转换成 jQuery 对象后，便可以调用其实例中的方法了。 </h4> 2

> 3 <!-- 引入 jQuery -->

> 4 <script src="./jquery/jquery-3.5.1.min.js"></script>

> 5 <script>

> 6 // 原生 DOM 对象

> 7 let h4 = document.querySelector('h4'); 8

> 9 // 将原生 DOM 做为参数传入 $ 函数，自动将其转换为 jQuery 对象

> 10 $(h4).css('color', 'red');

> 11 </script>

- 注：由于 jQuery 实例中包含了许多关于 DOM 操作的方法，因此基于 jQuery 开发时会将原生 DOM 对象转换成 jQuery 对象后再使用。

## 实例方法——事件

## 快捷方法

- 在 jQuery 中以原生事件类型的名称为依据封装了相对应的事件处理方法，如下代码所示：

> 1 <div class="box"></div> 2

> 3 <script src="./jquery/jquery-3.5.1.min.js"></script>

> 4 <script>

> 5 // 为 .box 添加单击事件

> 6 $('.box').click(function () {

> 7 console.log('.box 盒子被点击了 ...');

> 8 }); 9

> 10 // 为 .box 添加鼠标移入事件

> 11 $('.box').mouseover(function () {

> 12 console.log(' 鼠标停留在 .box 盒子上了 ...');

> 13 });

> 14 </script>

我们将以原生事件类型名称做为方法名为 DOM 添加事件的方式称为快捷方法。

- 总结：

   - 语法简洁，接收回调函数做为参数，事件触发时该回调函数被执行

   - 事件触发后回调函数中的 `this` 指向添加事件的原生 DOM

   - `$(this)` 是将原生 DOM 对象转换为 jQuery 对象

## 基础方法

- 在 jQuery 中使用快捷方法能够快速为 DOM 节点添加事件监听，然而灵活性方面略显不足，因此 jQuery

- 又提供了较为灵活的 `on/off`、`bind/unbind`、`one` 方法处理 DOM 事件。

> 1 <div class="test"></div>

> 2 <button> 付款 </button> 3

> 4 <script src="./jquery/jquery-3.5.1.min.js"></script>

> 5 <script>

> 6 // 使用基础方法 on 或 bind 添加事件监听

> 7 $('.test').on('click', function () {

> 8 console.log('.test 盒子被单击了 ...');

> 9 })

10

> 11 $('.test').bind('dblclick', function () {

> 12 console.log('.test 盒子被双击了 ...');

> 13 }) 14

> 15 // 使用基础方法 off 或 unbind 移除事件监听

> 16 $('.box').off('click'); // 移除单击事件

> 17 $('.box').unbind('mouseover'); // 移除鼠标悬停事件

> 18 $('.test').off(); // 移除所有事件 19

> 20 // 一次性事件

> 21 $('button').one('click', function () {

> 22 console.log(' 付款中 ...');

> 23 })

> 24 </script>

## 总结：

- `on`、`bind`、`one` 语法结构与 `addEventListener` 类似，分别接受事件类型和回调函数做为参数

- `on` 和 `bind` 含义基本一致推荐使用 `on` 添加事件监听，`one` 添加的事件监听只生效 1 次

- `off` 和 `unbind` 用来移动 DOM 的事件，无论以何种方式添加的事件均可被移除，推荐使用 `off` 方法

- 事件回调函数中的 `this` 仍然指向的是事添加事件监听的原生 DOM

自定义事件

- 在 jQuery 中除了支持原生 DOM 事件类型外，还允许开发者自定义事件类型，如下代码所示：

> 1 <script src="./jquery/jquery-3.5.1.min.js"></script>

> 2 <script>

> 3 // 自定义事件类型 myevent

> 4 $('.demo').on('myevent', function () {

> 5 console.log('myevent 是自定义事件类型 ...');

> 6 }) 7

> 8 // 自定义事件必须通过 trigger 才能被触发

> 9 $('.demo').trigger('myevent');

> 10 </script>

## 总结：


- 自定义事件类型语法与原生事件类型 致

- 自定义事件只能通过 `trigger` 方法才能被触发

- `trigger` 方法也能用来触发原生事件类型

- 注：自定义事件是一种高级的用法，不必深入理解只需要了解其基本用法即可。

## 实例方法——样式

行内样式

通过 `css` 方法动态修改 DOM 的行内样式。

> 1 <div class="demo"></div>

> 2 <button class="btn1"> 改变上面盒子的样式 </button> 3

> 4 <script src="./jquery/jquery-3.5.1.min.js"></script>

> 5 <script>

> 6 // 单击按钮时改变 .demo 的样式

> 7 $('.btn1').click(function () {

> 8 // 调用 css 方法改变 .demo 的样式属性

> 9 $('.demo').css({

> 10 backgroundColor: 'blue',

> 11 width: 240

> 12 })

> 13 })

> 14 </script>

## 总结：


- 接受两个参数（分别为样式属性和值）时，逐 改变网页元素单个的样式属性

- 接受一个参数时（对象类型），同时修改网页元素的多个样式属性

- 样式属性值为长度时，省略长度单位 `px`

- 接受单个样式属性做为参数时，能够获取该属性对应的值

- 注：css 方法对应原生 DOM 操作中的 `style` 属性

## 类名操作

## jQuery 中封装了为网页元素添加、移除、检测、切换类名的方法。

> 1 <div class="test"></div>

> 2 <button class="add"> 添加类名 </button>

> 3 <button class="remove"> 移除类名 </button>

> 4 <button class="has"> 检测类名 </button>

> 5 <button class="toggle"> 切换类名 </button>

6

> 7 <script src="./jquery/jquery-3.5.1.min.js"></script>

> 8 <script>

> 9 $('.add').click(function () {

> 10 // 添加 active 类名

> 11 $('.test').addClass('active');

> 12 }) 13

> 14 $('.remove').click(function () {

> 15 // 移除 active 类名

> 16 $('.test').removeClass('active');

> 17 }) 18

> 19 $('.has').click(function () {

> 20 // 检测是否包含 active 类名

> 21 alert($('.test').hasClass('active'));

> 22 }) 23

> 24 $('.toggle').click(function () {

> 25 // 切换 active 类名

> 26 $('.test').toggleClass('active');

> 27 })

> 28 </script>

## 总结：

- `addClass` 方法为网页元素添加一个或多个类名，多个类名用空格进行分隔

- `removeClass` 方法移除网页元素的一个或多个类名，多个类名用空格进行分隔

- `hasClass` 方法检测网页元素是否包含某个特定的类名

- `toggleClass` 方法切换（添加/移除）一个或多个类名，多个类名用空格进行分隔

- 注：以上 4 个方法的所实现的功能分别对应原生 DOM 中的 `classList` 的 `add`、`remove`、 `contains` 和 `toggle` 4 个方法。

## 实例方法——链式

链式也叫链式操作，它是 jQuery 中提供的一种简便的语法结构，可以在一定程度上精简代码、增强代码的可读 性，如下代码所示：

> 1 <style>

> 2 .active {

> 3 background-color: red;

> 4 }

> 5 </style>

6

> 7 <div class="box"></div>

> 8 <button> 点一下 </button>

9 10 <script src="./jquery/jquery-3.5.1.min.js"></script> 11 <script> 12 // 为按钮添加单击事件 13 $('button').click(function () { 14 // 连续调用多个实例方法 15 $('.box') 16 .css('width', 240) // 改变 style 属性 17 .addClass('active') // 添加类名 18 .click(function () { // 添加单击事件 19 $(this).off('click'); 20 console.log(' 单击事件被触发 ...'); 21 }) 22 })

> 23 </script>

## 总结：


- 链式操作只一种简便的语法结构

- 链式操作时实例方法自左向右依次被执行

## 实例方法——查找

## 父子关系

- `find` 方法，参照某父元素查找其**后代元素**，该方法以选择器做为参数，在其后代元素查找符合选择器

- 条件的网页元素，其用法如下代码所示：

> 1 <script>

> 2 // 参照某父元素查找其【后代元素】

> 3 $('.course').find('li').css('color', 'red');

> 4 </script>

`children` 方法，参照某父元素查找其**子元素**，其用法如下代码所示：

> 1 <script>

> 2 // 参照某父元素查找其【子元素】

> 3 $('.box').children().css('color', 'red');

> 4 </script>

注: `children` 方法还允许传入选择器获取指定的子元素。

- `parent` 方法，参照某个子元素查找其**父元素**，其用法如下代码所示：

> 1 <script>

> 2 // 参照某个子元素查找其【父元素】

> 3 $(this).parent().css('background-color', 'pink');

> 4 </script>

`parents` 方法，参照某个子元素查找其**祖先元素**，其用法如下代码所示：

> 1 <script>

> 2 // 参照某个子元素查找其【祖先元素】

> 3 $(this).parents().css('background-color', 'pink');

> 4 </script>

注: `parents` 方法还允许传入选择器获取指定的祖先元素。

## 兄弟关系

- `siblings` 方法，查找所有同级结构关系的元素，其用法如下代码所示：

1 <nav> 2 <a href="javascript:;"> 体育新闻 </a> 3 <a href="javascript:;"> 娱乐新闻 </a> 4 <a href="javascript:;"> 国际新闻 </a> 5 <a href="javascript:;"> 国内新闻 </a> 6 </nav> 7 <script> 8 $('nav a').click(function () { 9 $(this) 10 .addClass('active') 11 .siblings() // 查找到同级的所有兄弟元素 12 .removeClass('active'); 13 }); 14 </script>

注: `siblings` 方法还允许传入选择器获取指定的兄弟元素。

- `prev` 方法，查找当前元素之前的同级结构元素，其用法如下代码所示：

> 1 <script>

> 2 // 最后一个 li 元素之前的元素

> 3 $('li:last-child').prev().css('color', 'red');

> 4 </script>

**==> picture [340 x 11] intentionally omitted <==**

**----- Start of picture text -----**<br>
`next` 方法，查找当前元素之后的同级结构元素，其用法如下代码所示：<br>**----- End of picture text -----**<br>

> 1 <script>

> 2 // 第一个 li 元素之后的元素

> 3 $('li:first-child').next().css('color', 'red');

> 4 </script>

## 实例方法——筛选

   - 大多数情况下 jQuery 获取的网页元素多以集合（伪数组）形式存在，同时 jQuery 还允许基于这个集合进一步 筛选出更精确的网页元素。

   - `first` 方法，筛选出集合中的第一个元素

- 1 <ul>

> 2 <li>html</li>

> 3 <li>css</li>

> 4 <li>javascript</li>

- 5 </ul> 6 <script>

> 7 // 查找到第一个 li 元素

> 8 $('li').first().css('color', 'red');

> 9 $('ul').children().first();

> 10 </script>

`last` 方法，筛选出集合中的最后一个元素

> 1 <ul>

> 2 <li>html</li>

> 3 <li>css</li>

> 4 <li>javascript</li>

> 5 </ul>

> 6 <script>

> 7 // 查找到最后一个 li 元素

> 8 $('li').last().css('color', 'blue');

> 9 $('ul').children().last().css('color', 'blue');

> 10 </script>

## `eq` 方法，以索引为依据筛选集合中的元素

> 1 <ul>

> 2 <li>html</li>

> 3 <li>css</li>

> 4 <li>javascript</li>

> 5 </ul>

> 6 <script>

> 7 // 以索引为依据筛选集合中的元素

> 8 $('li').eq(1).css('color', 'green');

> 9 $('ul').children().eq(1).css('color', 'green');

> 10 </script>

## 实例方法——属性

## jQuery 中封装了设置和读取网页元素属性的方法，其用法如下代码所示：

> 1 <img

> 2 data-src="./images/card.gif"

> 3 src="./images/placeholder.png"

> 4 alt=""

> 5 >

> 6 <button> 换图 </button>

> 7 <script src="./jquery/jquery-3.5.1.min.js"></script>

> 8 <script> 9

> 10 $('button').click(function () {

> 11 // 读取 data-src 中图片路径

> 12 let imgPath = $('img').attr('data-src');

> 13 // 设置 src 属性

> 14 $('img').prop('src', imgPath);

> 15 })

> 16 </script>

## 总结：

- prop()操作固有属性、attr()操作自定义属性（固有属性也可以操作）、data()操作data-属性

- 接受属性名为参数时用于获取该属性对应的值，接受属性和值两个参数时用于设置该属性且赋值

- 注：针对自定义属性可以使用 `data` 方法。

## 实例方法——文本

- jQuery 中封装了设置和读取网页元素文本内容的方法，其用法如下代码所示：

1

<div class="box"></div>

> 2 <script>

> 3 $('.box').html('<h4> 学习 jQuery</h4>');

- 4 $('.box').text('<h4> 学习 jQuery</h4>');

> 5 </script>

## 总结：

- `text` 相当于原生的 innerText ，它无法解析 html 标签

- `html` 相当于原生的 innerHTML，能够解析文本中的 html 标签

- `html` 和 `text` 方法不传入参数时用于读取文本内容

## 入口函数

   - 描述：页面加载完成之后触发的函数

   - 第一种：

- 1 $(function () {

- 2 $('div').css('background', 'red');

- 3 });

## 第二种：

- 1 $(document).ready(function () {

- 2 $('div').css('background', 'blue');

- 3 })
