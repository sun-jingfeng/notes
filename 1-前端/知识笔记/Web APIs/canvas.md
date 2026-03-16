# canvas

学习文档：Canvas 教程

常用 API：

- getContext()

   - 说明：返回canvas 的上下文，如果上下文没有定义则返回 null。

   - 文档：HTMLCanvasElement.getContext()

## toBlob()

   - 说明：创造 Blob 对象，用以展示 canvas 上的图片；这个图片文件可以被缓存或保存到本地（由用户代理 自行决定）。

   - 文档：HTMLCanvasElement.toBlob()

- toDataURL()

   - 说明：返回一个包含图片展示的 data URI 。可以使用 type 参数其类型，默认为 PNG 格式。图片的分辨率

   - 为 96dpi。

   - 文档：HTMLCanvasElement.toDataURL()

- strokeStyle

   - 说明：Canvas 2D API 描述画笔（绘制图形）颜色或者样式的属性。默认值是 #000 (black)。

   - 文档：CanvasRenderingContext2D.strokeStyle

- fillStyle

   - 说明：Canvas 2D API 使用内部方式描述颜色和样式的属性。默认值是 #000 （黑色）。

   - 文档：CanvasRenderingContext2D.fillStyle

## fillRect()

- 说明：Canvas 2D API 绘制填充矩形的方法。当前渲染上下文中的fillStyle 属性决定了对这个矩形对的填充 样式。

- 文档：CanvasRenderingContext2D.fillRect()

strokeRect()

   - 说明：Canvas 2D API 在 canvas 中，使用当前的绘画样式，描绘一个起点在 (x, y)、宽度为 w、高度为 h 的矩形的方法。

   - 文档：CanvasRenderingContext2D.strokeRect()

- clearRect()

   - 说明：Canvas 2D API 的方法，这个方法通过把像素设置为透明以达到擦除一个矩形区域的目的。

   - 文档：CanvasRenderingContext2D.clearRect()

## beginPath()

- 说明：Canvas 2D API 通过清空子路径列表开始一个新路径的方法。当你想创建一个新的路径时，调用此 方法。

- 文档;：CanvasRenderingContext2D.beginPath()

## closePath()

   - 说明：Canvas 2D API 将笔点返回到当前子路径起始点的方法。它尝试从当前点到起始点绘制一条直线。

   - 如果图形已经是封闭的或者只有一个点，那么此方法不会做任何操作。

   - 文档：CanvasRenderingContext2D.closePath()

- moveTo()

   - 说明：Canvas 2D API 将一个新的子路径的起始点移动到 (x，y) 坐标的方法。

   - 文档：CanvasRenderingContext2D.moveTo()

- lineTo()

   - 说明：Canvas 2D API 使用直线连接子路径的终点到 x，y 坐标的方法（并不会真正地绘制）。

   - 文档：CanvasRenderingContext2D.lineTo()

- stroke()

   - 说明：Canvas 2D API 使用非零环绕规则，根据当前的画线样式，绘制当前或已经存在的路径的方法。

   - 文档：CanvasRenderingContext2D.stroke()

   - 示例：

> 1 // 描边三角形

> 2 ctx.beginPath();

> 3 ctx.moveTo(125, 125);

> 4 ctx.lineTo(125, 45);

> 5 ctx.lineTo(45, 125);

> 6 ctx.closePath();

> 7 ctx.stroke();

## fill()

      - 说明：Canvas 2D API 根据当前的填充样式，填充当前或已存在的路径的方法。采取非零环绕或者奇偶环 绕规则。

      - 文档：CanvasRenderingContext2D.fill()

      - 示例：

- 1 // 填充三角形

- 2 ctx.beginPath(); 3 ctx.moveTo(25, 25); 4 ctx.lineTo(105, 25); 5 ctx.lineTo(25, 105); 6 ctx.fill();

   - arc()

      - 说明：Canvas 2D API 绘制圆弧路径的方法。圆弧路径的圆心在 (x, y) 位置，半径为 r，根据anticlockwise （默认为顺时针）指定的方向从 startAngle 开始绘制，到 endAngle 结束。 文档：CanvasRenderingContext2D.arc()

quadraticCurveTo()

   - 说明：Canvas 2D API 新增二次贝塞尔曲线路径的方法。它需要 2 个点。第一个点是控制点，第二个点是 终点。起始点是当前路径最新的点，当创建二次贝赛尔曲线之前，可以使用 moveTo() 方法进行改变。

   - 文档：CanvasRenderingContext2D.quadraticCurveTo()

- bezierCurveTo()

   - 说明：Canvas 2D API 绘制三次贝赛尔曲线路径的方法。该方法需要三个点。第一、第二个点是控制点， 第三个点是结束点。起始点是当前路径的最后一个点，绘制贝赛尔曲线前，可以通过调用 moveTo() 进行修 改。

   - 文档：CanvasRenderingContext2D.bezierCurveTo()

## Path2D

   - 说明：Canvas 2D API 的接口 Path2D 用来声明路径，此路径稍后会被CanvasRenderingContext2D 对象

   - 使用。CanvasRenderingContext2D 接口的 路径方法 也存在于 Path2D 这个接口中，允许你在 canvas 中 根据需要创建可以保留并重用的路径。

   - 文档：Path2D

- drawImage()

   - 说明：Canvas 2D API 中的 CanvasRenderingContext2D.drawImage() 方法提供了多种在画布

   - （Canvas）上绘制图像的方式。

   - 文档：CanvasRenderingContext2D.drawImage()

## 注意：

- 当引入外域图片出现的跨域问题时，可设置图片元素的crossOrigin属性值为Anonymous。

   - 最新发现：图片不需要这么设置了，默认不发送"源"，也就是不跨域。但如果想设置，键改成了

   - cross-origin，而不再是crossOrigin。

rotate()

- 说明：Canvas 2D API 在变换矩阵中增加旋转的方法。角度变量表示一个顺时针旋转角度并且用弧度表

## 示。

- 文档：CanvasRenderingContext2D.rotate()

## 注意：

- 旋转操作需要在绘图操作前执行，否则不生效。

- 旋转中心点一直是 canvas 的起始点。如果想改变中心点，我们可以通过 translate() 方法移动

- canvas。

translate()

   - 说明：Canvas 2D API 对当前网格添加平移变换的方法。

   - 文档：CanvasRenderingContext2D.translate()

- getImageData()

   - 说明：返回一个ImageData对象，用来描述 canvas 区域隐含的像素数据，这个区域通过矩形表示，起始点 为*(sx, sy)、宽为sw、高为sh。

   - 文档：CanvasRenderingContext2D.getImageData()

- putImageData()

   - 说明：将数据从已有的 ImageData 对象绘制到位图的方法。如果提供了一个绘制过的矩形，则只绘制该矩 形的像素。此方法不受画布转换矩阵的影响。

   - 文档：CanvasRenderingContext2D.putImageData()

- canvas改变宽高后上下文属性重置为默认值

   - 演示：canvas改变宽高后发生了什么？

   - 解决方案

> 1 const ctx = canvas.getContext("2d");

> 2 const canvasData = ctx.getImageData(x, y, width, height);

> 3 canvas.width = width;

> 4 canvas.height = height;

> 5 ctx.putImageData(canvasData, 0, 0);
