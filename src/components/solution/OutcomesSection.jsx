import { Display, Eyebrow, Lede, Reveal, SectionShell } from './SolutionPrimitives.jsx'

/* Outcomes, not features. Each is stated as a change in how the business runs —
   no numbers, because none have been measured yet. */
const OUTCOMES = [
  {
    n: '01',
    title: 'Run with less friction',
    body: 'Reduce unnecessary manual processes and operational complexity.',
  },
  {
    n: '02',
    title: 'See the business clearly',
    body: 'Understand sales, customers and operations without digging through disconnected systems.',
  },
  {
    n: '03',
    title: 'Create a better customer experience',
    body: 'Make interactions with the business faster, easier and more consistent.',
  },
  {
    n: '04',
    title: 'Capture more revenue',
    body: 'Remove friction between customer intent and purchase.',
  },
  {
    n: '05',
    title: 'Build customer relationships',
    body: 'Create a stronger connection with customers beyond a single transaction.',
  },
  {
    n: '06',
    title: 'Prepare to scale',
    body: 'Build an infrastructure capable of supporting future locations and growth.',
  },
]

/* ---------------------------------------------------------------------------
   Section 6 — business outcomes.
   --------------------------------------------------------------------------- */
export default function OutcomesSection() {
  return (
    <SectionShell label="Business outcomes">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Reveal>
            <Eyebrow>Outcomes</Eyebrow>
            <Display className="mt-7 max-w-[15ch]">
              Designed around outcomes that matter.
            </Display>
          </Reveal>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 border-t border-white/10 sm:mt-28 md:grid-cols-2">
        {OUTCOMES.map((o, i) => (
          <Reveal
            key={o.n}
            delay={(i % 2) * 0.08}
            className={`border-b border-white/10 py-12 sm:py-16 md:px-0 ${
              i % 2 === 0 ? 'md:pr-16' : 'md:border-l md:pl-16'
            }`}
          >
            <div className="flex items-baseline gap-6">
              <span className="text-sm font-semibold tracking-widest text-accent-400">{o.n}</span>
              <span className="h-px flex-1 bg-white/10" />
            </div>
            <h3 className="mt-7 text-[clamp(1.4rem,2.2vw,2.1rem)] leading-[1.15] font-bold tracking-tight text-white">
              {o.title}
            </h3>
            <Lede className="mt-5 max-w-md">{o.body}</Lede>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  )
}
