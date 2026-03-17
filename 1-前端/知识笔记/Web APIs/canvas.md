# canvas

## 一、什么是 Canvas

Canvas 是 HTML5 提供的画布元素，用于通过 JavaScript 在页面上动态绘制图形、图片、动画和像素内容。

它本身只是一个容器，真正的绘制能力来自上下文对象，例如二维绘图上下文 `2d`。

| 适用场景   | 说明                   |
| ---------- | ---------------------- |
| 绘图       | 矩形、圆形、路径、曲线 |
| 图像处理   | 裁切、缩放、导出图片   |
| 动画效果   | 粒子、小游戏、进度动画 |
| 像素级处理 | 滤镜、马赛克、颜色分析 |

---

## 二、基础使用流程

### 2.1 准备画布

```html
<canvas id="canvas" width="400" height="300"></canvas>
```

### 2.2 获取上下文

```js
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
```

### 2.3 一个重要提醒

`canvas` 标签的 `width` 和 `height` 应尽量直接写在标签属性上，而不是只靠 CSS 缩放，否则容易导致绘制分辨率和视觉尺寸不一致。

### 2.4 坐标系怎么理解

Canvas 默认坐标原点在左上角：

```text
(0, 0) 在左上
x 向右增大
y 向下增大
```

这和很多数学坐标系的直觉不同，画图时要先适应这一点。

---

## 三、基础图形绘制

### 3.1 矩形

```js
ctx.fillStyle = "skyblue"
ctx.fillRect(20, 20, 120, 60)

ctx.strokeStyle = "tomato"
ctx.strokeRect(160, 20, 120, 60)

ctx.clearRect(30, 30, 40, 20)
```

### 3.2 路径

```js
ctx.beginPath()
ctx.moveTo(125, 45)
ctx.lineTo(205, 125)
ctx.lineTo(45, 125)
ctx.closePath()
ctx.stroke()
```

### 3.3 圆弧和曲线

```js
ctx.beginPath()
ctx.arc(150, 150, 50, 0, Math.PI * 2)
ctx.stroke()
```

```js
ctx.beginPath()
ctx.moveTo(50, 200)
ctx.quadraticCurveTo(150, 100, 250, 200)
ctx.stroke()
```

### 3.4 文本绘制

```js
ctx.font = "24px sans-serif"
ctx.fillStyle = "#333"
ctx.fillText("Hello Canvas", 20, 40)
```

Canvas 不只是画图形，文字绘制也是常见能力，比如海报、图像标注、签名面板等。

---

## 四、样式与状态

### 4.1 常见样式属性

| 属性          | 作用           |
| ------------- | -------------- |
| `fillStyle`   | 填充颜色或样式 |
| `strokeStyle` | 描边颜色或样式 |
| `lineWidth`   | 线宽           |
| `lineCap`     | 线段端点样式   |
| `lineJoin`    | 线段连接处样式 |
| `font`        | 文本字体       |
| `shadowColor` | 阴影颜色       |

### 4.2 `save()` 和 `restore()`

Canvas 的绘制状态会影响后续操作，所以经常需要保存和恢复状态。

```js
ctx.save()
ctx.translate(150, 150)
ctx.rotate(Math.PI / 6)
ctx.fillRect(-50, -25, 100, 50)
ctx.restore()
```

这能避免一次变换影响后面所有绘图。

### 4.3 一个理解重点

Canvas 更像“连续绘图命令流”，不是 DOM 那种“每个图形都是独立节点”。所以状态管理非常重要。

---

## 五、绘制图片与导出图片

### 5.1 `drawImage()`

```js
const img = new Image()
img.src = "./avatar.png"

img.onload = function () {
  ctx.drawImage(img, 20, 20, 100, 100)
}
```

常见用途：

1. 图片缩略图。
2. 海报合成。
3. 截图处理。
4. 视频帧绘制。

### 5.2 导出图片

`toDataURL()`：

```js
const base64 = canvas.toDataURL("image/png")
```

适合快速预览或临时展示。

`toBlob()`：

```js
canvas.toBlob(blob => {
  console.log(blob)
}, "image/png")
```

更适合上传文件、下载图片和节省内存。

### 5.3 什么时候更推荐 `toBlob()`

在图片较大或需要上传时，通常优先用 `toBlob()`，因为 Base64 体积更大。

