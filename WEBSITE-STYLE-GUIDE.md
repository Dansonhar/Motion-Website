# Build Guideline — Dark Editorial Motion Site

Paste this whole file as the brief for a new site. It is the distilled ruleset
behind the Motion Site build: stack, tokens, type, rhythm, motion, media, copy
voice, and the performance rules that keep a heavy motion page fast.

---

## 0. The one-line positioning

> A premium, near-monochrome, dark editorial page that sells to a buyer with a
> budget — not to the cheapest monthly fee. Everything is quiet, expensive and
> slow. Nothing shouts.

Every decision below follows from that. When in doubt: **fewer things, more
space, slower motion, less colour.**

---

## 1. Stack

- **React 18** + **Vite 6** (`base:` set if deploying to a subpath, e.g. GitHub Pages)
- **Tailwind CSS v4** via `@tailwindcss/vite` — tokens declared in `@theme`, no `tailwind.config.js`
- **Framer Motion 11** — scroll reveals, sticky scroll rigs, cross-fades
- **lucide-react** — the only icon set. Thin, uniform stroke.
- No UI library, no component kit, no CSS-in-JS. Utilities + a handful of
  hand-written primitives.

```
src/
  index.css              @theme tokens + the few global classes
  App.jsx                shell: nav, <main>, footer, MotionConfig
  main.jsx
  attractions.jsx        (multi-brand only) nav/footer/CTA config per page
  motion/                env.js, StickyStage.jsx, ScrollVideo.jsx
  components/<page>/     sections, one file per section
  components/<page>/Primitives.jsx   Eyebrow / Display / Lede / SectionShell / Reveal
  product/               drawn UI atoms + screens (optional)
  sites/                 one file per top-level page, lazy-loaded
public/
  video/<page>/          .mp4, faststart, muted, cropped to final ratio
  images/<page>/
```

Every page is `lazy()` + `<Suspense>`. Footer too. The nav is not.

---

## 2. Colour

Near-monochrome on near-black. Colour is a rationed accent, never a surface.

```css
@theme {
  --color-ink-950: #060807;   /* page background — near-black with a green cast */
  --color-ink-900: #0b0e0c;   /* alternating section band */
  --color-ink-800: #121613;   /* raised card */
  --color-ink-700: #1b211d;   /* border / divider on dark */
  --color-ink-600: #2a332d;

  /* "accent" is white by default — a monochrome brand */
  --color-accent-300: #a3a3a3;
  --color-accent-400: #e5e5e5;
  --color-accent-500: #ffffff;
  --color-accent-600: #d4d4d4;

  --font-sans: "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
}
```

**Text opacity ladder** — this is the whole hierarchy, use nothing else:

| Role | Class |
|---|---|
| Headline | `text-white` |
| Body / lede | `text-white/75` |
| Secondary, captions | `text-white/55` |
| Hairlines, borders | `white/10`, `white/8`, `white/5` |
| Eyebrows, numbers, small labels, primary button fill | `accent-*` |

### The theming rule (the single best trick here)

Tailwind v4 compiles `text-accent-400` to `color: var(--color-accent-400)`.
So an entire brand repaint is **four CSS lines on a scoped class** — no
component edits, no `theme-x:` variants, nothing hardcoded:

```css
.theme-lime {
  --color-accent-300: #a9d400;
  --color-accent-400: #ccff00;
  --color-accent-500: #ccff00;
  --color-accent-600: #b8e600;
}
```

Apply the class on the **app shell**, not on the page — the navbar and footer
are siblings of `<main>`, and a page-scoped theme leaves a white button in the
bar above a coloured page.

**This is only safe because `accent-*` is never worn by running text.** Audit
that before you repaint. A saturated accent on a paragraph reads as a
highlighter pen, and stops reading as expensive. Accent belongs on: eyebrows,
step numbers, small uppercase labels, the primary button fill. Nothing else.

---

## 3. Typography

Continuous `clamp()` scaling, not breakpoint jumps — an editorial look has to
hold at every width, not step between three sizes.

```jsx
export const EASE = [0.16, 1, 0.3, 1]   // slow, weighted. Expensive, not playful.

// Eyebrow — opens every section
<p className="text-xs font-semibold uppercase tracking-widest text-accent-400" />

// Display — the statement
<h2 className="text-[clamp(2.1rem,5vw,4.6rem)] leading-[1.02] font-bold tracking-tight text-white" />

// Lede — supporting paragraph
<p className="text-[clamp(1rem,1.15vw,1.2rem)] leading-relaxed text-white/75" />
```

