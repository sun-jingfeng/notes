# CSS高频技巧与工程实践

## 一、这篇怎么理解

这一篇本质上是一组 CSS 高频杂项能力的集合。为了更好复习，可以把它们分成 4 类：

| 类别           | 主题                                 |
| -------------- | ------------------------------------ |
| **资源与图形** | 精灵图、字体图标、CSS 三角、边框图片 |
| **交互样式**   | `cursor`、`outline`、`resize`        |
| **排版细节**   | `vertical-align`、文字溢出省略号     |
| **工程与布局** | 常见布局技巧、CSS 初始化             |

如果把这篇直接当成“零碎知识点合集”，会很难记；如果按“资源方案、交互反馈、排版细节、工程兜底”四条线去理解，会更容易复习和选型。

---

## 二、资源与图形方案

### 2.1 精灵图

**精灵图** 也叫雪碧图，本质是把多个小背景图合并成一张大图，再通过 `background-position` 显示其中某一块区域。

```css
.icon-home {
  width: 20px;
  height: 20px;
  background-image: url("./sprite.png");
  background-repeat: no-repeat;
  background-position: -40px -20px;
}
```

#### 什么时候用

1. 老项目历史方案。
2. 多个小背景图需要合并请求。
3. 背景类图标场景。

#### 注意点

1. 通常用于背景图，不是普通 `img` 标签。
2. `background-position` 往左、往上移动时经常是负值。
3. 图标维护成本较高，修改一个图可能影响整张图。

### 2.2 字体图标

**字体图标** 是把图标做成字体文件，通过字符编码显示图形。

```css
@font-face {
  font-family: "iconfont";
  src:
    url("./fonts/iconfont.woff2") format("woff2"),
    url("./fonts/iconfont.woff") format("woff"),
    url("./fonts/iconfont.ttf") format("truetype");
}

.iconfont {
  font-family: "iconfont";
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

标签中使用：

```html
<span class="iconfont">&#xe603;</span>
```

伪元素中使用：

```css
.download::after {
  content: "\e603";
  font-family: "iconfont";
}
```

### 2.3 精灵图、字体图标、SVG 怎么选

| 方案         | 优点                     | 局限                     |
| ------------ | ------------------------ | ------------------------ |
| **精灵图**   | 减少请求、老项目常见     | 维护成本高，不灵活       |
| **字体图标** | 改色方便、接入成熟       | 多色图标和复杂图形能力弱 |
| **SVG 图标** | 现代项目最灵活、可控性高 | 接入方式相对更多样       |

结论通常是：

1. 新项目优先考虑 SVG。
2. 已有 iconfont 体系时可继续用字体图标。
3. 精灵图更多是维护历史项目时会遇到。

### 2.4 一个更贴近项目的判断方式

| 场景                       | 更推荐方案        | 原因             |
| -------------------------- | ----------------- | ---------------- |
| **维护老后台或老活动页**   | 精灵图 / 字体图标 | 历史包袱已存在   |
| **单色图标体系**           | 字体图标 / SVG    | 成本可控         |
| **多色、复杂、可交互图标** | SVG               | 灵活度最高       |
| **只是做一个小箭头或角标** | CSS 三角          | 无需引图或引字体 |

### 2.4 CSS 三角

把盒子的宽高设为 `0`，再利用边框形成三角形。

```css
.triangle {
  width: 0;
  height: 0;
  border: 8px solid transparent;
  border-left-color: pink;
}
```

常见用途：

1. 气泡箭头。
2. 下拉箭头。
3. 标签角标。

### 2.5 CSS 三角的边界

CSS 三角适合做简单装饰，不适合复杂图形。遇到需要圆角、阴影、多色渐变时，往往还是 SVG 或图片更稳。

### 2.5 `border-image`

`border-image` 可以用一张图片来绘制边框。

```css
.panel {
  border: 20px solid transparent;
  border-image: url("./border.png") 20 round;
}
```

需要知道：

1. 先要有实际边框宽度。
2. `slice` 表示切割区域。
3. `repeat`、`round`、`stretch` 决定边框如何铺开。

适合场景：

1. 特殊装饰风格边框。
2. 游戏化、活动页视觉。
3. 不规则边框需求。

这类能力平时不常用，但一旦遇到视觉稿里有“非普通边框”，它会很有价值。

---

## 三、交互样式

### 3.1 `cursor`

```css
button {
  cursor: pointer;
}
```

常见值：

1. `default`
2. `pointer`
3. `move`
4. `not-allowed`
5. `text`

一个常见规范是：可点击元素给 `pointer`，不可点击但禁用的元素给 `not-allowed`，避免用户误判可操作性。

### 3.2 `outline`

```css
input {
  outline: none;
}
```

它常用于去掉默认焦点轮廓，但不能只顾美观而忽略可访问性。

更稳妥的做法通常是：

```css
input:focus {
  outline: 2px solid #409eff;
}

