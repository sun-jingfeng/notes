# uni-app

## I. Overview

### 1.1 What uni-app Is

**uni-app** is DCloud's Vue-based cross-platform framework: one codebase compiles and publishes to WeChat, Alipay, Baidu, and other mini-program platforms, to H5, and to Android and iOS apps.

**Core idea:** develop once, run on every target.

| Trait                       | Description                                                                 |
| --------------------------- | --------------------------------------------------------------------------- |
| **Cross-platform reach**    | Mainstream mini programs (WeChat, Alipay, Baidu, ByteDance) plus H5 and App  |
| **Vue syntax**              | Built on Vue 2 / Vue 3 syntax, so no additional template language to learn   |
| **Conditional compilation** | Platform-specific logic marked with comment directives                       |
| **Ecosystem**               | Component libraries such as uni-ui and uView, plus a large plugin marketplace |

### 1.2 Compared With Native Mini Programs

| Aspect                | Native WeChat mini program        | uni-app                                |
| --------------------- | --------------------------------- | -------------------------------------- |
| **Syntax**            | WXML / WXSS / JS                  | Vue single-file components (`.vue`)    |
| **Platform coverage** | WeChat only                       | WeChat, Alipay, H5, App, and others    |
| **Component model**   | Mini-program native components    | Vue components plus built-in cross-platform components |
| **Tooling**           | Basic; tied to WeChat DevTools    | HBuilderX or CLI, with npm support     |
| **Learning curve**    | WXML syntax must be learned separately | Vue knowledge transfers directly  |

***

## II. Project Structure

### 2.1 Directory Layout

```
my-project/
├── pages/              # Page files (one directory per page)
│   └── index/
│       └── index.vue
├── components/         # Shared components
├── static/             # Static assets (images, fonts) — not processed by the build
├── store/              # State management (optional)
├── utils/              # Utility functions
├── App.vue             # Root component (app lifecycle, global styles)
├── main.js             # Entry file
├── manifest.json       # App configuration (AppID, permissions, per-platform settings)
└── pages.json          # Route and window configuration (the central config file)
```

> 💡 Assets in `static` are referenced by their original path and copied through untouched; assets elsewhere pass through the build pipeline and may be inlined or renamed.

### 2.2 pages.json

`pages.json` holds the route table and global window configuration — the uni-app equivalent of a mini program's `app.json`.

```json
{
  "pages": [
    {
      "path": "pages/index/index",
      "style": {
        "navigationBarTitleText": "Home"
      }
    },
    {
      "path": "pages/detail/detail",
      "style": {
        "navigationBarTitleText": "Details"
      }
    }
  ],
  "globalStyle": {
    "navigationBarTextStyle": "black",
    "navigationBarTitleText": "Demo App",
    "navigationBarBackgroundColor": "#F8F8F8",
    "backgroundColor": "#F8F8F8"
  },
  "tabBar": {
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "Home",
        "iconPath": "static/tab-home.png",
        "selectedIconPath": "static/tab-home-active.png"
      },
      {
        "pagePath": "pages/profile/profile",
        "text": "Profile",
        "iconPath": "static/tab-profile.png",
        "selectedIconPath": "static/tab-profile-active.png"
      }
    ]
  }
}
```

| Option                | Description                                                       |
| --------------------- | ----------------------------------------------------------------- |
| **`pages`**           | Route list; the first entry is the launch page                    |
| **`globalStyle`**     | Global window appearance — navigation bar colour, title, background |
| **`tabBar`**          | Bottom tab bar; minimum 2 items, maximum 5                        |
| **`style`** (page-level) | Overrides `globalStyle` for that page only                     |

***

## III. Page Development

### 3.1 Page Structure

A uni-app page is a standard Vue single-file component whose template uses mini-program built-in components (`view`, `text`, `image`) rather than HTML tags.

