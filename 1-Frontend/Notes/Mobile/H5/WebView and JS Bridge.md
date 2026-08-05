# WebView and JS Bridge

## I. Overview

### 1.1 What a WebView Is

A **WebView** is a browser engine embedded in a native application as an ordinary UI component. The page it loads is regular HTML, CSS, and JavaScript, but it runs inside the host app rather than in a standalone browser.

| Platform    | Component                              |
| ----------- | -------------------------------------- |
| **Android** | `WebView` (Chromium-based)             |
| **iOS**     | `WKWebView` (WebKit)                   |
| **Desktop** | Electron `BrowserWindow`, Tauri WebView |

**Hybrid app** describes the resulting architecture: a native shell providing navigation, device access, and lifecycle, with some or all screens rendered as H5 pages.

### 1.2 H5 vs Native Screens

| Aspect               | H5 screen                                      | Native screen                              |
| -------------------- | ---------------------------------------------- | ------------------------------------------ |
| **Release cycle**    | Deployed like a web page; no store review       | Requires an app release and store review    |
| **Cross-platform**   | One implementation for both platforms           | Implemented per platform                    |
| **Device access**    | Only through a bridge exposed by the shell      | Full SDK access                             |
| **Startup cost**     | WebView creation plus a network fetch           | Immediate                                   |
| **Interaction feel** | Depends on page performance; scrolling can jank | Matches platform conventions                |

**Typical split:** frequently changing, content-driven screens (campaigns, articles, help centres, order details) as H5; high-frequency, gesture-heavy, or hardware-dependent screens (camera, maps, payment entry, home feed) as native.

### 1.3 Detecting the Environment

A page shared to a browser and the same page inside the shell need different behaviour — the browser version cannot call the bridge and should not render native-only affordances.

```javascript
const ua = navigator.userAgent;

// Shells conventionally append a custom token to the user agent
const isInApp = /DemoApp/i.test(ua);
const isIOS = /iPhone|iPad|iPod/i.test(ua);
const isAndroid = /Android/i.test(ua);

// Common in-app browsers worth branching on
const isWeChat = /MicroMessenger/i.test(ua);
```

> 💡 User-agent sniffing is unreliable on its own, because the shell controls the string and may change it. A more robust check tests for the injected bridge object itself, falling back to the user agent only when the bridge is injected asynchronously.

***

## II. Native ↔ H5 Communication

### 2.1 Why a Bridge Is Needed

A WebView is sandboxed: the page cannot read contacts, open the camera, access the login session held by the shell, or close its own container. A **JS bridge** is the agreed protocol through which the page requests those capabilities and the shell answers.

    H5 page                          Native shell
       │                                  │
       │  1. call("getUserInfo", params)  │
       │ ───────────────────────────────► │
       │                                  │  2. Execute the native API
       │  3. Invoke the JS callback       │
       │ ◄─────────────────────────────── │
       │                                  │

### 2.2 Transport Mechanisms

**JS → native:**

| Mechanism               | Description                                                                    |
| ----------------------- | ------------------------------------------------------------------------------ |
| **Injected object**     | The shell injects a global object whose methods are native functions — the standard approach today |
| **URL scheme**          | The page navigates an invisible iframe to `demoapp://method?params=...`, which the shell intercepts; legacy, has URL length limits |
| **Prompt interception** | The shell overrides `prompt`/`alert` and parses the message; a workaround for old Android versions |

**Native → JS:**

| Platform    | Mechanism                                                          |
| ----------- | ------------------------------------------------------------------ |
| **Android** | `webView.evaluateJavascript("window.callback(...)", null)`          |
| **iOS**     | `webView.evaluateJavaScript("window.callback(...)")`                |

Both reduce to the shell evaluating a JavaScript string in the page, so the page must expose a globally reachable function for the shell to call.

### 2.3 Minimal Bridge Implementation

Native calls are asynchronous and return through a callback, so the page keeps a registry mapping call IDs to pending promises.

