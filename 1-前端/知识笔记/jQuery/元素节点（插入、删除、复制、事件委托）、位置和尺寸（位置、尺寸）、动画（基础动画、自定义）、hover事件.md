# 元素节点、位置尺寸、动画、hover 事件

元素节点——插入

jQuery 中封装了在指定位置动态插入元素节点的方法，其用法如下代码所示：

1 <script> 2 // 待插入的元素节点 ` 3 let tr = $( 4 <tr> 5 <td> 学员 </td> 6 <td>17</td> 7 <td> 女 </td> 8 <td>13632369876</td> 9 <td> 10 <button class="btn btn-xs btn-info edit"> 编辑 </button> 11 <button class="btn btn-xs btn-danger delete"> 删除 </button> 12 </td> 13 </tr> 14 `); 15 16 // 1. 参照父元素的位置插入 17 $('tbody').append(tr); 18 $('tbody').prepend(tr); 19 20 // 2. 参照兄弟元素的位置插入 21 $('tbody').eq(2).after(tr); 22 $('tbody').eq(3).before(tr); 23 </script>

## 总结：

- `append`、`prepend` 以父元素为参考分别在结尾处和开头处插入新的元素节点

- `after`、`before` 以当前元素为参考在之前或之后插入新的元素节点

- `append`、`prepend`、`after`、`before` 均支持直接将 html 字符串做为节点插入

## 元素节点——删除

jQuery 中封装了动态删除元素节点的方法，其用法如下代码所示：

> 1 <script>

> 2 // 删除 li 元素

> 3 $(this).parents('tr').remove();

> 4 </script>

总结：

- `remove` 方法删除的是当前调用方法的元素节点

- `empty` 方法删除的是当前调用方法的元素节点的后代

## 元素节点——复制

jQuery 中封装了复制（克隆）元素节点的方法，其用法如下代码所示：

> 1 <script>

> 2 // 通过复制获得新的节点

> 3 $(this).parents('tr').clone(true);

> 4 </script>

## 总结：

- `clone` 方法复制得到的元素节点仍是 jQuery 对象

- 待复制的节点中如果有事件监听，需要为 `clone` 方法传入参数 `true`

## 元素节点——事件委托

- jQuery 中封装了事件委托的支持，其用法如下代码所示：

> 1 <script>

> 2 // on 方法内置支持事件委托

> 3 $('table').on('click', '.delete', function () {

> 4 $(this).parents('tr').remove();

> 5 }) 6

> 7 // 或者使用

> 8 $('table').delegate('.delete', 'click', function () {

> 9 $(this).parents('tr').remove();

> 10 })

> 11 </script>

## 总结：

- 事件委托需要为某个在 DOM 中已经存在的祖先元素添加事件监听

- `delegate` 方法是 jQuery 中专门的事件委托的方法

- `on` 方法中也内置支持事件委托，推荐使用 `on` 方法

## 位置和尺寸——位置

**==> picture [477 x 12] intentionally omitted <==**

**----- Start of picture text -----**<br>
jQuery 对获取元素位置进行了封装，使得在不同场景中获取元素位置十分方便，其用法如下代码所示：<br>**----- End of picture text -----**<br>

> 1 <script>

> 2 // 获取参照 html 文档的位置

> 3 $('.box').offset(); 4

> 5 // 获取参照最近的已定位祖先元素位置

> 6 $('.box').position(); 7

> 8 // 获取子元素滚动的距离

> 9 $('.outer').scrollTop();

> 10 $('.outer').scrollLeft();

> 11 </script>

## 总结：

- `offset` 方法获取元素参照 html 文档的位置，无论该元素是否采用了定位

- `position` 方法获取元素参照最近的已定位的祖先元素的位置

- `scrollTop/scrollLeft` 方法获取子元素滚动的位置（距离）

- 了解一个细节：`offset` 计算位置时会忽略外边距（margin），而 `position` 计算位置时则以外边距 （margin）为边界

## 位置和尺寸——尺寸

- jQuery 对获取元素尺寸进行了封装，使得在不同场景中获取元素尺寸十分方便，其用法如下代码所示：

> 1 <script>

> 2 // 只包含内容区域尺寸大小

> 3 $('.box').width();

> 4 $('.box').height(); 5

> 6 // 包括内容区域 + 内边距尺寸大小

> 7 $('.box').innerWidth();

> 8 $('.box').innerHeight(); 9

> 10 // 包括内容区域 + 内边距 + 边框尺寸大小

> 11 $('.box').outerWidth();

> 12 $('.box').outerHeight();

> 13 </script>

## 总结：

- `width/height` 方法获取元素尺寸大小时只包括盒子模型中的内容区域

- `innerWidth/innerHeight` 方法获取元素尺寸大小时包括盒子模型中的内容区域 + 内边距

- `outerWidth/outerHeight` 方法获取元素尺寸大小时包括盒子模型中的内容区域 + 内边距 + 边框

- 注：`outerWidth/outerHeight` 方法传入参数值 `true` 获取元素尺寸大小包括内容区域 + 内边框 + 边框 + 外边距

## 动画——基础动画