```vue
<template>
  <view class="container">
    <image src="/static/logo.png" mode="aspectFit" />
    <text class="title">{{ title }}</text>
    <button @click="handleClick">Confirm</button>
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
      uni.showToast({ title: "Saved", icon: "success" });
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

> 💡 `rpx` is the responsive unit: 750rpx always equals the screen width, matching WeChat mini-program behaviour.

### 3.2 Built-in Components

| Component     | Description                                          | HTML equivalent |
| ------------- | ---------------------------------------------------- | --------------- |
| `view`        | Block-level container                                | `div`           |
| `text`        | Text; only text nodes support selection and copying  | `span`          |
| `image`       | Image, with lazy-loading support                     | `img`           |
| `button`      | Button, with built-in open capabilities (authorisation, sharing) | `button` |
| `input`       | Single-line input                                    | `input`         |
| `textarea`    | Multi-line input                                     | `textarea`      |
| `scroll-view` | Scrollable region, horizontal or vertical            | —               |
| `swiper`      | Sliding view container (carousels)                   | —               |
| `navigator`   | Navigation link                                      | `a`             |

### 3.3 Page Lifecycle

A page supports both the Vue lifecycle and the mini-program page lifecycle, and the two coexist in the same component.

**Vue lifecycle:**

| Hook                              | Fires when                                                    |
| --------------------------------- | ------------------------------------------------------------- |
| `beforeCreate`                    | The instance is initialising; data and events are not yet set  |
| `created`                         | The instance exists; `data` and `methods` are accessible       |
| `mounted`                         | The component is mounted and nodes can be queried              |
| `beforeDestroy` / `beforeUnmount` | Before teardown — the place to clear timers and subscriptions  |
| `destroyed` / `unmounted`         | The instance has been torn down                                |

> **Note**: `beforeDestroy` and `destroyed` are the Vue 2 names; Vue 3 renames them to `beforeUnmount` and `unmounted`. Both are accepted in Vue 3 for compatibility, but new code should use the Vue 3 names.

**Mini-program page lifecycle:**

| Hook                | Fires when                                                          |
| ------------------- | ------------------------------------------------------------------- |
| `onLoad(options)`   | The page loads; `options` carries the route parameters — once only   |
| `onShow`            | The page becomes visible, including on return from another page      |
| `onReady`           | The first render completes — once only                               |
| `onHide`            | The page is hidden by navigation to another page                     |
| `onUnload`          | The page is destroyed (`redirectTo`, `navigateBack`)                 |
| `onPullDownRefresh` | Pull-to-refresh, once enabled in `pages.json`                        |
| `onReachBottom`     | The page scrolls to the bottom                                       |
| `onShareAppMessage` | The user taps forward in the top-right menu                          |

**Execution order:**

`beforeCreate` → `created` → `onLoad` → `onShow` → `mounted` → `onReady`

| Requirement                              | Hook to use                       |
| ---------------------------------------- | --------------------------------- |
| Read route parameters, fetch initial data | `onLoad`                          |
| Refresh data on every visit               | `onShow`                          |
| Clear timers, remove listeners            | `onUnload` or `beforeUnmount`     |
| Pull to refresh                           | `onPullDownRefresh`               |
| Load more on scroll                       | `onReachBottom`                   |
| Logic inside a plain component (not a page) | Vue lifecycle hooks             |

```javascript
export default {
  onLoad(options) {
    // Route parameters are available here; created runs too early to read them
    this.fetchDetail(options.id);
  },
  onShow() {
    // Runs on every entry — suited to refreshing a list
    this.refreshCount();
  },
  onPullDownRefresh() {
    this.loadData().then(() => {
      uni.stopPullDownRefresh();    // Stop the pull-down animation
    });
  },
  onReachBottom() {
    this.loadMore();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
```

***

## IV. Routing and Navigation

### 4.1 Navigation APIs

Navigation goes through `uni.*` APIs, in five forms.

| API                | Description                                                |
| ------------------ | ---------------------------------------------------------- |
| `uni.navigateTo`   | Keeps the current page and opens a new one; back works      |
| `uni.redirectTo`   | Closes the current page and opens a new one; no way back    |
| `uni.reLaunch`     | Closes every page and opens the target                      |
| `uni.switchTab`    | Switches to a tabBar page — valid only for tab pages        |
| `uni.navigateBack` | Returns one or more levels                                  |

```javascript
// Navigate with parameters
uni.navigateTo({
  url: "/pages/detail/detail?id=123&type=item",
});

// Receive them in the target page
onLoad(options) {
  console.log(options.id);     // '123'
  console.log(options.type);   // 'item'
}

// Return to the previous page
uni.navigateBack({ delta: 1 });
```

> **Note**: the page stack holds a limited number of levels (10 on most platforms), so a chain of `navigateTo` calls eventually fails silently. Use `redirectTo` for steps in a flow that should not be revisited.

### 4.2 Communication Between Pages

**URL parameters:**

Values are appended to the navigation URL and read from `onLoad(options)`. Every value arrives as a string, so an object must be serialised with `JSON.stringify` before navigation and parsed on receipt. URL length limits make this unsuitable for large payloads.

***

**Global event bus:**

```javascript
// Sender
uni.$emit("refresh", { id: 1 });

// Receiver
uni.$on("refresh", (data) => {
  console.log(data.id);
});

// Remove the listener on unload, otherwise it leaks and fires repeatedly
onUnload() {
  uni.$off("refresh");
}
```

***

**Shared store:**

State needed across several pages — signed-in user, cart count, app settings — belongs in a store. Configuration matches a plain Vue project: Vuex for Vue 2 projects, Pinia for Vue 3, which is the current recommendation.

***

## V. Network Requests

### 5.1 uni.request

`uni.request` is the unified cross-platform request API. Its native form is callback-based.

```javascript
uni.request({
  url: "https://api.example.com/data",
  method: "GET",
  data: { page: 1, size: 10 },
  header: {
    Authorization: "Bearer <token>",
  },
  success(res) {
    // res.statusCode is the HTTP status; res.data is the parsed body
    console.log(res.data);
  },
  fail(err) {
    // Network-layer failures only — no connection, timeout, DNS failure
    console.error(err);
  },
});
```

> **Note**: `fail` fires only when the request never completes. HTTP 4xx and 5xx responses still reach `success`, so `res.statusCode` or the business `code` must be checked there.

### 5.2 Wrapping the Request Layer

A promise wrapper centralises the base URL, the auth header, and error handling.

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
        // Business-level success, not just HTTP success
        if (res.data.code === 200) {
          resolve(res.data);
        } else {
          uni.showToast({ title: res.data.message || "Request failed", icon: "none" });
          reject(res.data);
        }
      },
      fail(err) {
        uni.showToast({ title: "Network error, please retry", icon: "none" });
        reject(err);
      },
    });
  });
}
```

```javascript
import { request } from "@/utils/request";

async fetchList() {
  const res = await request({ url: "/api/list", data: { page: 1 } });
  this.list = res.data;
}
```

***

## VI. Conditional Compilation

### 6.1 Syntax

Conditional compilation is expressed as comment directives. Code inside a block is compiled only for the listed platforms and is stripped from every other build.

```javascript
// #ifdef MP-WEIXIN
// WeChat mini program only
wx.login({ success() {} });
// #endif

// #ifdef H5
// Browser only
window.location.href = "/login";
// #endif

// #ifndef APP-PLUS
// Every platform except the native app
console.log("Not running as a native app");
// #endif
```

Templates:

```html
<template>
  <view>
    <!-- #ifdef MP-WEIXIN -->
    <button open-type="getPhoneNumber">Continue with phone number</button>
    <!-- #endif -->

    <!-- #ifdef H5 -->
    <button @click="h5Login">Sign in</button>
    <!-- #endif -->
  </view>
</template>
```

Styles:

```css
/* #ifdef MP-WEIXIN */
.nav-bar {
  padding-top: 0;
}
/* #endif */
```

### 6.2 Platform Identifiers

| Identifier       | Platform                  |
| ---------------- | ------------------------- |
| `MP-WEIXIN`      | WeChat mini program       |
| `MP-ALIPAY`      | Alipay mini program       |
| `MP-BAIDU`       | Baidu mini program        |
| `H5`             | H5 / web                  |
| `APP-PLUS`       | Native app (iOS, Android) |
| `APP-PLUS-NVUE`  | nvue pages within the app |
| `MP`             | Every mini-program platform |

***

## VII. Common APIs

### 7.1 Storage

```javascript
// Synchronous form — the common choice
uni.setStorageSync("key", value);
const value = uni.getStorageSync("key");
uni.removeStorageSync("key");

// Clear everything
uni.clearStorageSync();
```

> **Note**: mini-program storage is capped per origin (10 MB on WeChat) and is cleared when the user clears the mini program's data, so it suits caching and tokens rather than durable records.

### 7.2 Interaction Feedback

```javascript
// Toast
uni.showToast({ title: "Saved", icon: "success", duration: 2000 });
uni.showToast({ title: "Something went wrong", icon: "none" });

// Loading indicator — every showLoading needs a matching hideLoading
uni.showLoading({ title: "Loading..." });
uni.hideLoading();

// Modal dialog
uni.showModal({
  title: "Confirm",
  content: "Delete this item?",
  success(res) {
    if (res.confirm) {
      // Confirmed
    }
  },
});

// Action sheet
uni.showActionSheet({
  itemList: ["Option one", "Option two", "Option three"],
  success(res) {
    console.log("Selected index", res.tapIndex);
  },
});
```

> 💡 `showToast` with the default `icon: "success"` truncates titles beyond a few characters. Longer messages need `icon: "none"`.

### 7.3 Media and Files

```javascript
// Choose images
uni.chooseImage({
  count: 3,                          // Maximum selection
  sizeType: ["compressed"],
  sourceType: ["album", "camera"],
  success(res) {
    const paths = res.tempFilePaths;    // Temporary paths, valid for this session only
  },
});

// Upload
uni.uploadFile({
  url: "https://api.example.com/upload",
  filePath: tempFilePath,
  name: "file",
  success(res) {
    // res.data is a raw string, not a parsed object
    const data = JSON.parse(res.data);
  },
});

// Preview full-screen
uni.previewImage({
  urls: ["https://example.com/1.jpg", "https://example.com/2.jpg"],
  current: 0,
});
```

> 💡 WeChat now steers new code towards `uni.chooseMedia`, which handles images and video in one call and exposes file size. `uni.chooseImage` remains the portable choice across platforms.

### 7.4 Location

```javascript
uni.getLocation({
  type: "wgs84",    // wgs84 (GPS standard) / gcj02 (required by Chinese map services)
  success(res) {
    const { latitude, longitude } = res;
  },
});
```

> **Note**: location APIs require the permission to be declared in `manifest.json` and, on WeChat, an approved purpose statement in the mini-program console. An undeclared call fails at runtime rather than prompting the user.

***

## VIII. Custom Components

### 8.1 Creating and Using Components

Components are written exactly like Vue components. A component placed under `components/` following the `components/<name>/<name>.vue` layout is available **without registration** — the easycom convention.

```
components/
└── demo-card/
    └── demo-card.vue
```

```vue
<!-- components/demo-card/demo-card.vue -->
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
<!-- Used directly — no import, no components entry -->
<template>
  <demo-card title="Card title">
    <text>Card content</text>
  </demo-card>
</template>
```

### 8.2 Component Communication

| Scenario                 | Mechanism                                                        |
| ------------------------ | ---------------------------------------------------------------- |
| **Parent to child**      | `props`                                                           |
| **Child to parent**      | `$emit` with a custom event                                       |
| **Across several levels** | `provide` / `inject` — one-way injection from ancestor to descendant, supported in both Vue 2 and Vue 3 |
| **Application-wide state** | A store (Pinia or Vuex), or the `uni.$emit` event bus           |

***

## IX. Styling

### 9.1 Size Units

| Unit    | Description                                                        |
| ------- | ------------------------------------------------------------------ |
| `rpx`   | Responsive pixel; 750rpx equals the screen width (**recommended**)  |
| `px`    | Fixed pixel; does not scale with screen width                       |
| `%`     | Relative to the parent element                                      |
| `vh/vw` | Relative to the viewport; full support on H5, partial on mini programs |

### 9.2 Global and Scoped Styles

- A `<style>` block in `App.vue` without `scoped` applies globally
- `scoped` on a page or component confines its rules to that component
- Mini programs restrict some selectors — the universal selector and tag selectors behave inconsistently, so class selectors are the reliable choice

```vue
<!-- App.vue: global styles -->
<style>
page {
  background-color: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
}
</style>
```

> 💡 `page` is the mini-program equivalent of `body`, and is where a global background colour belongs. Styling `body` has no effect outside H5.

***

## X. Running and Publishing

### 10.1 Running the Project

**HBuilderX:** press Run and pick a target platform. The toolchain is bundled, so this path needs the least configuration.

**CLI (Vue 3 + Vite):**

```bash
# Scaffold from the official Vite preset
npx degit dcloudio/uni-preset-vue#vite my-project
cd my-project
npm install

# Development
npm run dev:mp-weixin      # WeChat mini program
npm run dev:h5             # H5

# Production builds
npm run build:mp-weixin
npm run build:h5
```

A mini-program build has no dev server: `dev:mp-weixin` writes an unminified bundle to `dist/dev/mp-weixin` and rebuilds on change, which is then loaded into the platform's own DevTools.

### 10.2 Publishing a WeChat Mini Program

    ① npm run build:mp-weixin
            ↓
    ② Open dist/build/mp-weixin in WeChat DevTools
            ↓
    ③ Click Upload, entering a version number and release notes
            ↓
    ④ Submit for review in the WeChat MP console
            ↓
    ⑤ Release once the review passes

> **Note**: confirm the correct AppID is set in `manifest.json` before building — an uploaded package is bound to the AppID compiled into it, and the request domains must already be allow-listed in the console or network calls fail in the production build.
