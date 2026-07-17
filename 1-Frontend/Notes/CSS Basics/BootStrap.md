# BootStrap

## 一、什么是 Bootstrap

Bootstrap 是一个常见的前端 UI 框架，提供成套的样式、组件和响应式布局能力。

一句话理解：

```text
它帮你快速搭出“可用且响应式”的页面骨架和常见组件。
```

注意：官方写法是 `Bootstrap`，很多旧资料会写成 `BootStrap`。

---

## 二、为什么会用 Bootstrap

如果完全从零写页面样式，往往要重复处理这些问题：

1. 基础样式初始化。
2. 按钮、表单、表格、导航等组件样式。
3. 响应式布局规则。
4. 不同页面的一致性。

Bootstrap 的价值，就是把这些通用能力提前封装好。

### 2.1 它解决的核心矛盾

它更偏向“快速得到稳定结果”，而不是“从零完全自定义视觉语言”。

---

## 三、常见版本差异

| 版本        | 特点                                   |
| ----------- | -------------------------------------- |
| Bootstrap 3 | 旧教程常见，依赖 jQuery，含 `col-xs-*` |
| Bootstrap 4 | 栅格和工具类更完善                     |
| Bootstrap 5 | 不再依赖 jQuery，现代项目更常见        |

### 3.1 为什么要先区分版本

因为不同版本：

1. 类名可能不一样。
2. 组件初始化方式可能不一样。
3. 是否依赖 jQuery 也不一样。

### 3.2 一个现实判断

1. 学旧项目或看旧教程时，经常会遇到 Bootstrap 3。
2. 新项目如果还选 Bootstrap，通常更接近 Bootstrap 5。

---

## 四、如何引入 Bootstrap

### 4.1 使用 CDN

```html
<link
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
  rel="stylesheet"
/>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
```

### 4.2 本地引入

适合内网环境、离线使用或需要自定义构建资源的场景。

### 4.3 快速验证是否引入成功

```html
<button class="btn btn-primary">按钮</button>
```

如果按钮立刻具备 Bootstrap 风格，说明 CSS 已生效。

---

## 五、Bootstrap 的核心能力

### 5.1 栅格系统

用于响应式布局。

### 5.2 组件系统

用于快速搭建按钮、表单、导航、弹窗等。

### 5.3 工具类

用于快速处理间距、显示隐藏、文字对齐等样式。

这三类能力覆盖了“页面布局 + 常见交互结构 + 高频小样式调整”三大基础需求。

---

## 六、栅格系统

Bootstrap 最核心的布局能力之一就是 12 列栅格系统。

### 6.1 基本思想

一行默认分成 12 份，元素可以按份数占宽。

### 6.2 基础结构

```html
<div class="container">
  <div class="row">
    <div class="col-4">A</div>
    <div class="col-4">B</div>
    <div class="col-4">C</div>
  </div>
</div>
```

### 6.3 关键类

| 类名              | 作用         |
| ----------------- | ------------ |
| `container`       | 固定宽度容器 |
| `container-fluid` | 全宽容器     |
| `row`             | 行           |
| `col-*`           | 列宽控制     |

### 6.4 一个布局思路

写栅格时通常按这个顺序思考：

```text
页面外层宽度 -> 行怎么分 -> 每个断点下列怎么占宽
```

### 6.5 常见易错点

1. 只写列，不包 `row`。
2. 总列数长期超过 12，导致换行结果和预期不一致。
3. 忘了不同断点下布局会重新计算。

---

## 七、响应式断点

Bootstrap 不只是分列，更重要的是根据屏幕宽度自动调整布局。

### 7.1 常见断点

| 前缀       | 含义         | 适用场景          |
| ---------- | ------------ | ----------------- |
| `col-`     | 默认及超小屏 | 手机优先          |
| `col-sm-`  | 小屏及以上   | 大屏手机 / 小平板 |
| `col-md-`  | 中屏及以上   | 平板              |
| `col-lg-`  | 大屏及以上   | 桌面端            |
| `col-xl-`  | 更大屏幕     | 宽屏桌面          |
| `col-xxl-` | 超大屏幕     | 超宽显示器        |

