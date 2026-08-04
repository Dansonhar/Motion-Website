import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, QrCode, ShieldCheck, DoorOpen } from 'lucide-react'

// Dark gradient poster shown before the first frame paints.
const POSTER =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b0e0c"/><stop offset="1" stop-color="#060807"/></linearGradient></defs><rect width="1920" height="1080" fill="url(#g)"/></svg>`,
  )

// Each scene pins to a point in the clip (fraction of duration) and shows its
// own copy. One scroll gesture = advance one scene; the video tweens between
// these keyframes with easing, so the motion is always smooth.
const SCENES = [
  { key: 'intro', frac: 0 },
  { key: 'checkin', frac: 0.34, icon: QrCode, step: '01', title: 'Check In', text: 'Scan a QR code, tap an NFC card or find a membership account at the self-service kiosk.' },
  { key: 'verify', frac: 0.67, icon: ShieldCheck, step: '02', title: 'Verify Access', text: 'The system checks membership and payment status instantly — no front-desk queue.' },
  { key: 'enter', frac: 0.999, icon: DoorOpen, step: '03', title: 'Enter the Gym', text: 'The MT119-LED tripod turnstile unlocks for authorised, single-person entry.', cta: true },
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

export default function Hero() {
  const reduced = usePrefersReducedMotion()
  if (reduced) return <StaticHero />
  return <SteppedHero />
}

/* ---------------------------------------------------------------- */
/* Stepped, scroll-snapped hero                                     */
/* ---------------------------------------------------------------- */
function SteppedHero() {
  const videoRef = useRef(null)
  const [index, setIndex] = useState(0)
  const [ready, setReady] = useState(false)

  const indexRef = useRef(0)
  const animatingRef = useRef(false)
  const readyToStepRef = useRef(true)

  // Prime + prepare the video: play/pause primes iOS painting, then park on frame 0.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const onLoaded = () => {
      setReady(true)
      try {
        video.currentTime = 0
      } catch {
        /* not seekable yet */
      }
    }
    video.addEventListener('loadeddata', onLoaded)
    const prime = video.play().then(() => video.pause()).catch(() => {})
    return () => {
      video.removeEventListener('loadeddata', onLoaded)
      void prime
    }
  }, [])

  // Smoothly tween the video's currentTime between two keyframes.
  const tweenTo = (fromT, toT, ms) =>
    new Promise((resolve) => {
      const video = videoRef.current
      if (!video) return resolve()
      const start = performance.now()
      const run = (now) => {
        const t = Math.min(1, (now - start) / ms)
        // easeInOutCubic
        const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
        try {
          video.currentTime = fromT + (toT - fromT) * eased
        } catch {
          /* ignore transient seek errors */
        }
        if (t < 1) requestAnimationFrame(run)
        else resolve()
      }
      requestAnimationFrame(run)
    })

  // Advance / retreat to a scene index.
  const go = (next) => {
    if (next < 0 || next >= SCENES.length) return
    const video = videoRef.current
    const duration = video?.duration || 0
    const fromT = SCENES[indexRef.current].frac * duration
    const toT = Math.min(SCENES[next].frac * duration, duration - 0.05)
    const distance = Math.abs(SCENES[next].frac - SCENES[indexRef.current].frac)

    indexRef.current = next
    setIndex(next)
    animatingRef.current = true

    tweenTo(fromT, toT, 650 + distance * 500).then(() => {
      // brief cooldown so trackpad momentum can't skip scenes
      setTimeout(() => {
        animatingRef.current = false
      }, 140)
    })
  }

  // Take over wheel / touch / keyboard while the hero fills the viewport.
  useEffect(() => {
    const atHero = () => window.scrollY <= 2

    const attemptStep = (dir, prevent) => {
      const next = indexRef.current + dir
      // At a boundary, let the page scroll naturally (into the site / to top).
      if (next < 0 || next >= SCENES.length) return
      prevent()
      if (animatingRef.current || !readyToStepRef.current) return
      readyToStepRef.current = false
      go(next)
    }

    const onWheel = (e) => {
      if (!atHero() && !animatingRef.current) return
      if (animatingRef.current) {
        e.preventDefault()
        return
      }
      if (Math.abs(e.deltaY) < 6) {
        // gesture eased off — ready to accept the next discrete scroll
        readyToStepRef.current = true
        return
      }
      attemptStep(e.deltaY > 0 ? 1 : -1, () => e.preventDefault())
    }

    let touchY = null
    const onTouchStart = (e) => {
      touchY = e.touches[0].clientY
    }
    const onTouchMove = (e) => {
      if (!atHero() && !animatingRef.current) return
      if (touchY == null) return
      const dy = touchY - e.touches[0].clientY
      if (Math.abs(dy) < 44) {
        if (animatingRef.current) e.preventDefault()
        return
      }
      touchY = e.touches[0].clientY
      readyToStepRef.current = true
      attemptStep(dy > 0 ? 1 : -1, () => e.preventDefault())
    }

    const onKey = (e) => {
      if (!atHero()) return
      const down = e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' '
      const up = e.key === 'ArrowUp' || e.key === 'PageUp'
      if (!down && !up) return
      readyToStepRef.current = true
      attemptStep(down ? 1 : -1, () => e.preventDefault())
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  const jumpTo = (i) => {
    if (i === indexRef.current || animatingRef.current) return
    go(i)
  }

  const scene = SCENES[index]

  return (
    <section id="top" className="relative h-[100svh] overflow-hidden bg-ink-950">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src="/video/gym-hero.mp4"
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

      {/* Scene copy (cross-fades as the index changes) */}
      <div className="absolute inset-0 flex items-center">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={scene.key}
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -26 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto max-w-2xl text-center md:mx-0 md:text-left"
            >
              {scene.key === 'intro' ? (
                <IntroScene />
              ) : (
                <StepScene scene={scene} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Scene rail (clickable) */}
      <div className="absolute right-5 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-3 sm:right-8 md:flex">
        {SCENES.map((s, i) => (
          <button
            key={s.key}
            type="button"
            aria-label={`Go to scene ${i + 1}`}
            onClick={() => jumpTo(i)}
            className="group flex items-center gap-2"
          >
            <span
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index
                  ? 'h-6 w-2 bg-accent-400'
                  : 'w-2 bg-white/30 group-hover:bg-white/60'
              }`}
            />
          </button>
        ))}
      </div>

      {/* Scroll hint — only on the first scene */}
      <AnimatePresence>
        {index === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
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
        )}
      </AnimatePresence>
    </section>
  )
}

function IntroScene() {
  return (
    <>
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
    </>
  )
}

function StepScene({ scene }) {
  const Icon = scene.icon
  return (
    <div className="max-w-xl">
      <div className="mb-6 flex items-center justify-center gap-4 md:justify-start">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-500/15 text-accent-400 ring-1 ring-accent-500/25 backdrop-blur-sm">
          <Icon size={30} strokeWidth={1.8} />
        </span>
        <span className="text-6xl font-bold text-white/10">{scene.step}</span>
      </div>
      <h2 className="text-4xl font-bold tracking-tight sm:text-6xl">
        {scene.title}
      </h2>
      <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-white/75 sm:text-lg md:mx-0">
        {scene.text}
      </p>
      {scene.cta && (
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

/* ---------------------------------------------------------------- */
/* Reduced-motion fallback: a calm static hero                      */
/* ---------------------------------------------------------------- */
function StaticHero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[92svh] items-center overflow-hidden bg-ink-950"
    >
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/video/gym-hero.mp4"
        poster={POSTER}
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink-950/90 via-ink-950/55 to-ink-950/20" />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl">
            Smarter Gym Access <span className="text-accent-400">Starts Here</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/75">
            Let members register, pay, check in and enter the gym through one
            connected self-service experience.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a
              href="#contact"
              className="rounded-full bg-accent-500 px-8 py-4 text-center font-semibold text-ink-950"
            >
              Request a Demo
            </a>
            <a
              href="#solutions"
              className="glass rounded-full px-8 py-4 text-center font-semibold text-white"
            >
              Explore the System
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
