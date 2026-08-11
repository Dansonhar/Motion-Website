import { CaseStudyVideo } from './SolutionMedia.jsx'
import { Display, Eyebrow, Lede, Reveal, SectionShell } from './SolutionPrimitives.jsx'

/* ---------------------------------------------------------------------------
   Section 8 — the industries, then the engagements.

   The sector list comes first and does the positioning work: this is not a
   restaurant practice, it is one operating model applied across customer-facing
   businesses. Each line names the sector and the one thing that makes its
   operation different, so the breadth reads as range rather than as a
   catch-all.

   The case studies below are engagements, not products. Every one carries the
   same four slots so they read as a consistent body of work.

   NOTHING IS INVENTED HERE. `business`, `challenge`, `solution` and `result`
   are intentionally empty — a fabricated result on a consultancy site is the
   one thing that would undo the whole positioning. Fill them in from the real
   engagements and each card renders the text in place of the rule.
   --------------------------------------------------------------------------- */
const SECTORS = [
  {
    n: '01',
    name: 'Restaurants & F&B',
    body: 'Service speed, order accuracy and turning covers without losing the room.',
  },
  {
    n: '02',
    name: 'Retail & Concept Stores',
    body: 'Stock, checkout and a shop floor that has to sell as well as display.',
  },
  {
    n: '03',
    name: 'Fitness & Wellness',
    body: 'Memberships, class capacity and unattended access at every hour.',
  },
  {
    n: '04',
    name: 'Attractions & Leisure',
    body: 'Ticketing, admission and crowd flow across a whole site.',
  },
  {
    n: '05',
    name: 'Hotels & Hospitality',
    body: 'Arrival, in-stay spend and every department reporting into one picture.',
  },
  {
    n: '06',
    name: 'Clinics & Appointment Services',
    body: 'Scheduling, practitioner time and records that follow the client.',
  },
  {
    n: '07',
    name: 'Entertainment & Events',
    body: 'Sessions, capacity and demand that arrives in peaks, not evenly.',
  },
  {
    n: '08',
    name: 'Multi-Site Groups & Franchises',
    body: 'One standard, many locations, and control that survives the distance.',
  },
]

const CASE_STUDIES = [
  { id: 'mks', name: 'MKS', business: null, challenge: null, solution: null, result: null },
  { id: 'owgh', name: 'OWGH', business: null, challenge: null, solution: null, result: null },
  { id: 'jadiaoc', name: 'JadiAOC', business: null, challenge: null, solution: null, result: null },
]

const SLOTS = [
  ['The Business', 'business'],
  ['The Challenge', 'challenge'],
  ['The Solution', 'solution'],
  ['The Result', 'result'],
]

export default function IndustriesSection() {
  return (
    <SectionShell id="industries" label="Industries and experience">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Reveal>
            <Eyebrow>Industries</Eyebrow>
            <Display className="mt-7 max-w-[14ch]">
              Different sectors.
              <br />
              Different operations.
              <br />
              Different solutions.
            </Display>
          </Reveal>
        </div>
        <div className="lg:col-span-4 lg:col-start-9 lg:pt-6">
          <Reveal delay={0.12}>
            <Lede>
              We work across customer-facing businesses, not one industry. None
              of these operations run the same way, so none of them were given
              the same system.
            </Lede>
          </Reveal>
        </div>
      </div>

      {/* The sector list — the breadth stated plainly, before any case study */}
      <div className="mt-20 grid grid-cols-1 border-t border-white/10 sm:mt-28 md:grid-cols-2">
        {SECTORS.map((s, i) => (
          <Reveal
            key={s.n}
            delay={(i % 2) * 0.08}
            className={`border-b border-white/10 py-10 sm:py-12 ${
              i % 2 === 0 ? 'md:pr-16' : 'md:border-l md:pl-16'
            }`}
          >
            <div className="flex items-baseline gap-6">
              <span className="text-sm font-semibold tracking-widest text-accent-400">{s.n}</span>
              <span className="h-px flex-1 bg-white/10" />
            </div>
            <h3 className="mt-6 text-[clamp(1.3rem,2vw,1.9rem)] leading-[1.15] font-bold tracking-tight text-white">
              {s.name}
            </h3>
            <Lede className="mt-4 max-w-md">{s.body}</Lede>
          </Reveal>
        ))}
      </div>

      <div className="mt-24 sm:mt-32">
        <Reveal>
          <Eyebrow>Experience</Eyebrow>
          <Display className="mt-7 max-w-[20ch]">Selected engagements.</Display>
        </Reveal>
      </div>

      <div id="work" className="mt-16 grid grid-cols-1 gap-10 scroll-mt-28 sm:mt-20 md:grid-cols-3 md:gap-8">
        {CASE_STUDIES.map((cs, i) => (
          <Reveal key={cs.id} delay={i * 0.1}>
            <article className="group">
              <CaseStudyVideo
                label={cs.name}
                caption="Concept film — supplied later"
                className="transition-opacity duration-700 group-hover:opacity-90"
              />
              <h3 className="mt-8 text-[clamp(1.35rem,2vw,1.9rem)] font-bold tracking-tight text-white">
                {cs.name}
              </h3>
              <dl className="mt-6 border-t border-white/10">
                {SLOTS.map(([label, key]) => (
                  <div key={key} className="border-b border-white/10 py-4">
                    <dt className="text-[11px] font-semibold uppercase tracking-widest text-white/55">
                      {label}
                    </dt>
                    <dd className="mt-2 text-sm leading-relaxed text-white">
                      {cs[key] || (
                        <span
                          className="block h-px w-10 bg-white/10"
                          aria-label="To be added"
                        />
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </article>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  )
}
