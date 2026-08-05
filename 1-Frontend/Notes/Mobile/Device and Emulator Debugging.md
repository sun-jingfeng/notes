# Device and Emulator Debugging

## I. Overview

A uni-app project compiled to the App target runs its pages inside a WebView wrapped in a native shell. The shell is native, but the pages are still web pages, so the browser's own remote-debugging tools attach to them — Chrome DevTools for Android, Safari Web Inspector for iOS.

### 1.1 The Workflow

    HBuilderX builds a debug base package
        ↓
    Package installs on an Android emulator or a physical iOS device
        ↓
    Device connects to the desktop browser's remote-debugging bridge
        ↓
    Full DevTools — console, network, elements, sources — over that bridge

### 1.2 Requirements per Platform

| Platform    | Host machine    | Target                     | Console                              |
| ----------- | --------------- | -------------------------- | ------------------------------------ |
| **Android** | Windows / macOS / Linux | Emulator or physical device | Chrome at `chrome://inspect/#devices` |
| **iOS**     | macOS only      | Physical device or Simulator | Safari → Develop → Web Inspector    |

> **Note**: iOS debugging has no cross-platform path. Safari Web Inspector is the only tool that attaches to a WKWebView, it ships only with Safari on macOS, and no Windows or Linux equivalent exists.

***

## II. Building a Debug Package in HBuilderX

### 2.1 Base Package Types

The App target does not load a bundle directly — it installs a **base package** (a native shell) into which the compiled pages are pushed.

| Type              | Description                                                                     | Debuggable |
| ----------------- | ------------------------------------------------------------------------------- | ---------- |
| **Standard base** | The prebuilt shell shipped with HBuilderX; no build wait                         | ✅          |
| **Custom base**   | Built from the project's own `manifest.json`, required once native plugins, a custom AppID, SDK configuration, or platform permissions are in play | ✅ |
| **Release package** | Produced by the cloud packaging step and signed for distribution                | ❌          |

**Standard base:** fastest path, valid whenever the project uses no native plugins. The AppID inside it belongs to HBuilderX, so anything keyed to the project's own AppID — push notifications, third-party login, payment — will not work.

**Custom base:** built in the cloud from the project's real configuration, taking a few minutes. Any change to `manifest.json` native settings or to the native plugin list requires rebuilding it.

> **Note**: a release package is not debuggable on either platform. Android release builds do not enable WebView content debugging, and iOS release builds do not mark the WebView inspectable. A console that never appears is almost always a release package rather than a broken connection.

### 2.2 Running to a Device

① Connect the device or start the emulator, so the target appears in the device list

② Run → Run to Phone or Emulator → Run to Android App Base (or iOS App Base)

③ Pick the target from the device list; HBuilderX installs the base and pushes the compiled pages

④ For a custom base: Run → Run to Phone or Emulator → Make Custom Debug Base first, then select the custom base in the run dialogue

Subsequent runs reuse the installed base and push only the changed pages, so the install cost is paid once.

***

## III. Android: Emulator Setup

### 3.1 Creating a Virtual Device

① Android Studio → Device Manager → Create Device

② Pick a hardware profile — a mainstream phone size such as Pixel 6 is representative

③ Select a system image matching the host CPU

④ Finish, then launch the device from Device Manager

| Host                        | System image architecture |
| --------------------------- | ------------------------- |
| **Intel / AMD**             | x86_64                    |
| **Apple silicon (M-series)** | arm64-v8a                 |

> 💡 Choose a **Google APIs** image rather than a **Google Play** image. Both include Play Services, but only the Google APIs image allows `adb root`, which matters for inspecting app storage and databases. Play Store images are locked down in the same way as a retail device.

### 3.2 Connecting HBuilderX to the Emulator

The bridge between HBuilderX and any Android target is `adb`, which ships with the Android SDK platform-tools.

```bash
# Confirm the emulator is visible — this list is what HBuilderX reads
adb devices

# Expected output
# List of devices attached
# emulator-5554    device
```

HBuilderX bundles its own adb, which conflicts with the Android SDK copy when the two versions differ — the symptom is an empty device list despite `adb devices` working in the terminal.

**Fix:** point HBuilderX at the SDK's adb, under Settings → Run Configuration → Android SDK / adb path.

```bash
# Restart the bridge when a device is detected in one tool but not the other
adb kill-server
adb start-server
```

