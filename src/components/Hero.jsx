import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown, QrCode, ShieldCheck, DoorOpen } from 'lucide-react'

// Dark gradient poster shown before the first frame paints.
const POSTER =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b0e0c"/><stop offset="1" stop-color="#060807"/></linearGradient></defs><rect width="1920" height="1080" fill="url(#g)"/></svg>`,
  )

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
  const [ready, setReady] = useState(false)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Prime the video so frames paint on seek (iOS Safari), then pause on frame 0.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const onReady = () => setReady(true)
    video.addEventListener('loadeddata', onReady)
    const prime = video.play().then(() => video.pause()).catch(() => {})
    return () => {
      video.removeEventListener('loadeddata', onReady)
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
    <section ref={containerRef} id="top" className="relative h-[420vh] bg-ink-950">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
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

        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-accent-400" />
          </div>
        )}

        {/* Scenes */}
        <div className="absolute inset-0">
          <div className="relative mx-auto h-full max-w-7xl px-5 sm:px-8">
            <Scene
              progress={scrollYProgress}
              range={[0, 0.02, 0.16, 0.24]}
              className="justify-center text-center md:justify-start md:text-left"
            >
              <IntroScene />
            </Scene>

            <Scene
              progress={scrollYProgress}
              range={[0.24, 0.3, 0.42, 0.5]}
              className="justify-center text-center md:justify-start md:text-left"
            >
              <StepScene icon={QrCode} step="01" title="Check In" text="Scan a QR code, tap an NFC card or find a membership account at the self-service kiosk." />
            </Scene>

            <Scene
              progress={scrollYProgress}
              range={[0.5, 0.56, 0.68, 0.76]}
              className="justify-center text-center md:justify-start md:text-left"
            >
              <StepScene icon={ShieldCheck} step="02" title="Verify Access" text="The system checks membership and payment status instantly — no front-desk queue." />
            </Scene>

            <Scene
              progress={scrollYProgress}
              range={[0.76, 0.82, 0.97, 1]}
              className="justify-center text-center md:justify-start md:text-left"
            >
              <StepScene icon={DoorOpen} step="03" title="Enter the Gym" text="The MT119-LED tripod turnstile unlocks for authorised, single-person entry." cta />
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
        Let members register, pay, check in and enter the gym through one
        connected self-service experience.
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
