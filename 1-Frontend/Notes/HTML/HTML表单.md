# HTML 表单

## 一、一句话理解

表单不是一堆输入框的拼装，而是一条“收集用户输入 -> 组织字段 -> 提交到后端 -> 给用户反馈”的交互链路。

---

## 二、什么是表单

**表单（Form）** 是 HTML 中用来收集用户输入并提交到服务器的一组控件。

一个完整表单通常包含三部分：

| 组成         | 说明                                       |
| ------------ | ------------------------------------------ |
| **表单域**   | `form`，负责包裹和提交数据                 |
| **表单控件** | `input`、`select`、`textarea`、`button` 等 |
| **提示信息** | 标签文本、占位提示、说明文字、错误信息     |

---

## 三、`form` 表单域

`<form>` 用于定义提交范围，表单控件通常都放在它里面。

```html
<form action="/login" method="post" name="loginForm">
  <!-- 各种表单元素 -->
</form>
```

### 1. 常用属性

| 属性               | 说明                                           |
| ------------------ | ---------------------------------------------- |
| **`action`**       | 提交地址                                       |
| **`method`**       | 提交方式，常见为 `get` 或 `post`               |
| **`name`**         | 表单名称                                       |
| **`target`**       | 提交结果打开位置，如 `_self`、`_blank`         |
| **`autocomplete`** | 是否允许浏览器自动填充                         |
| **`enctype`**      | 编码类型，上传文件时常用 `multipart/form-data` |

### 2. `get` 和 `post` 的区别

| 对比项               | `get`         | `post`               |
| -------------------- | ------------- | -------------------- |
| **数据位置**         | 拼接在 URL 上 | 放在请求体中         |
| **适用场景**         | 查询、筛选    | 登录、注册、提交数据 |
| **是否适合传大数据** | 不适合        | 更适合               |

> **注意**：上传文件时，除了需要 `method="post"`，还要设置 `enctype="multipart/form-data"`。

可以把 `form` 理解成提交边界，它决定哪些控件一起提交、往哪提、用什么方式提。

---

## 四、`input` 表单元素

`<input>` 是最常用的表单控件，通过 `type` 决定不同的输入形态。

```html
<input type="text" />
```

### 1. 常见 `type` 类型

| 类型           | 作用         |
| -------------- | ------------ |
| **`text`**     | 单行文本输入 |
| **`password`** | 密码输入     |
| **`radio`**    | 单选按钮     |
| **`checkbox`** | 复选框       |
| **`file`**     | 文件上传     |
| **`number`**   | 数字输入     |
| **`email`**    | 邮箱输入     |
| **`date`**     | 日期选择     |
| **`submit`**   | 提交按钮     |
| **`reset`**    | 重置按钮     |
| **`button`**   | 普通按钮     |

### 2. 常用属性

| 属性              | 说明                          |
| ----------------- | ----------------------------- |
| **`name`**        | 字段名，提交给后端时作为 key  |
| **`value`**       | 当前值                        |
| **`placeholder`** | 占位提示                      |
| **`checked`**     | 单选/复选的默认选中           |
| **`disabled`**    | 禁用，不可交互且不会提交      |
| **`readonly`**    | 只读，可以提交但不可编辑      |
| **`maxlength`**   | 最大字符数                    |
| **`required`**    | 必填                          |
| **`id`**          | 唯一标识，常配合 `label` 使用 |

### 3. 示例

```html
<input type="text" name="username" placeholder="请输入用户名" />
<input type="password" name="password" placeholder="请输入密码" />
```

### 4. 单选和复选的关键点

#### 1. 单选按钮

同一组单选按钮必须拥有相同的 `name`，这样浏览器才知道它们是“一组选一”。

```html
<input type="radio" name="gender" value="male" checked /> 男
<input type="radio" name="gender" value="female" /> 女
```

#### 2. 复选框

```html
<input type="checkbox" name="hobby" value="music" /> 音乐
<input type="checkbox" name="hobby" value="sports" /> 运动
```

> **注意**：`checked` 主要用于 `radio` 和 `checkbox`，表示默认选中。

不同 `type` 不只是显示不一样，它们还会影响输入体验、浏览器校验方式和移动端键盘形态。

---

## 五、`label` 标签

`<label>` 用于给表单控件添加文本说明，并增强可点击范围。

```html
<label for="username">用户名</label>
<input id="username" type="text" name="username" />
```

### 1. 作用

| 作用               | 说明                   |
| ------------------ | ---------------------- |
| **提升可用性**     | 点击文本也能聚焦输入框 |
| **提升无障碍体验** | 有利于屏幕阅读器识别   |

