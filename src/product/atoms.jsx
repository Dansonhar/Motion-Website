import { motion } from 'framer-motion'
import { EASE } from '../motion/StickyStage.jsx'

/* ---------------------------------------------------------------------------
   Product UI atoms.

   The QBot and QStudio pages show the product by BUILDING it, not by
   photographing it. Every screen in ../product/screens.jsx is assembled from
   the pieces here — real DOM, so it animates, reflows and stays sharp at any
   density, and a state change is a transition rather than a cut between two
   pictures.

   The palette is the site's own: ink-950 ground, white hairlines, white type at
   three weights of opacity. There is no colour in this theme (see index.css —
   `accent` resolves to white and greys), so hierarchy is carried by opacity and
   scale alone. Do not introduce a hue here to signal state; use `strong`.
   --------------------------------------------------------------------------- */

/* Staggered entrance for the rows inside a screen. Applied by the screen, not
   by each row, so a swap animates as one interface arriving rather than eight
   independent elements. */
export const listIn = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045, delayChildren: 0.06 } },
}
export const itemIn = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
}

/* --------------------------------------------------------------------------
   Device — the frame the screens live in.

   `kind` changes the physical form factor and IS animatable: the QBot 3-in-1
   story morphs one device between counter, handheld and kiosk as the visitor
   scrolls, which is the entire argument for that product made without a
   sentence. The aspect ratio and corner radius animate; the screen inside
   simply reflows.
   -------------------------------------------------------------------------- */
/* THE DEVICE IS SIZED BY HEIGHT, NOT WIDTH, and this is load-bearing.

   These form factors run from 9:19.5 (a phone) to 16:10 (a counter terminal).
   Sized by width, the portrait ones resolve to something roughly twice the
   height of the landscape ones — so morphing between them would shove the
   surrounding layout up and down the page on every step. Pinning the HEIGHT to
   a share of a fixed stage box and letting width fall out of the aspect ratio
   keeps every form inside the same footprint, which is what makes the morph
   read as one object changing shape rather than the page reflowing.

   `h` is that share. `ratio` is w/h. */
const FORMS = {
  counter: { h: 0.74, ratio: 16 / 10, radius: 16, stand: true },
  handheld: { h: 0.92, ratio: 9 / 16, radius: 26, stand: false },
  kiosk: { h: 1, ratio: 10 / 16, radius: 14, stand: true },
  desktop: { h: 0.82, ratio: 16 / 10, radius: 12, stand: true },
  phone: { h: 0.96, ratio: 9 / 19.5, radius: 30, stand: false },
}