Rules:
- Headlines get a **`max-w-[NNch]`** (10–19ch) so they break into 2–3 short
  lines. A display headline running full width reads as a paragraph.
- `leading-[1.02]` on display, `leading-relaxed` on body. Nothing in between.
- Sentence case in headlines, ending in a full stop: *"One operation."*,
  *"Seven jobs, one system."*, *"You already pay for all of it."*
- `tracking-widest` + `uppercase` **only** at 11–12px. Never larger.

---

## 4. Layout & rhythm

```jsx
export function SectionShell({ id, children, className = '', rule = true, label }) {
  return (
    <section id={id} aria-label={label}
      className={`px-6 py-14 sm:px-10 sm:py-16 lg:py-20 ${className}`}>
      <div className="mx-auto max-w-[1500px]">
        {rule && <div className="sol-rule mb-10 w-full sm:mb-12" />}
        {children}
      </div>
    </section>
  )
}
```

- **Content max-width `1500px`**, gutters `px-6` / `sm:px-10`.
- **Section padding doubles between sections.** Each section pads top *and*
  bottom, so `lg:py-20` shows as ~160px of gap. `py-24 sm:py-32 lg:py-40` puts
  320px of dead air between sections and makes the page read as a stack of
  separate pages. Don't.
- Every section opens with a **hairline rule that fades out to the right** —
  the signature of the whole layout:

```css
.sol-rule {
  height: 1px;
  background: linear-gradient(90deg, rgba(255,255,255,0.28), rgba(255,255,255,0) 70%);
}
```

- Alternate `bg-ink-950` and `bg-ink-900` between sections for rhythm. No
  borders between sections — the rule and the tone change do that job.
- Full-bleed bands (image running edge to edge with copy on it) **opt out of
  SectionShell** and set their own padding by hand, matched to the shell.
- Glass card, used sparingly:

```css
.glass {
  background: linear-gradient(160deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
  border: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(12px);
}
```

---

## 5. Motion

Wrap the app once:

```jsx
<MotionConfig reducedMotion="user">
```

### The scroll reveal — used everywhere

```jsx
<motion.div
  initial={{ opacity: 0, y: 28 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: '-12% 0px' }}
  transition={{ duration: 1.1, delay, ease: EASE }}
/>
```

- `duration` 0.85–1.1s. **Long.** Short reveals read as cheap.
- `once: true` always. A section that re-animates on scroll-up is a toy.
- `margin: '-12% 0px'` so it fires slightly after entry, not on the edge.
- Stagger siblings by **0.08–0.16s**, never more than ~4 items deep.

### Image first, words second

When a row pairs a picture with copy: the **picture is visible at rest** (say
`opacity: 0.55`, lifting to `0.92` when active) and only the **words** animate
in, staggered. Fading in the image too makes the page look like it is loading.

### Sticky scroll rigs

For a pinned, scroll-driven sequence:

- Tall outer container + `sticky top-0 h-[100svh]` stage.
- Resolve scroll to a **discrete step index**, not a continuous float, and
  cross-fade between steps. A film scrubs; a product interface switches.
- **~90vh of runway per step.** Below ~70 steps flick past faster than the
  cross-fade; above ~110 the section feels stuck.
- Make it **steerable** — a rail below the stage that scrolls to a step on
  click. Scroll storytelling you can't jump through is a video with extra steps.
- **Mobile and reduced-motion get no stage at all** — render the same steps as
  an ordinary stacked list. Pinning 500vh under a thumb is how a phone user
  loses the ability to leave a section.
- **No ancestor may set `overflow-*`.** `overflow-x: hidden` computes
  `overflow-y: auto`, which makes the ancestor a scroll container and silently
  kills `position: sticky`.

```jsx
// one flag every rig branches on
export function useSimpleMotion() {
  const reduced = usePrefersReducedMotion()
  const mobile  = useIsMobile()          // resolved on FIRST render, not in an effect
  return { reduced, mobile, simple: reduced || mobile }
}
```

`useIsMobile` must resolve its initial state synchronously
(`useState(() => window.matchMedia(q).matches)`) — resolving it in an effect
mounts the desktop tree and swaps, which on a sticky stage is a visible jump.

### Reduced motion

Give reduced-motion users the **static branch**, never a degraded animated one.
`MotionConfig reducedMotion="user"` strips transforms from `motion` components,
but any rig that drives `video.currentTime` or pins a stage must opt out
structurally. Also kill `scroll-behavior: smooth` and all CSS keyframes under
`@media (prefers-reduced-motion: reduce)`.

