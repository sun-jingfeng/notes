# CSS预处理器基础

## 一、一句话理解

Less、Sass 的核心价值不是“样式能写得更花”，而是把重复样式、设计 token 和结构化复用提前到编译阶段处理。

---

## 二、什么是 CSS 预处理器

Less、Sass 都属于 CSS 预处理器。它们在 CSS 的基础上增加了变量、嵌套、混入、循环、函数等能力，让样式代码更容易复用和维护。

常见预处理器有：

1. Less
2. Sass / SCSS
3. Stylus

它们解决的问题基本相似，掌握一种后迁移到其他方案并不难。

---

## 三、为什么要用 Less 或 Sass

原生 CSS 现在已经很强，但在一些场景里，预处理器仍然有价值：

1. 统一颜色、间距、字号等设计 token。
2. 抽取重复样式逻辑。
3. 生成一组有规律的类名。
4. 拆分大型样式文件，提升可维护性。

典型收益是：

1. 少写重复代码。
2. 结构更清晰。
3. 更适合中大型项目协作。

---

## 四、Less 和 Sass 的核心区别

| 对比项       | Less                | Sass / SCSS |
| ------------ | ------------------- | ----------- |
| 变量符号     | `@color`            | `$color`    |
| 生态流行度   | 曾经很常见          | 现在更主流  |
| 语法风格     | 更接近早期 CSS 扩展 | 功能更完整  |
| 常见文件后缀 | `.less`             | `.scss`     |

### 1. 现在更常见哪个

现代前端项目里，`SCSS` 更常见一些。

### 2. 学习建议

如果你在维护旧项目，按项目现状学 Less；如果是新项目或通用技能积累，优先掌握 SCSS 通常更划算。

---

## 五、浏览器能直接识别吗

不能。

浏览器最终只认识 CSS，所以 Less / Sass 代码都需要先编译成 CSS。

### 1. 常见编译方式

1. Vite、Webpack 等构建工具自动编译。
2. 命令行工具编译。
3. 编辑器插件辅助编译。

实际项目里，最推荐的是交给构建工具统一处理，而不是依赖本地编辑器插件。

这背后的重点是统一工程链路，否则团队成员本地编译结果和行为容易不一致。

---

## 六、常见语法能力

### 1. 变量

Less：

```less
@primary-color: #1677ff;

.btn {
  color: @primary-color;
}
```

SCSS：

```scss
$primary-color: #1677ff;

.btn {
  color: $primary-color;
}
```

### 2. 嵌套

```scss
.card {
  padding: 16px;

  .title {
    font-weight: 700;
  }

  &:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  }
}
```

### 3. 混入

```scss
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog {
  @include flex-center;
}
```

### 4. 继承

```scss
%ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.title {
  @extend %ellipsis;
}
```

### 5. 循环与插值

```scss
$spaces: (
  xs: 4px,
  sm: 8px,
  md: 12px,
  lg: 16px,
);

@each $name, $value in $spaces {
  .mt-#{$name} {
    margin-top: $value;
  }
}
```

这类写法很适合批量生成工具类。

---

## 七、一个更接近业务的循环示例

```scss
$names: ((m, margin), (p, padding));

$positions: ((t, top), (r, right), (b, bottom), (l, left));

$size-value: (
  (base, var(--van-padding-base)),
  (xs, var(--van-padding-xs)),
  (sm, var(--van-padding-sm)),
  (md, var(--van-padding-md)),
  (lg, var(--van-padding-lg)),
  (xl, var(--van-padding-xl))
);

@each $name-abb, $name in $names {
  @each $position-abb, $position in $positions {
    @each $size, $value in $size-value {
      .g-#{$name-abb}#{$position-abb}-#{$size} {
        #{$name}-#{$position}: $value;
      }
    }
  }
}
```

这段代码会批量生成类似下面的类：

1. `.g-mt-base`
2. `.g-pr-sm`
3. `.g-pb-lg`

适合做一套统一的间距工具类。

---

## 八、Less / Sass 和现代 CSS 怎么配合看

现在原生 CSS 已经支持了很多能力，例如：

1. CSS 自定义属性。
2. `calc()`。
3. `clamp()`。
4. 更强的布局能力。

所以现代项目里，预处理器不是一定要替代原生 CSS，而更像是补充：

| 需求                   | 更适合的方案                   |
| ---------------------- | ------------------------------ |
| **主题色、运行时切换** | CSS 变量更灵活                 |
| **批量生成规则样式**   | Less / Sass 更顺手             |
| **组件内局部复用**     | mixin / 占位选择器可以提升效率 |
| **简单页面样式**       | 原生 CSS 可能已经够用          |

---

## 九、Less / Sass 适合哪些场景

### 1. 更适合用的时候

1. 组件库。
2. 设计 token 很多的项目。
3. 需要批量生成类名。
4. 样式层有较强复用需求。

### 2. 不一定非用不可的时候

1. 页面很简单。
2. 原生 CSS 已经足够。
3. 团队更偏向 CSS Modules、Tailwind、CSS-in-JS 等方案。

---

## 十、学习和使用时的注意点

1. 不要为了“能嵌套”而无限嵌套，否则选择器会越来越重。
2. 不要把业务逻辑硬塞进样式循环里，复杂度会迅速上升。
3. 优先抽取设计 token，而不是复制粘贴一堆颜色和间距。
4. 在现代工程里，尽量交给构建工具编译，不要过度依赖编辑器插件。

很多项目后期样式难维护，不是因为没有预处理器，而是因为抽象过度或抽象方向不对。

---

## 十一、总结

1. Less、Sass 都是 CSS 预处理器，本质是让样式更易维护和复用。
2. 它们常用能力包括变量、嵌套、混入、继承、循环。
3. 浏览器不能直接识别，最终都要编译成 CSS。
4. 现在新项目里 SCSS 更常见，但 Less 仍然在很多项目中存在。
5. 学这篇时，重点不是记语法，而是理解“什么时候该抽象，什么时候保持简单”。
