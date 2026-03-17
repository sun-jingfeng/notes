# CSS3 盒子模型、过渡、滤镜、计算

## 一、这四个能力分别解决什么问题

| 能力             | 解决的问题               |
| ---------------- | ------------------------ |
| **`box-sizing`** | 盒子尺寸到底怎么算       |
| **`transition`** | 状态变化如何平滑过渡     |
| **`filter`**     | 元素如何做视觉处理       |
| **`calc()`**     | CSS 里如何做基础数值计算 |

它们经常会一起出现，因为一个真实组件通常既要算尺寸、又要做动效，还要兼顾视觉反馈。

---

## 二、CSS3 盒子模型

CSS 盒模型决定了元素最终占据空间的计算方式。

### 2.1 两种常见盒模型

| 值            | 计算方式                                |
| ------------- | --------------------------------------- |
| `content-box` | `width/height` 只表示内容区             |
| `border-box`  | `width/height` 包含内容区、内边距、边框 |

### 2.2 `content-box`

```css
.box {
  box-sizing: content-box;
  width: 200px;
  padding: 20px;
  border: 10px solid #000;
}
```

最终实际宽度会变成：

```text
200 + 20 * 2 + 10 * 2 = 260px
```

### 2.3 `border-box`

```css
.box {
  box-sizing: border-box;
  width: 200px;
  padding: 20px;
  border: 10px solid #000;
}
```

此时 `width: 200px` 表示整个盒子的总宽度就是 200px。

### 2.4 为什么现代项目常用 `border-box`

因为它更符合开发直觉，布局时更容易控制元素尺寸。

很多项目会直接全局设置：

```css
* {
  box-sizing: border-box;
}
```

### 2.5 一个常见误区

`border-box` 不是“没有 padding 和 border”，而是“padding 和 border 被算进总宽高里”。

---

## 三、过渡 `transition`

过渡用于让元素从一种样式平滑变化到另一种样式。

### 3.1 基本语法

```css
transition: 属性 持续时间 运动曲线 延迟;
```

```css
.box {
  transition: width 0.3s ease 0s;
}
```

### 3.2 常见参数说明

| 参数     | 说明                  |
| -------- | --------------------- |
| 属性     | 哪个 CSS 属性参与过渡 |
| 持续时间 | 变化花费多久          |
| 运动曲线 | 变化速度规律          |
| 延迟     | 何时开始              |

### 3.3 示例

```css
.box {
  width: 100px;
  height: 100px;
  background-color: skyblue;
  transition: all 0.3s ease;
}

.box:hover {
  width: 140px;
  background-color: tomato;
}
```

### 3.4 常见运动曲线

1. `ease`：默认，慢快慢。
2. `linear`：匀速。
3. `ease-in`：慢开始。
4. `ease-out`：慢结束。
5. `ease-in-out`：慢开始、慢结束。

### 3.5 `transition` 和 `animation` 的区别

| 对比项   | `transition`     | `animation`          |
| -------- | ---------------- | -------------------- |
| 触发方式 | 常依赖状态变化   | 可自动播放或循环     |
| 复杂度   | 适合简单状态切换 | 适合更复杂关键帧动画 |

所以：

1. 简单 hover、展开收起，用 `transition` 更自然。
2. 多阶段动效、循环动效，通常用 `animation`。

### 3.6 一个性能建议

优先过渡 `transform`、`opacity` 这类更友好的属性，少直接改动容易引发布局重算的属性。

---

## 四、滤镜 `filter`

`filter` 可以给元素添加视觉处理效果。

### 4.1 常见函数

| 函数            | 作用     |
| --------------- | -------- |
| `blur()`        | 模糊     |
| `brightness()`  | 亮度     |
| `contrast()`    | 对比度   |
| `grayscale()`   | 灰度     |
| `drop-shadow()` | 投影     |
| `sepia()`       | 复古色调 |

### 4.2 示例

```css
img {
  filter: blur(5px);
}
```

```css
.card:hover img {
  filter: brightness(1.1) contrast(1.05);
}
```

### 4.3 使用建议

1. 滤镜适合做视觉增强。
2. 不要堆太多，否则容易影响性能和清晰度。
3. `blur()`、`drop-shadow()` 这类效果通常比简单亮度变化更重。

### 4.4 一个实战判断标准

如果只是轻微 hover 反馈，优先考虑：

1. `opacity`
2. `transform`
3. 轻量级 `brightness()`

而不是一上来就叠多层复杂滤镜。

---

## 五、计算 `calc()`

`calc()` 允许在 CSS 属性值里直接做计算。

### 5.1 基本语法

```css
width: calc(100% - 80px);
```

### 5.2 常见场景

1. 固定侧边栏 + 自适应内容区。
2. 减去头部高度后的剩余区域。
3. 混合百分比和固定像素值。

### 5.3 示例

```css
.sidebar {
  width: 240px;
}

.main {
  width: calc(100% - 240px);
}
```

### 5.4 注意点

运算符两边建议保留空格：

```css
width: calc(100% - 20px);
```

### 5.5 `calc()` 的定位

它很适合做“简单线性计算”，但如果布局已经可以用：

1. `flex`
2. `grid`
3. `minmax()`
4. `clamp()`

更自然地表达，就不必强行把所有关系都塞进 `calc()`。

---

## 六、组合使用示例

```css
.card {
  box-sizing: border-box;
  width: calc(50% - 12px);
  padding: 16px;
  border: 1px solid #ddd;
  transition:
    transform 0.3s ease,
    filter 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  filter: brightness(1.03);
}
```

这个例子里：

1. `box-sizing` 保证尺寸可控。
2. `calc()` 让宽度兼顾响应式与间距。
3. `transition` 让 hover 更平滑。
4. `filter` 提供额外视觉反馈。

---

## 七、小结

1. `box-sizing` 决定盒子尺寸的计算方式，现代项目通常偏向 `border-box`。
2. `transition` 适合状态切换时的平滑过渡，复杂动效再考虑 `animation`。
3. `filter` 可以做视觉增强，但要注意性能与清晰度成本。
4. `calc()` 适合混合单位的简单计算，不必替代所有布局能力。
5. 这四个能力经常在真实项目里组合使用，而不是单独出现。
