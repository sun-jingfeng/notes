# CSS 的背景

## 一、一句话理解

背景相关属性的核心，不只是“给盒子加张图”，而是决定装饰内容如何铺、如何裁、如何和盒子尺寸一起工作。

---

## 二、背景相关属性概览

CSS 背景属性主要用于给元素添加颜色、图片以及控制图片的平铺、位置、尺寸和滚动行为。

| 属性                        | 作用                   |
| --------------------------- | ---------------------- |
| **`background-color`**      | 设置背景颜色           |
| **`background-image`**      | 设置背景图片           |
| **`background-repeat`**     | 设置是否平铺           |
| **`background-position`**   | 设置背景位置           |
| **`background-size`**       | 设置背景尺寸           |
| **`background-attachment`** | 设置背景是否随滚动移动 |
| **`background`**            | 背景复合简写           |

---

## 三、背景颜色 `background-color`

用于给元素设置背景颜色。

```css
background-color: #409eff;
background-color: pink;
background-color: transparent;
```

### 1. 常见特点

| 特点                                  | 说明                |
| ------------------------------------- | ------------------- |
| **默认值**                            | `transparent`，透明 |
| **可以用颜色名、十六进制、rgb、rgba** | 灵活度高            |

---

## 四、背景图片 `background-image`

用于给元素添加背景图。

```css
background-image: url("./images/bg.png");
```

### 1. 常见取值

| 值             | 说明           |
| -------------- | -------------- |
| **`none`**     | 不使用背景图   |
| **`url(...)`** | 指定背景图地址 |

### 2. 注意事项

| 注意点                     | 说明                     |
| -------------------------- | ------------------------ |
| **要写 `url()`**           | 不能只写路径             |
| **背景图是装饰，不是内容** | 内容图片通常更适合 `img` |

常见场景：

- 页面背景图
- logo 背景图
- 小图标背景图
- 精灵图

---

## 五、背景平铺 `background-repeat`

背景图片默认会重复平铺。

```css
background-repeat: repeat;
background-repeat: no-repeat;
background-repeat: repeat-x;
background-repeat: repeat-y;
```

| 值              | 说明                   |
| --------------- | ---------------------- |
| **`repeat`**    | 默认值，横向纵向都平铺 |
| **`no-repeat`** | 不平铺                 |
| **`repeat-x`**  | 只横向平铺             |
| **`repeat-y`**  | 只纵向平铺             |

---

## 六、背景位置 `background-position`

用于控制背景图在盒子中的位置。

```css
background-position: center center;
background-position: left top;
background-position: 20px 30px;
```

### 1. 参数写法

| 写法         | 说明                                       |
| ------------ | ------------------------------------------ |
| **方位名词** | `left`、`center`、`right`、`top`、`bottom` |
| **精确单位** | 如 `20px 30px`                             |
| **混合写法** | 如 `right 20px`、`center 10px`             |

### 2. 规则

| 情况                 | 说明                            |
| -------------------- | ------------------------------- |
| **两个方位名词**     | 顺序通常都可识别，如 `left top` |
| **只写一个方位名词** | 另一个方向默认居中              |
| **只写一个数值**     | 表示 x 坐标，y 默认居中         |

---

## 七、背景固定 `background-attachment`

控制背景图是否跟随页面一起滚动。

```css
background-attachment: scroll;
background-attachment: fixed;
```

| 值           | 说明                         |
| ------------ | ---------------------------- |
| **`scroll`** | 默认值，背景随元素或页面滚动 |
| **`fixed`**  | 背景固定，常用于视差类效果   |

---

## 八、背景尺寸 `background-size`

用于设置背景图片显示大小。

```css
background-size: 200px 100px;
background-size: 50% 50%;
background-size: cover;
background-size: contain;
```

### 1. 常见取值

| 值            | 说明                       |
| ------------- | -------------------------- |
| **长度值**    | 如 `200px 100px`           |
| **百分比**    | 相对于元素盒子宽高         |
| **`cover`**   | 覆盖整个盒子，可能裁切图片 |
| **`contain`** | 完整显示图片，可能留白     |

### 2. `cover` 和 `contain` 区别

| 值            | 特点                                     |
| ------------- | ---------------------------------------- |
| **`cover`**   | 盒子尽量铺满，不留空隙，可能裁掉部分图片 |
| **`contain`** | 图片完整显示，但盒子可能留白             |

---

## 九、背景复合写法 `background`

为了简化代码，背景相关属性常写成一个复合属性。

```css
background: #000 url("./images/bg.jpg") no-repeat center / cover;
```

常见顺序可以理解为：

背景颜色 → 背景图片 → 平铺方式 → 背景位置 / 背景尺寸

> **注意**：`background` 是简写属性，使用时可能会重置其他背景子属性。

---

## 十、半透明背景

常见做法是使用 `rgba()` 或现代的 `rgb()` 带透明度写法。

```css
background: rgba(0, 0, 0, 0.3);
```

### 1. 特点

| 特点                     | 说明                       |
| ------------------------ | -------------------------- |
| **只让背景半透明**       | 不会直接影响内部文字透明度 |
| **最后一个参数是透明度** | 范围是 `0` 到 `1`          |

例如：

```css
background: rgba(255, 255, 255, 0.6);
```

---

## 十一、背景图和 `img` 的区别

| 场景                       | 更适合用什么 |
| -------------------------- | ------------ |
| **纯装饰图**               | 背景图       |
| **内容图片**               | `img`        |
| **需要便于控制位置和平铺** | 背景图       |
| **需要 SEO / 可访问性**    | `img` 更合适 |

---

## 十二、小结

| 知识点       | 结论                              |
| ------------ | --------------------------------- |
| **背景颜色** | 用 `background-color`             |
| **背景图片** | 用 `background-image`             |
| **平铺控制** | 用 `background-repeat`            |
| **位置控制** | 用 `background-position`          |
| **尺寸控制** | 用 `background-size`              |
| **复合简写** | 用 `background`，但要注意重置效果 |
