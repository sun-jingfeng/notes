# BOM、常用 window 方法、常用事件、classList、dataset

BOM：浏览器对象模型

**==> picture [467 x 120] intentionally omitted <==**

## Navigator：浏览器

- navigator 对象下包含有许多信息，如 platform、userAgent

- onLine 属性检测当前是否处理联网状态

- geolocation 属性可以获取用户所在经纬度位置

- 注：众多的信息中有许多并不准确，如 appName、appCodeName等。

## History：历史记录

- length 属性记录了与当前页页相关的页面的数量

- " " 一

- back 方法跳转至上一个链接地址对应的页面，与浏览器的 后退 操作 致

- " " 一

- forward 方法跳转至下一个连接地址对应的页面，与浏览器的 前进 操作 致

- go 方法跳转到历史记录中任一链接地址对应的页面，参数可以正数也可以是负数

## location：地址栏

- location 的数据类型是对象，它拆分并保存了 URL 地址的各个组成部分。

- URL 即我们平时所说的链接地址，它有着固定的格式如下图所示：协议、主机、端口、路径、参数、哈希。

**==> picture [467 x 143] intentionally omitted <==**

## 总结：

- location.href 属性获取完整的 URL 地址，对其赋值时用于地址的跳转

- location.search 属性获取地址中携带的参数，符号 ？后面部分

- location.hash 属性获取地址中的啥希值，符号 # 后面部分

- location.reload 方法用来刷新当前页面，传入参数 true 时表示强制刷新

- location.assign：方法用于加载指定的url，会产生历史记录

- location.replace：方法用于替换url，不会产生历史记录

## screen：屏幕

- screen 属性的数据类型是对象，它记录用户电脑屏幕的相关参数，如宽度、高度等。

- Screen.width是屏幕宽度像素数（例如1920）

- Screen.height是屏幕高度像素数（例如1080）

- 总结：该对象的使用场景并不多。

## 常用window方法

- Alert

警告提示框会阻程序继续执行，直到用户点击确认后。

- Comfirm

   - 用户点击确定返回值为 true ，点击取消返回值为 false。

- Prompt

   - 传入第 2 个参数可以充当默认值。

## load、DOMContentLoaded事件

- load 会等待所有的资源（图片、样式、脚本、音视频等）加载完毕后才触发

- DOMContentLoaded 只要 HTML 结构加载完毕就会被触发，该事件通过 document 进行监听

- 将 script 标签写在 head 标签中时，查找 DOM 会失败

- 由于 DOMContentLoaded 比 load 更早被触发，因此通常推荐使用 DOMContentLoaded 事件

## beforeunload事件

- beforeunload 事件在关闭页面、跳转新页面、刷新当前页面时触发

- 该事件常用于提示用户即将离开当前页面

- 出于安全考虑不允许自定义提示信息

- event.returnValue = '' ，这条语句可用来阻止事件的发生（谷歌）

## resize事件

- 在窗口变化监听的过程中能实时获取视口的大小，可添加在window对象和某个元素上（例如可缩放的文本

- 域），不能加给document

- documentElement 能够获得视口的大小

- 基于 resize 可以动态计算 html 的字号大小，完成移动端 rem 屏幕适配

## dragover、drop事件

- 用户拖动文件至监听了 dragover 事件的元素之上时，dragover 事件就会被触发

- 用户拖动文件至监听了 drop 事件的元素之上然后松开拖拽文件时，drop 事件就会被触发

- 事件对象 dataTransfer.files 是 File 类型对象，包含了文件的大小、名称、格式等信息

- 通过 FileReader 实现文件的进行读取

## classList属性


- classList 是专门用于类名对象，该对象下包含了 些方法能够非常方便的进行类名的操作

- add 用于为元素节点添加一个类名

- remove 用于为元素节点删除一个类名

- contains 用于检测是否包含某个类名

- toggle 用于切换某个类名（如果有这个类名则删掉，如果没有这个类名要添加）

## dataset属性

- 为了区分 HTML 的标准属性，要求所有的自定义属性均为 data- 做为固定的前缀，形如 data-index、data-myinfo

- 上述代码中 my-info、index 即自定义属性，data- 是语法前缀

- 通过 DOM 节点的 dataset 属性可以获取自定义属性，也可以重新为自定义属性赋值

- 通过 dataset 赋值的自定义属性不存在时，会自动添加
