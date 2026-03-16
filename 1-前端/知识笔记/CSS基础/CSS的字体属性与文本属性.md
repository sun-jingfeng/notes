# CSS 的字体属性与文本属性

## 字体系列

CSS 使用 font-family 定义字体系列。

> 1 p { font-family:" 微软雅黑 ";}

> 2 div {font-family: Arial,"Microsoft Yahei", " 微软雅黑 ";}

## 注意：

- 各种字体之间必须使用英文状态下的逗号隔开

- 多词字体（有空格）需加引号

- 尽量使用系统默认自带字体，保证在任何用户的浏览器中都能正确显示

- 最常见的几个字体：body {font-family: 'Microsoft YaHei',tahoma,arial,'Hiragino Sans GB'; }

## 字体大小

CSS 使用 font-size 属性定义字体大小。

> 1 p {

> 2 font-size: 20px;

> 3 }

## 注意：

- px（像素）大小是我们网页的最常用的单位

- 谷歌浏览器默认的文字大小为16px

- 不同浏览器可能默认显示的字号大小不一致，我们尽量给一个明确值大小，不要默认大小

- 可以给 body 指定整个页面文字的大小

## 字体粗细

CSS 使用 font-weight 属性设置文本字体的粗细。

> 1 p {

> 2 font-weight: bold;

> 3 }

**==> picture [467 x 99] intentionally omitted <==**

注意：

学会让加粗标签（比如 h 和 strong 等) 不加粗，或者其他标签加粗

实际开发时，我们更喜欢用数字表示粗细

## 文字样式

CSS 使用 font-style 属性设置文本的风格。

> 1 p {

> 2 font-style: normal;

> 3 }

**==> picture [467 x 78] intentionally omitted <==**

## 注意：平时我们很少给文字加斜体，反而要给斜体标签（em，i）改为不倾斜字体。

## 字体复合属性

字体属性可以把以上文字样式综合来写, 这样可以更节约代码:

> 1 body {

> 2 font: font-style font-weight font-size/line-height font-family;

> 3 }

## 注意：

- 使用 font 属性时，必须按上面语法格式中的顺序书写，不能更换顺序，并且各个属性间以空格隔开

- 不需要设置的属性可以省略（取默认值），但必须保留 font-size 和 font-family 属性，否则 font 属性将不 起作用

## 字体属性总结

**==> picture [467 x 144] intentionally omitted <==**

## 文本颜色

color 属性用于定义文本的颜色。

> 1 div {

> 2 color: red;

> 3 }

**==> picture [467 x 103] intentionally omitted <==**

开发中最常用的是十六进制

## 对齐文本

text-align 属性用于设置元素内文本内容的水平对齐方式。

**==> picture [550 x 103] intentionally omitted <==**

**----- Start of picture text -----**<br>
1 div {<br>2     text-align: center;<br>3 }<br>**----- End of picture text -----**<br>

**==> picture [467 x 103] intentionally omitted <==**

## 装饰文本

- text-decoration 属性规定添加到文本的修饰。可以给文本添加下划线、删除线、上划线等。

**==> picture [550 x 101] intentionally omitted <==**

**----- Start of picture text -----**<br>
1 div {<br>2     text-decoration ： underline ；<br>3 }<br>**----- End of picture text -----**<br>

**==> picture [467 x 121] intentionally omitted <==**

重点记住如何添加下划线、如何删除下划线

## 文本缩进

text-indent 属性用来指定文本的第一行的缩进，通常是将段落的首行缩进。

**==> picture [550 x 101] intentionally omitted <==**

**----- Start of picture text -----**<br>
1 div {<br>2     text-indent: 10px;<br>3 }<br>**----- End of picture text -----**<br>

**==> picture [421 x 11] intentionally omitted <==**

**----- Start of picture text -----**<br>
一<br>通过设置该属性，所有元素的第 行都可以缩进一个给定的长度，甚至该长度可以是负值。<br>**----- End of picture text -----**<br>

**==> picture [550 x 102] intentionally omitted <==**

**----- Start of picture text -----**<br>
1 p {<br>2     text-indent: 2em;<br>3 }<br>**----- End of picture text -----**<br>

- em 是一个相对单位，就是当前元素（font-size) 1 个文字的大小, 如果当前元素没有设置大小，则会按照父元素 的 1 个文字大小。

## 行间距

- line-height 属性用于设置行间的距离（行高）。可以控制文字行与行之间的距离

> 1 p {

> 2 line-height: 26px;

> 3 }

**==> picture [467 x 154] intentionally omitted <==**

## 文本属性总结

**==> picture [467 x 145] intentionally omitted <==**
