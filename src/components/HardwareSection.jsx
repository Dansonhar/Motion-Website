import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  Lightbulb,
  Users,
  ScanLine,
  ShieldCheck,
  Timer,
  Siren,
  ArrowRight,
  MoveHorizontal,
} from 'lucide-react'
import TurnstileAsset from './TurnstileAsset.jsx'

const FEATURES = [
  { icon: Lightbulb, no: '01', title: 'LED Access Indicators', text: 'Green and red light strips signal approval or denial at a glance — readable across the floor.', spec: 'Green / red status' },
  { icon: Users, no: '02', title: 'Single-Person Entry', text: 'Silent servo-driven arms let one authorised member through at a time, blocking tailgating.', spec: '35 people / min' },
  { icon: ScanLine, no: '03', title: 'Universal Reader Zone', text: 'One reader area accepts QR codes, NFC / RFID cards, facial recognition and barcodes.', spec: 'QR · NFC · Face' },
  { icon: ShieldCheck, no: '04', title: '304 Stainless Body', text: 'Matte-black, scratch-resistant stainless housing rated IP54 for years of daily traffic.', spec: 'IP54 · matte black' },
  { icon: Timer, no: '05', title: 'Automatic Locking', text: 'Arms re-lock after a 5-second timeout if no one passes, keeping the entrance secure.', spec: '5-second timeout' },
  { icon: Siren, no: '06', title: 'Emergency Drop Arm', text: 'On power loss the arms drop automatically for fire-safe, unobstructed egress.', spec: 'Fire-safe egress' },
]

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return reduced
}

export default function HardwareSection() {
  const reduced = usePrefersReducedMotion()
  return reduced ? <StackedFallback /> : <HorizontalShowcase />
}

/* ---------------------------------------------------------------- */
/* Horizontal ("landscape") scroll gallery                          */
/* ---------------------------------------------------------------- */
function HorizontalShowcase() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const [dims, setDims] = useState({ distance: 0, vh: 0 })

  useLayoutEffect(() => {
    const measure = () => {
      const track = trackRef.current
      if (!track) return
      const distance = Math.max(0, track.scrollWidth - window.innerWidth)
      setDims({ distance, vh: window.innerHeight })
    }
    measure()
    const t = setTimeout(measure, 300) // re-measure after fonts/layout settle
    window.addEventListener('resize', measure)
    return () => {
      clearTimeout(t)
      window.removeEventListener('resize', measure)
    }
  }, [])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  const x = useTransform(scrollYProgress, [0, 1], [0, -dims.distance])

  return (
    <section
      ref={sectionRef}
      id="hardware"
      className="relative bg-ink-950"
      style={{ height: dims.distance ? dims.distance + dims.vh : '100vh' }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Ambient glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/3 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-accent-500/8 blur-3xl"
        />

        {/* Header */}
        <div className="absolute inset-x-0 top-0 z-10 flex items-end justify-between px-5 pt-24 sm:px-8 sm:pt-28">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent-400">
              Turnstile Access Control
            </p>
            <h2 className="max-w-md text-3xl font-bold tracking-tight sm:text-4xl">
              Explore the MT119-LED
            </h2>
          </div>
          <div className="hidden items-center gap-2 text-sm text-white/45 sm:flex">
            <MoveHorizontal size={18} />
            Scroll to explore
          </div>
        </div>

        {/* Horizontal track */}
        <div className="flex h-full items-center">
          <motion.div
            ref={trackRef}
            style={{ x }}
            className="flex items-stretch gap-6 px-5 will-change-transform sm:gap-8 sm:px-12"
          >
            {/* Panel 1 — the 3D asset */}
            <article className="flex w-[86vw] max-w-[540px] shrink-0 flex-col justify-center">
              <div className="glass relative overflow-hidden rounded-[2rem] p-8 sm:p-10">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.16),transparent_65%)]"
                />
                <TurnstileAsset className="relative" />
                <div className="relative mt-6 flex items-center justify-between border-t border-white/8 pt-6">
                  <div>
                    <p className="text-lg font-semibold tracking-tight">MT119-LED</p>
                    <p className="text-sm text-white/50">Tripod Turnstile</p>
                  </div>
                  <span className="rounded-full bg-accent-500/12 px-3 py-1.5 text-xs font-semibold text-accent-300 ring-1 ring-accent-500/25">
                    Drag the model to tilt
                  </span>
                </div>
              </div>
            </article>

            {/* Feature panels */}
            {FEATURES.map((f) => (
              <article
                key={f.no}
                className="glass flex w-[78vw] max-w-[360px] shrink-0 flex-col justify-between rounded-[2rem] p-8 transition-colors duration-300 hover:border-accent-500/30"
              >
                <div className="flex items-start justify-between">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-500/12 text-accent-400 ring-1 ring-accent-500/20">
                    <f.icon size={26} strokeWidth={1.8} />
                  </span>
                  <span className="text-5xl font-bold text-white/10">{f.no}</span>
                </div>
                <div className="mt-10">
                  <h3 className="text-2xl font-semibold tracking-tight">{f.title}</h3>
                  <p className="mt-3 leading-relaxed text-white/60">{f.text}</p>
                  <span className="mt-6 inline-block rounded-full bg-white/5 px-4 py-1.5 text-xs font-medium text-white/70">
                    {f.spec}
                  </span>
                </div>
              </article>
            ))}

            {/* Closing CTA panel */}
            <article className="flex w-[78vw] max-w-[360px] shrink-0 flex-col justify-center rounded-[2rem] border border-accent-500/20 bg-accent-500/[0.06] p-8">
              <h3 className="text-2xl font-bold tracking-tight">
                Give members a faster way in.
              </h3>
              <p className="mt-3 leading-relaxed text-white/60">
                See the MT119-LED and self-service kiosk working together in a live demo.
              </p>
              <a
                href="#contact"
                className="group mt-8 inline-flex items-center gap-2 self-start rounded-full bg-accent-500 px-6 py-3.5 text-sm font-semibold text-ink-950 transition-transform hover:-translate-y-0.5"
              >
                Book a Demo
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </a>
            </article>
          </motion.div>
        </div>

        {/* Progress bar */}
        <div className="absolute inset-x-0 bottom-6 z-10 px-5 sm:px-8">
          <div className="h-0.5 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              style={{ scaleX: scrollYProgress }}
              className="h-full origin-left rounded-full bg-gradient-to-r from-accent-500 to-accent-300"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- */
/* Reduced-motion fallback: static stacked layout                   */
/* ---------------------------------------------------------------- */
function StackedFallback() {
  return (
    <section id="hardware" className="lazy-section relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent-400">
          Turnstile Access Control
        </p>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Explore the MT119-LED
        </h2>

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
          <div className="glass relative overflow-hidden rounded-[2rem] p-8">
            <TurnstileAsset />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <article key={f.no} className="glass rounded-2xl p-6">
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-500/12 text-accent-400 ring-1 ring-accent-500/20">
                  <f.icon size={22} strokeWidth={1.8} />
                </span>
                <h3 className="text-base font-semibold tracking-tight">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{f.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
