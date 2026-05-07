# uni-app

## 一、概述

### 1.1 什么是 uni-app

**uni-app** 是由 DCloud 推出的基于 Vue.js 的跨端开发框架，使用一套代码可同时编译发布到微信/支付宝/百度等各平台小程序、H5、以及 Android/iOS App。

**核心思想：** 一次开发，多端运行。

| 特点               | 说明                                                 |
| ------------------ | ---------------------------------------------------- |
| **跨端能力**       | 支持微信、支付宝、百度、字节跳动等主流小程序及 H5/App |
| **Vue 语法**       | 完全基于 Vue2/Vue3 语法，无额外学习成本              |
| **条件编译**       | 通过特殊注释针对不同平台写差异化逻辑                 |
| **丰富生态**       | 支持 uni-ui、uView 等组件库，插件市场资源丰富        |

***

### 1.2 与原生小程序对比

| 对比项         | 原生微信小程序          | uni-app                        |
| -------------- | ----------------------- | ------------------------------ |
| **语法**       | WXML / WXSS / JS        | Vue SFC（.vue 文件）           |
| **跨端支持**   | 仅微信                  | 微信、支付宝、H5、App 等       |
| **组件体系**   | 小程序原生组件          | Vue 组件 + 内置跨端组件        |
| **工程化**     | 基础，依赖微信开发者工具 | HBuilderX / CLI，支持 npm      |
| **学习成本**   | 需单独学习 WXML 语法    | 会 Vue 即可快速上手            |

***

## 二、项目结构

### 2.1 目录说明

```
my-project/
├── pages/              # 页面文件（每个目录为一个页面）
│   └── index/
│       └── index.vue
├── components/         # 公共组件
├── static/             # 静态资源（图片、字体等，不参与编译）
├── store/              # Vuex 状态管理（可选）
├── utils/              # 工具函数
├── App.vue             # 应用根组件（生命周期、全局样式）
├── main.js             # 入口文件
├── manifest.json       # 应用配置（AppID、权限、平台差异化配置）
└── pages.json          # 页面路由与窗口配置（核心配置文件）
```

> 💡 `static` 目录中的资源直接按原路径引用，`pages` 目录中的资源经过编译处理。

***

### 2.2 pages.json 核心配置

`pages.json` 是 uni-app 的路由与全局窗口配置文件，相当于微信小程序的 `app.json`。

```json
{
  "pages": [
    {
      "path": "pages/index/index",
      "style": {
        "navigationBarTitleText": "首页"
      }
    },
    {
      "path": "pages/detail/detail",
      "style": {
        "navigationBarTitleText": "详情"
      }
    }
  ],
  "globalStyle": {
    "navigationBarTextStyle": "black",
    "navigationBarTitleText": "uni-app",
    "navigationBarBackgroundColor": "#F8F8F8",
    "backgroundColor": "#F8F8F8"
  },
  "tabBar": {
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "首页",
        "iconPath": "static/tab-home.png",
        "selectedIconPath": "static/tab-home-active.png"
      },
      {
        "pagePath": "pages/profile/profile",
        "text": "我的",
        "iconPath": "static/tab-profile.png",
        "selectedIconPath": "static/tab-profile-active.png"
      }
    ]
  }
}
```

| 配置项            | 说明                                 |
| ----------------- | ------------------------------------ |
| **pages**         | 页面路径列表，第一项为启动页         |
| **globalStyle**   | 全局窗口表现（导航栏颜色、标题等）   |
| **tabBar**        | 底部 Tab 栏配置，最少 2 项，最多 5 项 |
| **style**（页面级）| 覆盖 globalStyle，仅对当前页生效   |

***

## 三、页面开发

### 3.1 页面结构

uni-app 页面是标准 Vue SFC 文件，模板标签使用小程序内置组件（`view`、`text`、`image` 等）而非 HTML 标签。