- jQuery 中封装了元素显示/隐藏的快捷操作并且支持动画形式的交互效果，主要有以下几种用法： 显示/隐藏

> 1 <script>

> 2 // 设置盒子显示

> 3 $('.box').show();

> 4 // 设置盒子隐藏

> 5 $('.box').hide();

> 6 // 设置盒子显示 / 隐藏

> 7 $('.box').toggle();

> 8 </script>

## 总结：

   - `show` 方法设置元素显示，实质是设置元素样式 `display: block`

   - `hide` 方法设置元素隐藏，实质是设置元素样式 `display: none`

   - `toggle` 方法交替设置元素显示/隐藏

   - `show`、`hide`、`toggle` 方法均可以接收时间（毫秒）做为参数，此时将产生动画效果

- 淡入/淡出

> 1 <script>

> 2 // 设置盒子显示

> 3 $('.box').fadeIn();

> 4 // 设置盒子隐藏

> 5 $('.box').fadeOut();

> 6 // 设置盒子显示 / 隐藏

> 7 $('.box').fadeToggle();

> 8 </script>

## 总结：

   - `fadeIn` 方法设置元素显示，实质是设置元素样式 `opacity: 1; display: block;`

   - `fadeOut` 方法设置元素隐藏，实质是设置元素样式 `opacity: 0; display: none`

   - `fadeToggle` 方法交替设置元素显示/隐藏

   - fadeTo：淡出到某个程度：必写参数透明度的值（0-1）

   - `fadeIn`、`fadeOut`、`fadeToggle` 方法默认支持动画效果，接收时间（毫秒）做为参数时能够 控制动画执行的速度

- 展开/折叠：滑动动画

> 1 <script>

> 2 // 滑动效果

> 3 // 设置盒子显示

> 4 $('.box').slideDown();

> 5 // 设置盒子隐藏

> 6 $('.box').slideUp();

> 7 // 设置盒子显示 / 隐藏

> 8 $('.box').slideToggle();

> 9 </script>

## 总结：

- `slideUp` 方法设置元素隐藏，实质上设置元素的宽高和内外边距以及 `overflow: hidden`

- `slideDown` 方法设置元素显示，实质上设置元素的宽高和内外边距

- `slideToggle` 方法交替设置元素的显示/隐藏

- `slideUp`、`slideDown`、`slideToggle` 方法默认支持动画效果，接收时间（毫秒）做为参数时 能够控制动画执行的速度

## 动画——自定义

- jQuery 中提供的基础动画主要是针对元素的显示/隐藏展开的，不仅如此 jQuery 还提供了 `animate` 方法支持 开发者自定义更为丰富的动画效果，其用法如下代码所示：

> 1 <script>

> 2 // 自定义动画

> 3 $('.box').animate({

> 4 marginLeft: 200,

> 5 width: 300,

> 6 height: 200,

> 7 backgroundColor: 'red'

> 8 }, 2000)

> 9 </script>

## 总结：

- `animate` 方法支持开发者自定义 CSS 动画样式，并控制动画执行的速度

- `animate` 只支持值为数值的 CSS 样式，默认以 `px` 为长度单位

## 动画——其它

延时设置

jQuery 不仅可以设置动画执行的速度，还能在动画执行前设置一定的延时，其用法代下代码所示：

> 1 <script>

> 2 // 等待 1500 毫秒后再隐藏

> 3 $('.box').delay(1500).hide();

> 4 // 选改变盒子宽度为 400px 等待 1000 毫秒后再改变盒子的高度为 200px

> 5 $('.box').animate({width: 400}, 500).delay(15000).animate({height: 200}, 500);

> 6 </script>

## 总结：

`delay` 方法常用来设置动画的延时执行，接受时间（毫秒）做为参数

终止动画

> 1 <script>

> 2 // 只传一个 true 时，为 暂停

> 3 $('.box').stop(true);

> 4 // 传入两个 true 时，为 结束

> 5 $('.box').stop(true, true);

> 6 </script>

## 总结：

- `stop` 只传一个 true 时，为暂停

- `stop` 传入两个 true 时，为结束

## 回调函数

- 所有的 jQuery 动画方法都支持传入回调函数，该函数会在动画执行结束时立即执行，其用法如下代码所 示：

> 1 <script>

> 2 $('.box').fadeOut(500, function () {

> 3 // 回调函数会在动画执行结束时被调用

> 4 // 引入的 this 指向了执行动画的元素节点

> 5 $(this).remove();

> 6 })

> 7 </script>

## 总结：

回调函数在动画执行结束时被执行，回调函数中的 `this` 指向执行动画的元素节点x

## hover事件

说明：由mouseenter和mouseleave封装起来的事件。

- 写两个参数函数的时候，这两个函数会在鼠标移入和移出的时候先后执行。

> 1 $('div').hover(function () {

> 2 console.log('111');

> 3 }, function () {

> 4 console.log('222');

> 5 });

写一个参数函数的时候，这个函数会在鼠标移入和移出的时候都执行。

> 1 $('div').hover(function () {

> 2 console.log('hover');

> 3 })
