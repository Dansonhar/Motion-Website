import { useEffect, useRef } from 'react'
import { CinematicVideo, usePrefersReducedMotion } from './SolutionMedia.jsx'

const BASE = import.meta.env.BASE_URL
import { Display, Eyebrow, Reveal, SectionShell } from './SolutionPrimitives.jsx'

/* Five consulting capabilities — not feature cards. All five sit on one row so
   the whole offer is visible at a glance, read left to right 01 → 05, with each
   film playing beside its own heading.

   The five capabilities. Each is stated so it holds for any sector we work in —
   a restaurant, a store, a gym, a clinic, an attraction — because the same five
   problems turn up in all of them.

   `film` names a clip in public/video/solution/ — every one is 720x1280, so the
   frame is 9:16 and nothing gets cropped. `caption` describes what is actually
   on screen, not what we wish were; the clips deliberately span sectors. */
const AREAS = [
  {
    n: '01',
    title: 'Customer Experience',
    body: 'Design smoother customer journeys from discovery and arrival through ordering, booking, payment and returning again.',
    film: 'area-01-guest-experience',
    caption: 'Booking in the app, then arriving at the studio',
  },
  {
    n: '02',
    title: 'Operations',
    body: 'Remove unnecessary manual work, disconnected processes and operational friction from the everyday running of the business.',
    film: 'area-02-operations',
    caption: 'Classes running to a shared timetable and smart calendar',
  },
  {
    n: '03',
    title: 'Management & Control',
    body: 'Give owners and management a clearer view of what is happening across every site without needing to constantly be physically present.',
    film: 'area-03-management',
    caption: 'Revenue and bookings reviewed away from the business',
  },
  {
    n: '04',
    title: 'Revenue & Retention',
    body: 'Build systems that help the business capture more opportunities to sell, communicate with customers and encourage repeat business.',
    film: 'area-04-revenue',
    caption: 'Self-service kiosk — buying without queueing',
  },
  {
    n: '05',
    title: 'Scale',
    body: 'Create an operating foundation that can support additional locations, new formats, larger teams and greater transaction volume without multiplying complexity.',
    film: 'area-05-scale',
    caption: 'A larger operation: treatment rooms, lounge, one system',
  },
]

/* Below `lg` the row of films is a horizontal scroller, and a mouse only emits
   vertical wheel deltas — so without this the strip is unreachable with a mouse.
   The delta is turned into horizontal movement and eased toward a target rather
   than applied straight to scrollLeft, which is what makes it glide instead of
   jumping a notch per click.

   Two rules keep it from feeling like a hijack:
   - a gesture that is already horizontal (trackpad, shift+wheel) is left alone;
   - once the strip hits either end the wheel is released back to the page, so
     scrolling never gets trapped in this section. */
const EASE_FACTOR = 0.18

function useWheelToHorizontal(reduced) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return

    let target = null
    let raf = 0

    const step = () => {
      // A cancel (touch/pointer) can clear the target between frames; without
      // this guard `target - scrollLeft` reads null as 0 and eases back to the
      // start instead of stopping where it is.
      if (target === null) {
        raf = 0
        return
      }
      const delta = target - el.scrollLeft
      if (Math.abs(delta) < 0.5) {
        el.scrollLeft = target
        target = null
        raf = 0
        return
      }
      el.scrollLeft += delta * EASE_FACTOR
      raf = requestAnimationFrame(step)
    }

    const onWheel = (e) => {
      const max = el.scrollWidth - el.clientWidth
      if (max <= 0) return // lg and up: it's a grid, nothing to scroll
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return // already horizontal

      // Compare against the target, not scrollLeft: mid-ease the strip lags
      // behind where it is headed, and testing the live position would hand the
      // gesture to the page while there was still strip left to travel.
      const from = target ?? el.scrollLeft
      // Release to the page only once the strip is parked at the end the
      // gesture is pushing toward.
      if ((e.deltaY < 0 && from <= 0) || (e.deltaY > 0 && from >= max)) return

      e.preventDefault()
      // Clamped, so a fast flick settles exactly on the end rather than
      // overshooting into a range the strip can never reach.
      target = Math.min(max, Math.max(0, from + e.deltaY))
      if (reduced) {
        el.scrollLeft = target
        target = null
      } else if (!raf) {
        raf = requestAnimationFrame(step)
      }
    }

    // A touch drag scrolls natively; cancel any in-flight easing so the two
    // don't fight over scrollLeft.
    const cancel = () => {
      target = null
      if (raf) cancelAnimationFrame(raf)
      raf = 0
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('touchstart', cancel, { passive: true })
    el.addEventListener('pointerdown', cancel, { passive: true })
    return () => {
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('touchstart', cancel)
      el.removeEventListener('pointerdown', cancel)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [reduced])
  return ref
}

/* ---------------------------------------------------------------------------
   Section 3 — what we actually solve.
   --------------------------------------------------------------------------- */