```vue
<template>
  <view class="container">
    <image src="/static/logo.png" mode="aspectFit" />
    <text class="title">{{ title }}</text>
    <button @click="handleClick">点击</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      title: "Hello uni-app",
    };
  },
  methods: {
    handleClick() {
      uni.showToast({ title: "点击成功", icon: "success" });
    },
  },
};
</script>

<style scoped>
.container {
  padding: 20rpx;
}
.title {
  font-size: 36rpx;
  color: #333;
}
</style>
```

> 💡 uni-app 使用 `rpx` 作为响应式单位，750rpx 等于屏幕宽度，与微信小程序一致。

***

### 3.2 常用内置组件

| 组件        | 说明                              | 对应 HTML 标签 |
| ----------- | --------------------------------- | -------------- |
| `view`      | 块级容器                          | `div`          |
| `text`      | 文本（仅文本节点支持选中/复制）   | `span`         |
| `image`     | 图片，支持懒加载                  | `img`          |
| `button`    | 按钮，内置开放能力（授权、分享）  | `button`       |
| `input`     | 单行输入框                        | `input`        |
| `textarea`  | 多行输入框                        | `textarea`     |
| `scroll-view` | 可滚动区域，支持横向/纵向      | —              |
| `swiper`    | 滑块视图容器（轮播图）            | —              |
| `navigator` | 页面跳转链接                      | `a`            |

***

### 3.3 页面生命周期

uni-app 页面同时支持 Vue 生命周期和小程序页面生命周期，两者可共存。

| 生命周期           | 触发时机                                   |
| ------------------ | ------------------------------------------ |
| `onLoad(options)`  | 页面加载，`options` 为路由参数             |
| `onShow`           | 页面显示（每次进入都触发，含返回）         |
| `onReady`          | 页面初次渲染完成                           |
| `onHide`           | 页面隐藏（跳转到其他页面）                 |
| `onUnload`         | 页面卸载（`redirectTo`、`navigateBack`）   |
| `onPullDownRefresh`| 用户下拉刷新（需在 pages.json 中开启）     |
| `onReachBottom`    | 页面滚动到底部                             |
| `onShareAppMessage`| 用户点击右上角转发                         |

```javascript
export default {
  onLoad(options) {
    // options 包含页面跳转时传递的参数
    const id = options.id;
    this.fetchDetail(id);
  },
  onPullDownRefresh() {
    this.loadData().then(() => {
      uni.stopPullDownRefresh(); // 停止下拉动画
    });
  },
  onReachBottom() {
    this.loadMore();
  },
};
```

***

## 四、路由与页面跳转

### 4.1 跳转 API

uni-app 使用 `uni.*` API 进行页面跳转，共 5 种方式。

| API                      | 说明                                   |
| ------------------------ | -------------------------------------- |
| `uni.navigateTo`         | 保留当前页，跳转到新页（可返回）       |
| `uni.redirectTo`         | 关闭当前页，跳转（不可返回）           |
| `uni.reLaunch`           | 关闭所有页，跳转到目标页               |
| `uni.switchTab`          | 跳转到 tabBar 页面（仅用于 Tab 页）    |
| `uni.navigateBack`       | 返回上一页或多级页                     |

```javascript
// 跳转并传参
uni.navigateTo({
  url: "/pages/detail/detail?id=123&type=goods",
});

// 接收参数（在目标页 onLoad 中）
onLoad(options) {
  console.log(options.id);   // '123'
  console.log(options.type); // 'goods'
}

// 返回上一页
uni.navigateBack({ delta: 1 });
```

***

### 4.2 页面间通信

**方式一：URL 参数（单向，父传子）**

跳转时拼接到 URL，目标页通过 `onLoad(options)` 接收，仅支持字符串类型。

**方式二：全局事件总线**

```javascript
// 发送方（页面 A）
uni.$emit("refresh", { id: 1 });

// 接收方（页面 B）
uni.$on("refresh", (data) => {
  console.log(data.id);
});

// 页面卸载时移除监听，避免内存泄漏
onUnload() {
  uni.$off("refresh");
}
```

