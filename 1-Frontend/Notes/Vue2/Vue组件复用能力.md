# Vue组件复用能力

## 一、这篇的主线

这三个能力都服务于 Vue 组件的“灵活复用”：

| 能力           | 解决的问题                       |
| -------------- | -------------------------------- |
| **动态组件**   | 同一位置如何切换不同组件         |
| **插槽**       | 组件内部某些内容如何交给外部决定 |
| **自定义指令** | DOM 细节行为如何复用封装         |

---

## 二、动态组件

动态组件指的是根据条件切换不同组件进行渲染，而不是写死某一个组件。

Vue2 提供了内置组件 `<component>` 来完成动态渲染。

### 2.1 基本写法

```html
<template>
  <div>
    <button @click="currentComponent = 'TabHome'">首页</button>
    <button @click="currentComponent = 'TabUser'">用户页</button>

    <component :is="currentComponent"></component>
  </div>
</template>
```

`is` 的值可以是组件名，也可以是组件对象。

### 2.2 动态组件适合什么场景

1. tab 切换。
2. 步骤表单。
3. 同一区域根据状态切换不同视图。

### 2.3 `keep-alive`

默认情况下，动态组件切换时，旧组件会被销毁，新组件会重新创建，因此内部状态会丢失。

如果希望切换后仍然保留组件状态，可以使用 `<keep-alive>`。

```html
<keep-alive>
  <component :is="currentComponent"></component>
</keep-alive>
```

对应生命周期：

| 钩子          | 触发时机           |
| ------------- | ------------------ |
| `activated`   | 组件被激活时       |
| `deactivated` | 组件被缓存或切出时 |

### 2.4 `keep-alive` 的几个常见点

1. `include`：只缓存指定组件。
2. `exclude`：排除某些组件。
3. `max`：限制缓存数量。

### 2.5 一个判断标准

1. 如果切换后希望保留输入状态、滚动位置等，用 `keep-alive`。
2. 如果切换后希望每次重新初始化数据，就不要缓存。

---

## 三、插槽

插槽可以理解为“组件封装时预留给使用者填内容的位置”。

当组件内部有一部分结构不确定，希望由父组件决定时，就适合使用插槽。

### 3.1 默认插槽

子组件：

```html
<template>
  <div class="dialog">
    <h3>提示框</h3>
    <slot></slot>
  </div>
</template>
```

父组件：

```html
<MyDialog>
  <p>这是弹窗内容</p>
</MyDialog>
```

可以为插槽设置后备内容：

```html
<slot>这里是默认内容</slot>
```

### 3.2 具名插槽

当一个组件需要多个可插入区域时，可以给插槽取名字。

```html
<template>
  <div class="card">
    <header>
      <slot name="header"></slot>
    </header>
    <main>
      <slot></slot>
    </main>
    <footer>
      <slot name="footer"></slot>
    </footer>
  </div>
</template>
```

```html
<MyCard>
  <template #header>
    <h3>标题</h3>
  </template>

  <p>正文内容</p>

  <template #footer>
    <button>确定</button>
  </template>
</MyCard>
```

### 3.3 作用域插槽

有时子组件不仅想接收父组件传入的结构，还想把自己内部的数据暴露给父组件使用，这时可以使用作用域插槽。

子组件：

```html
<slot :user="userInfo" :index="1"></slot>
```

父组件：

```html
<MyList>
  <template #default="{ user, index }">
    <p>{{ user.name }} - {{ index }}</p>
  </template>
</MyList>
```

### 3.4 `props` 和插槽怎么选

| 需求                             | 更适合     |
| -------------------------------- | ---------- |
| 传普通数据                       | `props`    |
| 让调用方决定结构                 | 插槽       |
| 既要结构灵活又要用子组件内部数据 | 作用域插槽 |

---

## 四、自定义指令

Vue 内置了很多指令，例如 `v-model`、`v-if`、`v-for`。如果这些能力不够，也可以自己定义指令。

自定义指令本质上是对底层 DOM 行为的一层封装。

适合场景：

1. 自动聚焦。
2. 权限控制。
3. 拖拽、懒加载、复制文本等 DOM 细节封装。

### 4.1 私有自定义指令

```js
export default {
  directives: {
    focus: {
      inserted(el) {
        el.focus()
      },
    },
  },
}
```

使用时需要带 `v-` 前缀：

```html
<input v-focus />
```

### 4.2 通过 `binding` 获取参数

```html
<p v-color="activeColor">文字</p>
```

```js
directives: {
  color: {
    bind(el, binding) {
      el.style.color = binding.value
    },
    update(el, binding) {
      el.style.color = binding.value
    },
  },
}
```

### 4.3 常见钩子

| 钩子               | 说明                       |
| ------------------ | -------------------------- |
| `bind`             | 指令第一次绑定到元素时触发 |
| `inserted`         | 元素插入到页面后触发       |
| `update`           | 组件更新时触发             |
| `componentUpdated` | 组件及其子组件更新后触发   |
| `unbind`           | 指令与元素解绑时触发       |

### 4.4 参数、修饰符、值

自定义指令除了 `binding.value`，还常会用到：

1. `binding.arg`：指令参数。
2. `binding.modifiers`：修饰符对象。

也就是说，指令不只是“有没有值”，还可以承载更细的配置。

### 4.5 全局自定义指令

如果某个指令希望在很多组件中复用，可以在入口文件中全局注册：

```js
Vue.directive("focus", {
  inserted(el) {
    el.focus()
  },
})
```

全局指令适合通用能力，私有指令适合局部业务场景。

### 4.6 一个边界提醒

如果需求本质是“结构和逻辑复用”，通常优先考虑组件；如果需求本质是“直接操作 DOM 行为”，自定义指令才更合适。

---

## 五、小结

1. 动态组件解决的是“同一位置切换不同组件”的问题，`keep-alive` 决定是否保留状态。
2. 插槽解决的是“组件结构的开放性”，作用域插槽进一步解决“子组件把数据交给父组件渲染”。
3. 自定义指令适合封装 DOM 细节，不适合滥用成组件替代品。
4. 这三类能力一起看，本质都是在提高组件复用性与灵活性。
