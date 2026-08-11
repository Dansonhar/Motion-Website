import { motion } from 'framer-motion'
import { CinematicVideo } from './SolutionMedia.jsx'
import { Display, EASE, Eyebrow, Lede, Reveal, SectionShell } from './SolutionPrimitives.jsx'

/* The invisible complexity behind any serious operation, whatever the sector.
   Deliberately named as bare nouns — no software, no product names, nothing
   that ties the list to one industry. The point is the weight of the list, not
   what solves it. */
const MOVING_PARTS = [
  'Customers',
  'Orders',
  'Payments',
  'Reservations',
  'Staff',
  'Inventory',
  'Marketing',
  'Loyalty',
  'Reporting',
  'Multiple locations',
  'Management',
  'Growth',
]

/* ---------------------------------------------------------------------------
   Section 2 — the problem, stated editorially. No solution named yet.
   --------------------------------------------------------------------------- */
export default function ProblemSection() {
  return (
    <SectionShell id="about" label="The problem">
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <Reveal>
            <Eyebrow>The reality of the business</Eyebrow>
            <Display className="mt-7 max-w-[18ch]">
              A successful business is more than what the customer sees.
            </Display>
          </Reveal>
        </div>

        <div className="lg:col-span-5 lg:pt-4">
          <Reveal delay={0.12}>
            <CinematicVideo
              ratio="portrait"
              label="Film 01"
              caption="Interior detail — the room, the counter, the quiet before opening"
              className="rounded-2xl border border-white/10"
            />
          </Reveal>
        </div>
      </div>

      {/* The moving parts, revealed one at a time as a slow editorial list */}
      <div className="mt-20 border-t border-white/10 sm:mt-28">
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {MOVING_PARTS.map((part, i) => (
            <motion.li
              key={part}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-8% 0px' }}
              transition={{ duration: 0.9, delay: (i % 4) * 0.06, ease: EASE }}
              className="border-b border-r border-white/10 px-1 py-7 sm:py-9"
            >
              <span className="text-[clamp(1.05rem,1.7vw,1.6rem)] font-bold tracking-tight text-white">
                {part}.
              </span>
            </motion.li>
          ))}
        </ul>
      </div>

      <div className="mt-20 grid grid-cols-1 gap-10 lg:grid-cols-12 sm:mt-28">
        <div className="lg:col-span-6 lg:col-start-7">
          <Reveal>
            <p className="text-[clamp(1.35rem,2.3vw,2.15rem)] leading-[1.35] font-bold tracking-tight text-white">
              When these parts operate separately, complexity grows with the
              business.
            </p>
            <Lede className="mt-8">We bring them together.</Lede>
          </Reveal>
        </div>
      </div>
    </SectionShell>
  )
}
