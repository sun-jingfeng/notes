# Mobile Web Basics

## I. Overview

**Mobile web** refers to pages rendered by a mobile browser or by a WebView embedded in a native app. The work is not "making a desktop page smaller" — viewport behaviour, pixel density, touch input, and per-device rendering all differ from desktop.

### 1.1 Differences From Desktop

| Aspect              | Mobile situation                                                         |
| ------------------- | ------------------------------------------------------------------------ |
| **Browser engine**  | Modern engines throughout; HTML5 / CSS3 support is broadly reliable       |
| **Legacy browsers** | IE is not a target, so compatibility pressure is much lower               |
| **Viewport**        | The default layout viewport is wider than the screen and must be reset    |
| **Screen sizes**    | A wide, continuous range of widths rather than a few common breakpoints   |
| **Pixel density**   | Device pixel ratios of 2 or 3 are the norm, so raster assets need scaling |
| **Input**           | Finger input is imprecise; hover states do not exist                      |

### 1.2 Debugging Approaches

| Approach               | Description                                                                  |
| ---------------------- | ---------------------------------------------------------------------------- |
| **Device emulation**   | DevTools device toolbar — resize, pick a device profile, override DPR         |
| **Remote debugging**   | A real device connected over USB, inspected from the desktop browser's DevTools |
| **Direct device access** | The page opened on a phone over the LAN or through a tunnelling service     |

Device emulation covers layout and sizing quickly, but it renders with the desktop engine and desktop fonts, and it cannot reproduce keyboard behaviour, scroll physics, or browser chrome.

***

## II. Viewport

### 2.1 The Three Viewports

| Viewport            | Meaning                                                                     |
| ------------------- | --------------------------------------------------------------------------- |
| **Layout viewport** | The area CSS lays out against; defaults to roughly `980px` on many browsers  |
| **Visual viewport** | The part of the layout viewport currently visible on screen                  |
| **Ideal viewport**  | A layout viewport exactly as wide as the device screen in CSS pixels         |

Without configuration the layout viewport stays far wider than the screen, so the browser scales the whole page down to fit: text becomes unreadable, proportions look wrong, and tap targets shrink.

### 2.2 Standard Configuration

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

| Directive                | Description                                             |
| ------------------------ | ------------------------------------------------------- |
| **`width=device-width`** | Sets the layout viewport to the ideal viewport width     |
| **`initial-scale=1.0`**  | Sets the initial zoom level to 1                         |
| `maximum-scale`          | Caps how far the user may zoom in                        |
| `minimum-scale`          | Caps how far the user may zoom out                       |
| `user-scalable`          | `no` disables pinch-zoom entirely                        |
| `viewport-fit`           | `cover` extends the page under the notch and home bar    |

### 2.3 Disabling Zoom

```html
<!-- ❌ Blocks pinch-zoom — an accessibility regression -->
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
/>

<!-- ✅ Leave zoom available -->
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

Locking zoom removes the only recovery path for readers who need larger text, which is why iOS Safari ignores `user-scalable=no`. The historical justification — suppressing the 300 ms tap delay — no longer applies: engines drop that delay automatically on any page carrying a responsive viewport tag.

### 2.4 Safe Areas

Devices with a notch, rounded display, or gesture bar reserve screen regions that content must avoid. The `env()` function exposes those insets, and it reports non-zero values only when the viewport opts into the full screen with `viewport-fit=cover`.

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
```

```css
.page-header {
  /* Fall back to 0 on devices that report no inset */
  padding-top: env(safe-area-inset-top, 0px);
}

.tab-bar {
  position: fixed;
  bottom: 0;
  /* Keep the bar clear of the home indicator */
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
```

| Variable                      | Region covered                |
| ----------------------------- | ----------------------------- |
| `env(safe-area-inset-top)`    | Status bar / notch            |
| `env(safe-area-inset-bottom)` | Home indicator / gesture area |
| `env(safe-area-inset-left)`   | Rounded corner in landscape   |
| `env(safe-area-inset-right)`  | Rounded corner in landscape   |

***

## III. Pixel Density and Image Assets

### 3.1 Physical Pixels vs CSS Pixels

