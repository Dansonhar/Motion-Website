import { CinematicVideo } from './SolutionMedia.jsx'

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

/* ---------------------------------------------------------------------------
   Section 3 — what we actually solve.
   --------------------------------------------------------------------------- */
export default function SolutionAreas() {
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
          would be unreadable, so the row becomes a snap-scrolling strip — still
          a single left-to-right row, just dragged rather than seen all at once.

          `-mx-6 px-6` lets the strip bleed to the screen edge while keeping the
          first card aligned to the section's gutter; `scroll-pl-*` matches that
          gutter, or the snapport would start at the padding edge and card 01
          would snap flush against the screen edge. */}
      <div
        className="mt-14 -mx-6 flex snap-x snap-mandatory scroll-pl-6 gap-5 overflow-x-auto px-6 pb-4 sm:-mx-10 sm:mt-16 sm:scroll-pl-10 sm:px-10 lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-7 lg:overflow-visible lg:px-0 lg:pb-0"
      >
        {AREAS.map((area, i) => (
          <Reveal
            key={area.n}
            delay={i * 0.08}
            className="w-[74vw] max-w-[320px] shrink-0 snap-start lg:w-auto lg:max-w-none"
          >
            <article className="flex h-full flex-col">
              {/* Vertical footage — a 9:16 frame so nothing is cropped. */}
              <CinematicVideo
                ratio="tall"
                src={area.film ? `${BASE}video/solution/${area.film}.mp4` : undefined}
                poster={area.film ? `${BASE}video/solution/${area.film}-poster.jpg` : undefined}
                label={`Film ${area.n}`}
                caption={area.caption}
                className="w-full rounded-2xl border border-white/10"
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