export function Device({ kind = 'desktop', children, className = '' }) {
  const form = FORMS[kind] || FORMS.desktop
  return (
    /* The stage box. Give this a height (it defaults to filling its parent) and
       every form factor stays inside it. */
    <div className={`flex h-full w-full items-center justify-center ${className}`}>
      {/* `initial={false}` so the first paint lands on the correct form factor
          instead of animating into it — and so height/aspectRatio are not
          declared twice (once in `style`, once in `animate`), which is how the
          two ended up fighting over which one the DOM actually got. */}
      <motion.div
        initial={false}
        animate={{
          height: `${form.h * 100}%`,
          aspectRatio: form.ratio,
          borderRadius: form.radius,
        }}
        transition={{ duration: 0.75, ease: EASE }}
        className="relative flex max-w-full border border-white/12 bg-ink-950 p-[6px] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]"
      >
        {/* The bezel highlight — one hairline gradient, no image. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[linear-gradient(160deg,rgba(255,255,255,0.10),transparent_42%)]"
        />
        <div className="relative min-h-0 w-full overflow-hidden rounded-[inherit] bg-ink-900">
          {children}
        </div>

        {/* Mounted forms stand on something. A hairline pedestal is enough to
            read as "fixed in place" without drawing furniture. */}
        <motion.span
          aria-hidden
          animate={{ opacity: form.stand ? 1 : 0, scaleX: form.stand ? 1 : 0.3 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="absolute inset-x-0 -bottom-2 mx-auto h-1.5 w-1/3 rounded-b-full bg-gradient-to-b from-white/18 to-transparent"
        />
      </motion.div>
    </div>
  )
}

/* --------------------------------------------------------------------------
   Screen chrome
   -------------------------------------------------------------------------- */

/* Top bar of any screen: what app this is, and that it is live. */
export function ScreenBar({ title, right, live = true }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/8 px-3 py-2 sm:px-4 sm:py-2.5">
      <div className="flex min-w-0 items-center gap-2">
        {live && (
          <span className="relative flex size-1.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/60" />
            <span className="relative inline-flex size-1.5 rounded-full bg-white/80" />
          </span>
        )}
        <span className="truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70 sm:text-[11px]">
          {title}
        </span>
      </div>
      {right && (
        <span className="shrink-0 text-[10px] font-medium tabular-nums text-white/35 sm:text-[11px]">
          {right}
        </span>
      )}
    </div>
  )
}

/* A list row — the workhorse of every screen. `strong` promotes it to the row
   the visitor is meant to look at. */
export function Row({ label, sub, value, strong = false, trailing }) {
  return (
    <motion.div
      variants={itemIn}
      className={`flex items-center justify-between gap-3 rounded-lg px-2.5 py-2 transition-colors sm:px-3 sm:py-2.5 ${
        strong ? 'bg-white/[0.07] ring-1 ring-white/15' : 'bg-white/[0.02]'
      }`}
    >
      <div className="min-w-0">
        <p
          className={`truncate text-[11px] font-semibold leading-tight sm:text-[12.5px] ${
            strong ? 'text-white' : 'text-white/80'
          }`}
        >
          {label}
        </p>
        {sub && (
          <p className="mt-0.5 truncate text-[9.5px] leading-tight text-white/40 sm:text-[10.5px]">
            {sub}
          </p>
        )}
      </div>
      {trailing ||
        (value && (
          <span
            className={`shrink-0 text-[11px] font-semibold tabular-nums sm:text-[12.5px] ${
              strong ? 'text-white' : 'text-white/55'
            }`}
          >
            {value}
          </span>
        ))}
    </motion.div>
  )
}

/* A metric tile — the unit the QHub dashboard is built from. */
export function Tile({ label, value, delta, wide = false }) {
  return (
    <motion.div
      variants={itemIn}
      className={`rounded-lg border border-white/8 bg-white/[0.03] p-2.5 sm:p-3 ${
        wide ? 'col-span-2' : ''
      }`}
    >
      <p className="truncate text-[8.5px] font-semibold uppercase tracking-[0.16em] text-white/40 sm:text-[9.5px]">
        {label}
      </p>
      <p className="mt-1 text-[15px] font-bold leading-none tabular-nums text-white sm:text-[19px]">
        {value}
      </p>
      {delta && (
        <p className="mt-1 text-[9px] font-medium tabular-nums text-white/45 sm:text-[10px]">
          {delta}
        </p>
      )}
    </motion.div>
  )
}

/* Capacity / progress bar. `fill` is 0–1. Animates from empty on mount, so a
   screen swap shows capacity filling rather than appearing already full. */
export function Bar({ fill = 0.5, className = '' }) {
  return (
    <span className={`block h-1 w-full overflow-hidden rounded-full bg-white/10 ${className}`}>
      <motion.span
        initial={{ scaleX: 0 }}
        animate={{ scaleX: Math.max(0, Math.min(1, fill)) }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
        className="block h-full origin-left rounded-full bg-white/70"
      />
    </span>
  )
}

/* Inline sparkline. Drawn, not plotted — the shape is decoration standing in
   for a trend, so it carries no axis, no scale and makes no claim.

   REVEALED BY CLIP, NOT BY `pathLength`. Framer implements pathLength with
   strokeDasharray, which is measured in user units — and this svg is stretched
   non-uniformly (`preserveAspectRatio="none"`) with a `non-scaling-stroke`.
   The dash pattern therefore scales with the box while the stroke does not, and
   the line renders as a row of disconnected segments instead of a curve.
   Clipping the container sidesteps the whole interaction: the geometry is drawn
   once, correctly, and a rectangle wipes across it. */
export function Spark({ points = [5, 11, 8, 16, 12, 21, 17, 26], className = '' }) {
  const max = Math.max(...points)
  const d = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * 100
      const y = 26 - (p / max) * 23
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

  return (
    <motion.div
      initial={{ clipPath: 'inset(0 100% 0 0)' }}
      animate={{ clipPath: 'inset(0 0% 0 0)' }}
      transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}
      className={`min-h-0 w-full ${className}`}
    >
      <svg
        viewBox="0 0 100 28"
        preserveAspectRatio="none"
        aria-hidden
        className="h-full min-h-7 w-full"
      >
        <path
          d={d}
          fill="none"
          stroke="rgba(255,255,255,0.75)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </motion.div>
  )
}

/* The body of a screen: pads the content and runs the stagger. */
export function ScreenBody({ children, className = '' }) {
  return (
    <motion.div
      variants={listIn}
      initial="hidden"
      animate="show"
      className={`flex min-h-0 flex-1 flex-col gap-1.5 overflow-hidden p-2.5 sm:gap-2 sm:p-3 ${className}`}
    >
      {children}
    </motion.div>
  )
}

/* The outer shell every screen returns. */
export function Screen({ children }) {
  return <div className="flex h-full w-full flex-col">{children}</div>
}
