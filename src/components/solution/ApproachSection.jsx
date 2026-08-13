import { motion } from 'framer-motion'
import { Display, EASE, Eyebrow, Lede, Reveal, SectionShell } from './SolutionPrimitives.jsx'

/* A bespoke engagement, not a sign-up funnel. Six stages, each stated as
   something we do — never as something the client selects or installs. */
const STAGES = [
  {
    n: '01',
    title: 'Understand',
    body: 'We study the concept, the customer journey, the team and the existing operation — in whichever sector the business trades.',
  },
  {
    n: '02',
    title: 'Identify',
    body: 'We identify friction, unnecessary cost, missed revenue opportunities and operational bottlenecks.',
  },
  {
    n: '03',
    title: 'Design',
    /* Was "the right operational ecosystem" — the one piece of vendor-speak
       left on the page, and the vaguest of the six bodies, which made the
       central step of the engagement read as the emptiest. */
    body: 'We design how the business should run — the flow of work, who does what, and the systems that carry it.',
  },
  {
    n: '04',
    title: 'Implement',
    body: 'Technology, workflows and customer touchpoints are brought together into one connected environment.',
  },
  {
    n: '05',
    title: 'Optimise',
    // "real business activity" implied the five steps before it used fake data.
    body: 'We refine the operation using how it actually trades once it is open.',
  },
  {
    n: '06',
    title: 'Scale',
    body: 'The foundation is prepared to grow alongside new customers, employees and locations.',
  },
]

/* ---------------------------------------------------------------------------
   Section 4 — the engagement. A single vertical spine with the stages hung off
   it, so it reads as one continuous process rather than six separate steps.
   --------------------------------------------------------------------------- */
export default function ApproachSection() {
  return (
    <SectionShell id="approach" label="Our approach">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Reveal>
            <Eyebrow>Our approach</Eyebrow>
            <Display className="mt-7">Built around your operation.</Display>
          </Reveal>
        </div>
        <div className="lg:col-span-5 lg:col-start-8 lg:pt-6">
          <Reveal delay={0.12}>
            <Lede>
              No two businesses look the same and no two operations work the
              same way, whatever the sector — so the system behind each one is
              designed around the business, never the other way around.
            </Lede>
          </Reveal>
        </div>
      </div>

      <ol className="relative mt-12 sm:mt-16">
        {/* the spine */}
        <div
          aria-hidden="true"
          className="absolute left-0 top-2 hidden h-full w-px bg-white/10 sm:block"
        />
        {STAGES.map((s, i) => (
          <motion.li
            key={s.n}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15% 0px' }}
            transition={{ duration: 1, delay: 0.05, ease: EASE }}
            className="relative grid grid-cols-1 gap-4 border-t border-white/10 py-10 sm:grid-cols-12 sm:gap-8 sm:py-14 sm:pl-10"
          >
            {/* node on the spine */}
            <span
              aria-hidden="true"
              className="absolute left-[-3px] top-[calc(3.5rem-3px)] hidden h-[7px] w-[7px] rotate-45 bg-accent-400 sm:block"
            />
            <span className="text-sm font-semibold tracking-widest text-accent-400 sm:col-span-2">
              {s.n}
            </span>
            <h3 className="text-[clamp(1.5rem,2.4vw,2.3rem)] leading-[1.15] font-bold tracking-tight text-white sm:col-span-4">
              {s.title}
            </h3>
            <div className="sm:col-span-6">
              <Lede>{s.body}</Lede>
            </div>
          </motion.li>
        ))}
      </ol>
    </SectionShell>
  )
}