---

## 六、像素处理

像素处理是 Canvas 相比普通 DOM 更有代表性的能力之一。

### 6.1 `getImageData()` 和 `putImageData()`

```js
const imageData = ctx.getImageData(0, 0, 100, 100)
ctx.putImageData(imageData, 0, 0)
```

### 6.2 能拿来做什么

1. 滤镜效果。
2. 马赛克。
3. 颜色分析。
4. 图片局部处理。

### 6.3 一个简单灰度示例

```js
const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
const { data } = imageData

for (let i = 0; i < data.length; i += 4) {
  const gray = (data[i] + data[i + 1] + data[i + 2]) / 3
  data[i] = gray
  data[i + 1] = gray
  data[i + 2] = gray
}

ctx.putImageData(imageData, 0, 0)
```

### 6.4 一个性能提醒

像素操作通常代价不低，所以要尽量批量处理，避免在高频动画里反复细粒度读写。

---

## 七、变换操作

### 7.1 平移

```js
ctx.translate(100, 50)
```

### 7.2 旋转

```js
ctx.rotate(Math.PI / 4)
```

### 7.3 缩放

```js
ctx.scale(2, 2)
```

### 7.4 注意点

1. 变换会影响后续所有绘制。
2. 旋转默认围绕当前坐标原点。
3. 复杂场景里通常配合 `save()` / `restore()` 使用。

### 7.5 一个常见误区

很多人以为变换只作用于当前图形，其实它改变的是画布当前坐标系。

---

## 八、动画与性能

Canvas 很适合做逐帧动画，但也更容易带来性能问题。

### 8.1 基础动画写法

```js
let x = 0

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillRect(x, 50, 50, 50)
  x += 2

  requestAnimationFrame(render)
}

requestAnimationFrame(render)
```

### 8.2 为什么推荐 `requestAnimationFrame()`

因为它会尽量和浏览器刷新节奏对齐，比手写 `setInterval()` 更平滑。

### 8.3 常见性能优化点

1. 每帧只重绘必要区域。
2. 避免在动画循环里频繁创建大量对象。
3. 大图或复杂图形可考虑离屏 canvas 缓存。
4. 优先操作简单状态，而不是每帧做复杂像素运算。

---

## 九、跨域与安全限制

Canvas 有一个很常见的坑：跨域图片污染画布。

### 9.1 典型场景

如果你把跨域图片绘制到 canvas 上，再去调用 `toDataURL()` 或 `getImageData()`，浏览器可能直接报安全错误。

### 9.2 正确前提

1. 图片服务器允许跨域。
2. 图片对象设置了跨域属性。

```js
const img = new Image()
img.crossOrigin = "anonymous"
img.src = "https://example.com/test.png"
```

前端单独设置 `crossOrigin` 还不够，服务器响应头也必须允许跨域。

---

## 十、Canvas 和 SVG 的区别

| 对比项       | Canvas                   | SVG                          |
| ------------ | ------------------------ | ---------------------------- |
| 本质         | 像素画布                 | 矢量图形                     |
| 适合场景     | 高频绘制、动画、像素处理 | 图标、图形结构、可交互矢量图 |
| 缩放         | 放大会失真               | 矢量缩放不失真               |
| 单个图形操作 | 需要自己管理状态         | DOM 结构可直接选中和操作     |

### 10.1 怎么选

1. 强调像素处理和连续绘制时，优先考虑 Canvas。
2. 强调结构化图形和可缩放图标时，优先考虑 SVG。

### 10.2 一个实战判断标准

如果你需要“每一帧都持续重画”，Canvas 更常见；如果你需要“图形元素本身也要像 DOM 一样可选中、可单独交互”，SVG 往往更自然。

---

## 十一、小结

1. Canvas 是一块可编程画布，适合绘图、图像处理、动画和像素级操作。
2. 它的核心入口是 `getContext("2d")`，但真正难点在于状态管理、性能和像素操作。
3. 学习 Canvas 时，除了基础图形，更要理解坐标系、状态保存、导出、跨域和性能优化。
4. 它适合做连续绘制和像素处理类任务，不适合简单场景下替代所有图形方案。
5. 学这一篇时，重点不是只会画矩形，而是理解 Canvas 为什么适合做“连续绘制和像素处理”类任务。
