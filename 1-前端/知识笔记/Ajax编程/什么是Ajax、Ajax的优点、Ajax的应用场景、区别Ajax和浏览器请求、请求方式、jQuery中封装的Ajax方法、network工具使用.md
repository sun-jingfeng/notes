# 什么是 Ajax、优点、应用场景、jQuery 封装、network 工具

## 什么是 Ajax

- AJAX 即异步的 JavaScript 和 XML（Asynchronous JavaScript And XML）。


- Ajax一种技术，通过浏览器内置对象（XMLHttpRequest）和服务器进行数据交互的技术。

- 通过Ajax技术，也能够实现客户端服务器的数据交互。

   - 调用浏览器内置对象 XMLHttpRequest 的API编写JS代码

   - 执行JS，向服务器发送请求

   - 等待服务器处理，等待服务器返回结果

   - 使用变量接收服务器响应结果

**==> picture [467 x 160] intentionally omitted <==**

## Ajax的优点

- AJAX最吸引人的就是它可以在不重新刷新页面的情况下与服务器通信，交换数据，或更新页面。

- Ajax沟通了前后端，实际开发中Ajax是连接前后端的桥梁，是前后端数据交互的主要技术。

## Ajax的应用场景

- 搜索建议提示（比如百度、京东、淘宝等等）

- 地图（百度地图）

- 验证用户名是否存在

- 网页聊天室

- 无刷新的分页

## .....

- 总之，在不刷新页面的情况下，还要完成页面和服务器的数据交互，都可以使用Ajax

## 区别Ajax和浏览器请求——浏览器自主请求

- 浏览器向服务器发送请求，是浏览器默认的功能。发送请求时，页面会跳转或刷新。

   - 直接输入网址，按回车；默认就会向服务器发送请求

   - 点击超链接，跳转到其他页面

   - 表单提交到其他页面

**==> picture [467 x 72] intentionally omitted <==**

## 区别Ajax和浏览器请求——Ajax请求


- Ajax请求，是通过执行一段 JS代码实现的请求。发送请求时，页面不会刷新。

**==> picture [467 x 107] intentionally omitted <==**

**==> picture [402 x 12] intentionally omitted <==**

**----- Start of picture text -----**<br>
当然，我们研究的是Ajax请求，研究的是JS代码。至于服务器怎么处理的，无需关心。<br>**----- End of picture text -----**<br>

## 请求方式

- 当使用浏览器和服务器进行数据交互时，多数都是由浏览器端发起请求，然后才能获取响应结果。

- 浏览器能够发起的请求，又分为多种请求方式，但常用的请求方式只有下面两种：

   - GET ，获取；如果向服务器发送请求，获取服务器的资源，使用GET方式

      - 比如获取页面中需要的数据

      - 比如获取一个用户的信息（用户名、昵称、头像等）

   - POST，邮寄（提交）。如果提交数据给服务器，那么使用POST方式。

      - 比如，登录、注册（提交账号和密码给服务器）

      - 比如，添加评论，发布评论（贴吧中有）

   - PUT，放置。用请求有效载荷替换目标资源时可以使用此请求。

      - 比如，修改操作可以使用此请求方式

   - DELETE，删除。删除指定的资源的时候，可以使用此方式。

比如，删除一个用户、删除一个商品等等

PS: 其他请求方式参见[这里](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods)。

## jQuery中封装的Ajax方法

- 前文提到，浏览器使用内置对象 `XMLHttpRequest` 完成与服务器的通信。目前，jQuery对

- `XMLHttpRequest` 对象的使用做了封装，提供了非常简单的使用方法。

- 为了方便，我们先学习jQuery封装的方法。过两天，再学习原生的 `XMLHttpRequest` 对象。

- jQuery提供的能够实现ajax请求的方法：

> 1 // 专门用于发送 GET 方式请求

> 2 $.get(url, [data], [callback], [dataType]) 3

> 4 // 专门用于发送 POST 请求

> 5 $.post(url, [data], [callback], [dataType]); 6

> 7 // 一个综合的发送 Ajax 请求的方法，使用频率最高

