# vue 简介、指令、过滤器

## 一、一句话理解

Vue2 的核心不是“多学一套模板语法”，而是把页面开发从手动操作 DOM，转成按数据状态去组织视图和交互。

这篇虽然覆盖主题很多，但可以把它当成一份 Vue2 入门总览：先建立整体心智，再按“基础理解 -> 常用指令 -> 历史能力过滤器”的顺序查阅。

---

## 二、这篇怎么查

| 如果你当前想解决             | 优先看                             |
| ---------------------------- | ---------------------------------- |
| Vue 到底在解决什么问题       | `什么是 Vue`、`MVVM 理解`          |
| 怎么快速跑起一个 Vue2 页面   | `Vue 的基本使用`                   |
| 模板里怎么渲染内容和绑定事件 | `内容渲染`、`属性绑定`、`事件绑定` |
| 表单、条件、列表怎么写       | `v-model`、`v-if/v-show`、`v-for`  |
| 过滤器还能不能继续用         | `过滤器`                           |

如果你是第一次学，按章节顺序看更顺；如果你是在复习或排错，直接按上表跳转会更快。

---

## 三、什么是 Vue

Vue 是一套用于构建用户界面的前端框架，核心目标是用更少的代码完成页面渲染、状态管理和交互处理。

在 Vue2 中，最重要的思想有两个：

1. 数据驱动视图
2. 双向数据绑定

---

## 四、Vue 的核心特性

### 数据驱动视图

页面最终展示什么内容，不再依赖开发者手动操作 DOM，而是依赖数据状态。

```js
new Vue({
  el: "#app",
  data: {
    message: "hello vue",
  },
})
```

```html
<div id="app">{{ message }}</div>
```

当 `message` 改变时，页面会自动更新。

### 双向数据绑定

双向绑定主要体现在表单场景中。数据变化会更新页面，用户输入也会同步回数据。

```html
<input v-model="username" />
<p>{{ username }}</p>
```

```js
new Vue({
  el: "#app",
  data: {
    username: "",
  },
})
```

---

## 五、MVVM 理解

MVVM 是 Vue2 的重要理解模型。

| 名称      | 含义       | 对应内容          |
| --------- | ---------- | ----------------- |
| Model     | 数据层     | `data` 中的数据   |
| View      | 视图层     | 页面中的 DOM 结构 |
| ViewModel | 视图模型层 | Vue 实例          |

可以把 Vue 实例看成桥梁：

1. 把数据和视图连接起来。
2. 监听数据变化并更新视图。
3. 监听用户输入并同步到数据。

---

## 六、Vue2 和 Vue3 的关系

这份笔记以 Vue2 为主，因为很多老项目仍在维护 Vue2。

| 版本 | 状态             | 说明             |
| ---- | ---------------- | ---------------- |
| Vue1 | 基本淘汰         | 不再建议学习     |
| Vue2 | 仍有大量存量项目 | 适合理解经典写法 |
| Vue3 | 当前主流趋势     | 新项目更常见     |

学习上建议：

1. 先掌握 Vue2 的模板语法和组件通信。
2. 再补 Vue3 的组合式 API。

也就是说，学 Vue2 的重点不只是维护旧项目，更是在建立组件化开发的基本心智。

---

## 七、Vue 的基本使用

### 基本步骤

1. 引入 Vue2 脚本。
2. 准备一个受 Vue 控制的区域。
3. 创建 Vue 实例。

```html
<div id="app">
  <h1>{{ title }}</h1>
  <button @click="changeTitle">修改标题</button>
</div>

<script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>
<script>
  new Vue({
    el: "#app",
    data: {
      title: "Vue2 入门",
    },
    methods: {
      changeTitle() {
        this.title = "标题已更新"
      },
    },
  })
</script>
```

| 配置项    | 作用                   |
| --------- | ---------------------- |
| `el`      | 指定 Vue 管理的根容器  |
| `data`    | 页面需要使用的数据     |
| `methods` | 事件处理函数和业务方法 |

---

## 八、vue-devtools 调试工具

使用 Vue Devtools 可以更直观地查看组件树、数据状态和事件流。

常见用途：

1. 查看当前页面挂载了哪些组件。
2. 观察组件中的 `data`、`props`。
3. 快速定位是“数据没变”还是“模板没渲染”。

如果浏览器已经安装对应扩展，打开开发者工具后通常可以看到 `Vue` 面板。

---

## 九、指令的概念

指令是 Vue 提供的模板语法，用来增强 HTML，让 DOM 具备数据渲染、绑定属性、绑定事件等能力。

常见指令分类如下：

