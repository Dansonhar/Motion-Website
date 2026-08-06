import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function CallToAction() {
  return (
    <section id="contact" className="lazy-section relative px-5 py-24 sm:px-8 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] border border-accent-500/20 bg-ink-900 px-6 py-16 text-center sm:px-16 sm:py-24"
      >
        {/* Green accent glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-accent-600/20 blur-3xl"
        />

        <div className="relative">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-accent-400">
            Get Started
          </p>
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">
            Give Members a Faster Way In
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">
            Self-service sign-up, face-verified entry and AI-monitored turnstiles —
            one connected system from the app to the gym floor.
          </p>
          <div className="mt-9 flex justify-center">
            <a
              href="#top"
              className="group inline-flex items-center gap-2 rounded-full bg-accent-500 px-8 py-4 text-base font-semibold text-ink-950 shadow-lg shadow-accent-500/25 transition-all hover:-translate-y-0.5 hover:bg-accent-400"
            >
              Schedule a Demo
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
