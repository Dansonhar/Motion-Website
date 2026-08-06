import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import ThemeParkAtmosphere from '../components/ThemeParkAtmosphere.jsx'

// The single Theme Park clip is the whole page — fullscreen, edge to edge.
const VIDEO_SRC = `${import.meta.env.BASE_URL}video/themepark.mp4`

const POSTER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect width='1920' height='1080' fill='%23060807'/%3E%3C/svg%3E"

// One continuous scroll timeline (0 → 1) drives every beat of the teaser —
// countdown, title slam, hold, letterbox opening — before handing off to the
// existing video scrub. Nothing here is a separate scroll region, so the
// whole sequence reads as one uninterrupted motion.
const N3 = [0, 0.05]
const N2 = [0.05, 0.1]
const N1 = [0.1, 0.15]
const FLASH = [0.15, 0.19]
const TITLE_SETTLE = 0.21
const HOLD_END = 0.32
const TRANSITION = [0.32, 0.44]
const VIDEO_START = 0.44

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

export default function ThemeParkSite() {
  const reduced = usePrefersReducedMotion()
  return reduced ? <FullAutoplay src={VIDEO_SRC} /> : <CinematicReveal src={VIDEO_SRC} />
}

/* Reduced-motion: fullscreen autoplay loop, no scroll-jacking, no teaser. */
function FullAutoplay({ src }) {
  return (
    <section id="top" className="relative h-[100svh] w-full overflow-hidden bg-black">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={src}
        poster={POSTER}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
    </section>
  )
}

/* "Coming Soon" film-leader countdown → title slam → letterbox opens →
   the reveal video takes over, scrubbed by the rest of the same scroll. */
function CinematicReveal({ src }) {
  const containerRef = useRef(null)
  const videoRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [showAtmosphere, setShowAtmosphere] = useState(true)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

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

  // Video scrub only kicks in once the letterbox has opened — remap the tail
  // of the timeline to a fresh 0..1 so the clip plays at full scrub speed.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    let raf = 0
    let current = 0
    const tick = () => {
      const p = scrollYProgress.get()
      const vp = Math.min(Math.max((p - VIDEO_START) / (1 - VIDEO_START), 0), 1)
      const duration = video.duration || 0
      if (duration) {
        const target = vp * duration
        current += (target - current) * 0.12
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

  // Unmount the WebGL atmosphere once the reveal has fully taken over — no
  // need to keep it painting behind an opaque video for the next 550vh.
  useEffect(
    () =>
      scrollYProgress.on('change', (v) => {
        setShowAtmosphere(v < TRANSITION[1] + 0.06)
      }),
    [scrollYProgress],
  )

  const flashOpacity = useTransform(scrollYProgress, [FLASH[0], FLASH[0] + 0.012, FLASH[1]], [0, 1, 0])
  const titleOpacity = useTransform(
    scrollYProgress,
    [FLASH[1] - 0.01, TITLE_SETTLE, HOLD_END, TRANSITION[0] + 0.05],
    [0, 1, 1, 0],
  )
  const titleScale = useTransform(scrollYProgress, [FLASH[1] - 0.01, TITLE_SETTLE], [1.4, 1])
  const letterboxHeight = useTransform(
    scrollYProgress,
    [0, TRANSITION[0], TRANSITION[1]],
    ['20vh', '20vh', '0vh'],
  )
  const videoOpacity = useTransform(scrollYProgress, [TRANSITION[0], TRANSITION[1]], [0, 1])
  const startHintOpacity = useTransform(scrollYProgress, [0, 0.025], [1, 0])

  return (
    <section ref={containerRef} id="top" className="relative h-[820vh] bg-black">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-black">
        {showAtmosphere && (
          <ThemeParkAtmosphere scrollYProgress={scrollYProgress} activeUntil={TRANSITION[1]} />
        )}

        <motion.video
          ref={videoRef}
          style={{ opacity: videoOpacity }}
          className="absolute inset-0 z-[1] h-full w-full object-cover"
          src={src}
          poster={POSTER}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
        />
        {!ready && (
          <div className="absolute inset-0 z-[1] flex items-center justify-center">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          </div>
        )}

        {/* Cinema vignette + film grain, sit above the video, below the type */}
        <div className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(120%_100%_at_50%_50%,transparent_38%,rgba(0,0,0,0.75)_100%)]" />
        <div className="film-grain pointer-events-none absolute inset-0 z-[2] opacity-[0.05] mix-blend-overlay" />

        {/* Countdown leader — old-cinema style: ring, tick marks, sweeping hand */}
        <CountdownBeat value="3" range={N3} scrollYProgress={scrollYProgress} />
        <CountdownBeat value="2" range={N2} scrollYProgress={scrollYProgress} />
        <CountdownBeat value="1" range={N1} scrollYProgress={scrollYProgress} />

        {/* Flash burst on the hit */}
        <motion.div
          style={{ opacity: flashOpacity }}
          className="pointer-events-none absolute inset-0 z-10 bg-white"
        />

        {/* Title card */}
        <motion.div
          style={{ opacity: titleOpacity, scale: titleScale }}
          className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
        >
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.4em] text-white/50">
            Stay Tuned
          </p>
          <h1 className="glitch-title text-6xl font-bold tracking-tight text-white sm:text-8xl">
            COMING SOON
          </h1>
          <p className="mt-4 max-w-sm text-sm text-white/50 sm:text-base">
            The next attraction is almost here.
          </p>
        </motion.div>

        {/* Letterbox bars — thick during the teaser, open into the reveal */}
        <motion.div
          style={{ height: letterboxHeight }}
          className="pointer-events-none absolute inset-x-0 top-0 z-20 bg-black"
        />
        <motion.div
          style={{ height: letterboxHeight }}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-black"
        />

        <motion.div
          style={{ opacity: startHintOpacity }}
          className="pointer-events-none absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1 text-white/50"
        >
          <span className="text-[11px] font-medium uppercase tracking-widest">Scroll to begin</span>
        </motion.div>
      </div>
    </section>
  )
}

/* A single countdown beat: fades in, sweeps a hand around a ring like an
   old film leader clock, fades out — timed to its own slice of scroll. */
function CountdownBeat({ value, range, scrollYProgress }) {
  const [start, end] = range
  const span = end - start
  const opacity = useTransform(
    scrollYProgress,
    [start, start + span * 0.18, end - span * 0.18, end],
    [0, 1, 1, 0],
  )
  const rotate = useTransform(scrollYProgress, [start, end], [0, 300])

  return (
    <motion.div
      style={{ opacity }}
      className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
    >
      <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-2 border-white/25 sm:h-40 sm:w-40">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <span
            key={deg}
            className="absolute h-2.5 w-px bg-white/35"
            style={{
              transform: `rotate(${deg}deg) translateY(-58px)`,
              transformOrigin: 'center',
            }}
          />
        ))}
        <motion.span
          style={{ rotate }}
          className="absolute bottom-1/2 left-1/2 h-14 w-px origin-bottom bg-white/70 sm:h-[70px]"
        />
        <span className="text-5xl font-bold text-white sm:text-6xl">{value}</span>
      </div>
    </motion.div>
  )
}