**方式三：Vuex / 全局状态**

适合多页面共享的状态（用户信息、购物车数量等），配置方式与 Vue 项目完全一致。

***

## 五、网络请求

### 5.1 uni.request

`uni.request` 是 uni-app 封装的网络请求 API，跨端统一。

```javascript
uni.request({
  url: "https://api.example.com/data",
  method: "GET",
  data: { page: 1, size: 10 },
  header: {
    Authorization: "Bearer token",
  },
  success(res) {
    console.log(res.data);
  },
  fail(err) {
    console.error(err);
  },
});
```

***

### 5.2 封装请求工具

实际项目中通常封装成 Promise 形式，统一处理 baseURL、token、错误。

```javascript
// utils/request.js
const BASE_URL = "https://api.example.com";

export function request(options) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + options.url,
      method: options.method || "GET",
      data: options.data || {},
      header: {
        "Content-Type": "application/json",
        Authorization: uni.getStorageSync("token") || "",
        ...options.header,
      },
      success(res) {
        if (res.data.code === 200) {
          resolve(res.data);
        } else {
          uni.showToast({ title: res.data.message || "请求失败", icon: "none" });
          reject(res.data);
        }
      },
      fail(err) {
        uni.showToast({ title: "网络异常，请稍后重试", icon: "none" });
        reject(err);
      },
    });
  });
}
```

```javascript
// 使用
import { request } from "@/utils/request";

async fetchList() {
  const res = await request({ url: "/api/list", data: { page: 1 } });
  this.list = res.data;
}
```

***

## 六、条件编译

### 6.1 语法

条件编译通过特殊注释实现，仅在指定平台编译对应代码，其他平台会忽略。

```javascript
// #ifdef MP-WEIXIN
// 仅在微信小程序中生效
wx.login({ success() {} });
// #endif

// #ifdef H5
// 仅在 H5 中生效
window.location.href = "/login";
// #endif

// #ifndef APP-PLUS
// 除 App 外的所有平台生效
console.log("非 App 平台");
// #endif
```

模板中的条件编译：

```html
<template>
  <view>
    <!-- #ifdef MP-WEIXIN -->
    <button open-type="getUserInfo">微信授权</button>
    <!-- #endif -->

    <!-- #ifdef H5 -->
    <button @click="h5Login">H5 登录</button>
    <!-- #endif -->
  </view>
</template>
```

样式中的条件编译：

```css
/* #ifdef MP-WEIXIN */
.nav-bar {
  padding-top: 0;
}
/* #endif */
```

***

### 6.2 常用平台标识

| 标识           | 说明                    |
| -------------- | ----------------------- |
| `MP-WEIXIN`    | 微信小程序              |
| `MP-ALIPAY`    | 支付宝小程序            |
| `MP-BAIDU`     | 百度小程序              |
| `H5`           | H5 / Web               |
| `APP-PLUS`     | App（iOS + Android）    |
| `APP-PLUS-NVUE`| App nvue 页面           |
| `MP`           | 所有小程序平台          |

***

## 七、常用 API

### 7.1 存储

```javascript
// 同步存储（常用）
uni.setStorageSync("key", value);
const value = uni.getStorageSync("key");
uni.removeStorageSync("key");

// 清空全部缓存
uni.clearStorageSync();
```

***

### 7.2 交互反馈

```javascript
// 提示框
uni.showToast({ title: "操作成功", icon: "success", duration: 2000 });
uni.showToast({ title: "错误信息", icon: "none" });

// 加载框
uni.showLoading({ title: "加载中..." });
uni.hideLoading();

// 模态弹窗
uni.showModal({
  title: "提示",
  content: "确认删除吗？",
  success(res) {
    if (res.confirm) {
      // 用户点击确定
    }
  },
});

// 操作菜单
uni.showActionSheet({
  itemList: ["选项一", "选项二", "选项三"],
  success(res) {
    console.log("选中第", res.tapIndex, "项");
  },
});
```

