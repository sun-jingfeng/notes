# Cross-Platform Frameworks

## I. Overview

**Cross-platform development** means writing one codebase and delivering it to several runtime targets — mini programs, H5, iOS, and Android — instead of maintaining a separate implementation per platform.

### 1.1 Target Matrix

| Target           | Runtime                                                        |
| ---------------- | -------------------------------------------------------------- |
| **Mini program** | The host app's own engine (WeChat, Alipay, ByteDance, Baidu, and others) |
| **H5**           | A mobile browser or an embedded WebView                        |
| **Native app**   | iOS and Android, installed from a store                        |
| **Desktop**      | Windows, macOS, Linux — supported by some frameworks only      |

### 1.2 Rendering Strategies

The single biggest difference between frameworks is what actually draws the pixels, and it determines performance, fidelity, and which platform features are reachable.

| Strategy              | How it renders                                                            | Examples                |
| --------------------- | ------------------------------------------------------------------------- | ----------------------- |
| **WebView**           | The UI is a web page inside a native container                            | Ionic, Capacitor, uni-app (App/H5 targets) |
| **Compiled to host**  | Source is transformed at build time into each platform's own component syntax | uni-app, Taro (mini-program targets) |
| **Native rendering**  | JavaScript describes the UI; the framework maps it onto real platform widgets | React Native            |
| **Self-drawn**        | The framework paints every pixel itself onto a canvas, bypassing platform widgets | Flutter             |

    Web technology ─────────────────────────────► Native fidelity
    WebView    Compiled to host    Native rendering    Self-drawn
      │              │                   │                 │
    lowest       depends on          real platform     fully custom,
    fidelity     host support          widgets        pixel-identical

***

## II. Framework Comparison

### 2.1 Overall

| Framework        | Language            | Rendering                        | Primary targets                       |
| ---------------- | ------------------- | -------------------------------- | ------------------------------------- |
| **uni-app**      | Vue                 | Compiled to host / WebView       | Mini programs, H5, iOS, Android       |
| **Taro**         | React or Vue        | Compiled to host / WebView       | Mini programs, H5, React Native       |
| **React Native** | React (JavaScript)  | Native widgets                   | iOS, Android                          |
| **Flutter**      | Dart                | Self-drawn                       | iOS, Android, web, desktop            |

### 2.2 Trade-offs

| Aspect                | uni-app / Taro                              | React Native                            | Flutter                                  |
| --------------------- | ------------------------------------------- | --------------------------------------- | ---------------------------------------- |
| **Learning curve**    | Low for a Vue or React developer            | Low for a React developer               | New language and widget model            |
| **Mini-program support** | First-class — the main reason to choose them | None                                  | None                                     |
| **UI performance**    | Bound by the host engine or WebView         | Close to native for standard interfaces | Consistently high; heavy animation is fine |
| **Platform look**     | Follows the host's components               | Genuinely native widgets                | Framework-drawn; identical across platforms, which cuts both ways |
| **Native extension**  | Plugin per platform                         | Native modules in Kotlin / Swift        | Platform channels in Kotlin / Swift      |
| **Bundle size**       | Smallest                                    | Moderate                                | Largest — ships its own engine           |
| **Hot reload**        | Supported                                   | Supported (Fast Refresh)                | Supported                                |

***

## III. Compiled Web-Technology Frameworks

### 3.1 uni-app

**uni-app** is DCloud's Vue-based framework that compiles a single project to every major mini-program platform, H5, and native apps.

| Trait                  | Description                                                          |
| ---------------------- | -------------------------------------------------------------------- |
| **Vue syntax**         | Single-file components with Vue 2 or Vue 3, so no new template language |
| **Broad target list**  | WeChat, Alipay, Baidu, ByteDance, QQ, and other mini programs, plus H5 and App |
| **Conditional compilation** | Platform-specific branches marked with comment directives       |
| **Ecosystem**          | uni-ui and other component libraries, plus a large plugin marketplace |

The App target historically renders through a WebView-plus-native hybrid runtime; the newer `uni-app x` line compiles UTS source to genuinely native views on iOS and Android at the cost of a narrower ecosystem.

### 3.2 Taro

**Taro** is JD.com's equivalent built around React, with Vue also supported. It covers the same mini-program platforms and H5, and additionally targets React Native.

**Choosing between them:** the decision is normally settled by the team's existing framework — Vue teams take uni-app, React teams take Taro. Both solve the same problem with comparable target coverage.

### 3.3 Conditional Compilation

Platform differences that cannot be abstracted away are marked with build-time directives, so each target ships only its own branch.

