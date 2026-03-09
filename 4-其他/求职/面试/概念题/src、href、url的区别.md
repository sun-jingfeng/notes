# src、href、url 的区别

这是一个关于前端基础概念的问题，让我来解释它们的区别：

## 1. src (Source)

- **用途**：引入并嵌入资源到当前文档中。
- **使用场景**：`script`, `img`, `video`, `iframe`, `audio`
- **特点**：
  - 浏览器会暂停解析当前文档，下载并执行/渲染该资源。
  - 资源会成为文档的一部分。
  - 阻塞式加载（`script` 默认阻塞，`img` 不阻塞）。

```html
<script src="app.js"></script>
<img src="image.png">
<video src="video.mp4"></video>
<iframe src="page.html"></iframe>
<audio src="audio.mp3"></audio>
```

## 2. href (Hypertext Reference)

- **用途**：建立当前文档与外部资源的链接关系。
- **使用场景**：`a`, `link`
- **特点**：
  - 不会暂停当前文档的解析。
  - 表示一种引用/关联关系。
  - CSS 通过 `<link>` 并行加载，不阻塞 HTML 解析。

```html
<a href="https://example.com">链接</a>
<link href="style.css" rel="stylesheet">
<link href="favicon.ico" rel="icon">
```

## 3. url (Uniform Resource Locator)

- **用途**：通用的资源定位符，是一个概念/格式，不是 HTML 属性。
- **使用场景**：CSS, JS, 配置文件
- **特点**：
  - 是一种标准的地址格式。
  - 可以出现在 CSS、JS、配置文件等任何地方。
  - 格式：`协议://域名:端口/路径?查询参数#锚点`

```css
/* CSS 中使用 */
background-image: url('bg.jpg');
@import url('fonts.css');
@font-face { src: url('font.woff2'); }
```

```javascript
// JavaScript 中使用
fetch('https://api.example.com/data')
new URL('https://example.com')
```

## 总结对比

| 特性 | src | href | url |
| :--- | :--- | :--- | :--- |
| **类型** | HTML 属性 | HTML 属性 | 地址格式/概念 |
| **作用** | 嵌入资源 | 链接资源 | 定位资源 |
| **加载方式** | 替换/嵌入元素内容 | 建立关联 | - |
| **是否阻塞** | 可能阻塞 | 通常不阻塞 | - |
| **使用场景** | `script`, `img`, `video`, `iframe` | `a`, `link` | CSS, JS, 配置文件 |

**简单记忆**：
- **`src`** = 把资源拿进来用
- **`href`** = 指向那边有个资源
- **`url`** = 资源的地址格式