### 3.3 Reaching a Local API Server

The emulator is a separate virtual machine with its own network stack, so `localhost` inside it refers to the emulator, not to the development machine.

| Address       | Resolves to                                              |
| ------------- | -------------------------------------------------------- |
| `10.0.2.2`    | The host machine's `localhost` — the standard alias       |
| `10.0.2.15`   | The emulator's own network interface                      |
| `localhost`   | The emulator itself, almost never what a request wants    |

```bash
# Alternative to the alias: forward a device port back to the host,
# so localhost:8080 on the device reaches localhost:8080 on the machine
adb reverse tcp:8080 tcp:8080
```

A physical Android device on the same Wi-Fi network reaches the host by its LAN IP instead, provided the dev server binds to all interfaces rather than to loopback only.

***

## IV. Android: Chrome DevTools Console

### 4.1 Opening the Inspector

① Run the debug base on the emulator or device and open the page to inspect

② Open Chrome on the host machine and navigate to `chrome://inspect/#devices`

③ Confirm Discover USB devices is ticked

④ The app appears as a WebView entry listing its current URL; click **inspect**

A full DevTools window opens against the WebView, with console, network, elements, sources, and breakpoints all behaving as they do for a normal page.

> 💡 The **Port forwarding** panel on the same page maps a device port to the host, which is the cleanest way to load a local dev server on a physical device without touching the LAN IP.

### 4.2 Requirements

| Requirement                       | Detail                                                                       |
| --------------------------------- | ---------------------------------------------------------------------------- |
| **WebView debugging enabled**     | `WebView.setWebContentsDebuggingEnabled(true)` in the shell — debug bases set this, release builds do not |
| **USB debugging authorised**      | Physical devices show a fingerprint prompt that must be accepted; emulators skip it |
| **adb sees the device**           | `chrome://inspect` reads the same device list as `adb devices`                |

### 4.3 Common Problems

| Symptom                                        | Cause and fix                                                                |
| ---------------------------------------------- | ---------------------------------------------------------------------------- |
| **Device list is empty**                       | adb does not see the device — run `adb devices`, then `adb kill-server && adb start-server` |
| **Device listed, no WebView entry**            | The app is a release package, or no WebView is currently open                 |
| **Physical device shows as `unauthorized`**    | The USB debugging prompt was dismissed; revoke authorisations in Developer options and reconnect |
| **`inspect` opens a blank white window**       | Chrome fetches a DevTools frontend matching the device's WebView version from Google's servers; blocked or slow networks leave it blank |
| **DevTools opens but is missing panels**       | Large version gap between desktop Chrome and the device WebView               |

The blank-inspector case is the one worth recognising, because it looks like a broken connection rather than a network fetch. Keeping desktop Chrome and the device's Android System WebView on close versions avoids the remote fetch entirely, since Chrome then uses its bundled frontend. Where the network cannot be relied on, `edge://inspect` in Edge exposes the same protocol through a different frontend.

***

## V. iOS: Physical Device Setup

### 5.1 Device Preparation

① Settings → Privacy & Security → Developer Mode → on, then restart when prompted (iOS 16 and later)

② Connect the device to the Mac by cable and accept the Trust This Computer prompt

③ Enable Web Inspector on the device:

| iOS version    | Path                                                    |
| -------------- | ------------------------------------------------------- |
| **iOS 17 and earlier** | Settings → Safari → Advanced → Web Inspector     |
| **iOS 18 and later**   | Settings → Apps → Safari → Advanced → Web Inspector |

> **Note**: this toggle governs every inspectable WebView on the device, not just Safari's own tabs, so it is required even when the target is an app rather than a browser page.

### 5.2 Mac Preparation

Safari's Develop menu is hidden by default:

| Safari version         | Path                                                                    |
| ---------------------- | ----------------------------------------------------------------------- |
| **Safari 17 and later** | Safari → Settings → Advanced → Show features for web developers         |
| **Earlier versions**    | Safari → Preferences → Advanced → Show Develop menu in menu bar         |

### 5.3 Installing the Base Package

A physical iOS device cannot install an arbitrary package the way an Android device does — iOS requires the package to be signed by a certificate the device trusts.

| Approach                    | Description                                                                  |
| --------------------------- | ---------------------------------------------------------------------------- |
| **Custom base**             | Built in the cloud against the project's certificate and provisioning profile, with the test device's UDID registered in the profile |
| **Simulator**               | No signing at all; sufficient when the work needs no real hardware capability |

