import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function KioskCallToAction() {
  return (
    <section id="kiosk-contact" className="relative overflow-hidden bg-ink-950 py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_120%_at_50%_0%,rgba(255,255,255,0.08),transparent_60%)]" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-3xl px-6 text-center"
      >
        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
          See the kiosk in person.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-white/55">
          Book a walkthrough and we’ll show you how fast the kiosk deploys,
          services and scales across your floor.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#kiosk-contact"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.03]"
          >
            Book a Demo
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#parts"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Explore the modules
          </a>
        </div>
      </motion.div>
    </section>
  )
}
