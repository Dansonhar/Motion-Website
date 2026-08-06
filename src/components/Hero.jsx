import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  ChevronDown,
  Smartphone,
  ScanFace,
  ShieldCheck,
  DoorOpen,
  ScanEye,
  Send,
} from 'lucide-react'

// The video's opening frame, shown immediately as the first impression so the
// gym scene is on screen before the scrub video primes/paints (no dark flash).
const POSTER = `${import.meta.env.BASE_URL}video/gym-hero-poster.jpg`

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

// An overlay "scene" that fades + drifts across a scroll range [in, hold1, hold2, out].
function Scene({ progress, range, className = '', children }) {
  const opacity = useTransform(progress, range, [0, 1, 1, 0])
  const y = useTransform(progress, [range[0], range[3]], [40, -40])
  return (
    <motion.div
      style={{ opacity, y }}
      className={`absolute inset-0 flex items-center ${className}`}
    >
      {children}
    </motion.div>
  )
}

export default function Hero() {
  const reduced = usePrefersReducedMotion()
  if (reduced) return <StaticHero />
  return <ScrollHero />
}

/* Continuous scroll-scrubbed hero: the tall container drives scroll progress,
   the sticky stage pins the video, and every frame plays as you scroll — so
   you can move slowly and watch the whole check-in → entry sequence. */
function ScrollHero() {
  const containerRef = useRef(null)
  const videoRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Prime the video so frames paint on seek (iOS Safari), then pause on frame 0.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const prime = video.play().then(() => video.pause()).catch(() => {})
    return () => {
      void prime
    }
  }, [])

  // Ease the video's currentTime toward the scroll-mapped target for smooth scrub.
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

  const hintOpacity = useTransform(scrollYProgress, [0, 0.04], [1, 0])

  return (
    <section ref={containerRef} id="top" className="relative h-[640vh] bg-ink-950">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* First-impression frame — visible instantly, under the video */}
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
          src={`${import.meta.env.BASE_URL}video/gym-hero.mp4`}
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

        {/* Scenes */}
        <div className="absolute inset-0">
          <div className="relative mx-auto h-full max-w-7xl px-5 sm:px-8">
            {/* Scene windows are timed to the footage: app sign-up (~0.06–0.26),
                kiosk face registration (~0.30–0.48), face verification at the
                gate (~0.54–0.62), turnstile passage (~0.66–0.75), the QSentry
                detection panel (~0.78–0.88), then the tailgating alert on the
                phone (~0.90–1.0). */}
            <Scene
              progress={scrollYProgress}
              range={[-0.05, 0, 0.05, 0.10]}
              className="justify-center text-center md:justify-start md:text-left"
            >
              <IntroScene />
            </Scene>

            <Scene
              progress={scrollYProgress}
              range={[0.10, 0.14, 0.24, 0.29]}
              className="justify-center text-center md:justify-start md:text-left"
            >
              <StepScene icon={Smartphone} step="01" title="Join From the App" text="Members sign up on their phone and confirm who they are with a quick face scan — registered before they reach the desk." />
            </Scene>

            <Scene
              progress={scrollYProgress}
              range={[0.29, 0.33, 0.46, 0.51]}
              className="justify-center text-center md:justify-start md:text-left"
            >
              <StepScene icon={ScanFace} step="02" title="Enrol at the Kiosk" text="One capture at the self-service kiosk registers their face and arms Face ID check-in for every future visit." />
            </Scene>

            <Scene
              progress={scrollYProgress}
              range={[0.51, 0.55, 0.62, 0.66]}
              className="justify-center text-center md:justify-start md:text-left"
            >
              <StepScene icon={ShieldCheck} step="03" title="Face Verified at the Gate" text="The terminal matches face to membership and grants access instantly — no card, no phone, no queue." />
            </Scene>

            <Scene
              progress={scrollYProgress}
              range={[0.66, 0.69, 0.74, 0.78]}
              className="justify-center text-center md:justify-start md:text-left"
            >
              <StepScene icon={DoorOpen} step="04" title="Walk Straight Through" text="The tripod turnstile releases for one authorised entry, then locks again behind them." />
            </Scene>

            <Scene
              progress={scrollYProgress}
              range={[0.775, 0.80, 0.87, 0.895]}
              className="justify-center text-center md:justify-start md:text-left"
            >
              <StepScene icon={ScanEye} step="05" title="QSentry AI Detects Every Entry" text="Every person in the lane is detected, matched to a member name and confirmed in real time — so you always know exactly who is inside." />
            </Scene>

            <Scene
              progress={scrollYProgress}
              range={[0.895, 0.92, 0.99, 1]}
              className="justify-center text-center md:justify-start md:text-left"
            >
              <StepScene icon={Send} step="06" title="Instant Alerts to Telegram" text="If someone tailgates, QSentry AI pushes a Telegram alert with photo and video evidence — so owners can see exactly what happened at any outlet, from anywhere." cta />
            </Scene>
          </div>
        </div>

        {/* Scroll hint */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-white/50"
        >
          <span className="text-[11px] font-medium uppercase tracking-widest">
            Scroll to continue
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

function IntroScene() {
  return (
    <div className="mx-auto max-w-2xl md:mx-0">
      <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent-500/30 bg-accent-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent-300">
        <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
        Connected Gym Entrance System
      </p>
      <h1 className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
        Smarter Gym Access
        <br />
        <span className="text-accent-400">Starts Here</span>
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg md:mx-0">
        Members enrol their face once, then walk straight in — while AI watches
        every entry and flags anyone who slips through.
      </p>
      <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row md:items-start">
        <a
          href="#contact"
          className="w-full rounded-full bg-accent-500 px-8 py-4 text-center text-base font-semibold text-ink-950 shadow-lg shadow-accent-500/25 transition-transform hover:-translate-y-0.5 sm:w-auto"
        >
          Request a Demo
        </a>
        <a
          href="#solutions"
          className="glass w-full rounded-full px-8 py-4 text-center text-base font-semibold text-white transition-transform hover:-translate-y-0.5 sm:w-auto"
        >
          Explore the System
        </a>
      </div>
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
          href="#contact"
          className="mt-8 inline-block rounded-full bg-accent-500 px-8 py-4 text-base font-semibold text-ink-950 shadow-lg shadow-accent-500/25 transition-transform hover:-translate-y-0.5"
        >
          Request a Demo
        </a>
      )}
    </div>
  )
}

/* Reduced-motion fallback: a calm static hero (no scrubbing). */
function StaticHero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[92svh] items-center overflow-hidden bg-ink-950"
    >
      <img
        src={POSTER}
        alt=""
        aria-hidden="true"
          fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={`${import.meta.env.BASE_URL}video/gym-hero.mp4`}
        poster={POSTER}
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink-950/90 via-ink-950/55 to-ink-950/20" />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8">
        <IntroScene />
      </div>
    </section>
  )
}