```javascript
// bridge.js — wraps the injected object in a promise-based API
const callbacks = new Map();
let callId = 0;

// The shell invokes this global function to deliver a result
window.__bridgeCallback = (id, response) => {
  const pending = callbacks.get(id);
  if (!pending) return;
  callbacks.delete(id);

  // Convention: the shell returns { code, data, message }
  response.code === 0
    ? pending.resolve(response.data)
    : pending.reject(new Error(response.message));
};

// Resolve the injected object for the current platform
function getNativeApi() {
  // Android: object injected via addJavascriptInterface
  if (window.DemoBridge) return (payload) => window.DemoBridge.postMessage(payload);
  // iOS: message handler registered on WKWebView
  if (window.webkit?.messageHandlers?.DemoBridge) {
    return (payload) => window.webkit.messageHandlers.DemoBridge.postMessage(payload);
  }
  return null;
}

export function invoke(method, params = {}, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const post = getNativeApi();

    // Outside the shell there is no bridge — fail fast so callers can fall back
    if (!post) {
      reject(new Error(`Bridge unavailable: ${method}`));
      return;
    }

    const id = ++callId;
    callbacks.set(id, { resolve, reject });

    // A shell that never answers must not leak the pending promise
    setTimeout(() => {
      if (callbacks.delete(id)) reject(new Error(`Bridge timeout: ${method}`));
    }, timeout);

    // Android's addJavascriptInterface only passes strings
    post(JSON.stringify({ id, method, params }));
  });
}
```

```javascript
// Usage — always guard against the browser case
try {
  const user = await invoke("getUserInfo");
  render(user);
} catch (e) {
  // Page opened outside the shell, or the shell does not implement this method
  redirectToWebLogin();
}
```

***

**Native-initiated events** need no call ID, because the shell is the sender. A small event bus keeps subscriptions tidy:

```javascript
const listeners = new Map();

// The shell calls this directly, e.g. on resume or on network change
window.__bridgeEvent = (event, payload) => {
  (listeners.get(event) ?? []).forEach((fn) => fn(payload));
};

export function on(event, handler) {
  const handlers = listeners.get(event) ?? [];
  listeners.set(event, [...handlers, handler]);
  return () => listeners.set(event, listeners.get(event).filter((h) => h !== handler));
}
```

### 2.4 Commonly Exposed Capabilities

| Category         | Typical methods                                              |
| ---------------- | ------------------------------------------------------------ |
| **Identity**     | `getUserInfo`, `getToken`, `login`, `logout`                  |
| **Navigation**   | `openPage`, `closePage`, `setTitle`, `setNavBar`              |
| **Device**       | `getDeviceInfo`, `getNetworkType`, `vibrate`, `scanQRCode`    |
| **Media**        | `chooseImage`, `previewImage`, `uploadFile`, `saveToAlbum`    |
| **UI**           | `showToast`, `showLoading`, `showActionSheet`                 |
| **Sharing**      | `share`, `getShareChannels`                                   |
| **Storage**      | `setStorage`, `getStorage` — survives WebView cache clearing  |

> **Note**: bridge methods are versioned by app release, so an older installed app will not implement a newly added method. Feature-detect before calling — either through a `getSupportedMethods` call or by treating a rejection as "unsupported" and degrading — rather than assuming the latest shell.

***

## III. Navigation and Lifecycle

### 3.1 Title and Navigation Bar

The native shell owns the navigation bar, so `document.title` alone does not update it reliably. A dedicated bridge call is the dependable route:

```javascript
// Set the title in both places: the shell for the native bar, the DOM for the browser fallback
document.title = "Order Details";
invoke("setTitle", { title: "Order Details" }).catch(() => {});
```

### 3.2 Back Behaviour

The hardware or navigation-bar back control belongs to the shell, which by default pops its own page stack rather than the page's history.

| Requirement                       | Handling                                                                          |
| --------------------------------- | --------------------------------------------------------------------------------- |
| **Back returns to the previous H5 view** | The shell checks `canGoBack` on the WebView and calls `goBack()` before popping |
| **Back closes a page-level overlay** | The page registers an interception handler with the shell and returns whether it consumed the event |
| **Back exits the H5 flow entirely**  | The page calls `closePage` so the shell dismisses the container                 |