Registering the device UDID in the provisioning profile before building is the step most often missed — a package built against a profile that omits the device installs and then refuses to launch.

***

## VI. iOS: Safari Web Inspector

### 6.1 Opening the Inspector

① Launch the app on the connected device and navigate to the page to inspect

② On the Mac, open Safari → Develop menu

③ Select the device by name from the menu — the connected iPhone or iPad appears as its own submenu

④ Click the entry for the app's WebView, listed by page title or URL

**Web Inspector** opens as a separate window, providing console, network, elements, sources, storage, and breakpoint debugging against the live WebView.

> 💡 The Develop menu also lists **Simulator** whenever an iOS Simulator is running, so the same inspector attaches to simulator WebViews with no device, cable, or certificate involved.

### 6.2 Inspectability on iOS 16.4 and Later

From iOS 16.4, a WKWebView is **not inspectable by default**. The hosting app must opt in by setting `isInspectable = true` on the web view, and an app that does not is invisible to the Develop menu no matter how the device is configured.

| Package                      | Inspectable                                                     |
| ---------------------------- | --------------------------------------------------------------- |
| **Debug base (standard or custom)** | ✅ The debug shell opts in                                |
| **Release package**          | ❌ Deliberately not inspectable                                  |
| **Safari tabs**              | ✅ Governed by the device's Web Inspector toggle alone           |

This is the single most common reason an iOS WebView never appears in the Develop menu, and it is easy to misread as a connection fault because the device itself does show up.

### 6.3 Common Problems

| Symptom                                       | Cause and fix                                                             |
| --------------------------------------------- | ------------------------------------------------------------------------- |
| **Develop menu absent from the menu bar**     | Web developer features not enabled in Safari settings                      |
| **Device not listed under Develop**           | Cable connection, or the Trust prompt was declined — reconnect and accept  |
| **Device listed but shows no pages**          | Release package, no WebView open, or Web Inspector disabled on the device  |
| **Inspector opens then immediately disconnects** | The app was backgrounded or the WebView was destroyed; reopen the page   |
| **Connection drops on every code change**     | Expected — pushing a new build tears down the WebView; reattach afterwards |

> **Note**: a cable is required. Safari Web Inspector offers no wireless equivalent to Chrome's network-based device discovery, so a device connected only over Wi-Fi will not appear.

***

## VII. In-Page Console Fallback

Where neither inspector is available — a release build, a tester's device, a Windows machine with an iPhone — an in-page console renders the same information inside the app itself.

```javascript
// main.js — load only outside production so it never ships to users
// #ifdef APP-PLUS || H5
if (import.meta.env.MODE !== "production") {
  import("vconsole").then(({ default: VConsole }) => new VConsole());
}
// #endif
```

A floating button appears in the corner, opening a panel with logs, network requests, storage, and element inspection.

| Capability          | Remote inspector | In-page console |
| ------------------- | ---------------- | --------------- |
| **Console output**  | ✅                | ✅               |
| **Network requests** | ✅                | ✅               |
| **Storage**         | ✅                | ✅               |
| **Element inspection** | Full           | Basic           |
| **Breakpoints**     | ✅                | ❌               |
| **Performance profiling** | ✅          | ❌               |
| **Works without a cable** | ❌          | ✅               |

Breakpoint debugging is the capability with no in-page substitute, which keeps the remote inspectors necessary for anything beyond reading logs.

***

## VIII. Quick Reference

| Step                     | Android                                        | iOS                                          |
| ------------------------ | ---------------------------------------------- | -------------------------------------------- |
| **Host requirement**     | Any desktop OS                                 | macOS only                                    |
| **Target**               | Android Studio emulator or physical device      | Physical device or Simulator                  |
| **Bridge**               | adb over USB                                   | USB cable, no separate tool                   |
| **Device enablement**    | Developer options → USB debugging               | Developer Mode, plus Safari → Web Inspector   |
| **Host enablement**      | None                                           | Safari → show web developer features          |
| **Console entry point**  | `chrome://inspect/#devices`                    | Safari → Develop → device name                |
| **Host localhost alias** | `10.0.2.2` from the emulator                   | LAN IP of the Mac                             |
| **Blocked by**           | Release package; adb version conflicts          | Release package; `isInspectable` not set; unregistered UDID |