也就是说，不要为了美观直接把焦点提示彻底删掉，而应该替换成更符合设计系统的焦点样式。
```

### 3.3 `resize`

```css
textarea {
  resize: none;
}
```

用于控制文本域是否允许拖拽缩放。

一个实战判断标准：

1. 内容区尺寸固定且布局敏感时，可禁用缩放。
2. 用户需要自由调整编辑空间时，保留缩放能力更友好。

这里的本质不是“要不要禁止”，而是要不要把布局稳定性放在用户自由调节之前。

---

## 四、排版细节

### 4.1 `vertical-align`

`vertical-align` 只对行内元素、行内块元素、表格单元格等场景有效。

常见值：

```css
vertical-align: baseline;
vertical-align: top;
vertical-align: middle;
vertical-align: bottom;
```

高频场景：

1. 图片、输入框和文字对齐。
2. 去掉图片底部空白缝隙。

```css
img,
input {
  vertical-align: middle;
}
```

去掉图片底部缝隙的常见方法：

1. `vertical-align: middle | top | bottom`
2. `display: block`

一个易错点：

很多人把 `vertical-align` 当成通用垂直居中方案，这是不对的，它有明确适用范围。

也就是说，它更像“行内对齐细节工具”，不是现代布局里的主居中方案。

### 4.2 文字溢出省略号

单行省略号：

```css
.ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
```

这 3 个条件缺一不可。

多行省略号：

```css
.multi-ellipsis {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
```

常见边界：

1. 多行省略依赖浏览器实现，不是完全统一标准。
2. 父容器宽度不明确时，省略号可能失效。
3. 如果内容必须完整可访问，还要补 `title` 或展开查看机制。

真正要记住的是：省略号不是简单写一行属性，而是“容器宽度、显示模式、溢出处理”一起成立才会生效。

---

## 五、常见布局技巧

### 5.1 负 `margin` 压边框

当多个盒子相邻排列时，可以让后一个盒子 `margin-left: -1px`，把重复边框压住，视觉上看起来只有一条线。

### 5.2 提升层级处理 hover 边框

如果鼠标移入时边框加粗导致布局抖动，可以通过相对定位或 `z-index` 提升当前项层级，而不是破坏整体排列。

### 5.3 文字环绕浮动元素

浮动元素不会完全压住普通文字流，所以图文混排时可以利用 `float` 形成环绕效果。

### 5.4 行内块水平居中

```css
.pager {
  text-align: center;
}
```

如果一组分页按钮本身是 `inline-block`，可通过父元素 `text-align: center` 实现整体居中。

### 5.5 这些技巧在今天怎么用

它们多数属于“边角技巧”而不是现代布局主方案。

也就是说：

1. 主布局优先 `flex`、`grid`。
2. 这些技巧主要用于老代码维护或特殊细节修补。

如果把这些技巧当成现代布局主方案，后续代码通常会越来越难维护。

---

## 六、CSS 初始化

### 6.1 为什么需要初始化

浏览器对标题、列表、表单等标签有默认样式，不同浏览器之间也存在差异，所以项目通常会先做一层 reset 或 normalize。

### 6.2 一个常见思路

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

ul,
ol {
  list-style: none;
}

a {
  text-decoration: none;
  color: inherit;
}
```

### 6.3 Reset 和 Normalize 的区别

| 方案          | 特点                             |
| ------------- | -------------------------------- |
| **Reset**     | 更彻底地清空默认样式             |
| **Normalize** | 尽量保留合理默认值，同时统一差异 |

### 6.4 一个实战建议

现代项目里通常不会盲目把所有标签都抹平，而是：

1. 统一基础差异。
2. 保留有价值的默认行为。
3. 再接入自己的设计系统样式。

换句话说，初始化的目标不是“把浏览器全清空”，而是“让不同浏览器的起点更可控”。

---

## 七、小结

1. 精灵图、字体图标和 `border-image` 都属于资源与视觉实现方案，但现代项目通常更偏向 SVG。
2. `cursor`、`outline`、`resize` 主要解决交互反馈问题。
3. `vertical-align` 和省略号处理属于高频排版细节，最怕误用场景。
4. 布局技巧更多是补充方案，主布局仍应优先 `flex`、`grid`。
5. CSS 初始化解决的是浏览器默认差异问题，但现代项目更强调“统一 + 可控”，而不是无差别清空。
