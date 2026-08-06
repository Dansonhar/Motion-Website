import { motion } from 'framer-motion'
import { Headphones, Gauge, ShieldCheck, Network } from 'lucide-react'
import SectionHeading from './SectionHeading.jsx'

const BENEFITS = [
  {
    icon: Headphones,
    title: 'Reduce Front-Desk Workload',
    description:
      'Automate sign-ups, renewals and payments so staff focus on members, not admin.',
  },
  {
    icon: Gauge,
    title: 'Faster Member Check-Ins',
    description:
      'Members are recognised on approach and through the gate in seconds — even at peak.',
  },
  {
    icon: ShieldCheck,
    title: 'Stop Shared Memberships',
    description:
      'Face verification ties every entry to a real member, so passes can’t be handed around.',
  },
  {
    icon: Network,
    title: 'Oversight From Anywhere',
    description:
      'Telegram alerts land with photo and video, so owners can check any outlet without being on site.',
  },
]

export default function Benefits() {
  return (
    <section className="lazy-section relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Operational Benefits"
          title="Built for How Gyms Actually Run"
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((benefit, index) => (
            <motion.article
              key={benefit.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -6 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.55,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="glass group rounded-2xl p-7 transition-colors duration-300 hover:border-accent-500/30"
            >
              <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-500/12 text-accent-400 ring-1 ring-accent-500/20 transition-colors duration-300 group-hover:bg-accent-500 group-hover:text-ink-950">
                <benefit.icon size={22} strokeWidth={1.8} />
              </span>
              <h3 className="text-lg font-semibold tracking-tight">
                {benefit.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">
                {benefit.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
