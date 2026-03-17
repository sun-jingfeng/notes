# Emmet

## 一、什么是 Emmet

**Emmet** 是一种用缩写快速生成 HTML 和 CSS 代码的工具，它能把重复输入的大量标签和样式简写成短表达式，从而明显提升编码效率。

它最常见的使用场景是：

1. 快速搭页面结构。
2. 批量生成重复节点。
3. 快速补全常见 CSS 属性。

---

## 二、为什么前端开发常用 Emmet

| 对比项       | 手写 HTML / CSS | 使用 Emmet   |
| ------------ | --------------- | ------------ |
| **输入量**   | 高              | 低           |
| **重复结构** | 容易机械复制    | 可批量生成   |
| **效率**     | 一般            | 高           |
| **适合场景** | 复杂细节微调    | 结构快速搭建 |

### 1. 核心价值

1. 提高原型搭建速度。
2. 减少重复输入。
3. 让常见结构更标准化。

---

## 三、HTML 常见缩写

### 1. 类名与 id

```text
.mark
p.mark
p#content
```

展开结果：

```html
<div class="mark"></div>
<p class="mark"></p>
<p id="content"></p>
```

### 2. 同级兄弟 `+`

```text
p+p
```

```html
<p></p>
<p></p>
```

### 3. 子级 `>`

```text
div>p
```

```html
<div>
  <p></p>
</div>
```

### 4. 乘法 `*`

```text
p*3
```

```html
<p></p>
<p></p>
<p></p>
```

### 5. 组合写法

```text
div>p+p
```

```html
<div>
  <p></p>
  <p></p>
</div>
```

### 6. 批量复杂结构

```text
ul*2>li*3>a
```

```html
<ul>
  <li><a href=""></a></li>
  <li><a href=""></a></li>
  <li><a href=""></a></li>
</ul>
<ul>
  <li><a href=""></a></li>
  <li><a href=""></a></li>
  <li><a href=""></a></li>
</ul>
```

---

## 四、更实用的 HTML 写法

### 1. 文本内容 `{}`

```text
a{点击这里}
```

```html
<a href="">点击这里</a>
```

### 2. 属性 `[]`

```text
input[type=text][placeholder=请输入用户名]
```

```html
<input type="text" placeholder="请输入用户名" />
```

### 3. 自动编号 `$`

```text
ul>li.item$*3
```

```html
<ul>
  <li class="item1"></li>
  <li class="item2"></li>
  <li class="item3"></li>
</ul>
```

### 4. 分组 `()`

```text
header>(nav>ul>li*3>a)+section+footer
```

适合快速搭页面骨架。

---

## 五、CSS 常见缩写

### 1. 高频示例

| 缩写    | 展开结果                 |
| ------- | ------------------------ |
| `fz20`  | `font-size: 20px;`       |
| `fwn`   | `font-weight: normal;`   |
| `ffs`   | `font-family: serif;`    |
| `fsn`   | `font-style: normal;`    |
| `lh30`  | `line-height: 30px;`     |
| `tac`   | `text-align: center;`    |
| `ti2em` | `text-indent: 2em;`      |
| `tdn`   | `text-decoration: none;` |
| `w200`  | `width: 200px;`          |
| `h200`  | `height: 200px;`         |

### 2. 一个直观例子

输入：

```text
m10
```

展开：

```css
margin: 10px;
```

---

## 六、在 VS Code 中怎么用

### 1. 基本方式

输入缩写后，通常按 `Tab` 或 `Enter` 就能展开。

### 2. 常见配置

如果某些文件类型里 Emmet 不生效，可以在设置中补映射：

```json
{
  "emmet.includeLanguages": {
    "vue-html": "html",
    "javascript": "javascriptreact"
  }
}
```

### 3. 常见场景

1. `.vue` 文件模板区域。
2. React JSX。
3. 普通 HTML 页面。

---

## 七、实战示例

### 1. 快速生成导航结构

输入：

```text
nav>ul>li*4>a{菜单$}
```

展开：

```html
<nav>
  <ul>
    <li><a href="">菜单1</a></li>
    <li><a href="">菜单2</a></li>
    <li><a href="">菜单3</a></li>
    <li><a href="">菜单4</a></li>
  </ul>
</nav>
```

### 2. 快速生成表单项

输入：

```text
form>input[type=text][name=username]+input[type=password][name=password]+button{登录}
```

展开后就是一套基础表单骨架。

---

## 八、注意事项

1. Emmet 适合快速生成结构，不适合替代你对 HTML 语义的理解。
2. 缩写虽快，但复杂页面仍需要你自己把控结构合理性。
3. 不同编辑器快捷键可能不同，但语法核心基本一致。
4. 在 JSX、Vue、模板字符串里，有些缩写展开行为会受语言模式影响。

---

## 九、总结

1. Emmet 的本质是“用缩写生成结构”。
2. HTML 里最常用的是 `.class`、`#id`、`>`、`+`、`*`、`$`、`{}`、`[]`。
3. CSS 里最常用的是属性缩写快速展开。
4. 它最大的价值是提效，而不是替代基础语法学习。
5. 学会后，写静态结构和常规样式会快很多。
