# CSS 的背景

## 背景颜色

- background-color 属性定义了元素的背景颜色，例如：

> 1 background-color: 颜色值 ;

一般情况下元素背景颜色默认值是 transparent（透明），我们也可以手动指定背景颜色为透明色。例如：

1

background-color:transparent;

## 背景图片

- background-image 属性描述了元素的背景图像。实际开发常见于 logo 或者一些装饰性的小图片或者是超大的背景图片， 优点是非常便于控制位置. (精灵图也是一种运用场景)。例如：

> 1 background-image : none | url (url)

**==> picture [467 x 80] intentionally omitted <==**

注意：背景图片后面的地址，千万不要忘记加 URL， 同时里面的路径不要加引号。

## 背景平铺

如果需要在 HTML 页面上对背景图像进行平铺，可以使用 background-repeat 属性。例如：

> 1 background-repeat: repeat | no-repeat | repeat-x | repeat-y

**==> picture [467 x 124] intentionally omitted <==**

## **背景图片位置**

利用 background-position 属性可以改变图片在背景中的位置。例如：

> 1 background-position: x y;  <!-- 参数代表的意思是： x 坐标和 y 坐标。 可以使用 方位名词 或 者 精确单位 -->

**==> picture [467 x 79] intentionally omitted <==**

## 参数是方位名词


   - 如果指定的两个值都是方位名词，则两个值前后顺序无关，比如 left top 和 top left 效果一致

   - 如果只指定了一个方位名词，另一个值省略，则第二个值默认居中对齐

- 参数是精确单位

   - 如果参数值是精确坐标，那么第一个肯定是 x 坐标，第二个一定是 y 坐标

   - 如果只指定一个数值，那该数值一定是 x 坐标，另一个默认垂直居中

- 参数是混合单位

   - 如果指定的两个值是精确单位和方位名词混合使用，则第一个值是 x 坐标，第二个值是 y 坐标

## 背景图像固定

- background-attachment 属性设置背景图像是否固定或者随着页面的其余部分滚动。例如：

> 1 background-attachment : scroll | fixed

**==> picture [467 x 83] intentionally omitted <==**

## 背景图片尺寸

- 属性：background-size

- 作用：设置背景图的大小

值

- px

- % （注意：相对的是盒子的宽高，不是背景图片）

- 关键字

   - cover（覆盖）：盒子不可能有缝隙，图片可能部分被遮盖

   - contain（包含）：图片完整展示，盒子可能会有缝隙

## **背景复合写法**

   - 为了简化背景属性的代码，我们可以将这些属性合并简写在同一个属性 background 中。从而节约代码量。

   - 当使用简写属性时，没有特定的书写顺序,一般习惯约定顺序为： background: 背景颜色 背景图片地址 背景平 铺 背景图像滚动 背景图片位置 / 背景图片尺寸;例如：

- 1 background: transparent url(image.jpg) no-repeat fixed center / contain;

## 背景色半透明

CSS3 为我们提供了背景颜色半透明的效果。例如：

- 1 background: rgba(0, 0, 0, 0.3);

   - 最后一个参数是 alpha 透明度，取值范围在 0~1之间

   - 我们习惯把 0.3 的 0 省略掉，写为 background: rgba(0, 0, 0, .3);

   - 注意：背景半透明是指盒子背景半透明，盒子里面的内容不受影响

   - CSS3 新增属性，是 IE9+ 版本浏览器才支持的

   - 但是现在实际开发,我们不太关注兼容性写法了,可以放心使用

## 背景总结

**==> picture [467 x 193] intentionally omitted <==**

背景图片:实际开发常见于 logo 或者一些装饰性的小图片或者是超大的背景图片, 优点是非常便于控制位置. (精灵图也是一种运用场景)
