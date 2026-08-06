import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion'
import ThemeParkAtmosphere from '../components/ThemeParkAtmosphere.jsx'

// The single Theme Park clip is the whole page — fullscreen, edge to edge.
const VIDEO_SRC = `${import.meta.env.BASE_URL}video/themepark.mp4`

const POSTER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect width='1920' height='1080' fill='%23060807'/%3E%3C/svg%3E"

// A fixed timeline (ms from mount) — no scrolling required. Every beat fires
// on its own timer and the video starts playing for real once revealed.
const T = {
  n2: 900,
  n1: 1800,
  title: 2700,
  opening: 4900,
  video: 6000,
}

const NUMBERS = { n3: '3', n2: '2', n1: '1' }

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
  return reduced ? <FullAutoplay src={VIDEO_SRC} /> : <AutoplayReveal src={VIDEO_SRC} />
}

/* Reduced-motion: fullscreen autoplay loop, no teaser sequence at all. */
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
   the video plays for real. Entirely timer-driven — press in and it runs. */
function AutoplayReveal({ src }) {
  const videoRef = useRef(null)
  const [stage, setStage] = useState('n3')
  const progress = useMotionValue(0)

  useEffect(() => {
    const controls = animate(progress, 1, { duration: T.video / 1000, ease: 'easeInOut' })
    const timers = [
      setTimeout(() => setStage('n2'), T.n2),
      setTimeout(() => setStage('n1'), T.n1),
      setTimeout(() => setStage('title'), T.title),
      setTimeout(() => setStage('opening'), T.opening),
      setTimeout(() => setStage('video'), T.video),
    ]
    return () => {
      controls.stop()
      timers.forEach(clearTimeout)
    }
  }, [progress])

  // Prime the clip so the first real frame is decoded before we need it.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const prime = video.play().then(() => video.pause()).catch(() => {})
    return () => void prime
  }, [])

  // Start it playing for real right as the letterbox begins to open.
  useEffect(() => {
    if (stage === 'opening' || stage === 'video') {
      videoRef.current?.play().catch(() => {})
    }
  }, [stage])

  const revealed = stage === 'opening' || stage === 'video'
  const showAtmosphere = stage !== 'video'

  return (
    <section id="top" className="relative h-[100svh] w-full overflow-hidden bg-black">
      {showAtmosphere && <ThemeParkAtmosphere progress={progress} />}

      <motion.video
        ref={videoRef}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ duration: 1.1, ease: 'easeInOut' }}
        className="absolute inset-0 z-[1] h-full w-full object-cover"
        src={src}
        poster={POSTER}
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
      />

      {/* Cinema vignette + film grain, above the video, below the type */}
      <div className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(120%_100%_at_50%_50%,transparent_38%,rgba(0,0,0,0.75)_100%)]" />
      <div className="film-grain pointer-events-none absolute inset-0 z-[2] opacity-[0.05] mix-blend-overlay" />

      {/* Countdown leader */}
      <AnimatePresence mode="wait">
        {stage in NUMBERS && <CountdownBeat key={stage} value={NUMBERS[stage]} />}
      </AnimatePresence>

      {/* Flash burst + title card, fire once when the title stage begins */}
      {stage === 'title' && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.5, times: [0, 0.16, 1] }}
            className="pointer-events-none absolute inset-0 z-10 bg-white"
          />
          <motion.div
            initial={{ opacity: 0, scale: 1.4 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
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
        </>
      )}

      {/* Letterbox bars — thick during the teaser, open into the reveal */}
      <motion.div
        animate={{ height: revealed ? '0vh' : '20vh' }}
        transition={{ duration: 1.1, ease: 'easeInOut' }}
        className="pointer-events-none absolute inset-x-0 top-0 z-20 bg-black"
      />
      <motion.div
        animate={{ height: revealed ? '0vh' : '20vh' }}
        transition={{ duration: 1.1, ease: 'easeInOut' }}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-black"
      />
    </section>
  )
}

/* A single countdown beat: rings in, sweeps a hand once around like an old
   film leader clock, rings out — purely time-driven. */
function CountdownBeat({ value }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
    >
      <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-2 border-white/25 sm:h-40 sm:w-40">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <span
            key={deg}
            className="absolute h-2.5 w-px bg-white/35"
            style={{ transform: `rotate(${deg}deg) translateY(-58px)`, transformOrigin: 'center' }}
          />
        ))}
        <motion.span
          initial={{ rotate: 0 }}
          animate={{ rotate: 300 }}
          transition={{ duration: 0.9, ease: 'linear' }}
          className="absolute bottom-1/2 left-1/2 h-14 w-px origin-bottom bg-white/70 sm:h-[70px]"
        />
        <span className="text-5xl font-bold text-white sm:text-6xl">{value}</span>
      </div>
    </motion.div>
  )
}
