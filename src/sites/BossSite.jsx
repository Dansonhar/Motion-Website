import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'

// Placeholder scaffold for the "Boss" attraction — ready for real content
// (videos / images / scroll effects) once provided.
export default function BossSite() {
  return (
    <>
      <section id="boss" className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-ink-950">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_30%,#191a1d_0%,#0b0b0c_55%,#050505_100%)]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',
            backgroundSize: '46px 46px',
            maskImage: 'radial-gradient(75% 75% at 50% 45%,#000 0%,transparent 100%)',
            WebkitMaskImage: 'radial-gradient(75% 75% at 50% 45%,#000 0%,transparent 100%)',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto max-w-2xl px-6 text-center"
        >
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.25em] text-white/60">
            <Sparkles size={14} /> New Attraction
          </span>
          <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">Boss</h1>
          <p className="mx-auto mt-5 max-w-md text-white/55">
            This experience is ready to build. Drop in your videos or images and
            tell me the motion you want — scroll effects, dismantle, or a
            cinematic reveal — and I’ll bring it to life.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#boss-contact"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.03]"
            >
              Book a Demo
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </motion.div>
      </section>

      <section id="boss-contact" className="relative overflow-hidden bg-ink-950 py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_120%_at_50%_0%,rgba(255,255,255,0.08),transparent_60%)]" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto max-w-3xl px-6 text-center"
        >
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            Let’s shape the Boss experience.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/55">
            Send over the assets and the feel you’re after, and this page becomes
            a full motion experience like the rest of the site.
          </p>
        </motion.div>
      </section>
    </>
  )
}
