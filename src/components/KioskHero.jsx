import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const BASE = import.meta.env.BASE_URL

export default function KioskHero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  // gentle parallax as you scroll past the hero — subtle, not a full animation rig
  const y = useTransform(scrollYProgress, [0, 1], [0, -80])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.06])
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section id="kiosk" ref={ref} className="relative min-h-[100svh] overflow-hidden bg-ink-950">
      {/* backdrop */}
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

      <div className="relative mx-auto flex min-h-[100svh] max-w-5xl flex-col items-center px-6 pt-28 pb-16 text-center sm:pt-32">
        <motion.div
          style={{ opacity: fade }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.35em] text-white/50">
            Self-Service Kiosk
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            One kiosk. Every module.
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm text-white/55 sm:text-base">
            A self-service ordering kiosk built from six clean modules — display,
            payments, printing and a rock-solid stand. Scroll to meet each one.
          </p>
        </motion.div>

        <motion.img
          src={`${BASE}images/kiosk/assembled.png`}
          alt="Self-service kiosk"
          style={{ y, scale }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mt-10 h-[62vh] w-auto max-w-full object-contain [filter:drop-shadow(0_40px_60px_rgba(0,0,0,0.6))]"
        />
      </div>

      {/* scroll hint */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-white/50">
        <span className="text-[11px] uppercase tracking-[0.3em]">Scroll</span>
        <span className="flex h-9 w-5 justify-center rounded-full border border-white/40 pt-1.5">
          <span className="h-1.5 w-1 animate-bounce rounded-full bg-white" />
        </span>
      </div>
    </section>
  )
}