```javascript
// Intercept the shell's back action while a modal is open
window.__onNativeBack = () => {
  if (isModalOpen()) {
    closeModal();
    return true;    // Consumed — the shell does nothing further
  }
  return false;     // Not consumed — the shell performs its default back
};
```

### 3.3 Page Lifecycle

A WebView is often kept alive in the background rather than destroyed, so a page can be resumed long after it was last visible and show stale data.

| Event                       | Fires when                                                    |
| --------------------------- | ------------------------------------------------------------- |
| `visibilitychange`          | The page is backgrounded or foregrounded                       |
| `pageshow` (`persisted: true`) | The page is restored from the back/forward cache            |
| `pagehide`                  | The page is being unloaded or cached                           |

```javascript
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    refreshData();    // Re-fetch anything that may have gone stale in the background
  }
});

window.addEventListener("pageshow", (e) => {
  // A bfcache restore skips normal script execution entirely
  if (e.persisted) refreshData();
});
```

***

## IV. Common Issues

### 4.1 Stale Cached Pages

A WebView caches aggressively, and a released fix can keep serving the previous HTML until the cache expires.

**Recommended:**
- Serve the HTML entry with `Cache-Control: no-cache` and let hashed asset filenames carry long-lived caching
- Append a build identifier to the entry URL where the shell constructs it
- Expose a bridge call that clears the WebView cache for support and QA use

### 4.2 Session Sharing

The shell holds the login session, and the H5 page needs it without asking the user to sign in again.

| Approach                    | Trade-off                                                                        |
| --------------------------- | -------------------------------------------------------------------------------- |
| **Token fetched over the bridge** | Most controlled; the page requests a token and attaches it to each request — requires the bridge to be ready before the first call |
| **Cookie written by the shell**   | Requests carry it automatically, but cookie handling differs between platforms and breaks across domains |
| **Token in the entry URL**        | Simplest to implement, but the credential lands in history, logs, and referrer headers — avoid |

> **Note**: a token placed in a URL query string is exposed to server logs, browser history, and any third-party resource loaded by the page. Pass credentials through the bridge or a cookie, never as a query parameter.

### 4.3 Debugging

| Platform             | Setup                                                                                     |
| -------------------- | ----------------------------------------------------------------------------------------- |
| **Android / Chrome** | The app must call `WebView.setWebContentsDebuggingEnabled(true)` in a debug build, then `chrome://inspect` |
| **iOS / Safari**     | Enable Web Inspector in Settings → Safari → Advanced, then Safari → Develop → device       |

Where remote debugging is unavailable — a production build, a device without a cable — an in-page console overlay (such as `vConsole`) gated behind a debug flag exposes logs, network activity, and storage on the device itself.

***

## V. Performance

### 5.1 Startup Cost

    Shell opens the container
        ↓
    WebView instance created        ← 100–400 ms on a cold start
        ↓
    HTML requested and parsed       ← network-bound
        ↓
    JS bundle downloaded, parsed, executed
        ↓
    Data request, then first meaningful paint

| Optimisation           | Effect                                                                             |
| ---------------------- | ---------------------------------------------------------------------------------- |
| **WebView preloading** | The shell warms an instance during idle time, removing creation cost from the click |
| **Offline package**    | HTML, CSS, and JS ship inside the app or download in the background, so the entry load hits local storage |
| **Server-side rendering** | Meaningful content arrives in the first response instead of after bundle execution |
| **Request preloading** | The shell fires the page's primary data request in parallel with WebView creation and hands the result to the bridge |
| **Skeleton screens**   | Inline placeholder markup in the HTML removes the blank interval before hydration    |

### 5.2 Runtime

**Recommended:**
- Keep long lists virtualised — WebView memory limits are far tighter than a desktop browser's
- Animate `transform` and `opacity` only, so animation stays off the main thread
- Mark `touchmove` and `wheel` listeners `{ passive: true }` to keep scrolling smooth
- Serve images at display size for the device DPR; oversized bitmaps are a common cause of WebView memory pressure

**Not recommended:**
- Layout-triggering properties (`width`, `top`, `left`) in animations
- Synchronous bridge calls during scrolling or gesture handling — each one crosses the JavaScript-to-native boundary