### 2. 核心规则

`label` 的 `for` 必须对应目标控件的 `id`。

`label` 很容易被忽略，但它对点击范围和无障碍都很重要。

---

## 六、`select` 下拉框

当候选项较多、又希望节省页面空间时，可以使用下拉框。

```html
<select name="city">
  <option value="beijing">北京</option>
  <option value="shanghai" selected>上海</option>
  <option value="guangzhou">广州</option>
</select>
```

### 1. 关键点

| 规则                  | 说明                        |
| --------------------- | --------------------------- |
| **必须包含 `option`** | `select` 自身只负责容器作用 |
| **`selected`**        | 设置默认选中项              |
| **`value`**           | 建议每个选项都明确写值      |

下拉框适合候选项明确、范围有限的场景；如果选项很多、需要搜索，原生 `select` 往往就不够用了。

---

## 七、`textarea` 文本域

`<textarea>` 用于输入多行文本，常见于评论、简介、备注等场景。

```html
<textarea name="message" placeholder="请输入留言"></textarea>
```

### 1. 特点

| 特点                    | 说明                              |
| ----------------------- | --------------------------------- |
| **可输入多行内容**      | 比 `input` 更适合长文本           |
| **默认值写在标签内部**  | 不是写在 `value` 属性上           |
| **尺寸通常用 CSS 控制** | 实际开发中较少依赖 `rows`、`cols` |

```html
<textarea name="intro">默认内容</textarea>
```

它更适合长文本输入，不适合被当成只是更大的 `input`。

---

## 八、按钮

按钮既可以用 `input`，也可以用 `button`。

| 写法                                      | 说明                    |
| ----------------------------------------- | ----------------------- |
| **`<input type="submit" />`**             | 提交按钮                |
| **`<input type="reset" />`**              | 重置按钮                |
| **`<button type="submit">提交</button>`** | 更灵活，可写文本和 HTML |

推荐优先使用 `button`，因为可扩展性更强。

```html
<button type="submit">提交</button>
<button type="reset">重置</button>
<button type="button">普通按钮</button>
```

> **注意**：`button` 在表单中如果不写 `type`，默认行为通常是 `submit`。

这也是为什么很多项目里会显式写 `type="button"`，避免普通按钮误触发表单提交。

---

## 九、完整示例

```html
<form action="/register" method="post">
  <div>
    <label for="username">用户名：</label>
    <input
      id="username"
      type="text"
      name="username"
      placeholder="请输入用户名"
      required
    />
  </div>

  <div>
    <label for="password">密码：</label>
    <input id="password" type="password" name="password" required />
  </div>

  <div>
    性别：
    <label>
      <input type="radio" name="gender" value="male" checked /> 男
    </label>
    <label> <input type="radio" name="gender" value="female" /> 女 </label>
  </div>

  <div>
    城市：
    <select name="city">
      <option value="beijing">北京</option>
      <option value="shanghai">上海</option>
    </select>
  </div>

  <div>
    <textarea name="remark" placeholder="请输入备注"></textarea>
  </div>

  <button type="submit">提交</button>
  <button type="reset">重置</button>
</form>
```

---

## 十、真实开发里的高频边界

### 1. `disabled` 和 `readonly` 的区别

| 属性           | 是否可编辑 | 是否会提交 |
| -------------- | ---------- | ---------- |
| **`disabled`** | 否         | 否         |
| **`readonly`** | 否         | 是         |

### 2. 原生校验和后端校验的关系

像 `required`、`maxlength` 这类能力只能做基础拦截，不能替代后端校验。

---

## 十一、常见注意事项

| 问题                              | 说明                   |
| --------------------------------- | ---------------------- |
| **`name` 忘写**                   | 后端可能收不到对应字段 |
| **单选按钮 `name` 不一致**        | 会导致不能实现单选效果 |
| **`label for` 没匹配 `id`**       | 点击文字无法聚焦控件   |
| **`textarea` 默认值写到 `value`** | 这是错误写法           |
| **文件上传没设置编码类型**        | 后端无法正确接收文件   |

很多表单问题不是样式问题，而是字段名、提交方式、编码方式和控件行为没分清。

## 十二、小结

| 知识点           | 结论                                              |
| ---------------- | ------------------------------------------------- |
| **表单域**       | 用 `form` 包裹提交范围                            |
| **基础控件**     | `input`、`select`、`textarea`                     |
| **文本说明**     | 用 `label` 提升体验                               |
| **后端识别字段** | 依赖 `name`                                       |
| **上传文件**     | `method="post"` + `enctype="multipart/form-data"` |