```vue
<template>
  <view class="page">
    <!-- #ifdef MP-WEIXIN -->
    <button open-type="getPhoneNumber">Continue with phone number</button>
    <!-- #endif -->

    <!-- #ifdef H5 -->
    <button @click="loginWithPassword">Sign in</button>
    <!-- #endif -->
  </view>
</template>

<script setup>
// #ifdef APP-PLUS
// Native-only capability; stripped from every other build
import { setupPushNotifications } from "@/utils/push";
setupPushNotifications();
// #endif

// #ifndef H5
// Everything except the H5 build
enableNativeStorage();
// #endif
</script>

<style>
/* #ifdef MP-WEIXIN */
.page {
  padding-top: 0;
}
/* #endif */
</style>
```

| Directive  | Meaning                                     |
| ---------- | ------------------------------------------- |
| `#ifdef`   | Include only for the listed platforms       |
| `#ifndef`  | Include for every platform except those listed |
| `#endif`   | Closes the block                            |

| Common condition | Target                        |
| ---------------- | ----------------------------- |
| `H5`             | Browser build                 |
| `APP-PLUS`       | Native app build              |
| `MP`             | Any mini program              |
| `MP-WEIXIN`      | WeChat mini program           |
| `MP-ALIPAY`      | Alipay mini program           |

> 💡 Conditional blocks are stripped at build time rather than evaluated at runtime, so a branch excluded from a build contributes nothing to its bundle. Heavy use still fragments the code — where three branches diverge completely, a platform-specific module behind one shared interface reads better than three inline blocks.

***

## IV. Native-Rendering Frameworks

### 4.1 React Native

**React Native** renders React components as real platform widgets: a `<View>` becomes a `UIView` on iOS and an Android `View`, so scrolling, text rendering, and accessibility behave natively.

| Concept              | Description                                                                 |
| -------------------- | --------------------------------------------------------------------------- |
| **JSI**              | The interface letting JavaScript hold direct references to native objects, replacing the older asynchronous bridge |
| **Fabric**           | The rendering system built on JSI, enabling synchronous layout and better list performance |
| **TurboModules**     | Lazily loaded native modules, so startup does not initialise every module   |
| **Hermes**           | The default JavaScript engine, optimised for mobile startup and memory      |

Expo is the managed toolchain most projects start from: it provides the build service, over-the-air updates, and a vetted set of native modules without requiring Xcode or Android Studio for routine work.

**Suits:** teams already fluent in React that need genuine app-store apps and a native feel, without adopting a new language.

### 4.2 Flutter

**Flutter** paints its own widgets onto a canvas rather than delegating to platform components, so a screen renders identically everywhere and animation is not constrained by the host's widget set.

| Concept              | Description                                                              |
| -------------------- | ------------------------------------------------------------------------ |
| **Dart**             | The language — ahead-of-time compiled for release builds, JIT in development for hot reload |
| **Widget tree**      | Everything is a widget, composed declaratively; layout and styling included |
| **Rendering engine** | Skia historically, Impeller on current releases                           |
| **Platform channels** | The bridge for reaching platform APIs that Flutter does not wrap         |

**Suits:** design-led products wanting one exact appearance across platforms, animation-heavy interfaces, and teams willing to invest in Dart.

**Costs:** self-drawn widgets do not automatically inherit platform conventions or updates, the runtime adds meaningfully to bundle size, and text input plus accessibility need explicit attention.

***

## V. Choosing a Framework

### 5.1 Decision Guide

| Requirement                                          | Recommendation                                        |
| ---------------------------------------------------- | ----------------------------------------------------- |
| **Mini programs are a required target**              | uni-app (Vue teams) or Taro (React teams) — nothing else covers them |
| **Content-driven screens inside an existing app**    | H5 in a WebView; a full framework is unnecessary       |
| **Store-distributed app, React team, native feel**   | React Native                                          |
| **Pixel-exact custom design, heavy animation**       | Flutter                                               |
| **Deep hardware use — camera pipeline, Bluetooth, background processing** | Native, or native modules behind a thin cross-platform shell |
| **One platform only, small surface**                 | Native — cross-platform overhead buys nothing          |

### 5.2 Recurring Costs

| Cost                        | Description                                                                         |
| --------------------------- | ----------------------------------------------------------------------------------- |
| **The last 10 percent**     | Core screens port easily; permissions, push notifications, deep links, and payment integrations still need per-platform work |
| **Debugging across layers** | A defect can sit in the page, the framework's compiler output, or the host engine    |
| **Dependency on the host**  | Mini-program APIs and review rules change on the platform's schedule, not the project's |
| **Upgrade friction**        | Major framework releases can require coordinated native-side changes                 |
| **Team knowledge**          | Someone still has to read Kotlin and Swift when a native module misbehaves           |

> **Note**: cross-platform reduces duplicated product work; it does not remove the need for platform knowledge. Budget for real-device testing on both platforms and for at least one person able to work in the native layer.
