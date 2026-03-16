# CSS3 盒子模型、过渡、滤镜、计算

## CSS3 盒子模型

- CSS3 可通过 box-sizing 指定盒模型，取值为 content-box 或 border-box，从而改变盒子大小的计算方式。

- 盒子大小的方式就发生了改变。

- 可以分成两种情况：

   - box-sizing: content-box 盒子大小为 width + padding + border （以前默认的）

   - box-sizing: border-box 盒子大小为 width

- 如果盒子模型我们改为了box-sizing: border-box ， 那padding和border就不会撑大盒子了（前提padding和

- border不会超过width宽度）

## 过渡

- 过渡（transition)是CSS3中具有颠覆性的特征之一，我们可以在不使用 Flash 动画或JavaScript 的情况下，当元素从一种样式变换为另一种样式时为元素添加效果。过渡动画是从一个状态渐渐的过渡到另外一个状态。可以让我们页面更好看，更动感十足，虽然低版本浏览器不支持（ie9以下版本）但是不会影响页面布局。我们现在经常和 :hover 一起搭配使用。

- 代码：

> 1 transition: 要过渡的属性 花费时间 运动曲线 何时开始 ;

- 属性 ： 想要变化的 css 属性， 宽度高度 背景颜色 内外边距都可以 。如果想要所有的属性都变化过渡，

- 写一个all 就可以，也可以省略。

- 花费时间： 单位是 秒（必须写单位） 比如 0.5s

- 运动曲线： 默认是 ease （可以省略）

- 何时开始 ：单位是 秒（必须写单位）可以设置延迟触发时间 默认是 0s （可以省略）

**==> picture [467 x 88] intentionally omitted <==**

## 滤镜

- filter属性将模糊或颜色偏移等图形效果应用于元素。

**==> picture [5 x 7] intentionally omitted <==**

**----- Start of picture text -----**<br>
1<br>**----- End of picture text -----**<br>

filter: 函数 (); 例如： filter: blur(5px); /* blur 模糊处理 数值越大越模糊 */

**==> picture [441 x 153] intentionally omitted <==**

## 计算

一 calc()让你在声明CSS属性值时执行 些计算。

1

width: calc(100% - 80px);

括号里面可以使用 + - * / 来进行计算。