| Term                         | Description                                                               |
| ---------------------------- | ------------------------------------------------------------------------- |
| **Physical pixel**           | An actual light-emitting point on the panel; fixed by the hardware         |
| **CSS pixel**                | The abstract unit CSS sizes are written in — what `width: 100px` refers to |
| **Device pixel ratio (DPR)** | Physical pixels per CSS pixel along one axis                               |

A DPR of 3 means one CSS pixel is painted by a 3 × 3 block of physical pixels. Vector content (text, borders, SVG) is rendered at full density automatically; raster images are not, so a bitmap authored at its display size gets upscaled and looks soft.

```javascript
// Read the current device pixel ratio
const dpr = window.devicePixelRatio;    // 2 on most phones, 3 on high-end models
```

### 3.2 Multiple-Density Assets

A **2x asset** is a bitmap authored at twice its display size; a **3x asset**, three times.

| Display size    | 2x asset        | 3x asset        |
| --------------- | --------------- | --------------- |
| `100px × 100px` | `200px × 200px` | `300px × 300px` |
| `48px × 48px`   | `96px × 96px`   | `144px × 144px` |

### 3.3 Serving the Right Density

```html
<!-- The browser picks the source matching the device DPR -->
<img
  src="icon@1x.png"
  srcset="icon@2x.png 2x, icon@3x.png 3x"
  width="100"
  height="100"
  alt=""
/>
```

```css
.logo {
  width: 100px;
  height: 100px;
  /* image-set is the background-image counterpart of srcset */
  background-image: image-set("logo@2x.png" 2x, "logo@3x.png" 3x);
  background-size: 100px 100px;    /* Required — pins the paint size to the CSS size */
}
```

**Recommended:**
- SVG or an icon font for flat icons and logos — density-independent, no asset variants needed
- `srcset` / `image-set` for photographs and other raster content
- `background-size` wherever a sprite sheet or background bitmap is authored at 2x or 3x

### 3.4 The 1px Hairline

A `1px` border is one CSS pixel, so on a DPR-3 screen it is painted three physical pixels thick and reads as heavy next to a native divider.

```css
.hairline {
  position: relative;
}

.hairline::after {
  content: "";
  position: absolute;
  inset: auto 0 0 0;
  height: 1px;
  background: #e5e5e5;
  /* Scale the line down to a true device pixel */
  transform: scaleY(calc(1 / 3));
  transform-origin: bottom;
}
```

***

## IV. Design Mockups

