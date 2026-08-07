import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  ChevronDown,
  Smartphone,
  Ticket,
  Tablet,
  Globe,
  ScanLine,
  LayoutDashboard,
} from 'lucide-react'

const BASE = import.meta.env.BASE_URL
const VIDEO = `${BASE}video/themepark/hero.mp4`
// Opening frame, painted instantly so the banner never flashes dark.
const POSTER = `${BASE}video/themepark/hero-poster.jpg`

// Timed to the footage: app ordering (~0.12–0.24), ticket kiosk (~0.26–0.32),
// café POS (~0.33–0.46), webstore (~0.48–0.60), tap + gates (~0.62–0.82),
// then the operator dashboard (~0.84–1.0).
const STEPS = [
  {
    icon: Smartphone, step: '01', title: 'Order From the App',
    text: 'Guests browse food, merch and add-ons on their phone and have it ready before they arrive.',
    range: [0.12, 0.145, 0.22, 0.25],
  },
  {
    icon: Ticket, step: '02', title: 'Tickets at the Kiosk',
    text: 'Self-service kiosks sell day passes and print tickets on the spot — no counter queue.',
    range: [0.26, 0.285, 0.315, 0.34],
  },
  {
    icon: Tablet, step: '03', title: 'Café & Retail POS',
    text: 'Staff take orders anywhere in the park on a tablet POS, with receipts printed in seconds.',
    range: [0.35, 0.375, 0.445, 0.47],
  },
  {
    icon: Globe, step: '04', title: 'Shop the Online Store',
    text: 'Visitors book tickets, events and merchandise online before they ever leave home.',
    range: [0.49, 0.515, 0.585, 0.61],
  },
  {
    icon: ScanLine, step: '05', title: 'Scan and Walk Straight In',
    text: 'One tap at the gate validates the ticket and the turnstile opens — no printing, no queue.',
    range: [0.63, 0.655, 0.79, 0.82],
  },
  {
    icon: LayoutDashboard, step: '06', title: 'One AI Dashboard',
    text: 'Every channel reports into a single live dashboard — sales, attendance and trends in real time.',
    range: [0.85, 0.875, 0.97, 1], cta: true,
  },
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

function useIsMobile() {
  const [mobile, setMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const update = () => setMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return mobile
}

// Fades + drifts across a scroll range [in, hold1, hold2, out].
function Scene({ progress, range, className = '', children }) {
  const opacity = useTransform(progress, range, [0, 1, 1, 0])
  const y = useTransform(progress, [range[0], range[3]], [40, -40])
  return (
    <motion.div style={{ opacity, y }} className={`absolute inset-0 flex items-center ${className}`}>
      {children}
    </motion.div>
  )
}

export default function ThemeParkHero() {
  const reduced = usePrefersReducedMotion()
  const isMobile = useIsMobile()
  if (reduced) return <StaticHero />
  if (isMobile) return <MobileHero />
  return <ScrollHero />
}

/* Desktop: a long scroll-scrubbed banner — the tall container drives progress
   and the sticky stage pins the video, so every frame plays as you scroll. */
function ScrollHero() {
  const containerRef = useRef(null)
  const videoRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Prime so frames paint on seek (iOS Safari), then hold on frame 0.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const prime = video.play().then(() => video.pause()).catch(() => {})
    return () => {
      void prime
    }
  }, [])

  // Ease currentTime toward the scroll-mapped target for a smooth scrub.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    let raf = 0
    let current = 0
    const tick = () => {
      const duration = video.duration || 0
      if (duration) {
        const target = scrollYProgress.get() * duration
        current += (target - current) * 0.1
        if (Math.abs(target - current) < 0.004) current = target
        if (Math.abs(video.currentTime - current) > 0.01) {
          try {
            video.currentTime = current
          } catch {
            /* seek not ready */
          }
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [scrollYProgress])

  const hintOpacity = useTransform(scrollYProgress, [0, 0.03], [1, 0])

  return (
    <section ref={containerRef} id="park-top" className="relative h-[900vh] bg-ink-950">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <img
          src={POSTER}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={VIDEO}
          poster={POSTER}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
        />

        {/* Readability overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/55 to-ink-950/15" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink-950 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink-950/70 to-transparent" />

        <div className="absolute inset-0">
          <div className="relative mx-auto h-full max-w-7xl px-5 sm:px-8">
            <Scene
              progress={scrollYProgress}
              range={[-0.04, 0, 0.05, 0.09]}
              className="justify-center text-center md:justify-start md:text-left"
            >
              <IntroCopy />
            </Scene>

            {STEPS.map((s) => (
              <Scene
                key={s.step}
                progress={scrollYProgress}
                range={s.range}
                className="justify-center text-center md:justify-start md:text-left"
              >
                <StepScene {...s} />
              </Scene>
            ))}
          </div>
        </div>

        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-white/50"
        >
          <span className="text-[11px] font-medium uppercase tracking-widest">
            Scroll to explore
          </span>
          <motion.span
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown size={22} />
          </motion.span>
        </motion.div>
      </div>
    </section>
  )
}

/* Phone: the clip autoplays in a full-width 16:9 block (nothing cropped, no
   bars) with the journey below it as cards instead of a 9-screen scrub. */
function MobileHero() {
  return (
    <section id="park-top" className="relative bg-ink-950">
      <video
        className="aspect-video w-full object-contain"
        src={VIDEO}
        poster={POSTER}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="Theme park ticketing, ordering and entry"
      />

      <div className="px-5 pb-4 pt-10 text-center">
        <IntroCopy compact />
      </div>

      <div className="space-y-4 px-5 pb-4 pt-6">
        {STEPS.map((s, i) => (
          <motion.article
            key={s.step}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, delay: (i % 2) * 0.06 }}
            className="glass rounded-2xl p-5"
          >
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-500/15 text-accent-400 ring-1 ring-accent-500/25">
                <s.icon size={20} strokeWidth={1.8} />
              </span>
              <span className="text-2xl font-bold text-white/15">{s.step}</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">{s.title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-white/65">{s.text}</p>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

/* Reduced motion: a calm static banner, no scrubbing. */
function StaticHero() {
  return (
    <section id="park-top" className="relative flex min-h-[92svh] items-center overflow-hidden bg-ink-950">
      <img src={POSTER} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink-950/90 via-ink-950/55 to-ink-950/20" />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8">
        <IntroCopy />
      </div>
    </section>
  )
}

function IntroCopy({ compact = false }) {
  return (
    <div className={compact ? '' : 'mx-auto max-w-2xl md:mx-0'}>
      <p
        className={`mb-4 inline-flex items-center gap-2 rounded-full border border-accent-500/30 bg-accent-500/10 px-4 py-1.5 font-semibold uppercase tracking-widest text-accent-300 ${
          compact ? 'text-[10px]' : 'text-xs'
        }`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
        Connected Theme Park Platform
      </p>
      <h1
        className={`font-bold leading-[1.08] tracking-tight ${
          compact ? 'text-[2rem]' : 'text-4xl sm:text-6xl lg:text-7xl'
        }`}
      >
        Every Sale, Every Gate
        <br />
        <span className="text-accent-400">One System</span>
      </h1>
      <p
        className={`mt-5 leading-relaxed text-white/75 ${
          compact ? 'mx-auto max-w-sm text-[0.95rem]' : 'mx-auto max-w-xl text-base sm:text-lg md:mx-0'
        }`}
      >
        Tickets, food, retail and entry run on one connected platform — from the
        app and the webstore to the kiosk, the counter and the turnstile.
      </p>
    </div>
  )
}

function StepScene({ icon: Icon, step, title, text, cta }) {
  return (
    <div className="mx-auto max-w-xl md:mx-0">
      <div className="mb-6 flex items-center justify-center gap-4 md:justify-start">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-500/15 text-accent-400 ring-1 ring-accent-500/25 backdrop-blur-sm">
          <Icon size={30} strokeWidth={1.8} />
        </span>
        <span className="text-6xl font-bold text-white/10">{step}</span>
      </div>
      <h2 className="text-4xl font-bold tracking-tight sm:text-6xl">{title}</h2>
      <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-white/75 sm:text-lg md:mx-0">
        {text}
      </p>
      {cta && (
        <a
          href="#park-channels"
          className="mt-8 inline-block rounded-full bg-accent-500 px-8 py-4 text-base font-semibold text-ink-950 shadow-lg shadow-accent-500/25 transition-transform hover:-translate-y-0.5"
        >
          See the Ticketing Channels
        </a>
      )}
    </div>
  )
}