### 7.2 示例

```html
<div class="container">
  <div class="row">
    <div class="col-12 col-md-6 col-lg-3">item1</div>
    <div class="col-12 col-md-6 col-lg-3">item2</div>
    <div class="col-12 col-md-6 col-lg-3">item3</div>
    <div class="col-12 col-md-6 col-lg-3">item4</div>
  </div>
</div>
```

含义：

1. 手机上每项独占一行。
2. 平板上每行两项。
3. 大屏上每行四项。

### 7.3 一个实战建议

Bootstrap 的断点思路本质是“移动端优先，逐步增强”，所以常常先写最小屏表现，再往上补更大断点类名。

---

## 八、常见组件

### 8.1 按钮

```html
<button class="btn btn-primary">主要按钮</button>
<button class="btn btn-secondary">次要按钮</button>
<button class="btn btn-danger">危险按钮</button>
```

### 8.2 表格

```html
<table class="table table-striped table-hover">
  <thead>
    <tr>
      <th>姓名</th>
      <th>年龄</th>
    </tr>
  </thead>
</table>
```

### 8.3 表单

```html
<div class="mb-3">
  <label class="form-label">用户名</label>
  <input type="text" class="form-control" />
</div>
```

### 8.4 提示框

```html
<div class="alert alert-success" role="alert">操作成功</div>
```

### 8.5 组件使用边界

Bootstrap 组件适合快速搭页面，但当设计系统要求很细、组件行为需要深定制时，覆盖和二次包装成本会明显升高。

---

## 九、工具类与显示隐藏

Bootstrap 有大量实用工具类，可以快速处理布局和显示逻辑。

### 9.1 常见显示隐藏写法

```html
<div class="d-none d-lg-block">仅大屏显示</div>
<div class="d-block d-lg-none">仅小屏显示</div>
```

### 9.2 常见间距类

```html
<div class="mt-3 mb-2 px-4">内容</div>
```

### 9.3 工具类的价值

很多简单样式不必再单独写 CSS，尤其适合后台系统、管理台和原型页面。

### 9.4 一个现实边界

如果页面里充斥大量工具类且语义很弱，模板会变得拥挤。也就是说，工具类能提升效率，但不应该代替所有可维护的样式抽象。

---

## 十、组件定制和使用边界

### 10.1 Bootstrap 的优势

1. 上手快。
2. 组件齐全。
3. 响应式规则成熟。

### 10.2 它的限制

1. 页面容易“长得像 Bootstrap”。
2. 深度定制时样式覆盖成本会上升。
3. 在设计语言要求很强的项目里，不一定最合适。

### 10.3 适合场景

1. 后台管理系统。
2. 学习项目。
3. 原型页面。
4. 设计个性要求不高但交付速度要求高的业务页。

---

## 十一、和现代方案的简单对比

| 方案                      | 特点                       |
| ------------------------- | -------------------------- |
| Bootstrap                 | 组件和布局一体化，开箱即用 |
| Tailwind CSS              | 工具类优先，组合自由度更高 |
| Ant Design / Element Plus | 更偏组件化设计系统         |

Bootstrap 更像“快速搭页面的通用框架”；Tailwind 更像“原子类工具箱”；Ant Design / Element Plus 更像“完整组件库”。

### 11.1 怎么选

1. 想快速得到一套成熟页面骨架，用 Bootstrap。
2. 想保留更高视觉自由度，用 Tailwind 这类工具类方案。
3. 想直接获得中后台组件体系，更常考虑成熟组件库。

---

## 十二、小结

1. Bootstrap 是一套成熟的前端 UI 框架，核心价值在于组件体系和响应式栅格系统。
2. 学习时要先区分版本，特别是 Bootstrap 3 和 Bootstrap 5 的差异。
3. 真正常用的高频能力是：容器、行列结构、断点、按钮、表单、表格和工具类。
4. 它适合快速搭建页面，但并不适合所有高度定制化项目。
5. 学这一篇时，重点是理解“栅格 + 组件 + 工具类”这三条主线，以及它适合解决哪类项目问题。
