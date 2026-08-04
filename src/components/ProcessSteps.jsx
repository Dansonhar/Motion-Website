import { motion } from 'framer-motion'
import { MonitorSmartphone, ArrowRight, DoorClosed } from 'lucide-react'
import SectionHeading from './SectionHeading.jsx'

const PILLARS = [
  {
    icon: MonitorSmartphone,
    label: 'Self-Service Kiosk',
    points: ['Registration & renewal', 'Payments & class booking', 'QR / NFC check-in'],
  },
  {
    icon: DoorClosed,
    label: 'MT119-LED Turnstile',
    points: ['Instant access verification', 'Single-person entry', 'Auto-locking gate'],
  },
]

export default function ProcessSteps() {
  return (
    <section id="solutions" className="lazy-section relative py-24 sm:py-32">
      <div id="how-it-works" className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex justify-center">
          <SectionHeading
            eyebrow="How It Works"
            title="One Connected Gym Entrance"
            description="Members complete registration, payments and check-ins at the self-service kiosk. Once access is approved, the tripod turnstile unlocks automatically for secure entry."
          />
        </div>

        {/* Kiosk → Turnstile: two connected pillars */}
        <div className="mt-16 flex flex-col items-stretch gap-6 md:flex-row md:items-center md:gap-4">
          {PILLARS.map((pillar, index) => (
            <div key={pillar.label} className="contents">
              <motion.article
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="glass group flex-1 rounded-3xl p-8 transition-colors duration-300 hover:border-accent-500/30 lg:p-10"
              >
                <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-500/15 text-accent-400 ring-1 ring-accent-500/25 transition-colors duration-300 group-hover:bg-accent-500 group-hover:text-ink-950">
                  <pillar.icon size={26} strokeWidth={1.8} />
                </span>
                <h3 className="text-xl font-semibold tracking-tight">{pillar.label}</h3>
                <ul className="mt-4 space-y-2.5">
                  {pillar.points.map((point) => (
                    <li key={point} className="flex items-center gap-2.5 text-white/60">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
                      <span className="text-sm">{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.article>

              {/* Connector arrow between the two pillars */}
              {index === 0 && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mx-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-500 text-ink-950 md:mx-0"
                >
                  <ArrowRight size={20} className="max-md:rotate-90" />
                </motion.span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