| 分类     | 常见指令                    |
| -------- | --------------------------- |
| 内容渲染 | `v-text`、`v-html`、`{{ }}` |
| 属性绑定 | `v-bind`                    |
| 事件绑定 | `v-on`                      |
| 双向绑定 | `v-model`                   |
| 条件渲染 | `v-if`、`v-show`            |
| 列表渲染 | `v-for`                     |

---

## 十、内容渲染指令

### v-text

```html
<p v-text="msg"></p>
```

作用：把 `msg` 的值作为纯文本渲染到标签内部。

注意：`v-text` 会覆盖标签原本的内容。

### 插值表达式

```html
<p>{{ msg }}</p>
```

这是最常用的文本渲染方式，因为它不会像 `v-text` 一样直接覆盖整个标签内容。

### v-html

```html
<div v-html="htmlStr"></div>
```

如果数据中包含 HTML 字符串，使用 `v-html` 可以把它解析成真正的 HTML 节点。

```js
data: {
  htmlStr: "<strong>高亮文本</strong>"
}
```

注意：`v-html` 有 XSS 风险，不要直接渲染不可信内容。

所以内容渲染里最常用的主线其实是：普通文本优先插值，只有确实要渲染可信 HTML 片段时才考虑 `v-html`。

### 真实开发里怎么快速判断

| 需求               | 更推荐   |
| ------------------ | -------- |
| 渲染普通文本       | `{{ }}`  |
| 必须整块纯文本覆盖 | `v-text` |
| 渲染可信 HTML 片段 | `v-html` |

---

## 十一、属性绑定指令

### v-bind

```html
<img v-bind:src="imgUrl" v-bind:title="title" />
```

简写形式：

```html
<img :src="imgUrl" :title="title" />
```

除了绑定简单值，也可以写简单表达式：

```html
<div :class="isActive ? 'active' : 'normal'"></div>
```

### 一个实战提醒

属性绑定的重点不是“所有东西都能绑”，而是想清楚：这个值是静态写死，还是应该跟着数据状态变化。

---

## 十二、事件绑定指令

### v-on

```html
<button v-on:click="addCount">点击 +1</button>
```

简写形式：

```html
<button @click="addCount">点击 +1</button>
```

```js
methods: {
   addCount() {
      this.count += 1
   }
}
```

### 事件对象和传参

```html
<button @click="handleClick(10, $event)">提交</button>
```

```js
methods: {
   handleClick(step, event) {
      console.log(step)
      console.log(event.target)
   }
}
```

### 常见事件修饰符

| 修饰符     | 作用                   |
| ---------- | ---------------------- |
| `.prevent` | 阻止默认行为           |
| `.stop`    | 阻止冒泡               |
| `.once`    | 只触发一次             |
| `.capture` | 使用捕获阶段           |
| `.self`    | 只有事件源是自身时触发 |

```html
<a @click.prevent="go">跳转</a>
<div @click.stop="open"></div>
```

### 按键修饰符

```html
<input @keyup.enter="submit" />
```

常见写法有 `.enter`、`.esc` 等。

### 真实开发里怎么选事件修饰符

| 需求                   | 更常见写法 |
| ---------------------- | ---------- |
| 阻止默认行为           | `.prevent` |
| 阻止冒泡               | `.stop`    |
| 只触发一次             | `.once`    |
| 只处理当前元素自身点击 | `.self`    |

事件修饰符的价值在于把模板里的交互意图写得更清楚，而不是为了省几行 JS。

---

## 十三、双向绑定指令

### v-model

`v-model` 用于表单元素和数据之间的双向同步。

```html
<input v-model="username" />
<textarea v-model="desc"></textarea>
<input type="checkbox" v-model="agree" />
```

### v-model 修饰符

| 修饰符    | 作用                               |
| --------- | ---------------------------------- |
| `.trim`   | 去掉首尾空格                       |
| `.number` | 自动转成数值                       |
| `.lazy`   | 在 `change` 时同步，而不是 `input` |

```html
<input v-model.trim="keyword" /> <input v-model.number="age" />
```

### 一个边界提醒

`v-model` 适合表单交互，但它不是“所有数据同步问题”的通用解法。真正跨组件传值、共享状态，还是要回到 `props`、`$emit`、Vuex 这些机制。

---

## 十四、条件渲染指令

### v-if

```html
<p v-if="isLogin">欢迎回来</p>
```

`v-if` 控制的是“是否创建/销毁 DOM”。

### v-show

```html
<p v-show="isLogin">欢迎回来</p>
```

`v-show` 控制的是“是否显示”，本质是切换 `display: none`。

### v-if 和 v-show 的区别

