# HTML 表单

表单的组成

**==> picture [476 x 12] intentionally omitted <==**

**----- Start of picture text -----**<br>
在 HTML 中，一个完整的表单通常由表单域、表单控件（也称为表单元素）和 提示信息3个部分构成。<br>**----- End of picture text -----**<br>

**==> picture [467 x 186] intentionally omitted <==**

## 表单域

- 在 HTML 标签中， <form> 标签用于定义表单域，以实现用户信息的收集和传递。<form> 会把它范围内的表单元素信息提交给服务器.

> 1 <form action="url 地址 " method=" 提交方式 " name=" 表单域名称 ">

> 2 各种表单元素控件

> 3 </form>

## 常用属性：

**==> picture [467 x 95] intentionally omitted <==**

## <input> 表单元素

   - 在 <input> 标签中，包含一个 type 属性，根据不同的 type 属性值，输入字段拥有很多种形式（可以是文本字

   - 段、复选框、掩码后的文本控件、单选按钮、按钮等）。

- 1

<input type=" 属性值 " />

- <input /> 标签为单标签

- type 属性设置不同的属性值用来指定不同的控件类型

- type 属性的属性值及其描述如下：

**==> picture [467 x 242] intentionally omitted <==**

- 补充：<button></button>双标签同<input type="submit">

- 除 type 属性外，<input>标签还有其他很多属性，其常用属性如下：

**==> picture [467 x 125] intentionally omitted <==**

   - name 和value 是每个表单元素都有的属性值,主要给后台人员使用.

   - name 表单元素的名字, 要求 单选按钮和复选框要有相同的name值.


   - checked属性主要针对于单选按钮和复选框, 主要作用一打开页面,就要可以默认选中某个表单元 素.

      - maxlength 是用户可以在表单元素输入的最大字符数, 一般较少使用.

- 有些表单元素想刚打开页面就默认显示几个文字怎么做?

   - 答: 可以给这些表单元素设置 value 属性="值"

> 1 用户名 : <input type="text" value=" 请输入用户名 " />

- 页面中的表单元素很多，如何区别不同的表单元素?

   - 答: name 属性：当前 input 表单的名字，后台可以通过这个 name 属性找到这个表单。页面中的表单很

   - 多，name 的主要作用就是用于区别不同的表单。

> 1 用户名 : <input type="text" value=" 请输入用户名 " name="username" />

- name 属性后面的值，是自定义的

- radio (或者checkbox）如果是一组，我们必须给他们命名相同的名字

> 1 <input type="radio" name="sex" /> 男

> 2 <input type="radio" name="sex" /> 女


- 如果页面一打开就让某个单选按钮或者复选框是选中状态?

   - 答: checked 属性：表示默认选中状态。用于单选按钮和复选按钮。

1 性别 : 2 <input type="radio" name="sex" value=" 男 " checked="checked" /> 男 3 <input type="radio" name="sex" value=" 女 " /> 女

- 如何让input表单元素展示不同的形态? 比如单选按钮或者文本框

   - 答: type属性：type属性可以让input表单元素设置不同的形态.

> 1 <input type="radio" name="sex" value=" 男 " checked="checked" /> 男

> 2 <input type="text" value=" 请输入用户名 ">

## <label> 标签

- <label> 标签用于绑定一个表单元素, 当点击<label> 标签内的文本时，浏览器就会自动将焦点(光标)转到或者选 择对应的表单元素上,用来增加用户体验.

- 语法：

> 1 <label for="sex"> 男 </label>

> 2 <input type="radio" name="sex" id="sex" />

核⼼： <label> 标签的 for 属性应当与相关元素的 id 属性相同。

## <select> 表单元素

- 在页面中，如果有多个选项让用户选择，并且想要节约页面空间时，我们可以使用<select>标签控件定义下拉

列表。

**==> picture [137 x 222] intentionally omitted <==**

**==> picture [33 x 10] intentionally omitted <==**

**----- Start of picture text -----**<br>
语法：<br>**----- End of picture text -----**<br>

> 1 <select>

> 2 <option> 选项 1</option>

> 3 <option> 选项 2</option>

> 4 <option> 选项 3</option>

> 5 ...

> 6 </select>

- <select> 中至少包含一对<option> 。

- 在<option> 中定义 selected =" selected " 时，当前项即为默认选中项。

## <textarea> 表单元素

- 在表单元素中，<textarea> 标签是用于定义多行文本输入的控件。使用多行文本输入控件，可以输入更多的文

- 字，该控件常见于留言板，评论。

语法：

- 1 <textarea rows="3" cols="20"> 2 文本内容 3 </textarea>

   - 通过 <textarea> 标签可以轻松地创建多行文本输入框。

   - cols="每行中的字符数" ，rows="显示的行数"，我们在实际开发中不会使用，都是用 CSS 来改变大小。

## 表单元素几个总结点

- 表单元素我们学习了三大组 input 输入表单元素、 select 下拉表单元素、 textarea 文本域表单元素.

这三组表单元素都应该包含在form表单域里面,并且有 name 属性.

> 1 <form>

> 2 <input type="text" name="username">

> 3 <select name="jiguan">

> 4 <option> 北京 </option>

> 5 </select>

> 6 <textarea name= "message"></textarea>

> 7 </form>

- 有三个名字非常相似的标签:

   - 表单域 form 使用场景: 提交区域内表单元素给后台服务器

   - 文件域 file 是input type 属性值 使用场景: 上传文件

   - 文本域 textarea 使用场景: 可以输入多行文字, 比如留言板 网站介绍等
