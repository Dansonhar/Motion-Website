import { useCallback, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useSimpleMotion } from './env.js'

/* ---------------------------------------------------------------------------
   StickyStage — scroll storytelling.

   The section pins to the viewport and the CONTENT changes as the visitor
   scrolls. It is the same rig the Gym and Theme Park heroes already use (a tall
   container driving `scrollYProgress`, a `sticky top-0 h-[100svh]` stage), with
   two differences that matter for a product story rather than a film:

   1. It resolves to a discrete STEP INDEX, not a continuous 0–1 float. A film
      scrubs; a product interface switches between states. Cross-fading on an
      index gives a clean swap and means a step can be added or removed without
      re-tuning six hand-authored [in, hold, hold, out] ranges — which is what
      Hero.jsx and ThemeParkHero.jsx both have to do today.

   2. It is steerable. `onSeek` scrolls the page to a given step, so the rail
      below the stage is a control, not just a progress read-out. Scroll
      storytelling that cannot be jumped through is a video with extra steps.

   MOBILE AND REDUCED MOTION GET NO STAGE AT ALL. `simple` renders the steps as
   an ordinary stacked list. Pinning 500vh under a thumb is how a phone user
   loses the ability to leave a section, and a pinned stage cannot be scrubbed
   at all by someone who has asked for reduced motion.

   THE PARENT MUST NOT SET `overflow-*`. `overflow-x: hidden` computes
   `overflow-y: auto`, which makes the ancestor a scroll container and silently
   kills `position: sticky`. Both site wrappers carry a note about this.
   --------------------------------------------------------------------------- */

export const EASE = [0.16, 1, 0.3, 1]

export function StickyStage({
  count,
  /* Scroll runway per step. Below ~70 the steps flick past faster than the
     cross-fade can resolve; above ~110 the section feels stuck. */
  vhPerStep = 90,
  id,
  label,
  className = '',
  children,
  fallback,
}) {
  const { simple } = useSimpleMotion()
  const ref = useRef(null)
  const [index, setIndex] = useState(0)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  /* Progress is measured across the whole runway, but the LAST step has to hold
     for a full slot rather than existing only at progress === 1 — which is a
     single pixel of scroll. Mapping through `count` and clamping does that: each
     step owns 1/count of the travel, and the final one keeps its slot to the
     end. */
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const next = Math.min(count - 1, Math.max(0, Math.floor(v * count)))
    setIndex((prev) => (prev === next ? prev : next))
  })

  /* Scroll to the middle of a step's slot. Reading the container's live rect
     rather than caching offsets keeps this correct after a resize or a lazy
     section above it changing height. */
  const seek = useCallback(
    (i) => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const top = rect.top + window.scrollY
      const runway = el.offsetHeight - window.innerHeight
      if (runway <= 0) return
      window.scrollTo({
        top: top + runway * ((i + 0.5) / count),
        behavior: 'smooth',
      })
    },
    [count],
  )

  if (simple) {
    return (
      <section id={id} aria-label={label} className={className}>
        {fallback}
      </section>
    )
  }

  return (
    <section
      id={id}
      aria-label={label}
      ref={ref}
      className={`relative ${className}`}
      style={{ height: `${count * vhPerStep + 100}vh` }}
    >
      <div className="sticky top-0 flex h-[100svh] w-full items-center overflow-hidden">
        {children({ index, count, seek, progress: scrollYProgress })}
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------------------
   Swap — the cross-fade between two states of the same thing.

   `mode="wait"` on purpose: the outgoing state finishes leaving before the new
   one arrives, so two versions of an interface are never on screen together.
   A product screen showing two states at once reads as a glitch, not a
   transition.
   --------------------------------------------------------------------------- */
export function Swap({ id, children, y = 18, duration = 0.5, className = '' }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={id}
        initial={{ opacity: 0, y }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -y }}
        transition={{ duration, ease: EASE }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

/* ---------------------------------------------------------------------------
   StepRail — the story's index, and its remote control.

   Horizontal on wide screens, and it is a real <button> per step so the
   sequence is keyboard-reachable. Without this the only way through a 700vh
   pinned section is to scroll all of it.
   --------------------------------------------------------------------------- */
/* LABELS ONLY UP TO FOUR STEPS. Past that they are narrower than the words
   they hold, and seven truncated captions under seven hairlines read as
   damage — which is exactly what the seven-step journey rail did. Longer
   sequences get a position read-out instead; the step's own headline is
   already the biggest thing on screen, so the label was redundant there
   anyway. */
const LABEL_LIMIT = 4

export function StepRail({ steps, index, onSeek, className = '' }) {
  const showLabels = steps.length <= LABEL_LIMIT

  return (
    <div className={className}>
      <nav aria-label="Story steps" className="flex items-stretch gap-1.5 sm:gap-2">
        {steps.map((s, i) => {
          const active = i === index
          const done = i < index
          return (
            <button
              key={s.id || s.title || i}
              type="button"
              onClick={() => onSeek(i)}
              aria-current={active ? 'step' : undefined}
              aria-label={`Step ${i + 1}: ${s.title}`}
              className="group relative flex-1 py-3 outline-none"
            >
              <span
                className={`block h-[2px] w-full rounded-full transition-colors duration-500 ${
                  active
                    ? 'bg-white'
                    : done
                      ? 'bg-white/45'
                      : 'bg-white/15 group-hover:bg-white/35 group-focus-visible:bg-white/35'
                }`}
              />
              {showLabels && (
                <span
                  className={`mt-2.5 block truncate text-[10px] font-semibold uppercase tracking-widest transition-colors duration-500 ${
                    active ? 'text-white' : 'text-white/35 group-hover:text-white/70'
                  }`}
                >
                  {s.title}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {!showLabels && (
        <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.25em] tabular-nums text-white/35">
          {String(index + 1).padStart(2, '0')}
          <span className="text-white/20"> / {String(steps.length).padStart(2, '0')}</span>
        </p>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------------------
   ScrollCue — shown only while the visitor has not yet moved. It fades on the
   first fraction of the runway, so it never sits over the story it introduced.
   --------------------------------------------------------------------------- */
export function ScrollCue({ progress, label = 'Scroll' }) {
  const [gone, setGone] = useState(false)
  useMotionValueEvent(progress, 'change', (v) => setGone(v > 0.02))
  return (
    <motion.div
      aria-hidden
      animate={{ opacity: gone ? 0 : 1 }}
      transition={{ duration: 0.4 }}
      className="pointer-events-none absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1.5 text-white/45"
    >
      <span className="text-[10px] font-semibold uppercase tracking-[0.3em]">{label}</span>
      <motion.span
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="block h-3 w-px bg-white/45"
      />
    </motion.div>
  )
}