| 指令     | 特点                   | 适用场景       |
| -------- | ---------------------- | -------------- |
| `v-if`   | 切换开销大，初始开销小 | 条件变化不频繁 |
| `v-show` | 初始开销大，切换开销小 | 频繁显示/隐藏  |

这里真正要记住的不是表面区别，而是：`v-if` 控制节点存不存在，`v-show` 控制节点显不显示。

### 真实开发里怎么快速判断

| 场景                 | 更推荐   |
| -------------------- | -------- |
| 很少切换的区域       | `v-if`   |
| 高频显示 / 隐藏      | `v-show` |
| 需要配合组件销毁重建 | `v-if`   |

### v-else 和 v-else-if

```html
<p v-if="score >= 90">优秀</p>
<p v-else-if="score >= 60">及格</p>
<p v-else>不及格</p>
```

`v-else`、`v-else-if` 必须紧跟在对应的 `v-if` 或 `v-else-if` 后面。

---

## 十五、列表渲染指令

### v-for 基本语法

```html
<ul>
  <li v-for="(item, index) in userList" :key="item.id">
    {{ index }} - {{ item.name }}
  </li>
</ul>
```

| 参数    | 含义                  |
| ------- | --------------------- |
| `item`  | 当前项                |
| `index` | 当前项索引            |
| `in`    | 固定写法，也可写 `of` |

### key 的作用

`key` 是虚拟 DOM diff 时的重要标识，应该尽量使用稳定且唯一的值，例如数据库 id。

不推荐默认把索引用作 `key`，尤其是在列表会插入、删除、重排时。

列表渲染最容易踩坑的地方，往往不是 `v-for` 语法本身，而是 `key` 不稳定导致状态错位。

### 一个实践提醒

只要列表里存在插入、删除、排序、筛选，就尽量不要把索引当 `key`。索引 `key` 看起来能跑，但很容易在交互一复杂后出现复用错位问题。

---

## 十六、过滤器

过滤器是 Vue2 中用于格式化文本显示的语法，常用于时间、金额、大小写转换等场景。

### 局部过滤器

```js
new Vue({
  el: "#app",
  data: {
    price: 99,
  },
  filters: {
    formatPrice(value) {
      return "￥" + value
    },
  },
})
```

```html
<p>{{ price | formatPrice }}</p>
```

### 全局过滤器

```js
Vue.filter("formatDate", function (value) {
  return value.slice(0, 10)
})
```

### 过滤器注意点

1. 过滤器主要用于文本格式化，不适合复杂业务逻辑。
2. 过滤器可以串联使用。
3. Vue3 已移除过滤器，新的项目更推荐用方法或计算属性处理格式化逻辑。

这也说明过滤器更适合按“Vue2 历史能力”去理解，而不是在新项目里继续重度依赖。

### 什么时候更适合不用过滤器

1. 格式化逻辑已经比较复杂。
2. 逻辑需要复用到 JS 代码、接口处理或多个组件之外。
3. 项目已经在向 Vue3 迁移。

---

## 十七、综合示例

```html
<div id="app">
  <h2>{{ title }}</h2>
  <input v-model.trim="keyword" @keyup.enter="search" />
  <button @click="toggle">切换列表</button>

  <ul v-if="visible">
    <li v-for="item in list" :key="item.id">{{ item.name | upper }}</li>
  </ul>
</div>

<script>
  new Vue({
    el: "#app",
    data: {
      title: "Vue2 常用指令",
      keyword: "",
      visible: true,
      list: [
        { id: 1, name: "vue" },
        { id: 2, name: "react" },
      ],
    },
    methods: {
      search() {
        console.log("搜索：" + this.keyword)
      },
      toggle() {
        this.visible = !this.visible
      },
    },
    filters: {
      upper(value) {
        return value.toUpperCase()
      },
    },
  })
</script>
```

---

## 十八、学习这篇时最该抓住的主线

```text
先理解数据如何驱动视图
  -> 再理解模板里怎么渲染内容、绑定属性和事件
  -> 再理解表单、条件、列表这些高频场景如何表达
```

按这条主线学，Vue2 就不会变成一堆零散指令的背诵。

---

## 十九、总结

1. Vue 的核心是数据驱动视图和双向数据绑定。
2. Vue2 通过 MVVM 思想把数据和视图连接起来。
3. 常用指令包括 `v-bind`、`v-on`、`v-model`、`v-if`、`v-show`、`v-for`。
4. 过滤器是 Vue2 特有的文本格式化工具，但在 Vue3 中已被移除。
5. 学 Vue2 时要优先掌握模板语法、事件处理和列表/条件渲染。
