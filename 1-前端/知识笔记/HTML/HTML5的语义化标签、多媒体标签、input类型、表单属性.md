# HTML5 语义化标签、多媒体、input 与表单属性

## HTML5 新增的语义化标签

- 以前布局，我们基本用 div 来做。div 对于搜索引擎来说，是没有语义的。

- 新的语义标签：

   - <header>：头部标签

   - <nav>：导航标签

   - <article>：内容标签

   - <section>：定义文档某个区域

   - <aside>：侧边栏标签

   - <footer>：尾部标签

**==> picture [330 x 229] intentionally omitted <==**

## 注意：

- 这种语义化标准主要是针对搜索引擎的

- 这些新标签页面中可以使用多次

- 在 IE9 中，需要把这些元素转换为块级元素

- 其实，我们移动端更喜欢使用这些标签

- HTML5 还增加了很多其他标签，我们后面再慢慢学

## HTML5 新增的多媒体标签

- 视频<video>

   - 当前 <video> 元素支持三种视频格式： 尽量使用 mp4格式

1

**==> picture [467 x 176] intentionally omitted <==**

语法：

<video src=" 文件地址 " controls="controls"></video>

> 1 <video controls="controls" width="300">

> 2 <source src="move.ogg" type="video/ogg" >

> 3 <source src="move.mp4" type="video/mp4" >

> 4 您的浏览器暂不支持 <video> 标签播放视频

- 5 </ video >

## 常见属性：

**==> picture [433 x 236] intentionally omitted <==**

## 音频<audio>

- 当前 <audio> 元素支持三种音频格式：

语法：

**==> picture [467 x 141] intentionally omitted <==**

1

<audio src=" 文件地址 " controls="controls"></audio>

> 1 < audio controls="controls" >

> 2 <source src="happy.mp3" type="audio/mpeg" >

> 3 <source src="happy.ogg" type="audio/ogg" >

> 4 您的浏览器暂不支持 <audio> 标签。

> 5 </ audio>

## 常见属性：

**==> picture [467 x 123] intentionally omitted <==**

谷歌浏览器把音频和视频自动播放禁止了

## 多媒体标签总结


- 音频标签和视频标签使用方式基本一致

- 浏览器支持情况不同

- 谷歌浏览器把音频和视频自动播放禁止了

- 我们可以给视频标签添加 muted 属性来静音播放视频，音频不可以（可以通过JavaScript解决）

- 视频标签是重点，我们经常设置自动播放，不使用 controls 控件，循环和设置大小属性

HTML5 新增的 input 类型

**==> picture [467 x 255] intentionally omitted <==**

重点记住： number tel search 这三个

## HTML5 新增的表单属性

**==> picture [467 x 192] intentionally omitted <==**

可以通过以下设置方式修改placeholder里面的字体颜色：

> 1 input::placeholder {

> 2 color: pink;

> 3 }