export default function SolutionAreas() {
  const reduced = usePrefersReducedMotion()
  const stripRef = useWheelToHorizontal(reduced)

  return (
    <SectionShell id="solutions" label="What we solve">
      {/* Two lines, not four — the row of films sits directly under this, so
          every line the headline wraps to pushes the whole row off screen. */}
      <Reveal>
        <Eyebrow>What we solve</Eyebrow>
        <Display className="mt-7 max-w-[34ch]">
          We don&rsquo;t start with technology.
          <br />
          We start with your business.
        </Display>
      </Reveal>

      {/* One row, 01 → 05, every film visible at once. Below `lg` five columns
          would be unreadable, so the row becomes a scrolling strip — still a
          single left-to-right row, just scrolled rather than seen all at once.

          `-mx-6 px-6` lets the strip bleed to the screen edge while keeping the
          first card aligned to the section's gutter.

          No scroll-snap: mandatory snapping pulls against the eased wheel
          motion above and lands with a jerk. Free scrolling is what reads as
          smooth. `overscroll-x-contain` stops a fast flick at either end from
          triggering the browser's back-navigation gesture. */}
      <div
        ref={stripRef}
        /* `touch-auto`, NOT `touch-pan-x`. `pan-x` permits only horizontal
           panning on this element: a vertical swipe that starts anywhere in
           the strip — which is most of the screen on a phone — is neither
           acted on nor passed up, so the page cannot be scrolled from here.
           `auto` lets the browser resolve direction from the gesture itself:
           drag sideways and the strip moves, drag down and the page moves.
           It also leaves pinch-zoom intact, which `pan-x pan-y` would not.

           `pb-8` IS LOAD-BEARING — it must stay >= Reveal's translate (28px).
           `overflow-x: auto` forces `overflow-y` to compute to `auto`, so this
           strip is a VERTICAL scroll container as well, whether or not that
           was intended. Cards 3-5 start life at translateY(28px) and never
           reveal until they are scrolled into view horizontally, so with the
           old `pb-4` (16px) they poked 12px past the padding box — giving the
           strip 12px of real vertical travel. Chrome then latched a downward
           swipe to those 12px instead of passing it to the page, which made
           the section impossible to scroll past by dragging on a film. Padding
           the translate means scrollHeight === clientHeight and the gesture
           chains straight through. */
        className="mt-12 -mx-6 flex touch-auto gap-5 overflow-x-auto overscroll-x-contain px-6 pb-8 sm:-mx-10 sm:mt-16 sm:px-10 lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-7 lg:overflow-visible lg:px-0 lg:pb-0"
      >
        {AREAS.map((area, i) => (
          <Reveal
            key={area.n}
            delay={i * 0.08}
            className="w-[74vw] max-w-[320px] shrink-0 lg:w-auto lg:max-w-none"
          >
            <article className="flex h-full flex-col">
              {/* 4:5 while this is a scrolling strip, 9:16 once it becomes the
                  five-column grid at `lg`.

                  The footage is 720x1280, so 9:16 crops nothing — but on a
                  phone a full 9:16 frame at this card width runs about 500px
                  tall, which is most of the screen for one of five cards and
                  pushes the heading and body off-screen. 4:5 takes a centre
                  crop (~30% off the height); checked against a mid frame of
                  all five films, none of them lose their subject.

                  The ratio is switched with a responsive utility rather than
                  the component's `ratioMobile` prop on purpose: this needs to
                  change at `lg`, where the LAYOUT changes, and `ratioMobile`
                  is driven by a 767px JS media query — which would have left
                  tablets at 320x569. Two arbitrary `aspect-*` utilities are
                  safe here because Tailwind emits responsive variants after
                  base, so `lg:` wins regardless of class order. */}
              <CinematicVideo
                ratio="portrait"
                src={area.film ? `${BASE}video/solution/${area.film}.mp4` : undefined}
                poster={area.film ? `${BASE}video/solution/${area.film}-poster.jpg` : undefined}
                label={`Film ${area.n}`}
                caption={area.caption}
                className="w-full rounded-2xl border border-white/10 lg:aspect-[9/16]"
              />

              <div className="mt-7 flex items-baseline gap-4">
                <span className="text-sm font-semibold tracking-widest text-accent-400">
                  {area.n}
                </span>
                <span className="h-px flex-1 bg-white/10" />
              </div>
              <h3 className="mt-5 text-[clamp(1.25rem,1.6vw,1.7rem)] leading-[1.15] font-bold tracking-tight text-white">
                {area.title}
              </h3>
              {/* Not <Lede> — its clamp() font-size and this column's smaller
                  one are both arbitrary utilities, so which wins depends on
                  stylesheet order rather than class order. Set it directly. */}
              <p className="mt-4 text-[0.95rem] leading-relaxed text-white/75">{area.body}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  )
}
