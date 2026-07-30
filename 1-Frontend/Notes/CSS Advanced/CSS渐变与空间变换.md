# CSS渐变与空间变换

## 一、一句话理解

这一篇的重点不是背语法，而是理解两类能力：渐变负责“颜色如何铺开”，转换负责“元素如何在空间中移动和变形”。

---

## 二、渐变是什么

**渐变** 本质上是一种背景图像，最常写在 `background-image` 上，用来让颜色在空间中平滑过渡。

它的价值在于：不用额外切图，也能做出带层次的视觉氛围。

### 1. 线性渐变

```css
background-image: linear-gradient(red, blue);
background-image: linear-gradient(to right, red, blue);
background-image: linear-gradient(45deg, red, blue);
```

| 写法        | 含义           |
| ----------- | -------------- |
| `to right`  | 从左到右       |
| `to bottom` | 从上到下       |
| `45deg`     | 按角度控制方向 |

颜色停靠点示例：

```css
background-image: linear-gradient(to right, red 0%, yellow 50%, blue 100%);
```

### 2. 径向渐变

```css
background-image: radial-gradient(circle, red, blue);
background-image: radial-gradient(circle at left top, red, blue);
background-image: radial-gradient(circle at 30% 40%, red, blue);
```

| 关键字    | 含义     |
| --------- | -------- |
| `circle`  | 圆形渐变 |
| `ellipse` | 椭圆渐变 |

### 3. 渐变适合什么场景

| 场景                  | 说明                          |
| --------------------- | ----------------------------- |
| **按钮背景**          | 比纯色更有层次                |
| **页面头图 / Banner** | 容易做氛围感                  |
| **卡片装饰层**        | 能快速增加视觉重点            |
| **渐变文字**          | 常配合 `background-clip` 使用 |

### 4. 渐变使用注意点

- 渐变方向太多、颜色太杂，会显得廉价。
- 颜色停靠点设置不合理，会出现突兀断层。
- 渐变适合做“氛围”，不适合替代所有颜色体系。

---

## 三、2D 转换：元素在平面里怎么动

`transform` 可以让元素在 2D 平面中发生位移、旋转、缩放和倾斜。

### 1. 位移 `translate`

```css
transform: translateX(50px);
transform: translateY(20px);
transform: translate(50px, 20px);
```

特点：

1. 视觉位置改变，但通常不通过常规布局方式重新占位。
2. 百分比常相对元素自身尺寸。

### 2. 旋转 `rotate`

```css
transform: rotate(45deg);
transform: rotate(-45deg);
```

旋转常用于图标方向变化、按钮状态反馈、装饰效果。

### 3. 缩放 `scale`

```css
transform: scale(1.2);
transform: scaleX(1.5);
transform: scaleY(0.8);
```

适合 hover 放大、卡片强调、图片缩放。

### 4. 倾斜 `skew`

```css
transform: skewX(20deg);
transform: skewY(10deg);
transform: skew(20deg, 10deg);
```

真实业务里，倾斜不如位移、旋转、缩放常见，更多用于装饰造型。

---

## 四、`transform-origin`：从哪里开始变

`transform-origin` 用来修改变换基准点。

```css
transform-origin: center center;
transform-origin: left top;
transform-origin: 50% 50%;
transform-origin: 100px 20px;
```

如果不写，默认通常以元素中心作为基准点。

为什么它重要：

- 同样是旋转，从中心转和从左上角转，视觉结果会完全不同。
- 同样是缩放，从中心放大和从一侧放大，感受也不一样。

---

## 五、多重转换为什么要注意顺序

多个变换可以写在同一个 `transform` 中：

```css
transform: translateX(50px) rotate(45deg) scale(1.2);
```

关键点：**顺序会影响最终结果**。

例如：

- 先位移再旋转
- 先旋转再位移

最终位置和方向可能完全不同。

所以学转换时，真正难点不是函数名，而是“坐标系 + 基准点 + 顺序”这三件事。

---

## 六、转换和过渡常一起出现

转换本身只描述“变成什么样”，常和 `transition` 或 `animation` 配合，形成动态效果。

```css
.box {
  transition: transform 0.3s ease;
}

.box:hover {
  transform: translateY(-6px) scale(1.02);
}
```

这类写法非常常见，尤其适合按钮、卡片、图片 hover 效果。

---

## 七、3D 转换：把 z 轴引进来

3D 转换是在 2D 的基础上加入 z 轴。

```text
x 轴：水平方向
y 轴：垂直方向
z 轴：垂直屏幕，朝向用户
```

### 1. 常见 3D 转换

```css
transform: translateZ(100px);
transform: rotateX(45deg);
transform: rotateY(45deg);
transform: rotateZ(45deg);
transform: scale3d(1.2, 1.2, 1);
```

理解上可以记住：

- `rotateZ()` 视觉上接近普通 `rotate()`。
- `rotateX()`、`rotateY()` 更容易产生翻转和立体感。

### 2. `perspective`

`perspective` 用来给 3D 场景增加“近大远小”的视觉效果。

```css
.scene {
  perspective: 800px;
}
```

一般写在父元素上。

- 数值越小，透视感越强。
- 数值越大，透视感越弱。

### 3. `transform-style: preserve-3d`

```css
.parent {
  transform-style: preserve-3d;
}
```

作用是让子元素保留 3D 空间效果，不被压扁回 2D 平面。

### 4. 一个常见补充点

做翻牌效果时，通常还会遇到 `backface-visibility: hidden;`，它用来控制元素背面是否可见。

---

## 八、2D 和 3D 怎么选

| 需求                           | 更适合的方案 | 原因                   |
| ------------------------------ | ------------ | ---------------------- |
| **按钮轻微悬浮、卡片放大**     | 2D 转换      | 简单、稳定、常见       |
| **图标旋转、轻量反馈**         | 2D 转换      | 足够表达状态           |
| **翻牌、立体轮播、空间感展示** | 3D 转换      | 更有纵深感             |
| **只是做装饰背景**             | 渐变         | 不需要改变元素空间状态 |

不要为了“炫”就把 2D 能解决的效果硬做成 3D，这通常只会增加复杂度。

---

## 九、常见应用场景

### 1. 渐变

- 页面背景
- 按钮背景
- 品牌氛围层

### 2. 2D 转换

- 卡片 hover 上浮
- 图标旋转
- 图片缩放
- 拖拽或位移反馈

### 3. 3D 转换

- 翻牌效果
- 3D 轮播切换
- 相册或盒子展示

---

## 十、实战中的注意事项

| 问题                 | 常见原因                            |
| -------------------- | ----------------------------------- |
| **变换方向不对**     | `transform-origin` 没设好           |
| **结果和预期不一致** | 多重变换顺序影响了最终效果          |
| **3D 效果不明显**    | 缺少 `perspective` 或 `preserve-3d` |
| **效果太花**         | 渐变、2D、3D 同时堆太多             |

---

## 十一、小结

| 知识点       | 结论                                         |
| ------------ | -------------------------------------------- |
| **渐变**     | 本质是背景图像，负责颜色过渡和氛围           |
| **2D 转换**  | 负责平面中的位移、旋转、缩放、倾斜           |
| **3D 转换**  | 在 2D 基础上加入 z 轴和空间感                |
| **真正难点** | 基准点、顺序、透视和场景选择                 |
| **工程建议** | 能用简单方案解决，就不要引入更重的视觉复杂度 |