***

### 7.3 媒体与文件

```javascript
// 选择图片
uni.chooseImage({
  count: 3,             // 最多选 3 张
  sizeType: ["compressed"],
  sourceType: ["album", "camera"],
  success(res) {
    const paths = res.tempFilePaths; // 临时文件路径数组
  },
});

// 上传文件
uni.uploadFile({
  url: "https://api.example.com/upload",
  filePath: tempFilePath,
  name: "file",
  success(res) {
    const data = JSON.parse(res.data);
  },
});

// 预览图片
uni.previewImage({
  urls: ["https://example.com/1.jpg", "https://example.com/2.jpg"],
  current: 0,
});
```

***

### 7.4 位置

```javascript
uni.getLocation({
  type: "wgs84", // wgs84（标准）/ gcj02（国测局）
  success(res) {
    const { latitude, longitude } = res;
  },
});
```

***

## 八、自定义组件

### 8.1 创建与使用

uni-app 组件与 Vue 组件写法完全一致，放在 `components/` 目录下，满足 `components/<组件名>/<组件名>.vue` 的目录结构后，可以**免注册直接使用**（easycom 规范）。

```
components/
└── my-card/
    └── my-card.vue
```

```vue
<!-- components/my-card/my-card.vue -->
<template>
  <view class="card">
    <text class="card-title">{{ title }}</text>
    <slot />
  </view>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
  },
};
</script>
```

```vue
<!-- 页面中直接使用，无需 import 和 components 注册 -->
<template>
  <my-card title="卡片标题">
    <text>卡片内容</text>
  </my-card>
</template>
```

***

### 8.2 组件通信

与 Vue 组件通信方式相同：

| 场景         | 方式                           |
| ------------ | ------------------------------ |
| 父传子       | `props`                        |
| 子传父       | `$emit` 自定义事件             |
| 跨层级       | `provide / inject`（Vue2/3 均支持） |
| 全局共享状态 | Vuex / `uni.$emit` 事件总线    |

***

## 九、样式说明

### 9.1 尺寸单位

| 单位  | 说明                                          |
| ----- | --------------------------------------------- |
| `rpx` | 响应式像素，750rpx = 屏幕宽度（推荐使用）     |
| `px`  | 固定像素，不随屏幕缩放                        |
| `%`   | 相对于父元素百分比                            |
| `vh/vw` | 相对于视口高/宽，H5 支持，小程序部分支持   |

***

### 9.2 全局样式与局部样式

- `App.vue` 中的 `<style>` 为全局样式（不加 `scoped`）
- 页面和组件中加 `scoped` 限制样式作用域
- 小程序不支持部分 CSS 选择器（如 `*`、标签选择器在部分场景受限），推荐使用类选择器

```vue
<!-- App.vue：全局公共样式 -->
<style>
page {
  background-color: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
}
</style>
```

***

## 十、发布与运行

### 10.1 运行方式

**HBuilderX（推荐）**：直接点击「运行」选择目标平台，工具链内置，配置最少。

**CLI 方式**：

```bash
# 安装脚手架
npm install -g @vue/cli
vue create -p dcloudio/uni-preset-vue my-project

# 运行到微信小程序
npm run dev:mp-weixin

# 运行到 H5
npm run dev:h5

# 构建生产包
npm run build:mp-weixin
npm run build:h5
```

***

### 10.2 发布流程（微信小程序）

```
① npm run build:mp-weixin
        ↓
② 用微信开发者工具打开 dist/build/mp-weixin 目录
        ↓
③ 点击「上传」，填写版本号和备注
        ↓
④ 在微信公众平台后台提交审核
        ↓
⑤ 审核通过后发布上线
```

> **注意**：发布前确认 `manifest.json` 中已填写正确的微信小程序 AppID。
