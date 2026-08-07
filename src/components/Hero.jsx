import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  ChevronDown,
  Smartphone,
  ScanFace,
  ShieldCheck,
  MonitorCheck,
} from 'lucide-react'

// The video's opening frame, shown immediately as the first impression so the
// gym scene is on screen before the scrub video primes/paints (no dark flash).
const POSTER = `${import.meta.env.BASE_URL}video/gym/hero-poster.jpg`

// The entry journey. Desktop maps these onto scroll-timed scenes over the
// scrubbing video; phones render them as a readable list under an autoplaying
// clip (scroll-scrubbing is unreliable on iOS and crops a 16:9 clip badly).
const STEPS = [
  {
    icon: Smartphone, step: '01', title: 'Join From the App',
    text: 'Members sign up on their phone and pick a plan — no forms at the front desk, no waiting for staff.',
    range: [0.11, 0.15, 0.23, 0.26],
  },
  {
    icon: ScanFace, step: '02', title: 'Verify With Face ID',
    text: 'A quick face scan in the app confirms the person signing up is really them.',
    range: [0.27, 0.30, 0.34, 0.37],
  },
  {
    icon: MonitorCheck, step: '03', title: 'Enrol at the Kiosk',
    text: 'One capture at the self-service kiosk registers their face and arms Face ID entry for every future visit.',
    range: [0.39, 0.43, 0.67, 0.70],
  },
  {
    icon: ShieldCheck, step: '04', title: 'Face Verified, Access Granted',
    text: 'The gate terminal matches face to membership and opens instantly — no card, no phone, no queue.',
    range: [0.73, 0.77, 0.97, 1], cta: true,
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

// Phones (portrait). Desktop layout is untouched by this branch.
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

// An overlay "scene" that fades + drifts across a scroll range [in, hold1, hold2, out].
function Scene({ progress, range, className = '', children }) {
  const opacity = useTransform(progress, range, [0, 1, 1, 0])
  const y = useTransform(progress, [range[0], range[3]], [40, -40])
  return (
    <motion.div
      style={{ opacity, y }}
      className={`absolute inset-0 flex items-center [text-shadow:0_1px_3px_rgba(0,0,0,0.95),0_3px_12px_rgba(0,0,0,0.85),0_10px_40px_rgba(0,0,0,0.7)] ${className}`}
    >
      {children}
    </motion.div>
  )
}

export default function Hero() {
  const reduced = usePrefersReducedMotion()
  const isMobile = useIsMobile()
  if (reduced) return <StaticHero />
  if (isMobile) return <MobileHero />
  return <ScrollHero />
}

/* Phone layout: the clip autoplays in a full-width 16:9 block — matching the
   video's own shape, so nothing is cropped and there are no black bars — with
   the journey below it as a readable list instead of a 6-screen scroll scrub. */
function MobileHero() {
  return (
    <section id="top" className="relative bg-ink-950 pt-16">
      <video
        className="aspect-video w-full object-contain"
        src={`${import.meta.env.BASE_URL}video/gym/hero.mp4`}
        poster={POSTER}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="Members entering the gym with face-verified access"
      />

      <div className="px-5 pb-4 pt-10 text-center">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-ink-950/60 backdrop-blur-md px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
          Connected Gym Entrance System
        </p>
        <h1 className="text-[2rem] font-bold leading-[1.1] tracking-tight">
          Smarter Gym Access
          <br />
          <span className="text-accent-400">Starts Here</span>
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-[0.95rem] leading-relaxed text-white">
          Members join in the app, enrol their face at the kiosk, then walk
          straight in — no card, no phone, no queue.
        </p>
        <div className="mt-7 flex flex-col gap-3">
          <a
            href="#contact"
            className="w-full rounded-full bg-accent-500 px-6 py-3.5 text-center text-[0.95rem] font-semibold text-ink-950"
          >
            Request a Demo
          </a>
          <a
            href="#solutions"
            className="w-full rounded-full border border-white/30 bg-ink-950/60 px-6 py-3.5 text-center text-[0.95rem] font-semibold text-white backdrop-blur-md"
          >
            Explore the System
          </a>
        </div>
      </div>

      {/* The journey, as scroll-revealed cards */}
      <div className="space-y-4 px-5 pb-16 pt-8">
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
              <span className="text-2xl font-bold text-white/70">{s.step}</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">{s.title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-white/90">{s.text}</p>
          </motion.article>
        ))}
      </div>
    </section>
  )
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
    <section ref={containerRef} id="top" className="relative h-[500vh] bg-ink-950">
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
          src={`${import.meta.env.BASE_URL}video/gym/hero.mp4`}
          poster={POSTER}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
        />

        {/* No scrims over the video at all — the footage shows at full
            brightness. Legibility is carried entirely by the copy's own
            text-shadow (see Scene), which only darkens the pixels immediately
            behind the letters instead of dimming the frame. */}

        {/* Scenes */}
        <div className="absolute inset-0">
          <div className="relative mx-auto h-full max-w-7xl px-5 sm:px-8">
            {/* Scene windows are timed to the footage: app sign-up (~0.10–0.28),
                in-app face verification (~0.30–0.42), kiosk face enrolment
                (~0.45–0.82), then the gate terminal granting access (~0.84–1.0). */}
            <Scene
              progress={scrollYProgress}
              range={[-0.05, 0, 0.05, 0.10]}
              className="justify-center text-center md:justify-start md:text-left"
            >
              <IntroScene />
            </Scene>

            {STEPS.map((s) => (
              <Scene
                key={s.step}
                progress={scrollYProgress}
                range={s.range}
                className="justify-center text-center md:justify-start md:text-left"
              >
                <StepScene icon={s.icon} step={s.step} title={s.title} text={s.text} cta={s.cta} />
              </Scene>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 rounded-full bg-ink-950/55 px-4 py-2 text-white backdrop-blur-sm"
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
      <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-ink-950/60 backdrop-blur-md px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white">
        <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
        Connected Gym Entrance System
      </p>
      <h1 className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
        Smarter Gym Access
        <br />
        <span className="text-accent-400">Starts Here</span>
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white sm:text-lg md:mx-0">
        Members join in the app, enrol their face at the kiosk, then walk
        straight in — no card, no phone, no queue.
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
          className="w-full rounded-full border border-white/30 bg-ink-950/60 px-8 py-4 text-center text-base font-semibold text-white backdrop-blur-md transition-transform hover:-translate-y-0.5 sm:w-auto"
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
        <span className="text-6xl font-bold text-white/70">{step}</span>
      </div>
      <h2 className="text-4xl font-bold tracking-tight sm:text-6xl">{title}</h2>
      <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-white sm:text-lg md:mx-0">
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
        src={`${import.meta.env.BASE_URL}video/gym/hero.mp4`}
        poster={POSTER}
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink-950/45 via-transparent to-transparent" />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8">
        <IntroScene />
      </div>
    </section>
  )
}