> 8 $.ajax({

> 9 // 这里填 ajax 选项

> 10 url: Ajax 请求的 url 地址 , // 必填

> 11 type: 'GET', // 默认 GET ，可选 POST

> 12 data: {}, // 请求参数，可选

> 13 success: function (res) {} // ajax 请求成功时的回调，可选

> 14 .... 其他选项

> 15 });

- $.ajax()方法的其他选项参见[这里](https://www.jq22.com/chm/jquery/jQuery.ajax.html)。

## $.get()方法


- 已知前端刘老师租赁了 台服务器，在服务器上存储了很多图书信息，那么如何得到这些图书数据呢？

   - 数据在服务器上，我们想要获取，则需要发送Ajax请求获取

   - 因为是获取数据，所以得用GET方式

   - 综上所述，应该选用 `$.get()` 或 `$.ajax()` 方法

- 下面介绍 `$.get()` 的具体用法：

> 1 var url = 'http://www.liulongbin.top:3006/api/getbooks'; 2

> 3 /******************* $.get() ******************/ 4

> 5 // 仅仅发送一个 GET 方式的请求

> 6 $.get(url); 7

> 8 // 发送 GET 请求，并使用回调函数接收服务器响应的结果

> 9 $.get(url, function (res) {

> 10 console.log(res); // res 表示服务器响应的结果

> 11 }); 12

> 13 // 发送 GET 请求，并传递一个请求参数（这里传递了 id ，表示只获取 id 为 1 的数据）

> 14 $.get(url, {id: 1}, function (res) {

> 15 console.log(res)

> 16 });

## $.post方法


- 我们能不能提交 本书的信息，让刘老师的服务器帮我们保存呢？

   - 因为是提交数据，所以应该使用 POST 方式

所以应该选择 `$.post()` 获取 `$.ajax()` 方法

下面演示 使用 `$.post()` 向服务器提交一本书籍的信息，让服务器帮我们保存起来。

**==> picture [550 x 385] intentionally omitted <==**

**----- Start of picture text -----**<br>
1 //  注意下面的 url 和前面案例中的 url 不一样。<br>2 //  一个 url 只能完成一个功能，比如获取书籍数据是一个 url ，添加书籍是另一个 url<br>3 var addUrl = 'http://www.liulongbin.top:3006/api/addbook';<br>4<br>5 /******************* $.post() ******************/<br>6<br>7 //  仅仅发送一个 POST 方式的请求，对于本例，仅仅发送一个 POST 请求没有意义<br>8 $.post(addUrl);<br>9<br>10 //  发送 POST 请求，并提交一本书的信息，并使用回调函数接收服务器响应的结果<br>11 var body = {<br>12     bookname: ' 遮天 ',<br>13     author: ' 辰东 ',<br>14     publiser: ' 仙侠出版社 '<br>15 };<br>16 $.post(addUrl, body, function (res) {<br>17     console.log(res); // res 表示服务器响应的结果<br>18 });<br>**----- End of picture text -----**<br>

## $.ajax()方法


- 假设某 本书不需要了，能不能让刘老师的服务器删除这本书呢？


   - 需求是删除 本书，则合理的请求方式应该是 DELETE 方式

   - 这个时候，就不能使用 `$.get()` 或 `$.post()` 方法了。

   - 只能使用 `$.ajax()` 方法了。

   - 另外，刘老师要求，如果你想删除他服务器上的图书，则需要告诉他图书的id是多少，id值要拼接到url后面

1 // $.ajax() 的参数为一个对象，对象的每个键值对都叫做 ajax 配置选项；简称选项 2 $.ajax({ 3 // 这里填 Ajax 配置选项 4 type: 'DELETE', // 请求方式；如果不指定这项，则默认的请求方式为 GET 5 url: 'http://www.liulongbin.top:3006/api/delbook?id=4', // 必须这样指定 id 值 6 success: function (res) { 7 console.log(res) 8 }

> 9 });

## network工具使用

- All -- 查看所有请求

- XHR -- 查看Ajax请求

- JS -- 查看请求了哪些JS文件

- CSS -- 查看请求了哪些CSS文件

- Img -- 查看请求了哪些图片

- Media -- 查看请求了哪些音频、视频等

- Font -- 查看请求了哪些字体文件

- Doc -- document，查看请求了哪些html文件
