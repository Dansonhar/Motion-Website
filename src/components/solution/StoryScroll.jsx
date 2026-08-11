import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FullscreenStoryVideo, usePrefersReducedMotion } from './SolutionMedia.jsx'
import { EASE } from './SolutionPrimitives.jsx'

/* Five beats of one trading day, each a full-screen film with a single line over
   it. The day belongs to any business, so the footage cuts between sectors
   rather than staying in one room. `line` is the narrative; `label`/`caption`
   describe the footage to shoot. */
const BEATS = [
  {
    n: '01',
    label: 'Video 01',
    caption: 'Before Opening — a premium venue, store and studio preparing to trade',
    line: 'Before the doors open.',
  },
  {
    n: '02',
    label: 'Video 02',
    caption: 'Peak Trade — customers arriving, staff working, counters and floors busy',
    line: 'While the business is at its busiest.',
  },
  {
    n: '03',
    label: 'Video 03',
    caption: 'Owner / Management — reviewing performance across sites, away from the floor',
    line: 'After the last customer leaves.',
  },
  {
    n: '04',
    label: 'Video 04',
    caption: 'Customer Journey — discovery, purchase and returning again',
    line: 'The business should keep working.',
  },
  {
    n: '05',
    label: 'Video 05',
    caption: 'Expansion — multiple locations across different sectors, one larger operation',
    line: 'One operation.\nDesigned to work together.',
  },
]

/* ---------------------------------------------------------------------------
   Section 5 — cinematic scrolling story.

   A tall track with one pinned stage; each beat cross-fades as the track
   scrolls. Only the pinned child is sticky and nothing above it sets
   `overflow`, which would silently turn an ancestor into a scroll container and
   break the pin.
   --------------------------------------------------------------------------- */
export default function StoryScroll() {
  const trackRef = useRef(null)
  const reduced = usePrefersReducedMotion()
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  })

  // Reduced motion: no pinning, no cross-fades — just the beats stacked.
  if (reduced) {
    return (
      <section aria-label="The business story" className="border-t border-white/10">
        {BEATS.map((b) => (
          <div key={b.n} className="relative h-[70svh] min-h-[420px] w-full">
            <FullscreenStoryVideo label={b.label} caption={b.caption} overlay={0.5}>
              <StoryLine beat={b} />
            </FullscreenStoryVideo>
          </div>
        ))}
      </section>
    )
  }

  const span = 1 / BEATS.length

  return (
    <section
      ref={trackRef}
      aria-label="The business story"
      className="relative h-[500svh] border-t border-white/10"
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {BEATS.map((beat, i) => {
          const start = i * span
          const end = start + span
          // Hold each beat, cross-fading through a short overlap at the seams.
          const fadeIn = i === 0 ? start : start - span * 0.18
          const fadeOut = i === BEATS.length - 1 ? end : end + span * 0.02
          return (
            <Beat
              key={beat.n}
              beat={beat}
              progress={scrollYProgress}
              range={[fadeIn, start + span * 0.16, end - span * 0.1, fadeOut]}
              isFirst={i === 0}
              isLast={i === BEATS.length - 1}
            />
          )
        })}

        {/* progress rail */}
        <div className="pointer-events-none absolute bottom-8 left-6 right-6 z-20 sm:left-10 sm:right-10">
          <div className="flex gap-2">
            {BEATS.map((b, i) => (
              <RailSegment
                key={b.n}
                progress={scrollYProgress}
                range={[i * span, (i + 1) * span]}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Beat({ beat, progress, range, isFirst, isLast }) {
  const opacity = useTransform(
    progress,
    range,
    [isFirst ? 1 : 0, 1, 1, isLast ? 1 : 0],
  )
  // Very slight push in — enough to feel alive, not enough to notice as motion.
  const scale = useTransform(progress, [range[0], range[3]], [1.06, 1])

  return (
    <motion.div style={{ opacity }} className="absolute inset-0">
      <motion.div style={{ scale }} className="absolute inset-0">
        <FullscreenStoryVideo label={beat.label} caption={beat.caption} overlay={0.5} />
      </motion.div>
      <div className="absolute inset-0 flex items-center">
        <StoryLine beat={beat} />
      </div>
    </motion.div>
  )
}

function StoryLine({ beat }) {
  return (
    <div className="mx-auto w-full max-w-[1500px] px-6 sm:px-10">
      <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-accent-400">
        {beat.n}
      </p>
      <p className="max-w-[18ch] text-[clamp(2rem,5.4vw,5rem)] leading-[1.03] font-bold tracking-tight whitespace-pre-line text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.55)]">
        {beat.line}
      </p>
    </div>
  )
}

function RailSegment({ progress, range }) {
  const scaleX = useTransform(progress, range, [0, 1], { clamp: true })
  return (
    <div className="h-px flex-1 bg-white/20">
      <motion.div style={{ scaleX }} className="h-full origin-left bg-accent-400" />
    </div>
  )
}