---

## 6. Video & media — the rules that keep it fast

This is where a motion site is won or lost. A dozen looping clips on one page
is normal here; done naively it is fan noise and a dead battery.

```jsx
<video
  muted loop playsInline
  draggable={false}
  preload="none"              // NOT "auto"
  // no autoplay ATTRIBUTE — it overrides preload="none" and pulls every file
  className="pointer-events-none absolute inset-0 h-full w-full object-cover"
/>
```

Start **and stop** playback from an IntersectionObserver:

```js
const io = new IntersectionObserver(
  (entries) => entries.forEach((e) => (e.isIntersecting ? start() : v.pause())),
  { rootMargin: '100% 0px' },   // free hysteresis: starts a screen early, pauses a screen late
)
```

```js
const start = () => {
  if (v.preload !== 'auto') v.preload = 'auto'
  v.play().catch(() => {})
  // do NOT also call v.load() — it resets the element and aborts the request
  // that raising preload just started: 206 → ERR_ABORTED → 304, per clip.
}
```

More rules:

- **`muted` is not a style choice.** No browser autoplays with sound. If you
  want sound, offer a speaker toggle that unmutes on a real click.
- **Render one `src`, never two.** A desktop cut and a mobile cut both in the
  DOM behind a CSS `hidden` downloads the one nobody watches. Branch in JS.
- **Crop at encode time, not with `object-cover`.** Shipping a 16:9 file into a
  3:2 frame throws away a sixth of every byte you sent.
- Encode: `libx264 -crf 27 -preset slow -pix_fmt yuv420p -an -movflags +faststart`.
  Strip audio unless a toggle needs it. Verify with SSIM before accepting.
- **Poster on every clip**, pulled from a wide establishing frame (~t=0.3), not
  from a random mid-clip close-up.
- Keep the **still as well as the film**. It is the poster, the reduced-motion
  fallback, and the fallback if the clip is ever pulled.
- Ratios as a fixed named set so a still and a film are interchangeable in the
  same slot with no layout shift:

```js
const RATIOS = {
  wide: 'aspect-[16/9]', cinema: 'aspect-[21/9]', portrait: 'aspect-[4/5]',
  tall: 'aspect-[9/16]', square: 'aspect-square', fill: 'h-full w-full',
}
```

- **Never `<link rel="preload" as="video">` in `index.html`** on a multi-page
  app. It fires on every route, for a file most of them don't use.
- Below-the-fold sections get `content-visibility: auto; contain-intrinsic-size: auto 600px;`.
- Hero image eager, **everything else `loading="lazy" decoding="async"`**.

### Placeholders