Mobile mockups are commonly delivered at a **750px** width, which is a 2x rendering of a 375 CSS-pixel reference device.

    Mockup measurement 200px
        ↓  ÷ 2 (the mockup's density multiple)
    Reference size 100px at 375px wide
        ↓  × adaptation scheme
    Final CSS value (rem / vw / px)

| Mockup width | Density multiple | Reference device width |
| ------------ | ---------------- | ---------------------- |
| `750px`      | 2x               | `375px`                |
| `1125px`     | 3x               | `375px`                |
| `375px`      | 1x               | `375px`                |

> **Note**: the ÷ 2 rule holds only for a 2x mockup measured against a 375px reference. Confirm the stated baseline before applying it, and prefer a build-time conversion over manual arithmetic.

***

## V. Adaptation Schemes

### 5.1 Percentage

Widths expressed in `%` resolve against the containing block, so boxes stretch with the viewport.

Percentage heights require a resolved height on the parent, and padding and margin percentages both resolve against the container's **width**, which makes vertical sizing awkward. Useful for simple fluid widths, insufficient on its own.

### 5.2 Flexbox

```css
.row {
  display: flex;
  gap: 12px;
}

.row > .item {
  flex: 1;         /* Share the remaining space equally */
  min-width: 0;    /* Allow shrinking below content size so long text can ellipsize */
}
```

Flexbox governs distribution inside a component but does not scale type or spacing with screen width, so it complements a global scheme rather than replacing one.

### 5.3 rem

Every size is written in `rem` and the root font size is tied to viewport width, so one value rescales the entire page.

```css
html {
  /* 1rem = 1/10 of the viewport width, capped so tablets stop growing */
  font-size: 10vw;
}

@media (min-width: 560px) {
  html {
    font-size: 56px;
  }
}

.card {
  /* 200px on a 750px mockup → 100px reference → 100 / 37.5 rem */
  width: 2.6667rem;
  padding: 0.32rem;
}
```

Converting every value by hand is error-prone, so the conversion belongs in the build:

```javascript
// postcss.config.js — author in px, ship rem
module.exports = {
  plugins: {
    "postcss-pxtorem": {
      rootValue: 37.5,        // Reference device width / 10
      propList: ["*"],
      unitPrecision: 5,
      minPixelValue: 2,       // Leave hairlines untouched
    },
  },
};
```

> 💡 A reader who raises the browser's default font size expects text to grow. Because `font-size: 10vw` overrides that preference, size body copy from a fixed root where readability matters and reserve viewport-driven sizing for layout dimensions.

### 5.4 vw / vh

Viewport units size directly against the viewport, with no root font-size indirection.

```css
.card {
  /* 200px on a 750px mockup → 200 / 750 * 100vw */
  width: 26.667vw;
}
```

`100vh` on mobile refers to the viewport with browser chrome retracted, so a full-height element overflows while the address bar is showing. The dynamic viewport units resolve this:

| Unit  | Resolves to                                                          |
| ----- | -------------------------------------------------------------------- |
| `svh` | **Smallest** viewport height — browser chrome fully expanded          |
| `lvh` | **Largest** viewport height — browser chrome fully retracted          |
| `dvh` | **Dynamic** viewport height — tracks the current state and updates live |

```css
.full-screen {
  height: 100vh;     /* Fallback for engines without dynamic units */
  height: 100dvh;    /* ✅ Matches the visible area as chrome shows and hides */
}
```

### 5.5 Scheme Comparison

| Scheme         | Strength                                      | Limitation                                              |
| -------------- | --------------------------------------------- | ------------------------------------------------------- |
| **Percentage** | Trivial to apply for fluid widths             | Weak vertical sizing; percentages resolve unintuitively  |
| **Flexbox**    | Strongest within-component layout control     | Does not scale type or spacing globally                  |
| **rem**        | Rescales a whole page from one root value     | Needs a build step; overrides user font-size preferences |
| **vw / vh**    | Direct, no indirection, no runtime JavaScript | Scales without limit unless capped on large screens      |

**Recommended for new projects:** `vw` (with `dvh` for full-height regions) for global scaling, flexbox or grid for component layout, and a `max-width` on the page container so tablets and desktops do not receive an oversized layout.

### 5.6 Fixed Sides With a Fluid Centre

```css
.layout {
  display: flex;
  align-items: center;
}

.layout > .side {
  width: 80px;
  flex: none;      /* Never shrink the fixed columns */
}

.layout > .centre {
  flex: 1;
  min-width: 0;    /* Permit shrinking so overflowing text can be truncated */
}
```

This replaces the older absolute-positioning-plus-margin approach: no magic numbers, the columns stay in normal flow, and changing a side width needs no matching change elsewhere.

***

## VI. Touch Interaction

### 6.1 Hit Targets

| Guideline                   | Value                                                 |
| --------------------------- | ----------------------------------------------------- |
| **Minimum tap target**      | `44px × 44px` (iOS) / `48dp` (Android Material)        |
| **Spacing between targets** | At least `8px`, so adjacent controls are not mis-hit   |
| **Minimum body text**       | `14px`, and `16px` on form inputs                      |

A visually small control can still expose a large hit area:

```css
.icon-button {
  position: relative;
  width: 24px;
  height: 24px;
}

.icon-button::before {
  content: "";
  position: absolute;
  /* Extend the touch area to 44px without changing the visual size */
  inset: -10px;
}
```

> 💡 `font-size: 16px` on inputs is not only a readability choice — iOS Safari auto-zooms the page when a focused input renders below 16px.

### 6.2 Touch Events

| Event         | Fires when                                                         |
| ------------- | ------------------------------------------------------------------ |
| `touchstart`  | A finger contacts the screen                                        |
| `touchmove`   | A finger moves while in contact                                     |
| `touchend`    | A finger lifts off                                                  |
| `touchcancel` | The system interrupts the gesture (an incoming call, a swipe-back)  |
| `click`       | After `touchend`, provided the gesture was not a drag or a scroll   |

```javascript
const el = document.querySelector(".swipe-area");

// passive: true promises the handler will not call preventDefault(),
// so scrolling never blocks waiting on JavaScript
el.addEventListener("touchmove", (e) => {
  const touch = e.touches[0];
  handleMove(touch.clientX, touch.clientY);
}, { passive: true });
```

| Property         | Contents                                                                   |
| ---------------- | -------------------------------------------------------------------------- |
| `touches`        | Every finger currently on the screen                                        |
| `targetTouches`  | Fingers that began on the bound element                                     |
| `changedTouches` | Fingers that changed in this event — the only list populated on `touchend`  |

**Recommended:**
- `click` for simple taps — it carries keyboard and assistive-technology support that touch events do not
- Touch events only for continuous gestures: swipes, drags, pull-to-refresh
- `{ passive: true }` on any `touchmove` or `wheel` listener that does not call `preventDefault()`

### 6.3 Hover States

`:hover` has no touch equivalent. Mobile browsers emulate it on tap, which leaves a control visibly stuck in its hover state after the finger lifts.

```css
/* ✅ Apply hover styling only where a hovering pointer actually exists */
@media (hover: hover) {
  .button:hover {
    background: #f0f0f0;
  }
}

/* Touch feedback comes from :active instead */
.button:active {
  background: #e0e0e0;
}
```

### 6.4 Scrolling

```css
.scroll-area {
  overflow-y: auto;
  /* Stop the scroll chaining to the page once this area reaches its end */
  overscroll-behavior: contain;
}

body {
  /* Disable pull-to-refresh where a custom implementation replaces it */
  overscroll-behavior-y: none;
}
```

| Property                       | Effect                                                                            |
| ------------------------------ | --------------------------------------------------------------------------------- |
| `overscroll-behavior: contain` | Confines scrolling to this container; no chaining to the ancestor                  |
| `scroll-behavior: smooth`      | Animates programmatic scrolling                                                    |
| `scroll-snap-type`             | Snaps to defined positions — carousels, paged lists                                |
| `touch-action: pan-y`          | Reserves horizontal gestures for JavaScript while vertical scrolling stays native   |

Nested scrolling areas are the usual source of "the wrong thing scrolled" reports. One scrolling region per screen avoids the problem; where nesting is unavoidable, `overscroll-behavior: contain` breaks the chain.

### 6.5 Keyboard Behaviour

The on-screen keyboard resizes or overlays the viewport, which commonly strands a fixed footer in the middle of the screen or hides the focused field.

```javascript
// visualViewport reports the area left uncovered by the keyboard
window.visualViewport?.addEventListener("resize", () => {
  const { height, offsetTop } = window.visualViewport;
  document.documentElement.style.setProperty("--viewport-height", `${height}px`);
  document.documentElement.style.setProperty("--viewport-offset", `${offsetTop}px`);
});
```

| Problem                              | Handling                                                          |
| ------------------------------------ | ----------------------------------------------------------------- |
| **Fixed footer rides up on Android** | Position against `visualViewport.height` rather than `100vh`       |
| **Focused input hidden on iOS**      | `element.scrollIntoView({ block: "center" })` after focus          |
| **Page auto-zooms on focus (iOS)**   | Render inputs at `font-size: 16px` or larger                       |
| **Wrong keyboard layout appears**    | Set `type` and `inputmode` (`numeric`, `decimal`, `email`, `tel`)  |

***

## VII. Real-Device Testing

Emulation renders with the desktop engine, so a whole class of defects appears only on hardware:

| Category           | What emulation misses                                             |
| ------------------ | ----------------------------------------------------------------- |
| **Touch accuracy** | Whether targets are comfortably hittable with a thumb              |
| **Scroll physics** | Momentum, rubber-banding, jank from expensive paints               |
| **Keyboard**       | How the layout reflows once the keyboard is raised                 |
| **Safe areas**     | Real notch, home indicator, and collapsing browser chrome          |
| **Image fidelity** | Whether assets are genuinely sharp at the device's DPR             |
| **Performance**    | Actual CPU and GPU budget, thermal throttling, network latency     |

Remote debugging attaches full DevTools to the page running on the device:

| Platform             | Setup                                                                                        |
| -------------------- | -------------------------------------------------------------------------------------------- |
| **Android / Chrome** | Enable USB debugging, connect by cable, open `chrome://inspect`                               |
| **iOS / Safari**     | Enable Web Inspector in Settings → Safari → Advanced, connect by cable, open Safari → Develop |

> 💡 Emulation is the fast first pass for layout and sizing; hardware confirms the experience. Test on the lowest-specification device the project supports, not only on a current flagship.