Every media primitive renders a **quiet placeholder** when no `src` is supplied:
a glass surface, a hairline frame, a small corner label. No icons, no play
button, nothing that reads as a broken embed. The page is complete and
reviewable before any footage exists, and dropping in real film later is a
one-line change. **Never print a production note in a placeholder** ("footage
supplied later") — a visitor reads it. Those belong in code comments.

---

## 7. Page narrative — the section order that sells

The order matters more than any individual section. This is the arc:

1. **Hero** — full-bleed film, one statement, one CTA. No scrim over the whole
   frame; use a *directional* gradient under the copy column plus `text-shadow`
   on the type, so half the picture stays at full brightness. A flat wash reads
   "too dark".
2. **The problem** — stated editorially, full-bleed band, **no solution named
   yet, and no claims.** Say what each moving part *is*, not what you improve
   about it. The point is the *weight* of the list.
3. **What it does** — the capability areas.
4. **Make it theirs** — an interactive selector (industry / use-case) that
   rewrites a panel on hover and navigates on press. This is the section that
   makes a generic product feel built for the reader.
5. **The technology** — a grid of tiles, each a device frame holding a still or
   a clip at one shared ratio. Aim for a 3-column grid; if the count doesn't
   divide, add an `aria-hidden` filler cell rather than leaving a hole.
6. **Proof / industries** — image visible at rest, words revealing on scroll.
7. **CTA** — quiet, single, no urgency copy.

Optional between 5 and 6: **"configured, not templated"** — before/after clip
pairs, full width, side by side at `sm:`. Not squeezed into a column.

### Interactive selector — the touch bug you will hit

A "hover to preview, click to go" control breaks on touch, because `focus`
fires before `click` and React flushes the state update between them, so the
"is this already active?" test in the click handler is always true and the
first tap navigates.

Fix: capture the gesture at `pointerdown` in a ref, and read the ref (not
state) in the click handler. `e.detail === 0` identifies a keyboard-triggered
click, which should navigate immediately.

```jsx
const activeRef  = useRef(0)
const gestureRef = useRef({ type: 'mouse', wasActive: true })

onPointerDown={(e) => { gestureRef.current = { type: e.pointerType, wasActive: activeRef.current === i } }}
onPointerEnter={(e) => { if (e.pointerType === 'mouse') select(i) }}
onFocus={() => select(i)}
onClick={(e) => {
  const g = gestureRef.current
  if (e.detail !== 0 && g.type !== 'mouse' && !g.wasActive) {
    select(i); panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    return                     // first tap previews
  }
  navigate()                   // second tap goes
}}
```

---

## 8. Copy voice

- **Short declarative sentences.** Full stops in headlines.
- **State facts, not benefits.** "Every channel settling through one payment
  layer." — not "Streamline your payments!"
- **No exclamation marks. No urgency. No superlatives. No emoji.**
- **No feature-speak in the problem section** — you haven't named a solution yet.
- Every line in a shared list must hold **in every industry you serve** — no
  software names, no product names, nothing tied to one trade.
- Numbers as small uppercase eyebrows: `SYSTEM 07`, `STEP 03`.
- If an image contradicts its caption, **fix the copy or the image**. Shipping a
  line written for a staffed till next to a picture of a self-serve webstore is
  the kind of thing a buyer notices and you don't.

---

## 9. Accessibility & semantics

- `<section id aria-label>` on every section; `id` doubles as the nav anchor.
- `html { scroll-behavior: smooth; scroll-padding-top: 5rem; }` so anchors clear
  the fixed nav — and `scroll-behavior: auto` under reduced motion.
- Heading levels stay semantic: `Display` takes an `as` prop, it is not always `h2`.
- Decorative media: `aria-hidden`. Meaningful media: a real `aria-label`.
- Every interactive element is a real `<button>` / `<a>` and is keyboard
  reachable — the hover-preview pattern above must work on `focus` too.
- Contrast: body copy never below `white/55`.

---

## 10. Performance checklist

- [ ] Every route `lazy()` + `<Suspense>`, footer included
- [ ] No unused branch pulling a chunk onto a page that never renders it
- [ ] Videos `preload="none"`, no `autoplay` attribute, started **and paused**
      by IntersectionObserver
- [ ] No `v.load()` after raising `preload`
- [ ] One `src` in the DOM, never a hidden second cut
- [ ] Clips cropped to their final ratio at encode time, faststart, silent
- [ ] Poster on every clip
- [ ] `content-visibility: auto` on below-the-fold sections
- [ ] No `<link rel=preload as=video>` in `index.html`
- [ ] Hero image eager; all others `loading="lazy" decoding="async"`
- [ ] Per-page `<title>` and meta description (easy to forget on a multi-page SPA)

---

## 11. Tailwind v4 gotchas that cost real time

- `scale-[1.05]` compiles to the CSS **`scale`** property, **not `transform`**.
  Testing for `transform` returns `none` while the element is visibly scaled.
- `hover:` utilities are emitted inside `@media (hover: hover)` — **invisible on
  touch**. Every hover affordance needs a tap path.
- **Framer writes animated values as inline `style`**, which outranks any
  Tailwind class. An entry animation and a hover filter must live on **separate
  elements**, or the hover silently never applies.
- A definite CSS `height` **defeats `aspect-ratio` under `max-width`** — the box
  gets clamped by width, keeps its height, and the ratio breaks. To fit both
  axes, measure the container (`useLayoutEffect` + `ResizeObserver` — measured
  before paint, so no 0×0 flash) and compute width and height yourself.
- An absolutely-positioned element with **only** a height has shrink-to-fit
  width, and collapses anything measuring it. Always give it a width too.

---

## 12. Working rules for the build

- **Measure, don't guess.** Crop boundaries, content bounding boxes, transfer
  sizes — read them programmatically. `content-length` is unreliable for video
  (range requests); use `performance.getEntriesByType('resource').transferSize`.
- **Back up originals** before any re-encode, outside the build output.
- Files dropped in `dist/` are wiped by the next build. Source assets live in
  `public/` or an unserved `Assets/` folder.
- Verify in a **real browser at several widths and on touch** before calling
  anything done — then regression-check every other page.
- **Comment the why, not the what.** Every non-obvious constant in this codebase
  carries the reason it is that number and what broke at the other value. Keep
  that habit; it is what makes the rules above survive the next edit.
